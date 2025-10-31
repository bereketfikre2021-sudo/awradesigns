/**
 * Site Configuration
 * Update these values with your actual business information
 */

export const siteConfig = {
  // Business Information
  business: {
    name: 'Awra Finishing & Interior',
    shortName: 'Awra Designs',
    tagline: 'Creating exceptional architectural spaces and compelling brands',
    description: 'Professional architectural design, interior planning, finishing work, and branding services in Addis Ababa, Ethiopia.',
    url: 'https://awradesigns.com',
  },

  // Contact Information
  contact: {
    phone: '+251-92-381-4125', // Format: +251-XX-XXX-XXXX
    phoneDisplay: '0923814125', // Display format
    email: 'info@awradesigns.com', // Replace with actual email
    address: {
      street: 'Addis Ababa', // Add street address if available
      city: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1000', // Add actual postal code if available
    },
    coordinates: {
      latitude: 9.1450,
      longitude: 38.7756,
    },
    openingHours: 'Mo-Fr 08:00-18:00',
    priceRange: '$$',
  },

  // Social Media Links
  // IMPORTANT: Verify and update these URLs with your actual social media profiles
  // These URLs are used in:
  // - index.html structured data (sameAs property)
  // - Footer social media icons (if implemented)
  // - Social sharing buttons
  // 
  // To verify:
  // 1. Visit each URL to ensure it's correct
  // 2. Update if URLs have changed
  // 3. Add missing social media profiles if available
  social: {
    facebook: 'https://www.facebook.com/awradesigns', // ⚠️ VERIFY: Visit this URL and confirm it's correct
    instagram: 'https://www.instagram.com/awradesigns', // ⚠️ VERIFY: Visit this URL and confirm it's correct
    linkedin: 'https://www.linkedin.com/company/awra-designs', // ⚠️ VERIFY: Visit this URL and confirm it's correct
    twitter: '', // Add your Twitter/X URL if you have one
    youtube: '', // Add your YouTube URL if you have one
    pinterest: '', // Add your Pinterest URL if you have one
  },

  // SEO Information
  seo: {
    defaultTitle: 'Awra Finishing & Interior - Professional Architecture & Design in Addis Ababa',
    defaultDescription: 'Transform your space with professional architectural design, interior planning, and premium finishing work in Addis Ababa, Ethiopia. 5+ years experience, 100+ completed projects.',
    defaultKeywords: 'architectural design Ethiopia, interior design Addis Ababa, finishing work, branding services, 3D visualization, AR design, construction Ethiopia, home renovation, office design, commercial design',
    defaultImage: '/images/Hero BG.webp',
    author: 'Awra Finishing & Interior',
    locale: 'en_US',
    siteName: 'Awra Finishing & Interior',
  },

  // Business Details
  businessDetails: {
    foundingDate: '2018',
    numberOfEmployees: '10-20',
    experience: '5+ years',
    projectsCompleted: '100+',
    serviceArea: {
      primary: 'Addis Ababa, Ethiopia',
      secondary: 'Ethiopia', // If you serve other areas
    },
  },
};

export default siteConfig;

