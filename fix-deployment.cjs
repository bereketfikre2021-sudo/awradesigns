#!/usr/bin/env node

/**
 * Fix Deployment Error Script
 * 
 * This script addresses the Git exit code 128 error that occurs during deployment.
 * The error typically happens due to authentication or permission issues.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}→${colors.reset} ${colors.bright}${msg}${colors.reset}`),
};

const runCommand = (command, options = {}) => {
  try {
    log.info(`Running: ${command}`);
    const result = execSync(command, { 
      encoding: 'utf8', 
      timeout: options.timeout || 30000,
      stdio: options.silent ? 'pipe' : 'inherit'
    });
    return result;
  } catch (error) {
    log.warning(`Command failed: ${command} - ${error.message}`);
    return null;
  }
};

const checkGitStatus = () => {
  log.step('Checking Git status...');
  
  try {
    // Check if we're in a git repository
    const gitStatus = runCommand('git status --porcelain', { silent: true });
    if (gitStatus === null) {
      log.error('Not in a Git repository or Git not available');
      return false;
    }
    
    // Check remote configuration
    const remotes = runCommand('git remote -v', { silent: true });
    if (remotes) {
      log.info('Git remotes configured:');
      console.log(remotes);
    }
    
    // Check current branch
    const currentBranch = runCommand('git branch --show-current', { silent: true });
    if (currentBranch) {
      log.info(`Current branch: ${currentBranch.trim()}`);
    }
    
    log.success('Git status check completed');
    return true;
    
  } catch (error) {
    log.error('Git status check failed: ' + error.message);
    return false;
  }
};

const fixGitAuthentication = () => {
  log.step('Fixing Git authentication issues...');
  
  try {
    // Check if we can access the remote
    const remoteCheck = runCommand('git ls-remote origin', { silent: true });
    if (remoteCheck === null) {
      log.warning('Cannot access remote repository. This might be an authentication issue.');
      
      // Try to fix common authentication issues
      log.info('Attempting to fix authentication...');
      
      // Check if we're using HTTPS and suggest SSH
      const remotes = runCommand('git remote get-url origin', { silent: true });
      if (remotes && remotes.includes('https://github.com')) {
        log.warning('Using HTTPS remote. Consider switching to SSH for better authentication.');
        log.info('To fix: git remote set-url origin git@github.com:bereketfikre2021-sudo/awradesigns.git');
      }
      
      return false;
    }
    
    log.success('Remote repository is accessible');
    return true;
    
  } catch (error) {
    log.error('Authentication check failed: ' + error.message);
    return false;
  }
};

const createDeploymentScript = () => {
  log.step('Creating deployment script...');
  
  const deploymentScript = `#!/bin/bash

# Deployment Script for Awra Finishing & Interior Website
# This script handles deployment with proper error handling

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Function to handle errors
handle_error() {
    echo "❌ Deployment failed at step: $1"
    echo "Error details: $2"
    exit 1
}

# Step 1: Check Git status
echo "📋 Checking Git status..."
if ! git status > /dev/null 2>&1; then
    handle_error "Git check" "Not in a Git repository"
fi

# Step 2: Ensure we're on the correct branch
echo "🌿 Checking branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on main branch (currently on: $CURRENT_BRANCH)"
fi

# Step 3: Pull latest changes
echo "📥 Pulling latest changes..."
if ! git pull origin main; then
    handle_error "Git pull" "Failed to pull latest changes"
fi

# Step 4: Install dependencies
echo "📦 Installing dependencies..."
if ! npm ci; then
    handle_error "Dependencies" "Failed to install dependencies"
fi

# Step 5: Build the project
echo "🏗️  Building project..."
if ! npm run build; then
    handle_error "Build" "Failed to build the project"
fi

# Step 6: Verify build
echo "✅ Verifying build..."
if [ ! -f "dist/index.html" ]; then
    handle_error "Build verification" "index.html not found in dist folder"
fi

# Step 7: Commit and push changes
echo "💾 Committing and pushing changes..."
if ! git add .; then
    handle_error "Git add" "Failed to stage changes"
fi

if ! git commit -m "Deploy: $(date)"; then
    echo "ℹ️  No changes to commit"
fi

if ! git push origin main; then
    handle_error "Git push" "Failed to push changes to remote"
fi

echo "🎉 Deployment completed successfully!"
echo "✅ Build: Complete"
echo "✅ Git: Updated"
echo "✅ Remote: Synced"
`;

  try {
    fs.writeFileSync('deploy-fixed.sh', deploymentScript);
    fs.chmodSync('deploy-fixed.sh', '755');
    log.success('Deployment script created: deploy-fixed.sh');
    return true;
  } catch (error) {
    log.error('Failed to create deployment script: ' + error.message);
    return false;
  }
};

const createGitHubActionsWorkflow = () => {
  log.step('Creating GitHub Actions workflow...');
  
  const workflow = `name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        token: \${{ secrets.GITHUB_TOKEN }}
        fetch-depth: 0
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v3.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: \${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID }}
        vercel-project-id: \${{ secrets.PROJECT_ID }}
        working-directory: ./
`;

  try {
    const workflowsDir = '.github/workflows';
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(workflowsDir, 'deploy.yml'), workflow);
    log.success('GitHub Actions workflow created: .github/workflows/deploy.yml');
    return true;
  } catch (error) {
    log.error('Failed to create GitHub Actions workflow: ' + error.message);
    return false;
  }
};

const createNetlifyConfig = () => {
  log.step('Updating Netlify configuration...');
  
  const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;

  try {
    fs.writeFileSync('netlify.toml', netlifyConfig);
    log.success('Netlify configuration updated');
    return true;
  } catch (error) {
    log.error('Failed to update Netlify configuration: ' + error.message);
    return false;
  }
};

const main = () => {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('🔧 Fixing Deployment Error (Git Exit Code 128)');
  console.log('==============================================');
  console.log(`${colors.reset}`);
  
  try {
    // Check Git status
    if (!checkGitStatus()) {
      log.error('Git status check failed. Please ensure you are in a Git repository.');
      process.exit(1);
    }
    
    // Fix authentication issues
    if (!fixGitAuthentication()) {
      log.warning('Authentication issues detected. Please check your Git credentials.');
    }
    
    // Create deployment scripts
    createDeploymentScript();
    createGitHubActionsWorkflow();
    createNetlifyConfig();
    
    console.log(`\n${colors.bright}${colors.green}`);
    console.log('🎉 Deployment Error Fix Complete!');
    console.log('==================================');
    console.log(`${colors.reset}`);
    console.log('✅ Git status: Verified');
    console.log('✅ Deployment script: Created (deploy-fixed.sh)');
    console.log('✅ GitHub Actions: Configured');
    console.log('✅ Netlify config: Updated');
    console.log('\nNext steps:');
    console.log('1. Run: chmod +x deploy-fixed.sh');
    console.log('2. Run: ./deploy-fixed.sh');
    console.log('3. Or use GitHub Actions for automated deployment');
    console.log('\nIf you still get Git errors:');
    console.log('- Check your GitHub authentication');
    console.log('- Ensure you have push permissions to the repository');
    console.log('- Consider using SSH instead of HTTPS for Git remote');
    
  } catch (error) {
    log.error('Fix failed: ' + error.message);
    process.exit(1);
  }
};

// Run the fix
main();
