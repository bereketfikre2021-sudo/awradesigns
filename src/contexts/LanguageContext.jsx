import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language configurations
const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  am: {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    direction: 'ltr',
    flag: '🇪🇹'
  }
};

// Translation keys
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    services: 'Services',
    works: 'Portfolio',
    pricing: 'Pricing',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'The Future of Interior Design',
    heroSubtitle: 'Professional architectural design, interior planning, finishing work, and branding services',
    startProject: 'Start Your Project',
    bookConsultation: 'Book Consultation',
    
    // Services
    architecturalDesign: 'Architectural Design',
    interiorPlanning: 'Interior Planning',
    finishingWork: 'Finishing Work',
    brandingServices: 'Branding Services',
    
    // About
    aboutTitle: 'About Awra Designs',
    aboutSubtitle: 'Transforming spaces with innovative design solutions',
    experience: 'Years of Experience',
    projects: 'Completed Projects',
    clients: 'Happy Clients',
    
    // Contact
    contactTitle: 'Get In Touch',
    contactSubtitle: 'Ready to transform your space? Let\'s discuss your project',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // Common
    learnMore: 'Learn More',
    getQuote: 'Get Quote',
    viewProject: 'View Project',
    readMore: 'Read More',
    close: 'Close',
    loading: 'Loading...',
    
    // AI Chatbot
    aiAssistant: 'AI Design Assistant',
    aiWelcome: 'Hello! I\'m your AI design assistant. How can I help you today?',
    
    // Client Portal
    clientPortal: 'Client Portal',
    dashboard: 'Dashboard',
    clientProjects: 'Projects',
    files: 'Files',
    messages: 'Messages',
    invoices: 'Invoices',
    
    // Notifications
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    
    // Performance
    performance: 'Performance',
    performanceMonitor: 'Performance Monitor'
  },
  
  am: {
    // Navigation
    home: 'ቤት',
    about: 'ስለ እኛ',
    services: 'አገልግሎቶች',
    works: 'ስራዎች',
    pricing: 'ዋጋ',
    contact: 'አግኙን',
    
    // Hero Section
    heroTitle: 'የውስጥ ዲዛይን ወደፊት',
    heroSubtitle: 'የሙያዊ የህንፃ ዲዛይን፣ የውስጥ እቅድ፣ የመጨረሻ ስራ እና የምልክት አገልግሎቶች',
    startProject: 'ፕሮጀክትዎን ይጀምሩ',
    bookConsultation: 'ምክክር ይያዙ',
    
    // Services
    architecturalDesign: 'የህንፃ ዲዛይን',
    interiorPlanning: 'የውስጥ እቅድ',
    finishingWork: 'የመጨረሻ ስራ',
    brandingServices: 'የምልክት አገልግሎቶች',
    
    // About
    aboutTitle: 'ስለ አውራ ዲዛይን',
    aboutSubtitle: 'ቦታዎችን በፈጠራ ዲዛይን መፍትሄዎች መለወጥ',
    experience: 'የልምድ ዓመታት',
    projects: 'የተጠናቀቁ ፕሮጀክቶች',
    clients: 'ደስተኛ ደንበኞች',
    
    // Contact
    contactTitle: 'አግኙን',
    contactSubtitle: 'ቦታዎን ለመለወጥ ዝግጁ ነዎት? ፕሮጀክትዎን እንወያይ',
    name: 'ስም',
    email: 'ኢሜይል',
    phone: 'ስልክ',
    message: 'መልዕክት',
    sendMessage: 'መልዕክት ላክ',
    
    // Common
    learnMore: 'ተጨማሪ ይማሩ',
    getQuote: 'ዋጋ ያግኙ',
    viewProject: 'ፕሮጀክት ይመልከቱ',
    readMore: 'ተጨማሪ ያንብቡ',
    close: 'ዝጋ',
    loading: 'በመጫን ላይ...',
    
    // AI Chatbot
    aiAssistant: 'AI ዲዛይን ረዳት',
    aiWelcome: 'ሰላም! የእርስዎ AI ዲዛይን ረዳት ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ?',
    
    // Client Portal
    clientPortal: 'የደንበኛ ፖርታል',
    dashboard: 'ዳሽቦርድ',
    clientProjects: 'ፕሮጀክቶች',
    files: 'ፋይሎች',
    messages: 'መልዕክቶች',
    invoices: 'ክፍያ ማስረጃዎች',
    
    // Notifications
    notifications: 'ማሳወቂያዎች',
    enableNotifications: 'ማሳወቂያዎችን ይክፈቱ',
    
    // Performance
    performance: 'አፈጻጸም',
    performanceMonitor: 'የአፈጻጸም አስተባባሪ'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    setIsRTL(languages[savedLanguage]?.direction === 'rtl');
    
    // Update document direction and language
    document.documentElement.dir = languages[savedLanguage]?.direction || 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  // Update document when language changes
  useEffect(() => {
    document.documentElement.dir = languages[currentLanguage]?.direction || 'ltr';
    document.documentElement.lang = currentLanguage;
    setIsRTL(languages[currentLanguage]?.direction === 'rtl');
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const getCurrentLanguage = () => {
    return languages[currentLanguage];
  };

  const getAvailableLanguages = () => {
    return Object.values(languages);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isRTL,
    getCurrentLanguage,
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
