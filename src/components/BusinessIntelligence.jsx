import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const BusinessIntelligence = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'clients', name: 'Clients', icon: '👥' },
    { id: 'projects', name: 'Projects', icon: '🏗️' },
    { id: 'revenue', name: 'Revenue', icon: '💰' },
    { id: 'satisfaction', name: 'Satisfaction', icon: '⭐' },
    { id: 'performance', name: 'Performance', icon: '📈' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  // Mock data - in real implementation, this would come from your backend
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalClients: 156,
      activeProjects: 23,
      completedProjects: 89,
      totalRevenue: 2450000,
      avgProjectValue: 27500,
      clientSatisfaction: 4.8,
      conversionRate: 34.5,
      repeatClients: 67
    },
    clients: {
      newClients: 12,
      returningClients: 8,
      clientRetention: 78.5,
      avgClientValue: 15700,
      topClientSources: [
        { source: 'Website', count: 45, percentage: 28.8 },
        { source: 'Referrals', count: 38, percentage: 24.4 },
        { source: 'Social Media', count: 32, percentage: 20.5 },
        { source: 'Google Ads', count: 25, percentage: 16.0 },
        { source: 'Other', count: 16, percentage: 10.3 }
      ],
      clientGrowth: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 15 },
        { month: 'Mar', count: 18 },
        { month: 'Apr', count: 22 },
        { month: 'May', count: 19 },
        { month: 'Jun', count: 25 }
      ]
    },
    projects: {
      totalProjects: 112,
      completedProjects: 89,
      inProgressProjects: 23,
      avgProjectDuration: 45,
      projectTypes: [
        { type: 'Residential', count: 67, revenue: 1200000 },
        { type: 'Commercial', count: 28, revenue: 980000 },
        { type: 'Office', count: 12, revenue: 180000 },
        { type: 'Retail', count: 5, revenue: 90000 }
      ],
      projectStatus: [
        { status: 'Completed', count: 89, percentage: 79.5 },
        { status: 'In Progress', count: 23, percentage: 20.5 }
      ]
    },
    revenue: {
      totalRevenue: 2450000,
      monthlyRevenue: [
        { month: 'Jan', revenue: 180000 },
        { month: 'Feb', revenue: 220000 },
        { month: 'Mar', revenue: 195000 },
        { month: 'Apr', revenue: 280000 },
        { month: 'May', revenue: 240000 },
        { month: 'Jun', revenue: 310000 }
      ],
      revenueBySource: [
        { source: 'Design Services', amount: 980000, percentage: 40.0 },
        { source: 'Construction', amount: 1225000, percentage: 50.0 },
        { source: 'Consulting', amount: 245000, percentage: 10.0 }
      ],
      profitMargin: 28.5
    },
    satisfaction: {
      overallRating: 4.8,
      totalReviews: 89,
      ratingDistribution: [
        { rating: 5, count: 67, percentage: 75.3 },
        { rating: 4, count: 18, percentage: 20.2 },
        { rating: 3, count: 3, percentage: 3.4 },
        { rating: 2, count: 1, percentage: 1.1 },
        { rating: 1, count: 0, percentage: 0.0 }
      ],
      satisfactionFactors: [
        { factor: 'Design Quality', rating: 4.9 },
        { factor: 'Communication', rating: 4.7 },
        { factor: 'Timeline', rating: 4.6 },
        { factor: 'Budget', rating: 4.8 },
        { factor: 'Final Result', rating: 4.9 }
      ],
      recentReviews: [
        {
          client: 'Sarah M.',
          project: 'Modern Kitchen Renovation',
          rating: 5,
          comment: 'Exceptional design and execution. Exceeded all expectations!',
          date: '2024-01-15'
        },
        {
          client: 'Ahmed K.',
          project: 'Office Space Design',
          rating: 5,
          comment: 'Professional team, great communication, beautiful results.',
          date: '2024-01-12'
        },
        {
          client: 'Maria L.',
          project: 'Living Room Makeover',
          rating: 4,
          comment: 'Very happy with the outcome. Minor delays but worth the wait.',
          date: '2024-01-10'
        }
      ]
    },
    performance: {
      websiteMetrics: {
        totalVisitors: 12450,
        uniqueVisitors: 8920,
        bounceRate: 32.5,
        avgSessionDuration: 4.2,
        conversionRate: 3.8
      },
      leadMetrics: {
        totalLeads: 234,
        qualifiedLeads: 89,
        conversionRate: 38.0,
        avgLeadValue: 18500,
        leadSources: [
          { source: 'Contact Form', count: 98 },
          { source: 'Phone Calls', count: 67 },
          { source: 'Email', count: 45 },
          { source: 'WhatsApp', count: 24 }
        ]
      },
      teamPerformance: [
        { name: 'Design Team', efficiency: 92, satisfaction: 4.8 },
        { name: 'Construction Team', efficiency: 88, satisfaction: 4.6 },
        { name: 'Project Management', efficiency: 95, satisfaction: 4.9 },
        { name: 'Client Relations', efficiency: 90, satisfaction: 4.7 }
      ]
    }
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const renderOverview = () => (
    <div className="overview-dashboard">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>{formatNumber(analyticsData.overview.totalClients)}</h3>
            <p>Total Clients</p>
            <span className="kpi-change positive">+12%</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">🏗️</div>
          <div className="kpi-content">
            <h3>{analyticsData.overview.activeProjects}</h3>
            <p>Active Projects</p>
            <span className="kpi-change positive">+3</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
            <p>Total Revenue</p>
            <span className="kpi-change positive">+18%</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-content">
            <h3>{analyticsData.overview.clientSatisfaction}</h3>
            <p>Client Satisfaction</p>
            <span className="kpi-change positive">+0.2</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Revenue Trend</h4>
          <div className="revenue-chart">
            {analyticsData.revenue.monthlyRevenue.map((item, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(item.revenue / 350000) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
                <span className="bar-label">{item.month}</span>
                <span className="bar-value">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Client Sources</h4>
          <div className="sources-chart">
            {analyticsData.clients.topClientSources.map((source, index) => (
              <div key={index} className="source-item">
                <div className="source-info">
                  <span className="source-name">{source.source}</span>
                  <span className="source-count">{source.count} clients</span>
                </div>
                <div className="source-bar">
                  <div 
                    className="source-fill"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <span className="source-percentage">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="clients-dashboard">
      <div className="clients-summary">
        <div className="summary-card">
          <h4>Client Growth</h4>
          <div className="growth-chart">
            {analyticsData.clients.clientGrowth.map((item, index) => (
              <div key={index} className="growth-bar">
                <div 
                  className="growth-fill"
                  style={{ height: `${(item.count / 30) * 100}%` }}
                />
                <span className="growth-label">{item.month}</span>
                <span className="growth-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-card">
          <h4>Client Metrics</h4>
          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">New Clients</span>
              <span className="metric-value">{analyticsData.clients.newClients}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Returning Clients</span>
              <span className="metric-value">{analyticsData.clients.returningClients}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Retention Rate</span>
              <span className="metric-value">{analyticsData.clients.clientRetention}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Client Value</span>
              <span className="metric-value">{formatCurrency(analyticsData.clients.avgClientValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="projects-dashboard">
      <div className="projects-overview">
        <div className="project-stats">
          <div className="stat-card">
            <h4>Total Projects</h4>
            <div className="stat-number">{analyticsData.projects.totalProjects}</div>
          </div>
          <div className="stat-card">
            <h4>Completed</h4>
            <div className="stat-number">{analyticsData.projects.completedProjects}</div>
          </div>
          <div className="stat-card">
            <h4>In Progress</h4>
            <div className="stat-number">{analyticsData.projects.inProgressProjects}</div>
          </div>
          <div className="stat-card">
            <h4>Avg Duration</h4>
            <div className="stat-number">{analyticsData.projects.avgProjectDuration} days</div>
          </div>
        </div>

        <div className="project-types-chart">
          <h4>Projects by Type</h4>
          <div className="types-list">
            {analyticsData.projects.projectTypes.map((type, index) => (
              <div key={index} className="type-item">
                <div className="type-info">
                  <span className="type-name">{type.type}</span>
                  <span className="type-count">{type.count} projects</span>
                </div>
                <div className="type-revenue">{formatCurrency(type.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="revenue-dashboard">
      <div className="revenue-overview">
        <div className="revenue-summary">
          <h3>Total Revenue: {formatCurrency(analyticsData.revenue.totalRevenue)}</h3>
          <p>Profit Margin: {analyticsData.revenue.profitMargin}%</p>
        </div>

        <div className="revenue-breakdown">
          <h4>Revenue by Source</h4>
          <div className="breakdown-list">
            {analyticsData.revenue.revenueBySource.map((source, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-name">{source.source}</span>
                  <span className="breakdown-percentage">{source.percentage}%</span>
                </div>
                <div className="breakdown-amount">{formatCurrency(source.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSatisfaction = () => (
    <div className="satisfaction-dashboard">
      <div className="satisfaction-overview">
        <div className="rating-summary">
          <div className="overall-rating">
            <div className="rating-number">{analyticsData.satisfaction.overallRating}</div>
            <div className="rating-stars">⭐⭐⭐⭐⭐</div>
            <div className="rating-count">{analyticsData.satisfaction.totalReviews} reviews</div>
          </div>
        </div>

        <div className="satisfaction-factors">
          <h4>Satisfaction by Factor</h4>
          <div className="factors-list">
            {analyticsData.satisfaction.satisfactionFactors.map((factor, index) => (
              <div key={index} className="factor-item">
                <span className="factor-name">{factor.factor}</span>
                <div className="factor-rating">
                  <div className="rating-bar">
                    <div 
                      className="rating-fill"
                      style={{ width: `${(factor.rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="rating-value">{factor.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-reviews">
        <h4>Recent Reviews</h4>
        <div className="reviews-list">
          {analyticsData.satisfaction.recentReviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div className="review-client">
                  <span className="client-name">{review.client}</span>
                  <span className="project-name">{review.project}</span>
                </div>
                <div className="review-rating">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">{review.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="performance-dashboard">
      <div className="performance-metrics">
        <div className="website-metrics">
          <h4>Website Performance</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Visitors</span>
              <span className="metric-value">{formatNumber(analyticsData.performance.websiteMetrics.totalVisitors)}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Bounce Rate</span>
              <span className="metric-value">{analyticsData.performance.websiteMetrics.bounceRate}%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Session</span>
              <span className="metric-value">{analyticsData.performance.websiteMetrics.avgSessionDuration}m</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Conversion Rate</span>
              <span className="metric-value">{analyticsData.performance.websiteMetrics.conversionRate}%</span>
            </div>
          </div>
        </div>

        <div className="lead-metrics">
          <h4>Lead Performance</h4>
          <div className="lead-stats">
            <div className="lead-stat">
              <span className="lead-number">{analyticsData.performance.leadMetrics.totalLeads}</span>
              <span className="lead-label">Total Leads</span>
            </div>
            <div className="lead-stat">
              <span className="lead-number">{analyticsData.performance.leadMetrics.qualifiedLeads}</span>
              <span className="lead-label">Qualified</span>
            </div>
            <div className="lead-stat">
              <span className="lead-number">{analyticsData.performance.leadMetrics.conversionRate}%</span>
              <span className="lead-label">Conversion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="team-performance">
        <h4>Team Performance</h4>
        <div className="team-list">
          {analyticsData.performance.teamPerformance.map((team, index) => (
            <div key={index} className="team-item">
              <div className="team-info">
                <span className="team-name">{team.name}</span>
                <div className="team-metrics">
                  <span className="team-efficiency">Efficiency: {team.efficiency}%</span>
                  <span className="team-satisfaction">Satisfaction: {team.satisfaction}</span>
                </div>
              </div>
              <div className="team-bars">
                <div className="efficiency-bar">
                  <div 
                    className="efficiency-fill"
                    style={{ width: `${team.efficiency}%` }}
                  />
                </div>
                <div className="satisfaction-bar">
                  <div 
                    className="satisfaction-fill"
                    style={{ width: `${(team.satisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'clients':
        return renderClients();
      case 'projects':
        return renderProjects();
      case 'revenue':
        return renderRevenue();
      case 'satisfaction':
        return renderSatisfaction();
      case 'performance':
        return renderPerformance();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="business-intelligence"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="bi-loading">
          <div className="loading-animation">
            <div className="bi-icon">📊</div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <h3>Loading Business Intelligence...</h3>
          <p>Analyzing your business data</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="business-intelligence"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="bi-header">
        <div className="bi-title">
          <h2>📊 Business Intelligence</h2>
          <p>Comprehensive analytics and insights for your business</p>
        </div>
        <div className="bi-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-selector"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="bi-content">
        <div className="bi-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`bi-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="bi-tab-content">
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

export default BusinessIntelligence;
