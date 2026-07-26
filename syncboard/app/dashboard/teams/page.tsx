import { getActiveWorkspaceContext, getWorkspaceMembers, removeWorkspaceMember, updateMemberRole } from '@/actions/workspaceActions'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, UserX, Shield, ShieldAlert, User, ShieldCheck } from 'lucide-react'
import { InviteMemberModal } from '@/components/dashboard/InviteMemberModal'
import { TeamMemberActions } from '@/components/dashboard/TeamMemberActions'
import { createClient } from '@/lib/supabase/server'

export default async function TeamsPage() {
  const activeWorkspace = await getActiveWorkspaceContext()
  
  if (!activeWorkspace) {
    redirect('/dashboard')
  }

  const members = await getWorkspaceMembers(activeWorkspace.id)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserMembership = members.find(m => m.user_id === user?.id)
  const currentUserRole = currentUserMembership?.role || 'MEMBER'

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <ShieldAlert className="h-4 w-4 text-rose-500" />
      case 'ADMIN': return <ShieldCheck className="h-4 w-4 text-indigo-500" />
      case 'MANAGER': return <Shield className="h-4 w-4 text-emerald-500" />
      case 'MEMBER': return <User className="h-4 w-4 text-blue-500" />
      default: return <User className="h-4 w-4 text-zinc-500" />
    }
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Team Directory</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage members and roles for <span className="font-semibold text-zinc-900 dark:text-zinc-300">{activeWorkspace.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <InviteMemberModal activeWorkspaceId={activeWorkspace.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex-1 max-h-[800px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 uppercase font-medium tracking-wider sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {members.map((membership) => (
                <tr key={membership.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
                          <AvatarImage src={membership.user.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {membership.user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></span>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {membership.user.name || membership.user.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-zinc-500">{membership.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(membership.role)}
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{membership.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
                      Online
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(membership.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <TeamMemberActions 
                      membership={membership} 
                      currentUserRole={currentUserRole}
                      isCurrentUser={membership.user_id === user?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
