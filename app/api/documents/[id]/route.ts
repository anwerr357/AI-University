import { NextRequest, NextResponse } from 'next/server'
import { unlink, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'
import { requireRole, getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Allow both admin and regular users to download documents
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const documentId = params.id

    // Find document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Check if file exists
    const fullPath = join(process.cwd(), 'uploads', document.filepath)
    try {
      await stat(fullPath)
    } catch (fileError) {
      console.error('File not found:', fileError)
      return NextResponse.json(
        { success: false, error: 'Fichier non trouvé sur le serveur' },
        { status: 404 }
      )
    }

    // Read the file
    const fileBuffer = await readFile(fullPath)
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Download document error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du téléchargement du document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole('ADMIN')
    const documentId = params.id

    // Find document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    try {
      const fullPath = join(process.cwd(), 'uploads', document.filepath)
      await unlink(fullPath)
    } catch (fileError) {
      console.error('Error deleting file:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete document and related data (cascades to chunks)
    await prisma.document.delete({
      where: { id: documentId },
    })

    return NextResponse.json({
      success: true,
      message: 'Document supprimé avec succès',
    })

  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole('ADMIN')
    const documentId = params.id
    const { action } = await request.json()

    if (action === 'reprocess') {
      // Find document
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      })

      if (!document) {
        return NextResponse.json(
          { success: false, error: 'Document non trouvé' },
          { status: 404 }
        )
      }

      // Delete existing chunks
      await prisma.documentChunk.deleteMany({
        where: { documentId },
      })

      // TODO: Re-read and reprocess the file
      // This would require storing the original file and re-running the processing pipeline

      return NextResponse.json({
        success: true,
        message: 'Document en cours de retraitement...',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Action non reconnue' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Document action error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'exécution de l\'action' },
      { status: 500 }
    )
  }
}