import { getTasks } from '@/actions/taskActions'
import TaskBoard from '@/components/dashboard/TaskBoard'

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const initialTasks = await getTasks()

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Tasks</h2>
          <p className="text-zinc-500 mt-1">Manage your team's tasks in real-time across the Kanban board.</p>
        </div>
      </div>
      
      <TaskBoard initialTasks={initialTasks} />
    </div>
  )
}
