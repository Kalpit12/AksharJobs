import React, { useEffect, useState } from 'react';
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
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  
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
    email: '',
    phoneNumber: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    yearsOfExperience: '',
    expectedSalary: '',
    jobTypePreference: '',
    availability: '',
    industry: '',
    skills: '',
    tools: ''
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [professionalLinks, setProfessionalLinks] = useState([]);
  const [references, setReferences] = useState([]);

  const authHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` });

  // Section editing functions
  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveSection = async (section) => {
    setSaving(true);
    try {
      const payload = {
        ...profileForm,
        skills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        education, experience, languages, certifications, professionalLinks, profileCompleted: true
      };
      await axios.put(buildApiUrl('/api/profile/profile'), payload, { headers: { ...authHeaders(), 'Content-Type': 'application/json' } });
      setEditingSections(prev => ({ ...prev, [section]: false }));
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    const currentSkills = profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentSkills.includes(skill)) {
      setProfileForm(prev => ({
        ...prev,
        skills: [...currentSkills, skill].join(', ')
      }));
    }
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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [skillsDropdownOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(buildApiUrl('/api/jobseeker/profile'), { headers: authHeaders() });
        const p = res?.data || {};
        setProfileForm(prev => ({
          ...prev,
          firstName: user?.firstName || p.firstName || '',
          lastName: user?.lastName || p.lastName || '',
          email: user?.email || p.email || localStorage.getItem('userEmail') || '',
          phoneNumber: p.phoneNumber || p.phone || '',
          location: typeof p.location === 'string' ? p.location : [p.location?.city, p.location?.state, p.location?.country].filter(Boolean).join(', '),
          professionalTitle: p.professionalTitle || '',
          professionalSummary: p.professionalSummary || p.summary || '',
          yearsOfExperience: p.yearsOfExperience || '',
          expectedSalary: p.expectedSalary || '',
          jobTypePreference: p.jobTypePreference || p.job_type || '',
          availability: typeof p.availability === 'string' ? p.availability : (Array.isArray(p.availability) ? p.availability.join(', ') : ''),
          industry: p.industry || '',
          skills: Array.isArray(p.coreSkills) ? p.coreSkills.join(', ') : (Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '')),
          tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || '')
        }));
        setEducation(Array.isArray(p.educationEntries) ? p.educationEntries : (Array.isArray(p.education) ? p.education : []));
        setExperience(Array.isArray(p.experienceEntries) ? p.experienceEntries : (Array.isArray(p.experience) ? p.experience : (Array.isArray(p.workExperience) ? p.workExperience : [])));
        setLanguages(Array.isArray(p.languages) ? p.languages.map(l => (typeof l === 'string' ? { language: l, proficiency: '' } : l)) : []);
        setCertifications(Array.isArray(p.certificationEntries) ? p.certificationEntries : (Array.isArray(p.certifications) ? p.certifications : []));
        setProfessionalLinks(Array.isArray(p.professionalLinks) ? p.professionalLinks : []);
        setReferences(Array.isArray(p.referenceEntries) ? p.referenceEntries : (Array.isArray(p.references) ? p.references : []));

        // Optional extended fields from registration form
        setProfileForm(prev => ({
          ...prev,
          middleName: p.middleName || '',
          altPhone: p.altPhone || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          bloodGroup: p.bloodGroup || '',
          community: p.community || '',
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
          workLocation: p.workLocation || '',
          yearsOfExperience: p.yearsOfExperience || p.yearsExperience || prev.yearsOfExperience,
          careerLevel: p.careerLevel || '',
          jobType: p.jobType || '',
          noticePeriod: p.noticePeriod || '',
          currentSalary: p.currentSalary || '',
          currencyPreference: p.currencyPreference || p.currency || '',
          travelAvailability: p.travelAvailability || '',
          membershipOrg: p.membershipOrg || '',
          membershipType: p.membershipType || '',
          membershipDate: p.membershipDate || '',
          askCommunity: p.askCommunity || '',
          hobbies: p.hobbies || '',
          additionalComments: p.additionalComments || ''
        }));
        console.log('✅ Profile data loaded successfully:', p);
      } catch (error) {
        console.error('❌ Error loading profile:', error);
        console.error('Error details:', error.response?.data || error.message);
      }
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        ...profileForm,
        skills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        education, experience, languages, certifications, professionalLinks, profileCompleted: true
      };
      await axios.put(buildApiUrl('/api/profile/profile'), payload, { headers: { ...authHeaders(), 'Content-Type': 'application/json' } });
      setEditMode(false);
    } catch {
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
      `}</style>
      <div style={{ 
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
              <span style={{ color: '#ffffff !important', fontWeight: '800', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>85%</span>
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
                width: '85%',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
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
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
              <button className="btn btn-complete btn-sm" onClick={saveProfile} disabled={saving}>
                <FontAwesomeIcon icon={faCheckCircle} /> {saving ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="personal">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editingSections.personal ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => toggleSectionEdit('personal')}
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
                    onClick={() => saveSection('personal')} 
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
                    className="btn btn-secondary btn-sm" 
                    onClick={() => toggleSectionEdit('personal')}
                    style={{ 
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
                      color: 'white', 
                      border: '2px solid #991b1b',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800',
                      boxShadow: '0 4px 8px rgba(220, 38, 38, 0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div style={gridStyle}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={`${profileForm.firstName || ''} ${profileForm.lastName || ''}`.trim()} disabled={!editingSections.personal} onChange={(e) => {
                const [f, ...r] = e.target.value.split(' ');
                setProfileForm(p => ({ ...p, firstName: f || '', lastName: r.join(' ') || '' }));
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.middleName || ''} disabled={!editingSections.personal} onChange={(e) => setProfileForm(p => ({ ...p, middleName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.email || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.phoneNumber || ''} disabled={!editingSections.personal} onChange={(e) => setProfileForm(p => ({ ...p, phoneNumber: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Alternative Phone</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.altPhone || ''} disabled={!editingSections.personal} onChange={(e) => setProfileForm(p => ({ ...p, altPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.location || ''} disabled={!editingSections.personal} onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea style={{ 
              ...formInputBase, 
              minHeight: '120px', 
              maxHeight: '300px',
              resize: 'vertical', 
              ...viewModeField,
              width: '100%',
              boxSizing: 'border-box'
            }} value={profileForm.professionalSummary || ''} disabled={!editingSections.personal} onChange={(e) => setProfileForm(p => ({ ...p, professionalSummary: e.target.value }))} />
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="professional">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Professional Details</h3>
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
                    className="btn btn-secondary btn-sm" 
                    onClick={() => toggleSectionEdit('professional')}
                    style={{ 
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
                      color: 'white', 
                      border: '2px solid #991b1b',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800',
                      boxShadow: '0 4px 8px rgba(220, 38, 38, 0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div style={gridStyle}>
            {[
              ['Current Job Title', 'professionalTitle'],
              ['Years of Experience', 'yearsOfExperience'],
              ['Industry', 'industry'],
              ['Expected Salary (USD)', 'expectedSalary'],
              ['Job Type Preference', 'jobTypePreference'],
              ['Availability', 'availability'],
              ['Career Level', 'careerLevel'],
              ['Notice Period', 'noticePeriod'],
              ['Currency Preference', 'currencyPreference'],
              ['Current Salary', 'currentSalary'],
              ['Work Location', 'workLocation']
            ].map(([label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input style={{ ...formInputBase, ...viewModeField }} value={profileForm[key] || ''} disabled={!editingSections.professional} onChange={(e) => setProfileForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="skills">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCode} /> Skills & Expertise</h3>
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
                    className="btn btn-secondary btn-sm" 
                    onClick={() => toggleSectionEdit('skills')}
                    style={{ 
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
                      color: 'white', 
                      border: '2px solid #991b1b',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800',
                      boxShadow: '0 4px 8px rgba(220, 38, 38, 0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
                    }}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
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
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Add skills..."
                    value=""
                    onFocus={() => setSkillsDropdownOpen(true)}
                    style={{
                      ...formInputBase,
                      width: '100%',
                      padding: '10px 15px',
                      border: '2px solid #f97316',
                      borderRadius: '8px'
                    }}
                    readOnly
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
                      {commonSkills.map((skill, index) => (
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
                    </div>
                  )}
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
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> References</h3>
          </div>
          {(references || []).map((rf, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                <div><strong>{rf.name || rf.referenceName || 'Name'}</strong></div>
                <div>{rf.relation || rf.referenceRelationship || ''}</div>
                <div>{rf.contact || rf.referenceEmail || ''}</div>
                <div>{rf.referencePhone || ''}</div>
              </div>
            </div>
          ))}
          {(references || []).length === 0 && <div style={{ color: '#999' }}>No references added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Work Experience</h3>
          </div>
          {(experience || []).map((ex, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #667eea' }}>
              <h4>{ex.title || ex.role || 'Role'}</h4>
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: '5px' }}>{ex.company || 'Company'}</div>
              <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ex.startDate || '') + (ex.endDate ? ` - ${ex.endDate}` : '')}</div>
              <p style={{ color: '#666', marginTop: '10px' }}>{ex.description || ''}</p>
            </div>
          ))}
          {(experience || []).length === 0 && <div style={{ color: '#999' }}>No experience added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
          </div>
          {(education || []).map((ed, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #667eea' }}>
              <h4>{ed.degree || 'Degree'}{ed.field ? ` in ${ed.field}` : ''}</h4>
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: '5px' }}>{ed.school || 'Institution'}</div>
              <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ed.startDate || '') + (ed.endDate ? ` - ${ed.endDate}` : '')}</div>
            </div>
          ))}
          {(education || []).length === 0 && <div style={{ color: '#999' }}>No education added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Awards</h3>
          </div>
          {(certifications || []).map((ct, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{ct.name || 'Certification'}</h4>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{(ct.issuer || '') + (ct.date ? ` - ${ct.date}` : '')}</p>
                </div>
                <span className="status-badge status-offered">Verified</span>
              </div>
            </div>
          ))}
          {(certifications || []).length === 0 && <div style={{ color: '#999' }}>No certifications added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
          </div>
          <div style={gridStyle}>
            {(languages || []).map((lg, idx) => (
              <div key={idx}>
                <h4 style={{ marginBottom: '10px' }}>{lg.language || ''}</h4>
                <p style={{ color: '#666' }}>{lg.proficiency || ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Social Links</h3>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {(professionalLinks || []).map((ln, idx) => (
              <a href={ln.url || '#'} key={idx} className="social-link" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#f5f7fa', borderRadius: '8px', color: '#667eea', textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faLink} /> <span>{ln.label || ln.url}</span>
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;


