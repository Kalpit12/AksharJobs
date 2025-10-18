import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUsers, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons';
import './GlobalLoadingScreen.css';

const GlobalLoadingScreen = ({ 
  message = "Welcome to AksharJobs",
  subMessage = "Connecting you to opportunities",
  showProgress = false,
  progress = 0,
  className = ""
}) => {
  const icons = [faBriefcase, faUsers, faChartLine, faCog];
  
  return (
    <div className={`global-loading-screen ${className}`}>
      {/* Animated Background */}
      <div className="loading-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main Content */}
      <div className="loading-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div className="logo-text">
              <h1>AksharJobs</h1>
              <p>Connecting Talent with Opportunity</p>
            </div>
          </div>
        </div>

        {/* Animated Icons */}
        <div className="animated-icons">
          {icons.map((icon, index) => (
            <div 
              key={index} 
              className="floating-icon"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div className="main-spinner">
          <div className="spinner-ring outer">
            <div className="spinner-ring middle">
              <div className="spinner-ring inner"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-content">
          <h2 className="loading-title">{message}</h2>
          <p className="loading-subtitle">{subMessage}</p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}

        {/* Loading Dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Particle Effects */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GlobalLoadingScreen;
