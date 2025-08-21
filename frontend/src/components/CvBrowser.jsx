import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faDownload, 
  faStar,
  faMapMarkerAlt,
  faGraduationCap,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import '../styles/CvBrowser.css';

const CvBrowser = () => {
  const [cvs, setCvs] = useState([]);
  const [filteredCvs, setFilteredCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experience: '',
    location: '',
    skills: '',
    education: ''
  });
  const [viewCount, setViewCount] = useState(0);
  const [maxViews, setMaxViews] = useState(100); // This would come from user's plan

  useEffect(() => {
    fetchCvs();
    fetchUserLimits();
  }, []);

  useEffect(() => {
    filterCvs();
  }, [searchTerm, filters, cvs]);

  const fetchCvs = async () => {
    try {
      // This would be the actual API call to get available CVs
      // For now, using mock data
      const mockCvs = [
        {
          id: 1,
          name: 'John Doe',
          title: 'Senior Software Engineer',
          experience: '5+ years',
          location: 'Nairobi, Kenya',
          skills: ['React', 'Node.js', 'Python', 'MongoDB'],
          education: 'BSc Computer Science',
          matchScore: 95,
          lastActive: '2 days ago'
        },
        {
          id: 2,
          name: 'Jane Smith',
          title: 'Product Manager',
          experience: '3+ years',
          location: 'Mombasa, Kenya',
          skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
          education: 'MBA Business Administration',
          matchScore: 88,
          lastActive: '1 week ago'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          title: 'Data Scientist',
          experience: '4+ years',
          location: 'Kisumu, Kenya',
          skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
          education: 'MSc Data Science',
          matchScore: 92,
          lastActive: '3 days ago'
        }
      ];
      
      setCvs(mockCvs);
      setFilteredCvs(mockCvs);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLimits = async () => {
    try {
      // This would fetch the user's CV access limits from their subscription
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/user/cv-limits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setViewCount(data.viewCount || 0);
        setMaxViews(data.maxViews || 100);
      }
    } catch (error) {
      console.error('Error fetching user limits:', error);
    }
  };

  const filterCvs = () => {
    let filtered = cvs.filter(cv => {
      const matchesSearch = cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesExperience = !filters.experience || cv.experience.includes(filters.experience);
      const matchesLocation = !filters.location || cv.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesSkills = !filters.skills || cv.skills.some(skill => skill.toLowerCase().includes(filters.skills.toLowerCase()));
      const matchesEducation = !filters.education || cv.education.toLowerCase().includes(filters.education.toLowerCase());
      
      return matchesSearch && matchesExperience && matchesLocation && matchesSkills && matchesEducation;
    });
    
    setFilteredCvs(filtered);
  };

  const handleCvView = async (cvId) => {
    if (viewCount >= maxViews) {
      alert('You have reached your CV view limit for this month. Please upgrade your plan for unlimited access.');
      return;
    }

    try {
      // This would be the actual API call to view a CV
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/api/cvs/${cvId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setViewCount(prev => prev + 1);
        alert('CV viewed successfully!');
      }
    } catch (error) {
      console.error('Error viewing CV:', error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <div className="cv-browser-loading">Loading available CVs...</div>;
  }

  return (
    <div className="cv-browser">
      <div className="cv-browser-header">
        <h2>📄 Available CVs</h2>
        <div className="cv-usage-info">
          <span className="usage-text">
            Views used: {viewCount} / {maxViews}
          </span>
          <div className="usage-bar">
            <div 
              className="usage-progress" 
              style={{ width: `${(viewCount / maxViews) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="cv-search-filters">
        <div className="search-section">
          <div className="search-input">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Experience</label>
            <select 
              value={filters.experience} 
              onChange={(e) => updateFilter('experience', e.target.value)}
            >
              <option value="">All Experience</option>
              <option value="1+">1+ years</option>
              <option value="3+">3+ years</option>
              <option value="5+">5+ years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="City, Country"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Skills</label>
            <input
              type="text"
              placeholder="e.g., React, Python"
              value={filters.skills}
              onChange={(e) => updateFilter('skills', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Education</label>
            <input
              type="text"
              placeholder="Degree, Field"
              value={filters.education}
              onChange={(e) => updateFilter('education', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="cv-results">
        <div className="results-header">
          <h3>Found {filteredCvs.length} CVs</h3>
          <div className="sort-options">
            <select>
              <option value="matchScore">Sort by Match Score</option>
              <option value="experience">Sort by Experience</option>
              <option value="lastActive">Sort by Last Active</option>
            </select>
          </div>
        </div>

        <div className="cv-grid">
          {filteredCvs.map(cv => (
            <div key={cv.id} className="cv-card">
              <div className="cv-header">
                <div className="cv-title">
                  <h4>{cv.name}</h4>
                  <p className="cv-role">{cv.title}</p>
                </div>
                <div className="cv-match-score">
                  <span className="score">{cv.matchScore}%</span>
                  <span className="score-label">Match</span>
                </div>
              </div>

              <div className="cv-details">
                <div className="cv-info">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <span>{cv.experience}</span>
                </div>
                <div className="cv-info">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{cv.location}</span>
                </div>
                <div className="cv-info">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <span>{cv.education}</span>
                </div>
              </div>

              <div className="cv-skills">
                {cv.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>

              <div className="cv-footer">
                <span className="last-active">Active: {cv.lastActive}</span>
                <div className="cv-actions">
                  <button 
                    className="view-cv-btn"
                    onClick={() => handleCvView(cv.id)}
                    disabled={viewCount >= maxViews}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View CV
                  </button>
                  <button className="save-cv-btn">
                    <FontAwesomeIcon icon={faStar} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewCount >= maxViews && (
        <div className="limit-warning">
          <h4>⚠️ CV View Limit Reached</h4>
          <p>You have reached your monthly CV view limit. Upgrade your plan to access unlimited CVs.</p>
          <button className="upgrade-btn">Upgrade Plan</button>
        </div>
      )}
    </div>
  );
};

export default CvBrowser;
