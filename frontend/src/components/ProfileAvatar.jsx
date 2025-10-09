import React from 'react';
import '../styles/ProfileAvatar.css';

/**
 * New Profile Avatar Component - Perfect Circle Fit
 * Handles both images and initials with perfect sizing
 */
const ProfileAvatar = ({ 
  src, 
  firstName = '', 
  lastName = '', 
  size = 100,
  showOnlineIndicator = true,
  className = ''
}) => {
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial) || 'U';
  };

  return (
    <div 
      className={`profile-avatar-wrapper ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="profile-avatar-circle">
        {src ? (
          <img 
            src={src} 
            alt={`${firstName} ${lastName}`}
            className="profile-avatar-image"
          />
        ) : (
          <div className="profile-avatar-initials">
            {getInitials()}
          </div>
        )}
      </div>
      {showOnlineIndicator && (
        <div className="profile-avatar-online-indicator"></div>
      )}
    </div>
  );
};

export default ProfileAvatar;

