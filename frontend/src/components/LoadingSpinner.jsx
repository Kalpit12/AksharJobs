import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  message = "Loading...", 
  subMessage = "", 
  size = "large",
  showIcon = true,
  className = ""
}) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className="loading-content">
        {showIcon && (
          <div className="loading-icon-container">
            <div className="loading-circle">
              <div className="loading-circle-inner"></div>
            </div>
            <div className="loading-icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
          </div>
        )}
        
        <div className="loading-text">
          <h3 className="loading-title">{message}</h3>
          {subMessage && <p className="loading-subtitle">{subMessage}</p>}
        </div>

        {/* Animated dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Background animation */}
      <div className="loading-background">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay-1"></div>
        <div className="pulse-ring delay-2"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
