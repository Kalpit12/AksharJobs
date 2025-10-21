import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faUpload, 
  faEdit, 
  faBriefcase,
  faFileAlt,
  faUser,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

const QuickActions = ({ 
  theme = 'jobSeeker', 
  onBrowseJobs, 
  onUpdateResume, 
  onEditProfile,
  customActions = []
}) => {
  // Theme configurations
  const themes = {
    jobSeeker: {
      primaryColor: '#ff8c42',
      secondaryColor: '#20b2aa',
      borderColor: '#ff8c42',
      shadowColor: 'rgba(255, 140, 66, 0.3)',
      titleColor: '#ff8c42'
    },
    recruiter: {
      primaryColor: '#ff6b35',
      secondaryColor: '#20b2aa',
      borderColor: '#ff6b35',
      shadowColor: 'rgba(255, 107, 53, 0.3)',
      titleColor: '#ff6b35'
    },
    admin: {
      primaryColor: '#9c27b0',
      secondaryColor: '#20b2aa',
      borderColor: '#9c27b0',
      shadowColor: 'rgba(156, 39, 176, 0.3)',
      titleColor: '#9c27b0'
    }
  };

  const currentTheme = themes[theme] || themes.jobSeeker;

  // Default actions
  const defaultActions = [
    {
      id: 'browse-jobs',
      text: 'BROWSE JOBS',
      icon: faSearch,
      emoji: '🔍',
      onClick: onBrowseJobs,
      description: 'Search and apply for jobs'
    },
    {
      id: 'update-resume',
      text: 'UPDATE RESUME',
      icon: faUpload,
      emoji: '📄',
      onClick: onUpdateResume,
      description: 'Upload or update your resume'
    },
    {
      id: 'edit-profile',
      text: 'EDIT PROFILE',
      icon: faEdit,
      emoji: '✏️',
      onClick: onEditProfile,
      description: 'Update your profile information'
    }
  ];

  // Merge default actions with custom actions
  const allActions = [...defaultActions, ...customActions];

  const buttonStyle = {
    background: `linear-gradient(135deg, ${currentTheme.primaryColor} 0%, ${currentTheme.secondaryColor} 100%)`,
    border: `2px solid ${currentTheme.primaryColor}`,
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '10px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    margin: '8px 0',
    minHeight: '40px',
    cursor: 'pointer',
    boxShadow: `0 3px 10px ${currentTheme.shadowColor}`,
    transition: 'all 0.3s ease',
    textAlign: 'center',
    userSelect: 'none'
  };

  const hoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: `0 5px 15px ${currentTheme.shadowColor}`,
    background: `linear-gradient(135deg, ${currentTheme.primaryColor} 0%, ${currentTheme.secondaryColor} 100%)`
  };

  return (
    <div 
      className="card" 
      style={{ 
        marginTop: '20px', 
        border: `2px solid ${currentTheme.borderColor}`,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="card-header">
        <h3 
          className="card-title" 
          style={{ 
            color: currentTheme.titleColor, 
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0'
          }}
        >
          <FontAwesomeIcon icon={faBolt} style={{ fontSize: '16px' }} />
          Quick Actions
        </h3>
        <hr style={{ 
          border: `1px solid ${currentTheme.borderColor}`, 
          margin: '10px 0',
          opacity: 0.3
        }} />
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px', 
        padding: '10px' 
      }}>
        {allActions.map((action, index) => (
          <div
            key={action.id || index}
            onClick={action.onClick}
            style={buttonStyle}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, buttonStyle);
            }}
            title={action.description}
          >
            <FontAwesomeIcon 
              icon={action.icon} 
              style={{ fontSize: '14px', color: 'white' }} 
            /> 
            {action.emoji} {action.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
