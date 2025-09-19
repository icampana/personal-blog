#!/usr/bin/env node

/**
 * Mobile responsiveness testing script
 * Tests responsive design and mobile compatibility
 */

import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Responsive design test results
 */
const responsiveTests = {
  viewport: { passed: 0, failed: 0, errors: [] },
  images: { passed: 0, failed: 0, errors: [] },
  typography: { passed: 0, failed: 0, errors: [] },
  layout: { passed: 0, failed: 0, errors: [] },
  navigation: { passed: 0, failed: 0, errors: [] },
};

/**
 * Test viewport meta tags
 */
async function testViewportMeta() {
  console.log('📱 Testing viewport meta tags...\n');

  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR });

  for (const file of htmlFiles) {
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for viewport meta tag
    const hasViewport = content.includes('<meta name="viewport"');
    const hasResponsiveViewport = content.includes('width=device-width');
    const hasInitialScale = content.includes('initial-scale=1');

    if (hasViewport && hasResponsiveViewport && hasInitialScale) {
      responsiveTests.viewport.passed++;
    } else {
      responsiveTests.viewport.failed++;
      responsiveTests.viewport.errors.push({
        file,
        issues: [
          !hasViewport && 'Missing viewport meta tag',
          !hasResponsiveViewport && 'Missing width=device-width',
          !hasInitialScale && 'Missing initial-scale=1',
        ].filter(Boolean),
      });
    }
  }

  console.log(
    `✅ Viewport tests: ${responsiveTests.viewport.passed}/${htmlFiles.length} passed`,
  );
  if (responsiveTests.viewport.failed > 0) {
    console.log(`❌ Failed: ${responsiveTests.viewport.failed} files`);
  }
}

/**
 * Test responsive images
 */
async function testResponsiveImages() {
  console.log('\n🖼️  Testing responsive images...\n');

  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR });

  for (const file of htmlFiles) {
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Find all img tags
    const imgTags = content.match(/<img[^>]*>/g) || [];
    let failedImages = 0;
    const imageIssues = [];

    for (const imgTag of imgTags) {
      const issues = [];

      // Check for responsive attributes
      if (!imgTag.includes('loading=')) {
        issues.push('Missing loading attribute');
      }

      if (!imgTag.includes('alt=')) {
        issues.push('Missing alt attribute');
      }

      // Check for responsive sizing
      if (!imgTag.includes('class=') || !imgTag.includes('w-')) {
        issues.push('Missing responsive width classes');
      }

      if (issues.length === 0) {
        passedImages++;
      } else {
        failedImages++;
        imageIssues.push({ tag: imgTag.substring(0, 100), issues });
      }
    }

    if (failedImages === 0) {
      responsiveTests.images.passed++;
    } else {
      responsiveTests.images.failed++;
      responsiveTests.images.errors.push({
        file,
        totalImages: imgTags.length,
        failedImages,
        issues: imageIssues.slice(0, 3), // Limit to first 3 issues
      });
    }
  }

  console.log(
    `✅ Image responsiveness: ${responsiveTests.images.passed}/${htmlFiles.length} files passed`,
  );
  if (responsiveTests.images.failed > 0) {
    console.log(
      `❌ Failed: ${responsiveTests.images.failed} files with image issues`,
    );
  }
}

/**
 * Test responsive typography
 */
async function testResponsiveTypography() {
  console.log('\n📝 Testing responsive typography...\n');

  const cssFiles = await glob('**/*.css', { cwd: DIST_DIR });
  let hasResponsiveText = false;
  let hasFluidTypography = false;

  for (const file of cssFiles) {
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for responsive text classes
    if (
      content.includes('text-sm') ||
      content.includes('text-base') ||
      content.includes('text-lg')
    ) {
      hasResponsiveText = true;
    }

    // Check for fluid typography (clamp, vw units, etc.)
    if (
      content.includes('clamp(') ||
      content.includes('vw') ||
      content.includes('@media')
    ) {
      hasFluidTypography = true;
    }
  }

  if (hasResponsiveText) {
    responsiveTests.typography.passed++;
    console.log('✅ Responsive text classes found');
  } else {
    responsiveTests.typography.failed++;
    responsiveTests.typography.errors.push('No responsive text classes found');
  }

  if (hasFluidTypography) {
    responsiveTests.typography.passed++;
    console.log('✅ Fluid typography patterns found');
  } else {
    responsiveTests.typography.failed++;
    responsiveTests.typography.errors.push(
      'No fluid typography patterns found',
    );
  }
}

/**
 * Test responsive layout
 */
async function testResponsiveLayout() {
  console.log('\n📐 Testing responsive layout...\n');

  const cssFiles = await glob('**/*.css', { cwd: DIST_DIR });
  let hasGridSystem = false;
  let hasFlexbox = false;
  let hasBreakpoints = false;

  for (const file of cssFiles) {
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for grid system
    if (
      content.includes('grid-cols') ||
      content.includes('display:grid') ||
      content.includes('grid-template')
    ) {
      hasGridSystem = true;
    }

    // Check for flexbox
    if (content.includes('flex') || content.includes('display:flex')) {
      hasFlexbox = true;
    }

    // Check for responsive breakpoints
    if (
      content.includes('sm:') ||
      content.includes('md:') ||
      content.includes('lg:') ||
      content.includes('@media')
    ) {
      hasBreakpoints = true;
    }
  }

  if (hasGridSystem) {
    responsiveTests.layout.passed++;
    console.log('✅ Grid system found');
  } else {
    responsiveTests.layout.failed++;
    responsiveTests.layout.errors.push('No grid system found');
  }

  if (hasFlexbox) {
    responsiveTests.layout.passed++;
    console.log('✅ Flexbox layout found');
  } else {
    responsiveTests.layout.failed++;
    responsiveTests.layout.errors.push('No flexbox layout found');
  }

  if (hasBreakpoints) {
    responsiveTests.layout.passed++;
    console.log('✅ Responsive breakpoints found');
  } else {
    responsiveTests.layout.failed++;
    responsiveTests.layout.errors.push('No responsive breakpoints found');
  }
}

/**
 * Test mobile navigation
 */
async function testMobileNavigation() {
  console.log('\n🧭 Testing mobile navigation...\n');

  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR });
  let hasMobileMenu = false;
  let hasHamburgerIcon = false;
  let hasResponsiveNav = false;

  for (const file of htmlFiles.slice(0, 5)) {
    // Check first 5 files
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for mobile menu patterns
    if (
      content.includes('mobile-menu') ||
      content.includes('menu-toggle') ||
      content.includes('navbar-toggle')
    ) {
      hasMobileMenu = true;
    }

    // Check for hamburger icon
    if (
      content.includes('hamburger') ||
      content.includes('menu-icon') ||
      content.includes('☰')
    ) {
      hasHamburgerIcon = true;
    }

    // Check for responsive navigation classes
    if (
      (content.includes('hidden') && content.includes('md:block')) ||
      content.includes('sm:hidden')
    ) {
      hasResponsiveNav = true;
    }
  }

  if (hasMobileMenu) {
    responsiveTests.navigation.passed++;
    console.log('✅ Mobile menu implementation found');
  } else {
    responsiveTests.navigation.failed++;
    responsiveTests.navigation.errors.push(
      'No mobile menu implementation found',
    );
  }

  if (hasHamburgerIcon) {
    responsiveTests.navigation.passed++;
    console.log('✅ Mobile menu icon found');
  } else {
    responsiveTests.navigation.failed++;
    responsiveTests.navigation.errors.push('No mobile menu icon found');
  }

  if (hasResponsiveNav) {
    responsiveTests.navigation.passed++;
    console.log('✅ Responsive navigation classes found');
  } else {
    responsiveTests.navigation.failed++;
    responsiveTests.navigation.errors.push(
      'No responsive navigation classes found',
    );
  }
}

/**
 * Generate mobile responsiveness report
 */
function generateResponsivenessReport() {
  console.log('\n📊 Mobile Responsiveness Test Results:');
  console.log('='.repeat(50));

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  Object.entries(responsiveTests).forEach(([category, results]) => {
    const categoryTotal = results.passed + results.failed;
    totalTests += categoryTotal;
    totalPassed += results.passed;
    totalFailed += results.failed;

    console.log(`${category.charAt(0).toUpperCase() + category.slice(1)}:`);
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    if (categoryTotal > 0) {
      console.log(
        `  Success Rate: ${Math.round((results.passed / categoryTotal) * 100)}%`,
      );
    }
    console.log('');
  });

  console.log('Overall Mobile Responsiveness:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(
    `  Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`,
  );

  return totalFailed === 0;
}

/**
 * Generate mobile optimization recommendations
 */
function generateMobileRecommendations() {
  console.log('\n💡 Mobile Optimization Recommendations:\n');

  const recommendations = [];

  if (responsiveTests.viewport.failed > 0) {
    recommendations.push('📱 Add proper viewport meta tags to all HTML pages');
  }

  if (responsiveTests.images.failed > 0) {
    recommendations.push(
      '🖼️  Implement responsive images with proper loading and alt attributes',
    );
  }

  if (responsiveTests.typography.failed > 0) {
    recommendations.push('📝 Use responsive typography with fluid scaling');
  }

  if (responsiveTests.layout.failed > 0) {
    recommendations.push(
      '📐 Implement responsive layout with CSS Grid and Flexbox',
    );
  }

  if (responsiveTests.navigation.failed > 0) {
    recommendations.push(
      '🧭 Add mobile-friendly navigation with hamburger menu',
    );
  }

  // General mobile recommendations
  recommendations.push('📱 Test on actual mobile devices');
  recommendations.push('⚡ Optimize touch targets (minimum 44px)');
  recommendations.push('🔍 Ensure text is readable without zooming');
  recommendations.push('📏 Use relative units (rem, em, %) for scalability');
  recommendations.push('🎯 Implement mobile-first design approach');

  if (recommendations.length === 0) {
    console.log('✅ Mobile responsiveness looks good!');
  } else {
    recommendations.forEach((rec) => console.log(rec));
  }
}

/**
 * Main mobile testing function
 */
async function main() {
  console.log('📱 Mobile Responsiveness Testing Starting...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.log('❌ Build directory not found. Run build first.');
    process.exit(1);
  }

  // Run all mobile responsiveness tests
  await testViewportMeta();
  await testResponsiveImages();
  await testResponsiveTypography();
  await testResponsiveLayout();
  await testMobileNavigation();

  // Generate report
  const allTestsPassed = generateResponsivenessReport();

  // Generate recommendations
  generateMobileRecommendations();

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 MOBILE RESPONSIVENESS SUMMARY');
  console.log('='.repeat(50));

  if (allTestsPassed) {
    console.log('✅ Mobile responsiveness tests passed! 📱');
    console.log('Site is ready for mobile users');
  } else {
    console.log('⚠️  Mobile responsiveness needs improvement');
    console.log('Review the issues and recommendations above');
  }

  console.log('='.repeat(50));

  return allTestsPassed;
}

main().catch(console.error);
