'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "分类",
    href: "/categories",
  },
  {
    title: "归档",
    href: "/archive",
  },
  {
    title: "项目",
    href: "/projects",
  },
  {
    title: "关于我",
    href: "/about",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => {
        // 首页只有完全匹配 '/' 时才高亮
        // 其他页面只要以 href 开头就高亮 (例如 /categories/1 也应该高亮分类)
        const isActive = item.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              isActive 
                ? "text-foreground font-bold" // 高亮样式：深色+加粗
                : "text-foreground/60"        // 默认样式：浅色
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
