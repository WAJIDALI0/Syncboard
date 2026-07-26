import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <FileQuestion size={40} />
      </div>
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Page not found</h2>
      <p className="text-zinc-500 mb-8 max-w-md text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}
