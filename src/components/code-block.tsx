'use client'

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export function CodeBlock({ className, children, inline, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  // 如果是行内代码（比如 `npm install`），直接返回默认样式
  if (inline) {
    return (
      <code className={cn("bg-slate-100 text-pink-500 px-1.5 py-0.5 rounded text-sm font-mono font-medium mx-1", className)} {...props}>
        {children}
      </code>
    )
  }

  // 解析语言类型
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'
  const codeContent = String(children).replace(/\n$/, '')

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <span className="group relative my-6 block w-full rounded-xl overflow-hidden bg-[#282c34] border border-slate-700/50 shadow-lg align-top text-[15px]">
      {/* 悬浮复制按钮 - 固定在右上角 */}
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white p-1.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10"
        title="复制代码"
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* 代码内容区域 */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1.25rem 1.5rem', // 增加一点呼吸感
          background: 'transparent', // 使用外层容器的背景
          fontSize: 'inherit',
          lineHeight: '1.7',
          display: 'block',
          overflowX: 'auto',
          fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace', // 尝试使用更现代的编程字体
        }}
        showLineNumbers={false}
        PreTag="span"
      >
        {codeContent}
      </SyntaxHighlighter>
    </span>
  )
}
