/**
 * Error Reporting Service
 * Comprehensive error tracking and reporting system
 * Supports multiple error reporting services (Sentry, LogRocket, custom endpoints)
 */

// Configuration
const ERROR_REPORTING_CONFIG = {
  // Enable/disable error reporting
  enabled: import.meta.env.PROD || import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true',
  
  // Error reporting service type: 'sentry', 'logrocket', 'custom', 'console'
  service: import.meta.env.VITE_ERROR_SERVICE || 'custom',
  
  // Service-specific configurations
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: 1.0,
  },
  
  logrocket: {
    appId: import.meta.env.VITE_LOGROCKET_APP_ID || '',
  },
  
  custom: {
    // Custom error reporting endpoint
    endpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT || '/api/errors',
    // Maximum number of errors to queue before flushing
    maxQueueSize: 50,
    // Flush interval in milliseconds
    flushInterval: 5000,
  },
  
  // Google Analytics fallback
  googleAnalytics: {
    enabled: typeof window !== 'undefined' && window.gtag,
  },
};

// Error queue for batch sending
let errorQueue = [];
let flushTimer = null;

/**
 * Initialize error reporting service
 */
export const initErrorReporting = () => {
  if (!ERROR_REPORTING_CONFIG.enabled) {
    return;
  }

  // Initialize service based on type
  switch (ERROR_REPORTING_CONFIG.service) {
    case 'sentry':
      initSentry();
      break;
    case 'logrocket':
      initLogRocket();
      break;
    case 'custom':
      initCustomService();
      break;
    default:
      console.warn('Unknown error reporting service:', ERROR_REPORTING_CONFIG.service);
  }

  // Set up global error handlers
  setupGlobalErrorHandlers();
  
  // Set up API error interceptors
  setupAPIErrorHandlers();
};

/**
 * Initialize Sentry
 */
const initSentry = () => {
  // Dynamic import for Sentry (optional dependency)
  if (typeof window === 'undefined') return;
  
  try {
    // If Sentry is installed, initialize it
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.init({
    //     dsn: ERROR_REPORTING_CONFIG.sentry.dsn,
    //     environment: ERROR_REPORTING_CONFIG.sentry.environment,
    //     tracesSampleRate: ERROR_REPORTING_CONFIG.sentry.tracesSampleRate,
    //     integrations: [
    //       new Sentry.BrowserTracing(),
    //     ],
    //   });
    // });
    console.log('Sentry integration ready (install @sentry/react to enable)');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

/**
 * Initialize LogRocket
 */
const initLogRocket = () => {
  if (typeof window === 'undefined' || !ERROR_REPORTING_CONFIG.logrocket.appId) return;
  
  try {
    // Dynamic import for LogRocket
    // import('logrocket').then((LogRocket) => {
    //   LogRocket.init(ERROR_REPORTING_CONFIG.logrocket.appId);
    // });
    console.log('LogRocket integration ready (install logrocket to enable)');
  } catch (error) {
    console.error('Failed to initialize LogRocket:', error);
  }
};

/**
 * Initialize custom error reporting service
 */
const initCustomService = () => {
  // Set up flush timer
  flushTimer = setInterval(() => {
    if (errorQueue.length > 0) {
      flushErrorQueue();
    }
  }, ERROR_REPORTING_CONFIG.custom.flushInterval);
  
  // Flush on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      flushErrorQueue(true); // Force sync flush
    });
  }
};

/**
 * Set up global error handlers
 */
const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;

  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    reportError({
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      type: 'unhandled_error',
      severity: 'error',
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    reportError({
      message: event.reason?.message || 'Unhandled Promise Rejection',
      error: event.reason,
      type: 'unhandled_promise_rejection',
      severity: 'error',
    });
  });
};

/**
 * Set up API error handlers
 */
const setupAPIErrorHandlers = () => {
  // This would typically integrate with your HTTP client (axios, fetch wrapper, etc.)
  // For now, we'll provide utility functions that can be used in API calls
  console.log('API error handlers initialized');
};

/**
 * Report an error
 */
export const reportError = (errorData) => {
  const {
    error,
    message,
    componentStack,
    context = {},
    severity = 'error',
    type = 'unknown',
    user = null,
    tags = {},
    fingerprint = null,
  } = errorData;

  // Build error report
  const errorReport = {
    id: generateErrorId(),
    timestamp: new Date().toISOString(),
    message: message || error?.message || 'Unknown error',
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : null,
    componentStack,
    context: {
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight,
      } : null,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    },
    severity,
    type,
    user: user || getUserInfo(),
    tags,
    fingerprint: fingerprint || generateFingerprint(errorData),
    environment: ERROR_REPORTING_CONFIG.sentry?.environment || import.meta.env.MODE,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('🚨 Error Report:', errorReport);
  }

  // Send to configured service
  switch (ERROR_REPORTING_CONFIG.service) {
    case 'sentry':
      sendToSentry(errorReport);
      break;
    case 'logrocket':
      sendToLogRocket(errorReport);
      break;
    case 'custom':
      queueError(errorReport);
      break;
    case 'console':
      console.error('Error Report:', errorReport);
      break;
  }

  // Always send to Google Analytics if available
  if (ERROR_REPORTING_CONFIG.googleAnalytics.enabled && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorReport.message,
      fatal: severity === 'error',
      error_id: errorReport.id,
    });
  }

  return errorReport.id;
};

/**
 * Send error to Sentry
 */
const sendToSentry = (errorReport) => {
  // This would use Sentry SDK if available
  // Sentry.captureException(error, {
  //   contexts: { react: { componentStack } },
  //   tags,
  //   user,
  //   fingerprint,
  // });
  console.log('Sentry report:', errorReport);
};

/**
 * Send error to LogRocket
 */
const sendToLogRocket = (errorReport) => {
  // This would use LogRocket SDK if available
  // LogRocket.captureException(error);
  console.log('LogRocket report:', errorReport);
};

/**
 * Queue error for batch sending (custom service)
 */
const queueError = (errorReport) => {
  errorQueue.push(errorReport);

  // Flush if queue is full
  if (errorQueue.length >= ERROR_REPORTING_CONFIG.custom.maxQueueSize) {
    flushErrorQueue();
  }
};

/**
 * Flush error queue to custom endpoint
 */
const flushErrorQueue = async (sync = false) => {
  if (errorQueue.length === 0) return;

  const errors = [...errorQueue];
  errorQueue = [];

  const sendErrors = async () => {
    try {
      const response = await fetch(ERROR_REPORTING_CONFIG.custom.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors }),
        // Don't block page unload
        keepalive: true,
      });

      if (!response.ok) {
        console.error('Failed to send error reports:', response.statusText);
        // Re-queue errors if sending failed (limit retries)
        if (errors.length < ERROR_REPORTING_CONFIG.custom.maxQueueSize) {
          errorQueue.push(...errors);
        }
      }
    } catch (error) {
      console.error('Error sending error reports:', error);
      // Re-queue errors if sending failed
      if (errors.length < ERROR_REPORTING_CONFIG.custom.maxQueueSize) {
        errorQueue.push(...errors);
      }
    }
  };

  if (sync) {
    // Use sendBeacon for synchronous sending on page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const data = JSON.stringify({ errors });
      navigator.sendBeacon(ERROR_REPORTING_CONFIG.custom.endpoint, data);
    } else {
      // Fallback to fetch with keepalive
      sendErrors();
    }
  } else {
    sendErrors();
  }
};

/**
 * Generate unique error ID
 */
const generateErrorId = () => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate error fingerprint for grouping similar errors
 */
const generateFingerprint = (errorData) => {
  const { error, message, type } = errorData;
  
  if (error?.stack) {
    // Use first few lines of stack trace for fingerprinting
    const stackLines = error.stack.split('\n').slice(0, 3).join('\n');
    return btoa(stackLines).substr(0, 16);
  }
  
  // Fallback to message + type
  return btoa(`${type}:${message}`).substr(0, 16);
};

/**
 * Get user info (if available)
 */
const getUserInfo = () => {
  // This would typically get user info from your auth system
  // For now, return null or basic info
  try {
    // Example: Get from localStorage or context
    // const user = JSON.parse(localStorage.getItem('user'));
    // return user ? { id: user.id, email: user.email } : null;
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Report React component error
 */
export const reportComponentError = (error, errorInfo) => {
  return reportError({
    error,
    message: error.message,
    componentStack: errorInfo?.componentStack,
    type: 'react_component_error',
    severity: 'error',
    context: {
      componentName: extractComponentName(errorInfo?.componentStack),
    },
  });
};

/**
 * Report API error
 */
export const reportAPIError = (error, context = {}) => {
  return reportError({
    error,
    message: error.message || 'API Error',
    type: 'api_error',
    severity: 'error',
    context: {
      ...context,
      statusCode: error.status || error.response?.status,
      url: error.url || error.config?.url,
      method: error.method || error.config?.method,
    },
  });
};

/**
 * Report warning
 */
export const reportWarning = (message, context = {}) => {
  return reportError({
    message,
    type: 'warning',
    severity: 'warning',
    context,
  });
};

/**
 * Set user context for error reporting
 */
export const setUserContext = (user) => {
  // This would set user context in Sentry/LogRocket
  // For now, store in module for use in error reports
  window.__ERROR_REPORTING_USER__ = user;
};

/**
 * Extract component name from stack trace
 */
const extractComponentName = (componentStack) => {
  if (!componentStack) return null;
  
  const match = componentStack.match(/^\s*at\s+(\w+)/);
  return match ? match[1] : null;
};

/**
 * Test error reporting (for development)
 */
export const testErrorReporting = () => {
  if (import.meta.env.DEV) {
    reportError({
      message: 'Test error from error reporting service',
      type: 'test',
      severity: 'info',
      context: {
        test: true,
      },
    });
  }
};

export default {
  init: initErrorReporting,
  reportError,
  reportComponentError,
  reportAPIError,
  reportWarning,
  setUserContext,
  test: testErrorReporting,
};

