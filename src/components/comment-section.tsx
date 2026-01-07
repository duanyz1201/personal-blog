'use client'

import { useState, useRef } from 'react'
import { createComment } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { MessageSquare, Send } from 'lucide-react'

interface Comment {
  id: number
  nickname: string
  email?: string | null
  content: string
  createdAt: Date
}

interface CommentSectionProps {
  postId: number
  slug: string
  comments: Comment[]
}

export function CommentSection({ postId, slug, comments }: CommentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createComment(formData)
      toast.success('评论发表成功！')
      formRef.current?.reset()
    } catch (error) {
      console.error(error)
      toast.error('发表评论失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10 mt-16 pt-10 border-t border-border">
      <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
        <MessageSquare className="h-6 w-6" />
        评论 ({comments.length})
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
            暂无评论，快来抢沙发吧！
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.nickname}`} />
                <AvatarFallback>{comment.nickname[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{comment.nickname}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 发表评论表单 */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">发表评论</h3>
        <form 
          ref={formRef}
          action={handleSubmit} 
          className="space-y-4"
        >
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="slug" value={slug} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium text-foreground">
                昵称 <span className="text-red-500">*</span>
              </label>
              <Input 
                id="nickname" 
                name="nickname" 
                placeholder="怎么称呼你？" 
                required 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                邮箱 <span className="text-muted-foreground text-xs font-normal">(保密，仅用于头像)</span>
              </label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="your@email.com" 
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              评论内容 <span className="text-red-500">*</span>
            </label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="写下你的想法..." 
              required 
              className="min-h-[100px] bg-background resize-y"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                "发送中..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> 发送评论
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
