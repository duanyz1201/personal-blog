import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Folder } from "lucide-react"

// const prisma = new PrismaClient()

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  })
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">文章分类</h1>
            <p className="text-muted-foreground">
              按主题浏览文章。
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`} className="block h-full">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {category.name}
                    </CardTitle>
                    <Folder className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {category._count.posts}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      篇文章
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                暂无分类
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
