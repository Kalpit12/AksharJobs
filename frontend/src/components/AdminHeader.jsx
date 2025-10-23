import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faCog, 
  faSignOutAlt, 
  faUserCircle,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const AdminHeader = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'System maintenance scheduled for tonight',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'New user registration milestone reached',
      time: '1 day ago'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return faExclamationTriangle;
      case 'success':
        return faCheckCircle;
      default:
        return faBell;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'warning':
        return 'notification-warning';
      case 'success':
        return 'notification-success';
      default:
        return 'notification-info';
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>AI-Based Resume to Job Description Matcher</h1>
        <span className="system-status active">System Status: Operational</span>
      </div>
      
      <div className="header-right">
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button 
                  className="clear-all"
                  onClick={() => setNotifications([])}
                >
                  Clear All
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${getNotificationClass(notification.type)}`}
                  >
                    <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="admin-controls">
          <button className="settings-btn">
            <FontAwesomeIcon icon={faCog} />
          </button>
          
          <div className="admin-profile">
            <FontAwesomeIcon icon={faUserCircle} className="admin-avatar" />
            <div className="admin-info">
              <span className="admin-name">Admin User</span>
              <span className="admin-role">Super Administrator</span>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
