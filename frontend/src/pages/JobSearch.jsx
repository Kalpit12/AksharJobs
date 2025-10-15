import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
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
  faUserTie,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "../styles/JobSearch.css";
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import { formatSalary, getUserCountry } from '../utils/currencyUtils';
import ModernJobDetailsModal from '../components/ModernJobDetailsModal';
import CommunitySelector from '../components/CommunitySelector';
import CommunityApi from '../api/communityApi';

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
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [communities, setCommunities] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJobs();
    fetchCommunities();
    if (userId) {
      fetchAppliedJobs();
      fetchFavorites();
      fetchUserCommunities();
    }
  }, [userId]);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, experienceFilter, fieldFilter, sortBy, selectedCommunities]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Use the new endpoint that filters jobs by user's communities
      const url = userId 
        ? buildApiUrl(`/api/jobs/get_jobs_for_user?userId=${userId}`)
        : buildApiUrl("/api/jobs/get_jobs");
      const response = await axios.get(url);
      setJobs(response.data || []);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await CommunityApi.getAllCommunities();
      if (response.success) {
        setCommunities(response.communities || []);
      }
    } catch (err) {
      console.error("Error fetching communities:", err);
    }
  };

  const fetchUserCommunities = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${userId}`));
      if (response.data) {
        setUserCommunities(response.data.communities || []);
        // Set default selected communities to user's communities
        if (response.data.communities && response.data.communities.length > 0) {
          setSelectedCommunities(response.data.communities);
        }
      }
    } catch (err) {
      console.error("Error fetching user communities:", err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, skipping applied jobs fetch");
        return;
      }

      const response = await axios.get(buildApiUrl(`/api/applications/my-applications`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        // Our endpoint returns an array of applications directly
        const appliedJobIds = new Set(response.data.map(app => app.job_id));
        setAppliedJobs(appliedJobIds);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      // Don't show error to user for this - it's not critical
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

    // Community filter
    if (selectedCommunities.length > 0) {
      filtered = filtered.filter(job => {
        // If job targets all communities, show it
        if (job.all_communities) {
          return true;
        }
        
        // If job has specific target communities, check if any match selected communities
        if (job.target_communities && job.target_communities.length > 0) {
          return job.target_communities.some(communityId => 
            selectedCommunities.includes(communityId)
          );
        }
        
        // If no community targeting specified, show the job (backward compatibility)
        return true;
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
    
  // Debug: Log current user info
  console.log('🎯 Match Score Debug:', {
    userId: userId,
    jobId: jobId,
    userEmail: localStorage.getItem('userEmail'),
    userFirstName: localStorage.getItem('userFirstName'),
    userLastName: localStorage.getItem('userLastName'),
    hasToken: !!localStorage.getItem('token')
  });
  
  // Show user info in console for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('👤 Current User Info:', {
      id: userId,
      email: localStorage.getItem('userEmail'),
      name: `${localStorage.getItem('userFirstName')} ${localStorage.getItem('userLastName')}`,
      role: localStorage.getItem('role')
    });
  }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token available for match score calculation');
        return;
      }

      // Call the backend API to get consistent match score
      console.log(`🔗 Calling API: /api/applications/match-score/${jobId}`);
      const response = await axios.get(
        buildApiUrl(`/api/applications/match-score/${jobId}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('📊 API Response:', response.data);
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Headers:', response.headers);

      if (response.status === 200 && response.data.match_data) {
        const matchData = response.data.match_data;
        
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: Math.round(matchData.final_score || 0),
            cached: matchData.cached || false,
            aiSuggestions: [
              "Your skills match analysis is based on AI evaluation",
              "Match score is calculated using advanced algorithms",
              "This score is consistent and cached for reliability"
            ]
          }
        }));
        
        console.log(`✅ Match score for job ${jobId}: ${matchData.final_score}% (cached: ${matchData.cached})`);
      } else {
        console.log('❌ API response missing match_data:', response.data);
        
        // Set a fallback score to show something
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: 0,
            cached: false,
            apiError: true,
            aiSuggestions: [
              "API response was missing match data",
              "This might be a backend configuration issue",
              "Please contact support if this persists"
            ]
          }
        }));
      }
    } catch (err) {
      console.error("Error calculating match score:", err);
      console.error("Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      // Check for specific error types
      const errorMessage = err.response?.data?.error || err.message || '';
      
      if (errorMessage.includes('No resume found')) {
        console.log(`❌ No resume found for user ${userId}, showing upload message for job ${jobId}`);
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: 0,
            cached: false,
            noResume: true,
            aiSuggestions: [
              "Upload your resume to get an accurate match score",
              "Match scores require resume data for calculation",
              "Complete your profile to see job compatibility"
            ]
          }
        }));
        return;
      }
      
      if (errorMessage.includes('User not found') || errorMessage.includes('No user found')) {
        console.log(`❌ User not found in database for user ${userId}`);
        console.log(`🔧 This might be an OAuth user who needs profile completion`);
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: 0,
            cached: false,
            userNotFound: true,
            aiSuggestions: [
              "Complete your profile setup first",
              "Upload your resume to enable match scoring",
              "Your OAuth account needs profile completion"
            ]
          }
        }));
        return;
      }
      
      // Check for authentication errors
      if (err.response?.status === 401) {
        console.log(`❌ Authentication error for user ${userId}`);
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: 0,
            cached: false,
            authError: true,
            aiSuggestions: [
              "Please log in again to see match scores",
              "Your session may have expired",
              "Try refreshing the page"
            ]
          }
        }));
        return;
      }
      
      // Fallback: try to get score from existing applications
      try {
        const applicationsResponse = await axios.get(
          buildApiUrl("/api/applications/my-applications"),
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const existingApp = applicationsResponse.data.find(app => 
          app.jobId === jobId || app.job_id === jobId
        );
        
        if (existingApp && existingApp.final_score) {
          setMatchScores(prev => ({ 
            ...prev, 
            [jobId]: {
              score: Math.round(existingApp.final_score),
              cached: true,
              aiSuggestions: [
                "Match score retrieved from your application history",
                "This is your actual AI-calculated compatibility score"
              ]
            }
          }));
        } else {
          // No existing application found, show placeholder
          setMatchScores(prev => ({ 
            ...prev, 
            [jobId]: {
              score: 0,
              cached: false,
              noData: true,
              aiSuggestions: [
                "Upload your resume to get a personalized match score",
                "Match scores help you find the best job opportunities",
                "Complete your profile for better job matching"
              ]
            }
          }));
        }
      } catch (fallbackErr) {
        console.error("Fallback match score retrieval failed:", fallbackErr);
        // Final fallback - show placeholder with helpful message
        setMatchScores(prev => ({ 
          ...prev, 
          [jobId]: {
            score: 0,
            cached: false,
            error: true,
            aiSuggestions: [
              "Unable to calculate match score at this time",
              "Please ensure you have uploaded your resume",
              "Try refreshing the page or contact support"
            ]
          }
        }));
      }
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
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to apply for jobs");
        navigate('/login');
        return;
      }

      // Submit the job application with JWT token
      const processResponse = await axios.post(buildApiUrl("/api/applications/apply"), {
        job_id: jobId,
        cover_letter: "I am interested in this position and would like to be considered for the role."
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (processResponse.status === 201) {
        setAppliedJobs(prev => new Set([...prev, jobId]));
        alert("Application submitted successfully!");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      } else if (err.response?.status === 400 && err.response?.data?.error?.includes("already applied")) {
        alert("You have already applied for this job.");
        setAppliedJobs(prev => new Set([...prev, jobId]));
      } else if (err.response?.status === 402) {
        // Payment required - PROMOCODE SYSTEM TEMPORARILY DEACTIVATED
        const errorData = err.response.data;
        // For now, just show a simple message without promocode redirect
        alert("Application processing temporarily disabled. Please contact support if you need assistance.");
      } else {
        alert("Failed to apply for job. Please try again.");
      }
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
    // Navigate to the dedicated job details page
    navigate(`/job-details/${job._id}`);
  };

  const viewJobDetailsModal = (job) => {
    // For quick preview in modal (optional alternative)
    setSelectedJob(job);
    setShowJobDetails(true);
    if (!matchScores[job._id]) {
      calculateMatchScore(job._id);
    }
  };

  const getMatchScoreColor = (score, matchData = null) => {
    // Special cases for no data scenarios
    if (matchData && (matchData.noResume || matchData.userNotFound || matchData.noData || matchData.authError || matchData.apiError || matchData.error)) {
      return "#8B5CF6"; // Purple color to indicate action needed
    }
    
    // Regular score-based colors
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#EF4444";
    if (score === 0) return "#8B5CF6"; // Purple for "upload resume"
    return "#6B7280";
  };

  const getMatchScoreText = (score, matchData = null) => {
    // Check if this is a special case (no resume, no data, etc.)
    if (matchData) {
      if (matchData.noResume) return "Upload Resume";
      if (matchData.userNotFound) return "Complete Setup";
      if (matchData.noData) return "Complete Profile";
      if (matchData.authError) return "Login Required";
      if (matchData.apiError) return "API Error";
      if (matchData.error) return "Unable to Calculate";
    }
    
    // Regular score-based text
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    if (score === 0) return "Upload Resume";
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
            <ModernLoadingSpinner
              type="spinner"
              size="large"
              text="Finding amazing opportunities for you..."
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

          {/* Community Filter */}
          <div className="community-filter-section">
            <h3 className="community-filter-title">
              <FontAwesomeIcon icon={faUsers} />
              Filter by Religious/Ethnic Communities
            </h3>
            <div className="community-filter-content">
              <CommunitySelector
                selectedCommunities={selectedCommunities}
                onSelectionChange={setSelectedCommunities}
                multiple={true}
                showDescription={true}
                placeholder="Select religious/ethnic communities to see relevant jobs..."
              />
              {userCommunities.length > 0 && (
                <div className="user-communities-info">
                  <span className="info-icon">💡</span>
                  <span>Your communities: {userCommunities.map(id => {
                    const community = communities.find(c => c._id === id);
                    return community ? community.name : '';
                  }).filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>{filteredJobs.length} jobs found</p>
          {userId && (
            <div className="user-actions">
              <button 
                onClick={() => navigate('/application-tracker')}
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
                    <h3 onClick={() => viewJobDetails(job)} className="job-title" title="Click to view full details">
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
                    <span>{formatSalary(job.salary_range, getUserCountry())}</span>
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
                          style={{ color: getMatchScoreColor(matchScores[job._id].score, matchScores[job._id]) }}
                        >
                          {matchScores[job._id].score === 0 && (matchScores[job._id].noResume || matchScores[job._id].noData) 
                            ? "—" 
                            : `${matchScores[job._id].score.toFixed(1)}%`
                          }
                        </span>
                        <span className="score-text">
                          {getMatchScoreText(matchScores[job._id].score, matchScores[job._id])}
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
                      onClick={() => viewJobDetailsModal(job)}
                      className="quick-preview-btn"
                      title="Quick preview in modal"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      Quick Preview
                    </button>
                    
                    <button
                      onClick={() => viewJobDetails(job)}
                      className="view-details-btn"
                      title="View full details page"
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      View Full Details
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

      {/* Modern Job Details Modal */}
      <ModernJobDetailsModal
        job={selectedJob}
        isOpen={showJobDetails}
        onClose={() => setShowJobDetails(false)}
        matchScore={selectedJob ? matchScores[selectedJob._id] : undefined}
        onApply={handleApply}
        onCalculateMatch={calculateMatchScore}
        isApplied={selectedJob ? appliedJobs.has(selectedJob._id) : false}
        isCalculatingMatch={selectedJob ? loadingMatch[selectedJob._id] : false}
      />
    </div>
  );
};

export default JobSearch;