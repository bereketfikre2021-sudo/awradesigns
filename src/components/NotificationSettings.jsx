import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationService from './NotificationService';

const NotificationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    projectUpdates: true,
    designApprovals: true,
    quoteReady: true,
    consultationReminders: true,
    weeklyDigest: false,
    marketingUpdates: false
  });

  const notificationService = NotificationService();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      // Show a test notification
      notificationService.showNotification('🎉 Notifications Enabled!', {
        body: 'You will now receive updates about your projects',
        data: { type: 'permission-granted' }
      });
    }
  };

  const testNotification = () => {
    notificationService.showNotification('🔔 Test Notification', {
      body: 'This is a test notification from Awra Finishing',
      data: { type: 'test' }
    });
  };

  const notificationTypes = [
    {
      key: 'projectUpdates',
      title: 'Project Updates',
      description: 'Get notified when your project milestones are completed or files are uploaded',
      icon: '🏠'
    },
    {
      key: 'designApprovals',
      title: 'Design Approvals',
      description: 'Receive notifications when designs are ready for your review',
      icon: '🎨'
    },
    {
      key: 'quoteReady',
      title: 'Quote Ready',
      description: 'Get notified when your project quotes are ready',
      icon: '💰'
    },
    {
      key: 'consultationReminders',
      title: 'Consultation Reminders',
      description: 'Receive reminders for scheduled consultations',
      icon: '📅'
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Digest',
      description: 'Get a weekly summary of all your project activities',
      icon: '📊'
    },
    {
      key: 'marketingUpdates',
      title: 'Marketing Updates',
      description: 'Receive updates about new services and special offers',
      icon: '📢'
    }
  ];

  return (
    <motion.div
      className="notification-settings"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="settings-header">
        <div className="settings-title">
          <h2>🔔 Notification Settings</h2>
          <p>Manage how you receive updates about your projects</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="settings-content">
        <div className="permission-section">
          <div className="permission-status">
            <h3>Browser Permission</h3>
            <div className="permission-info">
              <span className={`permission-badge ${notificationService.permission}`}>
                {notificationService.permission === 'granted' ? '✅ Enabled' : 
                 notificationService.permission === 'denied' ? '❌ Disabled' : '⚠️ Not Set'}
              </span>
              {notificationService.permission !== 'granted' && (
                <motion.button
                  className="btn btn-primary"
                  onClick={handleRequestPermission}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enable Notifications
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="notification-types">
          <h3>Notification Types</h3>
          <div className="types-list">
            {notificationTypes.map((type) => (
              <motion.div
                key={type.key}
                className="notification-type"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="type-header">
                  <div className="type-icon">{type.icon}</div>
                  <div className="type-info">
                    <h4>{type.title}</h4>
                    <p>{type.description}</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings[type.key]}
                      onChange={(e) => handleSettingChange(type.key, e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="test-section">
          <h3>Test Notifications</h3>
          <p>Send a test notification to make sure everything is working correctly</p>
          <motion.button
            className="btn btn-secondary"
            onClick={testNotification}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Test Notification
          </motion.button>
        </div>

        <div className="settings-footer">
          <div className="footer-info">
            <p>💡 <strong>Tip:</strong> You can always change these settings later from your client portal.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
