/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost', 'outsource-platform.vercel.app', '*.netlify.app'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年缓存
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 输出模式
  output: 'standalone',
  
  // 压缩配置
  compress: true,
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lucide-react', 'framer-motion', '@prisma/client'],
    
    // 服务器组件外部包
    serverComponentsExternalPackages: [],
  },
  
  // Webpack 配置
  webpack: (config, { isServer, dev }) => {
    // 生产环境优化
    if (!dev) {
      // 禁用 source map 减小体积
      config.devtool = false
      
      // 优化模块连接
      config.optimization.concatenateModules = true
    }
    
    // 客户端代码分割
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // 第三方库分离
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
            chunks: 'all',
          },
          
          // 框架核心
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          
          // UI 库
          ui: {
            test: /[\\/]node_modules[\\/](lucide|framer-motion)[\\/]/,
            name: 'ui-lib',
            priority: 15,
            reuseExistingChunk: true,
          },
          
          // 公共模块
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            chunks: 'all',
          },
        }
      }
      
      // CSS 分离
      config.optimization.minimizer?.forEach((minimizer) => {
        if (minimizer.constructor.name === 'CssMinimizerPlugin') {
          minimizer.options.test = /\.css(\?.*)?$/i
        }
      })
    }
    
    // 别名配置
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    
    return config
  },
  
  // 页面扩展名
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  
  // 头部配置（安全头）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          // 缓存控制
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API 路由不缓存
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      },
      {
        // 静态资源长期缓存
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // 上传的文件缓存
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400' // 24小时
          }
        ]
      }
    ]
  },
  
  // 重定向规则
  async redirects() {
    return []
  },
}

module.exports = nextConfig
