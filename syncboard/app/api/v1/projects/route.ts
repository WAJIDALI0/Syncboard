import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getActiveWorkspaceContext } from '@/actions/workspaceActions'
import { CreateProjectSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get active workspace (or pass workspaceId via query params in future)
  const activeWorkspace = await getActiveWorkspaceContext()
  if (!activeWorkspace) {
    return NextResponse.json({ error: 'No active workspace found' }, { status: 400 })
  }

  try {
    const projects = await prisma.project.findMany({
      where: { workspace_id: activeWorkspace.id },
      include: {
        _count: { select: { tasks: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ projects })
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
    const parsed = CreateProjectSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 })
    }

    const { name, description, workspaceId } = parsed.data

    // Verify membership
    const membership = await prisma.membership.findUnique({
      where: { user_id_workspace_id: { user_id: user.id, workspace_id: workspaceId } }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspace_id: workspaceId
      }
    })
    
    // Log Activity
    await prisma.activity.create({
      data: {
        action: `Created project ${name}`,
        user_id: user.id
      }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
