"use client"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-[rgba(255,255,255,0.04)] rounded-lg" />
        <div className="h-4 w-72 bg-[rgba(255,255,255,0.03)] rounded-lg" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 bg-[#111113] border-l-2 border-l-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3.5 w-16 bg-[rgba(255,255,255,0.04)] rounded" />
              <div className="w-4 h-4 rounded bg-[rgba(255,255,255,0.04)]" />
            </div>
            <div className="h-7 w-12 bg-[rgba(255,255,255,0.04)] rounded block" />
            <div className="h-3 w-16 bg-[rgba(255,255,255,0.03)] rounded mt-2 block" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="card p-6 space-y-4 bg-[#111113]">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4.5 w-28 bg-[rgba(255,255,255,0.04)] rounded" />
                <div className="h-3.5 w-48 bg-[rgba(255,255,255,0.03)] rounded" />
              </div>
              <div className="w-4 h-4 rounded bg-[rgba(255,255,255,0.04)]" />
            </div>
            <div className="h-56 w-full bg-[rgba(255,255,255,0.02)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl flex items-center justify-center">
              <div className="spinner mb-2" />
              <p className="text-xs text-[#85858a]">Loading data...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
