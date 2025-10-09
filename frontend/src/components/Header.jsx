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
  faTimes,
  faCrown,
  faGift,
  faSearch,
  faClipboardList,
  faRocket,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NetworkStatus from './NetworkStatus';
import ModernProfileDropdown from './ModernProfileDropdown';
import '../styles/Header.css';
import akLogo from '../assets/AK logo.jpg';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const { user, isAuthenticated, logout, forceLogout } = useAuth();
  const { 
    notifications, 
    messages, 
    unreadNotificationCount, 
    unreadMessageCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    markMessageAsRead,
    isWebSocketConnected
  } = useNotifications();
  
  const location = useLocation();
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  
  // Debug: Log authentication state to see what's available
  useEffect(() => {
    console.log('🔐 Header - Authentication State Changed:', {
      isAuthenticated,
      user: user ? {
        role: user.role,
        userId: user.userId,
        email: user.email,
        hasToken: !!user.token
      } : null,
      location: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user, location.pathname]);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get user role from context
  const getUserRole = () => {
    if (!user?.role || user.role === 'undefined') {
      return 'jobSeeker';
    }
    return user.role;
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
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
          <img src={akLogo} alt="AksharJobs logo" />
          <div>
            <div className="header-logo-text">AksharJobs</div>
            <div className="header-logo-tagline">Where Opportunity Meets Talent</div>
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
            to="/premium" 
            className={`premium-nav-button ${isActiveRoute('/premium') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faCrown} />
            GET PREMIUM
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
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="notifications-wrapper" ref={notificationsRef}>
            <button 
              className="action-button notifications-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadNotificationCount > 0 && (
                <span className="notification-badge">{unreadNotificationCount}</span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown show">
                <div className="notifications-header">
                  <h3>Notifications ({unreadNotificationCount} unread)</h3>
                  <div className="notifications-actions">
                    <button 
                      className="mark-all-read" 
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadNotificationCount === 0}
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
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          <FontAwesomeIcon 
                            icon={
                              notification.type === 'job' ? faBriefcase :
                              notification.type === 'message' ? faEnvelope :
                              notification.type === 'application' ? faFileAlt :
                              faBell
                            } 
                          />
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
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
              {unreadMessageCount > 0 && (
                <span className="message-badge">{unreadMessageCount}</span>
              )}
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
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.slice(0, 5).map(message => (
                      <div 
                        key={message.id} 
                        className={`message-item ${!message.is_read ? 'unread' : ''}`}
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        <div className="message-icon">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <div className="message-content">
                          <h4>
                            {message.is_sent ? 'You' : 'New Message'}
                          </h4>
                          <p>{message.content}</p>
                          <span className="message-time">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="messages-footer">
                  <Link to="/messages" className="view-all-messages">
                    View all messages
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Modern Profile Dropdown */}
          <ModernProfileDropdown />
            </>
          ) : (
            /* Unauthenticated User Actions */
            <div className="auth-actions">
              <Link to="/login" className="auth-button login-btn">
                Login
              </Link>
              <Link to="/signup" className="auth-button signup-btn">
                Sign Up
              </Link>
            </div>
          )}
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
              <Link to="/premium" className="mobile-menu-link premium-mobile-nav" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faCrown} />
                GET PREMIUM
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
          {isAuthenticated ? (
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
                                        <Link to="/modern-upload" className="mobile-menu-link upload-resume-mobile" onClick={closeMobileMenu}>
                      <FontAwesomeIcon icon={faFileAlt} />
                      Upload Resume
                      <span className="mobile-ai-badge">AI</span>
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="mobile-menu-link">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-menu-section">
              <div className="mobile-menu-title">Account</div>
              <div className="mobile-menu-links">
                <Link to="/login" className="mobile-menu-link" onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faUser} />
                  Login
                </Link>
                <Link to="/signup" className="mobile-menu-link" onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faUser} />
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Network Status Component */}
      <NetworkStatus />
      
      {/* Connection Status Component */}
    </header>
  );
};

export default Header;
