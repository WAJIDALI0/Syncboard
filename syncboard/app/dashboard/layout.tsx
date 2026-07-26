import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, PenTool, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { UserProfile } from '@/components/dashboard/UserProfile'
import NotificationBell from '@/components/dashboard/NotificationBell'
import OnlinePresence from '@/components/dashboard/OnlinePresence'
import { WorkspaceSwitcher } from '@/components/dashboard/WorkspaceSwitcher'
import { InviteMemberModal } from '@/components/dashboard/InviteMemberModal'
import { TeamChat } from '@/components/dashboard/TeamChat'
import { MobileSidebar } from '@/components/dashboard/MobileSidebar'
import { SidebarNav } from '@/components/dashboard/SidebarNav'
import { getUserWorkspaces, getActiveWorkspaceContext } from '@/actions/workspaceActions'
import { cookies } from 'next/headers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Star } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const workspaces = await getUserWorkspaces()
  const cookieStore = await cookies()
  const activeWorkspaceId = cookieStore.get('active_workspace_id')?.value
  const activeWorkspace = await getActiveWorkspaceContext()

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl flex flex-col hidden md:flex transition-colors">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center">S</div>
            SyncBoard
          </h1>
        </div>
        <div className="px-4">
          <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId || workspaces[0]?.id} />
        </div>
        
        <SidebarNav />

        {/* Pro Plan Widget */}
        <div className="mx-4 mt-auto mb-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
              <Star size={16} fill="currentColor" />
            </div>
            <h4 className="font-semibold text-sm">Pro Plan</h4>
          </div>
          <p className="text-xs text-zinc-500 mb-3">You are on Pro Plan.</p>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full w-[45%]"></div>
          </div>
          <p className="text-[10px] text-zinc-400">Renews on Dec 28, 2026</p>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <UserProfile email={user.email || ''} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        {/* Mobile Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur flex items-center justify-between px-4 md:hidden z-10 transition-colors">
          <div className="flex items-center gap-2">
            <MobileSidebar workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} user={user} activeWorkspace={activeWorkspace} />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">SyncBoard</h1>
          </div>
          <div className="flex items-center gap-2">
            {activeWorkspace && <OnlinePresence user={{ id: user.id, email: user.email || '' }} workspaceId={activeWorkspace.id} />}
            <NotificationBell />
          </div>
        </header>

        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-between px-8 pt-4 pb-0 z-10 w-full">
          {/* Global Search Mockup */}
          <div className="relative w-96 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search anything... (Ctrl + K)" 
              className="pl-9 bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-full h-10 w-full text-sm placeholder:text-zinc-500" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Ctrl K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/tasks">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 font-semibold hidden lg:flex">
                <Plus size={16} className="mr-2" />
                New Task
              </Button>
            </Link>
            {activeWorkspace && <InviteMemberModal activeWorkspaceId={activeWorkspace.id} />}
            {activeWorkspace && <OnlinePresence user={{ id: user.id, email: user.email || '' }} workspaceId={activeWorkspace.id} />}
            <NotificationBell />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 md:pt-4 z-10">
          {children}
        </div>
      </main>
      <Toaster theme="dark" />
      {activeWorkspace && (
        <TeamChat workspaceId={activeWorkspace.id} userId={user.id} userName={user.email?.split('@')[0] || ''} />
      )}
    </div>
  )
}
