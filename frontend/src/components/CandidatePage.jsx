import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faBriefcase, 
  faGraduationCap, 
  faCalendar, 
  faStar, 
  faDownload, 
  faEye, 
  faCheck, 
  faTimes, 
  faComments,
  faPaperPlane,
  faLinkedin,
  faGithub,
  faGlobe,
  faClock,
  faThumbsUp,
  faThumbsDown,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as faLinkedinBrand, faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import axios from 'axios';

const CandidatePage = ({ jobId, candidateId, onClose, onStatusChange }) => {
  const [candidate, setCandidate] = useState(null);
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (candidateId && jobId) {
      fetchCandidateData();
    }
  }, [candidateId, jobId]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch candidate details
      const candidateResponse = await axios.get(
        buildApiUrl(`/api/users/${candidateId}`),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Fetch application details
      const applicationResponse = await axios.get(
        buildApiUrl(`/api/applications/application/${jobId}/${candidateId}`),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Fetch job details
      const jobResponse = await axios.get(
        buildApiUrl(`/api/jobs/${jobId}`),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setCandidate(candidateResponse.data);
      setApplication(applicationResponse.data);
      setJob(jobResponse.data);
      setNotes(applicationResponse.data.notes || '');
      setStatusUpdate(applicationResponse.data.status || 'pending');
      
    } catch (err) {
      console.error('Error fetching candidate data:', err);
      setError('Failed to load candidate information');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        buildApiUrl(`/api/applications/application/${jobId}/${candidateId}`),
        {
          status: statusUpdate,
          notes: notes
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        setApplication(response.data);
        if (onStatusChange) {
          onStatusChange(candidateId, statusUpdate);
        }
        alert('Status updated successfully!');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewing': return '#3b82f6';
      case 'interview': return '#8b5cf6';
      case 'offered': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'accepted': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return faClock;
      case 'reviewing': return faEye;
      case 'interview': return faComments;
      case 'offered': return faCheck;
      case 'rejected': return faTimes;
      case 'accepted': return faThumbsUp;
      default: return faFlag;
    }
  };

  if (loading) {
    return (
      <div className="candidate-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading candidate information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-page">
      <div className="candidate-header">
        <div className="candidate-info">
          <div className="candidate-avatar">
            {candidate?.firstName ? candidate.firstName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="candidate-details">
            <h2>{candidate?.firstName} {candidate?.lastName}</h2>
            <p className="candidate-email">
              <FontAwesomeIcon icon={faEnvelope} /> {candidate?.email}
            </p>
            <p className="candidate-phone">
              <FontAwesomeIcon icon={faPhone} /> {candidate?.phone || 'Not provided'}
            </p>
          </div>
        </div>
        <div className="candidate-actions">
          <button onClick={onClose} className="btn btn-secondary">
            <FontAwesomeIcon icon={faTimes} /> Close
          </button>
        </div>
      </div>

      <div className="candidate-content">
        <div className="candidate-main">
          {/* Application Status */}
          <div className="candidate-section">
            <h3>
              <FontAwesomeIcon icon={getStatusIcon(application?.status)} />
              Application Status
            </h3>
            <div className="status-update-form">
              <div className="form-group">
                <label>Status:</label>
                <select 
                  value={statusUpdate} 
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                  rows="3"
                  placeholder="Add notes about this candidate..."
                ></textarea>
              </div>
              <button 
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="btn btn-primary"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Application Details */}
          <div className="candidate-section">
            <h3>
              <FontAwesomeIcon icon={faPaperPlane} />
              Application Details
            </h3>
            <div className="application-info">
              <div className="info-item">
                <strong>Applied for:</strong> {job?.job_title || job?.title}
              </div>
              <div className="info-item">
                <strong>Company:</strong> {job?.company_name || job?.company}
              </div>
              <div className="info-item">
                <strong>Applied Date:</strong> {new Date(application?.applied_at || application?.created_at).toLocaleDateString()}
              </div>
              <div className="info-item">
                <strong>Match Score:</strong> 
                <span className="match-score" style={{ color: getStatusColor(application?.status) }}>
                  {application?.matchScore || application?.final_score || 0}%
                </span>
              </div>
              {application?.cover_letter && (
                <div className="info-item">
                  <strong>Cover Letter:</strong>
                  <div className="cover-letter">
                    {application.cover_letter}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Profile */}
          <div className="candidate-section">
            <h3>
              <FontAwesomeIcon icon={faUser} />
              Candidate Profile
            </h3>
            <div className="profile-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{candidate?.location || 'Location not specified'}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faBriefcase} />
                <span>{candidate?.currentPosition || 'Current position not specified'}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>{candidate?.education || 'Education not specified'}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faCalendar} />
                <span>Available from: {candidate?.availability || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {candidate?.skills && candidate.skills.length > 0 && (
            <div className="candidate-section">
              <h3>
                <FontAwesomeIcon icon={faStar} />
                Skills
              </h3>
              <div className="skills-list">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          {candidate?.resumePath && (
            <div className="candidate-section">
              <h3>
                <FontAwesomeIcon icon={faDownload} />
                Resume
              </h3>
              <div className="resume-section">
                <a 
                  href={buildApiUrl(`/api/resumes/${candidate.resumePath}`)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <FontAwesomeIcon icon={faEye} /> View Resume
                </a>
                <a 
                  href={buildApiUrl(`/api/resumes/${candidate.resumePath}`)} 
                  download
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faDownload} /> Download Resume
                </a>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="candidate-section">
            <h3>
              <FontAwesomeIcon icon={faGlobe} />
              Social Links
            </h3>
            <div className="social-links">
              {candidate?.linkedin && (
                <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FontAwesomeIcon icon={faLinkedinBrand} /> LinkedIn
                </a>
              )}
              {candidate?.github && (
                <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FontAwesomeIcon icon={faGithubBrand} /> GitHub
                </a>
              )}
              {candidate?.portfolio && (
                <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                  <FontAwesomeIcon icon={faGlobe} /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="candidate-sidebar">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <button className="btn btn-primary btn-sm">
              <FontAwesomeIcon icon={faComments} /> Schedule Interview
            </button>
            <button className="btn btn-success btn-sm">
              <FontAwesomeIcon icon={faCheck} /> Send Offer
            </button>
            <button className="btn btn-danger btn-sm">
              <FontAwesomeIcon icon={faTimes} /> Reject
            </button>
          </div>

          {/* Application Timeline */}
          <div className="application-timeline">
            <h4>Application Timeline</h4>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <strong>Application Submitted</strong>
                  <p>{new Date(application?.applied_at || application?.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {application?.status !== 'pending' && (
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <strong>Status: {application.status}</strong>
                    <p>Updated recently</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
