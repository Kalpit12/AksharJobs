import React, { useState, useEffect } from "react";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import CommunitySelector from "./CommunitySelector";
import CommunityApi from "../api/communityApi";
import "../styles/CVBrowser.css";

const CVBrowser = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    skills: "",
    education: ""
  });
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [sortBy, setSortBy] = useState("matchScore");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [downloadingCv, setDownloadingCv] = useState({});
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Only fetch candidates if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      fetchCommunities();
      fetchCandidates();
    } else {
      setError("Please log in to view candidates");
      setLoading(false);
    }
  }, []);

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

  const fetchCandidates = async (isRetry = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      // Use the new candidates endpoint
      const response = await axios.get(
        buildApiUrl("/api/candidates/all"),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // The data is already in the correct format from the new endpoint
      const candidatesData = response.data.candidates || [];
      setCandidates(candidatesData);
      setError(null); // Clear any previous errors
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Error fetching candidates:", err);
      
      // Retry logic for network errors
      if ((err.code === 'NETWORK_ERROR' || err.message === 'Network Error' || err.code === 'ERR_FAILED') && retryCount < 3 && !isRetry) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchCandidates(true);
        }, 1000 * retryCount); // Exponential backoff
        return;
      }
      
      if (err.response?.status === 401) {
        setError("Authentication expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to view candidates.");
      } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error' || err.code === 'ERR_FAILED') {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to fetch candidates. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const filteredCandidates = candidates.filter(candidate => {
    try {
      const name = safeString(candidate.name);
      const skills = safeString(candidate.skills);
      const experience = safeString(candidate.experience);
      const location = safeString(candidate.location);
      const education = safeString(candidate.education);
      
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           experience.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filters.location || location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesExperience = !filters.experience || experience.toLowerCase().includes(filters.experience.toLowerCase());
      const matchesSkills = !filters.skills || skills.toLowerCase().includes(filters.skills.toLowerCase());
      const matchesEducation = !filters.education || education.toLowerCase().includes(filters.education.toLowerCase());

      // Community filtering
      const matchesCommunity = selectedCommunities.length === 0 || 
        candidate.communities?.some(communityId => selectedCommunities.includes(communityId)) ||
        candidate.primary_community && selectedCommunities.includes(candidate.primary_community);

      return matchesSearch && matchesLocation && matchesExperience && matchesSkills && matchesEducation && matchesCommunity;
    } catch (error) {
      console.error('Error filtering candidate:', candidate, error);
      return false;
    }
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "matchScore":
        return (b.matchScore || 0) - (a.matchScore || 0);
      case "experience":
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const downloadCV = async (candidate) => {
    if (!candidate.cvId && !candidate.cvUrl) {
      alert("No CV available for this candidate");
      return;
    }

    const candidateId = candidate.id;
    setDownloadingCv(prev => ({ ...prev, [candidateId]: true }));

    try {
      const token = localStorage.getItem('token');
      let downloadUrl;

      if (candidate.cvUrl) {
        // Direct URL to CV
        downloadUrl = candidate.cvUrl;
      } else if (candidate.cvId) {
        // Fetch CV using ID
        const response = await axios.get(
          buildApiUrl(`/api/modern-resumes/download/${candidate.cvId}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.downloadUrl) {
          downloadUrl = response.data.downloadUrl;
        } else {
          throw new Error("No download URL received");
        }
      }

      if (downloadUrl) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${candidate.name}_CV.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please try again.");
    } finally {
      setDownloadingCv(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="cv-browser-loading">
        <div className="loading-spinner"></div>
        <p>Loading CVs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cv-browser-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => fetchCandidates()} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="cv-browser">
      {/* Search and Filters */}
      <div className="browser-header">
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search CVs by name, skills, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g., Nairobi"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Experience</label>
            <input
              type="text"
              placeholder="e.g., 3 years"
              value={filters.experience}
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Skills</label>
            <input
              type="text"
              placeholder="e.g., React, Python"
              value={filters.skills}
              onChange={(e) => handleFilterChange("skills", e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Education</label>
            <input
              type="text"
              placeholder="e.g., Computer Science"
              value={filters.education}
              onChange={(e) => handleFilterChange("education", e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Communities</label>
            <CommunitySelector
                selectedCommunities={selectedCommunities}
                onSelectionChange={setSelectedCommunities}
                multiple={true}
                showDescription={false}
                placeholder="Filter by religious/ethnic communities..."
                className="compact"
            />
          </div>
        </div>

        <div className="sort-section">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="matchScore">Match Score</option>
            <option value="experience">Experience</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Found {filteredCandidates.length} CVs</p>
      </div>

      {/* CVs Grid */}
      <div className="cvs-grid">
        {sortedCandidates.map((candidate, index) => (
          <div key={candidate.id || index} className="cv-card">
            <div className="cv-header">
              <div className="cv-avatar">
                <img 
                  src={candidate.avatar || '/default-avatar.png'} 
                  alt={safeString(candidate.name)}
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="cv-info">
                <h3>{safeString(candidate.name)}</h3>
                <p className="cv-title">{safeString(candidate.title)}</p>
                <p className="cv-location">{safeString(candidate.location)}</p>
              </div>
            </div>

            <div className="cv-summary">
              <div className="summary-item">
                <span className="summary-label">Experience:</span>
                <span className="summary-value">{safeString(candidate.experience)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Key Skills:</span>
                <span className="summary-value">{safeString(candidate.skills)}</span>
              </div>
            </div>

            <div className="cv-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => setSelectedCandidate(candidate)}
              >
                View Profile
              </button>
              {(candidate.cvId || candidate.cvUrl) && (
                <button 
                  className="action-btn cv-btn"
                  onClick={() => downloadCV(candidate)}
                  disabled={downloadingCv[candidate.id] === true}
                >
                  {downloadingCv[candidate.id] === true ? 'Downloading...' : 'Download CV'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CV Detail Modal */}
      {selectedCandidate && (
        <div className="cv-modal-overlay">
          <div className="cv-modal">
            <div className="modal-header">
              <h2>{safeString(selectedCandidate.name)} - Profile & Resume</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedCandidate(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="cv-profile">
                <div className="profile-header">
                  <img 
                    src={selectedCandidate.avatar || '/default-avatar.png'} 
                    alt={safeString(selectedCandidate.name)}
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h3>{safeString(selectedCandidate.name)}</h3>
                    <p className="profile-title">{safeString(selectedCandidate.title)}</p>
                    <p className="profile-location">{safeString(selectedCandidate.location)}</p>
                  </div>
                </div>
                
                <div className="profile-details">
                  <div className="detail-section">
                    <h4>Professional Experience</h4>
                    <p>{safeString(selectedCandidate.experience)}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Technical Skills</h4>
                    <p>{safeString(selectedCandidate.skills)}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Education</h4>
                    <p>{safeString(selectedCandidate.education)}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>About</h4>
                    <p>{safeString(selectedCandidate.bio)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              {(selectedCandidate.cvId || selectedCandidate.cvUrl) && (
                <button 
                  className="action-btn cv-btn primary"
                  onClick={() => downloadCV(selectedCandidate)}
                  disabled={downloadingCv[selectedCandidate.id] === true}
                >
                  {downloadingCv[selectedCandidate.id] === true ? 'Downloading...' : 'Download Resume'}
                </button>
              )}
              <button 
                className="action-btn close-btn"
                onClick={() => setSelectedCandidate(null)}
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

export default CVBrowser;
