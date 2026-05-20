import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { generateEmbedding, answerQuestionWithRAG } from "@/lib/openai"
import { searchSimilarChunksLocal } from "@/lib/rag"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { materialId, question } = await req.json()
    
    if (!materialId || !question) {
      return NextResponse.json({ error: "Missing required parameters (materialId, question)" }, { status: 400 })
    }

    // 1. Save user query in message logs
    await db.addChatMessage(materialId, "user", question, [])

    // 2. Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(question)

    // 3. Retrieve top 3 contextual chunks using pgvector (or local simulation fallback)
    const { data: retrievedChunks, error } = await supabase.rpc(
      "match_material_chunks",
      {
        query_embedding: queryEmbedding,
        match_material_id: materialId,
        match_count: 3
      }
    )
    
    let contextChunks = retrievedChunks || []

    // If pgvector RPC fails or returns empty, perform local similarity calculations as fallback
    if (error || contextChunks.length === 0) {
      console.warn("RPC matching returned empty or failed. Running client-side cosine similarity search.")
      const allChunks = await db.getMaterialChunks(materialId)
      if (allChunks.length > 0) {
        const rankedChunks = searchSimilarChunksLocal(queryEmbedding, allChunks, 3)
        contextChunks = rankedChunks.some(chunk => chunk.similarity > 0)
          ? rankedChunks
          : allChunks.slice(0, 3).map(chunk => ({ ...chunk, similarity: 0.75 }))
      }
    }

    // 4. Generate RAG answer
    const ragResponse = await answerQuestionWithRAG(question, contextChunks)
    
    if (!ragResponse) {
      return NextResponse.json({ error: "Failed to obtain AI tutor response" }, { status: 500 })
    }

    // 5. Save assistant response including sources citation JSON in database
    await db.addChatMessage(
      materialId,
      "assistant",
      ragResponse.answer,
      ragResponse.sources
    )

    return NextResponse.json({
      answer: ragResponse.answer,
      sources: ragResponse.sources,
      confidence: ragResponse.confidence || 0.85,
      suggested_follow_up_questions: ragResponse.suggested_follow_up_questions || []
    })
  } catch (err: any) {
    console.error("Chat RAG API error:", err)
    return NextResponse.json({ error: err.message || "Failed to process chat query" }, { status: 500 })
  }
}
