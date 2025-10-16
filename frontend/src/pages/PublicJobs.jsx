import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faMapMarkerAlt, 
  faClock, 
  faBuilding, 
  faDollarSign,
  faEye,
  faLock,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import axios from 'axios';

const PublicJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl("/api/jobs/get_jobs"));
      setJobs(response.data || []);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || job.job_type === filterType;
    const matchesLocation = filterLocation === 'all' || 
                           job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleJobClick = (job) => {
    if (isAuthenticated) {
      navigate(`/joblisting/${job._id}`);
    } else {
      navigate('/signup');
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return '#10b981';
      case 'Part-time': return '#3b82f6';
      case 'Contract': return '#f59e0b';
      case 'Remote': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="public-jobs-page">
        <div className="public-jobs-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading amazing opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-jobs-page">
        <div className="public-jobs-container">
          <div className="error-container">
            <FontAwesomeIcon icon={faSearch} />
            <h3>Unable to load jobs</h3>
            <p>{error}</p>
            <button onClick={fetchJobs} className="retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-jobs-page">
      <div className="public-jobs-container">
        {/* Header */}
        <div className="public-jobs-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
          </button>
          
          <div className="header-content">
            <h1>Discover Amazing Opportunities</h1>
            <p>Explore job openings from top companies. Sign up to see company details and apply.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search by job title or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-container">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Locations</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>{filteredJobs.length} opportunities found</p>
          {!isAuthenticated && (
            <div className="signup-prompt">
              <FontAwesomeIcon icon={faLock} />
              <span>Sign up to see company names and apply</span>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="job-listings">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div 
                key={job._id} 
                className="job-card"
                onClick={() => handleJobClick(job)}
              >
                <div className="job-card-header">
                  <div className="job-title-section">
                    <h3 className="job-title">{job.job_title}</h3>
                  </div>
                  
                  <div className="job-type-badge" style={{ backgroundColor: getJobTypeColor(job.job_type) }}>
                    {job.job_type}
                  </div>
                </div>

                <div className="job-details">
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{job.job_type}</span>
                  </div>
                  {job.salary_range && (
                    <div className="job-detail">
                      <FontAwesomeIcon icon={faDollarSign} />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>

                <div className="job-description">
                  <p>{job.description.substring(0, 150)}...</p>
                </div>

                <div className="job-actions">
                  <button className="view-job-btn">
                    <FontAwesomeIcon icon={faEye} />
                    {isAuthenticated ? 'View Details' : 'Sign Up to View'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <FontAwesomeIcon icon={faSearch} />
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="cta-section">
            <div className="cta-content">
              <h2>Ready to unlock company details?</h2>
              <p>Sign up now to see which companies are hiring and start applying to your dream job.</p>
              <div className="cta-buttons">
                <button 
                  className="cta-btn primary"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Now
                </button>
                <button 
                  className="cta-btn secondary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicJobs;
