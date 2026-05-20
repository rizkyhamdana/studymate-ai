import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    let materials = await db.getMaterials()

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
