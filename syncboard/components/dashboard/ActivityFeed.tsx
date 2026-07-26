'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createBrowserClient } from '@supabase/ssr'
import { formatDistanceToNow } from 'date-fns'
import { FileText, CheckCircle, Bell } from 'lucide-react'

export default function ActivityFeed({ initialActivities }: { initialActivities: any[] }) {
  const [activities, setActivities] = useState(initialActivities)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const channel = supabase
      .channel(`activities-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Activity' },
        (payload) => {
          const act = payload.new
          setActivities(prev => [act, ...prev].slice(0, 20))
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const getActivityVisuals = (action: string) => {
    if (action.includes('created')) return { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-600', Component: FileText }
    if (action.includes('completed')) return { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600', Component: CheckCircle }
    return { bg: 'bg-zinc-100 dark:bg-zinc-800', icon: 'text-zinc-600', Component: Bell }
  }

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between px-4">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Recent Activity</CardTitle>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {activities.map((activity) => {
            const { bg, icon, Component: Icon } = getActivityVisuals(activity.action)
            const colors = { bg, icon }
            return (
              <div key={activity.id} className="relative flex gap-3 group">
                <div className="absolute left-[11px] top-[24px] bottom-[-16px] w-[2px] bg-zinc-200 dark:bg-zinc-800 group-last:hidden" />
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${colors.bg} border-2 border-white dark:border-zinc-950`}>
                  <Icon size={10} className={colors.icon} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-tight">
                    <span className="font-semibold">{activity.user?.name || activity.user?.email?.split('@')[0]}</span> {activity.action}
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            )
          })}
          {activities.length === 0 && (
            <p className="text-sm text-zinc-500 italic">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
