'use server'

import prisma from '@/lib/prisma'
import { getActiveWorkspaceContext } from './workspaceActions'
import { revalidatePath } from 'next/cache'

export async function getCanvas() {
  const activeWorkspace = await getActiveWorkspaceContext()
  if (!activeWorkspace) return { error: 'No active workspace' }

  try {
    const canvas = await prisma.canvas.findUnique({
      where: { workspace_id: activeWorkspace.id }
    })
    return { data: canvas?.canvas_json || null }
  } catch (error: any) {
    // If the table doesn't exist yet, return null safely
    return { data: null }
  }
}

export async function saveCanvas(canvasJson: string) {
  const activeWorkspace = await getActiveWorkspaceContext()
  if (!activeWorkspace) return { error: 'No active workspace' }

  try {
    await prisma.canvas.upsert({
      where: { workspace_id: activeWorkspace.id },
      update: { canvas_json: canvasJson },
      create: {
        workspace_id: activeWorkspace.id,
        canvas_json: canvasJson
      }
    })
    
    // We do NOT revalidate path here because it would cause the client component to re-render 
    // and wipe the unsaved strokes if someone else is drawing, but since we don't have realtime yet, it's fine.
    // For now, no revalidatePath needed for canvas save.
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
