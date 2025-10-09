import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGift, 
  faCheckCircle, 
  faTimesCircle, 
  faRocket,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import promoCodeApi from '../api/promoCodeApi';
import '../styles/UsePromoCode.css';

const UsePromoCode = ({ userType, onPromoCodeUsed }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage('Please enter a promo code');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await promoCodeApi.usePromoCode(code.trim().toUpperCase(), userType);
      
      if (response.success) {
        setMessage(response.message);
        setMessageType('success');
        setCode('');
        
        // Notify parent component
        if (onPromoCodeUsed) {
          onPromoCodeUsed(response.benefits);
        }
        
        // Close modal after success
        setTimeout(() => {
          setShowModal(false);
          setMessage('');
        }, 3000);
      } else {
        setMessage(response.error || 'Failed to use promo code');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error using promo code:', error);
      setMessage('Failed to use promo code. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (codeValue) => {
    if (codeValue.length < 6) return;
    
    try {
      const response = await promoCodeApi.validatePromoCode(codeValue);
      if (response.success) {
        setMessage(`Valid code from ${response.owner_name}. Benefits: ${response.benefits[userType]?.description || 'Premium benefits'}`);
        setMessageType('info');
      } else {
        setMessage(response.error);
        setMessageType('error');
      }
    } catch (error) {
      // Silently handle validation errors
    }
  };

  const getBenefitsText = () => {
    if (userType === 'jobSeeker') {
      return 'Get 1 free job application';
    } else if (userType === 'recruiter') {
      return 'Get 1 free job post + 5 free resume views';
    }
    return 'Get premium benefits';
  };

  const PromoCodeModal = () => {
    if (!showModal) return null;

    return (
      <div className="promo-modal-overlay" onClick={() => setShowModal(false)}>
        <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
          <div className="promo-modal-header">
            <FontAwesomeIcon icon={faGift} className="gift-icon" />
            <h3>Use Promo Code</h3>
            <button 
              className="close-btn" 
              onClick={() => setShowModal(false)}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>

          <div className="promo-modal-content">
            <p className="benefits-text">{getBenefitsText()}</p>
            
            <form onSubmit={handleSubmit} className="promo-form">
              <div className="input-group">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    validateCode(e.target.value);
                  }}
                  placeholder="Enter promo code"
                  className="promo-input"
                  maxLength="20"
                />
                <button 
                  type="submit" 
                  className="use-btn"
                  disabled={loading || !code.trim()}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRocket} />
                      Use Code
                    </>
                  )}
                </button>
              </div>
            </form>

            {message && (
              <div className={`message ${messageType}`}>
                <FontAwesomeIcon 
                  icon={messageType === 'success' ? faCheckCircle : faTimesCircle} 
                />
                <span>{message}</span>
              </div>
            )}

            <div className="promo-tips">
              <h4>How to get promo codes:</h4>
              <ul>
                <li>Ask friends who are already on AksharJobs</li>
                <li>Share your own promo code to earn benefits</li>
                <li>Follow us on social media for special codes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button 
        className="use-promo-btn"
        onClick={() => setShowModal(true)}
      >
        <FontAwesomeIcon icon={faGift} />
        Use Promo Code
      </button>
      
      <PromoCodeModal />
    </>
  );
};

export default UsePromoCode;
