import React, { useState } from 'react';
import '../styles/TwoFactorModal.css';

const TwoFactorModal = ({ isOpen, onClose, onSave, isEnabled = false }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(isEnabled);
  const [verificationMethod, setVerificationMethod] = useState('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (twoFactorEnabled) {
      if (verificationMethod === 'sms' && !phoneNumber.trim()) {
        alert('Please enter a phone number for SMS verification');
        return;
      }
      if (verificationMethod === 'email' && !email.trim()) {
        alert('Please enter an email for email verification');
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSave({
        enabled: twoFactorEnabled,
        method: verificationMethod,
        phoneNumber: phoneNumber.trim(),
        email: email.trim()
      });
      onClose();
    } catch (error) {
      console.error('Error updating 2FA settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTwoFactorEnabled(isEnabled);
    setVerificationMethod('sms');
    setPhoneNumber('');
    setEmail('');
    onClose();
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      // When enabling, set default values
      setVerificationMethod('sms');
      setPhoneNumber('');
      setEmail('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="two-factor-modal-overlay" onClick={handleCancel}>
      <div className="two-factor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Two-Factor Authentication</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-content">
          <div className="two-factor-toggle">
            <div className="toggle-info">
              <h3>Enable Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account by requiring a verification code in addition to your password.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleToggle2FA}
              />
              <span className="slider"></span>
            </label>
          </div>

          {twoFactorEnabled && (
            <>
              <div className="verification-method">
                <h3>Verification Method</h3>
                <div className="method-options">
                  <label className="method-option">
                    <input
                      type="radio"
                      name="verificationMethod"
                      value="sms"
                      checked={verificationMethod === 'sms'}
                      onChange={(e) => setVerificationMethod(e.target.value)}
                    />
                    <span className="method-icon">📱</span>
                    <div className="method-details">
                      <span className="method-name">SMS</span>
                      <span className="method-description">Receive codes via text message</span>
                    </div>
                  </label>

                  <label className="method-option">
                    <input
                      type="radio"
                      name="verificationMethod"
                      value="email"
                      checked={verificationMethod === 'email'}
                      onChange={(e) => setVerificationMethod(e.target.value)}
                    />
                    <span className="method-icon">📧</span>
                    <div className="method-details">
                      <span className="method-name">Email</span>
                      <span className="method-description">Receive codes via email</span>
                    </div>
                  </label>
                </div>
              </div>

              {verificationMethod === 'sms' && (
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="contact-input"
                  />
                  <p className="input-help">We'll send verification codes to this number</p>
                </div>
              )}

              {verificationMethod === 'email' && (
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="contact-input"
                  />
                  <p className="input-help">We'll send verification codes to this email</p>
                </div>
              )}

              <div className="security-notice">
                <div className="notice-icon">🔒</div>
                <div className="notice-content">
                  <h4>Security Benefits</h4>
                  <ul>
                    <li>Protects your account even if your password is compromised</li>
                    <li>Requires access to your phone or email for login</li>
                    <li>Provides real-time alerts for suspicious login attempts</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {!twoFactorEnabled && (
            <div className="disabled-notice">
              <div className="notice-icon">⚠️</div>
              <div className="notice-content">
                <h4>Two-Factor Authentication is Disabled</h4>
                <p>Your account is currently protected only by your password. Enable 2FA for enhanced security.</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={isLoading || (twoFactorEnabled && verificationMethod === 'sms' && !phoneNumber.trim()) || (twoFactorEnabled && verificationMethod === 'email' && !email.trim())}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
