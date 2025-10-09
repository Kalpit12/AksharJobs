import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/CommunityVerificationPage.css';

const CommunityVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  
  const action = searchParams.get('action'); // 'approve' or 'reject'
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    if (action && userId && token) {
      handleVerification();
    } else {
      setError('Invalid verification link. Missing required parameters.');
      setLoading(false);
    }
  }, [action, userId, token]);

  const handleVerification = async () => {
    setVerifying(true);
    setError('');

    try {
      const response = await axios.post(buildApiUrl('/api/community-verification/verify'), {
        userId: userId,
        action: action,
        token: token
      });

      if (response.data.success) {
        setUserData(response.data.userData);
        setCommunityData(response.data.communityData);
        
        if (action === 'approve') {
          setSuccess('User has been successfully approved for the community!');
        } else {
          setSuccess('User verification has been rejected.');
        }
      } else {
        setError(response.data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.error || 'Failed to process verification. Please try again.');
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="community-verification-container">
        <div className="verification-card">
          <div className="loading-section">
            <div className="spinner"></div>
            <h2>Processing Verification...</h2>
            <p>Please wait while we process your verification request.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <div className="logo-section">
            <h1>🚀 AksharJobs</h1>
            <p>Kenya's Premier Job Platform</p>
          </div>
          <h2>🏷️ Community Verification</h2>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        {userData && communityData && (
          <div className="verification-details">
            <div className="user-info-card">
              <h3>👤 User Information</h3>
              <div className="user-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{userData.firstName} {userData.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{userData.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{userData.phoneNumber || userData.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{userData.location || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">User Type:</span>
                  <span className="value">{userData.userType?.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="community-info-card">
              <h3>🏷️ Community Information</h3>
              <div className="community-details">
                {communityData ? (
                  <>
                    <div className="detail-row">
                      <span className="label">Community:</span>
                      <span className="value">{communityData.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Category:</span>
                      <span className="value">{communityData.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Description:</span>
                      <span className="value">{communityData.description}</span>
                    </div>
                  </>
                ) : (
                  <div className="detail-row">
                    <span className="label">Community:</span>
                    <span className="value">Community information not available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="verification-status">
              <h3>📊 Verification Status</h3>
              <div className={`status-badge ${action === 'approve' ? 'approved' : 'rejected'}`}>
                {action === 'approve' ? '✅ APPROVED' : '❌ REJECTED'}
              </div>
              <p className="status-message">
                {action === 'approve' 
                  ? 'This user has been approved for the community and will now have access to community-specific features and job opportunities.'
                  : 'This user has been rejected for the community. They can reapply in the future if needed.'
                }
              </p>
            </div>
          </div>
        )}

        <div className="verification-actions">
          <button
            className="back-button"
            onClick={() => window.close()}
          >
            Close Window
          </button>
          <button
            className="dashboard-button"
            onClick={() => navigate('/')}
          >
            Go to AksharJobs
          </button>
        </div>

        <div className="verification-info">
          <h4>ℹ️ What happens next?</h4>
          <ul>
            {action === 'approve' ? (
              <>
                <li>User will receive a notification about their approval</li>
                <li>User will see a verification badge on their profile</li>
                <li>User will have access to community-specific job opportunities</li>
                <li>User can now participate in community discussions</li>
              </>
            ) : (
              <>
                <li>User will receive a notification about the rejection</li>
                <li>User can reapply for community verification in the future</li>
                <li>User can still access general job opportunities</li>
                <li>User will not have community-specific access</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityVerificationPage;
