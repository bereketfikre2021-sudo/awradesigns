/**
 * Comprehensive Console Filter
 * Aggressively filters out unwanted console messages
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  info: console.info,
  group: console.group,
  groupEnd: console.groupEnd
};

/**
 * Check if a message should be suppressed
 */
const shouldSuppressMessage = (...args) => {
  // Check if any argument matches suppression patterns
  for (let arg of args) {
    if (typeof arg === 'string') {
      const lowerMessage = arg.toLowerCase();
      
      // Suppress specific messages
      const suppressPatterns = [
        'download the react devtools',
        'error handlers initialized',
        'navigation timing:',
        'responsive design test results',
        'viewport info:',
        'current breakpoint:',
        'horizontal scroll:',
        'touch targets:',
        'images:',
        'text readability:',
        'responsive testing initialized',
        'responsive testing available',
        'horizontal scroll detected',
        'touch target issues found',
        'image responsiveness issues',
        'text readability issues',
        'image failed to load: data:image/svg+xml',
        'fbevents.js',
        'failed to load resource: net::err_blocked_by_client',
        'performancenavigationtiming',
        '📱 responsive design test results',
        '🔧 responsive testing',
        '🛡️ error handlers',
        '⚠️ horizontal scroll',
        '⚠️ touch target',
        '⚠️ image responsiveness',
        '⚠️ text readability'
      ];
      
      if (suppressPatterns.some(pattern => lowerMessage.includes(pattern))) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Filter console.log
 */
console.log = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.log.apply(console, args);
};

/**
 * Filter console.warn
 */
console.warn = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.warn.apply(console, args);
};

/**
 * Filter console.error
 */
console.error = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.error.apply(console, args);
};

/**
 * Filter console.info
 */
console.info = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.info.apply(console, args);
};

/**
 * Filter console.debug
 */
console.debug = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.debug.apply(console, args);
};

/**
 * Filter console.group
 */
console.group = (...args) => {
  if (shouldSuppressMessage(...args)) {
    return;
  }
  originalConsole.group.apply(console, args);
};

/**
 * Restore original console (for debugging)
 */
window.restoreConsole = () => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
  console.group = originalConsole.group;
  console.groupEnd = originalConsole.groupEnd;
  console.log('Console restored');
};

// Export for potential use
export { originalConsole, shouldSuppressMessage };
