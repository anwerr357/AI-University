import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireRole('ADMIN')

    // Get user statistics
    const totalUsers = await prisma.user.count()
    const adminUsers = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    const studentUsers = await prisma.user.count({
      where: { role: 'STUDENT' }
    })

    // Get document statistics
    const totalDocuments = await prisma.document.count()
    const totalChunks = await prisma.documentChunk.count()
    const documentsWithEmbeddings = await prisma.documentChunk.count({
      where: { embedding: { not: null } }
    })

    // Get documents by category
    const documentsByCategory = await prisma.document.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    // Get chat statistics
    const totalMessages = await prisma.message.count()
    const userMessages = await prisma.message.count({
      where: { role: 'USER' }
    })
    const assistantMessages = await prisma.message.count({
      where: { role: 'ASSISTANT' }
    })

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const recentDocuments = await prisma.document.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const recentMessages = await prisma.message.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get most active users (by message count)
    const activeUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        messages: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Get recent documents
    const recentDocumentList = await prisma.document.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        uploadedBy: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Calculate daily message trends for the last 7 days
    const messageTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))

      const messageCount = await prisma.message.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })

      messageTrends.push({
        date: startOfDay.toISOString().split('T')[0],
        messages: messageCount
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          adminUsers,
          studentUsers,
          totalDocuments,
          totalChunks,
          documentsWithEmbeddings,
          totalMessages,
          userMessages,
          assistantMessages
        },
        recent: {
          users: recentUsers,
          documents: recentDocuments,
          messages: recentMessages
        },
        charts: {
          documentsByCategory: documentsByCategory.map(item => ({
            category: item.category,
            count: item._count.category
          })),
          messageTrends
        },
        lists: {
          activeUsers: activeUsers.map(user => ({
            name: user.name,
            email: user.email,
            messageCount: user._count.messages
          })),
          recentDocuments: recentDocumentList.map(doc => ({
            title: doc.title,
            category: doc.category,
            createdAt: doc.createdAt,
            uploadedBy: doc.uploadedBy.name
          }))
        }
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}