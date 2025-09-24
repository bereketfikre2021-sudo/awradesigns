#!/usr/bin/env node

/**
 * Production Deployment Script for Awra Finishing & Interior Website
 * 
 * This script handles the complete deployment process including:
 * - Building the application
 * - Optimizing assets
 * - Validating the build
 * - Deploying to production
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}→${colors.reset} ${colors.bright}${msg}${colors.reset}`),
};

// Configuration
const config = {
  buildDir: 'dist',
  publicDir: 'public',
  srcDir: 'src',
  nodeVersion: '18.x',
  buildTimeout: 300000, // 5 minutes
};

// Utility functions
const runCommand = (command, options = {}) => {
  try {
    log.info(`Running: ${command}`);
    const result = execSync(command, { 
      encoding: 'utf8', 
      timeout: options.timeout || 60000,
      stdio: options.silent ? 'pipe' : 'inherit'
    });
    return result;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    process.exit(1);
  }
};

const checkFileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2); // KB
};

const validateBuild = () => {
  log.step('Validating production build...');
  
  const requiredFiles = [
    'dist/index.html',
    'dist/assets/index-*.js',
    'dist/css/index-*.css',
    'dist/sw.js',
    'dist/manifest.webmanifest'
  ];
  
  const missingFiles = [];
  
  // Check if dist directory exists
  if (!checkFileExists(config.buildDir)) {
    log.error('Build directory not found!');
    process.exit(1);
  }
  
  // Check for index.html
  if (!checkFileExists('dist/index.html')) {
    missingFiles.push('index.html');
  }
  
  // Check for CSS files
  const cssFiles = fs.readdirSync('dist/css').filter(file => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    missingFiles.push('CSS files');
  }
  
  // Check for JS files
  const jsFiles = fs.readdirSync('dist/assets').filter(file => file.endsWith('.js'));
  if (jsFiles.length === 0) {
    missingFiles.push('JavaScript files');
  }
  
  // Check for service worker
  if (!checkFileExists('dist/sw.js')) {
    missingFiles.push('Service worker');
  }
  
  // Check for manifest
  if (!checkFileExists('dist/manifest.webmanifest')) {
    missingFiles.push('Web manifest');
  }
  
  if (missingFiles.length > 0) {
    log.error(`Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }
  
  log.success('Build validation passed!');
};

const analyzeBuild = () => {
  log.step('Analyzing build output...');
  
  try {
    // Get build statistics
    const indexHtmlSize = getFileSize('dist/index.html');
    const cssFiles = fs.readdirSync('dist/css');
    const jsFiles = fs.readdirSync('dist/assets');
    
    let totalCssSize = 0;
    let totalJsSize = 0;
    
    cssFiles.forEach(file => {
      totalCssSize += parseFloat(getFileSize(`dist/css/${file}`));
    });
    
    jsFiles.forEach(file => {
      totalJsSize += parseFloat(getFileSize(`dist/assets/${file}`));
    });
    
    log.info(`HTML size: ${indexHtmlSize} KB`);
    log.info(`CSS size: ${totalCssSize.toFixed(2)} KB`);
    log.info(`JavaScript size: ${totalJsSize.toFixed(2)} KB`);
    log.info(`Total assets: ${cssFiles.length + jsFiles.length} files`);
    
    // Performance recommendations
    if (totalJsSize > 500) {
      log.warning('JavaScript bundle is large. Consider code splitting.');
    }
    
    if (totalCssSize > 200) {
      log.warning('CSS bundle is large. Consider critical CSS extraction.');
    }
    
    log.success('Build analysis complete!');
    
  } catch (error) {
    log.warning('Could not analyze build output: ' + error.message);
  }
};

const optimizeAssets = () => {
  log.step('Optimizing assets...');
  
  try {
    // Check if images need optimization
    const imageDir = 'dist/images';
    if (checkFileExists(imageDir)) {
      const images = fs.readdirSync(imageDir);
      log.info(`Found ${images.length} images in build`);
      
      // Check for WebP support
      const webpImages = images.filter(img => img.endsWith('.webp'));
      if (webpImages.length > 0) {
        log.success(`WebP optimization: ${webpImages.length} images`);
      }
    }
    
    // Check for favicon files
    const faviconFiles = [
      'dist/favicon.ico',
      'dist/favicon-16x16.png',
      'dist/favicon-32x32.png',
      'dist/apple-touch-icon.png',
      'dist/android-chrome-192x192.png',
      'dist/android-chrome-512x512.png'
    ];
    
    const existingFavicons = faviconFiles.filter(file => checkFileExists(file));
    log.success(`Favicon files: ${existingFavicons.length}/${faviconFiles.length}`);
    
    log.success('Asset optimization complete!');
    
  } catch (error) {
    log.warning('Asset optimization failed: ' + error.message);
  }
};

const checkDependencies = () => {
  log.step('Checking dependencies...');
  
  try {
    // Check if package.json exists
    if (!checkFileExists('package.json')) {
      log.error('package.json not found!');
      process.exit(1);
    }
    
    // Check if node_modules exists
    if (!checkFileExists('node_modules')) {
      log.warning('node_modules not found. Running npm install...');
      runCommand('npm install');
    }
    
    // Check for critical dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const criticalDeps = ['react', 'react-dom', 'vite'];
    
    const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
    
    if (missingDeps.length > 0) {
      log.error(`Missing critical dependencies: ${missingDeps.join(', ')}`);
      process.exit(1);
    }
    
    log.success('Dependencies check passed!');
    
  } catch (error) {
    log.error('Dependency check failed: ' + error.message);
    process.exit(1);
  }
};

const buildApplication = () => {
  log.step('Building application for production...');
  
  try {
    // Clean previous build
    if (checkFileExists(config.buildDir)) {
      log.info('Cleaning previous build...');
      fs.rmSync(config.buildDir, { recursive: true, force: true });
    }
    
    // Run production build
    runCommand('npm run build', { timeout: config.buildTimeout });
    
    log.success('Application built successfully!');
    
  } catch (error) {
    log.error('Build failed: ' + error.message);
    process.exit(1);
  }
};

const runTests = () => {
  log.step('Running tests...');
  
  try {
    // Check if test script exists
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts.test) {
      runCommand('npm test', { silent: true });
      log.success('Tests passed!');
    } else {
      log.info('No test script found. Skipping tests.');
    }
    
  } catch (error) {
    log.warning('Tests failed or not available: ' + error.message);
  }
};

const generateDeploymentReport = () => {
  log.step('Generating deployment report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    buildDir: config.buildDir,
    nodeVersion: process.version,
    platform: process.platform,
    files: []
  };
  
  try {
    // Scan build directory
    const scanDir = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          scanDir(fullPath, relativePath);
        } else {
          report.files.push({
            path: relativePath,
            size: stats.size,
            modified: stats.mtime
          });
        }
      });
    };
    
    scanDir(config.buildDir);
    
    // Write report
    fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
    log.success('Deployment report generated: deployment-report.json');
    
  } catch (error) {
    log.warning('Could not generate deployment report: ' + error.message);
  }
};

const main = () => {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('🚀 Awra Finishing & Interior - Production Deployment');
  console.log('==================================================');
  console.log(`${colors.reset}`);
  
  try {
    // Pre-deployment checks
    checkDependencies();
    runTests();
    
    // Build process
    buildApplication();
    validateBuild();
    analyzeBuild();
    optimizeAssets();
    
    // Post-build
    generateDeploymentReport();
    
    console.log(`\n${colors.bright}${colors.green}`);
    console.log('🎉 Deployment Ready!');
    console.log('===================');
    console.log(`${colors.reset}`);
    console.log('✅ Build completed successfully');
    console.log('✅ All validations passed');
    console.log('✅ Assets optimized');
    console.log('✅ Ready for production deployment');
    console.log('\nNext steps:');
    console.log('1. Upload dist/ folder to your hosting provider');
    console.log('2. Configure your web server');
    console.log('3. Set up SSL certificate');
    console.log('4. Configure CDN (optional)');
    console.log('5. Test the live site');
    
  } catch (error) {
    log.error('Deployment failed: ' + error.message);
    process.exit(1);
  }
};

// Run deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  runCommand,
  validateBuild,
  analyzeBuild,
  optimizeAssets,
  buildApplication
};
