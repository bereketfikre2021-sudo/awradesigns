/**
 * Error Reporting Configuration
 * 
 * Configure error reporting by setting environment variables:
 * 
 * VITE_ERROR_REPORTING_ENABLED=true
 * VITE_ERROR_SERVICE=custom (options: 'sentry', 'logrocket', 'custom', 'console')
 * VITE_ERROR_REPORTING_ENDPOINT=/api/errors
 * VITE_SENTRY_DSN=your_sentry_dsn_here
 * VITE_LOGROCKET_APP_ID=your_logrocket_app_id_here
 */

export const errorReportingConfig = {
  // Enable/disable error reporting
  enabled: import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true' || import.meta.env.PROD,
  
  // Service selection
  service: import.meta.env.VITE_ERROR_SERVICE || 'custom',
  
  // Custom endpoint configuration
  customEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT || '/api/errors',
  
  // Sentry configuration
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
  
  // LogRocket configuration
  logrocketAppId: import.meta.env.VITE_LOGROCKET_APP_ID || '',
  
  // Batch settings
  maxQueueSize: 50,
  flushInterval: 5000,
};

export default errorReportingConfig;

