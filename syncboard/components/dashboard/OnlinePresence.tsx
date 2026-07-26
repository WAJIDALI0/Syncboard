'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function OnlinePresence({ user, workspaceId }: { user: { id: string, email: string }, workspaceId: string }) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])

  useEffect(() => {
    if (!workspaceId) return
    
    // Create client inside useEffect to guarantee fresh channel maps across fast-refreshes
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase.channel(`presence:${workspaceId}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        // Extract all user objects from the presence state
        const users = Object.values(newState).flat().map((p: any) => p.user)
        // Filter to unique users by ID to avoid duplicates if same user has multiple tabs open
        const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values())
        setOnlineUsers(uniqueUsers)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: {
              id: user.id,
              email: user.email
            }
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id, user.email, workspaceId])

  const MAX_AVATARS = 4
  const visibleUsers = onlineUsers.slice(0, MAX_AVATARS)
  const remainingCount = onlineUsers.length - MAX_AVATARS

  return (
    <div className="flex items-center gap-2 mr-4">
      <div className="flex -space-x-2">
        {visibleUsers.map((u) => (
          <div 
            key={u.id} 
            className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs text-white font-medium shadow-sm relative group cursor-default" 
            title={u.email}
          >
            {u.email.charAt(0).toUpperCase()}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-300 font-medium shadow-sm z-10">
            +{remainingCount}
          </div>
        )}
      </div>
      {onlineUsers.length > 0 && (
        <span className="text-xs text-zinc-500 font-medium">Online</span>
      )}
    </div>
  )
}
