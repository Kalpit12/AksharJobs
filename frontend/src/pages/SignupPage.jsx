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
import { FadeInUp, SlideIn, ScaleIn, StaggerChildren } from '../components/animations';
import { motion } from 'framer-motion';
import CommunitySelector from '../components/CommunitySelector';
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
    communities: [],
    primaryCommunity: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  // Verification will be implemented later with real email/SMS services

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /(?=.*[a-z])/.test(password),
      uppercase: /(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)
    };
    
    Object.values(checks).forEach(check => {
      if (check) score++;
    });
    
    if (score <= 2) return { strength: 'Weak', color: '#ef4444', width: '20%' };
    if (score <= 3) return { strength: 'Fair', color: '#f59e0b', width: '40%' };
    if (score <= 4) return { strength: 'Good', color: '#3b82f6', width: '60%' };
    return { strength: 'Strong', color: '#10b981', width: '100%' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

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

  const handleCommunityChange = (selectedCommunities) => {
    setFormData(prev => ({
      ...prev,
      communities: selectedCommunities,
      primaryCommunity: selectedCommunities.length > 0 ? selectedCommunities[0] : ''
    }));
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
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

    // Community validation
    if (!formData.communities || formData.communities.length === 0) {
      newErrors.communities = 'Please select at least one community';
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
        companyName: formData.accountType === 'recruiter' ? formData.company : '',
        communities: formData.communities,
        primary_community: formData.primaryCommunity
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
        // Account created successfully
        setSignupError('');
        
        if (formData.accountType === 'recruiter') {
          // For recruiters, store the token and redirect to comprehensive recruiter registration form
          if (data.token) {
            // Store authentication data
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userFirstName', data.firstName);
            localStorage.setItem('userLastName', data.lastName);
          }
          
          navigate('/recruiter-registration', { 
            state: { 
              userData: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                companyName: formData.company
              }
            } 
          });
        } else if (formData.accountType === 'intern') {
          // For interns, store the token and redirect directly to intern dashboard
          if (data.token) {
            // Store authentication data
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userFirstName', data.firstName);
            localStorage.setItem('userLastName', data.lastName);
          }
          
          navigate('/intern-dashboard', { 
            state: { 
              userData: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                userId: data.userId
              }
            } 
          });
        } else {
          // For job seekers, store token and redirect to comprehensive registration form
          if (data.token) {
            // Store authentication data
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userFirstName', data.firstName);
            localStorage.setItem('userLastName', data.lastName);
          }
          
          navigate('/jobseeker-registration', { 
            state: { 
              userData: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                userId: data.userId
              }
            } 
          });
        }
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
    <FadeInUp delay={0.4}>
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

          <label className="account_type_option">
            <input
              type="radio"
              name="accountType"
              value="intern"
              checked={formData.accountType === 'intern'}
              onChange={handleInputChange}
            />
            <span className="option_content">
              <div className="option_icon">🎓</div>
              <div className="option_text">
                <h4>Intern</h4>
                <p>Start your career journey with internship opportunities</p>
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

      {/* Community Selection */}
      <div className="form_row">
        <div className="form_group">
                <CommunitySelector
                    selectedCommunities={formData.communities}
                    onSelectionChange={handleCommunityChange}
                    multiple={true}
                    showDescription={false}
                    placeholder="Select your communities..."
                    className={`compact ${errors.communities ? 'error' : ''}`}
                />
          {errors.communities && (
            <span className="error_text">{errors.communities}</span>
          )}
          <div className="form_help_text">
            <span className="help_icon">💡</span>
            <span>Select your religious/ethnic community. After signup, a verification email will be sent to community leaders for approval.</span>
          </div>
        </div>
      </div>

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
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => {
                // Keep requirements visible if there's an error or if password is being typed
                if (!errors.password && formData.password.length === 0) {
                  setShowPasswordRequirements(false);
                }
              }}
            />
            <button
              type="button"
              className="password_toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          
          {/* Password Feedback Box - Only show when focused or has content */}
          {showPasswordRequirements && (
            <div className="password_feedback_box">
              <h4 className="password_strength_title" style={{ color: passwordStrength.color }}>
                {passwordStrength.strength}
              </h4>
              <div className="strength_bar">
                <div 
                  className="strength_fill" 
                  style={{ 
                    width: passwordStrength.width, 
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
              </div>
              
              <ul className="requirements_list">
                <li className={`requirement_item ${formData.password.length >= 8 ? 'valid' : ''}`}>
                  <FontAwesomeIcon icon={formData.password.length >= 8 ? faCheck : faTimes} />
                  Is at least 8 characters long
                </li>
                <li className={`requirement_item ${/(?=.*[a-z])/.test(formData.password) ? 'valid' : ''}`}>
                  <FontAwesomeIcon icon={/(?=.*[a-z])/.test(formData.password) ? faCheck : faTimes} />
                  Contains a lowercase letter (a-z)
                </li>
                <li className={`requirement_item ${/(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}`}>
                  <FontAwesomeIcon icon={/(?=.*[A-Z])/.test(formData.password) ? faCheck : faTimes} />
                  Contains an uppercase letter (A-Z)
                </li>
                <li className={`requirement_item ${/(?=.*\d)/.test(formData.password) ? 'valid' : ''}`}>
                  <FontAwesomeIcon icon={/(?=.*\d)/.test(formData.password) ? faCheck : faTimes} />
                  Contains a number (0-9)
                </li>
                <li className={`requirement_item ${/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? 'valid' : ''}`}>
                  <FontAwesomeIcon icon={/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? faCheck : faTimes} />
                  Contains a special character (!, @, #, etc.)
                </li>
              </ul>
            </div>
          )}
          
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
      <motion.button 
        type="submit" 
        className="signup_submit_btn"
        disabled={isLoading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="loading_spinner">
            <div className="spinner"></div>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </motion.button>
    </form>
    </FadeInUp>
  );

  // Verification components will be implemented later

  return (
    <div className="signup_wrapper">
      {/* Header */}
      <header className="signup_header">
        <div className="header_container">
          <div className="logo_section">
            <div className="logo_icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }} />
              <FontAwesomeIcon icon={faRocket} style={{ display: 'none' }} />
            </div>
            <div className="logo_text">
              <div className="logo_title">AksharJobs</div>
              <div className="logo_subtitle">Where Opportunity Meets Talent</div>
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
              <SlideIn direction="left" delay={0.2}>
                <div className="signup_form_container">
                  <FadeInUp>
                    <div className="signup_header_content">
                      <h1 className="signup_title">Join AksharJobs</h1>
                      <p className="signup_subtitle">
                        Create your account and start your career journey with AI-powered job matching
                      </p>
                    </div>
                  </FadeInUp>

                 {/* Social Signup Buttons */}
                 <StaggerChildren staggerDelay={0.1}>
                   <motion.button 
                     className="social_signup_btn google"
                     onClick={() => handleSocialSignup('google')}
                     whileHover={{ scale: 1.02, y: -2 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <FontAwesomeIcon icon={faGoogleBrand} />
                     Continue with Google
                   </motion.button>
                   <motion.button 
                     className="social_signup_btn linkedin"
                     onClick={() => handleSocialSignup('linkedin')}
                     whileHover={{ scale: 1.02, y: -2 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <FontAwesomeIcon icon={faLinkedinBrand} />
                     Continue with LinkedIn
                   </motion.button>
                 </StaggerChildren>

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
               </SlideIn>
            </div>

            {/* Right Side - Features */}
            <SlideIn direction="right" delay={0.3}>
              <div className="signup_features_section">
                <div className="features_content">
                  <FadeInUp>
                    <h2 className="features_title">Why Choose AksharJobs?</h2>
                  </FadeInUp>
                  <StaggerChildren staggerDelay={0.15}>
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
                  </StaggerChildren>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
