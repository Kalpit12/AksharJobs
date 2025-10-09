import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faTint, 
  faCalendarAlt, 
  faVenusMars, 
  faFileAlt, 
  faGraduationCap, 
  faBriefcase, 
  faCogs,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faRocket,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProfileTracker.css';

const ProfileTracker = ({ onCompletionChange, isSidebar = false }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchProfileData();
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('🔍 ProfileTracker: Timeout reached, forcing loading to false');
        setLoading(false);
        setIsRefreshing(false);
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeout);
  }, []);

  // Refresh data when component becomes visible (e.g., returning from complete profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProfileData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchProfileData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔍 ProfileTracker: Fetching profile data...');
      
      // Fetch user profile data
      const profileResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );
      
      if (profileResponse && profileResponse.ok) {
        const profile = await profileResponse.json();
        console.log('🔍 ProfileTracker: Profile data received:', profile);
        setProfileData(profile);
      } else {
        console.log('🔍 ProfileTracker: Profile response not ok:', profileResponse?.status);
      }

      // Fetch resume data
      const resumeResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/modern-resumes/profile')
      );
      
      if (resumeResponse && resumeResponse.ok) {
        const resume = await resumeResponse.json();
        console.log('🔍 ProfileTracker: Resume data received:', resume);
        setResumeData(resume.resume_data || resume);
      } else {
        console.log('🔍 ProfileTracker: Resume response not ok:', resumeResponse?.status);
        // Set empty resume data to prevent loading state
        setResumeData({});
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set empty data to prevent infinite loading
      setProfileData({});
      setResumeData({});
    } finally {
      console.log('🔍 ProfileTracker: Setting loading to false');
      setLoading(false);
      setIsRefreshing(false);
      setDataLoaded(true);
    }
  };

  const handleCompleteProfile = () => {
    navigate('/complete-profile');
  };

  const handleRefresh = () => {
    fetchProfileData(true);
  };

  const calculateCompletion = () => {
    console.log('🔍 ProfileTracker: Calculating completion...');
    console.log('🔍 ProfileTracker: profileData:', profileData);
    console.log('🔍 ProfileTracker: resumeData:', resumeData);
    
    if (!profileData && !resumeData) {
      console.log('🔍 ProfileTracker: No data available, returning 0');
      return 0;
    }

    const fields = [
      // Basic Information
      { key: 'firstName', label: 'First Name', icon: faUser, required: true },
      { key: 'lastName', label: 'Last Name', icon: faUser, required: true },
      { key: 'email', label: 'Email', icon: faUser, required: true },
      { key: 'phoneNumber', label: 'Phone Number', icon: faPhone, required: true },
      { key: 'dateOfBirth', label: 'Date of Birth', icon: faCalendarAlt, required: false },
      { key: 'gender', label: 'Gender', icon: faVenusMars, required: false },
      { key: 'bloodGroup', label: 'Blood Group', icon: faTint, required: false },
      { key: 'location', label: 'Location', icon: faMapMarkerAlt, required: true },
      
      // Resume Information
      { key: 'resume', label: 'Resume Uploaded', icon: faFileAlt, required: true, isResume: true },
      { key: 'skills', label: 'Skills', icon: faCogs, required: true, isResume: false },
      { key: 'experience', label: 'Work Experience', icon: faBriefcase, required: true, isResume: true },
      { key: 'education', label: 'Education', icon: faGraduationCap, required: true, isResume: true }
    ];

    let completedFields = 0;
    let totalRequiredFields = 0;

    fields.forEach(field => {
      if (field.required) {
        totalRequiredFields++;
        
        if (field.isResume) {
          // Check resume data
          if (resumeData) {
            if (field.key === 'resume') {
              if (resumeData.personal_info && resumeData.personal_info.name) {
                completedFields++;
                console.log(`✅ ${field.label}: Completed (resume uploaded)`);
              } else {
                console.log(`❌ ${field.label}: Missing (no resume)`);
              }
            } else if (resumeData[field.key] && resumeData[field.key].length > 0) {
              completedFields++;
              console.log(`✅ ${field.label}: Completed`);
            } else {
              console.log(`❌ ${field.label}: Missing`);
            }
          } else {
            console.log(`❌ ${field.label}: Missing (no resume data)`);
          }
        } else {
          // Check profile data with proper field mapping
          let value;
          switch (field.key) {
            case 'firstName':
              value = profileData?.fullName ? profileData.fullName.split(' ')[0] : '';
              break;
            case 'lastName':
              value = profileData?.fullName ? profileData.fullName.split(' ').slice(1).join(' ') : '';
              break;
            case 'email':
              value = profileData?.email;
              break;
            case 'phoneNumber':
              value = profileData?.phone;
              break;
            case 'dateOfBirth':
              value = profileData?.dateOfBirth;
              break;
            case 'gender':
              value = profileData?.gender;
              break;
            case 'bloodGroup':
              value = profileData?.bloodGroup;
              break;
            case 'location':
              value = profileData?.location;
              break;
            case 'skills':
              value = profileData?.skills;
              break;
            default:
              value = profileData?.[field.key];
          }
          
          if (field.key === 'location') {
            if (value && (typeof value === 'string' ? value.trim() : Object.keys(value).length > 0)) {
              completedFields++;
              console.log(`✅ ${field.label}: Completed`);
            } else {
              console.log(`❌ ${field.label}: Missing`);
            }
          } else if (field.key === 'skills') {
            // Check both profile skills and resume skills
            const hasProfileSkills = value && Array.isArray(value) && value.length > 0;
            const hasResumeSkills = resumeData?.skills && (
              (resumeData.skills.technical_skills && resumeData.skills.technical_skills.length > 0) ||
              (resumeData.skills.soft_skills && resumeData.skills.soft_skills.length > 0) ||
              (resumeData.skills.languages && resumeData.skills.languages.length > 0)
            );
            if (hasProfileSkills || hasResumeSkills) {
              completedFields++;
              console.log(`✅ ${field.label}: Completed (profile: ${hasProfileSkills}, resume: ${hasResumeSkills})`);
            } else {
              console.log(`❌ ${field.label}: Missing (no skills found)`);
            }
          } else if (value && value.toString().trim()) {
            completedFields++;
            console.log(`✅ ${field.label}: Completed`);
          } else {
            console.log(`❌ ${field.label}: Missing`);
          }
        }
      }
    });

    const percentage = Math.round((completedFields / totalRequiredFields) * 100);
    console.log(`🔍 ProfileTracker: Completion calculation - ${completedFields}/${totalRequiredFields} = ${percentage}%`);
    
    setCompletionPercentage(percentage);
    
    if (onCompletionChange) {
      onCompletionChange(percentage);
    }

    return { completedFields, totalRequiredFields, percentage };
  };

  useEffect(() => {
    console.log('🔍 ProfileTracker: useEffect triggered - profileData:', !!profileData, 'resumeData:', !!resumeData, 'loading:', loading);
    
    if (profileData !== null || resumeData !== null) {
      console.log('🔍 ProfileTracker: Data available, calculating completion...');
      calculateCompletion();
    } else if (!loading && profileData === null && resumeData === null) {
      console.log('🔍 ProfileTracker: No data available after loading, setting 0%');
      // Show 0% if no data is available after loading
      setCompletionPercentage(0);
      if (onCompletionChange) {
        onCompletionChange(0);
      }
    }
  }, [profileData, resumeData, loading]);

  const getFieldStatus = (field) => {
    if (field.isResume) {
      if (!resumeData) return 'missing';
      if (field.key === 'resume') {
        return resumeData.personal_info && resumeData.personal_info.name ? 'completed' : 'missing';
      }
      return resumeData[field.key] && resumeData[field.key].length > 0 ? 'completed' : 'missing';
    } else {
      if (!profileData) return 'missing';
      
      let value;
      // Map field keys to profile data structure
      switch (field.key) {
        case 'firstName':
          value = profileData.fullName ? profileData.fullName.split(' ')[0] : '';
          break;
        case 'lastName':
          value = profileData.fullName ? profileData.fullName.split(' ').slice(1).join(' ') : '';
          break;
        case 'email':
          value = profileData.email;
          break;
        case 'phoneNumber':
          value = profileData.phone;
          break;
        case 'dateOfBirth':
          value = profileData.dateOfBirth;
          break;
        case 'gender':
          value = profileData.gender;
          break;
        case 'bloodGroup':
          value = profileData.bloodGroup;
          break;
        case 'location':
          value = profileData.location;
          break;
        case 'skills':
          value = profileData.skills;
          break;
        default:
          value = profileData[field.key];
      }
      
      if (field.key === 'location') {
        return value && (typeof value === 'string' ? value.trim() : Object.keys(value).length > 0) ? 'completed' : 'missing';
      } else if (field.key === 'skills') {
        // Check both profile skills and resume skills
        const hasProfileSkills = value && Array.isArray(value) && value.length > 0;
        const hasResumeSkills = resumeData?.skills && (
          (resumeData.skills.technical_skills && resumeData.skills.technical_skills.length > 0) ||
          (resumeData.skills.soft_skills && resumeData.skills.soft_skills.length > 0) ||
          (resumeData.skills.languages && resumeData.skills.languages.length > 0)
        );
        return (hasProfileSkills || hasResumeSkills) ? 'completed' : 'missing';
      }
      return value && value.toString().trim() ? 'completed' : 'missing';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'missing':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon missing" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon warning" />;
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  console.log('🔍 ProfileTracker: Render - loading:', loading, 'completionPercentage:', completionPercentage, 'profileData:', !!profileData, 'resumeData:', !!resumeData);

  // Force render percentage if we have data, even if loading is still true
  const shouldShowLoading = loading && !dataLoaded && !profileData && !resumeData;
  
  if (shouldShowLoading) {
    return (
      <div className={`profile-tracker loading ${isSidebar ? 'sidebar' : ''}`}>
        <div className="tracker-content">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faCogs} spin />
          </div>
          <p>Loading profile status...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'firstName', label: 'First Name', icon: faUser, required: true },
    { key: 'lastName', label: 'Last Name', icon: faUser, required: true },
    { key: 'email', label: 'Email', icon: faUser, required: true },
    { key: 'phoneNumber', label: 'Phone Number', icon: faPhone, required: true },
    { key: 'dateOfBirth', label: 'Date of Birth', icon: faCalendarAlt, required: false },
    { key: 'gender', label: 'Gender', icon: faVenusMars, required: false },
    { key: 'bloodGroup', label: 'Blood Group', icon: faTint, required: false },
    { key: 'location', label: 'Location', icon: faMapMarkerAlt, required: true },
    { key: 'resume', label: 'Resume Uploaded', icon: faFileAlt, required: true, isResume: true },
    { key: 'skills', label: 'Skills', icon: faCogs, required: true, isResume: false },
    { key: 'experience', label: 'Work Experience', icon: faBriefcase, required: true, isResume: true },
    { key: 'education', label: 'Education', icon: faGraduationCap, required: true, isResume: true }
  ];

  return (
    <div className={`profile-tracker ${isSidebar ? 'sidebar' : ''}`}>
      <div className="tracker-header">
        <div className="header-content">
          <h3>Profile Completion</h3>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh profile status"
          >
            <FontAwesomeIcon icon={faSpinner} spin={isRefreshing} />
          </button>
        </div>
        <div className="completion-percentage">
          <span className="percentage-number" style={{ color: getCompletionColor(completionPercentage || 0) }}>
            {completionPercentage !== undefined ? completionPercentage : 0}%
          </span>
          <span className="percentage-label">Complete</span>
          {console.log('🔍 ProfileTracker: Rendering percentage:', completionPercentage)}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${completionPercentage !== undefined ? completionPercentage : 0}%`
          }}
        ></div>
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
            ? "🎉 Great job! Your profile is almost complete." 
            : completionPercentage >= 60 
            ? "📝 You're making good progress. Keep it up!" 
            : "🚀 Let's get started! Complete your profile to get better job matches."
          }
        </p>
        
        <button 
          className="complete-profile-btn"
          onClick={handleCompleteProfile}
        >
          <FontAwesomeIcon icon={faRocket} />
          Complete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileTracker;
