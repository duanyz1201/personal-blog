import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, LayoutDashboard } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { SiteSearch } from "@/components/site-search"
import { prisma } from "@/lib/prisma"
import { ThemeToggle } from "@/components/theme-toggle"

async function getSiteConfig() {
  const config = await prisma.siteConfig.findFirst()
  return config
}

export async function SiteHeader() {
  const config = await getSiteConfig()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/30 dark:supports-[backdrop-filter]:bg-zinc-950/30 shadow-sm transition-all duration-200">
      <div className="container flex h-16 max-w-6xl mx-auto items-center px-4 justify-between">
        {/* 左侧 Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {config?.siteName || "我的技术博客"}
            </span>
          </Link>

          {/* 中间导航 - 移到这里和 Logo 在一起，但有足够间距 */}
          <div className="hidden md:flex items-center">
            <MainNav />
          </div>
        </div>

        {/* 移动端 Logo (当左侧隐藏时显示) */}
        <div className="flex md:hidden mr-2">
          <Link href="/" className="font-bold">
            {config?.siteName || "我的技术博客"}
          </Link>
        </div>

        {/* 右侧：搜索框 + 按钮 */}
        <div className="flex items-center gap-4">
          <div className="w-full max-w-[200px] hidden sm:block">
            <SiteSearch />
          </div>
          
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {config?.github && (
              <Link href={config.github} target="_blank" rel="noreferrer">
                <div className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 h-9 w-9">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
            )}
            <Link href="/admin/dashboard">
              <div className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 h-9 w-9">
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">后台管理</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
