'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSiteConfig } from "@/app/actions"
import { toast } from "sonner"
import { useTransition } from "react"

interface SettingsFormProps {
  config: any
}

export function SettingsForm({ config }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateSiteConfig(formData)
        toast.success("保存成功！", {
          description: "站点配置已更新。"
        })
      } catch (error) {
        toast.error("保存失败", {
          description: "请稍后重试。"
        })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">基本信息</h3>
        <div className="grid gap-2">
          <Label htmlFor="siteName">博客名称</Label>
          <Input 
            id="siteName" 
            name="siteName" 
            defaultValue={config?.siteName} 
            placeholder="我的技术博客" 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">博客简介</Label>
          <Textarea 
            id="description" 
            name="description" 
            defaultValue={config?.description || ""} 
            placeholder="一句话介绍你的博客..." 
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">首页背景</h3>
        <div className="grid gap-2">
          <Label htmlFor="heroImages">首页背景图 (每行一个 URL)</Label>
          <Textarea 
            id="heroImages" 
            name="heroImages" 
            defaultValue={config?.heroImages ? JSON.parse(config.heroImages).join('\n') : ""} 
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="min-h-[150px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">如果不填，将使用默认的动漫风格背景图。</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">社交链接</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub</Label>
            <Input 
              id="github" 
              name="github" 
              defaultValue={config?.github || ""} 
              placeholder="https://github.com/..." 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input 
              id="twitter" 
              name="twitter" 
              defaultValue={config?.twitter || ""} 
              placeholder="https://twitter.com/..." 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              defaultValue={config?.email || ""} 
              placeholder="contact@example.com" 
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "保存中..." : "保存站点设置"}
      </Button>
    </form>
  )
}
