import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBriefcase,
  faUser,
  faCog,
  faSignOutAlt,
  faChartLine,
  faBell,
  faEnvelope,
  faFileAlt,
  faUpload,
  faNewspaper,
  faInfoCircle,
  faAngleDown,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'job',
      title: 'New job match found',
      message: 'A new job matching your profile has been posted',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from recruiter',
      message: 'Sarah from Google has sent you a message',
      time: '4 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'application',
      title: 'Application status updated',
      message: 'Your application has been reviewed',
      time: '1 day ago',
      isRead: true
    }
  ]);

  const { user, isAuthenticated, logout } = useAuth();
  
  // Debug: Log user object to see what's available
  useEffect(() => {
    if (user) {
      console.log('User object in Header:', user);
    }
  }, [user]);
  const location = useLocation();
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Extract user name from firstName or email
  const getUserDisplayName = () => {
    if (user?.firstName && user.firstName !== 'undefined') {
      return user.firstName;
    } else if (user?.email && user.email !== 'undefined') {
      // Extract name from email (e.g., kalpitpatel751@gmail.com -> Kalpit)
      const emailName = user.email.split('@')[0];
      return emailName.replace(/[0-9]/g, '').replace(/\./g, ' ').replace(/_/g, ' ').trim();
    }
    return 'User';
  };

  // Get user role from context
  const getUserRole = () => {
    if (!user?.role || user.role === 'undefined') {
      return 'jobSeeker';
    }
    return user.role;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setShowNotifications(false);
    setShowMessages(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.isRead).length;
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getRoleDisplayName = (role) => {
    if (!role || role === 'undefined') return 'User';
    
    const roleMap = {
      'recruiter': 'Recruiter',
      'jobSeeker': 'Job Seeker',
      'jobseeker': 'Job Seeker',
      'admin': 'Administrator'
    };
    
    return roleMap[role.toLowerCase()] || 'User';
  };

  const getDashboardRoute = () => {
    if (!user || !user.role) return '/';
    
    const role = user.role.toLowerCase();
    if (role === 'recruiter') return '/recruiter-dashboard';
    if (role === 'jobseeker' || role === 'jobseeker') return '/jobseeker-dashboard';
    if (role === 'admin') return '/admin';
    
    return '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to={getDashboardRoute()} className="header-logo">
          <img src="/RocketJobs_Logo.jpg" alt="AksharJobs Logo" />
          <div>
            <div className="header-logo-text">AksharJobs</div>
            <div className="header-logo-tagline">AI-Powered Job Matching</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className={isActiveRoute('/') ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faHome} />
            Home
          </Link>
          
          <Link 
            to="/jobs" 
            className={isActiveRoute('/jobs') ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faBriefcase} />
            Find Jobs
          </Link>
          
          <Link 
            to="/about" 
            className={isActiveRoute('/about') ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            About Us
          </Link>
          
          <Link 
            to="/blog" 
            className={isActiveRoute('/blog') ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faNewspaper} />
            Blog
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Notifications */}
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button 
              className="action-button notifications-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {getUnreadCount() > 0 && (
                <span className="notification-badge">{getUnreadCount()}</span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown show">
                <div className="notifications-header">
                  <h3>Notifications ({getUnreadCount()} unread)</h3>
                  <div className="notifications-actions">
                    <button 
                      className="mark-all-read" 
                      onClick={markAllNotificationsAsRead}
                      disabled={getUnreadCount() === 0}
                    >
                      Mark all read
                    </button>
                    <button 
                      className="clear-all" 
                      onClick={clearAllNotifications}
                      disabled={notifications.length === 0}
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        <FontAwesomeIcon 
                          icon={
                            notification.type === 'job' ? faBriefcase :
                            notification.type === 'message' ? faEnvelope :
                            faUser
                          } 
                        />
                      </div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <Link to="/notifications" className="view-all-notifications">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Messages */}
          <div className="messages-wrapper" ref={messagesRef}>
            <button 
              className="action-button messages-btn"
              onClick={() => setShowMessages(!showMessages)}
              aria-label="Toggle messages"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="message-badge">5</span>
            </button>
            
            {/* Messages Dropdown */}
            {showMessages && (
              <div className="messages-dropdown">
                <div className="messages-header">
                  <h3>Messages</h3>
                  <div className="messages-actions">
                    <button 
                      className="mark-all-read" 
                      onClick={() => setShowMessages(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="messages-list">
                  <div className="message-item">
                    <div className="message-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="message-content">
                      <h4>New Message</h4>
                      <p>You have 5 unread messages</p>
                      <span className="message-time">Just now</span>
                    </div>
                  </div>
                </div>
                <div className="messages-footer">
                  <Link to="/messages" className="view-all-messages">
                    View all messages
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile - New Clean Minimal Design */}
          <div className="user-profile" ref={userMenuRef}>
            <div className="profile-trigger" onClick={toggleUserMenu}>
              <div className="profile-avatar">
                <img 
                  src="https://www.w3schools.com/w3images/avatar2.png" 
                  alt="User Avatar" 
                  className="avatar-image" 
                />
                <div className="profile-status-indicator"></div>
              </div>
              <div className="profile-info">
                <div className="profile-name">{getUserDisplayName()}</div>
                <div className="profile-role">{getRoleDisplayName(getUserRole()) || 'User'}</div>
              </div>
              <div className="profile-chevron">
                <FontAwesomeIcon 
                  icon={faAngleDown} 
                  className={`chevron-icon ${isUserMenuOpen ? 'rotate' : ''}`}
                />
              </div>
            </div>
            
            {/* New Profile Menu */}
            <div className={`profile-menu ${isUserMenuOpen ? 'show' : ''}`}>
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">
                  <img 
                    src="https://www.w3schools.com/w3images/avatar2.png" 
                    alt="User Avatar" 
                  />
                </div>
                <div className="profile-menu-details">
                  <h3 className="profile-menu-name">{getUserDisplayName()}</h3>
                  <p className="profile-menu-email">{user?.email && user.email !== 'undefined' ? user.email : 'No email available'}</p>
                  <span className="profile-menu-role-badge">{getRoleDisplayName(getUserRole()) || 'User'}</span>
                </div>
              </div>
              
              <div className="profile-menu-divider"></div>
              
              <div className="profile-menu-actions">
                <Link 
                  to="/profile" 
                  className="profile-menu-item" 
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="menu-item-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <span className="menu-item-text">My Profile</span>
                  <div className="menu-item-arrow">→</div>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="profile-menu-item" 
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="menu-item-icon">
                    <FontAwesomeIcon icon={faCog} />
                  </div>
                  <span className="menu-item-text">Settings</span>
                  <div className="menu-item-arrow">→</div>
                </Link>
                
                {getUserRole() === 'recruiter' && (
                  <Link 
                    to="/post-job" 
                    className="profile-menu-item" 
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="menu-item-icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <span className="menu-item-text">Post Job</span>
                    <div className="menu-item-arrow">→</div>
                  </Link>
                )}
                
                {getUserRole() === 'jobSeeker' && (
                  <>
                    <Link 
                      to="/jobs" 
                      className="profile-menu-item" 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="menu-item-icon">
                        <FontAwesomeIcon icon={faBriefcase} />
                      </div>
                      <span className="menu-item-text">Browse Jobs</span>
                      <div className="menu-item-arrow">→</div>
                    </Link>
                    
                    <Link 
                      to="/upload-resume" 
                      className="profile-menu-item" 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="menu-item-icon">
                        <FontAwesomeIcon icon={faFileAlt} />
                      </div>
                      <span className="menu-item-text">Upload Resume</span>
                      <div className="menu-item-arrow">→</div>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="profile-menu-divider"></div>
              
              <button 
                onClick={handleLogout} 
                className="profile-menu-logout"
              >
                <div className="logout-icon">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
                <span className="logout-text">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-content">
          {/* Main Navigation */}
          <div className="mobile-menu-section">
            <div className="mobile-menu-title">Navigation</div>
            <div className="mobile-menu-links">
              <Link to="/" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faHome} />
                Home
              </Link>
              <Link to="/jobs" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faBriefcase} />
                Browse Jobs
              </Link>
              <Link to="/about" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faInfoCircle} />
                About Us
              </Link>
              <Link to="/blog" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faNewspaper} />
                Blog
              </Link>
            </div>
          </div>

          {/* User Actions */}
          <div className="mobile-menu-section">
            <div className="mobile-menu-title">Account</div>
            <div className="mobile-menu-links">
              <Link to="/profile" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faUser} />
                Profile
              </Link>
              <Link to="/settings" className="mobile-menu-link" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faCog} />
                Settings
              </Link>
              {getUserRole() === 'recruiter' && (
                <Link to="/post-job" className="mobile-menu-link" onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faUpload} />
                  Post Job
                </Link>
              )}
              {getUserRole() === 'jobSeeker' && (
                <>
                  <Link to="/jobs" className="mobile-menu-link" onClick={closeMobileMenu}>
                    <FontAwesomeIcon icon={faBriefcase} />
                    Browse Jobs
                  </Link>
                  <Link to="/upload-resume" className="mobile-menu-link" onClick={closeMobileMenu}>
                    <FontAwesomeIcon icon={faFileAlt} />
                    Upload Resume
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="mobile-menu-link">
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
