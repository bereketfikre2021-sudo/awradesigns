import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const LazySection = ({ 
  children, 
  className = '', 
  threshold = 0.1,
  rootMargin = '100px',
  animation = true,
  fallback = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !isLoaded) {
      // Add a small delay to ensure smooth loading
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setShouldRender(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView, isLoaded]);

  const animationProps = animation ? {
    initial: { opacity: 0, y: 50 },
    animate: shouldRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  return (
    <div ref={ref} className={`lazy-section ${className}`} {...props}>
      {shouldRender ? (
        animation ? (
          <motion.div {...animationProps}>
            {children}
          </motion.div>
        ) : (
          children
        )
      ) : (
        fallback || (
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
            Loading...
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
