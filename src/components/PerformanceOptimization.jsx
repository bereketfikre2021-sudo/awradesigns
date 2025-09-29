import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const PerformanceOptimization = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('metrics');
  const [performanceData, setPerformanceData] = useState({
    metrics: {
      lcp: 1.2,
      fid: 45,
      cls: 0.05,
      fcp: 0.8,
      ttfb: 200,
      score: 92
    },
    resources: {
      images: { loaded: 15, total: 18, size: '2.3MB' },
      scripts: { loaded: 8, total: 8, size: '1.1MB' },
      styles: { loaded: 3, total: 3, size: '0.4MB' },
      fonts: { loaded: 2, total: 2, size: '0.2MB' }
    },
    network: {
      requests: 45,
      transferred: '4.2MB',
      time: '1.8s',
      cacheHitRate: 78
    },
    memory: {
      used: 45,
      total: 100,
      heap: 32,
      dom: 12
    }
  });
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Large Image Files',
      description: 'Some images are not optimized for web',
      impact: 'High',
      effort: 'Low',
      suggestion: 'Compress images and use WebP format'
    },
    {
      id: 2,
      type: 'info',
      title: 'Unused CSS',
      description: '15% of CSS is not being used',
      impact: 'Medium',
      effort: 'Medium',
      suggestion: 'Remove unused CSS rules'
    },
    {
      id: 3,
      type: 'success',
      title: 'Code Splitting',
      description: 'JavaScript is properly code-split',
      impact: 'High',
      effort: 'High',
      suggestion: 'Already implemented'
    }
  ]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState([]);
  const intervalRef = useRef(null);

  const tabs = [
    { id: 'metrics', name: 'Performance Metrics', icon: '📊' },
    { id: 'resources', name: 'Resource Analysis', icon: '📦' },
    { id: 'optimization', name: 'Optimization', icon: '⚡' },
    { id: 'monitoring', name: 'Real-time Monitor', icon: '📈' }
  ];

  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        const newMetric = {
          timestamp: new Date().toLocaleTimeString(),
          lcp: (Math.random() * 2 + 0.5).toFixed(2),
          fid: Math.floor(Math.random() * 100 + 10),
          cls: (Math.random() * 0.1).toFixed(3),
          memory: Math.floor(Math.random() * 20 + 30)
        };
        setRealTimeMetrics(prev => [newMetric, ...prev.slice(0, 19)]);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring]);

  const getScoreColor = (score) => {
    if (score >= 90) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const renderPerformanceMetrics = () => (
    <div className="performance-metrics">
      <div className="metrics-overview">
        <div className="overall-score">
          <div className="score-circle">
            <div 
              className="score-fill"
              style={{ 
                background: `conic-gradient(${getScoreColor(performanceData.metrics.score)} 0deg ${performanceData.metrics.score * 3.6}deg, #ecf0f1 ${performanceData.metrics.score * 3.6}deg 360deg)`
              }}
            />
            <div className="score-text">
              <span className="score-number">{performanceData.metrics.score}</span>
              <span className="score-label">Score</span>
            </div>
          </div>
        </div>

        <div className="core-metrics">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">⚡</span>
              <span className="metric-name">LCP</span>
            </div>
            <div className="metric-value">{performanceData.metrics.lcp}s</div>
            <div className="metric-status good">Good</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">👆</span>
              <span className="metric-name">FID</span>
            </div>
            <div className="metric-value">{performanceData.metrics.fid}ms</div>
            <div className="metric-status good">Good</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📐</span>
              <span className="metric-name">CLS</span>
            </div>
            <div className="metric-value">{performanceData.metrics.cls}</div>
            <div className="metric-status good">Good</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🎯</span>
              <span className="metric-name">FCP</span>
            </div>
            <div className="metric-value">{performanceData.metrics.fcp}s</div>
            <div className="metric-status good">Good</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🌐</span>
              <span className="metric-name">TTFB</span>
            </div>
            <div className="metric-value">{performanceData.metrics.ttfb}ms</div>
            <div className="metric-status good">Good</div>
          </div>
        </div>
      </div>

      <div className="metrics-chart">
        <h4>Performance Trends</h4>
        <div className="chart-container">
          <div className="chart-bars">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    backgroundColor: getScoreColor(Math.random() * 30 + 70)
                  }}
                />
                <span className="bar-label">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourceAnalysis = () => (
    <div className="resource-analysis">
      <div className="resources-overview">
        <h4>Resource Loading</h4>
        <div className="resources-grid">
          {Object.entries(performanceData.resources).map(([type, data]) => (
            <div key={type} className="resource-card">
              <div className="resource-header">
                <span className="resource-icon">
                  {type === 'images' ? '🖼️' : 
                   type === 'scripts' ? '📜' : 
                   type === 'styles' ? '🎨' : '🔤'}
                </span>
                <span className="resource-type">{type}</span>
              </div>
              <div className="resource-stats">
                <div className="stat-item">
                  <span className="stat-label">Loaded</span>
                  <span className="stat-value">{data.loaded}/{data.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Size</span>
                  <span className="stat-value">{data.size}</span>
                </div>
              </div>
              <div className="resource-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(data.loaded / data.total) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  {Math.round((data.loaded / data.total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="network-info">
        <h4>Network Performance</h4>
        <div className="network-stats">
          <div className="network-item">
            <span className="network-label">Total Requests</span>
            <span className="network-value">{performanceData.network.requests}</span>
          </div>
          <div className="network-item">
            <span className="network-label">Data Transferred</span>
            <span className="network-value">{performanceData.network.transferred}</span>
          </div>
          <div className="network-item">
            <span className="network-label">Load Time</span>
            <span className="network-value">{performanceData.network.time}</span>
          </div>
          <div className="network-item">
            <span className="network-label">Cache Hit Rate</span>
            <span className="network-value">{performanceData.network.cacheHitRate}%</span>
          </div>
        </div>
      </div>

      <div className="memory-usage">
        <h4>Memory Usage</h4>
        <div className="memory-chart">
          <div className="memory-item">
            <span className="memory-label">Used Memory</span>
            <div className="memory-bar">
              <div 
                className="memory-fill"
                style={{ width: `${performanceData.memory.used}%` }}
              />
            </div>
            <span className="memory-value">{performanceData.memory.used}%</span>
          </div>
          <div className="memory-item">
            <span className="memory-label">Heap Size</span>
            <div className="memory-bar">
              <div 
                className="memory-fill"
                style={{ width: `${performanceData.memory.heap}%` }}
              />
            </div>
            <span className="memory-value">{performanceData.memory.heap}%</span>
          </div>
          <div className="memory-item">
            <span className="memory-label">DOM Nodes</span>
            <div className="memory-bar">
              <div 
                className="memory-fill"
                style={{ width: `${performanceData.memory.dom}%` }}
              />
            </div>
            <span className="memory-value">{performanceData.memory.dom}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="optimization-panel">
      <div className="optimization-header">
        <h4>Optimization Suggestions</h4>
        <p>AI-powered recommendations to improve performance</p>
      </div>

      <div className="suggestions-list">
        {optimizationSuggestions.map((suggestion) => (
          <div key={suggestion.id} className={`suggestion-card ${suggestion.type}`}>
            <div className="suggestion-header">
              <div className="suggestion-title">
                <span className="suggestion-icon">
                  {suggestion.type === 'warning' ? '⚠️' : 
                   suggestion.type === 'info' ? 'ℹ️' : '✅'}
                </span>
                <span className="suggestion-name">{suggestion.title}</span>
              </div>
              <div className="suggestion-meta">
                <span 
                  className="impact-badge"
                  style={{ backgroundColor: getImpactColor(suggestion.impact) }}
                >
                  {suggestion.impact} Impact
                </span>
                <span className="effort-badge">{suggestion.effort} Effort</span>
              </div>
            </div>
            
            <div className="suggestion-content">
              <p className="suggestion-description">{suggestion.description}</p>
              <p className="suggestion-text">{suggestion.suggestion}</p>
            </div>

            <div className="suggestion-actions">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Fix
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        ))}
      </div>

      <div className="optimization-tools">
        <h4>Quick Actions</h4>
        <div className="tools-grid">
          <motion.button
            className="tool-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🗜️ Compress Images
          </motion.button>
          <motion.button
            className="tool-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🧹 Clean CSS
          </motion.button>
          <motion.button
            className="tool-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📦 Bundle JS
          </motion.button>
          <motion.button
            className="tool-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Enable Caching
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderRealTimeMonitoring = () => (
    <div className="real-time-monitoring">
      <div className="monitoring-header">
        <h4>Real-time Performance Monitor</h4>
        <div className="monitoring-controls">
          <motion.button
            className={`monitor-btn ${isMonitoring ? 'active' : ''}`}
            onClick={() => setIsMonitoring(!isMonitoring)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMonitoring ? '⏸️ Stop' : '▶️ Start'} Monitoring
          </motion.button>
          <button 
            className="monitor-btn"
            onClick={() => setRealTimeMetrics([])}
          >
            🗑️ Clear Data
          </button>
        </div>
      </div>

      <div className="monitoring-status">
        <div className="status-indicator">
          <span className={`status-dot ${isMonitoring ? 'active' : 'inactive'}`}></span>
          <span>{isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}</span>
        </div>
      </div>

      <div className="metrics-table">
        <div className="table-header">
          <span>Time</span>
          <span>LCP</span>
          <span>FID</span>
          <span>CLS</span>
          <span>Memory</span>
        </div>
        <div className="table-body">
          {realTimeMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="table-row"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="metric-time">{metric.timestamp}</span>
              <span className="metric-lcp">{metric.lcp}s</span>
              <span className="metric-fid">{metric.fid}ms</span>
              <span className="metric-cls">{metric.cls}</span>
              <span className="metric-memory">{metric.memory}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="monitoring-chart">
        <h4>Live Performance Chart</h4>
        <div className="chart-container">
          <div className="chart-line">
            {realTimeMetrics.slice(0, 10).map((metric, index) => (
              <div
                key={index}
                className="chart-point"
                style={{
                  left: `${(index / 9) * 100}%`,
                  bottom: `${(parseFloat(metric.lcp) / 3) * 100}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return renderPerformanceMetrics();
      case 'resources':
        return renderResourceAnalysis();
      case 'optimization':
        return renderOptimization();
      case 'monitoring':
        return renderRealTimeMonitoring();
      default:
        return renderPerformanceMetrics();
    }
  };

  return (
    <motion.div
      className="performance-optimization"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="po-header">
        <div className="po-title">
          <h2>⚡ Performance Optimization</h2>
          <p>Monitor and optimize your website's performance</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="po-content">
        <div className="po-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`po-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="po-tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceOptimization;
