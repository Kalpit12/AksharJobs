import React from 'react';
import '../styles/Global.css';

const SkeletonLoader = ({ 
  type = 'card', 
  lines = 3, 
  className = '',
  height = 'auto',
  width = '100%'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton-text-container" style={{ width }}>
            {Array.from({ length: lines }).map((_, index) => (
              <div 
                key={index} 
                className={`loading-skeleton loading-skeleton-text ${
                  index === lines - 1 ? 'last-line' : ''
                }`}
                style={{ 
                  width: index === lines - 1 ? '60%' : '100%',
                  height: '16px',
                  marginBottom: '8px'
                }}
              />
            ))}
          </div>
        );
      
      case 'avatar':
        return (
          <div 
            className="loading-skeleton loading-skeleton-avatar"
            style={{ width: height, height }}
          />
        );
      
      case 'card':
        return (
          <div 
            className="loading-skeleton loading-skeleton-card"
            style={{ height, width }}
          />
        );
      
      case 'list':
        return (
          <div className="skeleton-list-container">
            {Array.from({ length: lines }).map((_, index) => (
              <div 
                key={index} 
                className="loading-skeleton loading-skeleton-card"
                style={{ 
                  height: '80px',
                  marginBottom: '16px',
                  borderRadius: '8px'
                }}
              />
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table-container">
            <div className="skeleton-table-header">
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index} 
                  className="loading-skeleton loading-skeleton-text"
                  style={{ 
                    height: '20px',
                    marginBottom: '16px',
                    width: '100%'
                  }}
                />
              ))}
            </div>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-table-row">
                {Array.from({ length: 4 }).map((_, cellIndex) => (
                  <div 
                    key={cellIndex} 
                    className="loading-skeleton loading-skeleton-text"
                    style={{ 
                      height: '16px',
                      marginBottom: '8px',
                      width: '100%'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div 
            className="loading-skeleton"
            style={{ height, width }}
          />
        );
    }
  };

  return (
    <div className={`skeleton-loader ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;
