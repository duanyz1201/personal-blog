import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  // 生产环境请务必使用 bcrypt 哈希密码！
  // 这里为了演示方便，假设数据库存的是明文，或者你自己手动 hash 存进去
  // 真正的做法是在 auth.ts 里用 bcrypt.compare
  const password = 'password123' 

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password, // ⚠️ 注意：实际项目中这里必须存 hash
      name: 'Admin',
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
