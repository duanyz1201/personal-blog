'use client'

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/app/actions"

export function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={async () => {
        if (confirm('确定要删除这个分类吗？关联的文章可能会受到影响。')) {
          await deleteCategory(id)
        }
      }}
    >
      <Trash className="h-4 w-4" />
    </Button>
  )
}
