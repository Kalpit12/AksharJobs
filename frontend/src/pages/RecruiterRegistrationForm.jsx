import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faUser,
  faBriefcase,
  faBullseye,
  faInfoCircle,
  faCheck,
  faArrowRight,
  faArrowLeft,
  faEnvelope,
  faPhone,
  faGlobe,
  faMapMarkerAlt,
  faIndustry,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAutoSave } from '../hooks/useAutoSave';
import '../styles/RecruiterRegistrationForm.css';

const RecruiterRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userData = location.state?.userData || {};
  
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Auto-save configuration
  const AUTOSAVE_KEY = `recruiter_registration_${user?.userId || 'temp'}`;

  // Smart navigation function to go to appropriate dashboard
  const navigateToDashboard = () => {
    const role = localStorage.getItem('role');
    const normalizedRole = role?.toLowerCase().replace(/[_-]/g, '');
    
    if (normalizedRole?.includes('recruiter')) {
      navigate('/recruiter-dashboard');
    } else if (normalizedRole?.includes('intern')) {
      navigate('/intern-dashboard');
    } else if (normalizedRole?.includes('admin')) {
      navigate('/admin');
    } else {
      // Default to job seeker dashboard
      navigate('/jobseeker-dashboard');
    }
  };

  // Initialize form data with auto-save (2-minute periodic save)
  const {
    formData,
    setFormData,
    isSaving,
    saveStatus,
    lastSaveTime,
    clearSavedData
  } = useAutoSave(
    {
      // Account Information
      fullName: userData.firstName ? `${userData.firstName} ${userData.lastName}` : '',
      email: userData.email || '',
      phone: '',
      password: '',
      country: '',

      // Company Information
      companyName: userData.companyName || '',
      companyWebsite: '',
      companySize: '',
      industry: '',
      yourRole: '',
      hiringFor: '',
      
      // Recruiting Needs
      numberOfRoles: '',
      roleTypes: [],
      employmentTypes: [],
      hiringTimeline: '',
      monthlyHiringVolume: '',
      
      // Job Locations
      jobLocations: [],
      internationalRoles: '',
      specificCountries: '',
      
      // Candidate Preferences
      experienceLevels: [],
      sponsorshipOffered: '',
      
      // Communication Preferences
      preferredContact: [],
      allowDirectApplications: '',
      
      // Recruiting Goals
      recruitingGoals: [],
      valueProposition: '',
      
      // Additional (optional)
      companyDescription: '',
      linkedinProfile: '',
      companyBenefits: '',
      additionalNotes: ''
    },
    AUTOSAVE_KEY,
    1000, // Debounce delay (1 second)
    null, // No backend save callback
    true // Enable periodic 2-minute auto-save
  );

  const [errors, setErrors] = useState({});

  // Initialize state
  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateSection = (section) => {
    const newErrors = {};
    
    switch(section) {
      case 1: // Account Information
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Work email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.country) newErrors.country = 'Country/Region is required';
        break;
      
      case 2: // Company Details
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.companySize) newErrors.companySize = 'Company size is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.yourRole) newErrors.yourRole = 'Your role is required';
        if (!formData.hiringFor) newErrors.hiringFor = 'This field is required';
        break;
      
      case 3: // Recruiting Needs
        if (!formData.numberOfRoles) newErrors.numberOfRoles = 'Number of roles is required';
        if (formData.roleTypes.length === 0) newErrors.roleTypes = 'Select at least one role type';
        if (formData.employmentTypes.length === 0) newErrors.employmentTypes = 'Select at least one employment type';
        if (!formData.hiringTimeline) newErrors.hiringTimeline = 'Hiring timeline is required';
        break;
      
      case 4: // Job Locations & Preferences
        if (formData.jobLocations.length === 0) newErrors.jobLocations = 'Select at least one location type';
        if (formData.experienceLevels.length === 0) newErrors.experienceLevels = 'Select at least one experience level';
        break;
      
      case 5: // Communication & Goals
        if (formData.preferredContact.length === 0) newErrors.preferredContact = 'Select at least one contact method';
        if (formData.recruitingGoals.length === 0) newErrors.recruitingGoals = 'Select at least one recruiting goal';
        break;
      
      case 6: // Additional Info (optional)
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 6) {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step) => {
    if (step <= currentSection || validateSection(currentSection)) {
      setCurrentSection(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSection(currentSection)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');

      // Prepare FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(buildApiUrl('/api/recruiter/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        // Clear saved form data on successful submission
        clearSavedData();
        localStorage.removeItem('recruiterFormState');
        navigate('/recruiter-dashboard', {
          state: { message: 'Registration completed successfully!' }
        });
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Account Info', icon: faUser },
      { number: 2, label: 'Company Details', icon: faBuilding },
      { number: 3, label: 'Recruiting Needs', icon: faBriefcase },
      { number: 4, label: 'Locations & Preferences', icon: faMapMarkerAlt },
      { number: 5, label: 'Communication & Goals', icon: faBullseye },
      { number: 6, label: 'Additional Info', icon: faInfoCircle }
    ];

    const progress = ((currentSection - 1) / (steps.length - 1)) * 100;

    return (
      <div className="progress-bar-container">
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
        <div className="progress-steps">
          {steps.map(step => {
            const isCompleted = step.number < currentSection;
            const isCurrent = step.number === currentSection;
            const isClickable = step.number <= currentSection;

            return (
              <div
                key={step.number}
                className={`progress-step ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : 'disabled'}`}
                onClick={() => isClickable && handleStepClick(step.number)}
              >
                <div className="step-circle">
                  {isCompleted ? (
                    <FontAwesomeIcon icon={faCheck} className="step-check" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            );
          })}
          </div>
      </div>
    );
  };

  if (!isInitialized) {
    return (
      <div className="recruiter-loading">
        <div className="spinner"></div>
        <p>Loading form...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-wrapper">
      {/* Header */}
      <header className="recruiter-header">
        <div className="header-container">
          <div className="logo-section" onClick={navigateToDashboard} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <img src="/logo.png" alt="AksharJobs" />
            </div>
            <div className="logo-text">
              <h3 className="logo-title">AksharJobs</h3>
              <p className="logo-subtitle">Find Top Talent</p>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '14px'
          }}>
            {isSaving && <span style={{ color: '#f39c12' }}>💾 Saving...</span>}
            {saveStatus === 'saved' && (
              <span style={{ color: '#27ae60' }}>
                <FontAwesomeIcon icon={faCheck} /> Saved {lastSaveTime && `at ${lastSaveTime.toLocaleTimeString()}`}
              </span>
            )}
            {saveStatus === 'error' && <span style={{ color: '#e74c3c' }}>⚠️ Save failed</span>}
            {!isSaving && !saveStatus && <span style={{ color: '#666' }}>Auto-saving every 2 minutes</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="recruiter-main">
        <div className="recruiter-container">
          <div className="recruiter-form-card">
            
            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Recruiter Registration</h1>
              <p className="form-subtitle">
                Complete your profile to start posting jobs and connect with talented candidates
              </p>
            </div>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Form Content */}
            <div className="form-content">
              <form onSubmit={handleSubmit}>
                {/* Section 1: Account Information */}
                {currentSection === 1 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faUser} />
                      Account Information
                    </h2>
                    <p className="section-description">
                      Let's start with your basic information
                    </p>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faUser} />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.fullName ? 'error' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faEnvelope} />
                          Work Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          placeholder="your.name@company.com"
                          disabled={!!userData.email}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                        <p className="input-hint">Please use your business email (not Gmail/Yahoo)</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faPhone} />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faGlobe} />
                          Country/Region *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`form-input ${errors.country ? 'error' : ''}`}
                        >
                          <option value="">Select your country</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="India">India</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                          <option value="UAE">United Arab Emirates</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.country && <span className="error-text">{errors.country}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Company Details */}
                {currentSection === 2 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBuilding} />
                      Company Details
                    </h2>
                    <p className="section-description">
                      Tell us about your company
                    </p>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faBuilding} />
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.companyName ? 'error' : ''}`}
                          placeholder="Enter company name"
                        />
                        {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faGlobe} />
                          Company Website
                        </label>
                        <input
                          type="url"
                          name="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="https://www.company.com"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faUsers} />
                          Company Size *
                        </label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className={`form-input ${errors.companySize ? 'error' : ''}`}
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1001-5000">1001-5000 employees</option>
                          <option value="5001-10000">5001-10000 employees</option>
                          <option value="10000+">10000+ employees</option>
                        </select>
                        {errors.companySize && <span className="error-text">{errors.companySize}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faIndustry} />
                          Industry *
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className={`form-input ${errors.industry ? 'error' : ''}`}
                        >
                          <option value="">Select industry</option>
                          <option value="Technology">Technology & Software</option>
                          <option value="Healthcare">Healthcare & Medical</option>
                          <option value="Finance">Finance & Banking</option>
                          <option value="Education">Education & Training</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail & E-commerce</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Marketing">Marketing & Advertising</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Hospitality">Hospitality & Tourism</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Construction">Construction</option>
                          <option value="Energy">Energy & Utilities</option>
                          <option value="Legal">Legal Services</option>
                          <option value="Media">Media & Entertainment</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Transportation">Transportation & Logistics</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.industry && <span className="error-text">{errors.industry}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faUser} />
                          Your Role in the Company *
                        </label>
                        <select
                          name="yourRole"
                          value={formData.yourRole}
                          onChange={handleInputChange}
                          className={`form-input ${errors.yourRole ? 'error' : ''}`}
                        >
                          <option value="">Select your role</option>
                          <option value="HR Manager">HR Manager</option>
                          <option value="Talent Acquisition">Talent Acquisition Specialist</option>
                          <option value="Recruiter">Recruiter</option>
                          <option value="Hiring Manager">Hiring Manager</option>
                          <option value="Director">Director/VP</option>
                          <option value="Founder">Founder/Co-Founder</option>
                          <option value="CEO">CEO/Executive</option>
                          <option value="Consultant">Recruitment Consultant</option>
                          <option value="Agency">Staffing Agency</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.yourRole && <span className="error-text">{errors.yourRole}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faBriefcase} />
                          Are you hiring on behalf of *
                        </label>
                        <select
                          name="hiringFor"
                          value={formData.hiringFor}
                          onChange={handleInputChange}
                          className={`form-input ${errors.hiringFor ? 'error' : ''}`}
                        >
                          <option value="">Select option</option>
                          <option value="My company">My company (direct hire)</option>
                          <option value="Client company">A client company</option>
                          <option value="Multiple clients">Multiple clients (agency)</option>
                          <option value="Startup">My startup</option>
                        </select>
                        {errors.hiringFor && <span className="error-text">{errors.hiringFor}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Company Description (Optional)
                        </label>
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Brief description of your company, mission, and culture"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Recruiting Needs */}
                {currentSection === 3 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBriefcase} />
                      Recruiting Needs
                    </h2>
                    <p className="section-description">
                      Help us understand your hiring requirements
                    </p>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          How many roles are you hiring for? *
                        </label>
                        <select
                          name="numberOfRoles"
                          value={formData.numberOfRoles}
                          onChange={handleInputChange}
                          className={`form-input ${errors.numberOfRoles ? 'error' : ''}`}
                        >
                          <option value="">Select number of roles</option>
                          <option value="1">1 role</option>
                          <option value="2-5">2-5 roles</option>
                          <option value="6-10">6-10 roles</option>
                          <option value="11-20">11-20 roles</option>
                          <option value="21-50">21-50 roles</option>
                          <option value="50+">50+ roles</option>
                        </select>
                        {errors.numberOfRoles && <span className="error-text">{errors.numberOfRoles}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Monthly Hiring Volume
                        </label>
                        <select
                          name="monthlyHiringVolume"
                          value={formData.monthlyHiringVolume}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select monthly volume</option>
                          <option value="1-5">1-5 hires/month</option>
                          <option value="6-10">6-10 hires/month</option>
                          <option value="11-20">11-20 hires/month</option>
                          <option value="21-50">21-50 hires/month</option>
                          <option value="50+">50+ hires/month</option>
                          <option value="Seasonal">Seasonal hiring</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          What types of roles are you hiring for? *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Engineering/Development',
                            'Sales',
                            'Marketing',
                            'Customer Support',
                            'Design/Creative',
                            'Product Management',
                            'Data/Analytics',
                            'HR',
                            'Finance/Accounting',
                            'Operations',
                            'Legal',
                            'Executive'
                          ].map(role => (
                            <label key={role} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.roleTypes.includes(role)}
                                onChange={() => handleMultiSelect('roleTypes', role)}
                              />
                              <span>{role}</span>
                            </label>
                          ))}
                        </div>
                        {errors.roleTypes && <span className="error-text">{errors.roleTypes}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Employment Types *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Full-Time',
                            'Part-Time',
                            'Contract',
                            'Freelance',
                            'Internship',
                            'Temporary'
                          ].map(type => (
                            <label key={type} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.employmentTypes.includes(type)}
                                onChange={() => handleMultiSelect('employmentTypes', type)}
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                        {errors.employmentTypes && <span className="error-text">{errors.employmentTypes}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          What's your hiring timeline? *
                        </label>
                        <select
                          name="hiringTimeline"
                          value={formData.hiringTimeline}
                          onChange={handleInputChange}
                          className={`form-input ${errors.hiringTimeline ? 'error' : ''}`}
                        >
                          <option value="">Select timeline</option>
                          <option value="Urgent">Urgent (Hiring immediately - within 1-2 weeks)</option>
                          <option value="Soon">Soon (Hiring within 1 month)</option>
                          <option value="Next few months">Next few months (1-3 months)</option>
                          <option value="Ongoing">Ongoing (Continuous hiring)</option>
                          <option value="Planning">Planning ahead (3+ months)</option>
                        </select>
                        {errors.hiringTimeline && <span className="error-text">{errors.hiringTimeline}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 4: Job Locations & Candidate Preferences */}
                {currentSection === 4 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Job Locations & Candidate Preferences
                    </h2>
                    <p className="section-description">
                      Where are your jobs located and what candidate profiles are you seeking?
                    </p>
                    
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          Where are the jobs you're hiring for located? *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Onsite',
                            'Remote',
                            'Hybrid',
                            'Multiple Countries'
                          ].map(location => (
                            <label key={location} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.jobLocations.includes(location)}
                                onChange={() => handleMultiSelect('jobLocations', location)}
                              />
                              <span>{location}</span>
                            </label>
                          ))}
                        </div>
                        {errors.jobLocations && <span className="error-text">{errors.jobLocations}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faGlobe} />
                          Are you hiring for international roles?
                        </label>
                        <select
                          name="internationalRoles"
                          value={formData.internationalRoles}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select option</option>
                          <option value="Yes">Yes, we hire internationally</option>
                          <option value="No">No, domestic only</option>
                          <option value="Considering">Considering it</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Specific Countries/Regions (Optional)
                        </label>
                        <input
                          type="text"
                          name="specificCountries"
                          value={formData.specificCountries}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g., USA, UK, Canada"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          What is your ideal candidate experience level? *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Entry-Level',
                            'Mid-Level',
                            'Senior',
                            'Executive',
                            'Student/Intern'
                          ].map(level => (
                            <label key={level} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.experienceLevels.includes(level)}
                                onChange={() => handleMultiSelect('experienceLevels', level)}
                              />
                              <span>{level}</span>
                            </label>
                          ))}
                        </div>
                        {errors.experienceLevels && <span className="error-text">{errors.experienceLevels}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Do you offer sponsorship for international candidates?
                        </label>
                        <select
                          name="sponsorshipOffered"
                          value={formData.sponsorshipOffered}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select option</option>
                          <option value="Yes">Yes, we offer sponsorship</option>
                          <option value="No">No sponsorship available</option>
                          <option value="Case by case">Considered on a case-by-case basis</option>
                          <option value="Certain roles">Only for certain roles</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Communication & Recruiting Goals */}
                {currentSection === 5 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBullseye} />
                      Communication & Recruiting Goals
                    </h2>
                    <p className="section-description">
                      How do you want to connect with candidates and what are your goals?
                    </p>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faEnvelope} />
                          How would you prefer to be contacted by candidates? *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Email',
                            'Phone',
                            'LinkedIn InMail',
                            'AksharJobs Chat',
                            'WhatsApp'
                          ].map(method => (
                            <label key={method} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.preferredContact.includes(method)}
                                onChange={() => handleMultiSelect('preferredContact', method)}
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>
                        {errors.preferredContact && <span className="error-text">{errors.preferredContact}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Do you allow direct candidate applications via AksharJobs?
                        </label>
                        <select
                          name="allowDirectApplications"
                          value={formData.allowDirectApplications}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select option</option>
                          <option value="Yes">Yes, candidates can apply directly</option>
                          <option value="No">No, I prefer to reach out to candidates</option>
                          <option value="Depends">Depends on the role</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faBullseye} />
                          What are your main goals using AksharJobs? *
                        </label>
                        <div className="checkbox-grid">
                          {[
                            'Posting job openings',
                            'Finding passive candidates',
                            'Building company brand',
                            'Building talent pipeline',
                            'Networking with professionals',
                            'Market research'
                          ].map(goal => (
                            <label key={goal} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.recruitingGoals.includes(goal)}
                                onChange={() => handleMultiSelect('recruitingGoals', goal)}
                              />
                              <span>{goal}</span>
                            </label>
                          ))}
                        </div>
                        {errors.recruitingGoals && <span className="error-text">{errors.recruitingGoals}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          What would make AksharJobs most valuable to your hiring process?
                        </label>
                        <textarea
                          name="valueProposition"
                          value={formData.valueProposition}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Tell us what features or capabilities would help you most in your recruiting efforts..."
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 6: Additional Information */}
                {currentSection === 6 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Additional Information
                    </h2>
                    
                    <p className="section-description">
                      Optional information to enhance your profile (all fields optional)
                    </p>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          name="linkedinProfile"
                          value={formData.linkedinProfile}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Company Benefits & Perks
                        </label>
                        <textarea
                          name="companyBenefits"
                          value={formData.companyBenefits}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Health insurance, remote work options, flexible hours, professional development, etc."
                          rows="3"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Additional Notes
                        </label>
                        <textarea
                          name="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Any other information you'd like to share about your company or hiring needs..."
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="error-message">
                    {submitError}
                </div>
                )}
              </form>
                </div>

            {/* Navigation Buttons */}
            <div className="form-actions">
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                    Previous
                  </button>
              )}
              
              {currentSection < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} />
                  </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner small"></span>
                      Submitting...
                      </>
                    ) : (
                      <>
                      <FontAwesomeIcon icon={faCheck} />
                        Complete Registration
                      </>
                    )}
                  </button>
              )}
                </div>

              </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterRegistrationForm;

