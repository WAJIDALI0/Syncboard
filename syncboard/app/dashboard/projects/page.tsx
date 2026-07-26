import { getActiveWorkspaceContext } from '@/actions/workspaceActions'
import { redirect } from 'next/navigation'
import { FolderKanban, Plus, MoreVertical, Calendar } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal'

export default async function ProjectsPage() {
  const activeWorkspace = await getActiveWorkspaceContext()
  
  if (!activeWorkspace) {
    redirect('/dashboard')
  }

  // Fetch projects for this workspace
  const projects = await prisma.project.findMany({
    where: { workspace_id: activeWorkspace.id },
    include: {
      _count: {
        select: { tasks: true }
      },
      tasks: {
        where: { status: 'DONE' }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Projects</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage projects for <span className="font-semibold text-zinc-900 dark:text-zinc-300">{activeWorkspace.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <CreateProjectModal workspaceId={activeWorkspace.id} />
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <FolderKanban size={40} />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 max-w-md mb-8">
            Create your first project to start organizing tasks, managing workflows, and collaborating with your team.
          </p>
          <CreateProjectModal workspaceId={activeWorkspace.id}>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12">
              <Plus size={18} className="mr-2" />
              Create Project
            </Button>
          </CreateProjectModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const totalTasks = project._count.tasks
            const completedTasks = project.tasks.length
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

            return (
              <div key={project.id} className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <FolderKanban size={24} />
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/tasks`}>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 hover:text-primary transition-colors cursor-pointer">
                      {project.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-6 h-10">
                    {project.description || 'No description provided for this project.'}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                      <span className="text-zinc-900 dark:text-white">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-300">
                    {totalTasks} Task{totalTasks !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
