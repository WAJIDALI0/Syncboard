import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

export function MiniKanbanPreview({ tasks }: { tasks: any[] }) {
  const columns = [
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'IN_PROGRESS' },
    { title: 'Review', status: 'REVIEW' },
    { title: 'Completed', status: 'DONE' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'LOW': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Task Board</h3>
        <button className="text-xs text-primary hover:underline font-medium">View All Tasks &rarr;</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status).slice(0, 2)
          return (
            <div key={col.title} className="bg-zinc-100/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.status === 'DONE' ? 'bg-emerald-500' : col.status === 'IN_PROGRESS' ? 'bg-blue-500' : col.status === 'REVIEW' ? 'bg-amber-500' : 'bg-zinc-400'}`} />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{col.title}</span>
                </div>
                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-medium text-zinc-500">{tasks.filter(t => t.status === col.status).length}</span>
              </div>
              
              <div className="flex-1 space-y-2">
                {colTasks.length === 0 ? (
                  <div className="h-20 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                    No tasks
                  </div>
                ) : (
                  colTasks.map(task => (
                    <Card key={task.id} className="bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 shadow-sm p-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1 mb-2">{task.title}</h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="text-[10px] text-zinc-500">
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))
                )}
                {tasks.filter(t => t.status === col.status).length > 2 && (
                  <button className="w-full py-2 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                )}
              </div>
              
              <button className="w-full mt-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-1">
                + Add Task
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
