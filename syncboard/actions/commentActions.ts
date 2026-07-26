'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getComments(taskId: string) {
  const comments = await prisma.comment.findMany({
    where: { task_id: taskId },
    orderBy: { created_at: 'asc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          avatar_url: true
        }
      }
    }
  })

  return comments.map(c => ({
    ...c,
    created_at: c.created_at.toISOString(),
    updated_at: c.updated_at.toISOString(),
  }))
}

export async function postComment(taskId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        task_id: taskId,
        author_id: user.id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            avatar_url: true
          }
        }
      }
    })
    
    // Also log activity
    await prisma.activity.create({
      data: {
        action: 'commented on this task',
        task_id: taskId,
        user_id: user.id
      }
    })

    revalidatePath('/dashboard')
    
    return { 
      data: {
        ...comment,
        created_at: comment.created_at.toISOString(),
        updated_at: comment.updated_at.toISOString(),
      }
    }
  } catch (error: any) {
    return { error: error.message }
  }
}
