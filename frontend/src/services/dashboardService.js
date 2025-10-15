import { buildApiUrl } from '../config/api';

class DashboardService {
  constructor() {
    this.baseURL = buildApiUrl('/api');
  }

  // Get authentication headers
  getHeaders() {
    const token = localStorage.getItem('token');
    console.log('Getting headers with token:', token ? 'Token exists' : 'No token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Job Seeker Dashboard APIs
  async getJobSeekerStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/jobseeker/stats?userId=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job seeker stats:', error);
      throw error;
    }
  }

  async getJobSeekerApplications() {
    try {
      const response = await fetch(`${this.baseURL}/applications/my-applications`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getJobSeekerJobs() {
    try {
      const response = await fetch(`${this.baseURL}/jobs/get_jobs`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJobSeekerProfile() {
    try {
      console.log('Fetching profile from:', `${this.baseURL}/profile`);
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile fetch error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Profile data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async getProfileViews() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/profile/views`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile views:', error);
      throw error;
    }
  }

  async getNetworkActivity() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/network/activity`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching network activity:', error);
      throw error;
    }
  }

  async getPortfolioItems() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/portfolio/items`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      throw error;
    }
  }

  async getRecommendationRequests() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/recommendations/requests`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendation requests:', error);
      throw error;
    }
  }

  // Recruiter Dashboard APIs
  async getRecruiterStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/recruiter/stats?userId=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recruiter stats:', error);
      throw error;
    }
  }

  async getRecruiterJobs(userId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/get_jobs_for_user?userId=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
      throw error;
    }
  }

  async getRecruiterCandidates() {
    try {
      const response = await fetch(`${this.baseURL}/tracker/recruiter/candidates`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  async getRecruiterApplications() {
    try {
      const response = await fetch(`${this.baseURL}/tracker/recruiter/applications`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recruiter applications:', error);
      throw error;
    }
  }

  // Intern Dashboard APIs
  async getInternStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/intern/stats?userId=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching intern stats:', error);
      throw error;
    }
  }

  async getInternships() {
    try {
      const response = await fetch(`${this.baseURL}/internships`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  }

  async getInternApplications() {
    try {
      const response = await fetch(`${this.baseURL}/applications/intern-applications`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching intern applications:', error);
      throw error;
    }
  }

  // Application actions
  async applyForJob(jobId, applicationData) {
    try {
      const response = await fetch(`${this.baseURL}/applications/apply`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          job_id: jobId,
          ...applicationData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }

  async saveJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/save`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ job_id: jobId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  async unsaveJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/unsave`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ job_id: jobId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  }

  // Utility methods
  async getSavedJobs() {
    try {
      const response = await fetch(`${this.baseURL}/jobs/saved`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  }

  async getRecommendedJobs() {
    try {
      const response = await fetch(`${this.baseURL}/jobs/recommended`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      throw error;
    }
  }

  async getInterviews() {
    try {
      const response = await fetch(`${this.baseURL}/interviews`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
