import { Suspense } from "react"
import MaterialsClient from "@/components/materials/MaterialsClient"
import { db } from "@/lib/database"
import MaterialsLoading from "./loading"

export const dynamic = "force-dynamic"

async function MaterialsContent() {
  const materials = await db.getMaterials()
  return <MaterialsClient materials={materials} />
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={<MaterialsLoading />}>
      <MaterialsContent />
    </Suspense>
  )
}
