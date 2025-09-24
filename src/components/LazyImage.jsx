import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsError(true);
    if (onError) onError();
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-image-container ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div 
          className="lazy-image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#999',
            fontSize: '14px'
          }}
        >
          {placeholder || 'Loading...'}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div 
          className="lazy-image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#999',
            fontSize: '14px'
          }}
        >
          Failed to load
        </div>
      )}

      {/* Actual image */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: isError ? 'none' : 'block'
          }}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
