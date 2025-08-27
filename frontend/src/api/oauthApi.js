import { buildApiUrl } from '../config/api';

export const oauthApi = {
  // Get Google OAuth URL
  getGoogleAuthUrl: async () => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/google/auth'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.auth_url;
      } else {
        throw new Error('Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  },

  // Get LinkedIn OAuth URL
  getLinkedInAuthUrl: async () => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/linkedin/auth'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.auth_url;
      } else {
        throw new Error('Failed to get LinkedIn auth URL');
      }
    } catch (error) {
      console.error('Error getting LinkedIn auth URL:', error);
      throw error;
    }
  },

  // Complete OAuth signup
  completeOAuthSignup: async (userInfo, userType) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/oauth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_info: userInfo,
          user_type: userType
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'OAuth signup failed');
      }
    } catch (error) {
      console.error('Error completing OAuth signup:', error);
      throw error;
    }
  },

  // Check OAuth configuration status
  getOAuthStatus: async () => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/oauth/status'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to get OAuth status');
      }
    } catch (error) {
      console.error('Error getting OAuth status:', error);
      throw error;
    }
  }
};
