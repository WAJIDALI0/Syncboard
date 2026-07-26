'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { acceptInvitation } from '@/actions/invitationActions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function InvitationActions({ invitationId }: { invitationId: string }) {
  const [isAccepting, setIsAccepting] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    setIsAccepting(true)
    const result = await acceptInvitation(invitationId)
    setIsAccepting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Welcome to the workspace!')
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-500">
        <X size={16} className="mr-2" />
        Decline
      </Button>
      <Button 
        onClick={handleAccept} 
        disabled={isAccepting}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <Check size={16} className="mr-2" />
        {isAccepting ? 'Accepting...' : 'Accept Invite'}
      </Button>
    </>
  )
}
