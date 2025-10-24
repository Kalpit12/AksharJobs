import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faCalendar, faMapMarkerAlt,
  faGraduationCap, faBriefcase, faRocket, faUpload, faCheck,
  faInfoCircle, faCamera, faGlobe, faPlus, faTimes,
  faPassport, faMapMarked, faBullseye, faLightbulb, faLanguage,
  faCertificate, faUsers, faUserCheck, faLink, faSlidersH,
  faBuilding, faCheckCircle, faTrash
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAutoSave } from '../hooks/useAutoSave';
import AutoSaveStatus from '../components/AutoSaveStatus';
import '../styles/InternRegistrationForm.css';

// Import Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const InternRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  
  // Auto-save configuration
  const AUTOSAVE_KEY = `intern_registration_${user?.userId || 'temp'}`;
  
  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.userId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(buildApiUrl(`/api/users/profile/${user.userId}`), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const profileData = await response.json();
            setUserProfileData(profileData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user?.userId]);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: userData.firstName || user?.firstName || '',
    lastName: userData.lastName || user?.lastName || '',
    middleName: userData.middleName || user?.middleName || '',
    email: userData.email || user?.email || '',
    phone: userData.phone || user?.phone || '',
    altPhone: userData.altPhone || user?.altPhone || '',
    dateOfBirth: userData.dateOfBirth || user?.dateOfBirth || '',
    gender: userData.gender || user?.gender || '',
    community: userData.community || user?.community || '',
    
    // Nationality & Residency
    nationality: userData.nationality || user?.nationality || '',
    residentCountry: userData.residentCountry || user?.residentCountry || '',
    currentCity: userData.currentCity || user?.currentCity || '',
    postalCode: userData.postalCode || user?.postalCode || '',
    address: userData.address || user?.address || '',
    latitude: userData.latitude || user?.latitude || '',
    longitude: userData.longitude || user?.longitude || '',
    validDocs: userData.validDocs || user?.validDocs || '',
    
    // Professional Profile
    professionalTitle: userData.professionalTitle || user?.professionalTitle || '',
    yearsExperience: userData.yearsExperience || user?.yearsExperience || '',
    careerLevel: userData.careerLevel || user?.careerLevel || '',
    industry: userData.industry || user?.industry || '',
    summary: userData.summary || user?.summary || '',
    
    // Skills
    coreSkills: userData.coreSkills || user?.coreSkills || [],
    tools: userData.tools || user?.tools || [],
    languages: userData.languages || user?.languages || [],
    
    // Experience and Education
    experienceEntries: userData.experienceEntries || user?.experienceEntries || [{
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    educationEntries: userData.educationEntries || user?.educationEntries || [{
      degreeType: '',
      fieldOfStudy: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    }],
    certificationEntries: userData.certificationEntries || user?.certificationEntries || [{
      certificationName: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    }],
    
    // References
    referenceEntries: userData.referenceEntries || user?.referenceEntries || [{
      referenceName: '',
      referenceTitle: '',
      referenceCompany: '',
      referenceRelationship: '',
      referenceEmail: '',
      referencePhone: ''
    }],
    
    // Professional Online Presence
    professionalLinks: userData.professionalLinks || user?.professionalLinks || [],
    
    // Internship Preferences
    internshipType: userData.internshipType || user?.internshipType || '',
    availability: userData.availability || user?.availability || '',
    expectedStipend: userData.expectedStipend || user?.expectedStipend || '',
    currencyPreference: userData.currencyPreference || user?.currencyPreference || 'USD',
    travelAvailability: userData.travelAvailability || user?.travelAvailability || '',
    
    // Additional Information
    askCommunity: userData.askCommunity || user?.askCommunity || '',
    hobbies: userData.hobbies || user?.hobbies || '',
    additionalComments: userData.additionalComments || user?.additionalComments || '',
    agreeTerms: userData.agreeTerms || user?.agreeTerms || false,
    allowContact: userData.allowContact || user?.allowContact || false
  });

  const [skillInput, setSkillInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [languageInput, setLanguageInput] = useState({ language: '', proficiency: '' });
  const [linkInput, setLinkInput] = useState({ type: '', url: '' });
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Auto-save hook
  const { saveData, isSaving, lastSaved } = useAutoSave(AUTOSAVE_KEY, formData);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (field, index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }));
  };

  const addArrayItem = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.coreSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        coreSkills: [...prev.coreSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      coreSkills: prev.coreSkills.filter((_, i) => i !== index)
    }));
  };

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

  const addLanguage = () => {
    if (languageInput.language.trim() && languageInput.proficiency) {
      const newLanguage = { ...languageInput };
      if (!formData.languages.some(l => l.language === newLanguage.language)) {
        setFormData(prev => ({
          ...prev,
          languages: [...prev.languages, newLanguage]
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
        alert('Please enter a valid URL');
      }
    }
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalLinks: prev.professionalLinks.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024) {
        alert('Profile photo must be 50KB or smaller. Please compress your image.');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone',
      'nationality', 'residentCountry', 'currentCity', 'professionalTitle',
      'careerLevel', 'industry', 'summary', 'agreeTerms'
    ];

    let filled = 0;
    requiredFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        filled++;
      }
    });

    if (formData.coreSkills.length > 0) filled += 2;
    if (formData.languages.length > 0) filled += 2;

    const progress = Math.min((filled / requiredFields.length) * 100, 100);
    setProgressPercentage(progress);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Age verification - User must be 18 or older
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year yet
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
        // Clear user session and redirect to homepage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        sessionStorage.clear();
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }
    }
    
    if (formData.coreSkills.length === 0) {
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

    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'profilePhoto' && formData[key]) {
          formDataToSend.append('profilePhoto', formData[key]);
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(buildApiUrl('/api/intern/profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmitError('✓ Profile created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/intern-dashboard');
        }, 2000);
      } else {
        // Check if this is an age restriction error
        if (responseData.age_restriction) {
          alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
          // Clear user session and redirect to homepage
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userFirstName');
          localStorage.removeItem('userLastName');
          sessionStorage.clear();
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          setSubmitError(responseData.message || responseData.error || 'Error creating profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="jobseeker-details-comprehensive">
      {/* Header */}
      <header className="jobseeker-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-section" onClick={() => navigate('/intern-dashboard')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon">
                <img src="/logo192.png" alt="AksharJobs" />
              </div>
              <div className="logo-text">
                <h1 className="logo-title">AksharJobs</h1>
                <p className="logo-subtitle">Intern Registration</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <AutoSaveStatus isSaving={isSaving} lastSaved={lastSaved} />
            <button
              type="button"
              className="clear-form-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all form data?')) {
                  window.location.reload();
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              Clear Form Data
            </button>
          </div>
        </div>
      </header>

      <main className="jobseeker-main">
        <div className="jobseeker-container">
          <div className="jobseeker-form-card">
            {/* Main Form */}
            <div className="jobseeker-form-container">
        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className="error-banner" style={{
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: submitError.includes('✓') ? '#d4edda' : '#f8d7da',
              color: submitError.includes('✓') ? '#155724' : '#721c24',
              border: submitError.includes('✓') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
            }}>
              {submitError}
            </div>
          )}

          {/* Compact Progress Section */}
          <div className="progress-section-comprehensive">
            <div className="progress-header-comprehensive">
              <h2>Profile Progress</h2>
              <span className="progress-percentage-comprehensive">{progressPercentage}%</span>
            </div>
            <div className="progress-bar-comprehensive">
              <div className="progress-fill-comprehensive" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

        {/* Personal Information Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faUser} />
            Personal Information
          </h2>

          {profilePhotoPreview && (
            <div className="profile-photo-preview-comprehensive" style={{ display: 'block' }}>
              <img src={profilePhotoPreview} alt="Profile Photo" />
            </div>
          )}

          <div className="form-group-comprehensive">
            <label className="file-upload-comprehensive" htmlFor="profilePhoto">
              <FontAwesomeIcon icon={faCamera} />
              <div className="file-upload-text">
                <strong>Upload Photo</strong>
                <p>Click to browse or drag and drop</p>
                <small>Max: 50KB</small>
              </div>
              <input 
                type="file" 
                id="profilePhoto" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>First Name <span className="required-comprehensive">*</span></label>
              <input 
                type="text" 
                name="firstName" 
                required 
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Middle Name</label>
              <input 
                type="text" 
                name="middleName" 
                placeholder="Enter your middle name"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Last Name <span className="required-comprehensive">*</span></label>
              <input 
                type="text" 
                name="lastName" 
                required 
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Date of Birth <span className="required-comprehensive">*</span></label>
              <input 
                type="date" 
                name="dateOfBirth" 
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Gender <span className="required-comprehensive">*</span></label>
              <select 
                name="gender" 
                required
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Email Address <span className="required-comprehensive">*</span></label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Phone Number <span className="required-comprehensive">*</span></label>
              <input 
                type="tel" 
                name="phone" 
                required 
                placeholder="+254 700 000 000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Alternative Phone</label>
              <input 
                type="tel" 
                name="altPhone" 
                placeholder="+1 234 567 8900"
                value={formData.altPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Community</label>
              <input 
                type="text" 
                name="community" 
                placeholder="Enter your community"
                value={formData.community}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Nationality & Residency Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faPassport} />
            Nationality & Residency
          </h2>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Nationality <span className="required-comprehensive">*</span></label>
              <select 
                name="nationality" 
                required
                value={formData.nationality}
                onChange={handleInputChange}
              >
                <option value="">Select your nationality</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="form-group-comprehensive">
              <label>Resident Country <span className="required-comprehensive">*</span></label>
              <select 
                name="residentCountry" 
                required
                value={formData.residentCountry}
                onChange={handleInputChange}
              >
                <option value="">Select your current country of residence</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Current City <span className="required-comprehensive">*</span></label>
              <input 
                type="text" 
                name="currentCity" 
                required 
                placeholder="e.g., Nairobi"
                value={formData.currentCity}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Postal/ZIP Code</label>
              <input 
                type="text" 
                name="postalCode" 
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Full Address</label>
            <input 
              type="text" 
              name="address" 
              placeholder="Street address, building, apartment number"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Professional Profile Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faBriefcase} />
            Professional Profile
          </h2>

          <div className="form-group-comprehensive">
            <label>Professional Title <span className="required-comprehensive">*</span></label>
            <input 
              type="text" 
              name="professionalTitle" 
              required 
              placeholder="e.g., Software Developer Intern, Marketing Intern"
              value={formData.professionalTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Years of Experience</label>
              <select 
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
              >
                <option value="">Select experience level</option>
                <option value="0">No experience</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <div className="form-group-comprehensive">
              <label>Career Level <span className="required-comprehensive">*</span></label>
              <select 
                name="careerLevel" 
                required
                value={formData.careerLevel}
                onChange={handleInputChange}
              >
                <option value="">Select career level</option>
                <option value="student">Student</option>
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior-level">Senior Level</option>
              </select>
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Industry <span className="required-comprehensive">*</span></label>
            <select 
              name="industry" 
              required
              value={formData.industry}
              onChange={handleInputChange}
            >
              <option value="">Select primary industry</option>
              <option value="technology">Technology & IT</option>
              <option value="finance">Finance & Banking</option>
              <option value="healthcare">Healthcare & Medical</option>
              <option value="education">Education & Training</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing & Advertising</option>
              <option value="consulting">Consulting</option>
              <option value="media">Media & Entertainment</option>
              <option value="hospitality">Hospitality & Tourism</option>
              <option value="retail">Retail & E-commerce</option>
              <option value="ngo">NGO & Non-Profit</option>
              <option value="government">Government & Public Sector</option>
              <option value="legal">Legal Services</option>
              <option value="agriculture">Agriculture & Agribusiness</option>
              <option value="real-estate">Real Estate & Construction</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group-comprehensive">
            <label>Professional Summary <span className="required-comprehensive">*</span></label>
            <textarea 
              name="summary" 
              required 
              placeholder="Write a brief summary of your professional background, skills, and career goals..."
              value={formData.summary}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faLightbulb} />
            Skills & Competencies
          </h2>

          <div className="form-group-comprehensive">
            <label>Core Skills <span className="required-comprehensive">*</span></label>
            <div className="skills-input-container-comprehensive">
              <input 
                type="text" 
                placeholder="e.g., JavaScript, Python, React"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button type="button" onClick={addSkill} className="add-skill-btn-comprehensive">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="skills-tags-comprehensive">
              {formData.coreSkills.map((skill, index) => (
                <span key={index} className="skill-tag-comprehensive">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Tools & Technologies</label>
            <div className="skills-input-container-comprehensive">
              <input 
                type="text" 
                placeholder="e.g., VS Code, Git, Docker"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
              />
              <button type="button" onClick={addTool} className="add-skill-btn-comprehensive">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="skills-tags-comprehensive">
              {formData.tools.map((tool, index) => (
                <span key={index} className="skill-tag-comprehensive">
                  {tool}
                  <button type="button" onClick={() => removeTool(index)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Languages <span className="required-comprehensive">*</span></label>
            <div className="language-input-container-comprehensive">
              <input 
                type="text" 
                placeholder="Language"
                value={languageInput.language}
                onChange={(e) => setLanguageInput(prev => ({ ...prev, language: e.target.value }))}
              />
              <select 
                value={languageInput.proficiency}
                onChange={(e) => setLanguageInput(prev => ({ ...prev, proficiency: e.target.value }))}
              >
                <option value="">Proficiency</option>
                <option value="native">Native</option>
                <option value="fluent">Fluent</option>
                <option value="advanced">Advanced</option>
                <option value="intermediate">Intermediate</option>
                <option value="basic">Basic</option>
              </select>
              <button type="button" onClick={addLanguage} className="add-skill-btn-comprehensive">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="skills-tags-comprehensive">
              {formData.languages.map((lang, index) => (
                <span key={index} className="skill-tag-comprehensive">
                  {lang.language} - {lang.proficiency}
                  <button type="button" onClick={() => removeLanguage(index)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="submit-section-comprehensive">
          <button type="submit" className="submit-btn-comprehensive" disabled={isLoading}>
            <FontAwesomeIcon icon={faCheckCircle} />
            {isLoading ? 'Creating Profile...' : 'Create Internship Profile'}
          </button>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Your profile will be visible to companies offering internships nationally and internationally
          </p>
        </div>
        </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InternRegistrationForm;