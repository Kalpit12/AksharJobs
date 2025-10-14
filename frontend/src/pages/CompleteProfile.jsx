import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faPhone, faMapMarkerAlt, faPassport, faMapMarkedAlt,
  faBriefcase, faBuilding, faGraduationCap, faLightbulb, faLanguage,
  faCertificate, faUsers, faUserCheck, faLink, faSlidersH, faInfoCircle,
  faSpinner, faCheck, faArrowLeft, faSave, faCamera, faPlus, faTimes,
  faGlobe, faClock, faChartLine, faLaptopCode
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  
  // Form data state with all comprehensive fields
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    altPhone: '',
    
    // Nationality & Residency
    nationality: '',
    residentCountry: '',
    currentCity: '',
    postalCode: '',
    address: '',
    latitude: '',
    longitude: '',
    workPermit: '',
    
    // Preferred Working Locations
    preferredLocation1: '',
    preferredLocation2: '',
    preferredLocation3: '',
    willingToRelocate: '',
    workLocation: '',
    
    // Professional Profile
    professionalTitle: '',
    yearsExperience: '',
    careerLevel: '',
    industry: '',
    summary: '',
    
    // Work Experience (array of objects)
    workExperience: [
      {
        jobTitle: '',
        company: '',
        companyLocation: '',
        employmentType: 'full-time',
        jobIndustry: '',
        startDate: '',
        endDate: '',
        currentJob: false,
        jobDescription: ''
      }
    ],
    
    // Education (array of objects)
    education: [
      {
        degreeType: '',
        fieldOfStudy: '',
        institution: '',
        institutionLocation: '',
        grade: '',
        eduStartYear: '',
        eduEndYear: '',
        eduActivities: ''
      }
    ],
    
    // Skills & Competencies
    skills: [],
    tools: [],
    
    // Languages
    languages: [],
    
    // Certifications
    certifications: [],
    
    // Professional Memberships
    professionalMemberships: {
      organizationName: '',
      membershipType: '',
      membershipDate: ''
    },
    
    // Professional References
    references: [],
    
    // Professional Online Presence
    professionalLinks: [],
    
    // Job Preferences
    jobType: '',
    noticePeriod: '',
    currentSalary: '',
    expectedSalary: '',
    currencyPreference: 'USD',
    travelAvailability: '',
    
    // Additional Information
    askCommunity: '',
    hobbies: '',
    additionalComments: '',
    agreeTerms: false,
    allowContact: false
  });
  
  // Temporary input states
  const [skillInput, setSkillInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [languageInput, setLanguageInput] = useState({ language: '', proficiency: '' });
  const [linkInput, setLinkInput] = useState({ type: '', url: '' });
  
  // Countries list
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
    "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan",
    "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
    "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(buildApiUrl('/api/profile/profile'));
      
      if (response && response.ok) {
        const userData = await response.json();
        
        // Map user data to form fields
        setFormData(prev => ({
          ...prev,
          firstName: userData.firstName || '',
          middleName: userData.middleName || '',
          lastName: userData.lastName || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          email: userData.email || '',
          phoneNumber: userData.phone || userData.phoneNumber || '',
          altPhone: userData.altPhone || '',
          nationality: userData.nationality || '',
          residentCountry: userData.residentCountry || '',
          currentCity: userData.currentCity || '',
          postalCode: userData.postalCode || '',
          address: userData.address || '',
          latitude: userData.latitude || '',
          longitude: userData.longitude || '',
          workPermit: userData.workPermit || '',
          preferredLocation1: userData.preferredLocations?.[0] || '',
          preferredLocation2: userData.preferredLocations?.[1] || '',
          preferredLocation3: userData.preferredLocations?.[2] || '',
          willingToRelocate: userData.willingToRelocate || '',
          workLocation: userData.workLocation || '',
          professionalTitle: userData.professionalTitle || '',
          yearsExperience: userData.yearsExperience || '',
          careerLevel: userData.careerLevel || '',
          industry: userData.industry || '',
          summary: userData.summary || '',
          workExperience: userData.workExperience?.length > 0 ? userData.workExperience : prev.workExperience,
          education: userData.education?.length > 0 ? userData.education : prev.education,
          skills: userData.skills || [],
          tools: userData.tools || [],
          languages: userData.languages || [],
          certifications: userData.certifications || [],
          professionalMemberships: userData.professionalMemberships || prev.professionalMemberships,
          references: userData.references || [],
          professionalLinks: userData.professionalLinks || [],
          jobType: userData.jobType || '',
          noticePeriod: userData.noticePeriod || '',
          currentSalary: userData.currentSalary || '',
          expectedSalary: userData.expectedSalary || '',
          currencyPreference: userData.currencyPreference || 'USD',
          travelAvailability: userData.travelAvailability || '',
          askCommunity: userData.askCommunity || '',
          hobbies: userData.hobbies || '',
          additionalComments: userData.additionalComments || '',
          agreeTerms: userData.agreeTerms || false,
          allowContact: userData.allowContact || false
        }));

        if (userData.profileImage) {
          setProfilePhotoPreview(userData.profileImage);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 'nationality', 'residentCountry',
      'currentCity', 'preferredLocation1', 'willingToRelocate', 'workLocation',
      'professionalTitle', 'yearsExperience', 'careerLevel', 'industry', 'summary',
      'jobType', 'noticePeriod'
    ];
    
    let filledCount = 0;
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].toString().trim() !== '') {
        filledCount++;
      }
    });
    
    // Bonus for optional sections
    if (formData.skills.length > 0) filledCount += 2;
    if (formData.languages.length > 0) filledCount += 2;
    if (formData.workExperience[0].jobTitle) filledCount += 2;
    if (formData.education[0].institution) filledCount += 2;
    
    const progressPercentage = Math.min((filledCount / (requiredFields.length + 8)) * 100, 100);
    setProgress(progressPercentage);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Skills management
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Tools management
  const addTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, toolInput.trim()]
      }));
      setToolInput('');
    }
  };

  const removeTool = (index) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
  };

  // Languages management
  const addLanguage = () => {
    if (languageInput.language.trim() && languageInput.proficiency) {
      const languageExists = formData.languages.some(
        lang => lang.language.toLowerCase() === languageInput.language.toLowerCase()
      );
      
      if (!languageExists) {
        setFormData(prev => ({
          ...prev,
          languages: [...prev.languages, { ...languageInput }]
        }));
        setLanguageInput({ language: '', proficiency: '' });
      }
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Professional links management
  const addLink = () => {
    if (linkInput.type && linkInput.url.trim()) {
      try {
        new URL(linkInput.url);
        setFormData(prev => ({
          ...prev,
          professionalLinks: [...prev.professionalLinks, { ...linkInput }]
        }));
        setLinkInput({ type: '', url: '' });
      } catch (e) {
        alert('Please enter a valid URL (including https://)');
      }
    } else {
      alert('Please select a link type and enter a URL');
    }
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalLinks: prev.professionalLinks.filter((_, i) => i !== index)
    }));
  };

  // Work experience management
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        jobTitle: '',
        company: '',
        companyLocation: '',
        employmentType: 'full-time',
        jobIndustry: '',
        startDate: '',
        endDate: '',
        currentJob: false,
        jobDescription: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    if (formData.workExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter((_, i) => i !== index)
      }));
    }
  };

  // Education management
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degreeType: '',
        fieldOfStudy: '',
        institution: '',
        institutionLocation: '',
        grade: '',
        eduStartYear: '',
        eduEndYear: '',
        eduActivities: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  // Reference management
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, {
        referenceName: '',
        referenceTitle: '',
        referenceCompany: '',
        referenceRelationship: '',
        referenceEmail: '',
        referencePhone: ''
      }]
    }));
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  // Certification management
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        certificationName: '',
        certIssuer: '',
        certIssueDate: '',
        certExpiryDate: '',
        credentialId: ''
      }]
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.skills.length === 0) {
      alert('Please add at least one skill');
      return;
    }
    
    if (formData.languages.length === 0) {
      alert('Please add at least one language');
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setSaving(true);
    setMessage('');

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        preferredLocations: [
          formData.preferredLocation1,
          formData.preferredLocation2,
          formData.preferredLocation3
        ].filter(loc => loc !== '')
      };

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile'),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        }
      );

      if (response && response.ok) {
        setMessage('Profile updated successfully! Redirecting to dashboard...');
        setTimeout(() => navigate('/jobseeker-dashboard'), 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="complete-profile-page loading-state">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complete-profile-page">
      <div className="profile-container-wrapper">
        {/* Header with gradient background */}
        <div className="profile-header-gradient">
          <div className="global-icon">
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <h1>Create Job Seeker Profile</h1>
          <p>Create a comprehensive profile</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <form className="comprehensive-profile-form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faUser} />
              Personal Information
            </h2>

            {/* Profile Photo Upload */}
            <div className="profile-photo-section">
              {profilePhotoPreview && (
                <div className="profile-photo-preview">
                  <img src={profilePhotoPreview} alt="Profile" />
                </div>
              )}
              <label className="file-upload-label" htmlFor="profilePhoto">
                <FontAwesomeIcon icon={faCamera} />
                <div className="file-upload-text">
                  <strong>Upload Profile Photo</strong>
                  <p>Click to browse or drag and drop</p>
                </div>
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Enter your middle name"
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-row-2">
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
              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="form-group">
                <label>Alternative Phone</label>
                <input
                  type="tel"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Nationality & Residency Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faPassport} />
              Nationality & Residency
            </h2>

            <div className="form-row-2">
              <div className="form-group">
                <label>Nationality <span className="required">*</span></label>
                <select name="nationality" value={formData.nationality} onChange={handleInputChange} required>
                  <option value="">Select your nationality</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Resident Country <span className="required">*</span></label>
                <select name="residentCountry" value={formData.residentCountry} onChange={handleInputChange} required>
                  <option value="">Select your current country of residence</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Current City <span className="required">*</span></label>
                <input
                  type="text"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div className="form-group">
                <label>Postal/ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Full Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, building, apartment number"
              />
            </div>

            <div className="form-group">
              <label>Do you have a valid work permit for your resident country? <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="workPermit"
                    value="yes"
                    checked={formData.workPermit === 'yes'}
                    onChange={handleInputChange}
                    required
                  />
                  Yes
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="workPermit"
                    value="no"
                    checked={formData.workPermit === 'no'}
                    onChange={handleInputChange}
                    required
                  />
                  No
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="workPermit"
                    value="citizen"
                    checked={formData.workPermit === 'citizen'}
                    onChange={handleInputChange}
                    required
                  />
                  Citizen/Not Required
                </label>
              </div>
            </div>
          </div>

          {/* Preferred Working Locations Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              Preferred Working Locations
            </h2>

            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              This helps match you with opportunities in your preferred locations
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Preferred Location 1 <span className="required">*</span></label>
                <select name="preferredLocation1" value={formData.preferredLocation1} onChange={handleInputChange} required>
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Location 2</label>
                <select name="preferredLocation2" value={formData.preferredLocation2} onChange={handleInputChange}>
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Location 3</label>
                <select name="preferredLocation3" value={formData.preferredLocation3} onChange={handleInputChange}>
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Willing to Relocate Internationally? <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="willingToRelocate"
                    value="yes"
                    checked={formData.willingToRelocate === 'yes'}
                    onChange={handleInputChange}
                    required
                  />
                  Yes, immediately
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="willingToRelocate"
                    value="conditional"
                    checked={formData.willingToRelocate === 'conditional'}
                    onChange={handleInputChange}
                    required
                  />
                  Yes, with conditions
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="willingToRelocate"
                    value="no"
                    checked={formData.willingToRelocate === 'no'}
                    onChange={handleInputChange}
                    required
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Work Location Preference <span className="required">*</span></label>
              <select name="workLocation" value={formData.workLocation} onChange={handleInputChange} required>
                <option value="">Select preference</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="flexible">Flexible/Open to all</option>
              </select>
            </div>
          </div>

          {/* Professional Profile Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faBriefcase} />
              Professional Profile
            </h2>

            <div className="form-group">
              <label>Professional Title/Headline <span className="required">*</span></label>
              <input
                type="text"
                name="professionalTitle"
                value={formData.professionalTitle}
                onChange={handleInputChange}
                required
                placeholder="e.g., Senior Software Engineer | Full Stack Developer"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Total Years of Experience <span className="required">*</span></label>
                <select name="yearsExperience" value={formData.yearsExperience} onChange={handleInputChange} required>
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-7">5-7 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10-15">10-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label>Career Level <span className="required">*</span></label>
                <select name="careerLevel" value={formData.careerLevel} onChange={handleInputChange} required>
                  <option value="">Select level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead/Principal</option>
                  <option value="manager">Manager</option>
                  <option value="director">Director</option>
                  <option value="executive">Executive/C-Level</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Industry/Sector <span className="required">*</span></label>
              <select name="industry" value={formData.industry} onChange={handleInputChange} required>
                <option value="">Select your primary industry</option>
                <option value="technology">Technology & IT</option>
                <option value="finance">Finance & Banking</option>
                <option value="healthcare">Healthcare & Medical</option>
                <option value="education">Education & Training</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="hospitality">Hospitality & Tourism</option>
                <option value="construction">Construction & Real Estate</option>
                <option value="agriculture">Agriculture & Agribusiness</option>
                <option value="energy">Energy & Utilities</option>
                <option value="telecommunications">Telecommunications</option>
                <option value="media">Media & Entertainment</option>
                <option value="consulting">Consulting & Professional Services</option>
                <option value="government">Government & Public Sector</option>
                <option value="ngo">NGO & Non-Profit</option>
                <option value="legal">Legal Services</option>
                <option value="marketing">Marketing & Advertising</option>
                <option value="logistics">Logistics & Transportation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Professional Summary <span className="required">*</span></label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                placeholder="Write a compelling summary about your professional background, key achievements, and career goals. Highlight what makes you unique and valuable to potential employers globally. (Minimum 150 characters)"
                rows="5"
              />
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faBuilding} />
              Work Experience
            </h2>
            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              List all relevant work experience starting with the most recent
            </div>

            {formData.workExperience.map((exp, index) => (
              <div key={index} className="experience-item">
                {formData.workExperience.length > 1 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeExperience(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Job Title <span className="required">*</span></label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleNestedChange('workExperience', index, 'jobTitle', e.target.value)}
                    required
                    placeholder="e.g., Senior Marketing Manager"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Company Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleNestedChange('workExperience', index, 'company', e.target.value)}
                      required
                      placeholder="e.g., ABC Corporation"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company Location</label>
                    <input
                      type="text"
                      value={exp.companyLocation}
                      onChange={(e) => handleNestedChange('workExperience', index, 'companyLocation', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Employment Type</label>
                    <select
                      value={exp.employmentType}
                      onChange={(e) => handleNestedChange('workExperience', index, 'employmentType', e.target.value)}
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Industry</label>
                    <input
                      type="text"
                      value={exp.jobIndustry}
                      onChange={(e) => handleNestedChange('workExperience', index, 'jobIndustry', e.target.value)}
                      placeholder="e.g., Technology, Finance"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Start Date <span className="required">*</span></label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleNestedChange('workExperience', index, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleNestedChange('workExperience', index, 'endDate', e.target.value)}
                      disabled={exp.currentJob}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id={`currentJob${index}`}
                    checked={exp.currentJob}
                    onChange={(e) => handleNestedChange('workExperience', index, 'currentJob', e.target.checked)}
                  />
                  <label htmlFor={`currentJob${index}`}>I currently work here</label>
                </div>

                <div className="form-group">
                  <label>Key Responsibilities & Achievements</label>
                  <textarea
                    value={exp.jobDescription}
                    onChange={(e) => handleNestedChange('workExperience', index, 'jobDescription', e.target.value)}
                    placeholder="• Led team of 10 marketing professionals&#10;• Increased revenue by 45% through strategic campaigns&#10;• Managed $500K annual budget"
                    rows="4"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addExperience}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Position
            </button>
          </div>

          {/* Education Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faGraduationCap} />
              Education
            </h2>

            {formData.education.map((edu, index) => (
              <div key={index} className="education-item">
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeEducation(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Degree/Certificate <span className="required">*</span></label>
                  <select
                    value={edu.degreeType}
                    onChange={(e) => handleNestedChange('education', index, 'degreeType', e.target.value)}
                    required
                  >
                    <option value="">Select degree type</option>
                    <option value="high-school">High School Diploma</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">Doctorate/PhD</option>
                    <option value="professional">Professional Degree</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Field of Study <span className="required">*</span></label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleNestedChange('education', index, 'fieldOfStudy', e.target.value)}
                    required
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                </div>

                <div className="form-group">
                  <label>Institution Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleNestedChange('education', index, 'institution', e.target.value)}
                    required
                    placeholder="e.g., University of Nairobi"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Institution Location</label>
                    <input
                      type="text"
                      value={edu.institutionLocation}
                      onChange={(e) => handleNestedChange('education', index, 'institutionLocation', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="form-group">
                    <label>Grade/GPA</label>
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) => handleNestedChange('education', index, 'grade', e.target.value)}
                      placeholder="e.g., 3.8/4.0, First Class"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Start Year <span className="required">*</span></label>
                    <input
                      type="number"
                      value={edu.eduStartYear}
                      onChange={(e) => handleNestedChange('education', index, 'eduStartYear', e.target.value)}
                      required
                      min="1950"
                      max="2030"
                      placeholder="2018"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Year (or Expected)</label>
                    <input
                      type="number"
                      value={edu.eduEndYear}
                      onChange={(e) => handleNestedChange('education', index, 'eduEndYear', e.target.value)}
                      min="1950"
                      max="2035"
                      placeholder="2022"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Activities & Achievements</label>
                  <textarea
                    value={edu.eduActivities}
                    onChange={(e) => handleNestedChange('education', index, 'eduActivities', e.target.value)}
                    placeholder="Academic honors, relevant coursework, extracurricular activities"
                    rows="3"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addEducation}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Education
            </button>
          </div>

          {/* Skills Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faLightbulb} />
              Skills & Competencies
            </h2>

            <div className="form-group">
              <label>Core Skills <span className="required">*</span></label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faInfoCircle} />
                Add skills relevant to your profession and job preferences
              </div>
              <div className="skills-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Enter a skill (e.g., Python, Project Management)"
                />
                <button type="button" className="add-btn" onClick={addSkill}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              </div>
              <div className="tags-container">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <span className="remove" onClick={() => removeSkill(index)}>×</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Software & Tools</label>
              <div className="skills-input-container">
                <input
                  type="text"
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                  placeholder="Enter software/tool (e.g., Microsoft Excel, AutoCAD)"
                />
                <button type="button" className="add-btn" onClick={addTool}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              </div>
              <div className="tags-container">
                {formData.tools.map((tool, index) => (
                  <span key={index} className="tag">
                    {tool}
                    <span className="remove" onClick={() => removeTool(index)}>×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faLanguage} />
              Languages
            </h2>

            <div className="form-group">
              <label>Languages & Proficiency Levels <span className="required">*</span></label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faInfoCircle} />
                Language skills are crucial for international opportunities
              </div>
              <div className="language-proficiency">
                <input
                  type="text"
                  value={languageInput.language}
                  onChange={(e) => setLanguageInput(prev => ({ ...prev, language: e.target.value }))}
                  placeholder="Enter language (e.g., English)"
                />
                <select
                  value={languageInput.proficiency}
                  onChange={(e) => setLanguageInput(prev => ({ ...prev, proficiency: e.target.value }))}
                >
                  <option value="">Select Level</option>
                  <option value="native">Native/Bilingual</option>
                  <option value="fluent">Fluent</option>
                  <option value="advanced">Advanced</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
              <button type="button" className="add-btn" onClick={addLanguage} style={{ marginTop: '10px' }}>
                <FontAwesomeIcon icon={faPlus} /> Add Language
              </button>
              <div className="tags-container">
                {formData.languages.map((lang, index) => (
                  <span key={index} className="tag">
                    {lang.language} - {lang.proficiency}
                    <span className="remove" onClick={() => removeLanguage(index)}>×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faCertificate} />
              Certifications & Licenses
            </h2>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <button
                  type="button"
                  className="remove-item-btn-inline"
                  onClick={() => removeCertification(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Certification/License Name</label>
                    <input
                      type="text"
                      value={cert.certificationName}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].certificationName = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      placeholder="e.g., PMP, AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.certIssuer}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].certIssuer = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      placeholder="e.g., Project Management Institute"
                    />
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input
                      type="month"
                      value={cert.certIssueDate}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].certIssueDate = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="month"
                      value={cert.certExpiryDate}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].certExpiryDate = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].credentialId = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      placeholder="Certificate number/ID"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addCertification}>
              <FontAwesomeIcon icon={faPlus} /> Add Certification
            </button>
          </div>

          {/* Professional Memberships Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faUsers} />
              Professional Memberships & Associations
            </h2>

            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                value={formData.professionalMemberships.organizationName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  professionalMemberships: { ...prev.professionalMemberships, organizationName: e.target.value }
                }))}
                placeholder="e.g., IEEE, PMI, Institute of Accountants"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Membership Type</label>
                <input
                  type="text"
                  value={formData.professionalMemberships.membershipType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    professionalMemberships: { ...prev.professionalMemberships, membershipType: e.target.value }
                  }))}
                  placeholder="e.g., Professional Member, Fellow"
                />
              </div>
              <div className="form-group">
                <label>Membership Since</label>
                <input
                  type="month"
                  value={formData.professionalMemberships.membershipDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    professionalMemberships: { ...prev.professionalMemberships, membershipDate: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Professional References Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faUserCheck} />
              Professional References
            </h2>

            {formData.references.map((ref, index) => (
              <div key={index} className="reference-item">
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeReference(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Reference Name</label>
                    <input
                      type="text"
                      value={ref.referenceName}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referenceName = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={ref.referenceTitle}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referenceTitle = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="Position"
                    />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Company/Organization</label>
                    <input
                      type="text"
                      value={ref.referenceCompany}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referenceCompany = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={ref.referenceRelationship}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referenceRelationship = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="e.g., Former Manager, Colleague"
                    />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={ref.referenceEmail}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referenceEmail = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={ref.referencePhone}
                      onChange={(e) => {
                        const newRefs = [...formData.references];
                        newRefs[index].referencePhone = e.target.value;
                        setFormData(prev => ({ ...prev, references: newRefs }));
                      }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addReference}>
              <FontAwesomeIcon icon={faPlus} /> Add Reference
            </button>
          </div>

          {/* Professional Online Presence Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faLink} />
              Professional Online Presence
            </h2>
            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              Add your professional online profiles and portfolio links
            </div>

            <div className="form-row-2" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Link Type</label>
                <select
                  value={linkInput.type}
                  onChange={(e) => setLinkInput(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Select link type</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Personal Website">Personal Website/Portfolio</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="Behance">Behance</option>
                  <option value="Dribbble">Dribbble</option>
                  <option value="Medium">Medium</option>
                  <option value="Stack Overflow">Stack Overflow</option>
                  <option value="Other">Other Professional</option>
                </select>
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={linkInput.url}
                  onChange={(e) => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/yourprofile"
                />
              </div>
            </div>
            <button type="button" className="add-btn" onClick={addLink} style={{ marginBottom: '20px' }}>
              <FontAwesomeIcon icon={faPlus} /> Add Link
            </button>

            <div className="links-container">
              {formData.professionalLinks.map((link, index) => (
                <div key={index} className="link-item">
                  <div className="link-item-content">
                    <div className="link-item-type">
                      <FontAwesomeIcon icon={faLink} /> {link.type}
                    </div>
                    <div className="link-item-url">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                  </div>
                  <button type="button" className="remove-link-btn" onClick={() => removeLink(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Preferences Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faSlidersH} />
              Job Preferences & Availability
            </h2>

            <div className="form-row-2">
              <div className="form-group">
                <label>Desired Job Type <span className="required">*</span></label>
                <select name="jobType" value={formData.jobType} onChange={handleInputChange} required>
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notice Period <span className="required">*</span></label>
                <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} required>
                  <option value="">Select notice period</option>
                  <option value="immediate">Immediate/Available Now</option>
                  <option value="1-week">1 Week</option>
                  <option value="2-weeks">2 Weeks</option>
                  <option value="1-month">1 Month</option>
                  <option value="2-months">2 Months</option>
                  <option value="3-months">3 Months</option>
                  <option value="more">More than 3 Months</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Current Salary (Optional)</label>
                <input
                  type="text"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., USD 50,000 per year"
                />
              </div>
              <div className="form-group">
                <label>Expected Salary</label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., USD 60,000 - 70,000 per year"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Currency Preference</label>
                <select name="currencyPreference" value={formData.currencyPreference} onChange={handleInputChange}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Travel Availability</label>
                <select name="travelAvailability" value={formData.travelAvailability} onChange={handleInputChange}>
                  <option value="">Select availability</option>
                  <option value="no-travel">No Travel</option>
                  <option value="minimal">Minimal (Less than 25%)</option>
                  <option value="moderate">Moderate (25-50%)</option>
                  <option value="frequent">Frequent (50-75%)</option>
                  <option value="extensive">Extensive (More than 75%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faInfoCircle} />
              Additional Information
            </h2>

            <div className="form-group">
              <label>Ask Community</label>
              <textarea
                name="askCommunity"
                value={formData.askCommunity}
                onChange={handleInputChange}
                placeholder="Do you have any questions for the community? Share them here."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Hobbies & Interests</label>
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                placeholder="Share your interests outside of work (optional but helps employers understand you better)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Additional Comments</label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                placeholder="Any other information you'd like to share with potential employers"
                rows="3"
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agreeTerms">
                I agree to the Terms of Service and Privacy Policy <span className="required">*</span>
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="allowContact"
                name="allowContact"
                checked={formData.allowContact}
                onChange={handleInputChange}
              />
              <label htmlFor="allowContact">
                I agree to be contacted by employers and recruiters
              </label>
            </div>
          </div>

          {/* Submit Section */}
          {message && (
            <div className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="submit-section">
            <button type="button" className="btn-secondary" onClick={() => navigate('/jobseeker-dashboard')}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Dashboard
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Saving Profile...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  Create Job Seeker Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
