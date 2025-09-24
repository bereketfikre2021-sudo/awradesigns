import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkipNavigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const skipLinks = [
    { id: 'main-content', label: 'Skip to main content', target: '#main-content' },
    { id: 'navigation', label: 'Skip to navigation', target: '#navigation' },
    { id: 'services', label: 'Skip to services', target: '#services' },
    { id: 'portfolio', label: 'Skip to portfolio', target: '#works' },
    { id: 'contact', label: 'Skip to contact', target: '#contact' },
    { id: 'footer', label: 'Skip to footer', target: '#footer' }
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show skip links when Tab is pressed
      if (event.key === 'Tab' && !event.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
      setFocusedIndex(-1);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSkipLinkClick = (target, index) => {
    const element = document.querySelector(target);
    if (element) {
      element.focus();
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = `Skipped to ${skipLinks[index].label.toLowerCase()}`;
      
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
    
    setIsVisible(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % skipLinks.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + skipLinks.length) % skipLinks.length);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleSkipLinkClick(skipLinks[index].target, index);
        break;
      case 'Escape':
        setIsVisible(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="skip-navigation"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          role="navigation"
          aria-label="Skip navigation"
        >
          <div className="skip-navigation-container">
            <div className="skip-navigation-header">
              <h3>Skip Navigation</h3>
              <p>Use these links to quickly navigate to different sections</p>
            </div>
            
            <ul className="skip-links" role="list">
              {skipLinks.map((link, index) => (
                <li key={link.id} role="listitem">
                  <motion.button
                    className={`skip-link ${focusedIndex === index ? 'focused' : ''}`}
                    onClick={() => handleSkipLinkClick(link.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={link.label}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            
            <div className="skip-navigation-footer">
              <p className="skip-instructions">
                <kbd>↑</kbd> <kbd>↓</kbd> to navigate • <kbd>Enter</kbd> to select • <kbd>Esc</kbd> to close
              </p>
            </div>
          </div>

          <style jsx>{`
            .skip-navigation {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 10000;
              background: var(--background);
              border-bottom: 2px solid var(--primary);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .skip-navigation-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: var(--space-md);
            }

            .skip-navigation-header {
              text-align: center;
              margin-bottom: var(--space-md);
            }

            .skip-navigation-header h3 {
              font-size: var(--font-size-lg);
              font-weight: 600;
              color: var(--text);
              margin-bottom: var(--space-xs);
            }

            .skip-navigation-header p {
              font-size: var(--font-size-sm);
              color: var(--text-secondary);
              margin: 0;
            }

            .skip-links {
              display: flex;
              flex-wrap: wrap;
              gap: var(--space-sm);
              justify-content: center;
              list-style: none;
              margin: 0;
              padding: 0;
            }

            .skip-link {
              background: var(--surface);
              color: var(--text);
              border: 2px solid var(--border);
              padding: var(--space-sm) var(--space-md);
              border-radius: var(--radius-md);
              font-size: var(--font-size-sm);
              font-weight: 500;
              cursor: pointer;
              transition: all var(--transition-fast);
              text-decoration: none;
              display: inline-block;
              min-width: 120px;
              text-align: center;
            }

            .skip-link:hover {
              background: var(--primary);
              color: var(--background);
              border-color: var(--primary);
              transform: translateY(-1px);
            }

            .skip-link:focus {
              outline: 2px solid var(--primary);
              outline-offset: 2px;
              background: var(--primary);
              color: var(--background);
              border-color: var(--primary);
            }

            .skip-link.focused {
              background: var(--primary);
              color: var(--background);
              border-color: var(--primary);
              box-shadow: 0 0 0 2px var(--primary);
            }

            .skip-navigation-footer {
              text-align: center;
              margin-top: var(--space-md);
              padding-top: var(--space-md);
              border-top: 1px solid var(--border);
            }

            .skip-instructions {
              font-size: var(--font-size-xs);
              color: var(--text-muted);
              margin: 0;
            }

            .skip-instructions kbd {
              background: var(--surface-light);
              border: 1px solid var(--border);
              border-radius: var(--radius-sm);
              padding: 2px 6px;
              font-size: var(--font-size-xs);
              font-family: monospace;
              margin: 0 2px;
            }

            @media (max-width: 768px) {
              .skip-navigation-container {
                padding: var(--space-sm);
              }

              .skip-links {
                flex-direction: column;
                align-items: center;
              }

              .skip-link {
                width: 100%;
                max-width: 200px;
              }

              .skip-navigation-header h3 {
                font-size: var(--font-size-md);
              }

              .skip-navigation-header p {
                font-size: var(--font-size-xs);
              }
            }

            @media (max-width: 480px) {
              .skip-navigation-container {
                padding: var(--space-xs);
              }

              .skip-navigation-header {
                margin-bottom: var(--space-sm);
              }

              .skip-navigation-footer {
                margin-top: var(--space-sm);
                padding-top: var(--space-sm);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkipNavigation;
