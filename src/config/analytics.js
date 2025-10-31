/**
 * Analytics & Tracking Configuration
 * 
 * IMPORTANT: Replace placeholders with your actual tracking IDs
 * 
 * To get your tracking IDs:
 * 1. Google Analytics 4: https://analytics.google.com
 *    - Create property → Admin → Data Streams → Measurement ID (G-XXXXXXXXXX)
 * 
 * 2. Facebook Pixel: https://business.facebook.com
 *    - Events Manager → Data Sources → Pixels → Pixel ID
 * 
 * For security, these values can also be set via environment variables:
 * - VITE_GA_MEASUREMENT_ID
 * - VITE_FB_PIXEL_ID
 */

// Google Analytics 4 Measurement ID
// Format: G-XXXXXXXXXX
// Replace with your actual GA4 Measurement ID
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';

// Facebook Pixel ID
// Format: 15-digit number (e.g., 123456789012345)
// Replace with your actual Facebook Pixel ID
export const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || 'YOUR_PIXEL_ID';

// Check if analytics should be enabled (useful for development)
export const ANALYTICS_ENABLED = import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Additional analytics configuration
export const analyticsConfig = {
  // Enable automatic page view tracking
  autoPageView: true,
  
  // Enable automatic event tracking
  autoEvents: true,
  
  // Custom dimensions (if configured in GA4)
  customDimensions: {
    // Add custom dimension indices here
    // Example: userId: 1, userType: 2
  },
  
  // Debug mode (for development)
  debug: import.meta.env.DEV,
};

export default {
  GA_MEASUREMENT_ID,
  FB_PIXEL_ID,
  ANALYTICS_ENABLED,
  analyticsConfig,
};




