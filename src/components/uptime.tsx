'use client'

import { useEffect, useState } from 'react'

export function Uptime() {
  const [uptime, setUptime] = useState('')
  // 假设建站时间是 2024-01-01 (你可以改成你的实际建站时间)
  const startTime = new Date('2024-01-01T00:00:00').getTime()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime()
      const diff = now - startTime

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setUptime(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    // 立即执行一次
    updateTime()
    
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [startTime])

  // 避免服务端渲染不一致
  if (!uptime) return null

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 w-fit mx-auto sm:mx-0">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="font-semibold text-slate-600 dark:text-slate-300">System Online:</span>
      <span>{uptime}</span>
    </div>
  )
}
