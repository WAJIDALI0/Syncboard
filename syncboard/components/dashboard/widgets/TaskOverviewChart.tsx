'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: 'To Do', value: 42, color: 'var(--chart-1)' },
  { name: 'In Progress', value: 41, color: 'var(--chart-2)' },
  { name: 'Review', value: 21, color: 'var(--chart-3)' },
  { name: 'Completed', value: 24, color: 'var(--chart-4)' },
]

export function TaskOverviewChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-2">
        <div className="h-[180px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{total}</span>
            <span className="text-xs text-zinc-500">Total</span>
          </div>
        </div>
        <div className="w-full mt-2 grid grid-cols-2 gap-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-600 dark:text-zinc-400">{item.name}</span>
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">{item.value} ({Math.round((item.value/total)*100)}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
