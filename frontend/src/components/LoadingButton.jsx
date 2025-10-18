import React from 'react';
import './LoadingButton.css';

const LoadingButton = ({ 
  isLoading = false,
  children,
  loadingText = "Loading...",
  disabled = false,
  className = "",
  size = "medium",
  variant = "primary",
  ...props
}) => {
  const baseClass = `loading-button loading-button-${variant} loading-button-${size}`;
  const combinedClass = `${baseClass} ${className}`;

  return (
    <button 
      className={combinedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="button-loading-content">
          <div className="button-spinner">
            <div className="button-spinner-ring"></div>
            <div className="button-spinner-ring delay-1"></div>
          </div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
