#!/usr/bin/env node

/**
 * Image optimization script for the Astro blog
 * This script can be used to compress and optimize existing images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PHOTOS_DIR = path.join(PUBLIC_DIR, 'photos');

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif'];

/**
 * Get all image files from a directory
 */
function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return [];
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  let imageFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Recursively get images from subdirectories
      imageFiles = imageFiles.concat(getImageFiles(fullPath));
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        imageFiles.push(fullPath);
      }
    }
  }

  return imageFiles;
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

/**
 * Analyze images in the project
 */
function analyzeImages() {
  console.log('🔍 Analyzing images in the project...\n');

  const imagesDirFiles = getImageFiles(IMAGES_DIR);
  const photosDirFiles = getImageFiles(PHOTOS_DIR);
  const allImages = [...imagesDirFiles, ...photosDirFiles];

  if (allImages.length === 0) {
    console.log('No images found in /public/images or /public/photos directories.');
    return;
  }

  console.log(`Found ${allImages.length} image(s):\n`);

  let totalSize = 0;
  const imageStats = [];

  for (const imagePath of allImages) {
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    const sizeKB = getFileSizeKB(imagePath);
    totalSize += sizeKB;

    imageStats.push({
      path: relativePath,
      size: sizeKB,
      extension: path.extname(imagePath).toLowerCase()
    });

    console.log(`📁 ${relativePath} - ${sizeKB} KB`);
  }

  console.log(`\n📊 Total size: ${totalSize} KB (${Math.round(totalSize / 1024)} MB)`);

  // Recommendations
  console.log('\n💡 Optimization recommendations:');

  const largeImages = imageStats.filter(img => img.size > 500);
  if (largeImages.length > 0) {
    console.log(`   • ${largeImages.length} image(s) are larger than 500KB and could benefit from compression`);
  }

  const nonWebpImages = imageStats.filter(img => !['.webp', '.avif'].includes(img.extension));
  if (nonWebpImages.length > 0) {
    console.log(`   • ${nonWebpImages.length} image(s) could be converted to WebP/AVIF for better compression`);
  }

  if (largeImages.length === 0 && nonWebpImages.length === 0) {
    console.log('   • Images are already well optimized! 🎉');
  }
}

/**
 * Create sample images for testing
 */
function createSampleImages() {
  console.log('🎨 Creating sample images for testing...\n');

  // Create sample SVG images
  const sampleImages = [
    {
      name: 'sample-post-1.svg',
      content: `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dy=".3em">
          Sample Blog Post Image
        </text>
      </svg>`
    },
    {
      name: 'sample-project-1.svg',
      content: `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad2)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dy=".3em">
          Sample Project Image
        </text>
      </svg>`
    },
    {
      name: 'profile-pic.svg',
      content: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#grad3)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">
          Profile Picture
        </text>
      </svg>`
    }
  ];

  // Ensure directories exist
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  // Create sample images
  for (const image of sampleImages) {
    const imagePath = path.join(IMAGES_DIR, image.name);
    fs.writeFileSync(imagePath, image.content);
    console.log(`✅ Created ${image.name}`);
  }

  console.log('\n🎉 Sample images created successfully!');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'analyze':
    analyzeImages();
    break;
  case 'create-samples':
    createSampleImages();
    break;
  default:
    console.log('🖼️  Image Optimization Tool\n');
    console.log('Usage:');
    console.log('  node scripts/optimize-images.js analyze        - Analyze existing images');
    console.log('  node scripts/optimize-images.js create-samples - Create sample images for testing');
    console.log('');
    break;
}