import React, { useState, useEffect } from 'react';
import '../styles/VisibilitySettingsModal.css';

const VisibilitySettingsModal = ({ isOpen, onClose, onSave, currentSettings = {} }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    onlineStatus: true,
    activityStatus: true,
    ...currentSettings
  });

  useEffect(() => {
    if (isOpen && currentSettings) {
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [isOpen, currentSettings]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVisibilityChange = (value) => {
    setSettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="visibility-modal-overlay" onClick={onClose}>
      <div className="visibility-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Visibility Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Profile Visibility */}
          <div className="setting-group">
            <h3>Profile Visibility</h3>
            <p className="setting-description">
              Control who can see your profile information
            </p>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={settings.profileVisibility === 'public'}
                  onChange={(e) => handleVisibilityChange(e.target.value)}
                />
                <span className="radio-custom"></span>
                <div className="option-content">
                  <div className="option-title">Public</div>
                  <div className="option-description">Anyone can see your profile</div>
                </div>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="connections"
                  checked={settings.profileVisibility === 'connections'}
                  onChange={(e) => handleVisibilityChange(e.target.value)}
                />
                <span className="radio-custom"></span>
                <div className="option-content">
                  <div className="option-title">Connections Only</div>
                  <div className="option-description">Only your connections can see your profile</div>
                </div>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={settings.profileVisibility === 'private'}
                  onChange={(e) => handleVisibilityChange(e.target.value)}
                />
                <span className="radio-custom"></span>
                <div className="option-content">
                  <div className="option-title">Private</div>
                  <div className="option-description">Only you can see your profile</div>
                </div>
              </label>
            </div>
          </div>

          {/* Online Status */}
          <div className="setting-group">
            <h3>Online Status</h3>
            <p className="setting-description">
              Show when you're online to other users
            </p>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.onlineStatus}
                  onChange={() => handleToggle('onlineStatus')}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                {settings.onlineStatus ? 'Show online status' : 'Hide online status'}
              </span>
            </div>
          </div>

          {/* Activity Status */}
          <div className="setting-group">
            <h3>Activity Status</h3>
            <p className="setting-description">
              Show your recent activity to other users
            </p>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.activityStatus}
                  onChange={() => handleToggle('activityStatus')}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                {settings.activityStatus ? 'Show activity status' : 'Hide activity status'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettingsModal;
