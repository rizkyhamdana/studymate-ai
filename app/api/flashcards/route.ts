import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { generateFlashcards } from "@/lib/openai"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { materialId, count = 5, regenerate = false } = await req.json()
    
    if (!materialId) {
      return NextResponse.json({ error: "Missing material ID parameter" }, { status: 400 })
    }

    if (!regenerate) {
      const cached = await db.getFlashcards(materialId)
      if (cached && cached.length > 0) {
        return NextResponse.json({ flashcards: cached })
      }
    }

    const chunks = await db.getMaterialChunks(materialId)
    if (chunks.length === 0) {
      return NextResponse.json({ error: "No text chunks found for this material" }, { status: 400 })
    }

    const chunkContents = chunks.map(c => c.content)
    const cards = await generateFlashcards(chunkContents, count)
    
    if (!cards || cards.length === 0) {
      return NextResponse.json({ error: "Failed to generate concept flashcards" }, { status: 500 })
    }

    // Save cards
    if (regenerate) {
      // Clean old ones first
      await supabase.from("flashcards").delete().eq("material_id", materialId)
    }

    const flashcards = await db.createFlashcards(materialId, cards)
    return NextResponse.json({ flashcards })
  } catch (err: any) {
    console.error("Flashcards POST error:", err)
    return NextResponse.json({ error: err.message || "Failed to process flashcards request" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { cardId, status } = await req.json()
    
    if (!cardId || !status) {
      return NextResponse.json({ error: "Missing required update parameters (cardId, status)" }, { status: 400 })
    }

    const updatedCard = await db.updateFlashcardStatus(cardId, status)
    return NextResponse.json(updatedCard)
  } catch (err: any) {
    console.error("Flashcard status update PUT error:", err)
    return NextResponse.json({ error: err.message || "Failed to update flashcard status" }, { status: 500 })
  }
}
