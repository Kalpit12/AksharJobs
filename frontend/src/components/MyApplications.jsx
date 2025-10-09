import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view your applications');
      }

      const response = await fetch(buildApiUrl('/api/applications/my-applications'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'reviewed':
        return '#3b82f6';
      case 'shortlisted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'accepted':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'reviewed':
        return '👀';
      case 'shortlisted':
        return '⭐';
      case 'rejected':
        return '❌';
      case 'accepted':
        return '✅';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="applications-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchApplications} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="applications-container">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No Applications Yet</h2>
          <p>You haven't applied for any jobs yet. Start exploring opportunities and submit your first application!</p>
          <button onClick={() => window.location.href = '/jobs'} className="explore-jobs-btn">
            Explore Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2>📋 My Job Applications</h2>
        <p>Track the status of all your job applications in one place</p>
      </div>

      <div className="applications-stats">
        <div className="stat-card">
          <div className="stat-number">{applications.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'shortlisted').length}
          </div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {applications.filter(app => app.status === 'accepted').length}
          </div>
          <div className="stat-label">Accepted</div>
        </div>
      </div>

      <div className="applications-list">
        {applications.map((application) => (
          <div key={application._id} className="application-card">
            <div className="application-header">
              <div className="job-info">
                <h3 className="job-title">{application.job_title}</h3>
                <p className="company-name">{application.company_name}</p>
              </div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(application.status) }}
              >
                <span className="status-icon">{getStatusIcon(application.status)}</span>
                <span className="status-text">{application.status}</span>
              </div>
            </div>

            <div className="application-details">
              <div className="detail-item">
                <span className="detail-label">Applied:</span>
                <span className="detail-value">{formatDate(application.applied_at)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Application ID:</span>
                <span className="detail-value">{application._id}</span>
              </div>
            </div>

            <div className="application-actions">
              <button className="view-job-btn">
                View Job Details
              </button>
              <button className="withdraw-btn">
                Withdraw Application
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="applications-footer">
        <p>💡 <strong>Tip:</strong> Keep your applications updated and follow up with recruiters for better chances of success!</p>
      </div>
    </div>
  );
};

export default MyApplications;
