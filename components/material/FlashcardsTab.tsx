import { useState, useMemo, useEffect } from "react"
import { Flashcard, Material } from "@/lib/validators"
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  HelpCircle, 
  Check, 
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  Filter
} from "lucide-react"

interface FlashcardsTabProps {
  material: Material
  flashcards: Flashcard[]
  onFlashcardUpdated: (updatedCard: Flashcard) => void
}

export default function FlashcardsTab({
  material,
  flashcards: initialFlashcards,
  onFlashcardUpdated
}: FlashcardsTabProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Sync state if initialFlashcards changes
  useEffect(() => {
    setFlashcards(initialFlashcards)
  }, [initialFlashcards])

  // Get unique topics
  const topics = useMemo(() => {
    const set = new Set(initialFlashcards.map(f => f.topic))
    return Array.from(set)
  }, [initialFlashcards])

  // Filtered flashcards list
  const filteredCards = useMemo(() => {
    return flashcards.filter(card => {
      const matchDifficulty = selectedDifficulty === "all" || card.difficulty === selectedDifficulty
      const matchTopic = selectedTopic === "all" || card.topic === selectedTopic
      const matchStatus = selectedStatus === "all" || card.status === selectedStatus
      return matchDifficulty && matchTopic && matchStatus
    })
  }, [flashcards, selectedDifficulty, selectedTopic, selectedStatus])

  // Reset index if filters change or filtered list shrinks
  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [selectedDifficulty, selectedTopic, selectedStatus])

  const activeCard = filteredCards[currentIndex] || null

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, 150)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
      }, 150)
    }
  }

  const updateCardStatus = async (status: "mastered" | "review") => {
    if (!activeCard) return
    
    try {
      setUpdatingId(activeCard.id || null)
      const res = await fetch("/api/flashcards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id, status })
      })

      if (!res.ok) throw new Error("Failed to update status")
      
      const updated = await res.json()
      
      // Update local state
      const updatedList = flashcards.map(c => c.id === updated.id ? updated : c)
      setFlashcards(updatedList)
      onFlashcardUpdated(updated)
      
      // Auto advance to next card after short delay
      setTimeout(() => {
        if (currentIndex < filteredCards.length - 1) {
          handleNext()
        }
      }, 300)
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Stats
  const masteredCount = useMemo(() => flashcards.filter(f => f.status === "mastered").length, [flashcards])
  const reviewCount = useMemo(() => flashcards.filter(f => f.status === "review").length, [flashcards])
  const newCount = useMemo(() => flashcards.filter(f => f.status === "new").length, [flashcards])
  const masteryPercentage = useMemo(() => {
    return flashcards.length > 0 ? Math.round((masteredCount / flashcards.length) * 100) : 0
  }, [flashcards, masteredCount])

  return (
    <div className="space-y-5">
      {/* Header Deck Panel */}
      <div className="card p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-display font-bold text-base text-[#ededef]">Active Flashcards</h3>
          <p className="text-xs text-[#85858a] mt-1">
            Test your retrieval memory, flip for definitions, and grade your mastery performance.
          </p>
        </div>
        
        {/* Progress Tracker bar */}
        <div className="flex items-center gap-5 shrink-0 bg-[#19191d] border border-[rgba(255,255,255,0.06)] px-4 py-2.5 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-[#4e4e52] font-semibold uppercase tracking-wider block">Deck Mastery</span>
            <span className="text-xs font-bold text-[#ededef]">{masteredCount} / {flashcards.length} Cards ({masteryPercentage}%)</span>
          </div>
          <div className="w-20 h-1.5 bg-[#111113] rounded-full overflow-hidden border border-[rgba(255,255,255,0.06)] shrink-0">
            <div 
              className="h-full bg-[#d4a044] transition-all duration-300"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters & Control Grid */}
      <div className="card p-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-end">
        {/* Topic filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#85858a] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#d4a044]" />
            <span>Select Topic</span>
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-[#ededef] outline-none transition-colors focus:border-[#d4a044]"
          >
            <option value="all">All Topics ({topics.length})</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#85858a] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#d4a044]" />
            <span>Difficulty Level</span>
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-[#ededef] outline-none transition-colors focus:border-[#d4a044]"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Mastery Status Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#85858a] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3 h-3 text-[#d4a044]" />
            <span>Mastery Status</span>
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-[#ededef] outline-none transition-colors focus:border-[#d4a044]"
          >
            <option value="all">All Cards</option>
            <option value="new">New ({newCount})</option>
            <option value="review">Needs Review ({reviewCount})</option>
            <option value="mastered">Mastered ({masteredCount})</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={() => {
            setSelectedTopic("all")
            setSelectedDifficulty("all")
            setSelectedStatus("all")
          }}
          className="py-2 bg-[#19191d] hover:bg-[#222226] text-[#85858a] hover:text-[#ededef] text-xs font-semibold rounded-lg border border-[rgba(255,255,255,0.08)] transition-colors text-center sm:col-span-3 md:col-span-1"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Flashcard player */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto py-2">
          
          {/* Card Player perspective wrapper */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-[300px] flashcard-perspective cursor-pointer relative group"
          >
            <div className={`relative w-full h-full flashcard-inner ${isFlipped ? "flashcard-flipped" : ""}`}>
              
              {/* Front Face */}
              <div 
                className="absolute inset-0 w-full h-full flashcard-face bg-[#111113] border border-[rgba(255,255,255,0.06)] hover:border-[#d4a044]/30 rounded-2xl p-8 flex flex-col justify-between shadow-lg overflow-hidden"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translate3d(0,0,0)" }}
              >
                {/* Front Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#4e4e52] font-bold uppercase tracking-widest">{activeCard.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      activeCard.difficulty === "easy" ? "badge-success" :
                      activeCard.difficulty === "medium" ? "badge-accent" :
                      "badge-danger"
                    }`}>
                      {activeCard.difficulty}
                    </span>
                    <span className={`badge ${
                      activeCard.status === "mastered" ? "badge-success" :
                      activeCard.status === "review" ? "badge-accent" :
                      "bg-[#19191d] text-[#85858a] border border-[rgba(255,255,255,0.06)] font-medium"
                    }`}>
                      {activeCard.status === "new" ? "new" : activeCard.status === "review" ? "needs review" : "mastered"}
                    </span>
                  </div>
                </div>

                {/* Front Content */}
                <div className="text-center py-6 px-4">
                  <span className="text-[10px] text-[#d4a044] font-bold uppercase tracking-wider block mb-3">Question Concept</span>
                  <p className="text-base font-display font-semibold text-[#ededef] leading-relaxed line-clamp-4">
                    {activeCard.front}
                  </p>
                </div>

                {/* Front Footer hint */}
                <div className="text-center text-[#4e4e52] text-xs font-light flex items-center justify-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-[#4e4e52]" />
                  <span>Click card to reveal definition</span>
                </div>
              </div>

              {/* Back Face */}
              <div 
                className="absolute inset-0 w-full h-full flashcard-face flashcard-back bg-[#19191d] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col justify-between shadow-xl overflow-hidden"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg) translate3d(0,0,0)" }}
              >
                {/* Back Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#4e4e52] font-bold uppercase tracking-widest">{activeCard.topic}</span>
                  <span className="text-[10px] font-bold text-[#d4a044] uppercase tracking-widest">Answer Key</span>
                </div>

                {/* Back Content */}
                <div className="py-4 px-2 overflow-y-auto max-h-[160px] text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] text-[#d4a044]/85 font-bold uppercase tracking-wider block mb-2">AI Synthesis</span>
                  <p className="text-sm text-[#ededef] leading-relaxed font-light max-w-lg">
                    {activeCard.back}
                  </p>
                </div>

                {/* Back Footer controls hint */}
                <div className="text-center text-[#4e4e52] text-xs font-light">
                  <span>Press buttons below to score, or click to flip back</span>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full px-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-lg bg-[#19191d] hover:bg-[#222226] border border-[rgba(255,255,255,0.08)] disabled:opacity-30 text-[#85858a] hover:text-[#ededef] flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-xs font-semibold text-[#4e4e52] tracking-wide">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              className="w-9 h-9 rounded-lg bg-[#19191d] hover:bg-[#222226] border border-[rgba(255,255,255,0.08)] disabled:opacity-30 text-[#85858a] hover:text-[#ededef] flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Active card score buttons */}
          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={() => updateCardStatus("review")}
              disabled={updatingId !== null}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold transition-colors ${
                activeCard.status === "review" 
                  ? "bg-[rgba(212,160,68,0.1)] text-[#d4a044] border-[rgba(212,160,68,0.2)]"
                  : "bg-[#111113] text-[#85858a] border-[rgba(255,255,255,0.06)] hover:bg-[#19191d] hover:text-[#ededef]"
              }`}
            >
              <Clock className="w-4 h-4 text-[#d4a044] shrink-0" />
              <span>{updatingId === activeCard.id ? "Updating..." : "Needs Review"}</span>
            </button>

            <button
              onClick={() => updateCardStatus("mastered")}
              disabled={updatingId !== null}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold transition-colors ${
                activeCard.status === "mastered"
                  ? "bg-[rgba(52,211,153,0.1)] text-[#34d399] border-[rgba(52,211,153,0.2)]"
                  : "bg-[#111113] text-[#85858a] border-[rgba(255,255,255,0.06)] hover:bg-[#19191d] hover:text-[#ededef]"
              }`}
            >
              <CheckCircle className="w-4 h-4 text-[#34d399] shrink-0" />
              <span>{updatingId === activeCard.id ? "Updating..." : "Mastered Concept"}</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="card p-10 text-center space-y-4 max-w-md mx-auto">
          <Layers className="w-12 h-12 text-[#4e4e52] mx-auto" />
          <h4 className="font-display font-semibold text-[#ededef] text-sm">No Matching Flashcards</h4>
          <p className="text-[#85858a] text-xs max-w-xs mx-auto leading-relaxed">
            There are no active concept cards fitting the selected filter criteria. Try resetting the filters to browse your entire learning deck.
          </p>
          <button
            onClick={() => {
              setSelectedTopic("all")
              setSelectedDifficulty("all")
              setSelectedStatus("all")
            }}
            className="btn-ghost text-xs mx-auto"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

