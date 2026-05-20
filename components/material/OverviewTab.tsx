import { Material, Summary } from "@/lib/validators"
import { formatBytes, formatDate } from "@/lib/utils"
import {
  FileText,
  Calendar,
  Layers,
  HelpCircle,
  CheckCircle,
  Clock
} from "lucide-react"

interface OverviewTabProps {
  material: Material
  summary: Summary | null
  overviewStats: {
    chunkCount: number
    flashcardCount: number
    masteredFlashcardCount: number
    quizCount: number
  }
  setActiveTab: (tab: string) => void
}

export default function OverviewTab({
  material,
  summary,
  overviewStats,
  setActiveTab
}: OverviewTabProps) {
  const masteredCount = overviewStats.masteredFlashcardCount
  const flashcardCount = overviewStats.flashcardCount
  const masteryPercentage = flashcardCount > 0
    ? Math.round((masteredCount / flashcardCount) * 100)
    : 0

  const quickStats = [
    { title: "Flashcards", value: `${masteredCount}/${flashcardCount}`, desc: `${masteryPercentage}% mastered`, icon: Layers, tab: "flashcards" },
    { title: "Quizzes", value: `${overviewStats.quizCount}`, desc: "Available tests", icon: HelpCircle, tab: "quiz" },
    { title: "Chunks", value: `${overviewStats.chunkCount}`, desc: "Indexed segments", icon: FileText, tab: "sources" }
  ]

  return (
    <div className="space-y-5">
      {/* File Detail */}
      <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#4e4e52]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#ededef]">{material.title}</h3>
            <p className="text-xs text-[#4e4e52] mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {material.total_pages} pages</span>
              <span>·</span>
              <span>{formatBytes(material.file_size)}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(material.created_at)}</span>
            </p>
          </div>
        </div>

        <span className="badge badge-success">Processed</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              onClick={() => setActiveTab(stat.tab)}
              className="card-interactive p-4 flex items-center justify-between gap-3"
            >
              <div>
                <span className="text-xs text-[#4e4e52] font-medium">{stat.title}</span>
                <h4 className="font-display font-bold text-lg text-[#ededef] mt-0.5">{stat.value}</h4>
                <p className="text-[11px] text-[#4e4e52]">{stat.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#4e4e52]" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Study Progress */}
        <div className="card p-5 space-y-4">
          <h4 className="text-sm font-display font-semibold text-[#ededef]">Study Progress</h4>
          <p className="text-xs text-[#4e4e52] leading-relaxed">
            Track your mastery of flashcard concepts.
          </p>

          <div className="pt-1">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-[#85858a]">Mastery rate</span>
              <span className="text-[#d4a044]">{masteryPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#19191d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4a044] rounded-full transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[11px] text-[#4e4e52] block">Mastered</span>
                <span className="text-xs font-semibold text-[#ededef]">{masteredCount} cards</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#4e4e52] shrink-0" />
              <div>
                <span className="text-[11px] text-[#4e4e52] block">Remaining</span>
                <span className="text-xs font-semibold text-[#ededef]">{flashcardCount - masteredCount} cards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-display font-semibold text-[#ededef]">Suggested next steps</h4>
            <p className="text-xs text-[#4e4e52] mt-1">
              Recommended study actions based on your progress.
            </p>
          </div>

          <div className="space-y-3 flex-1 mt-2">
            {summary?.learning_path && summary.learning_path.length > 0 ? (
              summary.learning_path.slice(0, 3).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[rgba(212,160,68,0.1)] text-[#d4a044] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[13px] text-[#85858a] leading-relaxed">{step}</p>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[rgba(212,160,68,0.1)] text-[#d4a044] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-[13px] text-[#85858a] leading-relaxed">Read the summary to understand key concepts.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[rgba(212,160,68,0.1)] text-[#d4a044] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-[13px] text-[#85858a] leading-relaxed">Practice flashcards to reinforce your memory.</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("summary")}
            className="btn-ghost w-full justify-center"
          >
            Start studying
          </button>
        </div>
      </div>
    </div>
  )
}
