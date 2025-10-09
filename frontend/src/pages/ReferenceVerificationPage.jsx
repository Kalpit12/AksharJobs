import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faBuilding, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner,
  faArrowLeft,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/ReferenceVerificationPage.css';

const ReferenceVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referenceData, setReferenceData] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchVerificationData();
  }, [token]);

  const fetchVerificationData = async () => {
    try {
      const response = await fetch(buildApiUrl(`/api/references/verify/${token}`));
      
      if (response.ok) {
        const data = await response.json();
        setReferenceData(data.reference);
        setCandidateData(data.candidate);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid verification link');
      }
    } catch (err) {
      console.error('Error fetching verification data:', err);
      setError('Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (actionType) => {
    setAction(actionType);
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(buildApiUrl(`/api/references/verify/${token}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: actionType,
          recommendation: recommendation
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setReferenceData(prev => ({
          ...prev,
          status: data.status
        }));
        
        // Redirect to profile after successful verification
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setError(data.error || 'Failed to process verification');
      }
    } catch (err) {
      console.error('Error processing verification:', err);
      setError('Failed to process verification');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon verified" />;
      case 'pending':
        return <FontAwesomeIcon icon={faSpinner} className="status-icon pending" />;
      case 'rejected':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon rejected" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon unknown" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="verification-page">
        <div className="verification-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} className="loading-spinner" />
            <p>Loading verification details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verification-page">
        <div className="verification-container">
          <div className="error-state">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <h2>Verification Error</h2>
            <p>{error}</p>
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-header">
          <h1>Reference Verification</h1>
          <p>Please verify your professional relationship with the candidate below</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <FontAwesomeIcon icon={faCheckCircle} />
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        <div className="verification-content">
          {/* Candidate Information */}
          <div className="candidate-section">
            <h2>Candidate Information</h2>
            <div className="candidate-card">
              <div className="candidate-header">
                <div className="candidate-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="candidate-info">
                  <h3>{candidateData?.name}</h3>
                  <p>{candidateData?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Information */}
          <div className="reference-section">
            <h2>Reference Details</h2>
            <div className="reference-card">
              <div className="reference-header">
                <div className="reference-info">
                  <h3>{referenceData?.name}</h3>
                  <p className="reference-position">{referenceData?.position} at {referenceData?.company}</p>
                </div>
                <div className="reference-status">
                  {getStatusIcon(referenceData?.status)}
                  <span className={`status-text ${referenceData?.status}`}>
                    {getStatusText(referenceData?.status)}
                  </span>
                </div>
              </div>

              <div className="reference-details">
                <div className="detail-item">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>{referenceData?.email}</span>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>{referenceData?.company}</span>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{referenceData?.relationship?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Known for {referenceData?.yearsKnown} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          {referenceData?.status === 'pending' && (
            <div className="verification-form">
              <h2>Verification Request</h2>
              <p>
                <strong>{candidateData?.name}</strong> has listed you as a professional reference 
                and would like you to verify your professional relationship. This verification 
                will help enhance their profile credibility.
              </p>

              <div className="form-group">
                <label htmlFor="recommendation">Optional Recommendation</label>
                <textarea
                  id="recommendation"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  placeholder="You can provide a brief recommendation about this candidate (optional)"
                  rows="4"
                />
              </div>

              <div className="verification-actions">
                <button 
                  className="reject-btn"
                  onClick={() => handleVerification('reject')}
                  disabled={submitting}
                >
                  {submitting && action === 'reject' ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Decline Verification
                    </>
                  )}
                </button>
                <button 
                  className="approve-btn"
                  onClick={() => handleVerification('approve')}
                  disabled={submitting}
                >
                  {submitting && action === 'approve' ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Approve Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Already Processed */}
          {referenceData?.status !== 'pending' && (
            <div className="processed-section">
              <h2>Verification Status</h2>
              <div className="processed-card">
                <div className="processed-icon">
                  {getStatusIcon(referenceData?.status)}
                </div>
                <div className="processed-content">
                  <h3>Verification {getStatusText(referenceData?.status)}</h3>
                  <p>
                    This reference has already been {referenceData?.status === 'verified' ? 'approved' : 'declined'}.
                    {referenceData?.status === 'verified' && ' Thank you for verifying this professional relationship.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Information Panel */}
          <div className="info-panel">
            <div className="info-header">
              <FontAwesomeIcon icon={faInfoCircle} />
              <h3>About Reference Verification</h3>
            </div>
            <div className="info-content">
              <ul>
                <li>This verification is completely voluntary</li>
                <li>Your response will be visible on the candidate's profile</li>
                <li>You can decline without any obligation</li>
                <li>Your personal information will not be shared publicly</li>
                <li>If you have concerns, you can contact us at support@aksharjobs.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerificationPage;