import React, { useState } from 'react';
import '../styles/EmailVerification.css';

const EmailVerification = ({ isOpen, onClose, onVerificationComplete }) => {
  const [step, setStep] = useState(1); // 1: email input, 2: code verification
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/send-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification code sent to your email!');
        setMessageType('success');
        setStep(2);
        startCountdown();
      } else {
        setMessage(data.error || 'Failed to send verification code');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage('Please enter the 6-digit verification code');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email verified successfully!');
        setMessageType('success');
        setTimeout(() => {
          onVerificationComplete(email);
          onClose();
        }, 1500);
      } else {
        setMessage(data.error || 'Verification failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/resend-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New verification code sent!');
        setMessageType('success');
        startCountdown();
      } else {
        setMessage(data.error || 'Failed to resend code');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setVerificationCode('');
    setMessage('');
    setMessageType('');
    setCountdown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="email-verification-overlay">
      <div className="email-verification-modal">
        <div className="modal-header">
          <h2>📧 Email Verification</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        {step === 1 ? (
          <div className="email-input-step">
            <p>Enter your email address to receive a verification code:</p>
            
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>

            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}

            <div className="button-group">
              <button
                className="send-code-btn"
                onClick={handleSendCode}
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
              <button className="cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="code-verification-step">
            <p>Enter the 6-digit verification code sent to:</p>
            <p className="email-display">{email}</p>
            
            <div className="input-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}

            <div className="button-group">
              <button
                className="verify-btn"
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                className="resend-btn"
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <button className="back-btn" onClick={() => setStep(1)}>
              ← Back to Email Input
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
