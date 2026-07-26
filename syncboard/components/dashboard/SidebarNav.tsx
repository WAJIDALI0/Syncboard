'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  PenTool, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Bell, 
  Sparkles, 
  Users, 
  Settings 
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Whiteboard', href: '/dashboard/canvas', icon: PenTool },
  { name: 'Team Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Files', href: '/dashboard/files', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { name: 'Teams', href: '/dashboard/teams', icon: Users },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'AI Assistant', href: '/dashboard/ai', icon: Sparkles, badge: 'BETA' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-4 custom-scrollbar">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              isActive 
                ? "text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20" 
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            )}
          >
            {isActive && (
              <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
            )}
            <Icon size={18} className={cn(
              "transition-colors",
              isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
            )} />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-wider">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
