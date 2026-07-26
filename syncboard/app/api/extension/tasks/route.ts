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
    const tasks = await prisma.task.findMany({
      where: { assignee_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { id: true, title: true, status: true, priority: true }
    })
    return NextResponse.json(tasks, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, priority, project_id, user_id } = body

    if (!title || !project_id || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        project_id,
        assignee_id: user_id,
        status: 'TODO'
      }
    })

    return NextResponse.json(task, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
