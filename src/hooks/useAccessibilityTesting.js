/**
 * React Hook for Accessibility Testing
 * Provides accessibility testing capabilities in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { initAccessibilityTesting, quickA11yCheck } from '../utils/accessibilityTesting';

/**
 * Hook for accessibility testing
 */
export const useAccessibilityTesting = (autoRun = false, interval = null) => {
  const [tester, setTester] = useState(null);
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const testInstance = initAccessibilityTesting();
    setTester(testInstance);

    // Subscribe to results
    testInstance.onResults((newResults) => {
      setResults(newResults);
      setSummary(testInstance.getSummary());
    });

    // Auto-run if enabled
    if (autoRun) {
      testInstance.runAllTests();
    }

    // Set up interval if provided
    if (interval && interval > 0) {
      const intervalId = setInterval(() => {
        testInstance.runAllTests();
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, [autoRun, interval]);

  const runTests = useCallback(async () => {
    if (!tester) return;
    setIsRunning(true);
    try {
      await tester.runAllTests();
    } finally {
      setIsRunning(false);
    }
  }, [tester]);

  const getErrors = useCallback(() => {
    return results.filter(r => r.type === 'error');
  }, [results]);

  const getWarnings = useCallback(() => {
    return results.filter(r => r.type === 'warning');
  }, [results]);

  const getIssuesByCategory = useCallback((category) => {
    return results.filter(r => r.category === category);
  }, [results]);

  const getIssuesBySeverity = useCallback((severity) => {
    return results.filter(r => r.severity === severity);
  }, [results]);

  return {
    tester,
    results,
    summary,
    isRunning,
    runTests,
    getErrors,
    getWarnings,
    getIssuesByCategory,
    getIssuesBySeverity,
    exportJSON: () => tester?.exportResults(),
    exportHTML: () => tester?.exportHTMLReport(),
  };
};

/**
 * Hook for real-time accessibility monitoring
 */
export const useAccessibilityMonitor = (enabled = true) => {
  const [issues, setIssues] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setIsMonitoring(true);
    const checkInterval = setInterval(async () => {
      try {
        const result = await quickA11yCheck();
        if (result.total > 0) {
          setIssues(prev => {
            // Merge with previous issues
            const newIssues = [...prev];
            // Logic to update issues
            return newIssues;
          });
        }
      } catch (error) {
        console.error('Accessibility check failed:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(checkInterval);
      setIsMonitoring(false);
    };
  }, [enabled]);

  return {
    issues,
    isMonitoring,
    clearIssues: () => setIssues([]),
  };
};

export default useAccessibilityTesting;

