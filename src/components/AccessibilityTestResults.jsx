/**
 * Accessibility Test Results Component
 * Displays accessibility test results in a user-friendly way
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibilityTesting } from '../hooks/useAccessibilityTesting';

/**
 * Accessibility Test Results Panel
 */
export const AccessibilityTestResults = ({ 
  isVisible = false, 
  onClose = null,
  autoRun = false 
}) => {
  const { 
    results, 
    summary, 
    isRunning, 
    runTests,
    getErrors,
    getWarnings,
    getIssuesByCategory,
    exportJSON,
    exportHTML 
  } = useAccessibilityTesting(autoRun);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun, runTests]);

  const categories = [...new Set(results.map(r => r.category))];
  const filteredResults = results.filter(r => {
    const categoryMatch = selectedCategory === 'all' || r.category === selectedCategory;
    const severityMatch = selectedSeverity === 'all' || r.severity === selectedSeverity;
    return categoryMatch && severityMatch;
  });

  if (!isVisible && !autoRun) return null;

  const errors = getErrors();
  const warnings = getWarnings();

  return (
    <motion.div
      className="a11y-test-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-test-title"
    >
      <div className="a11y-test-header">
        <div className="a11y-test-title-group">
          <h2 id="a11y-test-title">Accessibility Test Results</h2>
          {summary && (
            <div className="a11y-test-score">
              <span className={`a11y-score a11y-score-${summary.score >= 90 ? 'good' : summary.score >= 70 ? 'medium' : 'poor'}`}>
                Score: {summary.score}/100
              </span>
            </div>
          )}
        </div>
        <div className="a11y-test-actions">
          <button
            className="a11y-test-btn"
            onClick={runTests}
            disabled={isRunning}
            aria-label="Run accessibility tests"
          >
            {isRunning ? 'Running...' : 'Run Tests'}
          </button>
          {onClose && (
            <button
              className="a11y-test-btn a11y-test-btn-close"
              onClick={onClose}
              aria-label="Close accessibility test results"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {summary && (
        <div className="a11y-test-summary">
          <div className="a11y-summary-stat">
            <span className="a11y-stat-value a11y-stat-error">{summary.errors}</span>
            <span className="a11y-stat-label">Errors</span>
          </div>
          <div className="a11y-summary-stat">
            <span className="a11y-stat-value a11y-stat-warning">{summary.warnings}</span>
            <span className="a11y-stat-label">Warnings</span>
          </div>
          <div className="a11y-summary-stat">
            <span className="a11y-stat-value">{summary.total}</span>
            <span className="a11y-stat-label">Total Issues</span>
          </div>
          <div className="a11y-summary-stat">
            <span className="a11y-stat-value a11y-stat-high">{summary.bySeverity.high}</span>
            <span className="a11y-stat-label">High Severity</span>
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="a11y-test-filters">
          <select
            className="a11y-test-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="a11y-test-filter"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            aria-label="Filter by severity"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      )}

      <div className="a11y-test-results-list">
        {isRunning ? (
          <div className="a11y-test-loading">Running accessibility tests...</div>
        ) : filteredResults.length === 0 ? (
          <div className="a11y-test-empty">
            {results.length === 0 ? 'No tests run yet. Click "Run Tests" to start.' : 'No issues found matching your filters.'}
          </div>
        ) : (
          <AnimatePresence>
            {filteredResults.map((result, index) => (
              <motion.div
                key={index}
                className={`a11y-test-issue a11y-test-issue-${result.type}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="a11y-issue-header">
                  <div className="a11y-issue-type">
                    <span className={`a11y-issue-badge a11y-issue-badge-${result.type}`}>
                      {result.type.toUpperCase()}
                    </span>
                    <span className={`a11y-issue-severity a11y-issue-severity-${result.severity}`}>
                      {result.severity}
                    </span>
                    <span className="a11y-issue-category">{result.category}</span>
                  </div>
                  {result.element && (
                    <button
                      className="a11y-issue-locate"
                      onClick={() => {
                        const selector = result.element.selector;
                        const element = document.querySelector(selector);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          element.focus();
                          element.style.outline = '2px solid #ffd700';
                          setTimeout(() => element.style.outline = '', 3000);
                        }
                      }}
                      aria-label="Locate element on page"
                    >
                      Locate
                    </button>
                  )}
                </div>
                <div className="a11y-issue-message">{result.message}</div>
                {result.element && (
                  <div className="a11y-issue-element">
                    <strong>Element:</strong> {result.element.tagName}
                    {result.element.id && <span>#{result.element.id}</span>}
                    {result.element.className && <span>.{result.element.className.split(' ')[0]}</span>}
                  </div>
                )}
                {result.fix && (
                  <div className="a11y-issue-fix">
                    <strong>Fix:</strong> {result.fix}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {results.length > 0 && (
        <div className="a11y-test-footer">
          <button
            className="a11y-test-btn a11y-test-btn-secondary"
            onClick={() => {
              const data = exportJSON();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `a11y-results-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export JSON
          </button>
          <button
            className="a11y-test-btn a11y-test-btn-secondary"
            onClick={() => {
              const html = exportHTML();
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `a11y-report-${Date.now()}.html`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export HTML Report
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AccessibilityTestResults;

