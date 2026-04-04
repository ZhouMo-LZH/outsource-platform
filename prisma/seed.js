const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('管理员账号创建成功:', admin.username)

  const services = [
    {
      name: 'OpenClash部署',
      description: '专业部署OpenClash，稳定高速，一键配置，支持多设备',
      price: 99,
      category: '网络服务',
    },
    {
      name: '毕设代做',
      description: '本科/研究生毕业设计，全程指导，包过答辩，提供源码和文档',
      price: 999,
      category: '教育服务',
    },
    {
      name: '网站设计',
      description: '企业官网、电商平台、个人博客定制开发，响应式设计',
      price: 1999,
      category: '开发服务',
    },
    {
      name: 'APP开发',
      description: 'iOS/Android原生开发，跨平台开发，小程序开发',
      price: 2999,
      category: '开发服务',
    },
    {
      name: '数据分析',
      description: '数据采集、数据清洗、数据可视化、报告撰写',
      price: 599,
      category: '数据服务',
    },
    {
      name: '系统运维',
      description: '服务器部署、性能优化、安全加固、持续维护',
      price: 399,
      category: '运维服务',
    },
  ]

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name }
    })

    if (!existing) {
      await prisma.service.create({
        data: service
      })
    }
  }

  console.log('服务数据创建成功，共', services.length, '项服务')
  console.log('数据初始化完成！')
  console.log('管理员账号: admin')
  console.log('管理员密码: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
