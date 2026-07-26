import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export function TeamMembersWidget() {
  const members = [
    { name: 'Wajid Ali', status: 'online', avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Sara Khan', status: 'busy', avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Ahmed Raza', status: 'away', avatar: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Zain Ali', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=4' },
    { name: 'Ali Hassan', status: 'online', avatar: 'https://i.pravatar.cc/150?u=5' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-emerald-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-amber-500'
      default: return 'bg-zinc-500'
    }
  }

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between px-4">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Team Members</CardTitle>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-3">
          {members.map(m => (
            <div key={m.name} className="relative group cursor-pointer">
              <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-950 shadow-sm hover:scale-105 transition-transform" />
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${getStatusColor(m.status)}`} />
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded whitespace-nowrap pointer-events-none">
                {m.name}
              </div>
            </div>
          ))}
          <div className="w-9 h-9 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-500 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            +4
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Online</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/> Busy</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Away</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-zinc-500"/> Offline</div>
        </div>
      </CardContent>
    </Card>
  )
}
