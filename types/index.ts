import { Role, MessageRole, DocumentCategory } from '@prisma/client'

export type UserRole = Role
export type ChatMessageRole = MessageRole
export type DocCategory = DocumentCategory

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  title: string
  filename: string
  filepath: string
  category: DocCategory
  uploadedById: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  userId: string
  role: ChatMessageRole
  content: string
  createdAt: Date
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  pageNumber?: number
  chunkIndex: number
  embedding?: string
}

export interface RAGContext {
  chunks: DocumentChunk[]
  relevantDocs: Document[]
}

export interface ChatResponse {
  content: string
  sources: Document[]
}

export interface EmailTemplate {
  type: 'ATTESTATION' | 'STAGE' | 'BOURSE' | 'RECLAMATION' | 'ABSENCE'
  subject: string
  body: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}