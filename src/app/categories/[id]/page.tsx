import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"

// const prisma = new PrismaClient()

// Next.js 15: params is a Promise
export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = parseInt(id)

  if (isNaN(categoryId)) {
    notFound()
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-2 border-b border-border pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              分类: <span className="text-blue-600">{category.name}</span>
            </h1>
            <p className="text-muted-foreground">
              共 {category.posts.length} 篇文章
            </p>
          </div>

          <div className="grid gap-6">
            {category.posts.map((post) => (
              <Card key={post.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="font-normal">
                      {category.name}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">
                    <Link href={`/posts/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {post.excerpt || '暂无摘要'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    阅读全文 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}

            {category.posts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                该分类下暂无文章
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
