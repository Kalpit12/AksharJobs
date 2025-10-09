import React, { useState, useEffect } from 'react';
import VerificationBadge from './VerificationBadge';
import { buildApiUrl } from '../config/api';
import '../styles/VerificationBadge.css';

const CommunityVerificationStatus = ({ userId, communities = [] }) => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchVerificationStatus();
    }
  }, [userId]);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`/api/community-verification/verification-status/${userId}`));
      const data = await response.json();
      
      if (data.success) {
        setVerificationData(data);
      } else {
        setError(data.error || 'Failed to fetch verification status');
      }
    } catch (err) {
      setError('Network error while fetching verification status');
      console.error('Error fetching verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-verification-section">
        <div className="verification-title">
          <span>🛡️</span>
          <span>Community Verification</span>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
          Loading verification status...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-verification-section">
        <div className="verification-title">
          <span>🛡️</span>
          <span>Community Verification</span>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', color: '#EF4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!verificationData) {
    return null;
  }

  const { verification_status, verified_at, verified_by, communities: verifiedCommunities } = verificationData;

  return (
    <div className="profile-verification-section">
      <div className="verification-title">
        <span>🛡️</span>
        <span>Community Verification</span>
        <VerificationBadge status={verification_status} size="small" />
      </div>
      
      <div className="verification-details">
        <div className="verification-item">
          <span className="verification-label">Status</span>
          <div className="status-indicator">
            <VerificationBadge status={verification_status} showText={false} />
            <span className="verification-value">
              {verification_status === 'verified' && 'Verified by Community Leader'}
              {verification_status === 'pending' && 'Awaiting Community Leader Approval'}
              {verification_status === 'rejected' && 'Verification Rejected'}
            </span>
          </div>
        </div>

        {verifiedCommunities && verifiedCommunities.length > 0 && (
          <div className="verification-item">
            <span className="verification-label">Communities</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {verifiedCommunities.map((community, index) => (
                <span key={index} style={{ 
                  background: '#E0F2FE', 
                  color: '#0C4A6E', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '12px' 
                }}>
                  {community.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {verification_status === 'verified' && verified_at && (
          <div className="verification-item">
            <span className="verification-label">Verified On</span>
            <span className="verification-value">{formatDate(verified_at)}</span>
          </div>
        )}

        {verification_status === 'verified' && verified_by && (
          <div className="verification-item">
            <span className="verification-label">Verified By</span>
            <span className="verification-value">{verified_by}</span>
          </div>
        )}

        {verification_status === 'pending' && (
          <div className="verification-item">
            <span className="verification-label">Next Steps</span>
            <span className="verification-value">
              Community leader will review your request and send you an email with the result.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityVerificationStatus;
