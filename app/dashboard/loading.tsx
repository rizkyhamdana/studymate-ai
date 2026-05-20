"use client"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Dashboard Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[rgba(255,255,255,0.04)] rounded-lg" />
          <div className="h-4 w-72 bg-[rgba(255,255,255,0.03)] rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-[rgba(255,255,255,0.04)] rounded-lg" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 border-l-2 border-l-[rgba(255,255,255,0.08)] bg-[#111113]">
            <div className="h-3.5 w-24 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-7 w-12 bg-[rgba(255,255,255,0.04)] rounded mt-3" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Progress Chart Panel Skeleton */}
        <div className="card p-6 lg:col-span-2 space-y-4 bg-[#111113]">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3.5 w-60 bg-[rgba(255,255,255,0.03)] rounded" />
          </div>
          <div className="h-64 w-full bg-[rgba(255,255,255,0.02)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl flex items-center justify-center">
            <div className="spinner mb-2" />
            <p className="text-xs text-[#85858a]">Loading chart...</p>
          </div>
        </div>

        {/* Weak Topics Card Skeleton */}
        <div className="card p-6 bg-[#111113] flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="h-5 w-28 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3.5 w-full bg-[rgba(255,255,255,0.03)] rounded" />
          </div>
          <div className="flex-1 space-y-2 py-2">
            <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
            <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-full bg-[rgba(255,255,255,0.03)] rounded-lg" />
        </div>
      </div>

      {/* Recent Materials Skeleton */}
      <div className="card p-6 bg-[#111113] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3.5 w-48 bg-[rgba(255,255,255,0.03)] rounded" />
          </div>
          <div className="h-4 w-12 bg-[rgba(255,255,255,0.04)] rounded" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
          <div className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
