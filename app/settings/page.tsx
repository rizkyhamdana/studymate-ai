"use client"

import { useEffect, useState } from "react"
import { 
  Settings, 
  Key, 
  Database, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  Check, 
  Info,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  
  // View states
  const [showOpenai, setShowOpenai] = useState(false)
  const [showSupabaseKey, setShowSupabaseKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)
  
  // Dynamic system mode marker
  const [isLiveMode, setIsLiveMode] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("studymate_openai_api_key") || ""
      const url = localStorage.getItem("studymate_supabase_url") || ""
      const sKey = localStorage.getItem("studymate_supabase_anon_key") || ""
      
      setOpenaiKey(key)
      setSupabaseUrl(url)
      setSupabaseAnonKey(sKey)

      if (key && url && sKey) {
        setIsLiveMode(true)
      } else {
        setIsLiveMode(false)
      }
    }
  }, [])

  const handleSave = () => {
    if (typeof window !== "undefined") {
      // 1. Save to local storage for browser RAG searches & clients
      localStorage.setItem("studymate_openai_api_key", openaiKey.trim())
      localStorage.setItem("studymate_supabase_url", supabaseUrl.trim())
      localStorage.setItem("studymate_supabase_anon_key", supabaseAnonKey.trim())

      // 2. Set cookies so server-side API routes can access keys
      const maxAge = 60 * 60 * 24 * 365 // 1 Year
      document.cookie = `studymate_openai_api_key=${openaiKey.trim()}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `studymate_supabase_url=${supabaseUrl.trim()}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `studymate_supabase_anon_key=${supabaseAnonKey.trim()}; path=/; max-age=${maxAge}; SameSite=Lax`

      setSaved(true)
      setIsLiveMode(!!(openaiKey.trim() && supabaseUrl.trim() && supabaseAnonKey.trim()))
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    if (typeof window !== "undefined") {
      // 1. Remove from localStorage
      localStorage.removeItem("studymate_openai_api_key")
      localStorage.removeItem("studymate_supabase_url")
      localStorage.removeItem("studymate_supabase_anon_key")

      // 2. Clear cookies by setting max-age to 0
      document.cookie = `studymate_openai_api_key=; path=/; max-age=0; SameSite=Lax`
      document.cookie = `studymate_supabase_url=; path=/; max-age=0; SameSite=Lax`
      document.cookie = `studymate_supabase_anon_key=; path=/; max-age=0; SameSite=Lax`

      setOpenaiKey("")
      setSupabaseUrl("")
      setSupabaseAnonKey("")
      setIsLiveMode(false)
      
      setCleared(true)
      setTimeout(() => setCleared(false), 2000)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-[#ededef]">Settings</h1>
        <p className="text-sm text-[#85858a] mt-1">
          Configure API credentials to connect StudyMate AI to your cloud integrations.
        </p>
      </div>

      {/* System Status */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-[#85858a]">System Status</span>
        {isLiveMode ? (
          <span className="badge badge-success inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Live Mode
          </span>
        ) : (
          <span className="badge badge-accent inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            Sandbox Mode
          </span>
        )}
      </div>

      {/* Status Description */}
      {isLiveMode ? (
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-[#ededef]">Live Mode Active</p>
              <p className="text-xs text-[#4e4e52] leading-relaxed">
                StudyMate is connected to your cloud systems. All PDF extractions, vector similarity searches, semantic chunking, and summaries run directly using your OpenAI models and Supabase pgvector instance.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#d4a044] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-[#ededef]">Sandbox Mode</p>
              <p className="text-xs text-[#4e4e52] leading-relaxed">
                Running in zero-configuration mode. The application uses a local mock vector DB, saves states in localStorage, and synthesizes grounded context summaries. Save credentials below to activate live integrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration Card */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <Settings className="w-5 h-5 text-[#4e4e52]" />
          <h2 className="text-base font-display font-semibold text-[#ededef]">API Configuration</h2>
        </div>

        {/* OpenAI Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#d4a044]" />
            <h3 className="text-sm font-display font-semibold text-[#ededef]">OpenAI Credentials</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#ededef] block">API Key</label>
            <div className="relative">
              <input
                type={showOpenai ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] outline-none rounded-lg px-4 pr-11 py-3 text-sm text-[#ededef] placeholder-[#4e4e52] focus:border-[rgba(255,255,255,0.12)] transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-3 top-3.5 text-[#4e4e52] hover:text-[#ededef] transition-colors"
              >
                {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-xs text-[#4e4e52] block leading-normal">
              Credentials are stored locally in your browser and context cookies — never sent to external servers.
            </span>
          </div>
        </div>

        <hr className="border-[rgba(255,255,255,0.05)]" />

        {/* Supabase Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#d4a044]" />
            <h3 className="text-sm font-display font-semibold text-[#ededef]">Supabase Credentials</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#ededef] block">Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] outline-none rounded-lg px-4 py-3 text-sm text-[#ededef] placeholder-[#4e4e52] focus:border-[rgba(255,255,255,0.12)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#ededef] block">Anon Key</label>
              <div className="relative">
                <input
                  type={showSupabaseKey ? "text" : "password"}
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] outline-none rounded-lg px-4 pr-11 py-3 text-sm text-[#ededef] placeholder-[#4e4e52] focus:border-[rgba(255,255,255,0.12)] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                  className="absolute right-3 top-3.5 text-[#4e4e52] hover:text-[#ededef] transition-colors"
                >
                  {showSupabaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="btn-ghost flex items-center gap-2"
          >
            {cleared ? (
              <>
                <RotateCcw className="w-4 h-4 text-[#d4a044]" />
                <span className="text-[#d4a044]">Cleared</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* RAG & ML Info section */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#4e4e52] shrink-0" />
          <h2 className="text-base font-display font-semibold text-[#ededef]">Deployment & RAG Mechanics</h2>
        </div>
        <p className="text-sm text-[#85858a] leading-relaxed">
          When cloud connections are saved, uploading learning materials parses PDFs client-side, segments sentences into overlapping blocks, sends chunk strings to OpenAI's <code className="text-[#d4a044] font-mono text-xs">text-embedding-3-small</code> model to yield 1536-dimensional float embeddings, and writes database inserts to Supabase.
        </p>
        <p className="text-sm text-[#85858a] leading-relaxed">
          During chat operations, your query is embedded and matched inside the Supabase <code className="text-[#d4a044] font-mono text-xs">match_material_chunks</code> similarity RPC using cosine search logic. Adaptive quizzes integrate questions and trigger local pipeline validation algorithms dynamically.
        </p>
      </div>

    </div>
  )
}
