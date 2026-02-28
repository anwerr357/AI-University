import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { parsePDF, sanitizeText } from '@/lib/rag/pdf'
import { chunkText } from '@/lib/rag/chunk'
import { createEmbedding } from '@/lib/ai/openai'

export async function GET() {
  try {
    const user = await requireRole('ADMIN')
    
    const documents = await prisma.document.findMany({
      include: {
        uploadedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            chunks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('ADMIN')
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const category = formData.get('category') as string

    if (!file || !title) {
      return NextResponse.json(
        { success: false, error: 'Fichier et titre requis' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Seuls les fichiers PDF sont acceptés' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Le fichier ne peut pas dépasser 10MB' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Parse PDF
    const pdfResult = await parsePDF(buffer)
    const cleanText = sanitizeText(pdfResult.text)

    // Create document record
    const document = await prisma.document.create({
      data: {
        title,
        filename: file.name,
        filepath: filename, // Store relative path
        category: category as any,
        uploadedById: user.id,
      },
    })

    // Process document in background
    processDocumentAsync(document.id, cleanText, pdfResult.numPages)

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploadé avec succès. Traitement en cours...',
    })

  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload du document' },
      { status: 500 }
    )
  }
}

async function processDocumentAsync(documentId: string, text: string, numPages: number) {
  try {
    console.log(`Processing document ${documentId}...`)

    // Chunk the text
    const chunks = chunkText(text, {
      chunkSize: 800,
      chunkOverlap: 100,
    })

    console.log(`Created ${chunks.length} chunks for document ${documentId}`)

    // Process chunks with embeddings
    for (const chunk of chunks) {
      try {
        // Create embedding
        const embedding = await createEmbedding(chunk.content)

        // Store chunk with embedding
        await prisma.documentChunk.create({
          data: {
            documentId,
            content: chunk.content,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            embedding: JSON.stringify(embedding),
          },
        })

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (chunkError) {
        console.error(`Error processing chunk ${chunk.chunkIndex}:`, chunkError)
      }
    }

    console.log(`Document ${documentId} processing completed`)
  } catch (error) {
    console.error('Document processing error:', error)
  }
}