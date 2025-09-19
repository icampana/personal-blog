#!/usr/bin/env node

/**
 * Script to copy images from the parent project to the Astro project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PHOTOS_DIR = path.join(__dirname, '../../public/photos');
const SOURCE_IMAGES_DIR = path.join(__dirname, '../../public/images');
const DEST_PHOTOS_DIR = path.join(__dirname, '../public/photos');
const DEST_IMAGES_DIR = path.join(__dirname, '../public/images');

/**
 * Copy directory recursively
 */
function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    console.log(`Source directory ${source} does not exist, skipping...`);
    return 0;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source, { withFileTypes: true });
  let copiedCount = 0;

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const destPath = path.join(destination, item.name);

    if (item.isDirectory()) {
      // Recursively copy subdirectories
      copiedCount += copyDirectory(sourcePath, destPath);
    } else if (item.isFile()) {
      // Copy file
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✅ Copied: ${item.name}`);
        copiedCount++;
      } catch (error) {
        console.error(`  ❌ Failed to copy ${item.name}:`, error.message);
      }
    }
  }

  return copiedCount;
}

/**
 * Get file count in directory
 */
function getFileCount(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      count += getFileCount(path.join(dir, item.name));
    } else if (item.isFile()) {
      count++;
    }
  }

  return count;
}

/**
 * Main execution
 */
function main() {
  console.log('📸 Copying images from parent project to Astro project...\n');

  let totalCopied = 0;

  // Copy photos directory
  console.log('📁 Copying photos directory...');
  const photosCopied = copyDirectory(SOURCE_PHOTOS_DIR, DEST_PHOTOS_DIR);
  totalCopied += photosCopied;

  console.log(`\n📁 Copying images directory...`);
  const imagesCopied = copyDirectory(SOURCE_IMAGES_DIR, DEST_IMAGES_DIR);
  totalCopied += imagesCopied;

  console.log(`\n📊 Summary:`);
  console.log(`  Photos copied: ${photosCopied}`);
  console.log(`  Images copied: ${imagesCopied}`);
  console.log(`  Total files copied: ${totalCopied}`);

  // Show final counts
  const finalPhotosCount = getFileCount(DEST_PHOTOS_DIR);
  const finalImagesCount = getFileCount(DEST_IMAGES_DIR);

  console.log(`\n📈 Final counts:`);
  console.log(`  Photos in destination: ${finalPhotosCount}`);
  console.log(`  Images in destination: ${finalImagesCount}`);

  if (totalCopied > 0) {
    console.log('\n🎉 Image copying completed successfully!');
  } else {
    console.log('\n✨ No new images to copy!');
  }
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Script failed:', error);
  process.exit(1);
}
