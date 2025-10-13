import React, { useState, useEffect } from 'react';
import '../styles/CollapsibleProfileCompletion.css';

const CollapsibleProfileCompletion = ({ userDetails, onProfileUpdate }) => {
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('profileCompletionHidden') === 'true';
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Save hidden state to localStorage
  useEffect(() => {
    localStorage.setItem('profileCompletionHidden', isHidden.toString());
  }, [isHidden]);

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsHidden(!isHidden);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleMouseDown = (e) => {
    if (isHidden) return;
    
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!dragStart || isHidden) return;
    
    const deltaX = e.clientX - dragStart;
    const maxDrag = 200; // Maximum drag distance
    
    if (deltaX > 0) {
      setDragOffset(Math.min(deltaX, maxDrag));
    }
  };

  const handleMouseUp = () => {
    if (!dragStart) return;
    
    const threshold = 100; // Drag threshold to hide
    
    if (dragOffset > threshold) {
      setIsAnimating(true);
      setIsHidden(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
    
    setDragStart(null);
    setDragOffset(0);
  };

  const handleTouchStart = (e) => {
    handleMouseDown(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    handleMouseMove(e.touches[0]);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'company',
      'position',
      'location',
      'bio'
    ];
    
    const completedFields = fields.filter(field => 
      userDetails?.[field] && userDetails[field].trim() !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <>
      {/* Hidden State Toggle Button */}
      {isHidden && (
        <button 
          className="profile-toggle-btn"
          onClick={handleToggle}
          title="Show Profile Completion"
        >
          <span className="toggle-icon">👤</span>
          <span className="toggle-text">Profile</span>
        </button>
      )}

      {/* Main Profile Completion Card */}
      <div 
        className={`profile-completion-card ${isHidden ? 'hidden' : ''} ${isAnimating ? 'animating' : ''}`}
        style={{
          transform: isHidden 
            ? 'translateX(100%)' 
            : `translateX(${dragOffset}px)`,
          opacity: isHidden ? 0 : 1
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Indicator */}
        <div className="drag-indicator">
          <div className="drag-handle"></div>
        </div>

        {/* Card Header */}
        <div className="card-header">
          <div className="header-content">
            <div className="profile-icon">🏢</div>
            <div className="header-text">
              <h3>Recruiter Profile Completion</h3>
              <p>Complete your profile to attract top candidates</p>
            </div>
          </div>
          <button 
            className="close-btn"
            onClick={handleToggle}
            title="Hide Profile Completion"
          >
            ✕
          </button>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Profile Completion</span>
            <span className="progress-percentage">{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="profile-fields">
          {[
            { key: 'firstName', label: 'First Name', icon: '👤' },
            { key: 'lastName', label: 'Last Name', icon: '👤' },
            { key: 'email', label: 'Email', icon: '📧' },
            { key: 'phone', label: 'Phone', icon: '📞' },
            { key: 'company', label: 'Company', icon: '🏢' },
            { key: 'position', label: 'Position', icon: '💼' },
            { key: 'location', label: 'Location', icon: '📍' },
            { key: 'bio', label: 'Bio', icon: '📝' }
          ].map((field) => {
            const isCompleted = userDetails?.[field.key] && userDetails[field.key].trim() !== '';
            
            return (
              <div key={field.key} className={`field-item ${isCompleted ? 'completed' : 'incomplete'}`}>
                <div className="field-icon">{field.icon}</div>
                <div className="field-content">
                  <span className="field-label">{field.label}</span>
                  <span className="field-value">
                    {isCompleted ? userDetails[field.key] : 'Not provided'}
                  </span>
                </div>
                <div className="field-status">
                  {isCompleted ? (
                    <>
                      <span className="status-badge completed">COMPLETED</span>
                      <span className="check-icon">✅</span>
                    </>
                  ) : (
                    <span className="status-badge incomplete">INCOMPLETE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => onProfileUpdate?.()}
          >
            ✏️ Edit Profile
          </button>
          <button 
            className="hide-card-btn"
            onClick={handleToggle}
          >
            👁️ Hide This Card
          </button>
        </div>

        {/* Drag Hint */}
        <div className="drag-hint">
          <span>💡 Tip: Drag right to hide this card</span>
        </div>
      </div>
    </>
  );
};

export default CollapsibleProfileCompletion;
