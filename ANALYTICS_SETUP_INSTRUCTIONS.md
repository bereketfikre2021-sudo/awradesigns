# 📊 Analytics Setup Instructions

## 🎯 Quick Setup Guide

This guide will help you set up Google Analytics 4 and Facebook Pixel for your website.

---

## 1. Google Analytics 4 Setup

### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account (if you don't have one)
4. Set up a property for your website
5. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Get Your Measurement ID
1. In Google Analytics, go to **Admin** (bottom left)
2. Under **Property**, click **Data Streams**
3. Click on your web stream
4. Copy your **Measurement ID** (starts with `G-`)

### Step 3: Add to Website

**Option A: Update Config File (Recommended)**
1. Open `src/config/analytics.js`
2. Replace `'GA_MEASUREMENT_ID'` with your actual Measurement ID:
   ```javascript
   export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Your actual ID
   ```

**Option B: Use Environment Variable**
1. Create a `.env` file in the root directory:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
2. Restart your development server

### Step 4: Verify It's Working
1. Visit your website
2. Open Google Analytics → Realtime reports
3. You should see your visit appear

---

## 2. Facebook Pixel Setup

### Step 1: Create Facebook Pixel
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager**
3. Click **Connect Data Sources** → **Web**
4. Choose **Facebook Pixel**
5. Give your pixel a name (e.g., "Awra Designs Pixel")
6. Click **Create Pixel**

### Step 2: Get Your Pixel ID
1. In Events Manager, click on your pixel
2. Copy your **Pixel ID** (15-digit number, e.g., `123456789012345`)

### Step 3: Add to Website

**Option A: Update Config File (Recommended)**
1. Open `src/config/analytics.js`
2. Replace `'YOUR_PIXEL_ID'` with your actual Pixel ID:
   ```javascript
   export const FB_PIXEL_ID = '123456789012345'; // Your actual ID
   ```

**Option B: Use Environment Variable**
1. Create a `.env` file in the root directory:
   ```
   VITE_FB_PIXEL_ID=123456789012345
   ```
2. Restart your development server

### Step 4: Verify It's Working
1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit your website
3. The extension should show your pixel is firing

---

## 3. Testing & Verification

### Google Analytics Verification:
- [ ] Visit your website
- [ ] Open Google Analytics → Realtime
- [ ] See your visit appear
- [ ] Check that page views are tracked

### Facebook Pixel Verification:
- [ ] Install Facebook Pixel Helper
- [ ] Visit your website
- [ ] See green checkmark in extension
- [ ] Check Events Manager for events

---

## 4. Setting Up Conversion Goals

### Google Analytics 4 Conversions:
1. Go to **Admin** → **Events**
2. Mark events as conversions:
   - `form_submit` (contact form submissions)
   - `phone_click` (phone number clicks)
   - `email_click` (email clicks)
   - `consultation_booked` (consultation bookings)

### Facebook Pixel Conversions:
1. Go to **Events Manager** → **Overview**
2. Set up custom events:
   - `Lead` (form submissions)
   - `Contact` (phone/email clicks)
   - `Schedule` (consultation bookings)

---

## 5. Environment Variables (Optional but Recommended)

Create a `.env` file in your project root:

```env
# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=123456789012345

# Enable analytics (true/false)
VITE_ENABLE_ANALYTICS=true
```

**Note**: Add `.env` to `.gitignore` to keep your IDs private!

---

## 6. Current Status

✅ **Code Updated**: Analytics code now uses config file  
✅ **Phone Number Updated**: Phone number updated in structured data  
⚠️ **Action Required**: Update `src/config/analytics.js` with your actual IDs  
⚠️ **Action Required**: Verify social media URLs in structured data

---

## 7. Next Steps

1. ✅ Update `src/config/analytics.js` with your actual IDs
2. ✅ Verify social media URLs in `index.html`
3. ✅ Test analytics in production
4. ✅ Set up conversion goals
5. ✅ Monitor analytics data

---

## 8. Troubleshooting

### Analytics Not Working?
- Check browser console for errors
- Verify IDs are correct (no extra spaces)
- Check ad blockers (may block pixels)
- Verify you're using production build

### Pixel Not Firing?
- Check Facebook Pixel Helper extension
- Verify Pixel ID is correct
- Check Events Manager for errors
- Clear browser cache

### GA4 Not Tracking?
- Check Measurement ID format (must start with `G-`)
- Verify realtime reports
- Check Google Tag Assistant
- Clear browser cache

---

## 📞 Need Help?

- [Google Analytics Help Center](https://support.google.com/analytics)
- [Facebook Pixel Help](https://www.facebook.com/business/help)
- Check the config file comments for more info

---

**Last Updated**: 2024



