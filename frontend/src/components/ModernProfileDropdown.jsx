import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser, faCog, faSignOutAlt, faBuilding, faClipboardList, faGift, faCrown, faShieldAlt, faHome, faSearch, faChartLine, faFileAlt, faUsers, faCoins, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useProfilePhoto } from '../context/ProfilePhotoContext';
import '../styles/ModernProfileDropdown.css';

const ModernProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isJobSeeker, isRecruiter, isAuthenticated } = useAuth();
  const { profilePhoto, getUserInitials } = useProfilePhoto();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔐 ModernProfileDropdown - User not authenticated, not rendering');
    return null;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getDisplayInitials = () => {
    if (user?.firstName && user?.lastName) {
      return getUserInitials(user.firstName, user.lastName);
    }
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return getUserInitials(nameParts[0], nameParts[1]);
      }
      return getUserInitials(user.name, '');
    }
    return getUserInitials('', '');
  };

  return (
    <div className="modern-profile-dropdown" ref={dropdownRef}>
      <button className="modern-profile-trigger" onClick={toggleDropdown}>
        <div className="modern-avatar">
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="modern-avatar-image"
            />
          ) : (
            <div className="modern-avatar-placeholder">
              {getDisplayInitials()}
            </div>
          )}
        </div>
        
        <div className="modern-profile-text">
          <span className="modern-profile-label">PROFILE</span>
        </div>
        
        <div className="modern-dropdown-arrow">
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`modern-arrow-icon ${isOpen ? 'open' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="modern-dropdown-menu">
          <div className="modern-dropdown-header">
            <div className="modern-header-avatar">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="modern-header-avatar-image"
                />
              ) : (
                <div className="modern-header-avatar-placeholder">
                  {getDisplayInitials()}
                </div>
              )}
            </div>
            <div className="modern-header-info">
              <div className="modern-header-name">
                {user?.name || user?.firstName + ' ' + user?.lastName || 'User'}
              </div>
              <div className="modern-header-role">
                {isJobSeeker() ? 'Jobseeker' : isRecruiter() ? 'Recruiter' : 'User'}
              </div>
            </div>
          </div>
          
          <div className="modern-dropdown-divider"></div>
          
          <div className="modern-dropdown-items">
            {/* Dashboard - Show appropriate dashboard based on role */}
            <Link 
              to={isJobSeeker() ? "/jobseeker-dashboard" : isRecruiter() ? "/recruiter-dashboard" : "/dashboard"} 
              className="modern-dropdown-item" 
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faHome} className="modern-item-icon" />
              <span className="modern-item-text">Dashboard</span>
            </Link>
            
            {/* Job Seeker Specific Items */}
            {isJobSeeker() && (
              <>
                <Link to="/jobs" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faSearch} className="modern-item-icon" />
                  <span className="modern-item-text">Find Jobs</span>
                </Link>
                
                <Link to="/application-tracker" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faClipboardList} className="modern-item-icon" />
                  <span className="modern-item-text">My Applications</span>
                </Link>
                
                <Link to="/jobseeker-analytics" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faChartLine} className="modern-item-icon" />
                  <span className="modern-item-text">Analytics</span>
                </Link>
                
                <Link to="/resume-builder" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faFileAlt} className="modern-item-icon" />
                  <span className="modern-item-text">Resume Builder</span>
                </Link>
              </>
            )}
            
            {/* Recruiter Specific Items */}
            {isRecruiter() && (
              <>
                <Link to="/post-job" className="modern-dropdown-item post-job-item" onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faBriefcase} className="modern-item-icon" />
                  <span className="modern-item-text">Post a Job</span>
                </Link>
              </>
            )}
            
            {/* Common Items for Both */}
            <Link to="/profile" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faUser} className="modern-item-icon" />
              <span className="modern-item-text">Profile</span>
            </Link>
            
            <Link to="/community" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faUsers} className="modern-item-icon" />
              <span className="modern-item-text">Community</span>
            </Link>
            
            <Link to="/reference-verification" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faUser} className="modern-item-icon" />
              <span className="modern-item-text">Reference Verification</span>
            </Link>
            
            <Link 
              to={isJobSeeker() ? "/jobseeker-settings" : isRecruiter() ? "/recruiter-settings" : "/settings"} 
              className="modern-dropdown-item" 
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faCog} className="modern-item-icon" />
              <span className="modern-item-text">Settings</span>
            </Link>
            
            <div className="modern-dropdown-divider"></div>
            
            {/* Additional Items */}
            <Link to="/promo-codes" className="modern-dropdown-item promo-code-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faCoins} className="modern-item-icon" />
              <span className="modern-item-text">Promo Code & Coins</span>
            </Link>
            
            <Link to="/premium" className="modern-dropdown-item premium-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faCrown} className="modern-item-icon" />
              <span className="modern-item-text">Get Premium</span>
            </Link>
            
            <div className="modern-dropdown-divider"></div>
            
            <Link to="/privacy-policy" className="modern-dropdown-item" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faShieldAlt} className="modern-item-icon" />
              <span className="modern-item-text">Privacy Policy</span>
            </Link>
            
            <button className="modern-dropdown-item logout-item" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="modern-item-icon" />
              <span className="modern-item-text">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProfileDropdown;
