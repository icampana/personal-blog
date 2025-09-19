import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Handle Gatsby format posts: /YYYY-MM-DD-slug -> /posts/YYYY-MM-DD-slug
  const gatsbyPostMatch = pathname.match(/^\/(\d{4}-\d{2}-\d{2}-[a-zA-Z0-9-]+)$/);
  if (gatsbyPostMatch) {
    return redirect(`/posts/${gatsbyPostMatch[1]}`, 301);
  }

  // Handle date-based URLs: /YYYY/MM -> /by-date/YYYY/MM
  const dateMatch = pathname.match(/^\/(\d{4})\/(\d{2})$/);
  if (dateMatch) {
    return redirect(`/by-date/${dateMatch[1]}/${dateMatch[2]}`, 301);
  }

  // Handle old Blogger/WordPress posts: /YYYY/MM/slug -> /posts/YYYY/MM/slug
  const bloggerPostMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/([a-zA-Z0-9-]+)$/);
  if (bloggerPostMatch) {
    return redirect(`/posts/${bloggerPostMatch[1]}/${bloggerPostMatch[2]}/${bloggerPostMatch[3]}`, 301);
  }

  // Handle old posts with formats: /YYYY/MM/slug.html or /YYYY/MM/slug/amp -> /posts/YYYY/MM/slug
  const formatPostMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/([a-zA-Z0-9-]+)(?:\.html|\/amp|\/feed)$/);
  if (formatPostMatch) {
    return redirect(`/posts/${formatPostMatch[1]}/${formatPostMatch[2]}/${formatPostMatch[3]}`, 301);
  }

  // Handle single digit pagination: /N -> /posts/page/N (for pages 1-99)
  const paginationMatch = pathname.match(/^\/(\d{1,2})$/);
  if (paginationMatch) {
    const pageNum = parseInt(paginationMatch[1], 10);
    if (pageNum >= 1 && pageNum <= 99) {
      return redirect(`/posts/page/${pageNum}`, 301);
    }
  }

  // Handle category redirects: /category/tag -> /tag/tag
  const categoryMatch = pathname.match(/^\/category\/([a-zA-Z0-9-]+)$/);
  if (categoryMatch) {
    return redirect(`/tag/${categoryMatch[1]}`, 301);
  }

  // Handle WordPress admin and other common WordPress URLs
  if (pathname.startsWith('/wp-admin') ||
      pathname.startsWith('/wp-content') ||
      pathname.startsWith('/wp-includes') ||
      pathname.includes('wp-login') ||
      pathname.includes('xmlrpc.php') ||
      pathname.includes('wp-config.php')) {
    return redirect('/', 301);
  }

  // Handle common bot/spam URLs
  const spamPatterns = [
    '/administrator',
    '/admin',
    '/phpmyadmin',
    '/mysql',
    '/database',
    '/.env',
    '/config',
    '/backup',
    '/test',
    '/demo',
    '/staging'
  ];

  if (spamPatterns.some(pattern => pathname.startsWith(pattern))) {
    return redirect('/', 301);
  }

  return next();
});