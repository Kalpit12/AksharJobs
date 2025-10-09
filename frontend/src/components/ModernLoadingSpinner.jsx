import React from 'react';
import '../styles/ImprovedLoading.css';

/**
 * Modern Loading Spinner - Fast, Smooth, Minimal & Attractive
 * 
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} text - Loading text to display
 * @param {string} type - 'spinner', 'dots', 'progress'
 * @param {boolean} overlay - Show as full-page overlay
 */
const ModernLoadingSpinner = ({ 
  size = 'medium', 
  text = '', 
  type = 'spinner',
  overlay = false,
  dark = false
}) => {
  
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="modern-loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="modern-progress-bar">
            <div className="modern-progress-fill"></div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className={`modern-loading-spinner ${size}`}></div>
        );
    }
  };

  const content = (
    <div className="modern-loading-container">
      {renderLoader()}
      {text && <p className="modern-loading-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className={`modern-page-overlay ${dark ? 'dark' : ''}`}>
        {content}
      </div>
    );
  }

  return content;
};

export default ModernLoadingSpinner;

