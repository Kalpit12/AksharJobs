import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faEnvelope, 
  faSpinner,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(buildApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        setMessage(data.message || 'Password reset email sent successfully!');
        setError('');
      } else {
        setError(data.message || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      {/* Header */}
      <header className="forgot-password-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <div className="logo-title">AksharJobs</div>
              <div className="logo-subtitle">Reset Your Password</div>
            </div>
          </div>
          
          <div className="header-actions">
            <Link to="/login" className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="forgot-password-main">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            
            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Reset your password</h1>
              <p className="form-subtitle">
                Your new password must be different from previously used passwords.
              </p>
            </div>

            {/* Form Content */}
            <div className="form-content">
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="forgot-password-form">
                  
                  {/* Email Input */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faEnvelope} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="error-message">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Sending Reset Email...
                      </>
                    ) : (
                      'Send Reset Email'
                    )}
                  </button>

                  {/* Additional Help */}
                  <div className="help-text">
                    <p>Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                  </div>
                </form>
              ) : (
                <div className="success-content">
                  <div className="success-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <h2 className="success-title">Email Sent Successfully!</h2>
                  <p className="success-message">{message}</p>
                  
                  <div className="success-details">
                    <p>Please check your email inbox and follow the instructions to reset your password.</p>
                    <p className="email-note">Email sent to: <strong>{email}</strong></p>
                  </div>

                  <div className="success-actions">
                    <button
                      onClick={() => {
                        setIsEmailSent(false);
                        setEmail('');
                        setMessage('');
                      }}
                      className="btn btn-secondary"
                    >
                      Send to Different Email
                    </button>
                    <Link to="/login" className="btn btn-primary">
                      Back to Login
                    </Link>
                  </div>

                  <div className="help-text">
                    <p>Didn't receive the email? Check your spam folder or try again.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Promotional Content */}
          <div className="promotional-section">
            <div className="promotional-content">
              <div className="promotional-logo">
                <img src="/AK_logo.jpg" alt="AksharJobs" />
                <span>AksharJobs</span>
              </div>
              
              <h2 className="promotional-title">
                Explore the world's leading job opportunities.
              </h2>
              
              <p className="promotional-description">
                Millions of job seekers and employers around the world connect through AksharJobs - the platform where talent meets opportunity.
              </p>
              
              <div className="stats-section">
                <div className="stats-avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                <div className="stats-text">
                  Rated Best Over <strong>15.7k</strong> Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
