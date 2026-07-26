import DrawingBoard from '@/components/canvas/DrawingBoard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CanvasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Whiteboard</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Sketch ideas, architecture diagrams, or quick notes.</p>
      </div>
      
      <DrawingBoard />
    </div>
  )
}
