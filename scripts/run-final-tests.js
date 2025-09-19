#!/usr/bin/env node

/**
 * Final comprehensive testing script
 * Runs all tests and validations before deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test results tracking
 */
const testResults = {
  linting: { passed: false, error: null },
  typecheck: { passed: false, error: null },
  unitTests: { passed: false, error: null },
  contentValidation: { passed: false, error: null },
  contentRendering: { passed: false, error: null },
  build: { passed: false, error: null },
  buildVerification: { passed: false, error: null },
  performanceAnalysis: { passed: false, error: null }
};

/**
 * Run a command and capture result
 */
function runCommand(command, description) {
  console.log(`\n🔍 ${description}...`);

  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });

    console.log(`✅ ${description} passed`);
    return { passed: true, output, error: null };
  } catch (error) {
    console.log(`❌ ${description} failed`);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    return { passed: false, output: null, error: error.message };
  }
}

/**
 * Run linting tests
 */
function runLinting() {
  return runCommand('pnpm run lint', 'Code linting');
}

/**
 * Run TypeScript checking
 */
function runTypeCheck() {
  return runCommand('pnpm run astro check', 'TypeScript checking');
}

/**
 * Run unit tests
 */
function runUnitTests() {
  return runCommand('pnpm run test:run', 'Unit tests');
}

/**
 * Run content validation
 */
function runContentValidation() {
  return runCommand('pnpm run validate:content', 'Content validation');
}

/**
 * Run content rendering tests
 */
function runContentRendering() {
  return runCommand('pnpm run test:content', 'Content rendering tests');
}

/**
 * Run build
 */
function runBuild() {
  return runCommand('pnpm run build:preview', 'Build process');
}

/**
 * Run build verification
 */
function runBuildVerification() {
  return runCommand('pnpm run build:verify', 'Build verification');
}

/**
 * Run performance analysis
 */
function runPerformanceAnalysis() {
  return runCommand('node scripts/analyze-performance.js', 'Performance analysis');
}

/**
 * Check critical files exist
 */
function checkCriticalFiles() {
  console.log('\n🔍 Checking critical files...');

  const criticalFiles = [
    'dist/index.html',
    'dist/search-index.json',
    'dist/rss.xml',
    'dist/sitemap-index.xml',
    'dist/404.html'
  ];

  const missingFiles = [];

  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    console.log('✅ All critical files present');
    return { passed: true, error: null };
  } else {
    console.log(`❌ Missing critical files: ${missingFiles.join(', ')}`);
    return { passed: false, error: `Missing files: ${missingFiles.join(', ')}` };
  }
}

/**
 * Test sample URLs
 */
function testSampleUrls() {
  console.log('\n🔍 Testing sample URLs...');

  const sampleUrls = [
    'dist/index.html',
    'dist/posts/index.html',
    'dist/portafolio/index.html',
    'dist/search/index.html',
    'dist/404.html'
  ];

  const missingUrls = [];

  for (const url of sampleUrls) {
    const filePath = path.join(__dirname, '..', url);
    if (!fs.existsSync(filePath)) {
      missingUrls.push(url);
    }
  }

  if (missingUrls.length === 0) {
    console.log('✅ All sample URLs accessible');
    return { passed: true, error: null };
  } else {
    console.log(`❌ Missing URLs: ${missingUrls.join(', ')}`);
    return { passed: false, error: `Missing URLs: ${missingUrls.join(', ')}` };
  }
}

/**
 * Generate test report
 */
function generateTestReport() {
  console.log('\n📊 Final Test Results:');
  console.log('='.repeat(50));

  let totalTests = 0;
  let passedTests = 0;

  Object.entries(testResults).forEach(([test, result]) => {
    totalTests++;
    if (result.passed) {
      passedTests++;
      console.log(`✅ ${test}: PASSED`);
    } else {
      console.log(`❌ ${test}: FAILED`);
      if (result.error) {
        console.log(`   Error: ${result.error.substring(0, 100)}...`);
      }
    }
  });

  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  return passedTests === totalTests;
}

/**
 * Display deployment readiness
 */
function displayDeploymentReadiness(allTestsPassed) {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 DEPLOYMENT READINESS');
  console.log('='.repeat(50));

  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED - READY FOR DEPLOYMENT! 🎉');
    console.log('\nNext steps:');
    console.log('1. Review performance analysis results');
    console.log('2. Deploy to staging: pnpm run deploy:staging');
    console.log('3. Test staging environment');
    console.log('4. Deploy to production: pnpm run deploy:production');
  } else {
    console.log('❌ TESTS FAILED - NOT READY FOR DEPLOYMENT');
    console.log('\nRequired actions:');
    console.log('1. Fix failing tests listed above');
    console.log('2. Re-run final tests: pnpm run test:final');
    console.log('3. Verify all issues are resolved');
  }

  console.log('='.repeat(50));
}

/**
 * Main testing function
 */
async function main() {
  console.log('🧪 Final Comprehensive Testing Starting...\n');
  console.log('This will run all tests to ensure deployment readiness');

  // Run all tests in sequence
  testResults.linting = runLinting();
  testResults.typecheck = runTypeCheck();
  testResults.unitTests = runUnitTests();
  testResults.contentValidation = runContentValidation();
  testResults.contentRendering = runContentRendering();
  testResults.build = runBuild();
  testResults.buildVerification = runBuildVerification();
  testResults.performanceAnalysis = runPerformanceAnalysis();

  // Additional checks
  const criticalFilesResult = checkCriticalFiles();
  const sampleUrlsResult = testSampleUrls();

  // Add additional checks to results
  testResults.criticalFiles = criticalFilesResult;
  testResults.sampleUrls = sampleUrlsResult;

  // Generate report
  const allTestsPassed = generateTestReport();

  // Display deployment readiness
  displayDeploymentReadiness(allTestsPassed);

  // Exit with appropriate code
  process.exit(allTestsPassed ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Final testing failed:', error);
  process.exit(1);
});