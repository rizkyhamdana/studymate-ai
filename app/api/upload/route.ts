import { NextRequest, NextResponse } from "next/server"
import { extractTextFromPDF } from "@/lib/pdf"
import { cleanText, chunkText } from "@/lib/chunking"
import { generateEmbedding, generateSummary, generateFlashcards, generateQuiz } from "@/lib/openai"
import { db } from "@/lib/database"
import { isIndonesian } from "@/lib/language"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const customTitle = formData.get("title") as string
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    const title = customTitle || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")
    
    // Convert File to ArrayBuffer
    const bytes = await file.arrayBuffer()
    
    // 1. PDF Text Extraction
    console.log(`Processing upload: ${file.name}`)
    const pages = await extractTextFromPDF(bytes, file.name)
    const totalPages = pages.length

    // 2. Database Record Creation
    const material = await db.createMaterial(title, file.name, file.size, totalPages)
    
    // 3. Text cleaning & semantic overlapping chunking
    const cleanedPages = pages.map(p => ({
      page_number: p.page_number,
      text: cleanText(p.text)
    }))
    
    const chunkOutlines = chunkText(cleanedPages, 800, 150)
    
    // 4. Embedding generation & chunk insertion
    const chunksWithEmbeddings = await Promise.all(
      chunkOutlines.map(async (chunk) => {
        const embedding = await generateEmbedding(chunk.content)
        return {
          material_id: material.id,
          content: chunk.content,
          page_number: chunk.page_number,
          chunk_index: chunk.chunk_index,
          token_estimate: chunk.token_estimate,
          embedding
        }
      })
    )
    
    // Store in Database
    await db.createMaterialChunks(chunksWithEmbeddings)
    
    // 5. Pre-generate Initial Study Guides (Summary, Flashcards, Quiz)
    // We isolate these in a try-catch so even if OpenAI fails/expires, the material upload is preserved
    try {
      const chunkContents = chunksWithEmbeddings.map(c => c.content)
      
      // Generate summary
      const summaryData = await generateSummary(chunkContents)
      if (summaryData) {
        await db.createSummary(material.id, summaryData)
      }
      
      // Generate 5 flashcards
      const cards = await generateFlashcards(chunkContents, 5)
      if (cards && cards.length > 0) {
        await db.createFlashcards(material.id, cards)
      }
      
      // Generate 3 quizzes
      const quizQuestions = await generateQuiz(chunkContents, "all", 3)
      if (quizQuestions && quizQuestions.length > 0) {
        await db.createQuiz(material.id, isIndonesian(`${title} ${chunkContents.join(" ")}`) ? "Kuis Latihan" : "Practice Quiz", quizQuestions)
      }
    } catch (aiErr) {
      console.warn("AI pre-generation failed or timed out during upload. Proceeding with material creation.", aiErr)
    }

    return NextResponse.json({ success: true, materialId: material.id })
  } catch (err: any) {
    console.error("Upload API error:", err)
    return NextResponse.json({ error: err.message || "Failed to process PDF upload" }, { status: 500 })
  }
}
