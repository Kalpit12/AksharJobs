import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faBriefcase, 
  faGraduationCap, 
  faCalendar, 
  faStar, 
  faDownload, 
  faEye, 
  faCheck, 
  faTimes, 
  faComments,
  faClock,
  faFilter,
  faSearch,
  faChevronDown,
  faChevronUp,
  faBuilding,
  faDollarSign,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import axios from 'axios';
import '../styles/RecruiterCandidateTracker.css';
import ThemedLoadingSpinner from './ThemedLoadingSpinner';

const RecruiterCandidateTracker = ({ onViewCandidate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch applications from the recruiter applications endpoint
      const response = await axios.get(
        buildApiUrl('/api/recruiters/applications'),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('📊 Fetched applications:', response.data);
      setApplications(response.data || []);
      
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offered: applications.filter(app => app.status === 'offered').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    setStats(newStats);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'ai_screening': return '#06b6d4';
      case 'reviewing': return '#3b82f6';
      case 'shortlisted': return '#8b5cf6';
      case 'interview': return '#8b5cf6';
      case 'offered': return '#10b981';
      case 'hired': return '#059669';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return faClock;
      case 'ai_screening': return faComments;
      case 'reviewing': return faEye;
      case 'shortlisted': return faStar;
      case 'interview': return faComments;
      case 'offered': return faCheck;
      case 'hired': return faCheckCircle;
      case 'rejected': return faTimes;
      default: return faClock;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewCandidate = (application) => {
    if (onViewCandidate) {
      onViewCandidate(
        application.applicant_id || application.userId,
        application.job_id || application.jobId
      );
    }
  };

  const toggleExpand = (applicationId) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId);
  };

  const updateApplicationStatus = async (application, newStatus) => {
    try {
      setUpdatingStatus(application._id);
      const token = localStorage.getItem('token');
      
      // Call the backend API to update the application status
      const response = await axios.put(
        buildApiUrl(`/api/recruiters/applications/${application._id}/status`),
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Update the local state
        setApplications(prev => prev.map(app => 
          app._id === application._id 
            ? { 
                ...app, 
                status: newStatus, 
                status_display: newStatus.replace('_', ' ').charAt(0).toUpperCase() + newStatus.slice(1).replace('_', ' '),
                last_updated: new Date().toISOString()
              }
            : app
        ));
        
        alert(`Status updated to ${newStatus.replace('_', ' ')} successfully! The candidate will be notified by email.`);
        
        // Refresh applications to get the latest data including tracking history
        fetchApplications();
      } else {
        throw new Error('Failed to update status');
      }
      
    } catch (err) {
      console.error('Error updating status:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update status. Please try again.';
      alert(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.job_title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.company_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <ThemedLoadingSpinner 
        theme="recruiter"
        size="large"
        text="Loading candidate applications..."
        subText="Preparing your candidate tracker"
        showIcon={true}
        fullScreen={false}
      />
    );
  }

  if (error) {
    return (
      <div className="tracker-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={fetchApplications} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="recruiter-candidate-tracker">
      {/* Header */}
      <div className="tracker-header">
        <div className="tracker-title-section">
          <h1>
            <i className="fas fa-users"></i> Candidate Tracker
          </h1>
          <p>Track and manage all job applications from candidates</p>
        </div>
        <button onClick={fetchApplications} className="btn btn-secondary">
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="tracker-stats">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        <div className="stat-card reviewing">
          <div className="stat-icon">
            <i className="fas fa-eye"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.reviewing}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
        <div className="stat-card interview">
          <div className="stat-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.interview}</div>
            <div className="stat-label">Interview Stage</div>
          </div>
        </div>
        <div className="stat-card offered">
          <div className="stat-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.offered}</div>
            <div className="stat-label">Offers Extended</div>
          </div>
        </div>
        <div className="stat-card hired">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.hired}</div>
            <div className="stat-label">Hired</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="tracker-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by candidate name, job title, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <i className="fas fa-filter"></i>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="ai_screening">AI Screening</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="offered">Offered</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-list">
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No applications found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No candidates have applied to your job postings yet'}
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-main">
                <div className="candidate-info">
                  <div className="candidate-avatar">
                    {(application.applicant_name || application.candidate_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="candidate-details">
                    <h3>{application.applicant_name || application.candidate_name || 'Unknown Candidate'}</h3>
                    <div className="candidate-meta">
                      <span>
                        <FontAwesomeIcon icon={faEnvelope} />
                        {application.applicant_email || 'No email'}
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faBriefcase} />
                        Applied for: <strong>{application.job_title || 'N/A'}</strong>
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faBuilding} />
                        {application.company_name || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="application-stats">
                  <div className="application-date">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatDate(application.applied_at || application.created_at)}</span>
                  </div>

                  <div className="application-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(application.status) }}
                    >
                      <FontAwesomeIcon icon={getStatusIcon(application.status)} />
                      {application.status_display || application.status || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="application-actions">
                  <button
                    onClick={() => handleViewCandidate(application)}
                    className="btn btn-primary"
                  >
                    <FontAwesomeIcon icon={faEye} /> View Details
                  </button>
                  <button
                    onClick={() => toggleExpand(application._id)}
                    className="btn btn-secondary"
                  >
                    <FontAwesomeIcon icon={expandedApplication === application._id ? faChevronUp : faChevronDown} />
                    {expandedApplication === application._id ? 'Less' : 'More'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedApplication === application._id && (
                <div className="application-expanded">
                  {/* Quick Status Actions */}
                  <div className="expanded-section">
                    <h4><FontAwesomeIcon icon={faCheck} /> Quick Actions</h4>
                    <div className="quick-actions-grid">
                      <button
                        className="quick-action-btn reviewing"
                        onClick={() => updateApplicationStatus(application, 'reviewing')}
                        disabled={updatingStatus === application._id || application.status === 'reviewing'}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        Start Review
                      </button>
                      <button
                        className="quick-action-btn shortlisted"
                        onClick={() => updateApplicationStatus(application, 'shortlisted')}
                        disabled={updatingStatus === application._id || application.status === 'shortlisted'}
                      >
                        <FontAwesomeIcon icon={faStar} />
                        Shortlist
                      </button>
                      <button
                        className="quick-action-btn interview"
                        onClick={() => updateApplicationStatus(application, 'interview')}
                        disabled={updatingStatus === application._id || application.status === 'interview'}
                      >
                        <FontAwesomeIcon icon={faComments} />
                        Schedule Interview
                      </button>
                      <button
                        className="quick-action-btn offered"
                        onClick={() => updateApplicationStatus(application, 'offered')}
                        disabled={updatingStatus === application._id || application.status === 'offered'}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        Send Offer
                      </button>
                      <button
                        className="quick-action-btn hired"
                        onClick={() => updateApplicationStatus(application, 'hired')}
                        disabled={updatingStatus === application._id || application.status === 'hired'}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Mark as Hired
                      </button>
                      <button
                        className="quick-action-btn rejected"
                        onClick={() => updateApplicationStatus(application, 'rejected')}
                        disabled={updatingStatus === application._id || application.status === 'rejected'}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Reject
                      </button>
                    </div>
                    {updatingStatus === application._id && (
                      <div className="updating-status">
                        <i className="fas fa-spinner fa-spin"></i> Updating status and sending notification...
                      </div>
                    )}
                  </div>

                  {application.cover_letter && (
                    <div className="expanded-section">
                      <h4><FontAwesomeIcon icon={faComments} /> Cover Letter</h4>
                      <p className="cover-letter">{application.cover_letter}</p>
                    </div>
                  )}

                  {application.tracking_history && application.tracking_history.length > 0 && (
                    <div className="expanded-section">
                      <h4><FontAwesomeIcon icon={faClock} /> Application Timeline</h4>
                      <div className="timeline">
                        {application.tracking_history.map((record, index) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <strong>{record.status || 'Status Update'}</strong>
                              <p>{formatDate(record.created_at || record.timestamp)}</p>
                              {record.notes && <p className="timeline-notes">{record.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecruiterCandidateTracker;

