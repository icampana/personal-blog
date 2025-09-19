#!/usr/bin/env node

/**
 * Performance analysis script
 * Analyzes build output for performance optimization opportunities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '../src');

/**
 * Performance metrics
 */
const performanceMetrics = {
  bundleSize: { total: 0, js: 0, css: 0, images: 0, other: 0 },
  fileCount: { total: 0, js: 0, css: 0, html: 0, images: 0, other: 0 },
  largeFiles: [],
  duplicateAssets: [],
  unusedAssets: [],
  compressionOpportunities: []
};

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type from extension
 */
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (['.js', '.mjs', '.ts'].includes(ext)) return 'js';
  if (['.css', '.scss', '.sass'].includes(ext)) return 'css';
  if (['.html', '.htm'].includes(ext)) return 'html';
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) return 'images';

  return 'other';
}

/**
 * Analyze bundle sizes
 */
async function analyzeBundleSizes() {
  console.log('📊 Analyzing bundle sizes...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.log('❌ Build directory not found. Run build first.');
    return;
  }

  const files = await glob('**/*', { cwd: DIST_DIR, nodir: true });

  for (const file of files) {
    const filePath = path.join(DIST_DIR, file);
    const size = getFileSize(filePath);
    const type = getFileType(file);

    performanceMetrics.bundleSize.total += size;
    performanceMetrics.bundleSize[type] += size;
    performanceMetrics.fileCount.total++;
    performanceMetrics.fileCount[type]++;

    // Track large files (>500KB)
    if (size > 500 * 1024) {
      performanceMetrics.largeFiles.push({
        file,
        size,
        type,
        sizeFormatted: formatBytes(size)
      });
    }

    // Track compression opportunities (uncompressed text files >10KB)
    if (['js', 'css', 'html'].includes(type) && size > 10 * 1024) {
      performanceMetrics.compressionOpportunities.push({
        file,
        size,
        type,
        sizeFormatted: formatBytes(size),
        potentialSavings: Math.round(size * 0.7) // Estimate 70% compression
      });
    }
  }

  // Display bundle size analysis
  console.log('Bundle Size Analysis:');
  console.log(`  Total: ${formatBytes(performanceMetrics.bundleSize.total)}`);
  console.log(`  JavaScript: ${formatBytes(performanceMetrics.bundleSize.js)}`);
  console.log(`  CSS: ${formatBytes(performanceMetrics.bundleSize.css)}`);
  console.log(`  Images: ${formatBytes(performanceMetrics.bundleSize.images)}`);
  console.log(`  HTML: ${formatBytes(performanceMetrics.bundleSize.html)}`);
  console.log(`  Other: ${formatBytes(performanceMetrics.bundleSize.other)}`);

  console.log('\nFile Count Analysis:');
  console.log(`  Total: ${performanceMetrics.fileCount.total}`);
  console.log(`  JavaScript: ${performanceMetrics.fileCount.js}`);
  console.log(`  CSS: ${performanceMetrics.fileCount.css}`);
  console.log(`  Images: ${performanceMetrics.fileCount.images}`);
  console.log(`  HTML: ${performanceMetrics.fileCount.html}`);
  console.log(`  Other: ${performanceMetrics.fileCount.other}`);
}

/**
 * Analyze large files
 */
function analyzeLargeFiles() {
  if (performanceMetrics.largeFiles.length === 0) {
    console.log('\n✅ No large files found (>500KB)');
    return;
  }

  console.log('\n⚠️  Large Files (>500KB):');
  performanceMetrics.largeFiles
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(file => {
      console.log(`  ${file.sizeFormatted} - ${file.file}`);
    });

  if (performanceMetrics.largeFiles.length > 10) {
    console.log(`  ... and ${performanceMetrics.largeFiles.length - 10} more`);
  }
}

/**
 * Analyze compression opportunities
 */
function analyzeCompressionOpportunities() {
  if (performanceMetrics.compressionOpportunities.length === 0) {
    console.log('\n✅ No significant compression opportunities found');
    return;
  }

  console.log('\n💡 Compression Opportunities (>10KB text files):');

  const totalSavings = performanceMetrics.compressionOpportunities
    .reduce((sum, file) => sum + file.potentialSavings, 0);

  console.log(`  Potential savings: ${formatBytes(totalSavings)}`);

  performanceMetrics.compressionOpportunities
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
    .forEach(file => {
      console.log(`  ${file.sizeFormatted} → ~${formatBytes(file.size - file.potentialSavings)} - ${file.file}`);
    });
}

/**
 * Analyze Astro-specific optimizations
 */
async function analyzeAstroOptimizations() {
  console.log('\n🚀 Astro-Specific Optimizations:\n');

  // Check for _astro directory (Astro's optimized assets)
  const astroDir = path.join(DIST_DIR, '_astro');
  if (fs.existsSync(astroDir)) {
    const astroFiles = await glob('**/*', { cwd: astroDir, nodir: true });
    const astroSize = astroFiles.reduce((sum, file) => {
      return sum + getFileSize(path.join(astroDir, file));
    }, 0);

    console.log(`✅ Astro optimized assets: ${astroFiles.length} files, ${formatBytes(astroSize)}`);
  }

  // Check for static assets
  const staticAssets = await glob('**/*.{js,css,png,jpg,jpeg,gif,webp,svg}', { cwd: DIST_DIR });
  const hashedAssets = staticAssets.filter(file => /\.[a-f0-9]{8,}\./i.test(file));

  console.log(`✅ Hashed assets for caching: ${hashedAssets.length}/${staticAssets.length}`);

  // Check for HTML files (SSG)
  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR });
  console.log(`✅ Pre-rendered HTML pages: ${htmlFiles.length}`);

  // Check for sitemap and RSS
  const hasSitemap = fs.existsSync(path.join(DIST_DIR, 'sitemap-index.xml'));
  const hasRSS = fs.existsSync(path.join(DIST_DIR, 'rss.xml'));

  console.log(`✅ Sitemap generated: ${hasSitemap ? 'Yes' : 'No'}`);
  console.log(`✅ RSS feed generated: ${hasRSS ? 'Yes' : 'No'}`);
}

/**
 * Check for performance best practices
 */
async function checkPerformanceBestPractices() {
  console.log('\n🎯 Performance Best Practices Check:\n');

  const checks = [];

  // Check bundle size
  const totalSizeMB = performanceMetrics.bundleSize.total / (1024 * 1024);
  if (totalSizeMB < 5) {
    checks.push('✅ Total bundle size is reasonable (<5MB)');
  } else if (totalSizeMB < 10) {
    checks.push('⚠️  Total bundle size is moderate (5-10MB)');
  } else {
    checks.push('❌ Total bundle size is large (>10MB)');
  }

  // Check JavaScript size
  const jsSizeMB = performanceMetrics.bundleSize.js / (1024 * 1024);
  if (jsSizeMB < 1) {
    checks.push('✅ JavaScript bundle size is good (<1MB)');
  } else if (jsSizeMB < 2) {
    checks.push('⚠️  JavaScript bundle size is moderate (1-2MB)');
  } else {
    checks.push('❌ JavaScript bundle size is large (>2MB)');
  }

  // Check CSS size
  const cssSizeMB = performanceMetrics.bundleSize.css / (1024 * 1024);
  if (cssSizeMB < 0.5) {
    checks.push('✅ CSS bundle size is good (<500KB)');
  } else if (cssSizeMB < 1) {
    checks.push('⚠️  CSS bundle size is moderate (500KB-1MB)');
  } else {
    checks.push('❌ CSS bundle size is large (>1MB)');
  }

  // Check image optimization
  const imagesSizeMB = performanceMetrics.bundleSize.images / (1024 * 1024);
  if (imagesSizeMB < 2) {
    checks.push('✅ Image assets size is reasonable (<2MB)');
  } else if (imagesSizeMB < 5) {
    checks.push('⚠️  Image assets size is moderate (2-5MB)');
  } else {
    checks.push('❌ Image assets size is large (>5MB) - consider optimization');
  }

  // Check file count
  if (performanceMetrics.fileCount.total < 100) {
    checks.push('✅ File count is reasonable (<100 files)');
  } else if (performanceMetrics.fileCount.total < 200) {
    checks.push('⚠️  File count is moderate (100-200 files)');
  } else {
    checks.push('❌ File count is high (>200 files) - consider bundling');
  }

  checks.forEach(check => console.log(check));
}

/**
 * Generate performance recommendations
 */
function generateRecommendations() {
  console.log('\n💡 Performance Recommendations:\n');

  const recommendations = [];

  // Bundle size recommendations
  if (performanceMetrics.bundleSize.total > 10 * 1024 * 1024) {
    recommendations.push('🔧 Consider code splitting and lazy loading for large bundles');
  }

  if (performanceMetrics.bundleSize.js > 2 * 1024 * 1024) {
    recommendations.push('🔧 Optimize JavaScript bundle with tree shaking and minification');
  }

  if (performanceMetrics.bundleSize.images > 5 * 1024 * 1024) {
    recommendations.push('🔧 Optimize images with WebP format and responsive sizing');
  }

  // Large files recommendations
  if (performanceMetrics.largeFiles.length > 0) {
    recommendations.push('🔧 Review large files and consider splitting or optimization');
  }

  // Compression recommendations
  if (performanceMetrics.compressionOpportunities.length > 0) {
    recommendations.push('🔧 Enable gzip/brotli compression for text assets');
  }

  // General recommendations
  recommendations.push('🔧 Use CDN for static asset delivery');
  recommendations.push('🔧 Implement proper caching headers');
  recommendations.push('🔧 Consider preloading critical resources');
  recommendations.push('🔧 Optimize font loading with font-display: swap');
  recommendations.push('🔧 Use service worker for offline functionality');

  if (recommendations.length === 0) {
    console.log('✅ No specific recommendations - performance looks good!');
  } else {
    recommendations.forEach(rec => console.log(rec));
  }
}

/**
 * Main analysis function
 */
async function main() {
  console.log('🔍 Performance Analysis Starting...\n');

  await analyzeBundleSizes();
  analyzeLargeFiles();
  analyzeCompressionOpportunities();
  await analyzeAstroOptimizations();
  await checkPerformanceBestPractices();
  generateRecommendations();

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 PERFORMANCE ANALYSIS SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Bundle Size: ${formatBytes(performanceMetrics.bundleSize.total)}`);
  console.log(`Total Files: ${performanceMetrics.fileCount.total}`);
  console.log(`Large Files: ${performanceMetrics.largeFiles.length}`);
  console.log(`Compression Opportunities: ${performanceMetrics.compressionOpportunities.length}`);
  console.log('='.repeat(50));

  const totalSizeMB = performanceMetrics.bundleSize.total / (1024 * 1024);
  if (totalSizeMB < 5 && performanceMetrics.largeFiles.length < 5) {
    console.log('\n✅ Performance analysis looks good! 🎉');
  } else if (totalSizeMB < 10 && performanceMetrics.largeFiles.length < 10) {
    console.log('\n⚠️  Performance is acceptable but could be improved');
  } else {
    console.log('\n❌ Performance needs optimization');
  }
}

main().catch(console.error);