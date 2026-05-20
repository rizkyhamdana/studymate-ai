import { useState, useEffect, useRef } from "react"
import { Material, ChatMessage } from "@/lib/validators"
import { isIndonesian } from "@/lib/language"
import {
  Send,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  FileText,
  Loader2
} from "lucide-react"

interface ChatTabProps {
  material: Material
  initialMessages: ChatMessage[]
  onMessageAdded?: (msg: ChatMessage) => void
}

const DEFAULT_SUGGESTIONS = [
  "What are the main arguments in this material?",
  "Summarize the core methodology used.",
  "Define the 3 most critical terms.",
  "Explain the hardest concept with an analogy."
]

const DEFAULT_SUGGESTIONS_ID = [
  "Apa argumen utama dalam materi ini?",
  "Ringkas metodologi inti yang digunakan.",
  "Definisikan 3 istilah paling penting.",
  "Jelaskan konsep tersulit dengan analogi."
]

export default function ChatTab({
  material,
  initialMessages,
  onMessageAdded
}: ChatTabProps) {
  const isIndo = isIndonesian(`${material.title} ${initialMessages.map(m => m.content).join(" ")}`)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>(isIndo ? DEFAULT_SUGGESTIONS_ID : DEFAULT_SUGGESTIONS)
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return

    setError(null)
    const userQuery = textToSend.trim()
    setInput("")

    const tempUserMsg: ChatMessage = {
      id: Math.random().toString(),
      material_id: material.id,
      user_id: "dev-user",
      role: "user",
      content: userQuery,
      sources: [],
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempUserMsg])
    onMessageAdded?.(tempUserMsg)
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: material.id,
          question: userQuery
        })
      })

      if (!res.ok) throw new Error("Failed to get a response. Please try again.")

      const data = await res.json()

      const tempAiMsg: ChatMessage = {
        id: Math.random().toString(),
        material_id: material.id,
        user_id: "tutor",
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
        created_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, tempAiMsg])
      onMessageAdded?.(tempAiMsg)
      setConfidence(data.confidence)
      if (data.suggested_follow_up_questions && data.suggested_follow_up_questions.length > 0) {
        setSuggestions(data.suggested_follow_up_questions.slice(0, 3))
      } else {
        setSuggestions(isIndo ? DEFAULT_SUGGESTIONS_ID : DEFAULT_SUGGESTIONS)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to submit chat message.")
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id))
    } finally {
      setLoading(false)
    }
  }

  const toggleCitation = (citationId: string) => {
    setExpandedCitations(prev => ({
      ...prev,
      [citationId]: !prev[citationId]
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px] max-h-[600px] overflow-hidden">

      {/* Chat Pane */}
      <div className="lg:col-span-3 card flex flex-col justify-between overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
              <span className="text-[#d4a044] text-xs font-bold">AI</span>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-[#ededef]">AI Tutor</h4>
              <span className="text-[11px] text-[#4e4e52]">{isIndo ? "Jawaban berdasarkan dokumen Anda" : "Answers grounded in your document"}</span>
            </div>
          </div>

          {confidence !== null && (
            <span className="badge badge-accent">
              {(confidence * 100).toFixed(0)}% confidence
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-3 max-w-xs mx-auto h-full">
              <BookOpen className="w-10 h-10 text-[#4e4e52]" />
              <h5 className="font-display font-semibold text-sm text-[#ededef]">{isIndo ? "Ajukan pertanyaan" : "Ask a question"}</h5>
              <p className="text-xs text-[#4e4e52] leading-relaxed">
                {isIndo ? "Tutor AI menelusuri dokumen Anda untuk memberikan jawaban dengan kutipan sumber." : "The AI tutor searches your document to provide answers with source citations."}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === "user"
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-3`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-md bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0 text-[#d4a044] text-[10px] font-bold mt-0.5">
                      AI
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[80%] ${isUser ? "order-1" : "order-2"}`}>
                    {/* Bubble */}
                    <div className={`px-4 py-3 rounded-xl text-[13px] leading-relaxed ${
                      isUser
                        ? "bg-[#d4a044] text-[#09090b] rounded-tr-sm"
                        : "bg-[#19191d] border border-[rgba(255,255,255,0.05)] text-[#ededef] rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>

                    {/* Sources */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1.5 pl-1">
                        <span className="text-[11px] text-[#4e4e52] font-medium block">{isIndo ? "Sumber" : "Sources"}</span>

                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, sIdx) => {
                            const citationId = `${msg.id}-${sIdx}`
                            const isExpanded = !!expandedCitations[citationId]
                            return (
                              <div key={sIdx} className="w-full sm:w-auto min-w-[120px] max-w-sm">
                                <button
                                  onClick={() => toggleCitation(citationId)}
                                  className="flex items-center justify-between gap-2 px-3 py-2 bg-[#19191d] hover:bg-[#1f1f23] border border-[rgba(255,255,255,0.05)] rounded-lg text-[11px] text-[#85858a] font-medium w-full transition-colors text-left"
                                >
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <FileText className="w-3 h-3 text-[#4e4e52]" />
                                    <span>{isIndo ? "Halaman" : "Page"} {src.page_number}, {isIndo ? "Potongan" : "Chunk"} {src.chunk_index}</span>
                                  </div>
                                  {isExpanded ? <ChevronUp className="w-3 h-3 text-[#4e4e52] shrink-0" /> : <ChevronDown className="w-3 h-3 text-[#4e4e52] shrink-0" />}
                                </button>

                                {isExpanded && (
                                  <div className="mt-1 p-3 rounded-lg bg-[#19191d] border-l-2 border-l-[#d4a044] text-[11px] text-[#85858a] leading-relaxed italic">
                                    &ldquo;{src.quote}&rdquo;
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-7 h-7 rounded-md bg-[#19191d] border border-[rgba(255,255,255,0.06)] text-[#85858a] text-[10px] font-medium flex items-center justify-center shrink-0 order-2 mt-0.5">
                      You
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* Typing */}
          {loading && (
            <div className="flex justify-start items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0 text-[#d4a044] text-[10px] font-bold">
                AI
              </div>
              <div className="bg-[#19191d] border border-[rgba(255,255,255,0.05)] px-4 py-3 rounded-xl rounded-tl-sm text-[#85858a] text-xs max-w-xs flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4a044] shrink-0" />
                <span>{isIndo ? "Menelusuri dokumen..." : "Searching document..."}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-400/5 border border-red-400/15 p-3 rounded-lg text-xs text-red-400 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.05)] space-y-3">

          {!loading && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 bg-[#19191d] hover:bg-[#1f1f23] border border-[rgba(255,255,255,0.06)] rounded-lg text-[11px] text-[#85858a] hover:text-[#ededef] transition-colors text-left truncate max-w-xs"
                  title={q}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(input)
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isIndo ? "Tanyakan isi dokumen..." : "Ask about your document..."}
              disabled={loading}
              className="flex-1 bg-[#19191d] border border-[rgba(255,255,255,0.08)] outline-none rounded-lg px-4 py-3 text-sm text-[#ededef] placeholder-[#4e4e52] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary px-3.5 py-3 disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col justify-between card p-5 overflow-y-auto space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#4e4e52]" />
            <h5 className="font-display font-semibold text-xs text-[#ededef]">Tips</h5>
          </div>

          <div className="space-y-3 text-[11px] leading-relaxed text-[#85858a]">
            <div className="space-y-1">
              <span className="font-semibold text-[#ededef] block text-[11px]">{isIndo ? "Berbasis sumber" : "Source-grounded"}</span>
              <p>{isIndo ? "Setiap jawaban didasarkan pada dokumen yang Anda unggah. Kutipan menunjukkan halaman dan potongan teks yang dirujuk." : "Every answer is based on your uploaded document. Citations show exact page and chunk references."}</p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#ededef] block text-[11px]">{isIndo ? "Buka kutipan" : "Expand citations"}</span>
              <p>{isIndo ? "Klik kartu kutipan di bawah jawaban AI untuk melihat teks sumber asli." : "Click citation cards below AI replies to view the original text passage."}</p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#ededef] block text-[11px]">{isIndo ? "Keyakinan rendah" : "Low confidence"}</span>
              <p>{isIndo ? "Jika model tidak menemukan konteks relevan, tingkat keyakinan akan rendah. Coba ubah susunan pertanyaan Anda." : "If the model can&apos;t find relevant content, it will indicate low confidence. Try rephrasing your question."}</p>
            </div>
          </div>
        </div>

        {confidence !== null && (
          <div className="p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] text-center">
            <span className="text-[11px] text-[#4e4e52] block">{isIndo ? "Keyakinan pencarian" : "Search confidence"}</span>
            <span className="text-lg font-display font-bold text-[#d4a044]">{(confidence * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
