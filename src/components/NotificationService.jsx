import React, { useState, useEffect } from 'react';

const NotificationService = () => {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const showNotification = (title, options = {}) => {
    if (permission !== 'granted' || !isSupported) return;

    const notification = new Notification(title, {
      icon: '/favicon-32x32.png',
      badge: '/favicon-16x16.png',
      tag: 'awra-notification',
      requireInteraction: false,
      silent: false,
      ...options
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  // Project update notifications
  const notifyProjectUpdate = (projectName, updateType) => {
    const messages = {
      'milestone': `🎯 Milestone completed for ${projectName}`,
      'file': `📁 New file uploaded for ${projectName}`,
      'message': `💬 New message from team for ${projectName}`,
      'status': `📊 Status update for ${projectName}`,
      'deadline': `⏰ Deadline approaching for ${projectName}`
    };

    showNotification(messages[updateType] || `Update for ${projectName}`, {
      body: 'Click to view details in your client portal',
      data: { projectName, updateType }
    });
  };

  // Design approval notifications
  const notifyDesignApproval = (designName) => {
    showNotification('🎨 Design Ready for Approval', {
      body: `${designName} is ready for your review and approval`,
      data: { type: 'design-approval', designName }
    });
  };

  // Quote ready notifications
  const notifyQuoteReady = (projectName) => {
    showNotification('💰 Quote Ready', {
      body: `Your detailed quote for ${projectName} is ready`,
      data: { type: 'quote-ready', projectName }
    });
  };

  // Consultation reminder
  const notifyConsultationReminder = (time) => {
    showNotification('📅 Consultation Reminder', {
      body: `Your consultation is scheduled in ${time}`,
      data: { type: 'consultation-reminder', time }
    });
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    notifyProjectUpdate,
    notifyDesignApproval,
    notifyQuoteReady,
    notifyConsultationReminder
  };
};

export default NotificationService;
