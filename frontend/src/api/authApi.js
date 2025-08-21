// Authentication API endpoints
export const authApi = {
  // Sign up
  signup: async (userData) => {
    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login
  login: async (credentials) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Get user info
  getUser: async (userId) => {
    const response = await fetch(`http://localhost:5000/api/auth/get_user?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Logout
  logout: async () => {
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};
