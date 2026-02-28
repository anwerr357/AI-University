import { createClient } from '@supabase/supabase-js'
import { createEmbedding } from '@/lib/ai/openai'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export interface VectorSearchResult {
  id: string
  content: string
  pageNumber?: number
  documentId: string
  similarity: number
}

export async function storeEmbedding(
  documentId: string,
  chunkId: string,
  content: string,
  pageNumber?: number
): Promise<void> {
  try {
    const embedding = await createEmbedding(content)
    
    const { error } = await supabase
      .from('document_embeddings')
      .insert({
        document_id: documentId,
        chunk_id: chunkId,
        content,
        page_number: pageNumber,
        embedding: JSON.stringify(embedding),
      })

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
  } catch (error) {
    console.error('Store embedding error:', error)
    throw error
  }
}

export async function searchSimilarChunks(
  query: string,
  limit = 5,
  threshold = 0.7
): Promise<VectorSearchResult[]> {
  try {
    const queryEmbedding = await createEmbedding(query)
    
    // Using Supabase's vector similarity search
    const { data, error } = await supabase.rpc('search_documents', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: threshold,
      match_count: limit,
    })

    if (error) {
      throw new Error(`Supabase search error: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Vector search error:', error)
    // Fallback to local search if vector search fails
    return []
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}