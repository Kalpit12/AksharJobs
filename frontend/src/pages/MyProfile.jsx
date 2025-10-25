import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faUser,
  faBriefcase,
  faCode,
  faBuilding,
  faGraduationCap,
  faCertificate,
  faLanguage,
  faLink,
  faCheckCircle,
  faPlus,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSections, setEditingSections] = useState({});
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  
  // Common skills for dropdown
  const commonSkills = [
    "3D Modeling", "A/B Testing", "Accounting Principles", "Accounting Software", "Acoustics",
    "Active Listening", "Adaptability", "Adobe Creative Suite", "Adult Learning Theory", "Agile/Scrum",
    "Agricultural Practices", "Aircraft Operation", "Algorithms", "Analysis", "Anatomy Knowledge",
    "Animal Medicine", "API Development", "Architectural Design", "Artificial Intelligence", "Assessment",
    "Assessment Design", "ATS Software", "Attention to Detail", "Audio Editing", "Audio Equipment",
    "Audio Mixing", "Auditing", "AutoCAD", "Aviation Regulations", "AWS/Azure/GCP",
    "Backup/Recovery", "Banking Regulations", "Benefits Administration", "Big Data", "Bioinformatics",
    "Biotechnology", "Blockchain", "Blueprint Reading", "Bookkeeping", "Brand Guidelines",
    "Brand Management", "Brand Strategy", "Brand Voice", "Budget Management", "Budgeting",
    "Building Codes", "Building Systems", "CAD Software", "Call Center Metrics", "Campaign Management",
    "Campaign Planning", "Candidate Assessment", "Capital Markets", "Care Planning", "Career Counseling",
    "Case Analysis", "Case Management", "Cash Handling", "Change Management", "Chemical Analysis",
    "Circuit Analysis", "Circuit Design", "Classroom Management", "Client Counseling", "Client Communication",
    "Client Relations", "Clinical Knowledge", "Closing", "Cloud Computing", "CMS Platforms",
    "Color Correction", "Color Theory", "Communication", "Communication Strategy", "Community Engagement",
    "Community Management", "Community Relations", "Compassion", "Compensation Analysis", "Compliance",
    "Computer Skills", "Confidentiality", "Conflict Resolution", "Construction Knowledge", "Construction Materials",
    "Construction Methods", "Content Creation", "Content Marketing", "Content Strategy", "Continuous Learning",
    "Contract Knowledge", "Contract Management", "Contract Negotiation", "Cooking Techniques", "Copywriting",
    "Cost Analysis", "Cost Control", "Cost Estimation", "Cost Management", "Counseling",
    "Creativity", "Credit Analysis", "Crisis Intervention", "Crisis Management", "Critical Thinking",
    "CRM Software", "Crop Management", "Crop Science", "Cryptography", "Cultural Competence",
    "Cultural Sensitivity", "Curriculum Design", "Curriculum Development", "Customer Service", "Cybersecurity Awareness",
    "Data Analysis", "Data Collection", "Data Interpretation", "Data Science", "Data Security",
    "Data Structures", "Data Visualization", "Database Design", "Database Management", "Deadline Management",
    "Deadlines", "Debugging", "Decision Making", "Design Systems", "Design Thinking",
    "Diagnosis", "Digital Literacy", "Digital Marketing", "Digital Media", "Display Design",
    "Docker", "Documentation", "Document Preparation", "DOT Regulations", "Donor Relations",
    "E-learning", "E-learning Development", "Economics", "Editing", "Education Law",
    "Efficiency Standards", "Electrical Codes", "Electrical Installation", "Electrical Systems", "Email Marketing",
    "Emergency Procedures", "Emergency Response", "Emotional Intelligence", "Empathy", "Employee Relations",
    "Energy Analysis", "Engineering Design", "Environmental Assessment", "Equipment Design", "Equipment Operation",
    "Equipment Repair", "ERP Systems", "Ethics", "Ethical Hacking", "Evaluation",
    "Event Coordination", "Event Planning", "Excel", "Experimentation", "Facilitation",
    "Fact Checking", "FEA", "Field Testing", "Field Work", "Figma/Sketch",
    "File Management", "Filing", "Financial Analysis", "Financial Modeling", "Financial Reporting",
    "Financial Statement Analysis", "First Aid", "Food Safety", "Forecasting", "Fundraising Strategy",
    "GAAP/IFRS", "GIS", "Git", "Google Analytics", "Government Processes",
    "GPS Navigation", "Grammar", "Grant Writing", "Graphic Design", "Hand/Power Tools",
    "Healthcare Management", "Healthcare Regulations", "HRIS", "HTML/CSS", "Incident Response",
    "Industry Research", "Infrastructure as Code", "Innovation", "Inspection", "Instrumentation",
    "Internet of Things (IoT)", "Interpersonal Skills", "Interviewing", "Inventory Management", "Inventory Optimization",
    "Investigation", "Investment Analysis", "Irrigation Systems", "ISO Standards", "Java",
    "Kitchen Management", "Kubernetes", "Lab Equipment Operation", "Labor Law", "Laboratory Testing",
    "Laboratory Techniques", "Language Skills", "Layout Design", "Leadership", "Lean Manufacturing",
    "Learning Management Systems", "Lease Management", "Leasing", "Legal Knowledge", "Legal Research",
    "Legal Software", "Legal Terminology", "Legal Writing", "Lesson Planning", "Linux",
    "Listening", "Literature Review", "Litigation", "Livestock Management", "Local Knowledge",
    "Lodash", "Logistics", "M&A Analysis", "Machine Learning", "Maintenance",
    "Manual Dexterity", "Manual Therapy", "Manufacturing Processes", "Market Analysis", "Market Knowledge",
    "Market Research", "Marketing", "Marketing Automation", "Marketing Strategy", "Materials Science",
    "Mathematics", "Mechanical Design", "Mechanical Systems", "Media Relations", "Medical Diagnosis",
    "Medical Equipment", "Medical Ethics", "Medication Administration", "Menu Planning", "Merchandise Display",
    "Microscopy", "Molecular Biology", "Monitoring", "Motion Graphics", "Multitasking",
    "Music Theory", "MySQL/PostgreSQL/MongoDB", "Navigation", "Needs Analysis", "Negotiation",
    "Network Security", "Networking", "News Judgment", "Office Software", "Operations Management",
    "Operations Research", "Organization", "Pain Management", "Papaparse", "Patient Assessment",
    "Patient Care", "Patient Evaluation", "Patience", "Penetration Testing", "Performance Management",
    "Performance Tuning", "Pest Management", "Phone Etiquette", "Photography", "Physical Stamina",
    "Planning", "Policy Development", "Policy Research", "POS Systems", "Power Systems",
    "PowerPoint", "Presentation", "Preventive Maintenance", "Print Production", "Problem Solving",
    "Process Improvement", "Process Optimization", "Product Knowledge", "Production Planning", "Program Knowledge",
    "Program Management", "Programming (Python, Java, C++)", "Project Management", "Project Planning", "Property Maintenance",
    "Property Valuation", "Prospecting", "Prototyping", "Public Speaking", "Python",
    "Quality Assurance", "Quality Control", "Quality Standards", "Quantum Computing", "R",
    "Record Keeping", "Recruitment", "Regulations", "Regulatory Compliance", "Regulatory Knowledge",
    "Rehabilitation", "Relationship Building", "Remote Collaboration", "Remote Support Tools", "Renewable Energy",
    "Replication", "Report Writing", "Reporting", "Research", "Research Methodology",
    "Reservation Systems", "Resource Coordination", "Retail Operations", "Retail Trends", "Revenue Management",
    "Risk Assessment", "Risk Management", "Risk Modeling", "Root Cause Analysis", "Route Planning",
    "Safe Driving", "Safety Awareness", "Safety Management", "Safety Procedures", "Safety Protocols",
    "Safety Regulations", "Safety Standards", "Sales", "Scheduling", "Scheduling Tools",
    "Scientific Writing", "Scripting", "Security", "Security Frameworks", "SEM",
    "SEO", "SheetJS", "SIEM Tools", "Simulation", "Site Analysis",
    "Site Supervision", "Six Sigma", "Social Media", "Social Media Marketing", "Social Media Strategy",
    "Software Design", "Software Systems", "Soil Analysis", "Soil Science", "Sound Recording",
    "Sourcing", "Space Planning", "Specimen Collection", "SQL", "Staff Management",
    "Staff Supervision", "Stakeholder Engagement", "Stakeholder Management", "Stakeholder Relations", "Statistical Analysis",
    "Statistical Process Control", "Statistics", "Storytelling", "Strategic Planning", "Stress Management",
    "Structural Design", "Student Advising", "Student Engagement", "Subject Expertise", "Supply Chain",
    "Supply Chain Management", "Supply Chain Strategy", "Surgery", "Sustainability", "Sustainability Practices",
    "Tax Preparation", "Teamwork", "Technical Documentation", "Technical Drawing", "Technical Knowledge",
    "Technical Support", "Technical Troubleshooting", "Technical Writing", "Technology Integration", "Tenant Relations",
    "TensorFlow/PyTorch", "Testing", "Testing Methods", "Thermodynamics", "Threat Analysis",
    "Time Management", "Training", "Training Design", "Transcription", "Transportation Planning",
    "Treatment Planning", "Trend Awareness", "Trend Forecasting", "Troubleshooting", "Typography",
    "Urban Design", "User Research", "User Testing", "Valuation", "Vehicle Maintenance",
    "Vendor Management", "Vendor Relations", "Video Editing Software", "Visual Design", "Visual Merchandising",
    "Vital Signs Monitoring", "Volunteer Management", "Warehouse Operations", "Weather Analysis", "Weather Monitoring",
    "Web Design", "Wireframing", "Wiring", "WMS Software", "Work Ethic",
    "Writing", "Zoning"
  ];
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    phone: '',
    altPhone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    community: '',
    nationality: '',
    residentCountry: '',
    currentCity: '',
    postalCode: '',
    address: '',
    latitude: '',
    longitude: '',
    workPermit: '',
    preferredLocation1: '',
    preferredLocation2: '',
    preferredLocation3: '',
    willingToRelocate: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    summary: '',
    yearsOfExperience: '',
    yearsExperience: '',
    expectedSalary: '',
    jobTypePreference: '',
    jobType: '',
    availability: '',
    industry: '',
    careerLevel: '',
    noticePeriod: '',
    currentSalary: '',
    currencyPreference: '',
    travelAvailability: '',
    workLocation: '',
    membershipOrg: '',
    membershipType: '',
    membershipDate: '',
    careerObjectives: '',
    hobbies: '',
    additionalComments: '',
    agreeTerms: false,
    allowContact: false,
    skills: '',
    tools: '',
    profilePhoto: null
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [professionalLinks, setProfessionalLinks] = useState({});
  const [references, setReferences] = useState([]);

  const authHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` });

  // Calculate profile completion percentage - counting ALL 52+ fields
  const calculateProfileCompletion = () => {
    let totalFields = 0;
    let filledFields = 0;
    
    // Very strict helper to check if field has meaningful value
    const hasValue = (value) => {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
        return trimmed.length > 0;
      }
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') {
        return Object.values(value).some(v => v && typeof v === 'string' && v.trim().length > 0);
      }
      return false;
    };
    
    console.log(`📊 Checking Profile Completion (ALL 52+ Fields)...`);
    
    // Basic Personal Info (9 fields)
    const basicFields = {
      firstName: profileForm.firstName,
      middleName: profileForm.middleName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phoneNumber || profileForm.phone,
      altPhone: profileForm.altPhone,
      dateOfBirth: profileForm.dateOfBirth,
      gender: profileForm.gender,
      bloodGroup: profileForm.bloodGroup
    };
    totalFields += 9;
    Object.entries(basicFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Location & Residency (10 fields)
    const locationFields = {
      nationality: profileForm.nationality,
      residentCountry: profileForm.residentCountry,
      currentCity: profileForm.currentCity,
      postalCode: profileForm.postalCode,
      address: profileForm.address,
      latitude: profileForm.latitude,
      longitude: profileForm.longitude,
      workPermit: profileForm.workPermit,
      preferredLocation1: profileForm.preferredLocation1,
      preferredLocation2: profileForm.preferredLocation2
    };
    totalFields += 10;
    Object.entries(locationFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Preferred Locations & Work Settings (5 fields)
    const workLocationFields = {
      preferredLocation3: profileForm.preferredLocation3,
      willingToRelocate: profileForm.willingToRelocate,
      workLocation: profileForm.workLocation,
      travelAvailability: profileForm.travelAvailability,
      availability: profileForm.availability
    };
    totalFields += 5;
    Object.entries(workLocationFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Professional Info (6 fields)
    const professionalFields = {
      professionalTitle: profileForm.professionalTitle,
      professionalSummary: profileForm.professionalSummary,
      yearsExperience: profileForm.yearsExperience || profileForm.yearsOfExperience,
      careerLevel: profileForm.careerLevel,
      industry: profileForm.industry,
      community: profileForm.community
    };
    totalFields += 6;
    Object.entries(professionalFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Job Preferences (6 fields)
    const jobPrefFields = {
      preferredJobTitles: profileForm.preferredJobTitles,
      jobType: profileForm.jobType,
      noticePeriod: profileForm.noticePeriod,
      currentSalary: profileForm.currentSalary,
      expectedSalary: profileForm.expectedSalary,
      currencyPreference: profileForm.currencyPreference
    };
    totalFields += 6;
    Object.entries(jobPrefFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Skills & Tools (2 fields)
    totalFields += 2;
    if (hasValue(profileForm.skills)) filledFields++;
    if (hasValue(profileForm.tools)) filledFields++;
    
    // Professional Memberships (3 fields)
    const membershipFields = {
      membershipOrg: profileForm.membershipOrg,
      membershipType: profileForm.membershipType,
      membershipDate: profileForm.membershipDate
    };
    totalFields += 3;
    Object.entries(membershipFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Additional Info (3 fields)
    const additionalFields = {
      careerObjectives: profileForm.careerObjectives,
      hobbies: profileForm.hobbies,
      additionalComments: profileForm.additionalComments
    };
    totalFields += 3;
    Object.entries(additionalFields).forEach(([key, value]) => {
      if (hasValue(value)) filledFields++;
    });
    
    // Array Sections (4 sections - count if they have entries)
    totalFields += 4;
    if (education && education.length > 0) filledFields++;
    if (experience && experience.length > 0) filledFields++;
    if (languages && languages.length > 0) filledFields++;
    if (certifications && certifications.length > 0) filledFields++;
    
    // Professional Links (4 fields - individual links)
    totalFields += 4;
    if (professionalLinks.linkedin && professionalLinks.linkedin.trim()) filledFields++;
    if (professionalLinks.github && professionalLinks.github.trim()) filledFields++;
    if (professionalLinks.portfolio && professionalLinks.portfolio.trim()) filledFields++;
    if (professionalLinks.website && professionalLinks.website.trim()) filledFields++;
    
    // References (1 section)
    totalFields += 1;
    if (references && references.length > 0) filledFields++;
    
    // Calculate percentage (Total: 53 fields)
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    
    console.log(`\n📊 Profile Completion Summary:`);
    console.log(`   Total Fields: ${totalFields}`);
    console.log(`   Filled Fields: ${filledFields}`);
    console.log(`   Percentage: ${percentage}%\n`);
    
    return percentage;
  };

  // Section editing functions
  const toggleSectionEdit = async (section) => {
    const isCurrentlyEditing = editingSections[section];
    
    // If canceling edit mode, refresh data to restore original values
    if (isCurrentlyEditing) {
      console.log(`🔄 Canceling edit for ${section}, restoring original data...`);
      await refreshDataAfterEdit();
    }
    
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to refresh data after edits to ensure persistence
  const refreshDataAfterEdit = async () => {
    try {
      console.log('🔄 Refreshing data after edit...');
      const res = await axios.get(buildApiUrl('/api/jobseeker/profile'), { headers: authHeaders() });
      const p = res?.data || {};
      
      // Update cache with fresh data
      sessionStorage.setItem('myProfileData', JSON.stringify(p));
      sessionStorage.setItem('myProfileTimestamp', Date.now().toString());
      
      // Update form state with fresh data
      setProfileForm(prev => ({
        ...prev,
        // Basic Information
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        middleName: p.middleName || '',
        email: p.email || '',
        phone: p.phone || p.phoneNumber || '',
        phoneNumber: p.phoneNumber || p.phone || '',
        altPhone: p.altPhone || '',
        
        // Personal Details
        dateOfBirth: p.dateOfBirth || '',
        gender: p.gender || '',
        bloodGroup: p.bloodGroup || '',
        community: p.community || p.primary_community || '',
        
        // Location & Address
        nationality: p.nationality || '',
        residentCountry: p.residentCountry || '',
        currentCity: p.currentCity || '',
        postalCode: p.postalCode || '',
        address: p.address || '',
        latitude: p.latitude || '',
        longitude: p.longitude || '',
        workPermit: p.workPermit || '',
        
        // Preferred Working Locations
        preferredLocation1: p.preferredLocation1 || '',
        preferredLocation2: p.preferredLocation2 || '',
        preferredLocation3: p.preferredLocation3 || '',
        willingToRelocate: p.willingToRelocate || '',
        workLocation: p.workLocation || '',
        
        // Professional Profile
        professionalTitle: p.professionalTitle || '',
        professionalSummary: p.professionalSummary || p.summary || '',
        summary: p.summary || p.professionalSummary || '',
        yearsExperience: p.yearsExperience || p.yearsOfExperience || '',
        yearsOfExperience: p.yearsExperience || p.yearsOfExperience || '',
        careerLevel: p.careerLevel || '',
        industry: p.industry || '',
        
        // Job Preferences
        preferredJobTitles: p.preferredJobTitles || '',
        jobType: p.jobType || p.jobTypePreference || '',
        jobTypePreference: p.jobType || p.jobTypePreference || '',
        noticePeriod: p.noticePeriod || '',
        currentSalary: p.currentSalary || '',
        expectedSalary: p.expectedSalary || '',
        currencyPreference: p.currencyPreference || '',
        travelAvailability: p.travelAvailability || '',
        availability: p.availability || '',
        
        // Professional Memberships
        membershipOrg: p.membershipOrg || '',
        membershipType: p.membershipType || '',
        membershipDate: p.membershipDate || '',
        
        // Additional Information
        careerObjectives: p.careerObjectives || '',
        hobbies: p.hobbies || '',
        additionalComments: p.additionalComments || '',
        agreeTerms: p.agreeTerms || false,
        allowContact: p.allowContact || false,
        
        // Skills & Tools
        skills: Array.isArray(p.coreSkills) ? p.coreSkills.join(', ') : (Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '')),
        tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || ''),
        profilePhoto: p.profilePhoto || null
      }));
      
      // Update array fields
      setEducation(Array.isArray(p.educationEntries) ? p.educationEntries : (Array.isArray(p.education) ? p.education : []));
      setExperience(Array.isArray(p.experienceEntries) ? p.experienceEntries : (Array.isArray(p.experience) ? p.experience : (Array.isArray(p.workExperience) ? p.workExperience : [])));
      setLanguages(Array.isArray(p.languages) ? p.languages.map(l => (typeof l === 'string' ? { language: l, proficiency: '' } : l)) : []);
      setCertifications(Array.isArray(p.certificationEntries) ? p.certificationEntries : (Array.isArray(p.certifications) ? p.certifications : []));
      const refreshedReferencesData = Array.isArray(p.referenceEntries) ? p.referenceEntries : (Array.isArray(p.references) ? p.references : []);
      setReferences(refreshedReferencesData);
      console.log(`📞 Refreshed References: ${refreshedReferencesData.length} items`, refreshedReferencesData);
      
      // Update professional links
      const links = p.professionalLinks || {};
      setProfessionalLinks({
        linkedin: links.linkedin || links.linkedinUrl || '',
        github: links.github || links.githubUrl || '',
        portfolio: links.portfolio || links.portfolioUrl || '',
        website: links.website || links.websiteUrl || ''
      });
      
      console.log('✅ Data refreshed successfully after edit');
    } catch (error) {
      console.error('❌ Error refreshing data after edit:', error);
    }
  };

  // Function to ensure array fields are properly updated in form state
  const updateArrayFieldsInForm = () => {
    setProfileForm(prev => ({
      ...prev,
      // Update skills and tools from arrays
      skills: Array.isArray(profileForm.skills) ? profileForm.skills.join(', ') : (profileForm.skills || ''),
      tools: Array.isArray(profileForm.tools) ? profileForm.tools.join(', ') : (profileForm.tools || ''),
    }));
  };

  // Function to ensure array fields are properly saved
  const ensureArrayFieldsSaved = (payload) => {
    // Ensure all array fields are properly included
    const arrayFields = {
      education: education || [],
      experience: experience || [],
      languages: languages || [],
      certifications: certifications || [],
      references: references || [],
      professionalLinks: professionalLinks || {}
    };

    return {
      ...payload,
      ...arrayFields,
      // Also include with different naming conventions for backend compatibility
      educationEntries: education || [],
      experienceEntries: experience || [],
      workExperience: experience || [],
      certificationEntries: certifications || [],
      referenceEntries: references || [],
      languageProficiency: languages || []
    };
  };

  // Data validation function to ensure 100% accuracy
  const validateProfileData = (data) => {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 
      'gender', 'nationality', 'currentCity', 'workPermit',
      'preferredLocation1', 'willingToRelocate', 'workLocation',
      'professionalTitle', 'yearsExperience', 'industry'
    ];

    requiredFields.forEach(field => {
      if (!data[field] || data[field] === '') {
        validation.errors.push(`Missing required field: ${field}`);
        validation.isValid = false;
      }
    });

    // Check array fields
    const arrayFields = ['education', 'experience', 'languages', 'skills'];
    arrayFields.forEach(field => {
      if (!Array.isArray(data[field]) || data[field].length === 0) {
        validation.warnings.push(`Empty array field: ${field}`);
      }
    });

    // Check professional links structure
    if (data.professionalLinks && typeof data.professionalLinks === 'object') {
      const linkFields = ['linkedin', 'github', 'portfolio', 'website'];
      const hasAnyLink = linkFields.some(field => data.professionalLinks[field]);
      if (!hasAnyLink) {
        validation.warnings.push('No professional links provided');
      }
    }

    console.log('🔍 Data validation result:', validation);
    return validation;
  };

  const saveSection = async (section) => {
    setSaving(true);
    try {
      console.log(`💾 Saving ${section} section...`);
      console.log(`🔍 Current profileForm state:`, profileForm);
      
      const payload = {
        // Basic Information - Map all possible field names
        firstName: profileForm.firstName || '',
        middleName: profileForm.middleName || '',
        lastName: profileForm.lastName || '',
        fullName: `${profileForm.firstName || ''} ${profileForm.middleName || ''} ${profileForm.lastName || ''}`.trim(),
        email: profileForm.email || '',
        phone: profileForm.phone || profileForm.phoneNumber || '',
        phoneNumber: profileForm.phone || profileForm.phoneNumber || '',
        altPhone: profileForm.altPhone || '',
        
        // Personal Details
        dateOfBirth: profileForm.dateOfBirth || '',
        gender: profileForm.gender || '',
        bloodGroup: profileForm.bloodGroup || '',
        community: profileForm.community || '',
        
        // Location & Address
        nationality: profileForm.nationality || '',
        residentCountry: profileForm.residentCountry || '',
        currentCity: profileForm.currentCity || '',
        postalCode: profileForm.postalCode || '',
        address: profileForm.address || '',
        latitude: profileForm.latitude || '',
        longitude: profileForm.longitude || '',
        workPermit: profileForm.workPermit || '',
        
        // Preferred Working Locations
        preferredLocation1: profileForm.preferredLocation1 || '',
        preferredLocation2: profileForm.preferredLocation2 || '',
        preferredLocation3: profileForm.preferredLocation3 || '',
        willingToRelocate: profileForm.willingToRelocate || '',
        workLocation: profileForm.workLocation || '',
        
        // Professional Profile
        professionalTitle: profileForm.professionalTitle || '',
        professionalSummary: profileForm.professionalSummary || profileForm.summary || '',
        summary: profileForm.professionalSummary || profileForm.summary || '',
        yearsExperience: profileForm.yearsExperience || profileForm.yearsOfExperience || '',
        yearsOfExperience: profileForm.yearsExperience || profileForm.yearsOfExperience || '',
        careerLevel: profileForm.careerLevel || '',
        industry: profileForm.industry || '',
        
        // Job Preferences
        preferredJobTitles: profileForm.preferredJobTitles || '',
        jobType: profileForm.jobType || profileForm.jobTypePreference || '',
        jobTypePreference: profileForm.jobType || profileForm.jobTypePreference || '',
        noticePeriod: profileForm.noticePeriod || '',
        currentSalary: profileForm.currentSalary || '',
        expectedSalary: profileForm.expectedSalary || '',
        currencyPreference: profileForm.currencyPreference || '',
        travelAvailability: profileForm.travelAvailability || '',
        availability: profileForm.availability || '',
        
        // Professional Memberships
        membershipOrg: profileForm.membershipOrg || '',
        membershipType: profileForm.membershipType || '',
        membershipDate: profileForm.membershipDate || '',
        
        // Additional Information
        careerObjectives: profileForm.careerObjectives || '',
        hobbies: profileForm.hobbies || '',
        additionalComments: profileForm.additionalComments || '',
        agreeTerms: profileForm.agreeTerms || false,
        allowContact: profileForm.allowContact || false,
        
        // Skills & Tools - Convert to arrays
        skills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        coreSkills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        softwareTools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        
        // Array Fields - Use both naming conventions for compatibility
        education: education,
        educationEntries: education,
        experience: experience,
        experienceEntries: experience,
        workExperience: experience,
        languages: languages,
        languageProficiency: languages,
        certifications: certifications,
        certificationEntries: certifications,
        references: references,
        referenceEntries: references,
        professionalLinks: professionalLinks,
        
        // Profile completion status
        profileCompleted: true,
        hasCompletedProfile: true
      };
      
      // Ensure array fields are properly included
      const finalPayload = ensureArrayFieldsSaved(payload);
      
      console.log(`📤 Sending payload for ${section}:`, finalPayload);
      console.log(`🩸 Blood Group in payload:`, payload.bloodGroup);
      console.log(`👤 Demographics fields in payload:`, {
        bloodGroup: payload.bloodGroup,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        community: payload.community,
        nationality: payload.nationality,
        currentCity: payload.currentCity
      });
      console.log(`📋 Array fields in payload:`, {
        education: payload.education?.length || 0,
        experience: payload.experience?.length || 0,
        languages: payload.languages?.length || 0,
        certifications: payload.certifications?.length || 0,
        references: payload.references?.length || 0,
        skills: payload.skills?.length || 0,
        tools: payload.tools?.length || 0
      });
      console.log(`🔗 Professional links in payload:`, finalPayload.professionalLinks);
      
      // No validation - allow saving with any fields filled or empty
      console.log('💾 Saving profile without validation checks...');
      
      const response = await axios.put(buildApiUrl('/api/profile/profile'), finalPayload, { 
        headers: { 
          ...authHeaders(), 
          'Content-Type': 'application/json' 
        } 
      });
      
      console.log(`✅ ${section} section saved successfully:`, response.data);
      console.log(`🔍 Saved data - References:`, response.data?.references || response.data?.referenceEntries);
      console.log(`🔍 Saved data - Certifications:`, response.data?.certifications || response.data?.certificationEntries);
      console.log(`🔍 Saved data - Experience:`, response.data?.experience || response.data?.experienceEntries);
      console.log(`🔍 Saved data - Education:`, response.data?.education || response.data?.educationEntries);
      
      // IMPORTANT: Clear cache to force fresh data fetch on next load
      sessionStorage.removeItem('myProfileData');
      sessionStorage.removeItem('myProfileTimestamp');
      
      // Show success message
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully!`);
      
      // Refresh data immediately to ensure we see the saved data
      console.log(`🔄 Refreshing data after save to verify persistence...`);
      await refreshDataAfterEdit();
      
      // Verify data was actually saved
      console.log(`✅ After refresh - References count:`, references.length);
      console.log(`✅ After refresh - Certifications count:`, certifications.length);
      
      // Update AuthContext user data if firstName or lastName changed
      if (user && (finalPayload.firstName !== user.firstName || finalPayload.lastName !== user.lastName)) {
        const updatedUser = {
          ...user,
          firstName: finalPayload.firstName,
          lastName: finalPayload.lastName,
          fullName: `${finalPayload.firstName || ''} ${finalPayload.middleName || ''} ${finalPayload.lastName || ''}`.trim()
        };
        // Store in localStorage to persist across page reloads
        localStorage.setItem('userFirstName', finalPayload.firstName);
        localStorage.setItem('userLastName', finalPayload.lastName);
        console.log('📝 Updated user data in AuthContext and localStorage');
      }
      
      // Close edit mode after successful save and refresh
      setEditingSections(prev => ({ ...prev, [section]: false }));
      
    } catch (error) {
      console.error(`❌ Error saving ${section} section:`, error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show error message
      alert(`Error saving ${section} section: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;
    
    const currentSkills = profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentSkills.includes(trimmedSkill)) {
      setProfileForm(prev => ({
        ...prev,
        skills: [...currentSkills, trimmedSkill].join(', ')
      }));
    }
    setSkillInputValue('');
    setSkillsDropdownOpen(false);
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    setProfileForm(prev => ({
      ...prev,
      skills: currentSkills.filter(skill => skill !== skillToRemove).join(', ')
    }));
  };

  // Close skills dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsDropdownOpen && !event.target.closest('.skills-dropdown-container')) {
        setSkillsDropdownOpen(false);
        // Optionally clear input when clicking outside - comment out if you want to keep the typed text
        // setSkillInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [skillsDropdownOpen]);

  // Recalculate profile completion when data changes
  useEffect(() => {
    if (!loading) {
      const completion = calculateProfileCompletion();
      setProfileCompletionPercentage(completion);
      console.log(`📊 Profile Completion Updated: ${completion}%`);
    }
  }, [profileForm, education, experience, languages, certifications, professionalLinks, references, loading]);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after component unmount

    // Add page visibility change listener to refresh data when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('🔄 Page became visible, refreshing data...');
        refreshDataAfterEdit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const load = async () => {
      try {
        console.log('🔄 Loading profile data...');
        setLoading(true);
        
        // Check for cached data first (faster initial render)
        const cachedData = sessionStorage.getItem('myProfileData');
        const cacheTimestamp = sessionStorage.getItem('myProfileTimestamp');
        const cacheMaxAge = 5 * 60 * 1000; // 5 minutes
        
        // Use cached data if available and not expired
        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < cacheMaxAge) {
          console.log('⚡ Loading from cache (fast!)');
          const p = JSON.parse(cachedData);
          
          if (!isMounted) return;
          
          // Populate form with cached data immediately
          setProfileForm(prev => ({
            ...prev,
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            middleName: p.middleName || '',
            email: p.email || '',
            phoneNumber: p.phone || p.phoneNumber || '',
            phone: p.phone || p.phoneNumber || '',
            altPhone: p.altPhone || '',
            dateOfBirth: p.dateOfBirth || '',
            gender: p.gender || '',
            bloodGroup: p.bloodGroup || '',
            community: p.community || '',
            nationality: p.nationality || '',
            residentCountry: p.residentCountry || '',
            currentCity: p.currentCity || '',
            postalCode: p.postalCode || '',
            address: p.address || '',
            latitude: p.latitude || '',
            longitude: p.longitude || '',
            workPermit: p.workPermit || '',
            preferredLocation1: p.preferredLocation1 || '',
            preferredLocation2: p.preferredLocation2 || '',
            preferredLocation3: p.preferredLocation3 || '',
            willingToRelocate: p.willingToRelocate || '',
            location: p.location || '',
            professionalTitle: p.professionalTitle || '',
            professionalSummary: p.professionalSummary || p.summary || '',
            summary: p.summary || p.professionalSummary || '',
            yearsOfExperience: p.yearsOfExperience || p.yearsExperience || '',
            yearsExperience: p.yearsExperience || p.yearsOfExperience || '',
            expectedSalary: p.expectedSalary || '',
            jobTypePreference: p.jobTypePreference || '',
            availability: p.availability || '',
            industry: p.industry || '',
            careerLevel: p.careerLevel || '',
            noticePeriod: p.noticePeriod || '',
            currentSalary: p.currentSalary || '',
            currencyPreference: p.currencyPreference || '',
            travelAvailability: p.travelAvailability || '',
            workLocation: p.workLocation || '',
            membershipOrg: p.membershipOrg || '',
            membershipType: p.membershipType || '',
            membershipDate: p.membershipDate || '',
            careerObjectives: p.careerObjectives || '',
            hobbies: p.hobbies || '',
            additionalComments: p.additionalComments || '',
            agreeTerms: p.agreeTerms || false,
            allowContact: p.allowContact || false,
            jobType: p.jobType || '',
            skills: Array.isArray(p.coreSkills) ? p.coreSkills.join(', ') : (Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '')),
            tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || ''),
            profilePhoto: p.profilePhoto || null
          }));
          
          setEducation(Array.isArray(p.educationEntries) ? p.educationEntries : (Array.isArray(p.education) ? p.education : []));
          setExperience(Array.isArray(p.experienceEntries) ? p.experienceEntries : (Array.isArray(p.experience) ? p.experience : []));
          setLanguages(Array.isArray(p.languages) ? p.languages : []);
          setCertifications(Array.isArray(p.certificationEntries) ? p.certificationEntries : (Array.isArray(p.certifications) ? p.certifications : []));
          const referencesData = Array.isArray(p.referenceEntries) ? p.referenceEntries : (Array.isArray(p.references) ? p.references : []);
          setReferences(referencesData);
          console.log(`📞 Loading References from cache: ${referencesData.length} items`, referencesData);
          
          const links = p.professionalLinks || {};
          setProfessionalLinks({
            linkedin: links.linkedin || links.linkedinUrl || '',
            github: links.github || links.githubUrl || '',
            portfolio: links.portfolio || links.portfolioUrl || '',
            website: links.website || links.websiteUrl || ''
          });
          
          // Calculate profile completion from cached data
          const completion = calculateProfileCompletion();
          setProfileCompletionPercentage(completion);
          console.log(`📊 Profile Completion (from cache): ${completion}%`);
          
          setLoading(false);
          console.log('✅ Cached data loaded successfully');
          
          // Check cache age - only fetch fresh if cache is older than 5 minutes
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          const FIVE_MINUTES = 5 * 60 * 1000;
          
          if (cacheAge > FIVE_MINUTES) {
            console.log('🔄 Cache is old (>5 min), fetching fresh data in background...');
            fetchFreshData();
          } else {
            console.log('✅ Cache is fresh (<5 min), skipping background fetch to preserve recent edits');
          }
          return;
        }
        
        // No cache or expired - fetch fresh data
        await fetchFreshData();
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Error loading profile:', error);
        console.error('Error details:', error.response?.data || error.message);
        setLoading(false);
      }
    };
    
    const fetchFreshData = async () => {
      try {
        console.log('🔄 Fetching fresh data from /api/jobseeker/profile...');
        const res = await axios.get(buildApiUrl('/api/jobseeker/profile'), { headers: authHeaders() });
        const p = res?.data || {};
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 RAW DATA RECEIVED FROM BACKEND');
        console.log('='.repeat(80));
        console.log('Full response:', p);
        console.log(`✅ Received ${Object.keys(p).filter(k => p[k] && p[k] !== '').length} filled fields out of ${Object.keys(p).length} total fields`);
        console.log('\n📋 Field-by-field breakdown:');
        Object.keys(p).forEach(key => {
          if (p[key] && p[key] !== '' && !['_id', 'userId', 'createdAt', 'updatedAt'].includes(key)) {
            const value_preview = typeof p[key] === 'string' && p[key].length > 50 ? p[key].substring(0, 50) + '...' : JSON.stringify(p[key]);
            console.log(`  ✓ ${key}: ${value_preview}`);
          }
        });
        console.log('='.repeat(80) + '\n');
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        // Cache the fresh data
        sessionStorage.setItem('myProfileData', JSON.stringify(p));
        sessionStorage.setItem('myProfileTimestamp', Date.now().toString());
        console.log('💾 Profile data cached for faster loading')
        
        setProfileForm(prev => ({
          ...prev,
          // Basic Information - Map all possible field names
          firstName: user?.firstName || p.firstName || '',
          lastName: user?.lastName || p.lastName || '',
          middleName: p.middleName || '',
          email: user?.email || p.email || localStorage.getItem('userEmail') || '',
          phoneNumber: p.phoneNumber || p.phone || '',
          phone: p.phone || p.phoneNumber || '',
          altPhone: p.altPhone || '',
          
          // Personal Details
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          bloodGroup: p.bloodGroup || '',
          community: p.community || p.primary_community || '',
          
          // Location & Address
          nationality: p.nationality || '',
          residentCountry: p.residentCountry || p.location?.country || '',
          currentCity: p.currentCity || p.location?.city || '',
          postalCode: p.postalCode || '',
          address: p.address || '',
          latitude: p.latitude || p.location?.coordinates?.[1] || '',
          longitude: p.longitude || p.location?.coordinates?.[0] || '',
          workPermit: p.workPermit || '',
          preferredLocation1: p.preferredLocation1 || '',
          preferredLocation2: p.preferredLocation2 || '',
          preferredLocation3: p.preferredLocation3 || '',
          willingToRelocate: p.willingToRelocate || '',
          location: typeof p.location === 'string' ? p.location : [p.location?.city, p.location?.state, p.location?.country].filter(Boolean).join(', '),
          professionalTitle: p.professionalTitle || '',
          professionalSummary: p.professionalSummary || p.summary || '',
          summary: p.summary || p.professionalSummary || '',
          yearsOfExperience: p.yearsOfExperience || p.yearsExperience || '',
          yearsExperience: p.yearsExperience || p.yearsOfExperience || '',
          careerLevel: p.careerLevel || '',
          industry: p.industry || '',
          preferredJobTitles: p.preferredJobTitles || '',
          jobType: p.jobType || '',
          jobTypePreference: p.jobTypePreference || p.job_type || '',
          noticePeriod: p.noticePeriod || '',
          currentSalary: p.currentSalary || '',
          expectedSalary: p.expectedSalary || '',
          currencyPreference: p.currencyPreference || p.currency || '',
          travelAvailability: p.travelAvailability || '',
          workLocation: p.workLocation || '',
          availability: typeof p.availability === 'string' ? p.availability : (Array.isArray(p.availability) ? p.availability.join(', ') : ''),
          membershipOrg: p.membershipOrg || '',
          membershipType: p.membershipType || '',
          membershipDate: p.membershipDate || '',
          careerObjectives: p.careerObjectives || '',
          hobbies: p.hobbies || '',
          additionalComments: p.additionalComments || '',
          agreeTerms: p.agreeTerms || false,
          allowContact: p.allowContact || false,
          skills: Array.isArray(p.coreSkills) ? p.coreSkills.join(', ') : (Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '')),
          tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || ''),
          profilePhoto: p.profilePhoto || null
        }));
        
        setEducation(Array.isArray(p.educationEntries) ? p.educationEntries : (Array.isArray(p.education) ? p.education : []));
        setExperience(Array.isArray(p.experienceEntries) ? p.experienceEntries : (Array.isArray(p.experience) ? p.experience : (Array.isArray(p.workExperience) ? p.workExperience : [])));
        setLanguages(Array.isArray(p.languages) ? p.languages.map(l => (typeof l === 'string' ? { language: l, proficiency: '' } : l)) : []);
        setCertifications(Array.isArray(p.certificationEntries) ? p.certificationEntries : (Array.isArray(p.certifications) ? p.certifications : []));
        const links = p.professionalLinks || {};
        setProfessionalLinks({
          linkedin: links.linkedin || links.linkedinUrl || '',
          github: links.github || links.githubUrl || '',
          portfolio: links.portfolio || links.portfolioUrl || '',
          website: links.website || links.websiteUrl || ''
        });
        const freshReferencesData = Array.isArray(p.referenceEntries) ? p.referenceEntries : (Array.isArray(p.references) ? p.references : []);
        setReferences(freshReferencesData);
        console.log(`📞 Loading References from fresh data: ${freshReferencesData.length} items`, freshReferencesData);
        
        console.log('\n' + '='.repeat(80));
        console.log('✅ PROFILE DATA SUCCESSFULLY LOADED AND STATE UPDATED');
        console.log('='.repeat(80));
        console.log('📊 ProfileForm state (after mapping):');
        console.log(`  First Name: ${p.firstName || 'EMPTY'}`);
        console.log(`  Middle Name: ${p.middleName || 'EMPTY'}`);
        console.log(`  Last Name: ${p.lastName || 'EMPTY'}`);
        console.log(`  Email: ${p.email || 'EMPTY'}`);
        console.log(`  Phone: ${p.phone || 'EMPTY'}`);
        console.log(`  Alt Phone: ${p.altPhone || 'EMPTY'}`);
        console.log(`  Date of Birth: ${p.dateOfBirth || 'EMPTY'}`);
        console.log(`  Gender: ${p.gender || 'EMPTY'}`);
        console.log(`  Blood Group: ${p.bloodGroup || 'EMPTY'}`);
        console.log(`  Community: ${p.community || 'EMPTY'}`);
        console.log(`  Nationality: ${p.nationality || 'EMPTY'}`);
        console.log(`  Resident Country: ${p.residentCountry || 'EMPTY'}`);
        console.log(`  Current City: ${p.currentCity || 'EMPTY'}`);
        console.log(`  Work Permit: ${p.workPermit || 'EMPTY'}`);
        console.log(`  Professional Title: ${p.professionalTitle || 'EMPTY'}`);
        console.log(`  Years Experience: ${p.yearsExperience || p.yearsOfExperience || 'EMPTY'}`);
        console.log(`  Career Level: ${p.careerLevel || 'EMPTY'}`);
        console.log(`  Industry: ${p.industry || 'EMPTY'}`);
        console.log('📋 Array fields:');
        console.log(`  Education Entries: ${Array.isArray(p.educationEntries) ? p.educationEntries.length : 0} items`);
        console.log(`  Experience Entries: ${Array.isArray(p.experienceEntries) ? p.experienceEntries.length : 0} items`);
        console.log(`  Languages: ${Array.isArray(p.languages) ? p.languages.length : 0} items`);
        console.log(`  Certifications: ${Array.isArray(p.certificationEntries) ? p.certificationEntries.length : 0} items`);
        console.log(`  References: ${Array.isArray(p.referenceEntries) ? p.referenceEntries.length : (Array.isArray(p.references) ? p.references.length : 0)} items`);
        console.log(`  Core Skills: ${Array.isArray(p.coreSkills) ? p.coreSkills.length : 0} items`);
        console.log(`  Tools: ${Array.isArray(p.tools) ? p.tools.length : 0} items`);
        if (Array.isArray(p.referenceEntries) || Array.isArray(p.references)) {
          const refs = p.referenceEntries || p.references;
          console.log(`  📞 References Details:`, refs);
        }
        console.log('='.repeat(80) + '\n');
        
        // Calculate profile completion after data is loaded
        const completion = calculateProfileCompletion();
        setProfileCompletionPercentage(completion);
        console.log(`📊 Profile Completion: ${completion}%`);
        
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Error loading profile:', error);
        console.error('Error details:', error.response?.data || error.message);
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false; // Cleanup function
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving entire profile...');
      
      const payload = {
        // Basic Information - Map all possible field names
        firstName: profileForm.firstName || '',
        middleName: profileForm.middleName || '',
        lastName: profileForm.lastName || '',
        fullName: `${profileForm.firstName || ''} ${profileForm.middleName || ''} ${profileForm.lastName || ''}`.trim(),
        email: profileForm.email || '',
        phone: profileForm.phone || profileForm.phoneNumber || '',
        phoneNumber: profileForm.phone || profileForm.phoneNumber || '',
        altPhone: profileForm.altPhone || '',
        
        // Personal Details
        dateOfBirth: profileForm.dateOfBirth || '',
        gender: profileForm.gender || '',
        bloodGroup: profileForm.bloodGroup || '',
        community: profileForm.community || '',
        
        // Location & Address
        nationality: profileForm.nationality || '',
        residentCountry: profileForm.residentCountry || '',
        currentCity: profileForm.currentCity || '',
        postalCode: profileForm.postalCode || '',
        address: profileForm.address || '',
        latitude: profileForm.latitude || '',
        longitude: profileForm.longitude || '',
        workPermit: profileForm.workPermit || '',
        
        // Preferred Working Locations
        preferredLocation1: profileForm.preferredLocation1 || '',
        preferredLocation2: profileForm.preferredLocation2 || '',
        preferredLocation3: profileForm.preferredLocation3 || '',
        willingToRelocate: profileForm.willingToRelocate || '',
        workLocation: profileForm.workLocation || '',
        
        // Professional Profile
        professionalTitle: profileForm.professionalTitle || '',
        professionalSummary: profileForm.professionalSummary || profileForm.summary || '',
        summary: profileForm.professionalSummary || profileForm.summary || '',
        yearsExperience: profileForm.yearsExperience || profileForm.yearsOfExperience || '',
        yearsOfExperience: profileForm.yearsExperience || profileForm.yearsOfExperience || '',
        careerLevel: profileForm.careerLevel || '',
        industry: profileForm.industry || '',
        
        // Job Preferences
        preferredJobTitles: profileForm.preferredJobTitles || '',
        jobType: profileForm.jobType || profileForm.jobTypePreference || '',
        jobTypePreference: profileForm.jobType || profileForm.jobTypePreference || '',
        noticePeriod: profileForm.noticePeriod || '',
        currentSalary: profileForm.currentSalary || '',
        expectedSalary: profileForm.expectedSalary || '',
        currencyPreference: profileForm.currencyPreference || '',
        travelAvailability: profileForm.travelAvailability || '',
        availability: profileForm.availability || '',
        
        // Professional Memberships
        membershipOrg: profileForm.membershipOrg || '',
        membershipType: profileForm.membershipType || '',
        membershipDate: profileForm.membershipDate || '',
        
        // Additional Information
        careerObjectives: profileForm.careerObjectives || '',
        hobbies: profileForm.hobbies || '',
        additionalComments: profileForm.additionalComments || '',
        agreeTerms: profileForm.agreeTerms || false,
        allowContact: profileForm.allowContact || false,
        
        // Skills & Tools - Convert to arrays
        skills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        coreSkills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        softwareTools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        
        // Array Fields - Use both naming conventions for compatibility
        education: education,
        educationEntries: education,
        experience: experience,
        experienceEntries: experience,
        workExperience: experience,
        languages: languages,
        languageProficiency: languages,
        certifications: certifications,
        certificationEntries: certifications,
        references: references,
        referenceEntries: references,
        professionalLinks: professionalLinks,
        
        // Profile completion status
        profileCompleted: true,
        hasCompletedProfile: true
      };
      
      // Ensure array fields are properly included
      const finalPayload = ensureArrayFieldsSaved(payload);
      
      console.log('📤 Sending profile payload:', finalPayload);
      console.log('🩸 Blood Group in payload:', payload.bloodGroup);
      console.log('👤 Demographics fields in payload:', {
        bloodGroup: payload.bloodGroup,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        community: payload.community,
        nationality: payload.nationality,
        currentCity: payload.currentCity
      });
      console.log('📋 Array fields in payload:', {
        education: payload.education?.length || 0,
        experience: payload.experience?.length || 0,
        languages: payload.languages?.length || 0,
        certifications: payload.certifications?.length || 0,
        references: payload.references?.length || 0,
        skills: payload.skills?.length || 0,
        tools: payload.tools?.length || 0
      });
      console.log('🔗 Professional links in payload:', finalPayload.professionalLinks);
      
      // No validation - allow saving with any fields filled or empty
      console.log('💾 Saving profile without validation checks...');
      
      const response = await axios.put(buildApiUrl('/api/profile/profile'), finalPayload, { 
        headers: { 
          ...authHeaders(), 
          'Content-Type': 'application/json' 
        } 
      });
      
      console.log('✅ Profile saved successfully:', response.data);
      
      setEditMode(false);
      
      // Update cache with the saved data instead of clearing it
      const updatedCache = {
        ...JSON.parse(sessionStorage.getItem('myProfileData') || '{}'),
        ...finalPayload
      };
      sessionStorage.setItem('myProfileData', JSON.stringify(updatedCache));
      sessionStorage.setItem('myProfileTimestamp', Date.now().toString());
      
      alert('Profile saved successfully!');
      
      // Refresh data to ensure persistence
      setTimeout(() => {
        refreshDataAfterEdit();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Error saving profile: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Full screen styling with proper viewport handling
  const containerStyle = { 
    padding: '30px 30px 60px 30px', 
    maxWidth: '100%', 
    width: '100%', 
    margin: '0',
    minHeight: '100vh',
    boxSizing: 'border-box'
  };
  const elevatedCardStyle = { 
    border: '1px solid #edf2f7', 
    borderRadius: '16px', 
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.06)', 
    background: '#fff', 
    marginBottom: '20px',
    width: '100%',
    maxWidth: '100%'
  };
  const profileHeaderStyle = { 
    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
    color: '#fff', 
    padding: '40px', 
    borderRadius: '16px', 
    marginBottom: '20px', 
    minHeight: '220px', 
    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%'
  };

  const headerPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cdefs%3E%3Cpattern id=\'grain\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\' fill=\'white\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23grain)\'/%3E%3C/svg%3E")',
    opacity: 0.3,
    zIndex: 1
  };
  const profileAvatarStyle = { 
    width: '120px', 
    height: '120px', 
    borderRadius: '50%', 
    background: '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '48px', 
    fontWeight: 700, 
    color: '#f97316', 
    marginBottom: '20px', 
    border: '5px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
  };
  const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '20px', 
    marginBottom: '20px',
    width: '100%'
  };
  const formInputBase = { 
    width: '100%', 
    padding: '10px 15px', 
    border: '2px solid #e0e0e0', 
    borderRadius: '8px', 
    fontSize: '14px', 
    transition: 'all 0.3s',
    boxSizing: 'border-box'
  };
  const viewModeField = editMode ? {} : { background: '#f7f9fc', borderColor: '#e6eaf1', color: '#333' };
  const pillTagStyle = { 
    display: 'inline-block', 
    background: '#f8fafc', 
    color: '#1e293b', 
    padding: '8px 14px', 
    borderRadius: '999px', 
    margin: '5px', 
    fontSize: '14px', 
    border: '2px solid #e2e8f0',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ 
        padding: '30px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            height: '40px', 
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s ease-in-out infinite',
            borderRadius: '8px',
            marginBottom: '20px',
            width: '60%'
          }} />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ 
                height: '20px', 
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite',
                borderRadius: '4px',
                marginBottom: '10px',
                width: '40%'
              }} />
              <div style={{ 
                height: '40px', 
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite',
                borderRadius: '4px',
                marginBottom: '10px'
              }} />
            </div>
          ))}
        </div>
        <style>{`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .sidebar-container, .sidebar-container * {
          color: #ffffff !important;
        }
        .sidebar-container button, .sidebar-container button * {
          color: #ffffff !important;
        }
        .sidebar-container span, .sidebar-container span * {
          color: #ffffff !important;
        }
        .sidebar-container p, .sidebar-container p * {
          color: #ffffff !important;
        }
        .sidebar-container h1, .sidebar-container h2, .sidebar-container h3, .sidebar-container h4, .sidebar-container h5, .sidebar-container h6 {
          color: #ffffff !important;
        }
        .sidebar-container div, .sidebar-container div * {
          color: #ffffff !important;
        }
        .sidebar-container emoji, .sidebar-container emoji * {
          color: #ffffff !important;
        }
        .profile-header h2, .profile-header p, .profile-header span {
          color: #ffffff !important;
        }
        
        /* Fix for Cancel button visibility - More specific selectors */
        button.cancel-btn-fixed,
        .cancel-btn-fixed,
        button.btn-secondary.cancel-btn-fixed {
          background: #dc3545 !important;
          color: #ffffff !important;
          border: 2px solid #dc3545 !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: inline-block !important;
        }
        
        button.cancel-btn-fixed:hover,
        .cancel-btn-fixed:hover,
        button.btn-secondary.cancel-btn-fixed:hover {
          background: #c82333 !important;
          border-color: #c82333 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3) !important;
        }
        
        /* Override any conflicting styles */
        .my-profile-page button.cancel-btn-fixed,
        .my-profile-page .cancel-btn-fixed {
          background: #dc3545 !important;
          color: #ffffff !important;
          border: 2px solid #dc3545 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* Orange-Teal theme for Edit buttons */
        .my-profile-page button.edit-btn,
        .my-profile-page .edit-btn {
          background: linear-gradient(135deg, #f97316 0%, #0d9488 100%) !important;
          color: #ffffff !important;
          border: 2px solid #f97316 !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3) !important;
        }
        
        .my-profile-page button.edit-btn:hover,
        .my-profile-page .edit-btn:hover {
          background: linear-gradient(135deg, #ea580c 0%, #0f766e 100%) !important;
          border-color: #ea580c !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4) !important;
        }
      `}</style>
      <div className="my-profile-page" style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#f8fafc'
      }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'linear-gradient(180deg, #f97316 0%, #0d9488 100%)',
        background: 'linear-gradient(180deg, #f97316 0%, #0d9488 100%)',
        padding: '2rem 1.5rem',
        boxShadow: '4px 0 20px rgba(249, 115, 22, 0.15)',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        color: '#ffffff'
      }} className="sidebar-container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#ffffff !important', 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            marginBottom: '0.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.5px'
          }}>
            <span style={{ color: '#ffffff !important' }}>My Profile</span>
          </h2>
          <p style={{ 
            color: '#ffffff !important', 
            fontSize: '0.9rem',
            margin: 0,
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}>
            <span style={{ color: '#ffffff !important' }}>Manage your professional information</span>
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff !important', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            <span style={{ color: '#ffffff !important' }}>Quick Actions</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>📋 Personal Information</span>
            </button>
            <button 
              onClick={() => {
                const element = document.querySelector('[data-section="professional"]');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>💼 Professional Details</span>
            </button>
            <button 
              onClick={() => {
                const element = document.querySelector('[data-section="skills"]');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>🛠️ Skills & Expertise</span>
            </button>
            <button 
              onClick={() => {
                const element = document.querySelector('[data-section="demographics"]');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>👤 Demographics</span>
            </button>
            <button 
              onClick={() => {
                const element = document.querySelector('[data-section="residency"]');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>🌍 Residency</span>
            </button>
            <button 
              onClick={() => {
                const element = document.querySelector('[data-section="locations"]');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#ffffff !important',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)';
                e.target.style.transform = 'translateX(4px)';
                e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.3)';
                e.target.style.transform = 'translateX(0)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span style={{ color: '#ffffff !important' }}>📍 Work Locations</span>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff !important', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            <span style={{ color: '#ffffff !important' }}>Profile Stats</span>
          </h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ffffff !important', fontSize: '0.9rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>Completion</span>
              <span style={{ color: '#ffffff !important', fontWeight: '800', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>{profileCompletionPercentage}%</span>
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              height: '8px', 
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ 
                background: 'linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)', 
                height: '100%', 
                width: `${profileCompletionPercentage}%`,
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ 
            color: '#ffffff !important', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            <span style={{ color: '#ffffff !important' }}>Tips</span>
          </h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
          }}>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.85rem', 
              margin: 0,
              lineHeight: '1.4',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.7)'
            }}>
              <span style={{ color: '#ffffff !important', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>💡 Keep your profile updated to get better job matches</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ 
        marginLeft: '280px', 
        width: 'calc(100% - 280px)', 
        maxWidth: 'calc(100% - 280px)', 
        overflowX: 'hidden',
        overflowY: 'auto', 
        minHeight: '100vh', 
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc'
      }}>
      <div style={containerStyle}>
        <div style={profileHeaderStyle} className="profile-header">
          <div style={headerPatternStyle}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 2 }}>
            <div style={profileAvatarStyle}>{(profileForm.firstName?.[0] || 'U')}{(profileForm.lastName?.[0] || '')}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                marginBottom: '10px', 
                fontSize: '32px', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                color: '#ffffff !important'
              }}><span style={{ color: '#ffffff !important' }}>{profileForm.firstName} {profileForm.lastName}</span></h2>
              <p style={{ 
                fontSize: '20px', 
                marginBottom: '10px', 
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#ffffff !important'
              }}><span style={{ color: '#ffffff !important' }}>{profileForm.professionalTitle || '—'}</span></p>
              <p style={{ 
                fontSize: '16px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#ffffff !important'
              }}><FontAwesomeIcon icon={faMapMarkerAlt} /> <span style={{ color: '#ffffff !important' }}>{profileForm.location || '—'}</span></p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editMode && (
                  <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit Profile
                  </button>
                )}
                {editMode && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={saveProfile} disabled={saving}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="cancel-btn-fixed" 
                      onClick={() => setEditMode(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
                <button className="btn btn-complete btn-sm" onClick={saveProfile} disabled={saving}>
                  <FontAwesomeIcon icon={faCheckCircle} /> {saving ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
              <button 
                onClick={() => navigate('/jobseeker-dashboard')}
                style={{
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  transition: 'all 0.3s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ea580c';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f97316';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="personal">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.personal ? (
                <button 
                  onClick={() => toggleSectionEdit('personal')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => saveSection('personal')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => toggleSectionEdit('personal')}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Row 1: First Name, Middle Name, Last Name */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">First Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.firstName || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))} 
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.middleName || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, middleName: e.target.value }))} 
                placeholder="Enter your middle name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.lastName || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))} 
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Row 2: Date of Birth, Gender, Blood Group */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Date of Birth <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="date" 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.dateOfBirth || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.gender || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.bloodGroup || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, bloodGroup: e.target.value }))}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email, Phone, Alt Phone */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
          <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="email" 
                style={{ ...formInputBase, ...viewModeField, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} 
                value={profileForm.email || ''} 
                disabled
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="tel" 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.phone || profileForm.phoneNumber || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value, phoneNumber: e.target.value }))} 
                placeholder="+254 700 000 000"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternative Phone</label>
              <input 
                type="tel" 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.altPhone || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, altPhone: e.target.value }))} 
                placeholder="+1 234 567 8900"
              />
          </div>
        </div>

          {/* Row 4: Community (full width) */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Community</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.community || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, community: e.target.value }))} 
                placeholder="Enter your community"
              />
            </div>
          </div>
        </div>

        {/* Nationality & Residency Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="residency">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faMapMarkerAlt} /> Nationality & Residency</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.residency ? (
                <button 
                  onClick={() => toggleSectionEdit('residency')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => saveSection('residency')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => toggleSectionEdit('residency')}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Row 1: Nationality, Resident Country */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Nationality <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.nationality || ''} 
                disabled={!editingSections.residency} 
                onChange={(e) => setProfileForm(p => ({ ...p, nationality: e.target.value }))}
                placeholder="Select your nationality"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Resident Country <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.residentCountry || ''} 
                disabled={!editingSections.residency} 
                onChange={(e) => setProfileForm(p => ({ ...p, residentCountry: e.target.value }))}
                placeholder="Select your current country of residence"
                required
              />
            </div>
          </div>

          {/* Row 2: Current City, Postal Code */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Current City <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.currentCity || ''} 
                disabled={!editingSections.residency} 
                onChange={(e) => setProfileForm(p => ({ ...p, currentCity: e.target.value }))}
                placeholder="e.g., Nairobi"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal/ZIP Code</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.postalCode || ''} 
                disabled={!editingSections.residency} 
                onChange={(e) => setProfileForm(p => ({ ...p, postalCode: e.target.value }))}
                placeholder="Enter postal code"
              />
            </div>
          </div>

          {/* Row 3: Full Address */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.address || ''} 
                disabled={!editingSections.residency} 
                onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Street address, building, apartment number"
              />
          </div>
        </div>

          {/* Row 4: Coordinates (hidden but displayed) */}
          {(profileForm.latitude || profileForm.longitude) && (
            <div style={{ marginBottom: '15px', padding: '10px', background: '#f9fafb', borderRadius: '6px', fontSize: '13px', color: '#666' }}>
              <strong>Location Coordinates:</strong> 
              <span style={{ marginLeft: '8px' }}>
                {profileForm.latitude && profileForm.longitude 
                  ? `Lat: ${profileForm.latitude}, Lng: ${profileForm.longitude}`
                  : 'Not set'}
              </span>
            </div>
          )}

          {/* Row 5: Work Permit */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Do you have a valid work permit for your resident country? <span style={{ color: '#dc2626' }}>*</span></label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="workPermit" 
                    value="yes" 
                    checked={profileForm.workPermit === 'yes'}
                    disabled={!editingSections.residency}
                    onChange={(e) => setProfileForm(p => ({ ...p, workPermit: e.target.value }))}
                    style={{ cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}
                  />
                  <span>Yes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="workPermit" 
                    value="no" 
                    checked={profileForm.workPermit === 'no'}
                    disabled={!editingSections.residency}
                    onChange={(e) => setProfileForm(p => ({ ...p, workPermit: e.target.value }))}
                    style={{ cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}
                  />
                  <span>No</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="workPermit" 
                    value="citizen" 
                    checked={profileForm.workPermit === 'citizen'}
                    disabled={!editingSections.residency}
                    onChange={(e) => setProfileForm(p => ({ ...p, workPermit: e.target.value }))}
                    style={{ cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}
                  />
                  <span>Citizen</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="workPermit" 
                    value="not_required" 
                    checked={profileForm.workPermit === 'not_required'}
                    disabled={!editingSections.residency}
                    onChange={(e) => setProfileForm(p => ({ ...p, workPermit: e.target.value }))}
                    style={{ cursor: editingSections.residency ? 'pointer' : 'not-allowed' }}
                  />
                  <span>Not Required</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Working Locations Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="locations">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faMapMarkerAlt} /> Preferred Working Locations</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.locations ? (
                <button 
                  onClick={() => toggleSectionEdit('locations')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => saveSection('locations')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => toggleSectionEdit('locations')}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Badge */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Select up to 3 countries where you'd prefer to work <span style={{ color: '#dc2626' }}>*</span></label>
            <div style={{ padding: '12px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '6px', fontSize: '13px', color: '#0369a1', marginTop: '8px' }}>
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '6px' }} />
              This helps match you with opportunities in your preferred locations
            </div>
          </div>

          {/* Row 1: Preferred Locations 1, 2, 3 */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Preferred Location 1 <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.preferredLocation1 || ''} 
                disabled={!editingSections.locations} 
                onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation1: e.target.value }))} 
                placeholder="Select country"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Location 2</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.preferredLocation2 || ''} 
                disabled={!editingSections.locations} 
                onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation2: e.target.value }))} 
                placeholder="Select country"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Location 3</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.preferredLocation3 || ''} 
                disabled={!editingSections.locations} 
                onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation3: e.target.value }))} 
                placeholder="Select country"
              />
            </div>
          </div>

          {/* Row 2: Willing to Relocate (Radio buttons) */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Willing to Relocate Internationally? <span style={{ color: '#dc2626' }}>*</span></label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="willingToRelocate" 
                    value="yes" 
                    checked={profileForm.willingToRelocate === 'yes'}
                    disabled={!editingSections.locations}
                    onChange={(e) => setProfileForm(p => ({ ...p, willingToRelocate: e.target.value }))}
                    style={{ cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}
                  />
                  <span>Yes, immediately</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="willingToRelocate" 
                    value="conditional" 
                    checked={profileForm.willingToRelocate === 'conditional'}
                    disabled={!editingSections.locations}
                    onChange={(e) => setProfileForm(p => ({ ...p, willingToRelocate: e.target.value }))}
                    style={{ cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}
                  />
                  <span>Yes, with conditions</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="radio" 
                    name="willingToRelocate" 
                    value="no" 
                    checked={profileForm.willingToRelocate === 'no'}
                    disabled={!editingSections.locations}
                    onChange={(e) => setProfileForm(p => ({ ...p, willingToRelocate: e.target.value }))}
                    style={{ cursor: editingSections.locations ? 'pointer' : 'not-allowed' }}
                  />
                  <span>No</span>
                </label>
            </div>
            </div>
          </div>

          {/* Row 3: Work Location Preference */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Work Location Preference <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.workLocation || ''} 
                disabled={!editingSections.locations} 
                onChange={(e) => setProfileForm(p => ({ ...p, workLocation: e.target.value }))}
                required
              >
                <option value="">Select preference</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="flexible">Flexible/Open to all</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Profile Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="professional">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Professional Profile</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.professional ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => toggleSectionEdit('professional')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => saveSection('professional')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => toggleSectionEdit('professional')}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Row 1: Professional Title (full width) */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Professional Title/Headline <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.professionalTitle || ''} 
                disabled={!editingSections.professional} 
                onChange={(e) => setProfileForm(p => ({ ...p, professionalTitle: e.target.value }))} 
                placeholder="e.g., Senior Software Engineer | Full Stack Developer"
                required
              />
            </div>
          </div>

          {/* Row 2: Years of Experience, Career Level */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Total Years of Experience <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.yearsExperience || profileForm.yearsOfExperience || ''} 
                disabled={!editingSections.professional} 
                onChange={(e) => setProfileForm(p => ({ ...p, yearsExperience: e.target.value, yearsOfExperience: e.target.value }))}
                required
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
            <div className="form-group">
              <label className="form-label">Career Level <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.careerLevel || ''} 
                disabled={!editingSections.professional} 
                onChange={(e) => setProfileForm(p => ({ ...p, careerLevel: e.target.value }))}
                required
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

          {/* Row 3: Industry (full width) */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Industry/Sector <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.industry || ''} 
                disabled={!editingSections.professional} 
                onChange={(e) => setProfileForm(p => ({ ...p, industry: e.target.value }))}
                required
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
          </div>

          {/* Row 4: Professional Summary (full width) */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Professional Summary <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea 
                style={{ 
                  ...formInputBase, 
                  minHeight: '120px', 
                  maxHeight: '300px',
                  resize: 'vertical', 
                  ...viewModeField,
                  width: '100%',
                  boxSizing: 'border-box'
                }} 
                value={profileForm.professionalSummary || profileForm.summary || ''} 
                disabled={!editingSections.professional} 
                onChange={(e) => setProfileForm(p => ({ ...p, professionalSummary: e.target.value, summary: e.target.value }))} 
                placeholder="Write a compelling summary about your professional background, key achievements, and career goals. Highlight what makes you unique and valuable to potential employers globally. (Minimum 150 characters)"
                required
              />
            </div>
          </div>
        </div>

        {/* Job Preferences & Availability Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="jobPreferences">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Job Preferences & Availability</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.jobPreferences ? (
                <button 
                  onClick={() => toggleSectionEdit('jobPreferences')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => saveSection('jobPreferences')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => toggleSectionEdit('jobPreferences')}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Preferred Job Titles (Full width) */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Preferred Job Titles</label>
            <input 
              type="text" 
              style={{ ...formInputBase, ...viewModeField }} 
              value={profileForm.preferredJobTitles || ''} 
              disabled={!editingSections.jobPreferences} 
              onChange={(e) => setProfileForm(p => ({ ...p, preferredJobTitles: e.target.value }))}
              placeholder="e.g., Software Engineer, Full Stack Developer, Backend Engineer"
            />
            <small style={{ color: '#666', fontSize: '13px', marginTop: '5px', display: 'block' }}>
              Enter job titles you're interested in, separated by commas
            </small>
              </div>

          {/* Row 1: Job Type, Notice Period */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Desired Job Type <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.jobType || profileForm.jobTypePreference || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, jobType: e.target.value, jobTypePreference: e.target.value }))}
                required
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
            <div className="form-group">
              <label className="form-label">Notice Period <span style={{ color: '#dc2626' }}>*</span></label>
              <select 
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.noticePeriod || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, noticePeriod: e.target.value }))}
                required
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

          {/* Row 2: Current Salary, Expected Salary */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Current Salary (Optional)</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.currentSalary || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, currentSalary: e.target.value }))}
                placeholder="e.g., USD 50,000 per year"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Salary</label>
              <input 
                type="text"
                style={{ ...formInputBase, ...viewModeField }} 
                value={profileForm.expectedSalary || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, expectedSalary: e.target.value }))}
                placeholder="e.g., USD 60,000 - 70,000 per year"
              />
            </div>
          </div>

          {/* Row 3: Currency Preference */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Currency Preference</label>
              <select 
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.currencyPreference || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, currencyPreference: e.target.value }))}
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
          </div>

          {/* Row 4: Travel Availability */}
          <div style={{ marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Travel Availability</label>
              <select 
                style={{ ...formInputBase, ...viewModeField, width: '100%' }} 
                value={profileForm.travelAvailability || ''} 
                disabled={!editingSections.jobPreferences} 
                onChange={(e) => setProfileForm(p => ({ ...p, travelAvailability: e.target.value }))}
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
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="memberships">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Professional Memberships & Associations</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.memberships ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => toggleSectionEdit('memberships')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => saveSection('memberships')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => toggleSectionEdit('memberships')}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div style={gridStyle}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.membershipOrg || ''} disabled={!editingSections.memberships} onChange={(e) => setProfileForm(p => ({ ...p, membershipOrg: e.target.value }))} placeholder="e.g., IEEE, ACM, PMI" />
            </div>
            <div className="form-group">
              <label className="form-label">Membership Type</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.membershipType || ''} disabled={!editingSections.memberships} onChange={(e) => setProfileForm(p => ({ ...p, membershipType: e.target.value }))} placeholder="e.g., Student, Professional, Fellow" />
            </div>
            <div className="form-group">
              <label className="form-label">Membership Since</label>
              <input type="date" style={{ ...formInputBase, ...viewModeField }} value={profileForm.membershipDate || ''} disabled={!editingSections.memberships} onChange={(e) => setProfileForm(p => ({ ...p, membershipDate: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="additional">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Additional Information</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.additional ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => toggleSectionEdit('additional')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => saveSection('additional')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => toggleSectionEdit('additional')}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Career Objectives</label>
            <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '80px' }} value={profileForm.careerObjectives || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, careerObjectives: e.target.value }))} placeholder="What are your short-term and long-term career goals? What do you hope to achieve in your next role?" />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">Hobbies & Interests</label>
            <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '80px' }} value={profileForm.hobbies || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, hobbies: e.target.value }))} placeholder="Tell us about your interests and hobbies" />
          </div>
          <div className="form-group">
            <label className="form-label">Additional Comments</label>
            <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '100px' }} value={profileForm.additionalComments || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, additionalComments: e.target.value }))} placeholder="Any additional information you'd like to share" />
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="skills">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCode} /> Skills & Competencies</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.skills ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => toggleSectionEdit('skills')}
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Skills
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => saveSection('skills')} 
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => toggleSectionEdit('skills')}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px', color: '#666' }}>Technical Skills</h4>
            {editingSections.skills ? (
              <div className="skills-dropdown-container" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Add skills... (Type and press Enter)"
                    value={skillInputValue}
                    onChange={(e) => setSkillInputValue(e.target.value)}
                    onFocus={() => setSkillsDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && skillInputValue.trim()) {
                        e.preventDefault();
                        addSkill(skillInputValue);
                      }
                    }}
                    style={{
                      ...formInputBase,
                      width: '100%',
                      padding: '10px 15px',
                      border: '2px solid #f97316',
                      borderRadius: '8px'
                    }}
                  />
                  {skillsDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '2px solid #f97316',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {commonSkills
                        .filter(skill => skill.toLowerCase().includes(skillInputValue.toLowerCase()))
                        .map((skill, index) => (
                          <div
                            key={index}
                            onClick={() => addSkill(skill)}
                            style={{
                              padding: '10px 15px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0',
                              fontSize: '14px',
                              color: '#333'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            {skill}
                          </div>
                        ))}
                      {skillInputValue.trim() && !commonSkills.some(s => s.toLowerCase() === skillInputValue.toLowerCase()) && (
                        <div
                          onClick={() => addSkill(skillInputValue)}
                          style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            borderTop: '2px solid #f97316',
                            fontSize: '14px',
                            color: '#f97316',
                            fontWeight: '600',
                            background: '#fff7ed'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#ffedd5'}
                          onMouseLeave={(e) => e.target.style.background = '#fff7ed'}
                        >
                          + Add "{skillInputValue}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                  {(profileForm.skills || '').split(',').filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      ...pillTagStyle,
                      background: '#fef3c7',
                      color: '#92400e',
                      border: '2px solid #f59e0b',
                      fontWeight: '700',
                      position: 'relative',
                      paddingRight: '25px'
                    }}>
                      {s.trim()}
                      <button
                        onClick={() => removeSkill(s.trim())}
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#dc2626',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
            <div>
              {(profileForm.skills || '').split(',').filter(Boolean).map((s, i) => (
                  <span key={i} style={{
                    ...pillTagStyle,
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '2px solid #f59e0b',
                    fontWeight: '700'
                  }}>{s.trim()}</span>
                ))}
                {(!profileForm.skills || profileForm.skills.split(',').filter(Boolean).length === 0) && (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No skills added yet</p>
                )}
            </div>
            )}
          </div>
          <div style={{ marginTop: '25px' }}>
            <h4 style={{ marginBottom: '15px', color: '#666' }}>Tools</h4>
            {editingSections.skills ? (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  {(profileForm.tools || '').split(',').filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      ...pillTagStyle,
                      background: '#d1fae5',
                      color: '#065f46',
                      border: '2px solid #10b981',
                      fontWeight: '700',
                      position: 'relative',
                      paddingRight: '25px'
                    }}>
                      {s.trim()}
                      <button
                        onClick={() => {
                          const currentTools = profileForm.tools ? profileForm.tools.split(',').map(t => t.trim()).filter(Boolean) : [];
                          setProfileForm(prev => ({
                            ...prev,
                            tools: currentTools.filter(tool => tool !== s.trim()).join(', ')
                          }));
                        }}
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#dc2626',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Add tool (e.g., Microsoft Excel, AutoCAD)..."
                    style={{
                      ...formInputBase,
                      flex: 1,
                      border: '2px solid #10b981',
                      borderRadius: '8px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const tool = e.target.value.trim();
                        if (tool) {
                          const currentTools = profileForm.tools ? profileForm.tools.split(',').map(t => t.trim()).filter(Boolean) : [];
                          if (!currentTools.includes(tool)) {
                            setProfileForm(prev => ({
                              ...prev,
                              tools: [...currentTools, tool].join(', ')
                            }));
                            e.target.value = '';
                          }
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      const tool = input.value.trim();
                      if (tool) {
                        const currentTools = profileForm.tools ? profileForm.tools.split(',').map(t => t.trim()).filter(Boolean) : [];
                        if (!currentTools.includes(tool)) {
                          setProfileForm(prev => ({
                            ...prev,
                            tools: [...currentTools, tool].join(', ')
                          }));
                          input.value = '';
                        }
                      }
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Add Tool
                  </button>
                </div>
              </div>
            ) : (
            <div>
              {(profileForm.tools || '').split(',').filter(Boolean).map((s, i) => (
                <span key={i} style={{
                  ...pillTagStyle,
                  background: '#d1fae5',
                  color: '#065f46',
                  border: '2px solid #10b981',
                  fontWeight: '700'
                }}>{s.trim()}</span>
              ))}
              {(!profileForm.tools || profileForm.tools.split(',').filter(Boolean).length === 0) && (
                <p style={{ color: '#999', fontStyle: 'italic' }}>No tools added yet</p>
              )}
            </div>
            )}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Professional References</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.references ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, references: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('references');
                      setEditingSections(prev => ({ ...prev, references: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed"
                    onClick={() => setEditingSections(prev => ({ ...prev, references: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {(references || []).map((rf, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px', position: 'relative' }}>
              {editingSections.references && (
                <button
                  onClick={() => {
                    setReferences(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              )}
              {editingSections.references ? (
                <div style={{ display: 'grid', gap: '15px', paddingRight: '40px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Reference Name</label>
                      <input
                        type="text"
                        value={rf.referenceName || rf.name || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referenceName: e.target.value, name: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Job Title</label>
                      <input
                        type="text"
                        value={rf.referenceJobTitle || rf.jobTitle || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referenceJobTitle: e.target.value, jobTitle: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="Position"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Company/Organization</label>
                      <input
                        type="text"
                        value={rf.referenceCompany || rf.company || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referenceCompany: e.target.value, company: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Relationship</label>
                      <input
                        type="text"
                        value={rf.referenceRelationship || rf.relation || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referenceRelationship: e.target.value, relation: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="e.g., Former Manager, Colleague"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
                      <input
                        type="email"
                        value={rf.referenceEmail || rf.contact || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referenceEmail: e.target.value, contact: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone</label>
                      <input
                        type="tel"
                        value={rf.referencePhone || ''}
                        onChange={(e) => {
                          const newRef = [...references];
                          newRef[idx] = { ...newRef[idx], referencePhone: e.target.value };
                          setReferences(newRef);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div>
                    <strong style={{ color: '#333', fontSize: '15px' }}>{rf.referenceName || rf.name || 'Name'}</strong>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{rf.referenceJobTitle || rf.jobTitle || 'Job Title'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px' }}>{rf.referenceCompany || rf.company || 'Company'}</p>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{rf.referenceRelationship || rf.relation || 'Relationship'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#3b82f6', fontSize: '14px' }}>{rf.referenceEmail || rf.contact || 'Email'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px' }}>{rf.referencePhone || 'Phone'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(references || []).length === 0 && <div style={{ color: '#999' }}>No references added</div>}
          {editingSections.references && (
            <button
              onClick={() => {
                setReferences(prev => [
                  ...prev,
                  {
                    referenceName: '',
                    referenceJobTitle: '',
                    referenceCompany: '',
                    referenceRelationship: '',
                    referenceEmail: '',
                    referencePhone: ''
                  }
                ]);
              }}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '15px'
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Reference
            </button>
          )}
        </div>

        {/* Work Experience Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Work Experience</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.experience ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, experience: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('experience');
                      setEditingSections(prev => ({ ...prev, experience: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => setEditingSections(prev => ({ ...prev, experience: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Badge */}
          <div style={{ padding: '12px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '6px', fontSize: '13px', color: '#0369a1', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '6px' }} />
            List all relevant work experience starting with the most recent
          </div>

          {(experience || []).map((ex, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #3b82f6', position: 'relative' }}>
              {editingSections.experience && (
                <button
                  onClick={() => {
                    setExperience(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              )}
              {editingSections.experience ? (
                <div style={{ display: 'grid', gap: '15px', paddingRight: '40px' }}>
                  {/* Job Title */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Job Title <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                      type="text"
                      value={ex.jobTitle || ex.title || ex.role || ''}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[idx] = { ...newExp[idx], jobTitle: e.target.value, title: e.target.value, role: e.target.value };
                        setExperience(newExp);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., Senior Marketing Manager"
                      required
                    />
                  </div>

                  {/* Company Name, Company Location */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Company Name <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                      type="text"
                      value={ex.company || ''}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[idx] = { ...newExp[idx], company: e.target.value };
                        setExperience(newExp);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., ABC Corporation"
                        required
                    />
                  </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Company Location</label>
                      <input
                        type="text"
                        value={ex.companyLocation || ex.location || ''}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], companyLocation: e.target.value, location: e.target.value };
                          setExperience(newExp);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Employment Type, Industry */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Employment Type</label>
                      <select
                        value={ex.employmentType || 'full-time'}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], employmentType: e.target.value };
                          setExperience(newExp);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Industry</label>
                      <input
                        type="text"
                        value={ex.jobIndustry || ex.industry || ''}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], jobIndustry: e.target.value, industry: e.target.value };
                          setExperience(newExp);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="e.g., Technology, Finance"
                      />
                    </div>
                  </div>

                  {/* Start Date, End Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Start Date <span style={{ color: '#dc2626' }}>*</span></label>
                      <input
                        type="month"
                        value={ex.startDate || ''}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], startDate: e.target.value };
                          setExperience(newExp);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>End Date</label>
                      <input
                        type="month"
                        value={ex.endDate || ''}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], endDate: e.target.value };
                          setExperience(newExp);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        disabled={ex.currentJob}
                      />
                    </div>
                  </div>

                  {/* Current Job Checkbox */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={ex.currentJob || false}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[idx] = { ...newExp[idx], currentJob: e.target.checked, endDate: e.target.checked ? '' : newExp[idx].endDate };
                          setExperience(newExp);
                        }}
                      />
                      <span>I currently work here</span>
                    </label>
                  </div>

                  {/* Key Responsibilities & Achievements */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Key Responsibilities & Achievements</label>
                    <textarea
                      value={ex.jobDescription || ex.description || ''}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[idx] = { ...newExp[idx], jobDescription: e.target.value, description: e.target.value };
                        setExperience(newExp);
                      }}
                      style={{ ...formInputBase, width: '100%', minHeight: '100px' }}
                      placeholder="• Led team of 10 marketing professionals&#10;• Increased revenue by 45% through strategic campaigns&#10;• Managed $500K annual budget"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h4>{ex.jobTitle || ex.title || ex.role || 'Role'}</h4>
                  <div style={{ color: '#3b82f6', fontWeight: 600, marginBottom: '5px' }}>{ex.company || 'Company'}</div>
                  <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ex.startDate || '') + (ex.endDate ? ` - ${ex.endDate}` : (ex.currentJob ? ' - Present' : ''))}</div>
                  <p style={{ color: '#666', marginTop: '10px' }}>{ex.jobDescription || ex.description || ''}</p>
                </>
              )}
            </div>
          ))}
          {(experience || []).length === 0 && <div style={{ color: '#999' }}>No experience added</div>}
          {editingSections.experience && (
            <button
              onClick={() => {
                setExperience(prev => [
                  ...prev,
                  {
                    jobTitle: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    currentJob: false,
                    jobDescription: ''
                  }
                ]);
              }}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              + Add Experience
            </button>
          )}
        </div>

        {/* Education Section */}
        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.education ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, education: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('education');
                      setEditingSections(prev => ({ ...prev, education: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => setEditingSections(prev => ({ ...prev, education: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {(education || []).map((ed, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #3b82f6', position: 'relative' }}>
              {editingSections.education && (
                <button
                  onClick={() => {
                    setEducation(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              )}
              {editingSections.education ? (
                <div style={{ display: 'grid', gap: '15px', paddingRight: '40px' }}>
                  {/* Degree/Certificate */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Degree/Certificate <span style={{ color: '#dc2626' }}>*</span></label>
                    <select
                      value={ed.degreeType || ed.degree || ''}
                      onChange={(e) => {
                        const newEd = [...education];
                        newEd[idx] = { ...newEd[idx], degreeType: e.target.value, degree: e.target.value };
                        setEducation(newEd);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
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

                  {/* Field of Study */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Field of Study <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                      type="text"
                      value={ed.fieldOfStudy || ed.field || ''}
                      onChange={(e) => {
                        const newEd = [...education];
                        newEd[idx] = { ...newEd[idx], fieldOfStudy: e.target.value, field: e.target.value };
                        setEducation(newEd);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., Computer Science, Business Administration"
                      required
                    />
                  </div>

                  {/* Institution Name */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Institution Name <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                      type="text"
                      value={ed.institution || ed.school || ''}
                      onChange={(e) => {
                        const newEd = [...education];
                        newEd[idx] = { ...newEd[idx], institution: e.target.value, school: e.target.value };
                        setEducation(newEd);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., University of Nairobi"
                      required
                    />
                  </div>

                  {/* Institution Location, Grade */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Institution Location</label>
                      <input
                        type="text"
                        value={ed.institutionLocation || ed.location || ''}
                        onChange={(e) => {
                          const newEd = [...education];
                          newEd[idx] = { ...newEd[idx], institutionLocation: e.target.value, location: e.target.value };
                          setEducation(newEd);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Grade/GPA</label>
                      <input
                        type="text"
                        value={ed.grade || ed.gpa || ''}
                        onChange={(e) => {
                          const newEd = [...education];
                          newEd[idx] = { ...newEd[idx], grade: e.target.value, gpa: e.target.value };
                          setEducation(newEd);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="e.g., 3.8/4.0, First Class"
                      />
                    </div>
                  </div>

                  {/* Start Year, End Year */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Start Year <span style={{ color: '#dc2626' }}>*</span></label>
                      <input
                        type="number"
                        value={ed.eduStartYear || ed.startYear || ''}
                        onChange={(e) => {
                          const newEd = [...education];
                          newEd[idx] = { ...newEd[idx], eduStartYear: e.target.value, startYear: e.target.value };
                          setEducation(newEd);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="2018"
                        min="1950"
                        max="2030"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>End Year (or Expected)</label>
                      <input
                        type="number"
                        value={ed.eduEndYear || ed.endYear || ''}
                        onChange={(e) => {
                          const newEd = [...education];
                          newEd[idx] = { ...newEd[idx], eduEndYear: e.target.value, endYear: e.target.value };
                          setEducation(newEd);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="2022"
                        min="1950"
                        max="2035"
                      />
                    </div>
                  </div>

                  {/* Activities & Achievements */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Activities & Achievements</label>
                    <textarea
                      value={ed.eduActivities || ed.activities || ''}
                      onChange={(e) => {
                        const newEd = [...education];
                        newEd[idx] = { ...newEd[idx], eduActivities: e.target.value, activities: e.target.value };
                        setEducation(newEd);
                      }}
                      style={{ ...formInputBase, width: '100%', minHeight: '80px' }}
                      placeholder="Academic honors, relevant coursework, extracurricular activities"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h4>{ed.degreeType || ed.degree || 'Degree'}{ed.fieldOfStudy || ed.field ? ` in ${ed.fieldOfStudy || ed.field}` : ''}</h4>
                  <div style={{ color: '#3b82f6', fontWeight: 600, marginBottom: '5px' }}>{ed.institution || ed.school || 'Institution'}</div>
                  <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ed.eduStartYear || ed.startYear || '') + (ed.eduEndYear || ed.endYear ? ` - ${ed.eduEndYear || ed.endYear}` : '')}</div>
                </>
              )}
            </div>
          ))}
          {(education || []).length === 0 && <div style={{ color: '#999' }}>No education added</div>}
          {editingSections.education && (
            <button
              onClick={() => {
                setEducation(prev => [
                  ...prev,
                  {
                    degreeType: '',
                    fieldOfStudy: '',
                    institution: '',
                    eduStartYear: '',
                    eduEndYear: ''
                  }
                ]);
              }}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              + Add Education
            </button>
          )}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Licenses</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.certifications ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, certifications: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('certifications');
                      setEditingSections(prev => ({ ...prev, certifications: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => setEditingSections(prev => ({ ...prev, certifications: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {(certifications || []).map((ct, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px', position: 'relative' }}>
              {editingSections.certifications && (
                <button
                  onClick={() => {
                    setCertifications(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              )}
              {editingSections.certifications ? (
                <div style={{ display: 'grid', gap: '15px', paddingRight: '40px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Certification Name</label>
                    <input
                      type="text"
                      value={ct.certificationName || ct.name || ''}
                      onChange={(e) => {
                        const newCert = [...certifications];
                        newCert[idx] = { ...newCert[idx], certificationName: e.target.value, name: e.target.value };
                        // Auto-verify if all fields are filled (optional)
                        const updatedCert = { ...newCert[idx], certificationName: e.target.value };
                        if (updatedCert.certificationName && updatedCert.certIssuer && updatedCert.certIssueDate && updatedCert.credentialId) {
                          newCert[idx].verificationStatus = 'Verified';
                        } else {
                          newCert[idx].verificationStatus = 'Pending Verification';
                        }
                        setCertifications(newCert);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., PMP, AWS Certified"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Issuing Organization</label>
                    <input
                      type="text"
                      value={ct.certIssuer || ct.issuer || ''}
                      onChange={(e) => {
                        const newCert = [...certifications];
                        newCert[idx] = { ...newCert[idx], certIssuer: e.target.value, issuer: e.target.value };
                        // Auto-verify if all fields are filled (optional)
                        const updatedCert = { ...newCert[idx], certIssuer: e.target.value };
                        if (updatedCert.certificationName && updatedCert.certIssuer && updatedCert.certIssueDate && updatedCert.credentialId) {
                          newCert[idx].verificationStatus = 'Verified';
                        } else {
                          newCert[idx].verificationStatus = 'Pending Verification';
                        }
                        setCertifications(newCert);
                      }}
                      style={{ ...formInputBase, width: '100%' }}
                      placeholder="e.g., Project Management Institute"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Issue Date</label>
                      <input
                        type="month"
                        value={ct.certIssueDate || ct.date || ''}
                        onChange={(e) => {
                          const newCert = [...certifications];
                          newCert[idx] = { ...newCert[idx], certIssueDate: e.target.value, date: e.target.value };
                          // Auto-verify if all fields are filled (optional)
                          const updatedCert = { ...newCert[idx], certIssueDate: e.target.value };
                          if (updatedCert.certificationName && updatedCert.certIssuer && updatedCert.certIssueDate && updatedCert.credentialId) {
                            newCert[idx].verificationStatus = 'Verified';
                          } else {
                            newCert[idx].verificationStatus = 'Pending Verification';
                          }
                          setCertifications(newCert);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Expiry Date</label>
                      <input
                        type="month"
                        value={ct.certExpiryDate || ''}
                        onChange={(e) => {
                          const newCert = [...certifications];
                          newCert[idx] = { ...newCert[idx], certExpiryDate: e.target.value };
                          setCertifications(newCert);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Credential ID</label>
                      <input
                        type="text"
                        value={ct.credentialId || ''}
                        onChange={(e) => {
                          const newCert = [...certifications];
                          newCert[idx] = { ...newCert[idx], credentialId: e.target.value };
                          // Auto-verify if all fields are filled (optional)
                          const updatedCert = { ...newCert[idx], credentialId: e.target.value };
                          if (updatedCert.certificationName && updatedCert.certIssuer && updatedCert.certIssueDate && updatedCert.credentialId) {
                            newCert[idx].verificationStatus = 'Verified';
                          } else {
                            newCert[idx].verificationStatus = 'Pending Verification';
                          }
                          setCertifications(newCert);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="Certificate number/ID (optional)"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                      <strong>📋 To verify your certificate:</strong> Fill in all fields (Certification Name, Issuing Organization, Issue Date, and Credential ID). Your certificate will be automatically verified once all details are provided.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{ct.certificationName || ct.name || 'Certification'}</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{(ct.certIssuer || ct.issuer || '') + (ct.certIssueDate || ct.date ? ` - ${ct.certIssueDate || ct.date}` : '')}</p>
                  </div>
                  <span className={`status-badge ${(ct.verificationStatus || 'pending verification').toLowerCase() === 'verified' ? 'status-offered' : 'status-pending'}`}>
                    {ct.verificationStatus || 'Pending Verification'}
                  </span>
                </div>
              )}
            </div>
          ))}
          {(certifications || []).length === 0 && <div style={{ color: '#999' }}>No certifications added</div>}
          {editingSections.certifications && (
            <button
              onClick={() => {
                setCertifications(prev => [
                  ...prev,
                  {
                    certificationName: '',
                    certIssuer: '',
                    certIssueDate: '',
                    certExpiryDate: '',
                    verificationStatus: 'Pending Verification'
                  }
                ]);
              }}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              + Add Certification
            </button>
          )}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.languages ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, languages: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('languages');
                      setEditingSections(prev => ({ ...prev, languages: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed" 
                    onClick={() => setEditingSections(prev => ({ ...prev, languages: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {(languages || []).map((lg, idx) => (
              <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', position: 'relative' }}>
                {editingSections.languages && (
                  <button
                    onClick={() => {
                      setLanguages(prev => prev.filter((_, i) => i !== idx));
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc2626',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}
                  >
                    ×
                  </button>
                )}
                {editingSections.languages ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', paddingRight: '40px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Language</label>
                      <input
                        type="text"
                        value={lg.language || ''}
                        onChange={(e) => {
                          const newLangs = [...languages];
                          newLangs[idx] = { ...newLangs[idx], language: e.target.value };
                          setLanguages(newLangs);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                        placeholder="e.g., English"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Proficiency</label>
                      <select
                        value={lg.proficiency || ''}
                        onChange={(e) => {
                          const newLangs = [...languages];
                          newLangs[idx] = { ...newLangs[idx], proficiency: e.target.value };
                          setLanguages(newLangs);
                        }}
                        style={{ ...formInputBase, width: '100%' }}
                      >
                        <option value="">Select Level</option>
                        <option value="native">Native/Bilingual</option>
                        <option value="fluent">Fluent</option>
                        <option value="advanced">Advanced</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="basic">Basic</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 style={{ marginBottom: '10px' }}>{lg.language || ''}</h4>
                    <p style={{ color: '#666' }}>{lg.proficiency || ''}</p>
                  </>
                )}
              </div>
            ))}
            {(languages || []).length === 0 && <div style={{ color: '#999' }}>No languages added</div>}
            {editingSections.languages && (
              <button
                onClick={() => {
                  setLanguages(prev => [
                    ...prev,
                    {
                      language: '',
                      proficiency: ''
                    }
                  ]);
                }}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginTop: '10px'
                }}
              >
                + Add Language
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Professional Online Presence</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.socialLinks ? (
                <button 
                  onClick={() => setEditingSections(prev => ({ ...prev, socialLinks: true }))}
                  className="edit-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                    color: 'white', 
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm" 
                    onClick={() => {
                      saveSection('socialLinks');
                      setEditingSections(prev => ({ ...prev, socialLinks: false }));
                    }}
                    disabled={saving}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn-fixed"
                    onClick={() => setEditingSections(prev => ({ ...prev, socialLinks: false }))}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {editingSections.socialLinks ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label"><FontAwesomeIcon icon={faLink} /> LinkedIn Profile URL</label>
                <input 
                  type="url"
                  style={{ ...formInputBase, width: '100%' }} 
                  value={professionalLinks.linkedin || ''} 
                  onChange={(e) => setProfessionalLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FontAwesomeIcon icon={faLink} /> GitHub Profile URL</label>
                <input 
                  type="url"
                  style={{ ...formInputBase, width: '100%' }} 
                  value={professionalLinks.github || ''} 
                  onChange={(e) => setProfessionalLinks(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/your-username"
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FontAwesomeIcon icon={faLink} /> Portfolio URL</label>
                <input 
                  type="url"
                  style={{ ...formInputBase, width: '100%' }} 
                  value={professionalLinks.portfolio || ''} 
                  onChange={(e) => setProfessionalLinks(prev => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="https://your-portfolio.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FontAwesomeIcon icon={faLink} /> Personal Website URL</label>
                <input 
                  type="url"
                  style={{ ...formInputBase, width: '100%' }} 
                  value={professionalLinks.website || ''} 
                  onChange={(e) => setProfessionalLinks(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {professionalLinks && typeof professionalLinks === 'object' && Object.entries(professionalLinks).map(([key, url]) => {
                if (!url) return null;
                const labels = {
                  linkedin: 'LinkedIn',
                  github: 'GitHub', 
                  portfolio: 'Portfolio',
                  website: 'Website'
                };
                return (
                  <a href={url} key={key} className="social-link" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#f5f7fa', borderRadius: '8px', color: '#3b82f6', textDecoration: 'none' }}>
                    <FontAwesomeIcon icon={faLink} /> <span>{labels[key] || key}</span>
                  </a>
                );
              })}
              {(!professionalLinks || Object.values(professionalLinks).every(v => !v)) && (
                <div style={{ color: '#999' }}>No professional links added</div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;


