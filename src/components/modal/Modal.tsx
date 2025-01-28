import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative z-10 bg-[#12041a] rounded-lg p-8 max-w-md w-full mx-4">
        <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

