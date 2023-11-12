/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    gptKey: process.env.CHAT_GPT_KEY,
  },
  async headers() {
    return []
  },
}

module.exports = nextConfig
