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
  faBuilding, faCheckCircle, faTrash, faSave, faEdit, faProjectDiagram,
  faAward
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAutoSave } from '../hooks/useAutoSave';
import LocationMap from '../components/LocationMap';
import '../styles/InternRegistrationForm.css';

const InternRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;

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

  // Backend save callback for auto-save hook
  const backendSaveCallback = React.useCallback(async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️  No token found, skipping backend auto-save');
        return;
      }

      const formDataToSend = new FormData();
      
      // Append all fields
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          formDataToSend.append(key, JSON.stringify(data[key]));
        } else if (data[key] instanceof File) {
          formDataToSend.append(key, data[key]);
        } else {
          formDataToSend.append(key, data[key]);
        }
      });
      
      // Mark as draft
      formDataToSend.append('profileCompleted', 'false');
      formDataToSend.append('isDraft', 'true');
      formDataToSend.append('draftSavedAt', new Date().toISOString());
      
      console.log('💾 Auto-saving to backend...');

      const response = await fetch(buildApiUrl('/api/intern/profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        console.log('✅ Auto-saved to backend successfully');
        return true;
      } else {
        console.error('❌ Backend auto-save failed');
        return false;
      }
    } catch (error) {
      console.error('Backend auto-save error:', error);
      return false;
    }
  }, []);

  const initialFormData = {
    // Personal Information
    firstName: existingData?.firstName || userData.firstName || userProfileData?.firstName || user?.firstName || '',
    lastName: existingData?.lastName || userData.lastName || userProfileData?.lastName || user?.lastName || '',
    middleName: existingData?.middleName || userProfileData?.middleName || '',
    email: existingData?.email || userData.email || userProfileData?.email || user?.email || '',
    phone: existingData?.phone || userData.phone || userProfileData?.phone || user?.phone || '',
    altPhone: existingData?.altPhone || userProfileData?.altPhone || '',
    dateOfBirth: existingData?.dateOfBirth || '',
    gender: existingData?.gender || '',
    profilePhoto: existingData?.profilePhoto || null,
    
    // Nationality & Residency
    nationality: existingData?.nationality || '',
    residentCountry: existingData?.residentCountry || '',
    currentCity: existingData?.currentCity || '',
    postalCode: existingData?.postalCode || '',
    address: existingData?.address || '',
    latitude: existingData?.latitude || '',
    longitude: existingData?.longitude || '',
    validDocs: existingData?.validDocs || '',
    
    // Preferred Internship Locations
    preferredLocation1: existingData?.preferredLocation1 || '',
    preferredLocation2: existingData?.preferredLocation2 || '',
    preferredLocation3: existingData?.preferredLocation3 || '',
    willingToRelocate: existingData?.willingToRelocate || '',
    internshipMode: existingData?.internshipMode || '',
    
    // Education
    academicLevel: existingData?.academicLevel || '',
    educationEntries: existingData?.educationEntries || [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      gpa: '',
      startYear: '',
      endYear: '',
      currentYear: '',
      coursework: '',
      achievements: ''
    }],
    
    // Internship Objective
    objective: existingData?.objective || '',
    industryInterest: existingData?.industryInterest || '',
    preferredRole: existingData?.preferredRole || '',
    careerInterests: existingData?.careerInterests || [],
    
    // Previous Experience
    experienceEntries: existingData?.experienceEntries || [{
      positionTitle: '',
      company: '',
      location: '',
      experienceType: 'internship',
      duration: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      responsibilities: ''
    }],
    
    // Skills
    technicalSkills: existingData?.technicalSkills || [],
    softSkills: existingData?.softSkills || [],
    languages: existingData?.languages || [],
    
    // Projects
    projectEntries: existingData?.projectEntries || [{
      projectTitle: '',
      projectType: 'course',
      projectRole: '',
      projectDate: '',
      projectUrl: '',
      projectDescription: ''
    }],
    
    // Extracurricular Activities
    activityEntries: existingData?.activityEntries || [{
      activityName: '',
      activityRole: '',
      activityDuration: '',
      activityDescription: ''
    }],
    
    // Certifications
    certificationEntries: existingData?.certificationEntries || [{
      certName: '',
      certIssuer: '',
      certDate: '',
      credentialId: ''
    }],
    
    // References
    referenceEntries: existingData?.referenceEntries || [{
      referenceName: '',
      referenceTitle: '',
      referenceOrg: '',
      referenceRelationship: '',
      referenceEmail: '',
      referencePhone: ''
    }],
    
    // Professional Links
    professionalLinks: existingData?.professionalLinks || [],
    
    // Internship Preferences
    internshipDuration: existingData?.internshipDuration || '',
    availability: existingData?.availability || '',
    internshipTiming: existingData?.internshipTiming || '',
    expectedStipend: existingData?.expectedStipend || '',
    currencyPreference: existingData?.currencyPreference || 'USD',
    unpaidWilling: existingData?.unpaidWilling || '',
    academicCredit: existingData?.academicCredit || '',
    
    // Additional Information
    hobbies: existingData?.hobbies || '',
    whyInternship: existingData?.whyInternship || '',
    additionalComments: existingData?.additionalComments || '',
    agreeTerms: existingData?.agreeTerms || false,
    allowContact: existingData?.allowContact || false,
    accurateInfo: existingData?.accurateInfo || false
  };

  // Auto-save hook with backend integration
  const { 
    formData, 
    setFormData, 
    saveStatus, 
    isSaving, 
    lastSaveTime, 
    lastBackendSaveTime, 
    forceSave, 
    clearSavedData 
  } = useAutoSave(
    initialFormData,
    AUTOSAVE_KEY,
    {
      backendSaveCallback,
      backendSaveInterval: 120000 // Save to backend every 2 minutes
    }
  );

  const [skillInput, setSkillInput] = useState({ technical: '', soft: '' });
  const [languageInput, setLanguageInput] = useState({ language: '', proficiency: '' });
  const [linkInput, setLinkInput] = useState({ type: '', url: '' });
  const [careerInterestInput, setCareerInterestInput] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);

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

  const addTechnicalSkill = () => {
    if (skillInput.technical.trim() && !formData.technicalSkills.includes(skillInput.technical.trim())) {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, skillInput.technical.trim()]
      }));
      setSkillInput(prev => ({ ...prev, technical: '' }));
    }
  };

  const removeTechnicalSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const addSoftSkill = () => {
    if (skillInput.soft.trim() && !formData.softSkills.includes(skillInput.soft.trim())) {
      setFormData(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, skillInput.soft.trim()]
      }));
      setSkillInput(prev => ({ ...prev, soft: '' }));
    }
  };

  const removeSoftSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index)
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

  const addCareerInterest = () => {
    if (careerInterestInput.trim() && !formData.careerInterests.includes(careerInterestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        careerInterests: [...prev.careerInterests, careerInterestInput.trim()]
      }));
      setCareerInterestInput('');
    }
  };

  const removeCareerInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      careerInterests: prev.careerInterests.filter((_, i) => i !== index)
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
      'nationality', 'residentCountry', 'currentCity', 'validDocs',
      'preferredLocation1', 'willingToRelocate', 'internshipMode',
      'academicLevel', 'objective', 'industryInterest', 'preferredRole',
      'internshipDuration', 'availability', 'internshipTiming',
      'agreeTerms', 'accurateInfo'
    ];

    let filled = 0;
    requiredFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        filled++;
      }
    });

    if (formData.technicalSkills.length > 0) filled += 2;
    if (formData.languages.length > 0) filled += 2;
    if (formData.educationEntries[0]?.institution) filled += 2;

    const progress = Math.min((filled / (requiredFields.length + 6)) * 100, 100);
    setProgressPercentage(Math.round(progress));
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  // Save to backend function
  const saveToBackend = async (showSuccessMessage = false, redirectAfterSave = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️  No token found, skipping backend save');
        return false;
      }

      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      formDataToSend.append('profileCompleted', 'false');
      formDataToSend.append('isDraft', 'true');
      formDataToSend.append('draftSavedAt', new Date().toISOString());
      
      console.log('💾 Saving to backend...');

      const response = await fetch(buildApiUrl('/api/intern/profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        localStorage.setItem('profileCompleted', 'false');
        localStorage.setItem('isDraft', 'true');
        
        console.log('✅ Successfully saved to backend');
        
        if (showSuccessMessage) {
          setSubmitError('✓ Data saved successfully!' + (redirectAfterSave ? ' Redirecting to dashboard...' : ''));
        }
        
        if (redirectAfterSave) {
          setTimeout(() => {
            navigate('/intern-dashboard');
          }, 1500);
        }
        
        return true;
      } else {
        const data = await response.json();
        console.error('❌ Backend save failed:', data);
        
        if (data.age_restriction) {
          alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else if (showSuccessMessage) {
          setSubmitError(data.error || 'Failed to save. Please try again.');
        }
        
        return false;
      }
    } catch (error) {
      console.error('Backend save error:', error);
      if (showSuccessMessage) {
        setSubmitError('Network error. Please try again.');
      }
      return false;
    }
  };

  // Manual save function
  const handleManualSave = async () => {
    setIsLoading(true);
    setSubmitError('');
    
    try {
      forceSave();
      await saveToBackend(true, false);
    } finally {
      setIsLoading(false);
    }
  };

  // Save as draft function
  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    setSubmitError('');

    try {
      forceSave();
      await saveToBackend(true, true);
    } catch (error) {
      console.error('Save draft error:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Age verification - User must be 18 or older
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }
    }
    
    if (formData.technicalSkills.length === 0) {
      alert('Please add at least one technical skill');
      return;
    }

    if (formData.languages.length === 0) {
      alert('Please add at least one language');
      return;
    }

    if (!formData.agreeTerms || !formData.accurateInfo) {
      alert('Please agree to all required terms');
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

      // Mark as completed profile
      formDataToSend.append('profileCompleted', 'true');
      formDataToSend.append('isDraft', 'false');

      const response = await fetch(buildApiUrl('/api/intern/profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (response.ok) {
        // Clear saved draft data
        clearSavedData();
        setSubmitError('✓ Profile created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/intern-dashboard');
        }, 2000);
      } else {
        if (responseData.age_restriction) {
          alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
          localStorage.clear();
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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {/* Header */}
      <header className="jobseeker-header">
        <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 30px 12px 5px' }}>
          <div className="header-left" onClick={() => navigate('/intern-dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">
              <img src="/AK_logo.png" alt="AksharJobs Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <div className="logo-text">
              <h3 className="logo-title" style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>AksharJobs</h3>
              <p className="logo-subtitle" style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>Internship Seeker Registration</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="auto-save-status" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                {isSaving && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f39c12' }}>
                    <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid #f39c12', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Auto-saving...</span>
                  </div>
                )}
                {!isSaving && saveStatus && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#27ae60' }}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Saved {lastBackendSaveTime ? new Date(lastBackendSaveTime).toLocaleTimeString() : new Date(lastSaveTime).toLocaleTimeString()}</span>
                  </div>
                )}
                {!isSaving && !saveStatus && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6c757d' }}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Auto-save enabled (every 2 minutes)</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleManualSave}
                disabled={isSaving || isLoading}
                style={{
                  background: (isSaving || isLoading) ? '#bdc3c7' : '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '6px',
                  cursor: (isSaving || isLoading) ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { if (!isSaving && !isLoading) e.target.style.background = '#2980b9'; }}
                onMouseLeave={(e) => { if (!isSaving && !isLoading) e.target.style.background = '#3498db'; }}
              >
                <FontAwesomeIcon icon={faSave} /> {(isSaving || isLoading) ? 'Saving...' : 'Save Now'}
              </button>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isLoading}
                style={{
                  background: isLoading ? '#bdc3c7' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { if (!isLoading) e.target.style.background = '#4b5563'; }}
                onMouseLeave={(e) => { if (!isLoading) e.target.style.background = '#6b7280'; }}
              >
                <FontAwesomeIcon icon={faEdit} /> Save as Draft
              </button>
              <button
                type="button"
                className="clear-form-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all saved form data? This cannot be undone.')) {
                    clearSavedData();
                    window.location.reload();
                  }
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #e74c3c',
                  color: '#e74c3c',
                  padding: '8px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#e74c3c'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#e74c3c'; }}
              >
                Clear Form Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="jobseeker-main">
        <div className="jobseeker-container">
          <div className="jobseeker-form-card">
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

                {/* Enhanced Progress Section */}
                <div className="progress-section-comprehensive" style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '30px',
                  color: '#000000',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '2px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="progress-header-comprehensive" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#000000' }}>
                      <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px', color: '#0d9488' }} />
                      Profile Completion
                    </h2>
                    <div style={{
                      background: '#f5f5f5',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#000000'
                    }}>
                      {progressPercentage}%
                    </div>
                  </div>
                  
                  <div className="progress-bar-comprehensive" style={{
                    background: '#f5f5f5',
                    height: '12px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '15px',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div 
                      className="progress-fill-comprehensive" 
                      style={{ 
                        width: `${progressPercentage}%`,
                        height: '100%',
                        background: '#0d9488',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease-in-out',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        height: '100%',
                        width: '20px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 100%)',
                        borderRadius: '0 6px 6px 0'
                      }}></div>
                    </div>
                  </div>

                  {/* Progress Status Message */}
                  <div style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    textAlign: 'center',
                    marginBottom: '10px',
                    color: '#000000'
                  }}>
                    {progressPercentage === 100 ? (
                      <span style={{ color: '#0d9488', fontWeight: '600' }}>
                        🎉 Profile Complete! Ready to submit.
                      </span>
                    ) : progressPercentage >= 80 ? (
                      <span style={{ color: '#000000' }}>
                        Almost there! Just a few more fields to complete.
                      </span>
                    ) : progressPercentage >= 50 ? (
                      <span style={{ color: '#000000' }}>
                        Good progress! Keep filling out the form.
                      </span>
                    ) : (
                      <span style={{ color: '#000000' }}>
                        Let's get started! Fill out your internship profile.
                      </span>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '10px',
                    fontSize: '12px',
                    marginBottom: '15px',
                    color: '#000000'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>15</div>
                      <div style={{ color: '#000000' }}>Sections</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>60+</div>
                      <div style={{ color: '#000000' }}>Fields</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>Auto-save</div>
                      <div style={{ color: '#000000' }}>Enabled</div>
                    </div>
                  </div>

                  {/* Section Completion Checklist */}
                  {progressPercentage < 100 && (
                    <div style={{
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>
                        Complete these sections:
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '6px'
                      }}>
                        {[
                          { name: 'Personal Info', icon: '👤', filled: formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender },
                          { name: 'Nationality', icon: '🌍', filled: formData.nationality && formData.residentCountry },
                          { name: 'Locations', icon: '📍', filled: formData.preferredLocation1 && formData.willingToRelocate },
                          { name: 'Education', icon: '🎓', filled: formData.academicLevel && formData.educationEntries[0]?.institution },
                          { name: 'Objective', icon: '🎯', filled: formData.objective && formData.industryInterest },
                          { name: 'Experience', icon: '💼', filled: formData.experienceEntries[0]?.positionTitle },
                          { name: 'Skills', icon: '⚡', filled: formData.technicalSkills.length > 0 },
                          { name: 'Languages', icon: '🗣️', filled: formData.languages.length > 0 },
                          { name: 'Projects', icon: '🚀', filled: formData.projectEntries[0]?.projectTitle },
                          { name: 'Activities', icon: '🏆', filled: formData.activityEntries[0]?.activityName },
                          { name: 'Certifications', icon: '📜', filled: formData.certificationEntries[0]?.certName },
                          { name: 'References', icon: '👥', filled: formData.referenceEntries[0]?.referenceName },
                          { name: 'Online Links', icon: '🔗', filled: formData.professionalLinks.length > 0 },
                          { name: 'Preferences', icon: '⚙️', filled: formData.internshipDuration && formData.availability },
                          { name: 'Additional', icon: '📝', filled: formData.agreeTerms }
                        ].map((section, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            opacity: section.filled ? 0.6 : 1
                          }}>
                            <span style={{
                              color: section.filled ? '#0d9488' : '#000000',
                              fontSize: '14px'
                            }}>
                              {section.filled ? '✓' : section.icon}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: section.filled ? '#0d9488' : '#000000',
                              textDecoration: section.filled ? 'line-through' : 'none'
                            }}>
                              {section.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                        <strong>Upload Profile Photo</strong>
                        <p>Professional photo recommended</p>
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
                        placeholder="Parent/Guardian number"
                        value={formData.altPhone}
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

                  <div className="form-group-comprehensive">
                    <label>Pin Your Location on Map</label>
                    <div className="info-badge-comprehensive">
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> Click on the map to mark your exact location
                    </div>
                    <LocationMap
                      onLocationSelect={(lat, lng, addr) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                          address: addr || prev.address
                        }));
                      }}
                      initialLat={formData.latitude}
                      initialLng={formData.longitude}
                    />
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Do you have valid documents to work/intern in your resident country? <span className="required-comprehensive">*</span></label>
                    <div className="radio-group-comprehensive">
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="validDocs" 
                          value="yes" 
                          required
                          checked={formData.validDocs === 'yes'}
                          onChange={handleInputChange}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="validDocs" 
                          value="no"
                          checked={formData.validDocs === 'no'}
                          onChange={handleInputChange}
                        />
                        <span>No</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="validDocs" 
                          value="citizen"
                          checked={formData.validDocs === 'citizen'}
                          onChange={handleInputChange}
                        />
                        <span>Citizen/Not Required</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preferred Internship Locations Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faMapMarked} />
                    Preferred Internship Locations
                  </h2>

                  <div className="highlight-box-comprehensive">
                    <FontAwesomeIcon icon={faLightbulb} />
                    <strong>Tip:</strong> Select up to 3 countries where you'd like to do your internship. This helps match you with the best opportunities.
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Preferred Location 1 <span className="required-comprehensive">*</span></label>
                      <select 
                        name="preferredLocation1" 
                        required
                        value={formData.preferredLocation1}
                        onChange={handleInputChange}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Preferred Location 2</label>
                      <select 
                        name="preferredLocation2"
                        value={formData.preferredLocation2}
                        onChange={handleInputChange}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Preferred Location 3</label>
                      <select 
                        name="preferredLocation3"
                        value={formData.preferredLocation3}
                        onChange={handleInputChange}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Willing to Relocate for Internship? <span className="required-comprehensive">*</span></label>
                    <div className="radio-group-comprehensive">
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="willingToRelocate" 
                          value="yes" 
                          required
                          checked={formData.willingToRelocate === 'yes'}
                          onChange={handleInputChange}
                        />
                        <span>Yes, anywhere</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="willingToRelocate" 
                          value="within-country"
                          checked={formData.willingToRelocate === 'within-country'}
                          onChange={handleInputChange}
                        />
                        <span>Within my country only</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="willingToRelocate" 
                          value="no"
                          checked={formData.willingToRelocate === 'no'}
                          onChange={handleInputChange}
                        />
                        <span>No, local only</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Internship Mode Preference <span className="required-comprehensive">*</span></label>
                    <select 
                      name="internshipMode" 
                      required
                      value={formData.internshipMode}
                      onChange={handleInputChange}
                    >
                      <option value="">Select preference</option>
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="flexible">Flexible/Open to all</option>
                    </select>
                  </div>
                </div>

                {/* Education Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    Education
                  </h2>
                  
                  <div className="form-group-comprehensive">
                    <label>Current Academic Level <span className="required-comprehensive">*</span></label>
                    <select 
                      name="academicLevel" 
                      required
                      value={formData.academicLevel}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your current level</option>
                      <option value="high-school">High School Student</option>
                      <option value="undergraduate">Undergraduate/Bachelor's Student</option>
                      <option value="graduate">Graduate/Master's Student</option>
                      <option value="phd">PhD Student</option>
                      <option value="recent-graduate">Recent Graduate (within 6 months)</option>
                      <option value="diploma">Diploma Student</option>
                      <option value="certificate">Certificate Student</option>
                    </select>
                  </div>

                  {formData.educationEntries.map((edu, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('educationEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-group-comprehensive">
                        <label>Institution Name <span className="required-comprehensive">*</span></label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g., University of Nairobi, Strathmore University"
                          value={edu.institution}
                          onChange={(e) => handleArrayInputChange('educationEntries', index, 'institution', e.target.value)}
                        />
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Degree/Program Pursuing <span className="required-comprehensive">*</span></label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., Bachelor of Science"
                            value={edu.degree}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'degree', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Field of Study <span className="required-comprehensive">*</span></label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., Computer Science, Business"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'fieldOfStudy', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Institution Location</label>
                          <input 
                            type="text" 
                            placeholder="City, Country"
                            value={edu.location}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'location', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Current GPA/Grade</label>
                          <input 
                            type="text" 
                            placeholder="e.g., 3.8/4.0, First Class"
                            value={edu.gpa}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'gpa', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Start Year <span className="required-comprehensive">*</span></label>
                          <input 
                            type="number" 
                            required 
                            min="2010" 
                            max="2030"
                            placeholder="2021"
                            value={edu.startYear}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'startYear', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Expected Graduation Year <span className="required-comprehensive">*</span></label>
                          <input 
                            type="number" 
                            required 
                            min="2020" 
                            max="2035"
                            placeholder="2025"
                            value={edu.endYear}
                            onChange={(e) => handleArrayInputChange('educationEntries', index, 'endYear', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Year/Level Currently In <span className="required-comprehensive">*</span></label>
                        <select 
                          required
                          value={edu.currentYear}
                          onChange={(e) => handleArrayInputChange('educationEntries', index, 'currentYear', e.target.value)}
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year+</option>
                          <option value="final">Final Year</option>
                        </select>
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Relevant Coursework</label>
                        <textarea 
                          placeholder="List major courses relevant to your internship interests"
                          value={edu.coursework}
                          onChange={(e) => handleArrayInputChange('educationEntries', index, 'coursework', e.target.value)}
                        />
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Academic Achievements & Awards</label>
                        <textarea 
                          placeholder="Dean's List, Scholarships, Academic competitions, etc."
                          value={edu.achievements}
                          onChange={(e) => handleArrayInputChange('educationEntries', index, 'achievements', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('educationEntries', {
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      location: '',
                      gpa: '',
                      startYear: '',
                      endYear: '',
                      currentYear: '',
                      coursework: '',
                      achievements: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Education
                  </button>
                </div>

                {/* Internship Objective Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faBullseye} />
                    Internship Objective & Career Goals
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>Professional Objective/Summary <span className="required-comprehensive">*</span></label>
                    <textarea 
                      name="objective" 
                      required 
                      placeholder="Write a brief statement about your career goals and what you hope to achieve through an internship. Example: 'Enthusiastic Computer Science student seeking a software development internship to apply programming skills and gain hands-on experience in building scalable applications.'"
                      value={formData.objective}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Industry of Interest <span className="required-comprehensive">*</span></label>
                      <select 
                        name="industryInterest" 
                        required
                        value={formData.industryInterest}
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
                      <label>Preferred Internship Role <span className="required-comprehensive">*</span></label>
                      <input 
                        type="text" 
                        name="preferredRole" 
                        required 
                        placeholder="e.g., Software Developer, Marketing Intern, Financial Analyst"
                        value={formData.preferredRole}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Career Interests</label>
                    <div className="info-badge-comprehensive">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add areas you're passionate about to help match with relevant opportunities
                    </div>
                    <div className="skills-input-container-comprehensive">
                      <input 
                        type="text" 
                        placeholder="Enter career interest (e.g., Data Science, Digital Marketing)"
                        value={careerInterestInput}
                        onChange={(e) => setCareerInterestInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCareerInterest())}
                      />
                      <button type="button" onClick={addCareerInterest} className="add-skill-btn-comprehensive">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="skills-tags-comprehensive">
                      {formData.careerInterests.map((interest, index) => (
                        <span key={index} className="skill-tag-comprehensive">
                          {interest}
                          <button type="button" onClick={() => removeCareerInterest(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Previous Internship/Work Experience Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faBriefcase} />
                    Previous Internships & Work Experience
                  </h2>
                  <div className="info-badge-comprehensive">
                    <FontAwesomeIcon icon={faInfoCircle} /> Include any internships, part-time jobs, volunteer work, or relevant experience
                  </div>
                  
                  {formData.experienceEntries.map((exp, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('experienceEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-group-comprehensive">
                        <label>Position Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Marketing Intern, Sales Assistant"
                          value={exp.positionTitle}
                          onChange={(e) => handleArrayInputChange('experienceEntries', index, 'positionTitle', e.target.value)}
                        />
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Company/Organization</label>
                          <input 
                            type="text" 
                            placeholder="Company name"
                            value={exp.company}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'company', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Location</label>
                          <input 
                            type="text" 
                            placeholder="City, Country"
                            value={exp.location}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'location', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Type</label>
                          <select 
                            value={exp.experienceType}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'experienceType', e.target.value)}
                          >
                            <option value="internship">Internship</option>
                            <option value="part-time">Part-time Job</option>
                            <option value="volunteer">Volunteer Work</option>
                            <option value="freelance">Freelance</option>
                            <option value="attachment">Industrial Attachment</option>
                          </select>
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Duration</label>
                          <input 
                            type="text" 
                            placeholder="e.g., 3 months, 6 weeks"
                            value={exp.duration}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'duration', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Start Date</label>
                          <input 
                            type="month" 
                            value={exp.startDate}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>End Date</label>
                          <input 
                            type="month" 
                            value={exp.endDate}
                            onChange={(e) => handleArrayInputChange('experienceEntries', index, 'endDate', e.target.value)}
                            disabled={exp.currentlyWorking}
                          />
                        </div>
                      </div>

                      <div className="checkbox-group-comprehensive">
                        <input 
                          type="checkbox" 
                          id={`currentlyWorking${index}`}
                          checked={exp.currentlyWorking}
                          onChange={(e) => handleArrayInputChange('experienceEntries', index, 'currentlyWorking', e.target.checked)}
                        />
                        <label htmlFor={`currentlyWorking${index}`}>I currently work/intern here</label>
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Responsibilities & Key Learnings</label>
                        <textarea 
                          placeholder="Describe what you did and what you learned from this experience"
                          value={exp.responsibilities}
                          onChange={(e) => handleArrayInputChange('experienceEntries', index, 'responsibilities', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('experienceEntries', {
                      positionTitle: '',
                      company: '',
                      location: '',
                      experienceType: 'internship',
                      duration: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                      responsibilities: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Experience
                  </button>
                </div>

                {/* Skills & Competencies Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faLightbulb} />
                    Skills & Competencies
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>Technical Skills <span className="required-comprehensive">*</span></label>
                    <div className="info-badge-comprehensive">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add programming languages, software, tools, and technical abilities
                    </div>
                    <div className="skills-input-container-comprehensive">
                      <input 
                        type="text" 
                        placeholder="e.g., Python, Microsoft Excel, AutoCAD"
                        value={skillInput.technical}
                        onChange={(e) => setSkillInput(prev => ({ ...prev, technical: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnicalSkill())}
                      />
                      <button type="button" onClick={addTechnicalSkill} className="add-skill-btn-comprehensive">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="skills-tags-comprehensive">
                      {formData.technicalSkills.map((skill, index) => (
                        <span key={index} className="skill-tag-comprehensive">
                          {skill}
                          <button type="button" onClick={() => removeTechnicalSkill(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Soft Skills</label>
                    <div className="info-badge-comprehensive">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add communication, leadership, teamwork, and other interpersonal skills
                    </div>
                    <div className="skills-input-container-comprehensive">
                      <input 
                        type="text" 
                        placeholder="e.g., Communication, Leadership, Problem-solving"
                        value={skillInput.soft}
                        onChange={(e) => setSkillInput(prev => ({ ...prev, soft: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftSkill())}
                      />
                      <button type="button" onClick={addSoftSkill} className="add-skill-btn-comprehensive">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div className="skills-tags-comprehensive">
                      {formData.softSkills.map((skill, index) => (
                        <span key={index} className="skill-tag-comprehensive">
                          {skill}
                          <button type="button" onClick={() => removeSoftSkill(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faLanguage} />
                    Languages
                  </h2>
                  
                  <div className="form-group-comprehensive">
                    <label>Languages & Proficiency Levels <span className="required-comprehensive">*</span></label>
                    <div className="highlight-box-comprehensive">
                      <FontAwesomeIcon icon={faGlobe} />
                      <strong>Important for international internships:</strong> Language skills can significantly increase your opportunities
                    </div>
                    <div className="language-input-container-comprehensive">
                      <input 
                        type="text" 
                        placeholder="Enter language (e.g., English, French)"
                        value={languageInput.language}
                        onChange={(e) => setLanguageInput(prev => ({ ...prev, language: e.target.value }))}
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

                {/* Academic Projects Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faProjectDiagram} />
                    Academic Projects & Portfolio
                  </h2>
                  
                  {formData.projectEntries.map((project, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('projectEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-group-comprehensive">
                        <label>Project Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g., E-commerce Website, Marketing Campaign Analysis"
                          value={project.projectTitle}
                          onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectTitle', e.target.value)}
                        />
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Project Type</label>
                          <select 
                            value={project.projectType}
                            onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectType', e.target.value)}
                          >
                            <option value="course">Course Project</option>
                            <option value="capstone">Capstone/Final Year Project</option>
                            <option value="research">Research Project</option>
                            <option value="personal">Personal Project</option>
                            <option value="team">Team Project</option>
                            <option value="competition">Competition/Hackathon</option>
                          </select>
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Your Role</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Team Leader, Developer"
                            value={project.projectRole}
                            onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectRole', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Project Date</label>
                          <input 
                            type="month" 
                            value={project.projectDate}
                            onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectDate', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Project Link/URL</label>
                          <input 
                            type="url" 
                            placeholder="https://github.com/yourproject"
                            value={project.projectUrl}
                            onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectUrl', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Project Description</label>
                        <textarea 
                          placeholder="Describe the project, technologies used, your contributions, and outcomes/results"
                          value={project.projectDescription}
                          onChange={(e) => handleArrayInputChange('projectEntries', index, 'projectDescription', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('projectEntries', {
                      projectTitle: '',
                      projectType: 'course',
                      projectRole: '',
                      projectDate: '',
                      projectUrl: '',
                      projectDescription: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Project
                  </button>
                </div>

                {/* Extracurricular Activities Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faUsers} />
                    Extracurricular Activities & Leadership
                  </h2>
                  
                  {formData.activityEntries.map((activity, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('activityEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-group-comprehensive">
                        <label>Activity/Organization Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Student Council, Debate Club, Sports Team"
                          value={activity.activityName}
                          onChange={(e) => handleArrayInputChange('activityEntries', index, 'activityName', e.target.value)}
                        />
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Your Role/Position</label>
                          <input 
                            type="text" 
                            placeholder="e.g., President, Member, Captain"
                            value={activity.activityRole}
                            onChange={(e) => handleArrayInputChange('activityEntries', index, 'activityRole', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Duration</label>
                          <input 
                            type="text" 
                            placeholder="e.g., 2 years, 2021-2023"
                            value={activity.activityDuration}
                            onChange={(e) => handleArrayInputChange('activityEntries', index, 'activityDuration', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group-comprehensive">
                        <label>Description & Achievements</label>
                        <textarea 
                          placeholder="Describe your involvement and any notable achievements or contributions"
                          value={activity.activityDescription}
                          onChange={(e) => handleArrayInputChange('activityEntries', index, 'activityDescription', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('activityEntries', {
                      activityName: '',
                      activityRole: '',
                      activityDuration: '',
                      activityDescription: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Activity
                  </button>
                </div>

                {/* Certifications Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faCertificate} />
                    Certifications & Training
                  </h2>
                  
                  {formData.certificationEntries.map((cert, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('certificationEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Certification Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Google Analytics, First Aid, Microsoft Office Specialist"
                            value={cert.certName}
                            onChange={(e) => handleArrayInputChange('certificationEntries', index, 'certName', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Issuing Organization</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Google, Red Cross, Microsoft"
                            value={cert.certIssuer}
                            onChange={(e) => handleArrayInputChange('certificationEntries', index, 'certIssuer', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Issue Date</label>
                          <input 
                            type="month" 
                            value={cert.certDate}
                            onChange={(e) => handleArrayInputChange('certificationEntries', index, 'certDate', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Credential ID/URL</label>
                          <input 
                            type="text" 
                            placeholder="Certificate number or verification link"
                            value={cert.credentialId}
                            onChange={(e) => handleArrayInputChange('certificationEntries', index, 'credentialId', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('certificationEntries', {
                      certName: '',
                      certIssuer: '',
                      certDate: '',
                      credentialId: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Certification
                  </button>
                </div>

                {/* References Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faUserCheck} />
                    References
                  </h2>
                  <div className="info-badge-comprehensive">
                    <FontAwesomeIcon icon={faInfoCircle} /> Provide contacts of professors, teachers, or previous supervisors who can vouch for you
                  </div>
                  
                  {formData.referenceEntries.map((ref, index) => (
                    <div key={index} className="dynamic-entry-comprehensive">
                      {index > 0 && (
                        <button
                          type="button"
                          className="remove-entry-btn-comprehensive"
                          onClick={() => removeArrayItem('referenceEntries', index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Reference Name</label>
                          <input 
                            type="text" 
                            placeholder="Full name"
                            value={ref.referenceName}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referenceName', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Title/Position</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Professor, Manager"
                            value={ref.referenceTitle}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referenceTitle', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Organization/Institution</label>
                          <input 
                            type="text" 
                            placeholder="University or Company name"
                            value={ref.referenceOrg}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referenceOrg', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Relationship</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Professor, Former Supervisor"
                            value={ref.referenceRelationship}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referenceRelationship', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <label>Email</label>
                          <input 
                            type="email" 
                            placeholder="email@example.com"
                            value={ref.referenceEmail}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referenceEmail', e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <label>Phone</label>
                          <input 
                            type="tel" 
                            placeholder="+1 234 567 8900"
                            value={ref.referencePhone}
                            onChange={(e) => handleArrayInputChange('referenceEntries', index, 'referencePhone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="add-more-btn-comprehensive"
                    onClick={() => addArrayItem('referenceEntries', {
                      referenceName: '',
                      referenceTitle: '',
                      referenceOrg: '',
                      referenceRelationship: '',
                      referenceEmail: '',
                      referencePhone: ''
                    })}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Another Reference
                  </button>
                </div>

                {/* Online Presence Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faLink} />
                    Online Presence & Portfolio
                  </h2>
                  <div className="info-badge-comprehensive">
                    <FontAwesomeIcon icon={faInfoCircle} /> Add your professional online profiles and portfolio links
                  </div>
                  
                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Link Type</label>
                      <select 
                        value={linkInput.type}
                        onChange={(e) => setLinkInput(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="">Select link type</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="GitHub">GitHub</option>
                        <option value="Personal">Personal Website/Portfolio</option>
                        <option value="Twitter/X">Twitter/X</option>
                        <option value="Other">Other Professional</option>
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>URL</label>
                      <input 
                        type="url" 
                        placeholder="https://example.com/yourprofile"
                        value={linkInput.url}
                        onChange={(e) => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="add-skill-btn-comprehensive"
                    onClick={addLink}
                    style={{ marginBottom: '20px' }}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Link
                  </button>
                  
                  <div className="links-container-comprehensive">
                    {formData.professionalLinks.map((link, index) => (
                      <div key={index} className="link-item-comprehensive">
                        <div className="link-content-comprehensive">
                          <div className="link-type-comprehensive">
                            <FontAwesomeIcon icon={faLink} /> {link.type}
                          </div>
                          <div className="link-url-comprehensive">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="remove-link-btn-comprehensive"
                          onClick={() => removeLink(index)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internship Preferences Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faSlidersH} />
                    Internship Preferences & Availability
                  </h2>
                  
                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Internship Duration Preference <span className="required-comprehensive">*</span></label>
                      <select 
                        name="internshipDuration" 
                        required
                        value={formData.internshipDuration}
                        onChange={handleInputChange}
                      >
                        <option value="">Select preferred duration</option>
                        <option value="1-2-months">1-2 months</option>
                        <option value="3-months">3 months</option>
                        <option value="4-6-months">4-6 months</option>
                        <option value="6-12-months">6-12 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Availability to Start <span className="required-comprehensive">*</span></label>
                      <select 
                        name="availability" 
                        required
                        value={formData.availability}
                        onChange={handleInputChange}
                      >
                        <option value="">Select availability</option>
                        <option value="immediate">Immediately Available</option>
                        <option value="1-week">Within 1 week</option>
                        <option value="2-weeks">Within 2 weeks</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="summer">Summer Break</option>
                        <option value="semester">Next Semester</option>
                        <option value="specific-date">Specific Date (add in comments)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Internship Timing Preference <span className="required-comprehensive">*</span></label>
                      <select 
                        name="internshipTiming" 
                        required
                        value={formData.internshipTiming}
                        onChange={handleInputChange}
                      >
                        <option value="">Select timing</option>
                        <option value="full-time">Full-time (during break)</option>
                        <option value="part-time">Part-time (during semester)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Expected Stipend/Allowance (Monthly)</label>
                      <input 
                        type="text" 
                        name="expectedStipend" 
                        placeholder="e.g., USD 500, KES 20,000, or Unpaid"
                        value={formData.expectedStipend}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Currency Preference</label>
                    <select 
                      name="currencyPreference"
                      value={formData.currencyPreference}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Willing to Accept Unpaid Internship?</label>
                    <div className="radio-group-comprehensive">
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="unpaidWilling" 
                          value="yes"
                          checked={formData.unpaidWilling === 'yes'}
                          onChange={handleInputChange}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="unpaidWilling" 
                          value="prefer-paid"
                          checked={formData.unpaidWilling === 'prefer-paid'}
                          onChange={handleInputChange}
                        />
                        <span>Prefer paid but open</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="unpaidWilling" 
                          value="no"
                          checked={formData.unpaidWilling === 'no'}
                          onChange={handleInputChange}
                        />
                        <span>No, paid only</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Do you require academic credit for this internship?</label>
                    <div className="radio-group-comprehensive">
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="academicCredit" 
                          value="yes"
                          checked={formData.academicCredit === 'yes'}
                          onChange={handleInputChange}
                        />
                        <span>Yes, required</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="academicCredit" 
                          value="preferred"
                          checked={formData.academicCredit === 'preferred'}
                          onChange={handleInputChange}
                        />
                        <span>Preferred but not required</span>
                      </label>
                      <label className="radio-option-comprehensive">
                        <input 
                          type="radio" 
                          name="academicCredit" 
                          value="no"
                          checked={formData.academicCredit === 'no'}
                          onChange={handleInputChange}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Additional Information
                  </h2>
                  
                  <div className="form-group-comprehensive">
                    <label>Hobbies & Interests</label>
                    <textarea 
                      name="hobbies" 
                      placeholder="Share your interests outside academics (sports, music, reading, volunteering, etc.)"
                      value={formData.hobbies}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Why are you seeking an internship?</label>
                    <textarea 
                      name="whyInternship" 
                      placeholder="Share your motivation and what you hope to gain from an internship experience"
                      value={formData.whyInternship}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Additional Comments or Special Requirements</label>
                    <textarea 
                      name="additionalComments" 
                      placeholder="Any other information you'd like to share with potential employers (disabilities requiring accommodation, visa requirements, etc.)"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="checkbox-group-comprehensive">
                    <input 
                      type="checkbox" 
                      id="agreeTerms" 
                      name="agreeTerms" 
                      required
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeTerms">I agree to the Terms of Service and Privacy Policy <span className="required-comprehensive">*</span></label>
                  </div>

                  <div className="checkbox-group-comprehensive">
                    <input 
                      type="checkbox" 
                      id="allowContact" 
                      name="allowContact"
                      checked={formData.allowContact}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="allowContact">I agree to be contacted by employers and recruiters for internship opportunities</label>
                  </div>

                  <div className="checkbox-group-comprehensive">
                    <input 
                      type="checkbox" 
                      id="accurateInfo" 
                      name="accurateInfo" 
                      required
                      checked={formData.accurateInfo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="accurateInfo">I confirm that all information provided is accurate and truthful <span className="required-comprehensive">*</span></label>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="submit-section-comprehensive">
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      onClick={handleSaveAsDraft}
                      disabled={isLoading}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '14px 32px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        opacity: isLoading ? 0.6 : 1
                      }}
                      onMouseOver={(e) => { if (!isLoading) e.target.style.background = '#4b5563'; }}
                      onMouseOut={(e) => { if (!isLoading) e.target.style.background = '#6b7280'; }}
                    >
                      <FontAwesomeIcon icon={faSave} /> Save as Draft
                    </button>

                    <button type="submit" className="submit-btn-comprehensive" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <FontAwesomeIcon icon={faRocket} spin /> Creating Profile...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} /> Create Internship Profile
                        </>
                      )}
                    </button>
                  </div>
                  <p style={{ marginTop: '15px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                    Save as draft to continue later, or create your complete profile now
                  </p>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
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

