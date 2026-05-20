import { MaterialChunk } from "./validators"

/**
 * Calculates the Cosine Similarity between two numerical arrays.
 * Formula: (A . B) / (||A|| * ||B||)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  if (normA === 0 || normB === 0) return 0
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Performs local semantic vector similarity search on an array of material chunks.
 * Adds a 'similarity' score and returns the top K matching elements.
 */
export function searchSimilarChunksLocal(
  queryEmbedding: number[],
  chunks: Omit<MaterialChunk, "created_at">[],
  topK = 3
): (Omit<MaterialChunk, "created_at"> & { similarity: number })[] {
  const scored = chunks
    .map(chunk => {
      const chunkEmbedding = chunk.embedding || []
      const similarity = chunkEmbedding.length > 0 
        ? cosineSimilarity(queryEmbedding, chunkEmbedding) 
        : 0
      
      return {
        ...chunk,
        similarity
      }
    })
    // Sort descending by similarity
    .sort((a, b) => b.similarity - a.similarity)
    
  return scored.slice(0, topK)
}
