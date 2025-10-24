import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock, faArrowRight, faUsers, faBriefcase, faChartLine, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/FINAL LOGO AK.png';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
          // The login function in AuthContext will handle role-based routing
          await login(formData.email, formData.password);
          // No need to navigate here - AuthContext handles it based on role
        } catch (err) {
          setError(err.message || 'Login failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };

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

  const buttonVariants = {
    hover: {
      scale: 1.005,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.995
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
      title: "100% Verified",
      description: "All jobs and companies are verified"
    }
  ];

  return (
    <div className="login-container">
      <motion.div 
        className="login-layout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Why Choose AksharJobs */}
        <motion.div 
          className="login-left"
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
                    transition={{ delay: 0.7 + (index * 0.15), duration: 0.5 }}
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
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="login-right"
          variants={rightVariants}
        >
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="label-group">
                  <FontAwesomeIcon icon={faUser} className="form-label-icon" />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className={error ? 'error' : ''}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-group">
                  <FontAwesomeIcon icon={faLock} className="form-label-icon" />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                className="login-button"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    Sign In
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account? 
                <Link to="/signup" className="signup-link"> Sign up</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
