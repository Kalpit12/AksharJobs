import React from 'react';
import '../styles/VerificationBadge.css';

const VerificationBadge = ({ status, showText = true, size = 'medium' }) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'verified':
        return {
          icon: '✅',
          text: 'Verified',
          className: 'verified'
        };
      case 'pending':
        return {
          icon: '⏳',
          text: 'Pending',
          className: 'pending'
        };
      case 'rejected':
        return {
          icon: '❌',
          text: 'Rejected',
          className: 'rejected'
        };
      default:
        return {
          icon: '❓',
          text: 'Unknown',
          className: 'unknown'
        };
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <div className={`verification-badge ${badgeContent.className} ${size}`}>
      <span className="badge-icon">{badgeContent.icon}</span>
      {showText && <span className="badge-text">{badgeContent.text}</span>}
    </div>
  );
};

export default VerificationBadge;
