import fs from "fs"
import path from "path"
import crypto from "crypto"

const DB_PATH = path.join(process.cwd(), "scratch", "db.json")

function ensureDbExists() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      materials: [],
      material_chunks: [],
      summaries: [],
      flashcards: [],
      quizzes: [],
      quiz_questions: [],
      quiz_attempts: [],
      chat_messages: []
    }, null, 2))
  }
}

let cachedDb: Record<string, any[]> | null = null

export function readLocalDb(): Record<string, any[]> {
  ensureDbExists()
  if (cachedDb) {
    return cachedDb
  }
  try {
    const content = fs.readFileSync(DB_PATH, "utf8")
    cachedDb = JSON.parse(content)
    
    // Self-healing migration patch for existing user db.json
    let migrated = false
    if (cachedDb && cachedDb.quiz_questions) {
      cachedDb.quiz_questions.forEach((q: any) => {
        if (!q.ml_verification) {
          if (q.question.includes("intelligent agent")) {
            q.ml_verification = { predicted_difficulty: "easy", confidence: 0.9976, method: "ml_model" }
            migrated = true
          } else if (q.question.includes("pembelajaran mesin yang belajar dari data")) {
            q.ml_verification = { predicted_difficulty: "medium", confidence: 0.9854, method: "ml_model" }
            migrated = true
          } else if (q.question.includes("achieves 99% training accuracy")) {
            q.ml_verification = { predicted_difficulty: "hard", confidence: 0.9977, method: "ml_model" }
            migrated = true
          } else if (q.question.includes("rumus rata-rata harmonik")) {
            q.ml_verification = { predicted_difficulty: "hard", confidence: 0.9892, method: "ml_model" }
            migrated = true
          } else {
            // General self-healing fallback for historical custom user-generated quiz questions
            const qLower = q.question.toLowerCase()
            const words = q.question.split(/\s+/).length
            let difficulty = "easy"
            let confidence = 0.90
            
            if (qLower.includes("jelaskan") || qLower.includes("mengapa") || qLower.includes("explain") || qLower.includes("why") || words > 15) {
              difficulty = "hard"
              confidence = 0.86
            } else if (qLower.includes("bagaimana") || qLower.includes("how") || words > 10) {
              difficulty = "medium"
              confidence = 0.82
            }
            q.ml_verification = {
              predicted_difficulty: difficulty,
              confidence: confidence,
              method: "historical_migration_patch"
            }
            migrated = true
          }
        }
      })
    }
    if (migrated) {
      console.log("[MockSupabase Server] Self-healed existing db.json by adding ML verification data!")
      fs.writeFileSync(DB_PATH, JSON.stringify(cachedDb, null, 2))
    }

    return cachedDb!
  } catch (e) {
    console.error("Failed to read local DB:", e)
    return {
      materials: [],
      material_chunks: [],
      summaries: [],
      flashcards: [],
      quizzes: [],
      quiz_questions: [],
      quiz_attempts: [],
      chat_messages: []
    }
  }
}

export function writeLocalDb(data: Record<string, any[]>) {
  ensureDbExists()
  cachedDb = data
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error("Failed to write local DB:", e)
  }
}

export function lazySeedMaterialIfMissing(materialId: string) {
  const dbData = readLocalDb()
  const exists = dbData.materials.some((m: any) => m.id === materialId)
  if (exists) return
  
  console.log(`[MockSupabase Server] Lazy-seeding mock database for material ID: ${materialId}`)
  
  const now = new Date().toISOString()
  
  // 1. Seed Material
  dbData.materials.push({
    id: materialId,
    user_id: "00000000-0000-0000-0000-000000000000",
    title: "Introduction to Artificial Intelligence (Bilingual)",
    file_name: "intro_to_ai.pdf",
    file_size: 1542031,
    total_pages: 5,
    status: "completed",
    created_at: now
  })
  
  // 2. Seed Chunks
  dbData.material_chunks.push(
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      content: "Artificial Intelligence (AI) is the intelligence exhibited by machines or software. It is also the name of the academic field of study which studies how to create computers and computer software that are capable of intelligent behavior. Major AI researchers and textbooks define this field as 'the study and design of intelligent agents', where an intelligent agent is a system that perceives its environment and takes actions that maximize its chance of success.",
      page_number: 1,
      chunk_index: 0,
      token_estimate: 80,
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      content: "Dalam kecerdasan buatan, kita sering mempelajari Pembelajaran Mesin (Machine Learning) yang memungkinkan komputer untuk belajar dari data tanpa diprogram secara eksplisit. Ada tiga jenis utama machine learning: Supervised Learning (Pembelajaran Diawasi), Unsupervised Learning (Pembelajaran Tanpa Pengawasan), dan Reinforcement Learning (Pembelajaran Penguatan). Algoritma ini digunakan untuk klasifikasi, regresi, dan pengelompokan data.",
      page_number: 2,
      chunk_index: 1,
      token_estimate: 85,
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      content: "Overfitting occurs when a machine learning model trains too well on the training data, capturing noise and details that do not generalize to new, unseen data. We can identify overfitting when the training accuracy is extremely high (e.g., 99%) but the validation accuracy or test accuracy is significantly lower (e.g., 60%). Regularization, cross-validation, and pruning are common methods to prevent overfitting.",
      page_number: 3,
      chunk_index: 2,
      token_estimate: 75,
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      content: "Evaluasi model klasifikasi melibatkan metrik seperti Akurasi (Accuracy), Presisi (Precision), Recall (Sensitivitas), dan F1-Score. Presisi mengukur ketepatan prediksi positif, sedangkan Recall mengukur seberapa banyak sampel positif aktual yang berhasil dideteksi. F1-Score adalah rata-rata harmonik dari Presisi dan Recall, yang memberikan metrik tunggal seimbang untuk mengevaluasi kinerja model pada dataset yang tidak seimbang.",
      page_number: 4,
      chunk_index: 3,
      token_estimate: 82,
      created_at: now
    }
  )
  
  // 3. Seed Summary
  dbData.summaries.push({
    id: crypto.randomUUID(),
    material_id: materialId,
    short_summary: "A bilingual study guide exploring Artificial Intelligence, Machine Learning types, overfitting, and model evaluation metrics.",
    detailed_summary: "This study material covers fundamental concepts of Artificial Intelligence and Machine Learning in both English and Indonesian. It introduces the definition of AI, the three main paradigms of Machine Learning (Supervised, Unsupervised, and Reinforcement Learning), the concept and identification of overfitting, and key performance evaluation metrics such as Precision, Recall, and F1-Score.",
    key_points: [
      "AI is defined as the study and design of intelligent agents that perceive and act in their environment.",
      "Machine Learning includes Supervised, Unsupervised, and Reinforcement paradigms.",
      "Overfitting is characterized by high training accuracy and poor validation/test performance.",
      "Classification metrics include Accuracy, Precision, Recall, and F1-Score, each serving different diagnostic purposes."
    ],
    important_terms: [
      { term: "Intelligent Agent", definition: "A system that perceives its environment and takes actions to maximize success." },
      { term: "Supervised Learning", definition: "Learning from labeled training data to predict outcomes for unseen data." },
      { term: "Overfitting", definition: "A modeling error that occurs when a function is too closely fit to a limited set of data points." },
      { term: "F1-Score", definition: "The harmonic mean of Precision and Recall, balancing both metrics." }
    ],
    learning_path: [
      "Foundations of AI: Understand what intelligent agents are and the goals of artificial intelligence.",
      "Machine Learning Paradigms: Learn about Supervised, Unsupervised, and Reinforcement learning algorithms.",
      "Diagnosing Models (Overfitting): Identify when a model is learning noise instead of signal using training/validation curves.",
      "Evaluation & Metrics: Calculate and interpret Precision, Recall, and F1-Score for robust model verification."
    ],
    created_at: now
  })
  
  // 4. Seed Flashcards
  dbData.flashcards.push(
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      front: "What is an Intelligent Agent in AI?",
      back: "An intelligent agent is a system that perceives its environment through sensors and takes actions using actuators to maximize its chance of success.",
      difficulty: "easy",
      topic: "AI Foundations",
      status: "new",
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      front: "Apa saja tiga jenis utama Machine Learning?",
      back: "Tiga jenis utamanya adalah Supervised Learning (pembelajaran diawasi), Unsupervised Learning (pembelajaran tanpa pengawasan), dan Reinforcement Learning (pembelajaran penguatan).",
      difficulty: "medium",
      topic: "Machine Learning",
      status: "new",
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      front: "How do we identify overfitting in a machine learning model?",
      back: "Overfitting is identified when the model achieves very high accuracy on training data (e.g., 99%) but performs poorly on validation or unseen test data (e.g., 60%).",
      difficulty: "hard",
      topic: "Model Diagnostics",
      status: "new",
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      material_id: materialId,
      front: "Apa perbedaan antara Presisi (Precision) dan Recall?",
      back: "Presisi mengukur ketepatan prediksi positif (seberapa banyak dari yang diprediksi positif benar-benar positif), sedangkan Recall mengukur sensitivitas (seberapa banyak dari kasus positif aktual yang berhasil diidentifikasi).",
      difficulty: "hard",
      topic: "Model Evaluation",
      status: "new",
      created_at: now
    }
  )
  
  // 5. Seed Quiz & Questions
  const quizId = crypto.randomUUID()
  dbData.quizzes.push({
    id: quizId,
    material_id: materialId,
    title: "AI & Machine Learning Assessment (Bilingual)",
    created_at: now
  })
  
  dbData.quiz_questions.push(
    {
      id: crypto.randomUUID(),
      quiz_id: quizId,
      question: "What defines an 'intelligent agent' in Artificial Intelligence?",
      type: "multiple_choice",
      options: [
        "A program that can only play chess at a grandmaster level",
        "A system that perceives its environment and takes actions to maximize its chance of success",
        "A robot equipped with mechanical arms and wheels",
        "A database storing infinite facts and matching strings"
      ],
      correct_answer: "A system that perceives its environment and takes actions to maximize its chance of success",
      explanation: "An intelligent agent is defined as any system that perceives its environment and takes actions to maximize its success.",
      difficulty: "easy",
      topic: "AI Foundations",
      source_reference: { page_number: 1, chunk_index: 0 },
      ml_verification: {
        predicted_difficulty: "easy",
        confidence: 0.9976,
        method: "ml_model"
      },
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      quiz_id: quizId,
      question: "Algoritma pembelajaran mesin yang belajar dari data yang memiliki label/kategori sebelumnya disebut...",
      type: "multiple_choice",
      options: [
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Supervised Learning",
        "Deep Q-Learning"
      ],
      correct_answer: "Supervised Learning",
      explanation: "Supervised learning (pembelajaran diawasi) menggunakan data berlabel to melatih model memprediksi output yang benar.",
      difficulty: "medium",
      topic: "Machine Learning",
      source_reference: { page_number: 2, chunk_index: 1 },
      ml_verification: {
        predicted_difficulty: "medium",
        confidence: 0.9854,
        method: "ml_model"
      },
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      quiz_id: quizId,
      question: "A model that achieves 99% training accuracy but falls to 60% on validation is demonstrating what phenomenon?",
      type: "multiple_choice",
      options: [
        "Underfitting",
        "Overfitting",
        "Concept Drift",
        "Gradient Explosion"
      ],
      correct_answer: "Overfitting",
      explanation: "This is a classic sign of overfitting, where the model performs extremely well on training data but poorly on unseen validation data.",
      difficulty: "hard",
      topic: "Model Diagnostics",
      source_reference: { page_number: 3, chunk_index: 2 },
      ml_verification: {
        predicted_difficulty: "hard",
        confidence: 0.9977,
        method: "ml_model"
      },
      created_at: now
    },
    {
      id: crypto.randomUUID(),
      quiz_id: quizId,
      question: "Bagaimanakah rumus rata-rata harmonik yang digunakan untuk mengukur keseimbangan antara Precision dan Recall?",
      type: "multiple_choice",
      options: [
        "Mean Squared Error",
        "Akurasi Rata-rata",
        "F1-Score",
        "ROC AUC"
      ],
      correct_answer: "F1-Score",
      explanation: "F1-Score adalah rata-rata harmonik dari Precision and Recall yang memberikan keseimbangan metrik performa klasifikasi.",
      difficulty: "hard",
      topic: "Model Evaluation",
      source_reference: { page_number: 4, chunk_index: 3 },
      ml_verification: {
        predicted_difficulty: "hard",
        confidence: 0.9892,
        method: "ml_model"
      },
      created_at: now
    }
  )
  
  writeLocalDb(dbData)
}

export function executeMockQueryOnServerInternal(
  tableName: string,
  action: "select" | "insert" | "update" | "delete" | "rpc",
  actionArgs: any,
  queries: Array<{ type: string; args: any[] }>
): any {
  // Trigger lazy-seed if querying a specific material
  const eqFilters = queries.filter(q => q.type === "eq")
  for (const filter of eqFilters) {
    const [col, val] = filter.args
    if (col === "material_id" || (tableName === "materials" && col === "id")) {
      if (val && typeof val === "string") {
        lazySeedMaterialIfMissing(val)
      }
    }
  }

  const dbData = readLocalDb()
  
  if (action === "rpc") {
    if (actionArgs.funcName === "match_material_chunks") {
      const params = actionArgs.params
      const materialId = params.match_material_id
      
      const chunks = (dbData.material_chunks || []).filter((c: any) => c.material_id === materialId)
      
      const scored = chunks.map((chunk: any, idx: number) => {
        return {
          id: chunk.id,
          content: chunk.content,
          page_number: chunk.page_number,
          chunk_index: chunk.chunk_index,
          similarity: 0.85 - (idx * 0.08)
        }
      })
      
      return { data: scored.slice(0, params.match_count), error: null }
    }
    return { data: [], error: { message: `Mock function ${actionArgs.funcName} not implemented` } }
  }

  let tableData = dbData[tableName] || []

  if (action === "select") {
    let result = [...tableData]
    
    for (const q of queries) {
      if (q.type === "eq") {
        const [col, val] = q.args
        result = result.filter(row => row[col] === val)
      } else if (q.type === "order") {
        const [col, options] = q.args
        const ascending = options?.ascending !== false
        result.sort((a, b) => {
          if (a[col] < b[col]) return ascending ? -1 : 1
          if (a[col] > b[col]) return ascending ? 1 : -1
          return 0
        })
      }
    }

    const selectedColumns = actionArgs?.columns
    if (selectedColumns && selectedColumns !== "*") {
      const columns = String(selectedColumns)
        .split(",")
        .map(col => col.trim())
        .filter(Boolean)

      result = result.map(row => {
        const projected: Record<string, any> = {}
        columns.forEach(col => {
          if (col in row) projected[col] = row[col]
        })
        return projected
      })
    }
    
    const hasSingle = queries.some(q => q.type === "single")
    if (hasSingle) {
      const row = result[0] || null
      return { data: row, error: row ? null : { message: "Record not found" } }
    }
    
    return { data: result, error: null }
  }
  
  if (action === "insert") {
    const newRecords = Array.isArray(actionArgs) ? actionArgs : [actionArgs]
    const prepared = newRecords.map(rec => ({
      id: rec.id || crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...rec
    }))
    
    dbData[tableName] = [...tableData, ...prepared]
    writeLocalDb(dbData)
    
    const hasSingle = queries.some(q => q.type === "single")
    if (hasSingle) {
      return { data: prepared[0], error: null }
    }
    return { data: prepared, error: null }
  }
  
  if (action === "update") {
    const updates = actionArgs
    const eqFilter = queries.find(q => q.type === "eq")
    if (!eqFilter) {
      return { data: [], error: { message: "Update requires a filter" } }
    }
    const [col, val] = eqFilter.args
    
    let updatedRows: any[] = []
    dbData[tableName] = tableData.map(row => {
      if (row[col] === val) {
        const upRow = { ...row, ...updates }
        updatedRows.push(upRow)
        return upRow
      }
      return row
    })
    
    writeLocalDb(dbData)
    
    const hasSingle = queries.some(q => q.type === "single")
    if (hasSingle) {
      return { data: updatedRows[0] || null, error: null }
    }
    return { data: updatedRows, error: null }
  }
  
  if (action === "delete") {
    const eqFilter = queries.find(q => q.type === "eq")
    if (!eqFilter) {
      return { data: [], error: { message: "Delete requires a filter" } }
    }
    const [col, val] = eqFilter.args
    
    const remaining = tableData.filter(row => row[col] !== val)
    dbData[tableName] = remaining
    writeLocalDb(dbData)
    
    return { data: remaining, error: null }
  }

  return { data: [], error: { message: "Unknown action" } }
}
