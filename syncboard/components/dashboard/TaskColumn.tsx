import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import TaskCard, { Task } from './TaskCard'

export default function TaskColumn({
  title,
  id,
  icon,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onTaskClick
}: {
  title: string
  id: string
  icon: ReactNode
  tasks: Task[]
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onTaskClick: (t: Task) => void
}) {
  return (
    <div className="flex flex-col bg-zinc-100 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden h-full min-h-[500px]">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-200/50 dark:bg-zinc-900/60 backdrop-blur-sm">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          {icon} {title}
        </h3>
        <span className="bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs py-1 px-2 rounded-full font-medium shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[200px]">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              colId={id} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange} 
              onClick={onTaskClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
