import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faBell, 
  faShieldAlt, 
  faPalette, 
  faGlobe, 
  faKey, 
  faTrash,
  faSave,
  faEye,
  faEyeSlash,
  faCheck,
  faTimes,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/ModernSettings.css';

const ModernSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowSearch: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (section === 'profile') {
        // Update profile logic here
        console.log('Updating profile:', formData);
      } else if (section === 'password') {
        // Update password logic here
        console.log('Updating password');
      } else if (section === 'notifications') {
        // Update notifications logic here
        console.log('Updating notifications:', notifications);
      } else if (section === 'privacy') {
        // Update privacy logic here
        console.log('Updating privacy:', privacy);
      } else if (section === 'preferences') {
        // Update preferences logic here
        console.log('Updating preferences:', preferences);
      }

      setMessage({ type: 'success', text: `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic here
      console.log('Deleting account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: faUser },
    { id: 'security', label: 'Security', icon: faShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'privacy', label: 'Privacy', icon: faEye },
    { id: 'preferences', label: 'Preferences', icon: faPalette },
    { id: 'account', label: 'Account', icon: faGlobe }
  ];

  return (
    <div className="modern-settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <Link to="/" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="settings-title">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <FontAwesomeIcon icon={message.type === 'success' ? faCheck : faTimes} />
            <span>{message.text}</span>
          </div>
        )}

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      rows="4"
                    />
                  </div>
                </div>
                <button 
                  className="save-button"
                  onClick={() => handleSave('profile')}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faSave} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Security Settings</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  className="save-button"
                  onClick={() => handleSave('password')}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faKey} />
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h3>Email Notifications</h3>
                      <p>Receive updates via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h3>Push Notifications</h3>
                      <p>Receive push notifications on your device</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h3>SMS Notifications</h3>
                      <p>Receive updates via SMS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h3>Marketing Emails</h3>
                      <p>Receive promotional content and updates</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <button 
                  className="save-button"
                  onClick={() => handleSave('notifications')}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faBell} />
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2>Privacy Settings</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Profile Visibility</label>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="connections">Connections Only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Show Email Address</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showEmail}
                        onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Show Phone Number</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showPhone}
                        onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Allow Search Engines</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.allowSearch}
                        onChange={(e) => handlePrivacyChange('allowSearch', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <button 
                  className="save-button"
                  onClick={() => handleSave('privacy')}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faEye} />
                  {isLoading ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2>App Preferences</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="save-button"
                  onClick={() => handleSave('preferences')}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faPalette} />
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="settings-section">
                <h2>Account Management</h2>
                <div className="account-actions">
                  <div className="action-item">
                    <div className="action-info">
                      <h3>Export Data</h3>
                      <p>Download a copy of your data</p>
                    </div>
                    <button className="action-button secondary">
                      <FontAwesomeIcon icon={faDatabase} />
                      Export Data
                    </button>
                  </div>
                  <div className="action-item">
                    <div className="action-info">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button 
                      className="action-button danger"
                      onClick={handleDeleteAccount}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSettings;
