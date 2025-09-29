import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    focusVisible: true,
    screenReader: false
  });

  useEffect(() => {
    // Load saved accessibility settings
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    if (settings.screenReader) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Save settings
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      focusVisible: true,
      screenReader: false
    };
    setSettings(defaultSettings);
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const accessibilityOptions = [
    {
      key: 'highContrast',
      title: 'High Contrast Mode',
      description: 'Increases color contrast for better visibility',
      icon: '🔍'
    },
    {
      key: 'largeText',
      title: 'Large Text',
      description: 'Increases font size for better readability',
      icon: '🔤'
    },
    {
      key: 'reducedMotion',
      title: 'Reduce Motion',
      description: 'Reduces animations for users sensitive to motion',
      icon: '🎬'
    },
    {
      key: 'focusVisible',
      title: 'Enhanced Focus',
      description: 'Makes focus indicators more visible',
      icon: '🎯'
    },
    {
      key: 'screenReader',
      title: 'Screen Reader Mode',
      description: 'Optimizes layout for screen readers',
      icon: '📢'
    }
  ];

  return (
    <>
      {/* Accessibility Toggle Button */}
      <motion.button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Accessibility Settings"
        aria-expanded={isOpen}
      >
        ♿
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="accessibility-panel"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-describedby="accessibility-description"
          >
            <div className="accessibility-header">
              <h3 id="accessibility-title">♿ Accessibility Settings</h3>
              <p id="accessibility-description">
                Customize your experience for better accessibility
              </p>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility settings"
              >
                ✕
              </button>
            </div>

            <div className="accessibility-content">
              <div className="accessibility-options">
                {accessibilityOptions.map((option) => (
                  <div key={option.key} className="accessibility-option">
                    <div className="option-header">
                      <div className="option-icon">{option.icon}</div>
                      <div className="option-info">
                        <h4>{option.title}</h4>
                        <p>{option.description}</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings[option.key]}
                          onChange={(e) => {
                            handleSettingChange(option.key, e.target.checked);
                            announceToScreenReader(
                              `${option.title} ${e.target.checked ? 'enabled' : 'disabled'}`
                            );
                          }}
                          aria-describedby={`${option.key}-description`}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="accessibility-actions">
                <motion.button
                  className="btn btn-secondary"
                  onClick={resetSettings}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset to Default
                </motion.button>
              </div>

              <div className="accessibility-info">
                <h4>Keyboard Navigation</h4>
                <ul>
                  <li><kbd>Tab</kbd> - Navigate between elements</li>
                  <li><kbd>Enter</kbd> - Activate buttons and links</li>
                  <li><kbd>Space</kbd> - Toggle checkboxes and buttons</li>
                  <li><kbd>Esc</kbd> - Close modals and panels</li>
                  <li><kbd>↑↓</kbd> - Navigate menus and lists</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityControls;
