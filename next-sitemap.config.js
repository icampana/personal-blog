/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://ivan.campananaranjo.com',
    generateRobotsTxt: true, // (optional)
    // ...other options
    exclude: ['/search', '/admin', '/post/page/*', 'sitemap.xml'],
    generateIndexSitemap: false,
    // Default transformation function
    transform: async (config, path) => {
        return {
            loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        }
    },
  }