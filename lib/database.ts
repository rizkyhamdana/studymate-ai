import supabase from "./supabase"
import { Material, MaterialChunk, Summary, Flashcard, Quiz, QuizQuestion, QuizAttempt, ChatMessage } from "./validators"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000"

export const db = {
  // --- Materials ---
  async getMaterials(): Promise<Material[]> {
    const [materialsRes, flashcardsRes, quizzesRes, chunksRes] = await Promise.all([
      supabase
        .from("materials")
        .select("id, user_id, title, file_url, file_name, file_size, total_pages, status, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("flashcards").select("material_id"),
      supabase.from("quizzes").select("material_id"),
      supabase.from("material_chunks").select("material_id")
    ])
    
    if (materialsRes.error) console.error("Error fetching materials:", materialsRes.error)
    
    const materials = materialsRes.data || []
    const flashcards = flashcardsRes.data || []
    const quizzes = quizzesRes.data || []
    const chunks = chunksRes.data || []
    
    const fcMap: Record<string, number> = {}
    const qzMap: Record<string, number> = {}
    const chMap: Record<string, number> = {}
    
    flashcards.forEach((fc: any) => {
      if (fc.material_id) {
        fcMap[fc.material_id] = (fcMap[fc.material_id] || 0) + 1
      }
    })
    
    quizzes.forEach((qz: any) => {
      if (qz.material_id) {
        qzMap[qz.material_id] = (qzMap[qz.material_id] || 0) + 1
      }
    })
    
    chunks.forEach((ch: any) => {
      if (ch.material_id) {
        chMap[ch.material_id] = (chMap[ch.material_id] || 0) + 1
      }
    })
    
    materials.forEach((m: Material) => {
      m.flashcard_count = fcMap[m.id] || 0
      m.quiz_count = qzMap[m.id] || 0
      m.chunk_count = chMap[m.id] || 0
    })
    
    return materials
  },

  async getMaterial(id: string): Promise<Material | null> {
    const { data, error } = await supabase
      .from("materials")
      .select("id, user_id, title, file_url, file_name, file_size, total_pages, status, created_at")
      .eq("id", id)
      .single()
      
    if (error) {
      console.error("Error fetching material:", error)
      return null
    }
    return data
  },

  async createMaterial(title: string, fileName: string, fileSize: number, totalPages: number): Promise<Material> {
    const materialData = {
      user_id: MOCK_USER_ID,
      title,
      file_name: fileName,
      file_size: fileSize,
      total_pages: totalPages,
      status: "completed" // In mock environment we mark completed immediately, in active upload we process
    }
    
    const { data } = await supabase
      .from("materials")
      .insert(materialData)
      .select()
      .single()
      
    return data
  },

  async updateMaterialStatus(id: string, status: "processing" | "completed" | "failed"): Promise<void> {
    await supabase
      .from("materials")
      .update({ status })
      .eq("id", id)
  },

  // --- Chunks ---
  async createMaterialChunks(chunks: Omit<MaterialChunk, "id" | "created_at">[]): Promise<void> {
    await supabase.from("material_chunks").insert(chunks)
  },

  async getMaterialChunks(materialId: string): Promise<MaterialChunk[]> {
    const { data } = await supabase
      .from("material_chunks")
      .select("id, material_id, content, page_number, chunk_index, token_estimate, created_at")
      .eq("material_id", materialId)
      .order("chunk_index", { ascending: true })
    return data || []
  },

  async getMaterialOverviewStats(materialId: string): Promise<{
    chunkCount: number
    flashcardCount: number
    masteredFlashcardCount: number
    quizCount: number
  }> {
    const [chunksRes, flashcardsRes, quizzesRes] = await Promise.all([
      supabase.from("material_chunks").select("material_id").eq("material_id", materialId),
      supabase.from("flashcards").select("status").eq("material_id", materialId),
      supabase.from("quizzes").select("id").eq("material_id", materialId)
    ])

    const flashcards = flashcardsRes.data || []

    return {
      chunkCount: chunksRes.data?.length || 0,
      flashcardCount: flashcards.length,
      masteredFlashcardCount: flashcards.filter((f: any) => f.status === "mastered").length,
      quizCount: quizzesRes.data?.length || 0
    }
  },

  // --- Summaries ---
  async getSummary(materialId: string): Promise<Summary | null> {
    const { data } = await supabase
      .from("summaries")
      .select("*")
      .eq("material_id", materialId)
      .single()
    return data
  },

  async createSummary(materialId: string, summary: Omit<Summary, "id" | "material_id" | "created_at">): Promise<Summary> {
    const { data } = await supabase
      .from("summaries")
      .insert({
        material_id: materialId,
        ...summary
      })
      .select()
      .single()
    return data
  },

  // --- Flashcards ---
  async getFlashcards(materialId: string): Promise<Flashcard[]> {
    const { data } = await supabase
      .from("flashcards")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: true })
    return data || []
  },

  async createFlashcards(materialId: string, cards: Omit<Flashcard, "id" | "material_id" | "status" | "created_at">[]): Promise<Flashcard[]> {
    const prepped = cards.map(c => ({
      material_id: materialId,
      status: "new",
      ...c
    }))
    const { data } = await supabase
      .from("flashcards")
      .insert(prepped)
      .select()
    return data || []
  },

  async updateFlashcardStatus(id: string, status: "new" | "mastered" | "review"): Promise<any> {
    const { data } = await supabase
      .from("flashcards")
      .update({ status })
      .eq("id", id)
      .select()
      .single()
    return data
  },

  // --- Quizzes ---
  async getQuizzes(materialId: string): Promise<Quiz[]> {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: false })
    return data || []
  },

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true })
    return data || []
  },

  async createQuiz(
    materialId: string,
    title: string,
    questions: Omit<QuizQuestion, "id" | "quiz_id" | "created_at">[]
  ): Promise<Quiz> {
    const { data: quiz } = await supabase
      .from("quizzes")
      .insert({
        material_id: materialId,
        title
      })
      .select()
      .single()
      
    if (quiz) {
      const preppedQuestions = questions.map(q => ({
        quiz_id: quiz.id,
        ...q
      }))
      await supabase.from("quiz_questions").insert(preppedQuestions)
      quiz.questions = await this.getQuizQuestions(quiz.id)
    }
    
    return quiz
  },

  // --- Quiz Attempts ---
  async getQuizAttempts(): Promise<QuizAttempt[]> {
    const [attemptsRes, quizzesRes] = await Promise.all([
      supabase.from("quiz_attempts").select("*").order("created_at", { ascending: false }),
      supabase.from("quizzes").select("id, title")
    ])
    
    const attempts = attemptsRes.data || []
    const quizzes = quizzesRes.data || []
    const quizMap: Record<string, string> = {}
    
    quizzes.forEach((q: any) => {
      quizMap[q.id] = q.title
    })
    
    attempts.forEach((a: QuizAttempt) => {
      a.quiz_title = quizMap[a.quiz_id] || "Study Quiz"
    })
    
    return attempts
  },

  async createQuizAttempt(quizId: string, score: number, totalQuestions: number, weakTopics: string[]): Promise<QuizAttempt> {
    const { data } = await supabase
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
    return data
  },

  // --- Chat Messages ---
  async getChatMessages(materialId: string): Promise<ChatMessage[]> {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("material_id", materialId)
      .order("created_at", { ascending: true })
    return data || []
  },

  async addChatMessage(
    materialId: string,
    role: "user" | "assistant",
    content: string,
    sources: any[] = []
  ): Promise<ChatMessage> {
    const { data } = await supabase
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
    return data
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
