import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDevice, usePerformance, useAnimatedInView, useLazyLoading, useLazyImage, useSEO, usePerformanceMonitoring } from './hooks';
import { utils } from './utils';
import { preloadCriticalResources, prefetchResources, optimizeForConnection } from './utils/resourceLoader';
import { initResponsiveTesting } from './utils/responsiveTest';
import LazyImage from './components/LazyImage';
import LazySection from './components/LazySection';
import { ThemeToggle, useTheme } from './contexts/ThemeContext.jsx';
import { HoverGlow, RippleButton, ScrollAnimation } from './components/MicroInteractions.jsx';
import WhyChooseUsLight from './components/WhyChooseUsLight.jsx';
import './App.css';
import './styles/WhyChooseUsLight.css';
import './styles/responsive-enhancements.css';

// Lazy load heavy components (commented out to avoid import errors)
// const ThreeDScene = lazy(() => import('./components/ThreeDScene'));
// const ARViewer = lazy(() => import('./components/ARViewer'));
// const RoomConfigurator = lazy(() => import('./components/RoomConfigurator'));
// const AIChatbot = lazy(() => import('./components/AIChatbot'));
// const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));


export default function App() {
  const [navSolid, setNavSolid] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const { theme } = useTheme();
  
  // Dynamic meta titles and descriptions for SEO
  const getPageMeta = (section) => {
    const metaData = {
      home: {
        title: "Awra Finishing & Interior - Professional Architecture & Design in Addis Ababa",
        description: "Transform your space with professional architectural design, interior planning, and premium finishing work in Addis Ababa, Ethiopia. 5+ years experience, 100+ completed projects."
      },
      about: {
        title: "About Awra Designs - Expert Architects & Interior Designers in Ethiopia",
        description: "Learn about Awra Finishing & Interior's story, mission, and expertise in architectural design, interior planning, and premium finishing work across Ethiopia."
      },
      'why-choose-us': {
        title: "Why Choose Awra Designs? - What Sets Us Apart in Architecture & Design",
        description: "Discover what makes Awra Designs different: 5+ years experience, unique design philosophy, client-centered approach, premium quality, and local expertise in Ethiopia."
      },
      services: {
        title: "Our Services - Architectural Design, Interior Planning & Finishing Work",
        description: "Comprehensive architectural design, interior planning, premium finishing work, and branding services in Addis Ababa. From concept to completion."
      },
      works: {
        title: "Our Portfolio - Completed Architectural & Interior Design Projects",
        description: "Explore our portfolio of completed architectural and interior design projects across Ethiopia. See our expertise in residential, commercial, and office design."
      },
      pricing: {
        title: "Pricing & Packages - Affordable Architecture & Interior Design Services",
        description: "Transparent pricing for architectural design, interior planning, and finishing work. Flexible payment options and detailed quotes for all projects in Ethiopia."
      },
      contact: {
        title: "Contact Awra Designs - Get Your Free Consultation Today",
        description: "Ready to start your project? Contact Awra Finishing & Interior for a free consultation. Professional architectural and interior design services in Addis Ababa."
      }
    };
    return metaData[section] || metaData.home;
  };
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    service: '',
    area: '',
    complexity: 'medium',
    timeline: 'normal'
  });
  
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  // SEO and Performance monitoring
  const currentMeta = getPageMeta(currentSection);
  useSEO(
    currentMeta.title,
    currentMeta.description,
    "architectural design Ethiopia, interior design Addis Ababa, finishing work, branding services, 3D visualization, AR design, construction Ethiopia, home renovation, office design, commercial design",
    "/images/hero-image.webp"
  );
  
  const performanceMetrics = usePerformanceMonitoring();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showContactDropdown && !event.target.closest('.nav-cta-dropdown')) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactDropdown]);


  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    description: ''
  });
  
  const [newsletterForm, setNewsletterForm] = useState({
    email: ''
  });
  
  const [getStartedForm, setGetStartedForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Form submission states
  const [formSubmissions, setFormSubmissions] = useState({
    contact: { status: 'idle', message: '' },
    booking: { status: 'idle', message: '' },
    newsletter: { status: 'idle', message: '' },
    getStarted: { status: 'idle', message: '' }
  });

  // Beautiful Modal System
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', 'error'
    icon: 'ℹ️'
  });

  // Using brand colors (black & yellow) - no theme switching needed
  const device = useDevice();
  const performance = usePerformance();
  const { ref: heroRef, inView: heroInView } = useAnimatedInView(0.3);

  // Advanced scroll handling with performance optimization
  useEffect(() => {
    const handleScroll = utils.throttle(() => {
      setNavSolid(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
      
      // Update current section based on scroll position
      const sections = ['home', 'about', 'services', 'works', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    }, 16); // 60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (performance.frameRate < 20) {
      // Very low frame rate detected - could reduce visual effects if needed
      // console.warn('Very low frame rate detected, reducing visual effects');
    }
  }, [performance.frameRate]);

  // Optimized resource loading with connection-aware prefetching
  useEffect(() => {
    const connectionSettings = optimizeForConnection();
    
    // Always preload critical above-the-fold resources
    preloadCriticalResources();
    
    // Only prefetch additional resources if connection allows
    if (connectionSettings.prefetch) {
      prefetchResources();
    }
    
    // Set hero image as loaded since it's now preloaded
      setHeroImageLoaded(true);
    
    // Initialize responsive testing in development
    initResponsiveTesting();
  }, []);

  // Lazy loading function for images
  const handleImageLoad = (imageSrc) => {
    setLoadedImages(prev => new Set([...prev, imageSrc]));
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  const handleGetStarted = (plan) => {
    setSelectedPlan(plan);
    setShowGetStarted(true);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Quote Calculator
  const calculateQuote = () => {
    const basePrices = {
      'architectural': 150,
      'interior': 100,
      'finishing': 80,
      'branding': 60,
      'full-service': 200
    };

    const complexityMultipliers = {
      'simple': 0.8,
      'medium': 1.0,
      'complex': 1.5
    };

    const timelineMultipliers = {
      'urgent': 1.3,
      'normal': 1.0,
      'flexible': 0.9
    };

    if (!quoteData.service || !quoteData.area) return 0;

    const basePrice = basePrices[quoteData.service] || 100;
    const area = parseFloat(quoteData.area) || 0;
    const complexity = complexityMultipliers[quoteData.complexity] || 1.0;
    const timeline = timelineMultipliers[quoteData.timeline] || 1.0;

    return Math.round(basePrice * area * complexity * timeline);
  };

  const handleQuoteInputChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Form input handlers
  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingFormChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewsletterFormChange = (field, value) => {
    setNewsletterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetStartedFormChange = (field, value) => {
    setGetStartedForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Form submission handlers
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissions(prev => ({
      ...prev,
      contact: { status: 'loading', message: 'Sending message...' }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the data to your backend
      // Form submitted successfully
      
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'success', message: 'Thank you! We\'ll get back to you within 24 hours.' }
      }));
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        projectType: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormSubmissions(prev => ({
          ...prev,
          contact: { status: 'idle', message: '' }
        }));
      }, 5000);
      
    } catch (error) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Sorry, there was an error. Please try again or contact us directly.' }
      }));
    }
  };

  const handleBookingFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissions(prev => ({
      ...prev,
      booking: { status: 'loading', message: 'Booking consultation...' }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Booking form submitted successfully
      
      setFormSubmissions(prev => ({
        ...prev,
        booking: { status: 'success', message: 'Consultation booked! We\'ll confirm your appointment via email.' }
      }));
      
      // Reset form
      setBookingForm({
        name: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        time: '',
        description: ''
      });
      
      // Close modal after success
      setTimeout(() => {
        setShowBookingModal(false);
        setFormSubmissions(prev => ({
          ...prev,
          booking: { status: 'idle', message: '' }
        }));
      }, 3000);
      
    } catch (error) {
      setFormSubmissions(prev => ({
        ...prev,
        booking: { status: 'error', message: 'Booking failed. Please try again or call us directly.' }
      }));
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissions(prev => ({
      ...prev,
      newsletter: { status: 'loading', message: 'Subscribing...' }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Newsletter subscription successful
      
      setFormSubmissions(prev => ({
        ...prev,
        newsletter: { status: 'success', message: 'Successfully subscribed! Check your email for confirmation.' }
      }));
      
      // Reset form
      setNewsletterForm({ email: '' });
      
      // Clear success message after 4 seconds
      setTimeout(() => {
        setFormSubmissions(prev => ({
          ...prev,
          newsletter: { status: 'idle', message: '' }
        }));
      }, 4000);
      
    } catch (error) {
      setFormSubmissions(prev => ({
        ...prev,
        newsletter: { status: 'error', message: 'Subscription failed. Please try again.' }
      }));
    }
  };

  const handleGetStartedFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissions(prev => ({
      ...prev,
      getStarted: { status: 'loading', message: 'Processing request...' }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get Started form submitted successfully
      
      setFormSubmissions(prev => ({
        ...prev,
        getStarted: { status: 'success', message: 'Request submitted! We\'ll contact you soon to discuss your project.' }
      }));
      
      // Reset form
      setGetStartedForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Close modal after success
      setTimeout(() => {
        setShowGetStarted(false);
        setFormSubmissions(prev => ({
          ...prev,
          getStarted: { status: 'idle', message: '' }
        }));
      }, 3000);
      
    } catch (error) {
      setFormSubmissions(prev => ({
        ...prev,
        getStarted: { status: 'error', message: 'Request failed. Please try again or contact us directly.' }
      }));
    }
  };

  // Beautiful Modal Handler
  const showBeautifulModal = (title, message, type = 'info') => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    
    setModalContent({
      title,
      message,
      type,
      icon: icons[type] || 'ℹ️'
    });
    setShowModal(true);
  };

  const pricingPlans = [
    {
      name: "Basic Finishing",
      desc: "Ideal for small projects with essential features",
      oneTime: "50,000 ETB",
      monthly: "5,000 ETB",
      features: ["Basic consultation", "Material selection", "Project timeline"],
      popular: false,
    },
    {
      name: "Standard Interior",
      desc: "Most popular, balanced approach to interior design",
      oneTime: "120,000 ETB",
      monthly: "12,000 ETB",
      features: ["Full design consultation", "3D visualization", "Material sourcing", "Project management"],
      popular: true,
    },
    {
      name: "Premium Design",
      desc: "Full luxury experience with professional design",
      oneTime: "250,000 ETB",
      monthly: "25,000 ETB",
      features: ["Expert design consultation", "3D visualization", "Premium materials", "24/7 support", "Real-time collaboration"],
      popular: false,
    },
  ];

  const projects = [
    {
      id: 1,
      title: "Modern Living Space",
      category: "Interior Design",
      description: "A contemporary living room featuring minimalist design with smart home integration",
      image: "/images/work-samples-1.webp",
      tags: ["3D", "Modern", "Visualization"],
      year: 2024,
      rating: 5,
      isFeatured: true,
    },
    {
      id: 2,
      title: "Luxury Bedroom Suite",
      category: "Interior Design",
      description: "Elegant master bedroom with custom furniture and premium finishes",
      image: "/images/work-samples-2.webp",
      tags: ["Luxury", "Premium", "Finishing"],
      year: 2024,
      rating: 5,
      isFeatured: true,
    },
    {
      id: 3,
      title: "Contemporary Kitchen",
      category: "Interior Design",
      description: "State-of-the-art kitchen with smart appliances and ergonomic design",
      image: "/images/work-samples-3.webp",
      tags: ["Kitchen", "Smart Appliances", "Ergonomic"],
      year: 2023,
      rating: 5,
      isFeatured: false,
    },
    {
      id: 4,
      title: "Executive Office",
      category: "Interior Design",
      description: "Professional workspace designed for productivity and comfort",
      image: "/images/work-samples-4.webp",
      tags: ["Office", "Productivity", "Professional"],
      year: 2023,
      rating: 5,
      isFeatured: false,
    },
    {
      id: 5,
      title: "Outdoor Living Space",
      category: "Exterior Design",
      description: "Beautiful outdoor area with modern furniture and landscape design",
      image: "/images/work-samples-7.webp",
      tags: ["3D", "Visualization", "Modern"],
      year: 2023,
      rating: 5,
      isFeatured: false,
    },
    {
      id: 6,
      title: "Corporate Brand Identity",
      category: "Branding",
      description: "Complete brand identity design including logo, color palette, and visual guidelines for a tech startup",
      image: "/images/work-samples-8.webp",
      tags: ["Branding", "Identity", "Logo"],
      year: 2024,
      rating: 4.9,
      isFeatured: true,
    }
  ];

  // Filter projects based on active filter
  const filteredProjects = projects.filter(project => {
    switch (activeFilter) {
      case 'All':
        return true;
      case '3D':
        return project.tags.includes('3D') || project.tags.includes('Visualization') || project.tags.includes('Modern');
      case 'Interior':
        return project.category === 'Interior Design';
      case 'Finishing':
        return project.tags.includes('Premium') || project.tags.includes('Luxury') || project.tags.includes('Finishing');
      case 'Branding':
        return project.tags.includes('Branding') || project.tags.includes('Identity') || project.tags.includes('Design');
      default:
        return true;
    }
  });

  const springProps = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0px)' : 'translateY(50px)',
  });

  if (isLoading) {
  return (
      <div className="loading-screen">
        <div className="loading-content">
          <motion.div
            className="loading-logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src={theme === 'dark' ? "/images/LOGO-1.png" : "/images/LOGO-2.png"} 
              alt="Awra Finishing & Interior - Professional Architecture and Design Company Logo"
              onError={(e) => {
                e.target.src = theme === 'dark' ? "/images/LOGO-2.png" : "/images/LOGO-1.png";
              }}
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading the Future of Interior Design...
          </motion.h2>
          <div className="loading-bar">
            <motion.div
              className="loading-progress"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Helmet>
        <title>{getPageMeta(currentSection).title}</title>
        <meta name="description" content={getPageMeta(currentSection).description} />
        <meta name="keywords" content="architectural design Ethiopia, interior design Addis Ababa, finishing work, branding services, 3D visualization, AR design, construction Ethiopia, home renovation, office design, commercial design, Awra Designs, professional architects, premium finishing, local expertise" />
        <meta name="author" content="Awra Finishing & Interior" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`https://awradesigns.com#${currentSection}`} />
        <meta name="language" content="English" />
        <meta name="geo.region" content="ET-AA" />
        <meta name="geo.placename" content="Addis Ababa" />
        <meta name="geo.position" content="9.1450;38.7756" />
        <meta name="ICBM" content="9.1450, 38.7756" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://awradesigns.com#${currentSection}`} />
        <meta property="og:title" content={getPageMeta(currentSection).title} />
        <meta property="og:description" content={getPageMeta(currentSection).description} />
        <meta property="og:image" content="/images/hero-image.webp" />
        <meta property="og:image:alt" content="Awra Finishing & Interior - Professional Architecture & Design Services" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Awra Finishing & Interior" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:author" content="Awra Finishing & Interior" />
        <meta property="article:publisher" content="https://awradesigns.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://awradesigns.com#${currentSection}`} />
        <meta name="twitter:title" content={getPageMeta(currentSection).title} />
        <meta name="twitter:description" content={getPageMeta(currentSection).description} />
        <meta name="twitter:image" content="/images/hero-image.webp" />
        <meta name="twitter:image:alt" content="Awra Finishing & Interior - Professional Architecture & Design Services" />
        <meta name="twitter:creator" content="@awradesigns" />
        <meta name="twitter:site" content="@awradesigns" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Awra Finishing & Interior",
            "description": "Professional architectural design, interior planning, finishing work, and branding services",
            "url": "https://awradesigns.com",
            "telephone": "+251923814125",
            "email": "info@awradesigns.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Bole",
              "addressLocality": "Addis Ababa",
              "addressCountry": "Ethiopia"
            },
            "openingHours": "Mo-Fr 09:00-18:00,Sa 10:00-16:00",
            "priceRange": "$$",
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 9.0192,
                "longitude": 38.7578
              },
              "geoRadius": "50000"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Design Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Architectural Design"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Interior Design"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Finishing Work"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Branding Services"
                  }
                }
              ]
            }
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://awradesigns.com#home"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentSection.charAt(0).toUpperCase() + currentSection.slice(1).replace('-', ' '),
                "item": `https://awradesigns.com#${currentSection}`
              }
            ]
          })}
        </script>
        
        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Awra Finishing & Interior",
            "alternateName": "Awra Designs",
            "url": "https://awradesigns.com",
            "logo": "https://awradesigns.com/images/LOGO.webp",
            "description": "Professional architectural design, interior planning, finishing work, and branding services in Addis Ababa, Ethiopia",
            "foundingDate": "2019",
            "numberOfEmployees": "5-10",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Bole",
              "addressLocality": "Addis Ababa",
              "addressCountry": "Ethiopia"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+251923814125",
              "contactType": "customer service",
              "email": "info@awradesigns.com",
              "availableLanguage": ["English", "Amharic"]
            },
            "sameAs": [
              "https://web.facebook.com/profile.php?id=100089517497042",
              "https://t.me/AwraDesigns",
              "https://www.tiktok.com/@awrainteriors"
            ]
          })}
        </script>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </script>
        
        {/* Facebook Pixel - Graceful fallback for ad blockers */}
        <script>
          {`
            (function() {
              // Check if ad blocker is likely present
              const isAdBlockerActive = () => {
                try {
                  const testAd = document.createElement('div');
                  testAd.innerHTML = '&nbsp;';
                  testAd.className = 'adsbox';
                  testAd.style.position = 'absolute';
                  testAd.style.left = '-999px';
                  document.body.appendChild(testAd);
                  const isBlocked = testAd.offsetHeight === 0;
                  document.body.removeChild(testAd);
                  return isBlocked;
                } catch (e) {
                  return true;
                }
              };

              // Only attempt to load Facebook Pixel if ad blocker is not detected
              if (!isAdBlockerActive()) {
                try {
                  !function(f,b,e,v,n,t,s) {
                    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
                    t.onerror=function(){console.debug('Facebook Pixel blocked by ad blocker');};
              t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)
                  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            } catch(e) {
                  console.debug('Facebook Pixel initialization failed:', e);
            }
              } else {
                console.debug('Facebook Pixel skipped - ad blocker detected');
              }
            })();
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" />`}
        </noscript>
        
      </Helmet>

      {/* Advanced Navigation */}
      <motion.header 
        className={`nav ${navSolid ? "solid" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-container" id="navigation" role="navigation" aria-label="Main navigation">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <img 
            src={theme === 'dark' ? "/images/LOGO-1.png" : "/images/LOGO-2.png"} 
            alt="Awra Finishing & Interior - Professional Architecture and Design Company Logo" 
            className="logo-img"
            onError={(e) => {
              e.target.src = theme === 'dark' ? "/images/LOGO-2.png" : "/images/LOGO-1.png";
            }}
          />
          
          
          </motion.div>
          
          <nav className="nav-links">
            {['home', 'about', 'services', 'works', 'pricing', 'contact'].map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                className={currentSection === section ? 'active' : ''}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {section === 'testimonials' ? 'Reviews' : 
                 section === 'case-studies' ? 'Case Studies' :
                 section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.a>
            ))}
        </nav>

          <div className="nav-controls">
            <ThemeToggle className="nav-theme-toggle" size="medium" />
            <div className="nav-cta-dropdown">
              <motion.button
                className="btn btn-primary nav-cta"
                onClick={() => setShowContactDropdown(!showContactDropdown)}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <span className="dropdown-arrow">▼</span>
              </motion.button>
              
              <AnimatePresence>
                {showContactDropdown && (
                  <motion.div
                    className="contact-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.a
                      href="tel:+251923814125"
                      className="dropdown-option"
                      whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                      onClick={() => setShowContactDropdown(false)}
                    >
                      <span className="option-icon">📞</span>
                      <span>Call Now</span>
                    </motion.a>
                    
                    <motion.a
                      href="https://wa.me/251923814125"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dropdown-option"
                      whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                      onClick={() => setShowContactDropdown(false)}
                    >
                      <span className="option-icon">💬</span>
                      <span>WhatsApp</span>
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
        </div>
        </div>

      </motion.header>

      {/* Hero Section */}
      <section id="home" className={`hero ${heroImageLoaded ? 'hero-loaded' : ''}`} ref={heroRef} role="main" aria-label="Main content">
        <div id="main-content" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true"></div>
        <animated.div className="hero-content" style={springProps}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-title"
          >
            The Future of
            <span className="gradient-text"> Interior Design</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hero-subtitle"
          >
            Professional architectural design, interior planning, finishing work, and branding services
          </motion.p>
          
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.a
              href="#contact"
              className="btn btn-primary"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Project
            </motion.a>
            
            <motion.button
              className="btn btn-primary"
              onClick={() => setShowBookingModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📅 Book Consultation
            </motion.button>
          </motion.div>

        </animated.div>

      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-header">
              <h2>About Awra Finishing & Interior</h2>
              <p className="about-subtitle">
                We're not just architects and designers – we're creators of exceptional spaces and brands
              </p>
            </div>
            
            <div className="about-story">
              <motion.div 
                className="story-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="story-icon">🏛️</div>
                <h3>Our Story</h3>
                <p>
                  Based in Addis Ababa, Ethiopia, Awra Designs combines traditional craftsmanship 
                  with modern design principles. We believe every space tells a story, and every brand 
                  deserves to stand out with distinctive visual identity.
                </p>
              </motion.div>
              
              <motion.div 
                className="story-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="story-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To transform visions into reality through innovative design solutions. We specialize 
                  in architectural design, interior planning, finishing work, and branding that 
                  exceeds expectations and creates lasting impact.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section - Conditional Rendering */}
      {theme === 'light' ? (
        <WhyChooseUsLight />
      ) : (
        <section id="why-choose-us" className="why-choose-us">
          <div className="why-choose-container">
            {/* Hero Header */}
            <motion.div
              className="why-choose-hero"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="hero-content">
                <motion.div
                  className="hero-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="badge-text">Excellence Defined</span>
                </motion.div>
                
                <motion.h2
                  className="hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Why Choose <span className="gradient-text">Awra Designs</span>?
                </motion.h2>
                
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Where innovation meets tradition, and every project becomes a masterpiece
                </motion.p>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="why-choose-main">
              {/* Left Column - Large Feature */}
              <motion.div
                className="feature-showcase"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="showcase-card">
                  <div className="showcase-header">
                    <div className="showcase-icon">
                      <div className="icon-bg">🎓</div>
                    </div>
                    <div className="showcase-badge">Proven Excellence</div>
                  </div>
                  <h3>5+ Years of Masterful Craftsmanship</h3>
                  <p>
                    With over 5 years of dedicated service, we've transformed 100+ spaces across Ethiopia. 
                    Our journey combines traditional Ethiopian craftsmanship with cutting-edge design principles, 
                    creating timeless spaces that honor heritage while embracing innovation.
                  </p>
                  <div className="showcase-stats">
                    <div className="stat-item">
                      <span className="stat-number">100+</span>
                      <span className="stat-label">Projects Completed</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Happy Clients</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">5+</span>
                      <span className="stat-label">Years Experience</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Feature Grid */}
              <div className="features-grid">
                {/* Design Philosophy */}
                <motion.div
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="feature-icon">
                    <div className="icon-wrapper">🎨</div>
                  </div>
                  <h4>Timeless Design Philosophy</h4>
                  <p>We create spaces that transcend trends, blending functionality with aesthetic perfection to tell your unique story.</p>
                  <div className="feature-highlights">
                    <span className="highlight">Custom Solutions</span>
                    <span className="highlight">Cultural Sensitivity</span>
                  </div>
                </motion.div>

                {/* Quality Excellence */}
                <motion.div
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="feature-icon">
                    <div className="icon-wrapper">⭐</div>
                  </div>
                  <h4>Premium Quality Standards</h4>
                  <p>We source only the finest materials and work with master craftsmen to ensure every detail exceeds expectations.</p>
                  <div className="feature-highlights">
                    <span className="highlight">Premium Materials</span>
                    <span className="highlight">Master Craftsmen</span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Bottom Section - Value Proposition */}
            <motion.div
              className="value-proposition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
            >
              <div className="value-content">
                <div className="value-text">
                  <h3>Transparent Excellence</h3>
                  <p>
                    No hidden costs, no surprises. We provide detailed quotes upfront with flexible payment options, 
                    delivering exceptional value without compromising on quality or craftsmanship.
                  </p>
                </div>
                <div className="value-features">
                  <div className="value-item">
                    <div className="value-icon">💰</div>
                    <span>Fair & Transparent Pricing</span>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">📋</div>
                    <span>Detailed Upfront Quotes</span>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">💳</div>
                    <span>Flexible Payment Plans</span>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">🛡️</div>
                    <span>Quality Guarantee</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section id="services" className="services">
        <motion.div
          className="services-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="services-header">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Professional Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Comprehensive design and construction services tailored to your needs
            </motion.p>
          </div>
          
          <div className="services-grid">
            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-header">
              <div className="service-icon">🏗️</div>
                <div className="service-badge">Most Popular</div>
              </div>
              <h3>Architectural Design</h3>
              <p>Complete building design from concept to construction drawings. We handle structural planning, space optimization, and regulatory compliance.</p>
              <ul className="service-features">
                <li>✓ Building design & planning</li>
                <li>✓ Structural engineering</li>
                <li>✓ Regulatory compliance</li>
                <li>✓ 3D visualization</li>
                <li>✓ Construction drawings</li>
              </ul>
              <div className="service-pricing">
                <span className="price">From 80,000 ETB</span>
                <span className="duration">2-4 months</span>
              </div>
              <button 
                className="service-btn"
                onClick={() => setShowQuoteCalculator(true)}
              >
                Get Quote
              </button>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-header">
              <div className="service-icon">🎨</div>
              </div>
              <h3>Interior Design</h3>
              <p>Transform your spaces with functional layouts, material selection, lighting design, and furniture planning for optimal living and working environments.</p>
              <ul className="service-features">
                <li>✓ Space planning & layout</li>
                <li>✓ Color scheme design</li>
                <li>✓ Furniture selection</li>
                <li>✓ Lighting design</li>
                <li>✓ Material sourcing</li>
              </ul>
              <div className="service-pricing">
                <span className="price">From 50,000 ETB</span>
                <span className="duration">2-6 weeks</span>
              </div>
              <button 
                className="service-btn"
                onClick={() => setShowQuoteCalculator(true)}
              >
                Get Quote
              </button>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-header">
              <div className="service-icon">✨</div>
              </div>
              <h3>Finishing Work</h3>
              <p>Premium construction finishing including flooring, painting, tiling, carpentry, and detailed craftsmanship to bring designs to life.</p>
              <ul className="service-features">
                <li>✓ Flooring installation</li>
                <li>✓ Painting & wall finishes</li>
                <li>✓ Tiling & stone work</li>
                <li>✓ Custom carpentry</li>
                <li>✓ Quality assurance</li>
              </ul>
              <div className="service-pricing">
                <span className="price">From 30,000 ETB</span>
                <span className="duration">1-3 weeks</span>
              </div>
              <button 
                className="service-btn"
                onClick={() => setShowQuoteCalculator(true)}
              >
                Get Quote
              </button>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-header">
              <div className="service-icon">🎯</div>
              </div>
              <h3>Brand Identity</h3>
              <p>Create distinctive brand identities, logos, and visual communication systems for businesses, including signage and environmental graphics.</p>
              <ul className="service-features">
                <li>✓ Logo design</li>
                <li>✓ Brand guidelines</li>
                <li>✓ Business cards & stationery</li>
                <li>✓ Signage design</li>
                <li>✓ Marketing materials</li>
              </ul>
              <div className="service-pricing">
                <span className="price">From 25,000 ETB</span>
                <span className="duration">1-2 weeks</span>
              </div>
              <button 
                className="service-btn"
                onClick={() => setShowQuoteCalculator(true)}
              >
                Get Quote
              </button>
            </motion.div>
          </div>

          {/* Process Section */}
          <motion.div
            className="services-process"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3>Our Process</h3>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">01</div>
                <h4>Consultation</h4>
                <p>Understanding your vision and requirements</p>
                  </div>
              <div className="process-step">
                <div className="step-number">02</div>
                <h4>Design</h4>
                <p>Creating detailed plans and 3D visualizations</p>
                  </div>
              <div className="process-step">
                <div className="step-number">03</div>
                <h4>Execution</h4>
                <p>Professional implementation with quality assurance</p>
                </div>
              <div className="process-step">
                <div className="step-number">04</div>
                <h4>Delivery</h4>
                <p>Final inspection and project handover</p>
                </div>
        </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Works Section with Advanced Gallery */}
      <section id="works" className="works">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Revolutionary Projects
        </motion.h2>
        
        <div className="works-filter">
          {['All', '3D', 'Interior', 'Finishing', 'Branding'].map((filter) => (
            <motion.button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </div>
        
        <div className="works-grid">
          <AnimatePresence key={activeFilter}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`work-card ${project.isFeatured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                whileHover={{ y: -10, scale: 1.02 }}
              >
              <div className="work-image">
                <LazyImage 
                  src={project.image} 
                  alt={`${project.title} - ${project.category} project by Awra Designs`}
                  placeholder="Loading project image..."
                  threshold={0.1}
                  rootMargin="50px"
                />
                <div className="work-overlay">
                </div>
                {project.isFeatured && <div className="featured-badge">⭐ Featured</div>}
              </div>
              
              <div className="work-info">
                <div className="work-meta">
                  <span className="category">{project.category}</span>
                  <span className="year">{project.year}</span>
                  <div className="rating">
                    {'★'.repeat(project.rating)}
                  </div>
                </div>
                
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                
                <div className="work-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Choose Your Innovation Level
        </motion.h2>
        
        <motion.div 
          className="pricing-toggle"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className={!monthly ? 'active' : ''}>One-Time</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={monthly}
              onChange={() => setMonthly(!monthly)}
            />
            <span className="slider" />
          </label>
          <span className={monthly ? 'active' : ''}>Monthly</span>
        </motion.div>
        
        <motion.div
          className="quote-calculator-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>Need a custom quote? Use our instant calculator!</p>
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowQuoteCalculator(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💰 Get Instant Quote
          </motion.button>
        </motion.div>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`price-card ${plan.popular ? "popular" : ""}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {plan.popular && <div className="badge">Most Popular</div>}
              
              <div className="price-header">
              <h3>{plan.name}</h3>
              <p>{plan.desc}</p>
                <div className="price">
                  <span className="amount">{monthly ? plan.monthly : plan.oneTime}</span>
                  {monthly && <span className="period">/month</span>}
                </div>
              </div>
              
              <div className="price-features">
                {plan.features.map((feature, featureIdx) => (
                  <div key={featureIdx} className="feature">
                    <span className="check">✓</span>
                    <span>{feature}</span>
            </div>
                ))}
            </div>
              
              <motion.button
                className="btn btn-primary"
                onClick={() => handleGetStarted(plan)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <LazySection 
        className="case-studies" 
        id="case-studies"
        threshold={0.1}
        rootMargin="100px"
      >
        <motion.div
          className="case-studies-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Project Case Studies</h2>
          <p>Explore our successful projects and see how we transform spaces</p>
          
          <div className="case-studies-grid">
            <motion.div
              className="case-study-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="case-study-image">
                <LazyImage 
                  src="/images/work-samples-1.webp" 
                  alt="Modern office interior design with contemporary furniture, glass partitions, and professional lighting - Awra Designs portfolio"
                  placeholder="Loading case study..."
                  threshold={0.1}
                  rootMargin="100px"
                  onLoad={() => {
                    handleImageLoad("/images/work-samples-1.webp");
                  }}
                />
                <div className="case-study-overlay">
                  <span className="case-study-category">Office Design</span>
                </div>
              </div>
              <div className="case-study-content">
                <h3>Tech Solutions Ethiopia Office</h3>
                <p className="case-study-description">Complete office transformation for a growing tech company. We redesigned the workspace to promote collaboration and productivity.</p>
                <div className="case-study-details">
                  <div className="detail-item">
                    <span className="detail-label">Project Type:</span>
                    <span className="detail-value">Interior Design</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">6 weeks</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Budget:</span>
                    <span className="detail-value">150,000 ETB</span>
                  </div>
                </div>
                <div className="case-study-challenges">
                  <h4>Challenges:</h4>
                  <ul>
                    <li>Limited space for 25 employees</li>
                    <li>Need for flexible meeting areas</li>
                    <li>Budget constraints</li>
                  </ul>
                </div>
                <div className="case-study-solutions">
                  <h4>Solutions:</h4>
                  <ul>
                    <li>Open-plan layout with modular furniture</li>
                    <li>Convertible meeting spaces</li>
                    <li>Smart storage solutions</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="case-study-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="case-study-image">
                <LazyImage 
                  src="/images/work-samples-2.webp" 
                  alt="Luxury residential interior design featuring elegant living space with premium finishes, modern furniture, and sophisticated lighting - Awra Designs"
                  placeholder="Loading case study..."
                  threshold={0.1}
                  rootMargin="100px"
                  onLoad={() => {
                    handleImageLoad("/images/work-samples-2.webp");
                  }}
                />
                <div className="case-study-overlay">
                  <span className="case-study-category">Residential</span>
                </div>
              </div>
              <div className="case-study-content">
                <h3>Bole Luxury Villa</h3>
                <p className="case-study-description">Complete architectural design and interior finishing for a luxury villa in Bole. Modern design with traditional Ethiopian elements.</p>
                <div className="case-study-details">
                  <div className="detail-item">
                    <span className="detail-label">Project Type:</span>
                    <span className="detail-value">Full Service</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">4 months</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Budget:</span>
                    <span className="detail-value">500,000 ETB</span>
                  </div>
                </div>
                <div className="case-study-challenges">
                  <h4>Challenges:</h4>
                  <ul>
                    <li>Complex site conditions</li>
                    <li>Client's specific cultural requirements</li>
                    <li>Tight construction timeline</li>
                  </ul>
                </div>
                <div className="case-study-solutions">
                  <h4>Solutions:</h4>
                  <ul>
                    <li>3D visualization for client approval</li>
                    <li>Local material sourcing</li>
                    <li>Efficient project management</li>
                  </ul>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </LazySection>

      {/* Team Section */}
      <section id="team" className="team">
        <motion.div
          className="team-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Meet Our Expert Team</h2>
          <p>Professional architects, designers, and craftsmen dedicated to bringing your vision to life</p>
          
          <div className="team-scroll-container">
            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="member-avatar">
                <img 
                  src="/images/team-photos/tesfahun-tsegaye.jpg" 
                  alt="Tesfahun Tsegaye - Founder & Lead Architect"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{display: 'none'}}>👨‍💼</div>
              </div>
              <div className="member-info">
                <h3>Tesfahun Tsegaye</h3>
                <p className="member-role">Founder & Lead Architect</p>
                <p className="member-bio">With over 10 years of experience in architectural design, Tesfahun specializes in modern residential and commercial projects. Certified architect with expertise in sustainable design and 3D visualization.</p>
                <div className="member-skills">
                  <span>Architectural Design</span>
                  <span>3D Visualization</span>
                  <span>Project Management</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="member-avatar">
                <img 
                  src="/images/team-photos/sarah-bekele.jpg" 
                  alt="Sarah Bekele - Senior Interior Designer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{display: 'none'}}>👩‍🎨</div>
              </div>
              <div className="member-info">
                <h3>Sarah Bekele</h3>
                <p className="member-role">Senior Interior Designer</p>
                <p className="member-bio">Passionate about creating functional and beautiful spaces. Sarah brings 8 years of interior design experience with expertise in color theory, space planning, and material selection.</p>
                <div className="member-skills">
                  <span>Interior Design</span>
                  <span>Color Theory</span>
                  <span>Space Planning</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="member-avatar">
                <img 
                  src="/images/team-photos/daniel-haile.jpg" 
                  alt="Daniel Haile - Master Craftsman"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{display: 'none'}}>👨‍🔧</div>
              </div>
              <div className="member-info">
                <h3>Daniel Haile</h3>
                <p className="member-role">Master Craftsman</p>
                <p className="member-bio">Expert in premium finishing work with 12 years of experience. Daniel ensures every detail is perfect, from custom carpentry to high-end finishes and installations.</p>
                <div className="member-skills">
                  <span>Finishing Work</span>
                  <span>Custom Carpentry</span>
                  <span>Quality Control</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="member-avatar">
                <img 
                  src="/images/team-photos/bereket-fikre.jpg" 
                  alt="Bereket Fikre - Expert Graphic Designer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{display: 'none'}}>👨‍🎨</div>
              </div>
              <div className="member-info">
                <h3>Bereket Fikre</h3>
                <p className="member-role">Expert Graphic Designer</p>
                <p className="member-bio">Creative graphic designer with expertise in visual branding, digital design, and marketing materials. Bereket brings innovative design solutions that enhance brand presence and visual communication.</p>
                <div className="member-skills">
                  <span>Graphic Design</span>
                  <span>Brand Identity</span>
                  <span>Digital Marketing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <motion.div
          className="testimonials-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>What Our Clients Say</h2>
          <p>Don't just take our word for it - hear from our satisfied customers</p>
          
          <div className="testimonials-grid">
            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"Awra Designs transformed our office space completely. Their attention to detail and modern approach exceeded our expectations. The 3D visualization helped us see exactly what we were getting before construction started."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img 
                    src="/images/client-photos/michael-tesfaye.jpg" 
                    alt="Michael Tesfaye - CEO, Tech Solutions Ethiopia"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👨‍💼</div>
                </div>
                <div className="author-info">
                  <h4>Michael Tesfaye</h4>
                  <p>CEO, Tech Solutions Ethiopia</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"The AI color generator was amazing! It helped us choose the perfect color scheme for our living room. The team was professional, punctual, and delivered exactly what they promised. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img 
                    src="/images/client-photos/sarah-bekele.jpg" 
                    alt="Sarah Bekele - Homeowner, Bole"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👩‍💼</div>
                </div>
                <div className="author-info">
                  <h4>Sarah Bekele</h4>
                  <p>Homeowner, Bole</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"From architectural design to finishing work, Awra Designs handled everything. Their branding services helped us create a strong visual identity. The project was completed on time and within budget."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img 
                    src="/images/client-photos/daniel-haile.jpg" 
                    alt="Daniel Haile - Restaurant Owner, Kazanchis"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👨‍💻</div>
                </div>
                <div className="author-info">
                  <h4>Daniel Haile</h4>
                  <p>Restaurant Owner, Kazanchis</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* Blog Section */}
      <section id="blog" className="blog">
        <motion.div
          className="blog-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Design Insights & Tips</h2>
          <p>Stay updated with the latest trends in architecture, interior design, and construction</p>
          
          <div className="blog-grid">
            <motion.article
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="blog-image">
                <img 
                  src="/images/work-samples-1.webp" 
                  alt="Modern interior design trends showcasing contemporary office space with clean lines, natural lighting, and minimalist furniture arrangement"
                  loading="eager"
                  onLoad={() => {
                    handleImageLoad("/images/work-samples-1.webp");
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="blog-category">Interior Design</div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">Dec 15, 2024</span>
                  <span className="blog-read-time">5 min read</span>
                </div>
                <h3>Top 10 Interior Design Trends for 2025</h3>
                <p>Discover the latest interior design trends that will dominate 2025, from sustainable materials to smart home integration.</p>
                <div className="blog-tags">
                  <span>Trends</span>
                  <span>2025</span>
                  <span>Modern</span>
                </div>
              </div>
            </motion.article>

            <motion.article
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="blog-image">
                <img 
                  src="/images/work-samples-2.webp" 
                  alt="Architectural planning guide featuring residential building design with modern facade, structural elements, and professional architectural drawings"
                  loading="eager"
                  onLoad={() => {
                    handleImageLoad("/images/work-samples-2.webp");
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="blog-category">Architecture</div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">Dec 10, 2024</span>
                  <span className="blog-read-time">8 min read</span>
                </div>
                <h3>Complete Guide to Architectural Planning in Ethiopia</h3>
                <p>Everything you need to know about architectural planning, permits, and regulations in Ethiopia for your next project.</p>
                <div className="blog-tags">
                  <span>Planning</span>
                  <span>Ethiopia</span>
                  <span>Permits</span>
                </div>
              </div>
            </motion.article>

            <motion.article
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="blog-image">
                <img 
                  src="/images/work-samples-3.webp" 
                  alt="Color psychology in design showcasing interior space with carefully selected color palette, warm lighting, and harmonious color scheme"
                  loading="eager"
                  onLoad={() => {
                    handleImageLoad("/images/work-samples-3.webp");
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="blog-category">Design Tips</div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">Dec 5, 2024</span>
                  <span className="blog-read-time">6 min read</span>
                </div>
                <h3>Color Psychology: How Colors Affect Your Space</h3>
                <p>Learn how different colors can influence mood, productivity, and well-being in your home and office spaces.</p>
                <div className="blog-tags">
                  <span>Colors</span>
                  <span>Psychology</span>
                  <span>Wellness</span>
                </div>
              </div>
            </motion.article>
          </div>
          
          <motion.div
            className="blog-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3>Want More Design Insights?</h3>
            <p>Subscribe to our newsletter for weekly design tips, project showcases, and industry updates.</p>
            <form className="newsletter-signup" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={newsletterForm.email}
                onChange={(e) => handleNewsletterFormChange('email', e.target.value)}
                required
              />
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={formSubmissions.newsletter.status === 'loading'}
                whileHover={{ scale: formSubmissions.newsletter.status === 'loading' ? 1 : 1.05 }}
                whileTap={{ scale: formSubmissions.newsletter.status === 'loading' ? 1 : 0.95 }}
              >
                {formSubmissions.newsletter.status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
              
              {/* Newsletter Status Message */}
              {formSubmissions.newsletter.status !== 'idle' && (
                <div className={`newsletter-status ${formSubmissions.newsletter.status}`}>
                  {formSubmissions.newsletter.status === 'loading' && <span className="loading-spinner">⏳</span>}
                  {formSubmissions.newsletter.status === 'success' && <span className="success-icon">✅</span>}
                  {formSubmissions.newsletter.status === 'error' && <span className="error-icon">❌</span>}
                  {formSubmissions.newsletter.message}
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <motion.div
          className="faq-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions about our services and process</p>
          
          <div className="faq-scroll-container">
            <div className="faq-scroll-content">
            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>What services do you offer?</h3>
              <p>We provide comprehensive architectural design, interior design, premium finishing work, and brand identity services. From initial concept to final execution, we handle every aspect of your project.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>How long does a typical project take?</h3>
              <p>Project timelines vary based on scope and complexity. Small interior design projects typically take 2-4 weeks, while full architectural projects can take 3-6 months. We provide detailed timelines during consultation.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>Do you provide 3D visualizations?</h3>
              <p>Yes! We use advanced 3D visualization technology to help you see your project before construction begins. This includes interactive 3D models, AR previews, and virtual walkthroughs.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>What is your pricing structure?</h3>
              <p>We offer three flexible pricing tiers: Basic Finishing (50,000 ETB), Standard Interior (120,000 ETB), and Premium Design (250,000 ETB). All plans can be paid one-time or monthly.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>Do you work with existing spaces?</h3>
              <p>Absolutely! We specialize in both new construction and renovation projects. Our team can transform existing spaces to meet your needs and preferences.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>How do I get started?</h3>
              <p>Simply contact us through our website, WhatsApp, or phone. We'll schedule a free consultation to discuss your project, requirements, and budget. No obligation required!</p>
            </motion.div>

              {/* Duplicate FAQ items for seamless looping */}
              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3>What services do you offer?</h3>
                <p>We provide comprehensive architectural design, interior design, premium finishing work, and brand identity services. From initial concept to final execution, we handle every aspect of your project.</p>
              </motion.div>

              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3>How long does a typical project take?</h3>
                <p>Project timelines vary based on scope and complexity. Small interior design projects typically take 2-4 weeks, while full architectural projects can take 3-6 months. We provide detailed timelines during consultation.</p>
              </motion.div>

              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3>Do you provide 3D visualizations?</h3>
                <p>Yes! We use advanced 3D visualization technology to help you see your project before construction begins. This includes interactive 3D models, AR previews, and virtual walkthroughs.</p>
              </motion.div>

              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3>What is your pricing structure?</h3>
                <p>We offer three flexible pricing tiers: Basic Finishing (50,000 ETB), Standard Interior (120,000 ETB), and Premium Design (250,000 ETB). All plans can be paid one-time or monthly.</p>
              </motion.div>

              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <h3>Do you work with existing spaces?</h3>
                <p>Absolutely! We specialize in both new construction and renovation projects. Our team can transform existing spaces to meet your needs and preferences.</p>
              </motion.div>

              <motion.div
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h3>How do I get started?</h3>
                <p>Simply contact us through our website, WhatsApp, or phone. We'll schedule a free consultation to discuss your project, requirements, and budget. No obligation required!</p>
              </motion.div>

              {/* Additional duplicate FAQ items for seamless looping */}
            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>What services do you offer?</h3>
              <p>We provide comprehensive architectural design, interior design, premium finishing work, and brand identity services. From initial concept to final execution, we handle every aspect of your project.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>How long does a typical project take?</h3>
              <p>Project timelines vary based on scope and complexity. Small interior design projects typically take 2-4 weeks, while full architectural projects can take 3-6 months. We provide detailed timelines during consultation.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>Do you provide 3D visualizations?</h3>
              <p>Yes! We use advanced 3D visualization technology to help you see your project before construction begins. This includes interactive 3D models, AR previews, and virtual walkthroughs.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>What is your pricing structure?</h3>
              <p>We offer three flexible pricing tiers: Basic Finishing (50,000 ETB), Standard Interior (120,000 ETB), and Premium Design (250,000 ETB). All plans can be paid one-time or monthly.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>Do you work with existing spaces?</h3>
              <p>Absolutely! We specialize in both new construction and renovation projects. Our team can transform existing spaces to meet your needs and preferences.</p>
            </motion.div>

            <motion.div
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>How do I get started?</h3>
              <p>Simply contact us through our website, WhatsApp, or phone. We'll schedule a free consultation to discuss your project, requirements, and budget. No obligation required!</p>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="contact-info">
            <h2>Ready to Transform Your Space?</h2>
            <p>Let our expert design team create your perfect space with professional craftsmanship</p>
            
            <div className="contact-methods">
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+251 923 814 125</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>info@awradesigns.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">💬</div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+251 923 814 125</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Location</h4>
                  <p>Bole, Addis Ababa, Ethiopia</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">🕒</div>
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon-Fri: 9AM-6PM<br/>Sat: 10AM-4PM</p>
                </div>
              </motion.div>
              
            </div>
          </div>
          
          <div className="contact-form">
            <form onSubmit={handleContactFormSubmit}>
              <div className="form-group">
                <label htmlFor="contactName">Your Name</label>
                <input 
                  type="text" 
                  id="contactName" 
                  name="contactName" 
                  placeholder="Your Name" 
                  value={contactForm.name}
                  onChange={(e) => handleContactFormChange('name', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Your Email</label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  name="contactEmail" 
                  placeholder="Your Email" 
                  value={contactForm.email}
                  onChange={(e) => handleContactFormChange('email', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactProjectType">Project Type</label>
                <select 
                  id="contactProjectType" 
                  name="contactProjectType" 
                  value={contactForm.projectType}
                  onChange={(e) => handleContactFormChange('projectType', e.target.value)}
                  required
                >
                  <option value="">Select project type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contactMessage">Project Description</label>
                <textarea 
                  id="contactMessage" 
                  name="contactMessage" 
                  placeholder="Tell us about your vision..." 
                  rows={4} 
                  value={contactForm.message}
                  onChange={(e) => handleContactFormChange('message', e.target.value)}
                  required
                ></textarea>
              </div>
              
              {/* Form Status Message */}
              {formSubmissions.contact.status !== 'idle' && (
                <div className={`form-status ${formSubmissions.contact.status}`}>
                  {formSubmissions.contact.status === 'loading' && <span className="loading-spinner">⏳</span>}
                  {formSubmissions.contact.status === 'success' && <span className="success-icon">✅</span>}
                  {formSubmissions.contact.status === 'error' && <span className="error-icon">❌</span>}
                  {formSubmissions.contact.message}
                </div>
              )}
              
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={formSubmissions.contact.status === 'loading'}
                whileHover={{ scale: formSubmissions.contact.status === 'loading' ? 1 : 1.05 }}
                whileTap={{ scale: formSubmissions.contact.status === 'loading' ? 1 : 0.95 }}
              >
                {formSubmissions.contact.status === 'loading' ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </div>
        </motion.div>
        
      </section>

      {/* Quote Calculator Modal */}
      <AnimatePresence>
        {showQuoteCalculator && (
          <motion.div
            className="quote-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuoteCalculator(false)}
          >
            <motion.div
              className="quote-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="quote-header">
                <h3>Instant Quote Calculator</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowQuoteCalculator(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="quote-body">
                <div className="quote-form">
                  <div className="form-group">
                    <label htmlFor="quoteService">Service Type</label>
                    <select 
                      id="quoteService" 
                      name="quoteService"
                      value={quoteData.service}
                      onChange={(e) => handleQuoteInputChange('service', e.target.value)}
                    >
                      <option value="">Select service</option>
                      <option value="architectural">Architectural Design</option>
                      <option value="interior">Interior Design</option>
                      <option value="finishing">Finishing Work</option>
                      <option value="branding">Branding</option>
                      <option value="full-service">Full Service</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quoteArea">Area (sqm)</label>
                    <input 
                      type="number" 
                      id="quoteArea" 
                      name="quoteArea"
                      value={quoteData.area}
                      onChange={(e) => handleQuoteInputChange('area', e.target.value)}
                      placeholder="Enter area in square meters"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quoteComplexity">Project Complexity</label>
                    <select 
                      id="quoteComplexity" 
                      name="quoteComplexity"
                      value={quoteData.complexity}
                      onChange={(e) => handleQuoteInputChange('complexity', e.target.value)}
                    >
                      <option value="simple">Simple</option>
                      <option value="medium">Medium</option>
                      <option value="complex">Complex</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quoteTimeline">Timeline</label>
                    <select 
                      id="quoteTimeline" 
                      name="quoteTimeline"
                      value={quoteData.timeline}
                      onChange={(e) => handleQuoteInputChange('timeline', e.target.value)}
                    >
                      <option value="flexible">Flexible (10% discount)</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent (30% premium)</option>
                    </select>
                  </div>
                </div>
                
                <div className="quote-result">
                  <div className="quote-display">
                    <h4>Estimated Cost</h4>
                    <div className="quote-amount">
                      {calculateQuote() > 0 ? (
                        <>
                          <span className="amount">{calculateQuote().toLocaleString()}</span>
                          <span className="currency">ETB</span>
                        </>
                      ) : (
                        <span className="placeholder">Enter details above</span>
                      )}
                    </div>
                    <p className="quote-note">
                      *This is an estimate. Final pricing may vary based on specific requirements.
                    </p>
                  </div>
                </div>
                
                <div className="quote-actions">
                  <motion.button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowQuoteCalculator(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (calculateQuote() > 0) {
                        showBeautifulModal(
                          'Quote Request Sent!',
                          '📧 Quote details sent! We will contact you within 24 hours with a detailed proposal.',
                          'success'
                        );
                        setShowQuoteCalculator(false);
                      } else {
                        showBeautifulModal(
                          'Incomplete Information',
                          'Please fill in all required fields to get a quote.',
                          'warning'
                        );
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Detailed Quote
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              className="booking-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="booking-header">
                <h3>Book Your Free Consultation</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowBookingModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="booking-body">
                <div className="booking-info">
                  <h4>What to Expect:</h4>
                  <ul>
                    <li>✓ 30-minute free consultation</li>
                    <li>✓ Project assessment & planning</li>
                    <li>✓ Budget estimation</li>
                    <li>✓ Timeline discussion</li>
                    <li>✓ Design recommendations</li>
                  </ul>
                </div>
                
                <form className="booking-form" onSubmit={handleBookingFormSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bookingName">Full Name</label>
                      <input 
                        type="text" 
                        id="bookingName" 
                        name="bookingName" 
                        value={bookingForm.name}
                        onChange={(e) => handleBookingFormChange('name', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bookingPhone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="bookingPhone" 
                        name="bookingPhone" 
                        value={bookingForm.phone}
                        onChange={(e) => handleBookingFormChange('phone', e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bookingEmail">Email</label>
                      <input 
                        type="email" 
                        id="bookingEmail" 
                        name="bookingEmail" 
                        value={bookingForm.email}
                        onChange={(e) => handleBookingFormChange('email', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bookingService">Service Needed</label>
                      <select 
                        id="bookingService" 
                        name="bookingService" 
                        value={bookingForm.service}
                        onChange={(e) => handleBookingFormChange('service', e.target.value)}
                        required
                      >
                        <option value="">Select service</option>
                        <option value="architectural">Architectural Design</option>
                        <option value="interior">Interior Design</option>
                        <option value="finishing">Finishing Work</option>
                        <option value="branding">Branding</option>
                        <option value="full-service">Full Service</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bookingDate">Preferred Date</label>
                    <input 
                      type="date" 
                      id="bookingDate" 
                      name="bookingDate" 
                      value={bookingForm.date}
                      onChange={(e) => handleBookingFormChange('date', e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bookingTime">Preferred Time</label>
                    <select 
                      id="bookingTime" 
                      name="bookingTime" 
                      value={bookingForm.time}
                      onChange={(e) => handleBookingFormChange('time', e.target.value)}
                      required
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bookingMessage">Project Description</label>
                    <textarea 
                      id="bookingMessage" 
                      name="bookingMessage" 
                      rows="4" 
                      placeholder="Tell us about your project..."
                      value={bookingForm.description}
                      onChange={(e) => handleBookingFormChange('description', e.target.value)}
                    ></textarea>
                  </div>
                  
                  {/* Booking Status Message */}
                  {formSubmissions.booking.status !== 'idle' && (
                    <div className={`booking-status ${formSubmissions.booking.status}`}>
                      {formSubmissions.booking.status === 'loading' && <span className="loading-spinner">⏳</span>}
                      {formSubmissions.booking.status === 'success' && <span className="success-icon">✅</span>}
                      {formSubmissions.booking.status === 'error' && <span className="error-icon">❌</span>}
                      {formSubmissions.booking.message}
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <motion.button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowBookingModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formSubmissions.booking.status === 'loading'}
                      whileHover={{ scale: formSubmissions.booking.status === 'loading' ? 1 : 1.05 }}
                      whileTap={{ scale: formSubmissions.booking.status === 'loading' ? 1 : 0.95 }}
                    >
                      {formSubmissions.booking.status === 'loading' ? 'Booking...' : 'Book Consultation'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Footer */}
      <footer className="footer" id="footer" role="contentinfo" aria-label="Site footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <motion.div
              className="footer-brand"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
          <img 
            src={theme === 'dark' ? "/images/LOGO-1.png" : "/images/LOGO-2.png"} 
            alt="Awra Finishing & Interior - Professional Architecture and Design Company Logo" 
            className="footer-logo"
            onError={(e) => {
              e.target.src = theme === 'dark' ? "/images/LOGO-2.png" : "/images/LOGO-1.png";
            }}
          />
              <h3>Awra Finishing & Interior</h3>
              <p>Creating exceptional architectural spaces and compelling brands with professional design and premium finishing services.</p>
            </motion.div>

            {/* Services Section */}
            <motion.div
              className="footer-section footer-services"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Architectural Design</a></li>
                <li><a href="#services">Interior Design</a></li>
                <li><a href="#services">Finishing Work</a></li>
                <li><a href="#services">Brand Identity</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
              </ul>
            </motion.div>

            {/* Company Section */}
            <motion.div
              className="footer-section footer-company"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#portfolio">Our Work</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#process">Our Process</a></li>
              </ul>
            </motion.div>

            {/* Connect Section */}
            <motion.div
              className="footer-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4>Connect With Us</h4>
              <p>Follow us for design inspiration and project updates</p>
              <div className="social-media">
                <a href="https://web.facebook.com/profile.php?id=100089517497042" target="_blank" rel="noopener noreferrer" className="social-btn facebook" title="Follow us on Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/awradesigns" target="_blank" rel="noopener noreferrer" className="social-btn instagram" title="Follow us on Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@awrainteriors" target="_blank" rel="noopener noreferrer" className="social-btn tiktok" title="Follow us on TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://t.me/AwraDesigns" target="_blank" rel="noopener noreferrer" className="social-btn telegram" title="Join our Telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
              <div className="footer-cta">
                <a href="https://wa.me/251923814125?text=Hello! I'm interested in your design services." target="_blank" rel="noopener noreferrer" className="footer-btn">
                  <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat with Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} Awra Finishing & Interior. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>











      {/* Get Started Modal */}
      <AnimatePresence>
        {showGetStarted && selectedPlan && (
          <motion.div
            className="get-started-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGetStarted(false)}
          >
            <motion.div
              className="get-started-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="get-started-header">
                <h3>Get Started with {selectedPlan.name}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowGetStarted(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="get-started-body">
                <div className="plan-summary">
                  <div className="plan-info">
                    <h4>{selectedPlan.name}</h4>
                    <p>{selectedPlan.desc}</p>
                    <div className="plan-pricing">
                      <span className="price">
                        {monthly ? selectedPlan.monthly : selectedPlan.oneTime}
                      </span>
                      <span className="period">
                        {monthly ? 'per month' : 'one-time payment'}
                      </span>
                    </div>
                    {selectedPlan.popular && (
                      <div className="popular-badge">Most Popular</div>
                    )}
                  </div>
                  
                  <div className="plan-features">
                    <h5>What's Included:</h5>
                    <ul>
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <form className="contact-form">
                  <h4>Contact Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        required 
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        required 
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="projectType">Project Type</label>
                    <select id="projectType" name="projectType">
                      <option value="">Select project type</option>
                      <option value="architectural">Architectural Design</option>
                      <option value="interior">Interior Design</option>
                      <option value="finishing">Finishing Work</option>
                      <option value="branding">Branding</option>
                      <option value="full-service">Full Service</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="projectSize">Project Size</label>
                    <select id="projectSize" name="projectSize">
                      <option value="">Select project size</option>
                      <option value="small">Small (Under 100 sqm)</option>
                      <option value="medium">Medium (100-500 sqm)</option>
                      <option value="large">Large (500+ sqm)</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select id="budget" name="budget">
                      <option value="">Select budget range</option>
                      <option value="under-50k">Under 50,000 ETB</option>
                      <option value="50k-100k">50,000 - 100,000 ETB</option>
                      <option value="100k-200k">100,000 - 200,000 ETB</option>
                      <option value="200k-plus">200,000+ ETB</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="timeline">Preferred Timeline</label>
                    <select id="timeline" name="timeline">
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="6-months">Within 6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Project Description</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="4" 
                      placeholder="Tell us about your project, requirements, and any specific needs..."
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Request
                    </motion.button>
                    <motion.button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowGetStarted(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Modal System */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="beautiful-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="beautiful-modal-content"
              data-type={modalContent.type}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="beautiful-modal-header">
                <div className="beautiful-modal-icon">
                  {modalContent.icon}
                </div>
                <h3 className="beautiful-modal-title">{modalContent.title}</h3>
                <motion.button
                  className="beautiful-modal-close"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="beautiful-modal-body">
                <p className="beautiful-modal-message">{modalContent.message}</p>
              </div>
              
              <div className="beautiful-modal-actions">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            className="legal-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              className="legal-modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="legal-modal-header">
                <h2>Privacy Policy</h2>
                <motion.button
                  className="legal-modal-close"
                  onClick={() => setShowPrivacyModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="legal-modal-body">
                <div className="legal-section">
                  <h3>Information We Collect</h3>
                  <p>We collect information you provide directly to us, such as when you create an account, request a quote, or contact us for services. This may include your name, email address, phone number, and project details.</p>
                </div>

                <div className="legal-section">
                  <h3>How We Use Your Information</h3>
                  <p>We use the information we collect to provide, maintain, and improve our services, communicate with you about your projects, and send you technical notices and support messages.</p>
                </div>

                <div className="legal-section">
                  <h3>Cookies and Tracking Technologies</h3>
                  <p>We use cookies and similar tracking technologies to enhance your browsing experience on our website. Cookies help us:</p>
                  <ul>
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve website performance and functionality</li>
                    <li>Provide personalized content and recommendations</li>
                  </ul>
                  <p><strong>Cookie Types:</strong></p>
                  <ul>
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Preference Cookies:</strong> Remember your choices and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                  <p>You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.</p>
                </div>

                <div className="legal-section">
                  <h3>Information Sharing</h3>
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
                </div>

                <div className="legal-section">
                  <h3>Data Security</h3>
                  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </div>

                <div className="legal-section">
                  <h3>Contact Us</h3>
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p>Email: info@awrafinishing.com<br />
                  Phone: +251 923 814 125<br />
                  Address: Addis Ababa, Ethiopia</p>
                </div>

                <div className="legal-section">
                  <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            className="legal-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              className="legal-modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="legal-modal-header">
                <h2>Terms of Service</h2>
                <motion.button
                  className="legal-modal-close"
                  onClick={() => setShowTermsModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="legal-modal-body">
                <div className="legal-section">
                  <h3>Acceptance of Terms</h3>
                  <p>By accessing and using Awra Finishing & Interior's services, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </div>

                <div className="legal-section">
                  <h3>Services Description</h3>
                  <p>We provide architectural design, interior design, finishing work, and brand identity services. All services are subject to availability and may be modified or discontinued at our discretion.</p>
                </div>

                <div className="legal-section">
                  <h3>Client Responsibilities</h3>
                  <ul>
                    <li>Provide accurate and complete project information</li>
                    <li>Make timely payments as agreed in the contract</li>
                    <li>Provide necessary access to project sites</li>
                    <li>Communicate clearly about project requirements and changes</li>
                  </ul>
                </div>

                <div className="legal-section">
                  <h3>Payment Terms</h3>
                  <p>Payment terms will be specified in individual project contracts. Generally, we require:</p>
                  <ul>
                    <li>Initial deposit before project commencement</li>
                    <li>Progress payments based on project milestones</li>
                    <li>Final payment upon project completion</li>
                  </ul>
                </div>

                <div className="legal-section">
                  <h3>Intellectual Property</h3>
                  <p>All designs, drawings, and creative work remain the intellectual property of Awra Finishing & Interior until full payment is received. Upon completion of payment, clients receive usage rights as specified in the contract.</p>
                </div>

                <div className="legal-section">
                  <h3>Limitation of Liability</h3>
                  <p>Our liability is limited to the total value of the project contract. We are not liable for indirect, incidental, or consequential damages.</p>
                </div>

                <div className="legal-section">
                  <h3>Modifications</h3>
                  <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>
                </div>

                <div className="legal-section">
                  <h3>Governing Law</h3>
                  <p>These terms are governed by the laws of Ethiopia. Any disputes will be resolved in the courts of Addis Ababa.</p>
                </div>

                <div className="legal-section">
                  <h3>Contact Information</h3>
                  <p>For questions about these Terms of Service, please contact us:</p>
                  <p>Email: info@awrafinishing.com<br />
                  Phone: +251 923 814 125<br />
                  Address: Addis Ababa, Ethiopia</p>
                </div>

                <div className="legal-section">
                  <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L12 20M12 4L6 10M12 4L18 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
