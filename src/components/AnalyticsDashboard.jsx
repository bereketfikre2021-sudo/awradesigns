import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    pageViews: 0,
    conversions: 0,
    engagement: 0,
    aiInteractions: 0,
    arSessions: 0,
    threeDViews: 0,
    avgSessionTime: 0
  });

  const [realTimeData, setRealTimeData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  // Simulate real-time analytics
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        visitors: prev.visitors + Math.floor(Math.random() * 5),
        pageViews: prev.pageViews + Math.floor(Math.random() * 10),
        conversions: prev.conversions + Math.floor(Math.random() * 2),
        engagement: Math.min(100, prev.engagement + Math.random() * 2),
        aiInteractions: prev.aiInteractions + Math.floor(Math.random() * 3),
        arSessions: prev.arSessions + Math.floor(Math.random() * 2),
        threeDViews: prev.threeDViews + Math.floor(Math.random() * 4),
        avgSessionTime: prev.avgSessionTime + Math.random() * 0.5
      }));

      // Add real-time event
      const events = [
        'User started AI chat',
        '3D room configurator opened',
        'AR preview activated',
        'Color palette generated',
        'Project shared',
        'Contact form submitted'
      ];
      
      const newEvent = {
        id: Date.now(),
        type: events[Math.floor(Math.random() * events.length)],
        timestamp: new Date(),
        user: `User ${Math.floor(Math.random() * 1000)}`,
        location: ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'][Math.floor(Math.random() * 5)]
      };

      setRealTimeData(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementColor = (engagement) => {
    if (engagement >= 80) return '#27AE60';
    if (engagement >= 60) return '#F39C12';
    return '#E74C3C';
  };

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="dashboard-header">
        <h3>📊 Advanced Analytics Dashboard</h3>
        <p>Real-time insights into your website performance</p>
        
        <div className="period-selector">
          {['1h', '24h', '7d', '30d'].map((period) => (
            <motion.button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h4>Total Visitors</h4>
            <div className="metric-value">{formatNumber(analytics.visitors)}</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <h4>Page Views</h4>
            <div className="metric-value">{formatNumber(analytics.pageViews)}</div>
            <div className="metric-change positive">+8.3%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h4>Conversions</h4>
            <div className="metric-value">{formatNumber(analytics.conversions)}</div>
            <div className="metric-change positive">+15.2%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">💬</div>
          <div className="metric-content">
            <h4>Engagement</h4>
            <div className="metric-value">{analytics.engagement.toFixed(1)}%</div>
            <div className="metric-change positive">+5.7%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">🤖</div>
          <div className="metric-content">
            <h4>AI Interactions</h4>
            <div className="metric-value">{formatNumber(analytics.aiInteractions)}</div>
            <div className="metric-change positive">+22.1%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">📱</div>
          <div className="metric-content">
            <h4>AR Sessions</h4>
            <div className="metric-value">{formatNumber(analytics.arSessions)}</div>
            <div className="metric-change positive">+18.9%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">🎮</div>
          <div className="metric-content">
            <h4>3D Views</h4>
            <div className="metric-value">{formatNumber(analytics.threeDViews)}</div>
            <div className="metric-change positive">+14.6%</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h4>Avg Session</h4>
            <div className="metric-value">{analytics.avgSessionTime.toFixed(1)}m</div>
            <div className="metric-change positive">+3.2%</div>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="real-time-events">
          <h4>🔄 Real-Time Events</h4>
          <div className="events-list">
            {realTimeData.map((event) => (
              <motion.div
                key={event.id}
                className="event-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="event-icon">
                  {event.type.includes('AI') ? '🤖' : 
                   event.type.includes('3D') ? '🎮' :
                   event.type.includes('AR') ? '📱' :
                   event.type.includes('Color') ? '🎨' :
                   event.type.includes('Contact') ? '📞' : '👤'}
                </div>
                <div className="event-content">
                  <div className="event-type">{event.type}</div>
                  <div className="event-details">
                    {event.user} from {event.location}
                  </div>
                </div>
                <div className="event-time">
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="performance-chart">
          <h4>📈 Performance Trends</h4>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="chart-bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.random() * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h4>💡 AI Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <h5>Conversion Optimization</h5>
            <p>Your AR preview feature has increased conversions by 34%. Consider promoting it more prominently.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <h5>Peak Hours</h5>
            <p>Most engagement occurs between 2-4 PM. Schedule important updates during this time.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📱</div>
            <h5>Device Usage</h5>
            <p>67% of users access via mobile. Your responsive design is performing excellently.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
