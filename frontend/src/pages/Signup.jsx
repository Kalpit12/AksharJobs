import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, faEyeSlash, faUser, faLock, faEnvelope, faArrowRight,
  faCheck, faTimes, faBriefcase, faGraduationCap, faUserTie,
  faBuilding, faUsers, faShieldAlt, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/FINAL LOGO AK.png';
import PhoneInput from '../components/PhoneInput';
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'jobSeeker', // Set default role
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'jobSeeker', label: 'Job Seeker', icon: faUser, description: 'Looking for job opportunities' },
    { value: 'intern', label: 'Intern', icon: faGraduationCap, description: 'Seeking internship positions' },
    { value: 'recruiter', label: 'Recruiter', icon: faUserTie, description: 'Hiring talent for companies' }
  ];

  const benefits = [
    { icon: faBriefcase, title: '50,000+ Active Jobs', description: 'Find opportunities across all industries' },
    { icon: faBuilding, title: '10,000+ Companies', description: 'Connect with top employers worldwide' },
    { icon: faUsers, title: '2M+ Job Seekers', description: 'Join our thriving professional community' },
    { icon: faShieldAlt, title: '100% Verified', description: 'All jobs and companies are verified for authenticity' },
  ];

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please strengthen your password.');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

        try {
          // The signup function in AuthContext will handle role-based routing
          await signup({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password,
            userType: formData.role
          });
          // No need to navigate here - AuthContext handles it based on role
        } catch (err) {
          const errorMessage = err.message || 'Signup failed. Please try again.';
          if (errorMessage.toLowerCase().includes('already exists')) {
            setError('This email is already registered. Please login or use a different email.');
          } else {
            setError(errorMessage);
          }
        } finally {
          setLoading(false);
        }
  };

  const getStrengthColor = (score) => {
    if (score < 2) return '#e53e3e';
    if (score < 4) return '#dd6b20';
    return '#38a169';
  };

  const getStrengthText = (score) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="signup-layout">
        <motion.div 
          className="signup-left"
          variants={leftVariants}
          initial="hidden"
          animate="visible"
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
                    transition={{ delay: 0.8 + index * 0.1 }}
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

            <motion.div 
              className="testimonial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="quote">
                <p>"AksharJobs helped me land my dream job in just two weeks! The platform is intuitive, and the job matching is spot on."</p>
              </div>
              <div className="author">
                <span className="name">Jane Doe</span>
                <span className="role">Senior Software Engineer at TechCorp</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="signup-right"
          variants={rightVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="signup-card"
            variants={formVariants}
          >
            <div className="signup-header">
              <h2>Create Your Account</h2>
              <p>Join thousands of professionals finding their dream careers</p>
            </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="label-group">
                  <FontAwesomeIcon icon={faUser} className="form-label-icon" />
                  <label htmlFor="firstName">First Name</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="label-group">
                  <FontAwesomeIcon icon={faUser} className="form-label-icon" />
                  <label htmlFor="lastName">Last Name</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="label-group">
                <FontAwesomeIcon icon={faEnvelope} className="form-label-icon" />
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
                />
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
            >
              <div className="label-group">
                <FontAwesomeIcon icon={faPhone} className="form-label-icon" />
                <label htmlFor="phone">Phone Number</label>
              </div>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="234 567 8900"
                required
              />
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="role-label-text">I am a:</div>
              <div className="role-selection">
                {roleOptions.map((role) => (
                  <label 
                    key={role.value} 
                    className="role-option"
                    onClick={() => {
                      setFormData({...formData, role: role.value});
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="role-card">
                      <FontAwesomeIcon icon={role.icon} className="role-icon" />
                      <div className="role-info">
                        <span className="role-label">{role.label}</span>
                        <span className="role-description">{role.description}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
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
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              
              {formData.password && (
                <motion.div 
                  className="password-strength"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getStrengthColor(passwordStrength.score)
                      }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span className="strength-text">
                      Password Strength: <strong style={{ color: getStrengthColor(passwordStrength.score) }}>
                        {getStrengthText(passwordStrength.score)}
                      </strong>
                    </span>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="strength-requirements">
                        {passwordStrength.feedback.map((req, index) => (
                          <span key={index} className="requirement">
                            <FontAwesomeIcon icon={faTimes} className="requirement-icon" />
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                    {passwordStrength.score >= 3 && (
                      <div className="strength-success">
                        <FontAwesomeIcon icon={faCheck} className="success-icon" />
                        Great! Your password is strong enough.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="label-group">
                <FontAwesomeIcon icon={faLock} className="form-label-icon" />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="password-mismatch">
                  <FontAwesomeIcon icon={faTimes} />
                  Passwords do not match
                </div>
              )}
            </motion.div>

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

            <motion.div 
              className="form-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className="signup-button"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  Create Account
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </motion.button>
          </form>

            <motion.div 
              className="signup-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <p>
                Already have an account? 
                <Link to="/login" className="login-link"> Sign in</Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
