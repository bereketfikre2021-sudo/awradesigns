import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const ClientSatisfactionTracker = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'surveys', name: 'Surveys', icon: '📝' },
    { id: 'feedback', name: 'Feedback', icon: '💬' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' },
    { id: 'alerts', name: 'Alerts', icon: '🚨' }
  ];

  // Mock data - in real implementation, this would come from your backend
  const [satisfactionData, setSatisfactionData] = useState({
    dashboard: {
      overallSatisfaction: 4.8,
      totalResponses: 89,
      responseRate: 78.5,
      npsScore: 67,
      trends: {
        satisfaction: [
          { month: 'Jan', rating: 4.6 },
          { month: 'Feb', rating: 4.7 },
          { month: 'Mar', rating: 4.8 },
          { month: 'Apr', rating: 4.9 },
          { month: 'May', rating: 4.8 },
          { month: 'Jun', rating: 4.8 }
        ],
        responseRate: [
          { month: 'Jan', rate: 72 },
          { month: 'Feb', rate: 75 },
          { month: 'Mar', rate: 78 },
          { month: 'Apr', rate: 82 },
          { month: 'May', rate: 79 },
          { month: 'Jun', rate: 78 }
        ]
      }
    },
    surveys: [
      {
        id: 1,
        name: 'Project Completion Survey',
        status: 'active',
        responses: 45,
        target: 50,
        satisfaction: 4.7,
        questions: [
          { question: 'How satisfied are you with the final result?', avgRating: 4.8 },
          { question: 'How would you rate our communication?', avgRating: 4.6 },
          { question: 'Did we meet your timeline expectations?', avgRating: 4.5 },
          { question: 'How would you rate the value for money?', avgRating: 4.7 }
        ]
      },
      {
        id: 2,
        name: 'Mid-Project Check-in',
        status: 'active',
        responses: 23,
        target: 30,
        satisfaction: 4.5,
        questions: [
          { question: 'How is the project progressing?', avgRating: 4.4 },
          { question: 'Are you satisfied with the team?', avgRating: 4.6 },
          { question: 'Any concerns or suggestions?', avgRating: 4.3 }
        ]
      },
      {
        id: 3,
        name: 'Post-Installation Follow-up',
        status: 'completed',
        responses: 67,
        target: 70,
        satisfaction: 4.9,
        questions: [
          { question: 'How satisfied are you with the installation?', avgRating: 4.9 },
          { question: 'Would you recommend us to others?', avgRating: 4.8 },
          { question: 'Any issues or concerns?', avgRating: 4.7 }
        ]
      }
    ],
    feedback: [
      {
        id: 1,
        client: 'Sarah M.',
        project: 'Modern Kitchen Renovation',
        type: 'positive',
        message: 'Exceptional work! The team was professional, punctual, and the final result exceeded our expectations. Highly recommend!',
        rating: 5,
        date: '2024-01-15',
        category: 'quality',
        status: 'resolved'
      },
      {
        id: 2,
        client: 'Ahmed K.',
        project: 'Office Space Design',
        type: 'positive',
        message: 'Great communication throughout the project. The design team really understood our vision and brought it to life.',
        rating: 5,
        date: '2024-01-12',
        category: 'communication',
        status: 'resolved'
      },
      {
        id: 3,
        client: 'Maria L.',
        project: 'Living Room Makeover',
        type: 'neutral',
        message: 'Overall happy with the result, but there were some delays in the timeline. The quality is good though.',
        rating: 4,
        date: '2024-01-10',
        category: 'timeline',
        status: 'in-progress'
      },
      {
        id: 4,
        client: 'John D.',
        project: 'Bathroom Renovation',
        type: 'negative',
        message: 'Had some issues with the initial design. The team was responsive and fixed the problems, but it caused delays.',
        rating: 3,
        date: '2024-01-08',
        category: 'design',
        status: 'resolved'
      }
    ],
    reviews: [
      {
        id: 1,
        client: 'Sarah M.',
        project: 'Modern Kitchen Renovation',
        rating: 5,
        title: 'Exceeded Expectations',
        content: 'From initial consultation to final installation, the entire experience was exceptional. The team was professional, creative, and delivered exactly what we envisioned.',
        date: '2024-01-15',
        platform: 'Google',
        verified: true
      },
      {
        id: 2,
        client: 'Ahmed K.',
        project: 'Office Space Design',
        rating: 5,
        title: 'Professional and Creative',
        content: 'The design team transformed our office space beyond our expectations. Great attention to detail and excellent project management.',
        date: '2024-01-12',
        platform: 'Facebook',
        verified: true
      },
      {
        id: 3,
        client: 'Maria L.',
        project: 'Living Room Makeover',
        rating: 4,
        title: 'Good Quality, Minor Delays',
        content: 'The final result is beautiful and we\'re very happy with the quality. There were some timeline delays, but the team kept us informed throughout.',
        date: '2024-01-10',
        platform: 'Website',
        verified: true
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Low Response Rate',
        message: 'Project Completion Survey has only 45/50 responses (90%)',
        priority: 'medium',
        date: '2024-01-15',
        action: 'Send reminder emails'
      },
      {
        id: 2,
        type: 'critical',
        title: 'Negative Feedback',
        message: 'New negative feedback from John D. regarding design issues',
        priority: 'high',
        date: '2024-01-08',
        action: 'Follow up immediately'
      },
      {
        id: 3,
        type: 'info',
        title: 'High Satisfaction',
        message: 'Post-Installation Follow-up survey shows 4.9/5 satisfaction',
        priority: 'low',
        date: '2024-01-12',
        action: 'Share success story'
      }
    ]
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getSatisfactionColor = (rating) => {
    if (rating >= 4.5) return '#27ae60';
    if (rating >= 3.5) return '#f39c12';
    return '#e74c3c';
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😞';
      default: return '😶';
    }
  };

  const renderDashboard = () => (
    <div className="satisfaction-dashboard">
      <div className="dashboard-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon">⭐</div>
            <div className="card-content">
              <h3>{satisfactionData.dashboard.overallSatisfaction}</h3>
              <p>Overall Satisfaction</p>
              <span className="card-trend positive">+0.2</span>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>{satisfactionData.dashboard.totalResponses}</h3>
              <p>Total Responses</p>
              <span className="card-trend positive">+12</span>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>{satisfactionData.dashboard.responseRate}%</h3>
              <p>Response Rate</p>
              <span className="card-trend positive">+3.2%</span>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h3>{satisfactionData.dashboard.npsScore}</h3>
              <p>NPS Score</p>
              <span className="card-trend positive">+5</span>
            </div>
          </div>
        </div>

        <div className="trends-charts">
          <div className="trend-chart">
            <h4>Satisfaction Trend</h4>
            <div className="chart-container">
              {satisfactionData.dashboard.trends.satisfaction.map((point, index) => (
                <div key={index} className="chart-point">
                  <div 
                    className="point-value"
                    style={{ 
                      height: `${(point.rating / 5) * 100}%`,
                      backgroundColor: getSatisfactionColor(point.rating)
                    }}
                  />
                  <span className="point-label">{point.month}</span>
                  <span className="point-rating">{point.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trend-chart">
            <h4>Response Rate Trend</h4>
            <div className="chart-container">
              {satisfactionData.dashboard.trends.responseRate.map((point, index) => (
                <div key={index} className="chart-point">
                  <div 
                    className="point-value"
                    style={{ 
                      height: `${point.rate}%`,
                      backgroundColor: '#3498db'
                    }}
                  />
                  <span className="point-label">{point.month}</span>
                  <span className="point-rate">{point.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurveys = () => (
    <div className="surveys-view">
      <div className="surveys-header">
        <h3>Active Surveys</h3>
        <button className="btn btn-primary">Create New Survey</button>
      </div>

      <div className="surveys-list">
        {satisfactionData.surveys.map((survey) => (
          <div key={survey.id} className="survey-card">
            <div className="survey-header">
              <div className="survey-info">
                <h4>{survey.name}</h4>
                <span className={`survey-status ${survey.status}`}>
                  {survey.status}
                </span>
              </div>
              <div className="survey-stats">
                <span className="response-count">
                  {survey.responses}/{survey.target} responses
                </span>
                <span className="satisfaction-rating">
                  {survey.satisfaction}/5 ⭐
                </span>
              </div>
            </div>

            <div className="survey-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(survey.responses / survey.target) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {Math.round((survey.responses / survey.target) * 100)}% complete
              </span>
            </div>

            <div className="survey-questions">
              <h5>Question Results:</h5>
              {survey.questions.map((question, index) => (
                <div key={index} className="question-result">
                  <span className="question-text">{question.question}</span>
                  <div className="question-rating">
                    <div className="rating-bar">
                      <div 
                        className="rating-fill"
                        style={{ 
                          width: `${(question.avgRating / 5) * 100}%`,
                          backgroundColor: getSatisfactionColor(question.avgRating)
                        }}
                      />
                    </div>
                    <span className="rating-value">{question.avgRating}/5</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="survey-actions">
              <button className="btn btn-secondary">View Details</button>
              <button className="btn btn-primary">Send Reminders</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="feedback-view">
      <div className="feedback-header">
        <h3>Client Feedback</h3>
        <div className="feedback-filters">
          <select className="filter-select">
            <option value="all">All Types</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select className="filter-select">
            <option value="all">All Categories</option>
            <option value="quality">Quality</option>
            <option value="communication">Communication</option>
            <option value="timeline">Timeline</option>
            <option value="design">Design</option>
          </select>
        </div>
      </div>

      <div className="feedback-list">
        {satisfactionData.feedback.map((item) => (
          <div key={item.id} className={`feedback-item ${item.type}`}>
            <div className="feedback-header">
              <div className="feedback-client">
                <span className="client-name">{item.client}</span>
                <span className="project-name">{item.project}</span>
                <span className="feedback-date">{item.date}</span>
              </div>
              <div className="feedback-meta">
                <span className="feedback-type">
                  {getFeedbackIcon(item.type)} {item.type}
                </span>
                <span className="feedback-rating">
                  {'⭐'.repeat(item.rating)}
                </span>
                <span className={`feedback-status ${item.status}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="feedback-content">
              <p>{item.message}</p>
              <div className="feedback-category">
                Category: <span className="category-tag">{item.category}</span>
              </div>
            </div>

            <div className="feedback-actions">
              {item.status === 'in-progress' && (
                <button className="btn btn-primary">Follow Up</button>
              )}
              <button className="btn btn-secondary">View Details</button>
              <button className="btn btn-secondary">Archive</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-view">
      <div className="reviews-header">
        <h3>Client Reviews</h3>
        <div className="reviews-summary">
          <span className="avg-rating">4.8/5 ⭐</span>
          <span className="total-reviews">Based on {satisfactionData.reviews.length} reviews</span>
        </div>
      </div>

      <div className="reviews-list">
        {satisfactionData.reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="review-client">
                <span className="client-name">{review.client}</span>
                <span className="project-name">{review.project}</span>
                <span className="review-platform">{review.platform}</span>
                {review.verified && <span className="verified-badge">✓ Verified</span>}
              </div>
              <div className="review-rating">
                {'⭐'.repeat(review.rating)}
                <span className="rating-date">{review.date}</span>
              </div>
            </div>
            
            <div className="review-content">
              <h4>{review.title}</h4>
              <p>{review.content}</p>
            </div>

            <div className="review-actions">
              <button className="btn btn-secondary">Reply</button>
              <button className="btn btn-secondary">Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="alerts-view">
      <div className="alerts-header">
        <h3>Alerts & Notifications</h3>
        <button className="btn btn-secondary">Mark All Read</button>
      </div>

      <div className="alerts-list">
        {satisfactionData.alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.type}`}>
            <div className="alert-icon">
              {getAlertIcon(alert.type)}
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <h4>{alert.title}</h4>
                <span className="alert-priority">{alert.priority}</span>
                <span className="alert-date">{alert.date}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-action">
                <span className="action-label">Suggested Action:</span>
                <span className="action-text">{alert.action}</span>
              </div>
            </div>
            <div className="alert-actions">
              <button className="btn btn-primary">Take Action</button>
              <button className="btn btn-secondary">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'surveys':
        return renderSurveys();
      case 'feedback':
        return renderFeedback();
      case 'reviews':
        return renderReviews();
      case 'alerts':
        return renderAlerts();
      default:
        return renderDashboard();
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="client-satisfaction-tracker"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="cst-loading">
          <div className="loading-animation">
            <div className="cst-icon">⭐</div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <h3>Loading Satisfaction Data...</h3>
          <p>Analyzing client feedback and reviews</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="client-satisfaction-tracker"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="cst-header">
        <div className="cst-title">
          <h2>⭐ Client Satisfaction Tracker</h2>
          <p>Monitor and improve client satisfaction across all touchpoints</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="cst-content">
        <div className="cst-tabs">
          {views.map(view => (
            <motion.button
              key={view.id}
              className={`cst-tab ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tab-icon">{view.icon}</span>
              <span className="tab-name">{view.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="cst-tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
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

export default ClientSatisfactionTracker;
