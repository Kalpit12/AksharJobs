import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/Signup.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "jobSeeker",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    linkedInProfile: "",
    companyName: "",
    companyWebsite: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Trigger entrance animation with delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setSelectedFile(file.name);
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be 8-12 characters long, include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."
      );
      return;
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append("profileImage", image);
      }

      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/signup",
        formDataToSend,
        
      );

      if (response.status === 201) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Background decorative elements */}
      <div className="background-shapes">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
      </div>

      <div className={`signup-container ${isVisible ? 'visible' : ''}`}>
        {/* Left Panel - Welcome Section */}
        <div className="signup-left">
          <div className="welcome-content">
            <div className="welcome-icon-container">
              <div className="rocketjobs-logo">
                <img 
                  src="/RocketJobs_Logo.jpg" 
                  alt="RocketJobs Logo" 
                  width="120" 
                  height="120"
                />
              </div>
            </div>
            
            <h1 className="welcome-title">Welcome to RocketJobs</h1>
            <p className="welcome-subtitle">Already have an account?</p>
            
            <Link to="/login" className="login-btn">
              <span className="btn-text">Login</span>
              <span className="btn-icon">→</span>
            </Link>
          </div>
          
          <div className="features-list">
            <h3>Why Join Us?</h3>
            <ul>
              <li>
                <span className="feature-icon">🚀</span>
                <span className="feature-text">AI-powered job matching</span>
              </li>
              <li>
                <span className="feature-icon">📝</span>
                <span className="feature-text">Personalized resume review</span>
              </li>
              <li>
                <span className="feature-icon">🤝</span>
                <span className="feature-text">Connect with top recruiters instantly</span>
              </li>
              <li>
                <span className="feature-icon">💼</span>
                <span className="feature-text">Advanced career insights</span>
              </li>
              <li>
                <span className="feature-icon">🎯</span>
                <span className="feature-text">Smart job recommendations</span>
              </li>
            </ul>
          </div>
          
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="signup-right">
          <div className="form-header">
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-subtitle">Find your dream job or hire top talent effortlessly.</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="input-group">
                <label className="form-label">User Type</label>
                <div className="select-wrapper">
                  <select 
                    name="userType" 
                    value={formData.userType} 
                    onChange={handleChange}
                    className="user-type-select"
                  >
                    <option value="jobSeeker">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">
                  {formData.userType === "jobSeeker" ? "Profile Picture" : "Company Logo"}
                </label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="profileImage" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="file-input"
                    id="profile-image"
                  />
                  <label htmlFor="profile-image" className="file-input-label">
                    <span className="file-text">
                      {selectedFile ? selectedFile : "Choose file"}
                    </span>
                    <span className="file-upload-icon">↑</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">First Name</label>
                <div className={`input-wrapper ${focusedField === 'firstName' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('firstName')}
                    onBlur={handleBlur}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="form-label">Last Name</label>
                <div className={`input-wrapper ${focusedField === 'lastName' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('lastName')}
                    onBlur={handleBlur}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">Email Address</label>
                <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">Password</label>
                <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="form-label">Confirm Password</label>
                <div className={`input-wrapper ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">Phone Number</label>
                <div className={`input-wrapper ${focusedField === 'phoneNumber' ? 'focused' : ''}`}>
                  <InputField
                    label=""
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phoneNumber')}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {formData.userType === "jobSeeker" && (
              <div className="form-row">
                <div className="input-group">
                  <label className="form-label">LinkedIn Profile (Optional)</label>
                  <div className={`input-wrapper ${focusedField === 'linkedInProfile' ? 'focused' : ''}`}>
                    <InputField
                      label=""
                      type="url"
                      name="linkedInProfile"
                      value={formData.linkedInProfile}
                      onChange={handleChange}
                      onFocus={() => handleFocus('linkedInProfile')}
                      onBlur={handleBlur}
                      placeholder="Enter your LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.userType === "recruiter" && (
              <>
                <div className="form-row">
                  <div className="input-group">
                    <label className="form-label">Company Name</label>
                    <div className={`input-wrapper ${focusedField === 'companyName' ? 'focused' : ''}`}>
                      <InputField
                        label=""
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        onFocus={() => handleFocus('companyName')}
                        onBlur={handleBlur}
                        placeholder="Enter your company name"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="form-label">Company Website</label>
                    <div className={`input-wrapper ${focusedField === 'companyWebsite' ? 'focused' : ''}`}>
                      <InputField
                        label=""
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        onFocus={() => handleFocus('companyWebsite')}
                        onBlur={handleBlur}
                        placeholder="Enter your company website URL"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span className="success-text">{success}</span>
              </div>
            )}

            <Button
              type="submit"
              className="signup-button"
              label={isLoading ? "Creating account..." : "Sign Up"}
              disabled={isLoading}
              text={isLoading ? "Creating account..." : "Sign Up"}
            />

            <div className="social-login">
              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">or sign up with social platforms</span>
                <span className="divider-line"></span>
              </div>
              
              <div className="social-buttons">
                <button type="button" className="social-btn google" title="Sign up with Google">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button type="button" className="social-btn facebook" title="Sign up with Facebook">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button type="button" className="social-btn github" title="Sign up with GitHub">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button type="button" className="social-btn linkedin" title="Sign up with LinkedIn">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
