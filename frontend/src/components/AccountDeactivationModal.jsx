import React, { useState } from 'react';
import '../styles/AccountDeactivationModal.css';

const AccountDeactivationModal = ({ isOpen, onClose, onDeactivate, accountType = 'jobSeeker' }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleDeactivate = async () => {
    if (!reason) {
      alert('Please select a reason for deactivation');
      return;
    }

    setIsLoading(true);
    try {
      await onDeactivate({ reason, feedback });
      setStep(3); // Show confirmation
    } catch (error) {
      console.error('Error deactivating account:', error);
      alert('Failed to deactivate account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reasons = [
    'I found a job elsewhere',
    'I\'m not actively looking for work',
    'I found the platform too complex',
    'I have privacy concerns',
    'I received too many unwanted messages',
    'I\'m taking a break from job searching',
    'Other'
  ];

  if (!isOpen) return null;

  if (step === 3) {
    return (
      <div className="account-deactivation-modal-overlay">
        <div className="account-deactivation-modal confirmation">
          <div className="modal-header">
            <h2>Account Deactivated</h2>
          </div>
          <div className="modal-content">
            <div className="confirmation-message">
              <div className="confirmation-icon">✓</div>
              <h3>Your account has been successfully deactivated</h3>
              <p>
                We're sorry to see you go! Your account has been deactivated and will be hidden from other users.
              </p>
              <div className="reactivation-info">
                <h4>Want to reactivate?</h4>
                <p>
                  You can reactivate your account at any time by simply logging in again. 
                  All your data will be preserved and restored.
                </p>
                <button 
                  className="btn-primary"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-deactivation-modal-overlay" onClick={onClose}>
      <div className="account-deactivation-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Deactivate Account</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {step === 1 ? (
            <div className="deactivation-warning">
              <div className="warning-icon">⚠️</div>
              <h3>Are you sure you want to deactivate your account?</h3>
              <p>
                Deactivating your account will:
              </p>
              <ul>
                <li>Hide your profile from other users</li>
                <li>Stop all notifications and emails</li>
                <li>Pause any active subscriptions</li>
                <li>Preserve all your data for future reactivation</li>
              </ul>
              <p className="note">
                <strong>Note:</strong> This is not permanent deletion. You can reactivate your account at any time by logging in again.
              </p>
              <div className="warning-actions">
                <button 
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  className="btn-warning"
                  onClick={() => setStep(2)}
                >
                  Continue to Deactivation
                </button>
              </div>
            </div>
          ) : (
            <div className="deactivation-form">
              <h3>Help us improve</h3>
              <p>
                Before you go, please let us know why you're deactivating your account. 
                This helps us improve our service.
              </p>
              
              <div className="form-group">
                <label>Reason for deactivation *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  {reasons.map((r, index) => (
                    <option key={index} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Additional feedback (optional)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience or suggestions for improvement..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  className="btn-warning"
                  onClick={handleDeactivate}
                  disabled={isLoading || !reason}
                >
                  {isLoading ? 'Deactivating...' : 'Deactivate Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDeactivationModal;
