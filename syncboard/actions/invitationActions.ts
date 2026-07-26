'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendInvitation(email: string, role: any, workspaceId: string, orgId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    // Verify inviter has permission (Admin or Owner)
    const inviterMembership = await prisma.membership.findUnique({
      where: {
        user_id_workspace_id: { user_id: user.id, workspace_id: workspaceId }
      }
    })

    if (!inviterMembership || (inviterMembership.role !== 'OWNER' && inviterMembership.role !== 'ADMIN')) {
      return { error: 'Not authorized to send invitations' }
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      const existingMembership = await prisma.membership.findUnique({
        where: { user_id_workspace_id: { user_id: existingUser.id, workspace_id: workspaceId } }
      })
      if (existingMembership) return { error: 'User is already a member' }
    }

    // Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        workspace_id: workspaceId,
        org_id: orgId,
        inviter_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    })

    // Log Activity
    await prisma.activity.create({
      data: {
        action: `Sent invitation to ${email}`,
        user_id: user.id
      }
    })

    revalidatePath('/dashboard/teams')
    return { success: true, data: invitation }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getPendingInvitations(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return await prisma.invitation.findMany({
    where: { 
      workspace_id: workspaceId,
      status: 'PENDING'
    },
    orderBy: { created_at: 'desc' }
  })
}

export async function acceptInvitation(invitationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { error: 'Not authenticated' }

  try {
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } })
    if (!invitation) return { error: 'Invitation not found' }
    
    // Ensure the current user's email matches the invitation email
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      return { error: 'This invitation was sent to a different email address' }
    }

    if (invitation.status !== 'PENDING') {
      return { error: `Invitation is already ${invitation.status}` }
    }

    // Check expiration
    if (new Date() > new Date(invitation.expires_at)) {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED' }
      })
      return { error: 'Invitation has expired' }
    }

    // Process acceptance within a transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Mark as accepted
      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' }
      })

      // 2. Create membership
      await tx.membership.create({
        data: {
          user_id: user.id,
          org_id: invitation.org_id,
          workspace_id: invitation.workspace_id,
          role: invitation.role,
        }
      })

      // 3. Log activity
      await tx.activity.create({
        data: {
          action: 'Joined the workspace via invitation',
          user_id: user.id
        }
      })
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/teams')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'You are already a member of this workspace' }
    }
    return { error: error.message }
  }
}

export async function cancelInvitation(invitationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } })
    if (!invitation) return { error: 'Invitation not found' }

    // Check permissions
    const membership = await prisma.membership.findUnique({
      where: { user_id_workspace_id: { user_id: user.id, workspace_id: invitation.workspace_id } }
    })

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return { error: 'Not authorized to cancel invitations' }
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'CANCELLED' }
    })

    revalidatePath('/dashboard/invitations')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getUserInvitations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return []

  return await prisma.invitation.findMany({
    where: { 
      email: { equals: user.email, mode: 'insensitive' },
      status: 'PENDING'
    },
    include: {
      organization: { select: { name: true } },
      workspace: { select: { name: true } },
      inviter: { select: { name: true, email: true } }
    },
    orderBy: { created_at: 'desc' }
  })
}
