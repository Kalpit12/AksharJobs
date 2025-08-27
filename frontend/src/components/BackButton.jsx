import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = ({ 
  to = '/jobseeker-dashboard', 
  text = 'Back',
  className = '',
  position = 'top-left' // top-left, top-center, top-right
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <div className={`back_button_container ${position} ${className}`}>
      <button 
        className="back_button" 
        onClick={handleBack} 
        aria-label={`Go back to ${text}`}
      >
        <span className="back_arrow">←</span>
        <span className="back_text">{text}</span>
      </button>
    </div>
  );
};

export default BackButton;
