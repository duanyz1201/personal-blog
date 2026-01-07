import Image from "next/image"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ReactMarkdown from "react-markdown"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { ViewCounter } from "@/components/view-counter"
import { CommentSection } from "@/components/comment-section"

// const prisma = new PrismaClient()

// 生成静态路由参数 (SSG)，提高性能
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { 
      category: true,
      comments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!post) return null

  return post
}

// 生成 SEO 元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - 技术博客文章`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 pb-20">
        {/* 沉浸式头部 */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900">
          <Image
            src={post.coverImage || `https://picsum.photos/seed/${post.slug}/1920/1080`}
            alt={post.title}
            fill
            unoptimized // 禁用优化
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container max-w-4xl mx-auto px-4 pb-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-300">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                  {post.category?.name || '技术'}
                </Badge>
                <div className="flex items-center text-sm font-medium">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </div>
                <div className="flex items-center text-sm font-medium">
                  <Clock className="mr-2 h-4 w-4" />
                  5 min read
                </div>
                <ViewCounter slug={post.slug} />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-md">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 文章正文 */}
        <article className="container max-w-3xl mx-auto px-4 py-4">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:my-1 prose-p:leading-7
            prose-headings:mt-4 prose-headings:mb-1
            prose-ul:my-2 prose-li:my-0
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none prose-pre:my-2
            prose-code:bg-transparent prose-code:p-0 prose-code:text-inherit prose-code:font-normal
            prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
              components={{
                code: CodeBlock as any
              }}
            >
              {post.content || ''}
            </ReactMarkdown>
          </div>

          <CommentSection 
            postId={post.id} 
            slug={post.slug} 
            comments={post.comments} 
          />
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
