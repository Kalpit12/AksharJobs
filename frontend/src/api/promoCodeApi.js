import axios from 'axios';
import { buildApiUrl } from '../config/api';

const promoCodeApi = {
  // Get user's promo code
  getMyPromoCode: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/promo/get_my_promo_code'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promo code:', error);
      throw error;
    }
  },

  // Create promo code for user
  createPromoCode: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/promo/create_promo_code'), userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating promo code:', error);
      throw error;
    }
  },

  // Use a promo code
  usePromoCode: async (code, userType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/promo/use_promo_code'), {
        code: code,
        userType: userType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error using promo code:', error);
      throw error;
    }
  },

  // Validate a promo code
  validatePromoCode: async (code) => {
    try {
      const response = await axios.post(buildApiUrl('/api/promo/validate_promo_code'), {
        code: code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error validating promo code:', error);
      throw error;
    }
  },

  // Check user credits
  checkCredits: async (userType, actionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/promo/check_credits'), {
        userType: userType,
        actionType: actionType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking credits:', error);
      throw error;
    }
  },

  // Consume a credit
  consumeCredit: async (userType, actionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(buildApiUrl('/api/promo/consume_credit'), {
        userType: userType,
        actionType: actionType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error consuming credit:', error);
      throw error;
    }
  }
};

export default promoCodeApi;
