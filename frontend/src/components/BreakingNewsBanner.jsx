import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/BreakingNewsBanner.css';

const BreakingNewsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="breaking-news-banner">
      <div className="banner-content">
        <div className="banner-left">
          <div className="banner-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="banner-text">
            <span className="banner-label">NEW FEATURE</span>
            <span className="banner-message">
              Swahili & Local Language Resume Analysis - Access 70% more Kenyan talent
            </span>
          </div>
        </div>

        <div className="banner-right">
          <button className="learn-more-btn">
            Learn More
          </button>
          <button className="banner-close-btn" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBanner;
