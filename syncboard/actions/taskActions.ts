'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { getActiveWorkspaceContext } from './workspaceActions'

async function getProjectForWorkspace(workspaceId: string) {
  let project = await prisma.project.findFirst({ where: { workspace_id: workspaceId } })
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'General',
        workspace_id: workspaceId,
      }
    })
  }
  return project
}

async function getDefaultProject(userId: string, userEmail: string) {
  // Ensure user exists
  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        name: userEmail.split('@')[0],
      }
    })
  }

  // Get or Create Personal Organization
  let org = await prisma.organization.findFirst({ where: { owner_id: userId } })
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: `${user.name}'s Organization`,
        owner_id: userId,
      }
    })
  }

  // Get or Create Workspace
  let workspace = await prisma.workspace.findFirst({ where: { org_id: org.id } })
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Personal Workspace',
        org_id: org.id,
      }
    })
    // Create Membership
    await prisma.membership.create({
      data: {
        user_id: userId,
        org_id: org.id,
        workspace_id: workspace.id,
        role: 'OWNER'
      }
    })
  }

  return getProjectForWorkspace(workspace.id)
}

export async function getTasks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // We still run getDefaultProject once just to ensure their personal org is created if this is their first login
  await getDefaultProject(user.id, user.email || '')
  
  const activeWorkspace = await getActiveWorkspaceContext()
  if (!activeWorkspace) return []

  const project = await getProjectForWorkspace(activeWorkspace.id)

  const tasks = await prisma.task.findMany({
    where: { project_id: project.id },
    orderBy: { created_at: 'desc' }
  })
  
  // Format to match UI expectations (serialize dates, provide user_id equivalent via assignee)
  return tasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    color: '#ffffff',
    created_at: t.created_at.toISOString(),
    due_date: t.due_date ? t.due_date.toISOString() : null,
    user_id: t.assignee_id || user.id
  }))
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await getDefaultProject(user.id, user.email || '')
  
  const activeWorkspace = await getActiveWorkspaceContext()
  if (!activeWorkspace) return { error: 'No active workspace found' }

  const project = await getProjectForWorkspace(activeWorkspace.id)

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as any || 'TODO'
  const priority = formData.get('priority') as any || 'MEDIUM'
  const dueDateStr = formData.get('due_date') as string
  const due_date = dueDateStr ? new Date(dueDateStr) : null

  try {
    const data = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        due_date,
        project_id: project.id,
        assignee_id: user.id
      }
    })
    
    revalidatePath('/dashboard', 'layout')
    
    // We must return serializable data
    return { data: [{
      ...data, 
      created_at: data.created_at.toISOString(),
      updated_at: data.updated_at.toISOString(),
      user_id: data.assignee_id
    }] }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await prisma.task.update({
      where: { id },
      data: { status: status as any }
    })
    revalidatePath('/dashboard', 'layout')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateTaskDetails(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as any
  const dueDateStr = formData.get('due_date') as string
  const due_date = dueDateStr ? new Date(dueDateStr) : null

  try {
    await prisma.task.update({
      where: { id },
      data: { title, description, priority, due_date }
    })
    revalidatePath('/dashboard', 'layout')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id }
    })
    revalidatePath('/dashboard', 'layout')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getRecentActivities() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const activities = await prisma.activity.findMany({
    take: 20,
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  return activities.map((a: any) => ({
    ...a,
    created_at: a.created_at.toISOString()
  }))
}
