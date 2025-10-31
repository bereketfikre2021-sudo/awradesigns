# Tawk.to Live Chat Setup Guide

## Quick Setup Steps

### 1. Sign Up for Tawk.to
1. Go to [https://www.tawk.to](https://www.tawk.to)
2. Click "Sign Up Free"
3. Create your account (it's completely free!)

### 2. Get Your Property ID and Widget ID

After signing up:

1. **Log into your Tawk.to dashboard**
2. **Go to Administration** (top menu)
3. **Click "Channels"** → **"Chat Widget"**
4. You'll see your **Property ID** and **Widget ID** on the page
   - Property ID format: Usually starts with numbers (e.g., `1234567890`)
   - Widget ID format: Usually a shorter code (e.g., `abc123`)

### 3. Configure in Your Project

You have two options:

#### **Option A: Direct Replacement (Simple)**
1. Open `index.html`
2. Find lines 411-412
3. Replace the placeholder values:
   ```javascript
   var propertyId = 'YOUR_ACTUAL_PROPERTY_ID';
   var widgetId = 'YOUR_ACTUAL_WIDGET_ID';
   ```

#### **Option B: Environment Variables (Recommended)**
1. Create or edit `.env` file in your project root
2. Add your Tawk.to IDs:
   ```env
   VITE_TAWK_PROPERTY_ID=your_property_id_here
   VITE_TAWK_WIDGET_ID=your_widget_id_here
   ```
3. Update `index.html` to use environment variables (requires build-time replacement)

### 4. Verify It's Working

1. Save your changes
2. Restart your development server (`npm run dev`)
3. Visit your website
4. You should see the Tawk.to chat widget in the bottom-right corner

## Example Configuration

If your Property ID is `1234567890` and Widget ID is `abc123`, update the code like this:

```javascript
var propertyId = '1234567890';
var widgetId = 'abc123';
```

## Customization

After setup, you can customize the chat widget:

1. Go to **Administration** → **Channels** → **Chat Widget**
2. Customize:
   - Colors (match your brand - black and yellow)
   - Widget position
   - Welcome messages
   - Operating hours
   - Offline messages
   - And much more!

## Troubleshooting

### Chat widget not showing?
- ✅ Check that you replaced BOTH IDs correctly
- ✅ Make sure there are no extra spaces or quotes
- ✅ Clear your browser cache and refresh
- ✅ Check browser console for any errors
- ✅ Verify the IDs are correct in your Tawk.to dashboard

### Chat widget shows but offline?
- Configure your availability in Tawk.to dashboard
- Set up offline messages
- Add team members who can respond

## Support

- **Tawk.to Documentation**: [https://help.tawk.to](https://help.tawk.to)
- **Tawk.to Support**: Available through their dashboard

## Current Status

⚠️ **Action Required**: Replace placeholder IDs in `index.html` (lines 411-412) with your actual Tawk.to Property ID and Widget ID.

Once configured, the chat widget will automatically appear on your website!

