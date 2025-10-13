import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import '../styles/RecruiterRegistrationFormModern.css';

const RecruiterRegistrationFormModern = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData || {};

  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    // Company Information
    companyName: userData.companyName || '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    companyLocation: '',
    foundedYear: '',
    companyDescription: '',

    // Recruiter Details
    fullName: userData.firstName ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData.email || '',
    phone: '',
    position: '',
    department: '',
    linkedinProfile: '',

    // Hiring Preferences
    hiringDepartments: [],
    positionTypes: [],
    workTypes: [],
    experienceLevels: [],
    budgetRange: '',

    // Position Requirements
    requiredSkills: [],
    preferredEducation: [],
    numberOfPositions: '',
    urgencyLevel: '',

    // Additional Information
    companyBenefits: '',
    companyValues: '',
    hiringTimeline: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  // Form state persistence
  const saveFormState = () => {
    localStorage.setItem('recruiterFormState', JSON.stringify({
      formData,
      currentSection,
      timestamp: Date.now()
    }));
  };

  const loadFormState = () => {
    try {
      const saved = localStorage.getItem('recruiterFormState');
      if (saved) {
        const parsed = JSON.parse(saved);
        const age = Date.now() - parsed.timestamp;
        if (age > 7 * 24 * 60 * 60 * 1000) {
          localStorage.removeItem('recruiterFormState');
          return null;
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading form state:', error);
    }
    return null;
  };

  // Initialize and load saved state
  useEffect(() => {
    const savedState = loadFormState();
    if (savedState) {
      setFormData(savedState.formData);
      setCurrentSection(savedState.currentSection);
    }
    
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

  // Save state on changes
  useEffect(() => {
    if (isInitialized) {
      saveFormState();
    }
  }, [formData, currentSection, isInitialized]);

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
      case 1: // Company Information
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.companySize) newErrors.companySize = 'Company size is required';
        break;
      
      case 2: // Recruiter Details
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.position) newErrors.position = 'Position is required';
        break;
      
      case 3: // Hiring Preferences
        if (formData.hiringDepartments.length === 0) newErrors.hiringDepartments = 'Select at least one department';
        if (formData.positionTypes.length === 0) newErrors.positionTypes = 'Select at least one position type';
        break;
      
      case 4: // Position Requirements
        if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'Add at least one required skill';
        break;
      
      case 5: // Additional Info (optional)
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 5) {
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
      const response = await fetch(buildApiUrl('/api/recruiter/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
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
      { number: 1, label: 'Company Info', icon: faBuilding },
      { number: 2, label: 'Recruiter Details', icon: faUser },
      { number: 3, label: 'Hiring Preferences', icon: faBriefcase },
      { number: 4, label: 'Requirements', icon: faBullseye },
      { number: 5, label: 'Additional Info', icon: faInfoCircle }
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
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="AksharJobs" />
            </div>
            <div className="logo-text">
              <h3 className="logo-title">AksharJobs</h3>
              <p className="logo-subtitle">Find Top Talent</p>
            </div>
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
                {/* Section 1: Company Information */}
                {currentSection === 1 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBuilding} />
                      Company Information
                    </h2>
                    
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
                          <FontAwesomeIcon icon={faIndustry} />
                          Industry *
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className={`form-input ${errors.industry ? 'error' : ''}`}
                        >
                          <option value="">Select Industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Finance">Finance</option>
                          <option value="Education">Education</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.industry && <span className="error-text">{errors.industry}</span>}
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
                          <option value="">Select Size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1001+">1001+ employees</option>
                        </select>
                        {errors.companySize && <span className="error-text">{errors.companySize}</span>}
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
                          placeholder="https://company.com"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          Company Location
                        </label>
                        <input
                          type="text"
                          name="companyLocation"
                          value={formData.companyLocation}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Founded Year
                        </label>
                        <input
                          type="number"
                          name="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="YYYY"
                          min="1800"
                          max="2024"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Company Description
                        </label>
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Brief description of your company, culture, and values"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Recruiter Details */}
                {currentSection === 2 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faUser} />
                      Recruiter Details
                    </h2>
                    
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
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          placeholder="your.email@company.com"
                          disabled={!!userData.email}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
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

                      <div className="form-group">
                        <label className="form-label">
                          Your Position/Title *
                        </label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className={`form-input ${errors.position ? 'error' : ''}`}
                        >
                          <option value="">Select Position</option>
                          <option value="HR Manager">HR Manager</option>
                          <option value="Talent Acquisition">Talent Acquisition</option>
                          <option value="Recruiter">Recruiter</option>
                          <option value="Hiring Manager">Hiring Manager</option>
                          <option value="Director">Director</option>
                          <option value="Founder/CEO">Founder/CEO</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.position && <span className="error-text">{errors.position}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g., Human Resources"
                        />
                      </div>

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
                    </div>
                  </div>
                )}

                {/* Section 3: Hiring Preferences */}
                {currentSection === 3 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBriefcase} />
                      Hiring Preferences
                    </h2>
                    
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          Hiring Departments *
                        </label>
                        <div className="checkbox-grid">
                          {['Software Development', 'Marketing', 'Sales', 'HR', 'Design', 'Customer Support', 'Finance', 'Operations'].map(dept => (
                            <label key={dept} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.hiringDepartments.includes(dept)}
                                onChange={() => handleMultiSelect('hiringDepartments', dept)}
                              />
                              <span>{dept}</span>
                            </label>
                          ))}
                        </div>
                        {errors.hiringDepartments && <span className="error-text">{errors.hiringDepartments}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Position Types *
                        </label>
                        <div className="checkbox-grid">
                          {['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'].map(type => (
                            <label key={type} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.positionTypes.includes(type)}
                                onChange={() => handleMultiSelect('positionTypes', type)}
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                        {errors.positionTypes && <span className="error-text">{errors.positionTypes}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Work Types
                        </label>
                        <div className="checkbox-grid">
                          {['On-site', 'Remote', 'Hybrid'].map(type => (
                            <label key={type} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.workTypes.includes(type)}
                                onChange={() => handleMultiSelect('workTypes', type)}
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Experience Levels
                        </label>
                        <div className="checkbox-grid">
                          {['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead/Principal'].map(level => (
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
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Typical Budget Range (Annual)
                        </label>
                        <select
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select Range</option>
                          <option value="$0-$30k">$0 - $30,000</option>
                          <option value="$30k-$50k">$30,000 - $50,000</option>
                          <option value="$50k-$80k">$50,000 - $80,000</option>
                          <option value="$80k-$120k">$80,000 - $120,000</option>
                          <option value="$120k+">$120,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 4: Position Requirements */}
                {currentSection === 4 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faBullseye} />
                      Position Requirements
                    </h2>
                    
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          Required Skills *
                        </label>
                        <div className="skills-input-container">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Type a skill and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !formData.requiredSkills.includes(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    requiredSkills: [...prev.requiredSkills, value]
                                  }));
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                          <div className="skills-tags">
                            {formData.requiredSkills.map((skill, index) => (
                              <span key={index} className="skill-tag technical">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
                                  }))}
                                  className="remove-skill"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        {errors.requiredSkills && <span className="error-text">{errors.requiredSkills}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Preferred Education Levels
                        </label>
                        <div className="checkbox-grid">
                          {['High School', 'Associate', "Bachelor's", "Master's", 'Doctorate'].map(edu => (
                            <label key={edu} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.preferredEducation.includes(edu)}
                                onChange={() => handleMultiSelect('preferredEducation', edu)}
                              />
                              <span>{edu}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Number of Positions
                        </label>
                        <input
                          type="number"
                          name="numberOfPositions"
                          value={formData.numberOfPositions}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g., 5"
                          min="1"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Urgency Level
                        </label>
                        <select
                          name="urgencyLevel"
                          value={formData.urgencyLevel}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select Urgency</option>
                          <option value="Low">Low - Hiring within 3+ months</option>
                          <option value="Medium">Medium - Hiring within 1-3 months</option>
                          <option value="High">High - Hiring within 1 month</option>
                          <option value="Urgent">Urgent - Hiring immediately</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Additional Information */}
                {currentSection === 5 && (
                  <div className="form-section">
                    <h2 className="section-title">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Additional Information
                    </h2>
                    
                    <p className="section-description">
                      Help candidates learn more about your company (optional)
                    </p>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">
                          Company Benefits
                        </label>
                        <textarea
                          name="companyBenefits"
                          value={formData.companyBenefits}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="List company benefits (health insurance, remote work, flexible hours, etc.)"
                          rows="3"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Company Values
                        </label>
                        <textarea
                          name="companyValues"
                          value={formData.companyValues}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Describe your company's core values and culture"
                          rows="3"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Hiring Timeline
                        </label>
                        <textarea
                          name="hiringTimeline"
                          value={formData.hiringTimeline}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Describe your typical hiring process and timeline"
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
                          placeholder="Any other information you'd like to share"
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
              
              {currentSection < 5 ? (
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

export default RecruiterRegistrationFormModern;

