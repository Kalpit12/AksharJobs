import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faSearch, 
  faClipboardList, 
  faUserFriends,
  faToggleOn,
  faToggleOff,
  faSave,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import '../styles/JobSeekerMatrix.css';

const JobSeekerMatrix = () => {
  const [features, setFeatures] = useState({
    resumeUpload: { enabled: true, premiumOnly: false },
    jobSearch: { enabled: true, premiumOnly: false },
    applicationTracking: { enabled: true, premiumOnly: false },
    culturalFitAssessment: { enabled: true, premiumOnly: false },
    matchScoreAnalysis: { enabled: true, premiumOnly: false },
    interviewScheduling: { enabled: true, premiumOnly: false },
    offerLetterGeneration: { enabled: false, premiumOnly: true }
  });

  const [limits, setLimits] = useState({
    freeResumeUploads: 3,
    freeJobApplications: 10,
    freeMatchScoreViews: 5,
    freeCulturalFitTests: 2
  });

  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJobSeekerSettings();
  }, []);

  const fetchJobSeekerSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/jobseeker-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features);
        setLimits(data.limits);
        setOriginalSettings({ features: data.features, limits: data.limits });
      }
    } catch (error) {
      console.error('Error fetching job seeker settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (featureKey, property) => {
    setFeatures(prev => ({
      ...prev,
      [featureKey]: {
        ...prev[featureKey],
        [property]: !prev[featureKey][property]
      }
    }));
  };

  const updateLimit = (limitKey, value) => {
    setLimits(prev => ({
      ...prev,
      [limitKey]: parseInt(value) || 0
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/jobseeker-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ features, limits })
      });
      
      if (response.ok) {
        setOriginalSettings({ features, limits });
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFeatures(originalSettings.features || {});
    setLimits(originalSettings.limits || {});
  };

  const hasChanges = () => {
    return JSON.stringify({ features, limits }) !== JSON.stringify(originalSettings);
  };

  if (loading) {
    return <div className="loading">Loading Job Seeker Matrix...</div>;
  }

  return (
    <div className="jobseeker-matrix">
      <div className="matrix-header">
        <h2>Job Seeker Feature Matrix</h2>
        <p>Control access to job seeker features and set usage limits</p>
      </div>

      <div className="matrix-content">
        <div className="features-section">
          <h3>Feature Controls</h3>
          <div className="features-grid">
            {Object.entries(features).map(([key, feature]) => (
              <div key={key} className="feature-card">
                <div className="feature-header">
                  <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                  <div className="feature-controls">
                    <button
                      className={`toggle-btn ${feature.enabled ? 'enabled' : 'disabled'}`}
                      onClick={() => toggleFeature(key, 'enabled')}
                    >
                      <FontAwesomeIcon icon={feature.enabled ? faToggleOn : faToggleOff} />
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    
                    <button
                      className={`toggle-btn ${feature.premiumOnly ? 'premium' : 'free'}`}
                      onClick={() => toggleFeature(key, 'premiumOnly')}
                    >
                      {feature.premiumOnly ? 'Premium Only' : 'Free Available'}
                    </button>
                  </div>
                </div>
                
                <div className="feature-description">
                  {getFeatureDescription(key)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="limits-section">
          <h3>Usage Limits</h3>
          <div className="limits-grid">
            <div className="limit-item">
              <label>Free Resume Uploads</label>
              <input
                type="number"
                value={limits.freeResumeUploads}
                onChange={(e) => updateLimit('freeResumeUploads', e.target.value)}
                min="0"
                max="100"
              />
              <span className="limit-description">Maximum resumes a user can upload for free</span>
            </div>
            
            <div className="limit-item">
              <label>Free Job Applications</label>
              <input
                type="number"
                value={limits.freeJobApplications}
                onChange={(e) => updateLimit('freeJobApplications', e.target.value)}
                min="0"
                max="1000"
              />
              <span className="limit-description">Maximum job applications per month for free users</span>
            </div>
            
            <div className="limit-item">
              <label>Free Match Score Views</label>
              <input
                type="number"
                value={limits.freeMatchScoreViews}
                onChange={(e) => updateLimit('freeMatchScoreViews', e.target.value)}
                min="0"
                max="100"
              />
              <span className="limit-description">Maximum match score views for free users</span>
            </div>
            
            <div className="limit-item">
              <label>Free Cultural Fit Tests</label>
              <input
                type="number"
                value={limits.freeCulturalFitTests}
                onChange={(e) => updateLimit('freeCulturalFitTests', e.target.value)}
                min="0"
                max="50"
              />
              <span className="limit-description">Maximum cultural fit assessments for free users</span>
            </div>
          </div>
        </div>
      </div>

      <div className="matrix-actions">
        <button 
          className="save-btn"
          onClick={handleSave}
          disabled={!hasChanges() || saving}
        >
          <FontAwesomeIcon icon={faSave} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        
        <button 
          className="reset-btn"
          onClick={handleReset}
          disabled={!hasChanges()}
        >
          <FontAwesomeIcon icon={faUndo} />
          Reset Changes
        </button>
      </div>
    </div>
  );
};

const getFeatureDescription = (featureKey) => {
  const descriptions = {
    resumeUpload: 'Allow users to upload and manage their resumes',
    jobSearch: 'Enable job search and browsing functionality',
    applicationTracking: 'Track job applications and their status',
    culturalFitAssessment: 'Provide cultural fit scoring for job matches',
    matchScoreAnalysis: 'Show detailed match score analysis',
    interviewScheduling: 'Enable interview scheduling capabilities',
    offerLetterGeneration: 'Generate offer letters for successful matches'
  };
  
  return descriptions[featureKey] || 'Feature description not available';
};

export default JobSeekerMatrix;
