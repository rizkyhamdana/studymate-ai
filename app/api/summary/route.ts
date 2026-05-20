import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { generateSummary } from "@/lib/openai"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { materialId, regenerate = false } = await req.json()
    
    if (!materialId) {
      return NextResponse.json({ error: "Missing material ID parameter" }, { status: 400 })
    }

    // 1. Check if cached summary exists
    if (!regenerate) {
      const cached = await db.getSummary(materialId)
      if (cached) {
        return NextResponse.json({ summary: cached })
      }
    }

    // 2. Fetch raw text chunks to synthesize
    const chunks = await db.getMaterialChunks(materialId)
    if (chunks.length === 0) {
      return NextResponse.json({ error: "No text chunks found for this material ID" }, { status: 400 })
    }

    const chunkContents = chunks.map(c => c.content)
    
    // 3. Generate summary
    const summaryData = await generateSummary(chunkContents)
    if (!summaryData) {
      return NextResponse.json({ error: "Failed to generate structured summary" }, { status: 500 })
    }

    // 4. Save to Database (or overwrite if regenerate)
    let summaryRecord
    if (regenerate) {
      // Overwrite cached summaries
      const { data: existing } = await supabase
        .from("summaries")
        .select("id")
        .eq("material_id", materialId)
        .single()
        
      if (existing) {
        const { data } = await supabase
          .from("summaries")
          .update(summaryData)
          .eq("material_id", materialId)
          .select()
          .single()
        summaryRecord = data
      } else {
        summaryRecord = await db.createSummary(materialId, summaryData)
      }
    } else {
      summaryRecord = await db.createSummary(materialId, summaryData)
    }

    return NextResponse.json({ summary: summaryRecord })
  } catch (err: any) {
    console.error("Summary API error:", err)
    return NextResponse.json({ error: err.message || "Failed to generate summary" }, { status: 500 })
  }
}
