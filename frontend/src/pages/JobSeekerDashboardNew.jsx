import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import {
  faThLarge,
  faSearch,
  faFileAlt,
  faBookmark,
  faCalendarCheck,
  faStar,
  faEnvelope,
  faUser,
  faFilePdf,
  faBook,
  faCog,
  faBell,
  faQuestionCircle,
  faPaperPlane,
  faEye,
  faPlus,
  faUpload,
  faCertificate,
  faCheckCircle,
  faArrowUp,
  faMapMarkerAlt,
  faBriefcase,
  faLayerGroup,
  faDollarSign,
  faClock,
  faVideo,
  faCalendar,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faDownload,
  faBuilding,
  faGraduationCap,
  faLanguage,
  faLink,
  faMinus,
  faUserEdit,
  faUserCheck,
  faExternalLinkAlt,
  faGlobe,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faGithub,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import '../styles/JobSeekerDashboardNew.css';

const JobSeekerDashboardNew = () => {
  console.log('🚀 JobSeekerDashboardNew component starting...');
  
  // ========================================
  // ALL HOOKS MUST BE AT THE TOP
  // ========================================
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);
  
  // State hooks
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Individual section edit modes
  const [profileHeaderEditMode, setProfileHeaderEditMode] = useState(false);
  const [personalInfoEditMode, setPersonalInfoEditMode] = useState(false);
  const [professionalDetailsEditMode, setProfessionalDetailsEditMode] = useState(false);
  const [skillsEditMode, setSkillsEditMode] = useState(false);
  const [workExperienceEditMode, setWorkExperienceEditMode] = useState(false);
  const [educationEditMode, setEducationEditMode] = useState(false);
  const [certificationsEditMode, setCertificationsEditMode] = useState(false);
  const [languagesEditMode, setLanguagesEditMode] = useState(false);
  const [socialLinksEditMode, setSocialLinksEditMode] = useState(false);
  const [referencesEditMode, setReferencesEditMode] = useState(false);
  const [professionalLinksEditMode, setProfessionalLinksEditMode] = useState(false);
  const [careerBlogEditMode, setCareerBlogEditMode] = useState(false);
  const [notificationEditMode, setNotificationEditMode] = useState(false);
  
  // Original values for cancel functionality
  const [originalValues, setOriginalValues] = useState({});
  const [currentSkills, setCurrentSkills] = useState([]);
  const [originalSkills, setOriginalSkills] = useState([]);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    stats: {
      applicationsSent: 0,
      interviewsScheduled: 0,
      profileViews: 0,
      savedJobs: 0
    },
    profileCompletion: 0,
    recentApplications: [],
    recommendedJobs: [],
    savedJobs: [],
    profileViews: [],
    user: {}
  });
  
  // Skills management state
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('Technical Skills');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  
  // Log to confirm we reached this point in the code
  console.log('✨ About to declare useEffect hooks...');
  
  // TEST: Simple useEffect to verify it runs at all
  useEffect(() => {
    console.log('🧪🧪🧪 SIMPLE TEST useEffect - THIS SHOULD ALWAYS RUN! 🧪🧪🧪');
  }, []);
  
  console.log('✨ Simple test useEffect declared');
  
  // useEffect to fetch dashboard data on mount
  useEffect(() => {
    console.log('🔄 useEffect triggered for data fetch...');
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('🔄 No token found, skipping data fetch');
          setLoading(false);
          return;
        }
        
        if (hasFetchedData.current) {
          console.log('🔄 Data already fetched, skipping...');
          return;
        }
        
        console.log('🔄 Token exists, fetching dashboard data...');
        hasFetchedData.current = true;
        setLoading(true);
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        // Fetch dashboard data first
        console.log('🔍 Fetching dashboard data...');
        let dashboardApiData = {};
        try {
          const dashboardResponse = await axios.get(buildApiUrl('/api/data'), { headers });
          console.log('🔍 Dashboard response:', dashboardResponse.status, dashboardResponse.data);
          dashboardApiData = dashboardResponse.data;
        } catch (error) {
          console.error('🔍 Dashboard error:', error);
        }
        
        // Fetch profile data second
        console.log('🔍 Fetching profile data...');
        let profileApiData = {};
        try {
          const profileResponse = await axios.get(buildApiUrl('/api/jobseeker/profile'), { headers });
          console.log('🔍 Profile response:', profileResponse.status, profileResponse.data);
          profileApiData = profileResponse.data;
        } catch (error) {
          console.error('🔍 Profile error:', error);
        }
        
        // Transform API data to match frontend structure
        const transformedData = {
          stats: {
            applicationsSent: dashboardApiData.stats?.applicationsSent || 0,
            interviewsScheduled: dashboardApiData.stats?.interviewsScheduled || 0,
            profileViews: dashboardApiData.stats?.profileViews || 0,
            savedJobs: dashboardApiData.stats?.savedJobs || 0
          },
          profileCompletion: dashboardApiData.user?.profileCompleted ? 100 : 75,
          recentApplications: dashboardApiData.applications || [],
          recommendedJobs: dashboardApiData.recommendedJobs || [],
          savedJobs: dashboardApiData.savedJobs || [],
          profileViews: dashboardApiData.profileViews || [],
          user: {
            // Merge dashboard user data with comprehensive profile data
            ...dashboardApiData.user,
            ...profileApiData
          }
        };
        
        setDashboardData(transformedData);
        console.log('✅ Dashboard data loaded successfully:', transformedData);
        console.log('✅ User data in dashboardData (ALL FIELDS):', transformedData.user);
        console.log('✅ Profile data fields:', {
          firstName: transformedData.user?.firstName,
          lastName: transformedData.user?.lastName,
          email: transformedData.user?.email,
          phone: transformedData.user?.phone,
          professionalTitle: transformedData.user?.professionalTitle,
          coreSkills: transformedData.user?.coreSkills,
          dateOfBirth: transformedData.user?.dateOfBirth,
          gender: transformedData.user?.gender,
          currentCity: transformedData.user?.currentCity,
          nationality: transformedData.user?.nationality
        });
        console.log('📊 DashboardApiData.user:', dashboardApiData.user);
        console.log('📊 ProfileApiData (from /api/jobseeker/profile):', profileApiData);
        console.log('📊 Certification entries:', profileApiData?.certificationEntries);
        console.log('📊 Reference entries:', profileApiData?.referenceEntries);
        console.log('📊 Professional links:', profileApiData?.professionalLinks);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error in useEffect data fetch:', error);
        hasFetchedData.current = false; // Reset on error so we can try again
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array means this runs once on mount
  
  console.log('✨ Data fetch useEffect declared');
  console.log('✨ All useEffect hooks declared successfully!');
  
  // useEffect to populate skills when dashboard data changes
  useEffect(() => {
    if (dashboardData.user?.coreSkills && dashboardData.user.coreSkills.length > 0) {
      console.log('🔧 Populating skills from dashboard data:', dashboardData.user.coreSkills);
      setCurrentSkills(dashboardData.user.coreSkills);
      setOriginalSkills(dashboardData.user.coreSkills);
    }
  }, [dashboardData.user?.coreSkills]);
  
  // ========================================
  // END OF HOOKS - Regular code can start
  // ========================================
  
  // WORKAROUND: Since useEffect is not executing, call fetch directly
  // This will only run once due to hasFetchedData.current check
  console.log('🔧 WORKAROUND: Checking if we need to fetch data directly...');
  const token = localStorage.getItem('token');
  if (token && !hasFetchedData.current) {
    console.log('🔧 WORKAROUND: Token exists and data not fetched, fetching now...');
    hasFetchedData.current = true;
    
    // Call the async fetch function
    (async () => {
      try {
        setLoading(true);
        console.log('🔧 WORKAROUND: Fetching dashboard data...');
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        // Fetch dashboard data first
        console.log('🔍 Fetching dashboard data...');
        let dashboardApiData = {};
        try {
          const dashboardResponse = await axios.get(buildApiUrl('/api/data'), { headers });
          console.log('🔍 Dashboard response:', dashboardResponse.status, dashboardResponse.data);
          dashboardApiData = dashboardResponse.data;
        } catch (error) {
          console.error('🔍 Dashboard error:', error);
        }
        
        // Fetch profile data second
        console.log('🔍 Fetching profile data...');
        let profileApiData = {};
        try {
          const profileResponse = await axios.get(buildApiUrl('/api/jobseeker/profile'), { headers });
          console.log('🔍 Profile response:', profileResponse.status, profileResponse.data);
          profileApiData = profileResponse.data;
        } catch (error) {
          console.error('🔍 Profile error:', error);
        }
        
        // Transform API data to match frontend structure
        const transformedData = {
          stats: {
            applicationsSent: dashboardApiData.stats?.applicationsSent || 0,
            interviewsScheduled: dashboardApiData.stats?.interviewsScheduled || 0,
            profileViews: dashboardApiData.stats?.profileViews || 0,
            savedJobs: dashboardApiData.stats?.savedJobs || 0
          },
          profileCompletion: dashboardApiData.user?.profileCompleted ? 100 : 75,
          recentApplications: dashboardApiData.applications || [],
          recommendedJobs: dashboardApiData.recommendedJobs || [],
          savedJobs: dashboardApiData.savedJobs || [],
          profileViews: dashboardApiData.profileViews || [],
          user: {
            // Merge dashboard user data with comprehensive profile data
            ...dashboardApiData.user,
            ...profileApiData
          }
        };
        
        setDashboardData(transformedData);
        console.log('✅ Dashboard data loaded successfully:', transformedData);
        console.log('✅ User data in dashboardData (ALL FIELDS):', transformedData.user);
        console.log('✅ Profile data fields:', {
          firstName: transformedData.user?.firstName,
          lastName: transformedData.user?.lastName,
          email: transformedData.user?.email,
          phone: transformedData.user?.phone,
          professionalTitle: transformedData.user?.professionalTitle,
          coreSkills: transformedData.user?.coreSkills,
          dateOfBirth: transformedData.user?.dateOfBirth,
          gender: transformedData.user?.gender,
          currentCity: transformedData.user?.currentCity,
          nationality: transformedData.user?.nationality
        });
        console.log('📊 DashboardApiData.user:', dashboardApiData.user);
        console.log('📊 ProfileApiData (from /api/jobseeker/profile):', profileApiData);
        console.log('📊 Certification entries:', profileApiData?.certificationEntries);
        console.log('📊 Reference entries:', profileApiData?.referenceEntries);
        console.log('📊 Professional links:', profileApiData?.professionalLinks);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error in workaround data fetch:', error);
        hasFetchedData.current = false; // Reset on error so we can try again
        setLoading(false);
      }
    })();
  } else {
    console.log('🔧 WORKAROUND: Skipping fetch - no token or already fetched');
  }
  
  // WORKAROUND: Populate skills directly since useEffect is not working
  if (dashboardData.user?.coreSkills && dashboardData.user.coreSkills.length > 0 && currentSkills.length === 0) {
    console.log('🔧 WORKAROUND: Populating skills directly from dashboard data:', dashboardData.user.coreSkills);
    setCurrentSkills(dashboardData.user.coreSkills);
    setOriginalSkills(dashboardData.user.coreSkills);
  }

  // Helper function for consistent button styling - FORCED VISIBILITY
  const getButtonStyle = () => ({
    display: 'inline-flex !important', 
    alignItems: 'center !important', 
    gap: '5px !important',
    backgroundColor: '#1976d2 !important',
    color: '#ffffff !important',
    border: '2px solid #1976d2 !important',
    padding: '8px 16px !important',
    borderRadius: '6px !important',
    cursor: 'pointer !important',
    fontSize: '13px !important',
    fontWeight: '600 !important',
    transition: 'all 0.2s ease !important',
    visibility: 'visible !important',
    opacity: '1 !important',
    zIndex: '9999 !important',
    position: 'relative !important',
    minWidth: '80px !important',
    height: '36px !important',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1) !important'
  });

  const getButtonContainerStyle = () => ({
    display: 'flex !important', 
    gap: '10px !important', 
    alignItems: 'center !important',
    visibility: 'visible !important',
    opacity: '1 !important',
    zIndex: '9999 !important',
    position: 'relative !important'
  });

  // Comprehensive skills database
  const allSkills = {
    'Technical Skills': [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
      'HTML5', 'CSS3', 'Sass', 'Less', 'Bootstrap', 'Tailwind CSS', 'Material-UI',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
      'REST APIs', 'GraphQL', 'Microservices', 'Machine Learning', 'AI', 'Data Science'
    ],
    'Soft Skills': [
      'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
      'Time Management', 'Adaptability', 'Creativity', 'Emotional Intelligence',
      'Negotiation', 'Presentation Skills', 'Project Management', 'Strategic Thinking',
      'Mentoring', 'Public Speaking', 'Conflict Resolution', 'Decision Making'
    ],
    'Business Skills': [
      'Business Analysis', 'Financial Analysis', 'Marketing', 'Sales', 'Customer Service',
      'Operations Management', 'Supply Chain', 'Human Resources', 'Business Development',
      'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media Marketing',
      'E-commerce', 'Product Management', 'Agile', 'Scrum', 'Lean Six Sigma'
    ],
    'Design & Creative': [
      'UI/UX Design', 'Graphic Design', 'Web Design', 'Adobe Creative Suite',
      'Figma', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects',
      'Video Editing', 'Motion Graphics', 'Branding', 'Typography', 'Color Theory'
    ],
    'Languages': [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese',
      'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian', 'Dutch', 'Swedish'
    ],
    'Industry Specific': [
      'Healthcare IT', 'FinTech', 'EdTech', 'E-commerce', 'Gaming', 'Blockchain',
      'Cybersecurity', 'DevOps', 'Cloud Computing', 'Mobile Development',
      'IoT', 'AR/VR', 'Data Analytics', 'Business Intelligence', 'Quality Assurance'
    ]
  };

  // Initialize availableSkills based on selected category
  const availableSkills = allSkills[selectedSkillCategory];

  // Helper functions for skills management
  const handleSkillCategoryChange = (category) => {
    setSelectedSkillCategory(category);
    setSkillSearchTerm('');
  };

  const addSkill = (skill) => {
    if (!currentSkills.includes(skill)) {
      setCurrentSkills([...currentSkills, skill]);
    }
  };

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  const handleSkillsEdit = () => {
    setOriginalSkills([...currentSkills]);
    setSkillsEditMode(true);
  };

  const handleSkillsCancel = () => {
    setCurrentSkills([...originalSkills]);
    setSkillsEditMode(false);
  };

  const handleSkillsSave = () => {
    setOriginalSkills([...currentSkills]);
    setSkillsEditMode(false);
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  // Logout handler
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // Call logout from AuthContext
        await logout();
        
        // Show success message
        alert('You have been successfully logged out!');
        
        // Navigate to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  // Sample data - in real app, this would come from API
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      logo: 'TC',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      experience: 'Senior Level',
      salary: '$60,000 - $80,000',
      posted: '2 days ago',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      featured: true
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      logo: 'IL',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid Level',
      salary: '$70,000 - $90,000',
      posted: '1 week ago',
      skills: ['Product Strategy', 'Agile', 'Leadership'],
      featured: false
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Design Studio',
      logo: 'DS',
      location: 'London, UK',
      type: 'Contract',
      experience: 'Mid Level',
      salary: '$50,000 - $65,000',
      posted: '3 days ago',
      skills: ['Figma', 'User Research', 'Prototyping'],
      featured: true
    }
  ];

  const sampleApplications = [
    {
      id: 1,
      jobTitle: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'Nairobi, Kenya',
      appliedDaysAgo: '5 days ago',
      status: 'reviewing'
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Remote',
      appliedDaysAgo: '10 days ago',
      status: 'interview'
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'London, UK',
      appliedDaysAgo: '2 days ago',
      status: 'applied'
    }
  ];

  const sampleInterviews = [
    {
      id: 1,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      date: '2024-01-21',
      time: '2:00 PM',
      type: 'Video Interview',
      interviewer: 'Sarah Johnson',
      day: '21',
      month: 'JAN'
    },
    {
      id: 2,
      jobTitle: 'Marketing Manager',
      company: 'Growth Ventures',
      date: '2024-01-23',
      time: '10:00 AM',
      type: 'In-person',
      interviewer: 'Michael Chen',
      day: '23',
      month: 'JAN'
    }
  ];

  const navigationItems = [
    { id: 'dashboard', icon: faThLarge, label: 'Dashboard', active: true },
    { id: 'jobs', icon: faSearch, label: 'Browse Jobs', badge: 'NEW', badgeType: 'success' },
    { id: 'applications', icon: faFileAlt, label: 'My Applications', badge: dashboardData.stats?.applicationsSent?.toString() || '0' },
    { id: 'saved', icon: faBookmark, label: 'Saved Jobs', badge: dashboardData.stats?.savedJobs?.toString() || '0' },
    { id: 'interviews', icon: faCalendarCheck, label: 'Interviews', badge: dashboardData.stats?.interviewsScheduled?.toString() || '0' },
    { id: 'matches', icon: faStar, label: 'Recommended', badge: dashboardData.recommendedJobs?.length?.toString() || '0' },
    { id: 'messages', icon: faEnvelope, label: 'Messages', badge: '0' },
    { id: 'profile', icon: faUser, label: 'My Profile' },
    { id: 'resume', icon: faFilePdf, label: 'Resume/CV' },
    { id: 'resources', icon: faBook, label: 'Career Resources' },
    { id: 'settings', icon: faCog, label: 'Settings' }
  ];

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div>
          <div className="stat-number">{value}</div>
          <div className="stat-label">{title}</div>
        </div>
        <div className={`stat-icon ${color}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      {change && (
        <div className={`stat-change ${changeType}`}>
          {change}
        </div>
      )}
    </div>
  );

  const JobCard = ({ job, showUnsaveBtn = false }) => (
    <div className="job-card">
      <div className="job-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">{job.companyName ? job.companyName.charAt(0) : (job.company ? job.company.charAt(0) : 'C')}</div>
          <div className="job-info">
            <h3>{job.jobTitle || job.title}</h3>
            <div className="job-company">{job.companyName || job.company}</div>
            <div className="job-meta">
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Location not specified'}</span>
              <span><FontAwesomeIcon icon={faBriefcase} /> {job.jobType || job.type || 'Full-time'}</span>
              <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experienceLevel || job.experience || 'Not specified'}</span>
              <span><FontAwesomeIcon icon={faDollarSign} /> {job.salaryRange || job.salary || 'Not specified'}</span>
            </div>
          </div>
        </div>
        <div className="job-actions">
          {showUnsaveBtn ? (
            <button className="btn btn-danger btn-sm">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          )}
        </div>
      </div>
      <div className="job-tags">
        {job.featured && (
          <span className="tag featured">
            <FontAwesomeIcon icon={faStar} /> Featured
          </span>
        )}
        {(job.requiredSkills || job.skills || []).map(skill => (
          <span key={skill} className="tag">{skill}</span>
        ))}
        <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
          <FontAwesomeIcon icon={faClock} /> {job.postedDate || job.posted || 'Recently posted'}
        </span>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-apply-now btn-sm">
          <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
        </button>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faEye} /> View Details
        </button>
      </div>
    </div>
  );

  const ApplicationRow = ({ app }) => {
    const getStatusClass = (status) => {
      switch (status) {
        case 'applied': return 'status-applied';
        case 'reviewing': return 'status-reviewing';
        case 'interview': return 'status-interview';
        case 'offered': return 'status-offered';
        case 'rejected': return 'status-rejected';
        default: return 'status-applied';
      }
    };

    return (
      <tr>
        <td><strong>{app.jobTitle}</strong></td>
        <td>{app.company}</td>
        <td>{app.location}</td>
        <td>{app.appliedDaysAgo}</td>
        <td><span className={`status-badge ${getStatusClass(app.status)}`}>{app.status}</span></td>
        <td>
          <button className="btn btn-secondary btn-sm">View</button>
        </td>
      </tr>
    );
  };

  const InterviewCard = ({ interview }) => (
    <div className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{interview.company}</p>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div><FontAwesomeIcon icon={faClock} /> {interview.time}</div>
            <div style={{ marginTop: '5px' }}><FontAwesomeIcon icon={faVideo} /> {interview.type}</div>
          </div>
        </div>
        <div className="interview-date">
          <div className="day">{interview.day}</div>
          <div className="month">{interview.month}</div>
        </div>
      </div>
      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }}>
        <FontAwesomeIcon icon={faCalendar} /> View Details
      </button>
    </div>
  );

  const renderDashboard = () => {
    console.log('renderDashboard called');
    return (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Welcome back, {user?.firstName || 'User'}! 👋</h1>

      {/* Profile Completion */}
      <div className="profile-completion">
        <div className="completion-header">
          <div>
            <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>{dashboardData.profileCompletion}% Complete - Almost there!</p>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{dashboardData.profileCompletion}%</div>
        </div>
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${dashboardData.profileCompletion}%` }}></div>
        </div>
        <div className="completion-actions">
          <button className="btn" onClick={() => setActiveSection('resume')}>
            <FontAwesomeIcon icon={faUpload} /> Upload Resume
          </button>
          <button className="btn btn-complete-profile" onClick={() => navigate('/jobseeker-registration')}>
            <FontAwesomeIcon icon={faCheckCircle} /> Complete Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Applications Sent"
          value={dashboardData.stats.applicationsSent}
          icon={faPaperPlane}
          color="blue"
          change="↑ 3 this week"
          changeType="positive"
        />
        <StatCard
          title="Interviews Scheduled"
          value={dashboardData.stats.interviewsScheduled}
          icon={faCalendarCheck}
          color="green"
          change="Next: Tomorrow at 2:00 PM"
        />
        <StatCard
          title="Profile Views"
          value={dashboardData.stats.profileViews}
          icon={faEye}
          color="blue"
          change="↑ +18% from last week"
          changeType="positive"
        />
        <StatCard
          title="Saved Jobs"
          value={dashboardData.stats.savedJobs}
          icon={faBookmark}
          color="orange"
          change="↑ 2 new matches today"
          changeType="positive"
        />
      </div>

      {/* Success Alert */}
      <div className="alert success">
        <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px' }} />
        <div>
          <strong>Great news!</strong> Your application for Senior Developer at TechCorp was viewed by the recruiter.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Recommended Jobs */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recommended for You</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('matches')}>View All</button>
          </div>
          <div>
            {dashboardData.recommendedJobs.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Interviews</h3>
            </div>
            <div>
              {(dashboardData.upcomingInterviews || []).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No upcoming interviews</p>
              ) : (
                (dashboardData.upcomingInterviews || []).slice(0, 2).map(interview => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px', border: '2px solid #ff8c42' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ color: '#ff8c42', textAlign: 'center' }}>⚡ Quick Actions</h3>
              <hr style={{ border: '1px solid #ff8c42', margin: '10px 0' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>
              <div
                onClick={() => setActiveSection('jobs')}
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c42 0%, #20b2aa 100%)',
                  border: '2px solid #ff8c42',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  margin: '8px 0',
                  minHeight: '40px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(255, 140, 66, 0.3)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  userSelect: 'none'
                }}
              >
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '14px', color: 'white' }} /> 🔍 BROWSE JOBS
              </div>
              <div
                onClick={() => setActiveSection('resume')}
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c42 0%, #20b2aa 100%)',
                  border: '2px solid #ff8c42',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  margin: '8px 0',
                  minHeight: '36px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(255, 140, 66, 0.3)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  userSelect: 'none'
                }}
              >
                <FontAwesomeIcon icon={faUpload} style={{ fontSize: '13px', color: 'white' }} /> 📄 UPDATE RESUME
              </div>
              <div
                onClick={() => navigate('/jobseeker-registration')}
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c42 0%, #20b2aa 100%)',
                  border: '2px solid #ff8c42',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  margin: '8px 0',
                  minHeight: '36px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(255, 140, 66, 0.3)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  userSelect: 'none'
                }}
              >
                <FontAwesomeIcon icon={faEdit} style={{ fontSize: '13px', color: 'white' }} /> ✏️ EDIT PROFILE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Applications</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('applications')}>View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentApplications.slice(0, 5).map(app => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderJobs = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Browse Jobs</h1>
      
      <div className="filters">
        <select className="filter-select">
          <option>All Job Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Remote</option>
        </select>
        <select className="filter-select">
          <option>All Locations</option>
          <option>Nairobi, Kenya</option>
          <option>Remote</option>
          <option>United States</option>
          <option>United Kingdom</option>
        </select>
        <select className="filter-select">
          <option>All Experience Levels</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
          <option>Executive</option>
        </select>
        <select className="filter-select">
          <option>Sort By: Most Recent</option>
          <option>Relevance</option>
          <option>Salary: High to Low</option>
          <option>Company Name</option>
        </select>
      </div>

      <div className="card">
        <div>
          {dashboardData.recommendedJobs.map((job, index) => (
            <JobCard key={job._id || job.id || `job-${index}`} job={job} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

      <div className="filters">
        <select className="filter-select">
          <option>All Applications (12)</option>
          <option>Under Review (5)</option>
          <option>Interview (3)</option>
          <option>Offered (1)</option>
          <option>Rejected (3)</option>
        </select>
        <select className="filter-select">
          <option>Sort By: Most Recent</option>
          <option>Company Name</option>
          <option>Application Date</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleApplications.map(app => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSavedJobs = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
      <div className="card">
        <div>
          {dashboardData.recommendedJobs.slice(0, 4).map((job, index) => (
            <JobCard key={job._id || job.id || `saved-job-${index}`} job={job} showUnsaveBtn={true} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderInterviews = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
      
      <div className="alert info">
        <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px' }} />
        <div>
          <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
        </div>
      </div>

      <div>
        {sampleInterviews.map(interview => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
      <div className="alert success">
        <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
        <div>
          Based on your profile and preferences, we found <strong>{(dashboardData.recommendedJobs || []).length} jobs</strong> that match your skills!
        </div>
      </div>
      <div className="card">
        <div>
          {dashboardData.recommendedJobs.map((job, index) => (
            <JobCard key={job._id || job.id || `job-${index}`} job={job} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
      {/* Force button visibility with CSS overrides */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .card-header div {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          .card-header button {
            display: inline-flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #1976d2 !important;
            color: #ffffff !important;
            border: 2px solid #1976d2 !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            z-index: 9999 !important;
            position: relative !important;
            min-width: 80px !important;
            height: 36px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          .card-header button:hover {
            background-color: #1565c0 !important;
            transform: translateY(-1px) !important;
          }
          .profile-header-card button {
            display: inline-flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #1976d2 !important;
            color: #ffffff !important;
            border: 2px solid #1976d2 !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            z-index: 9999 !important;
            position: relative !important;
            min-width: 80px !important;
            height: 36px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
        `
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1>My Profile</h1>
        {/* DEBUG: Test button to verify visibility */}
        <button 
          style={{
            backgroundColor: '#ff0000 !important',
            color: '#ffffff !important',
            padding: '10px 20px !important',
            border: 'none !important',
            borderRadius: '5px !important',
            cursor: 'pointer !important',
            fontSize: '14px !important',
            fontWeight: 'bold !important',
            visibility: 'visible !important',
            opacity: '1 !important',
            zIndex: '99999 !important'
          }}
          onClick={() => alert('Button visibility test - if you see this, buttons are working!')}
        >
          TEST BUTTON
        </button>
      </div>

      {/* Profile Header */}
      <div className="profile-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div className="profile-avatar-large">JS</div>
          <div style={{ flex: 1 }}>
            {profileHeaderEditMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={dashboardData.user?.name || 'Your Name'} 
                  style={{ fontSize: '28px', fontWeight: 'bold', padding: '10px', border: '2px solid #fff', borderRadius: '5px' }}
                />
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={dashboardData.user?.experience?.[0]?.jobTitle || 'Your Job Title'} 
                  style={{ fontSize: '18px', padding: '8px', border: '2px solid #fff', borderRadius: '5px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#fff' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={dashboardData.user?.location?.city ? `${dashboardData.user.location.city}, ${dashboardData.user.location.country}` : 'Your Location'} 
                    style={{ padding: '8px', border: '2px solid #fff', borderRadius: '5px', flex: 1 }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>
                  {dashboardData.user?.name || 
                   `${dashboardData.user?.firstName || user?.firstName || ''} ${dashboardData.user?.lastName || user?.lastName || ''}`.trim() || 
                   'Your Name'}
                </h2>
                <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>
                  {dashboardData.user?.experience?.[0]?.jobTitle || dashboardData.user?.professionalTitle || 'Your Job Title'}
                </p>
                <p style={{ opacity: 0.8 }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> 
                  {dashboardData.user?.location?.city ? 
                    `${dashboardData.user.location.city}, ${dashboardData.user.location.country}` : 
                    (dashboardData.user?.currentCity ? `${dashboardData.user.currentCity}, ${dashboardData.user.residentCountry || ''}` : 'Your Location')
                  }
                </p>
              </div>
            )}
          </div>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setProfileHeaderEditMode(!profileHeaderEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={profileHeaderEditMode ? faSave : faEdit} /> 
              {profileHeaderEditMode ? 'Save' : 'Edit'}
            </button>
            {profileHeaderEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setProfileHeaderEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card profile-view-mode">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
          <div style={getButtonContainerStyle()}>
            {/* FALLBACK: Simple text-based button */}
            <div 
              style={{
                backgroundColor: '#ff6b35',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '2px solid #ff0000',
                display: 'inline-block',
                minWidth: '100px'
              }}
              onClick={() => {
                console.log('Personal Info Edit button clicked!');
                setPersonalInfoEditMode(!personalInfoEditMode);
              }}
            >
              {personalInfoEditMode ? 'SAVE' : 'EDIT'}
            </div>
            
            {personalInfoEditMode && (
              <div 
                style={{
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '2px solid #ff0000',
                  display: 'inline-block',
                  minWidth: '100px'
                }}
                onClick={() => {
                  console.log('Personal Info Cancel button clicked!');
                  setPersonalInfoEditMode(false);
                }}
              >
                CANCEL
              </div>
            )}
          </div>
        </div>
        <div className="profile-info-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue={dashboardData.user?.name || 
                  `${dashboardData.user?.firstName || user?.firstName || ''} ${dashboardData.user?.lastName || user?.lastName || ''}`.trim() || 
                  'Your Name'} 
                disabled={!personalInfoEditMode}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type='email' 
                className='form-input' 
                defaultValue={dashboardData.user?.email || user?.email || 'your.email@example.com'} 
                disabled={!personalInfoEditMode}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type='tel' 
                className='form-input' 
                defaultValue={dashboardData.user?.phone || user?.phone || 'Your Phone Number'} 
                disabled={!personalInfoEditMode}
              />
            </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input 
              type='date' 
              className='form-input' 
              defaultValue={dashboardData.user?.dateOfBirth || ''} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.location?.city ? `${dashboardData.user.location.city}, ${dashboardData.user.location.country}` : 'Your Location'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.nationality || 'Your Nationality'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" disabled={!personalInfoEditMode}>
              <option value={dashboardData.user?.gender || ''}>{dashboardData.user?.gender || 'Select Gender'}</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Resident Country</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.residentCountry || 'Your Resident Country'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current City</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.currentCity || 'Your Current City'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Work Permit</label>
            <select className="form-select" disabled={!personalInfoEditMode}>
              <option value={dashboardData.user?.workPermit || ''}>{dashboardData.user?.workPermit || 'Select Work Permit Status'}</option>
              <option value="Citizen">Citizen</option>
              <option value="Permanent Resident">Permanent Resident</option>
              <option value="Work Visa">Work Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="No Work Permit">No Work Permit</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Location 1</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.preferredLocation1 || 'Your Preferred Location 1'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Location 2</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.preferredLocation2 || 'Your Preferred Location 2'} 
              disabled={!personalInfoEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Willing to Relocate</label>
            <select className="form-select" disabled={!personalInfoEditMode}>
              <option value={dashboardData.user?.willingToRelocate || ''}>{dashboardData.user?.willingToRelocate || 'Select Willingness to Relocate'}</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Work Location Preference</label>
            <select className="form-select" disabled={!personalInfoEditMode}>
              <option value={dashboardData.user?.workLocation || ''}>{dashboardData.user?.workLocation || 'Select Work Location Preference'}</option>
              <option value="Office">Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Any">Any</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Current Job Title</label>
            <input 
              type='text' 
              className='form-input' 
              defaultValue={dashboardData.user?.professionalTitle || 'Your Current Job Title'} 
              disabled={!personalInfoEditMode}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Professional Summary</label>
          <textarea 
            className="form-textarea" 
            defaultValue={dashboardData.user?.professionalSummary || "Experienced software engineer with 8+ years of expertise in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading development teams. Passionate about clean code and innovative solutions."}
            disabled={!personalInfoEditMode}
          />
        </div>
      </div>

      {/* Professional Details */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Professional Details</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setProfessionalDetailsEditMode(!professionalDetailsEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={professionalDetailsEditMode ? faSave : faEdit} /> 
              {professionalDetailsEditMode ? 'Save' : 'Edit'}
            </button>
            {professionalDetailsEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setProfessionalDetailsEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div className="profile-info-grid">
          <div className="form-group">
            <label className="form-label">Current Job Title</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue={dashboardData.user?.professionalTitle || 'Your Job Title'} 
              disabled={!professionalDetailsEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue={dashboardData.user?.yearsOfExperience || "8"} 
              disabled={!professionalDetailsEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Employer</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue={dashboardData.user?.currentEmployer || "Your Current Employer"} 
              disabled={!professionalDetailsEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Expected Salary</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue={dashboardData.user?.expectedSalary || "Your Expected Salary"} 
              disabled={!professionalDetailsEditMode}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Salary Currency</label>
            <select className="form-select" disabled={!professionalDetailsEditMode}>
              <option value={dashboardData.user?.salaryCurrency || ''}>{dashboardData.user?.salaryCurrency || 'Select Currency'}</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Type Preference</label>
            <select className="form-select" disabled={!professionalDetailsEditMode}>
              <option value={dashboardData.user?.jobTypePreference || ''}>{dashboardData.user?.jobTypePreference || 'Select Job Type'}</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-select" disabled={!professionalDetailsEditMode}>
              <option value={dashboardData.user?.availability || ''}>{dashboardData.user?.availability || 'Select Availability'}</option>
              <option value="Immediately">Immediately</option>
              <option value="2 Weeks">2 Weeks</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faEdit} /> Skills & Expertise</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleSkillsEdit}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            {skillsEditMode && (
              <>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={handleSkillsSave}
                  style={getButtonStyle()}
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={handleSkillsCancel}
                  style={getButtonStyle()}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {!skillsEditMode ? (
          // View Mode - Small horizontal skills
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {currentSkills.map(skill => (
                <span 
                  key={skill} 
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: '1px solid #bbdefb',
                    display: 'inline-block'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          // Edit Mode - LinkedIn-style dropdown
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#666' }}>Add Skills</h4>
              
              {/* Category Selector */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category:</label>
                <select 
                  value={selectedSkillCategory}
                  onChange={(e) => handleSkillCategoryChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {Object.keys(allSkills).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Search Skills:</label>
                <input
                  type="text"
                  placeholder="Type to search skills..."
                  value={skillSearchTerm}
                  onChange={(e) => setSkillSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Available Skills Grid */}
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {filteredSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      disabled={currentSkills.includes(skill)}
                      style={{
                        backgroundColor: currentSkills.includes(skill) ? '#e0e0e0' : '#1976d2',
                        color: currentSkills.includes(skill) ? '#666' : '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        cursor: currentSkills.includes(skill) ? 'not-allowed' : 'pointer',
                        opacity: currentSkills.includes(skill) ? 0.6 : 1
                      }}
                    >
                      {currentSkills.includes(skill) ? '✓ ' : '+ '}{skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Skills */}
            <div>
              <h4 style={{ marginBottom: '10px', color: '#666' }}>Your Skills ({currentSkills.length})</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {currentSkills.map(skill => (
                  <span 
                    key={skill} 
                    style={{
                      backgroundColor: '#1976d2',
                      color: '#ffffff',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0',
                        marginLeft: '5px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setLanguagesEditMode(!languagesEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={languagesEditMode ? faSave : faEdit} /> 
              {languagesEditMode ? 'Save' : 'Edit'}
            </button>
            {languagesEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setLanguagesEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div className="profile-info-grid">
          {dashboardData.user?.languages?.map((lang, index) => (
            <div key={index} className="form-group">
              <label className="form-label">{lang.language}</label>
              <select className="form-select" disabled={!languagesEditMode}>
                <option value={lang.proficiency}>{lang.proficiency}</option>
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
          )) || (
            <div className="form-group">
              <label className="form-label">Languages</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue="English (Native), Spanish (Intermediate)" 
                disabled={!languagesEditMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Work Experience</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setWorkExperienceEditMode(!workExperienceEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={workExperienceEditMode ? faSave : faEdit} /> 
              {workExperienceEditMode ? 'Save' : 'Edit'}
            </button>
            {workExperienceEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setWorkExperienceEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        {dashboardData.user?.experienceEntries?.map((exp, index) => (
          <div key={index} className="experience-item">
            <h4>{exp.jobTitle || 'Job Title'}</h4>
            <div className="company">{exp.company || 'Company Name'}</div>
            <div className="duration">{exp.startDate} - {exp.endDate || 'Present'}</div>
            <p style={{ color: '#666', marginTop: '10px' }}>{exp.description || 'Job description'}</p>
          </div>
        )) || (
          <>
            <div className="experience-item">
              <h4>Senior Software Engineer</h4>
              <div className="company">TechCorp Inc.</div>
              <div className="duration">January 2020 - Present (4 years)</div>
              <p style={{ color: '#666', marginTop: '10px' }}>Leading a team of 5 developers in building scalable web applications. Implemented microservices architecture reducing system downtime by 40%. Mentored junior developers and conducted code reviews.</p>
            </div>
            <div className="experience-item">
              <h4>Full Stack Developer</h4>
              <div className="company">Innovation Labs</div>
              <div className="duration">March 2018 - December 2019 (2 years)</div>
              <p style={{ color: '#666', marginTop: '10px' }}>Developed and maintained multiple web applications using React and Node.js. Collaborated with UX designers to improve user experience. Implemented automated testing reducing bugs by 30%.</p>
            </div>
            <div className="experience-item">
              <h4>Junior Developer</h4>
              <div className="company">StartUp Solutions</div>
              <div className="duration">June 2016 - February 2018 (2 years)</div>
              <p style={{ color: '#666', marginTop: '10px' }}>Contributed to front-end development using JavaScript and React. Worked on bug fixes and feature enhancements. Participated in agile sprints and daily stand-ups.</p>
            </div>
          </>
        )}
        {workExperienceEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Experience
          </button>
        )}
      </div>

      {/* Education */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setEducationEditMode(!educationEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={educationEditMode ? faSave : faEdit} /> 
              {educationEditMode ? 'Save' : 'Edit'}
            </button>
            {educationEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setEducationEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        {dashboardData.user?.educationEntries?.map((edu, index) => (
          <div key={index} className="education-item">
            <h4>{edu.degree || 'Degree'}</h4>
            <div className="institution">{edu.institution || 'Institution'}</div>
            <div className="duration">{edu.startDate} - {edu.endDate || 'Present'}</div>
            <p style={{ color: '#666', marginTop: '10px' }}>{edu.description || 'Education description'}</p>
          </div>
        )) || (
          <>
            <div className="education-item">
              <h4>Bachelor of Science in Computer Science</h4>
              <div className="institution">University of Nairobi</div>
              <div className="duration">2012 - 2016</div>
              <p style={{ color: '#666', marginTop: '10px' }}>Graduated with First Class Honors. Specialized in Software Engineering and Database Systems. President of the Computer Science Society.</p>
            </div>
            <div className="education-item">
              <h4>AWS Certified Solutions Architect</h4>
              <div className="institution">Amazon Web Services</div>
              <div className="duration">2021</div>
              <p style={{ color: '#666', marginTop: '10px' }}>Professional certification demonstrating expertise in designing distributed systems on AWS.</p>
            </div>
          </>
        )}
        {educationEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Education
          </button>
        )}
      </div>

      {/* Certifications & Awards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Awards</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setCertificationsEditMode(!certificationsEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={certificationsEditMode ? faSave : faEdit} /> 
              {certificationsEditMode ? 'Save' : 'Edit'}
            </button>
            {certificationsEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setCertificationsEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          {dashboardData.user?.certificationEntries?.map((cert, index) => (
            <div key={index} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{cert.certificationName || cert.name || 'Certification Name'}</h4>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{cert.certIssuer || cert.issuer} - {cert.certIssueDate || cert.date}</p>
                </div>
                <span className="status-badge status-offered">Verified</span>
              </div>
            </div>
          )) || (
            <>
              <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>AWS Certified Solutions Architect</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Amazon Web Services - 2021</p>
                  </div>
                  <span className="status-badge status-offered">Verified</span>
                </div>
              </div>
              <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>Certified Scrum Master (CSM)</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Scrum Alliance - 2020</p>
                  </div>
                  <span className="status-badge status-offered">Verified</span>
                </div>
              </div>
              <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>Employee of the Year 2022</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>TechCorp Inc.</p>
                  </div>
                  <span className="status-badge status-offered">Award</span>
                </div>
              </div>
            </>
          )}
        </div>
        {certificationsEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Certification
          </button>
        )}
      </div>

      {/* Languages */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setLanguagesEditMode(!languagesEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={languagesEditMode ? faSave : faEdit} /> 
              {languagesEditMode ? 'Save' : 'Edit'}
            </button>
            {languagesEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setLanguagesEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div className="profile-info-grid">
          <div>
            <h4 style={{ marginBottom: '10px' }}>English</h4>
            <p style={{ color: '#666' }}>Native/Fluent</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '10px' }}>Swahili</h4>
            <p style={{ color: '#666' }}>Native/Fluent</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '10px' }}>French</h4>
            <p style={{ color: '#666' }}>Intermediate</p>
          </div>
        </div>
        {languagesEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Language
          </button>
        )}
      </div>

      {/* Social Links */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Social Links</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setSocialLinksEditMode(!socialLinksEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={socialLinksEditMode ? faSave : faEdit} /> 
              {socialLinksEditMode ? 'Save' : 'Edit'}
            </button>
            {socialLinksEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSocialLinksEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {dashboardData.user?.professionalLinks?.length > 0 ? (
            dashboardData.user.professionalLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1565c0';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1976d2';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {link.type === 'linkedin' && <FontAwesomeIcon icon={faLinkedin} />}
                {link.type === 'github' && <FontAwesomeIcon icon={faGithub} />}
                {link.type === 'portfolio' && <FontAwesomeIcon icon={faGlobe} />}
                {!['linkedin', 'github', 'portfolio'].includes(link.type) && <FontAwesomeIcon icon={faGlobe} />}
                <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {link.type === 'linkedin' ? 'LinkedIn' : 
                   link.type === 'github' ? 'GitHub' : 
                   link.type === 'portfolio' ? 'Portfolio' : 
                   link.title || link.type || 'Link'}
                </span>
              </a>
            ))
          ) : (
            <>
              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <FontAwesomeIcon icon={faLinkedin} />
                <span>LinkedIn</span>
              </a>
              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#333333',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <FontAwesomeIcon icon={faGithub} />
                <span>GitHub</span>
              </a>
              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <FontAwesomeIcon icon={faGlobe} />
                <span>Portfolio</span>
              </a>
            </>
          )}
        </div>
        {socialLinksEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Social Link
          </button>
        )}
      </div>

      {/* References */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faUserCheck} /> References</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setReferencesEditMode(!referencesEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={referencesEditMode ? faSave : faEdit} /> 
              {referencesEditMode ? 'Save' : 'Edit'}
            </button>
            {referencesEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setReferencesEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          {dashboardData.user?.referenceEntries?.map((ref, index) => (
            <div key={index} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4>{ref.referenceName || ref.name || 'Reference Name'}</h4>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{ref.referenceRelationship || ref.position} at {ref.referenceCompany || ref.company}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Email: {ref.referenceEmail || ref.email}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Phone: {ref.referencePhone || ref.phone}</p>
            </div>
          )) || (
            <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4>Sarah Johnson</h4>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Senior Manager at TechCorp Inc.</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Email: sarah.johnson@techcorp.com</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Phone: +1 (555) 123-4567</p>
            </div>
          )}
        </div>
        {referencesEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Reference
          </button>
        )}
      </div>

      {/* Professional Links */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faExternalLinkAlt} /> Professional Links</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setProfessionalLinksEditMode(!professionalLinksEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={professionalLinksEditMode ? faSave : faEdit} /> 
              {professionalLinksEditMode ? 'Save' : 'Edit'}
            </button>
            {professionalLinksEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setProfessionalLinksEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          {dashboardData.user?.professionalLinks?.map((link, index) => (
            <div key={index} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4>{link.type || link.title || 'Link Title'}</h4>
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                {link.url}
              </a>
            </div>
          )) || (
            <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4>Portfolio Website</h4>
              <a href="https://johnsmith.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                https://johnsmith.dev
              </a>
            </div>
          )}
        </div>
        {professionalLinksEditMode && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Professional Link
          </button>
        )}
      </div>
    </div>
  );

  const renderResume = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1>Resume/CV Management</h1>
        <button 
          className="btn btn-primary"
          style={{ 
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important',
            border: '2px solid #2196f3 !important',
            color: 'white !important',
            fontWeight: 'bold !important',
            fontSize: '16px !important',
            padding: '12px 24px !important',
            borderRadius: '8px !important',
            display: 'flex !important',
            alignItems: 'center !important',
            justifyContent: 'center !important',
            gap: '8px !important',
            visibility: 'visible !important',
            opacity: '1 !important',
            cursor: 'pointer !important',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3) !important',
            transition: 'all 0.3s ease !important'
          }}
        >
          <FontAwesomeIcon icon={faUpload} style={{ fontSize: '16px' }} /> UPLOAD NEW RESUME
        </button>
      </div>

      <div className="card">
        <div className="resume-list">
          <div className="resume-item">
            <div className="resume-icon">
              <FontAwesomeIcon icon={faFilePdf} />
            </div>
            <div className="resume-info">
              <h4>John_Smith_Resume_2024.pdf</h4>
              <div className="resume-meta">
                <span><FontAwesomeIcon icon={faCalendar} /> Uploaded: Jan 10, 2024</span>
                <span style={{ marginLeft: '15px' }}><FontAwesomeIcon icon={faFilePdf} /> 256 KB</span>
                <span 
                  style={{ 
                    marginLeft: '15px', 
                    background: 'linear-gradient(135deg, #ff8c42 0%, #20b2aa 100%) !important',
                    color: 'white !important',
                    padding: '4px 12px !important',
                    borderRadius: '20px !important',
                    fontSize: '12px !important',
                    fontWeight: 'bold !important',
                    textTransform: 'uppercase !important',
                    border: '2px solid #ff8c42 !important',
                    boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3) !important',
                    visibility: 'visible !important',
                    opacity: '1 !important'
                  }} 
                  className="status-badge status-offered"
                >
                  PRIMARY
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  // View resume functionality
                  console.log('Viewing resume: John_Smith_Resume_2024.pdf');
                  alert('Opening resume viewer...');
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #ff8c42 0%, #20b2aa 100%) !important',
                  border: '3px solid #ff8c42 !important',
                  color: 'white !important',
                  fontWeight: 'bold !important',
                  fontSize: '15px !important',
                  padding: '12px 20px !important',
                  borderRadius: '8px !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  gap: '8px !important',
                  visibility: 'visible !important',
                  opacity: '1 !important',
                  cursor: 'pointer !important',
                  boxShadow: '0 4px 15px rgba(255, 140, 66, 0.4) !important',
                  transition: 'all 0.3s ease !important',
                  minWidth: '100px !important',
                  height: '45px !important'
                }}
              >
                <FontAwesomeIcon icon={faEye} style={{ fontSize: '16px' }} /> VIEW
              </button>
              <button 
                onClick={() => {
                  // Download resume functionality
                  console.log('Downloading resume: John_Smith_Resume_2024.pdf');
                  alert('Starting download...');
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%) !important',
                  border: '3px solid #20b2aa !important',
                  color: 'white !important',
                  fontWeight: 'bold !important',
                  fontSize: '15px !important',
                  padding: '12px 20px !important',
                  borderRadius: '8px !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  gap: '8px !important',
                  visibility: 'visible !important',
                  opacity: '1 !important',
                  cursor: 'pointer !important',
                  boxShadow: '0 4px 15px rgba(32, 178, 170, 0.4) !important',
                  transition: 'all 0.3s ease !important',
                  minWidth: '120px !important',
                  height: '45px !important'
                }}
              >
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '16px' }} /> DOWNLOAD
              </button>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => {
                  // Delete resume functionality
                  const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
                  if (confirmDelete) {
                    console.log('Deleting resume: John_Smith_Resume_2024.pdf');
                    alert('Resume deleted successfully!');
                  }
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%) !important',
                  border: '2px solid #ff4757 !important',
                  color: 'white !important',
                  fontWeight: 'bold !important',
                  fontSize: '14px !important',
                  padding: '10px 12px !important',
                  borderRadius: '6px !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  gap: '6px !important',
                  visibility: 'visible !important',
                  opacity: '1 !important',
                  cursor: 'pointer !important',
                  boxShadow: '0 2px 8px rgba(255, 71, 87, 0.3) !important',
                  transition: 'all 0.3s ease !important',
                  minWidth: '40px !important'
                }}
              >
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Messages</h1>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Inbox</h3>
          <button className="btn btn-primary btn-sm">
            <FontAwesomeIcon icon={faPlus} /> New Message
          </button>
        </div>
        <div className="message-list">
          <div className="message-item unread">
            <div className="message-avatar">TC</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">TechCorp Inc.</span>
                <span className="message-time">2 hours ago</span>
              </div>
              <div className="message-preview">Your application for Senior Full Stack Developer has been reviewed. We'd like to schedule an interview...</div>
            </div>
          </div>
          <div className="message-item unread">
            <div className="message-avatar">IL</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">Innovation Labs</span>
                <span className="message-time">1 day ago</span>
              </div>
              <div className="message-preview">Thank you for your interest in the Product Manager position. We have a few questions...</div>
            </div>
          </div>
          <div className="message-item">
            <div className="message-avatar">DS</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">Design Studio</span>
                <span className="message-time">3 days ago</span>
              </div>
              <div className="message-preview">We received your application for UX/UI Designer. Our team is currently reviewing...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Career Resources</h1>
      <div className="stats-grid">
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faBook} /> Interview Tips</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Master your interview skills with expert advice and common questions.</p>
          <button className="btn btn-secondary btn-sm">Learn More</button>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faFileAlt} /> Resume Builder</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Create a professional resume in minutes with our templates.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('resume')}>Start Building</button>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faUser} /> Online Courses</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Upskill with courses and certifications from top providers.</p>
          <button className="btn btn-secondary btn-sm">Browse Courses</button>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faStar} /> Career Advice</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Get personalized guidance from career experts and mentors.</p>
          <button className="btn btn-secondary btn-sm">Get Advice</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faBook} /> Career Blog & Articles</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setCareerBlogEditMode(!careerBlogEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={careerBlogEditMode ? faSave : faEdit} /> 
              {careerBlogEditMode ? 'Save' : 'Edit'}
            </button>
            {careerBlogEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setCareerBlogEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
            <h4 style={{ marginBottom: '10px' }}>10 Tips for Negotiating Your Salary</h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Learn how to effectively negotiate your salary and benefits package with confidence.</p>
            <span style={{ color: '#1976d2', fontSize: '13px' }}><FontAwesomeIcon icon={faClock} /> 5 min read</span>
          </div>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
            <h4 style={{ marginBottom: '10px' }}>How to Build a Strong LinkedIn Profile</h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Optimize your LinkedIn presence to attract recruiters and job opportunities.</p>
            <span style={{ color: '#1976d2', fontSize: '13px' }}><FontAwesomeIcon icon={faClock} /> 7 min read</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h1 style={{ marginBottom: '25px' }}>Settings</h1>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><FontAwesomeIcon icon={faBell} /> Notification Preferences</h3>
          <div style={getButtonContainerStyle()}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setNotificationEditMode(!notificationEditMode)}
              style={getButtonStyle()}
            >
              <FontAwesomeIcon icon={notificationEditMode ? faSave : faEdit} /> 
              {notificationEditMode ? 'Save' : 'Edit'}
            </button>
            {notificationEditMode && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setNotificationEditMode(false)}
                style={getButtonStyle()}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </div>
        <div className="settings-section">
          <div className="settings-item">
            <div>
              <h4>Email Notifications</h4>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive job alerts and updates via email</p>
            </div>
            <div className="toggle-switch active"></div>
          </div>
          <div className="settings-item">
            <div>
              <h4>Application Updates</h4>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get notified about application status changes</p>
            </div>
            <div className="toggle-switch active"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    console.log('About to render content');
    console.log('Rendering content for section:', activeSection);
    console.log('Dashboard data:', dashboardData);
    console.log('Dashboard user data:', dashboardData.user);
    console.log('User firstName:', dashboardData.user?.firstName);
    console.log('User lastName:', dashboardData.user?.lastName);
    console.log('User email:', dashboardData.user?.email);
    
    const renderSection = (content) => {
      return (
        <div className="page-section active">
          {content}
        </div>
      );
    };
    
    switch (activeSection) {
      case 'dashboard': 
        console.log('Rendering dashboard');
        return renderSection(renderDashboard());
      case 'jobs': return renderSection(renderJobs());
      case 'applications': return renderSection(renderApplications());
      case 'saved': return renderSection(renderSavedJobs());
      case 'interviews': return renderSection(renderInterviews());
      case 'matches': return renderSection(renderMatches());
      case 'messages': return renderSection(renderMessages());
      case 'profile': return renderSection(renderProfile());
      case 'resume': return renderSection(renderResume());
      case 'resources': return renderSection(renderResources());
      case 'settings': return renderSection(renderSettings());
      default: 
        console.log('Default case - rendering dashboard');
        return renderSection(renderDashboard());
    }
  };

  return (
    <div className="jobseeker-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> AksharJobs</h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          {navigationItems.map(item => (
            <div 
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`badge ${item.badgeType === 'success' ? 'success' : ''}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search jobs, companies, or skills..." />
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn">
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
            <div className="user-profile" onClick={() => setActiveSection('profile')}>
              <div className="user-avatar">
                {dashboardData.user?.name ? 
                  dashboardData.user.name.split(' ').map(n => n.charAt(0)).join('') : 
                  (user?.firstName && user?.lastName ? 
                    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 
                    'U')
                }
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {dashboardData.user?.name || 
                   `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 
                   'User Name'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {dashboardData.user?.experience?.[0]?.jobTitle || 
                   dashboardData.user?.professionalTitle || 
                   dashboardData.user?.userType || 
                   'Job Seeker'}
                </div>
              </div>
            </div>
            <button 
              className="btn-logout" 
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              fontSize: '18px',
              color: '#666'
            }}>
              <div>
                <FontAwesomeIcon icon={faSearch} style={{ marginRight: '10px' }} />
                Loading dashboard...
              </div>
            </div>
          ) : (
            <>
              {console.log('About to render content')}
              {renderContent() || (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>Dashboard Content Loading...</h2>
                  <p>If you see this, there might be an issue with the component rendering.</p>
                  <button onClick={() => setActiveSection('dashboard')} className="btn btn-primary">
                    Go to Dashboard
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboardNew;
