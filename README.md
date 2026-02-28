# 🎓 UniAdmin AI - Intelligent University Administrative Assistant

A production-ready Next.js full-stack application that provides AI-powered administrative assistance for university services using RAG (Retrieval-Augmented Generation) technology.

## 📋 Overview

UniAdmin AI helps universities streamline their administrative processes by:
- **Answering student questions** automatically using official documents
- **Generating professional emails** for administrative requests
- **Managing document knowledge base** with AI-powered search
- **Role-based access control** for students and administrators

## 🏗️ Architecture

### Tech Stack
- **Frontend + Backend:** Next.js 14+ (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **AI:** OpenAI GPT-4 + Embeddings
- **Vector Storage:** Supabase Vector (or local fallback)
- **File Processing:** PDF parsing and chunking
- **Styling:** TailwindCSS
- **Deployment:** Docker + Docker Compose

### Key Features
- 🔐 **JWT Authentication** with role-based access (Admin/Student)
- 📄 **Document Management** - Upload, parse, and index PDF documents
- 🤖 **RAG Pipeline** - Semantic search with AI-generated responses
- ✉️ **Email Generator** - Automated professional email templates
- 📱 **Responsive Design** - Mobile-friendly interface
- 🐳 **Dockerized** - Easy deployment and scaling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- OpenAI API key
- (Optional) Supabase account for vector storage

### 1. Clone and Setup
```bash
git clone <repository-url>
cd uniadmin-ai
cp .env.example .env
```

### 2. Environment Configuration
Edit `.env` file:
```bash
# Required
DATABASE_URL="postgresql://postgres:password123@localhost:5432/uniadmin_ai"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="sk-your-openai-api-key"

# Optional (for enhanced vector search)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 3. Development Setup
```bash
# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### 4. Production with Docker
```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── documents/     # Document management
│   │   ├── chat/          # AI chat API
│   │   └── emails/        # Email generation
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── chat/              # Chat interface
│   └── email-generator/   # Email generator
├── lib/                   # Shared utilities
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── ai/               # AI integrations
│   └── rag/              # RAG pipeline
├── components/            # React components
├── prisma/               # Database schema
├── types/                # TypeScript types
├── docker-compose.yml    # Docker configuration
└── Dockerfile           # Container definition
```

## 🔐 Authentication System

### User Roles
- **STUDENT**: Access chat and email generator
- **ADMIN**: Full system access + document management

### Security Features
- JWT tokens in HTTP-only cookies
- Role-based middleware protection
- Input validation with Zod
- CORS configuration
- File upload restrictions

### API Authentication
```typescript
// Protected route example
import { requireAuth, requireRole } from '@/lib/auth'

export async function GET() {
  const user = await requireRole('ADMIN')
  // Route logic
}
```

## 📄 Document Management

### Supported Features
- **PDF Upload**: Automatic parsing and text extraction
- **Semantic Chunking**: 500-800 token chunks with overlap
- **Vector Embeddings**: OpenAI text-embedding-ada-002
- **Categorization**: Predefined administrative categories
- **Search**: Similarity-based document retrieval

### Upload Process
1. Admin uploads PDF via web interface
2. System parses PDF content
3. Text is chunked for optimal processing
4. Embeddings generated for each chunk
5. Stored in vector database for search

## 🤖 RAG Pipeline

### How It Works
1. **User Question**: Student asks administrative question
2. **Embedding**: Question converted to vector embedding
3. **Retrieval**: Find top 5 similar document chunks
4. **Context Building**: Relevant chunks formatted for LLM
5. **Generation**: AI generates response using context only
6. **Response**: Answer with source citations returned

### System Prompts
```typescript
const SYSTEM_PROMPT = `
Vous êtes un assistant administratif universitaire.
Répondez UNIQUEMENT avec le contexte fourni.
Si information manquante: "Je ne trouve pas cette information dans les documents officiels."
Citez toujours la source.
`;
```

## ✉️ Email Generator

### Template Types
- **Attestation**: Academic certificates
- **Stage**: Internship requests
- **Bourse**: Scholarship applications
- **Réclamation**: Formal complaints
- **Absence**: Absence justifications

### Features
- Professional French templates
- Dynamic content generation
- Copy-to-clipboard functionality
- Customizable before sending

## 🛠️ API Routes

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me         # Get current user
```

### Documents (Admin only)
```
GET    /api/documents          # List all documents
POST   /api/documents          # Upload new document
DELETE /api/documents/[id]     # Delete document
POST   /api/documents/[id]     # Reprocess document
```

### Chat
```
POST /api/chat                 # Send message, get AI response
GET  /api/chat/history         # Get chat history
```

### Email Generation
```
POST /api/emails/generate      # Generate email template
```

## 🐳 Deployment

### Development
```bash
npm run dev
```

### Production (Docker)
```bash
# Build and start
docker-compose up -d

# Scale if needed
docker-compose up --scale app=3 -d

# Update
docker-compose build --no-cache
docker-compose up -d
```

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=production-secret-key
OPENAI_API_KEY=sk-prod-key
SUPABASE_URL=https://prod.supabase.co
SUPABASE_SERVICE_ROLE_KEY=prod-service-key
```

## 📊 Database Schema

### Key Models
- **User**: Authentication and role management
- **Document**: PDF document metadata
- **DocumentChunk**: Text chunks with embeddings
- **Message**: Chat conversation history

### Migrations
```bash
# Generate migration
npm run db:migrate

# Apply to production
npx prisma migrate deploy
```

## 🔧 Customization

### Adding New Document Categories
Edit `prisma/schema.prisma`:
```prisma
enum DocumentCategory {
  INSCRIPTION
  ATTESTATION
  // Add new category here
  NEW_CATEGORY
}
```

### Modifying AI Behavior
Edit system prompts in `/lib/rag/retrieve.ts`:
```typescript
export const SYSTEM_PROMPT = `
Your custom instructions here...
`;
```

### Email Templates
Add templates in `/lib/emails/templates.ts`:
```typescript
export const EMAIL_TEMPLATES = {
  NEW_TYPE: {
    subject: "Nouveau type de demande",
    body: "Template content..."
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

**OpenAI API Errors**
- Verify API key in `.env`
- Check API usage limits
- Ensure billing is set up

**File Upload Issues**
- Check `uploads/` directory permissions
- Verify file size limits
- Ensure PDF MIME type

**Vector Search Not Working**
- Check Supabase configuration
- Verify embeddings are being generated
- Test with local similarity fallback

## 📈 Performance Optimization

### Recommendations
- **Database**: Use connection pooling
- **Caching**: Implement Redis for frequent queries
- **CDN**: Serve static assets via CDN
- **Vector DB**: Use dedicated vector database for scale
- **Rate Limiting**: Implement API rate limiting

### Scaling
```bash
# Scale app instances
docker-compose up --scale app=3

# Use load balancer (nginx/traefik)
# Configure database read replicas
# Implement caching layer
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: Check this README
- **Issues**: Open GitHub issues
- **Community**: Join discussions

## 🎯 Roadmap

- [ ] Chat interface with streaming responses
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (AR/EN)
- [ ] Mobile app (React Native)
- [ ] Advanced document search filters
- [ ] Webhook integrations
- [ ] SSO authentication
- [ ] Advanced email templates
- [ ] Document version control
- [ ] Audit logging

---

**Made with ❤️ for university administrative efficiency**# AI-University
