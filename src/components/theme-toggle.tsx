"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    // 如果是暗色，切到亮色；否则切到暗色
    // resolvedTheme 会处理 'system' 的情况，告诉我们实际渲染的是 dark 还是 light
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {/* 太阳图标：亮色模式显示，暗色模式旋转消失 */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
      
      {/* 月亮图标：亮色模式消失，暗色模式旋转显示 */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
