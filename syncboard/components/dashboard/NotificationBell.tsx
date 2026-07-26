'use client'

import { useState, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/actions/notificationActions'
import { createBrowserClient } from '@supabase/ssr'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data)
    setUnreadCount(data.filter((n: any) => !n.is_read).length)
  }

  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel(`notifications-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification' },
        (payload) => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <Popover>
      <PopoverTrigger render={
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-950"></span>
          )}
        </Button>
      } />
      <PopoverContent align="end" className="w-80 p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-500" onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3 ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              onClick={() => { if (!n.is_read) handleMarkAsRead(n.id) }}
            >
              <div className="mt-1">
                {!n.is_read ? (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                ) : (
                  <Check size={14} className="text-zinc-400" />
                )}
              </div>
              <div>
                <p className={`text-sm ${!n.is_read ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">
              <Bell size={24} className="mx-auto mb-2 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
