import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./settings-form"

// const prisma = new PrismaClient()

async function getSiteConfig() {
  const config = await prisma.siteConfig.findFirst()
  return config
}

export default async function SettingsPage() {
  const config = await getSiteConfig()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">站点设置</h1>
        <p className="text-muted-foreground">
          配置你的博客名称、简介和社交链接。
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-sm">
        <SettingsForm config={config} />
      </div>
    </div>
  )
}
