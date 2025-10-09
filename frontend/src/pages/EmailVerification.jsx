import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/EmailVerification.css';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get user data from location state (passed from signup)
    if (location.state) {
      setEmail(location.state.email || '');
      setUserName(location.state.userName || '');
    }
  }, [location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setVerificationCode(value);
    setError('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(buildApiUrl('/api/email-verification/verify_code'), {
        email: email,
        code: verificationCode
      });

      if (response.data.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        
        // Send community verification if user has communities
        if (location.state?.communities && location.state.communities.length > 0) {
          try {
            await axios.post(buildApiUrl('/api/community-verification/send_verification'), {
              userId: response.data.userId
            });
            console.log('Community verification email sent');
          } catch (communityError) {
            console.error('Error sending community verification:', communityError);
          }
        }
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! Please login to continue.',
              verifiedEmail: email
            }
          });
        }, 2000);
      } else {
        setError(response.data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.error || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post(buildApiUrl('/api/email-verification/resend_code'), {
        userId: location.state?.userId,
        email: email,
        userName: userName
      });

      if (response.data.success) {
        setSuccess('New verification code sent to your email!');
        setCountdown(60); // 60 seconds countdown
        setVerificationCode(''); // Clear the input
      } else {
        setError(response.data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError(error.response?.data?.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <div className="logo-section">
            <h1>🚀 AksharJobs</h1>
            <p>Kenya's Premier Job Platform</p>
          </div>
          <h2>📧 Verify Your Email</h2>
          <p className="verification-subtitle">
            We've sent a 6-digit verification code to:
          </p>
          <div className="email-display">{email}</div>
        </div>

        <form onSubmit={handleVerify} className="verification-form">
          <div className="form-group">
            <label htmlFor="verificationCode">Enter Verification Code</label>
            <div className="code-input-container">
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="000000"
                className={`code-input ${error ? 'error' : ''}`}
                maxLength="6"
                autoComplete="off"
                required
              />
              <div className="code-input-help">
                Enter the 6-digit code from your email
              </div>
            </div>
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

          <div className="form-actions">
            <button
              type="submit"
              className="verify-button"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>
        </form>

        <div className="verification-footer">
          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              className="resend-button"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          <div className="back-section">
            <button
              type="button"
              className="back-button"
              onClick={handleBackToSignup}
            >
              ← Back to Signup
            </button>
          </div>
        </div>

        <div className="verification-info">
          <h4>ℹ️ Verification Process</h4>
          <ul>
            <li>Check your email inbox (and spam folder)</li>
            <li>Enter the 6-digit code exactly as shown</li>
            <li>Code expires in 15 minutes</li>
            <li>After verification, you'll be redirected to login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
