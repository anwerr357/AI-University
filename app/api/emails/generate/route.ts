import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { EMAIL_TEMPLATES, getTemplateByType } from '@/lib/emails/templates'
import { generateResponse } from '@/lib/ai/openai'

const generateEmailSchema = z.object({
  type: z.enum(['ATTESTATION', 'STAGE', 'BOURSE', 'RECLAMATION', 'ABSENCE']),
  customDetails: z.string().optional(),
  personalInfo: z.object({
    fullName: z.string().optional(),
    studentId: z.string().optional(),
    program: z.string().optional(),
    level: z.string().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { type, customDetails, personalInfo } = generateEmailSchema.parse(body)

    // Get base template
    const template = getTemplateByType(type)
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template non trouvé' },
        { status: 400 }
      )
    }

    let emailContent = {
      subject: template.subject,
      body: template.body,
    }

    // If custom details are provided, enhance with AI
    if (customDetails) {
      const enhancePrompt = `
Tu es un assistant pour générer des emails administratifs universitaires en français.

Template de base:
Sujet: ${template.subject}
Corps: ${template.body}

Détails personnalisés fournis par l'utilisateur:
${customDetails}

Informations personnelles:
${personalInfo ? JSON.stringify(personalInfo, null, 2) : 'Non fournies'}

Instructions:
1. Personnalise le template avec les détails fournis
2. Remplace les placeholders [PLACEHOLDER] par les informations appropriées
3. Garde un ton formel et professionnel
4. Assure-toi que l'email reste cohérent et bien structuré
5. Réponds UNIQUEMENT avec le JSON suivant:

{
  "subject": "sujet personnalisé",
  "body": "corps de l'email personnalisé"
}
`

      try {
        const aiResponse = await generateResponse(enhancePrompt)
        const parsedResponse = JSON.parse(aiResponse)
        
        if (parsedResponse.subject && parsedResponse.body) {
          emailContent = parsedResponse
        }
      } catch (aiError) {
        console.error('AI enhancement failed:', aiError)
        // Continue with base template if AI enhancement fails
      }
    }

    // Basic placeholder replacement with user info
    if (personalInfo) {
      if (personalInfo.fullName) {
        emailContent.body = emailContent.body.replace(/\[VOTRE NOM COMPLET\]/g, personalInfo.fullName)
        emailContent.body = emailContent.body.replace(/\[VOTRE NOM\]/g, personalInfo.fullName)
      }
      if (personalInfo.studentId) {
        emailContent.body = emailContent.body.replace(/\[VOTRE NUMÉRO D'ÉTUDIANT\]/g, personalInfo.studentId)
      }
      if (personalInfo.program && personalInfo.level) {
        emailContent.body = emailContent.body.replace(/\[VOTRE FILIÈRE ET NIVEAU\]/g, `${personalInfo.program} - ${personalInfo.level}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        type: template.type,
        label: template.label,
        subject: emailContent.subject,
        body: emailContent.body,
        description: template.description,
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Email generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération de l\'email' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await requireAuth()
    
    return NextResponse.json({
      success: true,
      data: EMAIL_TEMPLATES.map(template => ({
        type: template.type,
        label: template.label,
        description: template.description,
      })),
    })

  } catch (error) {
    console.error('Get email templates error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des templates' },
      { status: 500 }
    )
  }
}