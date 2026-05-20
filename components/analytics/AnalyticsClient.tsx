"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import {
  BarChart3,
  Award,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Sparkles,
  HelpCircle
} from "lucide-react"

import { QuizAttempt } from "@/lib/validators"

const ChartLoader = ({ label }: { label: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
    <div className="spinner mb-2" />
    <p className="text-xs text-[#85858a]">{label}</p>
  </div>
)

const TopicMasteryChart = dynamic(() => import("@/components/analytics/TopicMasteryChart"), {
  loading: () => <ChartLoader label="Loading topic data..." />
})

const ScoreTimelineChart = dynamic(() => import("@/components/analytics/ScoreTimelineChart"), {
  loading: () => <ChartLoader label="Loading score timeline..." />
})

interface AnalyticsClientProps {
  stats: any
  attempts: QuizAttempt[]
}

export default function AnalyticsClient({ stats, attempts }: AnalyticsClientProps) {
  const loading = false

  const masteryData = stats?.topicMastery?.length > 0 ? stats.topicMastery : [
    { topic: "Model Evaluation", mastery: 85 },
    { topic: "Databases", mastery: 90 },
    { topic: "Machine Learning", mastery: 75 },
    { topic: "Systems Engineering", mastery: 60 }
  ]

  const trendData = attempts.length > 0
    ? attempts.slice().reverse().map((att, idx) => ({
        index: `Test ${idx + 1}`,
        score: Math.round((att.score / att.total_questions) * 100),
        avg: stats?.averageQuizScore || 75
      }))
    : [
        { index: "Test 1", score: 65, avg: 75 },
        { index: "Test 2", score: 80, avg: 75 },
        { index: "Test 3", score: 70, avg: 75 },
        { index: "Test 4", score: 95, avg: 75 }
      ]

  const totalQuestionsAnswered = attempts.reduce((acc, curr) => acc + curr.total_questions, 0)
  const totalCorrectQuestions = attempts.reduce((acc, curr) => acc + curr.score, 0)

  const analyticsCards = [
    { title: "Avg Score", value: `${stats?.averageQuizScore || 0}%`, subtitle: "Target: 80%", icon: Award, accent: "border-l-[#d4a044]" },
    { title: "Mastered", value: stats?.flashcardsMastered || 0, subtitle: "Flashcards", icon: Sparkles, accent: "border-l-purple-500" },
    { title: "Quizzes", value: stats?.totalQuizzes || 0, subtitle: "Completed", icon: HelpCircle, accent: "border-l-blue-400" },
    { title: "Accuracy", value: `${totalCorrectQuestions}/${totalQuestionsAnswered}`, subtitle: "Correct answers", icon: CheckCircle, accent: "border-l-emerald-400" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[#ededef]">Analytics</h1>
        <p className="text-sm text-[#85858a] mt-1">
          Track your learning progress and identify areas for improvement.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((c) => {
          const Icon = c.icon
          return (
            <div key={c.title} className={`card p-5 border-l-2 ${c.accent}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#4e4e52] font-medium">{c.title}</span>
                <Icon className="w-4 h-4 text-[#4e4e52]" />
              </div>
              {loading ? (
                <div className="h-7 w-12 bg-[rgba(255,255,255,0.05)] animate-pulse rounded mt-1" />
              ) : (
                <span className="text-2xl font-display font-bold text-[#ededef] block">{c.value}</span>
              )}
              <span className="text-xs text-[#4e4e52] mt-1 block">{c.subtitle}</span>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topic Mastery */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-display font-semibold text-[#ededef]">Topic Mastery</h2>
              <p className="text-xs text-[#4e4e52] mt-0.5">Average accuracy by subject area.</p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#4e4e52]" />
          </div>

          <div className="h-56 w-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="spinner mb-2" />
                <p className="text-xs text-[#85858a]">Loading topic data...</p>
              </div>
            ) : (
              <TopicMasteryChart data={masteryData} />
            )}
          </div>
        </div>

        {/* Score Timeline */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-display font-semibold text-[#ededef]">Score Timeline</h2>
              <p className="text-xs text-[#4e4e52] mt-0.5">Quiz scores over time vs. average.</p>
            </div>
            <BarChart3 className="w-4 h-4 text-[#4e4e52]" />
          </div>

          <div className="h-56 w-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)] border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
                <div className="spinner mb-2" />
                <p className="text-xs text-[#85858a]">Loading score timeline...</p>
              </div>
            ) : (
              <ScoreTimelineChart data={trendData} />
            )}
          </div>
        </div>
      </div>

      {/* Review Plan + Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Review Plan */}
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-[#ededef]">Review Plan</h2>
            <p className="text-xs text-[#4e4e52] mt-0.5">
              Recommended focus areas based on your quiz performance.
            </p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3 py-1">
                <div className="h-16 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
                <div className="h-16 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
              </div>
            ) : stats?.weakTopics && stats.weakTopics.length > 0 ? (
              stats.weakTopics.map((topic: string, idx: number) => (
                <div key={topic} className="flex gap-3 items-start p-4 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
                  <span className="w-5 h-5 rounded-md bg-[rgba(212,160,68,0.1)] text-[#d4a044] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[13px] font-medium text-[#ededef] block">Review: {topic}</span>
                    <p className="text-xs text-[#4e4e52] mt-0.5 leading-relaxed">
                      You missed questions in this area. Try the flashcards or ask the AI tutor to explain key concepts.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
                <span className="text-[13px] font-medium text-[#ededef] block">Review Machine Learning</span>
                <p className="text-xs text-[#4e4e52] mt-0.5">
                  Run practice quizzes to get personalized review recommendations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-display font-semibold text-[#ededef]">Weak Areas</h2>
              <AlertTriangle className="w-4 h-4 text-[#4e4e52]" />
            </div>
            <p className="text-xs text-[#4e4e52]">
              Topics that need more attention.
            </p>
          </div>

          <div className="flex-1 space-y-2 mt-2">
            {loading ? (
              <div className="space-y-2 py-1">
                <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
                <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse rounded-lg" />
              </div>
            ) : stats?.weakTopics && stats.weakTopics.length > 0 ? (
              stats.weakTopics.map((topic: string) => (
                <div key={topic} className="flex items-center justify-between p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
                  <span className="text-xs font-medium text-[#85858a]">{topic}</span>
                  <span className="badge badge-danger">Needs review</span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[#19191d] border border-dashed border-[rgba(255,255,255,0.08)] text-center">
                <span className="text-xs font-medium text-emerald-400 block">All clear</span>
                <p className="text-[11px] text-[#4e4e52] mt-1">
                  No weak areas identified. Keep it up!
                </p>
              </div>
            )}
          </div>

          <Link href="/materials" className="btn-primary w-full justify-center">
            <BookOpen className="w-4 h-4" />
            <span>Go to Library</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
