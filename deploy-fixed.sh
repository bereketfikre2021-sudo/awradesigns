#!/bin/bash

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
