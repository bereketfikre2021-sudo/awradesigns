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
    // Create beautiful success modal with brand colors
    const modal = document.createElement('div');
    modal.className = 'beautiful-modal-overlay';
    modal.innerHTML = `
      <div class="beautiful-modal success-modal">
        <div class="modal-header">
          <div class="modal-icon success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#ffd700" stroke="#ffd700" stroke-width="2"/>
              <path d="M9 12l2 2 4-4" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <button class="modal-close" onclick="this.closest('.beautiful-modal-overlay').remove()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for your inquiry. We'll get back to you within 24 hours.</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn success-btn" onclick="this.closest('.beautiful-modal-overlay').remove()">
            Got it!
          </button>
        </div>
      </div>
    `;
    
    // Add beautiful modal styles
    const style = document.createElement('style');
    style.textContent = `
      .beautiful-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      .beautiful-modal {
        background: #ffffff;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        overflow: hidden;
        border: 2px solid #ffd700;
      }
      
      .modal-header {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      
      .success-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-close {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #000000;
        transition: all 0.3s ease;
        font-weight: bold;
      }
      
      .modal-close:hover {
        background: rgba(0, 0, 0, 0.3);
        transform: scale(1.1);
      }
      
      .modal-content {
        padding: 32px 24px;
        text-align: center;
        background: #ffffff;
      }
      
      .modal-content h3 {
        color: #000000;
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 16px 0;
        text-shadow: none;
      }
      
      .modal-content p {
        color: #333333;
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
        font-weight: 500;
      }
      
      .modal-footer {
        padding: 0 24px 24px 24px;
        display: flex;
        justify-content: center;
        background: #ffffff;
      }
      
      .modal-btn {
        background: #ffd700;
        color: #000000;
        border: 2px solid #ffd700;
        border-radius: 12px;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
      }
      
      .modal-btn:hover {
        background: #ffed4e;
        border-color: #ffed4e;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Remove after 8 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
          }
        }, 300);
      }
    }, 8000);
  };

  const showErrorMessage = (message) => {
    // Create beautiful warning modal with brand colors
    const modal = document.createElement('div');
    modal.className = 'beautiful-modal-overlay';
    modal.innerHTML = `
      <div class="beautiful-modal warning-modal">
        <div class="modal-header warning-header">
          <div class="modal-icon warning-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#ffd700" stroke="#ffd700" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <button class="modal-close" onclick="this.closest('.beautiful-modal-overlay').remove()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <h3>Submission Failed</h3>
          <p>${message || 'Please try again later or contact us directly.'}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn warning-btn" onclick="this.closest('.beautiful-modal-overlay').remove()">
            Try Again
          </button>
        </div>
      </div>
    `;
    
    // Add beautiful modal styles (reuse the same styles as success modal)
    const style = document.createElement('style');
    style.textContent = `
      .beautiful-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      .beautiful-modal {
        background: #ffffff;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        overflow: hidden;
        border: 2px solid #ffd700;
      }
      
      .modal-header {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      
      .warning-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-close {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #000000;
        transition: all 0.3s ease;
        font-weight: bold;
      }
      
      .modal-close:hover {
        background: rgba(0, 0, 0, 0.3);
        transform: scale(1.1);
      }
      
      .modal-content {
        padding: 32px 24px;
        text-align: center;
        background: #ffffff;
      }
      
      .modal-content h3 {
        color: #000000;
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 16px 0;
        text-shadow: none;
      }
      
      .modal-content p {
        color: #333333;
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
        font-weight: 500;
      }
      
      .modal-footer {
        padding: 0 24px 24px 24px;
        display: flex;
        justify-content: center;
        background: #ffffff;
      }
      
      .modal-btn {
        background: #ffd700;
        color: #000000;
        border: 2px solid #ffd700;
        border-radius: 12px;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
      }
      
      .modal-btn:hover {
        background: #ffed4e;
        border-color: #ffed4e;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Remove after 10 seconds (longer for error messages)
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
          }
        }, 300);
      }
    }, 10000);
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
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+251 9X XXX XXXX"
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
            Send
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default SecureForm;
