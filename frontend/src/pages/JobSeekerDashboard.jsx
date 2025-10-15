import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, faBriefcase, faFileAlt, faBookmark, faCalendarCheck, 
  faStar, faEnvelope, faUser, faFilePdf, faBook, faCog, faBell, 
  faSearch, faPlus, faEdit, faSave, faTimes, faCheck, faEye,
  faPaperPlane, faUpload, faCertificate, faUserEdit, faVideo,
  faCalendar, faInfoCircle, faCheckCircle, faTrash, faDownload,
  faExternalLinkAlt, faArrowUp, faArrowDown, faFilter, faSort,
  faCopy, faShare, faMapMarkerAlt, faDollarSign, faLayerGroup,
  faClock, faGraduationCap, faCode, faBuilding, faLanguage,
  faLink, faGlobe, faQuestionCircle, faFileWord, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import dashboardService from '../services/dashboardService';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    location: '',
    nationality: '',
    summary: '',
    jobTitle: '',
    experience: '',
    industry: '',
    salary: '',
    jobType: '',
    availability: '',
    skills: [],
    softSkills: [],
    workExperience: [],
    education: [],
    certifications: [],
    languages: [],
    socialLinks: []
  });

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    savedJobs: 0,
    profileCompletion: 0
  });

  // Data States
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resumes, setResumes] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    if (user?.userId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data for user:', user.userId);

      const [
        profileResult,
        applicationsResult,
        jobsResult,
        savedJobsResult,
        recommendedJobsResult,
        interviewsResult,
        profileViewsResult
      ] = await Promise.allSettled([
        dashboardService.getJobSeekerProfile(),
        dashboardService.getJobSeekerApplications(),
        dashboardService.getJobSeekerJobs(),
        dashboardService.getSavedJobs(),
        dashboardService.getRecommendedJobs(),
        dashboardService.getInterviews(),
        dashboardService.getProfileViews()
      ]);

      // Process profile data
      if (profileResult.status === 'fulfilled') {
        const profile = profileResult.value;
        setProfileData({
          fullName: profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.firstName + ' ' + user?.lastName || 'User',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          dob: profile.dateOfBirth || '',
          location: profile.location || profile.currentCity || '',
          nationality: profile.nationality || '',
          summary: profile.summary || profile.professionalSummary || '',
          jobTitle: profile.professionalTitle || profile.currentJobTitle || '',
          experience: profile.yearsExperience || profile.yearsOfExperience || '',
          industry: profile.industry || '',
          salary: profile.expectedSalary || '',
          jobType: profile.jobTypePreference || '',
          availability: profile.availability || '',
          skills: profile.skills || [],
          softSkills: profile.softSkills || [],
          workExperience: profile.workExperience || [],
          education: profile.education || [],
          certifications: profile.certifications || [],
          languages: profile.languages || [],
          socialLinks: profile.socialLinks || []
        });

        // Calculate profile completion
        const completionPercentage = calculateProfileCompletion(profile);
        setDashboardStats(prev => ({ ...prev, profileCompletion: completionPercentage }));
      }

      // Process applications
      if (applicationsResult.status === 'fulfilled') {
        const apps = applicationsResult.value;
        setApplications(Array.isArray(apps) ? apps : []);
        setDashboardStats(prev => ({ ...prev, applications: Array.isArray(apps) ? apps.length : 0 }));
      }

      // Process jobs
      if (jobsResult.status === 'fulfilled') {
        const jobsData = jobsResult.value;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      }

      // Process saved jobs
      if (savedJobsResult.status === 'fulfilled') {
        const saved = savedJobsResult.value;
        setSavedJobs(Array.isArray(saved) ? saved : []);
        setDashboardStats(prev => ({ ...prev, savedJobs: Array.isArray(saved) ? saved.length : 0 }));
      }

      // Process recommended jobs
      if (recommendedJobsResult.status === 'fulfilled') {
        const recommended = recommendedJobsResult.value;
        setRecommendedJobs(Array.isArray(recommended) ? recommended : []);
      }

      // Process interviews
      if (interviewsResult.status === 'fulfilled') {
        const interviewData = interviewsResult.value;
        setInterviews(Array.isArray(interviewData) ? interviewData : []);
        setDashboardStats(prev => ({ ...prev, interviews: Array.isArray(interviewData) ? interviewData.length : 0 }));
      }

      // Process profile views
      if (profileViewsResult.status === 'fulfilled') {
        const views = profileViewsResult.value;
        setDashboardStats(prev => ({ ...prev, profileViews: views.count || views || 0 }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile) => {
    const fields = [
      profile.fullName || profile.firstName,
      profile.email,
      profile.phone,
      profile.location,
      profile.summary,
      profile.professionalTitle || profile.currentJobTitle,
      profile.yearsExperience,
      profile.skills?.length > 0,
      profile.education?.length > 0,
      profile.workExperience?.length > 0
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const toggleProfileEdit = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const saveProfile = async () => {
    try {
      await dashboardService.updateProfile(profileData);
      alert('Profile saved successfully!');
      setIsEditingProfile(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    fetchDashboardData(); // Reload original data
  };

  const toggleSwitch = (e) => {
    e.target.classList.toggle('active');
  };

  const getUserInitials = () => {
    if (profileData.fullName) {
      return profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'JS';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'applied': 'status-applied',
      'reviewing': 'status-reviewing',
      'interview': 'status-interview',
      'offered': 'status-offered',
      'rejected': 'status-rejected'
    };
    return statusMap[status?.toLowerCase()] || 'status-applied';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <FontAwesomeIcon icon={faClock} spin size="3x" color="#667eea" />
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> JobPortal</h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSection('jobs')}>
            <FontAwesomeIcon icon={faSearch} />
            <span>Browse Jobs</span>
            <span className="badge success">NEW</span>
          </div>
          <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => setActiveSection('applications')}>
            <FontAwesomeIcon icon={faFileAlt} />
            <span>My Applications</span>
            {dashboardStats.applications > 0 && <span className="badge">{dashboardStats.applications}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => setActiveSection('saved')}>
            <FontAwesomeIcon icon={faBookmark} />
            <span>Saved Jobs</span>
            {dashboardStats.savedJobs > 0 && <span className="badge">{dashboardStats.savedJobs}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => setActiveSection('interviews')}>
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Interviews</span>
            {dashboardStats.interviews > 0 && <span className="badge">{dashboardStats.interviews}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`} onClick={() => setActiveSection('matches')}>
            <FontAwesomeIcon icon={faStar} />
            <span>Recommended</span>
            {recommendedJobs.length > 0 && <span className="badge">{recommendedJobs.length}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Messages</span>
            {messages.length > 0 && <span className="badge">{messages.length}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>
            <FontAwesomeIcon icon={faUser} />
            <span>My Profile</span>
          </div>
          <div className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} onClick={() => setActiveSection('resume')}>
            <FontAwesomeIcon icon={faFilePdf} />
            <span>Resume/CV</span>
          </div>
          <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => setActiveSection('resources')}>
            <FontAwesomeIcon icon={faBook} />
            <span>Career Resources</span>
          </div>
          <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
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
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
            <div className="user-profile" onClick={() => setActiveSection('profile')}>
              <div className="user-avatar">{getUserInitials()}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{profileData.fullName || 'User'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{profileData.jobTitle || 'Job Seeker'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Welcome back, {profileData.fullName?.split(' ')[0] || 'there'}! 👋</h1>

            {/* Profile Completion */}
            <div className="profile-completion">
              <div className="completion-header">
                <div>
                  <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                  <p style={{ opacity: 0.9, fontSize: '14px' }}>{dashboardStats.profileCompletion}% Complete - {dashboardStats.profileCompletion >= 75 ? 'Almost there!' : 'Keep going!'}</p>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>{dashboardStats.profileCompletion}%</div>
              </div>
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${dashboardStats.profileCompletion}%` }}></div>
              </div>
              <div className="completion-actions">
                <button className="btn" onClick={() => setActiveSection('profile')}>
                  <FontAwesomeIcon icon={faPlus} /> Add Skills
                </button>
                <button className="btn" onClick={() => setActiveSection('resume')}>
                  <FontAwesomeIcon icon={faUpload} /> Upload Resume
                </button>
                <button className="btn" onClick={() => setActiveSection('profile')}>
                  <FontAwesomeIcon icon={faCertificate} /> Add Certifications
                </button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-number">{dashboardStats.applications}</div>
                    <div className="stat-label">Applications Sent</div>
                  </div>
                  <div className="stat-icon blue">
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </div>
                </div>
                <div className="stat-change positive">
                  <FontAwesomeIcon icon={faArrowUp} /> {Math.floor(dashboardStats.applications / 4) || 0} this week
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-number">{dashboardStats.interviews}</div>
                    <div className="stat-label">Interviews Scheduled</div>
                  </div>
                  <div className="stat-icon green">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </div>
                </div>
                <div className="stat-change">
                  {dashboardStats.interviews > 0 ? 'Next: Check schedule' : 'No interviews yet'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-number">{dashboardStats.profileViews}</div>
                    <div className="stat-label">Profile Views</div>
                  </div>
                  <div className="stat-icon purple">
                    <FontAwesomeIcon icon={faEye} />
                  </div>
                </div>
                <div className="stat-change positive">
                  <FontAwesomeIcon icon={faArrowUp} /> Growing visibility
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-number">{dashboardStats.savedJobs}</div>
                    <div className="stat-label">Saved Jobs</div>
                  </div>
                  <div className="stat-icon orange">
                    <FontAwesomeIcon icon={faBookmark} />
                  </div>
                </div>
                <div className="stat-change">
                  {recommendedJobs.length} new matches today
                </div>
              </div>
            </div>

            {/* Success Alert */}
            {applications.length > 0 && applications[0]?.status === 'reviewing' && (
              <div className="alert success">
                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px' }} />
                <div>
                  <strong>Great news!</strong> Your application was viewed by the recruiter.
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* Recommended Jobs */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recommended for You</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('matches')}>View All</button>
                </div>
                {recommendedJobs.slice(0, 3).map(job => (
                  <JobCard key={job._id || job.id} job={job} />
                ))}
                {recommendedJobs.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No recommended jobs yet</p>
                )}
              </div>

              {/* Upcoming Interviews & Quick Actions */}
              <div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Upcoming Interviews</h3>
                  </div>
                  {interviews.slice(0, 2).map(interview => (
                    <InterviewCardSmall key={interview._id || interview.id} interview={interview} />
                  ))}
                  {interviews.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No upcoming interviews</p>
                  )}
                </div>

                <div className="card" style={{ marginTop: '20px' }}>
                  <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setActiveSection('jobs')}>
                      <FontAwesomeIcon icon={faSearch} /> Browse Jobs
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveSection('resume')}>
                      <FontAwesomeIcon icon={faUpload} /> Update Resume
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveSection('profile')}>
                      <FontAwesomeIcon icon={faUserEdit} /> Edit Profile
                    </button>
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
                    {applications.slice(0, 5).map(app => (
                      <tr key={app._id || app.id}>
                        <td><strong>{app.jobTitle || app.job?.title || 'N/A'}</strong></td>
                        <td>{app.company || app.job?.company || 'N/A'}</td>
                        <td>{formatDate(app.appliedDate || app.createdAt)}</td>
                        <td><span className={`status-badge ${getStatusClass(app.status)}`}>{app.status || 'Applied'}</span></td>
                        <td>
                          <button className="btn btn-secondary btn-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {applications.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No applications yet. Start applying to jobs!</p>
                )}
              </div>
            </div>
          </div>

          {/* Browse Jobs Section */}
          <div className={`page-section ${activeSection === 'jobs' ? 'active' : ''}`}>
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
              {jobs.map(job => (
                <JobCard key={job._id || job.id} job={job} showApplyButton />
              ))}
              {jobs.length === 0 && (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <h3>No Jobs Available</h3>
                  <p>Check back later for new opportunities</p>
                </div>
              )}
            </div>
          </div>

          {/* My Applications Section */}
          <div className={`page-section ${activeSection === 'applications' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

            <div className="filters">
              <select className="filter-select">
                <option>All Applications ({applications.length})</option>
                <option>Under Review ({applications.filter(a => a.status === 'reviewing').length})</option>
                <option>Interview ({applications.filter(a => a.status === 'interview').length})</option>
                <option>Offered ({applications.filter(a => a.status === 'offered').length})</option>
                <option>Rejected ({applications.filter(a => a.status === 'rejected').length})</option>
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
                    {applications.map(app => (
                      <tr key={app._id || app.id}>
                        <td><strong>{app.jobTitle || app.job?.title || 'N/A'}</strong></td>
                        <td>{app.company || app.job?.company || 'N/A'}</td>
                        <td>{app.location || app.job?.location || 'N/A'}</td>
                        <td>{formatDate(app.appliedDate || app.createdAt)}</td>
                        <td><span className={`status-badge ${getStatusClass(app.status)}`}>{app.status || 'Applied'}</span></td>
                        <td>
                          <button className="btn btn-secondary btn-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {applications.length === 0 && (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faFileAlt} />
                    <h3>No Applications Yet</h3>
                    <p>Start your career journey by applying to jobs</p>
                    <button className="btn btn-primary" onClick={() => setActiveSection('jobs')}>
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Jobs Section */}
          <div className={`page-section ${activeSection === 'saved' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
            <div className="card">
              {savedJobs.map(job => (
                <JobCard key={job._id || job.id} job={job} showUnsaveButton />
              ))}
              {savedJobs.length === 0 && (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faBookmark} />
                  <h3>No Saved Jobs</h3>
                  <p>Save jobs you're interested in to review later</p>
                  <button className="btn btn-primary" onClick={() => setActiveSection('jobs')}>
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interviews Section */}
          <div className={`page-section ${activeSection === 'interviews' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
            
            <div className="alert info">
              <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '24px' }} />
              <div>
                <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
              </div>
            </div>

            {interviews.map(interview => (
              <InterviewCard key={interview._id || interview.id} interview={interview} />
            ))}
            
            {interviews.length === 0 && (
              <div className="card">
                <div className="empty-state">
                  <FontAwesomeIcon icon={faCalendar} />
                  <h3>No Interviews Scheduled</h3>
                  <p>Your upcoming interviews will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Jobs Section */}
          <div className={`page-section ${activeSection === 'matches' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
            <div className="alert success">
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
              <div>
                Based on your profile and preferences, we found <strong>{recommendedJobs.length} jobs</strong> that match your skills!
              </div>
            </div>
            <div className="card">
              {recommendedJobs.map(job => (
                <JobCard key={job._id || job.id} job={job} showApplyButton />
              ))}
              {recommendedJobs.length === 0 && (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faStar} />
                  <h3>No Recommendations Yet</h3>
                  <p>Complete your profile to get personalized job recommendations</p>
                  <button className="btn btn-primary" onClick={() => setActiveSection('profile')}>
                    Complete Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Section */}
          <div className={`page-section ${activeSection === 'messages' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Messages</h1>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Inbox</h3>
                <button className="btn btn-primary btn-sm">
                  <FontAwesomeIcon icon={faPlus} /> New Message
                </button>
              </div>
              <div className="message-list">
                {messages.map(message => (
                  <MessageItem key={message._id || message.id} message={message} />
                ))}
                {messages.length === 0 && (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <h3>No Messages</h3>
                    <p>Your messages from recruiters will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className={`page-section ${activeSection === 'profile' ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h1>My Profile</h1>
              <div>
                {!isEditingProfile ? (
                  <button className="btn btn-primary" onClick={toggleProfileEdit}>
                    <FontAwesomeIcon icon={faEdit} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={saveProfile}>
                      <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={cancelProfileEdit} style={{ marginLeft: '10px' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Header */}
            <div className="profile-header-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div className="profile-avatar-large">{getUserInitials()}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>{profileData.fullName}</h2>
                  <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>{profileData.jobTitle || 'Job Seeker'}</p>
                  <p style={{ opacity: 0.8 }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData.location || 'Location not set'}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className={`card ${!isEditingProfile ? 'profile-view-mode' : ''}`}>
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
              </div>
              <div className="profile-info-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.fullName} 
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={profileData.dob}
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.nationality}
                    onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea 
                  className="form-textarea" 
                  value={profileData.summary}
                  onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                  disabled={!isEditingProfile}
                  placeholder="Describe your professional background and career goals..."
                />
              </div>
            </div>

            {/* Professional Details */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Professional Details</h3>
              </div>
              <div className="profile-info-grid">
                <div className="form-group">
                  <label className="form-label">Current Job Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <select 
                    className="form-select" 
                    value={profileData.industry}
                    onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                    disabled={!isEditingProfile}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Salary (USD)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.salary}
                    onChange={(e) => setProfileData({...profileData, salary: e.target.value})}
                    disabled={!isEditingProfile}
                    placeholder="e.g., $80,000 - $100,000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type Preference</label>
                  <select 
                    className="form-select" 
                    value={profileData.jobType}
                    onChange={(e) => setProfileData({...profileData, jobType: e.target.value})}
                    disabled={!isEditingProfile}
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select 
                    className="form-select" 
                    value={profileData.availability}
                    onChange={(e) => setProfileData({...profileData, availability: e.target.value})}
                    disabled={!isEditingProfile}
                  >
                    <option value="">Select Availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faCode} /> Skills & Expertise</h3>
              </div>
              <div>
                <h4 style={{ marginBottom: '15px', color: '#666' }}>Technical Skills</h4>
                <div>
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {profileData.skills.length === 0 && (
                    <p style={{ color: '#999' }}>No skills added yet</p>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '25px' }}>
                <h4 style={{ marginBottom: '15px', color: '#666' }}>Soft Skills</h4>
                <div>
                  {profileData.softSkills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {profileData.softSkills.length === 0 && (
                    <p style={{ color: '#999' }}>No soft skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Work Experience</h3>
              </div>
              {profileData.workExperience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title || exp.jobTitle}</h4>
                  <div className="company">{exp.company}</div>
                  <div className="duration">{exp.startDate} - {exp.endDate || 'Present'} ({exp.duration || ''})</div>
                  <p style={{ color: '#666', marginTop: '10px' }}>{exp.description}</p>
                </div>
              ))}
              {profileData.workExperience.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No work experience added yet</p>
              )}
            </div>

            {/* Education */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
              </div>
              {profileData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree}</h4>
                  <div className="institution">{edu.institution || edu.school}</div>
                  <div className="duration">{edu.startYear} - {edu.endYear || 'Present'}</div>
                  <p style={{ color: '#666', marginTop: '10px' }}>{edu.description}</p>
                </div>
              ))}
              {profileData.education.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No education added yet</p>
              )}
            </div>

            {/* Certifications */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Awards</h3>
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                {profileData.certifications.map((cert, index) => (
                  <div key={index} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{cert.name || cert.title}</h4>
                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                          {cert.issuer} - {cert.year}
                        </p>
                      </div>
                      <span className="status-badge status-offered">Verified</span>
                    </div>
                  </div>
                ))}
                {profileData.certifications.length === 0 && (
                  <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No certifications added yet</p>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
              </div>
              <div className="profile-info-grid">
                {profileData.languages.map((lang, index) => (
                  <div key={index}>
                    <h4 style={{ marginBottom: '10px' }}>{lang.language || lang.name}</h4>
                    <p style={{ color: '#666' }}>{lang.proficiency || lang.level}</p>
                  </div>
                ))}
                {profileData.languages.length === 0 && (
                  <p style={{ color: '#999' }}>No languages added yet</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Social Links</h3>
              </div>
              <div className="social-links">
                {profileData.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={link.platform === 'linkedin' ? faLinkedin : link.platform === 'github' ? faGithub : link.platform === 'twitter' ? faTwitter : faGlobe} />
                    <span>{link.url}</span>
                  </a>
                ))}
                {profileData.socialLinks.length === 0 && (
                  <p style={{ color: '#999' }}>No social links added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className={`page-section ${activeSection === 'resume' ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h1>Resume/CV Management</h1>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faUpload} /> Upload New Resume
              </button>
            </div>

            <div className="card">
              <div className="resume-list">
                {resumes.length === 0 && (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faFilePdf} />
                    <h3>No Resumes Uploaded</h3>
                    <p>Upload your resume to apply for jobs faster</p>
                    <button className="btn btn-primary">
                      <FontAwesomeIcon icon={faUpload} /> Upload Resume
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faEdit} /> Resume Builder</h3>
              </div>
              <p style={{ marginBottom: '20px', color: '#666' }}>Create a professional resume using our easy-to-use template builder.</p>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} /> Create New Resume
              </button>
            </div>
          </div>

          {/* Career Resources Section */}
          <div className={`page-section ${activeSection === 'resources' ? 'active' : ''}`}>
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
                <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faGraduationCap} /> Online Courses</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>Upskill with courses and certifications from top providers.</p>
                <button className="btn btn-secondary btn-sm">Browse Courses</button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faUser} /> Career Advice</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>Get personalized guidance from career experts and mentors.</p>
                <button className="btn btn-secondary btn-sm">Get Advice</button>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className={`page-section ${activeSection === 'settings' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Settings</h1>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faBell} /> Notification Preferences</h3>
              </div>
              <div className="settings-section">
                <div className="settings-item">
                  <div>
                    <h4>Email Notifications</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive job alerts and updates via email</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Application Updates</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get notified about application status changes</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Interview Reminders</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive reminders for scheduled interviews</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Job Recommendations</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get personalized job recommendations</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Privacy Settings</h3>
              </div>
              <div className="settings-section">
                <div className="settings-item">
                  <div>
                    <h4>Profile Visibility</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Make your profile visible to employers</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Show Online Status</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Display when you're active on the platform</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Allow Contact from Recruiters</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Let recruiters send you messages</p>
                  </div>
                  <div className="toggle-switch active" onClick={toggleSwitch}></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Account Security</h3>
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>Change Password</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Last changed 3 months ago</p>
                  </div>
                  <button className="btn btn-secondary btn-sm">Change</button>
                </div>
                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>Two-Factor Authentication</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Add an extra layer of security</p>
                  </div>
                  <button className="btn btn-primary btn-sm">Enable</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><FontAwesomeIcon icon={faExclamationTriangle} /> Danger Zone</h3>
              </div>
              <div style={{ padding: '20px', background: '#fff5f5', border: '2px solid #fee', borderRadius: '8px' }}>
                <h4 style={{ color: '#d32f2f', marginBottom: '10px' }}>Delete Account</h4>
                <p style={{ color: '#666', marginBottom: '15px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn btn-danger">
                  <FontAwesomeIcon icon={faTrash} /> Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Job Card Component
const JobCard = ({ job, showApplyButton, showUnsaveButton }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">
            {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
          </div>
          <div className="job-info">
            <h3>{job.title || job.jobTitle}</h3>
            <div className="job-company">{job.company || job.companyName}</div>
            <div className="job-meta">
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Not specified'}</span>
              <span><FontAwesomeIcon icon={faBriefcase} /> {job.type || job.jobType || 'Full-time'}</span>
              <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experienceLevel || 'Mid Level'}</span>
              {job.salary && <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>}
            </div>
          </div>
        </div>
        <div className="job-actions">
          {showUnsaveButton ? (
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
        {job.skills?.slice(0, 4).map((skill, index) => (
          <span key={index} className="tag">{skill}</span>
        ))}
        <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
          <FontAwesomeIcon icon={faClock} /> {job.postedDate || 'Recently'}
        </span>
      </div>
      {showApplyButton && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm">
            <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
          </button>
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={faEye} /> View Details
          </button>
        </div>
      )}
    </div>
  );
};

// Interview Card Small (for dashboard)
const InterviewCardSmall = ({ interview }) => {
  const interviewDate = new Date(interview.date || interview.interviewDate);
  
  return (
    <div className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle || interview.job?.title}</h4>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{interview.company || interview.job?.company}</p>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div><FontAwesomeIcon icon={faClock} /> {interview.time}</div>
            <div style={{ marginTop: '5px' }}><FontAwesomeIcon icon={faVideo} /> {interview.type || 'Video Interview'}</div>
          </div>
        </div>
        <div className="interview-date">
          <div className="day">{interviewDate.getDate()}</div>
          <div className="month">{interviewDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
        </div>
      </div>
      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }}>
        <FontAwesomeIcon icon={faCalendar} /> View Details
      </button>
    </div>
  );
};

// Interview Card Full (for interviews section)
const InterviewCard = ({ interview }) => {
  const interviewDate = new Date(interview.date || interview.interviewDate);
  
  return (
    <div className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '5px' }}>{interview.jobTitle || interview.job?.title}</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>{interview.company || interview.job?.company}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
            <div><FontAwesomeIcon icon={faCalendar} /> {formatDate(interview.date)}</div>
            <div><FontAwesomeIcon icon={faClock} /> {interview.time}</div>
            <div><FontAwesomeIcon icon={faVideo} /> {interview.type || 'Video Interview'}</div>
            <div><FontAwesomeIcon icon={faUser} /> {interview.interviewer || 'TBD'}</div>
          </div>
        </div>
        <div className="interview-date">
          <div className="day">{interviewDate.getDate()}</div>
          <div className="month">{interviewDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
        </div>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faVideo} /> Join Interview
        </button>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faCalendar} /> Reschedule
        </button>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faInfoCircle} /> Details
        </button>
      </div>
    </div>
  );
};

// Message Item Component
const MessageItem = ({ message }) => {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  return (
    <div className={`message-item ${message.unread ? 'unread' : ''}`}>
      <div className="message-avatar">{getInitials(message.sender || message.from)}</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{message.sender || message.from}</span>
          <span className="message-time">{message.time || formatDate(message.createdAt)}</span>
        </div>
        <div className="message-preview">{message.preview || message.message}</div>
      </div>
    </div>
  );
};

// Helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
};

export default JobSeekerDashboard;

