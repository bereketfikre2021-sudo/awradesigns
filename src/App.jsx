import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDevice, usePerformance, useAnimatedInView, useLazyLoading, useLazyImage, useSEO, usePerformanceMonitoring } from './hooks';
import { utils, getImagePath } from './utils';
import LazyImage from './components/LazyImage';
import LazySection from './components/LazySection';
import { ThemeToggle, useTheme } from './contexts/ThemeContext.jsx';
import { HoverGlow, RippleButton, ScrollAnimation } from './components/MicroInteractions.jsx';
import ThemeAwareLogo from './components/ThemeAwareLogo';
import ScrollProgress from './components/ScrollProgress';
import CountUp from './components/CountUp';
import WhyChooseUsLight from './components/WhyChooseUsLight.jsx';
import { GA_MEASUREMENT_ID, FB_PIXEL_ID, ANALYTICS_ENABLED } from './config/analytics';
import './App.css';
import './styles/WhyChooseUsLight.css';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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
    "/images/Hero BG.webp"
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
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    hearAboutUs: '',
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

  // Real-time validation errors
  const [contactFormErrors, setContactFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

  const [contactFormTouched, setContactFormTouched] = useState({
    name: false,
    email: false,
    phone: false,
    projectType: false,
    message: false
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

  // Loading simulation with progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (performance.frameRate < 20) {
      // Very low frame rate detected - could reduce visual effects if needed
      // console.warn('Very low frame rate detected, reducing visual effects');
    }
  }, [performance.frameRate]);

  // Preload hero image for better performance
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setHeroImageLoaded(true);
    };
    img.src = getImagePath('/images/Hero BG.webp');
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

  // Handle project modal
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  // Handle blog modal
  const handleBlogClick = (blogPost) => {
    setSelectedBlogPost(blogPost);
    setShowBlogModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseBlogModal = () => {
    setShowBlogModal(false);
    setSelectedBlogPost(null);
    document.body.style.overflow = '';
  };

  // Handle service modal
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedService(null);
    document.body.style.overflow = '';
  };

  // Handle booking modal
  const handleBookingClick = () => {
    setShowBookingModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    document.body.style.overflow = '';
  };

  // ESC key handler for modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (showProjectModal) {
          handleCloseProjectModal();
        }
        if (showBlogModal) {
          handleCloseBlogModal();
        }
        if (showServiceModal) {
          handleCloseServiceModal();
        }
        if (showBookingModal) {
          handleCloseBookingModal();
        }
        if (showPrivacyModal) {
          setShowPrivacyModal(false);
          document.body.style.overflow = '';
        }
        if (showTermsModal) {
          setShowTermsModal(false);
          document.body.style.overflow = '';
        }
      }
    };

    if (showProjectModal || showBlogModal || showServiceModal || showBookingModal || showPrivacyModal || showTermsModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [showProjectModal, showBlogModal, showServiceModal, showBookingModal, showPrivacyModal, showTermsModal]);


  // Real-time field validation
  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      
      case 'phone':
        if (value.trim() && value.trim().length < 10) {
          error = 'Phone number must be at least 10 digits';
        }
        break;
      
      case 'projectType':
        if (!value) {
          error = 'Please select a project type';
        }
        break;
      
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
      
      default:
        break;
    }

    return error;
  };

  // Form input handlers
  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation on change (only if field has been touched)
    if (contactFormTouched[field]) {
      const error = validateField(field, value);
      setContactFormErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleContactFormBlur = (field) => {
    setContactFormTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate on blur
    const error = validateField(field, contactForm[field]);
    setContactFormErrors(prev => ({
      ...prev,
      [field]: error
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

  // Form validation helper
  const validateContactForm = () => {
    const { name, email, phone, projectType, budget, timeline, message } = contactForm;
    
    if (!name.trim()) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please enter your name.' }
      }));
      return false;
    }
    
    if (!email.trim()) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please enter your email address.' }
      }));
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please enter a valid email address.' }
      }));
      return false;
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (phone.trim() && phone.trim().length < 10) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please enter a valid phone number.' }
      }));
      return false;
    }
    
    if (!projectType) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please select a project type.' }
      }));
      return false;
    }
    
    if (!message.trim()) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please enter your message.' }
      }));
      return false;
    }
    
    if (message.trim().length < 10) {
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: 'Please provide more details in your message (at least 10 characters).' }
      }));
      return false;
    }
    
    return true;
  };

  // Form submission handlers
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched before validation
    const allFields = ['name', 'email', 'phone', 'projectType', 'message'];
    allFields.forEach(field => {
      setContactFormTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, contactForm[field]);
      setContactFormErrors(prev => ({ ...prev, [field]: error }));
    });

    // Validate form before submission
    if (!validateContactForm()) {
      // Check if there are any validation errors
      const hasErrors = allFields.some(field => {
        const error = validateField(field, contactForm[field]);
        return !!error;
      });
      if (hasErrors) {
        return;
      }
    }
    
    setFormSubmissions(prev => ({
      ...prev,
      contact: { status: 'loading', message: 'Sending message...' }
    }));

    try {
      // Submit to Formspree API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('https://formspree.io/f/mrbykzlb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          phone: contactForm.phone.trim(),
          projectType: contactForm.projectType,
          budget: contactForm.budget,
          timeline: contactForm.timeline,
          hearAboutUs: contactForm.hearAboutUs,
          message: contactForm.message.trim(),
          _subject: `New Contact Form Submission from ${contactForm.name.trim()}`,
          _replyto: contactForm.email.trim(),
          _cc: contactForm.email.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setFormSubmissions(prev => ({
          ...prev,
          contact: { status: 'success', message: 'Thank you! We\'ll get back to you within 24 hours.' }
        }));
        
        // Reset form
        setContactForm({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          timeline: '',
          hearAboutUs: '',
          message: ''
        });
        
        // Reset validation states
        setContactFormErrors({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          message: ''
        });
        setContactFormTouched({
          name: false,
          email: false,
          phone: false,
          projectType: false,
          message: false
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormSubmissions(prev => ({
            ...prev,
            contact: { status: 'idle', message: '' }
          }));
        }, 5000);
        
        // Track successful form submission
        if (ANALYTICS_ENABLED && typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submission', {
            form_name: 'contact',
            form_location: 'contact_section'
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Form submission failed');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Report error to error reporting service
      try {
        const { reportAPIError } = await import('./services/errorReporting');
        reportAPIError(error, {
          formType: 'contact',
          endpoint: 'formspree',
          hasData: true,
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
      
      let errorMessage = 'Sorry, there was an error. Please try again or contact us directly.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormSubmissions(prev => ({
        ...prev,
        contact: { status: 'error', message: errorMessage }
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
        handleCloseBookingModal();
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
    
    // Validate email
    if (!newsletterForm.email || !newsletterForm.email.includes('@')) {
      setFormSubmissions(prev => ({
        ...prev,
        newsletter: { status: 'error', message: 'Please enter a valid email address.' }
      }));
      return;
    }

    setFormSubmissions(prev => ({
      ...prev,
      newsletter: { status: 'loading', message: 'Subscribing...' }
    }));

    try {
      const response = await fetch('https://formspree.io/f/mrbykzlb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterForm.email,
          subject: 'Newsletter Subscription',
          message: `Newsletter subscription request from: ${newsletterForm.email}`,
          _formname: 'newsletter'
        })
      });

      if (response.ok) {
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
      } else {
        throw new Error('Subscription failed');
      }
      
    } catch (error) {
      // Report error to error reporting service
      try {
        const { reportAPIError } = await import('./services/errorReporting');
        reportAPIError(error, {
          formType: 'newsletter',
          endpoint: 'formspree',
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
      
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

  const projects = useMemo(() => [
    {
      id: 1,
      title: "Modern Living Space",
      category: "Interior Design",
      description: "A contemporary living room featuring minimalist design with smart home integration",
      image: "/images/LIVING_11 - Photo copy.webp",
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
      image: "/images/Bed Rm_11 - Photo copy.webp",
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
      image: "/images/CH Bed 1_1 - Photo copy.webp",
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
      image: "/images/LOBBY_26 - Photo copy.webp",
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
      image: "/images/3D_1 - Photo copy.webp",
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
      image: "/images/3D_2 - Photo copy.webp",
      tags: ["Branding", "Identity", "Logo"],
      year: 2024,
      rating: 4.9,
      isFeatured: true,
    }
  ].map(project => ({
    ...project,
    image: getImagePath(project.image)
  })), []);

  // Blog posts data
  const blogPosts = useMemo(() => [
    {
      id: 1,
      title: "Top 10 Interior Design Trends for 2025",
      category: "Interior Design",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      image: "/images/Gym_11 - Photo copy.webp",
      description: "Discover the latest interior design trends that will dominate 2025, from sustainable materials to smart home integration.",
      tags: ["Trends", "2025", "Modern"],
      fullContent: "The world of interior design is constantly evolving, and 2025 brings exciting new trends that blend sustainability with modern aesthetics. This year, we're seeing a strong emphasis on biophilic design, incorporating natural elements and plants into living spaces. Smart home integration continues to grow, with seamless technology becoming an integral part of modern homes. Sustainable materials like bamboo, reclaimed wood, and recycled metals are gaining popularity. Minimalist designs with bold accent pieces create stunning contrasts. Warm, earthy color palettes combined with statement lighting fixtures are defining the contemporary look. Multi-functional furniture is becoming essential for urban living spaces."
    },
    {
      id: 2,
      title: "Complete Guide to Architectural Planning in Ethiopia",
      category: "Architecture",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      image: "/images/3D_3 - Photo copy.webp",
      description: "Everything you need to know about architectural planning, permits, and regulations in Ethiopia for your next project.",
      tags: ["Planning", "Ethiopia", "Permits"],
      fullContent: "Architectural planning in Ethiopia requires a thorough understanding of local regulations and building codes. The process begins with site assessment and feasibility studies. You'll need to obtain building permits from the relevant municipal authorities. Zoning regulations vary by location, so it's crucial to check local requirements. Structural design must comply with Ethiopian building standards. Environmental impact assessments may be required for larger projects. Working with certified local architects and engineers is essential. The approval process typically takes 30-90 days depending on project complexity. Understanding these requirements upfront will save time and ensure smooth project execution."
    },
    {
      id: 3,
      title: "Color Psychology: How Colors Affect Your Space",
      category: "Design Tips",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      image: "/images/Master Bath_11 - Photo copy.webp",
      description: "Learn how different colors can influence mood, productivity, and well-being in your home and office spaces.",
      tags: ["Colors", "Psychology", "Wellness"],
      fullContent: "Colors have a profound psychological impact on our mood, productivity, and overall well-being. Understanding color psychology can help you create spaces that support your goals. Blue promotes calmness and concentration, making it ideal for bedrooms and offices. Green connects us with nature and promotes balance and harmony. Warm colors like red and orange stimulate energy and creativity but should be used sparingly. Yellow enhances optimism and mental clarity. Neutral colors provide flexibility and timeless appeal. The key is to balance colors according to room function and desired atmosphere. Consider natural lighting and room size when selecting color palettes. Accent colors can add personality without overwhelming the space."
    }
  ].map(post => ({
    ...post,
    image: getImagePath(post.image)
  })), []);

  // Services data
  const services = [
    {
      id: 1,
      icon: '🏗️',
      title: 'Architectural Design',
      description: 'Complete building design from concept to construction drawings. We handle structural planning, space optimization, and regulatory compliance.',
      features: [
        'Building design & planning',
        'Structural engineering',
        'Regulatory compliance',
        '3D visualization',
        'Construction drawings'
      ],
      price: 'From 80,000 ETB',
      duration: '2-4 months',
      badge: 'Most Popular'
    },
    {
      id: 2,
      icon: '🎨',
      title: 'Interior Design',
      description: 'Transform your spaces with functional layouts, material selection, lighting design, and furniture planning for optimal living and working environments.',
      features: [
        'Space planning & layout',
        'Color scheme design',
        'Furniture selection',
        'Lighting design',
        'Material sourcing'
      ],
      price: 'From 50,000 ETB',
      duration: '2-6 weeks',
      badge: null
    },
    {
      id: 3,
      icon: '🛠️',
      title: 'Finishing Work',
      description: 'Premium construction finishing including flooring, painting, tiling, carpentry, and detailed craftsmanship to bring designs to life.',
      features: [
        'Flooring installation',
        'Painting & wall finishes',
        'Tiling & stone work',
        'Custom carpentry',
        'Quality assurance'
      ],
      price: 'From 30,000 ETB',
      duration: '1-3 weeks',
      badge: null
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Brand Identity',
      description: 'Create distinctive brand identities, logos, and visual communication systems for businesses, including signage and environmental graphics.',
      features: [
        'Logo design',
        'Brand guidelines',
        'Business cards & stationery',
        'Signage design',
        'Marketing materials'
      ],
      price: 'From 25,000 ETB',
      duration: '1-2 weeks',
      badge: null
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
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-content">
          <motion.div
            className="loading-logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <ThemeAwareLogo />
            </motion.div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Loading the Future of Interior Design
            <span className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </motion.h2>
          
          <div className="loading-bar-container">
            <motion.div
              className="loading-percentage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.min(Math.round(loadingProgress), 100)}%
            </motion.div>
            <div className="loading-bar">
              <motion.div
                className="loading-progress"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="App">
      {/* Skip Navigation Link for Accessibility */}
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>
      
      <Helmet>
        <title>{getPageMeta(currentSection).title}</title>
        <meta name="description" content={getPageMeta(currentSection).description} />
        <meta name="keywords" content="architectural design Ethiopia, interior design Addis Ababa, finishing work, branding services, 3D visualization, AR design, construction Ethiopia, home renovation, office design, commercial design, Awra Designs, professional architects, premium finishing, local expertise" />
        <meta name="author" content="Awra Finishing & Interior" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, user-scalable=yes, viewport-fit=cover" />
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
        <meta property="og:image" content="https://awradesigns.com/images/Hero%20BG.webp" />
        <meta property="og:image:alt" content="Awra Finishing & Interior - Luxury interior design and professional architecture services in Addis Ababa, Ethiopia" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:secure_url" content="https://awradesigns.com/images/Hero%20BG.webp" />
        <meta property="og:site_name" content="Awra Finishing & Interior" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="am_ET" />
        <meta property="article:author" content="Awra Finishing & Interior" />
        <meta property="article:publisher" content="https://www.facebook.com/awradesigns" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://awradesigns.com#${currentSection}`} />
        <meta name="twitter:title" content={getPageMeta(currentSection).title} />
        <meta name="twitter:description" content={getPageMeta(currentSection).description} />
        <meta name="twitter:image" content="https://awradesigns.com/images/Hero%20BG.webp" />
        <meta name="twitter:image:alt" content="Awra Finishing & Interior - Luxury interior design and professional architecture services in Addis Ababa, Ethiopia" />
        <meta name="twitter:creator" content="@awradesigns" />
        <meta name="twitter:site" content="@awradesigns" />
        
        {/* Additional Social Sharing */}
        <meta property="article:section" content="Architecture & Design" />
        <meta property="article:tag" content="Architecture" />
        <meta property="article:tag" content="Interior Design" />
        <meta property="article:tag" content="Ethiopia" />
        <meta property="article:tag" content="Addis Ababa" />
        
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
            "logo": "https://awradesigns.com/images/LOGO-light.webp",
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
        
        {/* Google Analytics 4 */}
        {ANALYTICS_ENABLED && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID' && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </script>
          </>
        )}
        
        {/* Facebook Pixel - Only load if not blocked */}
        {ANALYTICS_ENABLED && FB_PIXEL_ID !== 'YOUR_PIXEL_ID' && (
          <>
        <script>
          {`
            try {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.onerror=function(){console.warn('Facebook Pixel blocked by ad blocker');};
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            } catch(e) {
              console.warn('Facebook Pixel initialization failed:', e);
            }
          `}
        </script>
        <noscript>
              <img height="1" width="1" style={{display:'none'}} src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
          </>
        )}
        
      </Helmet>

      {/* Advanced Navigation */}
      <motion.header 
        className={`nav ${navSolid ? "solid" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-container" id="navigation" role="navigation" aria-label="Main navigation">
          <motion.a 
            href="#home"
            className="logo"
            onClick={() => setCurrentSection('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <ThemeAwareLogo className="logo-img" />
          </motion.a>
          
          <nav className="nav-links" role="navigation" aria-label="Main navigation">
            {['home', 'about', 'services', 'works', 'pricing', 'contact'].map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                className={currentSection === section ? 'active' : ''}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                aria-label={`Navigate to ${section} section`}
                aria-current={currentSection === section ? 'page' : undefined}
              >
                {section === 'testimonials' ? 'Reviews' : 
                 section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.a>
            ))}
        </nav>

          <div className="nav-controls">
            <ThemeToggle className="nav-theme-toggle" size="medium" />
        </div>
        </div>

      </motion.header>

      {/* Mobile Bottom Navigation Bar */}
      <motion.nav
        className="mobile-bottom-nav"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {['home', 'about', 'services', 'works', 'pricing', 'contact'].map((section, index) => {
          const icons = {
            home: '🏠',
            about: 'ℹ️', // Changed to info icon for better visibility
            services: '⚙️',
            works: '🎨',
            pricing: '💰',
            contact: '📞'
          };
          return (
                    <motion.a
                      key={section}
                      href={`#${section}`}
              className={`mobile-nav-item ${currentSection === section ? 'active' : ''}`}
              onClick={() => setCurrentSection(section)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
              aria-label={`Navigate to ${section} section`}
              aria-current={currentSection === section ? 'page' : undefined}
                    >
              <span className="mobile-nav-icon">{icons[section] || '📄'}</span>
              <span className="mobile-nav-label">
                      {section === 'testimonials' ? 'Reviews' : 
                       section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
              {currentSection === section && (
                <motion.div
                  className="mobile-nav-indicator"
                  layoutId="mobileNavIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
                    </motion.a>
          );
        })}
      </motion.nav>

      {/* Hero Section - Luxury Redesign */}
      <section id="home" className={`hero ${heroImageLoaded ? 'hero-loaded' : ''}`} ref={heroRef} role="main" aria-label="Main content">
        <div id="main-content" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true"></div>
        
        {/* Hero Skeleton - Show while image is loading */}
        {!heroImageLoaded && (
          <div className="hero-skeleton">
            <div className="hero-skeleton-content">
              <div className="skeleton skeleton-text hero-skeleton-title"></div>
              <div className="skeleton skeleton-text hero-skeleton-subtitle"></div>
              <div className="skeleton skeleton-text hero-skeleton-subtitle" style={{ width: '70%' }}></div>
              <div className="hero-skeleton-actions">
                <div className="skeleton skeleton-button" style={{ height: '50px', width: '200px' }}></div>
                <div className="skeleton skeleton-button" style={{ height: '50px', width: '200px' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Luxury Background Overlay */}
        <div className="hero-background-overlay"></div>
        
        {/* Animated Particles/Orbs */}
        <div className="hero-particles">
          {[
            { x: -150, y: -100, delay: 0, duration: 5 },
            { x: 150, y: -150, delay: 0.5, duration: 4.5 },
            { x: -200, y: 100, delay: 1, duration: 6 },
            { x: 200, y: 150, delay: 1.5, duration: 5.5 },
            { x: 0, y: -200, delay: 2, duration: 4 },
            { x: 0, y: 200, delay: 2.5, duration: 5 }
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="hero-particle"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
                x: particle.x,
                y: particle.y,
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="hero-container">
          {/* Left Content Section */}
                  <motion.div
            className="hero-content-wrapper"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Prestige Badge */}
            <motion.div
              className="hero-badge-luxury"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="badge-icon">✨</span>
              <span className="badge-text">Awra Design & Finishing</span>
                  </motion.div>

            {/* Main Title */}
          <motion.h1
              className="hero-title-luxury"
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <span className="title-line title-line-1">Where Elegance</span>
              <span className="title-line title-line-2">
                <span className="title-accent">Meets</span> Innovation
              </span>
          </motion.h1>
          
            {/* Subtitle */}
          <motion.p
              className="hero-subtitle-luxury"
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
              Transform your space with bespoke architectural design and premium interior solutions. 
              Crafted with precision, delivered with excellence.
          </motion.p>
          
            {/* CTA Buttons */}
          <motion.div
              className="hero-actions-luxury"
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          >
            <motion.a
              href="#contact"
              className="btn-luxury btn-primary-luxury"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Navigate to contact section to start your design journey"
            >
              <span className="btn-text">Start Your Journey</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </motion.a>
            
            <motion.button
              className="btn-luxury btn-secondary-luxury"
              onClick={handleBookingClick}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Book a free consultation with Awra Finishing & Interior"
            >
              <span className="btn-icon" aria-hidden="true">📅</span>
              <span className="btn-text">Book Consultation</span>
            </motion.button>
          </motion.div>

          </motion.div>

          {/* Right Visual Section */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <div className="hero-visual-container">
              {/* Featured Image Card */}
              <motion.div
                className="hero-image-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.02, rotate: 1 }}
              >
                <div className="image-card-overlay"></div>
                <LazyImage
                  src={getImagePath("/images/Hero BG.webp")}
                  alt="Luxury interior design showcase featuring modern living space with elegant furniture, premium finishes, and sophisticated lighting - Awra Finishing & Interior design services"
                  className="hero-featured-image"
                  onLoad={() => setHeroImageLoaded(true)}
                />
                <div className="image-card-badge">
                  <span className="badge-icon-small">🏆</span>
                  <span>Featured Project</span>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className="hero-floating-card card-1"
                initial={{ opacity: 0, y: 30, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div className="floating-card-icon">✨</div>
                <div className="floating-card-text">Premium Quality</div>
              </motion.div>

              <motion.div
                className="hero-floating-card card-2"
                initial={{ opacity: 0, y: 30, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div className="floating-card-icon">🎨</div>
                <div className="floating-card-text">Custom Design</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
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
                    <CountUp 
                      endValue="100+" 
                      label="Projects Completed"
                      duration={2000}
                      delay={0}
                    />
                    <CountUp 
                      endValue="50+" 
                      label="Happy Clients"
                      duration={2000}
                      delay={200}
                    />
                    <CountUp 
                      endValue="5+" 
                      label="Years Experience"
                      duration={2000}
                      delay={400}
                    />
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
            {services.map((service, index) => (
            <motion.div
                key={service.id}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-header">
                  <div className="service-icon">{service.icon}</div>
                  {service.badge && (
                    <div className="service-badge">{service.badge}</div>
                  )}
              </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-actions">
                  <motion.button 
                    className="service-btn service-btn-learn"
                    onClick={() => handleServiceClick(service)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Learn more about ${service.title} service`}
                  >
                    Learn More
                  </motion.button>
                  <motion.button 
                    className="service-btn service-btn-book"
                    onClick={handleBookingClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Book a consultation for this service"
                  >
                    Book Consultation
                  </motion.button>
              </div>
              </motion.div>
            ))}
          </div>

          {/* Service Details Modal */}
          <AnimatePresence>
            {showServiceModal && selectedService && (
              <motion.div
                className="service-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleCloseServiceModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-modal-title"
              >
                <motion.div
                  className="service-modal-content"
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
              <button 
                    className="service-modal-close"
                    onClick={handleCloseServiceModal}
                    aria-label="Close service details modal"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCloseServiceModal();
                      }
                    }}
                  >
                    <span aria-hidden="true">×</span>
                  </button>

                  {/* Modal Header */}
                  <div className="service-modal-header">
                    <div className="service-modal-icon">{selectedService.icon}</div>
                    <div className="service-modal-title-wrapper">
                      {selectedService.badge && (
                        <span className="service-modal-badge">{selectedService.badge}</span>
                      )}
                      <h2 id="service-modal-title" className="service-modal-title">
                        {selectedService.title}
                      </h2>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="service-modal-body">
                    <div className="service-modal-description">
                      <p>{selectedService.description}</p>
                    </div>

                    {/* Service Features */}
                    {selectedService.features && selectedService.features.length > 0 && (
                      <div className="service-modal-features">
                        <h3>What's Included</h3>
                        <ul className="service-modal-features-list">
                          {selectedService.features.map((feature, index) => (
                            <li key={index}>
                              <span className="feature-check">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pricing Information */}
                    <div className="service-modal-pricing">
                      <div className="pricing-item">
                        <span className="pricing-icon">💰</span>
                        <div className="pricing-content">
                          <span className="pricing-label">Starting Price</span>
                          <span className="pricing-value">{selectedService.price}</span>
                        </div>
                      </div>
                      <div className="pricing-item">
                        <span className="pricing-icon">⏱️</span>
                        <div className="pricing-content">
                          <span className="pricing-label">Duration</span>
                          <span className="pricing-value">{selectedService.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="service-modal-actions">
                      <motion.button
                        className="btn-luxury btn-primary-luxury"
                        onClick={() => {
                          handleCloseServiceModal();
                          handleBookingClick();
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Book a consultation for this service"
                      >
                        <span className="btn-text">Book Consultation</span>
                        <span className="btn-arrow" aria-hidden="true">→</span>
                      </motion.button>
                      <motion.button
                        className="btn-luxury btn-secondary-luxury"
                        onClick={handleCloseServiceModal}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Close service details modal"
                      >
                        <span className="btn-text">Close</span>
                      </motion.button>
                    </div>
                  </div>
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Process Section */}
            <motion.div
            id="process"
            className="services-process"
              initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="process-header">
              <motion.h3 
                className="process-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                How We <span className="gradient-text">Work</span>
              </motion.h3>
              <motion.p 
                className="process-subtitle"
                initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
                A streamlined process from concept to completion
              </motion.p>
              </div>
            
            <div className="process-timeline">
            <div className="process-steps">
                <motion.div 
                  className="process-step"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="step-container">
                    <div className="step-icon-wrapper">
                      <div className="step-icon">🤝</div>
                <div className="step-number">01</div>
                      <div className="step-pulse"></div>
                    </div>
                    <div className="step-content">
                <h4>Consultation</h4>
                      <p>We start by understanding your vision, requirements, and budget. Free initial consultation to discuss your project goals.</p>
                      <ul className="step-features">
                        <li>Free consultation</li>
                        <li>Needs assessment</li>
                        <li>Budget discussion</li>
              </ul>
              </div>
                  </div>
                  <div className="step-connector"></div>
            </motion.div>

            <motion.div
                  className="process-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="step-container">
                    <div className="step-icon-wrapper">
                      <div className="step-icon">🎨</div>
                <div className="step-number">02</div>
                      <div className="step-pulse"></div>
              </div>
                    <div className="step-content">
                      <h4>Design & Planning</h4>
                      <p>Our team creates detailed plans, 3D visualizations, and material selections. You'll see your vision come to life before we start.</p>
                      <ul className="step-features">
                        <li>3D visualizations</li>
                        <li>Detailed plans</li>
                        <li>Material selection</li>
              </ul>
              </div>
                  </div>
                  <div className="step-connector"></div>
            </motion.div>

            <motion.div
                  className="process-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="step-container">
                    <div className="step-icon-wrapper">
                      <div className="step-icon">🔨</div>
                <div className="step-number">03</div>
                      <div className="step-pulse"></div>
              </div>
                    <div className="step-content">
                <h4>Execution</h4>
                      <p>Professional implementation with regular updates and quality assurance. We ensure every detail meets our high standards.</p>
                      <ul className="step-features">
                        <li>Regular updates</li>
                        <li>Quality assurance</li>
                        <li>Timeline tracking</li>
              </ul>
              </div>
          </div>
                  <div className="step-connector"></div>
                </motion.div>

          <motion.div
                  className="process-step"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="step-container">
                    <div className="step-icon-wrapper">
                      <div className="step-icon">📦</div>
                <div className="step-number">04</div>
                      <div className="step-pulse"></div>
                  </div>
                    <div className="step-content">
                      <h4>Delivery & Support</h4>
                      <p>Final inspection, project handover, and ongoing support. We're here to ensure your complete satisfaction.</p>
                      <ul className="step-features">
                        <li>Final inspection</li>
                        <li>Project handover</li>
                        <li>Ongoing support</li>
                      </ul>
                  </div>
                </div>
                </motion.div>
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
                onClick={() => handleProjectClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProjectClick(project);
                  }
                }}
                aria-label={`View details for ${project.title}`}
              >
              <div className="work-image">
                <LazyImage 
                  src={project.image} 
                  alt={`${project.title} - ${project.category} project showcasing ${project.description.toLowerCase()} designed and completed by Awra Finishing & Interior in ${project.year}`}
                  placeholder="Loading project image..."
                  threshold={0.1}
                  rootMargin="50px"
                  loading="lazy"
                  decoding="async"
                />
                <div className="work-overlay">
                  <span className="view-details-text">View Details →</span>
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

        {/* Project Description Modal */}
        <AnimatePresence>
          {showProjectModal && selectedProject && (
            <motion.div
              className="project-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseProjectModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
            >
              <motion.div
                className="project-modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="project-modal-close"
                  onClick={handleCloseProjectModal}
                  aria-label="Close project details modal"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCloseProjectModal();
                    }
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>

                {/* Modal Header */}
                <div className="project-modal-header">
                  <div className="project-modal-badges">
                    {selectedProject.isFeatured && (
                      <span className="project-modal-badge featured">⭐ Featured</span>
                    )}
                    <span className="project-modal-badge category">{selectedProject.category}</span>
                    <span className="project-modal-badge year">{selectedProject.year}</span>
                  </div>
                  <h2 id="project-modal-title" className="project-modal-title">
                    {selectedProject.title}
                  </h2>
                  {selectedProject.rating && (
                    <div className="project-modal-rating">
                      <span className="stars">{'★'.repeat(Math.floor(selectedProject.rating))}</span>
                      <span className="rating-value">{selectedProject.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Modal Image */}
                <div className="project-modal-image">
                  <LazyImage
                    src={selectedProject.image}
                    alt={`${selectedProject.title} - Detailed view of ${selectedProject.category} project featuring ${selectedProject.description.toLowerCase()} by Awra Finishing & Interior`}
                    className="project-modal-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Modal Body */}
                <div className="project-modal-body">
                  <div className="project-modal-description">
                    <h3>Project Overview</h3>
                    <p>{selectedProject.description}</p>
                  </div>

                  {/* Project Tags */}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="project-modal-tags">
                      <h4>Project Tags</h4>
                      <div className="tags-container">
                        {selectedProject.tags.map((tag) => (
                          <span key={tag} className="project-modal-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="project-modal-details">
                    <div className="detail-item">
                      <span className="detail-icon">📁</span>
                      <div className="detail-content">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{selectedProject.category}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <span className="detail-label">Year</span>
                        <span className="detail-value">{selectedProject.year}</span>
                      </div>
                    </div>
                    {selectedProject.rating && (
                      <div className="detail-item">
                        <span className="detail-icon">⭐</span>
                        <div className="detail-content">
                          <span className="detail-label">Rating</span>
                          <span className="detail-value">{selectedProject.rating.toFixed(1)} / 5</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="project-modal-actions">
                    <motion.a
                      href="#contact"
                      className="btn-luxury btn-primary-luxury"
                      onClick={() => handleCloseProjectModal()}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="btn-text">Start Similar Project</span>
                      <span className="btn-arrow">→</span>
                    </motion.a>
                    <motion.button
                      className="btn-luxury btn-secondary-luxury"
                      onClick={handleCloseProjectModal}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="btn-text">Close</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Team Section */}
      <section id="team" className="team">
        <div className="team-container">
          <motion.div
            className="team-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Expert Team</h2>
            <p>Professional architects, designers, and craftsmen dedicated to bringing your vision to life</p>
          </motion.div>
          
          <div className="team-grid">
            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="member-image-wrapper">
                <div className="member-avatar">
                  <LazyImage
                    src={getImagePath("/images/Tesfahun Tsegaye.webp")}
                    alt="Tesfahun Tsegaye"
                    className=""
                    placeholder="Loading..."
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👨‍💼</div>
                </div>
                <div className="member-overlay"></div>
              </div>
              <div className="member-content">
                <h3>Tesfahun Tsegaye</h3>
                <p className="member-role">Founder & Lead Architect</p>
                <p className="member-description">With over 10 years of experience in architectural design, specializing in modern residential and commercial projects.</p>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="member-image-wrapper">
                <div className="member-avatar">
                  <LazyImage
                    src={getImagePath("/images/Sarah Bekele.webp")}
                    alt="Sarah Bekele"
                    className=""
                    placeholder="Loading..."
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👩‍🎨</div>
                </div>
                <div className="member-overlay"></div>
              </div>
              <div className="member-content">
                <h3>Sarah Bekele</h3>
                <p className="member-role">Senior Interior Designer</p>
                <p className="member-description">Passionate about creating functional and beautiful spaces with expertise in color theory and space planning.</p>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="member-image-wrapper">
                <div className="member-avatar">
                  <LazyImage
                    src={getImagePath("/images/Daniel Haile.webp")}
                    alt="Daniel Haile"
                    className=""
                    placeholder="Loading..."
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👨‍🔧</div>
                </div>
                <div className="member-overlay"></div>
              </div>
              <div className="member-content">
                <h3>Daniel Haile</h3>
                <p className="member-role">Master Craftsman</p>
                <p className="member-description">Expert in premium finishing work ensuring every detail is perfect from custom carpentry to high-end finishes.</p>
              </div>
            </motion.div>

            <motion.div
              className="team-member"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="member-image-wrapper">
                <div className="member-avatar">
                  <LazyImage
                    src={getImagePath("/images/Bereket Fikre.webp")}
                    alt="Bereket Fikre"
                    className=""
                    placeholder="Loading..."
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <div className="avatar-fallback" style={{display: 'none'}}>👨‍🎨</div>
                </div>
                <div className="member-overlay"></div>
              </div>
              <div className="member-content">
                <h3>Bereket Fikre</h3>
                <p className="member-role">Expert Graphic Designer</p>
                <p className="member-description">Creative designer specializing in visual branding, digital design, and innovative brand communication solutions.</p>
              </div>
            </motion.div>
          </div>
        </div>
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
            {blogPosts.map((post, index) => (
            <motion.article
                key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
                onClick={() => handleBlogClick(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBlogClick(post);
                  }
                }}
                aria-label={`Read full article: ${post.title}`}
            >
              <div className="blog-image">
                <img 
                  src={post.image} 
                  alt={`${post.title} - ${post.description} - Design blog article by Awra Finishing & Interior`}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onLoad={() => {
                    handleImageLoad(post.image);
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                  <div className="blog-category">{post.category}</div>
                  <div className="blog-overlay">
                    <span className="read-article-text">Read Article →</span>
              </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                </div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                <div className="blog-tags">
                    {post.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                </div>
              </div>
            </motion.article>
            ))}
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

        {/* Blog Description Modal */}
        <AnimatePresence>
          {showBlogModal && selectedBlogPost && (
            <motion.div
              className="blog-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseBlogModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-modal-title"
            >
              <motion.div
                className="blog-modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="blog-modal-close"
                  onClick={handleCloseBlogModal}
                  aria-label="Close blog article details modal"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCloseBlogModal();
                    }
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>

                {/* Modal Header */}
                <div className="blog-modal-header">
                  <div className="blog-modal-badges">
                    <span className="blog-modal-badge category">{selectedBlogPost.category}</span>
                    <span className="blog-modal-badge date">{selectedBlogPost.date}</span>
                    <span className="blog-modal-badge read-time">{selectedBlogPost.readTime}</span>
                  </div>
                  <h2 id="blog-modal-title" className="blog-modal-title">
                    {selectedBlogPost.title}
                  </h2>
                </div>

                {/* Modal Image */}
                <div className="blog-modal-image">
                  <img
                    src={selectedBlogPost.image}
                    alt={`${selectedBlogPost.title} - Featured image for design blog article: ${selectedBlogPost.description} by Awra Finishing & Interior`}
                    className="blog-modal-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Modal Body */}
                <div className="blog-modal-body">
                  <div className="blog-modal-description">
                    <h3>Article Overview</h3>
                    <p>{selectedBlogPost.description}</p>
                  </div>

                  <div className="blog-modal-full-content">
                    <h3>Full Article</h3>
                    <p>{selectedBlogPost.fullContent}</p>
                  </div>

                  {/* Blog Tags */}
                  {selectedBlogPost.tags && selectedBlogPost.tags.length > 0 && (
                    <div className="blog-modal-tags">
                      <h4>Topics</h4>
                      <div className="tags-container">
                        {selectedBlogPost.tags.map((tag) => (
                          <span key={tag} className="blog-modal-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Meta Details */}
                  <div className="blog-modal-details">
                    <div className="detail-item">
                      <span className="detail-icon">📁</span>
                      <div className="detail-content">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{selectedBlogPost.category}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <span className="detail-label">Published</span>
                        <span className="detail-value">{selectedBlogPost.date}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <div className="detail-content">
                        <span className="detail-label">Reading Time</span>
                        <span className="detail-value">{selectedBlogPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="blog-modal-actions">
                    <motion.a
                      href="#contact"
                      className="btn-luxury btn-primary-luxury"
                      onClick={() => handleCloseBlogModal()}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="btn-text">Get Expert Advice</span>
                      <span className="btn-arrow">→</span>
                    </motion.a>
                    <motion.button
                      className="btn-luxury btn-secondary-luxury"
                      onClick={handleCloseBlogModal}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="btn-text">Close</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
            <div className="contact-methods">
              <motion.a 
                href="tel:+251923814125"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Call us"
              >
                <div className="contact-icon">📞</div>
                <div className="contact-content">
                  <h4>Phone</h4>
                  <p>+251 923 814 125</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://t.me/Traw12"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Message us on Telegram"
              >
                <div className="contact-icon">✈️</div>
                <div className="contact-content">
                  <h4>Telegram</h4>
                  <p>@Traw12</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://wa.me/251923814125"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Message us on WhatsApp"
              >
                <div className="contact-icon">💬</div>
                <div className="contact-content">
                  <h4>WhatsApp</h4>
                  <p>+251 923 814 125</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://instagram.com/awradesigns"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Follow us on Instagram"
              >
                <div className="contact-icon">📷</div>
                <div className="contact-content">
                  <h4>Instagram</h4>
                  <p>@awradesigns</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://www.tiktok.com/@awrainteriors"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Follow us on TikTok"
              >
                <div className="contact-icon">🎵</div>
                <div className="contact-content">
                  <h4>TikTok</h4>
                  <p>@awrainteriors</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="mailto:info@awradesigns.com"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="Email us"
              >
                <div className="contact-icon">📧</div>
                <div className="contact-content">
                  <h4>Email</h4>
                  <p>info@awradesigns.com</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://www.google.com/maps/search/?api=1&query=9.1450,38.7756"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                role="button"
                aria-label="View location on Google Maps"
              >
                <div className="contact-icon">📍</div>
                <div className="contact-content">
                  <h4>Location</h4>
                  <p>Bole, Addis Ababa, Ethiopia</p>
                </div>
              </motion.a>
              
              <motion.div 
                className="contact-method"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="contact-icon">🕒</div>
                <div className="contact-content">
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
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="contactName" 
                    name="contactName" 
                    placeholder="Your Name" 
                    value={contactForm.name}
                    onChange={(e) => handleContactFormChange('name', e.target.value)}
                    onBlur={() => handleContactFormBlur('name')}
                    className={contactFormTouched.name && contactFormErrors.name ? 'error' : contactFormTouched.name && !contactFormErrors.name ? 'valid' : ''}
                    required 
                  />
                  {contactFormTouched.name && contactFormErrors.name && (
                    <span className="error-icon">⚠️</span>
                  )}
                  {contactFormTouched.name && !contactFormErrors.name && contactForm.name && (
                    <span className="success-icon">✓</span>
                  )}
                </div>
                {contactFormTouched.name && contactFormErrors.name && (
                  <span className="error-message">{contactFormErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Your Email</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    id="contactEmail" 
                    name="contactEmail" 
                    placeholder="your.email@example.com" 
                    value={contactForm.email}
                    onChange={(e) => handleContactFormChange('email', e.target.value)}
                    onBlur={() => handleContactFormBlur('email')}
                    className={contactFormTouched.email && contactFormErrors.email ? 'error' : contactFormTouched.email && !contactFormErrors.email ? 'valid' : ''}
                    required 
                  />
                  {contactFormTouched.email && contactFormErrors.email && (
                    <span className="error-icon">⚠️</span>
                  )}
                  {contactFormTouched.email && !contactFormErrors.email && contactForm.email && (
                    <span className="success-icon">✓</span>
                  )}
                </div>
                {contactFormTouched.email && contactFormErrors.email && (
                  <span className="error-message">{contactFormErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contactPhone">Phone Number</label>
                <div className="input-wrapper">
                  <input 
                    type="tel" 
                    id="contactPhone" 
                    name="contactPhone" 
                    placeholder="0923814125" 
                    value={contactForm.phone}
                    onChange={(e) => handleContactFormChange('phone', e.target.value)}
                    onBlur={() => handleContactFormBlur('phone')}
                    className={contactFormTouched.phone && contactFormErrors.phone ? 'error' : contactFormTouched.phone && !contactFormErrors.phone && contactForm.phone ? 'valid' : ''}
                  />
                  {contactFormTouched.phone && contactFormErrors.phone && (
                    <span className="error-icon">⚠️</span>
                  )}
                  {contactFormTouched.phone && !contactFormErrors.phone && contactForm.phone && (
                    <span className="success-icon">✓</span>
                  )}
                </div>
                {contactFormTouched.phone && contactFormErrors.phone && (
                  <span className="error-message">{contactFormErrors.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contactProjectType">Project Type</label>
                <div className="input-wrapper">
                  <select 
                    id="contactProjectType" 
                    name="contactProjectType" 
                    value={contactForm.projectType}
                    onChange={(e) => handleContactFormChange('projectType', e.target.value)}
                    onBlur={() => handleContactFormBlur('projectType')}
                    className={contactFormTouched.projectType && contactFormErrors.projectType ? 'error' : contactFormTouched.projectType && !contactFormErrors.projectType ? 'valid' : ''}
                    required
                  >
                    <option value="">Select project type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hospitality">Hospitality</option>
                  </select>
                  {contactFormTouched.projectType && contactFormErrors.projectType && (
                    <span className="error-icon">⚠️</span>
                  )}
                  {contactFormTouched.projectType && !contactFormErrors.projectType && contactForm.projectType && (
                    <span className="success-icon">✓</span>
                  )}
                </div>
                {contactFormTouched.projectType && contactFormErrors.projectType && (
                  <span className="error-message">{contactFormErrors.projectType}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactBudget">Budget Range</label>
                  <select 
                    id="contactBudget" 
                    name="contactBudget" 
                    value={contactForm.budget}
                    onChange={(e) => handleContactFormChange('budget', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-100k">Under 100,000 ETB</option>
                    <option value="100k-500k">100,000 - 500,000 ETB</option>
                    <option value="500k-1m">500,000 - 1,000,000 ETB</option>
                    <option value="1m-2m">1,000,000 - 2,000,000 ETB</option>
                    <option value="over-2m">Over 2,000,000 ETB</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="contactTimeline">Project Timeline</label>
                  <select 
                    id="contactTimeline" 
                    name="contactTimeline" 
                    value={contactForm.timeline}
                    onChange={(e) => handleContactFormChange('timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="6-12-months">6-12 months</option>
                    <option value="over-12-months">Over 12 months</option>
                    <option value="planning">Just planning</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contactHearAboutUs">How did you hear about us?</label>
                <select 
                  id="contactHearAboutUs" 
                  name="contactHearAboutUs" 
                  value={contactForm.hearAboutUs}
                  onChange={(e) => handleContactFormChange('hearAboutUs', e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="google">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral/Friend</option>
                  <option value="website">Saw your website</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contactMessage">Project Description</label>
                <div className="input-wrapper">
                  <textarea 
                    id="contactMessage" 
                    name="contactMessage" 
                    placeholder="Tell us about your vision, requirements, or any specific ideas you have in mind..." 
                    rows={5} 
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    onBlur={() => handleContactFormBlur('message')}
                    className={contactFormTouched.message && contactFormErrors.message ? 'error' : contactFormTouched.message && !contactFormErrors.message ? 'valid' : ''}
                    required
                  ></textarea>
                  {contactFormTouched.message && contactFormErrors.message && (
                    <span className="error-icon textarea-icon">⚠️</span>
                  )}
                  {contactFormTouched.message && !contactFormErrors.message && contactForm.message && (
                    <span className="success-icon textarea-icon">✓</span>
                  )}
                </div>
                {contactFormTouched.message && contactFormErrors.message && (
                  <span className="error-message">{contactFormErrors.message}</span>
                )}
                {contactFormTouched.message && !contactFormErrors.message && contactForm.message && (
                  <span className="character-count">{contactForm.message.length} characters</span>
                )}
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
                {formSubmissions.contact.status === 'loading' ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Sending...
                        </>
                      ) : (
                  'Send Message'
                )}
                  </motion.button>
            </form>
              </div>
            </motion.div>
        
      </section>


      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseBookingModal}
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
                  onClick={handleCloseBookingModal}
                  aria-label="Close booking consultation form"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCloseBookingModal();
                    }
                  }}
                >
                  <span aria-hidden="true">✕</span>
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
                      onClick={handleCloseBookingModal}
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
          <ThemeAwareLogo 
            className="footer-logo" 
            alt="Awra Finishing & Interior - Professional Architecture and Interior Design Company Logo"
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
                <li><a href="#services" onClick={() => setCurrentSection('services')}>Architectural Design</a></li>
                <li><a href="#services" onClick={() => setCurrentSection('services')}>Interior Design</a></li>
                <li><a href="#services" onClick={() => setCurrentSection('services')}>Finishing Work</a></li>
                <li><a href="#services" onClick={() => setCurrentSection('services')}>Brand Identity</a></li>
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
                <li><a href="#about" onClick={() => setCurrentSection('about')}>About Us</a></li>
                <li><a href="#works" onClick={() => setCurrentSection('works')}>Our Work</a></li>
                <li><a href="#contact" onClick={() => setCurrentSection('contact')}>Contact</a></li>
                <li><a href="#process" onClick={() => setCurrentSection('process')}>Our Process</a></li>
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
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowPrivacyModal(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowTermsModal(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                Terms of Service
              </a>
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
            onClick={() => {
              setShowPrivacyModal(false);
              document.body.style.overflow = '';
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
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
                <h2 id="privacy-modal-title">Privacy Policy</h2>
                <motion.button
                  className="legal-modal-close"
                  onClick={() => {
                    setShowPrivacyModal(false);
                    document.body.style.overflow = '';
                  }}
                  aria-label="Close privacy policy"
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
            onClick={() => {
              setShowTermsModal(false);
              document.body.style.overflow = '';
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
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
                <h2 id="terms-modal-title">Terms of Service</h2>
                <motion.button
                  className="legal-modal-close"
                  onClick={() => {
                    setShowTermsModal(false);
                    document.body.style.overflow = '';
                  }}
                  aria-label="Close terms of service"
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

      {/* Scroll Progress Indicator */}
      <ScrollProgress />
    </div>
  );
}
