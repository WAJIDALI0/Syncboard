import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { CreateWorkspaceSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const memberships = await prisma.membership.findMany({
      where: { user_id: user.id, workspace_id: { not: null } },
      include: {
        workspace: {
          include: {
            organization: {
              select: { id: true, name: true, is_personal: true }
            }
          }
        }
      }
    })

    const workspaces = memberships
      .filter((m: any) => m.workspace)
      .map((m: any) => m.workspace)

    return NextResponse.json({ workspaces })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const parsed = CreateWorkspaceSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 })
    }

    const { name, organizationId } = parsed.data

    // Verify user is owner or admin of organization
    const membership = await prisma.membership.findUnique({
      where: { user_id_org_id: { user_id: user.id, org_id: organizationId } }
    })

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        org_id: organizationId,
        members: {
          create: {
            user_id: user.id,
            org_id: organizationId,
            role: 'OWNER'
          }
        }
      }
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
