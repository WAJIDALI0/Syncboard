'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Moon, Sun } from "lucide-react"
import { logout } from "@/actions/auth"
import { useTheme } from "next-themes"

export function UserProfile({ email }: { email: string }) {
  const initial = email ? email.charAt(0).toUpperCase() : "U"
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-14 w-full flex items-center justify-start gap-3 px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md outline-none transition-colors">
        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
          <AvatarImage src="" alt={email} />
          <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden text-left">
          <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-200">{email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" align="end" side="right" sideOffset={10}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-zinc-900 dark:text-white">Account</p>
              <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-white cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-white cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-white cursor-pointer"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
        <DropdownMenuItem className="focus:bg-red-50 dark:focus:bg-red-500/20 focus:text-red-600 dark:focus:text-red-400 cursor-pointer text-red-600 dark:text-red-400" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
