import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const username = 'admin'
  const password = 'password123'

  console.log(`Resetting user '${username}'...`)

  // 1. 先尝试删除旧的 admin@example.com (如果存在)
  try {
    await prisma.user.delete({
      where: { email: 'admin@example.com' }
    })
    console.log('Deleted old admin@example.com')
  } catch (e) {
    // 忽略不存在的错误
  }

  // 2. 创建或更新 admin 用户
  const user = await prisma.user.upsert({
    where: { email: username },
    update: {
      password: password
    },
    create: {
      email: username,
      password: password,
      name: 'Admin',
    },
  })

  console.log('User upserted:', user)
  console.log('✅ Login with:')
  console.log(`   Account: ${username}`)
  console.log(`   Password: ${password}`)
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
