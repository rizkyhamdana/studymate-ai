import { useState } from "react"
import { Summary, Material } from "@/lib/validators"
import {
  Copy,
  Check,
  RotateCw,
  BookOpen,
  ListChecks,
  FileText,
  HelpCircle
} from "lucide-react"

interface SummaryTabProps {
  material: Material
  summary: Summary | null
  onSummaryUpdated: (newSummary: Summary) => void
}

export default function SummaryTab({
  material,
  summary,
  onSummaryUpdated
}: SummaryTabProps) {
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = () => {
    if (!summary) return

    const formattedText = `
# STUDY GUIDE: ${material.title}

## Overview
${summary.short_summary}

## Detailed Summary
${summary.detailed_summary}

## Key Points
${summary.key_points.map((pt, i) => `${i + 1}. ${pt}`).join("\n")}

## Important Terms
${summary.important_terms.map(t => `- **${t.term}**: ${t.definition}`).join("\n")}

## Learning Path
${summary.learning_path.map((path, i) => `${i + 1}. ${path}`).join("\n")}
    `.trim()

    navigator.clipboard.writeText(formattedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    try {
      setRegenerating(true)
      setError(null)
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId: material.id, forceRegenerate: true })
      })

      if (!res.ok) {
        throw new Error("Failed to regenerate summary")
      }

      const data = await res.json()
      onSummaryUpdated(data.summary || data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong while regenerating the summary.")
    } finally {
      setRegenerating(false)
    }
  }

  if (!summary) {
    return (
      <div className="card p-8 text-center space-y-5 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-xl bg-[rgba(212,160,68,0.1)] border border-[rgba(212,160,68,0.15)] flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7 text-[#d4a044]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-base text-[#ededef]">No summary yet</h3>
          <p className="text-sm text-[#85858a] max-w-sm mx-auto leading-relaxed">
            Generate an AI summary to get key takeaways, definitions, and study paths.
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="btn-primary mx-auto"
        >
          {regenerating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate summary</span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#ededef]">Summary</h3>
          <p className="text-xs text-[#4e4e52] mt-1">
            Key points, definitions, and recommended study path.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="btn-ghost text-xs"
            title="Copy study guide"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-primary text-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
            <span>{regenerating ? "Generating..." : "Regenerate"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/15 p-3 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Overview */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4e4e52]" />
              <h4 className="text-sm font-display font-semibold text-[#ededef]">Overview</h4>
            </div>
            <p className="text-[13px] text-[#85858a] leading-relaxed p-4 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
              {summary.short_summary}
            </p>
          </div>

          {/* Key Points */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#4e4e52]" />
              <h4 className="text-sm font-display font-semibold text-[#ededef]">Key Points</h4>
            </div>

            <div className="space-y-2.5">
              {summary.key_points.map((point, index) => (
                <div key={index} className="flex gap-2.5 p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
                  <span className="w-5 h-5 rounded-md bg-[rgba(212,160,68,0.1)] text-[#d4a044] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-[13px] text-[#85858a] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Notes */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4e4e52]" />
              <h4 className="text-sm font-display font-semibold text-[#ededef]">Study Notes</h4>
            </div>

            <div className="text-[13px] text-[#85858a] leading-relaxed space-y-3 p-4 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)]">
              {summary.detailed_summary.split("\n\n").map((para, i) => {
                if (para.trim().startsWith("###")) {
                  return <h5 key={i} className="font-display font-semibold text-sm text-[#ededef] pt-2">{para.replace("###", "").trim()}</h5>
                } else if (para.trim().startsWith("##")) {
                  return <h4 key={i} className="font-display font-semibold text-base text-[#ededef] pt-3 border-b border-[rgba(255,255,255,0.05)] pb-2">{para.replace("##", "").trim()}</h4>
                } else if (para.trim().startsWith("-") || para.trim().startsWith("*")) {
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-1 text-[13px]">
                      {para.split("\n").map((li, j) => (
                        <li key={j} className="text-[#85858a]">{li.replace(/^-\s*|^\*\s*/, "")}</li>
                      ))}
                    </ul>
                  )
                }
                return <p key={i} className="text-[13px] text-[#85858a] leading-relaxed">{para}</p>
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Glossary */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#4e4e52]" />
              <h4 className="text-sm font-display font-semibold text-[#ededef]">Glossary</h4>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {summary.important_terms.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] space-y-1">
                  <span className="font-semibold text-xs text-[#ededef] block font-mono">{item.term}</span>
                  <span className="text-[11px] text-[#85858a] block leading-relaxed">{item.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="card p-5 space-y-3">
            <h4 className="text-sm font-display font-semibold text-[#ededef]">Learning Path</h4>

            <div className="relative border-l border-[rgba(255,255,255,0.08)] ml-3 pl-5 space-y-4 py-1">
              {summary.learning_path.map((step, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[28px] top-0.5 w-5 h-5 rounded-md bg-[#111113] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[11px] font-semibold text-[#d4a044] shrink-0">
                    {idx + 1}
                  </span>

                  <div>
                    <span className="text-[11px] text-[#d4a044] font-medium block">Step {idx + 1}</span>
                    <p className="text-[13px] text-[#85858a] leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
