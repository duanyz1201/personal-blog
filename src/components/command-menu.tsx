"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
  FileTextIcon,
  HomeIcon,
  LaptopIcon
} from "@radix-ui/react-icons"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    // Console Easter Egg
    console.log(
      `%c
   ____                    _           
  |  _ \\ _   _  __ _ _ __ | |_ _______ 
  | | | | | | |/ _\` | '_ \\| | |_  / _ \\
  | |_| | |_| | (_| | | | | | |/ /  __/
  |____/ \\__,_|\\__,_|_| |_|_|_/___\\___|
                                       
  Welcome to my digital garden! 🌱
  Built with Next.js, Tailwind CSS & Prisma.
  
  Press Cmd+K to open the command menu.
      `,
      "font-family: monospace; color: #4ade80; font-weight: bold; font-size: 14px;"
    )

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        {/* 移动端可能需要一个悬浮按钮来唤起，但这里主要针对桌面端键盘流 */}
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <HomeIcon className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/#posts'))}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              <span>Latest Posts</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/about'))}>
              <PersonIcon className="mr-2 h-4 w-4" />
              <span>About Me</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="System">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/dashboard'))}>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => window.location.reload())}>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Reload Page</span>
              <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => {
              navigator.clipboard.writeText(window.location.href)
            })}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              <span>Copy URL</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
