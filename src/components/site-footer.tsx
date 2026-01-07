import { Github, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Uptime } from "@/components/uptime"

// const prisma = new PrismaClient()

async function getSiteConfig() {
  const config = await prisma.siteConfig.findFirst()
  return config
}

export async function SiteFooter() {
  const config = await getSiteConfig()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Uptime />
          <p className="text-center text-xs text-slate-400 md:text-left">
            © {new Date().getFullYear()} {config?.siteName || "我的技术博客"}. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {config?.github && (
            <Link href={config.github} target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          )}
          {config?.twitter && (
            <Link href={config.twitter} target="_blank" className="text-slate-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          )}
          {config?.email && (
            <Link href={`mailto:${config.email}`} className="text-slate-400 hover:text-slate-900 transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
