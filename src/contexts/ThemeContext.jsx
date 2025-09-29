import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('awra-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    setIsLoaded(true);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Save theme to localStorage and apply to document
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('awra-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('awra-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('awra-theme')) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
        document.documentElement.setAttribute('data-theme', systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isLoaded
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// New Modern Theme Toggle Button Component
export const ThemeToggle = ({ className = '', size = 'medium' }) => {
  const { theme, toggleTheme, isLoaded } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Modern SVG Icons with better design
  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"/>
    </svg>
  );

  if (!isLoaded) {
    return (
      <div className={`new-theme-toggle ${className} ${size}`}>
        <div className="new-theme-toggle-skeleton"></div>
      </div>
    );
  }

  return (
    <motion.button
      className={`new-theme-toggle ${className} ${size} ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      whileHover={{ scale: 1.08, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="new-theme-toggle-container">
        <motion.div
          className="new-theme-toggle-icon"
          animate={{
            rotate: theme === 'dark' ? 0 : 180,
            scale: isAnimating ? 1.2 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            duration: 0.6
          }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="theme-icon-new"
              >
                <MoonIcon />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="theme-icon-new"
              >
                <SunIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Animated background circle */}
        <motion.div
          className="new-theme-toggle-bg"
          animate={{
            scale: isAnimating ? 1.5 : 1,
            opacity: isAnimating ? 0.3 : 0
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      </div>
    </motion.button>
  );
};

// Theme-aware component wrapper
export const ThemedComponent = ({ children, className = '' }) => {
  const { theme, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <div className={`themed-component ${className}`}>
        <div className="theme-skeleton"></div>
      </div>
    );
  }

  return (
    <motion.div
      className={`themed-component ${className}`}
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ThemeContext;
