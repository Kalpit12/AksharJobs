import React, { useState, useEffect } from "react";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import "../styles/ApplicationTracker.css";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Helper function to safely convert values to strings
  const safeString = (value) => {
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'string') return value.trim() || 'Not specified';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Not specified';
      return value.map(item => safeString(item)).filter(item => item !== 'Not specified').join(', ') || 'Not specified';
    }
    if (typeof value === 'object') {
      try {
        const stringValues = Object.values(value)
          .filter(v => v !== null && v !== undefined)
          .map(v => safeString(v))
          .filter(v => v !== 'Not specified');
        return stringValues.length > 0 ? stringValues.join(', ') : 'Not specified';
      } catch (error) {
        return 'Not specified';
      }
    }
    return 'Not specified';
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const jobsResponse = await axios.get(buildApiUrl(`/api/jobs/jobs_by_user/${userId}`));
      const jobs = jobsResponse.data;
      let allApplications = [];

      for (const job of jobs) {
        // Use the new endpoint that doesn't require authentication
        const allAppsResponse = await axios.get(buildApiUrl('/api/applications/all'));
        const allApps = allAppsResponse.data.applications || [];
        const jobApplications = allApps.filter(app => app.job_id === job._id);
        const enrichedApplications = await Promise.all(
          jobApplications.map(async (application) => {
            try {
              const userResponse = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${application.userId}`));
              const jobResponse = await axios.get(buildApiUrl(`/api/jobs/get_job/${application.jobId}`));
              
              if (userResponse.data && typeof userResponse.data === 'object' && Object.keys(userResponse.data).length > 0) {
                return { 
                  ...application, 
                  ...userResponse.data, 
                  jobTitle: jobResponse.data.job_title,
                  jobId: job._id
                };
              } else {
                return application;
              }
            } catch (error) {
              console.error('Error fetching user or job data:', error);
              return application;
            }
          })
        );

        allApplications = [...allApplications, ...enrichedApplications.filter(Boolean)];
      }

      const sortedApplications = allApplications
        .filter((app) => app && typeof app === 'object' && app.status && app.status !== "" && app.userId)
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
      
      setApplications(sortedApplications);
    } catch (err) {
      setError("Failed to fetch applications");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, jobId, status, interviewDate, interviewMode) => {
    try {
      await axios.put(buildApiUrl("/api/applications/update_status"), { 
        userId, 
        jobId, 
        status, 
        interviewDate, 
        interviewMode 
      });
      
      setApplications((prev) =>
        prev.map((app) => 
          app.userId === userId && app.jobId === jobId 
            ? { ...app, status, interviewDate, interviewMode } 
            : app
        )
      );
    } catch (err) {
      alert("Failed to update status");
      console.error("Error updating status:", err);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "appliedDate":
        return new Date(b.appliedDate || b.created_at) - new Date(a.appliedDate || a.created_at);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      case "matchScore":
        return (b.final_score || 0) - (a.final_score || 0);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "reviewed":
        return "#3b82f6";
      case "shortlisted":
        return "#8b5cf6";
      case "interviewed":
        return "#06b6d4";
      case "accepted":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "reviewed":
        return "👀";
      case "shortlisted":
        return "⭐";
      case "interviewed":
        return "🎤";
      case "accepted":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📝";
    }
  };

  if (loading) {
    return (
      <div className="application-tracker-loading">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-tracker-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchApplications} className="retry-btn">Try Again</button>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: applications.length,
    inReview: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    toInterview: applications.filter(app => app.status === 'reviewed').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    selected: applications.filter(app => app.status === 'accepted').length,
    hired: applications.filter(app => app.status === 'hired').length
  };

  return (
    <div className="application-tracker">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-content">
          <div className="header-icon">SJ</div>
          <h1>Candidate Tracker</h1>
          <p>Manage applications for your company</p>
          <div className="live-updates">
            <span className="live-indicator"></span>
            Live Updates
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">TOTAL APPLICANTS</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👁️⏰</div>
          <div className="stat-number">{stats.inReview}</div>
          <div className="stat-label">IN REVIEW</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋✅</div>
          <div className="stat-number">{stats.shortlisted}</div>
          <div className="stat-label">SHORTLISTED</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤ℹ️</div>
          <div className="stat-number">{stats.toInterview}</div>
          <div className="stat-label">TO INTERVIEW</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤✅</div>
          <div className="stat-number">{stats.interviewed}</div>
          <div className="stat-label">INTERVIEWED</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤❌</div>
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">REJECTED</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{stats.selected}</div>
          <div className="stat-label">SELECTED</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤💼</div>
          <div className="stat-number">{stats.hired}</div>
          <div className="stat-label">HIRED</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="tracker-filters">
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search applications by candidate name, job title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="appliedDate">Applied Date</option>
              <option value="name">Candidate Name</option>
              <option value="status">Status</option>
              <option value="matchScore">Match Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-list">
        {sortedApplications.length === 0 ? (
          <div className="no-applications">
            <div className="no-applications-icon">📝</div>
            <h3>No applications found</h3>
            <p>Try adjusting your search criteria or check back later for new applications.</p>
          </div>
        ) : (
          sortedApplications.map((application, index) => (
            <div key={application.id || index} className="application-card">
              <div className="application-header">
                <div className="candidate-info">
                  <div className="candidate-avatar">
                    <img 
                      src={application.avatar || '/default-avatar.png'} 
                      alt={application.name}
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className="candidate-details">
                    <h3>{safeString(application.name) || 'Unknown Candidate'}</h3>
                    <p className="job-title">{safeString(application.jobTitle) || 'Unknown Position'}</p>
                    <p className="applied-date">
                      Applied: {new Date(application.appliedDate || application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="application-status">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                  >
                    <span className="status-icon">{getStatusIcon(application.status)}</span>
                    <span className="status-text">{safeString(application.status) || 'Unknown'}</span>
                  </div>
                  
                  {application.final_score && (
                    <div className="match-score">
                      <span className="score-label">Match:</span>
                      <span className="score-value">{application.final_score}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="application-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{safeString(application.experience)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Skills:</span>
                    <span className="detail-value">{safeString(application.skills)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Education:</span>
                    <span className="detail-value">{safeString(application.education)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{safeString(application.location)}</span>
                  </div>
                </div>
              </div>

              <div className="application-actions">
                <div className="status-actions">
                  <select
                    value={application.status || ''}
                    onChange={(e) => updateStatus(application.userId, application.jobId, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => setSelectedApplication(application)}
                  >
                    View Details
                  </button>
                  
                  <button 
                    className="action-btn contact-btn"
                    onClick={() => {/* Handle contact */}}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="application-modal-overlay">
          <div className="application-modal">
            <div className="modal-header">
              <h2>Application Details</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="application-profile">
                <div className="profile-header">
                  <img 
                    src={selectedApplication.avatar || '/default-avatar.png'} 
                    alt={selectedApplication.name}
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h3>{selectedApplication.name}</h3>
                    <p>{selectedApplication.jobTitle}</p>
                    <p>Applied: {new Date(selectedApplication.appliedDate || selectedApplication.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="profile-details">
                  <div className="detail-section">
                    <h4>Experience</h4>
                    <p>{selectedApplication.experience || 'Not specified'}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Skills</h4>
                    <p>{selectedApplication.skills || 'Not specified'}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Education</h4>
                    <p>{selectedApplication.education || 'Not specified'}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Cover Letter</h4>
                    <p>{selectedApplication.coverLetter || 'No cover letter provided'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="action-btn contact-btn"
                onClick={() => {/* Handle contact */}}
              >
                Contact Candidate
              </button>
              <button 
                className="action-btn close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
