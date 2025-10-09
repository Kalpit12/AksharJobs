import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faBuilding,
  faGlobe,
  faIndustry,
  faUsers,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faRocket,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProfileTracker.css';

const RecruiterProfileTracker = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    fetchProfileData();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      console.log('🔄 RecruiterProfileTracker: Profile updated event received, refreshing...');
      fetchProfileData(true);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const fetchProfileData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );

      if (response && response.ok) {
        const data = await response.json();
        console.log('🔍 RecruiterProfileTracker: Profile data received:', data);
        console.log('🔍 RecruiterProfileTracker: Company fields:', {
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
          industry: data.industry,
          companySize: data.companySize,
          foundedYear: data.foundedYear,
          companyDescription: data.companyDescription
        });
        setProfileData(data);
      } else {
        console.log('🔍 RecruiterProfileTracker: Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProfileData(true);
  };

  // Define fields outside of calculation
  const fields = [
    // Personal Information
    { key: 'firstName', label: 'First Name', icon: faUser, required: true },
    { key: 'lastName', label: 'Last Name', icon: faUser, required: true },
    { key: 'email', label: 'Email', icon: faUser, required: true },
    { key: 'phone', label: 'Phone Number', icon: faPhone, required: true },
    { key: 'location', label: 'Location', icon: faMapMarkerAlt, required: true },
    
    // Company Information
    { key: 'companyName', label: 'Company Name', icon: faBuilding, required: true },
    { key: 'companyWebsite', label: 'Company Website', icon: faGlobe, required: false },
    { key: 'industry', label: 'Industry', icon: faIndustry, required: true },
    { key: 'companySize', label: 'Company Size', icon: faUsers, required: true },
    { key: 'foundedYear', label: 'Founded Year', icon: faCalendarAlt, required: false },
    { key: 'companyDescription', label: 'Company Description', icon: faInfoCircle, required: true }
  ];

  useEffect(() => {
    if (!profileData) {
      setCompletionPercentage(0);
      return;
    }

    let completedFields = 0;
    let totalRequiredFields = 0;

    fields.forEach(field => {
      if (field.required) {
        totalRequiredFields++;
        const value = profileData[field.key];
        if (value && value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value) && value.length > 0) {
            completedFields++;
          } else if (!Array.isArray(value)) {
            completedFields++;
          }
        }
      }
    });

    const percentage = totalRequiredFields > 0 
      ? Math.round((completedFields / totalRequiredFields) * 100) 
      : 0;
    
    setCompletionPercentage(percentage);
  }, [profileData]);

  const getFieldStatus = (field) => {
    if (!profileData) return 'incomplete';
    
    const value = profileData[field.key];
    
    if (value && value !== '' && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        return value.length > 0 ? 'completed' : 'incomplete';
      }
      return 'completed';
    }
    
    return field.required ? 'incomplete' : 'optional';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'incomplete':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon incomplete" />;
      case 'optional':
        return <FontAwesomeIcon icon={faExclamationCircle} className="status-icon optional" />;
      default:
        return null;
    }
  };

  const handleCompleteProfile = () => {
    navigate('/recruiter-complete-profile');
  };

  if (loading) {
    return (
      <div className="profile-tracker loading">
        <div className="loading-spinner"></div>
        <p>Loading profile tracker...</p>
      </div>
    );
  }

  return (
    <div className="profile-tracker recruiter-tracker">
      <div className="tracker-header">
        <div className="header-icon">
          <FontAwesomeIcon icon={faBuilding} />
        </div>
        <div className="header-content">
          <h3>Recruiter Profile Completion</h3>
          <p>Complete your profile to attract top candidates</p>
        </div>
        <button className="refresh-btn" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faRocket} />
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Profile Completion</span>
          <span className="progress-percentage">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${completionPercentage}%`,
              background: completionPercentage === 100 
                ? 'linear-gradient(90deg, #10b981, #059669)' 
                : 'linear-gradient(90deg, #3b82f6, #2563eb)'
            }}
          ></div>
        </div>
      </div>

      <div className="fields-list">
        {fields.map((field, index) => {
          const status = getFieldStatus(field);
          return (
            <div key={index} className={`field-item ${status}`}>
              <div className="field-icon">
                <FontAwesomeIcon icon={field.icon} />
              </div>
              <div className="field-info">
                <span className="field-label">{field.label}</span>
                <span className={`status-badge ${status === 'completed' ? 'completed' : field.required ? 'required' : 'optional'}`}>
                  {status === 'completed' ? 'COMPLETED' : (field.required ? 'REQUIRED' : 'OPTIONAL')}
                </span>
              </div>
              <div className="field-status">
                {getStatusIcon(status)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="tracker-footer">
        <p className="completion-message">
          {completionPercentage >= 80 
            ? "🎉 Excellent! Your recruiter profile is almost complete." 
            : completionPercentage >= 60 
            ? "📝 Good progress! Keep adding company details." 
            : "🚀 Let's get started! Complete your profile to attract the best talent."
          }
        </p>
        
        <button 
          className="complete-profile-btn"
          onClick={handleCompleteProfile}
        >
          <FontAwesomeIcon icon={faRocket} />
          Complete Recruiter Profile
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfileTracker;

