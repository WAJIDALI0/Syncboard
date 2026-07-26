'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function getChatMessages(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const messages = await prisma.message.findMany({
    where: { workspace_id: workspaceId },
    orderBy: { created_at: 'asc' },
    take: 100, // Limit to last 100 messages for now
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  // Format dates for the client
  return messages.map(m => ({
    ...m,
    created_at: m.created_at.toISOString()
  }))
}

export async function sendChatMessage(workspaceId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        workspace_id: workspaceId,
        user_id: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return { 
      data: {
        ...message,
        created_at: message.created_at.toISOString()
      }
    }
  } catch (error: any) {
    return { error: error.message }
  }
}
