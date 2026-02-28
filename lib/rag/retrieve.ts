import { prisma } from '@/lib/db'
import { createEmbedding } from '@/lib/ai/openai'
import { cosineSimilarity } from './vector'
import { DocumentChunk, Document } from '@/types'

export interface RetrievalResult {
  chunks: DocumentChunk[]
  documents: Document[]
  query: string
}

export async function retrieveRelevantChunks(
  query: string,
  limit = 5,
  threshold = 0.7
): Promise<RetrievalResult> {
  try {
    // Create embedding for the query
    const queryEmbedding = await createEmbedding(query)

    // Get all document chunks with embeddings
    const allChunks = await prisma.documentChunk.findMany({
      where: {
        embedding: {
          not: null,
        },
      },
      include: {
        document: true,
      },
    })

    // Calculate similarities
    const chunksWithSimilarity = allChunks
      .map(chunk => {
        if (!chunk.embedding) return null
        
        try {
          const chunkEmbedding = JSON.parse(chunk.embedding)
          const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding)
          
          return {
            ...chunk,
            similarity,
          }
        } catch (error) {
          console.error('Error parsing embedding:', error)
          return null
        }
      })
      .filter((chunk): chunk is NonNullable<typeof chunk> => chunk !== null)
      .filter(chunk => chunk.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    // Extract relevant chunks and documents
    const relevantChunks = chunksWithSimilarity.map(({ similarity, ...chunk }) => ({
      id: chunk.id,
      documentId: chunk.documentId,
      content: chunk.content,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      embedding: chunk.embedding,
    }))

    const uniqueDocumentIds = [...new Set(relevantChunks.map(chunk => chunk.documentId))]
    const relevantDocuments = await prisma.document.findMany({
      where: {
        id: {
          in: uniqueDocumentIds,
        },
      },
      select: {
        id: true,
        title: true,
        filename: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        filepath: true,
        uploadedById: true,
      },
    })

    return {
      chunks: relevantChunks,
      documents: relevantDocuments,
      query,
    }
  } catch (error) {
    console.error('Retrieval error:', error)
    return {
      chunks: [],
      documents: [],
      query,
    }
  }
}

export function formatContextForLLM(retrieval: RetrievalResult): string {
  if (retrieval.chunks.length === 0) {
    return "Aucun document pertinent trouvé."
  }

  const contextParts = retrieval.chunks.map((chunk, index) => {
    const document = retrieval.documents.find(doc => doc.id === chunk.documentId)
    const docTitle = document?.title || 'Document inconnu'
    const pageInfo = chunk.pageNumber ? ` (Page ${chunk.pageNumber})` : ''
    
    return `[${index + 1}] Source: ${docTitle}${pageInfo}\nContenu: ${chunk.content}\n`
  })

  return contextParts.join('\n---\n\n')
}

export const SYSTEM_PROMPT = `Vous êtes un assistant administratif universitaire intelligent.

INSTRUCTIONS IMPORTANTES:
1. Répondez UNIQUEMENT en vous basant sur le contexte fourni
2. Si l'information n'est pas dans le contexte, répondez: "Je ne trouve pas cette information dans les documents officiels."
3. Citez toujours la source du document dans votre réponse
4. Soyez concis et professionnel
5. Répondez en français
6. Si plusieurs sources contradictoires, mentionnez-le clairement

Format de réponse souhaité:
- Réponse directe à la question
- Citation de la source entre parenthèses

Exemple:
"Pour obtenir une attestation de scolarité, vous devez vous rendre au bureau des affaires académiques avec votre carte d'étudiant (Source: Guide de l'étudiant, Page 15)."
`

export function buildPrompt(query: string, context: string): string {
  return `${SYSTEM_PROMPT}

CONTEXTE:
${context}

QUESTION:
${query}

RÉPONSE:`
}