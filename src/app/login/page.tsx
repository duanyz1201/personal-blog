'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from '@/app/lib/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? '登录中...' : '登录'}
    </Button>
  )
}

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">后台登录</CardTitle>
          <CardDescription>
            请输入管理员账号和密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">账号</Label>
              <Input id="email" type="text" name="email" placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            {errorMessage && (
              <div className="text-sm text-red-500">
                {errorMessage}
              </div>
            )}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
