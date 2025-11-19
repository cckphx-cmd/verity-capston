# Vector Search Setup Guide

This guide explains how to enable vector search functionality using OpenAI embeddings.

## Why Vector Search?

Vector search improves document retrieval by:
- **Semantic matching** - Finds related concepts, not just keyword matches
- **Better recall** - Retrieves relevant information even with different wording
- **Improved accuracy** - Claude receives only the most relevant chunks
- **Faster queries** - Fewer tokens sent to Claude = faster responses

## Quick Start (3 Steps)

### 1. Get OpenAI API Key

Visit https://platform.openai.com/api-keys and create a new API key.

### 2. Add to Environment

Add your API key to `.env`:

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Restart Server

```bash
npm run dev
```

That's it! Vector search is now enabled.

## How It Works

### Upload Process

When you upload a PDF:

1. **Text Extraction** - PDF text extracted using pdf-parse
2. **Chunking** - Text split into 500-token chunks with 50-token overlap
3. **Embedding Creation** - Each chunk converted to 1536-dimensional vector via OpenAI
4. **Storage** - Chunks and embeddings stored in memory
5. **Fallback** - If no OpenAI key, only text files saved (existing functionality)

### Query Process

When you ask a question:

1. **Question Embedding** - Your question is converted to a vector
2. **Similarity Search** - Find top 10 most similar chunks using cosine similarity
3. **Claude Processing** - Send only relevant chunks to Claude for answer generation
4. **Fallback** - If no OpenAI key, uses full document text (existing functionality)

## Cost

OpenAI embeddings are extremely cheap:

**text-embedding-3-small:**
- Cost: $0.00002 per 1K tokens (~$0.02 per 1M tokens)
- Speed: Very fast (~200ms per chunk)
- Dimensions: 1536 (high quality)

**Example costs:**
- 30-page document (~15K words): ~$0.0003 (less than a penny)
- 100 documents: ~$0.03
- 1000 queries: ~$0.002

Monthly cost for typical use: **under $1**

## Testing Vector Search

### 1. Upload a Document

```bash
# Start your server
npm run dev

# Go to http://localhost:3000/upload
# Upload a PDF
```

Watch console output:
```
Creating embeddings for 45 chunks...
✓ Added 45 chunks for document.pdf to vector store
```

### 2. Ask Questions

Go to http://localhost:3000/workspace and ask questions.

**Console output with vector search:**
```
✓ Vector search found 10 relevant chunks
```

**Console output without vector search:**
```
⚠ Vector search not available - falling back to text-only retrieval
```

### 3. Compare Results

**Without vector search:**
- Sends entire document to Claude
- May miss relevant parts in large docs
- Slower for large documents

**With vector search:**
- Sends only 10 most relevant chunks
- Better accuracy on complex queries
- Faster responses

## Configuration

All settings in `lib/vectordb.ts`:

### Embedding Model
```typescript
model: 'text-embedding-3-small'
```

Options:
- `text-embedding-3-small` - Fast, cheap, 1536 dims ✓ Recommended
- `text-embedding-3-large` - Higher quality, 3072 dims, 2x cost
- `text-embedding-ada-002` - Legacy, 1536 dims

### Chunk Size
```typescript
chunkText(data.text, 500, 50);
//                   ^^^  ^^
//                  size overlap
```

Recommendations:
- **Small chunks (300-400)**: Better precision
- **Large chunks (600-800)**: More context per chunk

### Number of Retrieved Chunks
```typescript
await queryDocuments(query, 10, documents);
//                          ^^
//                     number of chunks
```

Recommendations:
- **5-10**: Faster, focused (good for specific questions)
- **10-20**: More comprehensive (good for complex questions)

## Graceful Degradation

The system works **with or without** OpenAI API key:

**With OpenAI Key:**
- ✅ Vector similarity search
- ✅ Better recall on complex queries
- ✅ Semantic understanding
- ✅ Faster for large documents

**Without OpenAI Key:**
- ✅ Full-text retrieval (original behavior)
- ✅ All functionality still works
- ⚠ No semantic search improvements

## Advanced Features

### Vector Store Stats

Check what's in memory:

```typescript
import { getVectorStoreStats } from '@/lib/vectordb';

const stats = getVectorStoreStats();
console.log(stats);
// {
//   totalChunks: 450,
//   documentCount: 10,
//   documents: { 'doc1.pdf': 45, 'doc2.pdf': 50, ... }
// }
```

### Delete Document Chunks

```typescript
import { deleteDocumentChunks } from '@/lib/vectordb';

await deleteDocumentChunks('old-document.pdf');
```

### Custom Similarity Threshold

Edit `lib/vectordb.ts` to filter by similarity score:

```typescript
const topResults = results
  .filter(r => r.similarity > 0.7) // Only high-confidence matches
  .slice(0, nResults);
```

## Troubleshooting

### "OPENAI_API_KEY not found" error

**Solution:**
1. Create `.env` file in project root
2. Add: `OPENAI_API_KEY=sk-your-key-here`
3. Restart dev server: `npm run dev`

### Vector search not being used

Check console logs:
- ✅ Should see: `✓ Vector search found X chunks`
- ⚠ If you see: `⚠ Vector search not available...`
  - Verify API key is in `.env`
  - Restart server
  - Check for errors in console

### Embeddings taking long

First upload downloads the model metadata (~5s). Subsequent uploads are fast.

### Rate limits

OpenAI has rate limits:
- Free tier: 3 requests/min
- Tier 1: 500 requests/min
- Tier 2+: 5000 requests/min

If hitting limits, add delay between chunks in `addDocumentChunks()`.

## Production Deployment

### Vercel / Serverless

Works perfectly! No Docker needed. Just add `OPENAI_API_KEY` to environment variables.

**Note:** Vector store is in-memory, so it resets on each deployment. For persistence:
1. Use external vector DB (Pinecone, Weaviate, etc.)
2. Or rebuild embeddings on startup from stored documents

### Traditional Hosting

Works on any Node.js host. Just ensure:
- `OPENAI_API_KEY` in environment
- Sufficient memory for vector store

## Migration from ChromaDB

If you previously set up ChromaDB:

1. ✅ Remove docker-compose.yml (no longer needed)
2. ✅ Remove CHROMA_URL from .env
3. ✅ Add OPENAI_API_KEY to .env
4. ✅ Restart server

Everything else stays the same!

## Benefits Over ChromaDB

**OpenAI Embeddings Approach:**
- ✅ No Docker required
- ✅ No native dependencies
- ✅ No build issues
- ✅ Works on any platform (serverless included)
- ✅ Simple API call
- ✅ Extremely cheap (~$1/month)
- ✅ Production-ready

**ChromaDB Approach:**
- ⚠ Requires Docker
- ⚠ Native .node binaries
- ⚠ Complex webpack config
- ⚠ Deployment challenges
- ✅ Free (local embeddings)
- ⚠ More complex setup

## Next Steps

1. ✅ Add OpenAI API key to `.env`
2. ✅ Restart server
3. ✅ Upload a test document
4. ✅ Try queries and see improved results
5. ✅ Monitor console logs

Vector search is now ready to improve your RAG system's accuracy!

## Resources

- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Vector Search Explained](https://www.pinecone.io/learn/vector-search/)
