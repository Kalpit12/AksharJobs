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
  faBuilding, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAutoSave } from '../hooks/useAutoSave';
import AutoSaveStatus from '../components/AutoSaveStatus';
import '../styles/JobSeekerRegistrationFormComprehensive.css';

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

const JobSeekerRegistrationFormComprehensive = () => {
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
  const AUTOSAVE_KEY = `jobseeker_registration_${user?.userId || 'temp'}`;
  
  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(buildApiUrl('/api/jobseeker/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user profile:', data);
          setUserProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
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
      // Personal Information
      firstName: existingData?.firstName || userData.firstName || userProfileData?.firstName || user?.firstName || '',
      middleName: existingData?.middleName || userProfileData?.middleName || '',
      lastName: existingData?.lastName || userData.lastName || userProfileData?.lastName || user?.lastName || '',
      email: existingData?.email || userData.email || userProfileData?.email || user?.email || '',
      phone: existingData?.phone || userProfileData?.phone || user?.phone || '',
      altPhone: existingData?.altPhone || userProfileData?.altPhone || '',
      dateOfBirth: existingData?.dateOfBirth || '',
      gender: existingData?.gender || '',
      community: existingData?.community || '',
      profilePhoto: existingData?.profilePhoto || null,
      
      // Nationality & Residency
      nationality: existingData?.nationality || '',
      residentCountry: existingData?.residentCountry || '',
      currentCity: existingData?.currentCity || '',
      postalCode: existingData?.postalCode || '',
      address: existingData?.address || '',
      latitude: existingData?.latitude || '',
      longitude: existingData?.longitude || '',
      workPermit: existingData?.workPermit || '',
      
      // Preferred Working Locations
      preferredLocation1: existingData?.preferredLocation1 || '',
      preferredLocation2: existingData?.preferredLocation2 || '',
      preferredLocation3: existingData?.preferredLocation3 || '',
      willingToRelocate: existingData?.willingToRelocate || '',
      workLocation: existingData?.workLocation || '',
      
      // Professional Profile
      professionalTitle: existingData?.professionalTitle || '',
      yearsExperience: existingData?.yearsExperience || '',
      careerLevel: existingData?.careerLevel || '',
      industry: existingData?.industry || '',
      summary: existingData?.summary || '',
      
      // Work Experience (Array)
      experienceEntries: existingData?.experienceEntries || [{
        jobTitle: '',
        company: '',
        companyLocation: '',
        employmentType: 'full-time',
        jobIndustry: '',
        startDate: '',
        endDate: '',
        currentJob: false,
        jobDescription: ''
      }],
      
      // Education (Array)
      educationEntries: existingData?.educationEntries || [{
        degreeType: '',
        fieldOfStudy: '',
        institution: '',
        institutionLocation: '',
        grade: '',
        eduStartYear: '',
        eduEndYear: '',
        eduActivities: ''
      }],
      
      // Skills
      coreSkills: existingData?.coreSkills || [],
      tools: existingData?.tools || [],
      
      // Languages
      languages: existingData?.languages || [],
      
      // Certifications (Array)
      certificationEntries: existingData?.certificationEntries || [{
        certificationName: '',
        certIssuer: '',
        certIssueDate: '',
        certExpiryDate: '',
        credentialId: ''
      }],
      
      // Professional Memberships
      membershipOrg: existingData?.membershipOrg || '',
      membershipType: existingData?.membershipType || '',
      membershipDate: existingData?.membershipDate || '',
      
      // References (Array)
      referenceEntries: existingData?.referenceEntries || [{
        referenceName: '',
        referenceTitle: '',
        referenceCompany: '',
        referenceRelationship: '',
        referenceEmail: '',
        referencePhone: ''
      }],
      
      // Professional Online Presence
      professionalLinks: existingData?.professionalLinks || [],
      
      // Job Preferences
      jobType: existingData?.jobType || '',
      noticePeriod: existingData?.noticePeriod || '',
      currentSalary: existingData?.currentSalary || '',
      expectedSalary: existingData?.expectedSalary || '',
      currencyPreference: existingData?.currencyPreference || 'USD',
      travelAvailability: existingData?.travelAvailability || '',
      
      // Additional Information
      askCommunity: existingData?.askCommunity || '',
      hobbies: existingData?.hobbies || '',
      additionalComments: existingData?.additionalComments || '',
      agreeTerms: existingData?.agreeTerms || false,
      allowContact: existingData?.allowContact || false
    },
    AUTOSAVE_KEY,
    1000, // Debounce delay (1 second)
    null, // No backend save callback
    true // Enable periodic 2-minute auto-save
  );

  const [skillInput, setSkillInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [languageInput, setLanguageInput] = useState({ language: '', proficiency: '' });
  const [linkInput, setLinkInput] = useState({ type: '', url: '' });
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Update form data when user profile data is fetched
  useEffect(() => {
    if (userProfileData && Object.keys(userProfileData).length > 0) {
      console.log('Updating form with user profile data:', userProfileData);
      setFormData(prev => ({
        ...prev,
        // Personal Information - only update if not already filled
        firstName: prev.firstName || userProfileData.firstName || user?.firstName || '',
        lastName: prev.lastName || userProfileData.lastName || user?.lastName || '',
        email: prev.email || userProfileData.email || user?.email || '',
        phone: prev.phone || userProfileData.phone || user?.phone || '',
        middleName: prev.middleName || userProfileData.middleName || '',
        
        // Populate other fields if they exist in userProfileData
        dateOfBirth: prev.dateOfBirth || userProfileData.dateOfBirth || '',
        gender: prev.gender || userProfileData.gender || '',
        community: prev.community || userProfileData.community || '',
        nationality: prev.nationality || userProfileData.nationality || '',
        residentCountry: prev.residentCountry || userProfileData.residentCountry || '',
        currentCity: prev.currentCity || userProfileData.currentCity || userProfileData.location?.city || '',
        postalCode: prev.postalCode || userProfileData.postalCode || '',
        address: prev.address || userProfileData.address || '',
        latitude: prev.latitude || userProfileData.latitude || userProfileData.location?.coordinates?.[1] || '',
        longitude: prev.longitude || userProfileData.longitude || userProfileData.location?.coordinates?.[0] || '',
        
        // Professional Profile
        professionalTitle: prev.professionalTitle || userProfileData.professionalTitle || userProfileData.experience?.[0]?.jobTitle || '',
        yearsExperience: prev.yearsExperience || userProfileData.yearsExperience || '',
        careerLevel: prev.careerLevel || userProfileData.careerLevel || '',
        industry: prev.industry || userProfileData.industry || '',
        summary: prev.summary || userProfileData.summary || userProfileData.bio || '',
        
        // Skills
        coreSkills: (prev.coreSkills?.length > 0 ? prev.coreSkills : userProfileData.technicalSkills) || [],
        tools: (prev.tools?.length > 0 ? prev.tools : userProfileData.tools) || [],
        languages: (prev.languages?.length > 0 ? prev.languages : userProfileData.languages) || [],
        
        // Experience and Education
        experienceEntries: (prev.experienceEntries?.[0]?.jobTitle ? prev.experienceEntries : userProfileData.experience) || prev.experienceEntries,
        educationEntries: (prev.educationEntries?.[0]?.degreeType ? prev.educationEntries : userProfileData.education) || prev.educationEntries,
        certificationEntries: (prev.certificationEntries?.[0]?.certificationName ? prev.certificationEntries : userProfileData.certifications) || prev.certificationEntries,
        
        // Job Preferences
        jobType: prev.jobType || userProfileData.jobType || '',
        noticePeriod: prev.noticePeriod || userProfileData.noticePeriod || '',
        currentSalary: prev.currentSalary || userProfileData.currentSalary || '',
        expectedSalary: prev.expectedSalary || userProfileData.expectedSalary || '',
        
        // Professional Links
        professionalLinks: (prev.professionalLinks?.length > 0 ? prev.professionalLinks : userProfileData.professionalLinks) || prev.professionalLinks
      }));
    }
  }, [userProfileData, user]);

  // Initialize map
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Default center (Nairobi, Kenya)
        const map = L.map(mapRef.current).setView([-1.286389, 36.817223], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add click event to map
        map.on('click', function(e) {
          setMarker(e.latlng.lat, e.latlng.lng);
        });

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            setMarker(lat, lng);
          });
        }
      }
    };

    const timer = setTimeout(initMap, 100);
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const setMarker = (lat, lng) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    
    const marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    // Update form data
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }));

    // Make marker draggable
    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      setMarker(position.lat, position.lng);
    });

    // Note: Address is entered manually by user, not auto-filled from coordinates
  };

  const handleMapSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchQuery = e.target.value;
      if (searchQuery && mapInstanceRef.current) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              mapInstanceRef.current.setView([lat, lng], 13);
              setMarker(lat, lng);
            } else {
              alert('Location not found. Please try a different search term.');
            }
          })
          .catch(error => {
            console.log('Search error:', error);
            alert('Error searching location. Please try again.');
          });
      }
    }
  };

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      let filledFields = 0;
      let totalRequired = 0;

      // Count required fields
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
        'nationality', 'residentCountry', 'currentCity', 'workPermit',
        'preferredLocation1', 'willingToRelocate', 'workLocation',
        'professionalTitle', 'yearsExperience', 'careerLevel', 'industry', 'summary',
        'jobType', 'noticePeriod'
      ];

      requiredFields.forEach(field => {
        totalRequired++;
        if (formData[field]) filledFields++;
      });

      // Bonus for arrays
      if (formData.experienceEntries.some(exp => exp.jobTitle)) filledFields += 2;
      if (formData.educationEntries.some(edu => edu.degreeType)) filledFields += 2;
      if (formData.coreSkills.length > 0) filledFields += 2;
      if (formData.languages.length > 0) filledFields += 2;

      const progress = Math.min((filledFields / (totalRequired + 8)) * 100, 100);
      setProgressPercentage(Math.round(progress));
    };

    calculateProgress();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (50KB = 50 * 1024 bytes)
      if (file.size > 50 * 1024) {
        alert('Profile photo must be 50KB or smaller. Please compress your image.');
        e.target.value = ''; // Clear the file input
        return;
      }
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
      e.target.value = ''; // Clear the file input
    }
  };

  // Experience handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceEntries: [...prev.experienceEntries, {
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
    setFormData(prev => ({
      ...prev,
      experienceEntries: prev.experienceEntries.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experienceEntries: prev.experienceEntries.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Education handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationEntries: [...prev.educationEntries, {
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
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.coreSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        coreSkills: [...prev.coreSkills, skill]
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
    const tool = toolInput.trim();
    if (tool && !formData.tools.includes(tool)) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
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

  // Language handlers
  const addLanguage = () => {
    if (languageInput.language && languageInput.proficiency) {
      const langExists = formData.languages.some(l => l.language === languageInput.language);
      if (!langExists) {
        setFormData(prev => ({
          ...prev,
          languages: [...prev.languages, { ...languageInput }]
        }));
        setLanguageInput({ language: '', proficiency: '' });
      }
    } else {
      alert('Please enter both language and proficiency level');
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Certification handlers
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certificationEntries: [...prev.certificationEntries, {
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
      certificationEntries: prev.certificationEntries.filter((_, i) => i !== index)
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certificationEntries: prev.certificationEntries.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  // Reference handlers
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      referenceEntries: [...prev.referenceEntries, {
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
      referenceEntries: prev.referenceEntries.filter((_, i) => i !== index)
    }));
  };

  const handleReferenceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      referenceEntries: prev.referenceEntries.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  // Professional Links handlers
  const addLink = () => {
    if (!linkInput.type) {
      alert('Please select a link type');
      return;
    }
    if (!linkInput.url.trim()) {
      alert('Please enter a URL');
      return;
    }
    
    // Validate URL format
    try {
      new URL(linkInput.url);
    } catch (e) {
      alert('Please enter a valid URL (including https://)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      professionalLinks: [...prev.professionalLinks, { ...linkInput }]
    }));
    setLinkInput({ type: '', url: '' });
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalLinks: prev.professionalLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        // Clear saved form data on successful submission
        clearSavedData();
        
        // Update user context to mark profile as completed
        alert('Profile completed successfully! Redirecting to your dashboard...');
        navigate('/jobseeker-dashboard', { 
          state: {
            jobSeekerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            isUpdate: !!existingData
          }
        });
      } else {
        setSubmitError(data.error || 'Failed to submit profile. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
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
            <div className="logo-section" onClick={() => navigate('/jobseeker-dashboard')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon">
                <img src="/AK_logo.png" alt="AksharJobs Logo" />
              </div>
              <div className="logo-text">
                <h3 className="logo-title">AksharJobs</h3>
                <p className="logo-subtitle">Job Seeker Profile</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-controls">
              <span className="auto-save-status" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isSaving && <span style={{ color: '#f39c12' }}>💾 Saving...</span>}
                {saveStatus === 'saved' && (
                  <>
                    <FontAwesomeIcon icon={faCheck} style={{ color: '#27ae60' }} />
                    <span style={{ color: '#27ae60' }}>Saved {lastSaveTime && `at ${lastSaveTime.toLocaleTimeString()}`}</span>
                  </>
                )}
                {saveStatus === 'error' && <span style={{ color: '#e74c3c' }}>⚠️ Save failed</span>}
                {!isSaving && !saveStatus && (
                  <>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Auto-saving every 2 minutes</span>
                  </>
                )}
              </span>
              <button
                className="clear-form-btn"
                type="button"
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
                onMouseOver={(e) => {
                  e.target.style.background = '#e74c3c';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#e74c3c';
                }}
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

          <div className="form-group-comprehensive">
            <label>Pin Your Location on Map</label>
            <div className="info-badge-comprehensive">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Click on the map to mark your exact location or search for a place
            </div>
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                id="mapSearch" 
                placeholder="Search for a location..."
                onKeyPress={handleMapSearch}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px', 
                  marginBottom: '10px' 
                }}
              />
            </div>
            <div 
              ref={mapRef}
              id="map" 
              style={{ 
                width: '100%', 
                height: '400px', 
                borderRadius: '8px', 
                border: '2px solid #e0e0e0' 
              }}
            ></div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
              <strong>Selected Coordinates:</strong> 
              <span id="coordinates">
                {formData.latitude && formData.longitude 
                  ? `Lat: ${formData.latitude}, Lng: ${formData.longitude}`
                  : 'Click on the map to select'}
              </span>
            </div>
            <input type="hidden" name="latitude" value={formData.latitude} />
            <input type="hidden" name="longitude" value={formData.longitude} />
          </div>

          <div className="form-group-comprehensive">
            <label>Do you have a valid work permit for your resident country? <span className="required-comprehensive">*</span></label>
            <div className="radio-group-comprehensive">
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="workPermitYes" 
                  name="workPermit" 
                  value="yes" 
                  required
                  checked={formData.workPermit === 'yes'}
                  onChange={handleInputChange}
                />
                <label htmlFor="workPermitYes">Yes</label>
              </div>
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="workPermitNo" 
                  name="workPermit" 
                  value="no" 
                  required
                  checked={formData.workPermit === 'no'}
                  onChange={handleInputChange}
                />
                <label htmlFor="workPermitNo">No</label>
              </div>
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="workPermitCitizen" 
                  name="workPermit" 
                  value="citizen" 
                  required
                  checked={formData.workPermit === 'citizen'}
                  onChange={handleInputChange}
                />
                <label htmlFor="workPermitCitizen">Citizen/Not Required</label>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Working Locations Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faMapMarked} />
            Preferred Working Locations
          </h2>

          <div className="form-group-comprehensive">
            <label>Select up to 3 countries where you'd prefer to work <span className="required-comprehensive">*</span></label>
            <div className="info-badge-comprehensive">
              <FontAwesomeIcon icon={faInfoCircle} /> This helps match you with opportunities in your preferred locations
            </div>
          </div>

          <div className="form-row-3-comprehensive">
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
            <label>Willing to Relocate Internationally? <span className="required-comprehensive">*</span></label>
            <div className="radio-group-comprehensive">
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="relocateYes" 
                  name="willingToRelocate" 
                  value="yes" 
                  required
                  checked={formData.willingToRelocate === 'yes'}
                  onChange={handleInputChange}
                />
                <label htmlFor="relocateYes">Yes, immediately</label>
              </div>
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="relocateConditional" 
                  name="willingToRelocate" 
                  value="conditional" 
                  required
                  checked={formData.willingToRelocate === 'conditional'}
                  onChange={handleInputChange}
                />
                <label htmlFor="relocateConditional">Yes, with conditions</label>
              </div>
              <div className="radio-option-comprehensive">
                <input 
                  type="radio" 
                  id="relocateNo" 
                  name="willingToRelocate" 
                  value="no" 
                  required
                  checked={formData.willingToRelocate === 'no'}
                  onChange={handleInputChange}
                />
                <label htmlFor="relocateNo">No</label>
              </div>
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Work Location Preference <span className="required-comprehensive">*</span></label>
            <select 
              name="workLocation" 
              required
              value={formData.workLocation}
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

        {/* Professional Profile Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faBriefcase} />
            Professional Profile
          </h2>

          <div className="form-group-comprehensive">
            <label>Professional Title/Headline <span className="required-comprehensive">*</span></label>
            <input 
              type="text" 
              name="professionalTitle" 
              required 
              placeholder="e.g., Senior Software Engineer | Full Stack Developer"
              value={formData.professionalTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Total Years of Experience <span className="required-comprehensive">*</span></label>
              <select 
                name="yearsExperience" 
                required
                value={formData.yearsExperience}
                onChange={handleInputChange}
              >
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
            <div className="form-group-comprehensive">
              <label>Career Level <span className="required-comprehensive">*</span></label>
              <select 
                name="careerLevel" 
                required
                value={formData.careerLevel}
                onChange={handleInputChange}
              >
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

          <div className="form-group-comprehensive">
            <label>Industry/Sector <span className="required-comprehensive">*</span></label>
            <select 
              name="industry" 
              required
              value={formData.industry}
              onChange={handleInputChange}
            >
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

          <div className="form-group-comprehensive">
            <label>Professional Summary <span className="required-comprehensive">*</span></label>
            <textarea 
              name="summary" 
              required 
              placeholder="Write a compelling summary about your professional background, key achievements, and career goals. Highlight what makes you unique and valuable to potential employers globally. (Minimum 150 characters)"
              value={formData.summary}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faBuilding} />
            Work Experience
          </h2>
          <div className="info-badge-comprehensive">
            <FontAwesomeIcon icon={faInfoCircle} /> List all relevant work experience starting with the most recent
          </div>
          
          <div id="experienceContainer" style={{ marginTop: '20px' }}>
            {formData.experienceEntries.map((experience, index) => (
              <div key={index} className="experience-item-comprehensive">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn-comprehensive"
                    onClick={() => removeExperience(index)}
                    title="Remove this experience"
                  >
                    ×
                  </button>
                )}
                
                <div className="form-group-comprehensive">
                  <label>Job Title <span className="required-comprehensive">*</span></label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., Senior Marketing Manager"
                    value={experience.jobTitle}
                    onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                  />
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Company Name <span className="required-comprehensive">*</span></label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., ABC Corporation"
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Company Location</label>
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      value={experience.companyLocation}
                      onChange={(e) => handleExperienceChange(index, 'companyLocation', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Employment Type</label>
                    <select
                      value={experience.employmentType}
                      onChange={(e) => handleExperienceChange(index, 'employmentType', e.target.value)}
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Industry</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Technology, Finance"
                      value={experience.jobIndustry}
                      onChange={(e) => handleExperienceChange(index, 'jobIndustry', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Start Date <span className="required-comprehensive">*</span></label>
                    <input 
                      type="month" 
                      required
                      value={experience.startDate}
                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>End Date</label>
                    <input 
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                      disabled={experience.currentJob}
                    />
                  </div>
                </div>
                
                <div className="checkbox-group-comprehensive">
                  <input 
                    type="checkbox" 
                    id={`currentJob${index}`} 
                    checked={experience.currentJob}
                    onChange={(e) => handleExperienceChange(index, 'currentJob', e.target.checked)}
                  />
                  <label htmlFor={`currentJob${index}`}>I currently work here</label>
                </div>
                
                <div className="form-group-comprehensive">
                  <label>Key Responsibilities & Achievements</label>
                  <textarea 
                    placeholder="• Led team of 10 marketing professionals&#10;• Increased revenue by 45% through strategic campaigns&#10;• Managed $500K annual budget"
                    value={experience.jobDescription}
                    onChange={(e) => handleExperienceChange(index, 'jobDescription', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button type="button" className="add-more-btn-comprehensive" onClick={addExperience}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Position
          </button>
        </div>

        {/* Education Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faGraduationCap} />
            Education
          </h2>
          
          <div id="educationContainer">
            {formData.educationEntries.map((education, index) => (
              <div key={index} className="education-item-comprehensive">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn-comprehensive"
                    onClick={() => removeEducation(index)}
                    title="Remove this education"
                  >
                    ×
                  </button>
                )}
                
                <div className="form-group-comprehensive">
                  <label>Degree/Certificate <span className="required-comprehensive">*</span></label>
                  <select
                    required
                    value={education.degreeType}
                    onChange={(e) => handleEducationChange(index, 'degreeType', e.target.value)}
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
                
                <div className="form-group-comprehensive">
                  <label>Field of Study <span className="required-comprehensive">*</span></label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., Computer Science, Business Administration"
                    value={education.fieldOfStudy}
                    onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                  />
                </div>
                
                <div className="form-group-comprehensive">
                  <label>Institution Name <span className="required-comprehensive">*</span></label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., University of Nairobi"
                    value={education.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  />
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Institution Location</label>
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      value={education.institutionLocation}
                      onChange={(e) => handleEducationChange(index, 'institutionLocation', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Grade/GPA</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 3.8/4.0, First Class"
                      value={education.grade}
                      onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Start Year <span className="required-comprehensive">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="1950" 
                      max="2030" 
                      placeholder="2018"
                      value={education.eduStartYear}
                      onChange={(e) => handleEducationChange(index, 'eduStartYear', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>End Year (or Expected)</label>
                    <input 
                      type="number" 
                      min="1950" 
                      max="2035" 
                      placeholder="2022"
                      value={education.eduEndYear}
                      onChange={(e) => handleEducationChange(index, 'eduEndYear', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group-comprehensive">
                  <label>Activities & Achievements</label>
                  <textarea 
                    placeholder="Academic honors, relevant coursework, extracurricular activities"
                    value={education.eduActivities}
                    onChange={(e) => handleEducationChange(index, 'eduActivities', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button type="button" className="add-more-btn-comprehensive" onClick={addEducation}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Education
          </button>
        </div>

        {/* Skills Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faLightbulb} />
            Skills & Competencies
          </h2>
          
          <div className="form-group-comprehensive">
            <label>Core Skills <span className="required-comprehensive">*</span></label>
            <div className="info-badge-comprehensive">
              <FontAwesomeIcon icon={faInfoCircle} /> Add skills relevant to your profession and job preferences
            </div>
            <div className="skills-input-container-comprehensive">
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Enter a skill (e.g., Python, Project Management)"
              />
              <button type="button" className="add-btn-comprehensive" onClick={addSkill}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
            <div className="tags-container-comprehensive">
              {formData.coreSkills.map((skill, index) => (
                <div key={index} className="tag-comprehensive">
                  {skill}
                  <span className="remove-comprehensive" onClick={() => removeSkill(index)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group-comprehensive">
            <label>Software & Tools</label>
            <div className="skills-input-container-comprehensive">
              <input 
                type="text" 
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                placeholder="Enter software/tool (e.g., Microsoft Excel, AutoCAD)"
              />
              <button type="button" className="add-btn-comprehensive" onClick={addTool}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
            <div className="tags-container-comprehensive">
              {formData.tools.map((tool, index) => (
                <div key={index} className="tag-comprehensive">
                  {tool}
                  <span className="remove-comprehensive" onClick={() => removeTool(index)}>×</span>
                </div>
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
            <div className="info-badge-comprehensive">
              <FontAwesomeIcon icon={faInfoCircle} /> Language skills are crucial for international opportunities
            </div>
            <div className="language-proficiency-comprehensive">
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
            <button type="button" className="add-btn-comprehensive" onClick={addLanguage} style={{ marginTop: '10px' }}>
              <FontAwesomeIcon icon={faPlus} /> Add Language
            </button>
            <div className="tags-container-comprehensive" style={{ marginTop: '15px' }}>
              {formData.languages.map((lang, index) => (
                <div key={index} className="tag-comprehensive">
                  {lang.language} - {lang.proficiency}
                  <span className="remove-comprehensive" onClick={() => removeLanguage(index)}>×</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faCertificate} />
            Certifications & Licenses
          </h2>
          
          <div id="certificationContainer">
            {formData.certificationEntries.map((cert, index) => (
              <div key={index}>
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn-comprehensive"
                    onClick={() => removeCertification(index)}
                    title="Remove this certification"
                    style={{ marginBottom: '15px' }}
                  >
                    ×
                  </button>
                )}
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Certification/License Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., PMP, AWS Certified Solutions Architect"
                      value={cert.certificationName}
                      onChange={(e) => handleCertificationChange(index, 'certificationName', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Issuing Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Project Management Institute"
                      value={cert.certIssuer}
                      onChange={(e) => handleCertificationChange(index, 'certIssuer', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Issue Date</label>
                    <input 
                      type="month"
                      value={cert.certIssueDate}
                      onChange={(e) => handleCertificationChange(index, 'certIssueDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Expiry Date</label>
                    <input 
                      type="month"
                      value={cert.certExpiryDate}
                      onChange={(e) => handleCertificationChange(index, 'certExpiryDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Credential ID</label>
                    <input 
                      type="text" 
                      placeholder="Certificate number/ID"
                      value={cert.credentialId}
                      onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                    />
                  </div>
                </div>
                {index < formData.certificationEntries.length - 1 && (
                  <hr style={{ margin: '20px 0', border: '1px solid #e0e0e0' }} />
                )}
              </div>
            ))}
          </div>
          
          <button type="button" className="add-more-btn-comprehensive" onClick={addCertification}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Certification
          </button>
        </div>

        {/* Professional Memberships Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faUsers} />
            Professional Memberships & Associations
          </h2>
          
          <div className="form-group-comprehensive">
            <label>Organization Name</label>
            <input 
              type="text" 
              name="membershipOrg" 
              placeholder="e.g., IEEE, PMI, Institute of Accountants"
              value={formData.membershipOrg}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Membership Type</label>
              <input 
                type="text" 
                name="membershipType" 
                placeholder="e.g., Professional Member, Fellow"
                value={formData.membershipType}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Membership Since</label>
              <input 
                type="month" 
                name="membershipDate"
                value={formData.membershipDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* References Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faUserCheck} />
            Professional References
          </h2>
          
          <div id="referenceContainer">
            {formData.referenceEntries.map((reference, index) => (
              <div key={index} className="reference-item-comprehensive">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn-comprehensive"
                    onClick={() => removeReference(index)}
                    title="Remove this reference"
                  >
                    ×
                  </button>
                )}
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Reference Name</label>
                    <input 
                      type="text" 
                      placeholder="Full name"
                      value={reference.referenceName}
                      onChange={(e) => handleReferenceChange(index, 'referenceName', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Job Title</label>
                    <input 
                      type="text" 
                      placeholder="Position"
                      value={reference.referenceTitle}
                      onChange={(e) => handleReferenceChange(index, 'referenceTitle', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Company/Organization</label>
                    <input 
                      type="text" 
                      placeholder="Company name"
                      value={reference.referenceCompany}
                      onChange={(e) => handleReferenceChange(index, 'referenceCompany', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Relationship</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Former Manager, Colleague"
                      value={reference.referenceRelationship}
                      onChange={(e) => handleReferenceChange(index, 'referenceRelationship', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row-comprehensive">
                  <div className="form-group-comprehensive">
                    <label>Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={reference.referenceEmail}
                      onChange={(e) => handleReferenceChange(index, 'referenceEmail', e.target.value)}
                    />
                  </div>
                  <div className="form-group-comprehensive">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 8900"
                      value={reference.referencePhone}
                      onChange={(e) => handleReferenceChange(index, 'referencePhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button type="button" className="add-more-btn-comprehensive" onClick={addReference}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Reference
          </button>
        </div>

        {/* Professional Online Presence Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faLink} />
            Professional Online Presence
          </h2>
          <div className="info-badge-comprehensive">
            <FontAwesomeIcon icon={faInfoCircle} /> Add your professional online profiles and portfolio links
          </div>
          
          <div style={{ marginTop: '20px' }}>
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
                  <option value="Personal Website">Personal Website/Portfolio</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="Behance">Behance</option>
                  <option value="Dribbble">Dribbble</option>
                  <option value="Medium">Medium</option>
                  <option value="Stack Overflow">Stack Overflow</option>
                  <option value="Other">Other Professional</option>
                </select>
              </div>
              <div className="form-group-comprehensive">
                <label>URL</label>
                <input 
                  type="url" 
                  value={linkInput.url}
                  onChange={(e) => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/yourprofile"
                />
              </div>
            </div>
            <button type="button" className="add-btn-comprehensive" onClick={addLink} style={{ marginBottom: '20px' }}>
              <FontAwesomeIcon icon={faPlus} /> Add Link
            </button>
          </div>
          
          <div id="linksContainer" style={{ marginTop: '15px' }}>
            {formData.professionalLinks.map((link, index) => (
              <div key={index} className="link-item-comprehensive">
                <div className="link-item-content-comprehensive">
                  <div className="link-item-type-comprehensive">
                    <FontAwesomeIcon icon={faLink} /> {link.type}
                  </div>
                  <div className="link-item-url-comprehensive">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                  </div>
                </div>
                <button type="button" className="remove-item-btn-comprehensive" onClick={() => removeLink(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Preferences Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faSlidersH} />
            Job Preferences & Availability
          </h2>
          
          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Desired Job Type <span className="required-comprehensive">*</span></label>
              <select 
                name="jobType" 
                required
                value={formData.jobType}
                onChange={handleInputChange}
              >
                <option value="">Select job type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div className="form-group-comprehensive">
              <label>Notice Period <span className="required-comprehensive">*</span></label>
              <select 
                name="noticePeriod" 
                required
                value={formData.noticePeriod}
                onChange={handleInputChange}
              >
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

          <div className="form-row-comprehensive">
            <div className="form-group-comprehensive">
              <label>Current Salary (Optional)</label>
              <input 
                type="text" 
                name="currentSalary" 
                placeholder="e.g., USD 50,000 per year"
                value={formData.currentSalary}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-comprehensive">
              <label>Expected Salary</label>
              <input 
                type="text" 
                name="expectedSalary" 
                placeholder="e.g., USD 60,000 - 70,000 per year"
                value={formData.expectedSalary}
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
              <option value="">Select currency</option>
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

          <div className="form-group-comprehensive">
            <label>Travel Availability</label>
            <select 
              name="travelAvailability"
              value={formData.travelAvailability}
              onChange={handleInputChange}
            >
              <option value="">Select availability</option>
              <option value="no-travel">No Travel</option>
              <option value="minimal">Minimal (Less than 25%)</option>
              <option value="moderate">Moderate (25-50%)</option>
              <option value="frequent">Frequent (50-75%)</option>
              <option value="extensive">Extensive (More than 75%)</option>
            </select>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faInfoCircle} />
            Additional Information
          </h2>
          
          <div className="form-group-comprehensive">
            <label>Ask Community</label>
            <textarea 
              name="askCommunity" 
              placeholder="Do you have any questions for the community? Share them here."
              value={formData.askCommunity}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group-comprehensive">
            <label>Hobbies & Interests</label>
            <textarea 
              name="hobbies" 
              placeholder="Share your interests outside of work (optional but helps employers understand you better)"
              value={formData.hobbies}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group-comprehensive">
            <label>Additional Comments</label>
            <textarea 
              name="additionalComments" 
              placeholder="Any other information you'd like to share with potential employers"
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
            <label htmlFor="allowContact">I agree to be contacted by employers and recruiters</label>
          </div>
        </div>

        {/* Submit Section */}
        <div className="submit-section-comprehensive">
          <button type="submit" className="submit-btn-comprehensive" disabled={isLoading}>
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faRocket} spin /> Creating Profile...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} /> Create Job Seeker Profile
              </>
            )}
          </button>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Your profile will be visible to employers and recruiters worldwide
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

export default JobSeekerRegistrationFormComprehensive;

