import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPassport, 
  faMapMarkedAlt,
  faGraduationCap,
  faBullseye,
  faBriefcase,
  faLightbulb,
  faLanguage,
  faProjectDiagram,
  faUsers,
  faCertificate,
  faUserCheck,
  faLink,
  faSlidersH,
  faInfoCircle,
  faCamera,
  faUpload,
  faPlus,
  faTimes,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faUserGraduate,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/InternDetailsForm.css';

const InternDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: userData.firstName || '',
    middleName: '',
    lastName: userData.lastName || '',
    dateOfBirth: '',
    gender: '',
    email: userData.email || '',
    phone: userData.phone || '',
    altPhone: '',
    profilePhoto: null,
    
    // Nationality & Residency
    nationality: '',
    residentCountry: '',
    currentCity: '',
    postalCode: '',
    address: '',
    latitude: '',
    longitude: '',
    validDocs: '',
    openForOpportunities: '',
    
    // Preferred Internship Locations
    preferredLocation1: '',
    preferredLocation2: '',
    preferredLocation3: '',
    willingToRelocate: '',
    internshipMode: '',
    
    // Education (array)
    education: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      institutionLocation: '',
      gpa: '',
      eduStartYear: '',
      eduEndYear: '',
      currentYear: '',
      coursework: '',
      achievements: ''
    }],
    academicLevel: '',
    
    // Internship Objective
    objective: '',
    industryInterest: '',
    preferredRole: '',
    interests: [],
    
    // Previous Experience (array)
    experiences: [{
      positionTitle: '',
      company: '',
      companyLocation: '',
      experienceType: 'internship',
      duration: '',
      expStartDate: '',
      expEndDate: '',
      currentlyWorking: false,
      responsibilities: ''
    }],
    
    // Skills
    technicalSkills: [],
    softSkills: [],
    
    // Languages (array)
    languages: [],
    
    // Projects (array)
    projects: [{
      projectTitle: '',
      projectType: 'course',
      projectRole: '',
      projectDate: '',
      projectUrl: '',
      projectDescription: ''
    }],
    
    // Activities (array)
    activities: [{
      activityName: '',
      activityRole: '',
      activityDuration: '',
      activityDescription: ''
    }],
    
    // Certifications (array)
    certifications: [{
      certName: '',
      certIssuer: '',
      certDate: '',
      credentialId: ''
    }],
    
    // References (array)
    references: [{
      referenceName: '',
      referenceTitle: '',
      referenceOrg: '',
      referenceRelationship: '',
      referenceEmail: '',
      referencePhone: ''
    }],
    
    // Online Presence (array)
    professionalLinks: [],
    
    // Internship Preferences
    internshipDuration: '',
    availability: '',
    internshipTiming: '',
    expectedStipend: '',
    currencyPreference: 'USD',
    unpaidWilling: '',
    academicCredit: '',
    
    // Additional Information
    hobbies: '',
    whyInternship: '',
    additionalComments: '',
    agreeTerms: false,
    allowContact: false,
    accurateInfo: false,
    
    // Community Selection (NEW)
    community: ''
  });
  
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Add Leaflet CSS and JS dynamically
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // Sanitize certification data to ensure all values are strings
  const sanitizeCertifications = (certs) => {
    if (!Array.isArray(certs)) return [{
      certName: '',
      certIssuer: '',
      certDate: '',
      credentialId: ''
    }];
    
    return certs.map(cert => ({
      certName: String(cert.certName || ''),
      certIssuer: String(cert.certIssuer || ''),
      certDate: String(cert.certDate || ''),
      credentialId: String(cert.credentialId || '')
    }));
  };

  // Load saved form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('internFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Sanitize arrays to ensure proper structure
        const sanitizedData = {
          ...parsedData,
          certifications: sanitizeCertifications(parsedData.certifications),
          // Ensure other arrays are properly structured
          education: Array.isArray(parsedData.education) && parsedData.education.length > 0 
            ? parsedData.education 
            : [{
                institution: '',
                degree: '',
                fieldOfStudy: '',
                institutionLocation: '',
                gpa: '',
                eduStartYear: '',
                eduEndYear: '',
                currentYear: '',
                coursework: '',
                achievements: ''
              }],
          experiences: Array.isArray(parsedData.experiences) && parsedData.experiences.length > 0 
            ? parsedData.experiences 
            : [{
                positionTitle: '',
                company: '',
                companyLocation: '',
                experienceType: 'internship',
                duration: '',
                expStartDate: '',
                expEndDate: '',
                currentlyWorking: false,
                responsibilities: ''
              }],
          projects: Array.isArray(parsedData.projects) && parsedData.projects.length > 0 
            ? parsedData.projects 
            : [{
                projectTitle: '',
                projectType: 'course',
                projectRole: '',
                projectDate: '',
                projectUrl: '',
                projectDescription: ''
              }],
          activities: Array.isArray(parsedData.activities) && parsedData.activities.length > 0 
            ? parsedData.activities 
            : [{
                activityName: '',
                activityRole: '',
                activityDuration: '',
                activityDescription: ''
              }],
          references: Array.isArray(parsedData.references) && parsedData.references.length > 0 
            ? parsedData.references 
            : [{
                referenceName: '',
                referenceTitle: '',
                referenceOrg: '',
                referenceRelationship: '',
                referenceEmail: '',
                referencePhone: ''
              }],
          technicalSkills: Array.isArray(parsedData.technicalSkills) ? parsedData.technicalSkills : [],
          softSkills: Array.isArray(parsedData.softSkills) ? parsedData.softSkills : [],
          interests: Array.isArray(parsedData.interests) ? parsedData.interests : [],
          languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
          professionalLinks: Array.isArray(parsedData.professionalLinks) ? parsedData.professionalLinks : []
        };
        
        // Merge saved data with initial formData to ensure all fields exist
        setFormData(prevData => ({
          ...prevData,
          ...sanitizedData,
          // Preserve userData from props if it exists
          firstName: userData.firstName || sanitizedData.firstName || prevData.firstName,
          lastName: userData.lastName || sanitizedData.lastName || prevData.lastName,
          email: userData.email || sanitizedData.email || prevData.email,
          phone: userData.phone || sanitizedData.phone || prevData.phone
        }));
        
        // Show notification that data was restored
        setSubmitError('Your previously filled data has been restored. ✓');
        setTimeout(() => setSubmitError(''), 3000);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    // Don't save on first render or if form is empty
    if (formData.firstName || formData.email || formData.phone) {
      try {
        // Save formData to localStorage (excluding profilePhoto which can't be serialized)
        const dataToSave = {
          ...formData,
          profilePhoto: null // Don't save file object
        };
        localStorage.setItem('internFormData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [formData]);

  // Clear saved data function (to be called after successful submission)
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem('internFormData');
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

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


  // Map initialization - simplified like HTML
  useEffect(() => {
    const initMap = () => {
      if (typeof window !== 'undefined' && window.L) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || mapContainer._leaflet_id) return;

        // Initialize map exactly like HTML
        const leafletMap = window.L.map('map').setView([-1.286389, 36.817223], 12);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(leafletMap);

        setMap(leafletMap);

        // Add click event to map
        leafletMap.on('click', function(e) {
          addMarkerToMap(e.latlng.lat, e.latlng.lng);
        });

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            leafletMap.setView([lat, lng], 13);
            addMarkerToMap(lat, lng);
          });
        }

        // Initialize map search
        const searchInput = document.getElementById('mapSearch');
        if (searchInput) {
          searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              const searchQuery = this.value;
              if (searchQuery) {
                searchLocation(searchQuery);
              }
            }
          });
        }
      }
    };

    const timer = setTimeout(initMap, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Set marker function - exactly like HTML
  const addMarkerToMap = (lat, lng) => {
    if (map && marker) {
      map.removeLayer(marker);
    }
    
    if (map) {
      const newMarker = window.L.marker([lat, lng], {
        draggable: true
      }).addTo(map);

      setMarker(newMarker);

      // Update coordinates display
      const coordinatesElement = document.getElementById('coordinates');
      if (coordinatesElement) {
        coordinatesElement.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      }

      // Update form data
      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }));

      // Make marker draggable
      newMarker.on('dragend', function(e) {
        const position = newMarker.getLatLng();
        addMarkerToMap(position.lat, position.lng);
      });

      // Note: Address is entered manually by user, not auto-filled from coordinates
    }
  };

  // Search location function - exactly like HTML
  const searchLocation = (query) => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          map.setView([lat, lng], 13);
          addMarkerToMap(lat, lng);
        } else {
          alert('Location not found. Please try a different search term.');
        }
      })
      .catch(error => {
        console.log('Search error:', error);
        alert('Error searching location. Please try again.');
      });
  };

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = [
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.dateOfBirth,
        formData.nationality,
        formData.residentCountry,
        formData.currentCity,
        formData.preferredLocation1,
        formData.willingToRelocate,
        formData.internshipMode,
        formData.academicLevel,
        formData.education[0].institution,
        formData.education[0].degree,
        formData.education[0].fieldOfStudy,
        formData.objective,
        formData.industryInterest,
        formData.preferredRole,
        formData.technicalSkills.length > 0,
        formData.languages.length > 0,
        formData.internshipDuration,
        formData.availability,
        formData.internshipTiming,
        formData.agreeTerms,
        formData.accurateInfo
      ];
      
      const filled = requiredFields.filter(Boolean).length;
      const percentage = Math.round((filled / requiredFields.length) * 100);
      setProgressPercentage(percentage);
    };
    
    calculateProgress();
  }, [formData]);

  // Handle profile photo upload (for both file input and drag-and-drop)
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (50KB = 50 * 1024 bytes)
      if (file.size > 50 * 1024) {
        alert('Profile photo must be 50KB or smaller. Please compress your image.');
        return;
      }
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
    }
  };

  // Handle profile photo upload (legacy function for compatibility)
  const handleProfilePhotoChange = (e) => {
    handleFileUpload(e.target.files[0]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle array notation for certifications
    if (name.startsWith('certifications[')) {
      const match = name.match(/certifications\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        setFormData(prev => ({
          ...prev,
          certifications: prev.certifications.map((cert, i) => 
            i === index ? { ...cert, [field]: value } : cert
          )
        }));
      }
        } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add/Remove skills
  const addSkill = (skillType, skill) => {
    if (!skill.trim()) return;
    setFormData(prev => ({
      ...prev,
      [skillType]: [...prev[skillType], skill.trim()]
    }));
  };

  const removeSkill = (skillType, index) => {
    setFormData(prev => ({
      ...prev,
      [skillType]: prev[skillType].filter((_, i) => i !== index)
    }));
  };

  // Add/Remove interests
  const addInterest = (interest) => {
    if (!interest.trim()) return;
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, interest.trim()]
    }));
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  // Add/Remove language
  const addLanguage = (language, proficiency) => {
    if (!language.trim() || !proficiency) return;
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: language.trim(), proficiency }]
    }));
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Add/Remove professional link
  const addProfessionalLink = (type, url) => {
    if (!type || !url.trim()) return;
    setFormData(prev => ({
      ...prev,
      professionalLinks: [...prev.professionalLinks, { type, url: url.trim() }]
    }));
  };

  const removeProfessionalLink = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalLinks: prev.professionalLinks.filter((_, i) => i !== index)
    }));
  };

  // Add education entry
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        institutionLocation: '',
        gpa: '',
        eduStartYear: '',
        eduEndYear: '',
        currentYear: '',
        coursework: '',
        achievements: ''
      }]
    }));
  };

  // Remove education entry
  const removeEducation = (index) => {
    if (formData.education.length === 1) return;
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Update education entry
  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Add experience entry
  const addExperience = () => {
    setFormData(prev => ({
        ...prev,
      experiences: [...prev.experiences, {
        positionTitle: '',
        company: '',
        companyLocation: '',
        experienceType: 'internship',
        duration: '',
        expStartDate: '',
        expEndDate: '',
        currentlyWorking: false,
        responsibilities: ''
      }]
    }));
  };

  // Remove experience entry
  const removeExperience = (index) => {
    if (formData.experiences.length === 1) return;
    setFormData(prev => ({
        ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  // Update experience entry
  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Add certification entry
  const addCertification = () => {
        setFormData(prev => ({
          ...prev,
      certifications: [...prev.certifications, {
        certName: '',
        certIssuer: '',
        certDate: '',
        credentialId: ''
      }]
    }));
  };

  // Remove certification entry
  const removeCertification = (index) => {
    if (formData.certifications.length === 1) return;
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Add project entry
  const addProject = () => {
    setFormData(prev => ({
          ...prev, 
      projects: [...prev.projects, {
        projectTitle: '',
        projectType: 'course',
        projectRole: '',
        projectDate: '',
        projectUrl: '',
        projectDescription: ''
      }]
    }));
  };

  // Remove project entry
  const removeProject = (index) => {
    if (formData.projects.length === 1) return;
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Update project entry
  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  // Add activity entry
  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, {
        activityName: '',
        activityRole: '',
        activityDuration: '',
        activityDescription: ''
      }]
    }));
  };

  // Remove activity entry
  const removeActivity = (index) => {
    if (formData.activities.length === 1) return;
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  // Update activity entry
  const updateActivity = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((act, i) => 
        i === index ? { ...act, [field]: value } : act
      )
    }));
  };

  // Add reference entry
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, {
        referenceName: '',
        referenceTitle: '',
        referenceOrg: '',
        referenceRelationship: '',
        referenceEmail: '',
        referencePhone: ''
      }]
    }));
  };

  // Remove reference entry
  const removeReference = (index) => {
    if (formData.references.length === 1) return;
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  // Update reference entry
  const updateReference = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.residentCountry) newErrors.residentCountry = 'Resident country is required';
    if (!formData.currentCity.trim()) newErrors.currentCity = 'Current city is required';
    if (!formData.validDocs) newErrors.validDocs = 'Please select an option';
    if (!formData.openForOpportunities) newErrors.openForOpportunities = 'Please specify if you are open for opportunities';
    if (!formData.preferredLocation1) newErrors.preferredLocation1 = 'At least one preferred location is required';
    if (!formData.willingToRelocate) newErrors.willingToRelocate = 'Please select relocation preference';
    if (!formData.internshipMode) newErrors.internshipMode = 'Please select internship mode';
    if (!formData.academicLevel) newErrors.academicLevel = 'Academic level is required';
    if (!formData.education[0].institution.trim()) newErrors.institutionEducation0 = 'Institution name is required';
    if (!formData.education[0].degree.trim()) newErrors.degreeEducation0 = 'Degree is required';
    if (!formData.education[0].fieldOfStudy.trim()) newErrors.fieldOfStudyEducation0 = 'Field of study is required';
    if (!formData.objective.trim()) newErrors.objective = 'Professional objective is required';
    if (!formData.industryInterest) newErrors.industryInterest = 'Industry of interest is required';
    if (!formData.preferredRole.trim()) newErrors.preferredRole = 'Preferred role is required';
    if (formData.technicalSkills.length === 0) newErrors.technicalSkills = 'Add at least one technical skill';
    if (formData.languages.length === 0) newErrors.languages = 'Add at least one language';
    if (!formData.internshipDuration) newErrors.internshipDuration = 'Internship duration is required';
    if (!formData.availability) newErrors.availability = 'Availability is required';
    if (!formData.internshipTiming) newErrors.internshipTiming = 'Internship timing is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!formData.accurateInfo) newErrors.accurateInfo = 'You must confirm the information is accurate';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitError('Please fill in all required fields');
      window.scrollTo(0, 0);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append profile photo if exists
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
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
        // Clear saved form data after successful submission
        clearSavedFormData();
        
        navigate('/intern-success', {
          state: {
            internName: `${formData.firstName} ${formData.lastName}`,
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

  return (
    <div className="jobseeker-details-comprehensive">
      {/* Header */}
      <header className="jobseeker-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => navigate('/intern-dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <h3 className="logo-title">AksharJobs</h3>
              <p className="logo-subtitle">Complete Your Internship Profile</p>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            fontSize: '14px',
            color: '#4facfe'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FontAwesomeIcon icon={faCheck} />
              Auto-saving your progress
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved form data? This cannot be undone.')) {
                  clearSavedFormData();
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

          {/* Progress Section */}
          <div className="progress-section-comprehensive">
            <div className="progress-header-comprehensive">
              <h2>Profile Completion Progress</h2>
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

            {/* Profile Photo */}
            {profilePhotoPreview && (
              <div className="profile-photo-preview">
                <img src={profilePhotoPreview} alt="Profile" />
              </div>
            )}
            
            <div className="form-group">
              <label 
                className="photo-upload-area" 
                htmlFor="profilePhoto"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    handleFileUpload(files[0]);
                  }
                }}
              >
                <div className="upload-icon">
                  <FontAwesomeIcon icon={faCamera} />
                </div>
                <div className="upload-text">
                  <strong>Upload Profile Photo</strong>
                  <p>Click to browse or drag and drop</p>
                  <small>Maximum file size: 50KB</small>
                </div>
                <input 
                  type="file" 
                  id="profilePhoto" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>

        <div className="form-row">
          <div className="form-group">
                <label>First Name <span className="required">*</span></label>
            <input
              type="text"
                  name="firstName"
                  value={formData.firstName}
              onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
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
                  placeholder="Enter your last name"
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
          </div>

            <div className="form-row">
          <div className="form-group">
                <label>Date of Birth <span className="required">*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
              </div>
              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select
                  name="gender"
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

            <div className="form-row">
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+254 700 000 000"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
          <div className="form-group">
                <label>Alternative Phone</label>
            <input
              type="tel"
                  name="altPhone"
                  value={formData.altPhone}
              onChange={handleInputChange}
                  placeholder="Parent/Guardian number"
            />
              </div>
          </div>

            {/* Community Selection */}
          <div className="form-group">
              <label>Community</label>
            <input
                type="text"
                name="community"
                value={formData.community}
              onChange={handleInputChange}
                placeholder="Enter your community (e.g., Tech Enthusiasts, Business Students, etc.)"
            />
              <div className="help-text">
                💡 Communities help you connect with like-minded interns and find opportunities tailored to your field
          </div>
        </div>
          </div>

          {/* Nationality & Residency Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faPassport} />
              Nationality & Residency
            </h2>

        <div className="form-row">
          <div className="form-group">
                <label>Nationality <span className="required">*</span></label>
            <select
                  name="nationality"
                  value={formData.nationality}
              onChange={handleInputChange}
                  className={errors.nationality ? 'error' : ''}
                >
                  <option value="">Select your nationality</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
            </select>
                {errors.nationality && <span className="error-text">{errors.nationality}</span>}
              </div>
              <div className="form-group">
                <label>Resident Country <span className="required">*</span></label>
                <select
                  name="residentCountry"
                  value={formData.residentCountry}
                  onChange={handleInputChange}
                  className={errors.residentCountry ? 'error' : ''}
                >
                  <option value="">Select your current country of residence</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.residentCountry && <span className="error-text">{errors.residentCountry}</span>}
              </div>
          </div>

            <div className="form-row">
          <div className="form-group">
                <label>Current City <span className="required">*</span></label>
            <input
              type="text"
                  name="currentCity"
                  value={formData.currentCity}
              onChange={handleInputChange}
                  placeholder="e.g., Nairobi"
                  className={errors.currentCity ? 'error' : ''}
                />
                {errors.currentCity && <span className="error-text">{errors.currentCity}</span>}
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
              <label>Pin Your Location on Map</label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Click on the map to mark your exact location or search for a place
              </div>
              <div style={{ marginTop: '10px' }}>
          <input
            type="text"
                  id="mapSearch" 
                  placeholder="Search for a location..." 
                  style={{ 
                    width: '100%', 
                    padding: '12px 15px', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '8px', 
                    marginBottom: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div id="map" style={{ 
                width: '100%', 
                height: '400px', 
                borderRadius: '8px', 
                border: '2px solid #e0e0e0' 
              }}></div>
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                <strong>Selected Coordinates:</strong> 
                <span id="coordinates">Click on the map to select</span>
              </div>
              <input type="hidden" name="latitude" id="latitude" />
              <input type="hidden" name="longitude" id="longitude" />
            </div>

            <div className="form-group">
              <label>Do you have valid documents to work/intern in your resident country? <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="validDocs"
                    value="yes"
                    checked={formData.validDocs === 'yes'}
            onChange={handleInputChange}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="validDocs"
                    value="no"
                    checked={formData.validDocs === 'no'}
                    onChange={handleInputChange}
                  />
                  <span>No</span>
                </label>
                <label className="radio-option">
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
              {errors.validDocs && <span className="error-text">{errors.validDocs}</span>}
            </div>

            <div className="form-group">
              <label>Are you open for opportunities? <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="openForOpportunities"
                    value="yes"
                    checked={formData.openForOpportunities === 'yes'}
                    onChange={handleInputChange}
                  />
                  <span>Yes, I'm actively looking for opportunities</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="openForOpportunities"
                    value="maybe"
                    checked={formData.openForOpportunities === 'maybe'}
                    onChange={handleInputChange}
                  />
                  <span>Maybe, I'm open to interesting opportunities</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="openForOpportunities"
                    value="no"
                    checked={formData.openForOpportunities === 'no'}
                    onChange={handleInputChange}
                  />
                  <span>No, not currently looking</span>
                </label>
              </div>
              {errors.openForOpportunities && <span className="error-text">{errors.openForOpportunities}</span>}
            </div>
          </div>

          {/* Preferred Internship Locations Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              Preferred Internship Locations
            </h2>

            <div className="highlight-box">
              <FontAwesomeIcon icon={faLightbulb} />
              <strong>Tip:</strong> Select up to 3 countries where you'd like to do your internship. This helps match you with the best opportunities.
            </div>

            <div className="form-row-3">
        <div className="form-group">
                <label>Preferred Location 1 <span className="required">*</span></label>
                <select
                  name="preferredLocation1"
                  value={formData.preferredLocation1}
                  onChange={handleInputChange}
                  className={errors.preferredLocation1 ? 'error' : ''}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.preferredLocation1 && <span className="error-text">{errors.preferredLocation1}</span>}
              </div>
              <div className="form-group">
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
              <div className="form-group">
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

            <div className="form-group">
              <label>Willing to Relocate for Internship? <span className="required">*</span></label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="willingToRelocate"
                    value="yes"
                    checked={formData.willingToRelocate === 'yes'}
                onChange={handleInputChange}
              />
                  <span>Yes, anywhere</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="willingToRelocate"
                    value="within-country"
                    checked={formData.willingToRelocate === 'within-country'}
                onChange={handleInputChange}
              />
                  <span>Within my country only</span>
                </label>
                <label className="radio-option">
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
          {errors.willingToRelocate && <span className="error-text">{errors.willingToRelocate}</span>}
            </div>

            <div className="form-group">
              <label>Internship Mode Preference <span className="required">*</span></label>
              <select
                name="internshipMode"
                value={formData.internshipMode}
                onChange={handleInputChange}
                className={errors.internshipMode ? 'error' : ''}
              >
                <option value="">Select preference</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="flexible">Flexible/Open to all</option>
              </select>
              {errors.internshipMode && <span className="error-text">{errors.internshipMode}</span>}
            </div>
          </div>


          {/* Education Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faGraduationCap} />
              Education
            </h2>

            <div className="form-group">
              <label>Current Academic Level <span className="required">*</span></label>
              <select
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleInputChange}
                className={errors.academicLevel ? 'error' : ''}
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
              {errors.academicLevel && <span className="error-text">{errors.academicLevel}</span>}
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} className="dynamic-item">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeEducation(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Institution Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="e.g., University of Nairobi, Strathmore University"
                    className={errors[`institutionEducation${index}`] ? 'error' : ''}
                  />
                  {errors[`institutionEducation${index}`] && <span className="error-text">{errors[`institutionEducation${index}`]}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
                    <label>Degree/Program Pursuing <span className="required">*</span></label>
            <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="e.g., Bachelor of Science"
                      className={errors[`degreeEducation${index}`] ? 'error' : ''}
                    />
                    {errors[`degreeEducation${index}`] && <span className="error-text">{errors[`degreeEducation${index}`]}</span>}
                  </div>
                  <div className="form-group">
                    <label>Field of Study <span className="required">*</span></label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                      placeholder="e.g., Computer Science, Business"
                      className={errors[`fieldOfStudyEducation${index}`] ? 'error' : ''}
                    />
                    {errors[`fieldOfStudyEducation${index}`] && <span className="error-text">{errors[`fieldOfStudyEducation${index}`]}</span>}
                  </div>
          </div>

                <div className="form-row">
          <div className="form-group">
                    <label>Institution Location</label>
            <input
                      type="text"
                      value={edu.institutionLocation}
                      onChange={(e) => updateEducation(index, 'institutionLocation', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="form-group">
                    <label>Current GPA/Grade</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                      placeholder="e.g., 3.8/4.0, First Class"
            />
          </div>
        </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Start Year</label>
          <input
                      type="number"
                      value={edu.eduStartYear}
                      onChange={(e) => updateEducation(index, 'eduStartYear', e.target.value)}
                      placeholder="2021"
                      min="2010"
                      max="2030"
          />
        </div>
                  <div className="form-group">
                    <label>Expected Graduation Year</label>
                    <input
                      type="number"
                      value={edu.eduEndYear}
                      onChange={(e) => updateEducation(index, 'eduEndYear', e.target.value)}
                      placeholder="2025"
                      min="2020"
                      max="2035"
                    />
      </div>
                </div>

                <div className="form-group">
                  <label>Year/Level Currently In</label>
                  <select
                    value={edu.currentYear}
                    onChange={(e) => updateEducation(index, 'currentYear', e.target.value)}
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

                <div className="form-group">
                  <label>Relevant Coursework</label>
                  <textarea
                    value={edu.coursework}
                    onChange={(e) => updateEducation(index, 'coursework', e.target.value)}
                    placeholder="List major courses relevant to your internship interests"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Academic Achievements & Awards</label>
                  <textarea
                    value={edu.achievements}
                    onChange={(e) => updateEducation(index, 'achievements', e.target.value)}
                    placeholder="Dean's List, Scholarships, Academic competitions, etc."
                    rows="2"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addEducation}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Education
            </button>
          </div>

          {/* Internship Objective Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faBullseye} />
              Internship Objective & Career Goals
        </h2>

        <div className="form-group">
              <label>Professional Objective/Summary <span className="required">*</span></label>
              <textarea
                name="objective"
                value={formData.objective}
                onChange={handleInputChange}
                placeholder="Write a brief statement about your career goals and what you hope to achieve through an internship."
                rows="4"
                className={errors.objective ? 'error' : ''}
              />
              {errors.objective && <span className="error-text">{errors.objective}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry of Interest <span className="required">*</span></label>
                <select
                  name="industryInterest"
                  value={formData.industryInterest}
                  onChange={handleInputChange}
                  className={errors.industryInterest ? 'error' : ''}
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
                {errors.industryInterest && <span className="error-text">{errors.industryInterest}</span>}
              </div>
              <div className="form-group">
                <label>Preferred Internship Role <span className="required">*</span></label>
          <input
            type="text"
                  name="preferredRole"
                  value={formData.preferredRole}
            onChange={handleInputChange}
                  placeholder="e.g., Software Developer, Marketing Intern, Financial Analyst"
                  className={errors.preferredRole ? 'error' : ''}
                />
                {errors.preferredRole && <span className="error-text">{errors.preferredRole}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Career Interests</label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faInfoCircle} />
                Add areas you're passionate about to help match with relevant opportunities
              </div>
              <SkillsInput
                skills={formData.interests}
                onAdd={(interest) => addInterest(interest)}
                onRemove={(index) => removeInterest(index)}
                placeholder="Enter career interest (e.g., Data Science, Digital Marketing)"
              />
            </div>
          </div>

          {/* Previous Experience Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faBriefcase} />
              Previous Internships & Work Experience
            </h2>
            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              Include any internships, part-time jobs, volunteer work, or relevant experience
            </div>

            {formData.experiences.map((exp, index) => (
              <div key={index} className="dynamic-item">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeExperience(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Position Title</label>
                  <input
                    type="text"
                    value={exp.positionTitle}
                    onChange={(e) => updateExperience(index, 'positionTitle', e.target.value)}
                    placeholder="e.g., Marketing Intern, Sales Assistant"
                  />
        </div>

        <div className="form-row">
          <div className="form-group">
                    <label>Company/Organization</label>
            <input
              type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={exp.companyLocation}
                      onChange={(e) => updateExperience(index, 'companyLocation', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
          </div>

                <div className="form-row">
          <div className="form-group">
                    <label>Type</label>
            <select
                      value={exp.experienceType}
                      onChange={(e) => updateExperience(index, 'experienceType', e.target.value)}
                    >
                      <option value="internship">Internship</option>
                      <option value="part-time">Part-time Job</option>
                      <option value="volunteer">Volunteer Work</option>
                      <option value="freelance">Freelance</option>
                      <option value="attachment">Industrial Attachment</option>
            </select>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      placeholder="e.g., 3 months, 6 weeks"
                    />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
                    <label>Start Date</label>
            <input
                      type="month"
                      value={exp.expStartDate}
                      onChange={(e) => updateExperience(index, 'expStartDate', e.target.value)}
                    />
          </div>
          <div className="form-group">
                    <label>End Date</label>
            <input
                      type="month"
                      value={exp.expEndDate}
                      onChange={(e) => updateExperience(index, 'expEndDate', e.target.value)}
            />
          </div>
        </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id={`currentlyWorking${index}`}
                    checked={exp.currentlyWorking}
                    onChange={(e) => updateExperience(index, 'currentlyWorking', e.target.checked)}
                  />
                  <label htmlFor={`currentlyWorking${index}`}>I currently work/intern here</label>
                </div>

        <div className="form-group">
                  <label>Responsibilities & Key Learnings</label>
          <textarea
                    value={exp.responsibilities}
                    onChange={(e) => updateExperience(index, 'responsibilities', e.target.value)}
                    placeholder="Describe what you did and what you learned from this experience"
            rows="3"
          />
        </div>
      </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addExperience}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Experience
            </button>
          </div>

          {/* Skills Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faLightbulb} />
              Skills & Competencies
        </h2>

        <div className="form-group">
              <label>Technical Skills <span className="required">*</span></label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faInfoCircle} />
                Add programming languages, software, tools, and technical abilities
              </div>
              <SkillsInput
                skills={formData.technicalSkills}
                onAdd={(skill) => addSkill('technicalSkills', skill)}
                onRemove={(index) => removeSkill('technicalSkills', index)}
                placeholder="e.g., Python, Microsoft Excel, AutoCAD"
              />
              {errors.technicalSkills && <span className="error-text">{errors.technicalSkills}</span>}
          </div>

            <div className="form-group">
              <label>Soft Skills</label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faInfoCircle} />
                Add communication, leadership, teamwork, and other interpersonal skills
        </div>
              <SkillsInput
                skills={formData.softSkills}
                onAdd={(skill) => addSkill('softSkills', skill)}
                onRemove={(index) => removeSkill('softSkills', index)}
                placeholder="e.g., Communication, Leadership, Problem-solving"
              />
            </div>
          </div>

          {/* Languages Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faLanguage} />
              Languages
            </h2>

        <div className="form-group">
              <label>Languages & Proficiency Levels <span className="required">*</span></label>
              <div className="highlight-box">
                <FontAwesomeIcon icon={faLightbulb} />
                <strong>Important for international internships:</strong> Language skills can significantly increase your opportunities
              </div>
              <LanguageInput
                languages={formData.languages}
                onAdd={(lang, prof) => addLanguage(lang, prof)}
                onRemove={(index) => removeLanguage(index)}
              />
              {errors.languages && <span className="error-text">{errors.languages}</span>}
            </div>
          </div>

          {/* Projects Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faProjectDiagram} />
              Academic Projects & Portfolio
            </h2>

            {formData.projects.map((proj, index) => (
              <div key={index} className="dynamic-item">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeProject(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={proj.projectTitle}
                    onChange={(e) => updateProject(index, 'projectTitle', e.target.value)}
                    placeholder="e.g., E-commerce Website, Marketing Campaign Analysis"
                  />
          </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Project Type</label>
          <select
                      value={proj.projectType}
                      onChange={(e) => updateProject(index, 'projectType', e.target.value)}
                    >
                      <option value="course">Course Project</option>
                      <option value="capstone">Capstone/Final Year Project</option>
                      <option value="research">Research Project</option>
                      <option value="personal">Personal Project</option>
                      <option value="team">Team Project</option>
                      <option value="competition">Competition/Hackathon</option>
          </select>
                  </div>
                  <div className="form-group">
                    <label>Your Role</label>
                    <input
                      type="text"
                      value={proj.projectRole}
                      onChange={(e) => updateProject(index, 'projectRole', e.target.value)}
                      placeholder="e.g., Team Leader, Developer"
                    />
                  </div>
        </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Project Date</label>
                    <input
                      type="month"
                      value={proj.projectDate}
                      onChange={(e) => updateProject(index, 'projectDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Link/URL</label>
                    <input
                      type="url"
                      value={proj.projectUrl}
                      onChange={(e) => updateProject(index, 'projectUrl', e.target.value)}
                      placeholder="https://github.com/yourproject"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                    value={proj.projectDescription}
                    onChange={(e) => updateProject(index, 'projectDescription', e.target.value)}
                    placeholder="Describe the project, technologies used, your contributions, and outcomes/results"
                    rows="3"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addProject}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Project
            </button>
          </div>

          {/* Activities Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faUsers} />
              Extracurricular Activities & Leadership
            </h2>

            {formData.activities.map((act, index) => (
              <div key={index} className="dynamic-item">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeActivity(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-group">
                  <label>Activity/Organization Name</label>
                  <input
                    type="text"
                    value={act.activityName}
                    onChange={(e) => updateActivity(index, 'activityName', e.target.value)}
                    placeholder="e.g., Student Council, Debate Club, Sports Team"
                  />
        </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Your Role/Position</label>
                    <input
                      type="text"
                      value={act.activityRole}
                      onChange={(e) => updateActivity(index, 'activityRole', e.target.value)}
                      placeholder="e.g., President, Member, Captain"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={act.activityDuration}
                      onChange={(e) => updateActivity(index, 'activityDuration', e.target.value)}
                      placeholder="e.g., 2 years, 2021-2023"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description & Achievements</label>
                  <textarea
                    value={act.activityDescription}
                    onChange={(e) => updateActivity(index, 'activityDescription', e.target.value)}
                    placeholder="Describe your involvement and any notable achievements or contributions"
                    rows="2"
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addActivity}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Activity
            </button>
          </div>

          {/* Certifications Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faCertificate} />
              Certifications & Training
            </h2>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="certification-entry">
                <div className="entry-header">
                  <h3 className="entry-title">Certification {index + 1}</h3>
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      className="remove-entry-btn"
                      onClick={() => removeCertification(index)}
                      title="Remove this certification"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
        </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Certification Name</label>
          <input
            type="text"
                      name={`certifications[${index}].certName`}
                      value={String(cert?.certName || '')}
            onChange={handleInputChange}
                      placeholder="e.g., Google Analytics, First Aid, Microsoft Office Specialist"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      name={`certifications[${index}].certIssuer`}
                      value={String(cert?.certIssuer || '')}
                      onChange={handleInputChange}
                      placeholder="e.g., Google, Red Cross, Microsoft"
                    />
                  </div>
        </div>

                <div className="form-row">
        <div className="form-group">
                    <label>Issue Date</label>
                    <input
                      type="month"
                      name={`certifications[${index}].certDate`}
                      value={String(cert?.certDate || '')}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Credential ID/URL</label>
            <input
              type="text"
                      name={`certifications[${index}].credentialId`}
                      value={String(cert?.credentialId || '')}
                      onChange={handleInputChange}
                      placeholder="Certificate number or verification link"
                    />
                  </div>
                </div>
              </div>
            ))}

                  <button
                    type="button"
              className="add-entry-btn"
              onClick={addCertification}
                  >
              <FontAwesomeIcon icon={faPlus} />
              Add Another Certification
                  </button>
          </div>

          {/* References Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faUserCheck} />
              References
            </h2>
            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              Provide contacts of professors, teachers, or previous supervisors who can vouch for you
            </div>

            {formData.references.map((ref, index) => (
              <div key={index} className="dynamic-item">
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeReference(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Reference Name</label>
                    <input
                      type="text"
                      value={ref.referenceName}
                      onChange={(e) => updateReference(index, 'referenceName', e.target.value)}
                      placeholder="Full name"
                    />
          </div>
                  <div className="form-group">
                    <label>Title/Position</label>
                    <input
                      type="text"
                      value={ref.referenceTitle}
                      onChange={(e) => updateReference(index, 'referenceTitle', e.target.value)}
                      placeholder="e.g., Professor, Manager"
                    />
                  </div>
        </div>

        <div className="form-row">
          <div className="form-group">
                    <label>Organization/Institution</label>
            <input
                      type="text"
                      value={ref.referenceOrg}
                      onChange={(e) => updateReference(index, 'referenceOrg', e.target.value)}
                      placeholder="University or Company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={ref.referenceRelationship}
                      onChange={(e) => updateReference(index, 'referenceRelationship', e.target.value)}
                      placeholder="e.g., Professor, Former Supervisor"
                    />
                  </div>
          </div>

                <div className="form-row">
          <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={ref.referenceEmail}
                      onChange={(e) => updateReference(index, 'referenceEmail', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={ref.referencePhone}
                      onChange={(e) => updateReference(index, 'referencePhone', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-more-btn" onClick={addReference}>
              <FontAwesomeIcon icon={faPlus} /> Add Another Reference
            </button>
          </div>

          {/* Online Presence Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faLink} />
              Online Presence & Portfolio
            </h2>
            <div className="info-badge">
              <FontAwesomeIcon icon={faInfoCircle} />
              Add your professional online profiles and portfolio links
            </div>

            <ProfessionalLinksInput
              links={formData.professionalLinks}
              onAdd={(type, url) => addProfessionalLink(type, url)}
              onRemove={(index) => removeProfessionalLink(index)}
            />
          </div>

          {/* Internship Preferences Section */}
          <div className="section-comprehensive">
            <h2 className="section-title-comprehensive">
              <FontAwesomeIcon icon={faSlidersH} />
              Internship Preferences & Availability
            </h2>

            <div className="form-row">
              <div className="form-group">
                <label>Internship Duration Preference <span className="required">*</span></label>
            <select
                  name="internshipDuration"
                  value={formData.internshipDuration}
              onChange={handleInputChange}
                  className={errors.internshipDuration ? 'error' : ''}
                >
                  <option value="">Select preferred duration</option>
                  <option value="1-2-months">1-2 months</option>
                  <option value="3-months">3 months</option>
                  <option value="4-6-months">4-6 months</option>
                  <option value="6-12-months">6-12 months</option>
                  <option value="flexible">Flexible</option>
            </select>
                {errors.internshipDuration && <span className="error-text">{errors.internshipDuration}</span>}
              </div>
              <div className="form-group">
                <label>Availability to Start <span className="required">*</span></label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className={errors.availability ? 'error' : ''}
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
                {errors.availability && <span className="error-text">{errors.availability}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
                <label>Internship Timing Preference <span className="required">*</span></label>
            <select
                  name="internshipTiming"
                  value={formData.internshipTiming}
              onChange={handleInputChange}
                  className={errors.internshipTiming ? 'error' : ''}
                >
                  <option value="">Select timing</option>
                  <option value="full-time">Full-time (during break)</option>
                  <option value="part-time">Part-time (during semester)</option>
                  <option value="flexible">Flexible</option>
            </select>
                {errors.internshipTiming && <span className="error-text">{errors.internshipTiming}</span>}
          </div>
              <div className="form-group">
                <label>Expected Stipend/Allowance (Monthly)</label>
                <input
                  type="text"
                  name="expectedStipend"
                  value={formData.expectedStipend}
                  onChange={handleInputChange}
                  placeholder="e.g., USD 500, KES 20,000, or Unpaid"
                />
            </div>
          </div>

            <div className="form-group">
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

            <div className="form-group">
              <label>Willing to Accept Unpaid Internship?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unpaidWilling"
                    value="yes"
                    checked={formData.unpaidWilling === 'yes'}
                    onChange={handleInputChange}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unpaidWilling"
                    value="prefer-paid"
                    checked={formData.unpaidWilling === 'prefer-paid'}
                    onChange={handleInputChange}
                  />
                  <span>Prefer paid but open</span>
                </label>
                <label className="radio-option">
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

        <div className="form-group">
              <label>Do you require academic credit for this internship?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="academicCredit"
                    value="yes"
                    checked={formData.academicCredit === 'yes'}
                    onChange={handleInputChange}
                  />
                  <span>Yes, required</span>
          </label>
                <label className="radio-option">
            <input
                    type="radio"
                    name="academicCredit"
                    value="preferred"
                    checked={formData.academicCredit === 'preferred'}
                    onChange={handleInputChange}
                  />
                  <span>Preferred but not required</span>
                </label>
                <label className="radio-option">
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

        <div className="form-group">
              <label>Hobbies & Interests</label>
          <textarea
                name="hobbies"
                value={formData.hobbies}
            onChange={handleInputChange}
                placeholder="Share your interests outside academics (sports, music, reading, volunteering, etc.)"
                rows="3"
          />
        </div>

        <div className="form-group">
              <label>Why are you seeking an internship?</label>
          <textarea
                name="whyInternship"
                value={formData.whyInternship}
            onChange={handleInputChange}
                placeholder="Share your motivation and what you hope to gain from an internship experience"
                rows="3"
          />
        </div>

        <div className="form-group">
              <label>Additional Comments or Special Requirements</label>
          <textarea
                name="additionalComments"
                value={formData.additionalComments}
            onChange={handleInputChange}
                placeholder="Any other information you'd like to share with potential employers (disabilities requiring accommodation, visa requirements, etc.)"
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
              />
              <label htmlFor="agreeTerms">
                I agree to the Terms of Service and Privacy Policy <span className="required">*</span>
              </label>
              {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
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
                I agree to be contacted by employers and recruiters for internship opportunities
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="accurateInfo"
                name="accurateInfo"
                checked={formData.accurateInfo}
                onChange={handleInputChange}
              />
              <label htmlFor="accurateInfo">
                I confirm that all information provided is accurate and truthful <span className="required">*</span>
              </label>
              {errors.accurateInfo && <span className="error-text">{errors.accurateInfo}</span>}
            </div>

            {/* Submit Button - Part of the form */}
            <div style={{marginTop: '30px', textAlign: 'center'}}>
              <button type="submit" className="submit-btn">
                <i className="fas fa-check-circle"></i> Create Internship Profile
              </button>
              <p style={{marginTop: '15px', color: '#666', fontSize: '14px'}}>
                Your profile will be visible to companies offering internships nationally and internationally
              </p>
            </div>
          </div>
        </form>
                  </div>
            </div>
          </div>
      </main>
    </div>
  );
};

// Helper Components
const SkillsInput = ({ skills, onAdd, onRemove, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

      return (
    <div>
      <div className="skills-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        <button type="button" className="add-btn" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
            </div>
      <div className="tags-container">
        {skills.map((skill, index) => (
          <span key={index} className="tag">
            {skill}
            <span className="remove" onClick={() => onRemove(index)}>×</span>
          </span>
        ))}
          </div>
        </div>
      );
};

const LanguageInput = ({ languages, onAdd, onRemove }) => {
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');

  const handleAdd = () => {
    if (language.trim() && proficiency) {
      onAdd(language.trim(), proficiency);
      setLanguage('');
      setProficiency('');
    }
  };

    return (
    <div>
      <div className="language-proficiency">
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Enter language (e.g., English, French)"
        />
        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
          <option value="">Select Level</option>
          <option value="native">Native/Bilingual</option>
          <option value="fluent">Fluent</option>
          <option value="advanced">Advanced</option>
          <option value="intermediate">Intermediate</option>
          <option value="basic">Basic</option>
        </select>
      </div>
      <button type="button" className="add-btn" onClick={handleAdd} style={{ marginTop: '10px' }}>
        <FontAwesomeIcon icon={faPlus} /> Add Language
      </button>
      <div className="tags-container" style={{ marginTop: '10px' }}>
        {languages.map((lang, index) => (
          <span key={index} className="tag">
            {lang.language} - {lang.proficiency}
            <span className="remove" onClick={() => onRemove(index)}>×</span>
          </span>
        ))}
        </div>
      </div>
    );
};

const ProfessionalLinksInput = ({ links, onAdd, onRemove }) => {
  const [linkType, setLinkType] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleAdd = () => {
    if (linkType && linkUrl.trim()) {
      // Validate URL format
      try {
        new URL(linkUrl);
        onAdd(linkType, linkUrl.trim());
        setLinkType('');
        setLinkUrl('');
      } catch (e) {
        alert('Please enter a valid URL (including https://)');
      }
    } else {
      alert('Please select a link type and enter a URL');
    }
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label>Link Type</label>
          <select value={linkType} onChange={(e) => setLinkType(e.target.value)}>
            <option value="">Select link type</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="GitHub">GitHub</option>
            <option value="Personal">Personal Website/Portfolio</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Other">Other Professional</option>
          </select>
            </div>
        <div className="form-group">
          <label>URL</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com/yourprofile"
          />
            </div>
          </div>
      <button type="button" className="add-btn" onClick={handleAdd} style={{ marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faPlus} /> Add Link
                    </button>
      <div style={{ marginTop: '15px' }}>
        {links.map((link, index) => (
          <div key={index} className="link-item">
            <div className="link-item-content">
              <div className="link-item-type">
                <FontAwesomeIcon icon={faLink} /> {link.type}
                </div>
              <div className="link-item-url">
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
              </div>
            </div>
            <button type="button" className="remove-item-btn" onClick={() => onRemove(index)}>×</button>
        </div>
        ))}
      </div>
    </div>
  );
};

export default InternDetailsForm;
