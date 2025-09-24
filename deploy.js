#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...\n');

try {
  // Step 1: Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Step 3: Build for production
  console.log('🏗️  Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 4: Check build output
  console.log('✅ Checking build output...');
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('Build failed - index.html not found');
  }

  const distSize = getDirectorySize('dist');
  console.log(`📊 Build size: ${(distSize / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n🎉 Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Upload the "dist" folder to your web hosting provider');
  console.log('2. Or use: vercel --prod (if using Vercel)');
  console.log('3. Or use: netlify deploy --prod --dir=dist (if using Netlify)');
  console.log('\n🌐 Your website is ready for deployment!');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}
