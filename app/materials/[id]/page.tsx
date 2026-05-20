import { notFound } from "next/navigation"

import MaterialDetailClient from "@/components/material/MaterialDetailClient"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export default async function MaterialDetailPage({ params }: { params: { id: string } }) {
  const material = await db.getMaterial(params.id)

  if (!material) {
    notFound()
  }

  const [summary, overviewStats] = await Promise.all([
    db.getSummary(params.id),
    db.getMaterialOverviewStats(params.id)
  ])

  return (
    <MaterialDetailClient
      material={material}
      summary={summary}
      overviewStats={overviewStats}
    />
  )
}
