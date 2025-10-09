import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faBuilding, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner,
  faArrowLeft,
  faExclamationTriangle,
  faInfoCircle,
  faClock,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/ReferenceVerificationStatus.css';

const ReferenceVerificationStatus = () => {
  const { referenceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reference, setReference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (referenceId) {
      fetchReferenceDetails();
    }
  }, [referenceId]);

  useEffect(() => {
    let interval;
    
    if (polling && reference && reference.status === 'pending') {
      // Poll every 5 seconds for status updates
      interval = setInterval(() => {
        fetchReferenceDetails();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [polling, reference]);

  const fetchReferenceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/references/my-references`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const foundReference = data.references.find(ref => ref._id === referenceId);
        
        if (foundReference) {
          setReference(foundReference);
          
          // Stop polling if reference is verified or rejected
          if (foundReference.status === 'verified' || foundReference.status === 'rejected') {
            setPolling(false);
            
            // Redirect to profile after 3 seconds if verified/rejected
            setTimeout(() => {
              navigate('/profile');
            }, 3000);
          }
        } else {
          setError('Reference not found');
        }
      } else {
        setError('Failed to fetch reference details');
      }
    } catch (err) {
      console.error('Error fetching reference details:', err);
      setError('Failed to fetch reference details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon verified" />;
      case 'pending':
        return <FontAwesomeIcon icon={faSpinner} className="status-icon pending spinning" />;
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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'verified':
        return 'Great! Your reference has been verified. You will be redirected to your profile shortly.';
      case 'pending':
        return 'We\'re waiting for your reference to verify the relationship. This page will update automatically.';
      case 'rejected':
        return 'Your reference has declined to verify. You may want to contact them directly or add a different reference.';
      default:
        return 'Status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="verification-status-page">
        <div className="verification-status-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} className="loading-spinner" />
            <p>Loading reference details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verification-status-page">
        <div className="verification-status-container">
          <div className="error-state">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="back-button"
              onClick={() => navigate('/reference-verification')}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to References
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="verification-status-page">
        <div className="verification-status-container">
          <div className="error-state">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <h2>Reference Not Found</h2>
            <p>The reference you're looking for could not be found.</p>
            <button 
              className="back-button"
              onClick={() => navigate('/reference-verification')}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to References
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-status-page">
      <div className="verification-status-container">
        <div className="status-header">
          <h1>Reference Verification Status</h1>
          <p>Track the verification progress of your reference</p>
        </div>

        <div className="reference-card">
          <div className="reference-header">
            <div className="reference-info">
              <h2>{reference.name}</h2>
              <p className="reference-position">{reference.position} at {reference.company}</p>
            </div>
            <div className="reference-status">
              {getStatusIcon(reference.status)}
              <span className={`status-text ${reference.status}`}>
                {getStatusText(reference.status)}
              </span>
            </div>
          </div>

          <div className="reference-details">
            <div className="detail-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{reference.email}</span>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>{reference.phone}</span>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faUser} />
              <span>{reference.relationship.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faBuilding} />
              <span>Known for {reference.yearsKnown} years</span>
            </div>
          </div>

          {reference.additionalInfo && (
            <div className="reference-notes">
              <p><strong>Notes:</strong> {reference.additionalInfo}</p>
            </div>
          )}
        </div>

        <div className="status-message">
          <div className="message-content">
            <FontAwesomeIcon icon={faInfoCircle} className="message-icon" />
            <p>{getStatusMessage(reference.status)}</p>
          </div>
        </div>

        {reference.status === 'pending' && (
          <div className="polling-info">
            <FontAwesomeIcon icon={faClock} />
            <p>This page will automatically update when your reference responds.</p>
          </div>
        )}

        {(reference.status === 'verified' || reference.status === 'rejected') && (
          <div className="redirect-info">
            <FontAwesomeIcon icon={faEye} />
            <p>You will be redirected to your profile in a few seconds...</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="back-to-references-btn"
            onClick={() => navigate('/reference-verification')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to References
          </button>
          
          <button 
            className="view-profile-btn"
            onClick={() => navigate('/profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            View Profile
          </button>
        </div>

        <div className="verification-timeline">
          <h3>Verification Timeline</h3>
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-marker">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="timeline-content">
                <h4>Reference Added</h4>
                <p>You successfully added {reference.name} as a reference</p>
                <span className="timeline-time">
                  {new Date(reference.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className={`timeline-item ${reference.status === 'verified' ? 'completed' : reference.status === 'rejected' ? 'failed' : 'active'}`}>
              <div className="timeline-marker">
                {reference.status === 'verified' ? <FontAwesomeIcon icon={faCheckCircle} /> :
                 reference.status === 'rejected' ? <FontAwesomeIcon icon={faTimesCircle} /> :
                 <FontAwesomeIcon icon={faSpinner} className="spinning" />}
              </div>
              <div className="timeline-content">
                <h4>Email Sent & Awaiting Response</h4>
                <p>Verification email sent to {reference.email}</p>
                {reference.status === 'pending' && (
                  <span className="timeline-time">Waiting for response...</span>
                )}
                {reference.status === 'verified' && reference.verifiedAt && (
                  <span className="timeline-time">
                    Verified on {new Date(reference.verifiedAt).toLocaleString()}
                  </span>
                )}
                {reference.status === 'rejected' && reference.verifiedAt && (
                  <span className="timeline-time">
                    Declined on {new Date(reference.verifiedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {reference.status === 'verified' && (
              <div className="timeline-item completed">
                <div className="timeline-marker">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="timeline-content">
                  <h4>Verification Complete</h4>
                  <p>Your reference has been successfully verified!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerificationStatus;
