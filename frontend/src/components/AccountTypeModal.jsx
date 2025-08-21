import React, { useState, useEffect } from 'react';
import '../styles/AccountTypeModal.css';

const AccountTypeModal = ({ isOpen, onClose, onSave, currentAccountType = 'jobSeeker' }) => {
  const [accountType, setAccountType] = useState(currentAccountType);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentAccountType) {
      setAccountType(currentAccountType);
    }
  }, [isOpen, currentAccountType]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(accountType);
      onClose();
    } catch (error) {
      console.error('Error saving account type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      value: 'jobSeeker',
      name: 'Job Seeker',
      icon: '👤',
      description: 'Search and apply for jobs, manage your profile and applications',
      features: ['Job search and applications', 'Profile management', 'Resume upload', 'Job alerts']
    },
    {
      value: 'recruiter',
      name: 'Recruiter',
      icon: '🏢',
      description: 'Post jobs, manage candidates, and hire talent for your organization',
      features: ['Post job listings', 'Candidate management', 'Analytics dashboard', 'Communication tools']
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="account-type-modal-overlay" onClick={onClose}>
      <div className="account-type-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Account Type</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            Choose your account type. This will determine the features and tools available to you.
          </p>
          
          <div className="account-type-options">
            {accountTypes.map((type) => (
              <label 
                key={type.value} 
                className={`account-type-option ${accountType === type.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={type.value}
                  checked={accountType === type.value}
                  onChange={() => setAccountType(type.value)}
                />
                <div className="type-content">
                  <div className="type-header">
                    <span className="type-icon">{type.icon}</span>
                    <div className="type-info">
                      <span className="type-name">{type.name}</span>
                      <span className="type-description">{type.description}</span>
                    </div>
                  </div>
                  <div className="type-features">
                    <h4>Features:</h4>
                    <ul>
                      {type.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="important-note">
            <div className="note-icon">⚠️</div>
            <div className="note-content">
              <strong>Important:</strong> Changing your account type will affect your access to certain features. 
              Some data may need to be migrated or adjusted.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Account Type'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeModal;
