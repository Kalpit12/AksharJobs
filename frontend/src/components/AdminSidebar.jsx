import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUsers, 
  faBriefcase, 
  faUserTie, 
  faCreditCard, 
  faChartBar, 
  faCog, 
  faShieldAlt,
  faFileUpload
} from '@fortawesome/free-solid-svg-icons';
// import '../styles/AdminSidebar.css'; // Replaced by unified CSS

const AdminSidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: faTachometerAlt,
      description: 'System Overview'
    },
    {
      id: 'jobseeker-matrix',
      label: 'Job Seeker Matrix',
      icon: faUsers,
      description: 'Control Job Seeker Features'
    },
    {
      id: 'recruiter-matrix',
      label: 'Recruiter Matrix',
      icon: faUserTie,
      description: 'Control Recruiter Features'
    },
    {
      id: 'plans',
      label: 'Subscription Plans',
      icon: faCreditCard,
      description: 'Manage Pricing & Plans'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: faChartBar,
      description: 'Reports & Insights'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: faUsers,
      description: 'Manage User Accounts'
    },
    {
      id: 'bulk-import',
      label: 'Bulk Import',
      icon: faFileUpload,
      description: 'Import Users from CSV/Excel'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: faCog,
      description: 'Global Configuration'
    },
    {
      id: 'security',
      label: 'Security',
      icon: faShieldAlt,
      description: 'Security & Privacy'
    }
  ];

  return (
    <div className="admin-sidebar" style={{
      background: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
      backgroundColor: '#ff6b35',
      backgroundImage: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
      color: '#ffffff',
      position: 'fixed',
      left: '0',
      top: '0',
      width: '320px',
      height: '100vh',
      zIndex: 1000
    }}>
      <div className="sidebar-header">
        <h2><FontAwesomeIcon icon={faCog} /> JOBSEEKER HUB</h2>
        <p>System Management</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <div className="nav-icon">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="admin-details">
            <span className="admin-name">System Administrator</span>
            <span className="admin-role">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
