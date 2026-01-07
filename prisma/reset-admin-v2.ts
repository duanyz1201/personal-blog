import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@blog.com'
  const password = 'password123'

  console.log(`Resetting user '${email}'...`)

  // 1. 删除之前的 admin (如果存在)
  try {
    await prisma.user.delete({
      where: { email: 'admin' }
    })
    console.log('Deleted user "admin"')
  } catch (e) {
    // ignore
  }

  // 2. 创建或更新 admin@blog.com
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: password
    },
    create: {
      email: email,
      password: password,
      name: 'Admin',
    },
  })

  console.log('User upserted:', user)
  console.log('✅ Login with:')
  console.log(`   Email: ${email}`)
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
