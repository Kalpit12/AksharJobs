import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import EmailVerification from '../components/EmailVerification';
import PhoneVerification from '../components/PhoneVerification';
import ProfileEditModal from '../components/ProfileEditModal';
import PasswordChangeModal from '../components/PasswordChangeModal';
import TwoFactorModal from '../components/TwoFactorModal';
import LoginHistoryModal from '../components/LoginHistoryModal';
import ActiveSessionsModal from '../components/ActiveSessionsModal';
import VisibilitySettingsModal from '../components/VisibilitySettingsModal';
import DataPrivacyModal from '../components/DataPrivacyModal';
import DisplaySettingsModal from '../components/DisplaySettingsModal';
import GeneralPreferencesModal from '../components/GeneralPreferencesModal';
import AccountTypeModal from '../components/AccountTypeModal';
import SubscriptionModal from '../components/SubscriptionModal';
import BillingModal from '../components/BillingModal';
import AccountDeactivationModal from '../components/AccountDeactivationModal';
import AccountDeletionModal from '../components/AccountDeletionModal';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('account');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editMode, setEditMode] = useState('name');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const [showVisibilitySettings, setShowVisibilitySettings] = useState(false);
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [showGeneralPreferences, setShowGeneralPreferences] = useState(false);
  const [showAccountType, setShowAccountType] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showAccountDeactivation, setShowAccountDeactivation] = useState(false);
  const [showAccountDeletion, setShowAccountDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionTransition, setSectionTransition] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: { verified: false, value: '' },
    phone: { verified: false, value: '' }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("role");
      
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: userId,
            firstName: userData.firstName || 'User',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || userData.phone || '',
            role: userRole || userData.userType || 'jobSeeker',
            profilePicture: userData.profileImage || null,
            darkMode: false,
            language: 'English',
            notifications: {
              jobAlerts: true,
              messages: true,
              updates: true,
              marketing: false
            },
            visibility: {
              profileVisibility: 'public',
              onlineStatus: true,
              activityStatus: true
            },
            privacy: {
              dataExport: false,
              dataDeletion: false,
              privacyPolicy: false,
              marketingEmails: true,
              analyticsTracking: true,
              thirdPartySharing: true
            },
                         display: {
               language: 'English',
               theme: 'light',
               fontSize: 'medium'
             },
             general: {
               timeZone: 'UTC+3',
               dateFormat: 'DD/MM/YYYY',
               currency: 'KSH'
             },
             subscription: {
               plan: 'Basic Plan',
               status: 'active',
               nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
             },
             billing: {
               cardNumber: '',
               cardHolder: '',
               expiryDate: '',
               cvv: '',
               billingAddress: {
                 street: '',
                 city: '',
                 state: '',
                 zipCode: '',
                 country: 'Kenya'
               }
             }
          });

          // Check verification status after user data is loaded
          checkVerificationStatus({
            email: userData.email,
            phone: userData.phoneNumber || userData.phone
          });
          
          setIsLoading(false);
        } else {
          console.error("Failed to fetch user data");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const checkVerificationStatus = async (userData = null) => {
    const userToCheck = userData || user;
    if (!userToCheck?.email && !userToCheck?.phone) {
      return;
    }

    try {
      // Check email verification status
      if (userToCheck.email) {
        const emailStatus = await fetch(`http://127.0.0.1:5000/api/email-status/${userToCheck.email}`);
        if (emailStatus.ok) {
          const emailData = await emailStatus.json();
          setVerificationStatus(prev => ({
            ...prev,
            email: { verified: !emailData.hasCode, value: userToCheck.email }
          }));
        }
      }

      // Check phone verification status
      if (userToCheck.phone) {
        const phoneStatus = await fetch(`http://127.0.0.1:5000/api/status/${userToCheck.phone}`);
        if (phoneStatus.ok) {
          const phoneData = await phoneStatus.json();
          setVerificationStatus(prev => ({
            ...prev,
            phone: { verified: !phoneData.hasCode, value: userToCheck.phone }
          }));
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleEmailVerification = (verifiedEmail) => {
    setVerificationStatus(prev => ({
      ...prev,
      email: { verified: true, value: verifiedEmail }
    }));
    setShowEmailVerification(false);
  };

  const handlePhoneVerification = (verifiedPhone) => {
    setVerificationStatus(prev => ({
      ...prev,
      phone: { verified: true, value: verifiedPhone }
    }));
    setShowPhoneVerification(false);
  };

  const handleToggle = (setting, value) => {
    setUser(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleNotificationToggle = (type, value) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    
    setSectionTransition(true);
    setTimeout(() => {
      setActiveSection(section);
      setSectionTransition(false);
    }, 150);
  };

  const handleProfileEdit = (mode) => {
    setEditMode(mode);
    setShowProfileEdit(true);
  };

  const handleProfileSave = async (updates) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        ...updates
      }));

      // Send update to backend
      const response = await fetch(`http://127.0.0.1:5000/api/auth/update_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update localStorage if needed
      if (updates.firstName || updates.lastName) {
        localStorage.setItem('userName', `${updates.firstName} ${updates.lastName}`);
      }
      if (updates.profilePicture) {
        localStorage.setItem('userImage', updates.profilePicture);
      }

      console.log('Profile updated successfully');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture
      }));
      alert('Failed to update profile. Please try again.');
    }
  };



















  const handlePasswordChange = async (passwordData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Changing password for user:', userId);
      console.log('Password data:', passwordData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleTwoFactorUpdate = async (twoFactorData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Updating 2FA for user:', userId);
      console.log('2FA data:', twoFactorData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Two-factor authentication ${twoFactorData.enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error updating 2FA:', error);
      alert('Failed to update two-factor authentication. Please try again.');
    }
  };

  const handleVisibilitySettings = async (visibilityData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        visibility: visibilityData
      }));

      // Mock API call - replace with actual implementation
      console.log('Updating visibility settings for user:', userId);
      console.log('Visibility data:', visibilityData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Visibility settings updated successfully!');
    } catch (error) {
      console.error('Error updating visibility settings:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        visibility: user.visibility
      }));
      alert('Failed to update visibility settings. Please try again.');
    }
  };

  const handleDataPrivacy = async (privacyData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        privacy: privacyData
      }));

      // Mock API call - replace with actual implementation
      console.log('Updating privacy settings for user:', userId);
      console.log('Privacy data:', privacyData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Privacy settings updated successfully!');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        privacy: user.privacy
      }));
      alert('Failed to update privacy settings. Please try again.');
    }
  };

  const handleDisplaySettings = async (displayData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        display: displayData
      }));

      // Apply theme immediately
      if (displayData.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      // Mock API call - replace with actual implementation
      console.log('Updating display settings for user:', userId);
      console.log('Display data:', displayData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Display settings updated successfully!');
    } catch (error) {
      console.error('Error updating display settings:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        display: user.display
      }));
      alert('Failed to update display settings. Please try again.');
    }
  };

  const handleGeneralPreferences = async (generalData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        general: generalData
      }));

      // Mock API call - replace with actual implementation
      console.log('Updating general preferences for user:', userId);
      console.log('General preferences data:', generalData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('General preferences updated successfully!');
    } catch (error) {
      console.error('Error updating general preferences:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        general: user.general
      }));
      alert('Failed to update general preferences. Please try again.');
    }
  };

  const handleAccountType = async (accountType) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Update local state immediately for better UX
      setUser(prev => ({
        ...prev,
        role: accountType
      }));

      // Mock API call - replace with actual implementation
      console.log('Updating account type for user:', userId);
      console.log('New account type:', accountType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Account type updated successfully!');
    } catch (error) {
      console.error('Error updating account type:', error);
      // Revert local state on error
      setUser(prev => ({
        ...prev,
        role: user.role
      }));
      alert('Failed to update account type. Please try again.');
    }
  };

  const handleSubscription = async (subscriptionPlan) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Updating subscription for user:', userId);
      console.log('New subscription plan:', subscriptionPlan);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Subscription updated successfully!');
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again.');
    }
  };

  const handleBilling = async (billingData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Updating billing info for user:', userId);
      console.log('Billing data:', billingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Billing information updated successfully!');
    } catch (error) {
      console.error('Error updating billing info:', error);
      alert('Failed to update billing information. Please try again.');
    }
  };

  const handleAccountDeactivation = async (deactivationData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Deactivating account for user:', userId);
      console.log('Deactivation data:', deactivationData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Account deactivated successfully! You can reactivate by logging in again.');
      
      // Redirect to logout or home page
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error deactivating account:', error);
      alert('Failed to deactivate account. Please try again.');
    }
  };

  const handleAccountDeletion = async (deletionData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      // Mock API call - replace with actual implementation
      console.log('Deleting account for user:', userId);
      console.log('Deletion data:', deletionData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Account deletion request submitted successfully! Your account will be permanently deleted within 30 days.');
      
      // Redirect to logout or home page
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleBackNavigation = () => {
    const userRole = localStorage.getItem("role");
    
    if (userRole === 'recruiter') {
      navigate('/recruiter-dashboard');
    } else {
      // Default to job seeker dashboard
      navigate('/jobseeker-dashboard');
    }
  };

  const renderAccountSection = () => (
    <div className="settings-section">
      <h3>Account</h3>
      <div className="setting-item">
        <div className="setting-info">
          <div className="setting-label">Email</div>
          <div className="setting-description">Manage your email address</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user.email}</span>
          {verificationStatus.email.verified ? (
            <span className="verified-badge">
              ✓ Verified
            </span>
          ) : (
            <button 
              className="verify-btn"
              onClick={() => setShowEmailVerification(true)}
            >
              Verify
            </button>
          )}
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <div className="setting-label">Phone Number</div>
          <div className="setting-description">Manage your phone number</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user.phone || 'Not set'}</span>
          {verificationStatus.phone.verified ? (
            <span className="verified-badge">
              ✓ Verified
            </span>
          ) : (
            <button 
              className="verify-btn"
              onClick={() => setShowPhoneVerification(true)}
            >
              Verify
            </button>
          )}
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
             <div className="setting-item" onClick={() => handleProfileEdit('name')}>
         <div className="setting-info">
           <div className="setting-label">Name</div>
           <div className="setting-description">Your full name as it appears on your profile</div>
         </div>
         <div className="setting-actions">
           <span className="setting-value">{user.firstName} {user.lastName}</span>
           <button className="setting-arrow">›</button>
         </div>
       </div>
       
       <div className="setting-item" onClick={() => handleProfileEdit('picture')}>
         <div className="setting-info">
           <div className="setting-label">Profile Picture</div>
           <div className="setting-description">Change your profile picture</div>
         </div>
         <div className="setting-actions">
           <span className="setting-value">Update</span>
           <button className="setting-arrow">›</button>
         </div>
       </div>
    </div>
  );

  const renderSignInSecuritySection = () => (
    <div className="settings-section">
      <h3>Sign in & security</h3>
      <div className="setting-item" onClick={() => setShowPasswordChange(true)}>
        <div className="setting-info">
          <div className="setting-label">Password</div>
          <div className="setting-description">Change your password</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">••••••••</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowTwoFactor(true)}>
        <div className="setting-info">
          <div className="setting-label">Two-Factor Authentication</div>
          <div className="setting-description">Add an extra layer of security to your account</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Off</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowLoginHistory(true)}>
        <div className="setting-info">
          <div className="setting-label">Login History</div>
          <div className="setting-description">View your recent login activity</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">View</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowActiveSessions(true)}>
        <div className="setting-info">
          <div className="setting-label">Active Sessions</div>
          <div className="setting-description">Manage your active sessions across devices</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Manage</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderVisibilitySection = () => (
    <div className="settings-section">
      <h3>Visibility</h3>
      <div className="setting-item" onClick={() => setShowVisibilitySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Profile Visibility</div>
          <div className="setting-description">Control who can see your profile</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.visibility?.profileVisibility === 'public' ? 'Public' : 
             user?.visibility?.profileVisibility === 'connections' ? 'Connections Only' : 'Private'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowVisibilitySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Online Status</div>
          <div className="setting-description">Show when you're online</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.visibility?.onlineStatus ? 'On' : 'Off'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowVisibilitySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Activity Status</div>
          <div className="setting-description">Show your recent activity</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.visibility?.activityStatus ? 'On' : 'Off'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderDataPrivacySection = () => (
    <div className="settings-section">
      <h3>Data privacy</h3>
      <div className="setting-item" onClick={() => setShowDataPrivacy(true)}>
        <div className="setting-info">
          <div className="setting-label">Data Export</div>
          <div className="setting-description">Download a copy of your data</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.privacy?.dataExport ? 'Requested' : 'Request'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowDataPrivacy(true)}>
        <div className="setting-info">
          <div className="setting-label">Data Deletion</div>
          <div className="setting-description">Request deletion of your data</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.privacy?.dataDeletion ? 'Pending Deletion' : 'Request'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowDataPrivacy(true)}>
        <div className="setting-info">
          <div className="setting-label">Privacy Policy</div>
          <div className="setting-description">Read our privacy policy</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.privacy?.privacyPolicy ? 'Viewed' : 'View'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderAdvertisingDataSection = () => (
    <div className="settings-section">
      <h3>Advertising data</h3>
      <div className="setting-item">
        <div className="setting-info">
          <div className="setting-label">Personalized Ads</div>
          <div className="setting-description">Allow personalized advertising</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">On</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <div className="setting-label">Third-Party Data</div>
          <div className="setting-description">Allow third-party data sharing</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Off</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="settings-section">
      <h3>Notifications</h3>
      <div className="setting-item">
        <div className="setting-info">
          <div className="setting-label">Email Notifications</div>
          <div className="setting-description">Receive notifications via email</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">On</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Push Notifications</div>
            <div className="setting-description">Receive push notifications</div>
          </div>
          <div className="setting-actions">
            <span className="setting-value">On</span>
            <button className="setting-arrow">›</button>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Job Alerts</div>
            <div className="setting-description">Get notified about new job opportunities</div>
          </div>
          <div className="setting-actions">
            <span className="setting-value">On</span>
            <button className="setting-arrow">›</button>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Application Updates</div>
            <div className="setting-description">Get notified about application status</div>
          </div>
          <div className="setting-actions">
            <span className="setting-value">On</span>
            <button className="setting-arrow">›</button>
          </div>
        </div>
    </div>
  );

  const renderDisplaySection = () => (
    <div className="settings-section">
      <h3>Display</h3>
      <div className="setting-item" onClick={() => setShowDisplaySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Language</div>
          <div className="setting-description">Choose your preferred language</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user?.display?.language || 'English'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowDisplaySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Theme</div>
          <div className="setting-description">Choose light or dark theme</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.display?.theme === 'light' ? 'Light' : 
             user?.display?.theme === 'dark' ? 'Dark' : 'Auto'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowDisplaySettings(true)}>
        <div className="setting-info">
          <div className="setting-label">Font Size</div>
          <div className="setting-description">Adjust text size for better readability</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">
            {user?.display?.fontSize === 'small' ? 'Small' : 
             user?.display?.fontSize === 'medium' ? 'Medium' : 
             user?.display?.fontSize === 'large' ? 'Large' : 'Extra Large'}
          </span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderGeneralPreferencesSection = () => (
    <div className="settings-section">
      <h3>General preferences</h3>
      <div className="setting-item" onClick={() => setShowGeneralPreferences(true)}>
        <div className="setting-info">
          <div className="setting-label">Time Zone</div>
          <div className="setting-description">Set your local time zone</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user?.general?.timeZone || 'UTC+0'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowGeneralPreferences(true)}>
        <div className="setting-info">
          <div className="setting-label">Date Format</div>
          <div className="setting-description">Choose your preferred date format</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user?.general?.dateFormat || 'MM/DD/YYYY'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowGeneralPreferences(true)}>
        <div className="setting-info">
          <div className="setting-label">Currency</div>
          <div className="setting-description">Set your preferred currency</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user?.general?.currency || 'USD'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderAccountManagementSection = () => (
    <div className="settings-section">
      <h3>Account management</h3>
      <div className="setting-item" onClick={() => setShowAccountType(true)}>
        <div className="setting-info">
          <div className="setting-label">Account Type</div>
          <div className="setting-description">Your current account type</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowSubscription(true)}>
        <div className="setting-info">
          <div className="setting-label">Subscription</div>
          <div className="setting-description">Manage your subscription plan</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">{user?.subscription?.plan || 'Basic Plan'}</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowBilling(true)}>
        <div className="setting-info">
          <div className="setting-label">Billing</div>
          <div className="setting-description">View and manage billing information</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Manage</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowAccountDeactivation(true)}>
        <div className="setting-info">
          <div className="setting-label">Deactivate Account</div>
          <div className="setting-description">Temporarily deactivate your account</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Deactivate</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
      
      <div className="setting-item" onClick={() => setShowAccountDeletion(true)}>
        <div className="setting-info">
          <div className="setting-label">Delete Account</div>
          <div className="setting-description">Permanently delete your account and data</div>
        </div>
        <div className="setting-actions">
          <span className="setting-value">Delete</span>
          <button className="setting-arrow">›</button>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSection();
      case 'signin':
        return renderSignInSecuritySection();
      case 'visibility':
        return renderVisibilitySection();
      case 'privacy':
        return renderDataPrivacySection();
      case 'advertising':
        return renderAdvertisingDataSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'display':
        return renderDisplaySection();
      case 'preferences':
        return renderGeneralPreferencesSection();
      case 'management':
        return renderAccountManagementSection();
      default:
        return renderAccountSection();
    }
  };

  if (isLoading || !user) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <span>Loading your settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <Header />
      <div className="settings-sidebar">
        <div className="settings-header">
          <BackButton 
            to={user.role === "recruiter" ? "/recruiter-dashboard" : "/jobseeker-dashboard"} 
            text={`Back to ${user.role === "recruiter" ? "Recruiter" : "Job Seeker"} Dashboard`} 
          />
          <div className="profile-icon">👤</div>
          <h1>Settings</h1>
        </div>
        
        <nav className="settings-nav">
          <button 
            className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => handleSectionChange('account')}
          >
            <span className="nav-icon">👤</span>
            Account preferences
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'signin' ? 'active' : ''}`}
            onClick={() => handleSectionChange('signin')}
          >
            <span className="nav-icon">🔒</span>
            Sign in & security
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'visibility' ? 'active' : ''}`}
            onClick={() => handleSectionChange('visibility')}
          >
            <span className="nav-icon">👁️</span>
            Visibility
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => handleSectionChange('privacy')}
          >
            <span className="nav-icon">🛡️</span>
            Data privacy
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'advertising' ? 'active' : ''}`}
            onClick={() => handleSectionChange('advertising')}
          >
            <span className="nav-icon">📰</span>
            Advertising data
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => handleSectionChange('notifications')}
          >
            <span className="nav-icon">🔔</span>
            Notifications
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'display' ? 'active' : ''}`}
            onClick={() => handleSectionChange('display')}
          >
            <span className="nav-icon">🎨</span>
            Display
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
            onClick={() => handleSectionChange('preferences')}
          >
            <span className="nav-icon">⚙️</span>
            General preferences
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'management' ? 'active' : ''}`}
            onClick={() => handleSectionChange('management')}
          >
            <span className="nav-icon">🏗️</span>
            Account management
          </button>
        </nav>
      </div>
      
      <div className="settings-content">
        <div className={`section-content ${sectionTransition ? 'section-transition' : ''}`}>
          {renderSection()}
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerification
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        onVerificationComplete={handleEmailVerification}
      />

      {/* Phone Verification Modal */}
      <PhoneVerification
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        onVerificationComplete={handlePhoneVerification}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        user={user}
        onSave={handleProfileSave}
        editMode={editMode}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
        onSave={handlePasswordChange}
      />

      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={showTwoFactor}
        onClose={() => setShowTwoFactor(false)}
        onSave={handleTwoFactorUpdate}
        isEnabled={false}
      />

      {/* Login History Modal */}
      <LoginHistoryModal
        isOpen={showLoginHistory}
        onClose={() => setShowLoginHistory(false)}
      />

      {/* Active Sessions Modal */}
      <ActiveSessionsModal
        isOpen={showActiveSessions}
        onClose={() => setShowActiveSessions(false)}
      />

      {/* Visibility Settings Modal */}
      <VisibilitySettingsModal
        isOpen={showVisibilitySettings}
        onClose={() => setShowVisibilitySettings(false)}
        onSave={handleVisibilitySettings}
        currentSettings={user?.visibility}
      />

      {/* Data Privacy Modal */}
      <DataPrivacyModal
        isOpen={showDataPrivacy}
        onClose={() => setShowDataPrivacy(false)}
        onSave={handleDataPrivacy}
        currentSettings={user?.privacy}
      />

             {/* Display Settings Modal */}
       <DisplaySettingsModal
         isOpen={showDisplaySettings}
         onClose={() => setShowDisplaySettings(false)}
         onSave={handleDisplaySettings}
         currentSettings={user?.display}
       />

       {/* General Preferences Modal */}
       <GeneralPreferencesModal
         isOpen={showGeneralPreferences}
         onClose={() => setShowGeneralPreferences(false)}
         onSave={handleGeneralPreferences}
         currentSettings={user?.general}
       />

       {/* Account Type Modal */}
       <AccountTypeModal
         isOpen={showAccountType}
         onClose={() => setShowAccountType(false)}
         onSave={handleAccountType}
         currentAccountType={user?.role}
       />

       {/* Subscription Modal */}
       <SubscriptionModal
         isOpen={showSubscription}
         onClose={() => setShowSubscription(false)}
         onSave={handleSubscription}
         currentPlan="basic"
       />

       {/* Billing Modal */}
       <BillingModal
         isOpen={showBilling}
         onClose={() => setShowBilling(false)}
         onSave={handleBilling}
         currentBilling={{}}
       />

       {/* Account Deactivation Modal */}
       <AccountDeactivationModal
         isOpen={showAccountDeactivation}
         onClose={() => setShowAccountDeactivation(false)}
         onDeactivate={handleAccountDeactivation}
         accountType={user?.role}
       />

       {/* Account Deletion Modal */}
       <AccountDeletionModal
         isOpen={showAccountDeletion}
         onClose={() => setShowAccountDeletion(false)}
         onDelete={handleAccountDeletion}
         accountType={user?.role}
       />
     </div>
   );
 };

export default Settings;
