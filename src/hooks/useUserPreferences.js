import { useState, useEffect, useCallback } from 'react';

// Default preferences
const DEFAULT_PREFERENCES = {
  theme: 'dark',
  language: 'en',
  animations: true,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  notifications: true,
  analytics: true,
  marketing: false,
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false
  },
  performance: {
    imageQuality: 'high',
    lazyLoading: true,
    preloading: true,
    caching: true
  },
  privacy: {
    cookies: true,
    tracking: false,
    personalization: true
  }
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('awra-preferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('awra-preferences', JSON.stringify(updatedPreferences));
      
      // Theme changes will be handled by ThemeContext
      
      // Apply accessibility preferences
      if (newPreferences.accessibility) {
        applyAccessibilityPreferences(newPreferences.accessibility);
      }
      
      // Apply performance preferences
      if (newPreferences.performance) {
        applyPerformancePreferences(newPreferences.performance);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [preferences]);

  // Update a specific preference
  const updatePreference = useCallback((key, value) => {
    savePreferences({ [key]: value });
  }, [savePreferences]);

  // Update nested preferences
  const updateNestedPreference = useCallback((category, key, value) => {
    savePreferences({
      [category]: {
        ...preferences[category],
        [key]: value
      }
    });
  }, [preferences, savePreferences]);

  // Reset preferences to default
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('awra-preferences');
  }, []);

  // Apply accessibility preferences
  const applyAccessibilityPreferences = (accessibilityPrefs) => {
    const root = document.documentElement;
    
    if (accessibilityPrefs.reducedMotion) {
      root.style.setProperty('--transition-fast', '0s');
      root.style.setProperty('--transition-normal', '0s');
      root.style.setProperty('--transition-slow', '0s');
    } else {
      root.style.removeProperty('--transition-fast');
      root.style.removeProperty('--transition-normal');
      root.style.removeProperty('--transition-slow');
    }
    
    if (accessibilityPrefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (accessibilityPrefs.colorBlindSupport) {
      root.classList.add('colorblind-support');
    } else {
      root.classList.remove('colorblind-support');
    }
  };

  // Apply performance preferences
  const applyPerformancePreferences = (performancePrefs) => {
    // These would be applied to image loading, lazy loading, etc.
    // Implementation depends on your specific performance optimizations
    console.log('Applying performance preferences:', performancePrefs);
  };

  // Get preference value
  const getPreference = useCallback((key, defaultValue = null) => {
    return preferences[key] ?? defaultValue;
  }, [preferences]);

  // Get nested preference value
  const getNestedPreference = useCallback((category, key, defaultValue = null) => {
    return preferences[category]?.[key] ?? defaultValue;
  }, [preferences]);

  // Check if preference is enabled
  const isPreferenceEnabled = useCallback((key) => {
    return Boolean(preferences[key]);
  }, [preferences]);

  // Check if nested preference is enabled
  const isNestedPreferenceEnabled = useCallback((category, key) => {
    return Boolean(preferences[category]?.[key]);
  }, [preferences]);

  return {
    preferences,
    isLoaded,
    savePreferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences,
    getPreference,
    getNestedPreference,
    isPreferenceEnabled,
    isNestedPreferenceEnabled
  };
};

// Hook for specific preference categories
export const useAccessibilityPreferences = () => {
  const { 
    getNestedPreference, 
    updateNestedPreference, 
    isNestedPreferenceEnabled 
  } = useUserPreferences();

  return {
    reducedMotion: isNestedPreferenceEnabled('accessibility', 'reducedMotion'),
    highContrast: isNestedPreferenceEnabled('accessibility', 'highContrast'),
    screenReader: isNestedPreferenceEnabled('accessibility', 'screenReader'),
    keyboardNavigation: isNestedPreferenceEnabled('accessibility', 'keyboardNavigation'),
    focusIndicators: isNestedPreferenceEnabled('accessibility', 'focusIndicators'),
    colorBlindSupport: isNestedPreferenceEnabled('accessibility', 'colorBlindSupport'),
    setReducedMotion: (value) => updateNestedPreference('accessibility', 'reducedMotion', value),
    setHighContrast: (value) => updateNestedPreference('accessibility', 'highContrast', value),
    setScreenReader: (value) => updateNestedPreference('accessibility', 'screenReader', value),
    setKeyboardNavigation: (value) => updateNestedPreference('accessibility', 'keyboardNavigation', value),
    setFocusIndicators: (value) => updateNestedPreference('accessibility', 'focusIndicators', value),
    setColorBlindSupport: (value) => updateNestedPreference('accessibility', 'colorBlindSupport', value)
  };
};

export const usePerformancePreferences = () => {
  const { 
    getNestedPreference, 
    updateNestedPreference, 
    isNestedPreferenceEnabled 
  } = useUserPreferences();

  return {
    imageQuality: getNestedPreference('performance', 'imageQuality', 'high'),
    lazyLoading: isNestedPreferenceEnabled('performance', 'lazyLoading'),
    preloading: isNestedPreferenceEnabled('performance', 'preloading'),
    caching: isNestedPreferenceEnabled('performance', 'caching'),
    setImageQuality: (value) => updateNestedPreference('performance', 'imageQuality', value),
    setLazyLoading: (value) => updateNestedPreference('performance', 'lazyLoading', value),
    setPreloading: (value) => updateNestedPreference('performance', 'preloading', value),
    setCaching: (value) => updateNestedPreference('performance', 'caching', value)
  };
};

export const usePrivacyPreferences = () => {
  const { 
    getNestedPreference, 
    updateNestedPreference, 
    isNestedPreferenceEnabled 
  } = useUserPreferences();

  return {
    cookies: isNestedPreferenceEnabled('privacy', 'cookies'),
    tracking: isNestedPreferenceEnabled('privacy', 'tracking'),
    personalization: isNestedPreferenceEnabled('privacy', 'personalization'),
    setCookies: (value) => updateNestedPreference('privacy', 'cookies', value),
    setTracking: (value) => updateNestedPreference('privacy', 'tracking', value),
    setPersonalization: (value) => updateNestedPreference('privacy', 'personalization', value)
  };
};

export default useUserPreferences;
