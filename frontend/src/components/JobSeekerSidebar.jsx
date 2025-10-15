import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faSearch, faFileAlt, faBookmark, faCalendarCheck, 
  faStar, faEnvelope, faUser, faFilePdf, faBook, faCog
} from '@fortawesome/free-solid-svg-icons';

const JobSeekerSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', icon: faThLarge, label: 'Dashboard' },
    { id: 'jobs', icon: faSearch, label: 'Browse Jobs', badge: 'NEW', badgeType: 'success' },
    { id: 'applications', icon: faFileAlt, label: 'My Applications', badge: '12' },
    { id: 'saved', icon: faBookmark, label: 'Saved Jobs', badge: '8' },
    { id: 'interviews', icon: faCalendarCheck, label: 'Interviews', badge: '3' },
    { id: 'matches', icon: faStar, label: 'Recommended', badge: '15' },
    { id: 'messages', icon: faEnvelope, label: 'Messages', badge: '5' },
    { id: 'profile', icon: faUser, label: 'My Profile' },
    { id: 'resume', icon: faFilePdf, label: 'Resume/CV' },
    { id: 'resources', icon: faBook, label: 'Career Resources' },
    { id: 'settings', icon: faCog, label: 'Settings' }
  ];

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h2><FontAwesomeIcon icon={faThLarge} /> JobPortal</h2>
        <p>Your Career Journey</p>
      </div>
      <div className="nav-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`badge ${item.badgeType === 'success' ? 'success' : ''}`}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSeekerSidebar;
