'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Something went wrong!</h2>
      <p className="text-zinc-500 mb-8 max-w-md text-center">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <Button 
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90 rounded-full px-8"
      >
        Try again
      </Button>
    </div>
  )
}
