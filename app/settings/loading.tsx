"use client"

export default function SettingsLoading() {
  return (
    <div className="space-y-8 max-w-2xl animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-[rgba(255,255,255,0.04)] rounded-lg" />
        <div className="h-4 w-72 bg-[rgba(255,255,255,0.03)] rounded-lg" />
      </div>

      {/* System Status Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-24 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-6 w-20 bg-[rgba(255,255,255,0.04)] rounded-full" />
      </div>

      {/* Status Card Skeleton */}
      <div className="card p-5 bg-[#111113]">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded bg-[rgba(255,255,255,0.04)] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3 w-5/6 bg-[rgba(255,255,255,0.03)] rounded" />
          </div>
        </div>
      </div>

      {/* API Configuration Card Skeleton */}
      <div className="card p-6 space-y-6 bg-[#111113]">
        <div className="flex items-center gap-2 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="w-5 h-5 rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-5 w-40 bg-[rgba(255,255,255,0.04)] rounded" />
        </div>

        <div className="space-y-4">
          <div className="h-4 w-32 bg-[rgba(255,255,255,0.04)] rounded" />
          <div className="space-y-2">
            <div className="h-4 w-12 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-10 w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
