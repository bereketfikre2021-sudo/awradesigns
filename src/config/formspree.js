// Formspree Configuration
// Replace these with your actual Formspree form IDs

export const FORMSPREE_ENDPOINTS = {
  // Main contact form
  CONTACT: 'https://formspree.io/f/mrbykzlb',
  
  // Booking consultation form
  BOOKING: 'https://formspree.io/f/mrbykzlb',
  
  // Newsletter subscription form
  NEWSLETTER: 'https://formspree.io/f/mrbykzlb',
  
  // Get started form
  GET_STARTED: 'https://formspree.io/f/mrbykzlb',
  
  // Secure form
  SECURE: 'https://formspree.io/f/mrbykzlb',
  
  // Quote calculator form
  QUOTE: 'https://formspree.io/f/mrbykzlb'
};

// Formspree configuration options
export const FORMSPREE_CONFIG = {
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Default subject prefix
  subjectPrefix: 'Awra Finishing - ',
  
  // Auto-reply settings
  autoReply: true,
  
  // Spam protection
  spamProtection: true,
  
  // Honeypot field (Formspree will ignore submissions with this field filled)
  honeypot: '_gotcha'
};

// Helper function to get the correct endpoint based on form type
export const getFormspreeEndpoint = (formType) => {
  return FORMSPREE_ENDPOINTS[formType.toUpperCase()] || FORMSPREE_ENDPOINTS.CONTACT;
};

// Helper function to prepare form data for Formspree
export const prepareFormspreeData = (formData, formType, additionalFields = {}) => {
  const baseData = {
    ...formData,
    ...additionalFields,
    _subject: `${FORMSPREE_CONFIG.subjectPrefix}${formType} Form Submission`,
    _replyto: formData.email || formData._replyto,
    _cc: formData.email || formData._cc,
    _gotcha: '', // Honeypot field
    _format: 'json' // Request JSON response
  };
  
  return baseData;
};

export default {
  FORMSPREE_ENDPOINTS,
  FORMSPREE_CONFIG,
  getFormspreeEndpoint,
  prepareFormspreeData
};
