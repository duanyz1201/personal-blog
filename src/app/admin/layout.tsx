import Link from "next/link"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r border-border bg-muted/40 md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-border px-6 bg-background/50 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <span className="text-xl">我的博客</span>
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="flex-1 overflow-auto py-4">
            <AdminSidebar />
          </div>

          <div className="mt-auto border-t border-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">管理员</span>
                <span className="text-xs text-muted-foreground">admin</span>
              </div>
            </div>
            <form action={async () => {
              'use server'
              await signOut()
            }}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                退出登录
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
