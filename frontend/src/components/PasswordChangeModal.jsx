import React, { useState } from 'react';
import '../styles/PasswordChangeModal.css';

const PasswordChangeModal = ({ isOpen, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      alert('Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      alert('New password must be different from current password');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      });
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="password-change-modal-overlay" onClick={handleCancel}>
      <div className="password-change-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-container">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="password-requirements">
              <span className={`requirement ${newPassword.length >= 8 ? 'met' : 'unmet'}`}>
                ✓ At least 8 characters
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="password-match">
              {confirmPassword && (
                <span className={`match-status ${newPassword === confirmPassword ? 'match' : 'no-match'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave} 
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
