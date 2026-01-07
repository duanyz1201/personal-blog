'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
  slug: string
}

export function PostFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set("category", slug)
    } else {
      params.delete("category")
    }
    // 重置页码到第一页
    params.set("page", "1")
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge 
        variant={currentCategory === null ? "default" : "outline"}
        className={cn(
          "cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105",
          currentCategory === null 
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200" 
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-200"
        )}
        onClick={() => handleSelect(null)}
      >
        全部
      </Badge>
      
      {categories.map((cat) => (
        <Badge
          key={cat.id}
          variant={currentCategory === cat.slug ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105",
            currentCategory === cat.slug 
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200" 
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-200"
          )}
          onClick={() => handleSelect(cat.slug)}
        >
          {cat.name}
        </Badge>
      ))}
    </div>
  )
}
