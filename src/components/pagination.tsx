'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="gap-1 pl-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </Button>
      
      <div className="text-sm font-medium text-slate-600">
        第 {currentPage} 页 / 共 {totalPages} 页
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="gap-1 pr-2.5"
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
