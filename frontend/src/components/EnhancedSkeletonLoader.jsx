import React from 'react';
import '../styles/EnhancedSkeletonLoader.css';

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-avatar shimmer"></div>
      <div className="skeleton-text-group">
        <div className="skeleton-text shimmer" style={{ width: '200px', height: '32px' }}></div>
        <div className="skeleton-text shimmer" style={{ width: '300px', height: '20px' }}></div>
      </div>
    </div>
    
    <div className="skeleton-stats-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-stat-card shimmer">
          <div className="skeleton-icon"></div>
          <div className="skeleton-stat-content">
            <div className="skeleton-text" style={{ width: '60px', height: '32px' }}></div>
            <div className="skeleton-text" style={{ width: '100px', height: '16px' }}></div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="skeleton-cards-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card shimmer">
          <div className="skeleton-card-header">
            <div className="skeleton-text" style={{ width: '150px', height: '24px' }}></div>
            <div className="skeleton-text" style={{ width: '80px', height: '20px' }}></div>
          </div>
          <div className="skeleton-card-body">
            <div className="skeleton-text" style={{ width: '100%', height: '16px' }}></div>
            <div className="skeleton-text" style={{ width: '90%', height: '16px' }}></div>
            <div className="skeleton-text" style={{ width: '70%', height: '16px' }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="skeleton-card shimmer">
    <div className="skeleton-card-header">
      <div className="skeleton-text" style={{ width: '150px', height: '24px' }}></div>
    </div>
    <div className="skeleton-card-body">
      <div className="skeleton-text" style={{ width: '100%', height: '16px' }}></div>
      <div className="skeleton-text" style={{ width: '90%', height: '16px' }}></div>
      <div className="skeleton-text" style={{ width: '80%', height: '16px' }}></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header shimmer">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-text" style={{ width: '100px', height: '20px' }}></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-table-row shimmer">
        {[1, 2, 3, 4].map((j) => (
          <div key={j} className="skeleton-text" style={{ width: '100px', height: '16px' }}></div>
        ))}
      </div>
    ))}
  </div>
);

const EnhancedSkeletonLoader = ({ type = 'dashboard', ...props }) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'card':
      return <CardSkeleton />;
    case 'table':
      return <TableSkeleton {...props} />;
    default:
      return <DashboardSkeleton />;
  }
};

export default EnhancedSkeletonLoader;

