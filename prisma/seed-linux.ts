import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const linuxPosts = [
  {
    title: 'Linux 文件权限详解：chmod 与 chown 的艺术',
    slug: 'linux-file-permissions-chmod-chown',
    excerpt: '深入理解 Linux 文件权限系统，掌握 chmod、chown 命令的使用，以及特殊权限位 SUID、SGID 和 Sticky Bit 的奥秘。',
    content: `
# Linux 文件权限详解

在 Linux 系统中，文件权限是安全模型的核心。理解并正确管理文件权限，对于系统管理员和开发者来说至关重要。

## 基本权限：r, w, x

每个文件都有三组权限，分别对应：
- **User (u)**: 文件所有者
- **Group (g)**: 文件所属组
- **Others (o)**: 其他人

权限字符含义：
- **r (read)**: 读权限，数字表示为 4
- **w (write)**: 写权限，数字表示为 2
- **x (execute)**: 执行权限，数字表示为 1

## 使用 chmod 修改权限

\`chmod\` 命令用于修改文件权限。

\`\`\`bash
# 给所有者添加执行权限
chmod u+x script.sh

# 设置权限为 rwxr-xr-x (755)
chmod 755 script.sh
\`\`\`

## 使用 chown 修改所有者

\`chown\` 命令用于修改文件的所有者和所属组。

\`\`\`bash
# 将 owner 改为 duanyz
chown duanyz file.txt

# 将 owner 改为 duanyz，group 改为 developers
chown duanyz:developers file.txt
\`\`\`

## 特殊权限

除了 rwx，还有三个特殊权限：
1. **SUID (4)**: 运行时以文件所有者身份执行
2. **SGID (2)**: 运行时以文件所属组身份执行
3. **Sticky Bit (1)**: 只有目录所有者能删除文件

掌握这些，你就能自如地控制 Linux 文件系统了。
    `,
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80', // Linux terminal
  },
  {
    title: 'Vim 编辑器入门：从放弃到爱不释手',
    slug: 'vim-editor-guide-from-zero-to-hero',
    excerpt: 'Vim 被称为编辑器之神，虽然上手曲线陡峭，但一旦掌握，效率将成倍提升。本文带你快速入门 Vim 的核心操作。',
    content: `
# Vim 编辑器入门指南

"如何退出 Vim?" 可能是 Stack Overflow 上最著名的问题之一。今天我们不光要学会退出，还要学会如何高效编辑。

## 三种模式

Vim 的核心在于模式切换：
1. **Normal 模式**: 默认模式，用于移动光标、复制粘贴。按 \`Esc\` 进入。
2. **Insert 模式**: 用于输入文本。按 \`i\` 进入。
3. **Visual 模式**: 用于选择文本。按 \`v\` 进入。

## 必备快捷键

- **移动**: \`h\`(左) \`j\`(下) \`k\`(上) \`l\`(右)
- **保存退出**: \`:wq\`
- **强制退出**: \`:q!\`
- **撤销**: \`u\`
- **重做**: \`Ctrl + r\`

## 高级技巧

\`\`\`vim
" 在 .vimrc 中开启行号
set number
" 开启语法高亮
syntax on
\`\`\`

多加练习，你会发现手指在键盘上飞舞的感觉真棒。
    `,
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80', // Code editor
  },
  {
    title: 'Systemd 服务管理全攻略',
    slug: 'mastering-systemd-service-management',
    excerpt: 'Systemd 是现代 Linux 发行版的初始化系统。学会编写 .service 文件，让你的程序像系统服务一样稳定运行。',
    content: `
# Systemd 服务管理全攻略

Systemd 已经成为了绝大多数 Linux 发行版（如 Ubuntu, CentOS, Debian）的标准初始化系统。

## 常用命令 systemctl

\`\`\`bash
# 启动服务
systemctl start nginx

# 停止服务
systemctl stop nginx

# 重启服务
systemctl restart nginx

# 设置开机自启
systemctl enable nginx

# 查看服务状态
systemctl status nginx
\`\`\`

## 编写自定义服务

创建一个 \`/etc/systemd/system/myapp.service\` 文件：

\`\`\`ini
[Unit]
Description=My Custom Node.js App
After=network.target

[Service]
Type=simple
User=www-data
ExecStart=/usr/bin/node /var/www/app/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
\`\`\`

保存后，运行 \`systemctl daemon-reload\` 即可生效。
    `,
    coverImage: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80', // Server rack
  },
  {
    title: 'Linux 网络监控工具 Top 5',
    slug: 'top-5-linux-network-monitoring-tools',
    excerpt: '服务器网络卡顿？带宽被占满？快试试这 5 款强大的 Linux 网络监控工具，帮你快速定位问题。',
    content: `
# Linux 网络监控工具 Top 5

作为运维或后端开发，网络问题排查是家常便饭。这里推荐 5 个好用的工具。

## 1. iftop
实时显示带宽使用情况，类似 top 命令。
\`apt install iftop\`

## 2. netstat / ss
查看端口占用和网络连接状态。
\`ss -tuln\` (查看监听端口)

## 3. nload
简洁的图形化流量监控工具，显示当前上下行速度。

## 4. tcpdump
强大的抓包工具，用于深入分析数据包。
\`tcpdump -i eth0 port 80\`

## 5. ping / mtr
\`mtr\` 是 ping 和 traceroute 的结合体，能显示路由路径上的丢包率。

掌握这些工具，网络故障无处遁形。
    `,
    coverImage: 'https://images.unsplash.com/photo-1558494949-efc535b5c47c?auto=format&fit=crop&w=800&q=80', // Network cables
  },
  {
    title: 'Shell 脚本编程基础：自动化你的工作',
    slug: 'shell-scripting-basics-automate-workflow',
    excerpt: '别再重复敲命令了！学习 Shell 脚本编程，将重复性工作自动化，释放你的生产力。',
    content: `
# Shell 脚本编程基础

Shell 脚本是 Linux 自动化的基石。

## Hello World

创建一个 \`hello.sh\`：

\`\`\`bash
#!/bin/bash
echo "Hello, World!"
name="Linux"
echo "I love $name"
\`\`\`

记得加执行权限：\`chmod +x hello.sh\`。

## 流程控制

\`\`\`bash
# If 判断
if [ -f "/etc/hosts" ]; then
    echo "Hosts file exists"
fi

# For 循环
for i in {1..5}; do
    echo "Number: $i"
done
\`\`\`

## 实战：自动备份

\`\`\`bash
#!/bin/bash
tar -czf backup_$(date +%F).tar.gz /var/www/html
echo "Backup completed!"
\`\`\`

简单几行代码，就能省去每天手动的麻烦。
    `,
    coverImage: 'https://images.unsplash.com/photo-1607799275518-d580e11cc63b?auto=format&fit=crop&w=800&q=80', // Coding screen
  },
  {
    title: 'Linux 磁盘管理：分区、格式化与挂载',
    slug: 'linux-disk-management-partition-mount',
    excerpt: '新加的硬盘怎么用？本文详解 fdisk 分区、mkfs 格式化以及 mount 挂载的全流程操作。',
    content: `
# Linux 磁盘管理

在 Linux 中，一切皆文件，硬盘设备通常位于 \`/dev/sd*\`。

## 1. 查看磁盘
\`lsblk\` 或 \`fdisk -l\`

## 2. 分区 (fdisk)
\`fdisk /dev/sdb\`
- 输入 \`n\` 新建分区
- 输入 \`w\` 保存

## 3. 格式化 (mkfs)
\`mkfs.ext4 /dev/sdb1\`

## 4. 挂载 (mount)
\`\`\`bash
mkdir /data
mount /dev/sdb1 /data
\`\`\`

## 5. 开机自动挂载
编辑 \`/etc/fstab\`：
\`\`\`
/dev/sdb1  /data  ext4  defaults  0  0
\`\`\`

小心操作，数据无价！
    `,
    coverImage: 'https://images.unsplash.com/photo-1531297461136-82lw9z1p1j8d?auto=format&fit=crop&w=800&q=80', // Hard drive
  },
  {
    title: 'Docker 入门：30分钟上手容器化',
    slug: 'docker-crash-course-30-mins',
    excerpt: 'Docker 改变了软件交付的方式。本文带你快速了解镜像、容器、仓库的概念，并运行你的第一个 Nginx 容器。',
    content: `
# Docker 入门

Docker 让环境配置不再是噩梦。

## 核心概念
- **Image (镜像)**: 应用程序的打包，只读模板。
- **Container (容器)**: 镜像的运行实例。
- **Dockerfile**: 构建镜像的脚本。

## 常用命令

\`\`\`bash
# 拉取镜像
docker pull nginx

# 运行容器
docker run -d -p 80:80 --name my-web nginx

# 查看运行中的容器
docker ps

# 进入容器
docker exec -it my-web bash

# 停止容器
docker stop my-web
\`\`\`

## 编写 Dockerfile

\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
\`\`\`

就是这么简单！
    `,
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80', // Shipping containers
  },
  {
    title: 'Nginx 反向代理与负载均衡配置',
    slug: 'nginx-reverse-proxy-load-balancing',
    excerpt: 'Nginx 是高性能 Web 服务器的代表。本文介绍如何配置 Nginx 作为反向代理，以及如何实现简单的负载均衡。',
    content: `
# Nginx 配置指南

Nginx 不仅仅是 Web 服务器，更是强大的反向代理。

## 反向代理配置

\`\`\`nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

## 负载均衡

\`\`\`nginx
upstream backend {
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

默认采用轮询算法，简单高效。
    `,
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', // Server lights
  },
  {
    title: 'Linux 安全加固：保护你的服务器',
    slug: 'linux-server-security-hardening',
    excerpt: '服务器裸奔很危险！本文介绍 SSH 端口修改、防火墙配置、Fail2Ban 安装等基础安全加固措施。',
    content: `
# Linux 安全加固最佳实践

安全没有绝对，只有更安全。

## 1. 禁用 Root 远程登录
编辑 \`/etc/ssh/sshd_config\`：
\`PermitRootLogin no\`

## 2. 修改 SSH 端口
将默认的 22 端口改为其他（如 2222），减少扫描。

## 3. 配置防火墙 (UFW)
\`\`\`bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 2222/tcp
ufw enable
\`\`\`

## 4. 安装 Fail2Ban
自动封禁多次尝试登录失败的 IP。

## 5. 定期更新系统
\`apt update && apt upgrade\`

保持警惕，定期备份。
    `,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // Security lock
  },
  {
    title: 'SSH 密钥登录：告别密码，安全又便捷',
    slug: 'ssh-key-based-authentication-guide',
    excerpt: '还在每次输入密码登录服务器？配置 SSH 密钥对登录，不仅更安全，配合 Config 文件还能实现免密秒登。',
    content: `
# SSH 密钥登录配置

密码容易被暴力破解，密钥则安全得多。

## 1. 生成密钥对 (本地)
\`\`\`bash
ssh-keygen -t ed25519 -C "your@email.com"
\`\`\`

## 2. 上传公钥到服务器
\`\`\`bash
ssh-copy-id user@server_ip
\`\`\`

## 3. 配置 SSH Config (本地)
编辑 \`~/.ssh/config\`：

\`\`\`
Host myserver
    HostName 1.2.3.4
    User myuser
    IdentityFile ~/.ssh/id_ed25519
\`\`\`

现在，只需输入 \`ssh myserver\` 即可登录！
    `,
    coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80', // Key
  }
]

async function main() {
  console.log('Start seeding Linux posts...')

  // 1. 确保 "Linux" 分类存在
  const category = await prisma.category.upsert({
    where: { slug: 'linux' },
    update: {},
    create: {
      name: 'Linux',
      slug: 'linux',
    },
  })

  // 2. 插入文章
  for (const post of linuxPosts) {
    // 随机生成 100-1000 的阅读量，让数据看起来真实点
    const randomViews = Math.floor(Math.random() * 900) + 100
    
    // 随机生成最近 30 天内的发布时间
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        published: true,
        viewCount: randomViews,
        createdAt: randomDate,
        categoryId: category.id,
      },
    })
    console.log(`Created post: ${post.title}`)
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
