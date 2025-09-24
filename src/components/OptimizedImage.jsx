import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = null,
  onLoad = null,
  onError = null,
  priority = false,
  quality = 85,
  sizes = '100vw',
  loading = 'lazy',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate optimized image URL
  const generateOptimizedUrl = (originalSrc, width, quality) => {
    // For now, return original src
    // In production, you would integrate with an image optimization service
    // like Cloudinary, ImageKit, or Next.js Image Optimization
    return originalSrc;
  };

  // Check if WebP is supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Generate WebP URL if supported
  const getWebPUrl = (src) => {
    if (supportsWebP() && src) {
      // In production, you would replace with actual WebP version
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return src;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading]);

  // Load image when in view
  useEffect(() => {
    if (isInView && src && !imageSrc) {
      const optimizedSrc = generateOptimizedUrl(src, width, quality);
      const webpSrc = getWebPUrl(optimizedSrc);
      
      // Preload image
      const img = new Image();
      img.onload = () => {
        setImageSrc(webpSrc);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        setIsError(true);
        if (onError) onError();
      };
      img.src = webpSrc;
    }
  }, [isInView, src, width, quality, imageSrc, onLoad, onError]);

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
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: '#f0f0f0'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <motion.div 
          className="image-placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            fontSize: '14px',
            zIndex: 1
          }}
        >
          {placeholder || (
            <div className="skeleton-loader">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error state */}
      {isError && (
        <motion.div 
          className="image-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
            fontSize: '14px',
            zIndex: 2
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
            <div>Failed to load image</div>
          </div>
        </motion.div>
      )}

      {/* Actual image */}
      {imageSrc && (
        <motion.img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          sizes={sizes}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: isError ? 'none' : 'block'
          }}
          {...props}
        />
      )}

      <style jsx>{`
        .skeleton-loader {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .optimized-image-container {
          border-radius: var(--radius-md, 8px);
        }

        .optimized-image-container img {
          border-radius: inherit;
        }

        @media (max-width: 768px) {
          .optimized-image-container {
            border-radius: var(--radius-sm, 4px);
          }
        }
      `}</style>
    </div>
  );
};

// Image Gallery Component
export const ImageGallery = ({ images, className = '' }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={`image-gallery ${className}`}>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="gallery-item"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(image)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={300}
              height={200}
              placeholder="Loading..."
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          className="image-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              ✕
            </button>
            <OptimizedImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={800}
              height={600}
              priority={true}
              loading="eager"
            />
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .image-gallery {
          width: 100%;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-md, 1rem);
        }

        .gallery-item {
          cursor: pointer;
          border-radius: var(--radius-md, 8px);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        .gallery-item:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .image-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: var(--space-lg, 1.5rem);
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--space-sm, 0.5rem);
          }

          .lightbox-content {
            max-width: 95vw;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
