import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faCog, 
  faChartLine, 
  faShieldAlt, 
  faDatabase, 
  faBell, 
  faEye, 
  faEdit, 
  faTrash, 
  faPlus,
  faSearch,
  faFilter,
  faDownload,
  faUpload,
  faBan,
  faCheckCircle,
  faTimesCircle,
  faUserCheck,
  faUserTimes,
  faCrown,
  faUserTie,
  faUserGraduate,
  faBuilding,
  faFileAlt,
  faGlobe,
  faServer,
  faMemory,
  faHdd,
  faNetworkWired,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from '../components/animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AdminControlPanel.css';

const AdminControlPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // System Overview Data
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    systemHealth: 'healthy',
    serverLoad: 0,
    memoryUsage: 0,
    diskUsage: 0
  });

  // User Management Data
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    jobSeekers: 0,
    recruiters: 0,
    admins: 0,
    newUsersToday: 0,
    activeUsersToday: 0
  });

  // Feature Control Data
  const [featureFlags, setFeatureFlags] = useState({
    jobSearch: true,
    resumeUpload: true,
    profileTracking: true,
    networking: true,
    analytics: true,
    chatBot: true,
    emailNotifications: true,
    smsNotifications: true,
    maintenanceMode: false
  });

  // System Monitoring Data
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load system overview
      const systemResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/system-stats')
      );
      if (systemResponse?.ok) {
        const systemData = await systemResponse.json();
        setSystemStats(systemData);
      }

      // Load user management data
      const usersResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/users')
      );
      if (usersResponse?.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        setUserStats(usersData.stats || {});
      }

      // Load feature flags
      const featuresResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/feature-flags')
      );
      if (featuresResponse?.ok) {
        const featuresData = await featuresResponse.json();
        setFeatureFlags(featuresData);
      }

      // Load system alerts
      const alertsResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/alerts')
      );
      if (alertsResponse?.ok) {
        const alertsData = await alertsResponse.json();
        setSystemAlerts(alertsData);
      }

      // Load recent activity
      const activityResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/recent-activity')
      );
      if (activityResponse?.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      }

    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (feature, enabled) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/feature-flags'),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feature, enabled })
        }
      );

      if (response?.ok) {
        setFeatureFlags(prev => ({ ...prev, [feature]: enabled }));
      }
    } catch (error) {
      console.error('Error updating feature flag:', error);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl(`/api/admin/users/${userId}/${action}`),
        { method: 'POST' }
      );

      if (response?.ok) {
        loadAdminData(); // Refresh data
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const getSystemHealthColor = (health) => {
    switch (health) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSystemHealthIcon = (health) => {
    switch (health) {
      case 'healthy': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'critical': return faTimesCircle;
      default: return faInfoCircle;
    }
  };

  if (loading) {
    return (
      <div className="admin-control-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-control-panel">
      <div className="admin-header">
        <h1>Admin Control Panel</h1>
        <div className="admin-actions">
          <button className="refresh-btn" onClick={loadAdminData}>
            <FontAwesomeIcon icon={faSearch} />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FontAwesomeIcon icon={faChartLine} />
          System Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FontAwesomeIcon icon={faUsers} />
          User Management
        </button>
        <button 
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          <FontAwesomeIcon icon={faCog} />
          Feature Control
        </button>
        <button 
          className={`tab ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <FontAwesomeIcon icon={faEye} />
          System Monitoring
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FontAwesomeIcon icon={faShieldAlt} />
          Security
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <FadeInUp>
            <div className="overview-section">
              <h2>System Overview</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="stat-content">
                    <h3>{systemStats.totalUsers.toLocaleString()}</h3>
                    <p>Total Users</p>
                    <span className="stat-change positive">+{userStats.newUsersToday} today</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div className="stat-content">
                    <h3>{systemStats.totalJobs.toLocaleString()}</h3>
                    <p>Total Jobs</p>
                    <span className="stat-change positive">{systemStats.activeJobs} active</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faFileAlt} />
                  </div>
                  <div className="stat-content">
                    <h3>{systemStats.totalApplications.toLocaleString()}</h3>
                    <p>Applications</p>
                    <span className="stat-change positive">+12% this week</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ color: getSystemHealthColor(systemStats.systemHealth) }}>
                    <FontAwesomeIcon icon={getSystemHealthIcon(systemStats.systemHealth)} />
                  </div>
                  <div className="stat-content">
                    <h3 style={{ color: getSystemHealthColor(systemStats.systemHealth) }}>
                      {systemStats.systemHealth.charAt(0).toUpperCase() + systemStats.systemHealth.slice(1)}
                    </h3>
                    <p>System Health</p>
                    <span className="stat-change">Server Load: {systemStats.serverLoad}%</span>
                  </div>
                </div>
              </div>

              <div className="system-metrics">
                <div className="metric-card">
                  <h4>Server Performance</h4>
                  <div className="metric-item">
                    <span>CPU Usage</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${systemStats.serverLoad}%` }}
                      ></div>
                    </div>
                    <span>{systemStats.serverLoad}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Memory Usage</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${systemStats.memoryUsage}%` }}
                      ></div>
                    </div>
                    <span>{systemStats.memoryUsage}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Disk Usage</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${systemStats.diskUsage}%` }}
                      ></div>
                    </div>
                    <span>{systemStats.diskUsage}%</span>
                  </div>
                </div>

                <div className="metric-card">
                  <h4>User Distribution</h4>
                  <div className="user-distribution">
                    <div className="user-type">
                      <FontAwesomeIcon icon={faUserGraduate} />
                      <span>Job Seekers</span>
                      <span className="count">{userStats.jobSeekers}</span>
                    </div>
                    <div className="user-type">
                      <FontAwesomeIcon icon={faUserTie} />
                      <span>Recruiters</span>
                      <span className="count">{userStats.recruiters}</span>
                    </div>
                    <div className="user-type">
                      <FontAwesomeIcon icon={faCrown} />
                      <span>Admins</span>
                      <span className="count">{userStats.admins}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'users' && (
          <FadeInUp>
            <div className="users-section">
              <h2>User Management</h2>
              
              <div className="users-header">
                <div className="search-box">
                  <FontAwesomeIcon icon={faSearch} />
                  <input type="text" placeholder="Search users..." />
                </div>
                <div className="filter-controls">
                  <select>
                    <option value="all">All Users</option>
                    <option value="jobSeekers">Job Seekers</option>
                    <option value="recruiters">Recruiters</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {user.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.lastActive}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn view"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button 
                              className="action-btn edit"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            {user.status === 'active' ? (
                              <button 
                                className="action-btn ban"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </button>
                            ) : (
                              <button 
                                className="action-btn activate"
                                onClick={() => handleUserAction(user.id, 'activate')}
                              >
                                <FontAwesomeIcon icon={faUserCheck} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'features' && (
          <FadeInUp>
            <div className="features-section">
              <h2>Feature Control</h2>
              <p>Enable or disable features across the platform</p>
              
              <div className="feature-flags">
                {Object.entries(featureFlags).map(([feature, enabled]) => (
                  <div key={feature} className="feature-flag">
                    <div className="feature-info">
                      <h4>{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                      <p>Control the {feature} feature availability</p>
                    </div>
                    <div className="feature-control">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => handleFeatureToggle(feature, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'monitoring' && (
          <FadeInUp>
            <div className="monitoring-section">
              <h2>System Monitoring</h2>
              
              <div className="alerts-section">
                <h3>System Alerts</h3>
                {systemAlerts.length > 0 ? (
                  <div className="alerts-list">
                    {systemAlerts.map((alert, index) => (
                      <div key={index} className={`alert-item ${alert.severity}`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        <div className="alert-content">
                          <h4>{alert.title}</h4>
                          <p>{alert.message}</p>
                          <span className="alert-time">{alert.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-alerts">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <p>No active alerts</p>
                  </div>
                )}
              </div>

              <div className="activity-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FontAwesomeIcon icon={faUserCheck} />
                      </div>
                      <div className="activity-content">
                        <p>{activity.description}</p>
                        <span className="activity-time">{activity.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInUp>
        )}

        {activeTab === 'security' && (
          <FadeInUp>
            <div className="security-section">
              <h2>Security & Access Control</h2>
              
              <div className="security-cards">
                <div className="security-card">
                  <h3>Access Control</h3>
                  <div className="security-item">
                    <span>Admin Access</span>
                    <button className="security-btn">Configure</button>
                  </div>
                  <div className="security-item">
                    <span>Role Permissions</span>
                    <button className="security-btn">Manage</button>
                  </div>
                  <div className="security-item">
                    <span>API Access</span>
                    <button className="security-btn">Settings</button>
                  </div>
                </div>

                <div className="security-card">
                  <h3>Security Monitoring</h3>
                  <div className="security-item">
                    <span>Failed Login Attempts</span>
                    <span className="security-value">12</span>
                  </div>
                  <div className="security-item">
                    <span>Blocked IPs</span>
                    <span className="security-value">3</span>
                  </div>
                  <div className="security-item">
                    <span>Security Score</span>
                    <span className="security-value good">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        )}
      </div>
    </div>
  );
};

export default AdminControlPanel;
