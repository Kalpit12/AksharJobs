import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, 
  faBuilding, 
  faMapMarkerAlt, 
  faDollarSign, 
  faCalendar,
  faCheckCircle,
  faSpinner,
  faSave,
  faArrowLeft,
  faEye,
  faRocket,
  faWandMagicSparkles,
  faTimes,
  faPlus,
  faUpload,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
import AIJobDescriptionGenerator from '../components/AIJobDescriptionGenerator';
import '../styles/ModernJobPosting.css';

const ModernJobPosting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showPreview, setShowPreview] = useState(true);

  const [formData, setFormData] = useState({
    // Job Details
    jobTitle: '',
    jobType: 'Full-time',
    jobCategory: '',
    numberOfOpenings: 1,
    experienceLevel: 'Mid-Level',
    requiredSkills: [],
    jobDescription: '',
    keyQualifications: '',
    
    // Company Info
    companyName: '',
    companyLogo: null,
    companyWebsite: '',
    companySize: '',
    industry: '',
    
    // Location & Work Setup
    country: '',
    city: '',
    state: '',
    workMode: 'Hybrid',
    officeAddress: '',
    
    // Compensation
    salaryType: 'Yearly',
    currency: 'USD',
    salaryMin: '',
    salaryMax: '',
    benefits: [],
    
    // Application Details
    applicationDeadline: '',
    applicationMethod: 'Platform',
    externalLink: '',
    contactEmail: '',
    jobVisibility: 'Public',
    screeningQuestions: [],
    
    // Meta
    isDraft: false
  });

  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
  const jobCategories = [
    'Engineering', 'Marketing', 'Sales', 'Design', 'Product',
    'Customer Support', 'Finance', 'HR', 'Operations', 'Data Science',
    'Legal', 'Other'
  ];
  const experienceLevels = ['Entry', 'Mid-Level', 'Senior', 'Director', 'Executive'];
  const workModes = ['On-site', 'Hybrid', 'Remote'];
  const salaryTypes = ['Monthly', 'Yearly', 'Hourly'];
  const applicationMethods = ['Platform', 'External Link', 'Email'];
  const visibilityOptions = ['Public', 'Private'];

  useEffect(() => {
    fetchInitialData();
    fetchCountriesAndCurrencies();
    
    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (!formData.isDraft) {
        handleAutoSave();
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );

      if (response && response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          industry: data.industry || '',
          companySize: data.companySize || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountriesAndCurrencies = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      
      const countryList = data.map(country => ({
        name: country.name.common,
        code: country.cca2
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(countryList);
      
      const currencySet = new Set();
      data.forEach(country => {
        if (country.currencies) {
          Object.keys(country.currencies).forEach(curr => currencySet.add(curr));
        }
      });
      setCurrencies(Array.from(currencySet).sort());
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, skillInput.trim()]
        }));
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const handleAddBenefit = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
        setFormData(prev => ({
          ...prev,
          benefits: [...prev.benefits, benefitInput.trim()]
        }));
        setBenefitInput('');
      }
    }
  };

  const removeBenefit = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  const handleAddQuestion = () => {
    if (questionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        screeningQuestions: [...prev.screeningQuestions, questionInput.trim()]
      }));
      setQuestionInput('');
    }
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleAutoSave = async () => {
    if (!formData.jobTitle) return; // Don't auto-save empty forms
    
    setAutoSaving(true);
    try {
      await handleSubmit(null, true);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const calculateQualityScore = () => {
    let score = 0;
    const maxScore = 100;
    
    if (formData.jobTitle) score += 10;
    if (formData.jobDescription && formData.jobDescription.length > 100) score += 15;
    if (formData.keyQualifications) score += 10;
    if (formData.requiredSkills.length >= 3) score += 15;
    if (formData.salaryMin && formData.salaryMax) score += 15;
    if (formData.benefits.length >= 3) score += 10;
    if (formData.country && formData.city) score += 10;
    if (formData.applicationDeadline) score += 5;
    if (formData.companyName) score += 5;
    if (formData.numberOfOpenings) score += 5;
    
    return score;
  };

  const getQualityLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: '#10b981' };
    if (score >= 60) return { label: 'Good', color: '#3b82f6' };
    if (score >= 40) return { label: 'Fair', color: '#f59e0b' };
    return { label: 'Needs Improvement', color: '#ef4444' };
  };

  const handleSubmit = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    
    if (!isDraft) setSaving(true);
    setMessage({ type: '', text: '' });

    // Validation for publishing (not for drafts)
    if (!isDraft && (!formData.jobTitle || !formData.jobDescription || !formData.country)) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setSaving(false);
      return;
    }

    try {
      const jobData = {
        // Use both old and new format for compatibility
        title: formData.jobTitle,
        jobTitle: formData.jobTitle,
        company: formData.companyName,
        companyName: formData.companyName,
        company_website: formData.companyWebsite,
        companyWebsite: formData.companyWebsite,
        
        // Job Details
        job_type: formData.jobType,
        jobType: formData.jobType,
        job_category: formData.jobCategory,
        number_of_openings: formData.numberOfOpenings,
        experience_level: formData.experienceLevel,
        experienceLevel: formData.experienceLevel,
        required_skills: formData.requiredSkills,
        skills: formData.requiredSkills.join(', '),
        description: formData.jobDescription,
        key_qualifications: formData.keyQualifications,
        responsibilities: formData.keyQualifications,
        
        // Location
        country: formData.country,
        city: formData.city,
        state: formData.state,
        location: `${formData.city}, ${formData.state ? formData.state + ', ' : ''}${formData.country}`,
        work_mode: formData.workMode,
        workMode: formData.workMode,
        remoteOption: formData.workMode,
        office_address: formData.officeAddress,
        
        // Compensation
        salary_type: formData.salaryType,
        salary_currency: formData.currency,
        salaryCurrency: formData.currency,
        salary_min: formData.salaryMin,
        salaryMin: formData.salaryMin,
        salary_max: formData.salaryMax,
        salaryMax: formData.salaryMax,
        salary_range: formData.salaryMin && formData.salaryMax 
          ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax} ${formData.salaryType.toLowerCase()}`
          : '',
        salaryRange: formData.salaryMin && formData.salaryMax 
          ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax} ${formData.salaryType.toLowerCase()}`
          : '',
        benefits: formData.benefits,
        
        // Application
        application_deadline: formData.applicationDeadline,
        deadline: formData.applicationDeadline,
        application_method: formData.applicationMethod,
        external_link: formData.externalLink,
        contact_email: formData.contactEmail,
        job_visibility: formData.jobVisibility,
        screening_questions: formData.screeningQuestions,
        
        // Company
        industry: formData.industry,
        company_size: formData.companySize,
        
        // Meta
        is_draft: isDraft,
        quality_score: calculateQualityScore()
      };

      console.log('📤 Posting job:', jobData);

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/jobs/add_job'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData)
        }
      );

      if (response && response.ok) {
        const result = await response.json();
        
        if (!isDraft) {
          setMessage({ type: 'success', text: 'Job posted successfully!' });
          setTimeout(() => navigate('/recruiter-dashboard'), 2000);
        }
        
        return result;
      } else {
        const error = await response.json();
        if (!isDraft) {
          setMessage({ type: 'error', text: error.error || error.message || 'Failed to post job' });
        }
      }
    } catch (error) {
      console.error('Error posting job:', error);
      if (!isDraft) {
        setMessage({ type: 'error', text: 'Failed to post job. Please try again.' });
      }
    } finally {
      if (!isDraft) setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    handleSubmit(null, true);
    setMessage({ type: 'success', text: 'Draft saved successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <ModernLoadingSpinner text="Loading form..." />;
  }

  const qualityScore = calculateQualityScore();
  const qualityInfo = getQualityLabel(qualityScore);

  const steps = [
    { id: 1, title: 'Company Info', icon: faBuilding },
    { id: 2, title: 'Job Details', icon: faBriefcase },
    { id: 3, title: 'Compensation', icon: faDollarSign },
    { id: 4, title: 'Application', icon: faCheckCircle }
  ];

  return (
    <div className="modern-job-posting">
      {/* Header */}
      <div className="posting-header">
        <button 
          className="back-button"
          onClick={() => navigate('/recruiter-dashboard')}
          type="button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Dashboard</span>
        </button>

        <div className="header-content">
          <h1><FontAwesomeIcon icon={faRocket} /> Post a New Job</h1>
          <p>Create a compelling job listing to attract top talent</p>
        </div>

        <div className="auto-save-indicator">
          {autoSaving && (
            <span className="saving">
              <FontAwesomeIcon icon={faSpinner} spin />
              Auto-saving...
            </span>
          )}
          {!autoSaving && formData.jobTitle && (
            <span className="saved">
              <FontAwesomeIcon icon={faCheckCircle} />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="step-circle">
              <FontAwesomeIcon icon={currentStep > step.id ? faCheckCircle : step.icon} />
            </div>
            <span className="step-label">{step.title}</span>
          </div>
        ))}
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faTimes} />
          {message.text}
        </div>
      )}

      <div className="posting-container">
        {/* Left Panel - Company Info (Always visible) */}
        <div className="left-panel">
          <div className="panel-card">
            <h3><FontAwesomeIcon icon={faBuilding} /> Company Information</h3>
            
            <div className="form-group">
              <label>Company Logo</label>
              <div className="logo-upload">
                {formData.companyLogo ? (
                  <div className="logo-preview">
                    <img src={URL.createObjectURL(formData.companyLogo)} alt="Logo" />
                    <button onClick={() => setFormData(prev => ({ ...prev, companyLogo: null }))}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      name="companyLogo"
                      onChange={handleChange}
                      accept="image/*"
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="form-group">
              <label>Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://company.com"
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <select name="industry" value={formData.industry} onChange={handleChange}>
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Company Size</label>
              <select name="companySize" value={formData.companySize} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Middle Panel - Main Form */}
        <div className="middle-panel">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Info - Already in left panel */}
            
            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2>💼 Job Details</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Number of Openings</label>
                    <input
                      type="number"
                      name="numberOfOpenings"
                      value={formData.numberOfOpenings}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Job Type *</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Job Category / Department</label>
                    <select name="jobCategory" value={formData.jobCategory} onChange={handleChange}>
                      <option value="">Select category</option>
                      {jobCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Experience Level *</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Required Skills *</label>
                  <div className="tags-input">
                    <div className="tags-display">
                      {formData.requiredSkills.map((skill, index) => (
                        <span key={index} className="tag">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Type skill and press Enter or comma"
                    />
                  </div>
                  <small>Add key skills required for this role</small>
                </div>

                <div className="form-group">
                  <label>Job Description / Responsibilities *</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    rows="8"
                    required
                  />
                  <div className="char-count">{formData.jobDescription.length} characters</div>
                </div>

                <div className="form-group">
                  <label>Key Qualifications</label>
                  <textarea
                    name="keyQualifications"
                    value={formData.keyQualifications}
                    onChange={handleChange}
                    placeholder="List the must-have qualifications and preferred qualifications..."
                    rows="5"
                  />
                </div>

                {/* AI Job Description Generator */}
                <div className="ai-generator-section">
                  <AIJobDescriptionGenerator 
                    onGenerated={(data) => {
                      setFormData(prev => ({
                        ...prev,
                        jobDescription: data.description,
                        keyQualifications: data.responsibilities.join('\n'),
                        requiredSkills: data.skills || prev.requiredSkills
                      }));
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Compensation */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2>💰 Compensation & Benefits</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Salary Type</label>
                    <select name="salaryType" value={formData.salaryType} onChange={handleChange}>
                      {salaryTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange}>
                      {['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'CNY', 'KES', 'ZAR'].map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Salary Range - Minimum</label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      placeholder="50000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Salary Range - Maximum</label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      placeholder="70000"
                    />
                  </div>
                </div>

                {formData.salaryMin && formData.salaryMax && (
                  <div className="salary-preview">
                    <strong>Preview:</strong> {formData.currency} {formData.salaryMin} - {formData.salaryMax} {formData.salaryType.toLowerCase()}
                  </div>
                )}

                <div className="form-group">
                  <label>Benefits / Perks</label>
                  <div className="tags-input">
                    <div className="tags-display">
                      {formData.benefits.map((benefit, index) => (
                        <span key={index} className="tag benefit-tag">
                          {benefit}
                          <button type="button" onClick={() => removeBenefit(benefit)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={handleAddBenefit}
                      placeholder="Type benefit and press Enter (e.g., Health Insurance)"
                    />
                  </div>
                  <small>Examples: Health Insurance, 401k, Paid Leave, Remote Work, Gym Membership</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country *</label>
                    <select name="country" value={formData.country} onChange={handleChange} required>
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., San Francisco"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State / Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g., California"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Work Mode *</label>
                    <select name="workMode" value={formData.workMode} onChange={handleChange} required>
                      {workModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.workMode !== 'Remote' && (
                  <div className="form-group">
                    <label>Office Address</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleChange}
                      placeholder="Enter full office address"
                      rows="3"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Application Details */}
            {currentStep === 4 && (
              <div className="form-step">
                <h2>⏳ Application Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Application Deadline</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Visibility</label>
                    <select name="jobVisibility" value={formData.jobVisibility} onChange={handleChange}>
                      {visibilityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Application Method</label>
                  <select name="applicationMethod" value={formData.applicationMethod} onChange={handleChange}>
                    {applicationMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {formData.applicationMethod === 'External Link' && (
                  <div className="form-group">
                    <label>External Application Link</label>
                    <input
                      type="url"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleChange}
                      placeholder="https://careers.company.com/job123"
                    />
                  </div>
                )}

                {formData.applicationMethod === 'Email' && (
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="hiring@company.com"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Screening Questions (Optional)</label>
                  <div className="questions-list">
                    {formData.screeningQuestions.map((question, index) => (
                      <div key={index} className="question-item">
                        <span>{index + 1}. {question}</span>
                        <button type="button" onClick={() => removeQuestion(index)}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="question-input">
                    <input
                      type="text"
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      placeholder="Enter a screening question"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                    />
                    <button type="button" onClick={handleAddQuestion} className="add-question-btn">
                      <FontAwesomeIcon icon={faPlus} /> Add Question
                    </button>
                  </div>
                  <small>These questions will be asked when candidates apply</small>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  Previous
                </button>
              )}
              
              <button type="button" className="btn btn-outline" onClick={handleSaveDraft}>
                <FontAwesomeIcon icon={faSave} /> Save as Draft
              </button>

              {currentStep < 4 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRocket} />
                      Post Job
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Panel - Live Preview */}
        {showPreview && (
          <div className="right-panel">
            <div className="panel-card preview-card">
              <div className="preview-header">
                <h3><FontAwesomeIcon icon={faEye} /> Live Preview</h3>
                <button onClick={() => setShowPreview(false)} className="close-preview">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Quality Score */}
              <div className="quality-score">
                <div className="score-label">Job Listing Quality</div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${qualityScore}%`,
                      backgroundColor: qualityInfo.color
                    }}
                  />
                </div>
                <div className="score-info">
                  <span style={{ color: qualityInfo.color }}>{qualityScore}%</span>
                  <span>{qualityInfo.label}</span>
                </div>
              </div>

              {/* Job Preview */}
              <div className="job-preview">
                <div className="preview-company">
                  {formData.companyLogo ? (
                    <img src={URL.createObjectURL(formData.companyLogo)} alt="Logo" className="company-logo-preview" />
                  ) : (
                    <div className="logo-placeholder"><FontAwesomeIcon icon={faBuilding} /></div>
                  )}
                  <div>
                    <h4>{formData.companyName || 'Company Name'}</h4>
                    <p>{formData.industry || 'Industry'}</p>
                  </div>
                </div>

                <h3 className="preview-title">{formData.jobTitle || 'Job Title'}</h3>

                <div className="preview-details">
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{formData.city || 'City'}, {formData.country || 'Country'}</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faBriefcase} />
                    <span>{formData.jobType} • {formData.workMode}</span>
                  </div>
                  {formData.salaryMin && formData.salaryMax && (
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faDollarSign} />
                      <span>{formData.currency} {formData.salaryMin} - {formData.salaryMax}</span>
                    </div>
                  )}
                  {formData.applicationDeadline && (
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faClock} />
                      <span>Apply by {new Date(formData.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {formData.requiredSkills.length > 0 && (
                  <div className="preview-skills">
                    {formData.requiredSkills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                    {formData.requiredSkills.length > 5 && (
                      <span className="skill-badge more">+{formData.requiredSkills.length - 5} more</span>
                    )}
                  </div>
                )}

                {formData.jobDescription && (
                  <div className="preview-description">
                    <h5>Description</h5>
                    <p>{formData.jobDescription.substring(0, 200)}...</p>
                  </div>
                )}

                {formData.benefits.length > 0 && (
                  <div className="preview-benefits">
                    <h5>Benefits</h5>
                    <div className="benefits-list">
                      {formData.benefits.slice(0, 4).map((benefit, index) => (
                        <span key={index} className="benefit-badge">✓ {benefit}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!showPreview && (
          <button className="show-preview-btn" onClick={() => setShowPreview(true)}>
            <FontAwesomeIcon icon={faEye} /> Show Preview
          </button>
        )}
      </div>
    </div>
  );
};

export default ModernJobPosting;

