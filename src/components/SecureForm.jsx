import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import dataEncryption from '../utils/dataEncryption';
import offlineManager from '../utils/offlineManager';

const SecureForm = ({ onSubmit, className = '' }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectType: '',
    budget: '',
    timeline: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    // Generate CSRF token
    const token = dataEncryption.generateCSRFToken();
    setCsrfToken(token);
    
    // Check if connection is secure
    setIsSecure(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input
    const sanitizedValue = dataEncryption.sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!dataEncryption.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    // Phone validation (optional)
    if (formData.phone && !dataEncryption.validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare secure data
      const secureData = await dataEncryption.prepareSecureData({
        ...formData,
        csrfToken,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }, 'awra-designs-secure-key');
      
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/YOUR_SECURE_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...secureData,
          _subject: 'New Secure Form Submission - Awra Finishing',
          _replyto: formData.email,
          _cc: formData.email
        }),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }
      
      // Also handle offline submission as backup
      await offlineManager.handleFormSubmission(secureData);
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        await onSubmit(secureData);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        projectType: '',
        budget: '',
        timeline: ''
      });
      
      // Show success message
      showSuccessMessage();
      
    } catch (error) {
      console.error('Form submission error:', error);
      showErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessMessage = () => {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'form-success-notification';
    notification.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✅</div>
        <h4>Message Sent Successfully!</h4>
        <p>Thank you for your inquiry. We'll get back to you within 24 hours.</p>
      </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid #4CAF50',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      zIndex: '10000',
      maxWidth: '400px',
      textAlign: 'center'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  const showErrorMessage = (message) => {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'form-error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h4>Submission Failed</h4>
        <p>${message || 'Please try again later.'}</p>
      </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid #F44336',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      zIndex: '10000',
      maxWidth: '400px',
      textAlign: 'center'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  return (
    <motion.form
      className={`secure-form ${className}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Security Indicator */}
      <div className="security-indicator">
        <div className={`security-status ${isSecure ? 'secure' : 'insecure'}`}>
          {isSecure ? '🔒 Secure Connection' : '⚠️ Insecure Connection'}
        </div>
        <div className="security-info">
          Your data is encrypted and protected
        </div>
      </div>

      {/* Form Fields */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Your full name"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="your.email@example.com"
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+251 9X XXX XXXX"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="projectType">Project Type</label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
          >
            <option value="">Select project type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="office">Office</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="budget">Budget Range</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
          >
            <option value="">Select budget range</option>
            <option value="under-50k">Under $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="over-500k">Over $500,000</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timeline">Timeline</label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
          >
            <option value="">Select timeline</option>
            <option value="asap">ASAP</option>
            <option value="1-3months">1-3 months</option>
            <option value="3-6months">3-6 months</option>
            <option value="6-12months">6-12 months</option>
            <option value="over-12months">Over 12 months</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          className={errors.message ? 'error' : ''}
          placeholder="Tell us about your project..."
          rows="5"
          required
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <p>
          🔒 Your information is encrypted and secure. We respect your privacy and 
          will never share your data with third parties without your consent.
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className="btn btn-primary submit-btn"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Sending...
          </>
        ) : (
          <>
            🔒 Send Secure Message
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default SecureForm;
