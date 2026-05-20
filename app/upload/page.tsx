"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  BrainCircuit, 
  Database, 
  Sparkles, 
  FileCheck,
  AlertCircle,
  Check,
  Circle,
  Loader2
} from "lucide-react"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const steps = [
    { title: "Uploading file" },
    { title: "Extracting text" },
    { title: "Cleaning content" },
    { title: "Analyzing structure" },
    { title: "Generating embeddings" },
    { title: "Indexing content" },
    { title: "Finalizing" }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF learning material.")
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("PDF exceeds maximum allowed size of 10MB.")
      return
    }
    setFile(selectedFile)
  }

  const handleUploadSubmit = async () => {
    if (!file) return
    
    try {
      setUploading(true)
      setError(null)
      setCurrentStep(0)

      // Start stepping progress indicators to wow the user
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1
          }
          clearInterval(stepInterval)
          return prev
        })
      }, 1800)

      // Call Upload API route
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      
      const data = await res.json()
      
      // Ensure we clear interval in case of early completes
      clearInterval(stepInterval)
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to process document upload")
      }
      
      // Complete all steps dynamically before redirect
      setCurrentStep(steps.length - 1)
      setTimeout(() => {
        router.push(`/materials/${data.materialId}`)
      }, 1000)

    } catch (err: any) {
      console.error("Material upload error:", err)
      setError(err.message || "An unexpected error occurred during indexing.")
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[#ededef]">Upload document</h1>
        <p className="text-sm text-[#85858a] mt-1.5">
          Drop a PDF below to extract, embed, and index your study material.
        </p>
      </div>

      {!uploading ? (
        <div className="space-y-5">
            {/* File Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border border-dashed rounded-xl py-16 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragActive 
                  ? "border-[#d4a044] bg-[rgba(212,160,68,0.05)]" 
                  : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf"
              />
              
              <Upload className="w-8 h-8 text-[#4e4e52] mb-4" />
              
              <p className="text-sm font-medium text-[#ededef] mb-1">
                Drag and drop your PDF here
              </p>
              <p className="text-[13px] text-[#85858a] max-w-sm mb-5 leading-relaxed">
                Supports files up to 10MB. Standard PDF textbooks, slides, or papers.
              </p>
              
              <button 
                type="button" 
                className="btn-ghost relative z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                Browse files
              </button>
            </div>

            {/* Error notification */}
            {error && (
              <div className="p-4 rounded-xl bg-red-400/10 border border-[rgba(255,255,255,0.08)] flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Selected file card */}
            {file && (
              <div className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,160,68,0.1)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#d4a044]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#ededef] truncate">{file.name}</p>
                    <p className="text-xs text-[#85858a] mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setFile(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4e4e52] hover:text-[#ededef] hover:bg-[#19191d] transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleUploadSubmit}
              disabled={!file}
              className={`w-full py-2.5 rounded-lg text-[13px] font-semibold text-center transition-colors ${
                file 
                  ? "btn-primary cursor-pointer" 
                  : "bg-[#19191d] border border-[rgba(255,255,255,0.05)] text-[#4e4e52] cursor-not-allowed"
              }`}
            >
              Process document
            </button>
        </div>
      ) : (
        <div className="card p-6 space-y-6">
            {/* Status header */}
            <div className="flex items-center gap-4">
              <div className="spinner shrink-0" />
              <div>
                <h2 className="text-base font-display font-semibold text-[#ededef]">Processing document…</h2>
                <p className="text-[13px] text-[#85858a] mt-0.5">Please wait, do not close this tab.</p>
              </div>
            </div>

            {/* Step list */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep
                const isActive = idx === currentStep
                
                return (
                  <div 
                    key={step.title} 
                    className={`flex items-center gap-3 transition-colors ${
                      isActive 
                        ? "opacity-100" 
                        : isCompleted 
                        ? "opacity-100" 
                        : "opacity-40"
                    }`}
                  >
                    {/* Step indicator */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-[#d4a044] animate-spin" />
                      ) : (
                        <Circle className="w-3 h-3 text-[#4e4e52]" />
                      )}
                    </div>
                    <span className={`text-[13px] font-medium ${
                      isCompleted 
                        ? "text-emerald-400" 
                        : isActive 
                        ? "text-[#ededef]" 
                        : "text-[#4e4e52]"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1 bg-[#19191d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4a044] rounded-full"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
        </div>
      )}
    </div>
  )
}
