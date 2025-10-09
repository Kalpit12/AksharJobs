import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faBriefcase, 
  faLightbulb,
  faMapMarkerAlt,
  faClock,
  faDollarSign,
  faHeart,
  faBuilding,
  faStar,
  faChartLine,
  faBookmark,
  faFilter,
  faBell,
  faUser,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import Header from '../components/Header';
import { FadeInUp, SlideIn } from '../components/animations';
import { motion } from 'framer-motion';
import AIProjectRecommender from '../components/AIProjectRecommender';
import AILearningPathGenerator from '../components/AILearningPathGenerator';
import '../styles/InternDashboard.css';

const InternDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [internData, setInternData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchInternData();
    fetchRecommendations();
    fetchSavedInternships();
  }, []);

  const fetchInternData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/interns/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInternData(data);
      }
    } catch (error) {
      console.error('Error fetching intern data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/interns/recommendations'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchSavedInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/interns/saved'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedInternships(data.saved || []);
      }
    } catch (error) {
      console.error('Error fetching saved internships:', error);
    }
  };

  const handleSaveInternship = async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/interns/save/${internshipId}`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchSavedInternships();
      }
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const calculateMatchScore = (internship) => {
    // AI-based matching algorithm simulation
    let score = 0;
    
    // Match based on skills
    if (internData?.technicalSkills) {
      const matchedSkills = internship.requiredSkills?.filter(skill => 
        internData.technicalSkills.includes(skill)
      ).length || 0;
      score += (matchedSkills / (internship.requiredSkills?.length || 1)) * 40;
    }

    // Match based on location preference
    if (internData?.currentLocation === internship.location || internData?.willingToRelocate === 'Yes') {
      score += 20;
    }

    // Match based on work domains
    if (internData?.workDomains?.includes(internship.domain)) {
      score += 20;
    }

    // Match based on internship type
    if (internData?.internshipType?.includes(internship.type)) {
      score += 20;
    }

    return Math.min(Math.round(score), 100);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#4299e1';
    if (score >= 40) return '#ed8936';
    return '#f56565';
  };

  const InternshipCard = ({ internship }) => {
    const matchScore = calculateMatchScore(internship);
    const isSaved = savedInternships.some(s => s.id === internship.id);

    return (
      <motion.div 
        className="internship-card"
        whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-header">
          <div className="company-logo">
            {internship.companyLogo ? (
              <img src={internship.companyLogo} alt={internship.company} />
            ) : (
              <div className="logo-placeholder">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
            )}
          </div>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => handleSaveInternship(internship.id)}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>

        <div className="card-content">
          <h3 className="internship-title">{internship.title}</h3>
          <p className="company-name">
            <FontAwesomeIcon icon={faBuilding} />
            {internship.company}
          </p>

          <div className="internship-details">
            <span className="detail-badge">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {internship.location}
            </span>
            <span className="detail-badge">
              <FontAwesomeIcon icon={faClock} />
              {internship.duration}
            </span>
            {internship.stipend && (
              <span className="detail-badge stipend">
                <FontAwesomeIcon icon={faDollarSign} />
                {internship.stipend}
              </span>
            )}
          </div>

          <div className="skills-tags">
            {internship.requiredSkills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {internship.requiredSkills?.length > 3 && (
              <span className="skill-tag more">+{internship.requiredSkills.length - 3} more</span>
            )}
          </div>

          <div className="match-score">
            <div className="score-label">AI Match Score</div>
            <div 
              className="score-value" 
              style={{ color: getMatchScoreColor(matchScore) }}
            >
              {matchScore}%
              <FontAwesomeIcon icon={faStar} className="star-icon" />
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${matchScore}%`,
                  background: getMatchScoreColor(matchScore)
                }}
              />
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button 
            className="apply-btn"
            onClick={() => navigate(`/internship/${internship.id}`)}
          >
            View Details
            <FontAwesomeIcon icon={faRocket} />
          </button>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="intern-dashboard-wrapper">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-container">
            <FadeInUp>
              <div className="welcome-section">
                <h1 className="welcome-title">
                  Welcome back, {internData?.fullName?.split(' ')[0] || 'Intern'}! 🎉
                </h1>
                <p className="welcome-subtitle">
                  We've found {recommendations.length} internship opportunities that match your profile
                </p>
              </div>
            </FadeInUp>

            {/* Stats Cards */}
            <div className="stats-grid">
              <SlideIn direction="up" delay={0.1}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#edf2f7' }}>
                    <FontAwesomeIcon icon={faLightbulb} style={{ color: '#667eea' }} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{recommendations.length}</h3>
                    <p className="stat-label">Recommendations</p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.2}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fef5e7' }}>
                    <FontAwesomeIcon icon={faBookmark} style={{ color: '#f39c12' }} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{savedInternships.length}</h3>
                    <p className="stat-label">Saved</p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.3}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                    <FontAwesomeIcon icon={faBriefcase} style={{ color: '#48bb78' }} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">0</h3>
                    <p className="stat-label">Applications</p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.4}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fce4ec' }}>
                    <FontAwesomeIcon icon={faChartLine} style={{ color: '#e91e63' }} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">85%</h3>
                    <p className="stat-label">Profile Score</p>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="ai-insights-section">
          <div className="container">
            <FadeInUp>
              <div className="insights-card">
                <div className="insights-header">
                  <FontAwesomeIcon icon={faLightbulb} className="insights-icon" />
                  <div>
                    <h2 className="insights-title">AI-Powered Insights</h2>
                    <p className="insights-subtitle">Personalized recommendations based on your profile</p>
                  </div>
                </div>
                <div className="insights-grid">
                  <div className="insight-item">
                    <h4>Top Strength</h4>
                    <p>{internData?.technicalSkills?.[0] || 'Technical Skills'}</p>
                  </div>
                  <div className="insight-item">
                    <h4>Best Match Domain</h4>
                    <p>{internData?.workDomains?.[0] || 'Your Selected Domain'}</p>
                  </div>
                  <div className="insight-item">
                    <h4>Recommended Action</h4>
                    <p>Apply to at least 3 high-match internships this week</p>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="ai-features-section">
          <div className="container">
            <FadeInUp>
              <AIProjectRecommender />
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <AILearningPathGenerator />
            </FadeInUp>
          </div>
        </section>

        {/* Main Content */}
        <section className="dashboard-main">
          <div className="container">
            {/* Tabs and Filters */}
            <div className="content-header">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                  Recommendations
                </button>
                <button 
                  className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('saved')}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                  Saved
                </button>
                <button 
                  className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applied')}
                >
                  <FontAwesomeIcon icon={faBriefcase} />
                  Applied
                </button>
              </div>

              <div className="filters">
                <select 
                  className="filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <button className="filter-btn">
                  <FontAwesomeIcon icon={faFilter} />
                  More Filters
                </button>
              </div>
            </div>

            {/* Internship Cards Grid */}
            <div className="internships-grid">
              {activeTab === 'recommendations' && recommendations.length > 0 ? (
                recommendations.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))
              ) : activeTab === 'saved' && savedInternships.length > 0 ? (
                savedInternships.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))
              ) : (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faBriefcase} className="empty-icon" />
                  <h3>No Internships Found</h3>
                  <p>
                    {activeTab === 'recommendations' 
                      ? 'Our AI is working on finding the best matches for you. Check back soon!'
                      : activeTab === 'saved'
                      ? 'You haven\'t saved any internships yet. Start exploring recommendations!'
                      : 'You haven\'t applied to any internships yet. Start applying today!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InternDashboard;

