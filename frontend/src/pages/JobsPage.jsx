import React, { useState } from 'react';
import JobDisplay from '../components/JobDisplay';
import JobCreationForm from '../components/JobCreationForm';
import './JobsPage.css';

const JobsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshJobs, setRefreshJobs] = useState(false);

  const handleJobCreated = (newJob) => {
    // Trigger refresh of job display
    setRefreshJobs(prev => !prev);
  };

  const handleCreateJob = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="jobs-page">
      <div className="jobs-page-header">
        <div className="header-content">
          <h1>🚀 Job Opportunities</h1>
          <p>Discover amazing career opportunities and find your next big move</p>
          
          <div className="header-actions">
            <button 
              className="create-job-btn"
              onClick={handleCreateJob}
            >
              <span className="btn-icon">✨</span>
              Create New Job
            </button>
            
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Active Jobs</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Total Skills</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24</span>
                <span className="stat-label">Responsibilities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="jobs-content">
        <JobDisplay key={refreshJobs} />
      </div>

      {showCreateForm && (
        <JobCreationForm
          onJobCreated={handleJobCreated}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default JobsPage;
