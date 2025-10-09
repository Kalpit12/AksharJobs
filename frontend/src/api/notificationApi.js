import axios from 'axios';
import { buildApiUrl } from '../config/api';

const notificationApi = {
  // Get all notifications for the current user
  getNotifications: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/notifications/'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/notifications/unread-count'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(buildApiUrl(`/api/notifications/${notificationId}/read`), {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(buildApiUrl('/api/notifications/mark-all-read'), {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Clear all notifications
  clearAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(buildApiUrl('/api/notifications/clear-all'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  },

  // Create a notification (for testing)
  createNotification: async (notificationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/notifications/create'), notificationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

export default notificationApi;
