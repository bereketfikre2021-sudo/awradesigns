import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PerformanceMonitor = ({ onClose }) => {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    fmp: 0
  });
  const [performanceScore, setPerformanceScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      startPerformanceMonitoring();
    }
  }, [isMonitoring]);

  const startPerformanceMonitoring = () => {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics(prev => ({ ...prev, cls: clsValue }));
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        setMetrics(prev => ({ 
          ...prev, 
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart 
        }));
      }
    }

    // Calculate performance score
    calculatePerformanceScore();
    generateRecommendations();
  };

  const calculatePerformanceScore = () => {
    const scores = {
      lcp: metrics.lcp < 2500 ? 100 : metrics.lcp < 4000 ? 75 : 50,
      fid: metrics.fid < 100 ? 100 : metrics.fid < 300 ? 75 : 50,
      cls: metrics.cls < 0.1 ? 100 : metrics.cls < 0.25 ? 75 : 50,
      fcp: metrics.fcp < 1800 ? 100 : metrics.fcp < 3000 ? 75 : 50,
      ttfb: metrics.ttfb < 800 ? 100 : metrics.ttfb < 1800 ? 75 : 50
    };

    const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    setPerformanceScore(Math.round(averageScore));
  };

  const generateRecommendations = () => {
    const recs = [];

    if (metrics.lcp > 2500) {
      recs.push({
        type: 'warning',
        title: 'Optimize Largest Contentful Paint',
        description: 'Your LCP is above 2.5s. Consider optimizing images, reducing server response time, or eliminating render-blocking resources.',
        priority: 'high'
      });
    }

    if (metrics.fid > 100) {
      recs.push({
        type: 'warning',
        title: 'Improve First Input Delay',
        description: 'Your FID is above 100ms. Consider reducing JavaScript execution time or breaking up long tasks.',
        priority: 'high'
      });
    }

    if (metrics.cls > 0.1) {
      recs.push({
        type: 'warning',
        title: 'Reduce Cumulative Layout Shift',
        description: 'Your CLS is above 0.1. Consider setting size attributes on images and videos, or reserving space for dynamic content.',
        priority: 'medium'
      });
    }

    if (metrics.fcp > 1800) {
      recs.push({
        type: 'info',
        title: 'Optimize First Contentful Paint',
        description: 'Your FCP could be improved. Consider optimizing critical rendering path and reducing server response time.',
        priority: 'medium'
      });
    }

    if (metrics.ttfb > 800) {
      recs.push({
        type: 'info',
        title: 'Improve Time to First Byte',
        description: 'Your TTFB is above 800ms. Consider optimizing server response time or using a CDN.',
        priority: 'medium'
      });
    }

    setRecommendations(recs);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const formatMetric = (value, type) => {
    switch (type) {
      case 'lcp':
      case 'fcp':
      case 'ttfb':
        return `${Math.round(value)}ms`;
      case 'fid':
        return `${Math.round(value)}ms`;
      case 'cls':
        return value.toFixed(3);
      default:
        return value;
    }
  };

  const getMetricStatus = (value, type) => {
    switch (type) {
      case 'lcp':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'fcp':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const metricsData = [
    { key: 'lcp', name: 'Largest Contentful Paint', description: 'Loading performance' },
    { key: 'fid', name: 'First Input Delay', description: 'Interactivity' },
    { key: 'cls', name: 'Cumulative Layout Shift', description: 'Visual stability' },
    { key: 'fcp', name: 'First Contentful Paint', description: 'Loading performance' },
    { key: 'ttfb', name: 'Time to First Byte', description: 'Server response time' }
  ];

  return (
    <motion.div
      className="performance-monitor"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="monitor-header">
        <div className="monitor-title">
          <h2>📊 Performance Monitor</h2>
          <p>Real-time Web Vitals and performance metrics</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="monitor-content">
        <div className="performance-overview">
          <div className="score-card">
            <div className="score-circle">
              <div 
                className="score-fill"
                style={{ 
                  background: `conic-gradient(${getScoreColor(performanceScore)} 0deg ${performanceScore * 3.6}deg, #e5e7eb ${performanceScore * 3.6}deg 360deg)`
                }}
              >
                <div className="score-inner">
                  <span className="score-number">{performanceScore}</span>
                  <span className="score-label">{getScoreLabel(performanceScore)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Overall Score</span>
              <span className="stat-value" style={{ color: getScoreColor(performanceScore) }}>
                {performanceScore}/100
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value" style={{ color: getScoreColor(performanceScore) }}>
                {getScoreLabel(performanceScore)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monitoring</span>
              <span className="stat-value">
                {isMonitoring ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="monitoring-controls">
          <motion.button
            className={`monitor-btn ${isMonitoring ? 'active' : ''}`}
            onClick={() => setIsMonitoring(!isMonitoring)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
          </motion.button>
        </div>

        <div className="metrics-grid">
          {metricsData.map((metric) => (
            <div key={metric.key} className="metric-card">
              <div className="metric-header">
                <h3>{metric.name}</h3>
                <span className={`metric-status ${getMetricStatus(metrics[metric.key], metric.key)}`}>
                  {getMetricStatus(metrics[metric.key], metric.key).replace('-', ' ')}
                </span>
              </div>
              <div className="metric-value">
                {formatMetric(metrics[metric.key], metric.key)}
              </div>
              <div className="metric-description">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h3>💡 Performance Recommendations</h3>
            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className={`recommendation-item ${rec.type} ${rec.priority}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="rec-icon">
                    {rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className="rec-content">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                  </div>
                  <div className="rec-priority">
                    {rec.priority}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;
