import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 min-h-[50vh]">
      <div className="flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium animate-pulse">Loading data...</p>
      </div>
    </div>
  )
}
