import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faEye, 
  faEyeSlash,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await fetch(buildApiUrl(`/api/auth/validate-reset-token?token=${token}`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
          setMessage('Token validated. Please enter your new password.');
        } else {
          setError(data.message || 'Invalid or expired reset token');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setError('Failed to validate reset token');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`At least ${minLength} characters`);
    }
    if (!hasUpperCase) {
      errors.push('One uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('One lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('One number');
    }
    if (!hasSpecialChar) {
      errors.push('One special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(`Password must contain: ${passwordValidation.errors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || 'Password updated successfully!');
        setError('');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password updated successfully! Please log in with your new password.' 
            } 
          });
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isValidatingToken) {
    return (
      <div className="reset-password-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
          <p>Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-wrapper">
        <div className="error-container">
          <div className="error-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </div>
          <h2>Invalid Reset Link</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="btn btn-primary"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-wrapper">
      {/* Header */}
      <header className="reset-password-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/AK_logo.png" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <div className="logo-title">AksharJobs</div>
              <div className="logo-subtitle">Set New Password</div>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-secondary"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="reset-password-main">
        <div className="reset-password-container">
          <div className="reset-password-card">
            
            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Set your new password</h1>
              <p className="form-subtitle">
                Your new password must be different from previously used passwords.
              </p>
              {email && (
                <p className="email-info">
                  Resetting password for: <strong>{email}</strong>
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className="form-content">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="reset-password-form">
                  
                  {/* New Password Input */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faLock} />
                      New Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                        disabled={isLoading}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    <div className="password-requirements">
                      <p>Password must contain:</p>
                      <ul>
                        <li className={formData.password.length >= 8 ? 'valid' : ''}>
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                          One lowercase letter
                        </li>
                        <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                          One number
                        </li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : ''}>
                          One special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faLock} />
                      Confirm New Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Confirm your new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="password-toggle"
                        disabled={isLoading}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <div className={`password-match ${formData.password === formData.confirmPassword ? 'valid' : 'invalid'}`}>
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            Passwords do not match
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="error-message">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {message && !isSuccess && (
                    <div className="info-message">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !formData.password || !formData.confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              ) : (
                <div className="success-content">
                  <div className="success-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <h2 className="success-title">Password Updated Successfully!</h2>
                  <p className="success-message">{message}</p>
                  
                  <div className="success-details">
                    <p>Your password has been updated successfully. You will be redirected to the login page shortly.</p>
                  </div>

                  <div className="success-actions">
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-primary"
                    >
                      Go to Login
                    </button>
                  </div>

                  <div className="countdown">
                    <p>Redirecting in <span id="countdown">3</span> seconds...</p>
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
                Your account security is our priority.
              </h2>
              
              <p className="promotional-description">
                We use industry-standard security measures to protect your account and personal information.
              </p>
              
              <div className="security-features">
                <div className="feature">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">End-to-end encryption</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-text">Secure password storage</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">✅</div>
                  <div className="feature-text">Two-factor authentication</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
