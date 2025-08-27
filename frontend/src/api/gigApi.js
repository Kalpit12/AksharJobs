import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth header
const createAuthInstance = () => {
    return axios.create({
        baseURL: API_CONFIG.BASE_URL,
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
        }
    });
};

// Gig API functions
export const gigApi = {
    // Create a new gig
    createGig: async (gigData) => {
        try {
            const response = await createAuthInstance().post('/api/gigs', gigData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all gigs with optional filters
    getGigs: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            
            if (filters.category) params.append('category', filters.category);
            if (filters.status) params.append('status', filters.status);
            if (filters.location_type) params.append('location_type', filters.location_type);
            if (filters.max_budget) params.append('max_budget', filters.max_budget);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const response = await axios.get(`${API_CONFIG.BASE_URL}/api/gigs?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get a specific gig by ID
    getGigById: async (gigId) => {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/api/gigs/${gigId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Apply for a gig
    applyForGig: async (gigId, proposal, bidAmount) => {
        try {
            const response = await createAuthInstance().post(`/api/gigs/${gigId}/apply`, {
                proposal,
                bid_amount: bidAmount
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get applications for a gig (only for gig poster)
    getGigApplications: async (gigId) => {
        try {
            const response = await createAuthInstance().get(`/api/gigs/${gigId}/applications`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Accept a gig application
    acceptApplication: async (gigId, applicationId) => {
        try {
            const response = await createAuthInstance().post(`/api/gigs/${gigId}/applications/${applicationId}/accept`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get available gig categories
    getCategories: async (userRole = 'all') => {
        try {
            const params = new URLSearchParams();
            if (userRole && userRole !== 'all') {
                params.append('user_role', userRole);
            }
            
            const response = await axios.get(`${API_CONFIG.BASE_URL}/api/gigs/categories?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get gigs posted by current user
    getMyGigs: async () => {
        try {
            const response = await createAuthInstance().get('/api/gigs/my-gigs');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get applications submitted by current user
    getMyApplications: async () => {
        try {
            const response = await createAuthInstance().get('/api/gigs/my-applications');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default gigApi;
