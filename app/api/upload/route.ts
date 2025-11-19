import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import pdf from 'pdf-parse';
import { chunkText, addDocumentChunks, checkVectorSearchAvailable } from '@/lib/vectordb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedDocuments = [];

    for (const file of files) {
      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);

      // Extract PDF info
      let pageCount = 0;
      let vectorDBEnabled = false;

      try {
        const data = await pdf(buffer);
        pageCount = data.numpages;

        // Store text content for later retrieval
        const textFilepath = filepath.replace('.pdf', '.txt');
        await writeFile(textFilepath, data.text);

        // Add to vector store if available
        try {
          const vectorAvailable = await checkVectorSearchAvailable();

          if (vectorAvailable && data.text && data.text.trim().length > 0) {
            // Chunk the text (500 tokens with 50-token overlap)
            const chunks = chunkText(data.text, 500, 50);

            // Create embeddings and store in vector store
            await addDocumentChunks(file.name, chunks);
            vectorDBEnabled = true;
            console.log(`✓ Created vector embeddings for ${file.name} (${chunks.length} chunks)`);
          } else {
            console.log('⚠ Vector search not available - falling back to text-only retrieval');
          }
        } catch (vectorError) {
          console.error('Vector search error (continuing without it):', vectorError);
          // Don't fail the upload if vector search fails
        }
      } catch (error) {
        console.error('PDF parsing error:', error);
      }

      uploadedDocuments.push({
        name: file.name,
        size: file.size,
        pages: pageCount,
        uploadedAt: new Date().toISOString(),
        storedAs: filename
      });
    }

    return NextResponse.json({
      success: true,
      documents: uploadedDocuments
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
