import React, { useState, useEffect } from 'react';
import '../styles/NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      icon: '👤',
      title: 'New Application',
      message: 'John Doe applied for Senior Developer position',
      time: '2 minutes ago',
      isRead: false,
      color: '#f97316'
    },
    {
      id: 2,
      type: 'interview',
      icon: '📅',
      title: 'Interview Scheduled',
      message: 'Interview with Sarah Johnson at 3:00 PM today',
      time: '1 hour ago',
      isRead: false,
      color: '#8b5cf6'
    },
    {
      id: 3,
      type: 'offer',
      icon: '🎉',
      title: 'Offer Accepted',
      message: 'Michael Brown accepted your job offer!',
      time: '3 hours ago',
      isRead: false,
      color: '#10b981'
    },
    {
      id: 4,
      type: 'message',
      icon: '💬',
      title: 'New Message',
      message: 'You have 3 unread messages from candidates',
      time: '5 hours ago',
      isRead: true,
      color: '#f59e0b'
    },
    {
      id: 5,
      type: 'system',
      icon: '⚙️',
      title: 'System Update',
      message: 'New features added to your recruiter dashboard',
      time: '1 day ago',
      isRead: true,
      color: '#6b7280'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="action-btn">
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="action-btn clear-btn">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <span className="empty-icon">📭</span>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div 
                      className="notification-icon"
                      style={{ background: `${notification.color}20`, color: notification.color }}
                    >
                      {notification.icon}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {!notification.isRead && <div className="unread-dot"></div>}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notification-footer">
                <button className="view-all-btn">
                  View All Notifications →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;

