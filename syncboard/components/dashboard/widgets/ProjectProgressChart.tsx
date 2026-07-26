'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Mon", progress: 20 },
  { name: "Tue", progress: 35 },
  { name: "Wed", progress: 45 },
  { name: "Thu", progress: 65 },
  { name: "Fri", progress: 87 },
  { name: "Sat", progress: 87 },
  { name: "Sun", progress: 95 },
]

export function ProjectProgressChart() {
  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Project Progress</CardTitle>
            <CardDescription className="text-xs text-zinc-500 mt-1">Overall completion status</CardDescription>
          </div>
          <select className="text-xs bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 outline-none text-zinc-700 dark:text-zinc-300">
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4 pb-2 px-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProgress)" 
                activeDot={{ r: 6, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
