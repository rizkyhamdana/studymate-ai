import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const attempts = await db.getQuizAttempts()
    const stats = await db.getAnalyticsSummary(attempts)
    return NextResponse.json({ stats, attempts })
  } catch (err: any) {
    console.error("Analytics API dynamic GET error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to fetch analytics data bundle" },
      { status: 500 }
    )
  }
}
