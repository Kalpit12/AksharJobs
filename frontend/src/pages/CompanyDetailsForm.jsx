import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faIndustry, 
  faGlobe, 
  faPhone, 
  faUsers, 
  faCalendarAlt, 
  faFileAlt,
  faSave,
  faRocket,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/CompanyDetailsForm.css';

const CompanyDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Get user data from location state (passed from signup)
  const userData = location.state?.userData || {};

  const [formData, setFormData] = useState({
    companyName: userData.companyName || '',
    location: '',
    industry: '',
    website: '',
    phone: '',
    companySize: '',
    foundedYear: '',
    description: ''
  });

  // Fetch existing user data if coming from dashboard
  const fetchExistingUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(buildApiUrl('/api/auth/get_user'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setFormData(prev => ({
          ...prev,
          companyName: userData.companyName || prev.companyName,
          location: userData.location || '',
          industry: userData.industry || '',
          website: userData.companyWebsite || '',
          phone: userData.phone || '',
          companySize: userData.companySize || '',
          foundedYear: userData.foundedYear || '',
          description: userData.companyDescription || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      // If no token, redirect to signup
      navigate('/signup');
      return;
    }
    
    // If no user data from location state, try to get from localStorage
    if (!userData.email) {
      const email = localStorage.getItem('userEmail');
      const firstName = localStorage.getItem('userFirstName');
      const lastName = localStorage.getItem('userLastName');
      const companyName = localStorage.getItem('companyName') || '';
      
      if (email) {
        setFormData(prev => ({
          ...prev,
          companyName: companyName || prev.companyName
        }));
        // Fetch existing user data to pre-fill the form
        fetchExistingUserData();
      } else {
        navigate('/signup');
      }
    }
  }, [userData, navigate]);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Company location is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    if (formData.phone && !/^[\d\s\-\(\)\+]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
      newErrors.foundedYear = 'Please enter a valid founding year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(buildApiUrl('/api/users/company-profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          location: formData.location,
          industry: formData.industry,
          companyWebsite: formData.website,
          phone: formData.phone,
          companySize: formData.companySize,
          foundedYear: formData.foundedYear,
          companyDescription: formData.description
        })
      });

              const data = await response.json();

        if (response.ok) {
          setSuccess(true);
        } else {
          setError(data.error || 'Failed to save company details. Please try again.');
        }
    } catch (error) {
      console.error('Error saving company details:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to recruiter dashboard without saving
    navigate('/recruiter-dashboard');
  };

  // Countdown effect for redirection
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/recruiter-dashboard');
    }
  }, [success, countdown, navigate]);

  if (success) {
    return (
      <div className="company-details-wrapper">
        <div className="company-details-container">
          <div className="success-message">
            <div className="success-icon-container">
              <div className="success-icon">✅</div>
              <div className="success-checkmark"></div>
            </div>
            <h2>Company Details Saved Successfully!</h2>
            <p>Redirecting you to your recruiter dashboard...</p>
            <div className="success-countdown">
              {countdown} seconds
            </div>
            <div className="success-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-wrapper">
      {/* Header */}
      <header className="company-details-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <div className="logo-text">
              <div className="logo-title">RocketJobs</div>
              <div className="logo-subtitle">Where Opportunity Meets Talent</div>
            </div>
          </div>
          
          <div className="header-actions">
            <button onClick={() => navigate('/signup')} className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Signup
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="company-details-main">
        <div className="company-details-container">
          <div className="company-details-content">
            <div className="form-section">
              <div className="form-container">
                <div className="form-header">
                  <h1 className="form-title">Complete Your Company Profile</h1>
                  <p className="form-subtitle">
                    Help us understand your company better to provide you with the best recruitment tools
                  </p>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <form className="company-details-form" onSubmit={handleSubmit}>
                  {/* Company Name */}
                  <div className="form-group">
                    <label htmlFor="companyName" className="form-label">
                      <FontAwesomeIcon icon={faBuilding} />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className={`form-input ${errors.companyName ? 'error' : ''}`}
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                    {errors.companyName && (
                      <span className="error-text">{errors.companyName}</span>
                    )}
                  </div>

                  {/* Location and Industry */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        Company Location *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        className={`form-input ${errors.location ? 'error' : ''}`}
                        placeholder="e.g., Nairobi, Kenya"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                      {errors.location && (
                        <span className="error-text">{errors.location}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="industry" className="form-label">
                        <FontAwesomeIcon icon={faIndustry} />
                        Industry *
                      </label>
                      <input
                        type="text"
                        id="industry"
                        name="industry"
                        className={`form-input ${errors.industry ? 'error' : ''}`}
                        placeholder="e.g., Technology, Healthcare, Finance"
                        value={formData.industry}
                        onChange={handleInputChange}
                      />
                      {errors.industry && (
                        <span className="error-text">{errors.industry}</span>
                      )}
                    </div>
                  </div>

                  {/* Website and Phone */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="website" className="form-label">
                        <FontAwesomeIcon icon={faGlobe} />
                        Company Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        className={`form-input ${errors.website ? 'error' : ''}`}
                        placeholder="https://www.yourcompany.com"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                      {errors.website && (
                        <span className="error-text">{errors.website}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        <FontAwesomeIcon icon={faPhone} />
                        Company Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="+254 XXX XXX XXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {errors.phone && (
                        <span className="error-text">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Company Size and Founded Year */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="companySize" className="form-label">
                        <FontAwesomeIcon icon={faUsers} />
                        Company Size
                      </label>
                      <select
                        id="companySize"
                        name="companySize"
                        className="form-input"
                        value={formData.companySize}
                        onChange={handleInputChange}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="501-1000 employees">501-1000 employees</option>
                        <option value="1000+ employees">1000+ employees</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="foundedYear" className="form-label">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        Founded Year
                      </label>
                      <input
                        type="number"
                        id="foundedYear"
                        name="foundedYear"
                        className={`form-input ${errors.foundedYear ? 'error' : ''}`}
                        placeholder="e.g., 2020"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={formData.foundedYear}
                        onChange={handleInputChange}
                      />
                      {errors.foundedYear && (
                        <span className="error-text">{errors.foundedYear}</span>
                      )}
                    </div>
                  </div>

                  {/* Company Description */}
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      <FontAwesomeIcon icon={faFileAlt} />
                      Company Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-input"
                      rows="4"
                      placeholder="Tell us about your company, mission, and what makes you unique..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} />
                          Save Company Details
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleSkip}
                      disabled={isLoading}
                    >
                      Skip for Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetailsForm;
