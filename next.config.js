/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      // Posts that came from the Gatsby format.
      {
        source: '/:slug(\\d{4}\-\\d{2}-\\d{2}-[a-zA-Z\-]{1,})',
        destination: '/posts/:slug',
        permanent: true
      },
      // Old Posts that came from Blogger / Wordpress
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:slug([a-zA-Z\-]{1,})',
        destination: '/posts/:year/:month/:slug',
        permanent: true
      }
    ]
  }
}

module.exports = withContentlayer(nextConfig);
