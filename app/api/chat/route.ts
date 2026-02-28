import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { retrieveRelevantChunks, buildPrompt, formatContextForLLM } from '@/lib/rag/retrieve'
import { streamResponse } from '@/lib/ai/openai'

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { message } = chatSchema.parse(body)

    // Save user message
    await prisma.message.create({
      data: {
        userId: user.id,
        role: 'USER',
        content: message,
      },
    })

    // Retrieve relevant context using RAG
    const retrieval = await retrieveRelevantChunks(message, 5, 0.7)
    const context = formatContextForLLM(retrieval)
    const prompt = buildPrompt(message, context)

    // Create streaming response
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ''

          for await (const chunk of streamResponse(prompt)) {
            fullResponse += chunk
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
            controller.enqueue(encoder.encode(data))
          }

          // Save assistant response
          await prisma.message.create({
            data: {
              userId: user.id,
              role: 'ASSISTANT',
              content: fullResponse,
            },
          })

          // Send sources information
          const sourcesData = `data: ${JSON.stringify({
            type: 'sources',
            sources: retrieval.documents.map(doc => ({
              title: doc.title,
              category: doc.category,
            }))
          })}\n\n`
          controller.enqueue(encoder.encode(sourcesData))

          // Send end signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Chat stream error:', error)
          const errorData = `data: ${JSON.stringify({ 
            error: 'Erreur lors de la génération de la réponse' 
          })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message invalide',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const messages = await prisma.message.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 50, // Limit to last 50 messages
    })

    return NextResponse.json({
      success: true,
      data: messages,
    })

  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    )
  }
}