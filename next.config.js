/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'i.ytimg.com'],
  },
};

module.exports = nextConfig;
