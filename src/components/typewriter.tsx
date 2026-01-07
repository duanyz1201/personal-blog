'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterProps {
  text: string
  className?: string
  cursor?: boolean
  speed?: number
  delay?: number
}

export function Typewriter({
  text,
  className,
  cursor = true,
  speed = 100,
  delay = 0,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(intervalId)
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [text, speed, started])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {cursor && (
        <span className="animate-pulse ml-1 inline-block w-[3px] h-[1em] bg-current align-middle translate-y-[-2px]" />
      )}
    </span>
  )
}
