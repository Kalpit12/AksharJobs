import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/Global.css';

const LoadingSpinner = ({ 
  type = 'spinner', 
  size = 'medium', 
  text = 'Loading...', 
  showText = true,
  className = '',
  color = 'primary'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  const renderSpinner = () => {
    switch (type) {
      case 'pulse':
        return (
          <div className={`loading-pulse ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
        );
      
      case 'dots':
        return (
          <div className={`loading-dots ${className}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'shimmer':
        return (
          <div className={`loading-shimmer ${sizeClasses[size]} ${className}`} />
        );
      
      case 'rocket':
        return (
          <div className={`loading-with-icon ${className}`}>
            <FontAwesomeIcon 
              icon={faRocket} 
              className={`icon ${sizeClasses[size]} ${colorClasses[color]}`} 
            />
            {showText && <span className="loading-text">{text}</span>}
          </div>
        );
      
      case 'skeleton':
        return (
          <div className={`loading-skeleton ${className}`}>
            <div className="loading-skeleton-text"></div>
            <div className="loading-skeleton-text"></div>
            <div className="loading-skeleton-text"></div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
        );
    }
  };

  return (
    <div className="loading-container">
      {renderSpinner()}
      {showText && type !== 'rocket' && (
        <p className="loading-text">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
