import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    let materials = await db.getMaterials()
    
    // --- SERVER-SIDE SEEDER ---
    // If the mock database is completely empty, pre-seed a rich Machine Learning material
    // entirely on the server to avoid client-side network roundtrip delays.
    if (materials.length === 0) {
      console.log("Empty mock database. Seeding sample portfolio data on the server...")
      const mockMaterial = await db.createMaterial(
        "Introduction to Machine Learning and Overfitting",
        "introduction_to_machine_learning.pdf",
        1048576, // 1MB
        3
      )
      
      // Seed semantic chunks
      const sampleChunks = [
        {
          material_id: mockMaterial.id,
          content: "A neural network is a network or circuit of artificial neurons, or in a modern sense, an artificial neural network, composed of artificial nodes. These structures isolate complexity, facilitating rapid iterations.",
          page_number: 1,
          chunk_index: 0,
          token_estimate: 80,
          embedding: new Array(1536).fill(0).map((_, i) => Math.sin(i))
        },
        {
          material_id: mockMaterial.id,
          content: "In PostgreSQL, enabling the pgvector extension allows indexing using an IVFFlat or HNSW structure, making high-dimensional Cosine distance calculations extremely fast.",
          page_number: 2,
          chunk_index: 1,
          token_estimate: 70,
          embedding: new Array(1536).fill(0).map((_, i) => Math.cos(i))
        },
        {
          material_id: mockMaterial.id,
          content: "A model that achieves 99% training accuracy but falls to 60% on validation is demonstrating overfitting. To mitigate overfitting, apply regularization, simplify the architecture, or enrich the dataset.",
          page_number: 3,
          chunk_index: 2,
          token_estimate: 90,
          embedding: new Array(1536).fill(0).map((_, i) => Math.sin(i + 1))
        }
      ]
      await db.createMaterialChunks(sampleChunks)
      
      // Seed summaries
      await db.createSummary(mockMaterial.id, {
        short_summary: "This study material covers fundamental machine learning concepts, detailing systems architectures, vector database search indexing via pgvector, and the mechanics of model overfitting.",
        detailed_summary: "The material establishes a complete learning framework for modern computing. Chapter 1 introduces core systems engineering patterns that isolate complexity and enforce consistency. Chapter 2 dives into advanced indexing utilizing vector databases and pgvector to compute high-dimensional Cosine distances. It further analyzes model overfitting, illustrating how a 99% training accuracy that plummets to 60% in validation shows failure to generalize. Solutions such as regularization, simplification, and dataset expansion are recommended to build highly resilient systems.",
        key_points: [
          "Vector databases speed up query retrieval using high-dimensional cosine similarity matching.",
          "Overfitting is diagnosed when high training accuracy is paired with poor validation accuracy.",
          "Mitigation strategies for overfitting include applying L1/L2 regularization, simplifying networks, and adding diverse data.",
          "Enforcing modular design systems prevents regressions and speeds up component iterations."
        ],
        important_terms: [
          { term: "Vector Database", definition: "A storage index for high-dimensional vectors that enables rapid semantic retrieval." },
          { term: "Model Overfitting", definition: "A state where an ML model memorizes training noise rather than learning generalizable patterns." },
          { term: "Cosine Distance", definition: "A metric that measures the angular difference between two high-dimensional vectors." }
        ],
        learning_path: [
          "Review foundational systems engineering guidelines and design principles.",
          "Study the mathematical formulas governing cosine similarity and vector spaces.",
          "Analyze model performance plots to detect and correct validation deviations.",
          "Apply regularization techniques on overfitting models in real test runs."
        ]
      })
      
      // Seed flashcards
      await db.createFlashcards(mockMaterial.id, [
        { front: "What is model overfitting?", back: "An ML issue where a model achieves high training accuracy but performs poorly on validation, having memorized training noise.", difficulty: "easy", topic: "Machine Learning" },
        { front: "Explain how pgvector accelerates search.", back: "It enables indexing vector columns using IVFFlat or HNSW list indexing, making cosine distance calculations extremely fast.", difficulty: "medium", topic: "Databases" },
        { front: "What are 3 ways to mitigate overfitting?", back: "1. Apply L1/L2 regularization. 2. Simplify the neural architecture. 3. Expand and diversify the training dataset.", difficulty: "hard", topic: "Model Evaluation" }
      ])
      
      // Seed quizzes and quiz attempts
      const quiz = await db.createQuiz(mockMaterial.id, "Practice Quiz", [
        {
          question: "When a machine learning model shows 99% training accuracy but only 60% validation accuracy, what issue is it demonstrating?",
          type: "multiple_choice",
          options: ["Underfitting", "Overfitting", "Data Leakage", "Gradient Explosion"],
          correct_answer: "Overfitting",
          explanation: "Overfitting happens when a model fits too closely to the training data, memorizing its noise and failing to generalize to validation data.",
          difficulty: "easy",
          topic: "Model Evaluation",
          source_reference: { page_number: 3, chunk_index: 2 }
        },
        {
          question: "Which of the following database extensions enables high-dimensional vector search index capabilities inside PostgreSQL?",
          type: "multiple_choice",
          options: ["pgvector", "postgis", "hstore", "uuid-ossp"],
          correct_answer: "pgvector",
          explanation: "pgvector is the standard open-source vector extension that enables storing, querying, and indexing high-dimensional embeddings inside PostgreSQL.",
          difficulty: "easy",
          topic: "Databases",
          source_reference: { page_number: 2, chunk_index: 1 }
        }
      ])
      
      // Record some attempts to populate the Recharts score charts
      await db.createQuizAttempt(quiz.id, 1, 2, ["Model Evaluation"])
      await db.createQuizAttempt(quiz.id, 2, 2, [])
      
      // Reload fresh materials since they have been seeded
      materials = await db.getMaterials()
    }

    const attempts = await db.getQuizAttempts()
    const stats = await db.getAnalyticsSummary(attempts, materials)

    return NextResponse.json({ materials, stats, attempts })
  } catch (err: any) {
    console.error("Dashboard API dynamic GET error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to fetch dashboard data bundle" },
      { status: 500 }
    )
  }
}
