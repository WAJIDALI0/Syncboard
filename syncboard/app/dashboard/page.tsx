import { getTasks, getRecentActivities } from '@/actions/taskActions'
import { StatCard } from '@/components/dashboard/widgets/StatCard'
import { ProjectProgressChart } from '@/components/dashboard/widgets/ProjectProgressChart'
import { TaskOverviewChart } from '@/components/dashboard/widgets/TaskOverviewChart'
import { CalendarWidget } from '@/components/dashboard/widgets/CalendarWidget'
import { TeamMembersWidget } from '@/components/dashboard/widgets/TeamMembersWidget'
import { AiInsightsWidget } from '@/components/dashboard/widgets/AiInsightsWidget'
import { MiniKanbanPreview } from '@/components/dashboard/widgets/MiniKanbanPreview'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { CheckCircle2, Clock, AlertCircle, ClipboardList, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const initialTasks = await getTasks()
  const initialActivities = await getRecentActivities()

  // Calculate stats
  const totalTasks = initialTasks.length
  const completedTasks = initialTasks.filter(t => t.status === 'DONE').length
  const inProgressTasks = initialTasks.filter(t => t.status === 'IN_PROGRESS').length

  // Fake overdue for demo purposes (unless we add actual logic for due dates)
  const overdueTasks = 7

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Focus on what matters today, Wajid.
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Here's what's happening with your workspace today.</p>
        </div>
        <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-primary dark:bg-primary/20 border border-primary/20 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
          <div className="flex items-center gap-3 relative z-10">
            <Sparkles className="h-5 w-5 text-primary-foreground dark:text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-primary-foreground dark:text-white">AI Assistant</h4>
              <p className="text-[10px] text-primary-foreground/80 dark:text-zinc-300">Ask AI to generate tasks, summary, ideas...</p>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 dark:bg-primary text-primary-foreground dark:text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative z-10">
            Ask Anything
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          trend={18}
          icon={ClipboardList}
          iconBgClass="bg-primary/10"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          trend={24}
          icon={CheckCircle2}
          iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          trend={12}
          icon={Clock}
          iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          trend={-5}
          icon={AlertCircle}
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-500"
        />
      </div>

      {/* Main Grid: Charts & Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectProgressChart />
          <TaskOverviewChart />
        </div>
        {/* Right Column: Calendar */}
        <div className="lg:col-span-4">
          <CalendarWidget />
        </div>
      </div>

      {/* Mini Kanban & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <div className="lg:col-span-8">
          <MiniKanbanPreview tasks={initialTasks} />
        </div>
        <div className="lg:col-span-4 grid gap-4">
          <div className="h-[250px]">
            <ActivityFeed initialActivities={initialActivities} />
          </div>
          <TeamMembersWidget />
        </div>
      </div>

      {/* AI Insights Bottom Banner */}
      <AiInsightsWidget />
    </div>
  )
}
