import { getActiveWorkspaceContext } from '@/actions/workspaceActions'
import { redirect } from 'next/navigation'
import { Settings, Users, ShieldAlert, Shield, Activity, Save, Trash2, ArrowRightLeft, FolderArchive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function SettingsPage() {
  const activeWorkspace = await getActiveWorkspaceContext()
  
  if (!activeWorkspace) {
    redirect('/dashboard')
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage configuration and preferences for <span className="font-semibold text-zinc-900 dark:text-zinc-300">{activeWorkspace.name}</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
            <Settings size={18} className="mr-3 text-primary" />
            General
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <Users size={18} className="mr-3" />
            Members & Roles
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <Shield size={18} className="mr-3" />
            Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <Activity size={18} className="mr-3" />
            Activity Log
          </Button>
          <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="ghost" className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50">
              <ShieldAlert size={18} className="mr-3" />
              Danger Zone
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 w-full space-y-8">
          {/* General Section */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Workspace Details</h3>
              <p className="text-sm text-zinc-500 mt-1">Update your workspace name and basic information.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input 
                  id="workspace-name" 
                  defaultValue={activeWorkspace.name}
                  className="max-w-md bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-white dark:bg-zinc-950 border border-rose-200 dark:border-rose-900/50 rounded-2xl overflow-hidden shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-500">Danger Zone</h3>
              <p className="text-sm text-zinc-500 mt-1">Irreversible and destructive actions for this workspace.</p>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-zinc-500" /> Transfer Ownership
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">Transfer this workspace to another member.</p>
                </div>
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">Transfer</Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <FolderArchive size={16} className="text-zinc-500" /> Archive Workspace
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">Mark as read-only and hide from active views.</p>
                </div>
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">Archive</Button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="font-semibold text-rose-600 flex items-center gap-2">
                    <Trash2 size={16} /> Delete Workspace
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">Permanently delete this workspace and all its data.</p>
                </div>
                <Button variant="destructive" className="bg-rose-500 hover:bg-rose-600">Delete</Button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
