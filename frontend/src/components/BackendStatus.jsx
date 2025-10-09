import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkBackendStatus = async () => {
    try {
      setStatus('checking');
      const response = await fetch(buildApiUrl('/health'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setStatus('offline');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#28a745';
      case 'offline': return '#dc3545';
      case 'error': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Backend Online';
      case 'offline': return 'Backend Offline';
      case 'error': return 'Backend Error';
      default: return 'Checking...';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    }} onClick={checkBackendStatus} title="Click to refresh">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          animation: status === 'checking' ? 'pulse 1s infinite' : 'none'
        }} />
        <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {getStatusText()}
        </span>
      </div>
      {lastChecked && (
        <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BackendStatus;
