import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ModernCompanyProfile.css';

const ModernCompanyProfile = ({ userDetails }) => {
  const { user } = useAuth();

  // Helper function to get display name
  const getDisplayName = () => {
    // Try localStorage first (most reliable)
    const storedFirstName = localStorage.getItem('userFirstName');
    const storedLastName = localStorage.getItem('userLastName');
    
    if (storedFirstName && storedLastName && storedFirstName !== 'undefined' && storedLastName !== 'undefined') {
      return `${storedFirstName} ${storedLastName}`;
    }
    
    if (userDetails?.name) {
      return userDetails.name;
    }
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName} ${userDetails.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Sarah Johnson';
  };

  // Helper function to get company name
  const getCompanyName = () => {
    if (userDetails?.company) return userDetails.company;
    if (userDetails?.companyName) return userDetails.companyName;
    if (user?.company) return user.company;
    if (user?.companyName) return user.companyName;
    return 'TechCorp Solutions';
  };

  // Helper function to get location
  const getLocation = () => {
    if (userDetails?.location) return userDetails.location;
    if (userDetails?.city && userDetails?.country) {
      return `${userDetails.city}, ${userDetails.country}`;
    }
    if (user?.location) return user.location;
    if (user?.city && user?.country) {
      return `${user.city}, ${user.country}`;
    }
    return 'Nairobi, Kenya';
  };

  const getUserInitials = () => {
    const displayName = getDisplayName();
    const nameParts = displayName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div className="modern-company-profile">
      <div className="modern-profile-card">
        <div className="modern-profile-avatar">
          {userDetails?.avatar ? (
            <img 
              src={userDetails.avatar} 
              alt={getDisplayName()} 
              className="modern-avatar-img"
            />
          ) : (
            <div className="modern-avatar-placeholder">
              <span className="modern-avatar-initials">{getUserInitials()}</span>
            </div>
          )}
        </div>
        
        <div className="modern-profile-content">
          <div className="modern-profile-name">
            {getDisplayName()}
          </div>
          
          <div className="modern-profile-company">
            {getCompanyName()}
          </div>
          
          <div className="modern-profile-details">
            <div className="modern-detail-item">
              <div className="modern-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#6b7280"/>
                </svg>
              </div>
              <span className="modern-detail-text">
                {getLocation()}
              </span>
            </div>
            
            <div className="modern-detail-item">
              <div className="modern-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.5-1.85 1.26L12 14.5l-2.15-5.24C9.54 8.5 8.8 8 8 8H5.46c-.8 0-1.54.5-1.85 1.26L1.5 16H4v6h2v-6h2.5l2.5 6h2l-2.5-6H14v6h2z" fill="#6b7280"/>
                </svg>
              </div>
              <span className="modern-detail-text">
                {userDetails?.connections || '500+'} connections
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCompanyProfile;
