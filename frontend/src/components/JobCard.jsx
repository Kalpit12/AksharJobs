import React from 'react';
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
  faClock
} from '@fortawesome/free-solid-svg-icons';

const JobCard = ({ job, onApply, onSave, onViewDetails, isSaved = false }) => {
  const sanitizeJobTitle = (title) => {
    if (!title) return title;
    return String(title).replace(/^Updated\s*[-:]?\s*/i, "");
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
                {job.job_type || 'Full-time'}
              </span>
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faLayerGroup} className="fa-icon" /> 
                {job.experience_level || 'Mid Level'}
              </span>
              <span className="new-job-card-meta-item">
                <FontAwesomeIcon icon={faDollarSign} className="fa-icon" /> 
                {job.salary_range || 'Competitive'}
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
        {job.skills && job.skills.slice(0, 3).map((skill, skillIdx) => (
          <span key={skillIdx} className="new-job-card-tag">
            {skill}
          </span>
        ))}
        <span className="new-job-card-tag meta">
          <FontAwesomeIcon icon={faClock} /> 
          {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}
        </span>
      </div>
      
      <div className="new-job-card-buttons">
        <button 
          className="new-job-card-apply-btn"
          onClick={() => onApply && onApply(job)}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
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
