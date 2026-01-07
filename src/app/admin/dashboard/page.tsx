import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Eye } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts"
import Link from "next/link"

// const prisma = new PrismaClient()

async function getDashboardStats() {
  // 1. 文章总数
  const totalPosts = await prisma.post.count()
  
  // 2. 总浏览量
  const viewsResult = await prisma.post.aggregate({
    _sum: { viewCount: true }
  })
  const totalViews = viewsResult._sum.viewCount || 0

  // 3. 最近发布的文章 (Top 5)
  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      viewCount: true,
    }
  })

  // 4. 最近 7 天访问数据 (从 DailyStat 表查询)
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const dailyStats = await prisma.dailyStat.findMany({
    where: {
      date: {
        gte: sevenDaysAgo
      }
    },
    orderBy: { date: 'asc' }
  })

  // 补全日期（因为数据库可能没有某天的记录）
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`
    
    // 查找当天的记录
    const stat = dailyStats.find(s => {
      const statDate = new Date(s.date)
      return statDate.getDate() === d.getDate() && statDate.getMonth() === d.getMonth()
    })

    return {
      date: dateStr,
      views: stat?.views || 0,
    }
  })

  return {
    totalPosts,
    totalViews,
    recentPosts,
    chartData,
  }
}

export default async function DashboardPage() {
  const { totalPosts, totalViews, recentPosts, chartData } = await getDashboardStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-muted/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文章总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">累计发布</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">累计阅读</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日阅读</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* 取 chartData 最后一项（即今天）的数据 */}
            <div className="text-2xl font-bold">{chartData[chartData.length - 1]?.views || 0}</div>
            <p className="text-xs text-muted-foreground">今日实时数据</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardCharts data={chartData} />
        
        <Card className="col-span-3 bg-muted/10">
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      发布于 {new Date(post.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{post.viewCount} 阅读</div>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  暂无文章
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
