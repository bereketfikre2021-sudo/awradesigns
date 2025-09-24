import React from 'react';
import { motion } from 'framer-motion';

// Loading Spinner Component
export const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white'
  };

  return (
    <div 
      className={`loading-container ${fullScreen ? 'loading-fullscreen' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <motion.div
        className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{message}</span>
      {message && !fullScreen && (
        <p className="loading-message">{message}</p>
      )}

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          padding: var(--space-lg);
        }

        .loading-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .loading-spinner {
          border: 3px solid transparent;
          border-top: 3px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner-small {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        .loading-spinner-medium {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }

        .loading-spinner-large {
          width: 60px;
          height: 60px;
          border-width: 4px;
        }

        .loading-spinner-primary {
          color: var(--primary);
        }

        .loading-spinner-secondary {
          color: var(--text-secondary);
        }

        .loading-spinner-white {
          color: white;
        }

        .loading-message {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
          text-align: center;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .loading-container {
            padding: var(--space-md);
          }

          .loading-message {
            font-size: var(--font-size-xs);
          }
        }
      `}</style>
    </div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ 
  type = 'text', 
  width = '100%', 
  height = '1rem',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div 
            className={`skeleton skeleton-text ${className}`}
            style={{ width, height }}
          />
        );
      case 'image':
        return (
          <div 
            className={`skeleton skeleton-image ${className}`}
            style={{ width, height }}
          />
        );
      case 'button':
        return (
          <div 
            className={`skeleton skeleton-button ${className}`}
            style={{ width, height }}
          />
        );
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton skeleton-image" style={{ height: '200px' }} />
            <div className="skeleton-content">
              <div className="skeleton skeleton-text" style={{ height: '1.5rem', marginBottom: '0.5rem' }} />
              <div className="skeleton skeleton-text" style={{ height: '1rem', width: '80%' }} />
              <div className="skeleton skeleton-text" style={{ height: '1rem', width: '60%' }} />
            </div>
          </div>
        );
      default:
        return (
          <div 
            className={`skeleton ${className}`}
            style={{ width, height }}
          />
        );
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}

      <style jsx>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            var(--surface-light) 25%,
            var(--surface) 50%,
            var(--surface-light) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
        }

        .skeleton-text {
          height: 1rem;
        }

        .skeleton-image {
          border-radius: var(--radius-md);
        }

        .skeleton-button {
          border-radius: var(--radius-md);
          height: 2.5rem;
        }

        .skeleton-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          border: 1px solid var(--border);
        }

        .skeleton-content {
          margin-top: var(--space-md);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .skeleton-card {
            padding: var(--space-sm);
          }
        }
      `}</style>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  showPercentage = true,
  color = 'primary',
  size = 'medium',
  animated = true
}) => {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);

  const sizeClasses = {
    small: 'progress-small',
    medium: 'progress-medium',
    large: 'progress-large'
  };

  const colorClasses = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error'
  };

  return (
    <div 
      className={`progress-container ${sizeClasses[size]}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax={total}
      aria-label={`Progress: ${percentage.toFixed(0)}%`}
    >
      <div className="progress-track">
        <motion.div
          className={`progress-bar ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
      
      {showPercentage && (
        <span className="progress-text">
          {percentage.toFixed(0)}%
        </span>
      )}

      <style jsx>{`
        .progress-container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
        }

        .progress-track {
          flex: 1;
          background: var(--surface-light);
          border-radius: var(--radius-full);
          overflow: hidden;
          position: relative;
        }

        .progress-small .progress-track {
          height: 4px;
        }

        .progress-medium .progress-track {
          height: 8px;
        }

        .progress-large .progress-track {
          height: 12px;
        }

        .progress-bar {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .progress-primary {
          background: var(--primary);
        }

        .progress-secondary {
          background: var(--text-secondary);
        }

        .progress-success {
          background: #10b981;
        }

        .progress-warning {
          background: #f59e0b;
        }

        .progress-error {
          background: #ef4444;
        }

        .progress-text {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text);
          min-width: 3rem;
          text-align: right;
        }

        @media (max-width: 768px) {
          .progress-text {
            font-size: var(--font-size-xs);
            min-width: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ 
  isVisible, 
  message = 'Loading...',
  onCancel = null 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={message}
    >
      <div className="loading-overlay-content">
        <LoadingSpinner size="large" color="white" message={message} />
        
        {onCancel && (
          <motion.button
            className="loading-cancel-btn"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel loading"
          >
            Cancel
          </motion.button>
        )}
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-overlay-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          background: var(--surface);
          padding: var(--space-2xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .loading-cancel-btn {
          background: var(--surface-light);
          color: var(--text);
          border: 1px solid var(--border);
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .loading-cancel-btn:hover {
          background: var(--primary);
          color: var(--background);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .loading-overlay-content {
            padding: var(--space-xl);
            margin: var(--space-md);
          }
        }
      `}</style>
    </motion.div>
  );
};

// Export all components
export default {
  LoadingSpinner,
  SkeletonLoader,
  ProgressBar,
  LoadingOverlay
};
