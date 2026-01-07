# 个人博客数据库设计文档 (MySQL)

## 1. 概览
本设计基于 MySQL 数据库，使用 Prisma ORM 进行定义。
核心包含内容管理（文章、分类、标签）、用户系统（管理员）、以及基础的访问统计。

## 2. 表结构详细设计

### 2.1 User (管理员用户)
存储博主的登录信息和个人资料。

| 字段名 | 类型 | 必填 | 唯一 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INT | 是 | 是 | 主键，自增 |
| email | VARCHAR(191) | 是 | 是 | 登录邮箱 |
| password | VARCHAR(255) | 是 | - | 加密后的密码 (BCrypt) |
| name | VARCHAR(100) | 否 | - | 显示昵称 |
| avatar | VARCHAR(255) | 否 | - | 头像 URL |
| bio | TEXT | 否 | - | 个人简介 (Markdown 格式) |
| createdAt | DATETIME | 是 | - | 创建时间 |

### 2.2 Post (文章)
博客的核心内容表。

| 字段名 | 类型 | 必填 | 唯一 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INT | 是 | 是 | 主键，自增 |
| title | VARCHAR(255) | 是 | - | 文章标题 |
| slug | VARCHAR(191) | 是 | 是 | URL 友好的路径 (如 `hello-world`) |
| content | LONGTEXT | 否 | - | 文章正文 (Markdown/MDX) |
| excerpt | TEXT | 否 | - | 文章摘要 (用于列表页展示) |
| coverImage | VARCHAR(255) | 否 | - | 封面图 URL |
| published | BOOLEAN | 是 | - | 状态: `false`=草稿, `true`=已发布 |
| viewCount | INT | 是 | - | 阅读量 (默认为 0) |
| categoryId | INT | 否 | - | 外键 -> Category 表 |
| createdAt | DATETIME | 是 | - | 创建时间 |
| updatedAt | DATETIME | 是 | - | 更新时间 |

### 2.3 Category (分类)
文章的分类，通常是一对多关系（一篇文章属于一个分类）。

| 字段名 | 类型 | 必填 | 唯一 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INT | 是 | 是 | 主键，自增 |
| name | VARCHAR(50) | 是 | 是 | 分类名 (如 "前端开发") |
| slug | VARCHAR(50) | 是 | 是 | URL 路径 (如 `frontend`) |

### 2.4 Tag (标签)
文章的标签，多对多关系（一篇文章可以有多个标签）。

| 字段名 | 类型 | 必填 | 唯一 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INT | 是 | 是 | 主键，自增 |
| name | VARCHAR(50) | 是 | 是 | 标签名 (如 "React", "Next.js") |
| slug | VARCHAR(50) | 是 | 是 | URL 路径 |

### 2.5 DailyStat (每日统计)
用于后台 Dashboard 的轻量级数据分析，无需依赖第三方。

| 字段名 | 类型 | 必填 | 唯一 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| id | INT | 是 | 是 | 主键，自增 |
| date | DATE | 是 | 是 | 统计日期 (如 2023-10-01) |
| views | INT | 是 | - | 当日总浏览量 (PV) |
| visitors | INT | 是 | - | 当日独立访客 (UV) |

---

## 3. Prisma Schema 定义 (Draft)

```prisma
// 这是一个 Prisma Schema 示例代码，可以直接复制到 schema.prisma 中

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  bio       String?  @db.Text
  createdAt DateTime @default(now())
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  content     String?   @db.LongText
  excerpt     String?   @db.Text
  coverImage  String?
  published   Boolean   @default(false)
  viewCount   Int       @default(0)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // 关系
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  Int?
  
  tags        Tag[]     // 隐式多对多关系
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[]
}

model DailyStat {
  id       Int      @id @default(autoincrement())
  date     DateTime @unique @db.Date // 每天只有一条记录
  views    Int      @default(0)
  visitors Int      @default(0)
}
```
