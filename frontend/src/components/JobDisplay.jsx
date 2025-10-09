import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import JobApplicationModal from './JobApplicationModal';
import './JobDisplay.css';

const JobDisplay = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/jobs'));
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  const handleApplyNow = (job, event) => {
    event.stopPropagation();
    setJobToApply(job);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setJobToApply(null);
  };

  const handleApplicationSubmitted = () => {
    // Refresh jobs to update applicant counts
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="job-display-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading amazing job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-display-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchJobs} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-display-container">
      <div className="jobs-header">
        <h2>🚀 Amazing Job Opportunities</h2>
        <p>Discover your next career move with these carefully curated positions</p>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job._id} className="job-card" onClick={() => handleJobClick(job)}>
            <div className="job-card-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.job_title}</h3>
                <span className="company-name">{job.company_name}</span>
              </div>
              <div className="job-badge">
                <span className="badge-text">{job.job_type}</span>
              </div>
            </div>
            
            <div className="job-location">
              <span className="location-icon">📍</span>
              <span>{job.location}</span>
              {job.remote_option && (
                <span className="remote-badge">{job.remote_option}</span>
              )}
            </div>

            <div className="job-salary">
              <span className="salary-icon">💰</span>
              <span>{job.salary_range}</span>
            </div>

            <div className="job-skills-preview">
              <h4>Key Skills:</h4>
              <div className="skills-tags">
                {job.required_skills?.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
                {job.required_skills?.length > 4 && (
                  <span className="more-skills">+{job.required_skills.length - 4} more</span>
                )}
              </div>
            </div>

            <div className="job-actions">
              <button className="view-details-btn">View Full Details</button>
              <button 
                className="apply-now-btn" 
                onClick={(e) => handleApplyNow(job, e)}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="job-modal-overlay" onClick={closeJobDetails}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJob.job_title}</h2>
              <button className="close-modal-btn" onClick={closeJobDetails}>×</button>
            </div>

            <div className="modal-content">
              {/* Company & Basic Info */}
              <div className="job-basic-info">
                <div className="company-section">
                  <h3>{selectedJob.company_name}</h3>
                  <p className="company-description">{selectedJob.description}</p>
                  <div className="company-details">
                    <span><strong>Industry:</strong> {selectedJob.industry}</span>
                    <span><strong>Location:</strong> {selectedJob.location}</span>
                    <span><strong>Remote:</strong> {selectedJob.remote_option}</span>
                    <span><strong>Type:</strong> {selectedJob.job_type}</span>
                    <span><strong>Salary:</strong> {selectedJob.salary_range}</span>
                    <span><strong>Experience:</strong> {selectedJob.experience_required}</span>
                    <span><strong>Education:</strong> {selectedJob.education_required}</span>
                    <span><strong>Deadline:</strong> {selectedJob.application_deadline}</span>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="job-section">
                <h3 className="section-title">
                  <span className="section-icon">🛠️</span>
                  Required Skills
                </h3>
                <div className="skills-grid">
                  {selectedJob.required_skills?.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <span className="skill-bullet">•</span>
                      <span className="skill-text">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Responsibilities */}
              <div className="job-section">
                <h3 className="section-title">
                  <span className="section-icon">📋</span>
                  Key Responsibilities
                </h3>
                <div className="responsibilities-list">
                  {selectedJob.responsibilities?.map((resp, index) => (
                    <div key={index} className="responsibility-item">
                      <span className="resp-number">{index + 1}</span>
                      <span className="resp-text">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI-Powered Improvement Suggestions */}
              <div className="job-section ai-suggestions">
                <h3 className="section-title">
                  <span className="section-icon">💡</span>
                  AI-Powered Improvement Suggestions
                </h3>
                <div className="suggestions-list">
                  {selectedJob.ai_improvement_suggestions?.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <span className="suggestion-icon">🤖</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="job-section">
                <h3 className="section-title">
                  <span className="section-icon">📚</span>
                  Additional Requirements
                </h3>
                <div className="requirements-list">
                  {selectedJob.additional_requirements?.map((req, index) => (
                    <div key={index} className="requirement-item">
                      <span className="req-bullet">✓</span>
                      <span className="req-text">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits & Perks */}
              <div className="job-section benefits-section">
                <h3 className="section-title">
                  <span className="section-icon">🎁</span>
                  Benefits & Perks
                </h3>
                <div className="benefits-grid">
                  {selectedJob.benefits?.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <span className="benefit-icon">✨</span>
                      <span className="benefit-text">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Culture */}
              <div className="job-section">
                <h3 className="section-title">
                  <span className="section-icon">🏢</span>
                  Company Culture
                </h3>
                <div className="culture-content">
                  <p>{selectedJob.company_culture}</p>
                </div>
              </div>

              {/* Application Process */}
              <div className="job-section">
                <h3 className="section-title">
                  <span className="section-icon">📝</span>
                  Application Process
                </h3>
                <div className="process-steps">
                  {selectedJob.application_process?.map((step, index) => (
                    <div key={index} className="process-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h4>Step {index + 1}</h4>
                        <p>{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="apply-modal-btn"
                onClick={(e) => handleApplyNow(selectedJob, e)}
              >
                Apply for This Position
              </button>
              <button className="save-job-btn">Save Job</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Modal */}
      {showApplicationModal && jobToApply && (
        <JobApplicationModal
          job={jobToApply}
          onClose={closeApplicationModal}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
};

export default JobDisplay;
