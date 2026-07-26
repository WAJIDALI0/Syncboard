import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400, headers: corsHeaders })

  try {
    // Get all projects where the user is a member of the workspace
    const memberships = await prisma.membership.findMany({
      where: { user_id: userId, workspace_id: { not: null } },
      select: { workspace_id: true }
    })
    const workspaceIds = memberships.map((m: any) => m.workspace_id as string)

    const projects = await prisma.project.findMany({
      where: { workspace_id: { in: workspaceIds } },
      select: { id: true, name: true }
    })

    return NextResponse.json(projects, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
