"use client"

export default function MaterialsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-[rgba(255,255,255,0.04)] rounded-lg" />
          <div className="h-4 w-72 bg-[rgba(255,255,255,0.03)] rounded-lg" />
        </div>
        <div className="h-10 w-24 bg-[rgba(255,255,255,0.04)] rounded-lg" />
      </div>

      {/* Search Skeleton */}
      <div className="h-10 w-full max-w-sm bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card p-5 space-y-5 bg-[#111113] border border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)]" />
              <div className="w-16 h-5 rounded bg-[rgba(255,255,255,0.04)]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.04)]" />
              <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.04)]" />
            </div>
            <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] space-y-4">
              <div className="flex gap-4">
                <div className="w-14 h-3.5 rounded bg-[rgba(255,255,255,0.04)]" />
                <div className="w-14 h-3.5 rounded bg-[rgba(255,255,255,0.04)]" />
              </div>
              <div className="h-9 w-full rounded bg-[rgba(255,255,255,0.04)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
