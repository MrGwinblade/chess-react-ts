"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  DiamondIcon,
  BookOpenIcon,
  Target,
  Eye,
  Newspaper,
  Users,
  Settings2,
  HelpCircle,
} from "lucide-react"

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => setIsExpanded((prev) => !prev)

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-[#312e2b] border-r border-white/10
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-16"}
      `}
    >
      {/* Auth Section */}
      <div className="p-4 border-b border-white/10">
        {isExpanded ? (
          <>
            <button className="w-full text-left px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg mb-2">
              Login
            </button>
            <button className="w-full text-left px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg">
              Register
            </button>
          </>
        ) : (
          <button className="w-full flex items-center justify-center p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg">
            <Users className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <SidebarButton icon={<DiamondIcon />} isCollapsed={!isExpanded}>
          Play
        </SidebarButton>
        <SidebarButton icon={<Target />} isCollapsed={!isExpanded}>
          Puzzles
        </SidebarButton>
        <SidebarButton icon={<BookOpenIcon />} isCollapsed={!isExpanded}>
          Learn
        </SidebarButton>
        <SidebarButton icon={<Eye />} isCollapsed={!isExpanded}>
          Watch
        </SidebarButton>
        <SidebarButton icon={<Newspaper />} isCollapsed={!isExpanded}>
          News
        </SidebarButton>
        <SidebarButton icon={<Users />} isCollapsed={!isExpanded}>
          Social
        </SidebarButton>
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-white/10">
        <SidebarButton icon={<Settings2 />} isCollapsed={!isExpanded}>
          Settings
        </SidebarButton>
        <SidebarButton icon={<HelpCircle />} isCollapsed={!isExpanded}>
          Help
        </SidebarButton>

        {/* Collapse Button - Hidden on mobile */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors mt-2"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>
    </aside>
  )
}

interface SidebarButtonProps {
  icon: React.ReactNode
  children: React.ReactNode
  isCollapsed: boolean
}

function SidebarButton({ icon, children, isCollapsed }: SidebarButtonProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors rounded-lg mb-2">
      <span className="w-5 h-5">{icon}</span>
      {!isCollapsed && <span className="text-sm">{children}</span>}
    </button>
  )
}

