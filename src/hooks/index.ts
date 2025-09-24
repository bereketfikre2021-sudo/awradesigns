import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGesture } from 'react-use-gesture';
import { useSpring, animated } from 'react-spring';
import { utils } from '../utils';

// Performance Hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    frameRate: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }));
      }
    };

    const measureFrameRate = () => {
      let lastTime = performance.now();
      let frameCount = 0;
      
      const countFrames = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          setMetrics(prev => ({ ...prev, frameRate: frameCount }));
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
      };
      
      requestAnimationFrame(countFrames);
    };

    measureLoadTime();
    measureMemory();
    measureFrameRate();

    const interval = setInterval(measureMemory, 1000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Intersection Observer Hook
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, rootMargin, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

// Gesture Hook
export const useAdvancedGestures = () => {
  const [gestureState, setGestureState] = useState({
    isDragging: false,
    isPinching: false,
    isRotating: false,
    delta: [0, 0],
    velocity: [0, 0],
    scale: 1,
    rotation: 0,
  });

  const bind = useGesture(
    {
      onDrag: ({ active, delta, velocity }) => {
        setGestureState(prev => ({
          ...prev,
          isDragging: active,
          delta,
          velocity,
        }));
      },
      onPinch: ({ active, scale }) => {
        setGestureState(prev => ({
          ...prev,
          isPinching: active,
          scale,
        }));
      },
      onWheel: ({ delta }) => {
        setGestureState(prev => ({
          ...prev,
          delta: [delta[0], delta[1]],
        }));
      },
    },
    {
      drag: { filterTaps: true },
      pinch: { scaleBounds: { min: 0.5, max: 2 } },
    }
  );

  return { bind, gestureState };
};

// Animation Hook
export const useAdvancedAnimation = (isVisible: boolean) => {
  const [springProps, api] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(50px) scale(0.9)',
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    if (isVisible) {
      api.start({
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
      });
    } else {
      api.start({
        opacity: 0,
        transform: 'translateY(50px) scale(0.9)',
      });
    }
  }, [isVisible, api]);

  return springProps;
};

// Local Storage Hook
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

// Theme Hook removed - using brand colors (black & yellow) only

// Device Detection Hook
export const useDevice = () => {
  const [device, setDevice] = useState({
    type: utils.getDeviceType(),
    isTouch: utils.isTouchDevice(),
    isRetina: utils.isRetinaDisplay(),
    orientation: 'portrait' as 'portrait' | 'landscape',
  });

  useEffect(() => {
    const handleResize = utils.debounce(() => {
      setDevice(prev => ({
        ...prev,
        type: utils.getDeviceType(),
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      }));
    }, 250);

    const handleOrientationChange = () => {
      setDevice(prev => ({
        ...prev,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return device;
};

// Network Status Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const updateConnectionType = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionType('slow');
        } else if (effectiveType === '3g' || effectiveType === '4g') {
          setConnectionType('fast');
        } else {
          setConnectionType('unknown');
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateConnectionType);
      updateConnectionType();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType };
};

// Geolocation Hook
export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  return { location, error, loading, getCurrentPosition };
};

// Speech Recognition Hook
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported by this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  };
};

// WebGL Hook
export const useWebGL = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [context, setContext] = useState<WebGLRenderingContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIsSupported(!!gl);
    setContext(gl);
  }, []);

  return { isSupported, context, canvasRef };
};

// Intersection Observer with Animation
export const useAnimatedInView = (threshold: number = 0.1) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });

  const springProps = useAdvancedAnimation(inView);

  return { ref, inView, springProps };
};

// Debounced Value Hook
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Previous Value Hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Media Query Hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Copy to Clipboard Hook
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  return { copied, copy };
};

// Lazy Loading Hook with Performance Optimization
export const useLazyLoading = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true);
      
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldLoad(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShouldLoad(true);
      }
    }
  }, [inView, isVisible, delay]);

  useEffect(() => {
    if (shouldLoad && !isLoaded) {
      setIsLoaded(true);
    }
  }, [shouldLoad, isLoaded]);

  return {
    ref,
    isLoaded,
    isVisible,
    shouldLoad,
    inView
  };
};

// Image Lazy Loading Hook
export const useLazyImage = (src, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = null
  } = options;

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

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
  };

  const handleError = () => {
    setIsError(true);
  };

  return {
    ref,
    imageSrc,
    isLoaded,
    isError,
    handleLoad,
    handleError,
    placeholder
  };
};

// Component Lazy Loading Hook
export const useLazyComponent = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    delay = 0
  } = options;

  const [shouldRender, setShouldRender] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !shouldRender) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldRender(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(true);
      }
    }
  }, [inView, shouldRender, delay]);

  return {
    ref,
    shouldRender,
    inView
  };
};

// SEO Hook for dynamic meta tags
export const useSEO = (title, description, keywords = '', image = '') => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && image) {
      ogImage.setAttribute('content', image);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && image) {
      twitterImage.setAttribute('content', image);
    }
  }, [title, description, keywords, image]);
};

// Performance Monitoring Hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  useEffect(() => {
    // Simple performance monitoring without external dependencies
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            }
            if (entry.entryType === 'first-input') {
              setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            }
            if (entry.entryType === 'layout-shift') {
              if (!entry.hadRecentInput) {
                setMetrics(prev => ({ ...prev, cls: prev.cls + entry.value }));
              }
            }
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }, []);

  return metrics;
};

// Import focus management hooks
import {
  useFocusTrap,
  useFocusRestoration,
  useFocusManagement,
  useModalFocus,
  useDropdownFocus
} from './useFocusManagement';

// Export all hooks
export const hooks = {
  usePerformance,
  useIntersectionObserver,
  useAdvancedGestures,
  useAdvancedAnimation,
  useLocalStorage,
  useDevice,
  useNetworkStatus,
  useGeolocation,
  useSpeechRecognition,
  useWebGL,
  useAnimatedInView,
  useDebouncedValue,
  usePrevious,
  useMediaQuery,
  useClipboard,
  useLazyLoading,
  useLazyImage,
  useLazyComponent,
  useSEO,
  usePerformanceMonitoring,
  useFocusTrap,
  useFocusRestoration,
  useFocusManagement,
  useModalFocus,
  useDropdownFocus,
};
