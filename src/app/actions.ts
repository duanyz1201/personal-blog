'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'

// const prisma = new PrismaClient()

export async function getMediaFiles() {
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  
  if (!fs.existsSync(uploadDir)) {
    return []
  }

  const files = fs.readdirSync(uploadDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => {
      const stats = fs.statSync(path.join(uploadDir, file))
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      }
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return files
}

export async function deleteMediaFile(filename: string) {
  const filePath = path.join(process.cwd(), 'public/uploads', filename)
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  
  revalidatePath('/admin/media')
}

export async function createComment(formData: FormData) {
  const nickname = formData.get('nickname') as string
  const email = formData.get('email') as string
  const content = formData.get('content') as string
  const postId = parseInt(formData.get('postId') as string)
  const slug = formData.get('slug') as string

  if (!nickname || !content || !postId) {
    throw new Error('Missing required fields')
  }

  await prisma.comment.create({
    data: {
      nickname,
      email,
      content,
      postId
    }
  })

  revalidatePath(`/posts/${slug}`)
}

export async function deleteComment(id: number) {
  const comment = await prisma.comment.delete({
    where: { id },
    include: { post: true }
  })
  
  revalidatePath(`/posts/${comment.post.slug}`)
  revalidatePath('/admin/comments')
}

export async function updateProfile(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const newPassword = formData.get('newPassword') as string

  if (!email || !name) {
    throw new Error('邮箱和昵称不能为空')
  }

  // 获取当前用户（这里简化处理，直接查 admin 用户）
  // 实际应该从 session 获取当前用户 ID
  const user = await prisma.user.findFirst()
  if (!user) throw new Error('用户不存在')

  const data: any = {
    email,
    name,
  }

  // 如果提供了新密码，则更新密码
  if (newPassword) {
    // 验证旧密码
    if (password !== user.password) {
      throw new Error('旧密码错误')
    }
    data.password = newPassword
  }

  await prisma.user.update({
    where: { id: user.id },
    data
  })

  revalidatePath('/admin/profile')
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const coverImage = formData.get('coverImage') as string
  const published = formData.get('published') === 'on'
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  
  // 简单的验证
  if (!title || !slug) {
    throw new Error('Title and Slug are required')
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      categoryId,
    },
  })

  // 刷新列表页缓存
  revalidatePath('/admin/posts')
  // 跳转回列表页
  redirect('/admin/posts')
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const coverImage = formData.get('coverImage') as string
  const published = formData.get('published') === 'on'
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null

  if (!title || !slug) {
    throw new Error('Title and Slug are required')
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      categoryId,
    },
  })

  revalidatePath('/admin/posts')
  revalidatePath(`/posts/${slug}`)
  redirect('/admin/posts')
}

export async function deletePost(id: number) {
  await prisma.post.delete({
    where: { id },
  })
  revalidatePath('/admin/posts')
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  // 简单的 slug 生成：转小写，空格换成横杠，去掉非字母数字
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  await prisma.category.create({
    data: { 
      name,
      slug: slug || `cat-${Date.now()}` // 防止 slug 为空
    }
  })
  
  revalidatePath('/admin/categories')
  revalidatePath('/admin/posts/new')
}

export async function deleteCategory(id: number) {
  // 简单处理：如果分类下有文章，暂时不允许删除，或者报错
  // 这里为了简单，先直接尝试删除，如果有外键约束会抛错
  try {
    await prisma.category.delete({
      where: { id }
    })
    revalidatePath('/admin/categories')
  } catch (error) {
    console.error('Delete category failed:', error)
    // 实际项目中应该返回错误信息给前端
  }
}

export async function updateSiteConfig(formData: FormData) {
  const siteName = formData.get('siteName') as string
  const description = formData.get('description') as string
  const github = formData.get('github') as string
  const twitter = formData.get('twitter') as string
  const email = formData.get('email') as string
  const heroImagesText = formData.get('heroImages') as string

  // 处理图片列表：按换行符分割，去空，然后转 JSON
  const heroImages = JSON.stringify(
    heroImagesText.split('\n').map(s => s.trim()).filter(Boolean)
  )

  // 这里的 id=1 是假设我们只用一条记录
  // 使用 upsert 确保如果没有记录则创建
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      siteName,
      description,
      github,
      twitter,
      email,
      heroImages,
    },
    create: {
      siteName,
      description,
      github,
      twitter,
      email,
      heroImages,
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/settings')
}

export async function incrementViewCount(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true }
  })

  if (!post) return

  // 1. 增加文章阅读数
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } }
  })

  // 2. 增加每日统计
  const now = new Date()
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  
  try {
    await prisma.dailyStat.upsert({
      where: { date: today },
      update: { views: { increment: 1 } },
      create: { 
        date: today,
        views: 1,
        visitors: 1 
      }
    })
  } catch (error) {
    console.error("Failed to update daily stats:", error)
  }
}
