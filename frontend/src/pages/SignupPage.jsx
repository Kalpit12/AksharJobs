import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock,
  faUser,
  faPhone,
  faBuilding,
  faArrowLeft,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faLinkedin as faLinkedinBrand } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import { oauthApi } from '../api/oauthApi';
import '../styles/Signup.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'jobSeeker',
    company: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  // Verification will be implemented later with real email/SMS services

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Company validation for recruiters
    if (formData.accountType === 'recruiter' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for recruiters';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Connect to your MongoDB backend for signup
      const requestBody = {
        userType: formData.accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        companyName: formData.accountType === 'recruiter' ? formData.company : ''
      };
      
      console.log('Sending signup request:', requestBody);
      
      const response = await fetch(buildApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Signup response:', response.status, data);

      if (response.ok) {
        // Account created successfully - redirect to login
        setSignupError('');
        alert('Account created successfully! Please check your email for verification and then login.');
        navigate('/login');
      } else {
        console.error('Signup failed:', data);
        setSignupError(data.error || 'Failed to create account. Please try again.');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      setIsLoading(true);
      setSignupError('');
      
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
      console.error(`${provider} signup error:`, error);
      setSignupError(`${provider} signup is not available at the moment. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <form className="signup_form" onSubmit={handleSubmit}>
      {signupError && (
        <div className="error_message">
          {signupError}
        </div>
      )}

      {/* Name Fields */}
      <div className="form_row">
        <div className="form_group">
          <label htmlFor="firstName" className="form_label">
            <FontAwesomeIcon icon={faUser} />
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form_input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <span className="error_text">{errors.firstName}</span>
          )}
        </div>

        <div className="form_group">
          <label htmlFor="lastName" className="form_label">
            <FontAwesomeIcon icon={faUser} />
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form_input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <span className="error_text">{errors.lastName}</span>
          )}
        </div>
      </div>

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

      {/* Phone Field */}
      <div className="form_group">
        <label htmlFor="phone" className="form_label">
          <FontAwesomeIcon icon={faPhone} />
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`form_input ${errors.phone ? 'error' : ''}`}
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {errors.phone && (
          <span className="error_text">{errors.phone}</span>
        )}
      </div>

      {/* Account Type Selection */}
      <div className="form_group">
        <label className="form_label">Account Type</label>
        <div className="account_type_selector">
          <label className="account_type_option">
            <input
              type="radio"
              name="accountType"
              value="jobSeeker"
              checked={formData.accountType === 'jobSeeker'}
              onChange={handleInputChange}
            />
            <span className="option_content">
              <div className="option_icon">👤</div>
              <div className="option_text">
                <h4>Job Seeker</h4>
                <p>Find your dream job with AI-powered matching</p>
              </div>
            </span>
          </label>

          <label className="account_type_option">
            <input
              type="radio"
              name="accountType"
              value="recruiter"
              checked={formData.accountType === 'recruiter'}
              onChange={handleInputChange}
            />
            <span className="option_content">
              <div className="option_icon">🏢</div>
              <div className="option_text">
                <h4>Recruiter</h4>
                <p>Find top talent for your organization</p>
              </div>
            </span>
          </label>
        </div>
      </div>

      {/* Company Field (for recruiters) */}
      {formData.accountType === 'recruiter' && (
        <div className="form_group">
          <label htmlFor="company" className="form_label">
            <FontAwesomeIcon icon={faBuilding} />
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className={`form_input ${errors.company ? 'error' : ''}`}
            placeholder="Enter your company name"
            value={formData.company}
            onChange={handleInputChange}
          />
          {errors.company && (
            <span className="error_text">{errors.company}</span>
          )}
        </div>
      )}

      {/* Password Fields */}
      <div className="form_row">
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
              placeholder="Create a strong password"
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

        <div className="form_group">
          <label htmlFor="confirmPassword" className="form_label">
            <FontAwesomeIcon icon={faLock} />
            Confirm Password
          </label>
          <div className="password_input_wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className={`form_input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="password_toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error_text">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="form_group">
        <label className="checkbox_label terms_checkbox">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="checkbox_input"
          />
          <span className="checkmark"></span>
          I agree to the{' '}
          <Link to="/terms" className="terms_link">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="terms_link">Privacy Policy</Link>
        </label>
        {errors.agreeToTerms && (
          <span className="error_text">{errors.agreeToTerms}</span>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="signup_submit_btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loading_spinner">
            <div className="spinner"></div>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );

  // Verification components will be implemented later

  return (
    <div className="signup_wrapper">
      {/* Header */}
      <header className="signup_header">
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
      <main className="signup_main">
        <div className="signup_container">
          <div className="signup_content">
            {/* Left Side - Form/Verification */}
            <div className="signup_form_section">
              <div className="signup_form_container">
                                 <div className="signup_header_content">
                   <h1 className="signup_title">Join RocketJobs</h1>
                   <p className="signup_subtitle">
                     Create your account and start your career journey with AI-powered job matching
                   </p>
                 </div>

                 {/* Social Signup Buttons */}
                 <div className="social_signup_section">
                   <button 
                     className="social_signup_btn google"
                     onClick={() => handleSocialSignup('google')}
                   >
                     <FontAwesomeIcon icon={faGoogleBrand} />
                     Continue with Google
                   </button>
                   <button 
                     className="social_signup_btn linkedin"
                     onClick={() => handleSocialSignup('linkedin')}
                   >
                     <FontAwesomeIcon icon={faLinkedinBrand} />
                     Continue with LinkedIn
                   </button>
                 </div>

                 <div className="divider">
                   <span>or</span>
                 </div>

                 {renderForm()}

                 {/* Sign In Link */}
                 <div className="signin_prompt">
                   <p>
                     Already have an account?{' '}
                     <Link to="/login" className="signin_link">
                       Sign in here
                     </Link>
                   </p>
                 </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="signup_features_section">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
