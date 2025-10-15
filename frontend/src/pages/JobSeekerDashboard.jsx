import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, faBriefcase, faUserClock, faHeart, faEnvelope, 
  faUser, faFileAlt, faGraduationCap, faCog, faBell, 
  faSearch, faPlus, faEdit, faSave, faTimes, faCheck,
  faMapMarkerAlt, faPhone, faEnvelope as faMail, faGlobe,
  faLinkedin, faGithub, faTwitter, faCalendar, faClock,
  faDollarSign, faUsers, faBuilding, faStar, faDownload,
  faEye, faFilter, faSort, faArrowUp, faArrowDown,
  faExternalLinkAlt, faTrash, faCopy, faShare, faUpload,
  faVideo, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as fabLinkedin, faGithub as fabGithub, faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import dashboardService from '../services/dashboardService';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingSections, setEditingSections] = useState({
    basicInfo: false,
    summary: false,
    experience: false,
    skills: false,
    education: false,
    certifications: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    jobTitle: '',
    experience: '',
    industry: '',
    availability: 'Available Immediately',
    profilePhoto: null,
    profileCompleted: false
  });

  // Real data from APIs
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    savedJobs: 0
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Basic info fields
    const basicFields = ['fullName', 'email', 'phone', 'location', 'summary', 'jobTitle', 'experience', 'industry'];
    basicFields.forEach(field => {
      totalFields++;
      if (profileData[field] && profileData[field].trim() !== '') {
        completedFields++;
      }
    });

    // Skills (if any)
    totalFields++;
    if (profileData.skills && profileData.skills.length > 0) {
      completedFields++;
    }

    // Work experience (if any)
    totalFields++;
    if (profileData.workExperience && profileData.workExperience.length > 0) {
      completedFields++;
    }

    // Education (if any)
    totalFields++;
    if (profileData.education && profileData.education.length > 0) {
      completedFields++;
    }

    // Resume (if any)
    totalFields++;
    if (profileData.resume || profileData.resumeUrl) {
      completedFields++;
    }

    const percentage = Math.round((completedFields / totalFields) * 100);
    return Math.min(percentage, 100);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.userId) {
        console.log('No user or user ID found:', { user, userId: user?.userId });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Starting to fetch dashboard data for user:', user.userId);
        
        // Fetch all dashboard data in parallel
        const [
          profileResponse,
          applicationsResponse,
          jobsResponse,
          savedJobsResponse,
          recommendedJobsResponse,
          interviewsResponse,
          profileViewsResponse
        ] = await Promise.allSettled([
          dashboardService.getJobSeekerProfile().catch(err => {
            console.log('Profile fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getJobSeekerApplications().catch(err => {
            console.log('Applications fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getJobSeekerJobs().catch(err => {
            console.log('Jobs fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getSavedJobs().catch(err => {
            console.log('Saved jobs fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getRecommendedJobs().catch(err => {
            console.log('Recommended jobs fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getInterviews().catch(err => {
            console.log('Interviews fetch failed:', err);
            return { error: err.message };
          }),
          dashboardService.getProfileViews().catch(err => {
            console.log('Profile views fetch failed:', err);
            return { error: err.message };
          })
        ]);

        // Update profile data
        if (profileResponse.status === 'fulfilled' && !profileResponse.value.error) {
          const profile = profileResponse.value;
          setProfileData({
            fullName: profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user.firstName || 'User',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            location: profile.location || profile.currentCity || '',
            summary: profile.summary || profile.professionalSummary || '',
            jobTitle: profile.jobTitle || profile.professionalTitle || '',
            experience: profile.experience || profile.yearsExperience || '',
            industry: profile.industry || '',
            availability: profile.availability || 'Available Immediately',
            profilePhoto: profile.profilePhoto || null,
            profileCompleted: profile.profileCompleted || false
          });
        } else {
          // Use fallback profile data
          setProfileData({
            fullName: user.firstName || 'User',
            email: user.email || '',
            phone: '',
            location: '',
            summary: '',
            jobTitle: 'Job Seeker',
            experience: '',
            industry: '',
            availability: 'Available Immediately',
            profilePhoto: null,
            profileCompleted: false
          });
        }

        // Update applications
        if (applicationsResponse.status === 'fulfilled' && !applicationsResponse.value.error) {
          const apps = applicationsResponse.value;
          setApplications(Array.isArray(apps) ? apps : []);
        } else {
          // Add some sample applications for demo
          setApplications([
            {
              id: 1,
              job_title: 'Software Developer',
              company_name: 'TechCorp',
              status: 'Under Review',
              applied_at: '2024-01-15',
              location: 'Nairobi, Kenya'
            }
          ]);
        }

        // Update jobs
        if (jobsResponse.status === 'fulfilled' && !jobsResponse.value.error) {
          const jobsData = jobsResponse.value;
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
          // Add some sample jobs for demo
          setJobs([
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
              featured: true,
              matchScore: 95
            },
            {
              id: 2,
              title: 'Product Manager',
              company: 'Innovation Labs',
              logo: 'IL',
              location: 'Remote',
              type: 'Full-time',
              experience: 'Mid Level',
              salary: '$50,000 - $70,000',
              posted: '1 week ago',
              skills: ['Product Strategy', 'Agile', 'Analytics'],
              featured: false,
              matchScore: 87
            }
          ]);
        }

        // Update saved jobs
        if (savedJobsResponse.status === 'fulfilled' && !savedJobsResponse.value.error) {
          const saved = savedJobsResponse.value;
          setSavedJobs(Array.isArray(saved) ? saved : []);
        } else {
          setSavedJobs([]);
        }

        // Update recommended jobs
        if (recommendedJobsResponse.status === 'fulfilled' && !recommendedJobsResponse.value.error) {
          const recommended = recommendedJobsResponse.value;
          setRecommendedJobs(Array.isArray(recommended) ? recommended : []);
        } else {
          setRecommendedJobs([]);
        }

        // Update interviews
        if (interviewsResponse.status === 'fulfilled' && !interviewsResponse.value.error) {
          const interviewData = interviewsResponse.value;
          setInterviews(Array.isArray(interviewData) ? interviewData : []);
        } else {
          setInterviews([]);
        }

        // Update profile views
        if (profileViewsResponse.status === 'fulfilled' && !profileViewsResponse.value.error) {
          const views = profileViewsResponse.value;
          setStats(prev => ({
            ...prev,
            profileViews: views.totalViews || 0
          }));
        } else {
          setStats(prev => ({
            ...prev,
            profileViews: 0
          }));
        }

        // Calculate stats from fetched data
        setStats(prev => ({
          ...prev,
          applications: applicationsResponse.status === 'fulfilled' && !applicationsResponse.value.error ? 
            (Array.isArray(applicationsResponse.value) ? applicationsResponse.value.length : 0) : 0,
          interviews: interviewsResponse.status === 'fulfilled' && !interviewsResponse.value.error ? 
            (Array.isArray(interviewsResponse.value) ? interviewsResponse.value.length : 0) : 0,
          savedJobs: savedJobsResponse.status === 'fulfilled' && !savedJobsResponse.value.error ? 
            (Array.isArray(savedJobsResponse.value) ? savedJobsResponse.value.length : 0) : 0
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Set fallback data even on error
        setProfileData({
          fullName: user.firstName || 'User',
          email: user.email || '',
          phone: '',
          location: '',
          summary: '',
          jobTitle: 'Job Seeker',
          experience: '',
          industry: '',
          availability: 'Available Immediately',
          profilePhoto: null,
          profileCompleted: false
        });
        setApplications([]);
        setJobs([]);
        setSavedJobs([]);
        setRecommendedJobs([]);
        setInterviews([]);
        setStats({
          applications: 0,
          interviews: 0,
          profileViews: 0,
          savedJobs: 0
        });
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Dashboard loading timeout reached - showing dashboard with fallback data');
      setLoading(false);
      
      // Set fallback data on timeout
      setProfileData({
        fullName: user.firstName || 'User',
        email: user.email || '',
        phone: '',
        location: '',
        summary: 'Complete your profile to get better job matches',
        jobTitle: 'Job Seeker',
        experience: '',
        industry: '',
        availability: 'Available Immediately',
        profilePhoto: null,
        profileCompleted: false
      });
      setApplications([
        {
          id: 1,
          job_title: 'Software Developer',
          company_name: 'TechCorp',
          status: 'Under Review',
          applied_at: '2024-01-15',
          location: 'Nairobi, Kenya'
        }
      ]);
      setJobs([
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
          featured: true,
          matchScore: 95
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'Innovation Labs',
          logo: 'IL',
          location: 'Remote',
          type: 'Full-time',
          experience: 'Mid Level',
          salary: '$50,000 - $70,000',
          posted: '1 week ago',
          skills: ['Product Strategy', 'Agile', 'Analytics'],
          featured: false,
          matchScore: 87
        }
      ]);
      setSavedJobs([]);
      setRecommendedJobs([]);
      setInterviews([]);
      setStats({
        applications: 1,
        interviews: 0,
        profileViews: 5,
        savedJobs: 0
      });
    }, 5000); // 5 second timeout

    fetchDashboardData();

    return () => clearTimeout(timeoutId);
  }, [user]);

  // Navigation function
  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Individual section editing functions
  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveSection = async (section) => {
    try {
      // Here you would save the specific section data to the backend
      console.log(`Saving ${section} section:`, profileData);
      
      // For now, just toggle the editing state
      setEditingSections(prev => ({
        ...prev,
        [section]: false
      }));
      
      alert(`${section} section updated successfully!`);
    } catch (error) {
      console.error(`Error saving ${section} section:`, error);
      alert(`Failed to save ${section} section. Please try again.`);
    }
  };

  const cancelSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
    // You could reload the original data here if needed
  };

  // Profile editing functions
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSave = () => {
    setIsEditingProfile(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Job application function
  const applyToJob = async (jobId) => {
    try {
      const result = await dashboardService.applyForJob(jobId, {
        coverLetter: '',
        resume: profileData.resume || ''
      });
      
      if (result.success) {
        // Refresh applications data
        const updatedApplications = await dashboardService.getJobSeekerApplications();
        setApplications(Array.isArray(updatedApplications) ? updatedApplications : []);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          applications: prev.applications + 1
        }));
        
        alert('Application submitted successfully!');
    } else {
        alert('Failed to apply for job. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    }
  };

  // Job saving function
  const saveJob = async (jobId) => {
    try {
      const result = await dashboardService.saveJob(jobId);
      
      if (result.success) {
        // Refresh saved jobs data
        const updatedSavedJobs = await dashboardService.getSavedJobs();
        setSavedJobs(Array.isArray(updatedSavedJobs) ? updatedSavedJobs : []);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          savedJobs: prev.savedJobs + 1
        }));
        
        alert('Job saved successfully!');
      } else {
        alert('Failed to save job. Please try again.');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  // Job unsaving function
  const unsaveJob = async (jobId) => {
    try {
      const result = await dashboardService.unsaveJob(jobId);
      
      if (result.success) {
        // Refresh saved jobs data
        const updatedSavedJobs = await dashboardService.getSavedJobs();
        setSavedJobs(Array.isArray(updatedSavedJobs) ? updatedSavedJobs : []);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          savedJobs: Math.max(0, prev.savedJobs - 1)
        }));
        
        alert('Job removed from saved jobs!');
      } else {
        alert('Failed to remove job. Please try again.');
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
      alert('Failed to remove job. Please try again.');
    }
  };

  // Calculate profile completion percentage once
  const profileCompletionPercentage = calculateProfileCompletion();

  // Show loading state
  if (loading) {
    return (
      <div className="jobseeker-dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#667eea' }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="jobseeker-dashboard">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
          flexDirection: 'column',
          gap: '20px',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ color: '#e74c3c', fontSize: '48px' }}>⚠️</div>
          <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>Oops! Something went wrong</h2>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
    </div>
  );
  }

  return (
    <div className="jobseeker-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> CareerHub</h2>
          <p>{profileData.fullName || user?.firstName || 'User'}</p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => showSection('jobs')}>
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Browse Jobs</span>
            <span className="badge">NEW</span>
          </div>
          <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => showSection('applications')}>
            <FontAwesomeIcon icon={faUserClock} />
            <span>My Applications</span>
            <span className="badge">{applications.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => showSection('saved')}>
            <FontAwesomeIcon icon={faHeart} />
            <span>Saved Jobs</span>
            <span className="badge">{savedJobs.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => showSection('interviews')}>
            <FontAwesomeIcon icon={faCalendar} />
            <span>Interviews</span>
            <span className="badge">{interviews.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'recommended' ? 'active' : ''}`} onClick={() => showSection('recommended')}>
            <FontAwesomeIcon icon={faStar} />
            <span>Recommended</span>
            <span className="badge success">{recommendedJobs.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => showSection('messages')}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Messages</span>
            <span className="badge">5</span>
          </div>
          <div className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => showSection('profile')}>
            <FontAwesomeIcon icon={faUser} />
            <span>My Profile</span>
          </div>
          <div className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} onClick={() => showSection('resume')}>
            <FontAwesomeIcon icon={faFileAlt} />
            <span>Resume/CV</span>
          </div>
          <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => showSection('resources')}>
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Career Resources</span>
          </div>
          <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => showSection('settings')}>
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </div>
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
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {profileData.fullName || user?.firstName || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {profileData.jobTitle || 'Job Seeker'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="page-section active">
              <div className="dashboard-header">
                <h1>Welcome back, {profileData.fullName?.split(' ')[0] || 'User'}! 👋</h1>
                <p>Here's what's happening with your job search today</p>
              </div>

              {/* Profile Completion Card */}
              <div className="profile-completion-card">
                <div className="completion-header">
                  <h3>Complete Your Profile</h3>
                  <span className="completion-percentage">
                    {calculateProfileCompletion()}% Complete
                  </span>
                </div>
                <div className="completion-bar">
                  <div className="completion-fill" style={{ width: `${calculateProfileCompletion()}%` }}></div>
                </div>
                <p className="completion-text">
                  {calculateProfileCompletion() < 50 ? 'Keep going! Complete your profile to get better job matches' : 
                   calculateProfileCompletion() < 80 ? 'Almost there! Complete your profile to get better job matches' : 
                   'Great job! Your profile is looking good'}
                </p>
                <div className="completion-actions">
                  <button className="btn btn-primary" onClick={() => navigate('/complete-profile')}>
                    <FontAwesomeIcon icon={faEdit} />
                    COMPLETE PROFILE
                  </button>
                  {calculateProfileCompletion() < 100 && (
                    <button className="btn btn-secondary" onClick={() => showSection('profile')}>
                      <FontAwesomeIcon icon={faUser} />
                      EDIT PROFILE
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                    <FontAwesomeIcon icon={faUserClock} />
                    </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.applications}</div>
                  <div className="stat-label">Applications Sent</div>
                  <div className="stat-subtitle">total applications</div>
                  </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                    <FontAwesomeIcon icon={faCalendar} />
                    </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.interviews}</div>
                  <div className="stat-label">Interviews Scheduled</div>
                  <div className="stat-subtitle">{stats.interviews > 0 ? 'Check your schedule' : 'No interviews yet'}</div>
                  </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                    <FontAwesomeIcon icon={faEye} />
                    </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.profileViews}</div>
                  <div className="stat-label">Profile Views</div>
                  <div className="stat-subtitle">total profile views</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.savedJobs}</div>
                      <div className="stat-label">Saved Jobs</div>
                  <div className="stat-subtitle">jobs saved for later</div>
                    </div>
                    </div>
                  </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-item">
                  <div className="activity-icon success">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <div className="activity-content">
                    <p>Great news! Your application for <strong>Senior Developer at TechCorp</strong> was viewed by the recruiter</p>
                    <span className="activity-time">2 hours ago</span>
                </div>
              </div>
                <div className="activity-item">
                  <div className="activity-icon info">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                  <div className="activity-content">
                    <p>New job match: <strong>Frontend Developer at Digital Solutions</strong> (95% match)</p>
                    <span className="activity-time">4 hours ago</span>
              </div>
                  </div>
                  </div>
                </div>
          )}

          {/* Jobs Section */}
          {activeSection === 'jobs' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Browse Jobs</h1>
                <div className="filters">
                  <select className="filter-select">
                    <option>All Locations</option>
                    <option>Nairobi</option>
                    <option>Remote</option>
                  </select>
                  <select className="filter-select">
                    <option>All Types</option>
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                  </select>
                  <select className="filter-select">
                    <option>Sort by</option>
                    <option>Relevance</option>
                    <option>Date Posted</option>
                    <option>Salary</option>
                  </select>
                    </div>
                  </div>

              <div className="jobs-grid">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div className="company-logo">{job.logo}</div>
                      <div className="job-info">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                        <div className="job-meta">
                          <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                          <span><FontAwesomeIcon icon={faBriefcase} /> {job.type}</span>
                          <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
                    </div>
                      </div>
                      {job.featured && <span className="featured-badge">Featured</span>}
                    </div>
                    <div className="job-skills">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="job-footer">
                      <div className="match-score">
                        <span className="match-percentage">{job.matchScore}% match</span>
                      </div>
                      <div className="job-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => saveJob(job.id)}>
                          <FontAwesomeIcon icon={faHeart} />
                      </button>
                        <button className="btn btn-primary btn-sm" onClick={() => applyToJob(job.id)}>
                          Apply Now
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>My Profile</h1>
                <button className="btn btn-primary" onClick={() => navigate('/complete-profile')}>
                  <FontAwesomeIcon icon={faEdit} />
                  Complete Profile
                </button>
              </div>

              {/* Basic Information Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Basic Information</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('basicInfo')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                <div className="profile-header">
                  <div className="profile-photo">
                    <div className="photo-placeholder">
                      {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'JS'}
                    </div>
                  </div>
                  <div className="profile-info">
                    {editingSections.basicInfo ? (
                      <>
                        <input 
                          type="text" 
                          value={profileData.fullName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="profile-input"
                          placeholder="Full Name"
                        />
                        <input 
                          type="text" 
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className="profile-input"
                          placeholder="Job Title"
                        />
                        <div className="edit-actions">
                          <button className="btn btn-sm btn-success" onClick={() => saveSection('basicInfo')}>
                            <FontAwesomeIcon icon={faSave} /> Save
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => cancelSectionEdit('basicInfo')}>
                            <FontAwesomeIcon icon={faTimes} /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2>{profileData.fullName || 'Not provided'}</h2>
                        <p className="job-title">{profileData.jobTitle || 'Job Seeker'}</p>
                        <div className="profile-meta">
                          <span><FontAwesomeIcon icon={faMail} /> {profileData.email || 'Not provided'}</span>
                          <span><FontAwesomeIcon icon={faPhone} /> {profileData.phone || 'Not provided'}</span>
                          <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData.location || 'Not provided'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Summary Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Professional Summary</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('summary')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                {editingSections.summary ? (
                  <div className="edit-section">
                    <textarea 
                      value={profileData.summary}
                      onChange={(e) => setProfileData(prev => ({ ...prev, summary: e.target.value }))}
                      className="profile-textarea"
                      rows="4"
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    />
                    <div className="edit-actions">
                      <button className="btn btn-sm btn-success" onClick={() => saveSection('summary')}>
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => cancelSectionEdit('summary')}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="summary-text">
                    {profileData.summary || 'Complete your profile to get better job matches. Add a professional summary to showcase your experience and goals.'}
                  </p>
                )}
              </div>

              {/* Experience & Skills Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Experience & Skills</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('experience')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                {editingSections.experience ? (
                  <div className="edit-section">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input 
                          type="text" 
                          value={profileData.experience}
                          onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                          className="form-input"
                          placeholder="e.g., 3-5 years"
                        />
                      </div>
                      <div className="form-group">
                        <label>Industry</label>
                        <input 
                          type="text" 
                          value={profileData.industry}
                          onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                          className="form-input"
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>
                      <div className="form-group">
                        <label>Availability</label>
                        <select 
                          value={profileData.availability}
                          onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
                          className="form-input"
                        >
                          <option value="Available Immediately">Available Immediately</option>
                          <option value="Available in 2 weeks">Available in 2 weeks</option>
                          <option value="Available in 1 month">Available in 1 month</option>
                          <option value="Open to opportunities">Open to opportunities</option>
                        </select>
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button className="btn btn-sm btn-success" onClick={() => saveSection('experience')}>
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => cancelSectionEdit('experience')}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="skills-grid">
                    <div className="skill-item">
                      <span className="skill-label">Experience</span>
                      <span className="skill-value">{profileData.experience || 'Not specified'}</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-label">Industry</span>
                      <span className="skill-value">{profileData.industry || 'Not specified'}</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-label">Availability</span>
                      <span className="skill-value">{profileData.availability || 'Not specified'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Skills</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('skills')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                <div className="skills-list">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <p className="empty-message">No skills added yet. Click Edit to add your skills.</p>
                  )}
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Work Experience</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('experience')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                {profileData.workExperience && profileData.workExperience.length > 0 ? (
                  profileData.workExperience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <h4>{exp.title}</h4>
                      <p className="company">{exp.company}</p>
                      <p className="duration">{exp.duration}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-message">No work experience added yet. Click Edit to add your experience.</p>
                )}
              </div>

              {/* Education Section */}
              <div className="profile-card">
                <div className="profile-section-header">
                  <h3>Education</h3>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleSectionEdit('education')}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                </div>
                
                {profileData.education && profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h4>{edu.degree}</h4>
                      <p className="institution">{edu.institution}</p>
                      <p className="duration">{edu.duration}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-message">No education information added yet. Click Edit to add your education.</p>
                )}
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === 'applications' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>My Applications</h1>
                <span className="application-count">{applications.length} applications</span>
                </div>

              <div className="applications-list">
                {applications.map(application => (
                  <div key={application.id} className="application-card">
                    <div className="application-info">
                      <h3>{application.jobTitle}</h3>
                      <p className="company-name">{application.company}</p>
                      <div className="application-meta">
                        <span>Applied: {application.appliedDate}</span>
                        <span className={`status-badge ${application.status.toLowerCase().replace(' ', '-')}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="application-actions">
                      <div className="match-score">
                        <span className="match-percentage">{application.matchScore}% match</span>
                      </div>
                      <button className="btn btn-secondary btn-sm">
                        <FontAwesomeIcon icon={faEye} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Jobs Section */}
          {activeSection === 'saved' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Saved Jobs</h1>
                <span className="saved-count">{savedJobs.length} saved jobs</span>
                </div>

              <div className="saved-jobs-list">
                {savedJobs.map(job => (
                  <div key={job.id} className="saved-job-card">
                    <div className="job-info">
                      <div className="company-logo">{job.logo}</div>
                      <div className="job-details">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                        <div className="job-meta">
                          <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                          <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
                          <span>Saved: {job.savedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => unsaveJob(job.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => applyToJob(job.id)}>
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interviews Section */}
          {activeSection === 'interviews' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Interviews</h1>
                <span className="interview-count">{interviews.length} interviews</span>
                </div>

              <div className="interviews-list">
                {interviews.map(interview => (
                  <div key={interview.id} className="interview-card">
                    <div className="interview-info">
                      <h3>{interview.jobTitle}</h3>
                      <p className="company-name">{interview.company}</p>
                      <div className="interview-meta">
                        <span><FontAwesomeIcon icon={faCalendar} /> {interview.date}</span>
                        <span><FontAwesomeIcon icon={faClock} /> {interview.time}</span>
                        <span><FontAwesomeIcon icon={faVideo} /> {interview.type}</span>
              </div>
                    </div>
                    <div className="interview-actions">
                      <span className={`status-badge ${interview.status.toLowerCase()}`}>
                        {interview.status}
                      </span>
                      <button className="btn btn-primary btn-sm">
                        Join Interview
                      </button>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Jobs Section */}
          {activeSection === 'recommended' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Recommended Jobs</h1>
                <span className="recommended-count">{recommendedJobs.length} recommendations</span>
                </div>

              <div className="recommended-jobs-list">
                {recommendedJobs.map(job => (
                  <div key={job.id} className="recommended-job-card">
                    <div className="job-header">
                      <div className="company-logo">{job.logo}</div>
                      <div className="job-info">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                        <div className="job-meta">
                          <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                          <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
              </div>
                        <p className="recommendation-reason">{job.reason}</p>
                </div>
                    </div>
                    <div className="job-footer">
                      <div className="match-score">
                        <span className="match-percentage">{job.matchScore}% match</span>
                      </div>
                      <div className="job-actions">
                        <button className="btn btn-secondary btn-sm">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <button className="btn btn-primary btn-sm">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Messages</h1>
              </div>
                <div className="empty-state">
                <FontAwesomeIcon icon={faEnvelope} />
                <h3>No Messages Yet</h3>
                <p>You'll see messages from recruiters and employers here</p>
              </div>
            </div>
          )}

          {/* Resume Section */}
          {activeSection === 'resume' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Resume/CV</h1>
                <button className="btn btn-primary">
                  <FontAwesomeIcon icon={faUpload} />
                  Upload Resume
                </button>
              </div>
              <div className="resume-card">
                <div className="resume-upload">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <h3>Upload Your Resume</h3>
                  <p>Drag and drop your resume here or click to browse</p>
                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faUpload} />
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Career Resources Section */}
          {activeSection === 'resources' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Career Resources</h1>
                </div>
              <div className="resources-grid">
                <div className="resource-card">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <h3>Interview Tips</h3>
                  <p>Prepare for your next interview with our expert tips</p>
                </div>
                <div className="resource-card">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <h3>Resume Builder</h3>
                  <p>Create a professional resume that stands out</p>
                </div>
                <div className="resource-card">
                  <FontAwesomeIcon icon={faUsers} />
                  <h3>Networking</h3>
                  <p>Connect with professionals in your industry</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Settings</h1>
        </div>
              <div className="settings-card">
                <h3>Account Settings</h3>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <label>Job Alerts</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <label>Privacy Mode</label>
                  <input type="checkbox" />
                </div>
                <button className="btn btn-danger" onClick={logout}>
                  <FontAwesomeIcon icon={faTimes} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
