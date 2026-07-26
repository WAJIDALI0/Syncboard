'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUserWorkspaces() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const memberships = await prisma.membership.findMany({
    where: { user_id: user.id, workspace_id: { not: null } },
    include: {
      workspace: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              is_personal: true
            }
          }
        }
      }
    }
  })

  // Filter out any where workspace is null (due to relations)
  return memberships.filter(m => m.workspace).map(m => m.workspace)
}

export async function getActiveWorkspaceContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const cookieStore = await cookies()
  const activeWorkspaceId = cookieStore.get('active_workspace_id')?.value

  let workspace;

  if (activeWorkspaceId) {
    // Verify membership
    const membership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: {
          user_id: user.id,
          workspace_id: activeWorkspaceId
        }
      },
      include: { workspace: true }
    })
    
    if (membership && membership.workspace) {
      workspace = membership.workspace
    }
  }

  // Fallback to their personal workspace (which getDefaultProject handles)
  if (!workspace) {
    const org = await prisma.organization.findFirst({ where: { owner_id: user.id } })
    if (org) {
      workspace = await prisma.workspace.findFirst({ where: { org_id: org.id } })
    }
  }

  return workspace
}

export async function setActiveWorkspace(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify they belong to this workspace
  const membership = await prisma.membership.findUnique({
    where: {
      user_id_workspace_id: {
        user_id: user.id,
        workspace_id: workspaceId
      }
    }
  })

  if (!membership) {
    return { error: 'You do not have access to this workspace' }
  }

  const cookieStore = await cookies()
  cookieStore.set('active_workspace_id', workspaceId, { secure: true, httpOnly: true })
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function inviteUserToWorkspace(email: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) return { error: 'Not authenticated' }

  try {
    // 1. Check if the inviter has access to the workspace
    const inviterMembership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: {
          user_id: currentUser.id,
          workspace_id: workspaceId
        }
      },
      include: { workspace: true }
    })
    if (!inviterMembership || !inviterMembership.workspace) return { error: 'You do not have permission to invite users to this workspace' }

    // 2. Find the user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!invitedUser) {
      return { error: 'User not found. They must sign up to SyncBoard first.' }
    }

    // 3. Create membership
    await prisma.membership.create({
      data: {
        user_id: invitedUser.id,
        workspace_id: workspaceId,
        role: 'MEMBER'
      }
    })

    // 4. Create a real-time notification for the invited user
    await prisma.notification.create({
      data: {
        user_id: invitedUser.id,
        message: `${currentUser.email} invited you to the workspace "${inviterMembership.workspace.name}".`,
        link: '/dashboard'
      }
    })

    return { success: true }
  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return { error: 'User is already a member of this workspace.' }
    }
    return { error: error.message }
  }
}

export async function getWorkspaceMembers(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Check if current user is part of the workspace
  const membership = await prisma.membership.findUnique({
    where: {
      user_id_workspace_id: { user_id: user.id, workspace_id: workspaceId }
    }
  })

  if (!membership) return []

  const members = await prisma.membership.findMany({
    where: { workspace_id: workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
          is_active: true,
          created_at: true,
        }
      }
    },
    orderBy: { role: 'asc' }
  })

  return members
}

export async function removeWorkspaceMember(membershipId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const targetMembership = await prisma.membership.findUnique({ where: { id: membershipId } })
    if (!targetMembership || !targetMembership.workspace_id) return { error: 'Membership not found' }

    // Check if current user is OWNER or ADMIN
    const currentMembership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: { user_id: user.id, workspace_id: targetMembership.workspace_id }
      }
    })

    if (!currentMembership || (currentMembership.role !== 'OWNER' && currentMembership.role !== 'ADMIN')) {
      return { error: 'Only Owners or Admins can remove members' }
    }

    if (targetMembership.role === 'OWNER') {
      return { error: 'Cannot remove the workspace Owner' }
    }

    await prisma.membership.delete({ where: { id: membershipId } })
    revalidatePath('/dashboard/teams')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateMemberRole(membershipId: string, role: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const targetMembership = await prisma.membership.findUnique({ where: { id: membershipId } })
    if (!targetMembership || !targetMembership.workspace_id) return { error: 'Membership not found' }

    const currentMembership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: { user_id: user.id, workspace_id: targetMembership.workspace_id }
      }
    })

    if (!currentMembership || currentMembership.role !== 'OWNER') {
      return { error: 'Only Owners can change member roles' }
    }

    await prisma.membership.update({
      where: { id: membershipId },
      data: { role }
    })
    
    revalidatePath('/dashboard/teams')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function leaveWorkspace(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const membership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: { user_id: user.id, workspace_id: workspaceId }
      },
      include: {
        workspace: {
          include: { organization: true }
        }
      }
    })

    if (!membership) {
      return { error: 'You are not a member of this workspace' }
    }

    // Prevent owner from leaving
    if (membership.role === 'OWNER') {
      return { error: 'As the owner, you cannot leave the workspace. You must delete or transfer it first.' }
    }

    // Prevent leaving personal workspace
    if (membership.workspace?.organization?.is_personal) {
      return { error: 'You cannot leave your personal workspace.' }
    }

    // Delete membership
    await prisma.membership.delete({
      where: { id: membership.id }
    })

    // Remove active workspace cookie to force fallback to personal workspace
    const cookieStore = await cookies()
    if (cookieStore.get('active_workspace_id')?.value === workspaceId) {
      cookieStore.delete('active_workspace_id')
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
