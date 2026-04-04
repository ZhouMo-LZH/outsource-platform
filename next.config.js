/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'outsource-platform.vercel.app', '*.netlify.app'],
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
