import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <SiteHeader />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-inner">
              <Image
                src="https://github.com/shadcn.png"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">关于我</h1>
                <p className="text-lg text-muted-foreground">全栈开发者 / 产品爱好者 / 数字游民</p>
              </div>
              
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                <p>
                  你好！我是这里的博主。我热衷于探索前沿的 Web 技术，尤其是 React, Next.js 和 Rust 生态。
                </p>
                <p>
                  在这个博客里，我会分享我在开发过程中遇到的坑、学到的新知识，以及对技术趋势的一些个人见解。
                  除了写代码，我还喜欢摄影和阅读。
                </p>
                <p>
                  如果你对我的文章感兴趣，或者有任何问题，欢迎通过以下方式联系我：
                </p>
                <ul>
                  <li>Email: contact@example.com</li>
                  <li>Twitter: @username</li>
                  <li>GitHub: @username</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
