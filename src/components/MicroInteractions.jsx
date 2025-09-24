import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Hover effect with scale and glow
export const HoverGlow = ({ children, className = '', intensity = 0.3, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`hover-glow ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        filter: isHovered ? `drop-shadow(0 0 20px rgba(255, 215, 0, ${intensity}))` : 'none',
        transition: 'filter 0.3s ease'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Button with ripple effect
export const RippleButton = ({ children, className = '', onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`ripple-button ${className}`}
      onClick={createRipple}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="ripple"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
          }}
        />
      ))}
    </motion.button>
  );
};

// Card with 3D tilt effect
export const TiltCard = ({ children, className = '', intensity = 20, ...props }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateXValue = (event.clientY - centerY) / intensity;
    const rotateYValue = (centerX - event.clientX) / intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transition: { duration: 0.1 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Text with typewriter effect
export const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '',
  onComplete = null,
  ...props 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <motion.span
      className={`typewriter-text ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      {...props}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ marginLeft: '2px' }}
      >
        |
      </motion.span>
    </motion.span>
  );
};

// Loading dots animation
export const LoadingDots = ({ className = '', color = '#ffd700', size = 'medium' }) => {
  const sizeClasses = {
    small: 'loading-dots-small',
    medium: 'loading-dots-medium',
    large: 'loading-dots-large'
  };

  return (
    <div className={`loading-dots ${className} ${sizeClasses[size]}`}>
      {[0, 1, 2].map(index => (
        <motion.div
          key={index}
          className="dot"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

// Floating action button
export const FloatingActionButton = ({ 
  children, 
  onClick, 
  position = 'bottom-right',
  className = '',
  ...props 
}) => {
  const positionClasses = {
    'bottom-right': 'fab-bottom-right',
    'bottom-left': 'fab-bottom-left',
    'top-right': 'fab-top-right',
    'top-left': 'fab-top-left'
  };

  return (
    <motion.button
      className={`floating-action-button ${className} ${positionClasses[position]}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Progress indicator with animation
export const AnimatedProgress = ({ 
  progress, 
  total = 100, 
  className = '',
  showPercentage = true,
  animated = true,
  ...props 
}) => {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);

  return (
    <div className={`animated-progress ${className}`} {...props}>
      <div className="progress-track">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
      {showPercentage && (
        <motion.span
          className="progress-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
      )}
    </div>
  );
};

// Scroll-triggered animation
export const ScrollAnimation = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  ...props 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.1, once: true });
  const controls = useAnimation();

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    slideInUp: {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`scroll-animation ${className}`}
      initial="initial"
      animate={controls}
      variants={animations[animation]}
      transition={{ 
        duration,
        delay: delay / 1000,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
export const ParallaxElement = ({ 
  children, 
  speed = 0.5,
  className = '',
  ...props 
}) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`parallax-element ${className}`}
      style={{
        transform: `translateY(${offset}px)`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Export all components
export default {
  HoverGlow,
  RippleButton,
  TiltCard,
  TypewriterText,
  LoadingDots,
  FloatingActionButton,
  AnimatedProgress,
  ScrollAnimation,
  ParallaxElement
};
