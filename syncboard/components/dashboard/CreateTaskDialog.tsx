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
import { useState } from 'react'

export default function CreateTaskDialog({
  isOpen,
  setIsOpen,
  handleCreate,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  handleCreate: (formData: FormData) => void
}) {
  const [date, setDate] = useState<Date>()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (date) {
      formData.append('due_date', date.toISOString())
    }
    handleCreate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Add a new task to your board. It will sync in real-time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input name="title" placeholder="Task title" required className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 placeholder:text-zinc-400" />
          </div>
          <div className="space-y-2">
            <Textarea name="description" placeholder="Description (optional)" className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 resize-none h-24 placeholder:text-zinc-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select name="priority" defaultValue="MEDIUM">
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
              <Select name="status" defaultValue="TODO">
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger render={
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a due date</span>}
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

          <DialogFooter>
            <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
