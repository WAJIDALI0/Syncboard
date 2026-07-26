import { getUserInvitations } from '@/actions/invitationActions'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Mail, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvitationActions } from '@/components/dashboard/InvitationActions'

export default async function InvitationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const invitations = await getUserInvitations()

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Your Invitations</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Review and accept pending invitations to join other workspaces.
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-6">
            <Mail size={40} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No pending invitations</h3>
          <p className="text-zinc-500 max-w-md">
            You don't have any pending workspace invitations right now. When someone invites you to join their team, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {invitation.workspace.name}
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {invitation.inviter.name || invitation.inviter.email}
                    </span>{' '}
                    invited you to join as a <span className="font-semibold">{invitation.role}</span>.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                    <Clock size={14} />
                    Expires {new Date(invitation.expires_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <InvitationActions invitationId={invitation.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
