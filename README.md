# UniAdmin AI 🎓

**Assistant Administratif Intelligent pour l'Université**

UniAdmin AI est une application web full-stack moderne qui automatise et simplifie les processus administratifs universitaires grâce à l'intelligence artificielle. L'application utilise un pipeline RAG (Retrieval-Augmented Generation) pour fournir des réponses intelligentes basées sur les documents officiels de l'université.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)

## 🎬 Démonstration

Découvrez UniAdmin AI en action dans cette démonstration vidéo complète :

**[📹 Voir la Démo Complète](https://drive.google.com/file/d/12VfM8R-aCtND9XJ_xnr_crBF2KxhV7Q1/view?usp=sharing)**

La vidéo présente toutes les fonctionnalités principales :
- 🔐 Authentification et tableaux de bord
- 🤖 Assistant IA conversationnel avec RAG
- 📚 Gestion et téléchargement de documents
- ✉️ Génération automatique d'emails
- 📊 Dashboard administrateur avec statistiques
- 🎨 Interface moderne et responsive

## 📋 Table des Matières

- [Démonstration](#-démonstration)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🔐 **Authentification & Autorisation**
- Système d'authentification JWT avec cookies HTTP-only sécurisés
- Contrôle d'accès basé sur les rôles (Admin/Étudiant)
- Pages de connexion et d'inscription avec validation complète
- Protection des routes sensibles par middleware

### 🤖 **Assistant IA Conversationnel**
- Interface de chat en temps réel avec streaming des réponses
- Pipeline RAG pour des réponses contextuelles basées sur les documents
- Intégration avec l'API OpenAI (GPT-4 et text-embedding-ada-002)
- Système de fallback intelligent en cas de limite API
- Affichage des sources de documents utilisées

### 📚 **Gestion de Documents**
- Upload et traitement automatique des PDFs
- Indexation intelligente avec embeddings vectoriels
- Chunking et traitement avancé du texte
- Téléchargement sécurisé des documents
- Catégorisation automatique (Inscriptions, Bourses, Stages, etc.)
- Interface d'administration pour la gestion des documents

### ✉️ **Générateur d'Emails**
- Génération automatique d'emails professionnels par IA
- Templates personnalisables par catégorie administrative
- Prévisualisation et copie en un clic
- Interface utilisateur moderne et intuitive

### 📊 **Dashboard Administrateur**
- Statistiques d'utilisation en temps réel
- Métriques détaillées des documents et utilisateurs
- Graphiques et tendances d'activité sur 7 jours
- Gestion des utilisateurs les plus actifs
- Vue d'ensemble des documents récents

### 🎨 **Interface Moderne**
- Design responsive avec gradients et animations fluides
- Composants modernes avec backdrop blur et glass-morphism
- SVG icons professionnels (pas d'emojis)
- Optimisé pour mobile et desktop
- Thème cohérent avec palette de couleurs moderne

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   Next.js 14    │◄──►│   Next.js API   │◄──►│   PostgreSQL    │
│   React/TS      │    │   Routes        │    │   + Prisma ORM  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   AI Services   │              │
         └─────────────►│   OpenAI API    │◄─────────────┘
                        │   + Fallback    │
                        └─────────────────┘
```

### **Pipeline RAG (Retrieval-Augmented Generation)**

1. **📄 Ingestion** : Upload et parsing automatique des documents PDF
2. **✂️ Chunking** : Division intelligente du contenu en chunks contextuels
3. **🧠 Embeddings** : Génération de vecteurs sémantiques avec OpenAI
4. **🗄️ Stockage** : Sauvegarde dans PostgreSQL avec recherche vectorielle
5. **🔍 Recherche** : Similarité vectorielle pour récupération contextuelle
6. **💬 Génération** : Réponses intelligentes avec GPT-4 + contexte

## 🛠️ Technologies

### **Frontend**
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour la robustesse
- **TailwindCSS** - Framework CSS utilitaire moderne
- **React Server Components** - Rendu côté serveur optimisé

### **Backend**
- **Next.js API Routes** - Endpoints RESTful intégrés
- **Prisma ORM** - Base de données type-safe avec migrations
- **JWT** - Authentification sécurisée avec cookies HTTP-only
- **Middleware** - Autorisation et validation des requêtes

### **Base de Données**
- **PostgreSQL 15** - Base de données relationnelle performante
- **Prisma Schema** - Modélisation type-safe des données
- **Migrations automatiques** - Versioning du schéma
- **Indexation optimisée** - Performance des requêtes

### **Intelligence Artificielle**
- **OpenAI API** - GPT-4 pour génération et text-embedding-ada-002
- **Vector Search** - Recherche par similarité sémantique
- **PDF Processing** - Extraction et parsing intelligent
- **Fallback System** - Réponses intelligentes sans API externe

### **Infrastructure**
- **File System** - Stockage sécurisé des documents
- **Docker Ready** - Containerisation pour déploiement
- **Environment Variables** - Configuration sécurisée
- **Error Handling** - Gestion robuste des erreurs

## 🚀 Installation

### **Prérequis**

- Node.js 18.0+
- PostgreSQL 15+
- npm ou yarn ou pnpm
- Compte OpenAI (optionnel, fallback disponible)

### **1. Cloner le Projet**

```bash
git clone https://github.com/votre-username/assistant-ia-university-services.git
cd assistant-ia-university-services
```

### **2. Installer les Dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **3. Configuration de l'Environnement**

Créez un fichier `.env.local` à la racine du projet :

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/uniadmin_ai"

# Authentication Secrets
JWT_SECRET="votre_jwt_secret_tres_securise_minimum_32_caracteres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre_nextauth_secret_minimum_32_caracteres"

# OpenAI Configuration (optionnel - fallback disponible)
OPENAI_API_KEY="sk-votre_cle_openai_ici"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NODE_ENV="development"

# Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB en bytes
UPLOAD_DIR="uploads"
```

### **4. Configuration de la Base de Données**

```bash
# Générer les types Prisma
npx prisma generate

# Créer la base de données et appliquer le schema
npx prisma db push

# (Optionnel) Visualiser la base avec Prisma Studio
npx prisma studio
```

### **5. Créer le Dossier Uploads**

```bash
mkdir uploads
chmod 755 uploads
```

### **6. Lancer l'Application**

```bash
npm run dev
# ou
yarn dev
# ou 
pnpm dev
```

L'application sera disponible sur [http://localhost:3001](http://localhost:3001)

## ⚙️ Configuration

### **Variables d'Environnement Détaillées**

| Variable | Description | Obligatoire | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ | - |
| `JWT_SECRET` | Clé secrète pour JWT (32+ chars) | ✅ | - |
| `OPENAI_API_KEY` | Clé API OpenAI | ❌ | Fallback activé |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application | ✅ | http://localhost:3001 |
| `NEXTAUTH_SECRET` | Secret pour NextAuth | ✅ | - |
| `MAX_FILE_SIZE` | Taille max des uploads (bytes) | ❌ | 10485760 (10MB) |
| `UPLOAD_DIR` | Dossier de stockage des fichiers | ❌ | uploads |

### **Configuration OpenAI**

L'application utilise deux modèles OpenAI :
- **text-embedding-ada-002** : Génération d'embeddings pour la recherche
- **gpt-4** : Génération de réponses conversationnelles

### **Système de Fallback Intelligent**

En cas de limite API OpenAI ou de clé manquante, l'application utilise :
- Réponses pré-configurées basées sur des mots-clés
- Recherche textuelle dans les documents
- Messages d'information appropriés

## 📖 Utilisation

### **🎯 Pour les Étudiants**

1. **Inscription** : Créez un compte avec votre email universitaire
2. **Connexion** : Accédez au dashboard avec vos identifiants
3. **Chat IA** : Posez vos questions administratives en langage naturel
4. **Génération d'Emails** : Créez des emails professionnels automatiquement
5. **Consultation** : Visualisez les sources de documents utilisées

### **👑 Pour les Administrateurs**

1. **Gestion Documents** : Uploadez et organisez les PDFs officiels
2. **Statistiques** : Consultez les métriques d'usage en temps réel
3. **Utilisateurs** : Créez des comptes administrateurs
4. **Monitoring** : Surveillez l'activité et les tendances du système
5. **Téléchargements** : Gérez les documents avec download sécurisé

### **🔄 Workflow Utilisateur Type**

```mermaid
graph TD
    A[Connexion Utilisateur] --> B[Dashboard Principal]
    B --> C{Type d'Action}
    C -->|Question| D[Chat IA]
    C -->|Email| E[Générateur Email]
    C -->|Admin| F[Gestion Documents]
    D --> G[Recherche RAG]
    G --> H[Réponse + Sources]
    H --> I[Téléchargement Documents]
    E --> J[Email Généré]
    F --> K[Upload/Download]
```

## 📡 API Documentation

### **Authentification**

```bash
# Connexion utilisateur
POST /api/auth/login
Content-Type: application/json
{
  "email": "etudiant@university.edu",
  "password": "motdepasse123"
}

# Réponse
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Jean Dupont",
    "email": "etudiant@university.edu",
    "role": "STUDENT"
  }
}

# Inscription
POST /api/auth/register
Content-Type: application/json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@university.edu",
  "password": "motdepasse123",
  "role": "STUDENT"
}

# Déconnexion
POST /api/auth/logout
```

### **Gestion des Documents**

```bash
# Lister tous les documents (nécessite authentification)
GET /api/documents
Authorization: Cookie auth-token=<jwt_token>

# Réponse
{
  "success": true,
  "data": [
    {
      "id": "doc_id",
      "title": "Guide d'inscription 2024",
      "filename": "guide-inscription.pdf",
      "category": "INSCRIPTION",
      "createdAt": "2024-02-28T10:00:00Z",
      "uploadedBy": {
        "name": "Admin",
        "email": "admin@university.edu"
      },
      "_count": {
        "chunks": 15
      }
    }
  ]
}

# Upload d'un nouveau document (Admin uniquement)
POST /api/documents
Content-Type: multipart/form-data
Authorization: Cookie auth-token=<admin_jwt_token>

FormData:
- file: <PDF file>
- title: "Nouveau guide"
- category: "INSCRIPTION"

# Télécharger un document
GET /api/documents/:id
Authorization: Cookie auth-token=<jwt_token>

# Réponse: Stream du fichier PDF avec headers appropriés

# Supprimer un document (Admin uniquement)
DELETE /api/documents/:id
Authorization: Cookie auth-token=<admin_jwt_token>
```

### **Chat IA avec Streaming**

```bash
# Envoyer un message à l'IA
POST /api/chat
Content-Type: application/json
Authorization: Cookie auth-token=<jwt_token>

{
  "message": "Comment faire une demande de bourse d'études ?",
  "conversationId": "optional_conversation_id"
}

# Réponse en streaming (Server-Sent Events)
Content-Type: text/event-stream

data: {"type": "content", "content": "Pour faire une demande de bourse"}
data: {"type": "content", "content": " d'études, vous devez..."}
data: {"type": "sources", "sources": [{"id": "doc_id", "title": "Guide des bourses", "category": "BOURSES"}]}
data: {"type": "done"}
```

### **Générateur d'Emails**

```bash
# Générer un email professionnel
POST /api/generate-email
Content-Type: application/json
Authorization: Cookie auth-token=<jwt_token>

{
  "type": "demande_attestation",
  "details": {
    "nom": "Jean Dupont",
    "studentId": "12345",
    "programme": "Master Informatique"
  }
}

# Réponse
{
  "success": true,
  "email": {
    "subject": "Demande d'attestation d'inscription",
    "body": "Email formaté professionellement...",
    "recipient": "scolarite@university.edu"
  }
}
```

### **Statistiques d'Administration**

```bash
# Obtenir les statistiques globales (Admin uniquement)
GET /api/admin/stats
Authorization: Cookie auth-token=<admin_jwt_token>

# Réponse
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "adminUsers": 5,
      "studentUsers": 145,
      "totalDocuments": 45,
      "totalChunks": 1200,
      "documentsWithEmbeddings": 45,
      "totalMessages": 3500,
      "userMessages": 1750,
      "assistantMessages": 1750
    },
    "recent": {
      "users": 12,
      "documents": 3,
      "messages": 85
    },
    "charts": {
      "documentsByCategory": [
        {"category": "INSCRIPTION", "count": 15},
        {"category": "BOURSES", "count": 12}
      ],
      "messageTrends": [
        {"date": "2024-02-28", "messages": 45}
      ]
    },
    "lists": {
      "activeUsers": [...],
      "recentDocuments": [...]
    }
  }
}
```

## 🐳 Déploiement

### **Docker Compose (Développement Local)**

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/uniadmin
      - JWT_SECRET=your_super_secure_jwt_secret_here
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_APP_URL=http://localhost:3001
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy
      
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=uniadmin
      - POSTGRES_USER=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

```bash
# Lancer avec Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Arrêter les services
docker-compose down
```

### **Dockerfile**

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p uploads && chown nextjs:nodejs uploads

USER nextjs
EXPOSE 3001
ENV PORT 3001

CMD ["node", "server.js"]
```

### **Production (Vercel + Railway/Supabase)**

1. **Base de données** : Déployez PostgreSQL sur Railway ou Supabase
2. **Application** : Connectez le repo GitHub à Vercel
3. **Variables d'environnement** : Configurez dans les settings Vercel
4. **Domaine personnalisé** : Configurez le DNS

```bash
# Déploiement avec Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Configuration des variables d'environnement
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add OPENAI_API_KEY
```

### **Variables d'Environnement Production**

```env
# Production sur Vercel
DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=require"
JWT_SECRET="production_jwt_secret_32_chars_minimum"
OPENAI_API_KEY="sk-production_openai_key"
NEXT_PUBLIC_APP_URL="https://votre-domaine.vercel.app"
NEXTAUTH_SECRET="production_nextauth_secret"
NODE_ENV="production"
```

## 🧪 Tests et Qualité

### **Scripts de Test**

```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:coverage

# Tests d'intégration
npm run test:integration

# Linting
npm run lint

# Formatage du code
npm run format

# Vérification des types TypeScript
npm run type-check
```

### **Structure des Tests**

```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── api/
├── integration/
│   ├── auth.test.ts
│   ├── documents.test.ts
│   └── chat.test.ts
└── e2e/
    ├── user-journey.test.ts
    └── admin-workflow.test.ts
```

## 📊 Monitoring et Logs

### **Monitoring d'Application**

L'application inclut :

- **Logs structurés** avec timestamps et niveaux
- **Métriques d'utilisation** en temps réel dans le dashboard
- **Monitoring d'erreurs** avec stack traces complètes
- **Performance tracking** des requêtes IA et base de données
- **Health checks** pour tous les services externes

### **Exemple de Configuration de Logs**

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  },
  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
}
```

## 🔒 Sécurité

### **Mesures de Sécurité Implémentées**

- **JWT sécurisés** avec cookies HTTP-only et SameSite
- **Validation stricte** des entrées avec Zod schemas
- **Rate limiting** pour prévenir les abus API
- **Sanitization** des uploads de fichiers (PDF uniquement)
- **Headers de sécurité** (CSP, CORS, X-Frame-Options)
- **Chiffrement des mots de passe** avec bcrypt
- **Protection CSRF** intégrée
- **Validation des rôles** sur tous les endpoints sensibles

### **Bonnes Pratiques de Sécurité**

```typescript
// Exemple de validation d'entrée
import { z } from 'zod'

const messageSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().optional()
})

// Utilisation dans l'API
const validatedData = messageSchema.parse(requestBody)
```

## 🤝 Contribution

### **Comment Contribuer**

1. **Fork** le projet sur GitHub
2. **Créez** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Développez** en suivant les standards du projet
4. **Testez** votre code avec `npm run test`
5. **Committez** vos changements (`git commit -m 'feat: ajout nouvelle fonctionnalité'`)
6. **Poussez** vers votre fork (`git push origin feature/nouvelle-fonctionnalite`)
7. **Ouvrez** une Pull Request détaillée

### **Standards de Code**

- **TypeScript strict** activé pour tous les fichiers
- **ESLint + Prettier** pour le formatage automatique
- **Commits conventionnels** (feat, fix, docs, style, refactor, test, chore)
- **Tests unitaires** requis pour toutes nouvelles fonctionnalités
- **Documentation** mise à jour pour les changements d'API
- **Code review** obligatoire avant merge

### **Structure des Commits**

```bash
feat: ajout du téléchargement de documents
fix: correction du bug d'authentification 
docs: mise à jour de la documentation API
style: formatage du code avec prettier
refactor: restructuration du pipeline RAG
test: ajout des tests pour les documents
chore: mise à jour des dépendances
```

### **Issues et Feature Requests**

- Utilisez les **templates GitHub** pour les issues
- **Décrivez clairement** le problème ou la fonctionnalité
- **Ajoutez des captures d'écran** si pertinent
- **Mentionnez votre environnement** (OS, Node.js version, etc.)

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024 UniAdmin AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🆘 Support et Communauté

### **Canaux de Support**

- **📚 Documentation** : [Wiki du projet](https://github.com/votre-repo/wiki)
- **🐛 Issues** : [GitHub Issues](https://github.com/votre-repo/issues)
- **💬 Discussions** : [GitHub Discussions](https://github.com/votre-repo/discussions)
- **📧 Email** : support@uniadmin-ai.com
- **💬 Discord** : [Communauté UniAdmin AI](https://discord.gg/uniadmin-ai)

### **FAQ Fréquentes**

**Q: Puis-je utiliser l'application sans clé OpenAI ?**
R: Oui ! L'application inclut un système de fallback intelligent qui fonctionne sans OpenAI.

**Q: Comment ajouter de nouveaux types de documents ?**
R: Modifiez l'enum `DocumentCategory` dans `prisma/schema.prisma` et mettez à jour la base.

**Q: L'application supporte-t-elle d'autres langues ?**
R: Actuellement optimisée pour le français, mais l'architecture permet l'ajout d'autres langues.

**Q: Puis-je déployer sur d'autres plateformes que Vercel ?**
R: Absolument ! Docker est supporté pour déploiement sur AWS, GCP, Azure, etc.

## 🎉 Remerciements

### **Technologies et Services**

- **[OpenAI](https://openai.com)** pour les services d'intelligence artificielle
- **[Vercel](https://vercel.com)** pour l'hébergement et l'infrastructure
- **[Prisma](https://prisma.io)** pour l'ORM et la gestion de base de données
- **[TailwindCSS](https://tailwindcss.com)** pour le framework CSS
- **[Next.js](https://nextjs.org)** pour le framework React

### **Communauté Open Source**

Merci à tous les contributeurs et à la communauté open source pour l'inspiration, les retours et les contributions qui font évoluer ce projet.

### **Inspiration et Vision**

Ce projet a été créé avec la vision de **démocratiser l'accès à l'information administrative** dans les universités grâce à l'intelligence artificielle, tout en maintenant la **sécurité** et la **simplicité d'utilisation**.

---

**Développé avec ❤️ pour simplifier la vie universitaire**

*UniAdmin AI - Transformer l'administration universitaire avec l'intelligence artificielle*

---

### 📈 Roadmap Future

- [ ] **Multi-langues** : Support complet anglais/français
- [ ] **Mobile App** : Application mobile native
- [ ] **Advanced Analytics** : Tableaux de bord avancés
- [ ] **API Publique** : API REST complète pour intégrations
- [ ] **Chatbot Vocal** : Interface vocale pour accessibilité
- [ ] **Integration SSO** : Single Sign-On avec systèmes universitaires
- [ ] **Machine Learning** : Amélioration continue des réponses
- [ ] **Multi-tenant** : Support de plusieurs universités

---

*Dernière mise à jour : Février 2024*