import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import dataEncryption from '../utils/dataEncryption';
import offlineManager from '../utils/offlineManager';
import SuccessModal from './SuccessModal';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    
    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!dataEncryption.validatePhone(formData.phone)) {
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
      const response = await fetch('https://formspree.io/f/mrbykzlb', {
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
    setShowSuccessModal(true);
  };

  const showErrorMessage = (message) => {
    // Simple error notification
    alert(`Error: ${message}`);
  };

  return (
    <>
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
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+251 9XX XXX XXX"
              required
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
              <option value="hospitality">Hospitality</option>
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
              <option value="under-50k">Under 50,000 ETB</option>
              <option value="50k-100k">50,000 - 100,000 ETB</option>
              <option value="100k-250k">100,000 - 250,000 ETB</option>
              <option value="250k-500k">250,000 - 500,000 ETB</option>
              <option value="over-500k">Over 500,000 ETB</option>
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
          <div className="character-count">
            {formData.message.length} characters
          </div>
          {errors.message && <span className="error-message">{errors.message}</span>}
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
              Send Message
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Message Sent Successfully!"
        message="Thank you for your inquiry. We'll get back to you within 24 hours with a detailed response about your project."
      />
    </>
  );
};

export default SecureForm;
