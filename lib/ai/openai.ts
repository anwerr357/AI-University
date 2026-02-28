import OpenAI from 'openai'
import { createMockEmbedding } from './mock'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return response.data[0].embedding
  } catch (error: any) {
    console.error('OpenAI embedding error:', error)
    
    // If it's a quota/billing error, use mock embedding
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.log('Using mock embedding due to OpenAI quota limit')
      return createMockEmbedding()
    }
    
    throw new Error('Failed to create embedding')
  }
}

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error: any) {
    console.error('OpenAI chat error:', error)
    
    // If it's a quota/billing error, use mock response
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.log('Using mock response due to OpenAI quota limit')
      return "Je ne trouve pas cette information dans les documents officiels actuellement disponibles. Veuillez contacter l'administration pour plus de détails."
    }
    
    throw new Error('Failed to generate response')
  }
}

export async function* streamResponse(prompt: string) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        yield content
      }
    }
  } catch (error: any) {
    console.error('OpenAI stream error:', error)
    
    // If it's a quota/billing error, use mock streaming
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.log('Using mock streaming due to OpenAI quota limit')
      const { streamMockResponse, getMockResponse } = await import('./mock')
      
      // Extract question from prompt to get relevant mock response
      const question = prompt.split('QUESTION:')[1]?.split('RÉPONSE:')[0]?.trim() || prompt
      const mockResponse = getMockResponse(question)
      
      yield* streamMockResponse(mockResponse)
      return
    }
    
    throw new Error('Failed to stream response')
  }
}