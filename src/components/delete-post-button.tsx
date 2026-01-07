'use client'

import { Trash } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deletePost } from "@/app/actions"

export function DeletePostButton({ id }: { id: number }) {
  return (
    <DropdownMenuItem 
      className="text-red-600 focus:text-red-600 cursor-pointer"
      onSelect={(e) => {
        e.preventDefault() // 防止菜单关闭
        if (confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
          deletePost(id)
        }
      }}
    >
      <Trash className="mr-2 h-4 w-4" />
      删除
    </DropdownMenuItem>
  )
}
