@echo off
REM Deployment Script for Awra Finishing & Interior Website
REM This script handles deployment with proper error handling

echo 🚀 Starting deployment process...

REM Step 1: Check Git status
echo 📋 Checking Git status...
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a Git repository
    exit /b 1
)

REM Step 2: Ensure we're on the correct branch
echo 🌿 Checking branch...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo ⚠️  Warning: Not on main branch (currently on: %CURRENT_BRANCH%)
)

REM Step 3: Pull latest changes
echo 📥 Pulling latest changes...
git pull origin main
if errorlevel 1 (
    echo ❌ Failed to pull latest changes
    exit /b 1
)

REM Step 4: Install dependencies
echo 📦 Installing dependencies...
npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Step 5: Build the project
echo 🏗️  Building project...
npm run build
if errorlevel 1 (
    echo ❌ Failed to build the project
    exit /b 1
)

REM Step 6: Verify build
echo ✅ Verifying build...
if not exist "dist\index.html" (
    echo ❌ index.html not found in dist folder
    exit /b 1
)

REM Step 7: Commit and push changes
echo 💾 Committing and pushing changes...
git add .
if errorlevel 1 (
    echo ❌ Failed to stage changes
    exit /b 1
)

git commit -m "Deploy: %date% %time%"
if errorlevel 1 (
    echo ℹ️  No changes to commit
)

git push origin main
if errorlevel 1 (
    echo ❌ Failed to push changes to remote
    exit /b 1
)

echo 🎉 Deployment completed successfully!
echo ✅ Build: Complete
echo ✅ Git: Updated
echo ✅ Remote: Synced
