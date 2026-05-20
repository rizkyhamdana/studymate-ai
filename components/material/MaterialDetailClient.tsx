"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Layers, 
  HelpCircle, 
  MessageSquare, 
  Code,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

import { Material, MaterialChunk, Summary, Flashcard, Quiz, ChatMessage } from "@/lib/validators"
import { isIndonesian } from "@/lib/language"
import OverviewTab from "@/components/material/OverviewTab"

const SummaryTab = dynamic(() => import("@/components/material/SummaryTab"))
const FlashcardsTab = dynamic(() => import("@/components/material/FlashcardsTab"))
const QuizTab = dynamic(() => import("@/components/material/QuizTab"))
const ChatTab = dynamic(() => import("@/components/material/ChatTab"))
const SourcesTab = dynamic(() => import("@/components/material/SourcesTab"))

// --- Localized Loading Skeleton Components ---

const OverviewSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {/* File Detail Skeleton */}
    <div className="card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-3 w-1/4 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>
    </div>
    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="card p-4 flex items-center justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-5 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] shrink-0" />
        </div>
      ))}
    </div>
    {/* Two-column detailed skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card p-5 space-y-4">
        <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-3 w-3/4 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-2 w-full bg-[rgba(255,255,255,0.04)] rounded mt-4" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
          <div className="h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
        </div>
      </div>
      <div className="card p-5 space-y-4">
        <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="space-y-2.5 mt-2">
          <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
          <div className="h-10 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

const SummarySkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="card p-5 md:p-6 space-y-4">
      <div className="h-5 w-1/4 bg-[rgba(255,255,255,0.04)] rounded" />
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-3.5 w-5/6 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>
    </div>
    <div className="card p-5 md:p-6 space-y-4">
      <div className="h-5 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex gap-2">
            <div className="w-4 h-4 bg-[rgba(255,255,255,0.04)] rounded-full shrink-0" />
            <div className="h-3.5 w-3/4 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const FlashcardsSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/4 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>
      <div className="w-32 h-10 bg-[rgba(255,255,255,0.04)] rounded-xl" />
    </div>
    <div className="w-full h-[300px] bg-[#111113] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex flex-col justify-between max-w-2xl mx-auto">
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-5 w-14 bg-[rgba(255,255,255,0.04)] rounded-full" />
      </div>
      <div className="space-y-3 py-6 flex flex-col items-center">
        <div className="h-5 w-1/3 bg-[rgba(255,255,255,0.04)] rounded mb-2" />
        <div className="h-4 w-3/4 bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-4 w-2/3 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>
      <div className="h-3 w-32 bg-[rgba(255,255,255,0.04)] rounded mx-auto" />
    </div>
  </div>
)

const QuizSkeleton = () => (
  <div className="space-y-5 animate-pulse max-w-xl mx-auto">
    <div className="card p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-xl bg-[rgba(255,255,255,0.04)] mx-auto flex items-center justify-center">
        <HelpCircle className="w-6 h-6 text-[#4e4e52]" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-1/3 bg-[rgba(255,255,255,0.04)] rounded mx-auto" />
        <div className="h-3.5 w-3/4 bg-[rgba(255,255,255,0.04)] rounded mx-auto" />
      </div>
      <div className="h-10 w-full bg-[rgba(255,255,255,0.04)] rounded-lg mt-6" />
    </div>
  </div>
)

const ChatSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px] overflow-hidden animate-pulse">
    <div className="lg:col-span-3 card flex flex-col justify-between overflow-hidden p-5 space-y-5">
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)] pb-4">
        <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)]" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-24 bg-[rgba(255,255,255,0.04)] rounded" />
          <div className="h-3 w-40 bg-[rgba(255,255,255,0.04)] rounded" />
        </div>
      </div>
      <div className="flex-1 space-y-4 py-4">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] shrink-0" />
          <div className="h-10 w-2/3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl" />
        </div>
        <div className="flex gap-3 justify-end">
          <div className="h-10 w-1/2 bg-[rgba(255,255,255,0.03)] rounded-xl" />
          <div className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] shrink-0" />
        </div>
      </div>
      <div className="h-12 w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg" />
    </div>
    <div className="hidden lg:block card p-5 space-y-4">
      <div className="h-4 w-1/3 bg-[rgba(255,255,255,0.04)] rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-[rgba(255,255,255,0.04)] rounded" />
        <div className="h-3 w-5/6 bg-[rgba(255,255,255,0.04)] rounded" />
      </div>
    </div>
  </div>
)

const SourcesSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="card p-5 space-y-4">
      <div className="h-4 w-1/4 bg-[rgba(255,255,255,0.04)] rounded" />
      <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.04)] rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((n) => (
        <div key={n} className="card p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-3.5 w-16 bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3.5 w-10 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3 w-full bg-[rgba(255,255,255,0.04)] rounded" />
            <div className="h-3 w-3/4 bg-[rgba(255,255,255,0.04)] rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

interface MaterialOverviewStats {
  chunkCount: number
  flashcardCount: number
  masteredFlashcardCount: number
  quizCount: number
}

interface MaterialDetailClientProps {
  material: Material
  summary: Summary | null
  overviewStats: MaterialOverviewStats
}

export default function MaterialDetailClient({
  material: initialMaterial,
  summary: initialSummary,
  overviewStats: initialOverviewStats
}: MaterialDetailClientProps) {
  const id = initialMaterial.id
  const [activeTab, setActiveTab] = useState("overview")
  const [loading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({})
  const [loadedSections, setLoadedSections] = useState<Record<string, boolean>>({
    overview: true,
    summary: !!initialSummary
  })

  // Sub-states
  const [material] = useState<Material | null>(initialMaterial)
  const [overviewStats, setOverviewStats] = useState<MaterialOverviewStats>(initialOverviewStats)
  const [chunks, setChunks] = useState<MaterialChunk[]>([])
  const [summary, setSummary] = useState<Summary | null>(initialSummary)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    async function loadSection() {
      if (activeTab === "overview" || loadedSections[activeTab] || sectionLoading[activeTab]) {
        return
      }

      try {
        setSectionLoading(prev => ({ ...prev, [activeTab]: true }))
        setError(null)

        const res = await fetch(`/api/materials/${id}?section=${activeTab}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error("Document study guide was not found.")
          throw new Error(`Failed to load ${activeTab}.`)
        }

        const data = await res.json()
        if (activeTab === "summary") setSummary(data.summary || null)
        if (activeTab === "flashcards") setFlashcards(data.flashcards || [])
        if (activeTab === "quiz") setQuizzes(data.quizzes || [])
        if (activeTab === "chat") setChatMessages(data.chatMessages || [])
        if (activeTab === "sources") setChunks(data.chunks || [])
        setLoadedSections(prev => ({ ...prev, [activeTab]: true }))
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to load tab data.")
      } finally {
        setSectionLoading(prev => ({ ...prev, [activeTab]: false }))
      }
    }

    loadSection()
  }, [activeTab, id, loadedSections, sectionLoading])

  const handleSummaryUpdated = (newSummary: Summary) => {
    setSummary(newSummary)
    setLoadedSections(prev => ({ ...prev, summary: true }))
  }

  const handleFlashcardUpdated = (updatedCard: Flashcard) => {
    setFlashcards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c))
    setOverviewStats(prev => ({
      ...prev,
      masteredFlashcardCount: flashcards
        .map(c => c.id === updatedCard.id ? updatedCard : c)
        .filter(c => c.status === "mastered").length
    }))
  }

  const handleQuizAdded = (newQuiz: Quiz) => {
    setQuizzes(prev => {
      const exists = prev.some(q => q.id === newQuiz.id)
      if (exists) {
        return prev.map(q => q.id === newQuiz.id ? newQuiz : q)
      }
      setOverviewStats(stats => ({ ...stats, quizCount: stats.quizCount + 1 }))
      return [newQuiz, ...prev]
    })
  }

  const renderTabSkeleton = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSkeleton />
      case "summary":
        return <SummarySkeleton />
      case "flashcards":
        return <FlashcardsSkeleton />
      case "quiz":
        return <QuizSkeleton />
      case "chat":
        return <ChatSkeleton />
      case "sources":
        return <SourcesSkeleton />
      default:
        return <OverviewSkeleton />
    }
  }

  if (error || (!material && !loading)) {
    return (
      <div className="max-w-md mx-auto py-20 space-y-6">
        <div className="card p-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-display font-semibold text-[#ededef]">Something went wrong</h3>
            <p className="text-sm text-[#85858a] leading-relaxed">{error || "Failed to retrieve this learning material."}</p>
          </div>
          <Link
            href="/materials"
            className="btn-ghost inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Library</span>
          </Link>
        </div>
      </div>
    )
  }

  const isIndonesianMaterial = isIndonesian([
    material?.title,
    summary?.short_summary,
    summary?.detailed_summary,
    summary?.key_points?.join(" ")
  ].filter(Boolean).join(" "))

  const tabs = [
    { id: "overview", label: isIndonesianMaterial ? "Ikhtisar" : "Overview", icon: BookOpen },
    { id: "summary", label: isIndonesianMaterial ? "Ringkasan AI" : "AI Summary", icon: FileText },
    { id: "flashcards", label: isIndonesianMaterial ? "Kartu Belajar" : "Flashcards", icon: Layers },
    { id: "quiz", label: isIndonesianMaterial ? "Kuis Latihan" : "Practice Quiz", icon: HelpCircle },
    { id: "chat", label: isIndonesianMaterial ? "Chat Tutor AI" : "AI Tutor Chat", icon: MessageSquare },
    { id: "sources", label: isIndonesianMaterial ? "Sumber Teks" : "Raw Sources", icon: Code }
  ]

  return (
    <div className="space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-[13px]">
          <Link href="/dashboard" className="text-[#4e4e52] hover:text-[#85858a] transition-colors">Dashboard</Link>
          <span className="text-[#4e4e52]">/</span>
          <Link href="/materials" className="text-[#4e4e52] hover:text-[#85858a] transition-colors">Study Library</Link>
          <span className="text-[#4e4e52]">/</span>
          <span className="text-[#ededef] truncate max-w-xs font-medium">
            {material ? material.title : <span className="inline-block w-28 h-4 bg-[rgba(255,255,255,0.05)] animate-pulse rounded align-middle" />}
          </span>
        </nav>

        <Link
          href="/materials"
          className="flex items-center gap-1.5 text-[13px] text-[#85858a] hover:text-[#ededef] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Library</span>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-[rgba(255,255,255,0.08)] scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 relative ${
                isActive 
                  ? "text-[#ededef]" 
                  : "text-[#4e4e52] hover:text-[#85858a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a044]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content with smooth fade-in and micro-transition */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <motion.div
            key={`skeleton-${activeTab}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {renderTabSkeleton()}
          </motion.div>
        ) : sectionLoading[activeTab] ? (
          <motion.div
            key={`section-loading-${activeTab}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {renderTabSkeleton()}
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {activeTab === "overview" && material && (
              <OverviewTab
                material={material}
                summary={summary}
                overviewStats={overviewStats}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "summary" && material && (
              <SummaryTab
                material={material}
                summary={summary}
                onSummaryUpdated={handleSummaryUpdated}
              />
            )}
            {activeTab === "flashcards" && material && (
              <FlashcardsTab
                material={material}
                flashcards={flashcards}
                onFlashcardUpdated={handleFlashcardUpdated}
              />
            )}
            {activeTab === "quiz" && material && (
              <QuizTab
                material={material}
                quizzes={quizzes}
                onQuizAdded={handleQuizAdded}
              />
            )}
            {activeTab === "chat" && material && (
              <ChatTab
                material={material}
                initialMessages={chatMessages}
                onMessageAdded={(newMsg) => setChatMessages(prev => [...prev, newMsg])}
              />
            )}
            {activeTab === "sources" && material && (
              <SourcesTab
                material={material}
                chunks={chunks}
              />
            )}
          </motion.div>
        )}
      </div>

    </div>
  )
}
