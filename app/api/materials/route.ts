import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(req: NextRequest) {
  try {
    const materials = await db.getMaterials()
    return NextResponse.json({ materials })
  } catch (err: any) {
    console.error("Materials list GET error:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch materials list" }, { status: 500 })
  }
}
