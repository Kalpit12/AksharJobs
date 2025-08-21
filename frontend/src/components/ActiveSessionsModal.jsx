import React, { useState, useEffect } from 'react';
import '../styles/ActiveSessionsModal.css';

const ActiveSessionsModal = ({ isOpen, onClose }) => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadActiveSessions();
    }
  }, [isOpen]);

  const loadActiveSessions = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      const mockSessions = [
        {
          id: 1,
          device: 'Chrome on Windows 11',
          location: 'New York, NY, USA',
          ipAddress: '192.168.1.100',
          lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          isCurrent: true,
          browser: 'Chrome',
          os: 'Windows 11'
        },
        {
          id: 2,
          device: 'Safari on iPhone 14',
          location: 'New York, NY, USA',
          ipAddress: '192.168.1.101',
          lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isCurrent: false,
          browser: 'Safari',
          os: 'iOS 17'
        },
        {
          id: 3,
          device: 'Firefox on MacBook Pro',
          location: 'San Francisco, CA, USA',
          ipAddress: '192.168.1.102',
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isCurrent: false,
          browser: 'Firefox',
          os: 'macOS'
        }
      ];
      
      setActiveSessions(mockSessions);
    } catch (error) {
      console.error('Error loading active sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Terminating session ${sessionId}`);
      
      // Remove session from local state
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Show success message
      alert('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      alert('Failed to terminate session. Please try again.');
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Terminating all other sessions');
      
      // Keep only current session
      setActiveSessions(prev => prev.filter(session => session.isCurrent));
      
      // Show success message
      alert('All other sessions terminated successfully');
    } catch (error) {
      console.error('Error terminating all other sessions:', error);
      alert('Failed to terminate sessions. Please try again.');
    }
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    return timestamp.toLocaleDateString('en-US', {
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

  const getBrowserIcon = (browser) => {
    switch (browser.toLowerCase()) {
      case 'chrome':
        return '🔴';
      case 'safari':
        return '🔵';
      case 'firefox':
        return '🟠';
      case 'edge':
        return '🔵';
      default:
        return '🌐';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="active-sessions-modal-overlay" onClick={onClose}>
      <div className="active-sessions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Active Sessions</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="sessions-header">
            <p>Manage your active login sessions across different devices and browsers.</p>
            <div className="session-actions">
              <button 
                className="terminate-all-btn"
                onClick={handleTerminateAllOtherSessions}
                disabled={activeSessions.filter(s => !s.isCurrent).length === 0}
              >
                Terminate All Other Sessions
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading active sessions...</span>
            </div>
          ) : (
            <div className="sessions-list">
              {activeSessions.map((session) => (
                <div key={session.id} className={`session-item ${session.isCurrent ? 'current-session' : ''}`}>
                  <div className="session-icon">
                    {getDeviceIcon(session.device)}
                  </div>
                  
                  <div className="session-details">
                    <div className="session-main">
                      <div className="device-info">
                        <span className="device-name">{session.device}</span>
                        {session.isCurrent && (
                          <span className="current-badge">Current Session</span>
                        )}
                      </div>
                      <div className="session-meta">
                        <span className="browser-info">
                          {getBrowserIcon(session.browser)} {session.browser} on {session.os}
                        </span>
                        <span className="location">{session.location}</span>
                        <span className="ip-address">IP: {session.ipAddress}</span>
                      </div>
                    </div>
                    
                    <div className="session-actions">
                      <span className="last-activity">
                        Last activity: {formatLastActivity(session.lastActivity)}
                      </span>
                      {!session.isCurrent && (
                        <button 
                          className="terminate-btn"
                          onClick={() => handleTerminateSession(session.id)}
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="security-notice">
            <div className="notice-icon">🔒</div>
            <div className="notice-content">
              <h4>Session Security</h4>
              <ul>
                <li>Terminate sessions from devices you no longer use</li>
                <li>Monitor for any unfamiliar locations or devices</li>
                <li>Change your password if you notice suspicious activity</li>
                <li>Enable two-factor authentication for additional security</li>
              </ul>
            </div>
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

export default ActiveSessionsModal;
