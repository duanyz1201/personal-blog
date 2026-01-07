'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { deleteComment } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function DeleteCommentButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('确定要删除这条评论吗？')) {
      startTransition(async () => {
        try {
          await deleteComment(id)
          toast.success('评论已删除')
        } catch (error) {
          console.error(error)
          toast.error('删除失败')
        }
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
