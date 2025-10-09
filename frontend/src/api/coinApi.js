import axios from 'axios';

const buildApiUrl = (endpoint) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
  return `${baseUrl}${endpoint}`;
};

const coinApi = {
  // Get user's coin balance
  getBalance: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/coins/balance'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  },

  // Get coin transaction history
  getTransactions: async (limit = 50) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl(`/api/coins/transactions?limit=${limit}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  // Redeem coins for benefits
  redeemCoins: async (userType, redemptionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/coins/redeem'), {
        userType: userType,
        redemptionType: redemptionType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error redeeming coins:', error);
      throw error;
    }
  },

  // Get coin info (rewards and costs)
  getCoinInfo: async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/coins/info'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting coin info:', error);
      throw error;
    }
  },

  // Earn coins (for testing/admin)
  earnCoins: async (amount, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/coins/earn'), {
        amount: amount,
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error earning coins:', error);
      throw error;
    }
  },

  // Spend coins (for custom actions)
  spendCoins: async (amount, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/coins/spend'), {
        amount: amount,
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error spending coins:', error);
      throw error;
    }
  }
};

export default coinApi;

