import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { getImagePath } from '../utils';

const ThemeAwareLogo = ({ 
  className = '', 
  alt = 'Awra Finishing & Interior - Professional Architecture and Design Company Logo',
  ...props 
}) => {
  const { theme, isLoaded } = useTheme();

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    if (!isLoaded) {
      // Return default logo while theme is loading (use light as default)
      return getImagePath('/images/LOGO-light.webp');
    }
    
    return theme === 'dark' 
      ? getImagePath('/images/LOGO-dark.webp')
      : getImagePath('/images/LOGO-light.webp');
  };

  return (
    <motion.img
      src={getLogoSrc()}
      alt={alt}
      className={`theme-aware-logo ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={theme} // Force re-render when theme changes
      {...props}
    />
  );
};

export default ThemeAwareLogo;
