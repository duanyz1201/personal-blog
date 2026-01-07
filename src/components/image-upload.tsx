'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploadProps {
  defaultValue?: string | null
  name: string
}

export function ImageUpload({ defaultValue, name }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!res.ok) throw new Error("Upload failed")
      
      const data = await res.json()
      setPreview(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("图片上传失败，请重试")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* 隐藏的 Input，用于表单提交 */}
      <input type="hidden" name={name} value={preview || ""} />

      {preview ? (
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-slate-200 group">
          <Image
            src={preview}
            alt="Cover preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="mr-2 h-4 w-4" />
              移除图片
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400" />
            )}
            <div className="text-sm font-medium text-slate-600">
              {isUploading ? "正在上传..." : "点击上传封面图"}
            </div>
            <div className="text-xs text-slate-400">
              支持 JPG, PNG, WEBP
            </div>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}
