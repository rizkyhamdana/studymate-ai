import { useState, useEffect } from "react"
import { Quiz, QuizQuestion, Material, QuizAttempt } from "@/lib/validators"
import { 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  HelpCircle as QuestionIcon,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  BookOpen
} from "lucide-react"

interface QuizTabProps {
  material: Material
  quizzes: Quiz[]
  onQuizAdded: (newQuiz: Quiz) => void
}

export default function QuizTab({
  material,
  quizzes,
  onQuizAdded
}: QuizTabProps) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(quizzes[0] || null)
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionCount, setQuestionCount] = useState<number>(5)
  
  // Interactive Session State
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isGraded, setIsGraded] = useState(false)
  const [savingAttempt, setSavingAttempt] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Sync when quizzes change and there's no active quiz
  useEffect(() => {
    if (quizzes.length > 0 && !activeQuiz) {
      setActiveQuiz(quizzes[0])
    }
  }, [quizzes, activeQuiz])

  const handleStartQuiz = async (regenerate = false) => {
    try {
      setLoading(true)
      setError(null)
      setIsGraded(false)
      setAnswers({})
      setCurrentIdx(0)
      setAttempt(null)

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: material.id,
          count: questionCount,
          difficulty,
          regenerate
        })
      })

      if (!res.ok) throw new Error("Failed to load quiz")
      const data = await res.json()
      
      const newQuiz = data.quiz
      setActiveQuiz(newQuiz)
      
      // If it's a newly generated quiz, add it to parent state
      if (regenerate || !quizzes.some(q => q.id === newQuiz.id)) {
        onQuizAdded(newQuiz)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to initialize quiz deck.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: string, value: string) => {
    if (isGraded) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleGradeQuiz = async () => {
    if (!activeQuiz || !activeQuiz.questions) return
    
    // Grade questions
    let scoreCount = 0
    const weakTopicsMap: Record<string, number> = {}
    
    activeQuiz.questions.forEach((q) => {
      const userAnswer = (answers[q.id] || "").trim().toLowerCase()
      const correctAnswer = q.correct_answer.trim().toLowerCase()
      
      let isCorrect = false
      if (q.type === "multiple_choice" || q.type === "true_false") {
        isCorrect = userAnswer === correctAnswer
      } else {
        // Simple string matching fallback for short answer
        isCorrect = userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)
      }

      if (isCorrect) {
        scoreCount++
      } else {
        weakTopicsMap[q.topic] = (weakTopicsMap[q.topic] || 0) + 1
      }
    })

    const score = Math.round((scoreCount / activeQuiz.questions.length) * 100)
    const weakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)

    setIsGraded(true)

    // Save to Database
    try {
      setSavingAttempt(true)
      const res = await fetch("/api/quiz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          score: scoreCount,
          totalQuestions: activeQuiz.questions.length,
          weakTopics
        })
      })
      if (!res.ok) throw new Error("Failed to save quiz attempt")
      const attemptData = await res.json()
      setAttempt(attemptData.attempt)
    } catch (err) {
      console.error("Failed to store attempt records:", err)
    } finally {
      setSavingAttempt(false)
    }
  }

  // Next / Prev helper
  const nextQuestion = () => {
    if (activeQuiz?.questions && currentIdx < activeQuiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1)
    }
  }

  const currentQuestion: QuizQuestion | null = activeQuiz?.questions?.[currentIdx] || null

  // 1. Initial State Panel: Customize & Generate
  if (!activeQuiz && !loading) {
    return (
      <div className="card p-8 max-w-xl mx-auto space-y-6">
        <div className="w-14 h-14 rounded-xl bg-[rgba(212,160,68,0.1)] flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7 text-[#d4a044]" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-display font-bold text-[#ededef] text-lg">Generate Practice Quiz</h3>
          <p className="text-[13px] text-[#85858a] max-w-md mx-auto leading-relaxed">
            Configure your quiz settings and generate an AI-crafted test with ML-verified difficulty classification.
          </p>
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-lg text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-xs text-[#4e4e52] font-medium uppercase tracking-wider block">Difficulty</span>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                    difficulty === d 
                      ? "bg-[#d4a044] text-[#09090b] border-[#d4a044]" 
                      : "bg-[#19191d] border-[rgba(255,255,255,0.08)] text-[#85858a] hover:text-[#ededef] hover:bg-[#111113]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-[#4e4e52] font-medium uppercase tracking-wider block">Questions</span>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map(c => (
                <button
                  key={c}
                  onClick={() => setQuestionCount(c)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    questionCount === c 
                      ? "bg-[#d4a044] text-[#09090b] border-[#d4a044]" 
                      : "bg-[#19191d] border-[rgba(255,255,255,0.08)] text-[#85858a] hover:text-[#ededef] hover:bg-[#111113]"
                  }`}
                >
                  {c} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleStartQuiz(true)}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>Generate Quiz</span>
        </button>
      </div>
    )
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="card p-12 text-center space-y-6 max-w-md mx-auto">
        <div className="spinner mx-auto" />
        <div className="space-y-2">
          <h4 className="font-display font-bold text-[#ededef] text-sm">Generating Quiz...</h4>
          <p className="text-[13px] text-[#85858a] leading-relaxed">
            Analyzing material, generating questions, and running ML difficulty verification.
          </p>
        </div>
      </div>
    )
  }

  // 3. Quiz Results Graded Screen
  if (isGraded && activeQuiz && activeQuiz.questions) {
    const total = activeQuiz.questions.length
    const answeredCorrect = activeQuiz.questions.filter((q) => {
      const ans = (answers[q.id] || "").trim().toLowerCase()
      const correct = q.correct_answer.trim().toLowerCase()
      return q.type === "short_answer" 
        ? ans.includes(correct) || correct.includes(ans)
        : ans === correct
    }).length
    
    const percentage = Math.round((answeredCorrect / total) * 100)

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Scoring Header */}
        <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${
              percentage >= 70 
                ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400" 
                : "bg-[rgba(212,160,68,0.1)] border-[rgba(212,160,68,0.25)] text-[#d4a044]"
            }`}>
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#ededef] text-lg leading-snug">Results: {percentage}%</h3>
              <p className="text-[13px] text-[#85858a] mt-1 flex items-center gap-2">
                <span>{answeredCorrect} of {total} correct</span>
                <span>&bull;</span>
                <span>{percentage >= 70 ? "Passing Grade" : "Review Recommended"}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleStartQuiz(true)}
              className="btn-primary flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
            
            <button
              onClick={() => {
                setActiveQuiz(null)
                setAttempt(null)
              }}
              className="btn-ghost flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5"
            >
              <span>Back to Setup</span>
            </button>
          </div>
        </div>

        {/* Weakness analysis & ML Pipeline verification highlights */}
        {attempt?.weak_topics && attempt.weak_topics.length > 0 && (
          <div className="bg-[rgba(212,160,68,0.06)] border border-[rgba(212,160,68,0.15)] p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#d4a044] shrink-0" />
              <h5 className="font-display font-semibold text-[#ededef] text-xs">Suggested Focus Areas</h5>
            </div>
            <p className="text-[13px] text-[#85858a] leading-relaxed">
              You had difficulty with: <span className="text-[#d4a044] font-semibold">{attempt.weak_topics.join(", ")}</span>. Consider reviewing these topics using the Study Tutor.
            </p>
          </div>
        )}

        {/* List of reviewed questions */}
        <div className="space-y-4">
          {activeQuiz.questions.map((q, idx) => {
            const userAns = answers[q.id] || "No response provided"
            const correctAns = q.correct_answer
            const isCorrect = q.type === "short_answer"
              ? userAns.trim().toLowerCase().includes(correctAns.trim().toLowerCase()) || correctAns.trim().toLowerCase().includes(userAns.trim().toLowerCase())
              : userAns.trim().toLowerCase() === correctAns.trim().toLowerCase()

            // Fetch ML verification details if they exist
            const mlInfo: any = (q as any).ml_verification || null

            return (
              <div 
                key={q.id} 
                className={`card p-6 space-y-4 relative overflow-hidden border-l-2 ${
                  isCorrect ? "border-l-emerald-400" : "border-l-red-400"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#85858a]">Question {idx + 1}</span>
                    <span className="text-[#4e4e52]">&bull;</span>
                    <span className="text-xs text-[#4e4e52] font-medium uppercase tracking-wider">{q.topic}</span>
                  </div>
                  
                  {/* ML Badge */}
                  {mlInfo && (
                    <div className="badge badge-accent flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>ML: {mlInfo.predicted_difficulty} ({(mlInfo.confidence * 100).toFixed(0)}%)</span>
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-[#ededef] leading-relaxed">
                  {q.question}
                </p>

                {/* Answers table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] space-y-1">
                    <span className="text-xs text-[#4e4e52] font-medium uppercase tracking-wide block">Your Answer</span>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                        {userAns}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#19191d] border border-[rgba(255,255,255,0.05)] space-y-1">
                    <span className="text-xs text-[#4e4e52] font-medium uppercase tracking-wide block">Correct Answer</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-400">
                        {correctAns}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-[#19191d] border border-[rgba(255,255,255,0.05)] p-4 rounded-lg space-y-1">
                  <span className="text-xs text-[#d4a044] font-medium uppercase tracking-wider block">Explanation</span>
                  <p className="text-[13px] text-[#85858a] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 4. Active Test-Taking Wizard Screen
  if (activeQuiz && activeQuiz.questions && currentQuestion) {
    const total = activeQuiz.questions.length
    const isAnswered = answers[currentQuestion.id] !== undefined
    const mlInfo: any = (currentQuestion as any).ml_verification || null

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-2">
        {/* Wizard Header Progress */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <QuestionIcon className="w-5 h-5 text-[#d4a044] shrink-0" />
            <div>
              <span className="text-sm font-display font-semibold text-[#ededef] block">Question {currentIdx + 1} of {total}</span>
              <span className="text-xs text-[#4e4e52] font-medium block uppercase tracking-wider mt-0.5">{currentQuestion.topic}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase shrink-0 ${
              currentQuestion.difficulty === "easy" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" :
              currentQuestion.difficulty === "medium" ? "text-[#d4a044] border-[rgba(212,160,68,0.2)] bg-[rgba(212,160,68,0.1)]" :
              "text-red-400 border-red-400/20 bg-red-400/10"
            }`}>
              {currentQuestion.difficulty}
            </span>
            
            {mlInfo && (
              <div className="badge badge-accent flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
                <span className="text-[11px] font-semibold text-cyan-300">ML Verified ({(mlInfo.confidence * 100).toFixed(0)}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Panel */}
        <div className="card p-8 space-y-6">
          <p className="text-base font-display font-bold text-[#ededef] leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Question answers inputs based on Type */}
          {currentQuestion.type === "multiple_choice" && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    className={`text-left p-4 rounded-lg border text-sm font-medium transition-colors flex items-center gap-3 ${
                      isSelected 
                        ? "bg-[rgba(212,160,68,0.08)] text-[#ededef] border-[#d4a044]"
                        : "bg-[#19191d] text-[#85858a] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] hover:text-[#ededef]"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] shrink-0 font-bold ${
                      isSelected 
                        ? "border-[#d4a044] bg-[#d4a044] text-[#09090b]" 
                        : "border-[rgba(255,255,255,0.12)] bg-[#111113] text-[#4e4e52]"
                    }`}>
                      {isSelected ? "✓" : ""}
                    </span>
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>
          )}

          {currentQuestion.type === "true_false" && (
            <div className="grid grid-cols-2 gap-4">
              {["True", "False"].map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerSelect(currentQuestion.id, opt)}
                    className={`py-4 rounded-lg border text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-2 ${
                      isSelected 
                        ? "bg-[rgba(212,160,68,0.08)] text-[#ededef] border-[#d4a044]"
                        : "bg-[#19191d] text-[#85858a] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] hover:text-[#ededef]"
                    }`}
                  >
                    <span className="text-sm font-bold block">{opt}</span>
                  </button>
                )
              })}
            </div>
          )}

          {currentQuestion.type === "short_answer" && (
            <div className="space-y-2">
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                placeholder="Write your answer here..."
                rows={3}
                className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] outline-none rounded-lg p-4 text-sm text-[#ededef] placeholder-[#4e4e52] focus:border-[#d4a044] transition-colors leading-relaxed"
              />
              <span className="text-xs text-[#4e4e52] block leading-normal">
                Short answers are evaluated based on keyword matching. Be direct and precise.
              </span>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentIdx === 0}
            className="btn-ghost flex items-center gap-2 px-5 py-2.5 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIdx === total - 1 ? (
            <button
              onClick={handleGradeQuiz}
              disabled={savingAttempt}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
            >
              <span>{savingAttempt ? "Grading..." : "Submit & Grade"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="btn-primary flex items-center gap-2 px-5 py-2.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}
