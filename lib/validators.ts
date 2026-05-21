import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.string()
})

export type User = z.infer<typeof UserSchema>

export const MaterialSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  file_url: z.string().optional(),
  file_name: z.string(),
  file_size: z.number(),
  total_pages: z.number(),
  status: z.enum(["processing", "completed", "failed"]),
  created_at: z.string(),
  chunk_count: z.number().optional(),
  flashcard_count: z.number().optional(),
  quiz_count: z.number().optional()
})

export type Material = z.infer<typeof MaterialSchema>

export const MaterialChunkSchema = z.object({
  id: z.string(),
  material_id: z.string(),
  content: z.string(),
  page_number: z.number(),
  chunk_index: z.number(),
  token_estimate: z.number(),
  embedding: z.array(z.number()).optional(),
  similarity: z.number().optional(),
  created_at: z.string()
})

export type MaterialChunk = z.infer<typeof MaterialChunkSchema>

export const SummarySchema = z.object({
  id: z.string().optional(),
  material_id: z.string().optional(),
  short_summary: z.string(),
  detailed_summary: z.string(),
  key_points: z.array(z.string()),
  important_terms: z.array(z.object({
    term: z.string(),
    definition: z.string()
  })),
  learning_path: z.array(z.string()),
  created_at: z.string().optional()
})

export type Summary = z.infer<typeof SummarySchema>

export const FlashcardSchema = z.object({
  id: z.string().optional(),
  material_id: z.string().optional(),
  front: z.string(),
  back: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topic: z.string(),
  status: z.enum(["new", "mastered", "review"]).optional(),
  created_at: z.string().optional()
})

export type Flashcard = z.infer<typeof FlashcardSchema>

export const QuizQuestionSchema = z.object({
  id: z.string().optional(),
  quiz_id: z.string().optional(),
  question: z.string(),
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  options: z.array(z.string()),
  correct_answer: z.string(),
  explanation: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topic: z.string(),
  source_reference: z.object({
    page_number: z.number(),
    chunk_index: z.number()
  }),
  ml_verification: z.object({
    predicted_difficulty: z.enum(["easy", "medium", "hard"]),
    confidence: z.number(),
    method: z.string()
  }).optional(),
  created_at: z.string().optional()
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>

export const QuizSchema = z.object({
  id: z.string().optional(),
  material_id: z.string(),
  title: z.string(),
  created_at: z.string().optional(),
  questions: z.array(QuizQuestionSchema).optional()
})

export type Quiz = z.infer<typeof QuizSchema>

export const QuizAttemptSchema = z.object({
  id: z.string(),
  quiz_id: z.string(),
  user_id: z.string(),
  score: z.number(),
  total_questions: z.number(),
  weak_topics: z.array(z.string()),
  created_at: z.string(),
  quiz_title: z.string().optional()
})

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>

export const ChatMessageSchema = z.object({
  id: z.string(),
  material_id: z.string(),
  user_id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  sources: z.array(z.object({
    page_number: z.number(),
    chunk_index: z.number(),
    quote: z.string()
  })),
  created_at: z.string()
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const FlashcardCollectionSchema = z.array(FlashcardSchema)
export const QuizQuestionCollectionSchema = z.array(QuizQuestionSchema)

// Validation helper for OpenAI structured JSON using Zod
export function validateJSONResponse<T>(jsonText: string, schema: z.ZodSchema<T>, fallback: T): T {
  try {
    let cleaned = jsonText.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "")
    }
    const parsed = JSON.parse(cleaned)
    const result = schema.safeParse(parsed)
    if (!result.success) {
      console.error("Zod Validation Error:", result.error.format())
      return fallback
    }
    return result.data
  } catch (e) {
    console.error("Failed to parse or validate JSON response:", jsonText, e)
    return fallback
  }
}
