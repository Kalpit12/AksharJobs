import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from './ThemedLoadingSpinner';
import '../styles/RecruiterSettings.css';

const RecruiterSettings = ({ user, onUpdateUser }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    linkedinProfile: '',
    bio: ''
  });

  // Company Settings
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    companyDescription: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplications: true,
    applicationUpdates: true,
    interviewReminders: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
    smsNotifications: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
    theme: 'light',
    autoArchiveJobs: false,
    autoRejectThreshold: 50,
    matchScoreThreshold: 70,
    maxApplicationsPerJob: 100
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  useEffect(() => {
    if (user) {
      // Load profile data
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || user.recruiterPhone || '',
        jobTitle: user.jobTitle || '',
        linkedinProfile: user.linkedinProfile || '',
        bio: user.bio || ''
      });

      // Load company data
      setCompanyData({
        companyName: user.companyName || '',
        companyEmail: user.companyEmail || '',
        companyPhone: user.companyPhone || '',
        companyWebsite: user.companyWebsite || '',
        companySize: user.companySize || '',
        industry: user.industry || '',
        companyDescription: user.companyDescription || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        postalCode: user.postalCode || ''
      });

      // Load notification settings
      setNotificationSettings({
        emailNotifications: user.emailNotifications !== false,
        newApplications: user.newApplications !== false,
        applicationUpdates: user.applicationUpdates !== false,
        interviewReminders: user.interviewReminders !== false,
        weeklyReports: user.weeklyReports !== false,
        marketingEmails: user.marketingEmails === true,
        pushNotifications: user.pushNotifications !== false,
        smsNotifications: user.smsNotifications === true
      });

      // Load preferences
      setPreferences({
        timezone: user.timezone || 'UTC',
        dateFormat: user.dateFormat || 'MM/DD/YYYY',
        currency: user.currency || 'USD',
        language: user.language || 'en',
        theme: user.theme || 'light',
        autoArchiveJobs: user.autoArchiveJobs === true,
        autoRejectThreshold: user.autoRejectThreshold || 50,
        matchScoreThreshold: user.matchScoreThreshold || 70,
        maxApplicationsPerJob: user.maxApplicationsPerJob || 100
      });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let data = {};

      switch (section) {
        case 'profile':
          endpoint = '/api/recruiter/profile';
          data = profileData;
          break;
        case 'company':
          endpoint = '/api/recruiter/company';
          data = companyData;
          break;
        case 'notifications':
          endpoint = '/api/recruiter/notifications';
          data = notificationSettings;
          break;
        case 'preferences':
          endpoint = '/api/recruiter/preferences';
          data = preferences;
          break;
        case 'security':
          if (securityData.newPassword !== securityData.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
          }
          endpoint = '/api/recruiter/security';
          data = securityData;
          break;
        default:
          return;
      }

      const response = await fetch(buildApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        if (onUpdateUser && result.user) {
          onUpdateUser(result.user);
        }
        showMessage('success', `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      } else {
        const error = await response.json();
        showMessage('error', error.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderProfileTab = () => (
    <div className="settings-section">
      <h3>Profile Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            value={profileData.jobTitle}
            onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
            placeholder="e.g., Senior Recruiter"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn Profile</label>
          <input
            type="url"
            value={profileData.linkedinProfile}
            onChange={(e) => setProfileData({...profileData, linkedinProfile: e.target.value})}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          placeholder="Tell us about yourself..."
          rows="4"
        />
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => handleSave('profile')}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="settings-section">
      <h3>Company Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={companyData.companyName}
            onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
            placeholder="Enter company name"
          />
        </div>
        <div className="form-group">
          <label>Company Email</label>
          <input
            type="email"
            value={companyData.companyEmail}
            onChange={(e) => setCompanyData({...companyData, companyEmail: e.target.value})}
            placeholder="company@example.com"
          />
        </div>
        <div className="form-group">
          <label>Company Phone</label>
          <input
            type="tel"
            value={companyData.companyPhone}
            onChange={(e) => setCompanyData({...companyData, companyPhone: e.target.value})}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            value={companyData.companyWebsite}
            onChange={(e) => setCompanyData({...companyData, companyWebsite: e.target.value})}
            placeholder="https://company.com"
          />
        </div>
        <div className="form-group">
          <label>Company Size</label>
          <select
            value={companyData.companySize}
            onChange={(e) => setCompanyData({...companyData, companySize: e.target.value})}
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
        <div className="form-group">
          <label>Industry</label>
          <select
            value={companyData.industry}
            onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Company Description</label>
        <textarea
          value={companyData.companyDescription}
          onChange={(e) => setCompanyData({...companyData, companyDescription: e.target.value})}
          placeholder="Describe your company..."
          rows="4"
        />
      </div>
      <h4>Address</h4>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Street Address</label>
          <input
            type="text"
            value={companyData.address}
            onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
            placeholder="123 Main Street"
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={companyData.city}
            onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
            placeholder="City"
          />
        </div>
        <div className="form-group">
          <label>State/Province</label>
          <input
            type="text"
            value={companyData.state}
            onChange={(e) => setCompanyData({...companyData, state: e.target.value})}
            placeholder="State"
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={companyData.country}
            onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
            placeholder="Country"
          />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            value={companyData.postalCode}
            onChange={(e) => setCompanyData({...companyData, postalCode: e.target.value})}
            placeholder="12345"
          />
        </div>
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => handleSave('company')}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Company Info'}
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="notification-settings">
        <div className="notification-group">
          <h4>Email Notifications</h4>
          <div className="toggle-group">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
              />
              <span className="toggle-label">Enable email notifications</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.newApplications}
                onChange={(e) => setNotificationSettings({...notificationSettings, newApplications: e.target.checked})}
              />
              <span className="toggle-label">New applications</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.applicationUpdates}
                onChange={(e) => setNotificationSettings({...notificationSettings, applicationUpdates: e.target.checked})}
              />
              <span className="toggle-label">Application status updates</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.interviewReminders}
                onChange={(e) => setNotificationSettings({...notificationSettings, interviewReminders: e.target.checked})}
              />
              <span className="toggle-label">Interview reminders</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReports}
                onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
              />
              <span className="toggle-label">Weekly reports</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
              />
              <span className="toggle-label">Marketing emails</span>
            </label>
          </div>
        </div>
        <div className="notification-group">
          <h4>Other Notifications</h4>
          <div className="toggle-group">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
              />
              <span className="toggle-label">Push notifications</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
              />
              <span className="toggle-label">SMS notifications</span>
            </label>
          </div>
        </div>
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => handleSave('notifications')}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Notifications'}
      </button>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-section">
      <h3>Preferences</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date Format</label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>
        <div className="form-group">
          <label>Theme</label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="form-group">
          <label>Auto-reject Threshold</label>
          <input
            type="number"
            min="0"
            max="100"
            value={preferences.autoRejectThreshold}
            onChange={(e) => setPreferences({...preferences, autoRejectThreshold: parseInt(e.target.value)})}
          />
          <small>Applications below this match score will be automatically rejected</small>
        </div>
        <div className="form-group">
          <label>Match Score Threshold</label>
          <input
            type="number"
            min="0"
            max="100"
            value={preferences.matchScoreThreshold}
            onChange={(e) => setPreferences({...preferences, matchScoreThreshold: parseInt(e.target.value)})}
          />
          <small>Minimum match score to show applications</small>
        </div>
        <div className="form-group">
          <label>Max Applications per Job</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={preferences.maxApplicationsPerJob}
            onChange={(e) => setPreferences({...preferences, maxApplicationsPerJob: parseInt(e.target.value)})}
          />
          <small>Maximum number of applications to accept per job posting</small>
        </div>
      </div>
      <div className="toggle-group">
        <label className="toggle-item">
          <input
            type="checkbox"
            checked={preferences.autoArchiveJobs}
            onChange={(e) => setPreferences({...preferences, autoArchiveJobs: e.target.checked})}
          />
          <span className="toggle-label">Auto-archive jobs after 30 days of inactivity</span>
        </label>
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => handleSave('preferences')}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={securityData.newPassword}
            onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
            placeholder="Confirm new password"
          />
        </div>
      </div>
      <div className="toggle-group">
        <label className="toggle-item">
          <input
            type="checkbox"
            checked={securityData.twoFactorEnabled}
            onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
          />
          <span className="toggle-label">Enable two-factor authentication</span>
        </label>
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => handleSave('security')}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Update Security'}
      </button>
    </div>
  );

  if (loading) {
    return <ThemedLoadingSpinner theme="recruiter" size="large" text="Loading settings..." />;
  }

  return (
    <div className="recruiter-settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              <i className="fas fa-building"></i>
              Company
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button 
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-cog"></i>
              Preferences
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'company' && renderCompanyTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default RecruiterSettings;
