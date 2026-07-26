'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { createProject } from '@/actions/projectActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateProjectModal({ workspaceId, children }: { workspaceId: string, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsPending(true)
    const result = await createProject(name, description, workspaceId)
    setIsPending(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Project created successfully')
      setOpen(false)
      setName('')
      setDescription('')
      // Navigate directly to the Kanban board where tasks are managed
      if (result.project) {
        router.push(`/dashboard/tasks`)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={children ? "" : "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2"}>
        {children || (
          <>
            <Plus size={16} className="mr-2" />
            New Project
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">Create a New Project</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Projects organize your tasks and help your team track progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-900 dark:text-zinc-300">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g. Q3 Marketing Campaign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !name.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
