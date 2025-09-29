import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AccessibilityDropdown = () => {
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
      title: 'High Contrast',
      icon: '🔍'
    },
    {
      key: 'largeText',
      title: 'Large Text',
      icon: '🔤'
    },
    {
      key: 'reducedMotion',
      title: 'Reduce Motion',
      icon: '🎬'
    },
    {
      key: 'focusVisible',
      title: 'Enhanced Focus',
      icon: '🎯'
    },
    {
      key: 'screenReader',
      title: 'Screen Reader',
      icon: '📢'
    }
  ];

  return (
    <div className="accessibility-dropdown-section">
      <div className="feature-section-title">Accessibility</div>
      <div className="accessibility-options-grid">
        {accessibilityOptions.map((option) => (
          <motion.div
            key={option.key}
            className="accessibility-option-item"
            whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
          >
            <div className="accessibility-option-header">
              <span className="accessibility-icon">{option.icon}</span>
              <span className="accessibility-title">{option.title}</span>
            </div>
            <label className="accessibility-toggle-switch">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(e) => {
                  handleSettingChange(option.key, e.target.checked);
                  announceToScreenReader(
                    `${option.title} ${e.target.checked ? 'enabled' : 'disabled'}`
                  );
                }}
                aria-label={`Toggle ${option.title}`}
              />
              <span className="accessibility-toggle-slider"></span>
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccessibilityDropdown;
