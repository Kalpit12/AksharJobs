import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faBuilding, faMapMarkerAlt, faClock, faGlobe, 
  faDollarSign, faGraduationCap, faBriefcase, faCalendarAlt,
  faCheckCircle, faHeart, faShare, faBookmark, faRocket,
  faChartLine, faLightbulb, faStar, faArrowRight, faSpinner,
  faUsers, faHandshake, faTrophy, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSalary, getUserCountry } from '../utils/currencyUtils';
import '../styles/ModernJobDetailsModal.css';

const ModernJobDetailsModal = ({ 
  job, 
  isOpen, 
  onClose, 
  matchScore, 
  onApply, 
  onCalculateMatch, 
  isApplied, 
  isCalculatingMatch 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#EF4444";
    return "#8B5CF6";
  };

  const getMatchScoreText = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Upload Resume";
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange) return 'Competitive';
    return salaryRange.replace(/[$,]/g, '').replace(/(\d+)000/g, '$1K');
  };

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(skill => skill.trim());
  };

  const parseResponsibilities = (responsibilities) => {
    if (!responsibilities) return [];
    if (Array.isArray(responsibilities)) return responsibilities;
    return responsibilities.split('\n').filter(resp => resp.trim());
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const tabVariants = {
    inactive: { 
      scale: 0.95,
      opacity: 0.7
    },
    active: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modern-job-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modern-job-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div 
            className="modal-header-modern"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="header-left">
              <div className="company-logo">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className="job-title-section">
                <h1 className="job-title-modern">{job.job_title}</h1>
                <div className="company-info-modern">
                  <span className="company-name">{job.company_name}</span>
                  <span className="location-badge">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              <div className="action-buttons">
                <motion.button
                  className={`action-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleFavorite}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </motion.button>
                
                <motion.button
                  className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  onClick={handleBookmark}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                </motion.button>
                
                <div className="share-container">
                  <motion.button
                    className="action-btn"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        className="share-menu"
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      >
                        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                          Copy Link
                        </button>
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this job: ${job.job_title} at ${job.company_name}`)}>
                          Twitter
                        </button>
                        <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`)}>
                          LinkedIn
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <motion.button
                className="close-btn-modern"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Stats Bar */}
          <motion.div 
            className="quick-stats-bar"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="stat-item">
              <FontAwesomeIcon icon={faClock} />
              <span>{job.job_type}</span>
            </div>
            <div className="stat-item">
              <FontAwesomeIcon icon={faGlobe} />
              <span>{job.remote_option}</span>
            </div>
            <div className="stat-item">
              <FontAwesomeIcon icon={faDollarSign} />
              <span>{formatSalary(job.salary_range, getUserCountry())}</span>
            </div>
            <div className="stat-item">
              <FontAwesomeIcon icon={faBriefcase} />
              <span>{job.experience_required}</span>
            </div>
          </motion.div>

          {/* Match Score Hero */}
          {matchScore !== undefined && (
            <motion.div 
              className="match-score-hero"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="match-score-circle-large">
                <motion.div
                  className="score-ring"
                  style={{ 
                    background: `conic-gradient(${getMatchScoreColor(matchScore.score)} ${matchScore.score * 3.6}deg, #f3f4f6 0deg)`
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div className="score-inner">
                    <motion.span 
                      className="score-number-large"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {matchScore.score}%
                    </motion.span>
                    <span className="score-label-large">{getMatchScoreText(matchScore.score)}</span>
                  </div>
                </motion.div>
              </div>
              
              <div className="match-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Skills</span>
                  <div className="breakdown-bar">
                    <motion.div 
                      className="breakdown-fill"
                      style={{ backgroundColor: getMatchScoreColor(85) }}
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    />
                  </div>
                  <span className="breakdown-value">85%</span>
                </div>
                
                <div className="breakdown-item">
                  <span className="breakdown-label">Experience</span>
                  <div className="breakdown-bar">
                    <motion.div 
                      className="breakdown-fill"
                      style={{ backgroundColor: getMatchScoreColor(78) }}
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    />
                  </div>
                  <span className="breakdown-value">78%</span>
                </div>
                
                <div className="breakdown-item">
                  <span className="breakdown-label">Education</span>
                  <div className="breakdown-bar">
                    <motion.div 
                      className="breakdown-fill"
                      style={{ backgroundColor: getMatchScoreColor(92) }}
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="breakdown-value">92%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs Navigation */}
          <motion.div 
            className="tabs-navigation"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {['overview', 'details', 'requirements', 'company'].map((tab) => (
              <motion.button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                variants={tabVariants}
                animate={activeTab === tab ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <div className="tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  className="tab-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overview-grid">
                    <div className="overview-card">
                      <div className="card-icon">
                        <FontAwesomeIcon icon={faRocket} />
                      </div>
                      <h3>Role Overview</h3>
                      <p>{job.description}</p>
                    </div>
                    
                    <div className="overview-card">
                      <div className="card-icon">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <h3>Team & Culture</h3>
                      <p>{job.company_culture || "Join a dynamic team focused on innovation and growth. We value collaboration, creativity, and continuous learning."}</p>
                    </div>
                    
                    <div className="overview-card">
                      <div className="card-icon">
                        <FontAwesomeIcon icon={faTrophy} />
                      </div>
                      <h3>Growth Opportunities</h3>
                      <p>Excellent career advancement opportunities with mentorship, training programs, and leadership development paths.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  className="tab-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="details-section">
                    <h3>Key Responsibilities</h3>
                    <div className="responsibilities-modern">
                      {parseResponsibilities(job.responsibilities).map((resp, index) => (
                        <motion.div
                          key={index}
                          className="responsibility-item-modern"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="responsibility-bullet"></div>
                          <span>{resp}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Benefits & Perks</h3>
                    <div className="benefits-grid">
                      {[
                        { icon: faShieldAlt, title: "Health Insurance", desc: "Comprehensive medical coverage" },
                        { icon: faDollarSign, title: "Competitive Salary", desc: formatSalary(job.salary_range, getUserCountry()) },
                        { icon: faGlobe, title: "Remote Work", desc: job.remote_option },
                        { icon: faGraduationCap, title: "Learning Budget", desc: "Professional development fund" }
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="benefit-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <FontAwesomeIcon icon={benefit.icon} className="benefit-icon" />
                          <h4>{benefit.title}</h4>
                          <p>{benefit.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'requirements' && (
                <motion.div
                  key="requirements"
                  className="tab-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="requirements-section">
                    <h3>Required Skills</h3>
                    <div className="skills-modern">
                      {parseSkills(job.required_skills).map((skill, index) => (
                        <motion.span
                          key={index}
                          className="skill-tag-modern"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="requirements-grid">
                    <div className="requirement-card">
                      <FontAwesomeIcon icon={faGraduationCap} className="req-icon" />
                      <h4>Education</h4>
                      <p>{job.education_required}</p>
                    </div>
                    
                    <div className="requirement-card">
                      <FontAwesomeIcon icon={faBriefcase} className="req-icon" />
                      <h4>Experience</h4>
                      <p>{job.experience_required}</p>
                    </div>
                    
                    <div className="requirement-card">
                      <FontAwesomeIcon icon={faCalendarAlt} className="req-icon" />
                      <h4>Deadline</h4>
                      <p>{new Date(job.application_deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'company' && (
                <motion.div
                  key="company"
                  className="tab-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="company-section">
                    <div className="company-header">
                      <div className="company-logo-large">
                        <FontAwesomeIcon icon={faBuilding} />
                      </div>
                      <div className="company-info">
                        <h3>{job.company_name}</h3>
                        <p className="company-industry">{job.industry || "Technology"}</p>
                        {job.company_website && (
                          <a 
                            href={job.company_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="company-website"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="company-highlights">
                      <div className="highlight-item">
                        <FontAwesomeIcon icon={faUsers} />
                        <span>Growing Team</span>
                      </div>
                      <div className="highlight-item">
                        <FontAwesomeIcon icon={faHandshake} />
                        <span>Collaborative Culture</span>
                      </div>
                      <div className="highlight-item">
                        <FontAwesomeIcon icon={faLightbulb} />
                        <span>Innovation Focused</span>
                      </div>
                    </div>

                    <div className="company-description">
                      <h4>About the Company</h4>
                      <p>
                        {job.company_description || 
                         `${job.company_name} is a leading company in the ${job.industry || 'technology'} sector, committed to innovation and excellence. We're passionate about creating solutions that make a difference and building a workplace where talented individuals can thrive.`
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <motion.div 
            className="modal-footer-modern"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="footer-left">
              {matchScore === undefined ? (
                <motion.button
                  className="calculate-match-btn-modern"
                  onClick={() => onCalculateMatch(job._id)}
                  disabled={isCalculatingMatch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isCalculatingMatch ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faChartLine} />
                      Calculate Match Score
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="match-score-footer">
                  <div className="match-score-compact">
                    <span className="score-number-compact" style={{ color: getMatchScoreColor(matchScore.score) }}>
                      {matchScore.score}%
                    </span>
                    <span className="score-text-compact">{getMatchScoreText(matchScore.score)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="footer-right">
              <motion.button
                className="secondary-btn-modern"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
              
              <motion.button
                className={`apply-btn-modern ${isApplied ? 'applied' : ''}`}
                onClick={() => onApply(job._id)}
                disabled={isApplied}
                whileHover={{ scale: isApplied ? 1 : 1.02 }}
                whileTap={{ scale: isApplied ? 1 : 0.98 }}
              >
                {isApplied ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Applied
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRocket} />
                    Apply Now
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernJobDetailsModal;
