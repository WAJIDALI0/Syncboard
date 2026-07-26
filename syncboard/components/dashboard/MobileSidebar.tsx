'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, LayoutDashboard, PenTool, Settings } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { InviteMemberModal } from './InviteMemberModal'
import { UserProfile } from './UserProfile'

export function MobileSidebar({
  workspaces,
  activeWorkspaceId,
  user,
  activeWorkspace
}: {
  workspaces: any[]
  activeWorkspaceId?: string
  user: any
  activeWorkspace: any
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
      } />
      <SheetContent side="left" className="w-72 bg-white dark:bg-zinc-950 p-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        <SheetHeader className="p-6 text-left border-b border-zinc-200 dark:border-zinc-800">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center">S</div>
            SyncBoard
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-4 pt-4 space-y-4">
          <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId || workspaces[0]?.id} />
          {activeWorkspace && <InviteMemberModal activeWorkspaceId={activeWorkspace.id} />}
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/canvas" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors font-medium">
            <PenTool size={20} /> Whiteboard
          </Link>
          <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors font-medium">
            <Settings size={20} /> Settings
          </Link>
        </nav>
        
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <UserProfile email={user.email || ''} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
