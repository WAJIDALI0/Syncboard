import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Clock, Send, MessageSquare } from 'lucide-react'
import type { Task } from './TaskCard'
import { getComments, postComment } from '@/actions/commentActions'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'

export default function TaskDetailsModal({
  task,
  isOpen,
  setIsOpen,
}: {
  task: Task | null
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isOpen && task) {
      getComments(task.id).then(setComments)
    }
  }, [isOpen, task])

  useEffect(() => {
    if (!task) return
    const channel = supabase
      .channel(`task-comments-${task.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Comment', filter: `task_id=eq.${task.id}` },
        (payload) => {
          // Re-fetch to get author details when someone else posts
          getComments(task.id).then(setComments)
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [task, supabase])

  const handlePostComment = async () => {
    if (!newComment.trim() || !task) return
    setLoading(true)
    const res = await postComment(task.id, newComment)
    if (res.error) {
      toast.error(res.error)
    } else {
      setNewComment('')
      if (res.data) {
        setComments(prev => [...prev, res.data])
      }
    }
    setLoading(false)
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 flex flex-wrap gap-2 items-center mt-2">
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-medium uppercase">
              {task.status.replace('_', ' ')}
            </span>
            <span className={`text-xs uppercase font-bold tracking-wider px-2 py-1 rounded-sm ${
              task.priority === 'HIGH' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
              task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            }`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-xs font-medium flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Clock size={12} />
                Due {format(new Date(task.due_date), 'PPP')}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Description</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Activity & Comments
            </h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">
                    {comment.author?.name?.charAt(0) || comment.author?.email?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">{comment.author?.name || comment.author?.email}</span>
                      <span className="text-xs text-zinc-500">{format(new Date(comment.created_at), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-sm mt-1 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-zinc-500 italic">No comments yet. Start the conversation!</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
          <div className="flex gap-2 relative">
            <Textarea
              placeholder="Write a comment..."
              className="resize-none pr-12 min-h-[60px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handlePostComment()
                }
              }}
            />
            <Button 
              size="icon" 
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full" 
              disabled={loading || !newComment.trim()}
              onClick={handlePostComment}
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
