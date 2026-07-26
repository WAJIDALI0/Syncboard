'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getChatMessages, sendChatMessage } from '@/actions/chatActions'

export function TeamChat({ 
  workspaceId, 
  userId,
  userName
}: { 
  workspaceId: string
  userId: string
  userName: string
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Load initial messages
  useEffect(() => {
    if (open) {
      getChatMessages(workspaceId).then(data => {
        setMessages(data)
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
    }
  }, [open, workspaceId])

  // Realtime subscription
  useEffect(() => {
    if (!open) return

    const channel = supabase.channel(`chat:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          // Add message if it doesn't already exist (to avoid double render if we sent it)
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [open, workspaceId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const content = inputValue.trim()
    setInputValue('')
    setIsSending(true)

    // Optimistic UI
    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      id: tempId,
      content,
      workspace_id: workspaceId,
      user_id: userId,
      user: { name: userName },
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempMessage])
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 10)

    await sendChatMessage(workspaceId, content)
    setIsSending(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-transform",
          open ? "scale-0" : "scale-100"
        )}
      >
        <MessageSquare size={24} />
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right overflow-hidden",
          open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-zinc-500" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Team Chat</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-sm text-zinc-500">
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.user_id === userId
            const showName = !isMe && (idx === 0 || messages[idx - 1].user_id !== msg.user_id)
            
            return (
              <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                {showName && (
                  <span className="text-xs text-zinc-500 mb-1 ml-1">
                    {msg.user?.name || msg.user_id.slice(0,4)}
                  </span>
                )}
                <div 
                  className={cn(
                    "px-4 py-2 rounded-2xl max-w-[85%] text-sm",
                    isMe 
                      ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm" 
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 rounded-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!inputValue.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
