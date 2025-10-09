import React, { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faClock, 
  faCheckCircle, 
  faTimesCircle, 
  faEye,
  faEnvelope,
  faCalendar,
  faMapMarkerAlt,
  faBuilding,
  faUser,
  faChartLine,
  faBell,
  faRefresh,
  faRocket,
  faPhone,
  faStar,
  faUserTie,
  faGraduationCap,
  faBriefcase,
  faChevronDown,
  faChevronUp,
  faEllipsisV,
  faDownload,
  faShare,
  faEdit,
  faTrash,
  faPlus,
  faMinus,
  faCheck,
  faTimes,
  faPause,
  faPlay,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';


import "../styles/ModernApplicationTracker.css";

const ModernApplicationTracker = () => {
  // Authentication context
  const { user, isAuthenticated, isJobSeeker, isRecruiter } = useAuth();
  
  // Convert functions to boolean values
  const isJobSeekerUser = isJobSeeker();
  const isRecruiterUser = isRecruiter();
  
  // State management for applications and UI
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Bulk selection and actions (only for recruiters)
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [expandedCandidate, setExpandedCandidate] = useState(null);

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
  
  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Available jobs for filtering (only for recruiters)
  const [availableJobs, setAvailableJobs] = useState([]);

  /**
   * Fetch applications based on user role
   * - Job Seekers: Fetch their own applications
   * - Recruiters: Fetch applications for their posted jobs
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, isJobSeekerUser, isRecruiterUser]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchApplications();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      
      if (isJobSeekerUser) {
        // Fetch job seeker's own applications
        await fetchJobSeekerApplications(userId);
      } else if (isRecruiterUser) {
        // Fetch recruiter's job applications
        await fetchRecruiterApplications(userId);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch applications for job seekers
   */
  const fetchJobSeekerApplications = async (userId) => {
    try {
      const response = await axios.get(buildApiUrl('/api/applications/my-applications'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const applications = response.data || [];
      
      // Process applications without trying to fetch job details (to avoid 404 errors)
      const enrichedApplications = applications.map((app, index) => {
        // Always use application data directly - no job details fetching
        return {
          ...app,
          jobTitle: app.job_title || 'Unknown Job',
          companyName: app.company_name || 'Unknown Company',
          location: app.location || 'N/A',
          jobType: app.job_type || 'N/A',
          salaryRange: app.salary_range || 'N/A',
          appliedDate: app.applied_at || app.createdAt,
          userId: userId,
          jobId: app.job_id || app.jobId || null,
          // Map backend status to frontend status
          status: mapStatusFromBackend(app.status),
          // Use real AI-generated scores from backend
          final_score: app.final_score || app.matchScore || app.gemini_match_score || 0,
          education_score: app.education_score || app.education_match || 0,
          skill_score: app.skill_score || app.skills_match || 0,
          experience_score: app.experience_score || app.experience_match || 0,
          // Add unique identifier for React keys
          uniqueKey: `app-${app._id}-${index}`
        };
      });
      
      // Deduplicate applications based on userId + jobId
      const uniqueApplications = enrichedApplications.reduce((acc, app) => {
        if (!app || !app.status || app.status === "") {
          return acc;
        }
        
        const uniqueKey = `${app.userId}-${app.jobId}`;
        if (!acc.has(uniqueKey)) {
          acc.set(uniqueKey, app);
        }
        
        return acc;
      }, new Map());
      
      const sortedApplications = Array.from(uniqueApplications.values())
        .sort((a, b) => {
          const dateA = new Date(a.appliedDate || a.createdAt);
          const dateB = new Date(b.appliedDate || b.createdAt);
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
      
      setCandidates(sortedApplications);
      calculateStatistics(sortedApplications);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching job seeker applications:', err);
      setError("Failed to fetch your applications. Please try again.");
    }
  };

  /**
   * Fetch applications for recruiters
   */
  const fetchRecruiterApplications = async (userId) => {
    try {
      // Fetch all jobs posted by the recruiter
      const jobsResponse = await axios.get(buildApiUrl(`/api/jobs/jobs_by_user/${userId}`));
      const jobs = jobsResponse.data;
      setAvailableJobs(jobs);
      
      let allCandidates = [];

      // Fetch applications for each job
      for (const job of jobs) {
        // Use the new endpoint that doesn't require authentication
        const allAppsResponse = await axios.get(buildApiUrl('/api/applications/all'));
        const allApps = allAppsResponse.data.applications || [];
        const applications = allApps.filter(app => app.job_id === job._id);
        
        // Enrich candidate data with user and job information
        const enrichedCandidates = await Promise.all(
          applications.map(async (candidate) => {
            try {
              const userResponse = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${candidate.applicant_id}`));
              const jobResponse = await axios.get(buildApiUrl(`/api/jobs/get_job/${candidate.job_id}`));
              
              if (userResponse.data && typeof userResponse.data === 'object' && Object.keys(userResponse.data).length > 0 &&
                  jobResponse.data && typeof jobResponse.data === 'object' && Object.keys(jobResponse.data).length > 0) {
                const enrichedCandidate = { 
                  ...candidate, 
                  ...userResponse.data, 
                  jobTitle: jobResponse.data.job_title,
                  jobId: job._id,
                  userId: candidate.applicant_id, // Use applicant_id from backend
                  appliedDate: candidate.applied_at || candidate.createdAt,
                  // Map backend status to frontend status
                  status: mapStatusFromBackend(candidate.status)
                };
                console.log('🔍 Enriched candidate data:', enrichedCandidate);
                return enrichedCandidate;
              } else {
                return {
                  ...candidate,
                  // Map backend status to frontend status even if user/job data fetch fails
                  status: mapStatusFromBackend(candidate.status)
                };
              }
            } catch (error) {
              console.error('Error fetching user or job data for candidate:', candidate.applicant_id, error);
              return {
                ...candidate,
                // Map backend status to frontend status even if user/job data fetch fails
                status: mapStatusFromBackend(candidate.status)
              };
            }
          })
        );

        allCandidates = [...allCandidates, ...enrichedCandidates.filter(Boolean)];
      }

      // Filter, deduplicate, and sort candidates
      const uniqueCandidates = allCandidates.reduce((acc, candidate) => {
        if (!candidate || typeof candidate !== 'object' || !candidate.status || candidate.status === "" || !candidate.userId) {
          return acc;
        }
        
        // Create a unique key for deduplication (userId + jobId)
        const uniqueKey = `${candidate.userId}-${candidate.jobId}`;
        
        // Only add if we haven't seen this combination before
        if (!acc.has(uniqueKey)) {
          acc.set(uniqueKey, candidate);
        }
        
        return acc;
      }, new Map());
      
      const sortedCandidates = Array.from(uniqueCandidates.values())
        .sort((a, b) => {
          const dateA = new Date(a.appliedDate || a.createdAt);
          const dateB = new Date(b.appliedDate || b.createdAt);
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
      
      setCandidates(sortedCandidates);
      calculateStatistics(sortedCandidates);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching recruiter applications:', err);
      setError("Failed to fetch applications. Please try again.");
    }
  };

  /**
   * Calculate statistics for the dashboard overview
   * @param {Array} candidates - Array of candidate objects
   */
  const calculateStatistics = (candidates) => {
    const stats = {
      total: candidates.length,
      // Map different status values to the correct categories
      pending: candidates.filter(c => 
        c.status === "applied" || 
        c.status === "pending" || 
        c.status === "submitted"
      ).length,
      reviewed: candidates.filter(c => 
        c.status === "reviewed" || 
        c.status === "to_review" || 
        c.status === "under_review"
      ).length,
      shortlisted: candidates.filter(c => 
        c.status === "shortlisted" || 
        c.status === "to_interview" || 
        c.status === "interviewed" ||
        c.status === "interview_scheduled"
      ).length,
      accepted: candidates.filter(c => 
        c.status === "hired" || 
        c.status === "accepted"
      ).length,
      rejected: candidates.filter(c => 
        c.status === "rejected" || 
        c.status === "declined"
      ).length
    };
    
    setStatistics(stats);
  };

  /**
   * Map frontend status values to backend expected values
   * @param {string} frontendStatus - Status from frontend UI
   * @returns {string} - Backend expected status
   */
  const mapStatusToBackend = (frontendStatus) => {
    const statusMap = {
      'applied': 'pending',
      'to_review': 'reviewed', 
      'shortlisted': 'shortlisted',
      'to_interview': 'interview_scheduled',
      'interviewed': 'interview_scheduled',
      'selected': 'accepted',
      'hired': 'accepted',
      'rejected': 'rejected'
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  /**
   * Map backend status values to frontend display values
   * @param {string} backendStatus - Status from backend
   * @returns {string} - Frontend display status
   */
  const mapStatusFromBackend = (backendStatus) => {
    const statusMap = {
      'pending': 'applied',
      'reviewed': 'to_review',
      'shortlisted': 'shortlisted',
      'interview_scheduled': 'to_interview',
      'accepted': 'hired',
      'rejected': 'rejected'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  /**
   * Update application status for a single candidate
   * @param {string} userId - User ID of the candidate
   * @param {string} jobId - Job ID
   * @param {string} status - New status (frontend value)
   * @param {string} interviewDate - Interview date (optional)
   * @param {string} interviewMode - Interview mode (optional)
   */
  const updateStatus = async (userId, jobId, status, interviewDate = null, interviewMode = null) => {
    try {
      const backendStatus = mapStatusToBackend(status);
      console.log('🔄 Updating status:', { userId, jobId, frontendStatus: status, backendStatus, interviewDate, interviewMode });
      
      const response = await axios.put(buildApiUrl("/api/applications/update_status"), { 
        userId, jobId, status: backendStatus, interviewDate, interviewMode 
      });
      
      console.log('✅ Status update successful:', response.data);
      
      setCandidates((prev) =>
        prev.map((c) => (c.userId === userId && c.jobId === jobId ? { 
          ...c, status, interviewDate, interviewMode 
        } : c))
      );
      
      // Recalculate statistics
      const updatedCandidates = candidates.map((c) => 
        c.userId === userId && c.jobId === jobId ? { ...c, status, interviewDate, interviewMode } : c
      );
      calculateStatistics(updatedCandidates);
      
    } catch (err) {
      console.error('❌ Error updating status:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      alert("Failed to update status. Please try again.");
    }
  };

  /**
   * Handle bulk status updates for multiple candidates
   * @param {string} status - Status to apply to all selected candidates (frontend value)
   */
  const handleBulkStatusUpdate = async (status) => {
    if (selectedCandidates.size === 0) {
      alert("Please select candidates to update.");
      return;
    }

    const backendStatus = mapStatusToBackend(status);
    const confirmMessage = `Are you sure you want to update ${selectedCandidates.size} candidates to "${status}"?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const updatePromises = Array.from(selectedCandidates).map(candidateId => {
        const candidate = candidates.find(c => c.userId === candidateId);
        if (candidate) {
          return updateStatus(candidate.userId, candidate.jobId, status);
        }
      });

      await Promise.all(updatePromises);
      setSelectedCandidates(new Set());
      setShowBulkActions(false);
      setBulkAction("");
      
    } catch (err) {
      console.error('Error in bulk update:', err);
      alert("Failed to update some candidates. Please try again.");
    }
  };

  /**
   * Toggle candidate selection for bulk actions
   * @param {string} candidateId - ID of the candidate to toggle
   */
  const toggleCandidateSelection = (candidateId) => {
    const newSelection = new Set(selectedCandidates);
    if (newSelection.has(candidateId)) {
      newSelection.delete(candidateId);
    } else {
      newSelection.add(candidateId);
    }
    setSelectedCandidates(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  /**
   * Select all candidates on current page
   */
  const selectAllCandidates = () => {
    const allIds = filteredCandidates.map(c => c.userId);
    setSelectedCandidates(new Set(allIds));
    setShowBulkActions(true);
  };

  /**
   * Clear all selections
   */
  const clearSelection = () => {
    setSelectedCandidates(new Set());
    setShowBulkActions(false);
  };

  // Filter candidates based on current filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesJob = jobFilter === "all" || candidate.jobId === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  /**
   * Get status color for visual indicators
   * @param {string} status - Application status
   * @returns {string} - CSS color value
   */
  const getStatusColor = (status) => {
    const colors = {
      'applied': '#3b82f6',
      'to_review': '#8b5cf6',
      'shortlisted': '#f59e0b',
      'to_interview': '#f59e0b',
      'interviewed': '#f59e0b',
      'selected': '#10b981',
      'hired': '#10b981',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  /**
   * Get status icon for visual indicators
   * @param {string} status - Application status
   * @returns {Object} - FontAwesome icon object
   */
  const getStatusIcon = (status) => {
    const icons = {
      'applied': faClock,
      'to_review': faEye,
      'shortlisted': faCheckCircle,
      'to_interview': faCalendar,
      'interviewed': faCheckCircle,
      'selected': faCheckCircle,
      'hired': faCheckCircle,
      'rejected': faTimesCircle
    };
    return icons[status] || faClock;
  };

  /**
   * Format date for display
   * @param {string} dateString - Date string to format
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  /**
   * Calculate match score percentage
   * @param {Object} candidate - Candidate object
   * @returns {number} - Match score percentage
   */
  const calculateMatchScore = (candidate) => {
    try {
      // Use only real AI-generated scores from backend
      const finalScore = candidate.final_score || candidate.matchScore || candidate.gemini_match_score;
      const skillScore = candidate.skill_score || candidate.skills_match || candidate.skill_match;
      
      // If we have a final score, use it (this is the AI-calculated final score)
      if (finalScore !== undefined && finalScore !== null && finalScore > 0) {
        return Math.round(Number(finalScore));
      }
      
      // Otherwise calculate from components
      if (skillScore !== undefined && skillScore !== null && skillScore > 0) {
        return Math.round(Number(skillScore));
      }
      
      // If no AI scores available, return 0 instead of generating random scores
      return 0;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  };

  const calculateEducationScore = (candidate) => {
    // Use only real AI-generated education scores from backend
    const educationScore = candidate.education_score || candidate.education_match;
    
    if (educationScore !== undefined && educationScore !== null && educationScore > 0) {
      return Math.round(educationScore);
    }
    
    // If no AI scores available, return 0 instead of generating random scores
    return 0;
  };



  return (
    <div className="modern-tracker-container">
        {/* Header Section */}
        <div className="tracker-header">
          {/* Blue Banner */}
          <div className="header-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <h1 className="banner-title">Application Tracker</h1>
            </div>
          </div>
          
          {/* Welcome Message */}
          <div className="welcome-section">
            <p className="welcome-text">
              {isJobSeekerUser 
                ? `Welcome back, ${user?.firstName} ${user?.lastName}. Track your job applications and get real-time updates.`
                : "Manage and track all your job applicants efficiently"
              }
            </p>
          </div>
          
          <div className="header-content">
            <div className="header-actions">
              <div className="refresh-section">
                <button className="refresh-btn" onClick={fetchApplications} disabled={loading}>
                  <FontAwesomeIcon icon={faRefresh} className={loading ? 'spinning' : ''} />
                  Refresh
                </button>
                {lastUpdated && (
                  <div className="live-update-indicator">
                    <FontAwesomeIcon icon={faClock} className="update-icon" />
                    <span className="update-text">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button 
                      className={`auto-refresh-toggle ${autoRefresh ? 'active' : ''}`}
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
                    >
                      <FontAwesomeIcon icon={autoRefresh ? faPause : faPlay} />
                    </button>
                  </div>
                )}
              </div>
              {isRecruiterUser && (
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modern Statistics Overview */}
        <div className="modern-stats-grid">
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-number-modern">{statistics.total}</div>
            <div className="stat-label-modern">Total Applications</div>
          </div>
          
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-number-modern">{statistics.pending}</div>
            <div className="stat-label-modern">Applied</div>
          </div>
          
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faEye} />
            </div>
            <div className="stat-number-modern">{statistics.reviewed}</div>
            <div className="stat-label-modern">In Review</div>
          </div>
          
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-number-modern">{statistics.shortlisted}</div>
            <div className="stat-label-modern">Shortlisted</div>
          </div>
          
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <div className="stat-number-modern">{statistics.accepted}</div>
            <div className="stat-label-modern">Selected</div>
          </div>
          
          <div className="modern-stat-card">
            <div className="stat-icon-modern">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="stat-number-modern">{statistics.rejected}</div>
            <div className="stat-label-modern">Rejected</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-filter-content">
            <div className="search-input-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <select 
                className="filter-select" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="to_review">To Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="to_interview">To Interview</option>
                <option value="interviewed">Interviewed</option>
                <option value="rejected">Rejected</option>
                <option value="selected">Selected</option>
                <option value="hired">Hired</option>
              </select>
              
              {isRecruiterUser && (
                <select 
                  className="filter-select" 
                  value={jobFilter} 
                  onChange={(e) => setJobFilter(e.target.value)}
                >
                  <option value="all">All Jobs</option>
                  {availableJobs.map(job => (
                    <option key={job._id} value={job._id}>{job.job_title}</option>
                  ))}
                </select>
              )}
              
              <select 
                className="filter-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="score">Sort by Match Score</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar - Only for Recruiters */}
        {isRecruiterUser && showBulkActions && (
          <div className="bulk-actions-bar">
            <div className="bulk-actions-content">
              <div className="selection-info">
                <span>{selectedCandidates.size} candidate(s) selected</span>
                <button className="clear-selection-btn" onClick={clearSelection}>
                  <FontAwesomeIcon icon={faTimes} />
                  Clear
                </button>
              </div>
              <div className="bulk-actions">
                <select 
                  className="bulk-action-select"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="">Select Action</option>
                  <option value="to_review">Mark as To Review</option>
                  <option value="shortlisted">Shortlist</option>
                  <option value="to_interview">Move to Interview</option>
                  <option value="interviewed">Mark as Interviewed</option>
                  <option value="selected">Select</option>
                  <option value="hired">Hire</option>
                  <option value="rejected">Reject</option>
                </select>
                <button 
                  className="apply-bulk-action-btn"
                  onClick={() => handleBulkStatusUpdate(bulkAction)}
                  disabled={!bulkAction}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Section */}
        <div className="candidates-section">
          <div className="section-header">
            <h2 className="section-title">
              {isJobSeekerUser 
                ? `Your Applications (${filteredCandidates.length})`
                : `All Applicants (${filteredCandidates.length})`
              }
            </h2>
            {isRecruiterUser && (
              <div className="section-actions">
                <button 
                  className="select-all-btn"
                  onClick={selectAllCandidates}
                  disabled={filteredCandidates.length === 0}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Select All
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading candidates...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="error-message">{error}</div>
              <button className="refresh-btn" onClick={fetchApplications}>Try Again</button>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="empty-title">
                {isJobSeekerUser ? "No applications found" : "No candidates found"}
              </h3>
              <p className="empty-description">
                {isJobSeekerUser 
                  ? "You haven't applied to any jobs yet. Start browsing jobs to apply!"
                  : "No candidates match your current filters"
                }
              </p>
              {isJobSeekerUser && (
                <button 
                  className="browse-jobs-btn"
                  onClick={() => window.location.href = '/jobs'}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faRocket} style={{ marginRight: '8px' }} />
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="applications-table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    {isRecruiterUser && (
                      <th className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0}
                          onChange={selectAllCandidates}
                          className="select-all-checkbox"
                        />
                      </th>
                    )}
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Match Score</th>
                    <th>Education Score</th>
                    <th>Status</th>
                    {isRecruiterUser && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate, index) => (
                    <tr key={candidate.uniqueKey || `app-${candidate._id}-${index}`} className="application-row">
                      {isRecruiterUser && (
                        <td className="checkbox-column">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.has(candidate.userId)}
                            onChange={() => toggleCandidateSelection(candidate.userId)}
                            className="candidate-checkbox"
                          />
                        </td>
                      )}
                      <td className="job-title-cell">
                        <div className="job-title-content">
                          <div className="job-title">{candidate.jobTitle}</div>
                          {isRecruiterUser && (
                            <div className="candidate-name">{candidate.firstName} {candidate.lastName}</div>
                          )}
                        </div>
                      </td>
                      <td className="company-cell">
                        <div className="company-info">
                          <FontAwesomeIcon icon={faBuilding} className="company-icon" />
                          <span>{candidate.companyName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="location-cell">
                        <div className="location-info">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                          <span>{safeString(candidate.location)}</span>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-info">
                          <FontAwesomeIcon icon={faCalendar} className="date-icon" />
                          <span>{formatDate(candidate.appliedDate)}</span>
                        </div>
                      </td>
                      <td className="match-score-cell">
                        <div className="score-display">
                          <span className="score-percentage">
                            {calculateMatchScore(candidate) >= 0 ? `${calculateMatchScore(candidate)}%` : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="education-score-cell">
                        <div className="score-display">
                          <span className="score-percentage">
                            {calculateEducationScore(candidate) >= 0 ? `${calculateEducationScore(candidate)}%` : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <div 
                          className="status-badge-modern"
                          style={{ backgroundColor: getStatusColor(mapStatusFromBackend(candidate.status)) }}
                        >
                          <FontAwesomeIcon icon={getStatusIcon(mapStatusFromBackend(candidate.status))} />
                          <span>{mapStatusFromBackend(candidate.status)?.charAt(0).toUpperCase() + mapStatusFromBackend(candidate.status)?.slice(1)}</span>
                        </div>
                      </td>
                      {isRecruiterUser && (
                        <td className="actions-cell">
                          <div className="table-actions">
                            <select 
                              className="status-select-modern"
                              value={mapStatusFromBackend(candidate.status) || "applied"}
                              onChange={(e) => updateStatus(
                                candidate.userId, 
                                candidate.jobId, 
                                e.target.value
                              )}
                            >
                              <option value="applied">Applied</option>
                              <option value="to_review">To Review</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="to_interview">To Interview</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="rejected">Reject</option>
                              <option value="selected">Select</option>
                              <option value="hired">Hire</option>
                            </select>
                            <button 
                              className="view-profile-btn-modern"
                              onClick={() => window.open(`/profile/${candidate.userId}`, "_blank")}
                              title="View Profile"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
};

export default ModernApplicationTracker;
