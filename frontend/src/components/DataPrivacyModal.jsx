import React, { useState } from 'react';
import '../styles/DataPrivacyModal.css';

const DataPrivacyModal = ({ isOpen, onClose, onSave, currentSettings = {} }) => {
  const [settings, setSettings] = useState({
    dataExport: false,
    dataDeletion: false,
    privacyPolicy: false,
    ...currentSettings
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(settings);
      onClose();
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Data export request submitted successfully! You will receive an email with your data within 24 hours.');
      setSettings(prev => ({ ...prev, dataExport: true }));
    } catch (error) {
      alert('Failed to request data export. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This action cannot be undone!\n\n' +
      'Requesting data deletion will:\n' +
      '• Remove all your personal data\n' +
      '• Delete your account permanently\n' +
      '• Cancel any active subscriptions\n\n' +
      'Are you sure you want to proceed?'
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        // Simulate data deletion request
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Data deletion request submitted successfully! Your account will be deactivated and data will be permanently removed within 30 days.');
        setSettings(prev => ({ ...prev, dataDeletion: true }));
      } catch (error) {
        alert('Failed to request data deletion. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank');
    setSettings(prev => ({ ...prev, privacyPolicy: true }));
  };

  if (!isOpen) return null;

  return (
    <div className="data-privacy-modal-overlay" onClick={onClose}>
      <div className="data-privacy-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Data Privacy & Control</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Data Export */}
          <div className="privacy-section">
            <div className="section-header">
              <div className="section-icon">📤</div>
              <div className="section-info">
                <h3>Data Export</h3>
                <p>Download a copy of all your personal data</p>
              </div>
            </div>
            <div className="section-actions">
              <button 
                className="btn-action"
                onClick={handleDataExport}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Request Data Export'}
              </button>
              {settings.dataExport && (
                <span className="status-badge success">✓ Requested</span>
              )}
            </div>
          </div>

          {/* Data Deletion */}
          <div className="privacy-section danger">
            <div className="section-header">
              <div className="section-icon">🗑️</div>
              <div className="section-info">
                <h3>Data Deletion</h3>
                <p>Permanently delete your account and all associated data</p>
              </div>
            </div>
            <div className="section-actions">
              <button 
                className="btn-action danger"
                onClick={handleDataDeletion}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Request Account Deletion'}
              </button>
              {settings.dataDeletion && (
                <span className="status-badge warning">⚠️ Pending Deletion</span>
              )}
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="privacy-section">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <div className="section-info">
                <h3>Privacy Policy</h3>
                <p>Read our comprehensive privacy policy</p>
              </div>
            </div>
            <div className="section-actions">
              <button 
                className="btn-action secondary"
                onClick={handlePrivacyPolicy}
              >
                View Privacy Policy
              </button>
              {settings.privacyPolicy && (
                <span className="status-badge info">✓ Viewed</span>
              )}
            </div>
          </div>

          {/* Additional Privacy Options */}
          <div className="privacy-section">
            <div className="section-header">
              <div className="section-icon">🔒</div>
              <div className="section-info">
                <h3>Additional Privacy Controls</h3>
                <p>Manage your privacy preferences</p>
              </div>
            </div>
            <div className="privacy-options">
              <label className="privacy-option">
                <input 
                  type="checkbox" 
                  checked={settings.marketingEmails === false}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    marketingEmails: !e.target.checked 
                  }))}
                />
                <span className="checkmark"></span>
                <span className="option-text">Opt out of marketing emails</span>
              </label>
              
              <label className="privacy-option">
                <input 
                  type="checkbox" 
                  checked={settings.analyticsTracking === false}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    analyticsTracking: !e.target.checked 
                  }))}
                />
                <span className="checkmark"></span>
                <span className="option-text">Disable analytics tracking</span>
              </label>
              
              <label className="privacy-option">
                <input 
                  type="checkbox" 
                  checked={settings.thirdPartySharing === false}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    thirdPartySharing: !e.target.checked 
                  }))}
                />
                <span className="checkmark"></span>
                <span className="option-text">Block third-party data sharing</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyModal;
