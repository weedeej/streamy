/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    IS_LOCAL: process.env.IS_LOCAL
  },
  reactStrictMode: true,
}

module.exports = nextConfig
