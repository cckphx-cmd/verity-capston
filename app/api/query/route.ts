import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { queryDocuments, checkVectorSearchAvailable } from '@/lib/vectordb';

export async function POST(request: NextRequest) {
  try {
    const { query, documents } = await request.json();

    if (!query || !documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'Query and documents are required' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Try vector search first, fall back to full text if unavailable
    let documentContents = '';
    let retrievalMethod = 'full-text';

    try {
      const vectorAvailable = await checkVectorSearchAvailable();

      if (vectorAvailable) {
        console.log(`Querying vector store for: "${query}"`);
        console.log(`Document filter: ${documents.join(', ')}`);

        // Use vector similarity search to retrieve relevant chunks
        const vectorResults = await queryDocuments(query, 10, documents);

        console.log(`Vector store returned ${vectorResults ? vectorResults.length : 0} results`);

        if (vectorResults && vectorResults.length > 0) {
          retrievalMethod = 'vector-search';
          console.log(`✓ Vector search found ${vectorResults.length} relevant chunks`);

          // Format vector search results
          documentContents = vectorResults
            .map((result, idx) => {
              const docName = result.metadata.documentName || 'Unknown';
              return `--- Relevant Chunk ${idx + 1} from ${docName} ---\n${result.text}`;
            })
            .join('\n\n');
        } else {
          console.log('⚠️ Vector search returned 0 results - falling back to full-text');
        }
      }
    } catch (vectorError) {
      console.log('❌ Vector search ERROR:', vectorError);
      console.error('Full error:', vectorError);
    }

    // Fallback to full-text retrieval if vector search didn't work
    if (!documentContents) {
      console.log('⚠ Using full-text retrieval (vector search unavailable)');
      const uploadsDir = join(process.cwd(), 'uploads');

      for (const docName of documents) {
        // Find the stored file
        const files = await readdir(uploadsDir);
        const textFile = files.find(f => f.includes(docName.replace('.pdf', '')) && f.endsWith('.txt'));

        if (textFile) {
          const filepath = join(uploadsDir, textFile);
          if (existsSync(filepath)) {
            const content = await readFile(filepath, 'utf-8');
            documentContents += `\n\n--- Document: ${docName} ---\n${content}`;
          }
        }
      }

      if (!documentContents) {
        return NextResponse.json(
          { error: 'Could not read document contents' },
          { status: 500 }
        );
      }
    }

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a business intelligence assistant analyzing company documents.

IMPORTANT CITATION REQUIREMENTS:
- For every factual claim or piece of information, you MUST cite the source document
- Format citations as markdown links using this EXACT format:
  [[Source: {document_name}, Page {page_number}]](/view/{document_name}#page={page_number})
- Example: "Revenue increased 15% year-over-year [[Source: Q3_Financial_Report.pdf, Page 5]](/view/Q3_Financial_Report.pdf#page=5)."
- If you don't know the exact page, estimate based on the content position in the document
- Multiple citations are expected in each response
- IMPORTANT: Use the exact document name from the chunks, preserving all characters including spaces, underscores, and file extensions
- Format your response using markdown: **bold** for emphasis, bullet lists, etc.

Here are the documents to analyze:
${documentContents}

User question: ${query}

Please provide a clear, well-structured answer based on the documents above using markdown formatting. If the answer isn't in the documents, say so. Remember to cite sources as markdown links using the format specified above.`
        }
      ],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Unable to process response';

    return NextResponse.json({
      success: true,
      response: responseText
    });

  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: 'Query processing failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Import readdir at the top
import { readdir } from 'fs/promises';
