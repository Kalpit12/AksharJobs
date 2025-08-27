// API Configuration for RocketJobs Frontend
const API_CONFIG = {
  // Backend base URL - change this based on your backend port
  BASE_URL: 'http://localhost:3002',
  // Frontend URL - for internal redirects
  FRONTEND_URL: 'http://localhost:3003',
  
  // Authentication endpoints
  AUTH_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    GET_USER: '/api/auth/get_user'
  },
  
  // Job endpoints
  JOB_ENDPOINTS: {
    GET_ALL_JOBS: '/api/jobs',
    GET_JOB_BY_ID: '/api/jobs',
    CREATE_JOB: '/api/jobs',
    UPDATE_JOB: '/api/jobs',
    DELETE_JOB: '/api/jobs'
  },
  
  // Resume endpoints
  RESUME_ENDPOINTS: {
    UPLOAD_RESUME: '/api/resumes/upload',
    GET_RESUME: '/api/resumes',
    UPDATE_RESUME: '/api/resumes',
    DELETE_RESUME: '/api/resumes'
  },
  
  // Application endpoints
  APPLICATION_ENDPOINTS: {
    APPLY_TO_JOB: '/api/applications',
    GET_APPLICATIONS: '/api/applications',
    UPDATE_APPLICATION: '/api/applications'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make authenticated API calls
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (response.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      console.warn('Authentication failed - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userFirstName');
      localStorage.removeItem('userLastName');
      
      // Show user-friendly message
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        // Only redirect if not already on login page
        window.location.href = '/login?message=session_expired';
      }
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_CONFIG;
