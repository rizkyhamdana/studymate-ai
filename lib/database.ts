import supabase from "./supabase"
import { 
  Material, MaterialSchema,
  MaterialChunk, MaterialChunkSchema,
  Summary, SummarySchema,
  Flashcard, FlashcardSchema,
  Quiz, QuizSchema,
  QuizQuestion, QuizQuestionSchema,
  QuizAttempt, QuizAttemptSchema,
  ChatMessage, ChatMessageSchema
} from "./validators"
import { z } from "zod"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000"

/**
 * Database utility layer.
 * Implements strict Zod validation on all data retrieved from Supabase
 * to prevent runtime crashes caused by unexpected data formats.
 */
export const db = {
  // --- Materials ---
  async getMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
        .from("materials")
        .select("id, user_id, title, file_url, file_name, file_size, total_pages, status, created_at")
        .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching materials:", error)
      return []
    }
    
    // Validate each material
    return (data || []).map((m: any) => {
      const res = MaterialSchema.safeParse(m)
      return res.success ? res.data : null
    }).filter((m: any): m is Material => m !== null)
  },

  async getMaterial(id: string): Promise<Material | null> {
    const { data, error } = await supabase
      .from("materials")
      .select("id, user_id, title, file_url, file_name, file_size, total_pages, status, created_at")
      .eq("id", id)
      .single()
      
    if (error) {
      console.error(`Error fetching material ${id}:`, error)
      return null
    }

    const res = MaterialSchema.safeParse(data)
    return res.success ? res.data : null
  },

  async createMaterial(title: string, fileName: string, fileSize: number, totalPages: number): Promise<Material> {
    const materialData = {
      user_id: MOCK_USER_ID,
      title,
      file_name: fileName,
      file_size: fileSize,
      total_pages: totalPages,
      status: "completed"
    }
    
    const { data, error } = await supabase
      .from("materials")
      .insert(materialData)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create material: ${error.message}`)
      
    return MaterialSchema.parse(data)
  },

  // --- Chunks ---
  async createMaterialChunks(chunks: Omit<MaterialChunk, "id" | "created_at">[]): Promise<void> {
    const { error } = await supabase.from("material_chunks").insert(chunks)
    if (error) throw new Error(`Failed to create chunks: ${error.message}`)
  },

  async getMaterialChunks(materialId: string): Promise<MaterialChunk[]> {
    const { data, error } = await supabase
      .from("material_chunks")
      .select("*")
      .eq("material_id", materialId)
      .order("chunk_index", { ascending: true })
    
    if (error) return []
    
    return (data || []).map((c: any) => {
      const res = MaterialChunkSchema.safeParse(c)
      return res.success ? res.data : null
    }).filter((c: any): c is MaterialChunk => c !== null)
  },

  // --- Summaries ---
  async getSummary(materialId: string): Promise<Summary | null> {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("material_id", materialId)
      .single()
    
    if (error) return null
    const res = SummarySchema.safeParse(data)
    return res.success ? res.data : null
  },

  async createSummary(materialId: string, summary: Omit<Summary, "id" | "material_id" | "created_at">): Promise<Summary> {
    const { data, error } = await supabase
      .from("summaries")
      .insert({
        material_id: materialId,
        ...summary
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create summary: ${error.message}`)
    return SummarySchema.parse(data)
  },

  // --- Flashcards ---
  async getFlashcards(materialId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: true })
    
    if (error) return []
    return (data || []).map((f: any) => {
      const res = FlashcardSchema.safeParse(f)
      return res.success ? res.data : null
    }).filter((f: any): f is Flashcard => f !== null)
  },

  async createFlashcards(materialId: string, cards: Omit<Flashcard, "id" | "material_id" | "status" | "created_at">[]): Promise<Flashcard[]> {
    const prepped = cards.map(c => ({
      material_id: materialId,
      status: "new",
      ...c
    }))
    const { data, error } = await supabase
      .from("flashcards")
      .insert(prepped)
      .select()
    
    if (error) throw new Error(`Failed to create flashcards: ${error.message}`)
    return (data || []).map((f: any) => FlashcardSchema.parse(f))
  },

  async updateFlashcardStatus(id: string, status: string): Promise<Flashcard> {
    const { data, error } = await supabase
      .from("flashcards")
      .update({ status })
      .eq("id", id)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update flashcard status: ${error.message}`)
    return FlashcardSchema.parse(data)
  },

  // --- Quizzes ---
  async getQuizzes(materialId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: false })
    
    if (error) return []
    return (data || []).map((q: any) => {
      const res = QuizSchema.safeParse(q)
      return res.success ? res.data : null
    }).filter((q: any): q is Quiz => q !== null)
  },

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true })
    
    if (error) return []
    return (data || []).map((q: any) => {
      const res = QuizQuestionSchema.safeParse(q)
      return res.success ? res.data : null
    }).filter((q: any): q is QuizQuestion => q !== null)
  },

  async createQuiz(
    materialId: string,
    title: string,
    questions: Omit<QuizQuestion, "id" | "quiz_id" | "created_at">[]
  ): Promise<Quiz> {
    const { data: quiz, error: qError } = await supabase
      .from("quizzes")
      .insert({
        material_id: materialId,
        title
      })
      .select()
      .single()
      
    if (qError) throw new Error(`Failed to create quiz: ${qError.message}`)
      
    if (quiz) {
      const preppedQuestions = questions.map(q => ({
        quiz_id: quiz.id,
        ...q
      }))
      const { error: qsError } = await supabase.from("quiz_questions").insert(preppedQuestions)
      if (qsError) console.error("Error inserting quiz questions:", qsError)
      
      const validatedQuiz = QuizSchema.parse(quiz)
      validatedQuiz.questions = await this.getQuizQuestions(quiz.id)
      return validatedQuiz
    }
    
    throw new Error("Quiz creation returned no data")
  },

  // --- Quiz Attempts ---
  async getQuizAttempts(): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) return []
    return (data || []).map((a: any) => {
      const res = QuizAttemptSchema.safeParse(a)
      return res.success ? res.data : null
    }).filter((a: any): a is QuizAttempt => a !== null)
  },

  async createQuizAttempt(quizId: string, score: number, totalQuestions: number, weakTopics: string[]): Promise<QuizAttempt> {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        user_id: MOCK_USER_ID,
        score,
        total_questions: totalQuestions,
        weak_topics: weakTopics
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create quiz attempt: ${error.message}`)
    return QuizAttemptSchema.parse(data)
  },

  // --- Chat Messages ---
  async getChatMessages(materialId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: true })
    
    if (error) return []
    return (data || []).map((m: any) => {
      const res = ChatMessageSchema.safeParse(m)
      return res.success ? res.data : null
    }).filter((m: any): m is ChatMessage => m !== null)
  },

  async addChatMessage(
    materialId: string,
    role: "user" | "assistant",
    content: string,
    sources: any[] = []
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        material_id: materialId,
        user_id: MOCK_USER_ID,
        role,
        content,
        sources
      })
      .select()
      .single()
    
    if (error) throw new Error(`Failed to add chat message: ${error.message}`)
    return ChatMessageSchema.parse(data)
  },

  async getMaterialOverviewStats(materialId: string): Promise<{
    chunkCount: number
    flashcardCount: number
    masteredFlashcardCount: number
    quizCount: number
  }> {
    const [chunks, flashcards, quizzes] = await Promise.all([
      supabase.from("material_chunks").select("id").eq("material_id", materialId),
      supabase.from("flashcards").select("status").eq("material_id", materialId),
      supabase.from("quizzes").select("id").eq("material_id", materialId)
    ])

    const flashcardsData = flashcards.data || []
    const masteredCount = flashcardsData.filter((f: any) => f.status === "mastered").length

    return {
      chunkCount: chunks.data?.length || 0,
      flashcardCount: flashcardsData.length || 0,
      masteredFlashcardCount: masteredCount,
      quizCount: quizzes.data?.length || 0
    }
  },

  // --- Global Analytics aggregation ---
  async getAnalyticsSummary(preloadedAttempts?: QuizAttempt[], preloadedMaterials?: Material[]) {
    // 1. Fetch attempts, materials, all flashcards status, and all quiz questions in parallel
    const attempts = preloadedAttempts || await this.getQuizAttempts()
    const materials = preloadedMaterials || await this.getMaterials()
    
    const [fcRes, questionsRes] = await Promise.all([
      supabase.from("flashcards").select("status"),
      supabase.from("quiz_questions").select("quiz_id, topic, correct_answer")
    ])
    
    const questions = questionsRes.data || []
    const questionsByQuizMap: Record<string, any[]> = {}
    
    questions.forEach((q: any) => {
      if (q.quiz_id) {
        if (!questionsByQuizMap[q.quiz_id]) {
          questionsByQuizMap[q.quiz_id] = []
        }
        questionsByQuizMap[q.quiz_id].push(q)
      }
    })
    
    // Streak calculations
    const streak = attempts.length > 0 ? Math.min(7, attempts.length) : 0
    
    // Topics mastery
    const topicScores: Record<string, { total: number, correct: number }> = {}
    const weakTopicsMap: Record<string, number> = {}
    
    let totalQuestions = 0
    let totalCorrect = 0
    
    // 3. Process all data synchronously
    for (const a of attempts) {
      totalQuestions += a.total_questions
      totalCorrect += a.score
      
      const quizQuestions = questionsByQuizMap[a.quiz_id] || []
      quizQuestions.forEach((q: any) => {
        if (!topicScores[q.topic]) {
          topicScores[q.topic] = { total: 0, correct: 0 }
        }
        topicScores[q.topic].total++
        // Check weak topics from attempt metadata
        if (a.weak_topics.includes(q.topic)) {
          weakTopicsMap[q.topic] = (weakTopicsMap[q.topic] || 0) + 1
        } else {
          topicScores[q.topic].correct++
        }
      })
    }
    
    // Sort weak topics
    const weakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      
    // Count mastered flashcards
    const masteredFlashcards = fcRes.data?.filter((f: any) => f.status === "mastered").length || 0
    
    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    
    return {
      totalMaterials: materials.length,
      totalQuizzes: attempts.length,
      averageQuizScore: avgScore,
      flashcardsMastered: masteredFlashcards,
      studyStreak: streak,
      weakTopics: weakTopics.slice(0, 3),
      topicMastery: Object.entries(topicScores).map(([name, scores]) => ({
        topic: name,
        mastery: Math.round((scores.correct / scores.total) * 100)
      }))
    }
  }
}
