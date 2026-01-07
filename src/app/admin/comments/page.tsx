import { prisma } from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteCommentButton } from "@/components/delete-comment-button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function CommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: {
          title: true,
          slug: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">评论管理</h1>
        <p className="text-muted-foreground">
          查看并管理所有访客评论。
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">昵称</TableHead>
              <TableHead className="w-[300px]">评论内容</TableHead>
              <TableHead>所属文章</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{comment.nickname}</span>
                    <span className="text-xs text-muted-foreground">{comment.email || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm" title={comment.content}>
                    {comment.content}
                  </p>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/posts/${comment.post.slug}`}
                    className="text-blue-500 hover:underline truncate max-w-[200px] block"
                  >
                    {comment.post.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(comment.createdAt).toLocaleString('zh-CN')}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteCommentButton id={comment.id} />
                </TableCell>
              </TableRow>
            ))}
            {comments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  暂无评论
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
