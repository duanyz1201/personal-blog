import { prisma } from "@/lib/prisma"
import { CreateCategoryForm } from "@/components/create-category-form"
import { DeleteCategoryButton } from "@/components/delete-category-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">分类管理</h1>
        <p className="text-muted-foreground">
          在这里管理博客的文章分类。
        </p>
      </div>

      <div className="p-6 bg-card border rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">新建分类</h2>
        <CreateCategoryForm />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>文章数量</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category._count.posts}</TableCell>
                <TableCell className="text-right">
                  <DeleteCategoryButton id={category.id} />
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  暂无分类
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
