import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faBriefcase, faCalendar, faBookmark, 
  faStar, faEnvelope, faCog, faPlus, faEye, faPaperPlane, faDownload,
  faEdit, faTrash, faCheckCircle, faClock, faMapMarkerAlt, faDollarSign,
  faBuilding, faLayerGroup, faArrowUp, faArrowDown, faSpinner, faFilter,
  faSort, faTimes, faSave, faUpload, faFilePdf, faGraduationCap, faUsers,
  faChartLine, faLightbulb, faHandshake, faRocket, faShieldAlt, faHeart,
  faExternalLinkAlt, faCopy, faShare, faVideo, faPhone, faGlobe, faLinkedin,
  faGithub, faTwitter, faFacebook, faInstagram, faYoutube, faTiktok, faSnapchat,
  faReply
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as faLinkedinBrand, faGithub as faGithubBrand, faTwitter as faTwitterBrand, faFacebook as faFacebookBrand, faInstagram as faInstagramBrand, faYoutube as faYoutubeBrand, faTiktok as faTiktokBrand, faSnapchat as faSnapchatBrand } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    savedJobs: 0,
    matches: 0
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Sample data for demonstration
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      posted: '2 days ago',
      description: 'We are looking for a passionate full-stack developer to join our growing team...',
      requirements: ['React', 'Node.js', 'MongoDB', 'AWS', '5+ years experience'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours'],
      logo: 'TC',
      featured: true,
      urgent: false
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$100k - $130k',
      posted: '1 week ago',
      description: 'Lead product strategy and work with cross-functional teams...',
      requirements: ['Product Management', 'Agile', 'Leadership', '3+ years experience'],
      benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
      logo: 'IL',
      featured: false,
      urgent: true
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $100k',
      posted: '3 days ago',
      description: 'Create beautiful and intuitive user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping', '2+ years experience'],
      benefits: ['Flexible Schedule', 'Project-based'],
      logo: 'DS',
      featured: true,
      urgent: false
    }
  ];

  const sampleApplications = [
    {
      id: 1,
      jobTitle: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-15',
      status: 'under_review',
      salary: '$120k - $150k',
      type: 'Full-time'
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      appliedDate: '2024-01-10',
      status: 'interview_scheduled',
      salary: '$100k - $130k',
      type: 'Full-time'
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'Remote',
      appliedDate: '2024-01-18',
      status: 'rejected',
      salary: '$80k - $100k',
      type: 'Contract'
    }
  ];

  const sampleInterviews = [
    {
      id: 1,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      date: '2024-01-25',
      time: '2:00 PM',
      type: 'Video Interview',
      interviewer: 'Sarah Johnson',
      status: 'scheduled',
      location: 'Zoom Meeting'
    },
    {
      id: 2,
      jobTitle: 'Senior Developer',
      company: 'TechCorp Inc.',
      date: '2024-01-28',
      time: '10:00 AM',
      type: 'In-person',
      interviewer: 'David Wilson',
      status: 'scheduled',
      location: 'San Francisco Office'
    }
  ];

  const sampleMessages = [
    {
      id: 1,
      sender: 'TechCorp Inc.',
      subject: 'Interview Invitation - Senior Full Stack Developer',
      preview: 'Thank you for your application. We would like to invite you for an interview...',
      time: '2 hours ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      sender: 'Innovation Labs',
      subject: 'Application Status Update',
      preview: 'Your application for Product Manager has been reviewed...',
      time: '1 day ago',
      unread: true,
      priority: 'medium'
    },
    {
      id: 3,
      sender: 'Design Studio',
      subject: 'Thank you for your interest',
      preview: 'We appreciate your interest in the UX/UI Designer position...',
      time: '3 days ago',
      unread: false,
      priority: 'low'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls with sample data
      setTimeout(() => {
        setProfileData({
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john.doe@email.com',
          jobTitle: 'Software Engineer',
          location: 'San Francisco, CA',
          experience: '5 years',
          skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
          profileCompleteness: 85
        });
        
        setStats({
          applications: 12,
          interviews: 3,
          profileViews: 142,
          savedJobs: 8,
          matches: 15
        });
        
        setJobs(sampleJobs);
        setApplications(sampleApplications);
        setInterviews(sampleInterviews);
        setSavedJobs(sampleJobs.slice(0, 2));
        setMessages(sampleMessages);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'under_review': '#f59e0b',
      'interview_scheduled': '#3b82f6',
      'offered': '#10b981',
      'rejected': '#ef4444',
      'withdrawn': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      'under_review': 'Under Review',
      'interview_scheduled': 'Interview Scheduled',
      'offered': 'Offered',
      'rejected': 'Rejected',
      'withdrawn': 'Withdrawn'
    };
    return texts[status] || 'Unknown';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-seeker-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Welcome back, {profileData?.firstName}!</h1>
            <p>Here's what's happening with your job search</p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="notification-btn">
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                {profileData?.firstName?.charAt(0)}
              </div>
              <div className="user-info">
                <span className="user-name">{profileData?.firstName} {profileData?.lastName}</span>
                <span className="user-role">{profileData?.jobTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FontAwesomeIcon icon={faChartLine} />
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <FontAwesomeIcon icon={faBriefcase} />
          Jobs
        </button>
        <button
          className={`nav-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          Applications
        </button>
        <button
          className={`nav-tab ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          <FontAwesomeIcon icon={faCalendar} />
          Interviews
        </button>
        <button
          className={`nav-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          Messages
        </button>
        <button
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FontAwesomeIcon icon={faUser} />
          Profile
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon applications">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </div>
                <div className="stat-content">
                  <h3>{stats.applications}</h3>
                  <p>Applications Sent</p>
                  <span className="stat-change positive">
                    <FontAwesomeIcon icon={faArrowUp} /> +3 this week
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon interviews">
                  <FontAwesomeIcon icon={faCalendar} />
                </div>
                <div className="stat-content">
                  <h3>{stats.interviews}</h3>
                  <p>Interviews Scheduled</p>
                  <span className="stat-change">
                    Next: Tomorrow at 2:00 PM
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon views">
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <div className="stat-content">
                  <h3>{stats.profileViews}</h3>
                  <p>Profile Views</p>
                  <span className="stat-change positive">
                    <FontAwesomeIcon icon={faArrowUp} /> +18% from last week
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon saved">
                  <FontAwesomeIcon icon={faBookmark} />
                </div>
                <div className="stat-content">
                  <h3>{stats.savedJobs}</h3>
                  <p>Saved Jobs</p>
                  <span className="stat-change">
                    2 new matches today
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="profile-completion-card">
              <div className="completion-header">
                <h3>Complete Your Profile</h3>
                <span className="completion-percentage">{profileData?.profileCompleteness}%</span>
              </div>
              <div className="completion-bar">
                <div 
                  className="completion-fill" 
                  style={{ width: `${profileData?.profileCompleteness}%` }}
                ></div>
              </div>
              <p>Add more details to increase your visibility to employers</p>
              <button className="btn-primary">
                <FontAwesomeIcon icon={faEdit} />
                Complete Profile
              </button>
            </div>

            {/* Recent Jobs */}
            <div className="recent-jobs-section">
              <div className="section-header">
                <h3>Recommended Jobs</h3>
                <button className="btn-secondary">View All</button>
              </div>
              <div className="jobs-grid">
                {jobs.slice(0, 3).map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div className="company-logo">{job.logo}</div>
                      <div className="job-info">
                        <h4>{job.title}</h4>
                        <p className="company-name">{job.company}</p>
                        <div className="job-meta">
                          <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                          <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
                        </div>
                      </div>
                      {job.featured && <span className="featured-badge">Featured</span>}
                    </div>
                    <p className="job-description">{job.description}</p>
                    <div className="job-requirements">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span key={index} className="requirement-tag">{req}</span>
                      ))}
                    </div>
                    <div className="job-actions">
                      <button className="btn-primary">
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Apply Now
                      </button>
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faBookmark} />
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-content">
            <div className="jobs-header">
              <h2>Find Your Next Job</h2>
              <div className="jobs-filters">
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Jobs</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
                <button className="btn-secondary">
                  <FontAwesomeIcon icon={faFilter} />
                  More Filters
                </button>
              </div>
            </div>
            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-card-large">
                  <div className="job-header">
                    <div className="company-logo">{job.logo}</div>
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <div className="job-meta">
                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                        <span><FontAwesomeIcon icon={faDollarSign} /> {job.salary}</span>
                        <span><FontAwesomeIcon icon={faClock} /> {job.posted}</span>
                      </div>
                    </div>
                    <div className="job-badges">
                      {job.featured && <span className="featured-badge">Featured</span>}
                      {job.urgent && <span className="urgent-badge">Urgent</span>}
                    </div>
                  </div>
                  <p className="job-description">{job.description}</p>
                  <div className="job-requirements">
                    {job.requirements.map((req, index) => (
                      <span key={index} className="requirement-tag">{req}</span>
                    ))}
                  </div>
                  <div className="job-benefits">
                    <strong>Benefits:</strong> {job.benefits.join(', ')}
                  </div>
                  <div className="job-actions">
                    <button className="btn-primary">
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Apply Now
                    </button>
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faEye} />
                      View Details
                    </button>
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faBookmark} />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="applications-content">
            <div className="applications-header">
              <h2>My Applications</h2>
              <div className="applications-stats">
                <span className="stat-item">
                  <strong>{applications.length}</strong> Total Applications
                </span>
                <span className="stat-item">
                  <strong>{applications.filter(app => app.status === 'under_review').length}</strong> Under Review
                </span>
                <span className="stat-item">
                  <strong>{applications.filter(app => app.status === 'interview_scheduled').length}</strong> Interviews
                </span>
              </div>
            </div>
            <div className="applications-list">
              {applications.map(application => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <div className="job-info">
                      <h3>{application.jobTitle}</h3>
                      <p className="company-name">{application.company}</p>
                      <div className="job-meta">
                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {application.location}</span>
                        <span><FontAwesomeIcon icon={faDollarSign} /> {application.salary}</span>
                        <span><FontAwesomeIcon icon={faClock} /> Applied {application.appliedDate}</span>
                      </div>
                    </div>
                    <div className="application-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(application.status) }}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>
                  <div className="application-actions">
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faEye} />
                      View Details
                    </button>
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="interviews-content">
            <div className="interviews-header">
              <h2>Upcoming Interviews</h2>
              <button className="btn-primary">
                <FontAwesomeIcon icon={faPlus} />
                Schedule Interview
              </button>
            </div>
            <div className="interviews-list">
              {interviews.map(interview => (
                <div key={interview.id} className="interview-card">
                  <div className="interview-header">
                    <div className="interview-info">
                      <h3>{interview.jobTitle}</h3>
                      <p className="company-name">{interview.company}</p>
                      <div className="interview-meta">
                        <span><FontAwesomeIcon icon={faCalendar} /> {interview.date}</span>
                        <span><FontAwesomeIcon icon={faClock} /> {interview.time}</span>
                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {interview.location}</span>
                      </div>
                    </div>
                    <div className="interview-type">
                      <span className="type-badge">{interview.type}</span>
                    </div>
                  </div>
                  <div className="interview-details">
                    <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                    <p><strong>Status:</strong> {interview.status}</p>
                  </div>
                  <div className="interview-actions">
                    <button className="btn-primary">
                      <FontAwesomeIcon icon={faVideo} />
                      Join Interview
                    </button>
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faCalendar} />
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="messages-content">
            <div className="messages-header">
              <h2>Messages</h2>
              <button className="btn-primary">
                <FontAwesomeIcon icon={faPlus} />
                New Message
              </button>
            </div>
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className={`message-card ${message.unread ? 'unread' : ''}`}>
                  <div className="message-header">
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {message.sender.charAt(0)}
                      </div>
                      <div className="sender-info">
                        <h4>{message.sender}</h4>
                        <p>{message.subject}</p>
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className="message-time">{message.time}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(message.priority) }}
                      >
                        {message.priority}
                      </span>
                    </div>
                  </div>
                  <p className="message-preview">{message.preview}</p>
                  <div className="message-actions">
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faEye} />
                      Read
                    </button>
                    <button className="btn-secondary">
                      <FontAwesomeIcon icon={faReply} />
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {profileData?.firstName?.charAt(0)}
              </div>
              <div className="profile-info">
                <h2>{profileData?.firstName} {profileData?.lastName}</h2>
                <p className="profile-title">{profileData?.jobTitle}</p>
                <p className="profile-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData?.location}
                </p>
                <div className="profile-stats">
                  <span><strong>{profileData?.experience}</strong> Experience</span>
                  <span><strong>{profileData?.profileCompleteness}%</strong> Profile Complete</span>
                </div>
              </div>
              <button className="btn-primary">
                <FontAwesomeIcon icon={faEdit} />
                Edit Profile
              </button>
            </div>
            
            <div className="profile-sections">
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {profileData?.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Experience</h3>
                <div className="experience-item">
                  <h4>Senior Software Engineer</h4>
                  <p className="company-name">TechCorp Inc.</p>
                  <p className="duration">2020 - Present</p>
                  <p>Led development of scalable web applications using React and Node.js. Managed a team of 5 developers and implemented agile methodologies.</p>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Education</h3>
                <div className="education-item">
                  <h4>Bachelor of Science in Computer Science</h4>
                  <p className="institution">University of California, Berkeley</p>
                  <p className="duration">2016 - 2020</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobSeekerDashboard;