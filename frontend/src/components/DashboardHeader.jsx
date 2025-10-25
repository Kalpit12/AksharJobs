import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBell,
  faEnvelope,
  faBars,
  faUser,
  faSignOutAlt,
  faGraduationCap,
  faBriefcase,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import './DashboardHeader.css';

const DashboardHeader = ({ 
  currentPage = 'Dashboard', 
  onSearch, 
  onMenuToggle,
  userType = 'jobSeeker' 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    fetchNotificationCount();
    fetchMessageCount();
    const interval = setInterval(() => {
      fetchNotificationCount();
      fetchMessageCount();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/notifications/unread-count'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotificationCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.log('Error fetching notification count:', error);
      setNotificationCount(0);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/messages/unread-count'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessageCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.log('Error fetching message count:', error);
      setMessageCount(0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getUserName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  };

  const getUserRole = () => {
    const roleMap = {
      'jobSeeker': 'Job Seeker',
      'job_seeker': 'Job Seeker',
      'intern': 'Intern',
      'recruiter': 'Recruiter',
      'admin': 'Admin'
    };
    return roleMap[user?.userType || user?.role || userType] || 'User';
  };

  const getLogoIcon = () => {
    const iconMap = {
      'jobSeeker': faBriefcase,
      'job_seeker': faBriefcase,
      'intern': faGraduationCap,
      'recruiter': faUserTie,
      'admin': faUser
    };
    return iconMap[user?.userType || user?.role || userType] || faBriefcase;
  };

  const getAppTitle = () => {
    const titleMap = {
      'jobSeeker': 'JOBSEEKER HUB',
      'job_seeker': 'JOBSEEKER HUB',
      'intern': 'INTERN HUB',
      'recruiter': 'RECRUITER HUB',
      'admin': 'ADMIN PORTAL'
    };
    return titleMap[user?.userType || user?.role || userType] || 'AKSHAR JOBS';
  };

  return (
    <header className="dashboard-header-modern">
      <div className="header-left">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">
            <FontAwesomeIcon icon={getLogoIcon()} />
          </div>
          <div className="logo-text">
            <div className="logo-name">{getAppTitle()}</div>
            <div className="logo-subtitle">Job Portal App</div>
          </div>
        </div>

      </div>

      <div className="header-center">
        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-header"
          />
          <button type="submit" className="search-btn-header">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-icon-wrapper" ref={notificationRef}>
          <button 
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
              setShowUserMenu(false);
            }}
          >
            <FontAwesomeIcon icon={faBell} />
            {notificationCount > 0 && (
              <span className="icon-badge">{notificationCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="dropdown-content">
                {notificationCount > 0 ? (
                  <div className="notification-item">
                    <p>You have {notificationCount} new notifications</p>
                  </div>
                ) : (
                  <div className="empty-dropdown">
                    <FontAwesomeIcon icon={faBell} />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="header-icon-wrapper" ref={messageRef}>
          <button 
            className="header-icon-btn"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            {messageCount > 0 && (
              <span className="icon-badge">{messageCount}</span>
            )}
          </button>

          {showMessages && (
            <div className="dropdown-menu messages-dropdown">
              <div className="dropdown-header">
                <h4>Messages</h4>
                <button onClick={() => navigate('/messages')}>View all</button>
              </div>
              <div className="dropdown-content">
                {messageCount > 0 ? (
                  <div className="message-item">
                    <p>You have {messageCount} unread messages</p>
                  </div>
                ) : (
                  <div className="empty-dropdown">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p>No new messages</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="header-user-wrapper" ref={userMenuRef}>
          <div 
            className="header-user-info"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowMessages(false);
            }}
          >
            <div className="user-avatar">
              {user?.profileImage || user?.companyLogo ? (
                <img src={user.profileImage || user.companyLogo} alt={getUserName()} />
              ) : (
                <div className="avatar-initials">{getUserInitials()}</div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{getUserName()}</div>
              <div className="user-role">{getUserRole()}</div>
            </div>
          </div>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  {user?.profileImage || user?.companyLogo ? (
                    <img src={user.profileImage || user.companyLogo} alt={getUserName()} />
                  ) : (
                    <div className="avatar-initials">{getUserInitials()}</div>
                  )}
                </div>
                <div>
                  <div className="dropdown-user-name">{getUserName()}</div>
                  <div className="dropdown-user-email">{user?.email}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

