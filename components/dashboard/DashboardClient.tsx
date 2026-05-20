"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  BookOpen, 
  ChevronRight, 
  Award
} from "lucide-react"
import { Material, QuizAttempt } from "@/lib/validators"
import { formatBytes } from "@/lib/utils"

const QuizScoreChart = dynamic(() => import("@/components/dashboard/QuizScoreChart"), {
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
      <div className="spinner mb-2" />
      <p className="text-xs text-[#85858a]">Loading chart...</p>
    </div>
  )
})

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

interface DashboardClientProps {
  stats: any
  materials: Material[]
  attempts: QuizAttempt[]
}

export default function DashboardClient({
  stats,
  materials,
  attempts
}: DashboardClientProps) {
  const loading = false

  // Pre-process chart data for Recharts (reverse attempts list to show chronological progress)
  const chartData = attempts
    .slice()
    .reverse()
    .map((att, idx) => ({
      index: `Session ${idx + 1}`,
      score: Math.round((att.score / att.total_questions) * 100)
    }))

  // If no attempts exist, seed standard visual points to ensure the chart is populated
  const finalChartData = chartData.length > 0 ? chartData : [
    { index: "Session 1", score: 50 },
    { index: "Session 2", score: 75 },
    { index: "Session 3", score: 100 }
  ]

  const statsCards = [
    { title: "Uploaded Materials", value: stats?.totalMaterials || 0, borderColor: "border-l-[#d4a044]" },
    { title: "Quizzes Taken", value: stats?.totalQuizzes || 0, borderColor: "border-l-emerald-400" },
    { title: "Average Score", value: `${stats?.averageQuizScore || 0}%`, borderColor: "border-l-blue-400" },
    { title: "Cards Mastered", value: stats?.flashcardsMastered || 0, borderColor: "border-l-purple-400" },
  ]

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#ededef]">{getGreeting()}</h1>
          <p className="text-sm text-[#85858a] mt-1">Here's an overview of your study progress and recent activity.</p>
        </div>
        <Link
          href="/upload"
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-[13px] w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Upload PDF</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((c) => (
          <div
            key={c.title}
            className={`card p-5 border-l-2 ${c.borderColor}`}
          >
            <span className="text-xs text-[#4e4e52] font-medium">{c.title}</span>
            {loading ? (
              <div className="h-7 w-12 bg-[rgba(255,255,255,0.05)] animate-pulse rounded mt-2" />
            ) : (
              <span className="block text-2xl font-bold text-[#ededef] mt-2">{c.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Progress Chart Panel */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-display font-semibold text-[#ededef]">Quiz Score Performance</h2>
            <p className="text-[13px] text-[#85858a] mt-0.5">Your practice test scores over time.</p>
          </div>
          
          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="spinner mb-2" />
                <p className="text-xs text-[#85858a]">Loading chart...</p>
              </div>
            ) : (
              <QuizScoreChart data={finalChartData} />
            )}
          </div>
        </div>

        {/* Weak Topics Card */}
        <div className="card p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <h2 className="text-base font-display font-semibold text-[#ededef]">Weak Topics</h2>
            <p className="text-[13px] text-[#85858a] leading-relaxed">
              Topics flagged for review based on your recent quiz results.
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {loading ? (
              <div className="space-y-2 py-2">
                <div className="h-11 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
                <div className="h-11 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
              </div>
            ) : stats?.weakTopics && stats.weakTopics.length > 0 ? (
              stats.weakTopics.map((topic: string) => (
                <div key={topic} className="flex items-center justify-between p-3 rounded-lg bg-[#111113] border border-[rgba(255,255,255,0.05)]">
                  <span className="text-sm font-medium text-[#ededef]">{topic}</span>
                  <span className="text-[11px] font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md">
                    Needs review
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl px-4">
                <span className="text-sm font-medium text-[#85858a] mb-1">No weak topics</span>
                <p className="text-[13px] text-[#4e4e52] leading-relaxed">
                  Great job — no critical weaknesses found in your recent quizzes.
                </p>
              </div>
            )}
          </div>
          
          <Link
            href="/materials"
            className="btn-ghost w-full flex items-center justify-center gap-1.5 py-2.5 text-[13px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Study Materials</span>
          </Link>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-display font-semibold text-[#ededef]">Recent Materials</h2>
            <p className="text-[13px] text-[#85858a] mt-0.5">Your uploaded files and generated content.</p>
          </div>
          <Link href="/materials" className="text-[#d4a044] hover:text-[#e0b25c] text-[13px] font-semibold flex items-center gap-0.5 transition-colors">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.05)]">
          {loading ? (
            <div className="space-y-3 py-1">
              <div className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
              <div className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
            </div>
          ) : materials.length > 0 ? (
            materials.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#19191d] flex items-center justify-center shrink-0 border border-[rgba(255,255,255,0.05)]">
                    <FileText className="w-4 h-4 text-[#4e4e52]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-[#ededef] truncate">
                      <Link href={`/materials/${m.id}`} className="hover:text-[#d4a044] transition-colors">{m.title}</Link>
                    </h4>
                    <p className="text-xs text-[#4e4e52] mt-0.5 flex items-center gap-2">
                      <span>{m.total_pages} pages</span>
                      <span>&bull;</span>
                      <span>{formatBytes(m.file_size)}</span>
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/materials/${m.id}`}
                  className="text-[13px] font-semibold text-[#d4a044] hover:text-[#e0b25c] transition-colors flex items-center gap-0.5 shrink-0"
                >
                  <span>Study</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-[#4e4e52]">
              No study materials uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
