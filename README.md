# StudyMate AI 🎓✨

StudyMate AI is a premium, feature-rich web-based study assistant designed to transform ordinary PDFs into active learning ecosystems. With StudyMate AI, you can upload any academic document or study guide and instantly generate structured summaries, interactive flashcards, practice quizzes, and engage in real-time chat with an AI tutor that references specific pages and passages of your source material.

Featuring a sleek **glassmorphic design system** with a gold-and-carbon theme, fluid framer-motion micro-interactions, responsive charts, and elegant 3D card flips.

---

## 🚀 Key Features

*   **📄 AI-Generated Summaries:** Instantly creates short and detailed summaries, list of key takeaways, structured learning paths, and interactive glossary cards for important terms.
*   **🎴 Smart 3D Flashcards:** Study core concepts through fluid 3D-flipping cards. Rate your familiarity to track mastery levels.
*   **🧠 Adaptive Quizzes:** Practice tests categorized by machine learning difficulty tiers, complete with detailed explanations and topic tracking.
*   **💬 AI Tutor (Doc-Grounded Chat):** Chat with an intelligent assistant to clarify complex concepts. Every response lists precise source page citations to prevent hallucinations.
*   **📊 Learning Analytics:** High-fidelity analytics screens displaying study scores, historical progress, and topic breakdowns using dynamic chart visualization.
*   **🔋 Hybrid Storage & Engine Architecture:** Runs instantly out of the box using a powerful local mock-engine and mock-database (`localStorage` + static seeding) or hooks up to OpenAI & Supabase for production.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Styling:** TailwindCSS with custom design system tokens (Gold & Dark glassmorphism)
*   **Interactions:** Framer Motion & Lucide Icons
*   **Charts:** Recharts for analytical insights
*   **Database:** Supabase Client (optional) / Local Mock-Database Server fallback
*   **Language:** TypeScript

---

## ⚙️ Setup & Installation

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd studymate-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` or `.env`:
```bash
cp .env.example .env.local
```

Fill in the credentials if you wish to run on live APIs. If you leave them empty, StudyMate AI **seamlessly falls back to a high-fidelity local database and mock AI engine** so you can preview all features immediately:
```env
# OpenAI API Key (For live AI features. Omit to run on mock engine)
OPENAI_API_KEY=

# Supabase Configurations (For live vectors. Omit to run on localStorage database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience StudyMate AI!

---

## 📂 Project Structure

```text
├── app/                  # Next.js pages, layouts, and route handlers
│   ├── analytics/        # Study analytics and progression metrics page
│   ├── api/              # Local server mockup APIs and AI endpoints
│   ├── dashboard/        # Main study dashboard showing list of materials
│   ├── materials/        # Active studying environment (Summaries, Flashcards, Quiz, Tutor)
│   ├── settings/         # API Key & database integration settings page
│   ├── upload/           # File drag-and-drop workspace
│   ├── globals.css       # Core design system tokens, buttons, and scrolls
│   ├── layout.tsx        # Base template and layout structure
│   └── page.tsx          # Responsive, immersive landing page
├── components/           # Reusable UI elements (Flashcards, Quizzes, Chat, Sidebar)
├── lib/                  # Database connections and high-fidelity mock-engine algorithms
├── ml/                   # Machine learning model concepts and helpers
├── scratch/              # Ignored local database directory containing mock JSON state
├── .env.example          # Environment variables template
├── .gitignore            # Clean git configuration
└── tailwind.config.js    # Custom typography, animations, and gold/carbon variables
```

---

## 📄 License

This project is licensed under the MIT License.
