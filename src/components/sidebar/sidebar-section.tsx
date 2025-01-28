interface SidebarSectionProps {
    children: React.ReactNode
    className?: string
  }
  
  export function SidebarSection({ children, className = "" }: SidebarSectionProps) {
    return <div className={`flex flex-col gap-1 ${className}`}>{children}</div>
  }
  
  