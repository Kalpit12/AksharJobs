import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faBriefcase,
  faLayerGroup,
  faDollarSign,
  faBookmark,
  faPaperPlane,
  faEye,
  faStar,
  faClock,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const JobCard = ({ job, onApply, onSave, onViewDetails, isSaved = false, isAlreadyApplied = false }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(isAlreadyApplied);
  
  // Sync isApplied state with isAlreadyApplied prop
  React.useEffect(() => {
    if (isAlreadyApplied) {
      setIsApplied(true);
      console.log('🟢 Job already applied:', job.title || job.jobTitle, 'ID:', job._id || job.id);
    }
  }, [isAlreadyApplied, job]);

  const sanitizeJobTitle = (title) => {
    if (!title) return title;
    return String(title).replace(/^Updated\s*[-:]?\s*/i, "");
  };

  const handleApplyClick = async () => {
    if (isApplied || isApplying || isAlreadyApplied) return;
    
    setIsApplying(true);
    
    if (onApply) {
      try {
        await onApply(job);
        // After successful application, set to applied permanently
        // The parent will update isAlreadyApplied prop, which will be picked up by useEffect
        setTimeout(() => {
          setIsApplying(false);
          setIsApplied(true); // Keep it applied permanently
        }, 1000);
      } catch (error) {
        console.error('Apply error:', error);
        setIsApplying(false);
        return;
      }
    } else {
      // No onApply handler - just show animation
      setTimeout(() => {
        setIsApplying(false);
        setIsApplied(true);
      }, 1000);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Competitive';
    
    // If it's already a string, return it
    if (typeof salary === 'string') return salary;
    
    // If it's an object with min/max
    if (typeof salary === 'object' && salary.min !== undefined && salary.max !== undefined) {
      const currency = salary.currency || 'USD';
      const symbol = currency === 'USD' ? '$' : currency;
      return `${symbol}${salary.min} - ${symbol}${salary.max}`;
    }
    
    return 'Competitive';
  };

  return (
    <div className="new-job-card">
      <div className="new-job-card-header">
        <div className="new-job-card-main">
          <div className="new-job-card-logo">
            {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'J'}
          </div>
          <div className="new-job-card-info">
            <h3 className="new-job-card-title">
              {sanitizeJobTitle(job.job_title || job.title)}
            </h3>
            <div className="new-job-card-company">
              {job.company_name || job.company}
            </div>
            <div className="new-job-card-meta">
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="fa-icon" /> 
                {job.location || 'Not specified'}
              </span>
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faBriefcase} className="fa-icon" /> 
                {job.job_type || job.remote_option || 'Full-time'}
              </span>
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faLayerGroup} className="fa-icon" /> 
                {job.experience_level || job.experience_required || 'Entry Level'}
              </span>
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faDollarSign} className="fa-icon" /> 
                {formatSalary(job.salary_range || job.salary)}
              </span>
            </div>
          </div>
        </div>
        <div className="new-job-card-actions">
          <button 
            className={`new-job-card-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave && onSave(job._id)}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
      </div>
      
      <div className="new-job-card-tags">
        {/* Remote/Hybrid/On-site tag */}
        {(job.remote_option || job.remoteOption) && (
          <span 
            className="new-job-card-tag" 
            style={{ 
              background: (job.remote_option === 'Remote' || job.remoteOption === 'Remote') ? '#dbeafe' : '#fed7aa',
              color: (job.remote_option === 'Remote' || job.remoteOption === 'Remote') ? '#1e40af' : '#c2410c',
              fontWeight: '600',
              border: `1px solid ${(job.remote_option === 'Remote' || job.remoteOption === 'Remote') ? '#93c5fd' : '#fdba74'}`
            }}
          >
            {job.remote_option || job.remoteOption}
          </span>
        )}
        
        {/* Paid tag if salary exists */}
        {(job.salary_range || job.salary) && (
          <span 
            className="new-job-card-tag" 
            style={{ 
              background: '#d1fae5',
              color: '#065f46',
              fontWeight: '600',
              border: '1px solid #86efac'
            }}
          >
            💰 Paid
          </span>
        )}
        
        {job.match_score > 0 && (
          <span 
            className="new-job-card-tag" 
            style={{
              background: job.match_score >= 70 ? '#10b981' : job.match_score >= 40 ? '#f59e0b' : '#6b7280',
              color: 'white',
              fontWeight: '600'
            }}
          >
            <FontAwesomeIcon icon={faStar} /> {job.match_score}% Match
          </span>
        )}
        {job.featured && (
          <span className="new-job-card-tag featured">
            <FontAwesomeIcon icon={faStar} /> Featured
          </span>
        )}
        {job.match_reasons && job.match_reasons.length > 0 && (
          <span className="new-job-card-tag" style={{ background: '#d1fae5', color: '#065f46' }}>
            ✓ {job.match_reasons[0]}
          </span>
        )}
        {(() => {
          // Parse required_skills safely - handle both string and array
          let skills = job.required_skills || job.skills || [];
          if (typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim()).filter(s => s);
          }
          return Array.isArray(skills) && skills.slice(0, 3).map((skill, skillIdx) => (
            <span key={skillIdx} className="new-job-card-tag">
              {skill}
            </span>
          ));
        })()}
        <span className="new-job-card-tag meta">
          <FontAwesomeIcon icon={faClock} /> 
          {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}
        </span>
      </div>
      
      <div className="new-job-card-buttons">
        <button 
          className={`modern-apply-btn ${isApplying ? 'applying' : ''} ${isApplied ? 'applied' : ''}`}
          onClick={handleApplyClick}
          disabled={isApplying || isApplied}
        >
          <span className="apply-btn-icon">
            <FontAwesomeIcon icon={isApplied ? faCheck : faPaperPlane} />
          </span>
          <span className="apply-btn-text">
            {isApplied ? 'Applied!' : isApplying ? 'Applying...' : 'Apply Now'}
          </span>
        </button>
        <button 
          className="new-job-card-view-btn"
          onClick={() => onViewDetails && onViewDetails(job)}
        >
          <FontAwesomeIcon icon={faEye} /> View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
