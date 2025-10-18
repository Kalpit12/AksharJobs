import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faBriefcase, faCalendar, faBookmark,
  faStar, faEnvelope, faCog, faThLarge, faFileAlt, faFilePdf, faBook,
  faPaperPlane, faEye, faMapMarkerAlt, faDollarSign, faLayerGroup,
  faClock, faPlus, faUpload, faCertificate, faArrowUp, faCheckCircle,
  faQuestionCircle, faCalendarCheck, faTrash, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
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
    messages: []
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
          savedJobs: 0 // Will be calculated from saved jobs
        },
        profileCompletion: 75,
        applications: applicationsRes?.data?.applications || [],
        interviews: [], // Extract from applications
        jobs: jobsRes?.data?.jobs || [],
        savedJobs: [],
        messages: []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return 'JS';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'JS';
  };

  // Get user full name
  const getUserName = () => {
    if (!user) return 'Job Seeker';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Job Seeker';
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <ThemedLoadingSpinner 
        theme="jobseeker"
        size="large"
        text="Loading your dashboard..."
        subText="Preparing your job search experience"
        showIcon={true}
        fullScreen={true}
      />
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
          <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`}>
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

            {/* Recommended Jobs & Upcoming Interviews */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* Recommended Jobs */}
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
                </div>
              </div>

              {/* Upcoming Interviews */}
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
              {dashboardData.jobs.map((job, index) => (
                <JobCard key={index} job={job} showApplyButton />
              ))}
            </div>
          </div>

          {/* Applications Section */}
          <div className={`page-section ${activeSection === 'applications' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>My Applications</h1>
            
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
                    {dashboardData.applications.map((app, index) => (
                      <ApplicationRow key={index} application={app} detailed />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Other Sections - Placeholder */}
          {['saved', 'interviews', 'matches', 'messages', 'profile', 'resume', 'resources', 'settings'].map(section => (
            <div key={section} className={`page-section ${activeSection === section ? 'active' : ''}`}>
              <h1 style={{ marginBottom: '25px', textTransform: 'capitalize' }}>{section}</h1>
              <div className="card">
                <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                  {section.charAt(0).toUpperCase() + section.slice(1)} section coming soon...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Job Card Component
const JobCard = ({ job, showApplyButton = false }) => {
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
            <FontAwesomeIcon icon={faBookmark} />
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

// Interview Card Component
const InterviewCard = ({ interview }) => {
  return (
    <div className="interview-card">
      <div className="interview-date">
        <div className="day">{interview.day || '00'}</div>
        <div className="month">{interview.month || 'JAN'}</div>
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{interview.company}</p>
        <p style={{ color: '#999', fontSize: '13px' }}>
          <FontAwesomeIcon icon={faClock} /> {interview.time} • {interview.type}
        </p>
      </div>
    </div>
  );
};

// Application Row Component
const ApplicationRow = ({ application, detailed = false }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'applied': 'status-applied',
      'under-review': 'status-under-review',
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button className="btn btn-danger btn-sm">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobSeekerDashboard;
