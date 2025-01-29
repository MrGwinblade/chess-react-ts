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
  Home
} from "lucide-react"
import { Link } from "react-router-dom" // Добавляем импорт
import { observer } from "mobx-react-lite"
import { useStore } from "../../hooks/useStore"
import { logout } from "../../Services/api"
import { Modal } from "../modal/Modal"
import { LoginForm } from "../modal/LoginForm"
import type { GameStore } from "../../Stores/GameStore"

interface SidebarProps {
  gameStore: GameStore
}



export const Sidebar = observer(({ gameStore }: SidebarProps) => {
  const { authStore } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<"login" | "register">("login")

  const handlePlayClick = () => {
    gameStore.resetGame()
  }

  const handleLogout = async () => {
    //await logout()
    authStore.logout()
  }

  const openModal = (content: "login" | "register") => {
    setModalContent(content)
    setIsModalOpen(true)
  }

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
        relative flex flex-col h-screen bg-[#1b1a18] border-r border-white/10
        transition-all duration-0 ease-in-out
        ${isExpanded ? "w-64" : "w-16"}
      `}
    >
      {/* Auth Section */}
      <div className="p-4 border-b border-white/10">
        {isExpanded ? (
          <Link 
            to="/" 
            className="w-full flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-lg mb-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            My-react-Chess
          </Link>
        ) : (
          <Link 
            to="/" 
            className="w-full flex items-center justify-center py-2 px-0 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
        )}
      </div>


      <div id="LoginSection" className="p-4 border-b border-white/10">
        {authStore.isAuthenticated ? (
          isExpanded ? (
            <div className="flex flex-col">
              <span className="text-white mb-2">{authStore.userData?.username}</span>
              <button
                className="w-full text-left px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center py-2 px-0 text-white bg-white/10 hover:bg-white/20 rounded-lg"
              onClick={handleLogout}
            >
              <Users className="w-5 h-5" />
            </button>
          )
        ) : (
          isExpanded ? (
            <>
              <button className="w-full text-left px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg mb-2" onClick={() => openModal('login')}>
                Login
              </button>
              <button className="w-full text-left px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg" onClick={() => openModal('register')}>
                Register
              </button>
            </>
          ) : (
            <button className="w-full flex items-center justify-center py-2 px-0 text-white bg-white/10 hover:bg-white/20 rounded-lg" onClick={() => openModal('login')}>
              <Users className="w-5 h-5" />
            </button>
          )
        )}
      </div>



      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <SidebarButton icon={<DiamondIcon />} isCollapsed={!isExpanded} onClick={handlePlayClick}>
          Play
        </SidebarButton>
        <SidebarButton icon={<Target />} isCollapsed={!isExpanded}>
          Puzzles (template)
        </SidebarButton>
        <SidebarButton icon={<BookOpenIcon />} isCollapsed={!isExpanded}>
          Learn (template)
        </SidebarButton>
        <SidebarButton icon={<Eye />} isCollapsed={!isExpanded}>
          Watch (template)
        </SidebarButton>
        <SidebarButton icon={<Newspaper />} isCollapsed={!isExpanded}>
          News (template)
        </SidebarButton>
        <SidebarButton icon={<Users />} isCollapsed={!isExpanded}>
          Social (template)
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm isRegister={modalContent === 'register'} onClose={() => setIsModalOpen(false)} />
      </Modal>

      
      
    </aside>

    
  )
  
})


interface SidebarButtonProps {
  icon: React.ReactNode
  children: React.ReactNode
  isCollapsed: boolean
  onClick?: () => void
}


function SidebarButton({ icon, children, isCollapsed, onClick }: SidebarButtonProps) {
  return (
    <button
      className={`
        w-full flex items-center 
        ${isCollapsed ? "px-0 justify-center" : "px-4 justify-start"} 
        py-2 text-white hover:bg-white/20 
        transition-all duration-0 ease-in-out 
        rounded-lg mb-2
        group
      `}
      onClick={onClick}
    >
      {icon}
      <span className={`${isCollapsed ? "hidden" : "ml-4"}`}>{children}</span>
    </button>
  )
}

