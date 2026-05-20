import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Zap,
  ShieldCheck,
  BarChart4,
  Sparkles
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      title: "AI Summaries",
      description: "Structured outlines, key takeaways, and glossary tables generated from your uploaded material.",
      icon: BookOpen
    },
    {
      title: "Smart Flashcards",
      description: "Interactive 3D-flipping cards built from core concepts. Track mastery as you study.",
      icon: Sparkles
    },
    {
      title: "Adaptive Quizzes",
      description: "Practice tests validated by ML difficulty classification, with detailed explanations.",
      icon: BrainCircuit
    },
    {
      title: "AI Tutor",
      description: "Ask questions and get answers grounded only in your uploaded documents.",
      icon: Zap
    },
    {
      title: "Source Citations",
      description: "Every answer references exact page numbers and text passages. No hallucination.",
      icon: ShieldCheck
    },
    {
      title: "Learning Analytics",
      description: "Track scores, identify weak topics, and measure your mastery progress over time.",
      icon: BarChart4
    }
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ededef] flex flex-col -mx-6 -my-8 md:-mx-10 md:-my-10">
      {/* Header */}
      <header className="w-full px-6 md:px-12 h-16 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="StudyMate AI Logo"
              className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(0,242,254,0.35)] transition-transform duration-300 hover:scale-110"
            />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">StudyMate</span>
        </div>

        <Link href="/dashboard" prefetch className="btn-ghost text-[13px]">
          Open Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 py-20 md:py-28 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-[56px] font-display font-extrabold tracking-tight leading-[1.1] mb-5">
          Study any PDF,{" "}
          <span className="text-[#d4a044]">smarter</span>
        </h1>

        <p className="text-base md:text-lg text-[#85858a] max-w-xl mb-10 leading-relaxed font-light">
          Upload a document and let AI transform it into summaries, flashcards, quizzes, and an intelligent tutor — all grounded in your source material.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" prefetch className="btn-primary text-sm px-7 py-3.5">
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/upload" prefetch className="btn-ghost text-sm px-7 py-3.5">
            Upload a PDF
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
              Everything you need to learn faster
            </h2>
            <p className="text-sm text-[#85858a] max-w-md mx-auto">
              A complete study system powered by AI and machine learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="card p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
                    <Icon className="w-[18px] h-[18px] text-[#4e4e52]" />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-[#ededef] mb-1.5">{feature.title}</h3>
                  <p className="text-[13px] text-[#65656a] leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-[rgba(255,255,255,0.05)]">
        <p className="text-center text-xs text-[#4e4e52]">
          &copy; {new Date().getFullYear()} StudyMate AI
        </p>
      </footer>
    </div>
  )
}
