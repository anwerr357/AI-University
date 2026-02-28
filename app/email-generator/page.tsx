'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EmailTemplate {
  type: string
  label: string
  description: string
}

interface GeneratedEmail {
  type: string
  label: string
  subject: string
  body: string
  description: string
}

export default function EmailGeneratorPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null)
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    customDetails: '',
    personalInfo: {
      fullName: '',
      studentId: '',
      program: '',
      level: '',
    },
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/emails/generate')
      const result = await response.json()
      
      if (result.success) {
        setTemplates(result.data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) return

    setLoading(true)
    try {
      const response = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedTemplate,
          customDetails: formData.customDetails || undefined,
          personalInfo: Object.values(formData.personalInfo).some(v => v) ? formData.personalInfo : undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedEmail(result.data)
      } else {
        alert('Erreur: ' + result.error)
      }
    } catch (error) {
      console.error('Error generating email:', error)
      alert('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedEmail) return

    const emailText = `Sujet: ${generatedEmail.subject}\n\n${generatedEmail.body}`
    
    try {
      await navigator.clipboard.writeText(emailText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const resetForm = () => {
    setSelectedTemplate('')
    setGeneratedEmail(null)
    setFormData({
      customDetails: '',
      personalInfo: {
        fullName: '',
        studentId: '',
        program: '',
        level: '',
      },
    })
    setCopied(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-bold text-gray-900">UniAdmin AI</span>
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-lg font-semibold text-gray-700">
                Générateur d&apos;Emails
              </span>
            </div>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700"
            >
              Retour
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedEmail ? (
          <>
            {/* Introduction */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Générateur d&apos;Emails Administratifs
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Créez des emails professionnels pour vos démarches administratives 
                universitaires en quelques clics.
              </p>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Choisissez le type d&apos;email
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplate === template.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.type)}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {template.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Informations personnelles (optionnel)
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                      }))}
                      placeholder="Ex: Ahmed Ben Mohamed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro d&apos;étudiant
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.personalInfo.studentId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, studentId: e.target.value }
                      }))}
                      placeholder="Ex: 20231234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filière
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.personalInfo.program}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, program: e.target.value }
                      }))}
                      placeholder="Ex: Informatique"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.personalInfo.level}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, level: e.target.value }
                      }))}
                      placeholder="Ex: 3ème année Licence"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom Details */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Détails spécifiques (optionnel)
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Ajoutez des détails spécifiques à votre demande pour personnaliser l&apos;email.
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.customDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, customDetails: e.target.value }))}
                  placeholder="Ex: J'ai besoin de cette attestation pour ma candidature à un stage chez..."
                />
              </div>
            )}

            {/* Generate Button */}
            {selectedTemplate && (
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Génération...' : 'Générer l\'email'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Generated Email Display */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Email généré - {generatedEmail.label}
              </h2>
              <div className="space-x-3">
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Copié!' : 'Copier'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Nouveau
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet:
                </label>
                <div className="bg-gray-50 p-3 rounded border font-medium">
                  {generatedEmail.subject}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Corps de l&apos;email:
                </label>
                <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap font-mono text-sm">
                  {generatedEmail.body}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Instructions:
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Vérifiez et personnalisez les informations entre [CROCHETS]</li>
                <li>• Adaptez le contenu selon votre situation spécifique</li>
                <li>• N&apos;oubliez pas d&apos;ajouter vos documents justificatifs si nécessaire</li>
                <li>• Relisez attentivement avant d&apos;envoyer</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}