import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

// 这里可以替换成你真实的 GitHub 项目
const projects = [
  {
    title: "Next.js Blog Starter",
    description: "一个基于 Next.js 14, Tailwind CSS 和 Prisma 的全栈博客系统。支持 Markdown 编辑、图片上传和后台管理。",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    github: "https://github.com",
    demo: "https://vercel.com",
  },
  {
    title: "Trae AI Assistant",
    description: "集成多种 AI 模型的智能编程助手，帮助开发者快速构建应用。",
    tags: ["AI", "Electron", "React"],
    github: "https://github.com",
    demo: null,
  },
  {
    title: "React Component Library",
    description: "一套极简风格的 React 组件库，专注于可访问性和定制化。",
    tags: ["React", "Storybook", "NPM"],
    github: "https://github.com",
    demo: "https://example.com",
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">我的项目</h1>
            <p className="text-muted-foreground">
              这里展示了一些我业余时间开发的开源项目和实验性作品。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                    {project.github && (
                      <Link 
                        href={project.github} 
                        target="_blank" 
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Github className="mr-1 h-4 w-4" />
                        源码
                      </Link>
                    )}
                    {project.demo && (
                      <Link 
                        href={project.demo} 
                        target="_blank" 
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        在线演示
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
