/**
 * Console optimization utilities to handle warnings and errors gracefully
 */

/**
 * Suppress specific console warnings in production
 */
export const suppressConsoleWarnings = () => {
  if (process.env.NODE_ENV === 'production') {
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    // Suppress React DevTools warning
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('Download the React DevTools')) {
          return;
        }
        if (args[0].includes('Facebook Pixel blocked by ad blocker')) {
          return;
        }
        if (args[0].includes('preloaded using link preload but not used')) {
          return;
        }
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Suppress specific errors that are expected
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('Failed to load resource: net::ERR_BLOCKED_BY_CLIENT')) {
          return;
        }
        if (args[0].includes('fbevents.js')) {
          return;
        }
      }
      originalConsoleError.apply(console, args);
    };
  }
};

/**
 * Handle resource loading errors gracefully
 */
export const handleResourceErrors = () => {
  // Global error handler for resource loading
  window.addEventListener('error', (event) => {
    try {
      if (event.target !== window) {
        // Resource loading error
        if (event.target.tagName === 'IMG' || event.target.tagName === 'LINK') {
          console.debug(`Resource loading failed: ${event.target.src || event.target.href}`);
          event.preventDefault();
          return false;
        }
      }
    } catch (e) {
      console.debug('Error handler failed:', e);
    }
  }, true);
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    try {
      if (event.reason && event.reason.message) {
        if (event.reason.message.includes('Failed to load resource')) {
          console.debug('Resource loading promise rejected:', event.reason.message);
          event.preventDefault();
          return false;
        }
      }
    } catch (e) {
      console.debug('Promise rejection handler failed:', e);
    }
  });
};

/**
 * Optimize performance monitoring
 */
export const optimizePerformanceMonitoring = () => {
  // Disable performance monitoring console output to keep console clean
  // Performance monitoring is still available but doesn't spam console
  if (process.env.NODE_ENV === 'development') {
    // Basic performance monitoring without external dependencies
    if ('performance' in window && 'getEntriesByType' in performance) {
      try {
        // Monitor basic performance metrics silently
        const observer = new PerformanceObserver((list) => {
          try {
            // Performance monitoring is active but doesn't log to console
            // This prevents console spam while maintaining monitoring capability
          } catch (e) {
            console.debug('Performance observer callback error:', e);
          }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        // Performance Observer not supported or failed
        console.debug('Performance monitoring not available:', e);
      }
    }
  }
};

/**
 * Initialize all console optimizations
 */
export const initializeConsoleOptimizations = () => {
  suppressConsoleWarnings();
  handleResourceErrors();
  optimizePerformanceMonitoring();
};
