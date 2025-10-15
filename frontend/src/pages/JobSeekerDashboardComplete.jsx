import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faBriefcase, faCalendar, faBookmark,
  faStar, faEnvelope, faCog, faThLarge, faFileAlt, faFilePdf, faBook,
  faPaperPlane, faEye, faMapMarkerAlt, faDollarSign, faLayerGroup,
  faClock, faPlus, faUpload, faCertificate, faArrowUp, faCheckCircle,
  faQuestionCircle, faCalendarCheck, faTrash, faEdit, faSave, faTimes,
  faDownload, faInfoCircle, faExclamationTriangle, faCode, faBuilding,
  faGraduationCap, faLanguage, faLink, faLinkedin, faGithub, faGlobe, faTwitter
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboardComplete = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      applications: 0,
      interviews: 0,
      profileViews: 0,
      savedJobs: 0
    },
    profileCompletion: 75,
    applications: [],
    interviews: [],
    jobs: [],
    savedJobs: [],
    messages: [],
    resumes: [],
    profile: null
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [
        analyticsRes,
        applicationsRes,
        jobsRes,
        profileViewsRes
      ] = await Promise.all([
        axios.get(buildApiUrl('/api/analytics/jobseeker'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/application-tracker/jobseeker'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/jobs/fetch_all_jobs')).catch(() => null),
        axios.get(buildApiUrl('/api/dashboard/profile/views'), { headers }).catch(() => null)
      ]);

      // Process data
      setDashboardData({
        stats: {
          applications: analyticsRes?.data?.applications?.total || 0,
          interviews: analyticsRes?.data?.responses?.interviews || 0,
          profileViews: profileViewsRes?.data?.length || 0,
          savedJobs: 0
        },
        profileCompletion: 75,
        applications: applicationsRes?.data?.applications || [],
        interviews: [],
        jobs: jobsRes?.data?.jobs || [],
        savedJobs: [],
        messages: [],
        resumes: [],
        profile: user
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'JS';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'JS';
  };

  const getUserName = () => {
    if (!user) return 'Job Seeker';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Job Seeker';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faBriefcase} spin size="3x" />
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h2>
            <FontAwesomeIcon icon={faBriefcase} /> AksharJobs
          </h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveSection('jobs')}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Browse Jobs</span>
            <span className="badge success">NEW</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveSection('applications')}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            <span>My Applications</span>
            <span className="badge">{dashboardData.stats.applications}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveSection('saved')}
          >
            <FontAwesomeIcon icon={faBookmark} />
            <span>Saved Jobs</span>
            <span className="badge">{dashboardData.stats.savedJobs}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`}
            onClick={() => setActiveSection('interviews')}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Interviews</span>
            <span className="badge">{dashboardData.stats.interviews}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveSection('matches')}
          >
            <FontAwesomeIcon icon={faStar} />
            <span>Recommended</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveSection('messages')}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Messages</span>
            <span className="badge">5</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>My Profile</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveSection('resume')}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            <span>Resume/CV</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveSection('resources')}
          >
            <FontAwesomeIcon icon={faBook} />
            <span>Career Resources</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
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
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{getUserName()}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user?.currentJobTitle || 'Job Seeker'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && <DashboardSection dashboardData={dashboardData} user={user} setActiveSection={setActiveSection} />}
          
          {/* Browse Jobs Section */}
          {activeSection === 'jobs' && <BrowseJobsSection jobs={dashboardData.jobs} />}
          
          {/* Applications Section */}
          {activeSection === 'applications' && <ApplicationsSection applications={dashboardData.applications} />}
          
          {/* Saved Jobs Section */}
          {activeSection === 'saved' && <SavedJobsSection savedJobs={dashboardData.savedJobs} />}
          
          {/* Interviews Section */}
          {activeSection === 'interviews' && <InterviewsSection interviews={dashboardData.interviews} />}
          
          {/* Recommended Jobs Section */}
          {activeSection === 'matches' && <RecommendedSection jobs={dashboardData.jobs} />}
          
          {/* Messages Section */}
          {activeSection === 'messages' && <MessagesSection messages={dashboardData.messages} />}
          
          {/* Profile Section */}
          {activeSection === 'profile' && <ProfileSection profile={user} editMode={profileEditMode} setEditMode={setProfileEditMode} />}
          
          {/* Resume Section */}
          {activeSection === 'resume' && <ResumeSection resumes={dashboardData.resumes} />}
          
          {/* Career Resources Section */}
          {activeSection === 'resources' && <CareerResourcesSection />}
          
          {/* Settings Section */}
          {activeSection === 'settings' && <SettingsSection handleLogout={handleLogout} />}
        </div>
      </div>
    </>
  );
};

// Component implementations below
const DashboardSection = ({ dashboardData, user, setActiveSection }) => (
  <div className="page-section active">
    <h1 style={{ marginBottom: '25px' }}>Welcome back, {user?.firstName || 'there'}! 👋</h1>

    {/* Profile Completion */}
    <div className="profile-completion">
      <div className="completion-header">
        <div>
          <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>
            {dashboardData.profileCompletion}% Complete - Almost there!
          </p>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 700 }}>
          {dashboardData.profileCompletion}%
        </div>
      </div>
      <div className="completion-bar">
        <div 
          className="completion-fill" 
          style={{ width: `${dashboardData.profileCompletion}%` }}
        ></div>
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
            <div className="stat-number">{dashboardData.stats.applications}</div>
            <div className="stat-label">Applications Sent</div>
          </div>
          <div className="stat-icon blue">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
        <div className="stat-change positive">
          <FontAwesomeIcon icon={faArrowUp} /> 3 this week
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.interviews}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
          <div className="stat-icon green">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
        </div>
        <div className="stat-change">
          Next: Tomorrow at 2:00 PM
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.profileViews}</div>
            <div className="stat-label">Profile Views</div>
          </div>
          <div className="stat-icon purple">
            <FontAwesomeIcon icon={faEye} />
          </div>
        </div>
        <div className="stat-change positive">
          <FontAwesomeIcon icon={faArrowUp} /> +18% from last week
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.savedJobs}</div>
            <div className="stat-label">Saved Jobs</div>
          </div>
          <div className="stat-icon orange">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </div>
        <div className="stat-change">
          2 new matches today
        </div>
      </div>
    </div>

    {/* Alerts */}
    <div className="alert success">
      <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px' }} />
      <div>
        <strong>Great news!</strong> Your application for Senior Developer at TechCorp was viewed by the recruiter.
      </div>
    </div>

    {/* Main Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recommended for You</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('matches')}>
            View All
          </button>
        </div>
        <div>
          {dashboardData.jobs.slice(0, 3).map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
          {dashboardData.jobs.length === 0 && (
            <div className="empty-state">
              <p>No jobs available at the moment</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Interviews</h3>
          </div>
          <div>
            {dashboardData.interviews.length > 0 ? (
              dashboardData.interviews.slice(0, 3).map((interview, index) => (
                <InterviewCard key={index} interview={interview} />
              ))
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                No upcoming interviews
              </p>
            )}
          </div>
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
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Applications */}
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-header">
        <h3 className="card-title">Recent Applications</h3>
        <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('applications')}>
          View All
        </button>
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
            {dashboardData.applications.slice(0, 5).map((app, index) => (
              <ApplicationRow key={index} application={app} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const BrowseJobsSection = ({ jobs }) => (
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
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} showApplyButton />
      ))}
      {jobs.length === 0 && (
        <div className="empty-state">
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Jobs Found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  </div>
);

const ApplicationsSection = ({ applications }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

    <div className="filters">
      <select className="filter-select">
        <option>All Applications ({applications.length})</option>
        <option>Under Review</option>
        <option>Interview</option>
        <option>Offered</option>
        <option>Rejected</option>
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
            {applications.map((app, index) => (
              <ApplicationRow key={index} application={app} detailed />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const SavedJobsSection = ({ savedJobs }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
    <div className="card">
      {savedJobs.length > 0 ? (
        savedJobs.map((job, index) => (
          <JobCard key={index} job={job} showUnsaveBtn />
        ))
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Saved Jobs</h3>
          <p>Bookmark jobs you're interested in to view them later</p>
        </div>
      )}
    </div>
  </div>
);

const InterviewsSection = ({ interviews }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
    
    <div className="alert info">
      <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '24px' }} />
      <div>
        <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
      </div>
    </div>

    {interviews.length > 0 ? (
      interviews.map((interview, index) => (
        <InterviewCard key={index} interview={interview} detailed />
      ))
    ) : (
      <div className="card">
        <div className="empty-state">
          <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Interviews Scheduled</h3>
          <p>Your upcoming interviews will appear here</p>
        </div>
      </div>
    )}
  </div>
);

const RecommendedSection = ({ jobs }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
    <div className="alert success">
      <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
      <div>
        Based on your profile and preferences, we found <strong>{jobs.length} jobs</strong> that match your skills!
      </div>
    </div>
    <div className="card">
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} showApplyButton />
      ))}
    </div>
  </div>
);

const MessagesSection = ({ messages }) => (
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
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageItem key={index} message={message} />
          ))
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '64px', color: '#ccc' }} />
            <h3>No Messages</h3>
            <p>Your messages from recruiters will appear here</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ProfileSection = ({ profile, editMode, setEditMode }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>My Profile</h1>
      <div>
        {!editMode ? (
          <button className="btn btn-primary" onClick={() => setEditMode(true)}>
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </button>
        ) : (
          <>
            <button className="btn btn-success" onClick={() => setEditMode(false)}>
              <FontAwesomeIcon icon={faSave} /> Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ marginLeft: '10px' }}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </>
        )}
      </div>
    </div>

    {/* Profile Header */}
    <div className="profile-header-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div className="profile-avatar-large">
          {profile?.firstName?.charAt(0) || 'J'}{profile?.lastName?.charAt(0) || 'S'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>
            {profile?.firstName || 'John'} {profile?.lastName || 'Smith'}
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>
            {profile?.currentJobTitle || 'Job Seeker'}
          </p>
          <p style={{ opacity: 0.8 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {profile?.location || 'Location not set'}
          </p>
        </div>
      </div>
    </div>

    {/* Personal Information */}
    <div className={`card ${!editMode ? 'profile-view-mode' : ''}`}>
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
      </div>
      <div className="profile-info-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" value={`${profile?.firstName || ''} ${profile?.lastName || ''}`} disabled={!editMode} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" value={profile?.email || ''} disabled={!editMode} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-input" value={profile?.phone || ''} disabled={!editMode} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input type="text" className="form-input" value={profile?.location || ''} disabled={!editMode} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea className="form-textarea" disabled={!editMode} 
          defaultValue="Experienced professional seeking new opportunities..."
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
          <input type="text" className="form-input" value={profile?.currentJobTitle || ''} disabled={!editMode} />
        </div>
        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input type="number" className="form-input" value={profile?.experience || 0} disabled={!editMode} />
        </div>
        <div className="form-group">
          <label className="form-label">Industry</label>
          <select className="form-select" disabled={!editMode}>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Expected Salary</label>
          <input type="text" className="form-input" placeholder="$80,000 - $100,000" disabled={!editMode} />
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
          {['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ResumeSection = ({ resumes }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Resume/CV Management</h1>
      <button className="btn btn-primary">
        <FontAwesomeIcon icon={faUpload} /> Upload New Resume
      </button>
    </div>

    <div className="card">
      {resumes.length > 0 ? (
        <div className="resume-list">
          {resumes.map((resume, index) => (
            <div key={index} className="resume-item">
              <div className="resume-icon">
                <FontAwesomeIcon icon={faFilePdf} />
              </div>
              <div className="resume-info">
                <h4>{resume.name}</h4>
                <div className="resume-meta">
                  <span><FontAwesomeIcon icon={faCalendar} /> {resume.uploaded}</span>
                  <span style={{ marginLeft: '15px' }}><FontAwesomeIcon icon={faFileAlt} /> {resume.size}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary btn-sm">
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
                <button className="btn btn-secondary btn-sm">
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                <button className="btn btn-danger btn-sm">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Resumes Uploaded</h3>
          <p>Upload your resume to apply for jobs</p>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faUpload} /> Upload Resume
          </button>
        </div>
      )}
    </div>
  </div>
);

const CareerResourcesSection = () => (
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
        <button className="btn btn-secondary btn-sm">Start Building</button>
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
);

const SettingsSection = ({ handleLogout }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Settings</h1>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faBell} /> Notification Preferences</h3>
      </div>
      <div className="settings-section">
        <SettingItem title="Email Notifications" description="Receive job alerts and updates via email" />
        <SettingItem title="Application Updates" description="Get notified about application status changes" />
        <SettingItem title="Interview Reminders" description="Receive reminders for scheduled interviews" />
        <SettingItem title="Job Recommendations" description="Get personalized job recommendations" />
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faCog} /> Account Actions</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="btn btn-secondary">Change Password</button>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  </div>
);

// Helper Components
const JobCard = ({ job, showApplyButton = false, showUnsaveBtn = false }) => {
  const getCompanyInitials = (company) => {
    if (!company) return 'CO';
    return company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">
            {getCompanyInitials(job.companyName || job.company)}
          </div>
          <div className="job-info">
            <h3>{job.jobTitle || job.title}</h3>
            <div className="job-company">{job.companyName || job.company}</div>
            <div className="job-meta">
              <span>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Not specified'}
              </span>
              <span>
                <FontAwesomeIcon icon={faBriefcase} /> {job.jobType || 'Full-time'}
              </span>
              <span>
                <FontAwesomeIcon icon={faLayerGroup} /> {job.experienceLevel || 'Mid-level'}
              </span>
              {job.salary && (
                <span>
                  <FontAwesomeIcon icon={faDollarSign} /> {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="job-actions">
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={showUnsaveBtn ? faBookmark : faBookmark} />
          </button>
        </div>
      </div>
      {job.skills && job.skills.length > 0 && (
        <div className="job-tags">
          {job.skills.map((skill, index) => (
            <span key={index} className="tag">{skill}</span>
          ))}
        </div>
      )}
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

const InterviewCard = ({ interview, detailed = false }) => {
  if (!detailed) {
    return (
      <div className="interview-card">
        <div className="interview-date">
          <div className="day">{interview?.day || '00'}</div>
          <div className="month">{interview?.month || 'JAN'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '5px' }}>{interview?.jobTitle || 'Interview'}</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{interview?.company}</p>
          <p style={{ color: '#999', fontSize: '13px' }}>
            <FontAwesomeIcon icon={faClock} /> {interview?.time || 'TBD'} • {interview?.type || 'Video Interview'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '5px' }}>{interview?.jobTitle}</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>{interview?.company}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
            <div><FontAwesomeIcon icon={faCalendar} /> {interview?.date}</div>
            <div><FontAwesomeIcon icon={faClock} /> {interview?.time}</div>
            <div><FontAwesomeIcon icon={faUser} /> {interview?.type}</div>
          </div>
        </div>
        <div className="interview-date">
          <div className="day">{interview?.day}</div>
          <div className="month">{interview?.month}</div>
        </div>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faCalendarCheck} /> Join Interview
        </button>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faCalendar} /> Reschedule
        </button>
      </div>
    </div>
  );
};

const ApplicationRow = ({ application, detailed = false }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'applied': 'status-applied',
      'under-review': 'status-reviewing',
      'interview': 'status-interview',
      'offered': 'status-offered',
      'rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-applied';
  };

  const getStatusText = (status) => {
    const textMap = {
      'applied': 'Applied',
      'under-review': 'Under Review',
      'interview': 'Interview',
      'offered': 'Offered',
      'rejected': 'Rejected'
    };
    return textMap[status] || 'Applied';
  };

  return (
    <tr>
      <td><strong>{application.jobTitle || application.job?.jobTitle}</strong></td>
      <td>{application.company || application.job?.companyName}</td>
      {detailed && <td>{application.location || application.job?.location}</td>}
      <td>{application.appliedDate || 'Recently'}</td>
      <td>
        <span className={`status-badge ${getStatusClass(application.status)}`}>
          {getStatusText(application.status)}
        </span>
      </td>
      <td>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faEye} />
        </button>
      </td>
    </tr>
  );
};

const MessageItem = ({ message }) => (
  <div className={`message-item ${message.unread ? 'unread' : ''}`}>
    <div className="message-avatar">{message.initials || 'CO'}</div>
    <div className="message-content">
      <div className="message-header">
        <span className="message-sender">{message.sender}</span>
        <span className="message-time">{message.time}</span>
      </div>
      <div className="message-preview">{message.preview}</div>
    </div>
  </div>
);

const SettingItem = ({ title, description }) => (
  <div className="settings-item">
    <div>
      <h4>{title}</h4>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{description}</p>
    </div>
    <div className="toggle-switch active"></div>
  </div>
);

export default JobSeekerDashboardComplete;

