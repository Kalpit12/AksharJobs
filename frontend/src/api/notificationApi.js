import axios from 'axios';
import { buildApiUrl } from '../config/api';

const DEFAULT_HEADERS = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  'Content-Type': 'application/json'
});

const notificationApi = {
  // Get all notifications for the current user
  getNotifications: async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/notifications/'), {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return safe default to keep UI stable
      return { success: true, notifications: [] };
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/notifications/unread-count'), {
        headers: DEFAULT_HEADERS(),
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Return safe default to keep UI stable
      return { success: true, unread_count: 0 };
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(buildApiUrl(`/api/notifications/${notificationId}/read`), {}, {
        headers: DEFAULT_HEADERS(),
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Return safe default response
      return { success: false };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await axios.put(buildApiUrl('/api/notifications/mark-all-read'), {}, {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Return safe default response
      return { success: false };
    }
  },

  // Clear all notifications
  clearAll: async () => {
    try {
      const response = await axios.delete(buildApiUrl('/api/notifications/clear-all'), {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      // Return safe default response
      return { success: false };
    }
  },

  // Create a notification (for testing)
  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(buildApiUrl('/api/notifications/create'), notificationData, {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Return safe default response
      return { success: false };
    }
  }
};

export default notificationApi;
