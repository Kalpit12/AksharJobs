import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  faUpload,
  faCheck,
  faBrain,
  faBullseye,
  faInfoCircle,
  faCamera,
  faShieldAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faFileAlt,
  faTimes,
  faGlobe,
  faPlus,
  faTrash,
  faSpinner,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/JobSeekerRegistrationForm.css';

const JobSeekerRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Smart navigation function to go to appropriate dashboard
  const navigateToDashboard = () => {
    const role = localStorage.getItem('role');
    const normalizedRole = role?.toLowerCase().replace(/[_-]/g, '');
    
    if (normalizedRole?.includes('recruiter')) {
      navigate('/recruiter-dashboard');
    } else if (normalizedRole?.includes('intern')) {
      navigate('/intern-dashboard');
    } else if (normalizedRole?.includes('admin')) {
      navigate('/admin');
    } else {
      // Default to job seeker dashboard
      navigate('/jobseeker-dashboard');
    }
  };

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: existingData?.firstName || userData.firstName || '',
    middleName: existingData?.middleName || '',
    lastName: existingData?.lastName || userData.lastName || '',
    email: existingData?.email || userData.email || '',
    phone: existingData?.phone || '',
    altPhone: existingData?.altPhone || '',
    dateOfBirth: existingData?.dateOfBirth || '',
    gender: existingData?.gender || '',
    profilePhoto: existingData?.profilePhoto || null,
    
    // Nationality & Residency
    nationality: existingData?.nationality || '',
    residentCountry: existingData?.residentCountry || '',
    currentCity: existingData?.currentCity || '',
    postalCode: existingData?.postalCode || '',
    address: existingData?.address || '',
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
    
    // Work Experience (Array for multiple entries)
    experienceEntries: existingData?.experienceEntries || [
      {
        jobTitle: '',
        company: '',
        companyLocation: '',
        employmentType: '',
        jobIndustry: '',
        startDate: '',
        endDate: '',
        currentJob: false,
        jobDescription: ''
      }
    ],
    
    // Education (Array for multiple entries)
    educationEntries: existingData?.educationEntries || [
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
    coreSkills: existingData?.coreSkills || [],
    tools: existingData?.tools || [],
    
    // Languages
    languages: existingData?.languages || [],
    
    // Certifications (Array for multiple entries)
    certificationEntries: existingData?.certificationEntries || [
      {
        certificationName: '',
        certIssuer: '',
        certIssueDate: '',
        certExpiryDate: '',
        credentialId: ''
      }
    ],
    
    // Projects (Array for multiple entries)
    projectEntries: existingData?.projectEntries || [
      {
        projectName: '',
        projectRole: '',
        projectUrl: '',
        projectDescription: ''
      }
    ],
    
    // Professional Memberships
    membershipOrg: existingData?.membershipOrg || '',
    membershipType: existingData?.membershipType || '',
    membershipDate: existingData?.membershipDate || '',
    
    // References (Array for multiple entries)
    referenceEntries: existingData?.referenceEntries || [
      {
        referenceName: '',
        referenceTitle: '',
        referenceCompany: '',
        referenceRelationship: '',
        referenceEmail: '',
        referencePhone: ''
      }
    ],
    
    // Professional Online Presence
    linkedin: existingData?.linkedin || '',
    github: existingData?.github || '',
    portfolio: existingData?.portfolio || '',
    twitter: existingData?.twitter || '',
    otherLink: existingData?.otherLink || '',
    
    // Job Preferences
    jobType: existingData?.jobType || '',
    noticePeriod: existingData?.noticePeriod || '',
    currentSalary: existingData?.currentSalary || '',
    expectedSalary: existingData?.expectedSalary || '',
    currencyPreference: existingData?.currencyPreference || 'USD',
    travelAvailability: existingData?.travelAvailability || '',
    
    // Additional Information
    hobbies: existingData?.hobbies || '',
    additionalComments: existingData?.additionalComments || '',
    agreeTerms: existingData?.agreeTerms || false,
    allowContact: existingData?.allowContact || false
  });
  
  const [errors, setErrors] = useState({});

  // Initialize component and load saved state
  useEffect(() => {
    try {
      const savedState = loadFormState();
      if (savedState) {
        const formDataWithArrays = {
          ...savedState.formData,
          technicalSkills: Array.isArray(savedState.formData.technicalSkills) ? savedState.formData.technicalSkills : [],
          softSkills: Array.isArray(savedState.formData.softSkills) ? savedState.formData.softSkills : [],
          languagesKnown: Array.isArray(savedState.formData.languagesKnown) ? savedState.formData.languagesKnown : [],
          jobType: Array.isArray(savedState.formData.jobType) ? savedState.formData.jobType : [],
          preferredIndustry: Array.isArray(savedState.formData.preferredIndustry) ? savedState.formData.preferredIndustry : [],
          educationEntries: Array.isArray(savedState.formData.educationEntries) && savedState.formData.educationEntries.length > 0 
            ? savedState.formData.educationEntries 
            : [{
                highestEducation: '',
                universityName: '',
                customUniversityName: '',
                degree: '',
                graduationYear: '',
                majorSubjects: ''
              }],
          experienceEntries: Array.isArray(savedState.formData.experienceEntries) && savedState.formData.experienceEntries.length > 0
            ? savedState.formData.experienceEntries
            : [{
                jobTitle: '',
                employmentType: '',
                companyName: '',
                isCurrentlyWorking: false,
                startMonth: '',
                startYear: '',
                endMonth: '',
                endYear: '',
                location: '',
                locationType: '',
                description: '',
                notifyNetwork: false
              }]
        };
        setFormData(formDataWithArrays);
        setCurrentStep(savedState.currentStep);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing form:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save form state to localStorage
  const saveFormState = () => {
    try {
      const stateToSave = {
        formData,
        currentStep
      };
      localStorage.setItem('jobseekerFormState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving form state:', error);
    }
  };

  // Load form state from localStorage
  const loadFormState = () => {
    try {
      const saved = localStorage.getItem('jobseekerFormState');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading form state:', error);
      return null;
    }
  };

  // Clear form state
  const clearFormState = () => {
    try {
      localStorage.removeItem('jobseekerFormState');
    } catch (error) {
      console.error('Error clearing form state:', error);
    }
  };

  // Auto-save form state whenever formData or currentStep changes
  useEffect(() => {
    if (isInitialized) {
      saveFormState();
    }
  }, [formData, currentStep, isInitialized]);

  const handleInputChange = (e) => {
    try {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
        ...prev,
          [name]: ''
      }));
      }
    } catch (error) {
      console.error('Error in handleInputChange:', error);
    }
  };

  const handleMultiSelect = (name, value) => {
    try {
    setFormData(prev => {
        // Check if value is an array (from MultiSelectDropdown) or single value (from individual selection)
        if (Array.isArray(value)) {
          // Remove duplicates and direct array assignment from MultiSelectDropdown
          const uniqueValues = [...new Set(value)];
          return {
            ...prev,
            [name]: uniqueValues
          };
        } else {
          // Individual value toggle (legacy support)
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
          // Remove duplicates
          const uniqueValues = [...new Set(newValues)];
      return {
        ...prev,
            [name]: uniqueValues
      };
        }
    });
    } catch (error) {
      console.error('Error in handleMultiSelect:', error);
    }
  };

  // Handle certification verification status change
  const handleVerificationStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      certificationVerifications: (prev.certificationVerifications || []).map((verification, index) => ({
        ...verification,
        status: status
      }))
    }));
  };

  // Handle certification detail changes
  const handleCertificationDetailChange = (index, field, value) => {
    setFormData(prev => {
      const newVerifications = [...(prev.certificationVerifications || [])];
      if (!newVerifications[index]) {
        newVerifications[index] = {
          status: 'verified',
          issueDate: '',
          expiryDate: '',
          issuingOrg: '',
          certificateId: '',
          verificationUrl: ''
        };
      }
      newVerifications[index][field] = value;
      return {
        ...prev,
        certificationVerifications: newVerifications
      };
    });
  };

  // Handle certification document upload
  const handleCertificationDocumentUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => {
        const newDocuments = [...(prev.certificationDocuments || [])];
        newDocuments[index] = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        };
        return {
          ...prev,
          certificationDocuments: newDocuments
        };
      });
    }
  };

  // Handle remove certification document
  const handleRemoveCertificationDocument = (index) => {
    setFormData(prev => {
      const newDocuments = [...(prev.certificationDocuments || [])];
      newDocuments[index] = null;
      return {
        ...prev,
        certificationDocuments: newDocuments
      };
    });
  };

  // Handle education entry changes
  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  // Add new education entry
  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      educationEntries: [
        ...prev.educationEntries,
        {
          highestEducation: '',
          universityName: '',
          customUniversityName: '',
          degree: '',
          graduationYear: '',
          majorSubjects: ''
        }
      ]
    }));
  };

  // Remove education entry
  const removeEducationEntry = (index) => {
    if (formData.educationEntries.length > 1) {
      setFormData(prev => ({
        ...prev,
        educationEntries: prev.educationEntries.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle experience entry changes
  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experienceEntries: prev.experienceEntries.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  // Add new experience entry
  const addExperienceEntry = () => {
    setFormData(prev => ({
      ...prev,
      experienceEntries: [
        ...prev.experienceEntries,
        {
          jobTitle: '',
          employmentType: '',
          companyName: '',
          isCurrentlyWorking: false,
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          location: '',
          locationType: '',
          description: '',
          notifyNetwork: false
        }
      ]
    }));
  };

  // Remove experience entry
  const removeExperienceEntry = (index) => {
    if (formData.experienceEntries.length > 1) {
      setFormData(prev => ({
        ...prev,
        experienceEntries: prev.experienceEntries.filter((_, i) => i !== index)
      }));
    }
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
        setProfilePhoto(file);
        setErrors(prev => ({ ...prev, profilePhoto: '' }));
      } else {
        setErrors(prev => ({ 
          ...prev, 
          profilePhoto: 'Please upload an image file under 2MB' 
        }));
      }
    }
  };

  const validateStep = (step) => {
    try {
      const newErrors = {};

      if (!formData) {
        console.error('formData is not available');
        return false;
      }

      if (step === 1) {
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.currentLocation?.trim()) newErrors.currentLocation = 'Current location is required';
        if (!formData.currentCountry?.trim()) newErrors.currentCountry = 'Current country is required';
        if (formData.currentCountry === 'Other' && !formData.otherCountry?.trim()) newErrors.otherCountry = 'Please specify your country';
        if (!formData.preferredWorkLocation || formData.preferredWorkLocation.length === 0) newErrors.preferredWorkLocation = 'Please select at least one preferred work location';
        if (!formData.willingToRelocate) newErrors.willingToRelocate = 'Please select relocation preference';
      }

      if (step === 2) {
        // Validate at least one education entry
        if (!formData.educationEntries || formData.educationEntries.length === 0) {
          newErrors.educationEntries = 'At least one education entry is required';
        } else {
          formData.educationEntries.forEach((entry, index) => {
            if (!entry.highestEducation?.trim()) {
              newErrors[`education_${index}_highestEducation`] = 'Highest education is required';
            }
            if (!entry.universityName?.trim()) {
              newErrors[`education_${index}_universityName`] = 'University name is required';
            }
            if (entry.universityName === 'Other - Please specify' && !entry.customUniversityName?.trim()) {
              newErrors[`education_${index}_customUniversityName`] = 'Please specify your university/institution name';
            }
            if (!entry.degree?.trim()) {
              newErrors[`education_${index}_degree`] = 'Degree is required';
            }
            if (!entry.graduationYear) {
              newErrors[`education_${index}_graduationYear`] = 'Graduation year is required';
            }
          });
        }
      }

      if (step === 3) {
        // Validate at least one experience entry
        if (!formData.experienceEntries || formData.experienceEntries.length === 0) {
          newErrors.experienceEntries = 'At least one experience entry is required';
        } else {
          formData.experienceEntries.forEach((entry, index) => {
            if (!entry.jobTitle?.trim()) {
              newErrors[`experience_${index}_jobTitle`] = 'Job title is required';
            }
            if (!entry.companyName?.trim()) {
              newErrors[`experience_${index}_companyName`] = 'Company name is required';
            }
            if (!entry.startMonth) {
              newErrors[`experience_${index}_startMonth`] = 'Start month is required';
            }
            if (!entry.startYear) {
              newErrors[`experience_${index}_startYear`] = 'Start year is required';
            }
            if (!entry.isCurrentlyWorking && !entry.endMonth) {
              newErrors[`experience_${index}_endMonth`] = 'End month is required';
            }
            if (!entry.isCurrentlyWorking && !entry.endYear) {
              newErrors[`experience_${index}_endYear`] = 'End year is required';
            }
          });
        }
      }

      if (step === 4) {
        if (!formData.technicalSkills || formData.technicalSkills.length === 0) newErrors.technicalSkills = 'Please select at least one technical skill';
        if (!formData.softSkills || formData.softSkills.length === 0) newErrors.softSkills = 'Please select at least one soft skill';
        if (formData.certifications && formData.certifications.includes('Other') && !formData.otherCertifications?.trim()) {
          newErrors.otherCertifications = 'Please specify your other certifications';
        }
      }

      if (step === 5) {
        if (!formData.jobType || formData.jobType.length === 0) newErrors.jobType = 'Please select at least one job type';
        if (!formData.preferredIndustry || formData.preferredIndustry.length === 0) newErrors.preferredIndustry = 'Please select at least one industry';
        if (!formData.workMode) newErrors.workMode = 'Please select work mode preference';
      }

      if (step === 6) {
        if (!formData.careerObjectives?.trim()) newErrors.careerObjectives = 'Career objectives are required';
        if (!formData.shortTermGoals?.trim()) newErrors.shortTermGoals = 'Short term goals are required';
      }

      if (step === 7) {
        // Additional information is optional
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error('Error in validateStep:', error);
      return false;
    }
  };

  const handleNext = () => {
    // Allow navigation to next step without validation
    setCurrentStep(prev => Math.min(prev + 1, 7));
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const validateSection = (step) => {
    // Returns true if all required fields for the step are filled
    try {
      if (step === 1) {
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth;
      }
      if (step === 2) {
        return formData.educationEntries && formData.educationEntries.length > 0 && formData.educationEntries[0].highestEducation;
      }
      if (step === 3) {
        return formData.experienceEntries && formData.experienceEntries.length > 0;
      }
      if (step === 4) {
        return formData.coreSkills && formData.coreSkills.length > 0;
      }
      if (step === 5) {
        return formData.jobType;
      }
      if (step === 6) {
        return formData.summary;
      }
      if (step === 7) {
        return formData.agreeTerms;
      }
      return true;
    } catch (error) {
      console.error('Error in validateSection:', error);
      return false;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
    }
  };

  const handleCoreSkillAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.coreSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          coreSkills: [...prev.coreSkills, skill]
        }));
        e.target.value = '';
      }
    }
  };

  const removeCoreSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      coreSkills: prev.coreSkills.filter((_, i) => i !== index)
    }));
  };

  const handleToolAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tool = e.target.value.trim();
      if (tool && !formData.tools.includes(tool)) {
        setFormData(prev => ({
          ...prev,
          tools: [...prev.tools, tool]
        }));
        e.target.value = '';
      }
    }
  };

  const removeTool = (index) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(7)) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
          if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
          // Use custom university name if "Other - Please specify" is selected
          if (key === 'universityName' && formData.universityName === 'Other - Please specify' && formData.customUniversityName) {
            formDataToSend.append(key, formData.customUniversityName);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const response = await fetch(buildApiUrl('/api/jobseeker/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        clearFormState();
        // Navigate to correct success route
        navigate('/jobseeker-registration-success', { 
          state: {
            jobSeekerName: formData.fullName,
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

  const isStepClickable = (step) => {
    try {
      // Allow clicking on any step (1-7) without validation
      return step >= 1 && step <= 7;
    } catch (error) {
      console.error('Error in isStepClickable:', error);
      return false;
    }
  };

  const handleStepClick = (step) => {
    try {
      // Allow navigation to any step without validation
      if (step >= 1 && step <= 7) {
        setCurrentStep(step);
        window.scrollTo(0, 0);
        return;
      }
    } catch (error) {
      console.error('Error in handleStepClick:', error);
    }
  };

  const renderProgressBar = () => {
    try {
      return (
      <div className="progress-bar-container">
        <div className="progress-steps">
            {[1, 2, 3, 4, 5, 6, 7].map(step => {
              const isActive = currentStep >= step;
              const isCurrent = currentStep === step;
              const isClickable = isStepClickable(step);
              
              return (
                <div 
                  key={step} 
                  className={`progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isClickable ? 'clickable' : 'disabled'}`}
                  onClick={() => handleStepClick(step)}
            >
              <div className="step-circle">
                    {currentStep > step ? (
                      <FontAwesomeIcon icon={faCheck} className="step-check" />
                ) : (
                      step
                )}
              </div>
                  <div className="step-label">
                    {step === 1 && 'Personal'}
                    {step === 2 && 'Education'}
                    {step === 3 && 'Employment'}
                    {step === 4 && 'Skills'}
                    {step === 5 && 'Preferences'}
                    {step === 6 && 'Goals'}
                    {step === 7 && 'Additional'}
            </div>
        </div>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering progress bar:', error);
      return (
        <div className="progress-bar-container">
          <div className="progress-steps">
            <div className="progress-step active current">
              <div className="step-circle">1</div>
              <div className="step-label">Personal</div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Multi-Select Dropdown Component
  const MultiSelectDropdown = ({ 
    label, 
    options = [], 
    selectedValues = [], 
    onChange, 
    placeholder = "Select options...",
    error,
    maxSelections = null
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];
    const safeOptions = Array.isArray(options) ? options : [];

    // Clean up duplicates on component mount and when selectedValues change
    useEffect(() => {
      if (safeSelectedValues.length > 0) {
        const uniqueValues = [...new Set(safeSelectedValues)];
        if (uniqueValues.length !== safeSelectedValues.length) {
          // Only update if there are actually duplicates
          onChange(uniqueValues);
        }
      }
    }, [selectedValues, onChange]);

    // Handle both string options and object options {value, label}
    const filteredOptions = safeOptions.filter(option => {
      const searchText = typeof option === 'string' 
        ? option 
        : (option.label || option.value || '');
      return searchText.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleOptionClick = (option) => {
      if (onChange) {
        // For object options, pass the value; for string options, pass the string
        const valueToAdd = typeof option === 'string' ? option : option.value;
        
        // Check if the value is already selected
        const isSelected = safeSelectedValues.includes(valueToAdd);
        
        if (isSelected) {
          // Remove the value if it's already selected
          const newValues = safeSelectedValues.filter(v => v !== valueToAdd);
          onChange(newValues);
        } else {
          // Check if we can add more selections
          if (maxSelections && safeSelectedValues.length >= maxSelections) {
            // Don't add if we've reached the maximum
            return;
          }
          // Add the value if it's not selected
          const newValues = [...safeSelectedValues, valueToAdd];
          // Ensure unique values
          const uniqueValues = [...new Set(newValues)];
          onChange(uniqueValues);
        }
      }
      setSearchTerm('');
    };

    const handleRemoveItem = (value) => {
      if (onChange) {
        // For MultiSelectDropdown, we need to pass the entire updated array
        // Filter out ALL instances of the value (in case of duplicates)
        const newValues = safeSelectedValues.filter(v => v !== value);
        // Ensure unique values and remove any remaining duplicates
        const uniqueValues = [...new Set(newValues)];
        onChange(uniqueValues);
      }
    };

    const displayText = safeSelectedValues.length > 0 
      ? `${safeSelectedValues.length}${maxSelections ? `/${maxSelections}` : ''} selected`
      : placeholder;

    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="multiselect-container">
          <div 
            className={`multiselect-dropdown ${error ? 'error' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="multiselect-selected">
              {safeSelectedValues.length > 0 ? (
                <div className="selected-items">
                  {safeSelectedValues.slice(0, 2).map((value, index) => (
                    <div key={`${value}-${index}`} className="selected-item">
                      <span>{value}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(value);
                        }}
                      >
                        ×
                      </button>
        </div>
                  ))}
                  {safeSelectedValues.length > 2 && (
                    <span className="more-count">+{safeSelectedValues.length - 2} more</span>
                  )}
                  {safeSelectedValues.length > 5 && (
                    <button
                      type="button"
                      className="clear-all-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange([]);
                      }}
                      style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        fontSize: '12px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              ) : (
                <span className="placeholder">{displayText}</span>
              )}
            </div>
            <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

          {isOpen && (
            <div className="multiselect-options">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
        </div>
              <div className="options-list">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const optionValue = typeof option === 'string' ? option : option.value;
                    const optionLabel = typeof option === 'string' ? option : option.label;
                    const isSelected = safeSelectedValues.includes(optionValue);
                    const isDisabled = !isSelected && maxSelections && safeSelectedValues.length >= maxSelections;
                    
                    return (
                      <div
                        key={index}
                        className={`option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => !isDisabled && handleOptionClick(option)}
                        style={{ 
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.5 : 1
                        }}
                      >
                        <div className="checkbox">
                          {isSelected ? '✓' : ''}
                        </div>
                        <span>{optionLabel}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-options">No options found</div>
                )}
              </div>
            </div>
          )}
        </div>
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faUser} /> Personal Information
      </h2>
      <p className="step-description">Let's start with your basic information</p>

      {/* Profile Photo Upload */}
      <div className="form-group">
        <label className="form-label">
          <FontAwesomeIcon icon={faCamera} /> Profile Photo
        </label>
        <div className="file-upload-container">
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            id="profilePhoto"
          />
          <label htmlFor="profilePhoto" className="file-upload-label">
            <FontAwesomeIcon icon={faCamera} />
            <span>Upload Profile Photo</span>
            <small>Click to browse or drag and drop</small>
          </label>
        </div>
        {profilePhoto && (
          <div className="file-preview">
            <img src={URL.createObjectURL(profilePhoto)} alt="Profile Preview" />
          </div>
        )}
      </div>

      {/* Name Fields */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} /> First Name *
          </label>
          <input
            type="text"
            name="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            required
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} /> Middle Name
          </label>
          <input
            type="text"
            name="middleName"
            className="form-input"
            value={formData.middleName}
            onChange={handleInputChange}
            placeholder="Enter your middle name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} /> Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            required
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
      </div>

      {/* Date of Birth and Gender */}
      <div className="form-row">
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
            required
          />
          {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} /> Gender *
          </label>
          <select
            name="gender"
            className={`form-input ${errors.gender ? 'error' : ''}`}
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="form-row">
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
            disabled
          />
          <div className="input-hint">This email is associated with your account and cannot be changed</div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faPhone} /> Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+254 700 000 000"
            required
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faPhone} /> Alternative Phone
          </label>
          <input
            type="tel"
            name="altPhone"
            className="form-input"
            value={formData.altPhone}
            onChange={handleInputChange}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    return (
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faGraduationCap} /> Education Details
        </h2>
        <p className="step-description">Tell us about your educational background</p>

        {errors.educationEntries && (
          <div className="error-message">
            <span className="error-text">{errors.educationEntries}</span>
          </div>
        )}

        {formData.educationEntries.map((education, index) => (
        <div key={index} className="education-entry">
          <div className="entry-header">
            <h3 className="entry-title">Education Entry {index + 1}</h3>
            {formData.educationEntries.length > 1 && (
              <button
                type="button"
                className="remove-entry-btn"
                onClick={() => removeEducationEntry(index)}
                title="Remove this education entry"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
            
            <div className="form-row">
              <div className="form-group">
              <label className="form-label">Highest Education Level *</label>
                <select 
                className={`form-input ${errors[`education_${index}_highestEducation`] ? 'error' : ''}`}
                value={education.highestEducation}
                onChange={(e) => handleEducationChange(index, 'highestEducation', e.target.value)}
              >
                <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              {errors[`education_${index}_highestEducation`] && (
                <span className="error-text">{errors[`education_${index}_highestEducation`]}</span>
              )}
              </div>

              <div className="form-group">
              <label className="form-label">University/Institution Name *</label>
                <select 
                className={`form-input ${errors[`education_${index}_universityName`] ? 'error' : ''}`}
                value={education.universityName}
                onChange={(e) => handleEducationChange(index, 'universityName', e.target.value)}
              >
            <option value="">Select University/College</option>
            
            {/* United States */}
            <optgroup label="🇺🇸 United States">
              <option value="Harvard University">Harvard University</option>
              <option value="Stanford University">Stanford University</option>
              <option value="Massachusetts Institute of Technology (MIT)">Massachusetts Institute of Technology (MIT)</option>
              <option value="California Institute of Technology (Caltech)">California Institute of Technology (Caltech)</option>
              <option value="Princeton University">Princeton University</option>
              <option value="Yale University">Yale University</option>
              <option value="Columbia University">Columbia University</option>
              <option value="University of Chicago">University of Chicago</option>
              <option value="University of Pennsylvania">University of Pennsylvania</option>
              <option value="Cornell University">Cornell University</option>
              <option value="Duke University">Duke University</option>
              <option value="Northwestern University">Northwestern University</option>
              <option value="Brown University">Brown University</option>
              <option value="Dartmouth College">Dartmouth College</option>
              <option value="Vanderbilt University">Vanderbilt University</option>
              <option value="Rice University">Rice University</option>
              <option value="Washington University in St. Louis">Washington University in St. Louis</option>
              <option value="Emory University">Emory University</option>
              <option value="Georgetown University">Georgetown University</option>
              <option value="Carnegie Mellon University">Carnegie Mellon University</option>
              <option value="University of California, Berkeley">University of California, Berkeley</option>
              <option value="University of California, Los Angeles (UCLA)">University of California, Los Angeles (UCLA)</option>
              <option value="University of Michigan">University of Michigan</option>
              <option value="University of Virginia">University of Virginia</option>
              <option value="University of North Carolina at Chapel Hill">University of North Carolina at Chapel Hill</option>
              <option value="New York University (NYU)">New York University (NYU)</option>
              <option value="University of Southern California (USC)">University of Southern California (USC)</option>
              <option value="University of Texas at Austin">University of Texas at Austin</option>
              <option value="Georgia Institute of Technology">Georgia Institute of Technology</option>
              <option value="University of Illinois at Urbana-Champaign">University of Illinois at Urbana-Champaign</option>
              <option value="University of Wisconsin-Madison">University of Wisconsin-Madison</option>
              <option value="University of Washington">University of Washington</option>
              <option value="University of California, San Diego">University of California, San Diego</option>
              <option value="University of California, Santa Barbara">University of California, Santa Barbara</option>
              <option value="University of California, Irvine">University of California, Irvine</option>
              <option value="University of California, Davis">University of California, Davis</option>
              <option value="University of California, Santa Cruz">University of California, Santa Cruz</option>
              <option value="University of California, Riverside">University of California, Riverside</option>
              <option value="University of California, Merced">University of California, Merced</option>
              <option value="University of California, San Francisco">University of California, San Francisco</option>
              <option value="Other - Please specify">Other - Please specify</option>
            </optgroup>
            
            {/* Kenya */}
            <optgroup label="🇰🇪 Kenya">
              <option value="University of Nairobi">University of Nairobi</option>
              <option value="Kenyatta University">Kenyatta University</option>
              <option value="Jomo Kenyatta University of Agriculture and Technology">Jomo Kenyatta University of Agriculture and Technology</option>
              <option value="Moi University">Moi University</option>
              <option value="Egerton University">Egerton University</option>
              <option value="Maseno University">Maseno University</option>
              <option value="University of Eldoret">University of Eldoret</option>
              <option value="Technical University of Kenya">Technical University of Kenya</option>
              <option value="Strathmore University">Strathmore University</option>
              <option value="United States International University (USIU)">United States International University (USIU)</option>
              <option value="Catholic University of Eastern Africa">Catholic University of Eastern Africa</option>
              <option value="Daystar University">Daystar University</option>
              <option value="Africa Nazarene University">Africa Nazarene University</option>
              <option value="KCA University">KCA University</option>
              <option value="Other - Please specify">Other - Please specify</option>
            </optgroup>
            
            {/* International */}
            <optgroup label="🌍 International">
              <option value="University of Oxford">University of Oxford</option>
              <option value="University of Cambridge">University of Cambridge</option>
              <option value="Imperial College London">Imperial College London</option>
              <option value="University College London">University College London</option>
              <option value="London School of Economics">London School of Economics</option>
              <option value="King's College London">King's College London</option>
              <option value="University of Edinburgh">University of Edinburgh</option>
              <option value="University of Manchester">University of Manchester</option>
              <option value="University of Bristol">University of Bristol</option>
              <option value="University of Warwick">University of Warwick</option>
              <option value="University of Birmingham">University of Birmingham</option>
              <option value="University of Leeds">University of Leeds</option>
              <option value="University of Sheffield">University of Sheffield</option>
              <option value="University of Liverpool">University of Liverpool</option>
              <option value="University of Nottingham">University of Nottingham</option>
              <option value="University of Southampton">University of Southampton</option>
              <option value="University of Glasgow">University of Glasgow</option>
              <option value="University of Durham">University of Durham</option>
              <option value="University of York">University of York</option>
              <option value="University of Exeter">University of Exeter</option>
              <option value="Other - Please specify">Other - Please specify</option>
            </optgroup>
          </select>
              {errors[`education_${index}_universityName`] && (
                <span className="error-text">{errors[`education_${index}_universityName`]}</span>
              )}
              
              {education.universityName === 'Other - Please specify' && (
                <div className="form-group">
                  <label className="form-label">Specify University/Institution Name *</label>
                  <input
                    type="text"
                    className={`form-input ${errors[`education_${index}_customUniversityName`] ? 'error' : ''}`}
                    value={education.customUniversityName}
                    onChange={(e) => handleEducationChange(index, 'customUniversityName', e.target.value)}
                    placeholder="Enter university/institution name"
                  />
                  {errors[`education_${index}_customUniversityName`] && (
                    <span className="error-text">{errors[`education_${index}_customUniversityName`]}</span>
                  )}
                </div>
              )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Degree/Program *</label>
                <input
                  type="text"
                  className={`form-input ${errors[`education_${index}_degree`] ? 'error' : ''}`}
                  value={education.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
                {errors[`education_${index}_degree`] && (
                  <span className="error-text">{errors[`education_${index}_degree`]}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year *</label>
                <select
                  className={`form-input ${errors[`education_${index}_graduationYear`] ? 'error' : ''}`}
                  value={education.graduationYear}
                  onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors[`education_${index}_graduationYear`] && (
                  <span className="error-text">{errors[`education_${index}_graduationYear`]}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Major Subjects/Specialization</label>
              <textarea
                className="form-input"
                value={education.majorSubjects}
                onChange={(e) => handleEducationChange(index, 'majorSubjects', e.target.value)}
                placeholder="e.g., Computer Science, Mathematics, Statistics"
                rows={3}
              />
            </div>
        </div>
        ))}

        <div className="form-actions">
          <button
            type="button"
            onClick={addEducationEntry}
            className="btn btn-secondary"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Another Education
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="form-step linkedin-experience">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faBriefcase} /> Experience Details
        </h2>
        <p className="step-description">Tell us about your work experience and career history</p>

        {errors.experienceEntries && (
          <div className="error-message">
            <span className="error-text">{errors.experienceEntries}</span>
          </div>
        )}

        {formData.experienceEntries.map((experience, index) => (
        <div key={index} className="experience-entry">
          <div className="entry-header">
            <h3 className="entry-title">Experience Entry {index + 1}</h3>
            {formData.experienceEntries.length > 1 && (
              <button
                type="button"
                className="remove-entry-btn"
                onClick={() => removeExperienceEntry(index)}
                title="Remove this experience entry"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className={`form-input ${errors[`experience_${index}_jobTitle`] ? 'error' : ''}`}
                  value={experience.jobTitle}
                  onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
                {errors[`experience_${index}_jobTitle`] && (
                  <span className="error-text">{errors[`experience_${index}_jobTitle`]}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  className={`form-input ${errors[`experience_${index}_company`] ? 'error' : ''}`}
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                />
                {errors[`experience_${index}_company`] && (
                  <span className="error-text">{errors[`experience_${index}_company`]}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={experience.companyLocation}
                  onChange={(e) => handleExperienceChange(index, 'companyLocation', e.target.value)}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select
                  className="form-input"
                  value={experience.employmentType}
                  onChange={(e) => handleExperienceChange(index, 'employmentType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className={`form-input ${errors[`experience_${index}_startDate`] ? 'error' : ''}`}
                  value={experience.startDate}
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  required
                />
                {errors[`experience_${index}_startDate`] && (
                  <span className="error-text">{errors[`experience_${index}_startDate`]}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={experience.endDate}
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                  disabled={experience.currentJob}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={experience.currentJob}
                    onChange={(e) => handleExperienceChange(index, 'currentJob', e.target.checked)}
                  />
                  I currently work here
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea
                className="form-input"
                value={experience.jobDescription}
                onChange={(e) => handleExperienceChange(index, 'jobDescription', e.target.value)}
                placeholder="Describe your responsibilities and achievements in this role..."
                rows={4}
              />
            </div>
        </div>
        ))}

        <div className="form-actions">
          <button
            type="button"
            onClick={addExperienceEntry}
            className="btn btn-secondary"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Another Experience
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="form-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faBrain} /> Skills & Expertise
      </h2>
      <p className="step-description">Showcase your technical and soft skills</p>

      <div className="form-group">
        <label className="form-label">Core Skills *</label>
        <div className="skills-container">
          {formData.coreSkills.map((skill, index) => (
            <div key={index} className="skill-tag">
              {skill}
              <button
                type="button"
                onClick={() => removeCoreSkill(index)}
                className="remove-skill"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a skill and press Enter"
            onKeyPress={handleCoreSkillAdd}
            className="skill-input"
          />
        </div>
        {errors.coreSkills && <span className="error-text">{errors.coreSkills}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Tools & Technologies</label>
        <div className="skills-container">
          {formData.tools.map((tool, index) => (
            <div key={index} className="skill-tag">
              {tool}
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="remove-skill"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a tool and press Enter"
            onKeyPress={handleToolAdd}
            className="skill-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="form-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faBullseye} /> Job Preferences
      </h2>
      <p className="step-description">Tell us what kind of job you're looking for</p>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Job Type *</label>
          <select
            name="jobType"
            className={`form-input ${errors.jobType ? 'error' : ''}`}
            value={formData.jobType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.jobType && <span className="error-text">{errors.jobType}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Notice Period</label>
          <select
            name="noticePeriod"
            className="form-input"
            value={formData.noticePeriod}
            onChange={handleInputChange}
          >
            <option value="">Select Notice Period</option>
            <option value="Immediate">Immediate</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="1 month">1 month</option>
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
            <option value="More than 3 months">More than 3 months</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Current Salary</label>
          <input
            type="number"
            name="currentSalary"
            className="form-input"
            value={formData.currentSalary}
            onChange={handleInputChange}
            placeholder="Enter current salary"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Expected Salary</label>
          <input
            type="number"
            name="expectedSalary"
            className="form-input"
            value={formData.expectedSalary}
            onChange={handleInputChange}
            placeholder="Enter expected salary"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            name="currencyPreference"
            className="form-input"
            value={formData.currencyPreference}
            onChange={handleInputChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="KES">KES</option>
            <option value="INR">INR</option>
            <option value="CNY">CNY</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="form-step">
      <h2 className="step-title">
        <FontAwesomeIcon icon={faRocket} /> Career Goals
      </h2>
      <p className="step-description">Share your career aspirations and objectives</p>

      <div className="form-group">
        <label className="form-label">Career Summary *</label>
        <textarea
          name="summary"
          className={`form-input ${errors.summary ? 'error' : ''}`}
          value={formData.summary}
          onChange={handleInputChange}
          placeholder="Tell us about yourself, your skills, and career goals..."
          rows={6}
          required
        />
        {errors.summary && <span className="error-text">{errors.summary}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Additional Comments</label>
        <textarea
          name="additionalComments"
          className="form-input"
          value={formData.additionalComments}
          onChange={handleInputChange}
          placeholder="Any additional information you'd like to share..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep7 = () => {
    return (
      <div className="form-step">
        <h2 className="step-title">
          <FontAwesomeIcon icon={faInfoCircle} /> Additional Information
        </h2>
        <p className="step-description">Complete your profile with additional details</p>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              required
            />
            I agree to the Terms and Conditions *
          </label>
          {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="allowContact"
              checked={formData.allowContact}
              onChange={handleInputChange}
            />
            I allow recruiters to contact me about job opportunities
          </label>
        </div>
      </div>
    );
  };

  if (!isInitialized) {
    return (
      <div className="jobseeker-wrapper">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#667eea'
        }}>
          <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '10px' }} />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="jobseeker-wrapper">
      <header className="jobseeker-header">
        <div className="header-container">
          <div className="logo-section" onClick={navigateToDashboard} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <h3 className="logo-title">AksharJobs</h3>
              <p className="logo-subtitle">Complete Your Job Seeker Profile</p>
            </div>
          </div>
        </div>
      </header>

      <main className="jobseeker-main">
        <div className="jobseeker-container">
          <div className="jobseeker-form-card">
            <div className="form-header">
              <h1 className="form-title">Complete Your Job Seeker Profile</h1>
              <p className="form-subtitle">Help us understand your skills and career goals</p>
              
              <div className="progress-section">
                <div className="progress-bar">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div
                      key={step}
                      className={`progress-step ${currentStep >= step ? 'active' : ''} ${
                        validateSection(step) ? 'completed' : ''
                      }`}
                    >
                      <div className="step-number">
                        {validateSection(step) ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : (
                          step
                        )}
                      </div>
                      <div className="step-label">
                        {step === 1 && 'Personal'}
                        {step === 2 && 'Education'}
                        {step === 3 && 'Experience'}
                        {step === 4 && 'Skills'}
                        {step === 5 && 'Preferences'}
                        {step === 6 && 'Goals'}
                        {step === 7 && 'Additional'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-content">
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
                {currentStep === 6 && renderStep6()}
                {currentStep === 7 && renderStep7()}

                <div className="form-navigation">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="btn btn-secondary"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Previous
                    </button>
                  )}

                  {currentStep < 7 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn btn-primary"
                      disabled={!validateSection(currentStep)}
                    >
                      Next
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading || !validateSection(7)}
                    >
                      {isLoading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} />
                          Complete Profile
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerRegistrationForm;
