import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// const prisma = new PrismaClient()

async function getArchivePosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    }
  })

  // 按年份分组
  const groupedPosts: Record<string, typeof posts> = {}
  posts.forEach(post => {
    const year = new Date(post.createdAt).getFullYear().toString()
    if (!groupedPosts[year]) {
      groupedPosts[year] = []
    }
    groupedPosts[year].push(post)
  })

  return groupedPosts
}

export default async function ArchivePage() {
  const groupedPosts = await getArchivePosts()
  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-card p-8 rounded-2xl shadow-sm border border-border">
          <div className="space-y-2 border-b border-border pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">文章归档</h1>
            <p className="text-muted-foreground">
              回顾过去的足迹。
            </p>
          </div>

          <div className="space-y-12">
            {years.map(year => (
              <section key={year} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center">
                  <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                  {year}
                </h2>
                <ul className="space-y-4 ml-5 border-l-2 border-border pl-6">
                  {groupedPosts[year].map(post => (
                    <li key={post.id} className="relative">
                      <div className="absolute -left-[31px] top-2 w-3 h-3 bg-muted rounded-full border-2 border-background ring-1 ring-border"></div>
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
                      >
                        <span className="text-sm text-muted-foreground font-mono shrink-0">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-lg text-foreground/80 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {years.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                暂无文章
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
