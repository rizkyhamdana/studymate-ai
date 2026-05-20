import { Suspense } from "react"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { db } from "@/lib/database"
import DashboardLoading from "./loading"

export const dynamic = "force-dynamic"

async function DashboardContent() {
  const materials = await db.getMaterials()
  const attempts = await db.getQuizAttempts()
  const stats = await db.getAnalyticsSummary(attempts, materials)

  return (
    <DashboardClient
      materials={materials}
      stats={stats}
      attempts={attempts.slice(0, 3)}
    />
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
