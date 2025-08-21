import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, 
  faSearch, 
  faChartLine, 
  faCalendarAlt,
  faToggleOn,
  faToggleOff,
  faSave,
  faUndo,
  faUsers,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/RecruiterMatrix.css';

const RecruiterMatrix = () => {
  // Default values for features and limits
  const defaultFeatures = {
    jobPosting: { enabled: false, premiumOnly: true },
    resumeSearch: { enabled: false, premiumOnly: true },
    candidateMatching: { enabled: false, premiumOnly: true },
    interviewScheduling: { enabled: false, premiumOnly: true },
    offerLetterGeneration: { enabled: false, premiumOnly: true },
    advancedAnalytics: { enabled: false, premiumOnly: true },
    bulkOperations: { enabled: false, premiumOnly: true },
    directCvAccess: { enabled: false, premiumOnly: true }
  };

  const defaultLimits = {
    freeJobPostings: 2,
    freeResumeViews: 10,
    freeMatchScoreViews: 5,
    freeCandidateSearches: 20,
    freeInterviewSlots: 5,
    freeCvAccess: 0,
    premiumCvAccess: 100,
    enterpriseCvAccess: 1000
  };

  const [features, setFeatures] = useState(defaultFeatures);
  const [limits, setLimits] = useState(defaultLimits);
  const [originalSettings, setOriginalSettings] = useState({
    features: defaultFeatures,
    limits: defaultLimits
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await fetchRecruiterSettings();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchRecruiterSettings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/admin/recruiter-settings');
      if (response.ok) {
        const data = await response.json();
        
        // Ensure data exists and is valid
        if (!data || typeof data !== 'object') {
          console.warn('Invalid data received from server, using defaults');
          if (typeof setFeatures === 'function') setFeatures(defaultFeatures);
          if (typeof setLimits === 'function') setLimits(defaultLimits);
          if (typeof setOriginalSettings === 'function') setOriginalSettings({ features: defaultFeatures, limits: defaultLimits });
          if (typeof setLoading === 'function') setLoading(false);
          return;
        }
        
        // Ensure data.features and data.limits exist before merging
        const safeFeatures = data.features || {};
        const safeLimits = data.limits || {};

        // Merge existing data with defaults to ensure all features exist
        const mergedFeatures = { ...defaultFeatures, ...safeFeatures };
        const mergedLimits = { ...defaultLimits, ...safeLimits };

        // Ensure we have valid data before setting state
        if (mergedFeatures && mergedLimits) {
          if (typeof setFeatures === 'function') setFeatures(mergedFeatures);
          if (typeof setLimits === 'function') setLimits(mergedLimits);
          if (typeof setOriginalSettings === 'function') setOriginalSettings({ features: mergedFeatures, limits: mergedLimits });
        } else {
          // Fallback to defaults if merging failed
          if (typeof setFeatures === 'function') setFeatures(defaultFeatures);
          if (typeof setLimits === 'function') setLimits(defaultLimits);
          if (typeof setOriginalSettings === 'function') setOriginalSettings({ features: defaultFeatures, limits: defaultLimits });
        }
        
        // Set loading to false after successful data processing
        if (typeof setLoading === 'function') setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching recruiter settings:', error);
      // Fallback to defaults on error
      if (typeof setFeatures === 'function') setFeatures(defaultFeatures);
      if (typeof setLimits === 'function') setLimits(defaultLimits);
      if (typeof setOriginalSettings === 'function') setOriginalSettings({ features: defaultFeatures, limits: defaultLimits });
    } finally {
      if (typeof setLoading === 'function') setLoading(false);
    }
  };

  const toggleFeature = (featureKey, property) => {
    if (typeof setFeatures !== 'function') return;
    
    setFeatures(prev => {
      if (!prev) return prev;
      
      // Ensure the feature exists with default values
      const currentFeature = prev[featureKey] || { enabled: false, premiumOnly: true };
      return {
        ...prev,
        [featureKey]: {
          ...currentFeature,
          [property]: !currentFeature[property]
        }
      };
    });
  };

  const updateLimit = (limitKey, value) => {
    if (typeof setLimits !== 'function') return;
    
    setLimits(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [limitKey]: parseInt(value) || 0
      };
    });
  };

  const handleSave = async () => {
    if (!features || !limits) {
      alert('Invalid settings data. Please refresh the page and try again.');
      return;
    }
    
    if (typeof setSaving === 'function') setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/recruiter-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ features, limits })
      });
      
      if (response.ok) {
        if (typeof setOriginalSettings === 'function') setOriginalSettings({ features, limits });
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      if (typeof setSaving === 'function') setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings.features && originalSettings.limits) {
      if (typeof setFeatures === 'function') setFeatures(originalSettings.features);
      if (typeof setLimits === 'function') setLimits(originalSettings.limits);
    }
  };

  const hasChanges = () => {
    if (!originalSettings.features || !originalSettings.limits) {
      return false;
    }
    return JSON.stringify({ features, limits }) !== JSON.stringify(originalSettings);
  };

  if (loading) {
    return <div className="loading">Loading Recruiter Matrix...</div>;
  }

  // Safety check to ensure features and limits exist
  if (!features || !limits) {
    return <div className="error">Error loading settings. Please refresh the page.</div>;
  }

  return (
    <div className="recruiter-matrix">
      <div className="matrix-header">
        <h2>Recruiter Feature Matrix</h2>
        <p>Control access to recruiter features and set usage limits</p>
      </div>

      <div className="matrix-content">
        <div className="features-section">
          <h3>Feature Controls</h3>
          <div className="features-grid">
            {Object.entries(features).map(([key, feature]) => {
              // Ensure feature has required properties
              const safeFeature = {
                enabled: feature?.enabled || false,
                premiumOnly: feature?.premiumOnly || true
              };
              
              return (
                <div key={key} className="feature-card">
                  <div className="feature-header">
                    <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <div className="feature-controls">
                      <button
                        className={`toggle-btn ${safeFeature.enabled ? 'enabled' : 'disabled'}`}
                        onClick={() => toggleFeature(key, 'enabled')}
                      >
                        <FontAwesomeIcon icon={safeFeature.enabled ? faToggleOn : faToggleOff} />
                        {safeFeature.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      
                      <button
                        className={`toggle-btn ${safeFeature.premiumOnly ? 'premium' : 'free'}`}
                        onClick={() => toggleFeature(key, 'premiumOnly')}
                      >
                        {safeFeature.premiumOnly ? 'Premium Only' : 'Free Available'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="feature-description">
                    {getFeatureDescription(key)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="limits-section">
          <h3>Usage Limits</h3>
          <div className="limits-grid">
            <div className="limit-item">
              <label>Free Job Postings</label>
              <input
                type="number"
                value={limits.freeJobPostings || 0}
                onChange={(e) => updateLimit('freeJobPostings', e.target.value)}
                min="0"
                max="50"
              />
              <span className="limit-description">Maximum job postings a recruiter can create for free</span>
            </div>
            
            <div className="limit-item">
              <label>Free Resume Views</label>
              <input
                type="number"
                value={limits.freeResumeViews || 0}
                onChange={(e) => updateLimit('freeResumeViews', e.target.value)}
                min="0"
                max="1000"
              />
              <span className="limit-description">Maximum resumes a recruiter can view for free</span>
            </div>
            
            <div className="limit-item">
              <label>Free Match Score Views</label>
              <input
                type="number"
                value={limits.freeMatchScoreViews || 0}
                onChange={(e) => updateLimit('freeMatchScoreViews', e.target.value)}
                min="0"
                max="100"
              />
              <span className="limit-description">Maximum match score analyses for free users</span>
            </div>
            
            <div className="limit-item">
              <label>Free Candidate Searches</label>
              <input
                type="number"
                value={limits.freeCandidateSearches || 0}
                onChange={(e) => updateLimit('freeCandidateSearches', e.target.value)}
                min="0"
                max="500"
              />
              <span className="limit-description">Maximum candidate searches per month for free users</span>
            </div>
            
            <div className="limit-item">
              <label>Free Interview Slots</label>
              <input
                type="number"
                value={limits.freeInterviewSlots || 0}
                onChange={(e) => updateLimit('freeInterviewSlots', e.target.value)}
                min="0"
                max="100"
              />
              <span className="limit-description">Maximum interview slots a recruiter can schedule for free</span>
            </div>
          </div>
        </div>

        {/* CV Access Control Section */}
        <div className="cv-access-section">
          <h3>📄 CV Access Control</h3>
          <p className="section-description">
            Control how recruiters can access and view available CVs without posting jobs
          </p>
          
          <div className="cv-access-grid">
            <div className="cv-access-card">
              <div className="cv-access-header">
                <FontAwesomeIcon icon={faFileAlt} className="cv-icon" />
                <h4>Direct CV Access</h4>
                <div className="cv-access-controls">
                  <button
                    className={`toggle-btn ${features.directCvAccess?.enabled ? 'enabled' : 'disabled'}`}
                    onClick={() => toggleFeature('directCvAccess', 'enabled')}
                  >
                    {features.directCvAccess?.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  
                  <button
                    className={`toggle-btn ${features.directCvAccess?.premiumOnly ? 'premium' : 'free'}`}
                    onClick={() => toggleFeature('directCvAccess', 'premiumOnly')}
                  >
                    {features.directCvAccess?.premiumOnly ? 'Premium Only' : 'Free Available'}
                  </button>
                </div>
              </div>
              
              <div className="cv-access-description">
                <p>Allow recruiters to browse and view all available CVs in the system without requiring job postings</p>
              </div>
            </div>
          </div>

          <div className="cv-limits-grid">
            <h4>CV Access Limits by Tier</h4>
            <div className="cv-limits-row">
              <div className="cv-limit-item">
                <label>Free Tier CV Views</label>
                <input
                  type="number"
                  value={limits.freeCvAccess || 0}
                  onChange={(e) => updateLimit('freeCvAccess', e.target.value)}
                  min="0"
                  max="100"
                />
                <span className="limit-description">CVs free users can view per month</span>
              </div>
              
              <div className="cv-limit-item">
                <label>Premium Tier CV Views</label>
                <input
                  type="number"
                  value={limits.premiumCvAccess || 100}
                  onChange={(e) => updateLimit('premiumCvAccess', e.target.value)}
                  min="0"
                  max="1000"
                />
                <span className="limit-description">CVs premium users can view per month</span>
              </div>
              
              <div className="cv-limit-item">
                <label>Enterprise Tier CV Views</label>
                <input
                  type="number"
                  value={limits.enterpriseCvAccess || 1000}
                  onChange={(e) => updateLimit('enterpriseCvAccess', e.target.value)}
                  min="0"
                  max="10000"
                />
                <span className="limit-description">CVs enterprise users can view per month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-features-section">
          <h3>Premium Feature Benefits</h3>
          <div className="premium-grid">
            <div className="premium-card">
              <FontAwesomeIcon icon={faUsers} className="premium-icon" />
              <h4>Unlimited Access</h4>
              <p>Remove all usage limits for premium users</p>
            </div>
            
            <div className="premium-card">
              <FontAwesomeIcon icon={faChartLine} className="premium-icon" />
              <h4>Advanced Analytics</h4>
              <p>Detailed insights and performance metrics</p>
            </div>
            
            <div className="premium-card">
              <FontAwesomeIcon icon={faFileAlt} className="premium-icon" />
              <h4>Bulk Operations</h4>
              <p>Process multiple candidates simultaneously</p>
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
  if (!featureKey) return 'Feature description not available';
  
  const descriptions = {
    jobPosting: 'Allow recruiters to create and manage job postings',
    resumeSearch: 'Enable searching and filtering through candidate database',
    candidateMatching: 'Provide detailed match score analysis for candidates',
    interviewScheduling: 'Enable interview scheduling and management',
    offerLetterGeneration: 'Generate and manage offer letters automatically',
    advancedAnalytics: 'Provide detailed recruitment analytics and insights',
    bulkOperations: 'Enable bulk candidate processing and management',
    directCvAccess: 'Allow recruiters to browse and view available CVs without posting jobs'
  };
  
  return descriptions[featureKey] || 'Feature description not available';
};

export default RecruiterMatrix;
