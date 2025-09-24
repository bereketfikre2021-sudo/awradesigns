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

// Theme Toggle Button Component
export const ThemeToggle = ({ className = '', size = 'medium' }) => {
  const { theme, toggleTheme, isLoaded } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isLoaded) {
    return (
      <div className={`theme-toggle ${className} ${size}`}>
        <div className="theme-toggle-skeleton"></div>
      </div>
    );
  }

  return (
    <motion.button
      className={`theme-toggle ${className} ${size}`}
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="theme-toggle-track">
        <motion.div
          className="theme-toggle-thumb"
          animate={{
            x: theme === 'dark' ? 0 : 24,
            rotate: theme === 'dark' ? 0 : 180
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="theme-icon"
              >
                🌙
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="theme-icon"
              >
                ☀️
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
