import pdfParse from 'pdf-parse'

export interface PDFParseResult {
  text: string
  numPages: number
  info?: any
}

export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const data = await pdfParse(buffer)
    
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF file')
  }
}

export function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .replace(/\r/g, '') // Remove carriage returns
    .trim()
}