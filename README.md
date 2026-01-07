# Personal Blog（个人博客）

一个基于 Next.js App Router 的个人博客与后台管理系统，支持文章/分类管理、评论系统、站点配置、媒体库与基础数据看板。

## 功能一览

- 前台
  - 文章列表与详情页（Markdown 渲染 + 代码高亮）
  - 文章阅读量统计
  - 评论发布与展示
  - 分类页、归档页、关于页、项目页
  - 主题切换（亮色/暗色）
  - 站内搜索（命令面板/快捷入口）
- 后台（/admin）
  - 仪表盘：文章/评论/浏览数据概览 + 图表
  - 文章管理：新建/编辑/删除/发布状态切换 + 分页
  - 分类管理：新建/删除
  - 评论管理：列表/删除
  - 媒体库：上传图片、浏览、复制链接、删除
  - 站点设置：站点名称/简介/社交链接/首页背景图
  - 个人资料：昵称/账号信息、修改密码

## 技术栈

- Next.js（App Router）
- React
- NextAuth（Credentials 登录）
- Prisma + MySQL
- Tailwind CSS
- Radix UI / shadcn 风格组件

## 本地运行

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量

项目使用 `.env` 提供数据库连接与鉴权密钥：

- `DATABASE_URL`：MySQL 连接串（请替换为你自己的数据库）
- `AUTH_SECRET`：NextAuth 使用的密钥（请自行生成并妥善保管）

示例（不要直接复制生产环境真实密码/密钥）：

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
AUTH_SECRET="your_auth_secret"
```

### 3) 初始化数据库（Prisma）

```bash
npx prisma migrate dev
npx prisma generate
```

### 4) 创建/重置管理员账号

后台登录使用 Credentials 模式，账号字段名为 `email`，但可以直接使用 `admin` 这类非邮箱格式作为“用户名”（存储在 User.email 字段中）。

你可以直接在数据库里插入一条用户记录，或运行脚本重置管理员账号：

```bash
npx ts-node prisma/reset-admin.ts
```

默认脚本会创建/更新：

- 账号：admin
- 密码：password123

### （可选）导入示例数据

项目内提供了一些种子数据脚本（例如示例文章、Linux 文章集合）。你可以按需执行：

```bash
npx ts-node prisma/seed.ts
# 或
npx ts-node prisma/seed-linux.ts
```

### 5) 启动开发服务器

```bash
npm run dev
```

浏览器打开：

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin/dashboard
- 登录页：http://localhost:3000/login

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产启动
npm run start

# 代码检查
npm run lint
```

## 目录结构（节选）

```
src/
  app/
    page.tsx                  # 首页
    posts/[slug]/page.tsx     # 文章详情（含评论区）
    admin/                    # 后台（仪表盘/文章/分类/评论/媒体/设置/资料）
    api/upload/route.ts       # 图片上传接口（保存到 public/uploads）
  components/                 # UI 与业务组件
prisma/
  schema.prisma               # 数据模型（Post/Category/Tag/Comment/SiteConfig 等）
  migrations/                 # 迁移文件
  reset-admin.ts              # 管理员重置脚本
public/
  uploads/                    # 上传图片存放目录
```

## 使用说明

### 评论系统

- 文章详情页底部可发布评论（昵称必填，邮箱可选）
- 后台「评论管理」可查看与删除评论

### 图片上传与媒体库

- 编辑文章时可上传图片（接口：`/api/upload`），文件会落到 `public/uploads`
- 后台「媒体库」可浏览、复制链接、删除图片

### 站点配置

后台「系统设置」支持：

- 博客名称、简介
- GitHub/Twitter/Email 链接
- 首页背景图（每行一个图片 URL）

## 注意事项

- 本项目的登录密码目前为明文比对，适合本地/演示环境；如用于生产环境，请改为哈希存储并在鉴权处使用安全的密码校验方案。
- `public/uploads` 目录用于存放上传图片，部署到无持久化磁盘的环境时需要额外处理（如对象存储）。
- 若你修改了 Prisma 模型或遇到类型不一致问题，优先执行 `npx prisma generate` 重新生成客户端。
- 如果上传接口报错，检查 `public/uploads` 目录是否存在且具备写入权限。
