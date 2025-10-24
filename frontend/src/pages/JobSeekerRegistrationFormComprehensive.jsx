import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faCalendar, faMapMarkerAlt,
  faGraduationCap, faBriefcase, faRocket, faUpload, faCheck,
  faInfoCircle, faCamera, faGlobe, faPlus, faTimes,
  faPassport, faMapMarked, faBullseye, faLightbulb, faLanguage,
  faCertificate, faUsers, faUserCheck, faLink, faSlidersH,
  faBuilding, faCheckCircle, faSave, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAutoSave } from '../hooks/useAutoSave';
import AutoSaveStatus from '../components/AutoSaveStatus';
// import '../styles/JobSeekerRegistrationFormComprehensive.css'; // Replaced by unified CSS
import globalSkills from '../data/global_skills.json';

import LocationMap from '../components/LocationMap';

const JobSeekerRegistrationFormComprehensive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;
  // Map handled by LocationMap component

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
        
        // Try jobseeker profile first (has more detailed data including draft status)
        let response = await fetch(buildApiUrl('/api/jobseeker/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Fallback to general profile
          response = await fetch(buildApiUrl('/api/profile/profile'), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log('📋 Fetched user profile for registration form:', data);
          console.log('📋 Is draft:', data.isDraft);
          console.log('📋 Profile completed:', data.profileCompleted);
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

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
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

  // Initialize form data with auto-save (2-minute periodic save)
  const {
    formData,
    setFormData,
    isSaving,
    saveStatus,
    lastSaveTime,
    lastBackendSaveTime,
    forceSave,
    hasRecentSave,
    clearSavedData
  } = useAutoSave(
    {
      // Personal Information
      firstName: existingData?.firstName || userData.firstName || userProfileData?.firstName || user?.firstName || localStorage.getItem('userFirstName') || '',
      middleName: existingData?.middleName || userProfileData?.middleName || '',
      lastName: existingData?.lastName || userData.lastName || userProfileData?.lastName || user?.lastName || localStorage.getItem('userLastName') || '',
      email: existingData?.email || userData.email || userProfileData?.email || user?.email || localStorage.getItem('userEmail') || '',
      phone: existingData?.phone || userData.phone || userProfileData?.phone || user?.phone || user?.phoneNumber || localStorage.getItem('userPhone') || localStorage.getItem('phone') || '',
      altPhone: existingData?.altPhone || userProfileData?.altPhone || '',
      dateOfBirth: existingData?.dateOfBirth || '',
      gender: existingData?.gender || '',
      bloodGroup: existingData?.bloodGroup || '',
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
      professionalLinks: Array.isArray(existingData?.professionalLinks) ? existingData.professionalLinks : [],
      
      // Job Preferences
      preferredJobTitles: existingData?.preferredJobTitles || '',
      jobType: existingData?.jobType || '',
      noticePeriod: existingData?.noticePeriod || '',
      currentSalary: existingData?.currentSalary || '',
      expectedSalary: existingData?.expectedSalary || '',
      currencyPreference: existingData?.currencyPreference || 'USD',
      travelAvailability: existingData?.travelAvailability || '',
      
      // Additional Information
      careerObjectives: existingData?.careerObjectives || '',
      hobbies: existingData?.hobbies || '',
      additionalComments: existingData?.additionalComments || '',
      agreeTerms: existingData?.agreeTerms || false,
      allowContact: existingData?.allowContact || false
    },
    AUTOSAVE_KEY,
    1000, // Debounce delay (1 second)
    backendSaveCallback, // Backend save callback for periodic saves
    true // Enable periodic 2-minute localStorage + 5-minute backend auto-save
  );

  const [skillInput, setSkillInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [languageInput, setLanguageInput] = useState({ language: '', proficiency: '' });
  const [linkInput, setLinkInput] = useState({ type: '', url: '' });
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});
  
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
        bloodGroup: prev.bloodGroup || userProfileData.bloodGroup || '',
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
        preferredJobTitles: prev.preferredJobTitles || userProfileData.preferredJobTitles || '',
        jobType: prev.jobType || userProfileData.jobType || '',
        noticePeriod: prev.noticePeriod || userProfileData.noticePeriod || '',
        currentSalary: prev.currentSalary || userProfileData.currentSalary || '',
        expectedSalary: prev.expectedSalary || userProfileData.expectedSalary || '',
        
        // Professional Links
        professionalLinks: (prev.professionalLinks?.length > 0 ? prev.professionalLinks : userProfileData.professionalLinks) || prev.professionalLinks
      }));
    }
  }, [userProfileData, user, setFormData]);

  // Map behavior (moved to LocationMap)

  // Calculate progress - 100% accurate calculation
  useEffect(() => {
    const calculateProgress = () => {
      // IMPORTANT: Use backend's progress calculation for consistency with dashboard
      // Backend uses weighted calculation from utils/profile_progress.py
      if (userProfileData && userProfileData.profileCompletion !== undefined) {
        const backendProgress = userProfileData.profileCompletion || userProfileData.profileStatus?.completionPercentage || 0;
        console.log('📊 Using backend progress calculation:', backendProgress, '%');
        setProgressPercentage(backendProgress);
        // Still calculate section progress for UI
        // Continue with local section calculations below for the progress bars per section
      }
      
      let filledFields = 0;
      let totalFields = 0;
      let sectionProgress = {};

      // Helper function to check if a field has meaningful content
      const hasContent = (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'boolean') return true;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      };

      // Helper function to check if an array entry has meaningful content
      const hasArrayContent = (array, requiredFields = []) => {
        if (!Array.isArray(array) || array.length === 0) return false;
        return array.some(entry => {
          if (requiredFields.length === 0) {
            return Object.values(entry).some(val => hasContent(val));
          }
          return requiredFields.every(field => hasContent(entry[field]));
        });
      };

      // 1. Personal Information Section (8 fields)
      const personalFields = [
        { name: 'firstName', required: true },
        { name: 'lastName', required: true },
        { name: 'email', required: true },
        { name: 'phone', required: true },
        { name: 'dateOfBirth', required: true },
        { name: 'gender', required: true },
        { name: 'bloodGroup', required: false },
        { name: 'community', required: false }
      ];
      
      let personalFilled = 0;
      personalFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          personalFilled++;
        }
      });
      sectionProgress.personal = Math.round((personalFilled / personalFields.length) * 100);

      // 2. Nationality & Residency Section (7 fields)
      const residencyFields = [
        { name: 'nationality', required: true },
        { name: 'residentCountry', required: true },
        { name: 'currentCity', required: true },
        { name: 'postalCode', required: false },
        { name: 'address', required: false },
        { name: 'latitude', required: false },
        { name: 'workPermit', required: true }
      ];
      
      let residencyFilled = 0;
      residencyFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          residencyFilled++;
        }
      });
      sectionProgress.residency = Math.round((residencyFilled / residencyFields.length) * 100);

      // 3. Preferred Working Locations Section (5 fields)
      const locationFields = [
        { name: 'preferredLocation1', required: true },
        { name: 'preferredLocation2', required: false },
        { name: 'preferredLocation3', required: false },
        { name: 'willingToRelocate', required: true },
        { name: 'workLocation', required: true }
      ];
      
      let locationFilled = 0;
      locationFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          locationFilled++;
        }
      });
      sectionProgress.location = Math.round((locationFilled / locationFields.length) * 100);

      // 4. Professional Profile Section (5 fields)
      const professionalFields = [
        { name: 'professionalTitle', required: true },
        { name: 'yearsExperience', required: true },
        { name: 'careerLevel', required: true },
        { name: 'industry', required: true },
        { name: 'summary', required: true }
      ];
      
      let professionalFilled = 0;
      professionalFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          professionalFilled++;
        }
      });
      sectionProgress.professional = Math.round((professionalFilled / professionalFields.length) * 100);

      // 5. Work Experience Section (Array-based)
      const hasWorkExperience = hasArrayContent(formData.experienceEntries, ['jobTitle', 'company']);
      totalFields += 2; // Count as 2 fields for experience
      if (hasWorkExperience) {
        filledFields += 2;
      }
      sectionProgress.experience = hasWorkExperience ? 100 : 0;

      // 6. Education Section (Array-based)
      const hasEducation = hasArrayContent(formData.educationEntries, ['degreeType', 'institution']);
      totalFields += 2; // Count as 2 fields for education
      if (hasEducation) {
        filledFields += 2;
      }
      sectionProgress.education = hasEducation ? 100 : 0;

      // 7. Skills Section (2 arrays)
      const hasCoreSkills = hasContent(formData.coreSkills);
      const hasTools = hasContent(formData.tools);
      totalFields += 2;
      if (hasCoreSkills) filledFields++;
      if (hasTools) filledFields++;
      sectionProgress.skills = Math.round(((hasCoreSkills ? 1 : 0) + (hasTools ? 1 : 0)) / 2 * 100);

      // 8. Languages Section (Array-based)
      const hasLanguages = hasContent(formData.languages);
      totalFields++;
      if (hasLanguages) filledFields++;
      sectionProgress.languages = hasLanguages ? 100 : 0;

      // 9. Certifications Section (Array-based)
      const hasCertifications = hasArrayContent(formData.certificationEntries, ['certificationName', 'certIssuer']);
      totalFields++;
      if (hasCertifications) filledFields++;
      sectionProgress.certifications = hasCertifications ? 100 : 0;

      // 10. Professional Memberships Section (3 fields)
      const membershipFields = [
        { name: 'membershipOrg', required: false },
        { name: 'membershipType', required: false },
        { name: 'membershipDate', required: false }
      ];
      
      let membershipFilled = 0;
      membershipFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          membershipFilled++;
        }
      });
      sectionProgress.memberships = Math.round((membershipFilled / membershipFields.length) * 100);

      // 11. References Section (Array-based)
      const hasReferences = hasArrayContent(formData.referenceEntries, ['referenceName', 'referenceTitle']);
      totalFields++;
      if (hasReferences) filledFields++;
      sectionProgress.references = hasReferences ? 100 : 0;

      // 12. Professional Links Section (Array-based)
      const hasProfessionalLinks = hasContent(formData.professionalLinks);
      totalFields++;
      if (hasProfessionalLinks) filledFields++;
      sectionProgress.links = hasProfessionalLinks ? 100 : 0;

      // 13. Job Preferences Section (7 fields)
      const jobPrefFields = [
        { name: 'preferredJobTitles', required: false },
        { name: 'jobType', required: true },
        { name: 'noticePeriod', required: true },
        { name: 'currentSalary', required: false },
        { name: 'expectedSalary', required: false },
        { name: 'currencyPreference', required: false },
        { name: 'travelAvailability', required: false }
      ];
      
      let jobPrefFilled = 0;
      jobPrefFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          jobPrefFilled++;
        }
      });
      sectionProgress.jobPreferences = Math.round((jobPrefFilled / jobPrefFields.length) * 100);

      // 14. Additional Information Section (4 fields)
      const additionalFields = [
        { name: 'careerObjectives', required: false },
        { name: 'hobbies', required: false },
        { name: 'additionalComments', required: false },
        { name: 'agreeTerms', required: true }
      ];
      
      let additionalFilled = 0;
      additionalFields.forEach(field => {
        totalFields++;
        if (hasContent(formData[field.name])) {
          filledFields++;
          additionalFilled++;
        }
      });
      sectionProgress.additional = Math.round((additionalFilled / additionalFields.length) * 100);

      // Calculate overall progress
      const progress = Math.min((filledFields / totalFields) * 100, 100);
      const roundedProgress = Math.round(progress);
      
      // Only use local calculation if backend value is not available
      if (!userProfileData || userProfileData.profileCompletion === undefined) {
        setProgressPercentage(roundedProgress);
      }
      setSectionProgress(sectionProgress);
      
      // Debug logging
      const finalProgress = (userProfileData && userProfileData.profileCompletion !== undefined) 
        ? userProfileData.profileCompletion 
        : roundedProgress;
      
      console.log('📊 Progress Calculation:', {
        filledFields,
        totalFields,
        localProgress: roundedProgress,
        backendProgress: userProfileData?.profileCompletion,
        usingProgress: finalProgress,
        sectionProgress
      });
    };

    calculateProgress();
  }, [formData, userProfileData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hide validation message when user makes a selection
    const validationMessage = e.target.closest('.form-group-comprehensive')?.querySelector('.validation-message');
    if (validationMessage) {
      validationMessage.style.display = 'none';
    }
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

  // New function to save to backend (for both manual "Save Now" and auto-save)
  const saveToBackend = async (showSuccessMessage = false, redirectAfterSave = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️  No token found, skipping backend save');
        return false;
      }

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
      
      // Mark as draft (NOT completed)
      formDataToSend.append('profileCompleted', 'false');
      formDataToSend.append('isDraft', 'true');
      formDataToSend.append('draftSavedAt', new Date().toISOString());
      
      console.log('💾 Saving to backend...', {
        totalFields: Object.keys(formData).length,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const responseClone = response.clone();
      let data;
      
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('❌ Failed to parse response as JSON:', jsonError);
        const textResponse = await responseClone.text();
        console.error('Response text:', textResponse);
        if (showSuccessMessage) {
          setSubmitError('Server error occurred. Please try again.');
        }
        return false;
      }

      if (response.ok) {
        // Keep saved form data for later resumption
        localStorage.setItem('profileCompleted', 'false');
        localStorage.setItem('isDraft', 'true');
        
        console.log('✅ Successfully saved to backend');
        
        if (showSuccessMessage) {
          setSubmitError('✓ Data saved successfully!' + (redirectAfterSave ? ' Redirecting to dashboard...' : ''));
        }
        
        if (redirectAfterSave) {
          setTimeout(() => {
            window.location.href = '/jobseeker-dashboard';
          }, 1500);
        }
        
        return true;
      } else {
        console.error('❌ Backend save failed:', data);
        
        // Check if this is an age restriction error
        if (data.age_restriction) {
          alert('You must be at least 18 years old to create an account. You will be redirected to the homepage.');
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

  // Manual save function (for "Save Now" button)
  const handleManualSave = async () => {
    setIsLoading(true);
    setSubmitError('');
    
    try {
      // First save to localStorage (instant feedback)
      forceSave();
      
      // Then save to backend
      await saveToBackend(true, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    setSubmitError('');

    try {
      // Save to localStorage first
      forceSave();
      
      // Then save to backend and redirect
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
    
    // Show validation messages for required fields
    const form = e.target;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
      const formGroup = field.closest('.form-group-comprehensive');
      const validationMessage = formGroup?.querySelector('.validation-message');
      
      if (!field.value && validationMessage) {
        validationMessage.style.display = 'block';
      }
    });
    
    // Check if any required fields are empty
    const hasEmptyRequiredFields = Array.from(requiredFields).some(field => !field.value);
    if (hasEmptyRequiredFields) {
      return; // Stop submission if there are empty required fields
    }
    
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
      
      // Mark profile as completed
      formDataToSend.append('profileCompleted', 'true');
      formDataToSend.append('hasCompletedProfile', 'true');
      
      console.log('📋 Registration form - Profile completion flags added to payload');
      console.log('📋 Registration form - Sending to:', buildApiUrl('/api/jobseeker/complete-profile'));

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      console.log('📋 Registration form - Response status:', response.status);
      console.log('📋 Registration form - Response data:', data);

      if (response.ok) {
        // Clear saved form data on successful submission
        clearSavedData();
        
        // Sync updated identity into auth context and localStorage so header/dashboard show correct name
        try {
          if (formData.firstName) localStorage.setItem('userFirstName', formData.firstName);
          if (formData.lastName) localStorage.setItem('userLastName', formData.lastName);
          if (formData.email) localStorage.setItem('userEmail', formData.email);
          // Mark profile as completed in localStorage
          localStorage.setItem('profileCompleted', 'true');
          localStorage.setItem('hasCompletedProfile', 'true');
          if (typeof updateUser === 'function') {
            updateUser({ 
              firstName: formData.firstName, 
              lastName: formData.lastName, 
              email: formData.email,
              profileCompleted: true,
              hasCompletedProfile: true
            });
          }
        } catch { /* no-op */ }

        // Update user context to mark profile as completed
        alert('Profile completed successfully! Redirecting to your dashboard...');
        
        // Force refresh of user data to ensure profile completion is detected
        setTimeout(() => {
          // Clear any cached data and reload to ensure fresh authentication state
          sessionStorage.clear();
          localStorage.setItem('profileCompleted', 'true');
          localStorage.setItem('hasCompletedProfile', 'true');
          // Reload the page to ensure fresh authentication state
          window.location.href = '/jobseeker-dashboard';
        }, 1000);
      } else {
        // Check if this is an age restriction error
        if (data.age_restriction) {
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
          setSubmitError(data.error || 'Failed to submit profile. Please try again.');
        }
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <style>{`
        /* Style for required/mandatory fields - reddish border */
        .form-group-comprehensive input[required],
        .form-group-comprehensive select[required],
        .form-group-comprehensive textarea[required] {
          border-color: #e74c3c !important;
          border-width: 2px;
        }
        
        /* Style for optional fields - normal orange border */
        .form-group-comprehensive input:not([required]),
        .form-group-comprehensive select:not([required]),
        .form-group-comprehensive textarea:not([required]) {
          border-color: #f39c12;
          border-width: 2px;
        }
        
        /* Custom validation styling to show errors above fields */
        .form-group-comprehensive input:invalid,
        .form-group-comprehensive select:invalid,
        .form-group-comprehensive textarea:invalid {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }
        
        .form-group-comprehensive input:invalid + .validation-message,
        .form-group-comprehensive select:invalid + .validation-message,
        .form-group-comprehensive textarea:invalid + .validation-message,
        .form-group-comprehensive .validation-message {
          display: none;
        }
        
        .form-group-comprehensive:has(input:invalid) .validation-message,
        .form-group-comprehensive:has(select:invalid) .validation-message,
        .form-group-comprehensive:has(textarea:invalid) .validation-message {
          display: block;
        }
        
        .validation-message {
          display: none;
          position: absolute;
          top: -35px;
          left: 0;
          right: 0;
          background: #fff5f5;
          border: 1px solid #dc3545;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          color: #dc3545;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .validation-message::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 20px;
          border: 5px solid transparent;
          border-top-color: #dc3545;
        }
        
        .validation-message::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 19px;
          border: 4px solid transparent;
          border-top-color: #fff5f5;
        }
        
        .form-group-comprehensive {
          position: relative;
        }
        
        .radio-group-comprehensive {
          position: relative;
        }
        
        .radio-group-comprehensive:invalid + .validation-message {
          display: block;
        }
        
        /* Custom validation for radio groups */
        .radio-group-comprehensive input:invalid {
          border: 2px solid #dc3545;
        }
        
        /* Style for required radio buttons */
        .radio-group-comprehensive input[type="radio"][required] {
          outline: 2px solid #e74c3c;
          outline-offset: 2px;
        }
        
        /* Ensure validation messages appear above all form elements */
        .form-group-comprehensive input:focus:invalid + .validation-message,
        .form-group-comprehensive select:focus:invalid + .validation-message,
        .form-group-comprehensive textarea:focus:invalid + .validation-message {
          display: block;
        }
        
        /* Better visibility for required field labels */
        .required-comprehensive {
          color: #e74c3c;
          font-weight: bold;
          margin-left: 3px;
        }
      `}</style>
      {/* Header */}
      <header className="jobseeker-header">
        <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 30px 12px 5px' }}>
          <div className="header-left" onClick={() => navigate('/jobseeker-dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">
              <img src="/AK_logo.png" alt="AksharJobs Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <div className="logo-text">
              <h3 className="logo-title" style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>AksharJobs</h3>
              <p className="logo-subtitle" style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>Job Seeker Profile</p>
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
                {saveStatus === 'saved' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#27ae60' }}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Auto-saved {lastSaveTime && `at ${lastSaveTime.toLocaleTimeString()}`}</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e74c3c' }}>
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Save failed - data preserved locally</span>
                  </div>
                )}
                {saveStatus === 'loaded' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3498db' }}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Previous data restored</span>
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
                className="manual-save-btn"
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
                  marginRight: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSaving && !isLoading) {
                    e.target.style.background = '#2980b9';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSaving && !isLoading) {
                    e.target.style.background = '#3498db';
                  }
                }}
              >
                <FontAwesomeIcon icon={faSave} /> {(isSaving || isLoading) ? 'Saving...' : 'Save Now'}
              </button>
              <button
                className="draft-save-btn"
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
                  marginRight: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#4b5563';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#6b7280';
                  }
                }}
              >
                <FontAwesomeIcon icon={faEdit} /> Save as Draft
              </button>
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

          {/* Draft Banner */}
          {userProfileData?.isDraft && (
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FontAwesomeIcon icon={faEdit} />
              <div>
                <strong>Resuming Draft Profile</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Your previously saved draft has been loaded. Complete the remaining fields and submit to finish your profile.
                </p>
              </div>
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
                  Let's get started! Fill out your profile information.
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
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>14</div>
                <div style={{ color: '#000000' }}>Sections</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000000' }}>50+</div>
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
                    { key: 'personal', name: 'Personal Info', icon: '👤' },
                    { key: 'residency', name: 'Nationality', icon: '🌍' },
                    { key: 'location', name: 'Locations', icon: '📍' },
                    { key: 'professional', name: 'Professional', icon: '💼' },
                    { key: 'experience', name: 'Experience', icon: '🏢' },
                    { key: 'education', name: 'Education', icon: '🎓' },
                    { key: 'skills', name: 'Skills', icon: '⚡' },
                    { key: 'languages', name: 'Languages', icon: '🗣️' },
                    { key: 'certifications', name: 'Certifications', icon: '📜' },
                    { key: 'jobPreferences', name: 'Job Prefs', icon: '⚙️' },
                    { key: 'additional', name: 'Additional', icon: '📝' }
                  ].map(section => (
                    <div key={section.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: sectionProgress[section.key] === 100 ? 0.6 : 1
                    }}>
                      <span style={{
                        color: sectionProgress[section.key] === 100 ? '#0d9488' : '#000000',
                        fontSize: '14px'
                      }}>
                        {sectionProgress[section.key] === 100 ? '✅' : section.icon}
                      </span>
                      <span style={{
                        textDecoration: sectionProgress[section.key] === 100 ? 'line-through' : 'none',
                        opacity: sectionProgress[section.key] === 100 ? 0.7 : 1,
                        color: '#000000'
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
          <h2 className="section-title-comprehensive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faUser} />
              Personal Information
            </span>
            <span style={{
              background: '#000000',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {sectionProgress.personal || 0}%
            </span>
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
            <div className="form-group-comprehensive">
              <label>Blood Group</label>
              <select 
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
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
          <h2 className="section-title-comprehensive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faPassport} />
              Nationality & Residency
            </span>
            <span style={{
              background: '#000000',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {sectionProgress.residency || 0}%
            </span>
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
            <LocationMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              address={formData.address}
              onLocationChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
              onAddressChange={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
            />
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
            <div className="validation-message">Please select one of these options.</div>
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
              <div className="validation-message">Please select an item in the list.</div>
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
            <div className="validation-message">Please select one of these options.</div>
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
            <div className="validation-message">Please select an item in the list.</div>
          </div>
        </div>

        {/* Professional Profile Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faBriefcase} />
              Professional Profile (Current Profession)
            </span>
            <span style={{
              background: '#000000',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {sectionProgress.professional || 0}%
            </span>
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
                    <select 
                      value={experience.jobIndustry}
                      onChange={(e) => handleExperienceChange(index, 'jobIndustry', e.target.value)}
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology & IT</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="healthcare">Healthcare & Medical</option>
                      <option value="education">Education & Training</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="manufacturing">Manufacturing & Production</option>
                      <option value="construction">Construction & Real Estate</option>
                      <option value="hospitality">Hospitality & Tourism</option>
                      <option value="transportation">Transportation & Logistics</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="telecommunications">Telecommunications</option>
                      <option value="agriculture">Agriculture & Farming</option>
                      <option value="energy">Energy & Utilities</option>
                      <option value="legal">Legal Services</option>
                      <option value="consulting">Consulting & Professional Services</option>
                      <option value="government">Government & Public Sector</option>
                      <option value="nonprofit">Non-Profit & NGO</option>
                      <option value="automotive">Automotive</option>
                      <option value="aerospace">Aerospace & Defense</option>
                      <option value="pharmaceutical">Pharmaceutical & Biotech</option>
                      <option value="insurance">Insurance</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="hr">Human Resources</option>
                      <option value="sales">Sales & Business Development</option>
                      <option value="customerservice">Customer Service & Support</option>
                      <option value="other">Other</option>
                    </select>
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
              <FontAwesomeIcon icon={faInfoCircle} /> Add skills relevant to your profession and job preferences. Start typing to see suggestions.
            </div>
            <div className="skills-input-container-comprehensive">
              <input 
                type="text" 
                list="globalSkillsList"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Enter a skill (e.g., Sales, Project Management)"
              />
              <datalist id="globalSkillsList">
                {Array.isArray(globalSkills?.skills) && globalSkills.skills.slice(0, 1000).map((s, idx) => (
                  <option key={idx} value={s} />
                ))}
              </datalist>
              <button type="button" className="add-btn-comprehensive" onClick={addSkill}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
            <div className="tags-container-comprehensive" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {formData.coreSkills.map((skill, index) => (
                <div 
                  key={index} 
                  className="tag-comprehensive"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#e7f3ff',
                    color: '#0a66c2',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #d0e8ff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d0e8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e7f3ff';
                  }}
                >
                  {skill}
                  <span 
                    className="remove-comprehensive" 
                    onClick={() => removeSkill(index)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0a66c2',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0a66c2';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0a66c2';
                    }}
                  >×</span>
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
            <div className="tags-container-comprehensive" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {formData.tools.map((tool, index) => (
                <div 
                  key={index} 
                  className="tag-comprehensive"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#e7f3ff',
                    color: '#0a66c2',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #d0e8ff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d0e8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e7f3ff';
                  }}
                >
                  {tool}
                  <span 
                    className="remove-comprehensive" 
                    onClick={() => removeTool(index)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0a66c2',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0a66c2';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0a66c2';
                    }}
                  >×</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            Languages & Proficiency Levels <span className="required-comprehensive" style={{ color: '#e74c3c' }}>*</span>
          </h2>
          
          <div className="form-group-comprehensive">
            <div className="info-badge-comprehensive" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 16px', 
              backgroundColor: '#e7f3ff', 
              border: '1px solid #d0e8ff', 
              borderRadius: '8px', 
              marginBottom: '20px',
              color: '#0a66c2',
              fontSize: '14px'
            }}>
              <FontAwesomeIcon icon={faInfoCircle} /> 
              Language skills are crucial for international opportunities
            </div>
            
            <div className="language-proficiency-comprehensive" style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <input 
                type="text" 
                value={languageInput.language}
                onChange={(e) => setLanguageInput(prev => ({ ...prev, language: e.target.value }))}
                placeholder="Enter language (e.g., English)"
                style={{
                  flex: '2',
                  padding: '12px 16px',
                  border: '2px solid #3498db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2980b9'}
                onBlur={(e) => e.target.style.borderColor = '#3498db'}
              />
              <select
                value={languageInput.proficiency}
                onChange={(e) => setLanguageInput(prev => ({ ...prev, proficiency: e.target.value }))}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: '2px solid #bdc3c7',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Level</option>
                <option value="native">Native/Bilingual</option>
                <option value="fluent">Fluent</option>
                <option value="advanced">Advanced</option>
                <option value="intermediate">Intermediate</option>
                <option value="basic">Basic</option>
              </select>
            </div>
            
            <button 
              type="button" 
              className="add-btn-comprehensive" 
              onClick={addLanguage} 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                width: 'auto'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Language
            </button>
            
            <div className="tags-container-comprehensive" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px', 
              marginTop: '20px' 
            }}>
              {formData.languages.map((lang, index) => (
                <div 
                  key={index} 
                  className="tag-comprehensive"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#e7f3ff',
                    color: '#0a66c2',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #d0e8ff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d0e8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e7f3ff';
                  }}
                >
                  {lang.language} - {lang.proficiency}
                  <span 
                    className="remove-comprehensive" 
                    onClick={() => removeLanguage(index)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0a66c2',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0a66c2';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0a66c2';
                    }}
                  >×</span>
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
            {Array.isArray(formData.professionalLinks) ? formData.professionalLinks.map((link, index) => (
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
            )) : null}
          </div>
        </div>

        {/* Job Preferences Section */}
        <div className="section-comprehensive">
          <h2 className="section-title-comprehensive">
            <FontAwesomeIcon icon={faSlidersH} />
            Job Preferences & Availability
          </h2>
          
          <div className="form-group-comprehensive">
            <label>Preferred Job Titles</label>
            <input 
              type="text" 
              name="preferredJobTitles" 
              placeholder="e.g., Software Engineer, Full Stack Developer, Backend Engineer"
              value={formData.preferredJobTitles}
              onChange={handleInputChange}
            />
            <small style={{ color: '#666', fontSize: '13px', marginTop: '5px', display: 'block' }}>
              Enter job titles you're interested in, separated by commas
            </small>
          </div>
          
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
            <label>Career Objectives</label>
            <textarea 
              name="careerObjectives" 
              placeholder="What are your short-term and long-term career goals? What do you hope to achieve in your next role?"
              value={formData.careerObjectives}
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
              onMouseOver={(e) => {
                if (!isLoading) e.target.style.background = '#4b5563';
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.target.style.background = '#6b7280';
              }}
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
                  <FontAwesomeIcon icon={faCheckCircle} /> Create Job Seeker Profile
                </>
              )}
            </button>
          </div>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
            Save as draft to continue later, or create your complete profile now
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

