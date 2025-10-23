import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faEnvelope, 
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faShieldAlt,
  faUsers,
  faBriefcase,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import logoImage from '../assets/FINAL LOGO AK.png';
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

  const benefits = [
    {
      icon: faUsers,
      title: "50,000+ Active Jobs",
      description: "Find opportunities across all industries"
    },
    {
      icon: faBriefcase,
      title: "10,000+ Companies",
      description: "Connect with top employers worldwide"
    },
    {
      icon: faChartLine,
      title: "2M+ Job Seekers",
      description: "Join our thriving professional community"
    },
    {
      icon: faShieldAlt,
      title: "100% Secure",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.4
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <motion.div 
        className="forgot-password-layout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Benefits & Info */}
        <motion.div 
          className="forgot-password-left"
          variants={leftVariants}
        >
          <div className="left-content">
            <div className="logo-section">
              <img src={logoImage} alt="AksharJobs Logo" className="main-logo" />
              <h1>AksharJobs</h1>
              <p className="tagline">CONNECT | DISCOVER | ELEVATE</p>
            </div>

            <div className="benefits-section">
              <h2>Why Choose AksharJobs?</h2>
              <div className="benefits-grid">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="benefit-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    <div className="benefit-icon">
                      <FontAwesomeIcon icon={benefit.icon} />
                    </div>
                    <div className="benefit-content">
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="security-note">
              <div className="security-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div className="security-text">
                <h3>Secure Password Reset</h3>
                <p>Your password reset is protected with industry-standard encryption and security measures.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Reset Form */}
        <motion.div 
          className="forgot-password-right"
          variants={rightVariants}
        >
          <div className="reset-card">
            <div className="reset-header">
              <Link to="/login" className="back-link">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Login
              </Link>
              <h2>Reset Your Password</h2>
              <p>Enter your email address and we'll send you a secure link to reset your password.</p>
            </div>

            <div className="reset-content">
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="reset-form">
                  <div className="form-group">
                    <div className="label-group">
                      <FontAwesomeIcon icon={faEnvelope} className="form-label-icon" />
                      <label htmlFor="email">Email Address</label>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        placeholder="your@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="reset-button"
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

                  <div className="help-text">
                    <p>We'll send you a secure link to reset your password. Check your email inbox and spam folder.</p>
                  </div>
                </form>
              ) : (
                <div className="success-content">
                  <div className="success-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <h3>Email Sent Successfully!</h3>
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
