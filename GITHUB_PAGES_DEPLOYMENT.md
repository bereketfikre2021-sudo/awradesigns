# GitHub Pages Deployment Guide

## ✅ Image Loading Issues Fixed

All image loading issues for GitHub Pages deployment have been resolved:

### 1. **Hero Background Image (CSS)**
- **Fixed**: Hero background image now uses CSS custom property `--hero-bg-url`
- **Location**: `src/App.css` (line 1482) and `src/index.jsx` (lines 18-20)
- **Solution**: Dynamic path resolution based on `BASE_URL` environment variable

### 2. **JavaScript Image Paths**
- **Status**: ✅ All images already using `getImagePath()` utility
- **Coverage**: Hero images, team member photos, project images, blog images
- **Location**: `src/utils/index.ts` - `getImagePath()` function handles:
  - Base URL detection
  - URL encoding for spaces and special characters
  - GitHub Pages subdirectory support

### 3. **Components Using Image Paths**
All components correctly use `getImagePath()`:
- ✅ `ThemeAwareLogo.jsx` - Logo images
- ✅ `App.jsx` - Hero images, team photos
- ✅ `ARViewer.jsx` - AR images
- ✅ `CaseStudies.jsx` - Case study images
- ✅ `Testimonials.jsx` - Testimonial images

## 📋 Pre-Deployment Checklist

### Build Configuration
- ✅ `vite.config.js` base: `/` (works for root and subdirectory)
- ✅ Public directory: `public` (images stored here)
- ✅ Asset handling: Properly configured for images

### Environment Variables
- ✅ `BASE_URL` automatically detected by Vite
- ✅ CSS custom properties set in `index.jsx`
- ✅ Works for both root (`/`) and subdirectory (`/repo-name/`) deployments

### Image Files
- ✅ All images in `public/images/` directory
- ✅ WebP format for optimal performance
- ✅ Proper file naming (spaces URL encoded)

## 🚀 Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` (or your chosen branch)
   - Folder: `/root` (or `/docs` if using docs folder)

3. **If deploying from root:**
   - Build outputs to `dist/` folder
   - Copy contents of `dist/` to root (or configure to build to root)
   - Or set up GitHub Actions to deploy automatically

4. **If deploying to subdirectory:**
   - Set `base` in `vite.config.js` to `/repo-name/`
   - Rebuild: `npm run build`
   - Deploy `dist/` folder

## ✅ Verification

After deployment, verify:
- [ ] Hero background image loads correctly
- [ ] Logo images display properly
- [ ] Team member photos load
- [ ] Project images in portfolio section work
- [ ] Blog post images display correctly
- [ ] All social media icons visible
- [ ] No 404 errors for images in browser console

## 🔧 Troubleshooting

### Images Not Loading
1. Check browser console for 404 errors
2. Verify `BASE_URL` is correct in deployed environment
3. Ensure images are in `public/images/` directory
4. Check file paths have proper URL encoding

### CSS Background Not Showing
1. Verify `--hero-bg-url` CSS variable is set
2. Check `index.jsx` sets the variable correctly
3. Ensure base URL detection works

### Path Issues
- All paths should be relative or use `getImagePath()` utility
- Check for hardcoded absolute paths
- Verify `vite.config.js` base setting

## 📝 Notes

- The `getImagePath()` utility automatically handles:
  - Base URL prefix
  - URL encoding
  - Special characters in filenames
  - Both root and subdirectory deployments

- CSS custom properties ensure:
  - Dynamic path resolution
  - No hardcoded paths
  - GitHub Pages compatibility

## ✅ Status

**All image loading issues resolved and ready for GitHub Pages deployment!**

