'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = totalScroll / windowHeight
      setProgress(Math.min(scrolled * 100, 100))
      setIsVisible(totalScroll > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // SVG 配置
  const size = 48
  const strokeWidth = 3 // 稍微加粗一点，展现渐变质感
  const center = 24
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 rounded-full border border-indigo-100/50"
        style={{ width: size, height: size }}
        aria-label="回到顶部"
      >
        {/* SVG 容器 */}
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <defs>
            <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" /> {/* Indigo-500 */}
              <stop offset="100%" stopColor="#ec4899" /> {/* Pink-500 */}
            </linearGradient>
          </defs>

          {/* 底轨圆环 */}
          <circle
            className="text-indigo-50"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            cx={center}
            cy={center}
            r={radius}
          />
          {/* 进度圆环 */}
          <circle
            stroke="url(#progress-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            cx={center}
            cy={center}
            r={radius}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-150 ease-out drop-shadow-[0_0_2px_rgba(99,102,241,0.3)]"
          />
        </svg>

        {/* 交互内容 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ArrowUp 
            className="h-5 w-5 text-indigo-600 transition-transform duration-300 group-hover:-translate-y-0.5" 
            strokeWidth={2.5}
          />
        </div>
      </button>
    </div>
  )
}
