"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Search,
  Plus,
  Layers,
  HelpCircle,
  ChevronRight,
  BookOpen,
  ArrowRight
} from "lucide-react"
import { Material } from "@/lib/validators"
import { formatBytes, formatDate } from "@/lib/utils"

interface MaterialsClientProps {
  materials: Material[]
}

export default function MaterialsClient({ materials }: MaterialsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const loading = false

  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#ededef]">Study Library</h1>
          <p className="text-sm text-[#85858a] mt-1">
            Your uploaded documents and generated study materials.
          </p>
        </div>
        <Link href="/upload" className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Upload</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 max-w-sm">
        <Search className="w-4 h-4 text-[#4e4e52] shrink-0" />
        <input
          type="text"
          placeholder="Search by title or filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-0 outline-none text-sm text-[#ededef] placeholder-[#4e4e52] w-full"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card p-5 space-y-5 animate-pulse">
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
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((m) => (
            <div key={m.id} className="card-interactive p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#4e4e52]" />
                  </div>
                  <span className="badge badge-success">Processed</span>
                </div>

                <h3 className="font-display font-semibold text-sm text-[#ededef] line-clamp-2 mb-2">
                  <Link href={`/materials/${m.id}`} className="hover:underline">{m.title}</Link>
                </h3>

                <p className="text-xs text-[#4e4e52] flex items-center gap-2">
                  <span>{m.total_pages} pages</span>
                  <span>·</span>
                  <span>{formatBytes(m.file_size)}</span>
                  <span>·</span>
                  <span>{formatDate(m.created_at)}</span>
                </p>
              </div>

              {/* Stats + Action */}
              <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-5 mb-4">
                  <div className="flex items-center gap-1.5 text-[#4e4e52]">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{m.flashcard_count || 0} cards</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4e4e52]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{m.quiz_count || 0} quizzes</span>
                  </div>
                </div>

                <Link
                  href={`/materials/${m.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-medium text-[#85858a] hover:text-[#ededef] bg-[#19191d] hover:bg-[#1f1f23] rounded-lg border border-[rgba(255,255,255,0.06)] transition-colors"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 card p-8">
          <BookOpen className="w-12 h-12 text-[#4e4e52] mb-4" />
          <h4 className="font-display font-semibold text-sm text-[#ededef] mb-1.5">No materials yet</h4>
          <p className="text-[13px] text-[#4e4e52] max-w-xs mb-6">
            Upload your first PDF to generate summaries, flashcards, and quizzes.
          </p>
          <Link href="/upload" className="btn-primary">
            <span>Upload PDF</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
