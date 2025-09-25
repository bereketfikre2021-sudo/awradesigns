/**
 * Resource loading utilities to optimize performance and reduce console warnings
 */

/**
 * Preload critical resources with proper timing
 */
export const preloadCriticalResources = () => {
  // Only preload resources that are actually used above the fold
  const criticalResources = [
    {
      href: '/images/hero-image.webp',
      as: 'image',
      type: 'image/webp',
      fetchpriority: 'high'
    }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    link.type = resource.type;
    if (resource.fetchpriority) {
      link.fetchPriority = resource.fetchpriority;
    }
    document.head.appendChild(link);
  });
};

/**
 * Prefetch below-the-fold resources when appropriate
 */
export const prefetchResources = () => {
  // Only prefetch resources that are likely to be needed
  const prefetchResources = [
    '/images/work-samples-1.webp',
    '/images/work-samples-2.webp',
    '/images/work-samples-3.webp'
  ];

  // Use requestIdleCallback for non-critical prefetching
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      prefetchResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    }, 2000);
  }
};

/**
 * Load resources on demand to avoid preload warnings
 */
export const loadResourceOnDemand = (href, as = 'image') => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.onload = () => resolve(href);
    link.onerror = () => reject(new Error(`Failed to load resource: ${href}`));
    document.head.appendChild(link);
  });
};

/**
 * Check if a resource is already loaded or cached
 */
export const isResourceCached = (href) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = href;
  });
};

/**
 * Optimize resource loading based on connection speed
 */
export const optimizeForConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // For slow connections, reduce prefetching
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return { prefetch: false, preload: false };
    }
    
    // For fast connections, enable aggressive prefetching
    if (connection.effectiveType === '4g') {
      return { prefetch: true, preload: true };
    }
  }
  
  // Default behavior
  return { prefetch: true, preload: true };
};
