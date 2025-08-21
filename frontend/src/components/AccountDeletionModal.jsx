import React, { useState } from 'react';
import '../styles/AccountDeletionModal.css';

const AccountDeletionModal = ({ isOpen, onClose, onDelete, accountType = 'jobSeeker' }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleDelete = async () => {
    if (!reason) {
      alert('Please select a reason for deletion');
      return;
    }

    if (confirmText !== 'DELETE') {
      alert('Please type DELETE exactly to confirm account deletion');
      return;
    }

    setIsLoading(true);
    try {
      await onDelete({ reason, feedback });
      setStep(3); // Show confirmation
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reasons = [
    'I found a job elsewhere',
    'I\'m not satisfied with the service',
    'I have privacy concerns',
    'I received too many unwanted messages',
    'I\'m taking a break from job searching',
    'I have duplicate accounts',
    'Other'
  ];

  if (!isOpen) return null;

  if (step === 3) {
    return (
      <div className="account-deletion-modal-overlay">
        <div className="account-deletion-modal confirmation">
          <div className="modal-header">
            <h2>Account Deleted</h2>
          </div>
          <div className="modal-content">
            <div className="confirmation-message">
              <div className="confirmation-icon">🗑️</div>
              <h3>Your account has been permanently deleted</h3>
              <p>
                We're sorry to see you go! Your account and all associated data have been permanently removed from our system.
              </p>
              <div className="deletion-info">
                <h4>What happens next?</h4>
                <ul>
                  <li>All your personal data has been permanently deleted</li>
                  <li>Your profile is no longer visible to other users</li>
                  <li>Any active subscriptions have been cancelled</li>
                  <li>You will need to create a new account if you want to return</li>
                </ul>
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
    <div className="account-deletion-modal-overlay" onClick={onClose}>
      <div className="account-deletion-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Account</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {step === 1 ? (
            <div className="deletion-warning">
              <div className="warning-icon">🚨</div>
              <h3>⚠️ WARNING: This action cannot be undone!</h3>
              <p>
                <strong>Permanently deleting your account will:</strong>
              </p>
              <ul>
                <li>Remove all your personal data permanently</li>
                <li>Delete your profile, applications, and messages</li>
                <li>Cancel any active subscriptions</li>
                <li>Remove all saved jobs and preferences</li>
                <li>This action is irreversible</li>
              </ul>
              
              <div className="critical-warning">
                <div className="warning-icon-small">⚠️</div>
                <div className="warning-text">
                  <strong>Critical:</strong> Once deleted, your account and all data cannot be recovered. 
                  Consider deactivating your account instead if you might want to return later.
                </div>
              </div>
              
              <div className="warning-actions">
                <button 
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => setStep(2)}
                >
                  I Understand, Continue to Deletion
                </button>
              </div>
            </div>
          ) : (
            <div className="deletion-form">
              <h3>Final confirmation required</h3>
              <p>
                To confirm you understand the consequences, please provide the following information:
              </p>
              
              <div className="form-group">
                <label>Reason for permanent deletion *</label>
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
              
              <div className="form-group">
                <label>
                  Type <strong>DELETE</strong> to confirm permanent deletion *
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className={confirmText === 'DELETE' ? 'valid' : confirmText ? 'invalid' : ''}
                />
                <small className="help-text">
                  This is your final chance to cancel. Once confirmed, your account will be permanently deleted.
                </small>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={isLoading || !reason || confirmText !== 'DELETE'}
                >
                  {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionModal;
