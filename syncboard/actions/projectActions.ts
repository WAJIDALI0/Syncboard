'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(name: string, description: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const membership = await prisma.membership.findUnique({
      where: { user_id_workspace_id: { user_id: user.id, workspace_id: workspaceId } }
    })

    if (!membership || (membership.role === 'GUEST')) {
      return { error: 'You do not have permission to create projects in this workspace' }
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspace_id: workspaceId
      }
    })

    await prisma.activity.create({
      data: {
        action: `Created project: ${name}`,
        user_id: user.id
      }
    })

    revalidatePath('/dashboard/projects')
    return { success: true, project }
  } catch (error: any) {
    return { error: error.message }
  }
}
