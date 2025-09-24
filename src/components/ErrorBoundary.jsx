import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Send to error reporting service (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          error_id: errorId
        }
      });
    }

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, errorId, onRetry, onReload }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <motion.div 
      className="error-boundary"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
    >
      <div className="error-container">
        <div className="error-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>

        <h2 className="error-title">Oops! Something went wrong</h2>
        
        <p className="error-message">
          We're sorry, but something unexpected happened. Our team has been notified 
          and we're working to fix this issue.
        </p>

        {errorId && (
          <p className="error-id">
            Error ID: <code>{errorId}</code>
          </p>
        )}

        <div className="error-actions">
          <motion.button
            className="btn btn-primary"
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Try again"
          >
            Try Again
          </motion.button>
          
          <motion.button
            className="btn btn-secondary"
            onClick={onReload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Reload page"
          >
            Reload Page
          </motion.button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary 
              className="error-details-summary"
              onClick={() => setShowDetails(!showDetails)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }
              }}
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </summary>
            
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="error-details-content"
              >
                <h4>Error Details:</h4>
                <pre className="error-stack">
                  {error && error.toString()}
                </pre>
                
                <h4>Component Stack:</h4>
                <pre className="error-stack">
                  {errorInfo && errorInfo.componentStack}
                </pre>
              </motion.div>
            )}
          </details>
        )}

        <div className="error-help">
          <p>
            If this problem persists, please{' '}
            <a href="mailto:support@awradesigns.com" className="error-link">
              contact our support team
            </a>{' '}
            with the error ID above.
          </p>
        </div>
      </div>

      <style jsx>{`
        .error-boundary {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: var(--background);
          color: var(--text);
        }

        .error-container {
          max-width: 600px;
          text-align: center;
          background: var(--surface);
          padding: var(--space-2xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .error-icon {
          color: #ef4444;
          margin-bottom: var(--space-lg);
        }

        .error-title {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--space-md);
          color: var(--text);
        }

        .error-message {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
          line-height: 1.6;
        }

        .error-id {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          margin-bottom: var(--space-lg);
        }

        .error-id code {
          background: var(--surface-light);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-family: 'Courier New', monospace;
        }

        .error-actions {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          margin-bottom: var(--space-xl);
          flex-wrap: wrap;
        }

        .error-details {
          margin-bottom: var(--space-lg);
          text-align: left;
        }

        .error-details-summary {
          cursor: pointer;
          padding: var(--space-sm);
          background: var(--surface-light);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .error-details-summary:hover {
          background: var(--primary);
          color: var(--background);
        }

        .error-details-summary:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .error-details-content {
          margin-top: var(--space-md);
          padding: var(--space-md);
          background: var(--surface-light);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }

        .error-details-content h4 {
          margin-bottom: var(--space-sm);
          color: var(--text);
        }

        .error-stack {
          background: #1a1a1a;
          color: #e5e5e5;
          padding: var(--space-md);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: var(--space-md);
        }

        .error-help {
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border);
        }

        .error-help p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .error-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .error-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .error-container {
            padding: var(--space-lg);
            margin: var(--space-md);
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .error-actions .btn {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ErrorBoundary;
