import OpenAI from 'openai';

// Simple in-memory vector store
interface VectorChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    documentName: string;
    chunkIndex: number;
    [key: string]: any;
  };
}

// In-memory storage
const vectorStore: VectorChunk[] = [];

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }
  return new OpenAI({ apiKey });
}

// Create embeddings using OpenAI
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Fast, cheap, 1536 dimensions
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding creation error:', error);
    throw error;
  }
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Add document chunks to vector store
export async function addDocumentChunks(
  documentName: string,
  chunks: string[],
  metadatas?: Record<string, any>[]
) {
  try {
    console.log(`Creating embeddings for ${chunks.length} chunks...`);

    // Create embeddings for all chunks in parallel (with rate limiting)
    const embeddings = await Promise.all(
      chunks.map(chunk => createEmbedding(chunk))
    );

    // Add to vector store
    chunks.forEach((chunk, idx) => {
      const id = `${documentName}_chunk_${idx}_${Date.now()}`;

      vectorStore.push({
        id,
        text: chunk,
        embedding: embeddings[idx],
        metadata: {
          documentName,
          chunkIndex: idx,
          ...(metadatas?.[idx] || {})
        }
      });
    });

    console.log(`✓ Added ${chunks.length} chunks for ${documentName} to vector store`);
    return chunks.map((_, idx) => `${documentName}_chunk_${idx}_${Date.now()}`);
  } catch (error) {
    console.error('Error adding document chunks:', error);
    throw error;
  }
}

// Query vector store for similar chunks
export async function queryDocuments(
  query: string,
  nResults: number = 5,
  documentFilter?: string[]
) {
  try {
    console.log(`[VectorDB] Total chunks in store: ${vectorStore.length}`);
    console.log(`[VectorDB] Document filter:`, documentFilter);

    // Create embedding for query
    const queryEmbedding = await createEmbedding(query);

    // Filter chunks if documents specified
    let filteredChunks = vectorStore;
    if (documentFilter && documentFilter.length > 0) {
      filteredChunks = vectorStore.filter(chunk =>
        documentFilter.includes(chunk.metadata.documentName)
      );
      console.log(`[VectorDB] After filtering: ${filteredChunks.length} chunks`);
      console.log(`[VectorDB] Available documents in store:`,
        Array.from(new Set(vectorStore.map(c => c.metadata.documentName))));
    }

    if (filteredChunks.length === 0) {
      console.log(`[VectorDB] ⚠️ No chunks found after filtering!`);
      return [];
    }

    // Calculate similarity scores
    const results = filteredChunks.map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // Sort by similarity (highest first) and take top N
    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, nResults);

    return topResults.map(result => ({
      text: result.text,
      metadata: result.metadata,
      distance: 1 - result.similarity, // Convert similarity to distance
      id: result.id
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}

// Delete all chunks for a document
export async function deleteDocumentChunks(documentName: string) {
  const originalLength = vectorStore.length;
  const indexesToRemove: number[] = [];

  vectorStore.forEach((chunk, index) => {
    if (chunk.metadata.documentName === documentName) {
      indexesToRemove.push(index);
    }
  });

  // Remove in reverse order to maintain indices
  indexesToRemove.reverse().forEach(index => {
    vectorStore.splice(index, 1);
  });

  console.log(`Deleted ${indexesToRemove.length} chunks for ${documentName} from vector store`);
}

// Chunk text into smaller pieces for embedding
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += chunkSize - overlap; // Move forward with overlap
  }

  return chunks.filter(chunk => chunk.trim().length > 0);
}

// Check if vector search is available
export async function checkVectorSearchAvailable(): Promise<boolean> {
  try {
    const hasKey = !!process.env.OPENAI_API_KEY;

    if (!hasKey) {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  VECTOR SEARCH DISABLED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('Missing: OPENAI_API_KEY environment variable');
      console.log('');
      console.log('To enable vector search:');
      console.log('  1. Get API key: https://platform.openai.com/api-keys');
      console.log('  2. Add to .env: OPENAI_API_KEY=sk-...');
      console.log('  3. Restart server: npm run dev');
      console.log('');
      console.log('Cost: ~$1/month for typical use');
      console.log('');
      console.log('Using fallback: Full-text retrieval (existing functionality)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    } else {
      console.log('✓ Vector search available (OpenAI embeddings)');
    }

    return hasKey;
  } catch (error) {
    console.error('Error checking vector search availability:', error);
    return false;
  }
}

// Get vector store stats
export function getVectorStoreStats() {
  const documentCounts: Record<string, number> = {};

  vectorStore.forEach(chunk => {
    const docName = chunk.metadata.documentName;
    documentCounts[docName] = (documentCounts[docName] || 0) + 1;
  });

  return {
    totalChunks: vectorStore.length,
    documentCount: Object.keys(documentCounts).length,
    documents: documentCounts
  };
}
