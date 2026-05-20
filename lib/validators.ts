export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Material {
  id: string
  user_id: string
  title: string
  file_url?: string
  file_name: string
  file_size: number
  total_pages: number
  status: "processing" | "completed" | "failed"
  created_at: string
  chunk_count?: number
  flashcard_count?: number
  quiz_count?: number
}

export interface MaterialChunk {
  id: string
  material_id: string
  content: string
  page_number: number
  chunk_index: number
  token_estimate: number
  embedding?: number[]
  similarity?: number
  created_at: string
}

export interface Summary {
  id: string
  material_id: string
  short_summary: string
  detailed_summary: string
  key_points: string[]
  important_terms: {
    term: string
    definition: string
  }[]
  learning_path: string[]
  created_at: string
}

export interface Flashcard {
  id: string
  material_id: string
  front: string
  back: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  status: "new" | "mastered" | "review"
  created_at: string
}

export interface Quiz {
  id: string
  material_id: string
  title: string
  created_at: string
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  type: "multiple_choice" | "true_false" | "short_answer"
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  source_reference: {
    page_number: number
    chunk_index: number
  }
  ml_verification?: {
    predicted_difficulty: "easy" | "medium" | "hard"
    confidence: number
    method: string
  }
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  score: number
  total_questions: number
  weak_topics: string[]
  created_at: string
  quiz_title?: string
}

export interface ChatMessage {
  id: string
  material_id: string
  user_id: string
  role: "user" | "assistant"
  content: string
  sources: {
    page_number: number
    chunk_index: number
    quote: string
  }[]
  created_at: string
}

// Validation helper for OpenAI structured JSON
export function validateJSONResponse<T>(jsonText: string, fallback: T): T {
  try {
    // Strip possible markdown wrapping (e.g. ```json ... ```)
    let cleaned = jsonText.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "")
    }
    return JSON.parse(cleaned) as T
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText, e)
    return fallback
  }
}
