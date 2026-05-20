import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Missing material ID parameter" }, { status: 400 })
    }

    const section = req.nextUrl.searchParams.get("section")
    const material = await db.getMaterial(id)
    if (!material) {
      return NextResponse.json({ error: "Material study guide not found" }, { status: 404 })
    }

    if (section === "summary") {
      const summary = await db.getSummary(id)
      return NextResponse.json({ summary })
    }

    if (section === "flashcards") {
      const flashcards = await db.getFlashcards(id)
      return NextResponse.json({ flashcards })
    }

    if (section === "quiz") {
      const quizRows = await db.getQuizzes(id)
      const quizzes = await Promise.all(
        quizRows.map(async (quiz) => ({
          ...quiz,
          questions: await db.getQuizQuestions(quiz.id)
        }))
      )
      return NextResponse.json({ quizzes })
    }

    if (section === "chat") {
      const chatMessages = await db.getChatMessages(id)
      return NextResponse.json({ chatMessages })
    }

    if (section === "sources") {
      const chunks = await db.getMaterialChunks(id)
      return NextResponse.json({ chunks })
    }

    const [summary, overviewStats] = await Promise.all([
      db.getSummary(id),
      db.getMaterialOverviewStats(id)
    ])

    return NextResponse.json({
      material,
      summary,
      overviewStats
    })
  } catch (err: any) {
    console.error("Material detail dynamic GET error:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch material details" }, { status: 500 })
  }
}
