import { Suspense } from "react"
import AnalyticsClient from "@/components/analytics/AnalyticsClient"
import { db } from "@/lib/database"
import AnalyticsLoading from "./loading"

export const dynamic = "force-dynamic"

async function AnalyticsContent() {
  const attempts = await db.getQuizAttempts()
  const stats = await db.getAnalyticsSummary(attempts)

  return <AnalyticsClient stats={stats} attempts={attempts} />
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContent />
    </Suspense>
  )
}
