import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Create a Category
  const category = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'tech',
    },
  })

  // 2. Create some dummy posts
  const posts = [
    {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: '# Hello Next.js\nThis is a sample post content.',
      excerpt: 'Learn the basics of Next.js framework.',
      published: true,
      viewCount: 100,
      categoryId: category.id,
    },
    {
      title: 'Why Prisma is Awesome',
      slug: 'why-prisma-is-awesome',
      content: 'Prisma makes database access easy.',
      excerpt: 'Database access made easy with Prisma ORM.',
      published: true,
      viewCount: 250,
      categoryId: category.id,
    },
    {
      title: 'My Draft Post',
      slug: 'my-draft-post',
      content: 'This is a draft post.',
      excerpt: 'Just a draft.',
      published: false, // Draft
      viewCount: 0,
      categoryId: category.id,
    },
  ]

  for (const post of posts) {
    const p = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
    console.log(`Created post with id: ${p.id}`)
  }

  console.log('Seeding finished.')
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
