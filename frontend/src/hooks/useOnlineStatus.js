import { useState, useEffect, useCallback } from 'react';
import statusService from '../services/statusService';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState('offline');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to status service
    statusService.connect()
      .then(() => {
        setIsConnected(true);
        setStatus(statusService.getStatus());
        setIsOnline(statusService.isOnline());
      })
      .catch((error) => {
        console.error('Failed to connect to status service:', error);
        setIsConnected(false);
      });

    // Listen for status changes
    const unsubscribe = statusService.onStatusChange((event, data) => {
      if (event === 'status_changed') {
        setStatus(data.status);
        setIsOnline(data.status === 'online');
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      statusService.disconnect();
    };
  }, []);

  const checkUserStatus = useCallback(async (userId) => {
    return await statusService.checkUserStatus(userId);
  }, []);

  return {
    isOnline,
    status,
    isConnected,
    checkUserStatus
  };
};

export default useOnlineStatus;
