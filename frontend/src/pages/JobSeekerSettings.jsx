import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faShieldAlt,
  faBell,
  faEye,
  faCog,
  faGlobe,
  faSave,
  faEdit,
  faCamera,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBriefcase,
  faGraduationCap,
  faFileAlt,
  faLinkedin,
  faGithub,
  faTwitter,
  faLock,
  faKey,
  faEyeSlash,
  faCheckCircle,
  faTimes,
  faUpload,
  faDownload,
  faTrash,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/JobSeekerSettings.css';

const JobSeekerSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  
  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    jobMatches: true,
    applicationUpdates: true,
    weeklySummary: false,
    mobileNotifications: true
  });
  
  // Privacy state
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showContactInfo: false,
    analytics: true
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    theme: 'light'
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentPosition: '',
    experience: '',
    education: '',
    skills: '',
    bio: '',
    linkedin: '',
    github: '',
    twitter: '',
    resume: null
  });

  // Settings tabs configuration
  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: faUser },
    { id: 'security', label: 'Security', icon: faShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'privacy', label: 'Privacy', icon: faEye },
    { id: 'preferences', label: 'Preferences', icon: faCog },
    { id: 'account', label: 'Account', icon: faGlobe }
  ];

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        currentPosition: user.currentPosition || '',
        experience: user.experience || '',
        education: user.education || '',
        skills: user.skills || '',
        bio: user.bio || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        twitter: user.twitter || '',
        resume: user.resume || null
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

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically make an API call to update the user profile
      await updateUser(formData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      currentPosition: user.currentPosition || '',
      experience: user.experience || '',
      education: user.education || '',
      skills: user.skills || '',
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      twitter: user.twitter || '',
      resume: user.resume || null
    });
    setIsEditing(false);
  };

  // Security functions
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // API call to change password
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        alert('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/toggle-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enabled: !twoFactorEnabled })
      });

      if (response.ok) {
        setTwoFactorEnabled(!twoFactorEnabled);
        alert(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
      } else {
        alert('Failed to update 2FA settings');
      }
    } catch (error) {
      console.error('Error updating 2FA:', error);
      alert('Failed to update 2FA settings');
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Notification functions
  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(notificationSettings)
      });

      if (response.ok) {
        alert('Notification settings saved');
      } else {
        alert('Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  // Privacy functions
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const savePrivacySettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(privacySettings)
      });

      if (response.ok) {
        alert('Privacy settings saved');
      } else {
        alert('Failed to save privacy settings');
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Failed to save privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Preferences functions
  const handlePreferenceChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        alert('Preferences saved');
      } else {
        alert('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // Account functions
  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/export-data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Account deleted successfully');
        logout();
        navigate('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Profile Information</h2>
      
      <div className="profile-section">
        <div className="profile-photo-section">
          <div className="profile-photo">
            <img 
              src={user?.profileImage || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image"
            />
            <button className="photo-edit-btn" onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your location"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPosition">Current Position</label>
            <input
              type="text"
              id="currentPosition"
              name="currentPosition"
              value={formData.currentPosition}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your current position"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself"
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your skills (comma separated)"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="education">Education</label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your education details"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="experience">Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your work experience"
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/yourprofile"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://github.com/yourusername"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://twitter.com/yourusername"
              className="form-input"
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {!isEditing && (
          <button 
            className="btn btn-primary edit-btn" 
            onClick={() => setIsEditing(true)}
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Security Settings</h2>
      
      <div className="security-section">
        <div className="security-item">
          <div className="security-info">
            <FontAwesomeIcon icon={faLock} className="security-icon" />
            <div>
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
          </div>
          <button 
            className="btn btn-outline" 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="password-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="form-input"
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="form-input"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="form-input"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handlePasswordChange}
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        )}

        <div className="security-item">
          <div className="security-info">
            <FontAwesomeIcon icon={faKey} className="security-icon" />
            <div>
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>
          <button 
            className={`btn ${twoFactorEnabled ? 'btn-danger' : 'btn-outline'}`}
            onClick={handleTwoFactorToggle}
            disabled={loading}
          >
            {loading ? 'Updating...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        <div className="security-item">
          <div className="security-info">
            <FontAwesomeIcon icon={faShieldAlt} className="security-icon" />
            <div>
              <h3>Login Sessions</h3>
              <p>Manage your active login sessions</p>
            </div>
          </div>
          <button 
            className="btn btn-outline" 
            onClick={loadSessions}
          >
            View Sessions
          </button>
        </div>

        {sessions.length > 0 && (
          <div className="sessions-list">
            <h3>Active Sessions</h3>
            {sessions.map((session, index) => (
              <div key={index} className="session-item">
                <div className="session-info">
                  <div className="session-device">{session.device || 'Unknown Device'}</div>
                  <div className="session-location">{session.location || 'Unknown Location'}</div>
                  <div className="session-time">{session.lastActive || 'Unknown Time'}</div>
                </div>
                <button className="btn btn-danger btn-sm">Revoke</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Notification Preferences</h2>
      
      <div className="notifications-section">
        <div className="notification-group">
          <h3>Email Notifications</h3>
          <div className="notification-item">
            <div className="notification-info">
              <span>Job Matches</span>
              <p>Get notified when new jobs match your profile</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificationSettings.jobMatches}
                onChange={(e) => handleNotificationChange('jobMatches', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="notification-item">
            <div className="notification-info">
              <span>Application Updates</span>
              <p>Receive updates about your job applications</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificationSettings.applicationUpdates}
                onChange={(e) => handleNotificationChange('applicationUpdates', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="notification-item">
            <div className="notification-info">
              <span>Weekly Summary</span>
              <p>Get a weekly summary of your job search activity</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificationSettings.weeklySummary}
                onChange={(e) => handleNotificationChange('weeklySummary', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-group">
          <h3>Push Notifications</h3>
          <div className="notification-item">
            <div className="notification-info">
              <span>Mobile Notifications</span>
              <p>Receive notifications on your mobile device</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificationSettings.mobileNotifications}
                onChange={(e) => handleNotificationChange('mobileNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={saveNotificationSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Privacy Settings</h2>
      
      <div className="privacy-section">
        <div className="privacy-group">
          <h3>Profile Visibility</h3>
          <div className="privacy-item">
            <div className="privacy-info">
              <span>Public Profile</span>
              <p>Make your profile visible to recruiters</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={privacySettings.publicProfile}
                onChange={(e) => handlePrivacyChange('publicProfile', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="privacy-item">
            <div className="privacy-info">
              <span>Show Contact Information</span>
              <p>Allow recruiters to see your contact details</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={privacySettings.showContactInfo}
                onChange={(e) => handlePrivacyChange('showContactInfo', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="privacy-group">
          <h3>Data Usage</h3>
          <div className="privacy-item">
            <div className="privacy-info">
              <span>Analytics</span>
              <p>Help us improve by sharing anonymous usage data</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={privacySettings.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={savePrivacySettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Preferences</h2>
      
      <div className="preferences-section">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select 
              id="language" 
              className="form-input"
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
            <label htmlFor="timezone">Timezone</label>
            <select 
              id="timezone" 
              className="form-input"
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
            <label htmlFor="currency">Currency</label>
            <select 
              id="currency" 
              className="form-input"
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select 
              id="theme" 
              className="form-input"
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={savePreferences}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="settings-content">
      <h2 className="content-title">Account Management</h2>
      
      <div className="account-section">
        <div className="account-group">
          <h3>Account Actions</h3>
          <div className="account-item">
            <div className="account-info">
              <FontAwesomeIcon icon={faDownload} className="account-icon" />
              <div>
                <span>Export Data</span>
                <p>Download a copy of your data</p>
              </div>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={handleExportData}
              disabled={loading}
            >
              {loading ? 'Exporting...' : 'Export'}
            </button>
          </div>
          <div className="account-item">
            <div className="account-info">
              <FontAwesomeIcon icon={faTrash} className="account-icon" />
              <div>
                <span>Delete Account</span>
                <p>Permanently delete your account and all data</p>
              </div>
            </div>
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOtherTabs = () => (
    <div className="settings-content">
      <h2 className="content-title">{settingsTabs.find(tab => tab.id === activeTab)?.label}</h2>
      <div className="coming-soon">
        <p>This section is coming soon. We're working on adding more features to enhance your experience.</p>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderOtherTabs();
    }
  };

  return (
    <>
      <Header />
      <div className="settings-container">
        {/* Back Button */}
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
        </div>

        <div className="settings-layout">
          {/* Left Sidebar */}
          <div className="settings-sidebar">
            <div className="sidebar-header">
              <h1 className="sidebar-title">Settings</h1>
              <p className="sidebar-subtitle">Manage your account settings and preferences</p>
            </div>

            <nav className="settings-nav">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} className="nav-icon" />
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="settings-main">
            {renderActiveTab()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobSeekerSettings;
