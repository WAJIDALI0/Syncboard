import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  trend: number
  trendLabel?: string
  icon: LucideIcon
  iconColorClass?: string
  iconBgClass?: string
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendLabel = "from last week", 
  icon: Icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/20"
}: StatCardProps) {
  const isPositive = trend > 0
  
  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl transition-colors duration-300", iconBgClass)}>
          <Icon className={cn("h-4 w-4", iconColorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{value}</div>
        <div className="flex items-center text-xs">
          <span className={cn(
            "flex items-center font-medium mr-1.5",
            isPositive ? "text-emerald-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-zinc-500 dark:text-zinc-500">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
