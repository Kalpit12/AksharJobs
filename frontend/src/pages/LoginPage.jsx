import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock,
  faArrowLeft,
  faUsers,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faLinkedin as faLinkedinBrand } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import { oauthApi } from '../api/oauthApi';
import '../styles/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [sessionMessage, setSessionMessage] = useState('');

  // Check for session expiry message
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'session_expired') {
      setSessionMessage('Your session has expired. Please log in again to continue.');
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear session message when user starts typing
    if (sessionMessage) {
      setSessionMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Connect to your MongoDB backend
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful - use the AuthContext
        login(data);
        // The AuthContext will handle navigation based on user role
      } else {
        setLoginError(data.error || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      let authUrl;
      
      if (provider === 'google') {
        authUrl = await oauthApi.getGoogleAuthUrl();
      } else if (provider === 'linkedin') {
        authUrl = await oauthApi.getLinkedInAuthUrl();
      } else {
        throw new Error('Unsupported provider');
      }
      
      if (authUrl) {
        // Redirect to OAuth provider
        window.location.href = authUrl;
      } else {
        throw new Error(`Failed to get ${provider} authentication URL`);
      }
      
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setLoginError(`${provider} login is not available at the moment. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login_wrapper">
      {/* Header */}
      <header className="login_header">
        <div className="header_container">
          <div className="logo_section">
            <div className="logo_icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <div className="logo_text">
              <div className="logo_title">RocketJobs</div>
              <div className="logo_subtitle">AI-Powered Job Matching</div>
            </div>
          </div>
          
          <div className="header_actions">
            <Link to="/" className="btn btn_secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="login_main">
        <div className="login_container">
          <div className="login_content">
            {/* Left Side - Form */}
            <div className="login_form_section">
              <div className="login_form_container">
                <div className="login_header_content">
                  <h1 className="login_title">Welcome Back!</h1>
                  <p className="login_subtitle">
                    Sign in to your RocketJobs account and continue your career journey
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="social_login_section">
                  <button 
                    className="social_login_btn google"
                    onClick={() => handleSocialLogin('google')}
                  >
                    <FontAwesomeIcon icon={faGoogleBrand} />
                    Continue with Google
                  </button>
                  <button 
                    className="social_login_btn linkedin"
                    onClick={() => handleSocialLogin('linkedin')}
                  >
                    <FontAwesomeIcon icon={faLinkedinBrand} />
                    Continue with LinkedIn
                  </button>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                {/* Login Form */}
                <form className="login_form" onSubmit={handleSubmit}>
                  {sessionMessage && (
                    <div className="session_message">
                      <FontAwesomeIcon icon={faClock} />
                      {sessionMessage}
                    </div>
                  )}
                  
                  {loginError && (
                    <div className="error_message">
                      {loginError}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="form_group">
                    <label htmlFor="email" className="form_label">
                      <FontAwesomeIcon icon={faEnvelope} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form_input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <span className="error_text">{errors.email}</span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="form_group">
                    <label htmlFor="password" className="form_label">
                      <FontAwesomeIcon icon={faLock} />
                      Password
                    </label>
                    <div className="password_input_wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className={`form_input ${errors.password ? 'error' : ''}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="password_toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && (
                      <span className="error_text">{errors.password}</span>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="form_options">
                    <label className="checkbox_label">
                      <input type="checkbox" className="checkbox_input" />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot_password">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="login_submit_btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading_spinner">
                        <div className="spinner"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="signup_prompt">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="signup_link">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="login_features_section">
              <div className="features_content">
                <h2 className="features_title">Why Choose RocketJobs?</h2>
                <div className="features_list">
                  <div className="feature_item">
                    <div className="feature_icon">
                      <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <div className="feature_text">
                      <h3>AI-Powered Matching</h3>
                      <p>Our advanced AI finds the perfect job matches for your skills and experience</p>
                    </div>
                  </div>
                  
                  <div className="feature_item">
                    <div className="feature_icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="feature_text">
                      <h3>Smart Notifications</h3>
                      <p>Get personalized job alerts and updates that match your preferences</p>
                    </div>
                  </div>
                  
                  <div className="feature_item">
                    <div className="feature_icon">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <div className="feature_text">
                      <h3>Secure & Private</h3>
                      <p>Your data is protected with enterprise-grade security and privacy controls</p>
                    </div>
                  </div>
                  
                  <div className="feature_item">
                    <div className="feature_icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="feature_text">
                      <h3>Culture Fit Matching</h3>
                      <p>Find companies that align with your values, work style, and career aspirations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

