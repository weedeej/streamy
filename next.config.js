/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: process.env.IS_LOCAL ? "http://localhost:3000" : "https://sstreamy.vercel.app"
  },
  reactStrictMode: true,
}

module.exports = nextConfig
