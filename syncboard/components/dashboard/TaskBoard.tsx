'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, Clock, Edit3, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createTask, deleteTask, updateTaskStatus, updateTaskDetails } from '@/actions/taskActions'
import { createBrowserClient } from '@supabase/ssr'
import TaskColumn from './TaskColumn'
import CreateTaskDialog from './CreateTaskDialog'
import EditTaskDialog from './EditTaskDialog'
import TaskDetailsModal from './TaskDetailsModal'
import type { Task } from './TaskCard'


export default function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailedTask, setDetailedTask] = useState<Task | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')

  // Sync with server state (when revalidatePath is called)
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel(`tasks-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Task' },
        (payload) => {
          const mapPayload = (t: any) => ({ 
            ...t, 
            user_id: t.assignee_id, 
            color: '#ffffff',
            due_date: t.due_date ? t.due_date : null 
          } as Task)
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => {
              if (prev.find(t => t.id === payload.new.id)) return prev
              toast.success('A new task was created!')
              return [mapPayload(payload.new), ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? mapPayload(payload.new) : t))
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id))
            toast.info('A task was deleted.')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleCreate(formData: FormData) {
    setIsCreateOpen(false)
    const res = await createTask(formData)
    if (res.error) toast.error(res.error)
    else toast.success('Task created successfully')
  }

  async function handleEdit(formData: FormData) {
    if (!editingTask) return
    setIsEditOpen(false)
    const res = await updateTaskDetails(editingTask.id, formData)
    if (res.error) toast.error(res.error)
    else toast.success('Task updated successfully')
    setEditingTask(null)
  }

  async function handleDelete(id: string) {
    // Optimistic update for instant feedback
    setTasks(prev => prev.filter(t => t.id !== id))
    
    const res = await deleteTask(id)
    if (res.error) {
      toast.error(res.error)
      // Revert optimistic update on failure by resetting to initialTasks
      setTasks(initialTasks)
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    // Optimistic update for instant feedback
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t))
    
    const res = await updateTaskStatus(id, newStatus)
    if (res.error) {
      toast.error(res.error)
      // Revert optimistic update on failure
      setTasks(initialTasks)
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  }, [tasks, searchQuery, filterPriority])

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'DONE').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
  }

  const columns = [
    { id: 'TODO', title: 'To Do', icon: <Circle size={18} className="text-zinc-500" /> },
    { id: 'IN_PROGRESS', title: 'In Progress', icon: <Clock size={18} className="text-blue-500" /> },
    { id: 'DONE', title: 'Done', icon: <CheckCircle2 size={18} className="text-green-500" /> },
  ]

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 dark:text-blue-400">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 dark:text-green-400">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
          </div>
          <Select value={filterPriority} onValueChange={(val) => setFilterPriority(val || 'ALL')}>
            <SelectTrigger className="w-[130px] bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 gap-2 w-full md:w-auto shadow-sm" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> New Task
        </Button>
      </div>

      <CreateTaskDialog 
        isOpen={isCreateOpen} 
        setIsOpen={setIsCreateOpen} 
        handleCreate={handleCreate} 
      />

      <EditTaskDialog 
        isOpen={isEditOpen} 
        setIsOpen={setIsEditOpen} 
        task={editingTask} 
        handleEdit={handleEdit} 
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        task={detailedTask}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
        {columns.map(col => (
          <TaskColumn
            key={col.id}
            title={col.title}
            id={col.id}
            icon={col.icon}
            tasks={filteredTasks.filter(t => t.status === col.id)}
            onEdit={(task) => { setEditingTask(task); setIsEditOpen(true) }}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onTaskClick={(task) => { setDetailedTask(task); setIsDetailsOpen(true) }}
          />
        ))}
      </div>
    </div>
  )
}
