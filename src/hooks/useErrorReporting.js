/**
 * React Hook for Error Reporting
 * Provides easy access to error reporting functions
 */

import { useState, useCallback } from 'react';
import { 
  reportError, 
  reportAPIError, 
  reportWarning,
  setUserContext as setErrorUserContext 
} from '../services/errorReporting';

/**
 * Hook for error reporting
 */
export const useErrorReporting = () => {
  const [isReporting, setIsReporting] = useState(false);

  const handleError = useCallback(async (error, context = {}) => {
    setIsReporting(true);
    try {
      const errorId = await reportError({
        error,
        message: error?.message || 'Unknown error',
        context,
        severity: 'error',
      });
      return errorId;
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      return null;
    } finally {
      setIsReporting(false);
    }
  }, []);

  const handleAPIError = useCallback(async (error, context = {}) => {
    setIsReporting(true);
    try {
      const errorId = await reportAPIError(error, context);
      return errorId;
    } catch (reportingError) {
      console.error('Failed to report API error:', reportingError);
      return null;
    } finally {
      setIsReporting(false);
    }
  }, []);

  const handleWarning = useCallback(async (message, context = {}) => {
    setIsReporting(true);
    try {
      const errorId = await reportWarning(message, context);
      return errorId;
    } catch (reportingError) {
      console.error('Failed to report warning:', reportingError);
      return null;
    } finally {
      setIsReporting(false);
    }
  }, []);

  const setUser = useCallback((user) => {
    setErrorUserContext(user);
  }, []);

  return {
    reportError: handleError,
    reportAPIError: handleAPIError,
    reportWarning: handleWarning,
    setUser,
    isReporting,
  };
};

export default useErrorReporting;

