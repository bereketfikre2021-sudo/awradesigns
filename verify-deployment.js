#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Awra Finishing & Interior - Deployment Verification');
console.log('====================================================');

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.log('❌ Build directory not found. Running build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Build directory exists');
}

// Check critical files
const criticalFiles = [
  'dist/index.html',
  'dist/sw.js',
  'dist/manifest.webmanifest'
];

let allFilesExist = true;
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check for CSS and JS files
const cssFiles = fs.readdirSync('dist/css').filter(f => f.endsWith('.css'));
const jsFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.js'));

console.log(`✅ CSS files: ${cssFiles.length}`);
console.log(`✅ JavaScript files: ${jsFiles.length}`);

// Check file sizes
const indexHtmlSize = (fs.statSync('dist/index.html').size / 1024).toFixed(2);
console.log(`📊 Index.html size: ${indexHtmlSize} KB`);

// Check for images
if (fs.existsSync('dist/images')) {
  const images = fs.readdirSync('dist/images');
  console.log(`✅ Images: ${images.length} files`);
} else {
  console.log('⚠️  No images directory found');
}

// Check for favicons
const faviconFiles = [
  'dist/favicon.ico',
  'dist/favicon-16x16.png',
  'dist/favicon-32x32.png',
  'dist/apple-touch-icon.png',
  'dist/android-chrome-192x192.png',
  'dist/android-chrome-512x512.png'
];

const existingFavicons = faviconFiles.filter(f => fs.existsSync(f));
console.log(`✅ Favicon files: ${existingFavicons.length}/${faviconFiles.length}`);

// Check PWA files
if (fs.existsSync('dist/sw.js') && fs.existsSync('dist/manifest.webmanifest')) {
  console.log('✅ PWA files present');
} else {
  console.log('❌ PWA files missing');
}

console.log('\n🎉 Deployment Verification Complete!');
console.log('=====================================');

if (allFilesExist && cssFiles.length > 0 && jsFiles.length > 0) {
  console.log('✅ All critical files present');
  console.log('✅ Build is ready for deployment');
  console.log('\nNext steps:');
  console.log('1. Upload the dist/ folder to your hosting provider');
  console.log('2. Configure your web server');
  console.log('3. Set up SSL certificate');
  console.log('4. Test the live site');
} else {
  console.log('❌ Some files are missing. Please check the build process.');
  process.exit(1);
}
