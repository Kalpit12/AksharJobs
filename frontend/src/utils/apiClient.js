import API_CONFIG from '../config/api.js';

// Centralized API client utility
export const apiClient = {
  // GET request
  get: async (endpoint, config = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
      return response;
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data = {}, config = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(data),
        ...config
      });
      return response;
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}, config = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(data),
        ...config
      });
      return response;
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint, config = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
      return response;
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error);
      throw error;
    }
  },

  // File upload (POST with FormData)
  upload: async (endpoint, formData, config = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...config.headers
        },
        body: formData,
        ...config
      });
      return response;
    } catch (error) {
      console.error(`Upload request failed for ${url}:`, error);
      throw error;
    }
  }
};

// Axios-like API client for components that prefer axios syntax
export const axiosClient = {
  get: async (endpoint, config = {}) => {
    const response = await apiClient.get(endpoint, config);
    return { data: await response.json(), status: response.status };
  },

  post: async (endpoint, data = {}, config = {}) => {
    const response = await apiClient.post(endpoint, data, config);
    return { data: await response.json(), status: response.status };
  },

  put: async (endpoint, data = {}, config = {}) => {
    const response = await apiClient.put(endpoint, data, config);
    return { data: await response.json(), status: response.status };
  },

  delete: async (endpoint, config = {}) => {
    const response = await apiClient.delete(endpoint, config);
    return { data: await response.json(), status: response.status };
  }
};

export default apiClient;
