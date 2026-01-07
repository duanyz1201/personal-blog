import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeletePostButton } from "@/components/delete-post-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { Pagination } from "@/components/pagination"

export const dynamic = 'force-dynamic'
const POSTS_PER_PAGE = 10

// const prisma = new PrismaClient()

async function getPosts(page: number = 1) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count()
  ])
  
  return {
    posts,
    totalPages: Math.ceil(total / POSTS_PER_PAGE)
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const { posts, totalPages } = await getPosts(page)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">文章管理</h1>
          <p className="text-muted-foreground">在这里管理你的博客文章。</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>阅读量</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  {post.title}
                  <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                    /{post.slug}
                  </div>
                </TableCell>
                <TableCell>
                  {post.published ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">已发布</Badge>
                  ) : (
                    <Badge variant="secondary">草稿</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {post.category?.name || '-'}
                </TableCell>
                <TableCell>{post.viewCount}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DeletePostButton id={post.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
