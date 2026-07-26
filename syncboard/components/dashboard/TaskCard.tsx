import { Edit3, Trash2, Circle, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  color: string
  created_at: string
  due_date?: string | null
  user_id: string
}

export default function TaskCard({ 
  task, 
  colId, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onClick
}: { 
  task: Task, 
  colId: string, 
  onEdit: (t: Task) => void, 
  onDelete: (id: string) => void,
  onStatusChange: (id: string, status: string) => void,
  onClick: (t: Task) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(task)}
    >
      <Card 
        className="bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group shadow-sm"
      >
        <CardHeader className="p-4 pb-2 space-y-1">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base text-zinc-900 dark:text-zinc-100 font-semibold">{task.title}</CardTitle>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white -mt-1" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                <Edit3 size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 -mt-1 -mr-1" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{task.description}</p>
          )}
        </CardHeader>
        <CardFooter className="p-4 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${
              task.priority === 'HIGH' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
              task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            }`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center gap-1">
                <Clock size={10} />
                {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {colId !== 'TODO' && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'TODO'); }}>
                <Circle size={14} />
              </Button>
            )}
            {colId !== 'IN_PROGRESS' && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'IN_PROGRESS'); }}>
                <Clock size={14} />
              </Button>
            )}
            {colId !== 'DONE' && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'DONE'); }}>
                <CheckCircle2 size={14} />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
