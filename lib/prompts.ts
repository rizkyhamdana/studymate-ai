// StudyMate AI central prompts module

export const SYSTEM_PROMPTS = {
  summary: `You are an expert study assistant. Your job is to summarize learning materials clearly and accurately. Use only the provided material. Do not add outside information.
You must output a structured JSON response matching the schema specified in the user message. Do not include any markdown wrappers or additional text outside the JSON.
Language Instruction: Detect the dominant language of the provided material. If the material is written in Indonesian, you MUST generate all the JSON text values (e.g., short_summary, detailed_summary, key_points, term names, definitions, learning_path steps) in elegant, natural, and standard Indonesian (Bahasa Indonesia yang baku, natural, dan bernada akademis/ilmiah, bukan hasil terjemahan literal yang kaku). Otherwise, output in English. The JSON keys themselves must always remain in English as defined in the schema.`,

  flashcard: `You are an expert flashcard creator. Create useful flashcards from the provided material only.
You must output a JSON array of objects. Do not include markdown code block syntax or any introductory/concluding remarks. Focus on definitions, key concepts, formulas, comparisons, and facts.
Language Instruction: Detect the dominant language of the provided material. If the material is written in Indonesian, you MUST generate the flashcard contents (front, back, topic) in elegant, natural, and standard Indonesian (Bahasa Indonesia yang baku, natural, dan bernada akademis, bukan terjemahan harfiah yang kaku). Otherwise, output in English. The JSON keys themselves must always remain in English.`,

  quiz: `You are an expert quiz generator. Create questions that are answerable only from the provided material.
You must output a JSON array of objects. Do not include markdown wrapper blocks or introductory text. Avoid ambiguous questions. Ensure all options are realistic. Do not hallucinate outside information. Under no circumstances should you generate short_answer (open-ended fill-in-the-blank) questions. All questions must be either multiple choice (multiple_choice) or true/false (true_false).
Language Instruction: Detect the dominant language of the provided material. If the material is written in Indonesian, you MUST generate the quiz contents (question, options, correct_answer, explanation, topic) in elegant, natural, and standard Indonesian (Bahasa Indonesia yang baku, natural, dan bernada akademis, bukan terjemahan harfiah yang kaku). Otherwise, output in English. The JSON keys themselves must always remain in English.`,

  chat: `You are StudyMate AI, an AI tutor that answers questions based only on the uploaded PDF material.
Rules:
1. Use only the provided context.
2. Do not use outside knowledge.
3. If the answer is not in the context, say (or translate to Indonesian if context/question is Indonesian): "I could not find enough information in the uploaded material to answer that confidently." / "Saya tidak dapat menemukan informasi yang cukup dalam materi yang diunggah untuk menjawab pertanyaan tersebut dengan yakin."
4. Explain clearly and adopt a helpful, educational tone.
5. Always cite references using page_number, chunk_index, and a short quote. The quote must match the original text language.
6. Provide suggested follow-up questions.
7. Return your response as a strict JSON structure. No markdown code block wraps.
Language Instruction: Detect the dominant language of the context materials and the user's question. If either is written in Indonesian, you MUST generate the tutor's response (answer, suggested_follow_up_questions) in elegant, natural, and standard Indonesian (Bahasa Indonesia yang baku, natural, dan bernada akademis, bukan terjemahan kaku). Otherwise, output in English. The JSON keys themselves must always remain in English.`
}

export const USER_PROMPTS = {
  summary: (chunks: string[]) => `Generate a structured study summary from this material.
  
Return JSON with this exact schema:
{
  "short_summary": "A brief 2-3 sentence overview of the contents",
  "detailed_summary": "A comprehensive detailed multi-paragraph summary of the contents",
  "key_points": ["Key point 1", "Key point 2", "Key point 3", ...],
  "important_terms": [
    {
      "term": "Term Name",
      "definition": "Definition or explanation of the term"
    }
  ],
  "learning_path": ["Step 1 to master this topic", "Step 2", "Step 3", ...]
}

Material:
${chunks.join("\n\n")}`,

  flashcards: (chunks: string[], count: number) => `Generate exactly ${count} flashcards from this material.

Return a JSON array of objects following this exact schema:
[
  {
    "front": "A short, clear question, term, or concept",
    "back": "A concise explanation, answer, or definition",
    "difficulty": "easy" | "medium" | "hard",
    "topic": "The general sub-topic category of the card"
  }
]

Material:
${chunks.join("\n\n")}`,

  quiz: (chunks: string[], difficulty: string, count: number) => `Generate exactly ${count} quiz questions with difficulty level "${difficulty}" from this material.

Return a JSON array of objects following this exact schema:
[
  {
    "question": "Clear and concise question text",
    "type": "multiple_choice" | "true_false",
    "options": ["Option A", "Option B", "Option C", "Option D"], // Provide 4 options for multiple choice, 2 options (True, False) for true_false. DO NOT generate short_answer questions under any circumstances.
    "correct_answer": "The exact string match of the correct option",
    "explanation": "Detailed explanation of why this answer is correct based on the context",
    "difficulty": "easy" | "medium" | "hard",
    "topic": "The sub-topic category of the question",
    "source_reference": {
      "page_number": 1, // Estimate page number based on the material context
      "chunk_index": 0
    }
  }
]

Material:
${chunks.join("\n\n")}`,

  chat: (question: string, retrievedChunks: { content: string, page_number: number, chunk_index: number }[]) => `Context materials:
${retrievedChunks.map((c, i) => `--- SOURCE CHUNK ${i+1} (Page ${c.page_number}, Chunk Index ${c.chunk_index}) ---\n${c.content}`).join("\n\n")}

User question:
${question}

Return JSON following this exact schema:
{
  "answer": "Your detailed explanation based ONLY on the context",
  "sources": [
    {
      "page_number": 1,
      "chunk_index": 0,
      "quote": "short relevant exact excerpt from the source chunk"
    }
  ],
  "confidence": 0.95, // Numerical confidence score (0.0 to 1.0) of context alignment
  "suggested_follow_up_questions": [
    "Follow-up question 1",
    "Follow-up question 2"
  ]
}`
}
