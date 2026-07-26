'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTheme } from 'next-themes'

const data = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 2 },
  { name: 'Thu', tasks: 6 },
  { name: 'Fri', tasks: 8 },
  { name: 'Sat', tasks: 1 },
  { name: 'Sun', tasks: 0 },
]

export default function DashboardCharts() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  const textColor = isDark ? '#a1a1aa' : '#52525b' // zinc-400 / zinc-600
  const gridColor = isDark ? '#27272a' : '#e4e4e7' // zinc-800 / zinc-200

  return (
    <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Productivity Overview</CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">Tasks completed over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: isDark ? '#27272a' : '#f4f4f5' }}
              contentStyle={{ 
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? '#27272a' : '#e4e4e7',
                color: isDark ? '#ffffff' : '#000000',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="tasks" fill={isDark ? '#3b82f6' : '#2563eb'} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
