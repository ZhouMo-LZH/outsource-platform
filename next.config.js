/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'outsource-platform.vercel.app', '*.netlify.app'],
    unoptimized: true,
  },
  output: 'standalone',
  // 优化构建输出
  webpack: (config, { isServer }) => {
    // 禁用 source map 减小体积
    config.devtool = false;
    
    // 优化缓存
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    
    return config;
  },
  // 实验性功能：减小服务器包大小
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
