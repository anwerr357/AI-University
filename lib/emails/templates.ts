export interface EmailTemplate {
  type: string
  label: string
  subject: string
  body: string
  description: string
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    type: 'ATTESTATION',
    label: 'Demande d\'Attestation',
    subject: 'Demande d\'attestation de scolarité',
    description: 'Pour demander une attestation de scolarité ou de réussite',
    body: `Madame, Monsieur,

J'ai l'honneur de solliciter de votre bienveillance une attestation de scolarité pour l'année universitaire en cours.

Mes informations personnelles :
- Nom et Prénom : [VOTRE NOM COMPLET]
- Numéro d'étudiant : [VOTRE NUMÉRO D'ÉTUDIANT]
- Filière et niveau : [VOTRE FILIÈRE ET NIVEAU]

Cette attestation m'est nécessaire pour [PRÉCISER LE MOTIF : démarches administratives / candidature / stage / autre].

Je me tiens à votre disposition pour fournir tout document complémentaire si nécessaire.

Dans l'attente de votre réponse, veuillez agréer, Madame, Monsieur, l'expression de mes sentiments respectueux.

[VOTRE NOM]
[VOTRE SIGNATURE]`
  },
  {
    type: 'STAGE',
    label: 'Demande de Stage',
    subject: 'Demande de convention de stage',
    description: 'Pour les démarches liées aux stages et conventions',
    body: `Madame, Monsieur,

Étudiant(e) en [VOTRE FILIÈRE ET NIVEAU] à votre établissement, j'ai l'honneur de solliciter l'établissement d'une convention de stage.

Détails du stage :
- Organisme d'accueil : [NOM DE L'ENTREPRISE/ORGANISME]
- Période de stage : Du [DATE DE DÉBUT] au [DATE DE FIN]
- Durée : [NOMBRE DE SEMAINES] semaines
- Lieu : [ADRESSE DU STAGE]
- Encadrant professionnel : [NOM ET FONCTION]

Mes informations :
- Nom et Prénom : [VOTRE NOM COMPLET]
- Numéro d'étudiant : [VOTRE NUMÉRO D'ÉTUDIANT]
- Promotion : [VOTRE PROMOTION]

Je vous prie de trouver ci-joint tous les documents nécessaires à l'établissement de cette convention.

Je reste à votre entière disposition pour tout complément d'information.

Veuillez agréer, Madame, Monsieur, mes salutations distinguées.

[VOTRE NOM]
[VOTRE SIGNATURE]`
  },
  {
    type: 'BOURSE',
    label: 'Demande de Bourse',
    subject: 'Demande de bourse d\'études',
    description: 'Pour les demandes de bourses et aides financières',
    body: `Madame, Monsieur,

J'ai l'honneur de solliciter de votre bienveillance l'attribution d'une bourse d'études pour l'année universitaire [ANNÉE UNIVERSITAIRE].

Ma situation académique :
- Nom et Prénom : [VOTRE NOM COMPLET]
- Numéro d'étudiant : [VOTRE NUMÉRO D'ÉTUDIANT]
- Filière et niveau : [VOTRE FILIÈRE ET NIVEAU]
- Moyenne générale : [VOTRE MOYENNE]

Ma situation financière :
- Situation familiale : [PRÉCISER]
- Revenus familiaux : [PRÉCISER SI NÉCESSAIRE]
- Autres informations pertinentes : [PRÉCISER]

Cette aide financière m'est indispensable pour poursuivre mes études dans de bonnes conditions et me permettra de me consacrer pleinement à ma formation.

Je me tiens à votre disposition pour fournir tous les justificatifs nécessaires à l'examen de ma demande.

Dans l'espoir d'une suite favorable, je vous prie d'agréer, Madame, Monsieur, l'expression de ma haute considération.

[VOTRE NOM]
[VOTRE SIGNATURE]`
  },
  {
    type: 'RECLAMATION',
    label: 'Réclamation Formelle',
    subject: 'Réclamation concernant [PRÉCISER L\'OBJET]',
    description: 'Pour formuler une réclamation ou contestation',
    body: `Madame, Monsieur,

J'ai l'honneur de porter à votre attention une situation qui nécessite votre intervention.

Mes coordonnées :
- Nom et Prénom : [VOTRE NOM COMPLET]
- Numéro d'étudiant : [VOTRE NUMÉRO D'ÉTUDIANT]
- Filière et niveau : [VOTRE FILIÈRE ET NIVEAU]

Objet de la réclamation :
[DÉCRIRE PRÉCISÉMENT LA SITUATION, LES FAITS ET LES CIRCONSTANCES]

Demande :
[PRÉCISER CLAIREMENT CE QUE VOUS DEMANDEZ : RECTIFICATION, RÉVISION, EXPLICATION, ETC.]

Cette situation me cause un préjudice considérable et j'espère une résolution rapide et équitable.

Je reste à votre entière disposition pour tout complément d'information et pour un éventuel entretien.

Dans l'attente de votre réponse, veuillez agréer, Madame, Monsieur, l'expression de mes sentiments distingués.

[VOTRE NOM]
[VOTRE SIGNATURE]`
  },
  {
    type: 'ABSENCE',
    label: 'Justification d\'Absence',
    subject: 'Justification d\'absence',
    description: 'Pour justifier une absence aux cours ou examens',
    body: `Madame, Monsieur,

J'ai l'honneur de porter à votre connaissance mon absence lors de [COURS/EXAMEN/PÉRIODE] qui s'est déroulé(e) le [DATE].

Mes informations :
- Nom et Prénom : [VOTRE NOM COMPLET]
- Numéro d'étudiant : [VOTRE NUMÉRO D'ÉTUDIANT]
- Filière et niveau : [VOTRE FILIÈRE ET NIVEAU]

Motif de l'absence :
[PRÉCISER LE MOTIF : MALADIE, RAISONS FAMILIALES, TRANSPORT, ETC.]

Cette absence était indépendante de ma volonté et je vous prie de bien vouloir l'excuser.

Je vous prie de trouver ci-joint les justificatifs nécessaires [CERTIFICAT MÉDICAL, ATTESTATION, ETC.].

Je me tiens à votre disposition pour rattraper le cours manqué ou pour convenir d'une date de rattrapage si nécessaire.

Veuillez agréer, Madame, Monsieur, l'expression de mes sentiments respectueux.

[VOTRE NOM]
[VOTRE SIGNATURE]`
  }
]

export function getTemplateByType(type: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(template => template.type === type)
}