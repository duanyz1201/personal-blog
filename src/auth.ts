import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { z } from "zod"

// const prisma = new PrismaClient()

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().min(1), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          
          console.log('Login attempt:', { email, userFound: !!user, inputPassword: password, dbPassword: user?.password })

          if (!user) return null
          
          // ⚠️ 警告：这里直接比对明文密码。
          // 生产环境请使用 bcrypt.compare(password, user.password)
          if (password === user.password) {
            // NextAuth 需要 id 为 string 类型
            return {
              ...user,
              id: user.id.toString(),
            }
          }
        }
        console.log("Invalid credentials")
        return null
      },
    }),
  ],
})
