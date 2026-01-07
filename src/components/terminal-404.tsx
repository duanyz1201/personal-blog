'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal } from 'lucide-react'

export function Terminal404() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    'Error: 404 Page Not Found',
    'The requested resource could not be located on this server.',
    'Type "help" for available commands.',
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    inputRef.current?.focus()
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const newHistory = [...history, `visitor@duanyz-blog:~$ ${cmd}`]

    switch (trimmedCmd) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  home    - Return to homepage',
          '  ls      - List available pages',
          '  whoami  - Display current user',
          '  clear   - Clear terminal',
          '  sudo    - Execute a command as another user'
        )
        break
      case 'home':
        newHistory.push('Redirecting to homepage...')
        setTimeout(() => router.push('/'), 1000)
        break
      case 'ls':
        newHistory.push(
          'index.html',
          'about.html',
          'posts/',
          'projects/',
          'contact.md'
        )
        break
      case 'whoami':
        newHistory.push('guest_user')
        break
      case 'clear':
        setHistory([])
        setInput('')
        return
      case 'sudo rm -rf /':
        newHistory.push('Permission denied: You are not root.')
        break
      case '':
        break
      default:
        if (trimmedCmd.startsWith('sudo')) {
          newHistory.push('Password required. Just kidding, permission denied.')
        } else {
          newHistory.push(`Command not found: ${trimmedCmd}`)
        }
    }

    setHistory(newHistory)
    setInput('')
  }

  return (
    <div 
      className="min-h-[500px] w-full max-w-3xl mx-auto bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden font-mono text-sm md:text-base border border-slate-800"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          visitor@duanyz-blog: ~
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 md:p-6 text-green-400 h-full min-h-[400px] flex flex-col">
        {history.map((line, i) => (
          <div key={i} className="mb-1 break-words whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-blue-400">visitor@duanyz-blog:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input)
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-400/30"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
