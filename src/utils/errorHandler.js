/**
 * Comprehensive Error Handling Utilities
 * Catches and handles all types of console errors gracefully
 */

/**
 * Global error handler for uncaught errors
 */
export const setupGlobalErrorHandler = () => {
  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    try {
      // Log error details in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Uncaught Error');
        console.error('Error:', event.error);
        console.error('Message:', event.message);
        console.error('Filename:', event.filename);
        console.error('Line:', event.lineno);
        console.error('Column:', event.colno);
        console.groupEnd();
      }
      
      // Prevent default error handling for known issues
      if (event.error && event.error.message) {
        const message = event.error.message.toLowerCase();
        
        // Ignore common third-party errors
        if (
          message.includes('script error') ||
          message.includes('non-passive event listener') ||
          message.includes('resizeobserver loop limit exceeded') ||
          message.includes('loading chunk') ||
          message.includes('loading css chunk') ||
          message.includes('chunk load error') ||
          message.includes('failed to load resource: net::err_blocked_by_client') ||
          message.includes('fbevents.js')
        ) {
          event.preventDefault();
          return false;
        }
      }
      
      // Send to error reporting service in production
      if (process.env.NODE_ENV === 'production' && window.gtag) {
        window.gtag('event', 'exception', {
          description: event.message,
          fatal: false
        });
      }
    } catch (e) {
      console.debug('Error handler failed:', e);
    }
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    try {
      // Log rejection details in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Unhandled Promise Rejection');
        console.error('Reason:', event.reason);
        console.error('Promise:', event.promise);
        console.groupEnd();
      }
      
      // Prevent default handling for known issues
      if (event.reason && event.reason.message) {
        const message = event.reason.message.toLowerCase();
        
        // Ignore common third-party promise rejections
        if (
          message.includes('loading chunk') ||
          message.includes('loading css chunk') ||
          message.includes('chunk load error') ||
          message.includes('network error') ||
          message.includes('failed to fetch')
        ) {
          event.preventDefault();
          return false;
        }
      }
      
      // Send to error reporting service in production
      if (process.env.NODE_ENV === 'production' && window.gtag) {
        window.gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled promise rejection',
          fatal: false
        });
      }
    } catch (e) {
      console.debug('Promise rejection handler failed:', e);
    }
  });
};

/**
 * Handle React errors
 */
export const setupReactErrorHandler = () => {
  // Override console.error to catch React errors
  const originalConsoleError = console.error;
  
  console.error = (...args) => {
    try {
      // Check if it's a React error
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0].toLowerCase();
        
        // Suppress common React warnings
        if (
          message.includes('warning:') ||
          message.includes('react-dom') ||
          message.includes('act()') ||
          message.includes('finddomnode') ||
          message.includes('legacy context') ||
          message.includes('componentwillmount') ||
          message.includes('componentwillreceiveprops') ||
          message.includes('download the react devtools')
        ) {
          // Suppress completely
          return;
        }
      }
      
      // Log other errors normally
      originalConsoleError.apply(console, args);
    } catch (e) {
      // Fallback to original console.error
      originalConsoleError.apply(console, args);
    }
  };
};

/**
 * Handle network errors
 */
export const setupNetworkErrorHandler = () => {
  // Handle fetch errors
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // Check for HTTP errors
      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`HTTP ${response.status}: ${response.statusText}`, args[0]);
        }
      }
      
      return response;
    } catch (error) {
      // Handle network errors gracefully
      if (process.env.NODE_ENV === 'development') {
        console.warn('Network error:', error.message, args[0]);
      }
      
      // Re-throw the error
      throw error;
    }
  };
};

/**
 * Handle resource loading errors
 */
export const setupResourceErrorHandler = () => {
  // Handle image loading errors
  document.addEventListener('error', (event) => {
    try {
      if (event.target.tagName === 'IMG') {
        const img = event.target;
        
        // Don't set fallback for data URLs or already processed images
        if (!img.src.includes('data:image') && !img.dataset.fallbackSet) {
          img.dataset.fallbackSet = 'true';
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
        }
        
        // Suppress image loading warnings in development
        // Only log if it's not a fallback image
        if (process.env.NODE_ENV === 'development' && !img.src.includes('data:image/svg+xml')) {
          console.debug('Image failed to load:', img.src);
        }
      }
    } catch (e) {
      console.debug('Image error handler failed:', e);
    }
  }, true);
};

/**
 * Handle console warnings
 */
export const setupConsoleWarningHandler = () => {
  const originalConsoleWarn = console.warn;
  
  console.warn = (...args) => {
    try {
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0].toLowerCase();
        
        // Suppress common warnings
        if (
          message.includes('deprecated') ||
          message.includes('experimental') ||
          message.includes('non-passive event listener') ||
          message.includes('resizeobserver loop limit exceeded') ||
          message.includes('webgl') ||
          message.includes('three.js') ||
          message.includes('framer-motion') ||
          message.includes('download the react devtools') ||
          message.includes('image failed to load') ||
          message.includes('horizontal scroll detected') ||
          message.includes('touch target issues found') ||
          message.includes('image responsiveness issues') ||
          message.includes('text readability issues')
        ) {
          // Suppress these warnings completely
          return;
        }
      }
      
      // Log other warnings normally
      originalConsoleWarn.apply(console, args);
    } catch (e) {
      // Fallback to original console.warn
      originalConsoleWarn.apply(console, args);
    }
  };
};

/**
 * Initialize all error handlers
 */
export const initializeErrorHandlers = () => {
  try {
    setupGlobalErrorHandler();
    setupReactErrorHandler();
    setupNetworkErrorHandler();
    setupResourceErrorHandler();
    setupConsoleWarningHandler();
    
    // Error handlers are initialized silently to keep console clean
    // No console message needed
  } catch (e) {
    console.debug('Error handler initialization failed:', e);
  }
};

/**
 * Test error handling
 */
export const testErrorHandling = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Testing error handling...');
    
    // Test console error handling
    setTimeout(() => {
      console.error('Test error message');
    }, 100);
    
    // Test console warning handling
    setTimeout(() => {
      console.warn('Test warning message');
    }, 200);
    
    // Test promise rejection handling
    setTimeout(() => {
      Promise.reject(new Error('Test promise rejection'));
    }, 300);
  }
};
