import React, { useState, useEffect } from 'react';
import '../styles/LoginHistoryModal.css';

const LoginHistoryModal = ({ isOpen, onClose }) => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadLoginHistory();
    }
  }, [isOpen]);

  const loadLoginHistory = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      const mockHistory = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          device: 'Chrome on Windows 11',
          location: 'New York, NY, USA',
          ipAddress: '192.168.1.100',
          status: 'success',
          isCurrent: true
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          device: 'Safari on iPhone 14',
          location: 'New York, NY, USA',
          ipAddress: '192.168.1.101',
          status: 'success',
          isCurrent: false
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          device: 'Firefox on MacBook Pro',
          location: 'San Francisco, CA, USA',
          ipAddress: '192.168.1.102',
          status: 'success',
          isCurrent: false
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          device: 'Chrome on Android',
          location: 'Los Angeles, CA, USA',
          ipAddress: '192.168.1.103',
          status: 'success',
          isCurrent: false
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
          device: 'Edge on Windows 10',
          location: 'Chicago, IL, USA',
          ipAddress: '192.168.1.104',
          status: 'success',
          isCurrent: false
        }
      ];
      
      setLoginHistory(mockHistory);
    } catch (error) {
      console.error('Error loading login history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('Android')) return '📱';
    if (device.includes('MacBook') || device.includes('Mac')) return '💻';
    if (device.includes('Windows')) return '🖥️';
    if (device.includes('iPad')) return '📱';
    return '💻';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'suspicious':
        return '⚠️';
      default:
        return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-history-modal-overlay" onClick={onClose}>
      <div className="login-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Login History</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="history-header">
            <p>Recent login activity for your account. Review and monitor for any suspicious activity.</p>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading login history...</span>
            </div>
          ) : (
            <div className="history-list">
              {loginHistory.map((login) => (
                <div key={login.id} className={`history-item ${login.isCurrent ? 'current-session' : ''}`}>
                  <div className="history-icon">
                    {getDeviceIcon(login.device)}
                  </div>
                  
                  <div className="history-details">
                    <div className="history-main">
                      <div className="device-info">
                        <span className="device-name">{login.device}</span>
                        {login.isCurrent && (
                          <span className="current-badge">Current Session</span>
                        )}
                      </div>
                      <div className="location-info">
                        <span className="location">{login.location}</span>
                        <span className="ip-address">IP: {login.ipAddress}</span>
                      </div>
                    </div>
                    
                    <div className="history-meta">
                      <span className="timestamp">{formatTimestamp(login.timestamp)}</span>
                      <span className={`status ${login.status}`}>
                        {getStatusIcon(login.status)} {login.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="security-tips">
            <h3>🔒 Security Tips</h3>
            <ul>
              <li>Review your login history regularly for any unfamiliar devices or locations</li>
              <li>If you notice suspicious activity, change your password immediately</li>
              <li>Enable two-factor authentication for additional security</li>
              <li>Log out from devices you no longer use</li>
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryModal;
