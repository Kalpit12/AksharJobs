import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import JobCardSkeleton from '../components/JobCardSkeleton';
import { 
  faSearch, 
  faFilter, 
  faSort, 
  faMapMarkerAlt, 
  faBuilding, 
  faClock, 
  faGraduationCap,
  faBriefcase,
  faMoneyBillWave,
  faGlobe,
  faStar,
  faChartLine,
  faLightbulb,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faArrowRight,
  faEye,
  faHeart,
  faRobot,
  faFileAlt,
  faBullseye,
  faHashtag,
  faCheckDouble,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "../styles/JobSearch.css";
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';

const JobSearch = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [matchScores, setMatchScores] = useState({});
  const [loadingMatch, setLoadingMatch] = useState({});
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [favoriteJobs, setFavoriteJobs] = useState(new Set());
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJobs();
    if (userId) {
      fetchAppliedJobs();
      fetchFavorites();
    }
  }, [userId]);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, experienceFilter, fieldFilter, sortBy]);

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

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/api/applications/get_applications`), {
        params: { userId }
      });
      if (response.data?.applications) {
        const appliedJobIds = new Set(response.data.applications.map(app => app.jobId));
        setAppliedJobs(appliedJobIds);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const fetchFavorites = () => {
    const stored = localStorage.getItem(`favorites_${userId}`);
    if (stored) {
      setFavoriteJobs(new Set(JSON.parse(stored)));
    }
  };

  const fetchAIRecommendations = async () => {
    if (!userId) return;
    
    try {
      setLoadingRecommendations(true);
      const response = await axios.get(buildApiUrl(`/api/jobs/recommended/${userId}`));
      
      if (response.data.recommendations) {
        setAiRecommendedJobs(response.data.recommendations);
        setShowRecommendations(true);
      }
    } catch (err) {
      console.error("Error fetching AI recommendations:", err);
      
      // Handle specific cases
      if (err.response?.status === 404) {
        if (err.response.data?.error === "User has no resume uploaded") {
          // User doesn't have a resume - show helpful message
          setAiRecommendedJobs([]);
          setShowRecommendations(true); // Show the "no recommendations" section
        } else {
          console.log("User not found or other 404 error");
        }
      } else {
        // Other errors - show generic error message
        console.log("Unexpected error occurred while fetching recommendations");
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const filterAndSortJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => {
        const titleMatch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase());
        const companyMatch = job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = job.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Handle both string and array types for required_skills
        let skillsMatch = false;
        if (Array.isArray(job.required_skills)) {
          skillsMatch = job.required_skills.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (typeof job.required_skills === 'string') {
          skillsMatch = job.required_skills.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return titleMatch || companyMatch || descriptionMatch || skillsMatch;
      });
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter);
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter(job => {
        const exp = job.experience_required;
        if (experienceFilter === "entry") return exp.includes("0") || exp.includes("1");
        if (experienceFilter === "mid") return exp.includes("2") || exp.includes("3") || exp.includes("4");
        if (experienceFilter === "senior") return exp.includes("5") || exp.includes("6") || exp.includes("7") || exp.includes("8") || exp.includes("9");
        if (experienceFilter === "executive") return exp.includes("10") || exp.includes("15") || exp.includes("20");
        return true;
      });
    }

    // Field filter
    if (fieldFilter !== "all") {
      filtered = filtered.filter(job => {
        // Handle both old and new industry naming conventions
        let matches = false;
        
        if (fieldFilter === "Technology & IT") {
          matches = job.industry === "Technology & IT" || 
                   job.industry === "Information Technology" || 
                   job.industry === "IT" ||
                   job.industry === "Artificial Intelligence";
        } else if (fieldFilter === "Sales & Marketing") {
          matches = job.industry === "Sales & Marketing";
        } else if (fieldFilter === "Finance & Accounting") {
          matches = job.industry === "Finance & Accounting";
        } else if (fieldFilter === "Healthcare & Medical") {
          matches = job.industry === "Healthcare & Medical";
        } else if (fieldFilter === "Education & Training") {
          matches = job.industry === "Education & Training";
        } else if (fieldFilter === "Engineering") {
          matches = job.industry === "Engineering";
        } else if (fieldFilter === "Design & Creative") {
          matches = job.industry === "Design & Creative";
        } else if (fieldFilter === "Operations & Management") {
          matches = job.industry === "Operations & Management" || 
                   job.industry === "Product Management";
        } else if (fieldFilter === "Human Resources") {
          matches = job.industry === "Human Resources";
        } else if (fieldFilter === "Legal & Compliance") {
          matches = job.industry === "Legal & Compliance";
        } else if (fieldFilter === "Research & Development") {
          matches = job.industry === "Research & Development";
        } else if (fieldFilter === "Customer Service") {
          matches = job.industry === "Customer Service";
        } else if (fieldFilter === "Administration") {
          matches = job.industry === "Administration";
        } else if (fieldFilter === "Consulting") {
          matches = job.industry === "Consulting";
        } else if (fieldFilter === "Media & Communications") {
          matches = job.industry === "Media & Communications";
        } else if (fieldFilter === "Retail & E-commerce") {
          matches = job.industry === "Retail & E-commerce";
        } else if (fieldFilter === "Manufacturing") {
          matches = job.industry === "Manufacturing";
        } else {
          // For any other field, do exact match
          matches = job.industry === fieldFilter;
        }
        
        return matches;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return (matchScores[b._id] || 0) - (matchScores[a._id] || 0);
        case "date":
          return new Date(b.created_at) - new Date(a.created_at);
        case "salary":
          const salaryA = extractSalary(b.salary_range);
          const salaryB = extractSalary(a.salary_range);
          return salaryB - salaryA;
        case "company":
          return a.company_name.localeCompare(b.company_name);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const extractSalary = (salaryRange) => {
    if (!salaryRange) return 0;
    const match = salaryRange.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  const calculateMatchScore = async (jobId) => {
    if (!userId || matchScores[jobId] !== undefined) return;

    setLoadingMatch(prev => ({ ...prev, [jobId]: true }));
    try {
      const response = await axios.post(buildApiUrl("/api/applications/apply"), {
        userId,
        jobId,
        status: ""
      });
      
      if (response.data.final_score !== undefined) {
        // Store both match score and AI suggestions
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: response.data.final_score,
            aiSuggestions: response.data.ai_suggestions || []
          }
        }));
      }
    } catch (err) {
      console.error("Error calculating match score:", err);
    } finally {
      setLoadingMatch(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApply = async (jobId) => {
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      // First, process the application (this creates the application record and calculates match score)
      const processResponse = await axios.post(buildApiUrl("/api/applications/apply"), {
        userId,
        jobId,
        status: "applied"
      });

      if (processResponse.status === 200) {
        // Then update the job applicant count
        await axios.post(buildApiUrl(`/api/jobs/apply/${jobId}`), {
          applicant_id: userId,
        });

        setAppliedJobs(prev => new Set([...prev, jobId]));
        alert("Application submitted successfully!");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job. Please try again.");
    }
  };

  const toggleFavorite = (jobId) => {
    const newFavorites = new Set(favoriteJobs);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavoriteJobs(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavorites]));
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    if (!matchScores[job._id]) {
      calculateMatchScore(job._id);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#EF4444";
    return "#6B7280";
  };

  const getMatchScoreText = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  const getImprovementSuggestions = (job) => {
    const suggestions = [];
    
    if (job.required_skills) {
      suggestions.push("Review and enhance your skills section to better match the job requirements");
    }
    
    if (job.experience_required) {
      suggestions.push("Ensure your experience section highlights relevant achievements and responsibilities");
    }
    
    if (job.education_required) {
      suggestions.push("Verify your education credentials meet the minimum requirements");
    }
    
    suggestions.push("Customize your resume summary to align with the job description");
    suggestions.push("Include specific keywords from the job posting in your resume");
    suggestions.push("Quantify your achievements with numbers and metrics");
    
    return suggestions;
  };

  if (loading) {
    return (
      <div className="job-search-page">
        <div className="job-search-container">
          <div className="loading-container">
            <LoadingSpinner
              type="rocket"
              size="large"
              text="Finding amazing opportunities for you..."
              showText={true}
              color="primary"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-search-page">
        <div className="job-search-container">
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <h3>Error Loading Jobs</h3>
            <p>{error}</p>
            <button onClick={fetchJobs} className="retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-search-page">
      <div className="job-search-container">
        {/* Header */}
        <div className="job-search-header">
          <h1>Find Your Dream Job</h1>
          <p>Discover opportunities that match your skills and career goals</p>
        </div>

        {/* AI Recommended Jobs Section */}
        {userId && (
          <div className="ai-recommendations-section">
            <div className="recommendations-header">
              <div className="recommendations-title">
                <FontAwesomeIcon icon={faRobot} className="ai-icon" />
                <h2>🤖 AI-Powered Job Recommendations</h2>
                <p>Jobs that best match your skills and experience</p>
              </div>
              <Button
                onClick={fetchAIRecommendations}
                className="get-recommendations-btn"
                disabled={loadingRecommendations}
                loading={loadingRecommendations}
                icon={faLightbulb}
              >
                    Get AI Recommendations
              </Button>
            </div>

            {showRecommendations && aiRecommendedJobs.length > 0 && (
              <div className="recommendations-content">
                <div className="recommendations-summary">
                  <span className="recommendations-count">
                    {aiRecommendedJobs.length} personalized recommendations
                  </span>
                  <span className="recommendations-note">
                    Based on your resume analysis
                  </span>
                </div>
                
                <div className="recommended-jobs-grid">
                  {aiRecommendedJobs.slice(0, 6).map((job) => (
                    <div key={job._id} className="recommended-job-card">
                      <div className="recommendation-badge">
                        <FontAwesomeIcon icon={faStar} />
                        {job.match_score}% Match
                      </div>
                      
                      <div className="recommended-job-content">
                        <h3 className="recommended-job-title" onClick={() => viewJobDetails(job)}>
                          {job.job_title}
                        </h3>
                        <div className="recommended-company">
                          <FontAwesomeIcon icon={faBuilding} />
                          <span>{job.company_name}</span>
                        </div>
                        <div className="recommended-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>{job.location}</span>
                        </div>
                        <div className="recommended-type">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{job.job_type}</span>
                        </div>
                        
                        <div className="recommended-match-score">
                          <div className="match-score-bar">
                            <div 
                              className="match-score-fill"
                              style={{ 
                                width: `${job.match_score}%`,
                                backgroundColor: getMatchScoreColor(job.match_score)
                              }}
                            ></div>
                          </div>
                          <span className="match-score-text">
                            {getMatchScoreText(job.match_score)}
                          </span>
                        </div>
                        
                        <div className="recommended-job-actions">
                          <button
                            onClick={() => viewJobDetails(job)}
                            className="view-recommended-btn"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            View Details
                          </button>
                          
                          {!appliedJobs.has(job._id) ? (
                            <button
                              onClick={() => handleApply(job._id)}
                              className="apply-recommended-btn"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Apply Now
                            </button>
                          ) : (
                            <span className="applied-badge-small">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {aiRecommendedJobs.length > 6 && (
                  <div className="view-all-recommendations">
                    <button
                      onClick={() => setShowRecommendations(false)}
                      className="view-all-btn"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View All {aiRecommendedJobs.length} Recommendations
                    </button>
                  </div>
                )}
              </div>
            )}

            {showRecommendations && aiRecommendedJobs.length === 0 && !loadingRecommendations && (
              <div className="no-recommendations">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <h3>No Resume Found</h3>
                <p>To get personalized AI job recommendations, you need to upload your resume first. Our AI will analyze your skills, experience, and qualifications to find the best job matches for you.</p>
                <div className="no-resume-actions">
                  <button
                    onClick={() => navigate('/uploadresume')}
                    className="upload-resume-btn primary"
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                    Upload Resume
                  </button>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="upload-resume-btn secondary"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="search-filters-section">
          <h2 className="search-section-title">Advanced Job Search</h2>
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <FontAwesomeIcon icon={faBriefcase} />
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="filter-group">
              <FontAwesomeIcon icon={faGraduationCap} />
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Fields</option>
                <option value="Technology & IT">Technology & IT</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Healthcare & Medical">Healthcare & Medical</option>
                <option value="Education & Training">Education & Training</option>
                <option value="Engineering">Engineering</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Operations & Management">Operations & Management</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Administration">Administration</option>
                <option value="Consulting">Consulting</option>
                <option value="Media & Communications">Media & Communications</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Logistics">Logistics & Supply Chain</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Non-Profit">Non-Profit & Social Impact</option>
                <option value="Government">Government & Public Sector</option>
                <option value="Startup">Startup & Entrepreneurship</option>
                <option value="Internship">Student & Internship</option>
              </select>
            </div>

            <div className="filter-group">
              <FontAwesomeIcon icon={faChartLine} />
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry Level (0-1 years)</option>
                <option value="mid">Mid Level (2-4 years)</option>
                <option value="senior">Senior Level (5-9 years)</option>
                <option value="executive">Executive (10+ years)</option>
              </select>
            </div>

            <div className="filter-group">
              <FontAwesomeIcon icon={faSort} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="relevance">Best Match</option>
                <option value="date">Latest Jobs</option>
                <option value="salary">Highest Salary</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>{filteredJobs.length} jobs found</p>
          {userId && (
            <div className="user-actions">
              <button 
                onClick={() => navigate('/appliedjobs')}
                className="view-applied-btn"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                View Applied Jobs
              </button>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="job-listings">
          {loading ? (
            <JobCardSkeleton count={6} />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <div className="job-title-section">
                    <h3 onClick={() => viewJobDetails(job)} className="job-title">
                      {job.job_title}
                    </h3>
                    <div className="company-info">
                      <FontAwesomeIcon icon={faBuilding} />
                      <span>{job.company_name}</span>
                    </div>
                  </div>
                  
                  <div className="job-actions">
                    <button
                      onClick={() => toggleFavorite(job._id)}
                      className={`favorite-btn ${favoriteJobs.has(job._id) ? 'favorited' : ''}`}
                      title={favoriteJobs.has(job._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    
                    {!appliedJobs.has(job._id) ? (
                      <button
                        onClick={() => handleApply(job._id)}
                        className="apply-btn"
                        disabled={loadingMatch[job._id]}
                      >
                        {loadingMatch[job._id] ? 'Calculating...' : 'Apply Now'}
                      </button>
                    ) : (
                      <span className="applied-badge">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="job-details-row">
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{job.job_type}</span>
                  </div>
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>{job.remote_option}</span>
                  </div>
                  <div className="job-detail">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    <span>{job.salary_range || 'Salary not specified'}</span>
                  </div>
                </div>

                <div className="job-description">
                  <p>{job.description?.substring(0, 200)}...</p>
                </div>

                <div className="job-requirements">
                  <div className="requirement">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span><strong>Education:</strong> {job.education_required}</span>
                  </div>
                  <div className="requirement">
                    <FontAwesomeIcon icon={faBriefcase} />
                    <span><strong>Experience:</strong> {job.experience_required}</span>
                  </div>
                  <div className="requirement">
                    <FontAwesomeIcon icon={faStar} />
                    <span><strong>Skills:</strong> {job.required_skills}</span>
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="match-score-section">
                    {matchScores[job._id] !== undefined ? (
                      <div className="match-score">
                        <span className="score-label">Match Score:</span>
                        <span 
                          className="score-value"
                          style={{ color: getMatchScoreColor(matchScores[job._id].score) }}
                        >
                          {matchScores[job._id].score.toFixed(1)}%
                        </span>
                        <span className="score-text">
                          {getMatchScoreText(matchScores[job._id].score)}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => calculateMatchScore(job._id)}
                        className="calculate-match-btn"
                        disabled={loadingMatch[job._id]}
                      >
                        {loadingMatch[job._id] ? (
                          <>
                            <div className="mini-spinner"></div>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faChartLine} />
                            Calculate Match Score
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="view-details-section">
                    <button
                      onClick={() => viewJobDetails(job)}
                      className="view-details-btn"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View Full Details
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-jobs-found">
              <FontAwesomeIcon icon={faSearch} />
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="job-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedJob.job_title}</h2>
              <button 
                onClick={() => setShowJobDetails(false)}
                className="close-btn"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>

            <div className="modal-body">
              <div className="company-overview">
                <h3>Company Overview</h3>
                <div className="company-details">
                  <p><strong>Company:</strong> {selectedJob.company_name}</p>
                  <p><strong>Industry:</strong> {selectedJob.industry}</p>
                  <p><strong>Website:</strong> 
                    <a href={selectedJob.company_website} target="_blank" rel="noopener noreferrer">
                      {selectedJob.company_website}
                    </a>
                  </p>
                </div>
              </div>

              <div className="job-overview">
                <h3>Job Overview</h3>
                <div className="job-overview-grid">
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span><strong>Location:</strong> {selectedJob.location}</span>
                  </div>
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span><strong>Job Type:</strong> {selectedJob.job_type}</span>
                  </div>
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span><strong>Remote Option:</strong> {selectedJob.remote_option}</span>
                  </div>
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    <span><strong>Salary:</strong> {selectedJob.salary_range}</span>
                  </div>
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span><strong>Education:</strong> {selectedJob.education_required}</span>
                  </div>
                  <div className="overview-item">
                    <FontAwesomeIcon icon={faBriefcase} />
                    <span><strong>Experience:</strong> {selectedJob.experience_required}</span>
                  </div>
                </div>
              </div>

              <div className="job-description-full">
                <h3>Job Description</h3>
                <p>{selectedJob.description}</p>
              </div>

              <div className="key-responsibilities">
                <h3>Key Responsibilities</h3>
                <div className="responsibilities-list">
                  {(() => {
                    let responsibilities = [];
                    if (selectedJob.responsibilities) {
                      if (typeof selectedJob.responsibilities === 'string') {
                        responsibilities = selectedJob.responsibilities.split('\n');
                      } else if (Array.isArray(selectedJob.responsibilities)) {
                        responsibilities = selectedJob.responsibilities;
                      }
                    }
                    return responsibilities.map((resp, index) => (
                      <div key={index} className="responsibility-item">
                        <FontAwesomeIcon icon={faArrowRight} />
                        <span>{typeof resp === 'string' ? resp.trim() : String(resp)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="required-skills">
                <h3>Required Skills</h3>
                <div className="skills-tags">
                  {(() => {
                    let skills = [];
                    if (selectedJob.required_skills) {
                      if (typeof selectedJob.required_skills === 'string') {
                        skills = selectedJob.required_skills.split(',');
                      } else if (Array.isArray(selectedJob.required_skills)) {
                        skills = selectedJob.required_skills;
                      }
                    }
                    return skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {typeof skill === 'string' ? skill.trim() : String(skill)}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              <div className="application-deadline">
                <h3>Application Deadline</h3>
                <p>{new Date(selectedJob.application_deadline).toLocaleDateString()}</p>
              </div>

              {/* Match Score Section */}
              <div className="match-analysis-section">
                <h3>Your Match Analysis</h3>
                {matchScores[selectedJob._id] !== undefined ? (
                  <div className="match-analysis">
                    <div className="match-score-display">
                      <div className="score-circle">
                        <span className="score-number">{matchScores[selectedJob._id].score.toFixed(1)}%</span>
                        <span className="score-label">Match Score</span>
                      </div>
                      <div className="score-breakdown">
                        <h4>{getMatchScoreText(matchScores[selectedJob._id].score)}</h4>
                        <p>This score is based on your resume analysis and the job requirements.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="calculate-match-prompt">
                    <FontAwesomeIcon icon={faChartLine} />
                    <p>Calculate your match score to see how well you fit this position</p>
                    <button
                      onClick={() => calculateMatchScore(selectedJob._id)}
                      className="calculate-match-btn-large"
                      disabled={loadingMatch[selectedJob._id]}
                    >
                      {loadingMatch[selectedJob._id] ? 'Calculating...' : 'Calculate Match Score'}
                    </button>
                  </div>
                )}
              </div>

              {/* Improvement Suggestions */}
              <div className="improvement-suggestions">
                <h3>
                  <FontAwesomeIcon icon={faLightbulb} />
                  AI-Powered Improvement Suggestions
                </h3>
                
                {/* AI-Generated Suggestions */}
                {matchScores[selectedJob._id] !== undefined && (
                  <div className="ai-suggestions">
                    <h4>🎯 Personalized Recommendations</h4>
                    <div className="suggestions-list">
                      {(() => {
                        // Get AI-generated suggestions if available
                        const aiSuggestions = [];
                        if (matchScores[selectedJob._id] && matchScores[selectedJob._id].aiSuggestions) {
                          aiSuggestions.push(...matchScores[selectedJob._id].aiSuggestions);
                        }
                        
                        // Fallback to generic suggestions if no AI suggestions
                        if (aiSuggestions.length === 0) {
                          return getImprovementSuggestions(selectedJob).map((suggestion, index) => (
                            <div key={index} className="suggestion-item">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              <span>{suggestion}</span>
                            </div>
                          ));
                        }
                        
                        return aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="suggestion-item ai-suggestion">
                            <FontAwesomeIcon icon={faRobot} />
                            <span>{suggestion}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}
                
                {/* Resume Improvement Services */}
                <div className="resume-services-section">
                  <h4>📝 Resume Enhancement Services</h4>
                  <div className="resume-services-grid">
                    <div className="resume-service-card">
                      <div className="service-icon">
                        <FontAwesomeIcon icon={faFileAlt} />
                      </div>
                      <h5>Resume Review & Optimization</h5>
                      <p>Get your resume professionally reviewed and optimized for this specific job role</p>
                      <button className="service-btn">Get Started</button>
                    </div>
                    
                    <div className="resume-service-card">
                      <div className="service-icon">
                        <FontAwesomeIcon icon={faSearch} />
                      </div>
                      <h5>Keyword Optimization</h5>
                      <p>Optimize your resume with the exact keywords from this job posting</p>
                      <button className="service-btn">Optimize Now</button>
                    </div>
                    
                    <div className="resume-service-card">
                      <div className="service-icon">
                        <FontAwesomeIcon icon={faChartLine} />
                      </div>
                      <h5>ATS-Friendly Formatting</h5>
                      <p>Ensure your resume passes Applicant Tracking Systems</p>
                      <button className="service-btn">Format Resume</button>
                    </div>
                    
                    <div className="resume-service-card">
                      <div className="service-icon">
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                      <h5>Professional Rewriting</h5>
                      <p>Get your resume professionally rewritten to highlight relevant achievements</p>
                      <button className="service-btn">Rewrite Resume</button>
                    </div>
                  </div>
                </div>
                
                {/* Quick Resume Tips */}
                <div className="quick-resume-tips">
                  <h4>💡 Quick Resume Improvement Tips</h4>
                  <div className="tips-grid">
                    <div className="tip-item">
                      <FontAwesomeIcon icon={faBullseye} />
                      <span>Use action verbs like "achieved," "developed," "implemented"</span>
                    </div>
                    <div className="tip-item">
                      <FontAwesomeIcon icon={faHashtag} />
                      <span>Include specific numbers and metrics for achievements</span>
                    </div>
                    <div className="tip-item">
                      <FontAwesomeIcon icon={faCheckDouble} />
                      <span>Match your skills section to the job requirements</span>
                    </div>
                    <div className="tip-item">
                      <FontAwesomeIcon icon={faUserTie} />
                      <span>Add a compelling professional summary at the top</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  onClick={() => toggleFavorite(selectedJob._id)}
                  className={`favorite-btn-large ${favoriteJobs.has(selectedJob._id) ? 'favorited' : ''}`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  {favoriteJobs.has(selectedJob._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                {!appliedJobs.has(selectedJob._id) ? (
                  <button
                    onClick={() => {
                      handleApply(selectedJob._id);
                      setShowJobDetails(false);
                    }}
                    className="apply-btn-large"
                  >
                    Apply for This Position
                  </button>
                ) : (
                  <span className="applied-badge-large">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Already Applied
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
