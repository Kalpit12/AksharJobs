import axios from 'axios';
import { buildApiUrl } from '../config/api.js';

class ApiService {
  constructor() {
    this.baseURL = buildApiUrl('');
    this.timeout = 10000;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
    this.retryDelay = 1000;
    
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Add authentication token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        // Log successful requests
        if (process.env.NODE_ENV === 'development') {
          const duration = new Date() - response.config.metadata.startTime;
          console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        }
        
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Log errors
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} ${error.response?.status || 'Network Error'}`);
        }
        
        // Handle 401 errors (unauthorized) and 422 errors (malformed JWT token)
        if (error.response?.status === 401 || error.response?.status === 422) {
          console.warn(`🔐 Authentication error (${error.response.status}). Clearing session and redirecting to login...`);
          // Clear all authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userFirstName');
          localStorage.removeItem('userLastName');
          
          // Redirect to login with message
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?message=session_expired';
          }
          return Promise.reject(error);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async makeRequest(method, endpoint, data = null, options = {}) {
    const url = buildApiUrl(endpoint);

    try {
      const config = {
        method,
        url,
        timeout: this.timeout,
        ...options
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await axios(config);
      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Generic HTTP methods
  async get(endpoint, params = null) {
    return this.makeRequest('GET', endpoint, params);
  }

  async post(endpoint, data) {
    return this.makeRequest('POST', endpoint, data);
  }

  async put(endpoint, data) {
    return this.makeRequest('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return this.makeRequest('DELETE', endpoint);
  }

  // Specific API methods
  async getJobs() {
    try {
      const response = await this.get('/api/jobs/get_jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJobById(jobId) {
    try {
      const response = await this.get(`/api/jobs/get_job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }

  async getApplications(jobId) {
    try {
      // Use the new endpoint that returns all applications
      const response = await this.get(`/api/applications/all`);
      const allApplications = response.data.applications || [];
      // Filter applications for the specific job
      const jobApplications = allApplications.filter(app => app.job_id === jobId);
      return { applications: jobApplications };
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getStatusOptions() {
    try {
      const response = await this.get('/api/application-tracker/tracker/status-options');
      return response.data;
    } catch (error) {
      console.error('Error fetching status options:', error);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await this.put(`/api/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  async createJob(jobData) {
    try {
      const response = await this.post('/api/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJob(jobId, jobData) {
    try {
      const response = await this.put(`/api/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(jobId) {
    try {
      const response = await this.delete(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;