import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyComponent = ({ 
  component: Component, 
  fallback = null,
  threshold = 0.1,
  rootMargin = '100px',
  ...props 
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [inView, shouldLoad]);

  const defaultFallback = (
    <div 
      style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px'
      }}
    >
      Loading component...
    </div>
  );

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <Suspense fallback={fallback || defaultFallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = (WrappedComponent, options = {}) => {
  return (props) => (
    <LazyComponent 
      component={WrappedComponent} 
      {...options} 
      {...props} 
    />
  );
};

// Utility function to create lazy components
export const createLazyComponent = (importFunc, options = {}) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <LazyComponent 
      component={LazyComponent} 
      {...options} 
      {...props} 
    />
  );
};

export default LazyComponent;
