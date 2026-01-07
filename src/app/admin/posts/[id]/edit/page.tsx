import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PostForm } from "@/components/post-form"

const prisma = new PrismaClient()

// Next.js 15: params is a Promise
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    notFound()
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  const categories = await prisma.category.findMany()

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">编辑文章</h1>
        <p className="text-muted-foreground">
          修改文章内容或状态。
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <PostForm post={post} categories={categories} />
      </div>
    </div>
  )
}
