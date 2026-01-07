import { PrismaClient } from "@prisma/client"
import { PostForm } from "@/components/post-form"

const prisma = new PrismaClient()

export default async function NewPostPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">创建新文章</h1>
        <p className="text-muted-foreground">
          今天想写点什么？
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <PostForm categories={categories} />
      </div>
    </div>
  )
}
