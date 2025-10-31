import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(scrollTop > 300); // Show after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed scrollToTop function since this is now just for display

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="scroll-progress"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="scroll-progress-bar">
            {/* Progress fill */}
            <div 
              className="scroll-progress-fill"
              style={{
                width: `${scrollProgress}%`
              }}
            />
            
            {/* Percentage text */}
            <div className="scroll-progress-text">
              {Math.round(scrollProgress)}%
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="scroll-progress-tooltip">
            Page Progress
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollProgress;
