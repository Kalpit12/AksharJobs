import axios from 'axios';
import { buildApiUrl } from '../config/api';

const messageApi = {
  // Get all messages for the current user
  getMessages: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/messages/'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/messages/unread-count'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/messages/send'), messageData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(buildApiUrl(`/api/messages/${messageId}/read`), {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Get conversation with another user
  getConversation: async (otherUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl(`/api/messages/conversation/${otherUserId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Mark conversation as read
  markConversationRead: async (otherUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(buildApiUrl(`/api/messages/mark-conversation-read/${otherUserId}`), {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }
};

export default messageApi;
