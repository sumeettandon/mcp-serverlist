/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true // Required for static export
  },
  // Strict mode for better development
  reactStrictMode: true,
  // Specify allowed domains for images if needed
  images: {
    domains: ['static.modelcontextprotocol.io'],
  }
}

module.exports = nextConfig