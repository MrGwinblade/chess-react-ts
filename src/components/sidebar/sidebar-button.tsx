interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode
    isCollapsed?: boolean
  }
  
  export function SidebarButton({ children, icon, isCollapsed, className = "", ...props }: SidebarButtonProps) {
    return (
      <button
        className={`w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors rounded-lg ${className}`}
        {...props}
      >
        {icon && <span className="w-5 h-5">{icon}</span>}
        {!isCollapsed && <span className="text-sm">{children}</span>}
      </button>
    )
  }
  
  