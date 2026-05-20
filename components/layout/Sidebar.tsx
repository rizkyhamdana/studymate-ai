"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  LayoutDashboard,
  UploadCloud,
  BookOpen,
  BarChart3,
  Settings
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: UploadCloud },
  { name: "Library", href: "/materials", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/") return
    navigation.forEach((item) => router.prefetch(item.href))
  }, [pathname, router])

  if (pathname === "/") return null

  return (
    <aside className="w-[220px] border-r border-[rgba(255,255,255,0.05)] bg-[#0c0c0e] flex flex-col shrink-0 sticky top-0 h-screen hidden md:flex">
      {/* Logo */}
      <div className="h-16 px-5 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-2.5">
        <div className="w-8 h-8 relative flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="StudyMate AI Logo"
            className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(0,242,254,0.35)] transition-transform duration-300 hover:scale-110"
          />
        </div>
        <span className="font-display font-bold text-[15px] text-[#ededef] tracking-tight">
          StudyMate
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              onMouseEnter={() => router.prefetch(item.href)}
              onFocus={() => router.prefetch(item.href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[rgba(255,255,255,0.06)] text-[#ededef] border-l-2 border-l-[#d4a044] -ml-px"
                  : "text-[#65656a] hover:text-[#a0a0a5] hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#d4a044]" : ""}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#19191d] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-semibold text-[#85858a]">
            D
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#ededef] truncate">Demo User</p>
            <p className="text-[11px] text-[#4e4e52] truncate">demo@studymate.ai</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
