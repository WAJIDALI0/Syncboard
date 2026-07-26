'use client'

import { useTransition } from 'react'
import { MoreHorizontal, UserX, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { updateMemberRole, removeWorkspaceMember, leaveWorkspace } from '@/actions/workspaceActions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Membership = {
  id: string;
  role: string;
  user_id: string;
  workspace_id: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  }
}

export function TeamMemberActions({ membership, currentUserRole, isCurrentUser = false }: { membership: Membership, currentUserRole: string, isCurrentUser?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${membership.user.email} from the workspace?`)) {
      startTransition(async () => {
        const result = await removeWorkspaceMember(membership.id)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Member removed successfully")
        }
      })
    }
  }

  const handleRoleChange = (newRole: string) => {
    if (newRole === membership.role) return;
    startTransition(async () => {
      const result = await updateMemberRole(membership.id, newRole)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Role updated successfully")
      }
    })
  }

  const handleLeave = () => {
    if (confirm(`Are you sure you want to leave this workspace?`)) {
      startTransition(async () => {
        const result = await leaveWorkspace(membership.workspace_id!)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("You have left the workspace")
          router.push('/dashboard')
        }
      })
    }
  }

  const canManage = currentUserRole === 'OWNER' || (currentUserRole === 'ADMIN' && membership.role !== 'OWNER' && membership.role !== 'ADMIN')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending} className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info('Profile view coming soon!')}>
            View Profile
          </DropdownMenuItem>
          {canManage && membership.role !== 'OWNER' && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">Change Role</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-w-36">
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange('MEMBER')}>
                  Member {membership.role === 'MEMBER' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange('MANAGER')}>
                  Manager {membership.role === 'MANAGER' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                {currentUserRole === 'OWNER' && (
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange('ADMIN')}>
                    Admin {membership.role === 'ADMIN' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuGroup>
        {!isCurrentUser && canManage && membership.role !== 'OWNER' && (
          <>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleRemove} className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950 cursor-pointer">
                <UserX className="mr-2 h-4 w-4" />
                <span>Remove from team</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        {isCurrentUser && membership.role !== 'OWNER' && (
          <>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLeave} className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950 cursor-pointer">
                <UserX className="mr-2 h-4 w-4" />
                <span>Leave Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
