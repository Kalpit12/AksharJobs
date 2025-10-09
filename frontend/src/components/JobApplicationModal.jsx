import React, { useState } from 'react';
import { buildApiUrl } from '../config/api';
import './JobApplicationModal.css';

const JobApplicationModal = ({ job, onClose, onApplicationSubmitted }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to apply for jobs');
      }

      const response = await fetch(buildApiUrl('/api/applications/apply'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          job_id: job._id,
          cover_letter: coverLetter
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const result = await response.json();
      setSuccess(true);
      
      // Call the callback to refresh job data
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (success) {
    return (
      <div className="application-modal-overlay" onClick={handleClose}>
        <div className="application-modal success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Application Submitted!</h2>
            <p>Your application for <strong>{job.job_title}</strong> at <strong>{job.company_name}</strong> has been submitted successfully.</p>
            <p>We'll review your application and get back to you soon!</p>
            <button className="close-success-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-modal-overlay" onClick={handleClose}>
      <div className="application-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply for {job.job_title}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="job-summary">
            <h3>{job.company_name}</h3>
            <p className="job-location">📍 {job.location}</p>
            <p className="job-salary">💰 {job.salary_range}</p>
            <p className="job-type">📋 {job.job_type}</p>
          </div>

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="coverLetter">
                Cover Letter <span className="required">*</span>
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're the perfect fit for this role. Include your relevant experience, skills, and what excites you about this opportunity..."
                rows="6"
                required
                disabled={loading}
              />
              <p className="help-text">
                Write a compelling cover letter explaining why you're interested in this position and how your skills align with the job requirements.
              </p>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !coverLetter.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
