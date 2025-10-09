import React from 'react';
import '../styles/ImprovedLoading.css';

/**
 * Skeleton Loader - Smooth content placeholders
 * 
 * @param {string} type - 'text', 'title', 'card', 'circle'
 * @param {number} count - Number of skeleton items
 * @param {string} className - Additional CSS classes
 */
const SkeletonLoader = ({ 
  type = 'text', 
  count = 1,
  className = ''
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div 
      key={index} 
      className={`modern-skeleton ${type} ${className}`}
      aria-label="Loading..."
    />
  ));

  return <div className="skeleton-container">{skeletons}</div>;
};

export default SkeletonLoader;
