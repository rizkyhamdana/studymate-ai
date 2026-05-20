import { NextRequest, NextResponse } from "next/server"
import { executeMockQueryOnServerInternal } from "@/lib/serverDb"

export async function POST(req: NextRequest) {
  try {
    const { table, action, actionArgs, queries } = await req.json()
    const result = executeMockQueryOnServerInternal(table, action, actionArgs, queries)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error("Mock DB API route POST error:", err)
    return NextResponse.json(
      { data: null, error: { message: err.message || "Failed to execute mock database query" } },
      { status: 500 }
    )
  }
}
