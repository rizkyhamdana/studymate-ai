"use client"

export default function UploadLoading() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 animate-pulse">
      {/* Page header */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-[rgba(255,255,255,0.04)] rounded-lg" />
        <div className="h-4 w-72 bg-[rgba(255,255,255,0.03)] rounded-lg" />
      </div>

      {/* Dropzone skeleton */}
      <div className="border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl py-16 px-6 flex flex-col items-center justify-center bg-[#111113]">
        <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] mb-4" />
        <div className="h-4 w-48 bg-[rgba(255,255,255,0.04)] rounded mb-2" />
        <div className="h-3 w-64 bg-[rgba(255,255,255,0.03)] rounded mb-6" />
        <div className="h-10 w-28 bg-[rgba(255,255,255,0.04)] rounded-lg" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 w-full bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.05)]" />
    </div>
  )
}
