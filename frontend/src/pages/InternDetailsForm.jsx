import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendar, 
  faMapMarkerAlt,
  faGraduationCap,
  faBriefcase,
  faRocket,
  faArrowRight,
  faArrowLeft,
  faUpload,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { FadeInUp, SlideIn } from '../components/animations';
import { motion } from 'framer-motion';
import '../styles/InternDetailsForm.css';

const InternDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information (pre-filled from signup or existing data)
    fullName: existingData?.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
    email: existingData?.email || userData.email || '',
    mobile: existingData?.mobile || '',
    dateOfBirth: existingData?.dateOfBirth || '',
    gender: existingData?.gender || '',
    currentLocation: existingData?.currentLocation || '',
    currentAddress: existingData?.currentAddress || '',
    addressPinCode: existingData?.addressPinCode || '',
    willingToRelocate: existingData?.willingToRelocate || '',
    linkedInProfile: existingData?.linkedInProfile || '',
    portfolioWebsite: existingData?.portfolioWebsite || '',
    githubProfile: existingData?.githubProfile || '',
    keywords: existingData?.keywords || [],
    
    // Educational Details
    collegeName: existingData?.collegeName || '',
    degree: existingData?.degree || '',
    currentYear: existingData?.currentYear || '',
    graduationYear: existingData?.graduationYear || '',
    cgpa: existingData?.cgpa || '',
    majorSubjects: existingData?.majorSubjects || '',
    
    // Internship Preferences
    internshipType: existingData?.internshipType || [],
    workDomains: existingData?.workDomains || [],
    desiredRole: existingData?.desiredRole || '',
    availabilityStartDate: existingData?.availabilityStartDate || '',
    duration: existingData?.duration || '',
    weeklyAvailability: existingData?.weeklyAvailability || '',
    stipendAmount: existingData?.stipendAmount || '',
    stipendCurrency: existingData?.stipendCurrency || 'USD',
    
    // Skills & Experience
    technicalSkills: existingData?.technicalSkills || [],
    softSkills: existingData?.softSkills || [],
    priorExperience: existingData?.priorExperience || '',
    
    // Career Goals
    postGradRoles: existingData?.postGradRoles || '',
    learningGoals: existingData?.learningGoals || '',
    careerVision: existingData?.careerVision || ''
  });
  
  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState('');

  // Check if editing existing profile
  useEffect(() => {
    if (existingData) {
      console.log('📝 Editing existing intern profile with data:', existingData);
      // Check if there's an existing resume
      if (existingData.resumePath) {
        setHasExistingResume(true);
        console.log('✅ Existing resume found:', existingData.resumePath);
      }
    }
  }, [existingData]);

  const workDomainOptions = [
    'Web Development', 'Mobile App Development', 'Data Science', 
    'Machine Learning', 'UI/UX Design', 'Graphic Design',
    'Digital Marketing', 'Content Writing', 'Social Media Management',
    'Business Development', 'Human Resources', 'Finance & Accounting',
    'Project Management', 'Quality Assurance', 'DevOps',
    'Cybersecurity', 'Cloud Computing', 'Other'
  ];

  const technicalSkillOptions = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js',
    'Angular', 'Vue.js', 'Django', 'Flask', 'SQL', 'MongoDB',
    'HTML/CSS', 'TypeScript', 'Git', 'Docker', 'AWS', 'Azure',
    'Machine Learning', 'Data Analysis', 'Excel', 'Tableau',
    'Photoshop', 'Figma', 'Adobe XD', 'Illustrator'
  ];

  const softSkillOptions = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Time Management', 'Adaptability', 'Critical Thinking',
    'Creativity', 'Attention to Detail', 'Work Ethics'
  ];

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

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      const keyword = keywordInput.trim();
      if (!formData.keywords.includes(keyword)) {
        setFormData(prev => ({
          ...prev,
          keywords: [...prev.keywords, keyword]
        }));
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        setResumeFile(file);
        setErrors(prev => ({ ...prev, resume: '' }));
      } else {
        setErrors(prev => ({ 
          ...prev, 
          resume: 'Please upload a PDF file under 5MB' 
        }));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.currentLocation.trim()) newErrors.currentLocation = 'Current location is required';
      if (!formData.willingToRelocate) newErrors.willingToRelocate = 'Please select relocation preference';
    }

    if (step === 2) {
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
      if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
      if (!formData.currentYear) newErrors.currentYear = 'Current year is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    }

    if (step === 3) {
      if (formData.internshipType.length === 0) newErrors.internshipType = 'Select at least one internship type';
      if (formData.workDomains.length === 0) newErrors.workDomains = 'Select at least one work domain';
      if (!formData.desiredRole.trim()) newErrors.desiredRole = 'Desired role is required';
      if (!formData.availabilityStartDate) newErrors.availabilityStartDate = 'Start date is required';
      if (!formData.duration) newErrors.duration = 'Duration is required';
      if (!formData.weeklyAvailability) newErrors.weeklyAvailability = 'Weekly availability is required';
    }

    if (step === 4) {
      if (formData.technicalSkills.length === 0) newErrors.technicalSkills = 'Select at least one technical skill';
      if (formData.softSkills.length === 0) newErrors.softSkills = 'Select at least one soft skill';
      // Only require resume if not already uploaded
      if (!resumeFile && !hasExistingResume) newErrors.resume = 'Please upload your resume';
    }

    if (step === 5) {
      if (!formData.postGradRoles.trim()) newErrors.postGradRoles = 'Please describe your career interests';
      if (!formData.learningGoals.trim()) newErrors.learningGoals = 'Please list your learning goals';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append resume file
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      const response = await fetch(buildApiUrl('/api/interns/submit-details'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message and redirect to intern dashboard
        navigate('/intern-success', {
          state: {
            internName: formData.fullName,
            email: formData.email,
            isUpdate: !!existingData
          }
        });
      } else {
        setSubmitError(data.error || 'Failed to submit details. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <FadeInUp>
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faUser} /> Personal Information
        </h2>
        <p className="step-description">Let's start with your basic information</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faUser} /> Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faEnvelope} /> Email Address *
            </label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              readOnly
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faPhone} /> Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              className={`form-input ${errors.mobile ? 'error' : ''}`}
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faCalendar} /> Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender (Optional)</label>
            <select
              name="gender"
              className="form-input"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Current City/Location *
            </label>
            <input
              type="text"
              name="currentLocation"
              className={`form-input ${errors.currentLocation ? 'error' : ''}`}
              value={formData.currentLocation}
              onChange={handleInputChange}
              placeholder="City, Country"
            />
            {errors.currentLocation && <span className="error-text">{errors.currentLocation}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Full Address
          </label>
          <textarea
            name="currentAddress"
            className="form-input"
            value={formData.currentAddress}
            onChange={handleInputChange}
            placeholder="Street address, building name, apartment number"
            rows="2"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address PIN/Postal Code</label>
          <input
            type="text"
            name="addressPinCode"
            className="form-input"
            value={formData.addressPinCode}
            onChange={handleInputChange}
            placeholder="Enter postal/PIN code"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Willing to Relocate? *</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="willingToRelocate"
                value="Yes"
                checked={formData.willingToRelocate === 'Yes'}
                onChange={handleInputChange}
              />
              <span>Yes</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="willingToRelocate"
                value="No"
                checked={formData.willingToRelocate === 'No'}
                onChange={handleInputChange}
              />
              <span>No</span>
            </label>
          </div>
          {errors.willingToRelocate && <span className="error-text">{errors.willingToRelocate}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn Profile (Optional)
            </label>
            <input
              type="url"
              name="linkedInProfile"
              className="form-input"
              value={formData.linkedInProfile}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FontAwesomeIcon icon={faGithub} /> GitHub Profile (Optional)
            </label>
            <input
              type="url"
              name="githubProfile"
              className="form-input"
              value={formData.githubProfile}
              onChange={handleInputChange}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Portfolio / Personal Website (Optional)</label>
          <input
            type="url"
            name="portfolioWebsite"
            className="form-input"
            value={formData.portfolioWebsite}
            onChange={handleInputChange}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </FadeInUp>
  );

  const renderStep2 = () => (
    <FadeInUp>
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faGraduationCap} /> Educational Details
        </h2>
        <p className="step-description">Tell us about your academic background</p>

        <div className="form-group">
          <label className="form-label">College / University Name *</label>
          <input
            type="text"
            name="collegeName"
            className={`form-input ${errors.collegeName ? 'error' : ''}`}
            value={formData.collegeName}
            onChange={handleInputChange}
            placeholder="Enter your college or university name"
          />
          {errors.collegeName && <span className="error-text">{errors.collegeName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Degree / Program *</label>
            <input
              type="text"
              name="degree"
              className={`form-input ${errors.degree ? 'error' : ''}`}
              value={formData.degree}
              onChange={handleInputChange}
              placeholder="e.g., B.Tech in Computer Engineering"
            />
            {errors.degree && <span className="error-text">{errors.degree}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Current Year of Study *</label>
            <select
              name="currentYear"
              className={`form-input ${errors.currentYear ? 'error' : ''}`}
              value={formData.currentYear}
              onChange={handleInputChange}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Final Year">Final Year</option>
              <option value="Graduated">Graduated</option>
            </select>
            {errors.currentYear && <span className="error-text">{errors.currentYear}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Graduation Year *</label>
            <input
              type="number"
              name="graduationYear"
              className={`form-input ${errors.graduationYear ? 'error' : ''}`}
              value={formData.graduationYear}
              onChange={handleInputChange}
              placeholder="2025"
              min="2020"
              max="2030"
            />
            {errors.graduationYear && <span className="error-text">{errors.graduationYear}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Academic Performance (CGPA/Percentage) - Optional</label>
            <input
              type="text"
              name="cgpa"
              className="form-input"
              value={formData.cgpa}
              onChange={handleInputChange}
              placeholder="e.g., 8.5/10 or 85%"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Major Subjects or Specializations</label>
          <textarea
            name="majorSubjects"
            className="form-input"
            value={formData.majorSubjects}
            onChange={handleInputChange}
            placeholder="List your major subjects or areas of specialization"
            rows="3"
          />
        </div>
      </div>
    </FadeInUp>
  );

  const renderStep3 = () => (
    <FadeInUp>
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faBriefcase} /> Internship Preferences
        </h2>
        <p className="step-description">Help us match you with the right opportunities</p>

        <div className="form-group">
          <label className="form-label">Preferred Internship Type *</label>
          <div className="checkbox-group">
            {['Remote', 'On-site', 'Hybrid'].map(type => (
              <label key={type} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.internshipType.includes(type)}
                  onChange={() => handleMultiSelect('internshipType', type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
          {errors.internshipType && <span className="error-text">{errors.internshipType}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Work Domains * (Select all that apply)</label>
          <div className="checkbox-grid">
            {workDomainOptions.map(domain => (
              <label key={domain} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.workDomains.includes(domain)}
                  onChange={() => handleMultiSelect('workDomains', domain)}
                />
                <span>{domain}</span>
              </label>
            ))}
          </div>
          {errors.workDomains && <span className="error-text">{errors.workDomains}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Desired Role(s) *</label>
          <input
            type="text"
            name="desiredRole"
            className={`form-input ${errors.desiredRole ? 'error' : ''}`}
            value={formData.desiredRole}
            onChange={handleInputChange}
            placeholder="e.g., Frontend Developer, Content Writer, Marketing Intern"
          />
          {errors.desiredRole && <span className="error-text">{errors.desiredRole}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            🔍 Keywords for AI Matching
          </label>
          <p className="field-description">
            Add keywords that describe your interests to help our AI recommend relevant internships. 
            Examples: "frontend", "react", "machine learning", "content writing", "marketing"
          </p>
          <div className="keywords-input-wrapper">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              className="form-input"
              placeholder="Type a keyword and press Enter"
            />
            <div className="keywords-display">
              {formData.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="keyword-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <p className="help-text">
            💡 Tip: Add 3-5 keywords for better AI recommendations
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Availability Start Date *</label>
            <input
              type="date"
              name="availabilityStartDate"
              className={`form-input ${errors.availabilityStartDate ? 'error' : ''}`}
              value={formData.availabilityStartDate}
              onChange={handleInputChange}
            />
            {errors.availabilityStartDate && <span className="error-text">{errors.availabilityStartDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Duration (in months) *</label>
            <select
              name="duration"
              className={`form-input ${errors.duration ? 'error' : ''}`}
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="">Select Duration</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3-4 months">3-4 months</option>
              <option value="5-6 months">5-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
            {errors.duration && <span className="error-text">{errors.duration}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Weekly Availability *</label>
            <select
              name="weeklyAvailability"
              className={`form-input ${errors.weeklyAvailability ? 'error' : ''}`}
              value={formData.weeklyAvailability}
              onChange={handleInputChange}
            >
              <option value="">Select Availability</option>
              <option value="Full-time (40+ hours/week)">Full-time (40+ hours/week)</option>
              <option value="Part-time (20-30 hours/week)">Part-time (20-30 hours/week)</option>
              <option value="Part-time (10-20 hours/week)">Part-time (10-20 hours/week)</option>
              <option value="Flexible">Flexible</option>
            </select>
            {errors.weeklyAvailability && <span className="error-text">{errors.weeklyAvailability}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Stipend Expectation (Optional)</label>
            <div className="stipend-row">
              <select
                name="stipendAmount"
                className="form-input stipend-amount"
                value={formData.stipendAmount}
                onChange={handleInputChange}
              >
                <option value="">Select Range</option>
                <option value="Unpaid">Unpaid / Open to unpaid</option>
                <option value="0-500">0-500</option>
                <option value="500-1000">500-1000</option>
                <option value="1000-2000">1000-2000</option>
                <option value="2000-5000">2000-5000</option>
                <option value="5000+">5000+</option>
              </select>
              <select
                name="stipendCurrency"
                className="form-input stipend-currency"
                value={formData.stipendCurrency}
                onChange={handleInputChange}
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="INR">₹ INR</option>
                <option value="KES">KSh KES</option>
                <option value="ZAR">R ZAR</option>
                <option value="NGN">₦ NGN</option>
                <option value="AUD">A$ AUD</option>
                <option value="CAD">C$ CAD</option>
                <option value="SGD">S$ SGD</option>
                <option value="AED">د.إ AED</option>
                <option value="JPY">¥ JPY</option>
                <option value="CNY">¥ CNY</option>
              </select>
            </div>
            <p className="help-text">💰 per month</p>
          </div>
        </div>
      </div>
    </FadeInUp>
  );

  const renderStep4 = () => (
    <FadeInUp>
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faRocket} /> Skills & Experience
        </h2>
        <p className="step-description">Showcase your abilities and background</p>

        <div className="form-group">
          <label className="form-label">Technical Skills * (Select all that apply)</label>
          <div className="checkbox-grid">
            {technicalSkillOptions.map(skill => (
              <label key={skill} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.technicalSkills.includes(skill)}
                  onChange={() => handleMultiSelect('technicalSkills', skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
          {errors.technicalSkills && <span className="error-text">{errors.technicalSkills}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Soft Skills * (Select all that apply)</label>
          <div className="checkbox-grid">
            {softSkillOptions.map(skill => (
              <label key={skill} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.softSkills.includes(skill)}
                  onChange={() => handleMultiSelect('softSkills', skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
          {errors.softSkills && <span className="error-text">{errors.softSkills}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Prior Internship or Project Experience (Optional)</label>
          <textarea
            name="priorExperience"
            className="form-input"
            value={formData.priorExperience}
            onChange={handleInputChange}
            placeholder="Describe any previous internships, projects, or relevant experience..."
            rows="5"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUpload} /> Upload Resume (PDF) {!hasExistingResume && '*'}
          </label>
          
          {hasExistingResume && (
            <div className="existing-resume-notice">
              <FontAwesomeIcon icon={faCheck} className="check-icon" />
              <span>You already have a resume uploaded. Upload a new one only if you want to replace it.</span>
            </div>
          )}
          
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="file-input"
            />
            <label htmlFor="resume" className="file-upload-label">
              <FontAwesomeIcon icon={faUpload} />
              {resumeFile ? resumeFile.name : (hasExistingResume ? 'Choose new PDF to replace (Optional)' : 'Choose PDF file (Max 5MB)')}
            </label>
          </div>
          {errors.resume && <span className="error-text">{errors.resume}</span>}
          {resumeFile && (
            <div className="file-selected">
              <FontAwesomeIcon icon={faCheck} className="check-icon" />
              <span>{resumeFile.name} will replace your current resume</span>
            </div>
          )}
        </div>
      </div>
    </FadeInUp>
  );

  const renderStep5 = () => (
    <FadeInUp>
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faRocket} /> Career Goals
        </h2>
        <p className="step-description">Share your aspirations with us</p>

        <div className="form-group">
          <label className="form-label">
            What kind of roles are you interested in after graduation? *
          </label>
          <textarea
            name="postGradRoles"
            className={`form-input ${errors.postGradRoles ? 'error' : ''}`}
            value={formData.postGradRoles}
            onChange={handleInputChange}
            placeholder="Describe the types of roles or industries you're interested in pursuing after graduation..."
            rows="4"
          />
          {errors.postGradRoles && <span className="error-text">{errors.postGradRoles}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            What are your top 3 learning goals from this internship? *
          </label>
          <textarea
            name="learningGoals"
            className={`form-input ${errors.learningGoals ? 'error' : ''}`}
            value={formData.learningGoals}
            onChange={handleInputChange}
            placeholder="1. Learn practical application of web development skills&#10;2. Gain experience in agile project management&#10;3. Build professional network in the tech industry"
            rows="5"
          />
          {errors.learningGoals && <span className="error-text">{errors.learningGoals}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Where do you see yourself professionally in the next 2-3 years? (Optional)
          </label>
          <textarea
            name="careerVision"
            className="form-input"
            value={formData.careerVision}
            onChange={handleInputChange}
            placeholder="Share your professional vision and career aspirations..."
            rows="4"
          />
        </div>
      </div>
    </FadeInUp>
  );

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(step => (
          <div 
            key={step} 
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
          >
            <div className="step-circle">{step}</div>
            <div className="step-label">
              {step === 1 && 'Personal'}
              {step === 2 && 'Education'}
              {step === 3 && 'Preferences'}
              {step === 4 && 'Skills'}
              {step === 5 && 'Goals'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="intern-details-wrapper">
      <header className="intern-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <div className="logo-title">AksharJobs</div>
              <div className="logo-subtitle">Intern Registration</div>
            </div>
          </div>
        </div>
      </header>

      <main className="intern-main">
        <div className="intern-container">
          <SlideIn direction="up">
            <div className="intern-form-card">
              <div className="form-header">
                <h1 className="form-title">
                  {existingData ? '✏️ Edit Your Intern Profile' : 'Complete Your Intern Profile'}
                </h1>
                <p className="form-subtitle">
                  {existingData 
                    ? 'Update your information to get better AI-powered internship recommendations'
                    : 'Help us understand you better to match you with the perfect internship opportunities'
                  }
                </p>
              </div>

              {renderProgressBar()}

              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="error-message-box">
                    {submitError}
                  </div>
                )}

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}

                <div className="form-actions">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Back
                    </motion.button>
                  )}

                  {currentStep < 5 ? (
                    <motion.button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                      <FontAwesomeIcon icon={faArrowRight} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="btn btn-success"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner-small"></div>
                          {existingData ? 'Updating...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          {existingData ? 'Update Profile' : 'Submit Application'}
                          <FontAwesomeIcon icon={faCheck} />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </SlideIn>
        </div>
      </main>
    </div>
  );
};

export default InternDetailsForm;

