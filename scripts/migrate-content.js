#!/usr/bin/env node

/**
 * Content migration script
 * Migrates content from the parent Next.js blog to Astro format
 */

import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_CONTENT_DIR = path.join(__dirname, '../../content');
const TARGET_CONTENT_DIR = path.join(__dirname, '../src/content');
const SOURCE_PUBLIC_DIR = path.join(__dirname, '../../public');
const TARGET_PUBLIC_DIR = path.join(__dirname, '../public');

/**
 * Migration statistics
 */
const migrationStats = {
  posts: { migrated: 0, skipped: 0, errors: 0 },
  pages: { migrated: 0, skipped: 0, errors: 0 },
  projects: { migrated: 0, skipped: 0, errors: 0 },
  images: { migrated: 0, skipped: 0, errors: 0 },
};

/**
 * Transform frontmatter for Astro compatibility
 */
function transformFrontmatter(data, type) {
  const transformed = { ...data };

  // Ensure date is in correct format
  if (transformed.date) {
    const date = new Date(transformed.date);
    if (!isNaN(date.getTime())) {
      transformed.date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
  }

  // Remove Next.js specific fields
  delete transformed.layout;
  delete transformed.wordpress_id;
  delete transformed.author;
  delete transformed.comments;

  // Transform categories to tags for posts
  if (type === 'posts' && transformed.categories && !transformed.tags) {
    transformed.tags = transformed.categories;
    delete transformed.categories;
  }

  // Ensure tags is an array
  if (transformed.tags && typeof transformed.tags === 'string') {
    transformed.tags = [transformed.tags];
  }

  // Transform image paths
  if (transformed.featuredImage) {
    transformed.featuredImage = transformImagePath(transformed.featuredImage);
  }

  if (transformed.galleryImage && Array.isArray(transformed.galleryImage)) {
    transformed.galleryImage = transformed.galleryImage.map(transformImagePath);
  }

  return transformed;
}

/**
 * Transform image paths for Astro
 */
function transformImagePath(imagePath) {
  if (!imagePath || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Convert relative paths to absolute
  if (imagePath.startsWith('./')) {
    return imagePath.replace('./', '/photos/');
  }

  if (imagePath.startsWith('../')) {
    return imagePath.replace('../', '/');
  }

  // Ensure path starts with /
  if (!imagePath.startsWith('/')) {
    return `/photos/${imagePath}`;
  }

  return imagePath;
}

/**
 * Transform markdown content for Astro
 */
function transformContent(content) {
  let transformed = content;

  // Transform image references
  transformed = transformed.replace(
    /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
    '![$1](/photos/$2)',
  );
  transformed = transformed.replace(
    /!\[([^\]]*)\]\(\.\.\/([^)]+)\)/g,
    '![$1](/$2)',
  );

  // Transform HTML image tags
  transformed = transformed.replace(
    /<img([^>]+)src=["']\.\/([^"']+)["']/g,
    '<img$1src="/photos/$2"',
  );
  transformed = transformed.replace(
    /<img([^>]+)src=["']\.\.\/([^"']+)["']/g,
    '<img$1src="/$2"',
  );

  // Transform internal links
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\/posts\/([^)]+)\)/g,
    '[$1](/posts/$2)',
  );
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\/pages\/([^)]+)\)/g,
    '[$1](/content/$2)',
  );

  return transformed;
}

/**
 * Check if file already exists in target
 */
function fileExists(targetPath) {
  return fs.existsSync(targetPath);
}

/**
 * Migrate a single content file
 */
function migrateContentFile(sourcePath, targetPath, type) {
  try {
    // Check if target already exists
    if (fileExists(targetPath)) {
      migrationStats[type].skipped++;
      return { success: true, skipped: true };
    }

    const content = fs.readFileSync(sourcePath, 'utf8');
    const { data, content: body } = matter(content);

    // Transform frontmatter and content
    const transformedData = transformFrontmatter(data, type);
    const transformedContent = transformContent(body);

    // Create new content with transformed frontmatter
    const newContent = matter.stringify(transformedContent, transformedData);

    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(targetPath, newContent);

    migrationStats[type].migrated++;
    return { success: true, skipped: false };
  } catch (error) {
    migrationStats[type].errors++;
    return { success: false, error: error.message };
  }
}

/**
 * Migrate content of a specific type
 */
async function migrateContentType(type) {
  console.log(`\n📦 Migrating ${type}...`);

  const sourcePath = path.join(SOURCE_CONTENT_DIR, type);
  const targetPath = path.join(TARGET_CONTENT_DIR, type);

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  Source ${type} directory not found, skipping...`);
    return;
  }

  // Ensure target directory exists
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const files = await glob('**/*.{md,mdx}', { cwd: sourcePath });
  console.log(`Found ${files.length} ${type} files to migrate`);

  for (const file of files) {
    const sourceFilePath = path.join(sourcePath, file);
    const targetFilePath = path.join(targetPath, file.replace('.mdx', '.md'));

    const result = migrateContentFile(sourceFilePath, targetFilePath, type);

    if (result.success && !result.skipped) {
      console.log(`✅ Migrated: ${file}`);
    } else if (result.skipped) {
      console.log(`⏭️  Skipped: ${file} (already exists)`);
    } else {
      console.log(`❌ Failed: ${file} - ${result.error}`);
    }
  }
}

/**
 * Migrate images
 */
async function migrateImages() {
  console.log('\n🖼️  Migrating images...');

  const sourceImagesDir = path.join(SOURCE_PUBLIC_DIR, 'photos');
  const targetImagesDir = path.join(TARGET_PUBLIC_DIR, 'photos');

  if (!fs.existsSync(sourceImagesDir)) {
    console.log('⚠️  Source images directory not found, skipping...');
    return;
  }

  // Ensure target directory exists
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }

  const images = await glob('**/*.{jpg,jpeg,png,gif,webp,svg}', {
    cwd: sourceImagesDir,
  });
  console.log(`Found ${images.length} images to migrate`);

  for (const image of images) {
    const sourceImagePath = path.join(sourceImagesDir, image);
    const targetImagePath = path.join(targetImagesDir, image);

    try {
      // Check if target already exists
      if (fs.existsSync(targetImagePath)) {
        migrationStats.images.skipped++;
        console.log(`⏭️  Skipped: ${image} (already exists)`);
        continue;
      }

      // Ensure target directory exists
      const targetDir = path.dirname(targetImagePath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy the image
      fs.copyFileSync(sourceImagePath, targetImagePath);

      migrationStats.images.migrated++;
      console.log(`✅ Migrated: ${image}`);
    } catch (error) {
      migrationStats.images.errors++;
      console.log(`❌ Failed: ${image} - ${error.message}`);
    }
  }
}

/**
 * Generate migration report
 */
function generateMigrationReport() {
  console.log('\n📊 Migration Statistics:');
  console.log('='.repeat(40));

  Object.entries(migrationStats).forEach(([type, stats]) => {
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
    console.log(`  Migrated: ${stats.migrated}`);
    console.log(`  Skipped: ${stats.skipped}`);
    console.log(`  Errors: ${stats.errors}`);
    console.log(`  Total: ${stats.migrated + stats.skipped + stats.errors}`);
    console.log('');
  });
}

/**
 * Main migration function
 */
async function main() {
  console.log('📦 Content Migration Starting...\n');

  // Check if source directory exists
  if (!fs.existsSync(SOURCE_CONTENT_DIR)) {
    console.log('❌ Source content directory not found');
    console.log('This script should be run from the astro-blog directory');
    console.log('and expects the parent Next.js blog content to be available');
    process.exit(1);
  }

  // Migrate each content type
  await migrateContentType('posts');
  await migrateContentType('pages');
  await migrateContentType('projects');

  // Migrate images
  await migrateImages();

  // Generate report
  generateMigrationReport();

  // Final summary
  const totalMigrated = Object.values(migrationStats).reduce(
    (sum, stats) => sum + stats.migrated,
    0,
  );
  const totalErrors = Object.values(migrationStats).reduce(
    (sum, stats) => sum + stats.errors,
    0,
  );

  console.log('='.repeat(50));
  console.log('📋 MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Items Migrated: ${totalMigrated}`);
  console.log(`Total Errors: ${totalErrors}`);
  console.log('='.repeat(50));

  if (totalErrors > 0) {
    console.log('\n⚠️  Migration completed with errors');
    console.log('Review the errors above and fix them manually');
  } else {
    console.log('\n✅ Migration completed successfully! 🎉');
    console.log('All content has been migrated to Astro format');
  }

  console.log('\nNext steps:');
  console.log('1. Run content validation: pnpm run validate:content');
  console.log('2. Test the build: pnpm run build');
  console.log('3. Review migrated content for any manual adjustments needed');
}

main().catch(console.error);
