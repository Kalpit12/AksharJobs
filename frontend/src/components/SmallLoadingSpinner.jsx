import React from 'react';
import './SmallLoadingSpinner.css';

const SmallLoadingSpinner = ({ 
  message = "Loading...", 
  size = "medium",
  className = "",
  centered = false
}) => {
  const sizeClass = `spinner-${size}`;
  const centerClass = centered ? 'centered' : '';

  return (
    <div className={`small-loading-container ${sizeClass} ${centerClass} ${className}`}>
      <div className="small-loading-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring delay-1"></div>
          <div className="spinner-ring delay-2"></div>
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default SmallLoadingSpinner;
