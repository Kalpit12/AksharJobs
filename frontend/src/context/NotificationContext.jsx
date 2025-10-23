import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import notificationApi from '../api/notificationApi';
import messageApi from '../api/messageApi';
import websocketService from '../services/websocketService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add a flag to completely disable API calls when not properly authenticated
  const shouldMakeApiCalls = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('🚫 User not authenticated, skipping API calls');
      return false;
    }
    console.log('✅ API calls enabled for authenticated user');
    return true;
  };

  // Helper function to validate token
  const isValidToken = (token) => {
    if (!token) return false;
    try {
      // Basic JWT token validation - check if it has 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (e) {
      return false;
    }
  };

  // Load initial data
  const loadNotifications = useCallback(async () => {
    console.log('🔍 loadNotifications called - shouldMakeApiCalls:', shouldMakeApiCalls());
    
    if (!shouldMakeApiCalls()) {
      console.log('❌ Not authorized to make API calls, skipping notifications load');
      return;
    }
    
    // Check if we have a valid token before making the request
    const token = localStorage.getItem('token');
    if (!token || !isValidToken(token)) {
      console.log('🚫 No valid token found, skipping notifications load');
      return;
    }
    
    console.log('✅ All checks passed, making API call...');
    
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications();
      console.log('📨 API Response:', response);
      if (response && response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (err) {
      console.error('❌ Error loading notifications:', err);
      // Only set error if it's not a 401/403 (authentication error)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError('Failed to load notifications');
      } else {
        console.log('🔒 Authentication error, user may need to log in again');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping messages load');
      return;
    }
    
    // Check if we have a valid token before making the request
    const token = localStorage.getItem('token');
    if (!token || !isValidToken(token)) {
      console.log('No valid token found, skipping messages load');
      return;
    }
    
    try {
      const response = await messageApi.getMessages();
      if (response && response.success) {
        setMessages(response.messages || []);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      // Only set error if it's not a 401/403 (authentication error)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError('Failed to load messages');
      }
    }
  }, [isAuthenticated]);

  const loadUnreadCounts = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping unread counts');
      return;
    }
    
    // Check if we have a valid token before making the request
    const token = localStorage.getItem('token');
    if (!token || !isValidToken(token)) {
      console.log('No valid token found, skipping unread counts');
      return;
    }
    
    try {
      const [notificationResponse, messageResponse] = await Promise.all([
        notificationApi.getUnreadCount(),
        messageApi.getUnreadCount()
      ]);
      
      if (notificationResponse.success) {
        setUnreadNotificationCount(notificationResponse.unread_count);
      }
      
      if (messageResponse.success) {
        setUnreadMessageCount(messageResponse.unread_count);
      }
    } catch (err) {
      console.error('Error loading unread counts:', err);
      // Silently fail for auth errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Authentication error, user may need to log in again');
      }
    }
  }, [isAuthenticated]);

  // WebSocket event handlers
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 New notification received:', notification);
    setNotifications(prev => [notification, ...prev]);
    setUnreadNotificationCount(prev => prev + 1);
  }, []);

  const handleNotificationCountUpdate = useCallback((data) => {
    console.log('🔔 Notification count updated:', data.count);
    setUnreadNotificationCount(data.count);
  }, []);

  const handleNewMessage = useCallback((message) => {
    console.log('💬 New message received:', message);
    setMessages(prev => [message, ...prev]);
    setUnreadMessageCount(prev => prev + 1);
  }, []);

  const handleMessageCountUpdate = useCallback((data) => {
    console.log('💬 Message count updated:', data.count);
    setUnreadMessageCount(data.count);
  }, []);

  const handleWebSocketConnected = useCallback(() => {
    console.log('🔌 WebSocket connected for notifications');
    // Reload data when WebSocket connects
    loadNotifications();
    loadMessages();
    loadUnreadCounts();
  }, [loadNotifications, loadMessages, loadUnreadCounts]);

  const handleWebSocketDisconnected = useCallback(() => {
    console.log('🔌 WebSocket disconnected for notifications');
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('🔍 NotificationProvider useEffect - isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated && user?.token) {
      console.log('🔌 Initializing WebSocket connection...');
      websocketService.connect(user.token);
      
      // Set up event listeners
      websocketService.on('connected', handleWebSocketConnected);
      websocketService.on('disconnected', handleWebSocketDisconnected);
      websocketService.on('new_notification', handleNewNotification);
      websocketService.on('notification_count_update', handleNotificationCountUpdate);
      websocketService.on('new_message', handleNewMessage);
      websocketService.on('message_count_update', handleMessageCountUpdate);
      
      // Load initial data only if authorized to make API calls
      console.log('🔍 useEffect - shouldMakeApiCalls:', shouldMakeApiCalls());
      
      if (shouldMakeApiCalls()) {
        console.log('✅ Authorized to make API calls, loading data...');
        loadNotifications();
        loadMessages();
        loadUnreadCounts();
      } else {
        console.log('❌ Not authorized to make API calls, skipping data load');
      }
    } else {
      console.log('🚫 User not authenticated, cleaning up notification context');
      // Disconnect WebSocket if not authenticated
      websocketService.disconnect();
      setNotifications([]);
      setMessages([]);
      setUnreadNotificationCount(0);
      setUnreadMessageCount(0);
    }

    // Cleanup on unmount
    return () => {
      websocketService.off('connected', handleWebSocketConnected);
      websocketService.off('disconnected', handleWebSocketDisconnected);
      websocketService.off('new_notification', handleNewNotification);
      websocketService.off('notification_count_update', handleNotificationCountUpdate);
      websocketService.off('new_message', handleNewMessage);
      websocketService.off('message_count_update', handleMessageCountUpdate);
    };
  }, [isAuthenticated, user?.token, handleWebSocketConnected, handleWebSocketDisconnected, handleNewNotification, handleNotificationCountUpdate, handleNewMessage, handleMessageCountUpdate, loadNotifications, loadMessages, loadUnreadCounts]);

  // Notification actions
  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadNotificationCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadNotificationCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      setUnreadNotificationCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications');
    }
  };

  // Message actions
  const markMessageAsRead = async (messageId) => {
    try {
      await messageApi.markAsRead(messageId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
      setUnreadMessageCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark message as read');
    }
  };

  const sendMessage = async (recipientId, content, messageType = 'text', metadata = {}) => {
    try {
      const response = await messageApi.sendMessage({
        recipient_id: recipientId,
        content,
        message_type: messageType,
        metadata
      });
      
      if (response.success) {
        // Add the sent message to the local state
        setMessages(prev => [response.message, ...prev]);
        return response.message;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      throw err;
    }
  };

  const refreshData = () => {
    loadNotifications();
    loadMessages();
    loadUnreadCounts();
  };

  const value = {
    // State
    notifications,
    messages,
    unreadNotificationCount,
    unreadMessageCount,
    isLoading,
    error,
    
    // Actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    markMessageAsRead,
    sendMessage,
    refreshData,
    
    // WebSocket status
    isWebSocketConnected: websocketService.isWebSocketConnected(),
    connectionState: websocketService.getConnectionState()
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
