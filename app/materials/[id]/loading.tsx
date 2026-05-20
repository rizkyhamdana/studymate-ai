"use client"

export default function MaterialDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-16 bg-[rgba(255,255,255,0.04)] rounded" />
          <span className="text-[#4e4e52]">/</span>
          <div className="h-4 w-20 bg-[rgba(255,255,255,0.04)] rounded" />
          <span className="text-[#4e4e52]">/</span>
          <div className="h-4 w-32 bg-[rgba(255,255,255,0.04)] rounded" />
        </div>
        <div className="h-4 w-14 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="flex border-b border-[rgba(255,255,255,0.08)] gap-2 pb-px overflow-x-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-2 shrink-0">
            <div className="w-4 h-4 rounded bg-[rgba(255,255,255,0.04)]" />
            <div className="h-4 w-16 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
        ))}
      </div>

      {/* Overview Skeleton */}
      <div className="space-y-5">
        <div className="card p-5 flex items-center gap-4 bg-[#111113]">
          <div className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3 w-1/4 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card p-4 flex items-center justify-between gap-3 bg-[#111113]">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.04)] rounded" />
                <div className="h-5 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] shrink-0" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-4 bg-[#111113]">
            <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3 w-3/4 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-2 w-full bg-[rgba(255,255,255,0.04)] rounded mt-4" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
              <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
            </div>
          </div>
          <div className="card p-5 space-y-4 bg-[#111113]">
            <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="space-y-2.5 mt-2">
              <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
              <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
