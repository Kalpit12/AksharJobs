import axios from 'axios';
import { buildApiUrl } from '../config/api';

class CommunityApi {
  /**
   * Get all active communities
   */
  static async getAllCommunities() {
    try {
      const response = await axios.get(buildApiUrl('/api/communities'));
      return response.data;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  }

  /**
   * Get a specific community by ID
   */
  static async getCommunity(communityId) {
    try {
      const response = await axios.get(buildApiUrl(`/api/communities/${communityId}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  }

  /**
   * Get community statistics
   */
  static async getCommunityStats() {
    try {
      const response = await axios.get(buildApiUrl('/api/communities/stats'));
      return response.data;
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw error;
    }
  }

  /**
   * Get members of a specific community
   */
  static async getCommunityMembers(communityId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl(`/api/communities/${communityId}/members`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching community members:', error);
      throw error;
    }
  }

  /**
   * Get jobs posted in a specific community
   */
  static async getCommunityJobs(communityId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl(`/api/communities/${communityId}/jobs`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching community jobs:', error);
      throw error;
    }
  }

  /**
   * Create a new community (Admin only)
   */
  static async createCommunity(communityData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/communities'), communityData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  }

  /**
   * Update user's community preferences
   */
  static async updateUserCommunities(userId, communities, primaryCommunity) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(buildApiUrl(`/api/user/communities/${userId}`), {
        communities,
        primary_community: primaryCommunity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user communities:', error);
      throw error;
    }
  }

  /**
   * Get user's community preferences
   */
  static async getUserCommunities(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl(`/api/user/communities/${userId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user communities:', error);
      throw error;
    }
  }
}

export default CommunityApi;
