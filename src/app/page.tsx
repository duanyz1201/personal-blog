import { PostFilter } from "@/components/post-filter"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, ArrowRight, MessageSquare } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { Button } from "@/components/ui/button"
import { VisitorInfo } from "@/components/visitor-info"
import { Typewriter } from "@/components/typewriter"
import { prisma } from "@/lib/prisma"
const POSTS_PER_PAGE = 9 // 每页显示 9 篇文章

// 1. 获取所有分类
async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { posts: { _count: 'desc' } } // 按文章数量排序
  })
}

import { Prisma } from "@prisma/client"

// ...

// 2. 获取文章列表（带筛选、搜索和分页）
async function getPosts(categorySlug?: string, searchQuery?: string, page: number = 1) {
  const where: Prisma.PostWhereInput = {
    published: true,
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery } },
      { content: { contains: searchQuery } },
      { excerpt: { contains: searchQuery } },
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        category: true,
        _count: {
          select: { comments: true }
        }
      },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where })
  ])

  return {
    posts,
    totalPages: Math.ceil(total / POSTS_PER_PAGE)
  }
}

async function getSiteConfig() {
  const config = await prisma.siteConfig.findFirst()
  return config
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 解析 URL 参数
  const params = await searchParams
  const categorySlug = typeof params.category === 'string' ? params.category : undefined
  const searchQuery = typeof params.q === 'string' ? params.q : undefined
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  
  // 并行获取数据
  const [categories, { posts, totalPages }, config] = await Promise.all([
    getCategories(),
    getPosts(categorySlug, searchQuery, page),
    getSiteConfig()
  ])

  // 解析背景图配置
  let heroImages: string[] = []
  if (config?.heroImages) {
    try {
      heroImages = JSON.parse(config.heroImages)
    } catch (e) {
      console.error("Failed to parse heroImages", e)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background transition-colors duration-300">
      <SiteHeader />
      
      {/* Hero Section */}
      {/* -mt-16 让图片向上延伸到导航栏底部，从而体现磨砂效果 */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden -mt-16 pt-16 group">
        {/* 背景轮播 */}
        <HeroCarousel images={heroImages} />
        
        {/* 访客信息：悬浮在 Hero 区域右上角 */}
        <div className="absolute top-24 right-6 z-20 hidden lg:block">
          <VisitorInfo />
        </div>

        <div className="container relative max-w-6xl mx-auto px-4 py-24 md:py-32 z-10">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-sm font-medium text-white shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              欢迎光临我的数字花园
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-lg">
              {config?.siteName || "探索技术边界"}
              <span className="block text-blue-200 mt-2">
                <Typewriter 
                  text="记录生活点滴" 
                  speed={150} 
                  delay={500}
                  className="text-blue-200"
                />
              </span>
            </h1>
            
            <p className="text-xl text-slate-100 leading-relaxed max-w-2xl drop-shadow-md font-medium">
              {config?.description || "这里是我的数字花园。分享关于全栈开发、产品设计以及我对未来技术的思考。"}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#posts" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-slate-900 transition-all hover:bg-blue-50 hover:scale-105 shadow-xl">
                开始阅读
              </Link>
              <Link href="/about" className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 text-sm font-bold text-white transition-all hover:bg-white/20 hover:border-white/50 hover:scale-105 shadow-lg">
                关于博主
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main id="posts" className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">最新文章</h2>
          {/* 分类筛选器 */}
          <PostFilter categories={categories} />
        </div>
        
        {/* 调整 grid-cols-3 让卡片变小一点 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block h-full">
              <article className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/40 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white dark:hover:bg-slate-800 ring-1 ring-slate-900/5 dark:ring-white/10">
                {/* 封面图区域 */}
                <div className="relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={post.coverImage || `https://picsum.photos/seed/${post.id}/800/400`}
                    alt={post.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 dark:bg-black/80 text-slate-900 dark:text-slate-100 hover:bg-white dark:hover:bg-black backdrop-blur-md shadow-sm border-0 font-medium text-xs px-2 py-0.5">
                      {post.category?.name || '技术'}
                    </Badge>
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 p-5 flex flex-col relative">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.excerpt || '暂无摘要...'}
                  </p>
                  
                  {/* 底部 Meta 信息 */}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center font-medium">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center font-medium">
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                        {post._count?.comments || 0}
                      </div>
                      <div className="flex items-center font-medium">
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        {post.viewCount}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-dashed">
              <p className="text-lg">暂无相关文章</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/">清除筛选</Link>
              </Button>
            </div>
          )}
        </div>

        {/* 分页组件 */}
        <Pagination currentPage={page} totalPages={totalPages} />
      </main>

      <SiteFooter />
    </div>
  )
}

