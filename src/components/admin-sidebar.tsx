'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Settings, FolderTree, MessageSquare, Image as ImageIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "文章管理",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "评论管理",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "分类管理",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "媒体库",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "个人资料",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1 px-2 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground hover:bg-background/80",
              isActive 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
