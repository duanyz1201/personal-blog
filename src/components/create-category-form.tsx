'use client'

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCategory } from "@/app/actions"

export function CreateCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await createCategory(formData)
        formRef.current?.reset()
      }}
      className="flex gap-4 items-end"
    >
      <div className="grid gap-2 flex-1 max-w-sm">
        <Input name="name" placeholder="输入分类名称（如：前端开发）" required />
      </div>
      <Button type="submit">添加分类</Button>
    </form>
  )
}
