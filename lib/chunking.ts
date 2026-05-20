import { MaterialChunk } from "./validators"

export function cleanText(text: string): string {
  if (!text) return ""

  // Normalize Unicode
  let cleaned = text.normalize("NFC")

  // Remove repeated typical headers/footers
  cleaned = cleaned.replace(/(?:\r?\n)(?:page\s*\d+|bab\s*\d+|chapter\s*\d+)\s*$/gim, "")
  cleaned = cleaned.replace(/(?:\r?\n)\s*\d+\s*$/gm, "") // STANDALONE Standalone page numbers

  // Remove broken line breaks
  cleaned = cleaned.replace(/(\w)\r?\n([a-z])/g, "$1 $2")

  // Replace single newlines that are not between paragraphs with single spaces
  cleaned = cleaned.replace(/(?<!\r?\n)\r?\n(?!\r?\n)/g, " ")

  // Normalize multiple spaces/tabs
  cleaned = cleaned.replace(/[ \t]+/g, " ")

  // Normalize multiple newlines to double newlines (paragraphs)
  cleaned = cleaned.replace(/\n\s*\n+/g, "\n\n")

  return cleaned.trim()
}

export function chunkText(
  pages: { page_number: number; text: string }[],
  chunkSize = 800,
  overlap = 150
): Omit<MaterialChunk, "id" | "material_id" | "created_at">[] {
  const chunks: Omit<MaterialChunk, "id" | "material_id" | "created_at">[] = []
  let chunkIndex = 0

  for (const page of pages) {
    const pageNum = page.page_number
    const text = page.text || ""

    // Split page text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/)
    let currentChunk: string[] = []
    let currentLength = 0

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) continue

      const sentenceLen = trimmedSentence.length

      if (sentenceLen > chunkSize) {
        // If we have built-up chunk text, save it first
        if (currentChunk.length > 0) {
          const content = currentChunk.join(" ")
          chunks.push({
            chunk_index: chunkIndex++,
            page_number: pageNum,
            content,
            token_estimate: Math.floor(content.length / 4)
          })
          currentChunk = []
          currentLength = 0
        }

        // Split large sentence by words
        const words = trimmedSentence.split(/\s+/)
        let subChunkWords: string[] = []
        let subChunkLen = 0

        for (const word of words) {
          subChunkWords.push(word)
          subChunkLen += word.length + 1
          if (subChunkLen >= chunkSize) {
            const content = subChunkWords.join(" ")
            chunks.push({
              chunk_index: chunkIndex++,
              page_number: pageNum,
              content,
              token_estimate: Math.floor(content.length / 4)
            })

            // Retain overlap words
            const maxOverlapWords = Math.max(1, Math.floor(overlap / 10))
            const overlapWords = subChunkWords.slice(-maxOverlapWords)
            subChunkWords = [...overlapWords]
            subChunkLen = subChunkWords.reduce((acc, w) => acc + w.length + 1, 0)
          }
        }

        if (subChunkWords.length > 0) {
          currentChunk = [...subChunkWords]
          currentLength = subChunkLen
        }
      } else if (currentLength + sentenceLen + 1 > chunkSize) {
        // Save current chunk
        const content = currentChunk.join(" ")
        chunks.push({
          chunk_index: chunkIndex++,
          page_number: pageNum,
          content,
          token_estimate: Math.floor(content.length / 4)
        })

        // Retain overlapping sentences
        const backtrackChunk: string[] = []
        let backtrackLen = 0
        for (let i = currentChunk.length - 1; i >= 0; i--) {
          const s = currentChunk[i]
          if (backtrackLen + s.length + 1 <= overlap) {
            backtrackChunk.unshift(s)
            backtrackLen += s.length + 1
          } else {
            break
          }
        }

        currentChunk = backtrackChunk
        currentChunk.push(trimmedSentence)
        currentLength = currentChunk.reduce((acc, s) => acc + s.length + 1, 0)
      } else {
        currentChunk.push(trimmedSentence)
        currentLength += sentenceLen + 1
      }
    }

    if (currentChunk.length > 0) {
      const content = currentChunk.join(" ")
      chunks.push({
        chunk_index: chunkIndex++,
        page_number: pageNum,
        content,
        token_estimate: Math.floor(content.length / 4)
      })
    }
  }

  return chunks
}
