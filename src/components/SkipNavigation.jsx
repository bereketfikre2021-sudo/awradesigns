import React from 'react';
import { motion } from 'framer-motion';

const SkipNavigation = () => {
  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#contact', text: 'Skip to contact form' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  return (
    <div className="skip-navigation">
      {skipLinks.map((link, index) => (
        <motion.a
          key={link.href}
          href={link.href}
          className="skip-link"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0, y: -10 }}
          whileFocus={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
        >
          {link.text}
        </motion.a>
      ))}
    </div>
  );
};

export default SkipNavigation;