import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import type { Task } from './TaskCard'

export default function EditTaskDialog({
  isOpen,
  setIsOpen,
  task,
  handleEdit,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  task: Task | null
  handleEdit: (formData: FormData) => void
}) {
  const [date, setDate] = useState<Date | undefined>()

  useEffect(() => {
    if (task?.due_date) {
      setDate(new Date(task.due_date))
    } else {
      setDate(undefined)
    }
  }, [task])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (date) {
      formData.append('due_date', date.toISOString())
    }
    handleEdit(formData)
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open) }}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Update task details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input name="title" defaultValue={task.title} required className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="space-y-2">
            <Textarea name="description" defaultValue={task.description || ''} className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 resize-none h-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select name="priority" defaultValue={task.priority}>
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger render={
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Due date</span>}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
