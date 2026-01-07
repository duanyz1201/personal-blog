'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfileFormProps {
  user: {
    email: string
    name: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfile(formData)
        toast.success('个人资料已更新')
        // 如果改了密码，最好强制登出，这里先简单处理
      } catch (error: any) {
        console.error(error)
        toast.error(error.message || '更新失败')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">登录账号/邮箱</Label>
            <Input 
              id="email" 
              name="email" 
              defaultValue={user.email} 
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">显示昵称</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={user.name || ''} 
              required 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password">当前密码 (仅修改密码时必填)</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="如果不修改密码，请留空"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input 
              id="newPassword" 
              name="newPassword" 
              type="password" 
              placeholder="输入新密码"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? '保存中...' : '保存更改'}
        </Button>
      </div>
    </form>
  )
}
