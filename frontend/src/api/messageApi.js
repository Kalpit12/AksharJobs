import axios from 'axios';
import { buildApiUrl } from '../config/api';

const DEFAULT_HEADERS = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  'Content-Type': 'application/json'
});

const messageApi = {
  // Get all messages for the current user
  getMessages: async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/messages/'), {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Safe default
      return { success: true, messages: [] };
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/messages/unread-count'), {
        headers: DEFAULT_HEADERS(),
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      // Safe default
      return { success: true, unread_count: 0 };
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post(buildApiUrl('/api/messages/send'), messageData, {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false };
    }
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    try {
      const response = await axios.put(buildApiUrl(`/api/messages/${messageId}/read`), {}, {
        headers: DEFAULT_HEADERS(),
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false };
    }
  },

  // Get conversation with another user
  getConversation: async (otherUserId) => {
    try {
      const response = await axios.get(buildApiUrl(`/api/messages/conversation/${otherUserId}`), {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return { success: true, conversation: [] };
    }
  },

  // Mark conversation as read
  markConversationRead: async (otherUserId) => {
    try {
      const response = await axios.put(buildApiUrl(`/api/messages/mark-conversation-read/${otherUserId}`), {}, {
        headers: DEFAULT_HEADERS(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return { success: false };
    }
  }
};

export default messageApi;
