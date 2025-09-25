/**
 * Responsive Design Testing Utilities
 * Helps verify and debug responsive design issues
 */

/**
 * Get current viewport information
 */
export const getViewportInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    userAgent: navigator.userAgent,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android(?=.*\bMobile\b)/i.test(navigator.userAgent),
    isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
};

/**
 * Test responsive breakpoints
 */
export const testBreakpoints = () => {
  const viewport = getViewportInfo();
  const breakpoints = {
    xs: viewport.width < 576,
    sm: viewport.width >= 576 && viewport.width < 768,
    md: viewport.width >= 768 && viewport.width < 992,
    lg: viewport.width >= 992 && viewport.width < 1200,
    xl: viewport.width >= 1200 && viewport.width < 1920,
    xxl: viewport.width >= 1920
  };
  
  return {
    current: Object.keys(breakpoints).find(key => breakpoints[key]) || 'unknown',
    all: breakpoints,
    viewport
  };
};

/**
 * Check for horizontal scrolling issues
 */
export const checkHorizontalScroll = () => {
  const bodyWidth = document.body.scrollWidth;
  const windowWidth = window.innerWidth;
  const hasHorizontalScroll = bodyWidth > windowWidth;
  
  return {
    hasHorizontalScroll,
    bodyWidth,
    windowWidth,
    overflow: bodyWidth - windowWidth
  };
};

/**
 * Test touch targets (minimum 44px)
 */
export const testTouchTargets = () => {
  try {
    const buttons = document.querySelectorAll('button, .btn, a[role="button"], input[type="button"], input[type="submit"]');
    const issues = [];
    
    buttons.forEach((button, index) => {
      try {
        const rect = button.getBoundingClientRect();
        const minSize = 44;
        
        if (rect.width < minSize || rect.height < minSize) {
          issues.push({
            element: button,
            index,
            width: rect.width,
            height: rect.height,
            minRequired: minSize
          });
        }
      } catch (e) {
        console.debug('Error testing button:', e);
      }
    });
    
    return {
      totalButtons: buttons.length,
      issues,
      hasIssues: issues.length > 0
    };
  } catch (e) {
    console.debug('Touch targets test failed:', e);
    return {
      totalButtons: 0,
      issues: [],
      hasIssues: false
    };
  }
};

/**
 * Test image responsiveness
 */
export const testImageResponsiveness = () => {
  try {
    const images = document.querySelectorAll('img');
    const issues = [];
    
    images.forEach((img, index) => {
      try {
        const rect = img.getBoundingClientRect();
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const viewportWidth = window.innerWidth;
        
        // Check if image is wider than viewport
        if (rect.width > viewportWidth) {
          issues.push({
            element: img,
            index,
            displayWidth: rect.width,
            viewportWidth,
            naturalWidth,
            naturalHeight,
            issue: 'Image wider than viewport'
          });
        }
        
        // Check if image has proper max-width
        const computedStyle = window.getComputedStyle(img);
        if (computedStyle.maxWidth === 'none' || computedStyle.maxWidth === '') {
          issues.push({
            element: img,
            index,
            issue: 'Missing max-width constraint'
          });
        }
      } catch (e) {
        console.debug('Error testing image:', e);
      }
    });
    
    return {
      totalImages: images.length,
      issues,
      hasIssues: issues.length > 0
    };
  } catch (e) {
    console.debug('Image responsiveness test failed:', e);
    return {
      totalImages: 0,
      issues: [],
      hasIssues: false
    };
  }
};

/**
 * Test text readability
 */
export const testTextReadability = () => {
  try {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    const issues = [];
    
    textElements.forEach((element, index) => {
      try {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        
        // Check minimum font size (16px recommended)
        if (fontSize < 16) {
          issues.push({
            element,
            index,
            fontSize,
            issue: 'Font size too small for mobile'
          });
        }
        
        // Check line height
        if (lineHeight < fontSize * 1.4) {
          issues.push({
            element,
            index,
            fontSize,
            lineHeight,
            issue: 'Line height too tight'
          });
        }
        
        // Check for text overflow
        if (rect.width > window.innerWidth) {
          issues.push({
            element,
            index,
            width: rect.width,
            viewportWidth: window.innerWidth,
            issue: 'Text overflows viewport'
          });
        }
      } catch (e) {
        console.debug('Error testing text element:', e);
      }
    });
    
    return {
      totalTextElements: textElements.length,
      issues,
      hasIssues: issues.length > 0
    };
  } catch (e) {
    console.debug('Text readability test failed:', e);
    return {
      totalTextElements: 0,
      issues: [],
      hasIssues: false
    };
  }
};

/**
 * Run comprehensive responsive test
 */
export const runResponsiveTest = () => {
  try {
    const results = {
      viewport: getViewportInfo(),
      breakpoints: testBreakpoints(),
      horizontalScroll: checkHorizontalScroll(),
      touchTargets: testTouchTargets(),
      images: testImageResponsiveness(),
      text: testTextReadability(),
      timestamp: new Date().toISOString()
    };
    
    // Log results to console (only in development and only once)
    if (process.env.NODE_ENV === 'development' && !window.responsiveTestLogged) {
      console.group('📱 Responsive Design Test Results');
      console.log('Viewport Info:', results.viewport);
      console.log('Current Breakpoint:', results.breakpoints.current);
      console.log('Horizontal Scroll:', results.horizontalScroll);
      console.log('Touch Targets:', results.touchTargets);
      console.log('Images:', results.images);
      console.log('Text Readability:', results.text);
      console.groupEnd();
      window.responsiveTestLogged = true;
    }
    
    return results;
  } catch (e) {
    console.debug('Responsive test failed:', e);
    return {
      viewport: getViewportInfo(),
      breakpoints: { current: 'unknown', all: {}, viewport: {} },
      horizontalScroll: { hasHorizontalScroll: false, bodyWidth: 0, windowWidth: 0, overflow: 0 },
      touchTargets: { totalButtons: 0, issues: [], hasIssues: false },
      images: { totalImages: 0, issues: [], hasIssues: false },
      text: { totalTextElements: 0, issues: [], hasIssues: false },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Monitor responsive changes
 */
export const monitorResponsiveChanges = (callback) => {
  let timeout;
  
  const handleResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const results = runResponsiveTest();
      if (callback) callback(results);
    }, 250);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    clearTimeout(timeout);
  };
};

/**
 * Initialize responsive testing in development
 */
export const initResponsiveTesting = () => {
  if (process.env.NODE_ENV === 'development') {
    // Wait for DOM to be ready before running tests
    const runTestsWhenReady = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTestsWhenReady);
        return;
      }
      
      // Small delay to ensure all components are rendered
      setTimeout(() => {
        try {
          // Make testing functions available globally in development (without auto-running)
          window.responsiveTest = {
            run: runResponsiveTest,
            getViewport: getViewportInfo,
            testBreakpoints,
            checkHorizontalScroll,
            testTouchTargets,
            testImages: testImageResponsiveness,
            testText: testTextReadability,
            cleanup: () => {}
          };
          
          // Responsive testing is available silently
          // Use window.responsiveTest.run() to test manually if needed
        } catch (error) {
          console.debug('Responsive testing initialization failed:', error);
        }
      }, 1000);
    };
    
    runTestsWhenReady();
  }
};
