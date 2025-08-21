import React, { useState } from 'react';
import '../styles/PhoneVerification.css';

const PhoneVerification = ({ onVerificationComplete, isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Verification code sent successfully!');
        setStep('code');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          verificationCode,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Phone number verified successfully!');
        setTimeout(() => {
          onVerificationComplete(phoneNumber);
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setStep('phone');
    setVerificationCode('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="phone-verification-overlay">
      <div className="phone-verification-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="verification-header">
          <h2>Phone Verification</h2>
          <p>Verify your phone number to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="verification-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number (e.g., +254735560563)"
                required
                pattern="^\+?[0-9\s\-\(\)]+$"
              />
              <small>Format: +254735560563 (Kenya) or +1234567890</small>
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading || !phoneNumber.trim()}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="verification-form">
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength="6"
                pattern="[0-9]{6}"
              />
              <small>Enter the 6-digit code sent to {phoneNumber}</small>
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button 
                type="button" 
                className="resend-button" 
                onClick={handleResendCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
