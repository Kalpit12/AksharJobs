import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faExclamationTriangle, faCheckCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { monitorNetworkStatus, buildApiUrl } from '../config/api';
import './NetworkStatus.css';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    // Monitor network status
    const cleanup = monitorNetworkStatus();
    
    // Listen for network status changes
    const handleNetworkChange = (event) => {
      setIsOnline(event.detail.isOnline);
      if (event.detail.isOnline) {
        checkBackendStatus();
      }
    };

    const handleNetworkError = (event) => {
      console.log('Network error detected:', event.detail);
      setBackendStatus('error');
    };

    window.addEventListener('networkStatusChange', handleNetworkChange);
    window.addEventListener('networkError', handleNetworkError);

    // Initial backend status check
    checkBackendStatus();

    return () => {
      cleanup();
      window.removeEventListener('networkStatusChange', handleNetworkChange);
      window.removeEventListener('networkError', handleNetworkError);
    };
  }, []);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch(buildApiUrl('/health'), {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      setBackendStatus('error');
    } finally {
      setLastCheck(new Date());
    }
  };

  const getStatusIcon = () => {
    if (backendStatus === 'connected') return faCheckCircle;
    if (backendStatus === 'error') return faExclamationTriangle;
    if (backendStatus === 'checking') return faSync;
    return faWifi;
  };

  const getStatusColor = () => {
    if (backendStatus === 'connected') return '#10b981';
    if (backendStatus === 'error') return '#ef4444';
    if (backendStatus === 'checking') return '#f59e0b';
    return '#6b7280';
  };

  const getStatusText = () => {
    if (backendStatus === 'connected') return 'Backend Connected';
    if (backendStatus === 'error') return 'Backend Error';
    if (backendStatus === 'checking') return 'Checking...';
    return 'Unknown Status';
  };

  const getNetworkInfo = () => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    return {
      currentUrl: `${protocol}//${hostname}${port ? ':' + port : ''}`,
      hostname,
      port,
      protocol
    };
  };

  if (!isOnline) {
    return (
      <div className="network-status offline">
        <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon" />
        <span className="status-text">You're offline</span>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="network-status">
      <div 
        className="status-indicator"
        onClick={() => setShowDetails(!showDetails)}
        style={{ cursor: 'pointer' }}
      >
        <FontAwesomeIcon 
          icon={getStatusIcon()} 
          className="status-icon"
          style={{ color: getStatusColor() }}
          spin={backendStatus === 'checking'}
        />
        <span className="status-text">{getStatusText()}</span>
        <button 
          className="refresh-btn"
          onClick={(e) => {
            e.stopPropagation();
            checkBackendStatus();
          }}
          title="Refresh status"
        >
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="detail-section">
            <h4>Network Information</h4>
            <div className="detail-item">
              <span className="label">Current URL:</span>
              <span className="value">{getNetworkInfo().currentUrl}</span>
            </div>
            <div className="detail-item">
              <span className="label">Hostname:</span>
              <span className="value">{getNetworkInfo().hostname}</span>
            </div>
            <div className="detail-item">
              <span className="label">Port:</span>
              <span className="value">{getNetworkInfo().port || 'Default'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Backend Status</h4>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </span>
            </div>
            {lastCheck && (
              <div className="detail-item">
                <span className="label">Last Check:</span>
                <span className="value">{lastCheck.toLocaleTimeString()}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="label">Backend URL:</span>
              <span className="value">{buildApiUrl('')}</span>
            </div>
          </div>

          {backendStatus === 'error' && (
            <div className="troubleshooting">
              <h4>Troubleshooting Tips</h4>
              <ul>
                <li>Check if your backend server is running</li>
                <li>Verify the backend port (default: 3002)</li>
                <li>Check firewall settings</li>
                <li>Try refreshing the page</li>
                <li>Check if you're on the same network</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
