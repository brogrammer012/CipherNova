import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, ExternalLink } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'New Phishing Pattern Detected',
      message: 'Watch out for urgent bursary emails claiming to be from NSFAS. These often contain suspicious links.',
      timestamp: '2 hours ago',
      isNew: true,
      action: 'Learn More'
    },
    {
      id: 2,
      type: 'tip',
      title: 'Daily Security Tip',
      message: 'Always verify the sender\'s email address before clicking any links. Look for subtle misspellings in domain names.',
      timestamp: '1 day ago',
      isNew: false
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Milestone Reached!',
      message: 'Congratulations! You just earned the "Scam Catcher" badge for detecting 10 phishing attempts.',
      timestamp: '2 days ago',
      isNew: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Weekly Report Available',
      message: 'Your weekly security report is ready. You\'ve improved your detection rate by 15% this week!',
      timestamp: '3 days ago',
      isNew: false
    }
  ]);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={18} />;
      case 'tip': return <Info size={18} />;
      case 'achievement': return <CheckCircle size={18} />;
      case 'info': return <Bell size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'alert': return '#ff4444';
      case 'tip': return '#00CED1';
      case 'achievement': return '#00FF7F';
      case 'info': return '#888888';
      default: return '#888888';
    }
  };

  return (
    <div className="notifications">
      <div className="notifications-card">
        <div className="notifications-header">
          <div className="header-icon">
            <Bell size={20} />
          </div>
          <h3 className="notifications-title">Notifications</h3>
          {notifications.filter(n => n.isNew).length > 0 && (
            <div className="new-badge">
              {notifications.filter(n => n.isNew).length}
            </div>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <Bell size={32} />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.isNew ? 'new' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <div 
                      className="notification-icon"
                      style={{ color: getNotificationColor(notification.type) }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-meta">
                      <h4 className="notification-title">{notification.title}</h4>
                      <span className="notification-timestamp">{notification.timestamp}</span>
                    </div>
                    <button 
                      className="dismiss-btn"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {notification.action && (
                    <button className="notification-action">
                      {notification.action}
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
                {notification.isNew && <div className="new-indicator"></div>}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notifications-footer">
            <button className="view-all-btn">
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
