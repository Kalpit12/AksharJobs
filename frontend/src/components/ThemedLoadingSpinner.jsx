import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faBriefcase, 
  faUserTie,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ThemedLoadingSpinner.css';

// Theme configuration outside component to avoid recreation
const THEME_CONFIGS = {
  intern: {
    primaryColor: '#22c55e',
    secondaryColor: '#16a34a',
    accentColor: '#15803d',
    lightColor: '#f0fdf4',
    icon: faGraduationCap,
    name: 'Intern'
  },
  jobseeker: {
    primaryColor: '#3b82f6',
    secondaryColor: '#2563eb',
    accentColor: '#1d4ed8',
    lightColor: '#eff6ff',
    icon: faBriefcase,
    name: 'Job Seeker'
  },
  recruiter: {
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    accentColor: '#c2410c',
    lightColor: '#fff7ed',
    icon: faUserTie,
    name: 'Recruiter'
  }
};

function ThemedLoadingSpinner({ 
  theme = 'intern',
  size = 'large',
  text = 'Loading your dashboard...',
  subText = '',
  showIcon = true,
  fullScreen = true
}) {
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.intern;
  const containerClass = `themed-loading-container ${theme} ${size} ${fullScreen ? 'fullscreen' : ''}`;
  
  return (
    <div className={containerClass}>
      <div className="themed-loading-content">
        <div className="themed-loading-animation">
          <div className="themed-loading-ring outer">
            <div className="themed-loading-ring-inner"></div>
          </div>
          <div className="themed-loading-ring middle">
            <div className="themed-loading-ring-inner"></div>
          </div>
          <div className="themed-loading-ring inner">
            <div className="themed-loading-ring-inner"></div>
          </div>
          {showIcon && (
            <div className="themed-loading-icon">
              <FontAwesomeIcon icon={themeConfig.icon} />
            </div>
          )}
        </div>
        <div className="themed-loading-text">
          <h3 className="themed-loading-title">{text}</h3>
          {subText && <p className="themed-loading-subtitle">{subText}</p>}
        </div>
        <div className="themed-loading-dots">
          <span className="themed-dot"></span>
          <span className="themed-dot"></span>
          <span className="themed-dot"></span>
        </div>
      </div>
      <div className="themed-loading-background">
        <div className="themed-pulse-ring"></div>
        <div className="themed-pulse-ring delay-1"></div>
        <div className="themed-pulse-ring delay-2"></div>
      </div>
    </div>
  );
}

export default ThemedLoadingSpinner;
