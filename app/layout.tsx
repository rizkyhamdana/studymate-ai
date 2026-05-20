import "@/app/globals.css"
import type { Metadata } from "next"
import Sidebar from "@/components/layout/Sidebar"

export const metadata: Metadata = {
  title: "StudyMate AI — Your intelligent study companion",
  description: "Transform PDF materials into structured summaries, flashcards, quizzes, and get AI-powered tutoring with precise source citations.",
  keywords: ["StudyMate", "AI Tutor", "PDF Study", "Flashcards", "Quiz Generator", "Learning"]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex font-body">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
          <div className="flex-1 flex flex-col px-6 py-8 md:px-10 md:py-10 max-w-[1200px] w-full mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
