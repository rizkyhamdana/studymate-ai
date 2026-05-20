import { useState, useMemo } from "react"
import { Material, MaterialChunk } from "@/lib/validators"
import { isIndonesian } from "@/lib/language"
import {
  Search,
  Copy,
  Check,
  BookOpen,
  Hash,
  Layers
} from "lucide-react"

interface SourcesTabProps {
  material: Material
  chunks: MaterialChunk[]
}

export default function SourcesTab({
  material,
  chunks
}: SourcesTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const isIndo = isIndonesian(`${material.title} ${chunks.map(c => c.content).join(" ")}`)

  const filteredChunks = useMemo(() => {
    if (!searchTerm.trim()) return chunks
    const term = searchTerm.toLowerCase()
    return chunks.filter(c => c.content.toLowerCase().includes(term))
  }, [chunks, searchTerm])

  const copyChunkContent = (chunkId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(chunkId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text
    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase()
            ? <mark key={i} className="bg-[rgba(212,160,68,0.25)] text-[#ededef] font-medium rounded-sm px-0.5">{part}</mark>
            : part
        )}
      </>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#ededef]">{isIndo ? "Potongan Teks Dokumen" : "Document Chunks"}</h3>
          <p className="text-xs text-[#4e4e52] mt-1">
            {isIndo ? "Telusuri segmen teks yang diekstrak dari PDF Anda." : "Browse the text segments extracted from your PDF."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 max-w-sm w-full md:w-72">
          <Search className="w-4 h-4 text-[#4e4e52] shrink-0" />
          <input
            type="text"
            placeholder={isIndo ? "Cari isi teks..." : "Search content..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm text-[#ededef] placeholder-[#4e4e52] w-full"
          />
        </div>
      </div>

      {/* Chunks */}
      {filteredChunks.length > 0 ? (
        <div className="space-y-3">
          <span className="text-[11px] text-[#4e4e52] font-medium pl-0.5 block">
            {isIndo ? `${filteredChunks.length} dari ${chunks.length} segmen` : `${filteredChunks.length} of ${chunks.length} segments`}
          </span>

          <div className="space-y-3">
            {filteredChunks.map((chunk) => {
              const isCopied = copiedId === chunk.id
              return (
                <div
                  key={chunk.id}
                  className="card p-5 space-y-3"
                >
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-[#19191d] border border-[rgba(255,255,255,0.06)] px-2.5 py-1 rounded-md text-[11px] text-[#85858a] font-medium">
                        <BookOpen className="w-3 h-3 text-[#4e4e52]" />
                        <span>{isIndo ? "Halaman" : "Page"} {chunk.page_number}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#19191d] border border-[rgba(255,255,255,0.06)] px-2.5 py-1 rounded-md text-[11px] text-[#85858a] font-medium">
                        <Hash className="w-3 h-3 text-[#4e4e52]" />
                        <span>{isIndo ? "Potongan" : "Chunk"} {chunk.chunk_index}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#19191d] border border-[rgba(255,255,255,0.06)] px-2.5 py-1 rounded-md text-[11px] text-[#4e4e52] hidden sm:flex">
                        <Layers className="w-3 h-3" />
                        <span>~{chunk.token_estimate || 250} {isIndo ? "kata" : "words"}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => copyChunkContent(chunk.id, chunk.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#19191d] hover:bg-[#1f1f23] border border-[rgba(255,255,255,0.06)] text-[#4e4e52] hover:text-[#ededef] text-[11px] font-medium rounded-md transition-colors"
                      title="Copy chunk content"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isIndo ? "Tersalin" : "Copied"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isIndo ? "Salin" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] text-[13px] text-[#85858a] leading-relaxed font-mono whitespace-pre-wrap select-all">
                    {highlightText(chunk.content, searchTerm)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card p-10 text-center space-y-3 max-w-md mx-auto">
          <Search className="w-10 h-10 text-[#4e4e52] mx-auto" />
          <h4 className="font-display font-semibold text-sm text-[#ededef]">{isIndo ? "Tidak ada potongan yang cocok" : "No matching chunks"}</h4>
          <p className="text-xs text-[#4e4e52] max-w-xs mx-auto">
            {isIndo ? "Tidak ada isi yang cocok dengan" : "No content matched"} &ldquo;<span className="text-[#d4a044]">{searchTerm}</span>&rdquo;{isIndo ? ". Coba kata kunci lain." : ". Try a different keyword."}
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="btn-ghost text-xs"
          >
            {isIndo ? "Bersihkan pencarian" : "Clear search"}
          </button>
        </div>
      )}
    </div>
  )
}
