import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const advancedLinuxPosts = [
  {
    title: 'Linux 性能分析之 CPU 篇：Load Average 与上下文切换',
    slug: 'linux-cpu-performance-analysis-load-average-context-switch',
    excerpt: '系统负载高就是 CPU 不行吗？本文深入剖析 Load Average 的本质，教你使用 vmstat、pidstat 和 perf 定位 CPU 性能瓶颈。',
    content: `
# Linux 性能分析之 CPU 篇

当系统变慢时，我们习惯输入 \`top\` 查看 Load Average。但你真的理解 Load Average 代表什么吗？

## 1. 什么是 Load Average？

Load Average 是指**单位时间内，处于可运行状态（Running / Runnable）和不可中断状态（Uninterruptible Sleep）的进程数平均值**。

- **可运行状态**：正在使用 CPU 或等待 CPU 调度的进程。
- **不可中断状态**：正处于内核态关键流程（如等待磁盘 I/O）的进程，状态显示为 \`D\`。

**误区**：Load Average 高不一定是 CPU 繁忙，也可能是磁盘 I/O 导致的。

## 2. 工具实战：vmstat

\`vmstat\` 是分析系统整体性能的神器。

\`\`\`bash
# 每秒输出一次
vmstat 1
\`\`\`

重点关注：
- **r (Running)**: 等待 CPU 的进程数。如果该值长期大于 CPU 核数，说明 CPU 不够用。
- **b (Blocked)**: 处于不可中断睡眠状态的进程数。如果该值高，说明 I/O 可能是瓶颈。
- **cs (Context Switch)**: 每秒上下文切换次数。过高会导致 CPU 浪费在调度上。

## 3. 深入定位：pidstat

如果发现 CPU 使用率高，如何找到是哪个进程，甚至哪个线程？

\`\`\`bash
# 查看进程 CPU 使用情况，-u 默认，5 秒刷新
pidstat -u 5 1

# 查看上下文切换情况
pidstat -w 5 1
\`\`\`

## 4. 终极武器：perf

找到高 CPU 进程后，如何知道它在执行什么函数？使用 \`perf\`。

\`\`\`bash
# 采样 30 秒，生成火焰图数据
perf record -F 99 -p <PID> -g -- sleep 30
\`\`\`

配合 Brendan Gregg 的 FlameGraph 工具，你可以直观地看到 CPU 热点函数。

## 总结

1. Load 高 != CPU 高，先区分是 CPU 密集型还是 I/O 密集型。
2. 使用 \`vmstat\` 看全局，\`pidstat\` 看进程。
3. 遇到疑难杂症，\`perf\` 火焰图是分析代码级瓶颈的最佳工具。
    `,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: '深入理解 Linux 内存管理：Buffer、Cache 与 Swap',
    slug: 'deep-dive-linux-memory-buffer-cache-swap',
    excerpt: 'free 命令显示的 free 内存很少就是内存泄露吗？深入理解 Linux 的内存回收机制，以及何时该调整 Swap 策略。',
    content: `
# 深入理解 Linux 内存管理

很多新手看到 \`free\` 命令显示的空闲内存很少时会感到恐慌，其实 Linux 的内存管理策略是："空闲内存即浪费"。

## 1. Buffer vs Cache

在 \`free -h\` 命令中，我们经常看到 \`buff/cache\` 占用很高。

- **Buffer (缓冲区)**: 这里的 Buffer 特指**磁盘块设备**的缓冲区。它缓存的是磁盘块的元数据和数据，优化磁盘 I/O。
- **Cache (页缓存)**: Page Cache，缓存的是**文件系统**的数据。你读取过的文件都会被缓存到这里。

**结论**：Buffer 和 Cache 都是可回收内存。当应用程序需要内存时，内核会自动回收它们。

## 2. OOM Killer (Out Of Memory)

当物理内存耗尽，且 Swap 也满了（或者没开 Swap），内核就会触发 OOM Killer。

它会根据 \`oom_score\` 挑选一个"最胖"且"最不重要"的进程杀掉，以释放内存。

可以通过 \`/proc/<pid>/oom_adj\` 调整进程的 OOM 权重，避免关键服务（如 SSHD）被误杀。

## 3. Swap 调优

Swap 是磁盘上的虚拟内存。

参数 \`vm.swappiness\` (0-100) 决定了内核使用 Swap 的积极程度。
- **0**: 尽量仅在物理内存耗尽时使用 Swap。
- **60**: 默认值。
- **100**: 极其积极地使用 Swap。

对于延迟敏感的应用（如 Redis、MySQL），建议将 \`swappiness\` 设置为 1 或 10，尽量避免发生 Swap 交换，因为磁盘 I/O 会严重拖慢性能。

\`\`\`bash
# 临时修改
sysctl vm.swappiness=10

# 永久修改
echo "vm.swappiness=10" >> /etc/sysctl.conf
\`\`\`
    `,
    coverImage: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Linux 内核参数调优指南：从网络栈到文件描述符',
    slug: 'linux-kernel-tuning-sysctl-guide',
    excerpt: '默认的 Linux 配置通常比较保守。针对高并发服务器，我们需要修改 sysctl.conf 来释放系统的潜能。',
    content: `
# Linux 内核参数调优指南

在生产环境中，默认的内核参数往往无法满足高并发需求。我们需要通过修改 \`/etc/sysctl.conf\` 来进行调优。

## 1. 文件描述符限制 (File Descriptors)

Linux 对打开文件数量有限制。对于 Nginx/Redis 等服务，默认的 1024 远远不够。

\`\`\`bash
# 查看当前限制
ulimit -n

# 永久修改 /etc/security/limits.conf
* soft nofile 65535
* hard nofile 65535
\`\`\`

## 2. TCP 连接队列

当并发连接请求过大时，TCP 队列可能会溢出。

\`\`\`ini
# 增加半连接队列 (SYN Queue) 长度
net.ipv4.tcp_max_syn_backlog = 8192

# 增加全连接队列 (Accept Queue) 长度
# 注意：这个值受限于 somaxconn
net.core.somaxconn = 8192
\`\`\`

## 3. TCP TIME_WAIT 优化

在高并发短连接场景下，会出现大量 TIME_WAIT 状态的连接，占用端口资源。

\`\`\`ini
# 开启 TCP 连接复用
net.ipv4.tcp_tw_reuse = 1

# 缩短 FIN_WAIT2 超时时间
net.ipv4.tcp_fin_timeout = 30

# 扩大本地端口范围
net.ipv4.ip_local_port_range = 1024 65000
\`\`\`

## 4. 生效配置

修改完配置文件后，别忘了执行：

\`\`\`bash
sysctl -p
\`\`\`

**警告**：内核参数调优需要根据实际业务场景进行，盲目照抄可能会导致网络不稳定。
    `,
    coverImage: 'https://images.unsplash.com/photo-1558494949-efc535b5c47c?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'LVM 逻辑卷管理实战：在线扩容与快照备份',
    slug: 'lvm-logical-volume-manager-resize-snapshot',
    excerpt: '硬盘空间满了怎么办？传统的磁盘分区难以调整，而 LVM 让磁盘管理变得像玩乐高一样灵活。',
    content: `
# LVM 逻辑卷管理实战

LVM (Logical Volume Manager) 提供了比传统分区更灵活的磁盘管理方式。

## 核心概念

1. **PV (Physical Volume)**: 物理卷，对应真实的硬盘分区 (如 /dev/sdb1)。
2. **VG (Volume Group)**: 卷组，由一个或多个 PV 组成的存储池。
3. **LV (Logical Volume)**: 逻辑卷，从 VG 中划分出来的虚拟分区，可以动态伸缩。

## 场景一：创建 LVM

\`\`\`bash
# 1. 创建 PV
pvcreate /dev/sdb /dev/sdc

# 2. 创建 VG (名为 data_vg)
vgcreate data_vg /dev/sdb /dev/sdc

# 3. 创建 LV (名为 web_data，大小 10G)
lvcreate -n web_data -L 10G data_vg

# 4. 格式化并挂载
mkfs.ext4 /dev/data_vg/web_data
mount /dev/data_vg/web_data /var/www
\`\`\`

## 场景二：在线扩容

当 /var/www 空间不足时，可以在不卸载的情况下扩容（假设 VG 还有空间）。

\`\`\`bash
# 1. 扩展 LV (+5G)
lvextend -L +5G /dev/data_vg/web_data

# 2. 在线调整文件系统大小 (ext4 使用 resize2fs, xfs 使用 xfs_growfs)
resize2fs /dev/data_vg/web_data
\`\`\`

## 场景三：LVM 快照

在进行危险操作前，可以创建一个快照，随时回滚。

\`\`\`bash
# 创建 1G 大小的快照
lvcreate -L 1G -s -n web_snap /dev/data_vg/web_data

# ... 进行操作 ...

# 如果搞砸了，恢复快照
lvconvert --merge /dev/data_vg/web_snap
\`\`\`
    `,
    coverImage: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Ansible 自动化运维：编写你的第一个 Playbook',
    slug: 'ansible-automation-playbook-guide',
    excerpt: '还在一台台 SSH 登录服务器执行命令？Ansible 无需 Agent，通过 SSH 即可实现成百上千台服务器的配置管理。',
    content: `
# Ansible 自动化运维

Ansible 是最流行的自动化运维工具之一，特点是 **Agentless**（无代理），只需 SSH 即可工作。

## 1. 安装与配置

\`\`\`bash
yum install ansible
\`\`\`

编辑 \`/etc/ansible/hosts\` 定义主机清单：

\`\`\`ini
[webservers]
192.168.1.10
192.168.1.11
\`\`\`

## 2. Ad-Hoc 命令

临时执行一条命令：

\`\`\`bash
# 检查所有服务器连通性
ansible all -m ping

# 在 webservers 组执行 uptime
ansible webservers -m command -a "uptime"
\`\`\`

## 3. Playbook 实战：部署 Nginx

Playbook 使用 YAML 格式描述"期望状态"。

创建一个 \`nginx.yml\`：

\`\`\`yaml
---
- name: Install and Start Nginx
  hosts: webservers
  become: yes  # 使用 sudo
  
  tasks:
    - name: Install Nginx package
      yum:
        name: nginx
        state: present

    - name: Copy config file
      copy:
        src: ./nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: Restart Nginx

    - name: Ensure Nginx is running
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: Restart Nginx
      service:
        name: nginx
        state: restarted
\`\`\`

执行 Playbook：

\`\`\`bash
ansible-playbook nginx.yml
\`\`\`

Ansible 的核心思想是**幂等性**：无论执行多少次，结果都是一致的。
    `,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Prometheus + Grafana：构建现代化监控告警体系',
    slug: 'prometheus-grafana-monitoring-stack',
    excerpt: '抛弃传统的 Zabbix，拥抱云原生时代的监控标准。本文教你搭建 Node Exporter + Prometheus + Grafana 监控大屏。',
    content: `
# Prometheus + Grafana 监控体系

在微服务和云原生时代，Prometheus 已经成为监控领域的事实标准。

## 架构简介

1. **Node Exporter**: 部署在被监控机器上，采集 CPU、内存、磁盘等指标。
2. **Prometheus**: 时序数据库，定期从 Exporter 拉取（Pull）数据。
3. **Grafana**: 数据可视化平台，展示 Prometheus 的数据。

## 1. 部署 Node Exporter

下载并运行二进制文件，默认监听 9100 端口。

\`\`\`bash
./node_exporter
\`\`\`

## 2. 配置 Prometheus

编辑 \`prometheus.yml\`：

\`\`\`yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100', '192.168.1.11:9100']
\`\`\`

## 3. PromQL 查询语言

Prometheus 强大的核心在于 PromQL。

例如，查询 CPU 使用率：

\`\`\`promql
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
\`\`\`

## 4. Grafana 大屏

在 Grafana 中添加 Prometheus 数据源，然后导入 ID 为 **1860** 的 Dashboard 模板（Node Exporter Full）。

瞬间，一个专业的服务器监控大屏就完成了！你还可以配置 Alertmanager 实现钉钉或邮件告警。
    `,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Linux 僵尸进程与 D 状态进程排查指南',
    slug: 'troubleshooting-zombie-and-uninterruptible-sleep-processes',
    excerpt: '系统负载飙升却找不到高 CPU 进程？可能是大量的 D 状态进程在作祟。本文详解进程状态及其处理方法。',
    content: `
# 进程状态排查指南

在 \`top\` 命令中，S 列代表进程状态。常见的有 R (Running), S (Sleep)。但有两个状态最令人头疼：Z 和 D。

## 1. 僵尸进程 (Zombie, Z)

**成因**：子进程结束了，但父进程没有调用 \`wait()\` 来回收它的资源（主要是 PID）。僵尸进程不占用内存和 CPU，但占用 PID。

**危害**：PID 耗尽，导致无法创建新进程。

**处理**：
- **杀不掉**：\`kill -9\` 对僵尸进程无效，因为它已经死了。
- **杀父进程**：找到它的父进程（PPID），杀掉父进程，僵尸进程会被 init (1号进程) 接管并回收。

\`\`\`bash
# 查找僵尸进程及其父进程
ps -A -o stat,ppid,pid,cmd | grep -e '^[Zz]'
\`\`\`

## 2. 不可中断睡眠 (Uninterruptible Sleep, D)

**成因**：进程正在等待硬件资源（通常是磁盘 I/O 或网络 NFS），在等待结束前无法响应任何信号（包括 kill -9）。

**现象**：Load Average 飙升，但 CPU 使用率不高。

**处理**：
1. 确定是哪个进程：\`ps -eo state,pid,cmd | grep "^D"\`
2. 确定在等什么：\`cat /proc/<pid>/stack\` 查看内核调用栈。
3. **解决方法**：通常是 I/O 故障（如 NFS 断连、磁盘坏道）。除了修复硬件或重启系统，通常无法强制杀死 D 状态进程。

遇到 D 状态，请重点检查存储系统。
    `,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Keepalived + Nginx 实现高可用负载均衡',
    slug: 'high-availability-load-balancing-keepalived-nginx',
    excerpt: '单点故障是生产环境的大忌。通过 Keepalived 实现 VIP 漂移，打造永远在线的 Web 服务集群。',
    content: `
# Keepalived + Nginx 高可用实战

在生产环境中，Nginx 作为入口网关，一旦宕机，整个服务不可用。我们需要 Keepalived 实现双机热备。

## 原理：VRRP 协议

Keepalived 基于 VRRP (虚拟路由冗余协议)。
- **Master**: 持有 VIP (Virtual IP)，处理请求。
- **Backup**: 监听 Master 心跳。当 Master 挂掉，Backup 在几秒内接管 VIP。

## 配置 Keepalived

**Master 配置 (/etc/keepalived/keepalived.conf)**:

\`\`\`conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100        # 优先级高
    advert_int 1
    
    # 虚拟 IP
    virtual_ipaddress {
        192.168.1.200
    }
    
    # 健康检查脚本
    track_script {
        check_nginx
    }
}
\`\`\`

**Backup 配置**:
只需要将 \`state\` 改为 \`BACKUP\`，\`priority\` 改为 \`90\`。

## Nginx 存活检测

我们需要编写一个脚本检测 Nginx 是否活着，如果 Nginx 挂了且重启失败，应停止 Keepalived 以便 VIP 漂移。

\`\`\`bash
#!/bin/bash
if ! pidof nginx > /dev/null; then
    systemctl stop keepalived
fi
\`\`\`

这样，我们就得到了一个高可用的负载均衡入口。
    `,
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'Linux 软 RAID 实战：mdadm 配置与故障恢复',
    slug: 'linux-software-raid-mdadm-guide',
    excerpt: '没有硬件 RAID 卡？没关系。Linux 内核自带的 mdadm 工具可以让你用普通硬盘组建 RAID 1, 5, 10，兼顾速度与安全。',
    content: `
# Linux 软 RAID 实战 (mdadm)

RAID (独立磁盘冗余阵列) 可以提高 I/O 性能和数据安全性。

## 常见 RAID 级别

- **RAID 0**: 条带化，性能最高，无冗余，一块坏全丢。
- **RAID 1**: 镜像，数据安全，空间利用率 50%。
- **RAID 5**: 奇偶校验，允许坏一块盘，读性能好，写性能略差。
- **RAID 10**: RAID 1 + RAID 0，兼顾速度和安全，成本高。

## 创建 RAID 5

假设有 3 块盘：/dev/sdb, /dev/sdc, /dev/sdd。

\`\`\`bash
# 创建 RAID 5 设备 /dev/md0
mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd

# 查看同步进度
cat /proc/mdstat

# 格式化并挂载
mkfs.ext4 /dev/md0
mount /dev/md0 /mnt/raid
\`\`\`

## 模拟故障与恢复

\`\`\`bash
# 1. 模拟 /dev/sdb 损坏
mdadm /dev/md0 --fail /dev/sdb

# 2. 移除坏盘
mdadm /dev/md0 --remove /dev/sdb

# 3. 插入新盘 (假设是 /dev/sde)
mdadm /dev/md0 --add /dev/sde
\`\`\`

系统会自动开始**数据重建 (Resync)**。软 RAID 是低成本服务器数据保护的好帮手。
    `,
    coverImage: 'https://images.unsplash.com/photo-1531297461136-82lw9z1p1j8d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    title: 'iptables 与 firewalld 防火墙深度配置',
    slug: 'iptables-firewalld-deep-dive',
    excerpt: '只会开关防火墙是不够的。本文深入 Netfilter 框架，讲解 iptables 的四表五链、NAT 转发以及 firewalld 的富规则配置。',
    content: `
# iptables 与 firewalld 深度配置

防火墙是 Linux 安全的第一道防线。

## 1. iptables 原理：四表五链

最常用的是 **filter 表**（过滤）和 **nat 表**（地址转换）。

**五链**：PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING。

## 2. iptables 常用操作

\`\`\`bash
# 查看规则
iptables -L -n -v

# 允许 80 端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# 拒绝特定 IP
iptables -A INPUT -s 1.2.3.4 -j DROP

# NAT 端口转发 (将本机 8080 转发到内网 192.168.1.5:80)
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.5:80
iptables -t nat -A POSTROUTING -j MASQUERADE
\`\`\`

## 3. firewalld (CentOS 7+)

firewalld 是 iptables 的前端，引入了 **Zone (区域)** 的概念。

\`\`\`bash
# 开放端口 (永久)
firewall-cmd --permanent --add-port=80/tcp

# 富规则 (Rich Rules)：只允许 192.168.1.0/24 访问 SSH
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept'

# 重新加载
firewall-cmd --reload
\`\`\`

Firewalld 配置动态生效，不易断网，推荐在现代系统中使用。
    `,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80',
  }
]

async function main() {
  console.log('Start seeding Advanced Linux posts...')

  // 确保 "Linux" 分类存在
  const category = await prisma.category.upsert({
    where: { slug: 'linux' },
    update: {},
    create: {
      name: 'Linux',
      slug: 'linux',
    },
  })

  // 插入文章
  for (const post of advancedLinuxPosts) {
    // 随机生成 500-2000 的阅读量，进阶文章可能看的人少但更有价值，这里我们假设它很火
    const randomViews = Math.floor(Math.random() * 1500) + 500
    
    // 随机生成最近 60 天内的发布时间
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60))

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
    console.log(`Created advanced post: ${post.title}`)
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
