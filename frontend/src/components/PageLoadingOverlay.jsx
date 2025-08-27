import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Global.css';

const PageLoadingOverlay = ({ 
  isVisible = false, 
  text = 'Loading...', 
  type = 'rocket',
  size = 'large',
  backdrop = true 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`page-loading-overlay ${backdrop ? 'with-backdrop' : ''}`}>
      <div className="page-loading-content">
        <LoadingSpinner 
          type={type} 
          size={size} 
          text={text}
          showText={true}
        />
      </div>
    </div>
  );
};

export default PageLoadingOverlay;
