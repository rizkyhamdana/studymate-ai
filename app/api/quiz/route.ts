import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { generateQuiz } from "@/lib/openai"
import { isIndonesian } from "@/lib/language"
import { execSync } from "child_process"
import path from "path"
import fs from "fs"

function classifyDifficultyLocally(question: string, topic: string): { difficulty: string; confidence: number; method: string } {
  const qLower = question.toLowerCase()
  const hardWords = [
    // English
    "derive", "prove", "optimize", "given a model", "critically", "assess", "evaluate",
    "consequences of", "implement a", "thread-safe", "overfitting", "underfitting",
    "contradiction", "layout thrashing", "molecular level",
    // Indonesian
    "turunkan", "buktikan", "optimalkan", "diberikan model", "secara kritis", "menilai", "evaluasi",
    "konsekuensi dari", "penerapan", "aman terhadap thread", "kontradiksi", "tingkat molekuler"
  ]
  const mediumWords = [
    // English
    "compare", "difference between", "how does", "explain how", "describe", "impact of",
    "kinetic", "potential", "mitosis", "meiosis", "server-side",
    // Indonesian
    "bandingkan", "perbedaan antara", "bagaimana cara", "jelaskan bagaimana", "gambarkan", "dampak dari",
    "kinetik", "potensial", "sisi server"
  ]

  const words = question.split(/\s+/).length

  if (hardWords.some(hw => qLower.includes(hw)) || words > 15) {
    return { difficulty: "hard", confidence: 0.85, method: "local_heuristic_ts" }
  } else if (mediumWords.some(mw => qLower.includes(mw)) || (words >= 10 && words <= 15)) {
    return { difficulty: "medium", confidence: 0.80, method: "local_heuristic_ts" }
  } else {
    return { difficulty: "easy", confidence: 0.90, method: "local_heuristic_ts" }
  }
}

/**
 * Invokes the python3 ML classifier script to predict question difficulty.
 */
function verifyDifficultyWithML(question: string, topic = "General"): { difficulty: string; confidence: number; method: string } {
  try {
    const projectRoot = path.resolve(process.cwd())
    const scriptPath = path.join(projectRoot, "ml", "src", "inference_difficulty.py")
    
    if (fs.existsSync(scriptPath)) {
      // Safely select the python command: use local venv python if available, otherwise fallback to system python3
      let pythonBin = "python3"
      const venvPaths = [
        path.join(projectRoot, ".venv", "bin", "python"),
        path.join(projectRoot, "venv", "bin", "python"),
        path.join(projectRoot, "env", "bin", "python")
      ]
      for (const vp of venvPaths) {
        if (fs.existsSync(vp)) {
          pythonBin = vp
          break
        }
      }

      // Escape arguments safely for CLI execution
      const escapedQuestion = question.replace(/"/g, '\\"').replace(/'/g, "\\'")
      const escapedTopic = topic.replace(/"/g, '\\"').replace(/'/g, "\\'")
      
      const cmd = `"${pythonBin}" -c "import sys; sys.path.append('${projectRoot}'); from ml.src.inference_difficulty import predict_difficulty; print(predict_difficulty('${escapedQuestion}', '${escapedTopic}'))"`
      
      const stdout = execSync(cmd, { cwd: projectRoot, timeout: 4000 }).toString()
      // Parse output dictionary representation (e.g. {'question': ..., 'predicted_difficulty': 'easy', 'confidence': 0.61, 'method': 'ml_model'})
      const difficultyMatch = stdout.match(/'predicted_difficulty':\s*'([^']+)'/)
      const confidenceMatch = stdout.match(/'confidence':\s*([0-9.]+)/)
      const methodMatch = stdout.match(/'method':\s*'([^']+)'/)
      
      if (difficultyMatch && confidenceMatch) {
        return {
          difficulty: difficultyMatch[1],
          confidence: parseFloat(confidenceMatch[1]),
          method: methodMatch ? methodMatch[1] : "python_ml_model"
        }
      }
    }
  } catch (err: any) {
    console.warn(
      `Python ML Classifier shell invocation failed. Running local fallback. Details:\n` +
      `Command output: ${err.stdout?.toString() || ""}\n` +
      `Command error: ${err.stderr?.toString() || ""}\n` +
      `Exception message: ${err.message || err}`
    );
  }

  // Graceful Local Fallback
  return classifyDifficultyLocally(question, topic)
}

export async function POST(req: NextRequest) {
  try {
    const { materialId, count = 5, difficulty = "medium", regenerate = false } = await req.json()
    
    if (!materialId) {
      return NextResponse.json({ error: "Missing material ID parameter" }, { status: 400 })
    }

    if (!regenerate) {
      const cached = await db.getQuizzes(materialId)
      if (cached && cached.length > 0) {
        // Fetch questions for the first quiz
        const questions = await db.getQuizQuestions(cached[0].id)
        return NextResponse.json({ quiz: { ...cached[0], questions } })
      }
    }

    const chunks = await db.getMaterialChunks(materialId)
    if (chunks.length === 0) {
      return NextResponse.json({ error: "No text chunks found for this material" }, { status: 400 })
    }

    const chunkContents = chunks.map(c => c.content)
    const rawQuestions = await generateQuiz(chunkContents, difficulty, count)
    
    if (!rawQuestions || rawQuestions.length === 0) {
      return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 })
    }

    // Bind ML Difficulty classification to verify/enrich our questions!
    const verifiedQuestions = rawQuestions.map(q => {
      const mlVerification = verifyDifficultyWithML(q.question, q.topic)
      return {
        ...q,
        difficulty: mlVerification.difficulty, // Optionally overwrite or retain predicted difficulty
        ml_verification: {
          predicted_difficulty: mlVerification.difficulty,
          confidence: mlVerification.confidence,
          method: mlVerification.method
        }
      }
    })

    const materialLanguageIsIndonesian = isIndonesian(chunkContents.join(" "))
    const title = materialLanguageIsIndonesian
      ? difficulty === "easy"
        ? "Kuis Latihan Mudah"
        : difficulty === "medium"
          ? "Kuis Latihan Sedang"
          : difficulty === "hard"
            ? "Kuis Latihan Sulit"
            : "Kuis Latihan"
      : difficulty === "all"
        ? "Practice Quiz"
        : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Practice Quiz`
    const quiz = await db.createQuiz(materialId, title, verifiedQuestions)
    
    return NextResponse.json({ quiz })
  } catch (err: any) {
    console.error("Quiz generation POST error:", err)
    return NextResponse.json({ error: err.message || "Failed to process quiz request" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { quizId, score, totalQuestions, weakTopics } = await req.json()
    
    if (!quizId || score === undefined || !totalQuestions || !weakTopics) {
      return NextResponse.json({ error: "Missing attempt log parameters" }, { status: 400 })
    }

    const attempt = await db.createQuizAttempt(quizId, score, totalQuestions, weakTopics)
    return NextResponse.json({ attempt })
  } catch (err: any) {
    console.error("Quiz attempt PUT error:", err)
    return NextResponse.json({ error: err.message || "Failed to log quiz attempt" }, { status: 500 })
  }
}
