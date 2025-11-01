/**
 * Granular Loading Indicators
 * Specific loading components for different use cases
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button Loading Indicator
 */
export const ButtonLoadingIndicator = ({ 
  size = 'small', 
  color = 'primary',
  showText = false,
  text = 'Loading...'
}) => {
  return (
    <span className={`button-loading button-loading-${size}`}>
      <motion.span
        className={`loading-dot loading-dot-${color}`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {showText && <span className="button-loading-text">{text}</span>}
    </span>
  );
};

/**
 * Inline Loading Indicator
 */
export const InlineLoadingIndicator = ({ message }) => {
  return (
    <span className="inline-loading" role="status" aria-live="polite">
      <span className="inline-loading-spinner" aria-hidden="true" />
      {message && <span className="inline-loading-message">{message}</span>}
    </span>
  );
};

/**
 * Card Loading Overlay
 */
export const CardLoadingOverlay = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="card-loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <div className="card-loading-content">
        <motion.div
          className="card-loading-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
          aria-hidden="true"
        />
        {message && <span className="card-loading-message">{message}</span>}
      </div>
    </motion.div>
  );
};

/**
 * Section Loading State
 */
export const SectionLoadingState = ({ 
  skeletonType = 'card',
  count = 3,
  message = 'Loading content...'
}) => {
  return (
    <div className="section-loading-state">
      <div className="section-loading-content">
        {Array.from({ length: count }, (_, index) => (
          <motion.div
            key={index}
            className={`section-loading-skeleton section-loading-skeleton-${skeletonType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
      <p className="section-loading-message">{message}</p>
    </div>
  );
};

/**
 * Image Loading Indicator
 */
export const ImageLoadingIndicator = ({ isLoaded, onLoad }) => {
  if (isLoaded) return null;

  return (
    <div className="image-loading-indicator">
      <motion.div
        className="image-loading-spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        aria-label="Loading image"
      />
    </div>
  );
};

/**
 * Form Field Loading Indicator
 */
export const FormFieldLoadingIndicator = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <span className="form-field-loading" role="status" aria-live="polite">
      <motion.span
        className="form-field-loading-spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear'
        }}
        aria-hidden="true"
      />
      <span className="sr-only">Processing...</span>
    </span>
  );
};

/**
 * Navigation Loading Indicator
 */
export const NavigationLoadingIndicator = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="navigation-loading-indicator">
      <motion.div
        className="navigation-loading-bar"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * Filter Loading Indicator
 */
export const FilterLoadingIndicator = ({ isFiltering }) => {
  if (!isFiltering) return null;

  return (
    <motion.div
      className="filter-loading-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <span className="filter-loading-spinner" aria-hidden="true" />
      <span className="sr-only">Filtering results...</span>
    </motion.div>
  );
};

/**
 * Modal Loading State
 */
export const ModalLoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="modal-loading-state">
      <motion.div
        className="modal-loading-spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        aria-hidden="true"
      />
      <p className="modal-loading-message">{message}</p>
    </div>
  );
};

/**
 * Progress Loading Indicator (for multi-step processes)
 */
export const ProgressLoadingIndicator = ({ 
  steps, 
  currentStep,
  showSteps = true 
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="progress-loading-indicator">
      <div className="progress-loading-bar">
        <motion.div
          className="progress-loading-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {showSteps && (
        <div className="progress-loading-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''}`}
            >
              <span className="progress-step-number">{index + 1}</span>
              <span className="progress-step-label">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  ButtonLoadingIndicator,
  InlineLoadingIndicator,
  CardLoadingOverlay,
  SectionLoadingState,
  ImageLoadingIndicator,
  FormFieldLoadingIndicator,
  NavigationLoadingIndicator,
  FilterLoadingIndicator,
  ModalLoadingState,
  ProgressLoadingIndicator,
};

