import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const GDPRConsent = () => {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('gdpr-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      applyConsent(parsedConsent);
    }
  }, []);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        }
        // Note: We don't close the banner with ESC as it's required for GDPR compliance
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSettings]);

  const applyConsent = (consentData) => {
    // Apply consent settings
    if (consentData.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    if (consentData.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }

    if (consentData.preferences) {
      enablePreferences();
    } else {
      disablePreferences();
    }
  };

  const enableAnalytics = () => {
    // Enable Google Analytics, etc.
    console.log('Analytics enabled');
    // Add your analytics code here
  };

  const disableAnalytics = () => {
    // Disable analytics
    console.log('Analytics disabled');
    // Remove analytics cookies and scripts
  };

  const enableMarketing = () => {
    // Enable marketing cookies and tracking
    console.log('Marketing enabled');
  };

  const disableMarketing = () => {
    // Disable marketing
    console.log('Marketing disabled');
  };

  const enablePreferences = () => {
    // Enable preference cookies
    console.log('Preferences enabled');
  };

  const disablePreferences = () => {
    // Disable preferences
    console.log('Preferences disabled');
  };

  const handleAcceptAll = () => {
    const newConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
    setShowSettings(false);
    setShowBanner(false);
  };

  const saveConsent = (consentData) => {
    localStorage.setItem('gdpr-consent', JSON.stringify(consentData));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    applyConsent(consentData);
  };

  const handleConsentChange = (type, value) => {
    setConsent(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const consentTypes = [
    {
      key: 'necessary',
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. Cannot be disabled.',
      required: true
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      required: false
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites for advertising purposes.',
      required: false
    },
    {
      key: 'preferences',
      title: 'Preference Cookies',
      description: 'Remember your choices and preferences for a better experience.',
      required: false
    }
  ];

  return (
    <>
      {/* GDPR Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="gdpr-banner"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="gdpr-content">
              <div className="gdpr-text">
                <h3>🍪 Cookie Consent</h3>
                <p>
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="gdpr-actions">
                <button
                  className="btn btn-secondary"
                  onClick={openSettings}
                >
                  Customize
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleRejectAll}
                >
                  Reject All
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GDPR Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="gdpr-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          >
            <motion.div
              className="gdpr-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gdpr-modal-header">
                <h2>🍪 Cookie Preferences</h2>
                <button
                  className="close-btn"
                  onClick={closeSettings}
                  aria-label="Close cookie settings"
                >
                  ✕
                </button>
              </div>

              <div className="gdpr-modal-content">
                <p className="gdpr-intro">
                  We use different types of cookies to optimize your experience on our website. 
                  You can choose which categories you want to allow.
                </p>

                <div className="consent-types">
                  {consentTypes.map((type) => (
                    <div key={type.key} className="consent-type">
                      <div className="consent-header">
                        <div className="consent-info">
                          <h4>{type.title}</h4>
                          <p>{type.description}</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={consent[type.key]}
                            onChange={(e) => handleConsentChange(type.key, e.target.checked)}
                            disabled={type.required}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      {type.required && (
                        <span className="required-badge">Required</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="gdpr-info">
                  <h4>Data Protection Information</h4>
                  <ul>
                    <li>Your data is encrypted and stored securely</li>
                    <li>We never sell your personal information</li>
                    <li>You can change your preferences at any time</li>
                    <li>We comply with GDPR and local privacy laws</li>
                  </ul>
                </div>
              </div>

              <div className="gdpr-modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleRejectAll}
                >
                  Reject All
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveSettings}
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GDPRConsent;
