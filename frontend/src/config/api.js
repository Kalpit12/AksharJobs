// API Configuration for AksharJobs Frontend - Network Agnostic
const API_CONFIG = {
  // Dynamic backend detection - Global accessibility
  get BASE_URL() {
    // Try to detect backend automatically
    if (typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      
      // For development, use the backend port 3002
      if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return 'http://localhost:3002';
      }
      
      // Use relative path for production (Nginx proxy)
      return '';
    }
    // Fallback for SSR - use localhost for development
    return 'http://localhost:3002';
  },
  
  // Frontend URL - for internal redirects
  get FRONTEND_URL() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3003';
  },
  
  // Network detection helper
  get isLocalNetwork() {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.');
    }
    return false;
  },
  
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

// Helper function to build full API URLs with network detection
export const buildApiUrl = (endpoint = '') => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullUrl = `${baseUrl}${endpoint}`;
  
  // Log URL construction for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔗 Building API URL: ${fullUrl}`);
    console.log(`🌐 Base URL: ${baseUrl}`);
    console.log(`📱 Current Host: ${typeof window !== 'undefined' ? window.location.hostname : 'SSR'}`);
  }
  
  return fullUrl;
};

// Helper function to make authenticated API calls with network resilience
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
    
    // Network error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('🌐 Network error detected. This might be due to:');
      console.error('   - WiFi network change');
      console.error('   - Backend server not running');
      console.error('   - Firewall blocking connection');
      console.error('   - Backend running on different IP');
      
      // Try to reconnect or show helpful message
      if (typeof window !== 'undefined') {
        // Show network error notification
        const event = new CustomEvent('networkError', {
          detail: {
            message: 'Network connection issue detected. Please check your connection and try again.',
            error: error.message
          }
        });
        window.dispatchEvent(event);
      }
    }
    
    throw error;
  }
};

// Network status monitoring
export const monitorNetworkStatus = () => {
  if (typeof window === 'undefined') return;
  
  let isOnline = navigator.onLine;
  
  const updateNetworkStatus = () => {
    const wasOnline = isOnline;
    isOnline = navigator.onLine;
    
    if (wasOnline !== isOnline) {
      const event = new CustomEvent('networkStatusChange', {
        detail: { isOnline, timestamp: new Date().toISOString() }
      });
      window.dispatchEvent(event);
      
      if (isOnline) {
        console.log('✅ Network connection restored');
      } else {
        console.log('❌ Network connection lost');
      }
    }
  };
  
  // Listen for network changes
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
  };
};

export default API_CONFIG;
