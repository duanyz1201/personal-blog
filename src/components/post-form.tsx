'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { createPost, updatePost } from '@/app/actions'
import 'easymde/dist/easymde.min.css'

// 动态导入编辑器，避免 SSR 问题
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

interface PostFormProps {
  post?: {
    id: number
    title: string
    slug: string
    content: string | null
    excerpt: string | null
    coverImage: string | null
    published: boolean
    categoryId: number | null
  }
  categories: {
    id: number
    name: string
  }[]
}

export function PostForm({ post, categories }: PostFormProps) {
  const [content, setContent] = useState(post?.content || '')
  // 增加 Slug 状态管理
  const [slug, setSlug] = useState(post?.slug || '')
  const isEditing = !!post
  
  // 包装 Server Action，如果是编辑模式则调用 updatePost
  const action = isEditing ? updatePost.bind(null, post.id) : createPost

  // 自动生成 Slug：当标题失去焦点且 Slug 为空时
  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!slug) {
      // 使用当前时间戳作为随机编号，例如：1704620...
      const generatedSlug = Date.now().toString()
      setSlug(generatedSlug)
    }
  }

  // 编辑器配置
  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false, // 关闭拼写检查
      placeholder: "支持 Markdown 语法...\n\n输入代码块请使用：\n```javascript\nconsole.log('Hello')\n```",
      status: false,
      autosave: {
        enabled: true,
        uniqueId: `post-editor-${post?.id || 'new'}`,
        delay: 1000,
      },
    }
  }, [post?.id])

  return (
    <form action={action} className="space-y-8 max-w-4xl">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">文章标题</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="输入文章标题" 
            defaultValue={post?.title}
            onBlur={handleTitleBlur} // 绑定 onBlur
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="slug">URL 路径 (Slug)</Label>
            <Input 
              id="slug" 
              name="slug" 
              placeholder="my-awesome-post" 
              value={slug} // 受控组件
              onChange={(e) => setSlug(e.target.value)} // 允许手动修改
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="categoryId">分类</Label>
            <Select name="categoryId" defaultValue={post?.categoryId?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>封面图</Label>
          <ImageUpload name="coverImage" defaultValue={post?.coverImage} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="excerpt">摘要</Label>
          <Textarea 
            id="excerpt" 
            name="excerpt" 
            placeholder="简短介绍一下这篇文章..." 
            className="h-20"
            defaultValue={post?.excerpt || ''}
          />
        </div>

        <div className="grid gap-2">
          <Label>正文内容</Label>
          <div className="prose max-w-none">
            <SimpleMDE 
              value={content} 
              onChange={setContent} 
              options={mdeOptions}
            />
            {/* 隐藏的 input 用于提交 SimpleMDE 的内容 */}
            <input type="hidden" name="content" value={content} />
          </div>
          <p className="text-xs text-muted-foreground">
            提示：使用 ``` 包裹代码块，例如 ```bash npm install```
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="published" 
            name="published" 
            defaultChecked={post?.published}
          />
          <Label htmlFor="published">立即发布</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit">{isEditing ? '更新文章' : '创建文章'}</Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          取消
        </Button>
      </div>
    </form>
  )
}
