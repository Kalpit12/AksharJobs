import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faShare, 
  faGift, 
  faUsers, 
  faClock,
  faCheckCircle,
  faTimesCircle,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import promoCodeApi from '../api/promoCodeApi';
import '../styles/PromoCodeCard.css';

const PromoCodeCard = ({ userType, onPromoCodeUsed }) => {
  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchPromoCode();
  }, []);

  const fetchPromoCode = async () => {
    try {
      setLoading(true);
      const response = await promoCodeApi.getMyPromoCode();
      
      if (response.success) {
        setPromoCode(response.promo_code);
      } else {
        // If no promo code exists, create one
        const userData = {
          firstName: localStorage.getItem('firstName') || '',
          lastName: localStorage.getItem('lastName') || '',
          userType: userType
        };
        
        const createResponse = await promoCodeApi.createPromoCode(userData);
        if (createResponse.success) {
          setPromoCode(createResponse.promo_code);
        } else {
          setError(createResponse.error || 'Failed to create promo code');
        }
      }
    } catch (err) {
      console.error('Error fetching promo code:', err);
      setError('Failed to load promo code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promoCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sharePromoCode = () => {
    const shareText = `🎉 Use my promo code "${promoCode.code}" on AksharJobs to get free services! 
    
For Job Seekers: Get 1 free job application
For Recruiters: Get 1 free job post + 5 free resume views

Sign up at AksharJobs and use this code to unlock premium features! 🚀`;

    if (navigator.share) {
      navigator.share({
        title: 'AksharJobs Promo Code',
        text: shareText,
        url: window.location.origin
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBenefitsText = () => {
    if (userType === 'jobSeeker') {
      return '1 free job application';
    } else if (userType === 'recruiter') {
      return '1 free job post + 5 free resume views';
    }
    return 'Premium benefits';
  };

  const getUsageStatus = () => {
    if (!promoCode) return null;
    
    const usagePercentage = (promoCode.usage_count / promoCode.max_uses) * 100;
    
    if (usagePercentage >= 100) {
      return { status: 'full', text: 'Fully Used', color: '#ef4444' };
    } else if (usagePercentage >= 80) {
      return { status: 'high', text: 'Almost Full', color: '#f59e0b' };
    } else if (usagePercentage >= 50) {
      return { status: 'medium', text: 'Half Used', color: '#3b82f6' };
    } else {
      return { status: 'low', text: 'Fresh', color: '#10b981' };
    }
  };

  if (loading) {
    return (
      <div className="promo-code-card loading">
        <div className="loading-spinner"></div>
        <p>Loading your promo code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promo-code-card error">
        <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />
        <p>{error}</p>
        <button onClick={fetchPromoCode} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!promoCode) {
    return (
      <div className="promo-code-card">
        <FontAwesomeIcon icon={faGift} className="gift-icon" />
        <h3>Get Your Promo Code</h3>
        <p>Create your unique promo code to share with others and earn benefits!</p>
        <button onClick={fetchPromoCode} className="create-btn">
          Create Promo Code
        </button>
      </div>
    );
  }

  const usageStatus = getUsageStatus();

  return (
    <div className="promo-code-card">
      <div className="promo-header">
        <FontAwesomeIcon icon={faRocket} className="rocket-icon" />
        <h3>Your Promo Code</h3>
        <div className={`usage-status ${usageStatus.status}`}>
          <span style={{ color: usageStatus.color }}>{usageStatus.text}</span>
        </div>
      </div>

      <div className="promo-code-display">
        <div className="code-container">
          <span className="promo-code">{promoCode.code}</span>
          <button 
            onClick={copyToClipboard} 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="promo-benefits">
        <h4>Benefits for others:</h4>
        <p className="benefits-text">{getBenefitsText()}</p>
      </div>

      <div className="promo-stats">
        <div className="stat-item">
          <FontAwesomeIcon icon={faUsers} />
          <span>{promoCode.usage_count} / {promoCode.max_uses} uses</span>
        </div>
        <div className="stat-item">
          <FontAwesomeIcon icon={faClock} />
          <span>Expires {new Date(promoCode.expires_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="promo-actions">
        <button onClick={sharePromoCode} className="share-btn">
          <FontAwesomeIcon icon={faShare} />
          Share Code
        </button>
        <button onClick={() => setShowShareModal(true)} className="details-btn">
          View Details
        </button>
      </div>

      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Promo Code</h3>
            <div className="share-content">
              <p>Copy this message to share your promo code:</p>
              <textarea 
                value={`🎉 Use my promo code "${promoCode.code}" on AksharJobs to get free services! 

For Job Seekers: Get 1 free job application
For Recruiters: Get 1 free job post + 5 free resume views

Sign up at AksharJobs and use this code to unlock premium features! 🚀`}
                readOnly
                className="share-text"
              />
              <div className="modal-actions">
                <button onClick={sharePromoCode} className="share-btn">
                  <FontAwesomeIcon icon={faShare} />
                  Share
                </button>
                <button onClick={() => setShowShareModal(false)} className="close-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeCard;
