import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile-form"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await prisma.user.findFirst()

  if (!user) {
    return <div>用户不存在</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">个人资料</h1>
        <p className="text-muted-foreground">
          管理你的账号信息和密码。
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
