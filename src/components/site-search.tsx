'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function SiteSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    // 跳转到首页并带上搜索参数
    // 或者你可以创建一个专门的 /search 页面
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", query)
    // 搜索时通常会重置页码和分类
    params.delete("page")
    params.delete("category")
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <Input
        type="search"
        placeholder="搜索文章..."
        className="w-full rounded-full bg-white/50 pr-9 focus-visible:bg-white transition-colors border-slate-200/50"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
