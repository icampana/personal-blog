#!/usr/bin/env node

/**
 * Build verification script
 * Verifies that the build output is correct and all required files are present
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Check if a file or directory exists
 */
function exists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  if (!exists(filePath)) return 0;
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

/**
 * Get directory size recursively
 */
function getDirectorySizeKB(dirPath) {
  if (!exists(dirPath)) return 0;

  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySizeKB(fullPath);
    } else {
      totalSize += getFileSizeKB(fullPath);
    }
  }

  return totalSize;
}

/**
 * Verify required files exist
 */
function verifyRequiredFiles() {
  console.log('🔍 Verifying required files...\n');

  const requiredFiles = [
    'index.html',
    'search-index.json',
    'search-posts.json',
    'rss.xml',
    'sitemap-index.xml',
    '404.html',
  ];

  const missingFiles = [];

  for (const file of requiredFiles) {
    const filePath = path.join(DIST_DIR, file);
    if (exists(filePath)) {
      const sizeKB = getFileSizeKB(filePath);
      console.log(`✅ ${file} - ${sizeKB} KB`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  }

  return missingFiles;
}

/**
 * Verify search index integrity
 */
function verifySearchIndex() {
  console.log('\n🔍 Verifying search index...\n');

  const searchIndexPath = path.join(DIST_DIR, 'search-index.json');
  const searchPostsPath = path.join(DIST_DIR, 'search-posts.json');

  if (!exists(searchIndexPath)) {
    console.log('❌ Search index missing');
    return false;
  }

  if (!exists(searchPostsPath)) {
    console.log('❌ Search posts index missing');
    return false;
  }

  try {
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    const searchPosts = JSON.parse(fs.readFileSync(searchPostsPath, 'utf8'));

    console.log(`✅ Search index: ${searchIndex.length} items`);
    console.log(`✅ Search posts: ${searchPosts.length} items`);

    // Verify search index structure
    if (searchIndex.length > 0) {
      const firstItem = searchIndex[0];
      const requiredFields = ['title', 'content', 'url', 'tags', 'date'];

      for (const field of requiredFields) {
        if (!firstItem.hasOwnProperty(field)) {
          console.log(`❌ Search index missing field: ${field}`);
          return false;
        }
      }

      console.log('✅ Search index structure valid');
    }

    return true;
  } catch (error) {
    console.log(`❌ Search index parsing error: ${error.message}`);
    return false;
  }
}

/**
 * Verify sitemap
 */
function verifySitemap() {
  console.log('\n🔍 Verifying sitemap...\n');

  const sitemapPath = path.join(DIST_DIR, 'sitemap-index.xml');

  if (!exists(sitemapPath)) {
    console.log('❌ Sitemap missing');
    return false;
  }

  try {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    // Basic XML validation
    if (
      !sitemapContent.includes('<?xml') ||
      !sitemapContent.includes('<sitemapindex')
    ) {
      console.log('❌ Sitemap format invalid');
      return false;
    }

    // Count sitemap entries
    const sitemapCount = (sitemapContent.match(/<sitemap>/g) || []).length;
    console.log(`✅ Sitemap: ${sitemapCount} sitemaps`);

    return true;
  } catch (error) {
    console.log(`❌ Sitemap parsing error: ${error.message}`);
    return false;
  }
}

/**
 * Verify RSS feed
 */
function verifyRSSFeed() {
  console.log('\n🔍 Verifying RSS feed...\n');

  const rssPath = path.join(DIST_DIR, 'rss.xml');

  if (!exists(rssPath)) {
    console.log('❌ RSS feed missing');
    return false;
  }

  try {
    const rssContent = fs.readFileSync(rssPath, 'utf8');

    // Basic RSS validation
    if (!rssContent.includes('<?xml') || !rssContent.includes('<rss')) {
      console.log('❌ RSS feed format invalid');
      return false;
    }

    // Count RSS items
    const itemCount = (rssContent.match(/<item>/g) || []).length;
    console.log(`✅ RSS feed: ${itemCount} items`);

    return true;
  } catch (error) {
    console.log(`❌ RSS feed parsing error: ${error.message}`);
    return false;
  }
}

/**
 * Verify build size and performance
 */
function verifyBuildSize() {
  console.log('\n📊 Build size analysis...\n');

  const totalSize = getDirectorySizeKB(DIST_DIR);
  console.log(
    `📦 Total build size: ${totalSize} KB (${Math.round(totalSize / 1024)} MB)`,
  );

  // Check individual directories
  const directories = ['_astro', 'assets', 'images', 'photos'];

  for (const dir of directories) {
    const dirPath = path.join(DIST_DIR, dir);
    if (exists(dirPath)) {
      const dirSize = getDirectorySizeKB(dirPath);
      console.log(`📁 ${dir}: ${dirSize} KB`);
    }
  }

  // Warn if build is too large
  if (totalSize > 50000) {
    // 50MB
    console.log('⚠️  Build size is quite large (>50MB)');
  } else {
    console.log('✅ Build size is reasonable');
  }

  return true;
}

/**
 * Verify critical pages exist
 */
function verifyCriticalPages() {
  console.log('\n🔍 Verifying critical pages...\n');

  const criticalPages = [
    'index.html',
    '404.html',
    'search/index.html',
    'posts/index.html',
    'portafolio/index.html',
  ];

  const missingPages = [];

  for (const page of criticalPages) {
    const pagePath = path.join(DIST_DIR, page);
    if (exists(pagePath)) {
      const sizeKB = getFileSizeKB(pagePath);
      console.log(`✅ ${page} - ${sizeKB} KB`);
    } else {
      console.log(`❌ ${page} - MISSING`);
      missingPages.push(page);
    }
  }

  return missingPages;
}

/**
 * Main verification function
 */
function main() {
  console.log('🚀 Build Verification Starting...\n');

  if (!exists(DIST_DIR)) {
    console.log('❌ Build directory not found. Run build first.');
    process.exit(1);
  }

  let hasErrors = false;

  // Run all verifications
  const missingFiles = verifyRequiredFiles();
  const searchIndexValid = verifySearchIndex();
  const sitemapValid = verifySitemap();
  const rssValid = verifyRSSFeed();
  const missingPages = verifyCriticalPages();
  verifyBuildSize();

  // Check for errors
  if (missingFiles.length > 0) {
    console.log(`\n❌ Missing required files: ${missingFiles.join(', ')}`);
    hasErrors = true;
  }

  if (missingPages.length > 0) {
    console.log(`\n❌ Missing critical pages: ${missingPages.join(', ')}`);
    hasErrors = true;
  }

  if (!searchIndexValid || !sitemapValid || !rssValid) {
    hasErrors = true;
  }

  // Final result
  if (hasErrors) {
    console.log('\n❌ Build verification failed!');
    process.exit(1);
  } else {
    console.log('\n✅ Build verification passed! 🎉');
    console.log('\n🚀 Ready for deployment!');
  }
}

main();
