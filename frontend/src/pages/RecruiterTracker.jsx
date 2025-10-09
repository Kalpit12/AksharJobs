import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import axios from 'axios';
import apiService from '../services/apiService';
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
  faEdit,
  faTrash,
  faPaperPlane,
  faUsers,
  faFileAlt,
  faPhone,
  faVideo,
  faCheck,
  faX,
  faCircle,
  faClipboardList,
  faUserCheck,
  faUserClock,
  faUserTimes,
  faUserTie,
  faCog,
  faCalendarAlt,
  faSort,
  faSortUp,
  faSortDown,
  faTimes,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import '../styles/RecruiterTracker.css';
import AdvertisementSystem from '../components/AdvertisementSystem';

const RecruiterTracker = () => {
  const { user, isAuthenticated } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  
  // Advanced Search States
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { start: '', end: '' },
    matchScoreRange: { min: '', max: '' },
    experienceRange: { min: '', max: '' },
    skillMatchRange: { min: '', max: '' },
    jobType: 'all',
    location: '',
    company: '',
    hiringRecommendation: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [statusOptions, setStatusOptions] = useState([
    { value: 'applied', label: 'Applied' },
    { value: 'to_review', label: 'To Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'to_interview', label: 'To Interview' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'selected', label: 'Selected' },
    { value: 'hired', label: 'Hired' }
  ]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCandidates();
      fetchStatusOptions();
      
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchCandidates();
      }, 30000); // Poll every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching recruiter applications...');
      
      const response = await axios.get(buildApiUrl('/api/applications/recruiter/all'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📋 API Response:', response.data);
      
      // Ensure we always set an array
      const data = response.data;
      if (data && Array.isArray(data.applications)) {
        setCandidates(data.applications);
        console.log(`✅ Loaded ${data.applications.length} applications`);
      } else {
        setCandidates([]);
        console.log('⚠️ No applications found or invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error('❌ Error fetching candidates:', err);
      setCandidates([]); // Ensure we always have an array
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const response = await apiService.getStatusOptions();
      setStatusOptions(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching status options:', err);
      // Set default status options if API fails
      setStatusOptions([
        { value: 'applied', label: 'Applied' },
        { value: 'to_review', label: 'To Review' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'to_interview', label: 'To Interview' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'selected', label: 'Selected' },
        { value: 'hired', label: 'Hired' }
      ]);
    }
  };

  const updateCandidateStatus = async (applicantId, jobId, newStatus, notes = '') => {
    try {
      console.log(`🔄 Updating status for applicant ${applicantId}, job ${jobId} to ${newStatus}`);
      
      // Map frontend status to backend status
      const statusMapping = {
        'applied': 'pending',
        'to_review': 'reviewed',
        'shortlisted': 'shortlisted',
        'to_interview': 'reviewed', // Map to reviewed for now
        'interviewed': 'reviewed', // Map to reviewed for now
        'rejected': 'rejected',
        'selected': 'accepted',
        'hired': 'accepted'
      };
      
      const backendStatus = statusMapping[newStatus] || 'pending';
      
      const response = await axios.put(buildApiUrl('/api/applications/update_status'), {
        userId: applicantId,
        jobId: jobId,
        status: backendStatus,
        notes: notes
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log('✅ Status updated successfully');
        // Refresh candidates list immediately
        await fetchCandidates();
        return true;
      }
    } catch (err) {
      console.error('❌ Error updating candidate status:', err);
      console.error('❌ Error details:', err.response?.data);
      alert(`Failed to update status: ${err.response?.data?.error || err.message}`);
      return false;
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedCandidates.length === 0) return;

    const applications = selectedCandidates.map(candidate => ({
      user_id: candidate.userId,
      job_id: candidate.jobId,
      status: bulkStatus,
      notes: bulkNotes
    }));

    try {
      const response = await axios.post(buildApiUrl('/tracker/bulk-update'), {
        applications: applications,
        status: bulkStatus,
        notes: bulkNotes
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        setSelectedCandidates([]);
        setBulkStatus('');
        setBulkNotes('');
        setShowBulkActions(false);
        fetchCandidates();
      }
    } catch (err) {
      console.error('Error in bulk update:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#3b82f6',
      'pending': '#3b82f6',
      'to_review': '#8b5cf6',
      'reviewed': '#8b5cf6',
      'shortlisted': '#f59e0b',
      'to_interview': '#f59e0b',
      'interviewed': '#f59e0b',
      'selected': '#10b981',
      'hired': '#10b981',
      'accepted': '#10b981',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'applied': faClock,
      'pending': faClock,
      'to_review': faEye,
      'reviewed': faEye,
      'shortlisted': faCheckCircle,
      'to_interview': faCalendar,
      'interviewed': faCheckCircle,
      'selected': faCheckCircle,
      'hired': faCheckCircle,
      'accepted': faCheckCircle,
      'rejected': faTimesCircle
    };
    return icons[status] || faClock;
  };

  // Normalize status for display and filtering
  const normalizeStatus = (status) => {
    const statusMap = {
      'pending': 'applied',
      'reviewed': 'to_review',
      'shortlisted': 'shortlisted',
      'accepted': 'selected',
      'rejected': 'rejected'
    };
    return statusMap[status] || status;
  };

  // Count candidates by status for stat cards
  const getStatusCount = (targetStatus) => {
    return (Array.isArray(candidates) ? candidates : []).filter(candidate => {
      const normalizedStatus = normalizeStatus(candidate.status);
      return normalizedStatus === targetStatus;
    }).length;
  };

  // Advanced filtering logic
  const applyAdvancedFilters = (candidate) => {
    const filters = advancedFilters;
    
    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const candidateDate = new Date(candidate.created_at || candidate.applied_date);
      if (filters.dateRange.start && candidateDate < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && candidateDate > new Date(filters.dateRange.end)) return false;
    }
    
    // Match score range
    if (filters.matchScoreRange.min || filters.matchScoreRange.max) {
      const matchScore = candidate.final_score || 0;
      if (filters.matchScoreRange.min && matchScore < parseFloat(filters.matchScoreRange.min)) return false;
      if (filters.matchScoreRange.max && matchScore > parseFloat(filters.matchScoreRange.max)) return false;
    }
    
    // Experience range
    if (filters.experienceRange.min || filters.experienceRange.max) {
      const experience = parseFloat(candidate.experience || 0);
      if (filters.experienceRange.min && experience < parseFloat(filters.experienceRange.min)) return false;
      if (filters.experienceRange.max && experience > parseFloat(filters.experienceRange.max)) return false;
    }
    
    // Skill match range
    if (filters.skillMatchRange.min || filters.skillMatchRange.max) {
      const skillMatch = candidate.skill_match || 0;
      if (filters.skillMatchRange.min && skillMatch < parseFloat(filters.skillMatchRange.min)) return false;
      if (filters.skillMatchRange.max && skillMatch > parseFloat(filters.skillMatchRange.max)) return false;
    }
    
    // Job type filter
    if (filters.jobType !== 'all' && candidate.job_type !== filters.jobType) return false;
    
    // Location filter
    if (filters.location && !candidate.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    
    // Company filter
    if (filters.company && !candidate.company_name?.toLowerCase().includes(filters.company.toLowerCase())) return false;
    
    // Hiring recommendation filter
    if (filters.hiringRecommendation !== 'all' && candidate.hiring_recommendation !== filters.hiringRecommendation) return false;
    
    return true;
  };

  // Sorting logic
  const applySorting = (a, b) => {
    const { sortBy, sortOrder } = advancedFilters;
    const isAsc = sortOrder === 'asc';
    
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.created_at || a.applied_date);
        bValue = new Date(b.created_at || b.applied_date);
        break;
      case 'matchScore':
        aValue = a.final_score || 0;
        bValue = b.final_score || 0;
        break;
      case 'experience':
        aValue = parseFloat(a.experience || 0);
        bValue = parseFloat(b.experience || 0);
        break;
      case 'skillMatch':
        aValue = a.skill_match || 0;
        bValue = b.skill_match || 0;
        break;
      case 'name':
        aValue = a.applicant_name || '';
        bValue = b.applicant_name || '';
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return isAsc ? -1 : 1;
    if (aValue > bValue) return isAsc ? 1 : -1;
    return 0;
  };

  const filteredCandidates = (Array.isArray(candidates) ? candidates : []).filter(candidate => {
    // Basic search
    const matchesSearch = candidate.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter - normalize status for comparison
    const normalizedStatus = normalizeStatus(candidate.status);
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
    
    // Advanced filters
    const matchesAdvanced = applyAdvancedFilters(candidate);
    
    return matchesSearch && matchesStatus && matchesAdvanced;
  }).sort((a, b) => {
    // Apply sorting
    return applySorting(a, b);
  });

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  const handleSelectCandidate = (candidate) => {
    const isSelected = selectedCandidates.some(c => c._id === candidate._id);
    if (isSelected) {
      setSelectedCandidates(selectedCandidates.filter(c => c._id !== candidate._id));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueJobCount = () => {
    if (!Array.isArray(candidates) || candidates.length === 0) return 0;
    const uniqueJobIds = new Set(candidates.map(candidate => candidate.job_id || candidate.jobId));
    return uniqueJobIds.size;
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filterType, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all advanced filters
  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      dateRange: { start: '', end: '' },
      matchScoreRange: { min: '', max: '' },
      experienceRange: { min: '', max: '' },
      skillMatchRange: { min: '', max: '' },
      jobType: 'all',
      location: '',
      company: '',
      hiringRecommendation: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="recruiter-tracker">
        <div className="login-prompt">
          <h2>Please log in to access the recruiter tracker</h2>
          <p>Manage candidates and track application progress</p>
          {/* Test ad even when not authenticated */}
          <div style={{marginTop: '20px'}}>
            <AdvertisementSystem placement="banner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-tracker">
      <div className="tracker-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-details">
              <h1>Candidate Tracker</h1>
              <p>Manage applications for {user?.companyName || 'your company'}</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <FontAwesomeIcon icon={faCircle} className="live-icon" />
              Live Updates
            </div>
            {selectedCandidates.length > 0 && (
              <button 
                className="bulk-actions-btn"
                onClick={() => setShowBulkActions(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
                Bulk Actions ({selectedCandidates.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-number-modern">{candidates.length}</div>
          <div className="stat-label-modern">Total Applicants</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faEye} />
          </div>
          <div className="stat-number-modern">{getStatusCount('to_review')}</div>
          <div className="stat-label-modern">In Review</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="stat-number-modern">{getStatusCount('shortlisted')}</div>
          <div className="stat-label-modern">Shortlisted</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
          <div className="stat-number-modern">{getStatusCount('to_interview')}</div>
          <div className="stat-label-modern">To Interview</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <div className="stat-number-modern">{getStatusCount('interviewed')}</div>
          <div className="stat-label-modern">Interviewed</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faUserTimes} />
          </div>
          <div className="stat-number-modern">{getStatusCount('rejected')}</div>
          <div className="stat-label-modern">Rejected</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="stat-number-modern">{getStatusCount('selected')}</div>
          <div className="stat-label-modern">Selected</div>
        </div>
        
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <FontAwesomeIcon icon={faUserTie} />
          </div>
          <div className="stat-number-modern">{getStatusCount('hired')}</div>
          <div className="stat-label-modern">Hired</div>
        </div>
      </div>

      {/* Dynamic Advertisement System */}
      <div className="advertisement-section">
        <AdvertisementSystem placement="banner" />
      </div>

      {/* Advanced Search and Filters */}
      <div className="advanced-search-section">
        <div className="search-header">
          <h3>Search & Filter Candidates</h3>
          <button 
            className="advanced-toggle-btn"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <FontAwesomeIcon icon={faCog} />
            {showAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}
            <FontAwesomeIcon icon={showAdvancedSearch ? faChevronUp : faChevronDown} />
          </button>
        </div>

        {/* Basic Search */}
        <div className="basic-search-row">
          <div className="search-box-enhanced">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search candidates, jobs, or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter-enhanced">
            <FontAwesomeIcon icon={faFilter} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
          </div>
          <button className="refresh-btn-enhanced" onClick={fetchCandidates}>
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
        </div>

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="advanced-search-panel">
            <div className="advanced-filters-grid">
              {/* Date Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Application Date Range
                </label>
                <div className="date-range-inputs">
                  <input
                    type="date"
                    value={advancedFilters.dateRange.start}
                    onChange={(e) => handleAdvancedFilterChange('dateRange', {
                      ...advancedFilters.dateRange,
                      start: e.target.value
                    })}
                    placeholder="Start Date"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={advancedFilters.dateRange.end}
                    onChange={(e) => handleAdvancedFilterChange('dateRange', {
                      ...advancedFilters.dateRange,
                      end: e.target.value
                    })}
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Match Score Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faChartLine} />
                  Match Score Range
                </label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={advancedFilters.matchScoreRange.min}
                    onChange={(e) => handleAdvancedFilterChange('matchScoreRange', {
                      ...advancedFilters.matchScoreRange,
                      min: e.target.value
                    })}
                    placeholder="Min %"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={advancedFilters.matchScoreRange.max}
                    onChange={(e) => handleAdvancedFilterChange('matchScoreRange', {
                      ...advancedFilters.matchScoreRange,
                      max: e.target.value
                    })}
                    placeholder="Max %"
                  />
                </div>
              </div>

              {/* Experience Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faUser} />
                  Experience Range (Years)
                </label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min="0"
                    value={advancedFilters.experienceRange.min}
                    onChange={(e) => handleAdvancedFilterChange('experienceRange', {
                      ...advancedFilters.experienceRange,
                      min: e.target.value
                    })}
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    value={advancedFilters.experienceRange.max}
                    onChange={(e) => handleAdvancedFilterChange('experienceRange', {
                      ...advancedFilters.experienceRange,
                      max: e.target.value
                    })}
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Skill Match Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faChartLine} />
                  Skill Match Range
                </label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={advancedFilters.skillMatchRange.min}
                    onChange={(e) => handleAdvancedFilterChange('skillMatchRange', {
                      ...advancedFilters.skillMatchRange,
                      min: e.target.value
                    })}
                    placeholder="Min %"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={advancedFilters.skillMatchRange.max}
                    onChange={(e) => handleAdvancedFilterChange('skillMatchRange', {
                      ...advancedFilters.skillMatchRange,
                      max: e.target.value
                    })}
                    placeholder="Max %"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faBuilding} />
                  Job Type
                </label>
                <select
                  value={advancedFilters.jobType}
                  onChange={(e) => handleAdvancedFilterChange('jobType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Location */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Location
                </label>
                <input
                  type="text"
                  value={advancedFilters.location}
                  onChange={(e) => handleAdvancedFilterChange('location', e.target.value)}
                  placeholder="Enter location..."
                />
              </div>

              {/* Company */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faBuilding} />
                  Company
                </label>
                <input
                  type="text"
                  value={advancedFilters.company}
                  onChange={(e) => handleAdvancedFilterChange('company', e.target.value)}
                  placeholder="Enter company name..."
                />
              </div>

              {/* Hiring Recommendation */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Hiring Recommendation
                </label>
                <select
                  value={advancedFilters.hiringRecommendation}
                  onChange={(e) => handleAdvancedFilterChange('hiringRecommendation', e.target.value)}
                >
                  <option value="all">All Recommendations</option>
                  <option value="Strong Hire">Strong Hire</option>
                  <option value="Hire">Hire</option>
                  <option value="No Hire">No Hire</option>
                  <option value="Strong No Hire">Strong No Hire</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="filter-group">
                <label className="filter-label">
                  <FontAwesomeIcon icon={faSort} />
                  Sort By
                </label>
                <div className="sort-controls">
                  <select
                    value={advancedFilters.sortBy}
                    onChange={(e) => handleAdvancedFilterChange('sortBy', e.target.value)}
                  >
                    <option value="date">Application Date</option>
                    <option value="matchScore">Match Score</option>
                    <option value="experience">Experience</option>
                    <option value="skillMatch">Skill Match</option>
                    <option value="name">Name</option>
                  </select>
                  <button
                    className="sort-order-btn"
                    onClick={() => handleAdvancedFilterChange('sortOrder', 
                      advancedFilters.sortOrder === 'asc' ? 'desc' : 'asc'
                    )}
                  >
                    <FontAwesomeIcon icon={advancedFilters.sortOrder === 'asc' ? faSortUp : faSortDown} />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Search Actions */}
            <div className="advanced-search-actions">
              <button className="clear-filters-btn" onClick={clearAdvancedFilters}>
                <FontAwesomeIcon icon={faTimes} />
                Clear All Filters
              </button>
              <div className="results-count">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidates List */}
      <div className="candidates-section">
        <div className="main-content-layout">
          <div className="candidates-main">
            <h2>Candidate Applications</h2>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading candidates...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchCandidates}>Try Again</button>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faUsers} />
            <h3>No candidates found</h3>
            <p>No applications match your current filters</p>
            <div className="empty-state-ad">
              <AdvertisementSystem placement="inline" />
            </div>
          </div>
        ) : (
          <div className="candidates-table-container">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Job Title</th>
                  <th>Match Score ↑</th>
                  <th>Skill Match ↑</th>
                  <th>Hiring Recommendation</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>View Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate._id} className="candidate-row">
                    <td>
                      <div className="candidate-avatar-small">
                        {candidate.applicant_name?.charAt(0) || 'U'}
                      </div>
                    </td>
                    <td>
                      <div className="candidate-name">
                        {candidate.applicant_name || 'Unknown Candidate'}
                      </div>
                    </td>
                    <td>
                      <div className="candidate-email">
                        {candidate.applicant_email || 'No email'}
                      </div>
                    </td>
                    <td>
                      <div className="candidate-phone">
                        {candidate.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="candidate-job">
                        {candidate.job_title || 'Unknown Job'}
                      </div>
                    </td>
                    <td>
                      <div className="match-score">
                        {Math.round(candidate.final_score || 0)}%
                      </div>
                    </td>
                    <td>
                      <div className="skill-match">
                        {Math.round(candidate.skill_match || 0)}%
                      </div>
                    </td>
                    <td>
                      <div className="hiring-recommendation">
                        {candidate.hiring_recommendation || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <select 
                        className="status-select-table"
                        value={normalizeStatus(candidate.status)}
                        onChange={(e) => updateCandidateStatus(candidate.applicant_id, candidate.job_id, e.target.value)}
                      >
                        <option value="applied">Applied</option>
                        <option value="to_review">To Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="to_interview">To Interview</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="rejected">Rejected</option>
                        <option value="selected">Selected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.some(c => c._id === candidate._id)}
                          onChange={() => handleSelectCandidate(candidate)}
                          className="candidate-checkbox"
                        />
                      </div>
                    </td>
                    <td>
                      <button 
                        className="view-profile-btn"
                        onClick={() => handleViewDetails(candidate)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          </div>
          
          {/* Sidebar with Advertisements */}
          <div className="candidates-sidebar">
            <AdvertisementSystem placement="sidebar" />
            <AdvertisementSystem placement="sidebar" />
          </div>
        </div>
      </div>

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="modal-overlay" onClick={() => setShowBulkActions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bulk Actions</h2>
              <button className="close-btn" onClick={() => setShowBulkActions(false)}>
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            <div className="modal-body">
              <div className="bulk-actions-form">
                <div className="form-group">
                  <label>Update Status for {selectedCandidates.length} candidates:</label>
                  <select 
                    value={bulkStatus} 
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes (optional):</label>
                  <textarea
                    value={bulkNotes}
                    onChange={(e) => setBulkNotes(e.target.value)}
                    placeholder="Add notes for all selected candidates..."
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowBulkActions(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="update-btn"
                    onClick={handleBulkUpdate}
                    disabled={!bulkStatus}
                  >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                    Update All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {showDetails && selectedCandidate && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Candidate Details</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            <div className="modal-body">
              <div className="candidate-detail-card">
                <div className="candidate-header">
                  <div className="candidate-avatar large">
                    {selectedCandidate.applicant_name?.charAt(0) || 'U'}
                  </div>
                  <div className="candidate-info">
                    <h3>{selectedCandidate.applicant_name || 'Unknown Candidate'}</h3>
                    <p className="job-title">{selectedCandidate.job_title}</p>
                    <p className="company-name">{selectedCandidate.company_name}</p>
                    <div className="contact-info">
                      <p><FontAwesomeIcon icon={faEnvelope} /> {selectedCandidate.applicant_email}</p>
                    </div>
                  </div>
                  <div className="status-info">
                    <span 
                      className="status-badge large" 
                      style={{ backgroundColor: getStatusColor(selectedCandidate.status) }}
                    >
                      {selectedCandidate.status_display}
                    </span>
                    <div className="match-score">
                      {Math.round(selectedCandidate.final_score || 0)}% Match
                    </div>
                  </div>
                </div>
              </div>

              {selectedCandidate.tracking_history && selectedCandidate.tracking_history.length > 0 && (
                <div className="tracking-history">
                  <h4>Application Timeline</h4>
                  <div className="timeline">
                    {selectedCandidate.tracking_history.map((record, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-status">{record.status_display}</div>
                          <div className="timeline-date">{formatDate(record.timestamp)}</div>
                          {record.notes && (
                            <div className="timeline-notes">{record.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="action-section">
                <h4>Update Status</h4>
                <div className="status-update-form">
                  <select 
                    className="form-select"
                    value={normalizeStatus(selectedCandidate.status)}
                    onChange={(e) => updateCandidateStatus(selectedCandidate.applicant_id, selectedCandidate.job_id, e.target.value)}
                  >
                    <option value="applied">Applied</option>
                    <option value="to_review">To Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="to_interview">To Interview</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="rejected">Rejected</option>
                    <option value="selected">Selected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterTracker;
