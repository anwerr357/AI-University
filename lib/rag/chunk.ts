export interface TextChunk {
  content: string
  chunkIndex: number
  pageNumber?: number
  startIndex: number
  endIndex: number
}

export function chunkText(
  text: string,
  options: {
    chunkSize?: number
    chunkOverlap?: number
    pageNumber?: number
  } = {}
): TextChunk[] {
  const {
    chunkSize = 800, // tokens ≈ chars/4, so 800 chars ≈ 200 tokens
    chunkOverlap = 100,
    pageNumber
  } = options

  const chunks: TextChunk[] = []
  let startIndex = 0
  let chunkIndex = 0

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + chunkSize, text.length)
    
    // Try to break at sentence or paragraph boundaries
    if (endIndex < text.length) {
      const nextSentenceEnd = text.indexOf('.', endIndex)
      const nextParagraphEnd = text.indexOf('\n', endIndex)
      
      if (nextSentenceEnd !== -1 && nextSentenceEnd - endIndex < 100) {
        endIndex = nextSentenceEnd + 1
      } else if (nextParagraphEnd !== -1 && nextParagraphEnd - endIndex < 100) {
        endIndex = nextParagraphEnd + 1
      }
    }

    const content = text.slice(startIndex, endIndex).trim()
    
    if (content.length > 0) {
      chunks.push({
        content,
        chunkIndex,
        pageNumber,
        startIndex,
        endIndex,
      })
      chunkIndex++
    }

    // Move start index forward, accounting for overlap
    startIndex = endIndex - chunkOverlap
    if (startIndex <= 0) startIndex = endIndex
  }

  return chunks
}

export function chunkTextByPages(
  text: string,
  pageBreaks: number[],
  chunkSize = 800,
  chunkOverlap = 100
): TextChunk[] {
  const allChunks: TextChunk[] = []
  let globalChunkIndex = 0

  // Split text by pages
  const pages: string[] = []
  let lastBreak = 0
  
  pageBreaks.forEach((breakPoint, pageIndex) => {
    pages.push(text.slice(lastBreak, breakPoint))
    lastBreak = breakPoint
  })
  
  // Add the last page
  if (lastBreak < text.length) {
    pages.push(text.slice(lastBreak))
  }

  // Chunk each page
  pages.forEach((pageText, pageIndex) => {
    const pageChunks = chunkText(pageText, {
      chunkSize,
      chunkOverlap,
      pageNumber: pageIndex + 1,
    })

    pageChunks.forEach(chunk => {
      allChunks.push({
        ...chunk,
        chunkIndex: globalChunkIndex++,
      })
    })
  })

  return allChunks
}