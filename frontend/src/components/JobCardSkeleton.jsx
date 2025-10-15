import React from 'react';

const JobCardSkeleton = ({ count = 6, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className={`job-card-skeleton ${className}`}>
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-badge"></div>
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line long"></div>
        <div className="skeleton-line short"></div>
      </div>
      
      <div className="skeleton-actions">
        <div className="skeleton-button primary"></div>
        <div className="skeleton-button secondary"></div>
      </div>
    </div>
  ));

  return (
    <div className="job-cards-skeleton-container">
      {skeletons}
    </div>
  );
};

export default JobCardSkeleton;
