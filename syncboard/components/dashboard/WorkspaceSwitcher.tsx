'use client'

import { useState, useTransition } from 'react'
import { Check, ChevronsUpDown, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { setActiveWorkspace } from '@/actions/workspaceActions'

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
}: {
  workspaces: any[]
  activeWorkspaceId?: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const active = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]
  
  const personalWorkspaces = workspaces.filter(w => w.organization?.is_personal)
  const teamWorkspaces = workspaces.filter(w => !w.organization?.is_personal)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
          role="combobox"
          aria-expanded={open}
          className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-between bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          disabled={isPending}
        >
          <div className="flex items-center gap-2 truncate">
            <Users size={16} className="text-zinc-500 shrink-0" />
            <span className="truncate font-medium">
              {active?.name || 'Select Workspace'}
              {!active?.organization?.is_personal && active?.organization && (
                <span className="text-zinc-500 font-normal ml-1">({active.organization.name})</span>
              )}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            
            {personalWorkspaces.length > 0 && (
              <CommandGroup heading="Personal">
                {personalWorkspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={workspace.name}
                    onSelect={() => {
                      startTransition(async () => {
                        await setActiveWorkspace(workspace.id)
                        setOpen(false)
                      })
                    }}
                    className="cursor-pointer py-2"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        active?.id === workspace.id ? 'opacity-100 text-primary' : 'opacity-0'
                      )}
                    />
                    <span>{workspace.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {teamWorkspaces.length > 0 && (
              <CommandGroup heading="Teams & Organizations">
                {teamWorkspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={`${workspace.organization?.name} ${workspace.name}`}
                    onSelect={() => {
                      startTransition(async () => {
                        await setActiveWorkspace(workspace.id)
                        setOpen(false)
                      })
                    }}
                    className="cursor-pointer py-2"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        active?.id === workspace.id ? 'opacity-100 text-primary' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{workspace.name}</span>
                      {workspace.organization && (
                        <span className="text-[10px] text-zinc-500">{workspace.organization.name}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
