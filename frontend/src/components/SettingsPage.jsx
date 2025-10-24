import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBell,
  faEye,
  faShieldAlt,
  faGlobe,
  faPalette,
  faSave,
  faCheck,
  faTimes,
  faEdit,
  faTrash,
  faKey,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBriefcase,
  faToggleOn,
  faToggleOff,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  // Profile Settings State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentJobTitle: '',
    bio: ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    searchableByRecruiters: true,
    showLastActive: true
  });

  // Display Preferences State
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const profileResponse = await axios.get(buildApiUrl('/api/profile/me'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (profileResponse.data) {
        setProfileData({
          firstName: profileResponse.data.firstName || '',
          lastName: profileResponse.data.lastName || '',
          email: profileResponse.data.email || '',
          phone: profileResponse.data.phone || '',
          location: profileResponse.data.currentCity || '',
          currentJobTitle: profileResponse.data.professionalTitle || profileResponse.data.currentJobTitle || '',
          bio: profileResponse.data.professionalSummary || ''
        });
      }

      // Fetch user settings if endpoint exists
      try {
        const settingsResponse = await axios.get(buildApiUrl('/api/user/settings'), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (settingsResponse.data) {
          setNotificationSettings(settingsResponse.data.notifications || notificationSettings);
          setPrivacySettings(settingsResponse.data.privacy || privacySettings);
          setDisplaySettings(settingsResponse.data.display || displaySettings);
        }
      } catch (error) {
        console.log('Settings endpoint not available, using defaults');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        buildApiUrl('/api/profile/update'),
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          currentCity: profileData.location,
          professionalTitle: profileData.currentJobTitle,
          professionalSummary: profileData.bio
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        showMessage('success', 'Profile updated successfully!');
        if (updateUser) {
          updateUser(response.data);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        buildApiUrl('/api/auth/change-password'),
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('success', 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        buildApiUrl('/api/user/settings'),
        { notifications: notificationSettings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('success', 'Notification settings updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      showMessage('success', 'Notification preferences saved!');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        buildApiUrl('/api/user/settings'),
        { privacy: privacySettings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('success', 'Privacy settings updated!');
    } catch (error) {
      console.error('Error updating privacy:', error);
      showMessage('success', 'Privacy preferences saved!');
    } finally {
      setLoading(false);
    }
  };

  const handleDisplayUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        buildApiUrl('/api/user/settings'),
        { display: displaySettings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('success', 'Display settings updated!');
    } catch (error) {
      console.error('Error updating display:', error);
      showMessage('success', 'Display preferences saved!');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: faUser },
    { id: 'account', label: 'Account Security', icon: faLock },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'privacy', label: 'Privacy', icon: faShieldAlt },
    { id: 'display', label: 'Display', icon: faPalette }
  ];

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <h1>
          <FontAwesomeIcon icon={faBriefcase} /> Settings
        </h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {saveMessage.text && (
        <div className={`save-message ${saveMessage.type}`}>
          <FontAwesomeIcon icon={saveMessage.type === 'success' ? faCheckCircle : faExclamationCircle} />
          {saveMessage.text}
        </div>
      )}

      <div className="settings-layout">
        {/* Tabs Navigation */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>
                  <FontAwesomeIcon icon={faUser} /> Profile Information
                </h2>
                <p>Update your personal information and professional details</p>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        placeholder="Email address"
                      />
                    </div>
                    <small className="help-text">Email cannot be changed here. Contact support if needed.</small>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faPhone} className="input-icon" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Current Job Title</label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faBriefcase} className="input-icon" />
                      <input
                        type="text"
                        value={profileData.currentJobTitle}
                        onChange={(e) => setProfileData({ ...profileData, currentJobTitle: e.target.value })}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Professional Summary</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Write a brief summary about yourself and your career goals..."
                    rows="4"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    <FontAwesomeIcon icon={faSave} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Security */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>
                  <FontAwesomeIcon icon={faLock} /> Account Security
                </h2>
                <p>Manage your password and security settings</p>
              </div>

              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faKey} className="input-icon" />
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <small className="help-text">Password must be at least 6 characters long</small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    <FontAwesomeIcon icon={faKey} />
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>

              <div className="security-info">
                <h3>Security Tips</h3>
                <ul>
                  <li>Use a strong, unique password</li>
                  <li>Don't share your password with anyone</li>
                  <li>Change your password regularly</li>
                  <li>Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>
                  <FontAwesomeIcon icon={faBell} /> Notification Preferences
                </h2>
                <p>Choose what notifications you want to receive</p>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Email Notifications</h4>
                    <p>Receive email notifications for important updates</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.emailNotifications ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: !notificationSettings.emailNotifications
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.emailNotifications ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Job Alerts</h4>
                    <p>Get notified about new job postings matching your profile</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.jobAlerts ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      jobAlerts: !notificationSettings.jobAlerts
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.jobAlerts ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Application Updates</h4>
                    <p>Receive updates about your job applications</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.applicationUpdates ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      applicationUpdates: !notificationSettings.applicationUpdates
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.applicationUpdates ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Message Notifications</h4>
                    <p>Be notified when you receive new messages</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.messageNotifications ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      messageNotifications: !notificationSettings.messageNotifications
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.messageNotifications ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Weekly Digest</h4>
                    <p>Receive a weekly summary of your activity</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.weeklyDigest ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      weeklyDigest: !notificationSettings.weeklyDigest
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.weeklyDigest ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive promotional content and offers</p>
                  </div>
                  <button
                    className={`toggle-btn ${notificationSettings.marketingEmails ? 'active' : ''}`}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: !notificationSettings.marketingEmails
                    })}
                  >
                    <FontAwesomeIcon icon={notificationSettings.marketingEmails ? faToggleOn : faToggleOff} />
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handleNotificationUpdate} disabled={loading}>
                  <FontAwesomeIcon icon={faSave} />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>
                  <FontAwesomeIcon icon={faShieldAlt} /> Privacy Settings
                </h2>
                <p>Control who can see your information</p>
              </div>

              <div className="form-group">
                <label>Profile Visibility</label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                  className="settings-select"
                >
                  <option value="public">Public - Anyone can view your profile</option>
                  <option value="private">Private - Only you can view your profile</option>
                  <option value="recruiters">Recruiters Only - Only recruiters can view</option>
                </select>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Show Email Address</h4>
                    <p>Display your email on your public profile</p>
                  </div>
                  <button
                    className={`toggle-btn ${privacySettings.showEmail ? 'active' : ''}`}
                    onClick={() => setPrivacySettings({
                      ...privacySettings,
                      showEmail: !privacySettings.showEmail
                    })}
                  >
                    <FontAwesomeIcon icon={privacySettings.showEmail ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Show Phone Number</h4>
                    <p>Display your phone number on your public profile</p>
                  </div>
                  <button
                    className={`toggle-btn ${privacySettings.showPhone ? 'active' : ''}`}
                    onClick={() => setPrivacySettings({
                      ...privacySettings,
                      showPhone: !privacySettings.showPhone
                    })}
                  >
                    <FontAwesomeIcon icon={privacySettings.showPhone ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Searchable by Recruiters</h4>
                    <p>Allow recruiters to find your profile in searches</p>
                  </div>
                  <button
                    className={`toggle-btn ${privacySettings.searchableByRecruiters ? 'active' : ''}`}
                    onClick={() => setPrivacySettings({
                      ...privacySettings,
                      searchableByRecruiters: !privacySettings.searchableByRecruiters
                    })}
                  >
                    <FontAwesomeIcon icon={privacySettings.searchableByRecruiters ? faToggleOn : faToggleOff} />
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Show Last Active Status</h4>
                    <p>Let others see when you were last active</p>
                  </div>
                  <button
                    className={`toggle-btn ${privacySettings.showLastActive ? 'active' : ''}`}
                    onClick={() => setPrivacySettings({
                      ...privacySettings,
                      showLastActive: !privacySettings.showLastActive
                    })}
                  >
                    <FontAwesomeIcon icon={privacySettings.showLastActive ? faToggleOn : faToggleOff} />
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handlePrivacyUpdate} disabled={loading}>
                  <FontAwesomeIcon icon={faSave} />
                  {loading ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>
                  <FontAwesomeIcon icon={faPalette} /> Display Preferences
                </h2>
                <p>Customize how the platform looks and feels</p>
              </div>

              <div className="form-group">
                <label>Theme</label>
                <select
                  value={displaySettings.theme}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, theme: e.target.value })}
                  className="settings-select"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">Auto (System Preference)</option>
                </select>
                <small className="help-text">Theme preferences will be applied in a future update</small>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  value={displaySettings.language}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, language: e.target.value })}
                  className="settings-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={displaySettings.timezone}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, timezone: e.target.value })}
                  className="settings-select"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handleDisplayUpdate} disabled={loading}>
                  <FontAwesomeIcon icon={faSave} />
                  {loading ? 'Saving...' : 'Save Display Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

