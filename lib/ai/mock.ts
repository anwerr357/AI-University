// Mock AI responses for demo/development when OpenAI is not available

export const MOCK_RESPONSES = [
  "Je comprends votre question concernant les démarches administratives. Cependant, je ne trouve pas cette information spécifique dans les documents officiels actuellement disponibles dans la base de données.",
  
  "Pour cette demande administrative, je vous recommande de vous rapprocher du bureau des affaires académiques. Ils pourront vous fournir les informations précises selon votre situation.",
  
  "Selon la procédure habituelle de l'université, cette démarche nécessite généralement les documents suivants : une demande écrite, une copie de votre carte d'étudiant, et les justificatifs appropriés.",
  
  "Cette question concerne les réglementations universitaires. Je vous conseille de consulter le règlement intérieur de l'établissement ou de contacter directement l'administration.",
  
  "Les délais pour ce type de demande sont généralement de 5 à 10 jours ouvrables. Cependant, je vous recommande de vérifier les délais exacts auprès du service concerné."
]

export function getMockResponse(query: string): string {
  // Simple keyword matching for more relevant responses
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('attestation') || lowerQuery.includes('certificat')) {
    return "Pour obtenir une attestation de scolarité, vous devez vous adresser au bureau des affaires académiques avec votre carte d'étudiant et remplir le formulaire de demande. Le délai de traitement est généralement de 2 à 5 jours ouvrables."
  }
  
  if (lowerQuery.includes('inscription') || lowerQuery.includes('réinscription')) {
    return "Les inscriptions se font généralement en début d'année universitaire. Vous devez fournir les documents requis selon votre niveau d'études. Consultez le calendrier académique pour les dates exactes."
  }
  
  if (lowerQuery.includes('bourse') || lowerQuery.includes('aide financière')) {
    return "Les demandes de bourse doivent être déposées selon le calendrier établi par l'université. Les critères d'attribution incluent les résultats académiques et la situation sociale."
  }
  
  if (lowerQuery.includes('stage') || lowerQuery.includes('convention')) {
    return "Pour effectuer un stage, vous devez obtenir une convention de stage signée par l'université, l'entreprise et vous-même. Adressez-vous au service des stages pour les démarches."
  }
  
  if (lowerQuery.includes('absence') || lowerQuery.includes('justificatif')) {
    return "Les absences doivent être justifiées par des documents officiels (certificat médical, attestation, etc.). Contactez votre responsable pédagogique dans les plus brefs délais."
  }
  
  // Default response
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
}

export function createMockEmbedding(): number[] {
  // Generate a mock embedding vector (1536 dimensions like OpenAI)
  return Array.from({ length: 1536 }, () => Math.random() - 0.5)
}

export async function* streamMockResponse(response: string) {
  // Simulate streaming by yielding words one by one
  const words = response.split(' ')
  for (const word of words) {
    yield word + ' '
    // Add small delay to simulate real streaming
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}