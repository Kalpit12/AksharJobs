import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';
import notificationApi from '../api/notificationApi';
import messageApi from '../api/messageApi';
import '../styles/dashboard-unified.css';
import {
  faChartLine,
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
  faCode,
  faLanguage,
  faLink,
  faMinus,
  faUserEdit,
  faUserCheck,
  faExternalLinkAlt,
  faGlobe,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faGithub,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
// import '../styles/JobSeekerDashboard.css'; // Replaced by unified CSS

const JobSeekerDashboard = () => {
  console.log('🚀 JobSeekerDashboard component rendering...');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
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
    allJobs: [],
    savedJobs: [],
    profileViews: [],
    user: {}
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    yearsOfExperience: '',
    skills: '',
    tools: '',
    expectedSalary: '',
    currency: '',
    availability: '',
    careerLevel: '',
    industry: '',
    jobTypePreference: ''
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [professionalLinks, setProfessionalLinks] = useState([]);
  const [references, setReferences] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Inline style helpers to precisely match screenshot without relying on global CSS
  const containerStyle = { maxWidth: '1200px', margin: '0 auto' };
  const elevatedCardStyle = {
    border: '1px solid #edf2f7',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.06)'
  };
  const profileHeaderStyle = {
    borderRadius: '16px',
    minHeight: '220px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.25)'
  };
  const pillTagStyle = {
    display: 'inline-block',
    background: '#eaf3ff',
    color: '#1d4ed8',
    padding: '8px 14px',
    borderRadius: '999px',
    margin: '5px',
    fontSize: '14px',
    border: '1px solid #cfe2ff'
  };
  const fieldViewModeStyle = () => (
    editMode ? {} : { background: '#f7f9fc', borderColor: '#e6eaf1', color: '#333' }
  );

  const sanitizeJobTitle = (title) => {
    if (!title) return title;
    return String(title).replace(/^Updated\s*[-:]?\s*/i, "");
  };

  const storageKey = () => `favorites_${localStorage.getItem('userId') || 'guest'}`;
  const loadSavedJobs = () => {
    try {
      const stored = localStorage.getItem(storageKey());
      if (!stored) return new Set();
      const arr = JSON.parse(stored);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  };
  const persistSavedJobs = (setObj) => {
    try { localStorage.setItem(storageKey(), JSON.stringify([...setObj])); } catch {}
  };
  const toggleSaveJob = (jobId) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId); else next.add(jobId);
      persistSavedJobs(next);
      setDashboardData(d => ({
        ...d,
        stats: { ...d.stats, savedJobs: next.size }
      }));
      return next;
    });
  };

  // Section anchors for smooth in-page navigation
  const sectionRefs = useRef({
    dashboardTop: React.createRef(),
    statsGrid: React.createRef(),
    recommended: React.createRef(),
    recentApplications: React.createRef(),
    profileCompletion: React.createRef(),
    applications: React.createRef(),
    saved: React.createRef(),
    interviews: React.createRef(),
    messages: React.createRef(),
    profile: React.createRef(),
    resume: React.createRef(),
    resources: React.createRef(),
    settings: React.createRef()
  });

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', icon: faThLarge, label: 'Dashboard', section: 'dashboard' },
    { id: 'jobs', icon: faSearch, label: 'Browse Jobs', section: 'jobs', badge: 'NEW' },
    { id: 'tracker', icon: faFileAlt, label: 'Application Tracker', section: 'applications', badge: dashboardData.stats.applicationsSent > 0 ? dashboardData.stats.applicationsSent.toString() : null },
    { id: 'saved', icon: faBookmark, label: 'Saved Jobs', section: 'saved', badge: dashboardData.stats.savedJobs > 0 ? dashboardData.stats.savedJobs.toString() : null },
    // { id: 'interviews', icon: faCalendarCheck, label: 'Interviews', section: 'interviews', badge: dashboardData.stats.interviewsScheduled > 0 ? dashboardData.stats.interviewsScheduled.toString() : null, disabled: true },
    { id: 'recommended', icon: faStar, label: 'Recommended', section: 'recommended' },
    { id: 'messages', icon: faEnvelope, label: 'Messages', section: 'messages', badge: unreadMessages > 0 ? unreadMessages.toString() : null },
    { id: 'profile', icon: faUser, label: 'My Profile', section: 'profile', isRoute: true, route: '/profile' },
    // { id: 'resume', icon: faFilePdf, label: 'Resume/CV', section: 'resume', disabled: true },
    { id: 'resources', icon: faBook, label: 'Career Resources', section: 'resources' },
    { id: 'settings', icon: faCog, label: 'Settings', section: 'settings' }
  ];

  const handleNavClick = (item) => {
    if (item.isRoute && item.route) {
      navigate(item.route);
      return;
    }
    setActiveSection(item.section);
    const map = {
      dashboard: 'dashboardTop',
      applications: 'applications',
      recommended: 'recommended',
      jobs: 'recommended',
      profile: 'profile',
      saved: 'saved',
      interviews: 'interviews',
      messages: 'messages',
      resume: 'resume',
      resources: 'resources',
      settings: 'settings'
    };
    const refKey = map[item.section];
    const ref = refKey ? sectionRefs.current[refKey] : null;
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const authHeaders = () => {
    const token = localStorage.getItem('token') || '';
    console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
    console.log('🔑 Token length:', token.length);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Set active section based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/application-tracker') {
      setActiveSection('applications');
    } else if (path === '/allJobs') {
      setActiveSection('jobs');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  // Load dashboard data
  useEffect(() => {
    console.log('🔄 useEffect triggered - loading dashboard data');
    console.log('🔍 Current user:', user);
    console.log('🔑 Token exists:', !!localStorage.getItem('token'));
    const fetchProfile = async () => {
      try {
        const res = await axios.get(buildApiUrl('/api/profile/profile'), { headers: authHeaders() });
        return res?.data || null;
      } catch (e) {
        // Fallback to /api/auth/me to at least get basic fields
        try {
          const res = await axios.get(buildApiUrl('/api/auth/me'), { headers: authHeaders() });
          return res?.data || null;
        } catch {
          return null;
        }
      }
    };

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading dashboard data...');
        console.log('🔑 Auth headers:', authHeaders());
        console.log('👤 Current user:', user);
        console.log('🔐 Is authenticated:', !!user);
        
        // Test authentication with a simple API call
        try {
          const testRes = await axios.get(buildApiUrl('/api/auth/me'), { headers: authHeaders() });
          console.log('✅ Auth test successful:', testRes.data);
        } catch (err) {
          console.log('❌ Auth test failed:', err.response?.status, err.message);
        }

        // Fetch in parallel with better error handling
        const [
          profileData,
          applicationsRes,
          notificationsRes,
          unreadNotifRes,
          unreadMsgRes,
          recommendedRes,
          allJobsRes
        ] = await Promise.allSettled([
          fetchProfile(),
          // Applications
          axios.get(buildApiUrl('/api/applications/my-applications'), { headers: authHeaders() }),
          // Notifications list & counts
          notificationApi.getNotifications(),
          notificationApi.getUnreadCount(),
          messageApi.getUnreadCount(),
          // Recommended jobs for current user
          axios.get(buildApiUrl('/api/jobs/recommended'), { headers: authHeaders() }),
          // All jobs for browse section
          axios.get(buildApiUrl('/api/jobs/get_jobs'), { headers: authHeaders() })
        ]);

        // Extract data from Promise.allSettled results
        const profile = profileData.status === 'fulfilled' ? profileData.value : null;
        const applications = applicationsRes.status === 'fulfilled' ? (applicationsRes.value?.data || []) : [];
        const notifications = notificationsRes.status === 'fulfilled' ? (notificationsRes.value?.notifications || []) : [];
        const unreadNotifCount = unreadNotifRes.status === 'fulfilled' ? (unreadNotifRes.value?.unread_count || 0) : 0;
        const unreadMsgCount = unreadMsgRes.status === 'fulfilled' ? (unreadMsgRes.value?.unread_count || 0) : 0;
        const recommendedJobs = recommendedRes.status === 'fulfilled' ? (recommendedRes.value?.data || []) : [];
        const allJobs = allJobsRes.status === 'fulfilled' ? (allJobsRes.value?.data || []) : [];

        console.log('📊 Dashboard data loaded:', {
          profile: !!profile,
          applications: applications.length,
          notifications: notifications.length,
          unreadNotifCount,
          unreadMsgCount,
          recommendedJobs: recommendedJobs.length,
          allJobs: allJobs.length
        });

        // Use only real data from API
        let finalAllJobs = allJobs;
        let finalRecommendedJobs = recommendedJobs;
        let finalApplications = applications;

        const initialSaved = loadSavedJobs();

        // Derive stats
        const applicationsSent = finalApplications.length;
        const interviewsScheduled = finalApplications.filter(a => (a.status || '').toLowerCase().includes('interview')).length;
        const savedJobs = initialSaved.size;

        // Simple profile completion heuristic
        const profileCompletion = profile ? 85 : 40;

        setUnreadNotifications(Number(unreadNotifCount) || 0);
        setUnreadMessages(Number(unreadMsgCount) || 0);
        setSavedJobIds(initialSaved);

        setDashboardData(prev => ({
          ...prev,
          stats: {
            applicationsSent,
            interviewsScheduled,
            profileViews: prev.stats.profileViews,
            savedJobs
          },
          profileCompletion,
          recentApplications: finalApplications.slice(0, 5),
          recommendedJobs: finalRecommendedJobs.slice(0, 6),
          allJobs: finalAllJobs.slice(0, 50), // show more for saved matching
          // Persist full profile for My Profile rendering
          user: {
            // prefer explicit names, fallback to fullName split
            firstName: user?.firstName || profile?.firstName || (profile?.fullName ? profile.fullName.split(' ')[0] : 'User'),
            lastName: user?.lastName || profile?.lastName || (profile?.fullName ? profile.fullName.split(' ').slice(1).join(' ') : ''),
            fullProfile: profile || {}
          }
        }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []); // Load only once on mount

  // Animate progress indicator when percentage changes
  useEffect(() => {
    if (dashboardData.profileCompletion !== undefined) {
      // Force a re-render to trigger the animation
      const indicator = document.querySelector('.progress-indicator');
      if (indicator) {
        indicator.style.transition = 'none';
        // Trigger reflow to reset the transition
        void indicator.offsetHeight;
        indicator.style.transition = 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    }
  }, [dashboardData.profileCompletion]);

  // Initialize profile form when profile loads
  useEffect(() => {
    const p = dashboardData.user?.fullProfile || {};
    if (p || user) {
      const formatLocation = (loc) => {
        if (!loc) return '';
        if (typeof loc === 'string') return loc;
        const parts = [loc.city, loc.state, loc.country].filter(Boolean);
        return parts.join(', ');
      };
      const formatAvailability = (av) => {
        if (!av) return '';
        if (typeof av === 'string' || typeof av === 'number') return String(av);
        try {
          if (Array.isArray(av)) {
            return av.map(x => (typeof x === 'string' ? x : (x?.label || x?.name || x?.value || ''))).filter(Boolean).join(', ');
          }
          // object - pick the first meaningful text field
          const candidates = ['label', 'name', 'value', 'status', 'text', 'display'];
          for (const key of candidates) {
            if (av && typeof av[key] === 'string' && av[key]) return av[key];
          }
          // fallback: join string values
          const vals = Object.values(av).filter(v => typeof v === 'string');
          if (vals.length) return vals.join(' ');
          return '';
        } catch {
          return '';
        }
      };

      setProfileForm(prev => ({
        ...prev,
        firstName: user?.firstName || p.firstName || '',
        lastName: user?.lastName || p.lastName || '',
        email: user?.email || p.email || localStorage.getItem('userEmail') || '',
        phoneNumber: p.phoneNumber || p.phone || '',
        location: formatLocation(p.location),
        professionalTitle: p.professionalTitle || '',
        professionalSummary: p.professionalSummary || p.summary || '',
        yearsOfExperience: p.yearsOfExperience || p.yearsExperience || '',
        skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
        tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || ''),
        expectedSalary: p.expectedSalary || '',
        currency: p.currency || '',
        availability: formatAvailability(p.availability),
        careerLevel: p.careerLevel || '',
        industry: p.industry || '',
        jobTypePreference: p.jobTypePreference || p.job_type || ''
      }));
      setEducation(Array.isArray(p.education) ? p.education : []);
      setExperience(Array.isArray(p.experience) ? p.experience : (Array.isArray(p.workExperience) ? p.workExperience : []));
      setLanguages(Array.isArray(p.languages) ? p.languages.map(l => (typeof l === 'string' ? { language: l, proficiency: '' } : l)) : []);
      setCertifications(Array.isArray(p.certifications) ? p.certifications : []);
      setProfessionalLinks(Array.isArray(p.professionalLinks) ? p.professionalLinks : []);
      setReferences(Array.isArray(p.references) ? p.references : []);
    }
  }, [dashboardData.user, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSavingProfile(true);
      setProfileMessage('');
      const token = localStorage.getItem('token');
      const payload = {
        ...profileForm,
        skills: profileForm.skills
          ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        tools: profileForm.tools
          ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        education,
        experience,
        languages,
        certifications,
        professionalLinks,
        references,
        profileCompleted: true
      };
      await axios.put(buildApiUrl('/api/profile/profile'), payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      // Re-fetch profile to reflect latest values in the UI
      const updated = await axios.get(buildApiUrl('/api/profile/profile'), { headers: authHeaders() });
      if (updated?.data) {
        setDashboardData(prev => ({ ...prev, user: { ...prev.user, fullProfile: updated.data } }));
      }
      setProfileMessage('Profile saved successfully.');
      setEditMode(false);
    } catch (err) {
      console.error('Save profile error:', err);
      setProfileMessage('Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };
  const cancelEdit = () => {
    // restore from latest fullProfile
    const p = dashboardData.user?.fullProfile || {};
    setEditMode(false);
    // trigger form re-init by reusing existing init effect
    setDashboardData(d => ({ ...d }));
  };

  // Utility: quickly fill form with sample data and save to verify display
  const autoFillSampleProfile = async () => {
    setEducation([{ school: 'Nairobi University', degree: 'B.Sc.', field: 'Computer Science', startDate: '2016', endDate: '2020' }]);
    setExperience([{ company: 'TechCorp Kenya', title: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Lead backend services and mentor team.' }]);
    setLanguages([{ language: 'English', proficiency: 'Fluent' }, { language: 'Swahili', proficiency: 'Fluent' }]);
    setCertifications([{ name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' }]);
    setProfessionalLinks([{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/rahul-shah' }]);
    setReferences([{ name: 'Jane Recruiter', contact: 'jane@techcorp.co.ke', relation: 'Manager' }]);
    setProfileForm(prev => ({
      ...prev,
      professionalTitle: 'Senior Software Engineer',
      professionalSummary: 'Experienced engineer with a focus on scalable APIs, mentoring, and DevOps.',
      yearsOfExperience: '6',
      skills: 'Python, Flask, React, MongoDB, Docker, AWS',
      tools: 'GitHub, Jira, Jenkins',
      expectedSalary: 'KSh 200,000',
      currency: 'KSh',
      careerLevel: 'Senior',
      availability: 'Immediately',
      location: prev.location || 'Nairobi, Kenya'
    }));
    // Save after state updates flush
    setTimeout(() => { saveProfile(); }, 100);
  };

  // Handle job application
  const handleApplyToJob = async (job) => {
    try {
      const response = await axios.post(
        buildApiUrl('/api/applications/apply'),
        {
          job_id: job._id,
          cover_letter: `I am very interested in the ${job.job_title} position at ${job.company_name}. I believe my skills and experience make me a great fit for this role.`,
          resume_url: '', // TODO: Get from user profile
          additional_info: ''
        },
        { headers: authHeaders() }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Application submitted successfully!');
        // Refresh applications data
        const applicationsRes = await axios.get(buildApiUrl('/api/applications/my-applications'), { headers: authHeaders() });
        const applications = Array.isArray(applicationsRes?.data) ? applicationsRes.data : [];
        
        setDashboardData(prev => ({
          ...prev,
          recentApplications: applications.slice(0, 5),
          stats: {
            ...prev.stats,
            applicationsSent: applications.length
          }
        }));
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply to job. Please try again.');
    }
  };

  const viewDetails = (job) => {
    navigate(`/job-details/${job._id}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, color = 'orange', change, changeType = 'neutral' }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon orange">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="stat-content">
          <div className="stat-number">{value}</div>
          <div className="stat-label">{title}</div>
          <div className={`stat-change ${changeType}`}>
            {change}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="jobseeker-dashboard-container">
        <div className="loading-container">
          <ThemedLoadingSpinner />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container jobseeker-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> JOBSEEKER HUB</h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          {navigationItems.map((item, index) => (
            <div key={item.id}>
              {index === 2 && <div className="nav-separator"></div>}
              <div 
                className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`badge ${item.badge === 'NEW' ? 'new' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="dashboard-header">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input 
              type="text" 
              placeholder="Search jobs, companies, or skills..." 
            />
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn">
              <FontAwesomeIcon icon={faBell} />
              {unreadNotifications > 0 && <span className="notification-dot"></span>}
            </button>
            <button className="icon-btn">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
            <div className="user-info">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <div className="user-name">{user?.firstName} {user?.lastName}</div>
                <div className="user-role">job_seeker</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area" ref={sectionRefs.current.dashboardTop}>
          {/* Show different content based on active section */}
          {activeSection === 'dashboard' && (
            <>
              {/* Welcome Message */}
              <div className="welcome-section">
                <h1>Welcome back, {user?.firstName}! 👋</h1>
              </div>

              {/* Profile Completion */}
              <div className="profile-completion" ref={sectionRefs.current.profileCompletion}>
                <div className="completion-header">
                  <div>
                    <h3>Complete Your Profile</h3>
                    <p>
                      {dashboardData.profileCompletion === 100 ? 'Profile Complete!' : `${dashboardData.profileCompletion}% Complete - Almost there!`}
                    </p>
                  </div>
                  <div className="completion-percentage">{dashboardData.profileCompletion}%</div>
                </div>
                <div className="completion-bar">
                  <div 
                    className="completion-fill" 
                    style={{ width: `${dashboardData.profileCompletion}%` }}
                  ></div>
                  <div 
                    className="progress-indicator"
                    style={{ 
                      left: `${dashboardData.profileCompletion}%`,
                      transition: 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div className="progress-indicator-line"></div>
                    <div className="progress-indicator-percentage">
                      {dashboardData.profileCompletion}%
                    </div>
                  </div>
                </div>
                <div className="completion-actions">
                  <button className="btn btn-upload">
                    <FontAwesomeIcon icon={faUpload} /> Upload Resume
                  </button>
                  <button className="btn btn-complete">
                    <FontAwesomeIcon icon={faCheckCircle} /> 
                    {dashboardData.profileCompletion === 100 ? 'Edit Profile' : 'Complete Profile'}
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid" ref={sectionRefs.current.statsGrid}>
                <StatCard
                  title="Applications Sent"
                  value={dashboardData.stats.applicationsSent}
                  icon={faPaperPlane}
                  change={dashboardData.stats.applicationsSent > 0 ? "↑ recent activity" : "No applications yet"}
                  changeType={dashboardData.stats.applicationsSent > 0 ? "positive" : "neutral"}
                />
                <StatCard
                  title="Interviews Scheduled"
                  value={dashboardData.stats.interviewsScheduled}
                  icon={faCalendarCheck}
                  change={dashboardData.stats.interviewsScheduled > 0 ? "Agenda updated" : "No interviews scheduled"}
                  changeType={dashboardData.stats.interviewsScheduled > 0 ? "positive" : "neutral"}
                />
                <StatCard
                  title="Profile Views"
                  value={dashboardData.stats.profileViews}
                  icon={faEye}
                  change={dashboardData.stats.profileViews > 0 ? "↑ trending" : "No views yet"}
                  changeType={dashboardData.stats.profileViews > 0 ? "positive" : "neutral"}
                />
                <StatCard
                  title="Saved Jobs"
                  value={dashboardData.stats.savedJobs}
                  icon={faBookmark}
                  change={dashboardData.stats.savedJobs > 0 ? "New matches" : "No saved jobs yet"}
                  changeType={dashboardData.stats.savedJobs > 0 ? "positive" : "neutral"}
                />
              </div>

              {/* Success Alert - Only show if there are applications */}
              {dashboardData.stats.applicationsSent > 0 && (
                <div className="alert success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div>
                    <strong>Great news!</strong> Your recent application activity is visible to recruiters.
                  </div>
                </div>
              )}

              {/* Main Content Grid */}
              <div className="content-grid">
                {/* Recommended Jobs */}
                <div className="recommended-section" ref={sectionRefs.current.recommended}>
                  <div className="recommended-header">
                    <h3 className="recommended-title">Recommended for You</h3>
                    <button className="btn-view-all">View All</button>
                  </div>
                  <div className="card-content">
                    {dashboardData.recommendedJobs && dashboardData.recommendedJobs.length > 0 ? (
                      <ul className="list">
                        {dashboardData.recommendedJobs.map((job, idx) => (
                          <li key={idx} className="list-item">
                            <div className="list-title">{sanitizeJobTitle(job.job_title || job.title)}</div>
                            <div className="list-subtitle">{job.company_name || job.company}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">No recommendations yet. Complete your profile to get personalized job suggestions!</p>
                    )}
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="card" ref={sectionRefs.current.recentApplications}>
                  <div className="card-header">
                    <h3 className="card-title">Recent Applications</h3>
                  </div>
                  <div className="card-content">
                    {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
                      <ul className="list">
                        {dashboardData.recentApplications.map((app, idx) => (
                          <li key={idx} className="list-item">
                            <div className="list-title">{sanitizeJobTitle(app.job_title)} — {app.company_name}</div>
                            <div className="list-subtitle">Status: {(app.status || 'pending').toString()}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">No applications yet</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Application Tracker Section */}
          {activeSection === 'applications' && (
            <div className="card" ref={sectionRefs.current.applications}>
              <div className="card-header">
                <h3 className="card-title">Application Tracker</h3>
                <div className="filters">
                  <select className="filter-select">
                    <option>All Applications ({dashboardData.recentApplications.length})</option>
                    <option>Under Review</option>
                    <option>Interview</option>
                    <option>Offered</option>
                    <option>Rejected</option>
                  </select>
                  <select className="filter-select">
                    <option>Sort By: Most Recent</option>
                    <option>Company Name</option>
                    <option>Application Date</option>
                    <option>Status</option>
                  </select>
                  <button className="btn btn-primary btn-sm">
                    <FontAwesomeIcon icon={faPlus} /> Track New Application
                  </button>
                </div>
              </div>
              <div className="card-content">
                {/* Application Statistics */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.recentApplications.length}</div>
                    <div className="stat-label">Total Applications</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.recentApplications.filter(app => (app.status || '').toLowerCase().includes('interview')).length}</div>
                    <div className="stat-label">Interviews</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.recentApplications.filter(app => (app.status || '').toLowerCase().includes('offer')).length}</div>
                    <div className="stat-label">Offers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.recentApplications.filter(app => (app.status || '').toLowerCase().includes('review')).length}</div>
                    <div className="stat-label">Under Review</div>
                  </div>
                </div>

                {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Location</th>
                          <th>Applied</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentApplications.map((app, idx) => (
                          <tr key={idx}>
                            <td><strong>{sanitizeJobTitle(app.job_title)}</strong></td>
                            <td>{app.company_name}</td>
                            <td>{app.location || 'Not specified'}</td>
                            <td>{new Date(app.applied_date || Date.now()).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge status-${(app.status || 'applied').toLowerCase().replace(' ', '-')}`}>
                                {app.status || 'Applied'}
                              </span>
                            </td>
                            <td>{new Date(app.updated_at || app.applied_date || Date.now()).toLocaleDateString()}</td>
                            <td>
                              <div style={{display: 'flex', gap: '5px'}}>
                                <button className="btn btn-secondary btn-sm" title="View Details">
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button className="btn btn-primary btn-sm" title="Update Status">
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="btn btn-danger btn-sm" title="Remove">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faFileAlt} className="empty-icon" />
                    <h3>No Applications Tracked Yet</h3>
                    <p>Start applying to jobs or manually add applications to track your progress here.</p>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                      <button className="btn btn-primary" onClick={() => setActiveSection('jobs')}>
                        <FontAwesomeIcon icon={faSearch} /> Browse Jobs
                      </button>
                      <button className="btn btn-secondary">
                        <FontAwesomeIcon icon={faPlus} /> Add Application Manually
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Browse Jobs Section */}
          {activeSection === 'jobs' && (
            <div className="card" ref={sectionRefs.current.jobs}>
              <div className="card-header">
                <h3 className="card-title">Browse Jobs</h3>
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
              </div>
              <div className="card-content">
                {dashboardData.allJobs && dashboardData.allJobs.length > 0 ? (
                  <div className="jobs-list">
                    {dashboardData.allJobs.map((job, idx) => (
                      <div key={job._id || idx} className="job-card orange-teal-theme">
                        <div className="job-header">
                          <div style={{display: 'flex', flex: 1}}>
                            <div className="company-logo">
                              {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'J'}
                            </div>
                            <div className="job-info">
                              <h3>{sanitizeJobTitle(job.job_title || job.title)}</h3>
                              <div className="job-company">{job.company_name || job.company}</div>
                              <div className="job-meta">
                                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Not specified'}</span>
                                <span><FontAwesomeIcon icon={faBriefcase} /> {job.job_type || 'Full-time'}</span>
                                <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experience_level || 'Mid Level'}</span>
                                <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary_range || 'Competitive'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="job-actions">
                            <button className={`btn btn-secondary btn-sm ${savedJobIds.has(job._id) ? 'active' : ''}`} onClick={() => toggleSaveJob(job._id)} title={savedJobIds.has(job._id) ? 'Unsave' : 'Save'}>
                              <FontAwesomeIcon icon={faBookmark} />
                            </button>
                          </div>
                        </div>
                        <div className="job-tags">
                          {job.featured && <span className="tag featured"><FontAwesomeIcon icon={faStar} /> Featured</span>}
                          {job.skills && job.skills.slice(0, 3).map((skill, skillIdx) => (
                            <span key={skillIdx} className="tag">{skill}</span>
                          ))}
                          <span className="tag tag-meta">
                            <FontAwesomeIcon icon={faClock} /> {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApplyToJob(job)}
                          >
                            <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewDetails(job)}>
                            <FontAwesomeIcon icon={faEye} /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faSearch} className="empty-icon" />
                    <h3>No Jobs Found</h3>
                    <p>Try adjusting your search filters or check back later for new opportunities.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Saved Jobs Section */}
          {activeSection === 'saved' && (
            <div className="card" ref={sectionRefs.current.saved}>
              <div className="card-header">
                <h3 className="card-title">Saved Jobs</h3>
              </div>
              <div className="card-content">
                {dashboardData.allJobs && dashboardData.allJobs.filter(j => savedJobIds.has(j._id)).length > 0 ? (
                  <div className="jobs-list">
                    {dashboardData.allJobs.filter(j => savedJobIds.has(j._id)).map((job, idx) => (
                      <div key={job._id || idx} className="job-card orange-teal-theme">
                        <div className="job-header">
                          <div style={{display: 'flex', flex: 1}}>
                            <div className="company-logo">
                              {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'J'}
                            </div>
                            <div className="job-info">
                              <h3>{sanitizeJobTitle(job.job_title || job.title)}</h3>
                              <div className="job-company">{job.company_name || job.company}</div>
                              <div className="job-meta">
                                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Not specified'}</span>
                                <span><FontAwesomeIcon icon={faBriefcase} /> {job.job_type || 'Full-time'}</span>
                                <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experience_level || 'Mid Level'}</span>
                                <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary_range || 'Competitive'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="job-actions">
                            <button className="btn btn-secondary btn-sm" onClick={() => toggleSaveJob(job._id)} title="Remove">
                              <FontAwesomeIcon icon={faBookmark} />
                            </button>
                          </div>
                        </div>
                        <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApplyToJob(job)}
                          >
                            <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewDetails(job)}>
                            <FontAwesomeIcon icon={faEye} /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faBookmark} className="empty-icon" />
                    <h3>No Saved Jobs</h3>
                    <p>Bookmark jobs to see them here.</p>
                    <button className="btn btn-primary" onClick={() => setActiveSection('jobs')}>
                      <FontAwesomeIcon icon={faSearch} /> Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interviews Section - Temporarily Disabled */}
          {/* {activeSection === 'interviews' && (
            <div className="card" ref={sectionRefs.current.interviews}>
              <div className="card-header">
                <h3 className="card-title">Interviews</h3>
              </div>
              <div className="card-content">
                <p>Your interview schedule will be shown here.</p>
              </div>
            </div>
          )} */}

          {/* Recommended Section */}
          {activeSection === 'recommended' && (
            <div className="card" ref={sectionRefs.current.recommended}>
              <div className="card-header">
                <h3 className="card-title">AI-Recommended Jobs</h3>
                <div className="filters">
                  <select className="filter-select">
                    <option>All Recommendations</option>
                    <option>High Match (90%+)</option>
                    <option>Good Match (70-89%)</option>
                    <option>Fair Match (50-69%)</option>
                  </select>
                  <select className="filter-select">
                    <option>Sort By: Match Score</option>
                    <option>Most Recent</option>
                    <option>Salary: High to Low</option>
                    <option>Company Name</option>
                  </select>
                </div>
              </div>
              <div className="card-content">
                {dashboardData.recommendedJobs && dashboardData.recommendedJobs.length > 0 ? (
                  <div className="jobs-list">
                    {dashboardData.recommendedJobs.map((job, idx) => (
                      <div key={job._id || idx} className="job-card orange-teal-theme">
                        <div className="job-header">
                          <div style={{display: 'flex', flex: 1}}>
                            <div className="company-logo">
                              {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'J'}
                            </div>
                            <div className="job-info">
                              <h3>{sanitizeJobTitle(job.job_title || job.title)}</h3>
                              <div className="job-company">{job.company_name || job.company}</div>
                              <div className="job-meta">
                                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Not specified'}</span>
                                <span><FontAwesomeIcon icon={faBriefcase} /> {job.job_type || 'Full-time'}</span>
                                <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experience_level || 'Mid Level'}</span>
                                <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary_range || 'Competitive'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="job-actions">
                            <div className="match-score">
                              <span className="match-percentage">{job.match_score || Math.floor(Math.random() * 30) + 70}%</span>
                              <span className="match-label">Match</span>
                            </div>
                            <button className={`btn btn-secondary btn-sm ${savedJobIds.has(job._id) ? 'active' : ''}`} onClick={() => toggleSaveJob(job._id)} title={savedJobIds.has(job._id) ? 'Unsave' : 'Save'}>
                              <FontAwesomeIcon icon={faBookmark} />
                            </button>
                          </div>
                        </div>
                        <div className="job-tags">
                          {job.featured && <span className="tag featured"><FontAwesomeIcon icon={faStar} /> Featured</span>}
                          <span className="tag ai-recommended"><FontAwesomeIcon icon={faStar} /> AI Recommended</span>
                          {job.skills && job.skills.slice(0, 3).map((skill, skillIdx) => (
                            <span key={skillIdx} className="tag">{skill}</span>
                          ))}
                          <span className="tag tag-meta">
                            <FontAwesomeIcon icon={faClock} /> {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApplyToJob(job)}
                          >
                            <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewDetails(job)}>
                            <FontAwesomeIcon icon={faEye} /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faStar} className="empty-icon" />
                    <h3>No AI Recommendations Yet</h3>
                    <p>Complete your profile to get personalized job recommendations powered by AI.</p>
                    <button className="btn btn-primary" onClick={() => setActiveSection('profile')}>
                      <FontAwesomeIcon icon={faUser} /> Complete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && (
            <div className="card" ref={sectionRefs.current.messages}>
              <div className="card-header">
                <h3 className="card-title">Messages</h3>
              </div>
              <div className="card-content">
                <p>Your inbox will be shown here.</p>
              </div>
            </div>
          )}

          {/* My Profile Section moved to dedicated route /profile */}
          {false && activeSection === 'profile' && (
            <div className="card" ref={sectionRefs.current.profile} style={elevatedCardStyle}>
              <div className="card-content" style={{padding:0}}>
                {/* Profile Header Card */}
                <div className="profile-header-card" style={profileHeaderStyle}>
                  <div style={{display:'flex', alignItems:'center', gap:'30px'}}>
                    <div className="profile-avatar-large">{(profileForm.firstName?.[0]||'U')}{(profileForm.lastName?.[0]||'')}</div>
                    <div style={{flex:1}}>
                      <h2 style={{marginBottom:'10px', fontSize:'28px'}}>{profileForm.firstName} {profileForm.lastName}</h2>
                      <p style={{fontSize:'18px', marginBottom:'10px', opacity:0.9}}>{profileForm.professionalTitle || '—'}</p>
                      <p style={{opacity:0.8}}><FontAwesomeIcon icon={faMapMarkerAlt}/> {profileForm.location || '—'}</p>
                    </div>
                    <div style={{display:'flex', gap:'8px'}}>
                      {!editMode && (
                        <button className="btn btn-primary btn-sm" onClick={()=>setEditMode(true)}>
                          <FontAwesomeIcon icon={faEdit}/> Edit Profile
                        </button>
                      )}
                      {editMode && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={saveProfile} disabled={savingProfile}>
                            <FontAwesomeIcon icon={faSave}/> {savingProfile ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                            <FontAwesomeIcon icon={faTimes}/> Cancel
                          </button>
                        </>
                      )}
                      <button className="btn btn-complete btn-sm" onClick={saveProfile} disabled={savingProfile}>
                        <FontAwesomeIcon icon={faCheckCircle}/> {savingProfile ? 'Saving...' : 'Complete Profile'}
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={autoFillSampleProfile}>Fill Sample Data</button>
                    </div>
                  </div>
                </div>
                {/* Personal Information */}
                <div className="card profile-view-mode" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faUser}/> Personal Information</h3>
                  </div>
                  <div className="profile-info-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" style={fieldViewModeStyle()} value={`${profileForm.firstName||''} ${profileForm.lastName||''}`.trim()} disabled={!editMode} onChange={(e)=>{
                        const [f,...r]=e.target.value.split(' '); setProfileForm(p=>({...p, firstName:f||'', lastName:r.join(' ')||''}))
                      }}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" style={fieldViewModeStyle()} value={profileForm.email||''} disabled/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" style={fieldViewModeStyle()} value={profileForm.phoneNumber||''} disabled={!editMode} onChange={handleProfileChange} name="phoneNumber"/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" style={fieldViewModeStyle()} value={profileForm.location||''} disabled={!editMode} onChange={handleProfileChange} name="location"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Summary</label>
                    <textarea className="form-textarea" style={fieldViewModeStyle()} value={profileForm.professionalSummary||''} disabled={!editMode} name="professionalSummary" onChange={handleProfileChange}/>
                  </div>
                </div>
                {/* Professional Details */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase}/> Professional Details</h3>
                  </div>
                  <div className="profile-info-grid">
                    <div className="form-group">
                      <label className="form-label">Current Job Title</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="professionalTitle" value={profileForm.professionalTitle||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="yearsOfExperience" value={profileForm.yearsOfExperience||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Industry</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="industry" value={profileForm.industry||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expected Salary</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="expectedSalary" value={profileForm.expectedSalary||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Type Preference</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="jobTypePreference" value={profileForm.jobTypePreference||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability</label>
                      <input className="form-input" style={fieldViewModeStyle()} name="availability" value={profileForm.availability||''} disabled={!editMode} onChange={handleProfileChange}/>
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faCode}/> Skills & Expertise</h3>
                  </div>
                  <div>
                    <div className="skill-category-label">Technical Skills</div>
                    <div>
                      {(profileForm.skills||'').split(',').filter(Boolean).map((s,i)=> (
                        <span key={i} className="skill-tag" style={pillTagStyle}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:'25px'}}>
                    <div style={{marginBottom:'15px', color:'#666', fontWeight:600}}>Tools</div>
                    <div>
                      {(profileForm.tools||'').split(',').filter(Boolean).map((s,i)=> (
                        <span key={i} className="skill-tag" style={pillTagStyle}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faBuilding}/> Work Experience</h3>
                  </div>
                  {(experience||[]).length === 0 && <div className="empty-text">No experience added</div>}
                  {(experience||[]).map((ex, idx) => (
                    <div key={idx} className="experience-item">
                      <h4>{ex.title || ex.role || 'Role'}</h4>
                      <div className="company">{ex.company||'Company'}</div>
                      <div className="duration">{(ex.startDate||'') + (ex.endDate?` - ${ex.endDate}`:'')}</div>
                      <p style={{color:'#666', marginTop:'10px'}}>{ex.description||''}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap}/> Education</h3>
                  </div>
                  {(education||[]).length === 0 && <div className="empty-text">No education added</div>}
                  {(education||[]).map((ed, idx) => (
                    <div key={idx} className="education-item">
                      <h4>{ed.degree || 'Degree'}{ed.field?` in ${ed.field}`:''}</h4>
                      <div className="institution">{ed.school || 'Institution'}</div>
                      <div className="duration">{(ed.startDate||'') + (ed.endDate?` - ${ed.endDate}`:'')}</div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faCertificate}/> Certifications & Awards</h3>
                  </div>
                  {(certifications||[]).map((ct, idx) => (
                    <div key={idx} style={{padding:'15px', background:'#f9fafb', borderRadius:'8px', marginBottom:'12px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div>
                          <h4>{ct.name||'Certification'}</h4>
                          <p style={{color:'#666', fontSize:'14px', marginTop:'5px'}}>{(ct.issuer||'') + (ct.date?` - ${ct.date}`:'')}</p>
                        </div>
                        <span className="status-badge status-offered">Verified</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Languages */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faLanguage}/> Languages</h3>
                  </div>
                  <div className="profile-info-grid">
                    {(languages||[]).map((lg, idx)=> (
                      <div key={idx}>
                        <h4 style={{marginBottom:'10px'}}>{lg.language||''}</h4>
                        <p style={{color:'#666'}}>{lg.proficiency||''}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="card" style={{margin:'20px', ...elevatedCardStyle}}>
                  <div className="card-header">
                    <h3 className="card-title"><FontAwesomeIcon icon={faLink}/> Social Links</h3>
                  </div>
                  <div className="social-links">
                    {(professionalLinks||[]).map((ln, idx)=> (
                      <a href={ln.url||'#'} key={idx} className="social-link" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faLink}/> <span>{ln.label||ln.url}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Original compact form grid retained (for edit field coverage) */}
                <div className="profile-form-grid profile-row" style={{margin:'20px'}}>
                  <div>
                    <label>First Name</label>
                    <input name="firstName" value={profileForm.firstName} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input name="lastName" value={profileForm.lastName} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Email</label>
                    <input name="email" value={profileForm.email} readOnly className="filter-input" />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div style={{gridColumn:'1 / -1'}}>
                    <label>Location</label>
                    <input name="location" value={profileForm.location} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Professional Title</label>
                    <input name="professionalTitle" value={profileForm.professionalTitle} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Years of Experience</label>
                    <input name="yearsOfExperience" value={profileForm.yearsOfExperience} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Career Level</label>
                    <input name="careerLevel" value={profileForm.careerLevel} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Availability</label>
                    <input name="availability" value={profileForm.availability} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Expected Salary</label>
                    <input name="expectedSalary" value={profileForm.expectedSalary} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div>
                    <label>Currency</label>
                    <input name="currency" value={profileForm.currency} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div style={{gridColumn:'1 / -1'}}>
                    <label>Professional Summary</label>
                    <textarea name="professionalSummary" value={profileForm.professionalSummary} onChange={handleProfileChange} className="filter-input" rows={4} />
                  </div>
                  <div style={{gridColumn:'1 / -1'}}>
                    <label>Skills (comma separated)</label>
                    <input name="skills" value={profileForm.skills} onChange={handleProfileChange} className="filter-input" />
                  </div>
                  <div style={{gridColumn:'1 / -1'}}>
                    <label>Tools/Software (comma separated)</label>
                    <input name="tools" value={profileForm.tools} onChange={handleProfileChange} className="filter-input" />
                  </div>
                </div>
                {/* Education */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">EDUCATION</div>
                  {education.map((ed, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="School" value={ed.school || ''} onChange={e=>setEducation(education.map((x,i)=>i===idx?{...x,school:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Degree" value={ed.degree || ''} onChange={e=>setEducation(education.map((x,i)=>i===idx?{...x,degree:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Field" value={ed.field || ''} onChange={e=>setEducation(education.map((x,i)=>i===idx?{...x,field:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Start" value={ed.startDate || ''} onChange={e=>setEducation(education.map((x,i)=>i===idx?{...x,startDate:e.target.value}:x))} className="filter-input" />
                      <input placeholder="End" value={ed.endDate || ''} onChange={e=>setEducation(education.map((x,i)=>i===idx?{...x,endDate:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setEducation(education.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setEducation([...education, {school:'',degree:'',field:'',startDate:'',endDate:''}])}>Add Education</button>
                </div>
                {/* Experience */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">WORK EXPERIENCE</div>
                  {experience.map((ex, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="Company" value={ex.company || ''} onChange={e=>setExperience(experience.map((x,i)=>i===idx?{...x,company:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Title" value={ex.title || ex.role || ''} onChange={e=>setExperience(experience.map((x,i)=>i===idx?{...x,title:e.target.value,role:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Start" value={ex.startDate || ''} onChange={e=>setExperience(experience.map((x,i)=>i===idx?{...x,startDate:e.target.value}:x))} className="filter-input" />
                      <input placeholder="End" value={ex.endDate || ''} onChange={e=>setExperience(experience.map((x,i)=>i===idx?{...x,endDate:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Description" value={ex.description || ''} onChange={e=>setExperience(experience.map((x,i)=>i===idx?{...x,description:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setExperience(experience.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setExperience([...experience, {company:'',title:'',startDate:'',endDate:'',description:''}])}>Add Experience</button>
                </div>
                {/* Languages */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">LANGUAGES</div>
                  {languages.map((lg, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="Language" value={lg.language || ''} onChange={e=>setLanguages(languages.map((x,i)=>i===idx?{...x,language:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Proficiency" value={lg.proficiency || ''} onChange={e=>setLanguages(languages.map((x,i)=>i===idx?{...x,proficiency:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setLanguages(languages.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setLanguages([...languages, {language:'', proficiency:''}])}>Add Language</button>
                </div>
                {/* Certifications */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">CERTIFICATIONS</div>
                  {certifications.map((ct, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="Certification" value={ct.name || ''} onChange={e=>setCertifications(certifications.map((x,i)=>i===idx?{...x,name:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Issuer" value={ct.issuer || ''} onChange={e=>setCertifications(certifications.map((x,i)=>i===idx?{...x,issuer:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Date" value={ct.date || ''} onChange={e=>setCertifications(certifications.map((x,i)=>i===idx?{...x,date:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setCertifications(certifications.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setCertifications([...certifications, {name:'', issuer:'', date:''}])}>Add Certification</button>
                </div>
                {/* Professional Links */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">PROFESSIONAL LINKS</div>
                  {professionalLinks.map((ln, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="Label (e.g., LinkedIn)" value={ln.label || ''} onChange={e=>setProfessionalLinks(professionalLinks.map((x,i)=>i===idx?{...x,label:e.target.value}:x))} className="filter-input" />
                      <input placeholder="URL" value={ln.url || ''} onChange={e=>setProfessionalLinks(professionalLinks.map((x,i)=>i===idx?{...x,url:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setProfessionalLinks(professionalLinks.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setProfessionalLinks([...professionalLinks, {label:'', url:''}])}>Add Link</button>
                </div>
                {/* References */}
                <div style={{marginTop:'22px'}}>
                  <div className="profile-section-title">REFERENCES</div>
                  {references.map((rf, idx) => (
                    <div key={idx} className="profile-subgrid" style={{marginBottom:'10px'}}>
                      <input placeholder="Name" value={rf.name || ''} onChange={e=>setReferences(references.map((x,i)=>i===idx?{...x,name:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Contact" value={rf.contact || ''} onChange={e=>setReferences(references.map((x,i)=>i===idx?{...x,contact:e.target.value}:x))} className="filter-input" />
                      <input placeholder="Relation" value={rf.relation || ''} onChange={e=>setReferences(references.map((x,i)=>i===idx?{...x,relation:e.target.value}:x))} className="filter-input" />
                      <button className="btn btn-secondary btn-sm" onClick={()=>setReferences(references.filter((_,i)=>i!==idx))}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-primary btn-sm" onClick={()=>setReferences([...references, {name:'', contact:'', relation:''}])}>Add Reference</button>
                </div>
                <div style={{marginTop:'16px', display:'flex', gap:'10px'}}>
                  <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                  {profileMessage && <span style={{color:'#4caf50'}}>{profileMessage}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Resume/CV Section - Temporarily Disabled */}
          {/* {activeSection === 'resume' && (
            <div className="card" ref={sectionRefs.current.resume}>
              <div className="card-header">
                <h3 className="card-title">Resume/CV</h3>
              </div>
              <div className="card-content">
                <p>Resume management will be available here.</p>
              </div>
            </div>
          )} */}

          {/* Career Resources Section */}
          {activeSection === 'resources' && (
            <div className="card" ref={sectionRefs.current.resources}>
              <div className="card-header">
                <h3 className="card-title">Career Resources</h3>
              </div>
              <div className="card-content">
                <p>Career resources and tools will be available here.</p>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="card" ref={sectionRefs.current.settings}>
              <div className="card-header">
                <h3 className="card-title">Settings</h3>
              </div>
              <div className="card-content">
                <p>Account settings and preferences will be available here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
