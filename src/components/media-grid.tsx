'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Trash2, Copy, Check } from 'lucide-react'
import { deleteMediaFile } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MediaFile {
  name: string
  url: string
  size: number
  createdAt: Date
}

export function MediaGrid({ files }: { files: MediaFile[] }) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState<string | null>(null)

  const handleDelete = (filename: string) => {
    if (confirm('确定要删除这张图片吗？这可能会导致引用该图片的文章显示异常。')) {
      startTransition(async () => {
        try {
          await deleteMediaFile(filename)
          toast.success('图片已删除')
        } catch (error) {
          console.error(error)
          toast.error('删除失败')
        }
      })
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    toast.success('链接已复制')
    setTimeout(() => setCopied(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
        <p>暂无上传文件</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div 
          key={file.name} 
          className="group relative aspect-square bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all"
        >
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover"
            unoptimized
          />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white border-0"
                onClick={() => handleCopy(file.url)}
              >
                {copied === file.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(file.name)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-white/90 space-y-0.5">
              <p className="truncate font-medium">{file.name}</p>
              <p className="opacity-80">{formatSize(file.size)}</p>
              <p className="opacity-80">{new Date(file.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
