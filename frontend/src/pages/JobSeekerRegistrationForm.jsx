import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faGraduationCap, 
  faBriefcase, 
  faBrain,
  faBullseye,
  faRocket,
  faInfoCircle,
  faCheck,
  faTimes,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/JobSeekerRegistrationForm.css';

const JobSeekerRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData || {};

  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: userData.firstName ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData.email || '',
    mobileNumber: '',
    countryCode: '+1',
    dateOfBirth: '',
    gender: '',
    currentLocationCountry: '',
    currentLocationCity: '',
    willingToRelocate: '',
    nationality: '',
    linkedinProfile: '',
    portfolioWebsite: '',
    profilePhoto: null,

    // Education Details
    highestEducationLevel: '',
    fieldOfStudy: '',
    institutionName: '',
    countryOfInstitution: '',
    graduationYear: '',
    academicPerformance: '',
    relevantCoursework: '',

    // Employment Information
    currentEmploymentStatus: '',
    yearsOfExperience: '',
    mostRecentJobTitle: '',
    mostRecentCompany: '',
    employmentType: '',
    workExperienceSummary: '',
    resumeFile: null,

    // Skills & Expertise
    technicalSkills: [],
    softSkills: [],
    languagesKnown: [],
    certifications: '',

    // Job Preferences
    jobTypes: [],
    preferredWorkMode: '',
    preferredIndustries: [],
    preferredJobRoles: '',
    preferredCountryOfWork: '',
    preferredCities: [],
    expectedSalaryCurrency: 'USD',
    expectedSalaryAmount: '',
    availabilityToJoin: '',
    desiredWorkHours: '',
    jobKeywords: '',

    // Career Goals
    shortTermGoal: '',
    longTermGoal: '',
    preferredCompanyType: '',
    motivationForJobChange: '',

    // Additional Information
    validWorkPermit: '',
    requireVisaSponsorship: '',
    openToRelocation: '',
    willingToTravel: '',
    ownLaptopAndInternet: '',
    physicalLimitations: '',
    howDidYouHear: ''
  });

  // Country codes for phone numbers
  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+254', country: 'Kenya' },
    { code: '+255', country: 'Tanzania' },
    { code: '+256', country: 'Uganda' },
    { code: '+234', country: 'Nigeria' },
    { code: '+27', country: 'South Africa' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' }
  ];

  // Fetch countries from API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const countryList = data.map(country => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
        
        // Extract currencies
        const currencySet = new Set();
        data.forEach(country => {
          if (country.currencies) {
            Object.keys(country.currencies).forEach(curr => currencySet.add(curr));
          }
        });
        setCurrencies(Array.from(currencySet).sort());
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  const handleTagInput = (name, value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      [name]: tags
    }));
  };

  const validateSection = (section) => {
    switch(section) {
      case 1:
        return formData.fullName && formData.email && formData.mobileNumber && formData.dateOfBirth;
      case 2:
        return formData.highestEducationLevel && formData.fieldOfStudy;
      case 3:
        return formData.currentEmploymentStatus && formData.yearsOfExperience;
      case 4:
        return formData.technicalSkills.length > 0 || formData.softSkills.length > 0;
      case 5:
        return formData.jobTypes.length > 0 && formData.preferredWorkMode;
      case 6:
        return formData.shortTermGoal && formData.longTermGoal;
      case 7:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitError('Please fill in all required fields before proceeding.');
      setTimeout(() => setSubmitError(''), 3000);
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            submitData.append(key, JSON.stringify(formData[key]));
          } else if (formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        // Show success and redirect
        navigate('/jobseeker-registration-success', { 
          state: { fromRegistration: true } 
        });
      } else {
        setSubmitError(data.error || 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 1, icon: faUser, title: 'Personal Information' },
    { id: 2, icon: faGraduationCap, title: 'Education Details' },
    { id: 3, icon: faBriefcase, title: 'Employment Information' },
    { id: 4, icon: faBrain, title: 'Skills & Expertise' },
    { id: 5, icon: faBullseye, title: 'Job Preferences' },
    { id: 6, icon: faRocket, title: 'Career Goals' },
    { id: 7, icon: faInfoCircle, title: 'Additional Information' }
  ];

  return (
    <div className="jobseeker-registration-container">
      <div className="registration-header">
        <h1>👨‍💼 Job Seeker Registration Form</h1>
        <p>Complete your profile to unlock all features and get matched with the perfect opportunities</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-steps">
          {sections.map((section) => (
            <div 
              key={section.id}
              className={`progress-step ${currentSection === section.id ? 'active' : ''} ${currentSection > section.id ? 'completed' : ''}`}
              onClick={() => currentSection > section.id && setCurrentSection(section.id)}
            >
              <div className="step-circle">
                {currentSection > section.id ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={section.icon} />
                )}
              </div>
              <span className="step-label">{section.title}</span>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentSection / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {submitError && (
        <div className="error-banner">
          <FontAwesomeIcon icon={faTimes} />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Section 1: Personal Information */}
        {currentSection === 1 && (
          <div className="form-section">
            <h2>🧍‍♂️ Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number <span className="required">*</span></label>
                <div className="phone-input-group">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="country-code-select"
                  >
                    {countryCodes.map(cc => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code} ({cc.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date of Birth <span className="required">*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nationality</label>
                <select name="nationality" value={formData.nationality} onChange={handleInputChange}>
                  <option value="">Select nationality</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Location - Country</label>
                <select 
                  name="currentLocationCountry" 
                  value={formData.currentLocationCountry} 
                  onChange={handleInputChange}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Current Location - City</label>
                <input
                  type="text"
                  name="currentLocationCity"
                  value={formData.currentLocationCity}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Willing to Relocate?</label>
                <select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleInputChange}>
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Portfolio / GitHub / Personal Website</label>
                <input
                  type="url"
                  name="portfolioWebsite"
                  value={formData.portfolioWebsite}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profile Photo Upload (JPG/PNG)</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleInputChange}
                accept="image/jpeg,image/png"
              />
            </div>
          </div>
        )}

        {/* Section 2: Education Details */}
        {currentSection === 2 && (
          <div className="form-section">
            <h2>🎓 Education Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Highest Education Level <span className="required">*</span></label>
                <select 
                  name="highestEducationLevel" 
                  value={formData.highestEducationLevel} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="Ph.D.">Ph.D.</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Field of Study <span className="required">*</span></label>
                <select 
                  name="fieldOfStudy" 
                  value={formData.fieldOfStudy} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select field</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Business">Business</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Arts">Arts</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Law">Law</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Institution / University Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  placeholder="Enter institution name"
                />
              </div>

              <div className="form-group">
                <label>Country of Institution</label>
                <select 
                  name="countryOfInstitution" 
                  value={formData.countryOfInstitution} 
                  onChange={handleInputChange}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Graduation Year</label>
                <select 
                  name="graduationYear" 
                  value={formData.graduationYear} 
                  onChange={handleInputChange}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 41 }, (_, i) => 2030 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Academic Performance (Optional)</label>
                <input
                  type="text"
                  name="academicPerformance"
                  value={formData.academicPerformance}
                  onChange={handleInputChange}
                  placeholder="CGPA / Percentage"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Relevant Coursework / Certifications</label>
              <textarea
                name="relevantCoursework"
                value={formData.relevantCoursework}
                onChange={handleInputChange}
                placeholder="List relevant coursework or certifications"
                rows="4"
              />
            </div>
          </div>
        )}

        {/* Section 3: Employment Information */}
        {currentSection === 3 && (
          <div className="form-section">
            <h2>💼 Employment Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Current Employment Status <span className="required">*</span></label>
                <select 
                  name="currentEmploymentStatus" 
                  value={formData.currentEmploymentStatus} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Student">Student</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Self-employed">Self-employed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Years of Experience <span className="required">*</span></label>
                <select 
                  name="yearsOfExperience" 
                  value={formData.yearsOfExperience} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select experience</option>
                  <option value="Fresher (0 years)">Fresher (0 years)</option>
                  <option value="0-1 year">0-1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Most Recent Job Title</label>
                <input
                  type="text"
                  name="mostRecentJobTitle"
                  value={formData.mostRecentJobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Developer"
                />
              </div>

              <div className="form-group">
                <label>Most Recent Company</label>
                <input
                  type="text"
                  name="mostRecentCompany"
                  value={formData.mostRecentCompany}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Employment Type</label>
                <select 
                  name="employmentType" 
                  value={formData.employmentType} 
                  onChange={handleInputChange}
                >
                  <option value="">Select type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Work Experience Summary</label>
              <textarea
                name="workExperienceSummary"
                value={formData.workExperienceSummary}
                onChange={handleInputChange}
                placeholder="Briefly describe your responsibilities and achievements"
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Resume Upload (PDF only)</label>
              <input
                type="file"
                name="resumeFile"
                onChange={handleInputChange}
                accept="application/pdf"
              />
            </div>
          </div>
        )}

        {/* Section 4: Skills & Expertise */}
        {currentSection === 4 && (
          <div className="form-section">
            <h2>🧠 Skills & Expertise</h2>
            
            <div className="form-group full-width">
              <label>Technical Skills (separate with commas)</label>
              <input
                type="text"
                name="technicalSkills"
                onChange={(e) => handleTagInput('technicalSkills', e.target.value)}
                placeholder="e.g., Python, ReactJS, Excel, Data Analysis, Java, SQL"
              />
              <div className="tags-display">
                {formData.technicalSkills.map((skill, index) => (
                  <span key={index} className="tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Soft Skills (separate with commas)</label>
              <input
                type="text"
                name="softSkills"
                onChange={(e) => handleTagInput('softSkills', e.target.value)}
                placeholder="e.g., Communication, Leadership, Teamwork, Creativity"
              />
              <div className="tags-display">
                {formData.softSkills.map((skill, index) => (
                  <span key={index} className="tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Languages Known (separate with commas)</label>
              <input
                type="text"
                name="languagesKnown"
                onChange={(e) => handleTagInput('languagesKnown', e.target.value)}
                placeholder="e.g., English, Hindi, Swahili, French, Mandarin"
              />
              <div className="tags-display">
                {formData.languagesKnown.map((lang, index) => (
                  <span key={index} className="tag">{lang}</span>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Certifications / Licenses</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="List relevant certifications (e.g., Google Data Analytics, AWS Certified, etc.)"
                rows="4"
              />
            </div>
          </div>
        )}

        {/* Section 5: Job Preferences */}
        {currentSection === 5 && (
          <div className="form-section">
            <h2>🎯 Job Preferences</h2>
            
            <div className="form-group full-width">
              <label>Job Type <span className="required">*</span></label>
              <div className="checkbox-group">
                {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance'].map(type => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.jobTypes.includes(type)}
                      onChange={() => handleMultiSelect('jobTypes', type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Work Mode <span className="required">*</span></label>
                <select 
                  name="preferredWorkMode" 
                  value={formData.preferredWorkMode} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select work mode</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Availability to Join</label>
                <select 
                  name="availabilityToJoin" 
                  value={formData.availabilityToJoin} 
                  onChange={handleInputChange}
                >
                  <option value="">Select availability</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 15 days">Within 15 days</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="2-3 months">2-3 months</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Preferred Industry / Sector</label>
              <div className="checkbox-group">
                {['IT', 'Finance', 'Healthcare', 'Marketing', 'Design', 'Education', 'Engineering', 'Retail', 'Logistics', 'Consulting', 'Media', 'NGO', 'Government', 'Manufacturing'].map(industry => (
                  <label key={industry} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.preferredIndustries.includes(industry)}
                      onChange={() => handleMultiSelect('preferredIndustries', industry)}
                    />
                    {industry}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Preferred Job Roles / Titles</label>
              <input
                type="text"
                name="preferredJobRoles"
                value={formData.preferredJobRoles}
                onChange={handleInputChange}
                placeholder="e.g., Software Developer, Data Analyst, Graphic Designer"
              />
            </div>

            <div className="form-group full-width">
              <label>Job Keywords (for worldwide job search)</label>
              <input
                type="text"
                name="jobKeywords"
                value={formData.jobKeywords}
                onChange={handleInputChange}
                placeholder="e.g., remote, python, senior, startup, fintech"
              />
              <small>These keywords will help match you with relevant jobs worldwide</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Country of Work</label>
                <select 
                  name="preferredCountryOfWork" 
                  value={formData.preferredCountryOfWork} 
                  onChange={handleInputChange}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Desired Work Hours</label>
                <select 
                  name="desiredWorkHours" 
                  value={formData.desiredWorkHours} 
                  onChange={handleInputChange}
                >
                  <option value="">Select work hours</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Salary / Compensation</label>
                <div className="salary-input-group">
                  <select
                    name="expectedSalaryCurrency"
                    value={formData.expectedSalaryCurrency}
                    onChange={handleInputChange}
                    className="currency-select"
                  >
                    {['USD', 'EUR', 'GBP', 'INR', 'KES', 'AED', 'AUD', 'CAD', 'JPY', 'CNY'].map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="expectedSalaryAmount"
                    value={formData.expectedSalaryAmount}
                    onChange={handleInputChange}
                    placeholder="Annual amount"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Career Goals */}
        {currentSection === 6 && (
          <div className="form-section">
            <h2>🚀 Career Goals</h2>
            
            <div className="form-group full-width">
              <label>Short-Term Career Goal (1-2 years) <span className="required">*</span></label>
              <textarea
                name="shortTermGoal"
                value={formData.shortTermGoal}
                onChange={handleInputChange}
                placeholder="Describe your career objective for the next 1-2 years"
                rows="4"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Long-Term Career Goal (3-5 years) <span className="required">*</span></label>
              <textarea
                name="longTermGoal"
                value={formData.longTermGoal}
                onChange={handleInputChange}
                placeholder="Describe your long-term career vision"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Company Type</label>
                <select 
                  name="preferredCompanyType" 
                  value={formData.preferredCompanyType} 
                  onChange={handleInputChange}
                >
                  <option value="">Select company type</option>
                  <option value="Startup">Startup</option>
                  <option value="SME">SME</option>
                  <option value="Corporate">Corporate</option>
                  <option value="NGO">NGO</option>
                  <option value="Government">Government</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Motivation for Job Change (Optional)</label>
              <textarea
                name="motivationForJobChange"
                value={formData.motivationForJobChange}
                onChange={handleInputChange}
                placeholder="Share your motivation (optional)"
                rows="4"
              />
            </div>
          </div>
        )}

        {/* Section 7: Additional Information */}
        {currentSection === 7 && (
          <div className="form-section">
            <h2>📊 Additional Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Do you have a valid work permit for your preferred country?</label>
                <select 
                  name="validWorkPermit" 
                  value={formData.validWorkPermit} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div className="form-group">
                <label>Do you require visa sponsorship?</label>
                <select 
                  name="requireVisaSponsorship" 
                  value={formData.requireVisaSponsorship} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Are you open to relocation?</label>
                <select 
                  name="openToRelocation" 
                  value={formData.openToRelocation} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Willing to Travel for Work?</label>
                <select 
                  name="willingToTravel" 
                  value={formData.willingToTravel} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Own a laptop and stable internet connection?</label>
                <select 
                  name="ownLaptopAndInternet" 
                  value={formData.ownLaptopAndInternet} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label>How did you hear about us?</label>
                <select 
                  name="howDidYouHear" 
                  value={formData.howDidYouHear} 
                  onChange={handleInputChange}
                >
                  <option value="">Select option</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="College">College</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Any physical limitations to consider (optional)</label>
              <textarea
                name="physicalLimitations"
                value={formData.physicalLimitations}
                onChange={handleInputChange}
                placeholder="Please share if there are any physical limitations we should consider"
                rows="3"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentSection > 1 && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={prevSection}
            >
              Previous
            </button>
          )}
          
          {currentSection < 7 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={nextSection}
            >
              Next Section
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Submitting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Complete Registration
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobSeekerRegistrationForm;

