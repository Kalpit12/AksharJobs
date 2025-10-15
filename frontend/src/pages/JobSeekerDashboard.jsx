import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faSearch, faFileAlt, faBookmark, faCalendarCheck, faStar, faEnvelope,
  faUser, faFilePdf, faBook, faCog, faBell, faQuestionCircle, faPlus, faUpload,
  faPaperPlane, faEye, faCalendar, faMapMarkerAlt, faBriefcase,
  faLayerGroup, faDollarSign, faClock, faVideo, faEdit, faSpinner,
  faGraduationCap, faMagic, faUsers, faTrash, faDownload, faStar as faStarSolid,
  faArrowUp, faCheckCircle, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import JobSeekerSidebar from '../components/JobSeekerSidebar';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profileData, setProfileData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    savedJobs: 0
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileEditMode, setProfileEditMode] = useState(false);

  // Sample data structure matching the HTML
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
      appliedDate: '2024-01-15',
      appliedDaysAgo: '5 days ago',
      status: 'reviewing'
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Remote',
      appliedDate: '2024-01-10',
      appliedDaysAgo: '10 days ago',
      status: 'interview'
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'London, UK',
      appliedDate: '2024-01-18',
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

  const sampleMessages = [
    {
      id: 1,
      sender: 'TechCorp Inc.',
      avatar: 'TC',
      time: '2 hours ago',
      preview: 'Your application for Senior Full Stack Developer has been reviewed. We\'d like to schedule an interview...',
      unread: true
    },
    {
      id: 2,
      sender: 'Innovation Labs',
      avatar: 'IL',
      time: '1 day ago',
      preview: 'Thank you for your interest in the Product Manager position. We have a few questions...',
      unread: true
    },
    {
      id: 3,
      sender: 'Design Studio',
      avatar: 'DS',
      time: '3 days ago',
      preview: 'We received your application for UX/UI Designer. Our team is currently reviewing...',
      unread: false
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const profileResponse = await fetch('/api/profile/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/profile/views', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const views = await statsResponse.json();
        setDashboardStats(prev => ({
          ...prev,
          profileViews: Array.isArray(views) ? views.length : 0
        }));
      }

      // Fetch jobs
      const jobsResponse = await fetch('/api/jobs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.slice(0, 10));
        setRecommendedJobs(jobsData.slice(0, 3));
      }

      // Fetch saved jobs
      const savedJobsResponse = await fetch('/api/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (savedJobsResponse.ok) {
        const savedJobsData = await savedJobsResponse.json();
        setSavedJobs(savedJobsData);
        setDashboardStats(prev => ({
          ...prev,
          savedJobs: savedJobsData.length
        }));
      }

      // Fetch applications
      const applicationsResponse = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
        setDashboardStats(prev => ({
          ...prev,
          applications: applicationsData.length
        }));
      }

      // Fetch interviews
      const interviewsResponse = await fetch('/api/interviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (interviewsResponse.ok) {
        const interviewsData = await interviewsResponse.json();
        setInterviews(interviewsData);
        setDashboardStats(prev => ({
          ...prev,
          interviews: interviewsData.length
        }));
      }

      // Fetch messages
      const messagesResponse = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data as fallback
      setJobs(sampleJobs);
      setApplications(sampleApplications);
      setInterviews(sampleInterviews);
      setMessages(sampleMessages);
      setDashboardStats({
        applications: 12,
        interviews: 3,
        profileViews: 142,
        savedJobs: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'applied': 'status-applied',
      'reviewing': 'status-reviewing',
      'interview': 'status-interview',
      'offered': 'status-offered',
      'rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-applied';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'applied': 'Applied',
      'reviewing': 'Under Review',
      'interview': 'Interview',
      'offered': 'Offered',
      'rejected': 'Rejected'
    };
    return statusMap[status] || 'Applied';
  };

  const renderJobCard = (job, showUnsaveBtn = false) => (
    <div key={job.id} className="job-card">
      <div className="job-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">{job.logo}</div>
          <div className="job-info">
            <h3>{job.title}</h3>
            <div className="job-company">{job.company}</div>
            <div className="job-meta">
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
              <span><FontAwesomeIcon icon={faBriefcase} /> {job.type}</span>
              <span><FontAwesomeIcon icon={faLayerGroup} /> {job.experience}</span>
              <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
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
            <FontAwesomeIcon icon={faStarSolid} /> Featured
          </span>
        )}
        {job.skills.map((skill, index) => (
          <span key={index} className="tag">{skill}</span>
        ))}
        <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
          <FontAwesomeIcon icon={faClock} /> {job.posted}
        </span>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faPaperPlane} /> Apply Now
        </button>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faEye} /> View Details
        </button>
      </div>
    </div>
  );

  const renderApplicationRow = (app) => (
    <tr key={app.id}>
      <td><strong>{app.jobTitle}</strong></td>
      <td>{app.company}</td>
      <td>{app.location}</td>
      <td>{app.appliedDaysAgo}</td>
      <td>
        <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
          {getStatusText(app.status)}
        </span>
      </td>
      <td>
        <button className="btn btn-secondary btn-sm">View</button>
      </td>
    </tr>
  );

  const renderInterviewCard = (interview) => (
    <div key={interview.id} className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
            {interview.company}
          </p>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div><FontAwesomeIcon icon={faClock} /> {interview.time}</div>
            <div style={{ marginTop: '5px' }}>
              <FontAwesomeIcon icon={faVideo} /> {interview.type}
            </div>
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

  const renderMessageItem = (message) => (
    <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
      <div className="message-avatar">{message.avatar}</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{message.sender}</span>
          <span className="message-time">{message.time}</span>
        </div>
        <div className="message-preview">{message.preview}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-area">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p style={{ marginTop: '20px' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <JobSeekerSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
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
              {profileData?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>
                {profileData?.firstName || user?.firstName || 'User'} {profileData?.lastName || user?.lastName || ''}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {profileData?.jobTitle || 'Job Seeker'}
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
            <h1 style={{ marginBottom: '25px' }}>
              Welcome back, {profileData?.firstName || user?.firstName || 'User'}! 👋
            </h1>

            {/* Profile Completion */}
            <div className="profile-completion">
              <div className="completion-header">
                <div>
                  <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                  <p style={{ opacity: 0.9, fontSize: '14px' }}>75% Complete - Almost there!</p>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>75%</div>
              </div>
              <div className="completion-bar">
                <div className="completion-fill"></div>
              </div>
              <div className="completion-actions">
                <button className="btn" onClick={() => setActiveSection('resume')}>
                  <FontAwesomeIcon icon={faUpload} /> Upload Resume
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
                  <FontAwesomeIcon icon={faArrowUp} /> 3 this week
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
                  Next: Tomorrow at 2:00 PM
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
                  <FontAwesomeIcon icon={faArrowUp} /> +18% from last week
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
                  {recommendedJobs.slice(0, 3).map(job => renderJobCard(job))}
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Upcoming Interviews</h3>
                  </div>
                  <div>
                    {interviews.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        No upcoming interviews
                      </p>
                    ) : (
                      interviews.slice(0, 2).map(interview => renderInterviewCard(interview))
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
                      <FontAwesomeIcon icon={faUser} /> Edit Profile
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
                    {applications.slice(0, 5).map(app => renderApplicationRow(app))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Browse Jobs Section */}
        {activeSection === 'jobs' && (
          <div className="page-section">
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
                {jobs.map(job => renderJobCard(job))}
              </div>
            </div>
          </div>
        )}

        {/* My Applications Section */}
        {activeSection === 'applications' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

            <div className="filters">
              <select className="filter-select">
                <option>All Applications ({applications.length})</option>
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
                    {applications.map(app => renderApplicationRow(app))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Saved Jobs Section */}
        {activeSection === 'saved' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
            <div className="card">
              <div>
                {savedJobs.length === 0 ? (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faBookmark} size="4x" />
                    <h3>No Saved Jobs</h3>
                    <p>Jobs you save will appear here</p>
                  </div>
                ) : (
                  savedJobs.map(job => renderJobCard(job, true))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interviews Section */}
        {activeSection === 'interviews' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>

            <div className="alert info">
              <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '24px' }} />
              <div>
                <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
              </div>
            </div>

            <div>
              {interviews.length === 0 ? (
                <div className="card">
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faCalendar} size="4x" />
                    <h3>No Interviews Scheduled</h3>
                    <p>Your upcoming interviews will appear here</p>
                  </div>
                </div>
              ) : (
                interviews.map(interview => renderInterviewCard(interview))
              )}
            </div>
          </div>
        )}

        {/* Recommended Jobs Section */}
        {activeSection === 'matches' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
            <div className="alert success">
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
              <div>
                Based on your profile and preferences, we found <strong>{recommendedJobs.length} jobs</strong> that match your skills!
              </div>
            </div>
            <div className="card">
              <div>
                {recommendedJobs.map(job => renderJobCard(job))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Messages</h1>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Inbox</h3>
                <button className="btn btn-primary btn-sm">
                  <FontAwesomeIcon icon={faPlus} /> New Message
                </button>
              </div>
              <div className="message-list">
                {messages.map(message => renderMessageItem(message))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="page-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h1>My Profile</h1>
              <div>
                <button className="btn btn-primary" onClick={() => setProfileEditMode(!profileEditMode)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Header */}
            <div className="profile-header-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div className="profile-avatar-large">
                  {profileData?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>
                    {profileData?.firstName || user?.firstName || 'User'} {profileData?.lastName || user?.lastName || ''}
                  </h2>
                  <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>
                    {profileData?.jobTitle || 'Job Seeker'}
                  </p>
                  <p style={{ opacity: 0.8 }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData?.location || 'Nairobi, Kenya'}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="card profile-view-mode">
              <div className="card-header">
                <h3 className="card-title">
                  <FontAwesomeIcon icon={faUser} /> Personal Information
                </h3>
              </div>
              <div className="profile-info-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={`${profileData?.firstName || user?.firstName || ''} ${profileData?.lastName || user?.lastName || ''}`}
                    disabled={!profileEditMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profileData?.email || user?.email || ''}
                    disabled={!profileEditMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={profileData?.phone || ''}
                    disabled={!profileEditMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData?.location || 'Nairobi, Kenya'}
                    disabled={!profileEditMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea 
                  className="form-textarea" 
                  value={profileData?.summary || 'Experienced professional with expertise in various fields. Passionate about delivering quality work and continuous learning.'}
                  disabled={!profileEditMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resume Section */}
        {activeSection === 'resume' && (
          <div className="page-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h1>Resume/CV Management</h1>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faUpload} /> Upload New Resume
              </button>
            </div>

            <div className="card">
              <div className="resume-list">
                <div className="resume-item">
                  <div className="resume-icon">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </div>
                  <div className="resume-info">
                    <h4>Resume_2024.pdf</h4>
                    <div className="resume-meta">
                      <span><FontAwesomeIcon icon={faCalendar} /> Uploaded: Jan 10, 2024</span>
                      <span style={{ marginLeft: '15px' }}><FontAwesomeIcon icon={faFileAlt} /> 256 KB</span>
                      <span style={{ marginLeft: '15px' }} className="status-badge status-offered">Primary</span>
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
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <div className="card-header">
                <h3 className="card-title">
                  <FontAwesomeIcon icon={faMagic} /> Resume Builder
                </h3>
              </div>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Create a professional resume using our easy-to-use template builder.
              </p>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} /> Create New Resume
              </button>
            </div>
          </div>
        )}

        {/* Career Resources Section */}
        {activeSection === 'resources' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Career Resources</h1>
            <div className="stats-grid">
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}>
                  <FontAwesomeIcon icon={faBook} /> Interview Tips
                </h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Master your interview skills with expert advice and common questions.
                </p>
                <button className="btn btn-secondary btn-sm">Learn More</button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}>
                  <FontAwesomeIcon icon={faFileAlt} /> Resume Builder
                </h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Create a professional resume in minutes with our templates.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('resume')}>
                  Start Building
                </button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}>
                  <FontAwesomeIcon icon={faGraduationCap} /> Online Courses
                </h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Upskill with courses and certifications from top providers.
                </p>
                <button className="btn btn-secondary btn-sm">Browse Courses</button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}>
                  <FontAwesomeIcon icon={faUsers} /> Career Advice
                </h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Get personalized guidance from career experts and mentors.
                </p>
                <button className="btn btn-secondary btn-sm">Get Advice</button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="page-section">
            <h1 style={{ marginBottom: '25px' }}>Settings</h1>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <FontAwesomeIcon icon={faBell} /> Notification Preferences
                </h3>
              </div>
              <div className="settings-section">
                <div className="settings-item">
                  <div>
                    <h4>Email Notifications</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                      Receive job alerts and updates via email
                    </p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>
                <div className="settings-item">
                  <div>
                    <h4>Application Updates</h4>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                      Get notified about application status changes
                    </p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default JobSeekerDashboard;
