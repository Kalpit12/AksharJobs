import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configure axios with auth header
const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/analytics`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsApi = {
  // Match Score Thresholds
  getMatchThresholds: async (jobId) => {
    try {
      const response = await api.get('/match-thresholds');
      return response.data;
    } catch (error) {
      console.error('Error fetching match thresholds:', error);
      throw error;
    }
  },

  setMatchThresholds: async (jobId, minThreshold, autoRejectThreshold) => {
    try {
      const response = await api.post('/match-thresholds', {
        job_id: jobId,
        min_threshold: minThreshold,
        auto_reject_threshold: autoRejectThreshold
      });
      return response.data;
    } catch (error) {
      console.error('Error setting match thresholds:', error);
      throw error;
    }
  },

  // Skills Gap Analysis
  getSkillsGapAnalysis: async (jobId) => {
    try {
      const response = await api.get(`/skills-gap-analysis?job_id=${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skills gap analysis:', error);
      throw error;
    }
  },

  // Matching History
  getMatchingHistory: async (days = 30) => {
    try {
      const response = await api.get(`/matching-history?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching matching history:', error);
      throw error;
    }
  },

  // Competitor Analysis
  getCompetitorAnalysis: async (jobTitle, location, industry) => {
    try {
      const response = await api.get('/competitor-analysis', {
        params: {
          job_title: jobTitle,
          location: location,
          industry: industry
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      throw error;
    }
  },

  // Candidate Recommendations
  getCandidateRecommendations: async (jobId, minThreshold) => {
    try {
      const response = await api.get(`/candidate-recommendations?job_id=${jobId}&min_threshold=${minThreshold}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate recommendations:', error);
      throw error;
    }
  },

  // Job Performance Metrics
  getJobPerformance: async (jobId) => {
    try {
      const response = await api.get(`/job-performance?job_id=${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job performance:', error);
      throw error;
    }
  },

  // Dashboard Summary
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/dashboard-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};
