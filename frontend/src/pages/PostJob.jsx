import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faStar, 
  faArrowLeft, 
  faSave, 
  faEye,
  faPaperPlane,
  faMapMarkerAlt,
  faDollarSign,
  faClock,
  faCheckCircle,
  faPlus,
  faTimes,
  faGlobe,
  faBuilding,
  faBriefcase,
  faUsers,
  faGraduationCap,
  faCode,
  faCalendarAlt,
  faEyeSlash,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    targetCommunities: false,
    
    // Job Details
    jobType: '',
    jobCategory: '',
    numberOfOpenings: '',
    experienceLevel: '',
    requiredSkills: [],
    jobDescription: '',
    keyQualifications: [],
    
    // Location & Work Setup
    country: '',
    city: '',
    workMode: '',
    officeAddress: '',
    
    // Compensation
    salaryType: '',
    currency: '',
    salaryMin: '',
    salaryMax: '',
    benefits: [],
    
    // Application Details
    applicationDeadline: '',
    applicationMethod: 'platform',
    jobVisibility: 'public',
    screeningQuestions: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customIndustry, setCustomIndustry] = useState('');

  const steps = [
    { id: 1, title: 'Basic Information', icon: faBuilding },
    { id: 2, title: 'Job Details', icon: faBriefcase },
    { id: 3, title: 'Location & Work', icon: faMapMarkerAlt },
    { id: 4, title: 'Compensation', icon: faDollarSign },
    { id: 5, title: 'Application Details', icon: faClock },
    { id: 6, title: 'Preview & Post', icon: faEye }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToList = (listName, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromList = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the final form data
      const finalFormData = {
        ...formData,
        industry: formData.industry === 'other' ? customIndustry : formData.industry
      };
      
      // Here you would typically send the data to your backend
      console.log('Job posting data:', finalFormData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and redirect
      alert('Job posted successfully! 🚀');
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    // Prepare the final form data for draft
    const finalFormData = {
      ...formData,
      industry: formData.industry === 'other' ? customIndustry : formData.industry
    };
    
    // Save as draft functionality
    console.log('Saving draft:', finalFormData);
    alert('Draft saved successfully! 💾');
  };

  return (
    <div className="post-job-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="stars"></div>
        <div className="rocket-container">
          <div className="rocket">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <div className="rocket-trail"></div>
        </div>
        <div className="floating-elements">
          <div className="floating-star star-1">⭐</div>
          <div className="floating-star star-2">✨</div>
          <div className="floating-star star-3">🌟</div>
          <div className="floating-star star-4">💫</div>
        </div>
      </div>

      <div className="post-job-container">
        <div className="post-job-header">
          
          <div className="header-content">
            <div className="heading-container">
              <h1>POST YOUR JOB</h1>
              <p>Create an amazing job posting that attracts top talent from across the galaxy</p>
            </div>
          </div>
        </div>

        <div className="post-job-content">
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
                >
                  <div className="step-icon">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="job-form">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>🏢 Basic Information</h2>
                    <p>Tell us about your company and the role</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="jobTitle">Job Title *</label>
                      <input
                        type="text"
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="companyName">Company Name *</label>
                      <input
                        type="text"
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Your company name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="companyWebsite">Company Website</label>
                      <input
                        type="url"
                        id="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="industry">Industry *</label>
                      <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        required
                      >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="consulting">Consulting</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="hospitality">Hospitality & Tourism</option>
                        <option value="media">Media & Entertainment</option>
                        <option value="automotive">Automotive</option>
                        <option value="aerospace">Aerospace & Defense</option>
                        <option value="energy">Energy & Utilities</option>
                        <option value="telecommunications">Telecommunications</option>
                        <option value="logistics">Logistics & Transportation</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="construction">Construction</option>
                        <option value="pharmaceuticals">Pharmaceuticals</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="food-beverage">Food & Beverage</option>
                        <option value="sports">Sports & Recreation</option>
                        <option value="non-profit">Non-Profit</option>
                        <option value="government">Government</option>
                        <option value="legal">Legal Services</option>
                        <option value="accounting">Accounting</option>
                        <option value="marketing">Marketing & Advertising</option>
                        <option value="design">Design & Creative</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {formData.industry === 'other' && (
                      <div className="form-group">
                        <label htmlFor="customIndustry">Please specify your industry *</label>
                        <input
                          type="text"
                          id="customIndustry"
                          value={customIndustry}
                          onChange={(e) => setCustomIndustry(e.target.value)}
                          placeholder="Enter your industry"
                          required
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.targetCommunities}
                        onChange={(e) => handleInputChange('targetCommunities', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Post to all communities
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>💼 Job Details</h2>
                    <p>Describe the role and what you're looking for</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="jobType">Job Type *</label>
                      <select
                        id="jobType"
                        value={formData.jobType}
                        onChange={(e) => handleInputChange('jobType', e.target.value)}
                        required
                      >
                        <option value="">Select Job Type</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="jobCategory">Job Category *</label>
                      <select
                        id="jobCategory"
                        value={formData.jobCategory}
                        onChange={(e) => handleInputChange('jobCategory', e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="design">Design</option>
                        <option value="product">Product</option>
                        <option value="operations">Operations</option>
                        <option value="hr">Human Resources</option>
                        <option value="finance">Finance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="numberOfOpenings">Number of Openings *</label>
                      <input
                        type="number"
                        id="numberOfOpenings"
                        value={formData.numberOfOpenings}
                        onChange={(e) => handleInputChange('numberOfOpenings', e.target.value)}
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="experienceLevel">Experience Level *</label>
                      <select
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        required
                      >
                        <option value="">Select Experience Level</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (3-5 years)</option>
                        <option value="senior">Senior Level (6-10 years)</option>
                        <option value="director">Director Level (10+ years)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Required Skills *</label>
                    <div className="skills-input">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g., Python, React, Excel"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('requiredSkills', newSkill, setNewSkill);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addToList('requiredSkills', newSkill, setNewSkill)}
                        className="add-button"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="skills-tags">
                      {formData.requiredSkills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeFromList('requiredSkills', index)}
                            className="remove-tag"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="jobDescription">Job Description / Responsibilities *</label>
                    <textarea
                      id="jobDescription"
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                      rows="6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Key Qualifications</label>
                    <div className="qualifications-input">
                      <input
                        type="text"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        placeholder="e.g., Bachelor's degree in Computer Science"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('keyQualifications', newQualification, setNewQualification);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addToList('keyQualifications', newQualification, setNewQualification)}
                        className="add-button"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="qualifications-list">
                      {formData.keyQualifications.map((qualification, index) => (
                        <div key={index} className="qualification-item">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span>{qualification}</span>
                          <button
                            type="button"
                            onClick={() => removeFromList('keyQualifications', index)}
                            className="remove-qualification"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Work Setup */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>🌍 Location & Work Setup</h2>
                    <p>Where will this role be based?</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                        <option value="SG">Singapore</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="city">City / State *</label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="workMode">Work Mode *</label>
                      <select
                        id="workMode"
                        value={formData.workMode}
                        onChange={(e) => handleInputChange('workMode', e.target.value)}
                        required
                      >
                        <option value="">Select Work Mode</option>
                        <option value="onsite">Onsite</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="officeAddress">Office Address</label>
                      <input
                        type="text"
                        id="officeAddress"
                        value={formData.officeAddress}
                        onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Compensation */}
              {currentStep === 4 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>💰 Compensation</h2>
                    <p>What will you offer to attract the best talent?</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="salaryType">Salary Type *</label>
                      <select
                        id="salaryType"
                        value={formData.salaryType}
                        onChange={(e) => handleInputChange('salaryType', e.target.value)}
                        required
                      >
                        <option value="">Select Salary Type</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="currency">Currency *</label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        required
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="salaryMin">Minimum Salary *</label>
                      <input
                        type="number"
                        id="salaryMin"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="50000"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="salaryMax">Maximum Salary *</label>
                      <input
                        type="number"
                        id="salaryMax"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        placeholder="70000"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Benefits / Perks</label>
                    <div className="benefits-input">
                      <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="e.g., Health insurance, Paid leave, Stock options"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('benefits', newBenefit, setNewBenefit);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addToList('benefits', newBenefit, setNewBenefit)}
                        className="add-button"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="benefits-tags">
                      {formData.benefits.map((benefit, index) => (
                        <span key={index} className="benefit-tag">
                          {benefit}
                          <button
                            type="button"
                            onClick={() => removeFromList('benefits', index)}
                            className="remove-tag"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Application Details */}
              {currentStep === 5 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>⏳ Application Details</h2>
                    <p>How should candidates apply and when?</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="applicationDeadline">Application Deadline *</label>
                      <input
                        type="date"
                        id="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="applicationMethod">Application Method *</label>
                      <select
                        id="applicationMethod"
                        value={formData.applicationMethod}
                        onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                        required
                      >
                        <option value="platform">Apply via platform</option>
                        <option value="external">External link</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="jobVisibility">Job Visibility *</label>
                      <select
                        id="jobVisibility"
                        value={formData.jobVisibility}
                        onChange={(e) => handleInputChange('jobVisibility', e.target.value)}
                        required
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Screening Questions (Optional)</label>
                    <div className="questions-input">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., What is your experience with React?"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('screeningQuestions', newQuestion, setNewQuestion);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addToList('screeningQuestions', newQuestion, setNewQuestion)}
                        className="add-button"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="questions-list">
                      {formData.screeningQuestions.map((question, index) => (
                        <div key={index} className="question-item">
                          <FontAwesomeIcon icon={faQuestionCircle} />
                          <span>{question}</span>
                          <button
                            type="button"
                            onClick={() => removeFromList('screeningQuestions', index)}
                            className="remove-question"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Preview & Post */}
              {currentStep === 6 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>✅ Preview & Post</h2>
                    <p>Review your job posting before launching it to the stars!</p>
                  </div>
                  
                  <div className="job-preview">
                    <div className="preview-header">
                      <h3>{formData.jobTitle || 'Job Title'}</h3>
                      <p className="company-name">{formData.companyName || 'Company Name'}</p>
                      <div className="job-meta">
                        <span className="job-type">{formData.jobType || 'Job Type'}</span>
                        <span className="job-location">{formData.city || 'Location'}</span>
                        <span className="job-mode">{formData.workMode || 'Work Mode'}</span>
                      </div>
                    </div>
                    
                    <div className="preview-content">
                      <div className="preview-section">
                        <h4>Job Description</h4>
                        <p>{formData.jobDescription || 'No description provided'}</p>
                      </div>
                      
                      <div className="preview-section">
                        <h4>Required Skills</h4>
                        <div className="preview-skills">
                          {formData.requiredSkills.map((skill, index) => (
                            <span key={index} className="preview-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="preview-section">
                        <h4>Compensation</h4>
                        <p>
                          {formData.salaryMin && formData.salaryMax 
                            ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax} ${formData.salaryType}`
                            : 'Salary not specified'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                <div className="nav-buttons">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="nav-button prev-button"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Previous
                    </button>
                  )}
                  
                  <div className="nav-right">
                    <button
                      type="button"
                      onClick={saveDraft}
                      className="nav-button save-button"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Save Draft
                    </button>
                    
                    {currentStep < steps.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="nav-button next-button"
                      >
                        Next
                        <FontAwesomeIcon icon={faArrowLeft} style={{ transform: 'rotate(180deg)' }} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="nav-button submit-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner"></div>
                            Launching...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faRocket} />
                            Launch Job to the Stars!
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
