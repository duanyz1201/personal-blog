import Link from 'next/link'
import { Terminal404 } from '@/components/terminal-404'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      
      <main className="flex-1 container flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
            404
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            你来到了知识的荒原。
            <br />
            您可以尝试在下方终端输入 <code className="bg-slate-200 px-1 rounded text-slate-800">home</code> 返回首页，或者 <code className="bg-slate-200 px-1 rounded text-slate-800">ls</code> 查看目录。
          </p>
        </div>

        <Terminal404 />

        <div className="mt-12">
          <Button asChild variant="outline" className="border-slate-300 hover:bg-slate-100">
            <Link href="/">
              如果不习惯命令行，点这里回家
            </Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
