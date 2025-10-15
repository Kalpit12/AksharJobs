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
  faLink, faGlobe, faTwitter, faGithub, faLinkedin, faSpinner,
  faPassport, faMapMarkedAlt, faLightbulb, faCertificate as faCert,
  faTasks, faUserCheck, faSlidersH, faInfoCircle as faInfo,
  faHeart, faQuestionCircle, faUsers
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as fabLinkedin, faGithub as fabGithub, faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import dashboardService from '../services/dashboardService';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya',
    jobTitle: 'Senior Software Engineer',
    experience: '8',
    industry: 'Technology',
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading development teams. Passionate about clean code and innovative solutions.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'REST APIs'],
    softSkills: ['Leadership', 'Team Collaboration', 'Problem Solving', 'Communication', 'Project Management', 'Agile Methodologies'],
    workExperience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        duration: 'January 2020 - Present (4 years)',
        description: 'Leading a team of 5 developers in building scalable web applications. Implemented microservices architecture reducing system downtime by 40%. Mentored junior developers and conducted code reviews.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        duration: 'March 2018 - December 2019 (2 years)',
        description: 'Developed and maintained multiple web applications using React and Node.js. Collaborated with UX designers to improve user experience. Implemented automated testing reducing bugs by 30%.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Nairobi',
        duration: '2012 - 2016',
        description: 'Graduated with First Class Honors. Specialized in Software Engineering and Database Systems. President of the Computer Science Society.'
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2021', verified: true },
      { name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance', date: '2020', verified: true },
      { name: 'Employee of the Year 2022', issuer: 'TechCorp Inc.', date: '2022', verified: true }
    ],
    languages: [
      { language: 'English', level: 'Native/Fluent' },
      { language: 'Swahili', level: 'Native/Fluent' },
      { language: 'French', level: 'Intermediate' }
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: 'linkedin.com/in/johnsmith', icon: fabLinkedin },
      { platform: 'GitHub', url: 'github.com/johnsmith', icon: fabGithub },
      { platform: 'Website', url: 'johnsmith.dev', icon: faGlobe },
      { platform: 'Twitter', url: '@johnsmith_dev', icon: fabTwitter }
    ]
  });
  const [dashboardData, setDashboardData] = useState({
    applications: 12,
    interviews: 3,
    profileViews: 142,
    savedJobs: 8,
    profileCompletion: 75
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch dashboard data for user:', user.userId);

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

      // Handle profile data
      if (profileResult.status === 'fulfilled') {
        setProfileData(prev => ({ ...prev, ...profileResult.value }));
        console.log('Profile data loaded successfully');
      } else {
        console.log('Profile fetch failed:', profileResult.reason);
      }

      // Handle applications data
      if (applicationsResult.status === 'fulfilled') {
        setApplications(applicationsResult.value);
        setDashboardData(prev => ({ ...prev, applications: applicationsResult.value.length }));
        console.log('Applications data loaded successfully');
      } else {
        console.log('Applications fetch failed:', applicationsResult.reason);
      }

      // Handle jobs data
      if (jobsResult.status === 'fulfilled') {
        setJobs(jobsResult.value);
        console.log('Jobs data loaded successfully');
      } else {
        console.log('Jobs fetch failed:', jobsResult.reason);
      }

      // Handle saved jobs data
      if (savedJobsResult.status === 'fulfilled') {
        setDashboardData(prev => ({ ...prev, savedJobs: savedJobsResult.value.length }));
        console.log('Saved jobs data loaded successfully');
      } else {
        console.log('Saved jobs fetch failed:', savedJobsResult.reason);
      }

      // Handle recommended jobs data
      if (recommendedJobsResult.status === 'fulfilled') {
        console.log('Recommended jobs data loaded successfully');
      } else {
        console.log('Recommended jobs fetch failed:', recommendedJobsResult.reason);
      }

      // Handle interviews data
      if (interviewsResult.status === 'fulfilled') {
        setInterviews(interviewsResult.value);
        setDashboardData(prev => ({ ...prev, interviews: interviewsResult.value.length }));
        console.log('Interviews data loaded successfully');
      } else {
        console.log('Interviews fetch failed:', interviewsResult.reason);
      }

      // Handle profile views data
      if (profileViewsResult.status === 'fulfilled') {
        setDashboardData(prev => ({ ...prev, profileViews: profileViewsResult.value.views || 142 }));
        console.log('Profile views data loaded successfully');
      } else {
        console.log('Profile views fetch failed:', profileViewsResult.reason);
      }

      // Set timeout to show dashboard even if some APIs fail
      setTimeout(() => {
        setLoading(false);
        console.log('Dashboard loading timeout reached - showing dashboard with fallback data');
      }, 3000);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleCompleteProfile = () => {
    navigate('/complete-profile');
  };

  const handleEditProfile = () => {
    setActiveSection('profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  const createJobCard = (job) => (
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
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
      </div>
      <div className="job-tags">
        {job.featured && <span className="tag featured"><FontAwesomeIcon icon={faStar} /> Featured</span>}
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

  const createApplicationRow = (app) => (
    <tr key={app.id}>
      <td><strong>{app.jobTitle}</strong></td>
      <td>{app.company}</td>
      <td>{app.location}</td>
      <td>{app.appliedDaysAgo}</td>
      <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
      <td>
        <button className="btn btn-secondary btn-sm">View</button>
      </td>
    </tr>
  );

  const createInterviewCard = (interview) => (
    <div key={interview.id} className="interview-card">
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

  const createMessageItem = (message) => (
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
      <div className="jobseeker-dashboard">
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} size="2x" />
          <span style={{ marginLeft: '10px' }}>Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="jobseeker-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>
            <FontAwesomeIcon icon={faBriefcase} />
            JobPortal
          </h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => showSection('jobs')}>
            <FontAwesomeIcon icon={faSearch} />
            <span>Browse Jobs</span>
            <span className="badge success">NEW</span>
          </div>
          <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => showSection('applications')}>
            <FontAwesomeIcon icon={faFileAlt} />
            <span>My Applications</span>
            <span className="badge">{dashboardData.applications}</span>
          </div>
          <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => showSection('saved')}>
            <FontAwesomeIcon icon={faBookmark} />
            <span>Saved Jobs</span>
            <span className="badge">{dashboardData.savedJobs}</span>
          </div>
          <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => showSection('interviews')}>
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Interviews</span>
            <span className="badge">{dashboardData.interviews}</span>
          </div>
          <div className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`} onClick={() => showSection('matches')}>
            <FontAwesomeIcon icon={faStar} />
            <span>Recommended</span>
            <span className="badge">15</span>
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
            <FontAwesomeIcon icon={faFilePdf} />
            <span>Resume/CV</span>
          </div>
          <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => showSection('resources')}>
            <FontAwesomeIcon icon={faBook} />
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
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
            <div className="user-profile" onClick={() => showSection('profile')}>
              <div className="user-avatar">JS</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>John Smith</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Software Engineer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Welcome back, John! 👋</h1>

              {/* Profile Completion */}
              <div className="profile-completion">
                <div className="completion-header">
                  <div>
                    <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>{dashboardData.profileCompletion}% Complete - Almost there!</p>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 700 }}>{dashboardData.profileCompletion}%</div>
                </div>
                <div className="completion-bar">
                  <div className="completion-fill" style={{ width: `${dashboardData.profileCompletion}%` }}></div>
                </div>
                <div className="completion-actions">
                  <button className="btn" onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faPlus} /> Add Skills
                  </button>
                  <button className="btn" onClick={() => showSection('resume')}>
                    <FontAwesomeIcon icon={faUpload} /> Upload Resume
                  </button>
                  <button className="btn" onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faCertificate} /> Add Certifications
                  </button>
                  <button className="btn btn-primary" onClick={handleCompleteProfile}>
                    <FontAwesomeIcon icon={faEdit} /> Complete Profile
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{dashboardData.applications}</div>
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
                      <div className="stat-number">{dashboardData.interviews}</div>
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
                      <div className="stat-number">{dashboardData.profileViews}</div>
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
                      <div className="stat-number">{dashboardData.savedJobs}</div>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('matches')}>View All</button>
                  </div>
                  <div>
                    {sampleJobs.slice(0, 3).map(job => createJobCard(job))}
                  </div>
                </div>

                {/* Upcoming Interviews */}
                <div>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Upcoming Interviews</h3>
                    </div>
                    <div>
                      {sampleInterviews.slice(0, 2).map(interview => createInterviewCard(interview))}
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-header">
                      <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button className="btn btn-primary" onClick={() => showSection('jobs')}>
                        <FontAwesomeIcon icon={faSearch} /> Browse Jobs
                      </button>
                      <button className="btn btn-secondary" onClick={() => showSection('resume')}>
                        <FontAwesomeIcon icon={faUpload} /> Update Resume
                      </button>
                      <button className="btn btn-secondary" onClick={handleEditProfile}>
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
                  <button className="btn btn-secondary btn-sm" onClick={() => showSection('applications')}>View All</button>
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
                      {sampleApplications.slice(0, 5).map(app => createApplicationRow(app))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Browse Jobs Section */}
          {activeSection === 'jobs' && (
            <div className="page-section active">
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
                  {sampleJobs.map(job => createJobCard(job))}
                </div>
              </div>
            </div>
          )}

          {/* My Applications Section */}
          {activeSection === 'applications' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

              <div className="filters">
                <select className="filter-select">
                  <option>All Applications ({dashboardData.applications})</option>
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
                      {sampleApplications.map(app => createApplicationRow(app))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Saved Jobs Section */}
          {activeSection === 'saved' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
              <div className="card">
                <div>
                  {sampleJobs.slice(0, 4).map(job => createJobCard(job))}
                </div>
              </div>
            </div>
          )}

          {/* Interviews Section */}
          {activeSection === 'interviews' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
              
              <div className="alert info">
                <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '24px' }} />
                <div>
                  <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
                </div>
              </div>

              <div>
                {sampleInterviews.map(interview => createInterviewCard(interview))}
              </div>
            </div>
          )}

          {/* Recommended Jobs Section */}
          {activeSection === 'matches' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
              <div className="alert success">
                <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
                <div>
                  Based on your profile and preferences, we found <strong>15 jobs</strong> that match your skills!
                </div>
              </div>
              <div className="card">
                <div>
                  {sampleJobs.map(job => createJobCard(job))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Messages</h1>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Inbox</h3>
                  <button className="btn btn-primary btn-sm">
                    <FontAwesomeIcon icon={faPlus} /> New Message
                  </button>
                </div>
                <div className="message-list">
                  {sampleMessages.map(message => createMessageItem(message))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="page-section active">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1>My Profile</h1>
                <div>
                  <button className="btn btn-primary" onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faEdit} /> Edit Profile
                  </button>
                  <button className="btn btn-primary" onClick={handleCompleteProfile} style={{ marginLeft: '10px' }}>
                    <FontAwesomeIcon icon={faEdit} /> Complete Profile
                  </button>
                </div>
              </div>

              {/* Profile Header */}
              <div className="profile-header-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <div className="profile-avatar-large">JS</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>{profileData.fullName}</h2>
                    <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>{profileData.jobTitle}</p>
                    <p style={{ opacity: 0.8 }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData.location}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
                </div>
                <div className="profile-info-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={profileData.fullName} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={profileData.email} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" value={profileData.phone} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-input" value={profileData.location} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input type="number" className="form-input" value={profileData.experience} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <select className="form-select" disabled>
                      <option>{profileData.industry}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Summary</label>
                  <textarea className="form-textarea" value={profileData.summary} disabled />
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
                  </div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <h4 style={{ marginBottom: '15px', color: '#666' }}>Soft Skills</h4>
                  <div>
                    {profileData.softSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
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
                    <h4>{exp.title}</h4>
                    <div className="company">{exp.company}</div>
                    <div className="duration">{exp.duration}</div>
                    <p style={{ color: '#666', marginTop: '10px' }}>{exp.description}</p>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
                </div>
                {profileData.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree}</h4>
                    <div className="institution">{edu.institution}</div>
                    <div className="duration">{edu.duration}</div>
                    <p style={{ color: '#666', marginTop: '10px' }}>{edu.description}</p>
                  </div>
                ))}
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
                          <h4>{cert.name}</h4>
                          <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{cert.issuer} - {cert.date}</p>
                        </div>
                        <span className="status-badge status-offered">{cert.verified ? 'Verified' : 'Pending'}</span>
                      </div>
                    </div>
                  ))}
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
                      <h4 style={{ marginBottom: '10px' }}>{lang.language}</h4>
                      <p style={{ color: '#666' }}>{lang.level}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Social Links</h3>
                </div>
                <div className="social-links">
                  {profileData.socialLinks.map((link, index) => (
                    <a key={index} href="#" className="social-link">
                      <FontAwesomeIcon icon={link.icon} />
                      <span>{link.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resume Section */}
          {activeSection === 'resume' && (
            <div className="page-section active">
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
                      <h4>John_Smith_Resume_2024.pdf</h4>
                      <div className="resume-meta">
                        <span><FontAwesomeIcon icon={faCalendar} /> Uploaded: Jan 10, 2024</span>
                        <span style={{ marginLeft: '15px' }}><FontAwesomeIcon icon={faFilePdf} /> 256 KB</span>
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
                  <h3 className="card-title"><FontAwesomeIcon icon={faEdit} /> Resume Builder</h3>
                </div>
                <p style={{ marginBottom: '20px', color: '#666' }}>Create a professional resume using our easy-to-use template builder.</p>
                <button className="btn btn-primary">
                  <FontAwesomeIcon icon={faPlus} /> Create New Resume
                </button>
              </div>
            </div>
          )}

          {/* Career Resources Section */}
          {activeSection === 'resources' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Career Resources</h1>
              <div className="stats-grid">
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faBook} /> Interview Tips</h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>Master your interview skills with expert advice and common questions.</p>
                  <button className="btn btn-secondary btn-sm">Learn More</button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faFilePdf} /> Resume Builder</h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>Create a professional resume in minutes with our templates.</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => showSection('resume')}>Start Building</button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faGraduationCap} /> Online Courses</h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>Upskill with courses and certifications from top providers.</p>
                  <button className="btn btn-secondary btn-sm">Browse Courses</button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faUsers} /> Career Advice</h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>Get personalized guidance from career experts and mentors.</p>
                  <button className="btn btn-secondary btn-sm">Get Advice</button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="page-section active">
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
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="settings-item">
                    <div>
                      <h4>Application Updates</h4>
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get notified about application status changes</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="settings-item">
                    <div>
                      <h4>Interview Reminders</h4>
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive reminders for scheduled interviews</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title"><FontAwesomeIcon icon={faCog} /> Account Settings</h3>
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
                  <h3 className="card-title"><FontAwesomeIcon icon={faInfo} /> Danger Zone</h3>
                </div>
                <div style={{ padding: '20px', background: '#fff5f5', border: '2px solid #fee', borderRadius: '8px' }}>
                  <h4 style={{ color: '#d32f2f', marginBottom: '10px' }}>Delete Account</h4>
                  <p style={{ color: '#666', marginBottom: '15px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faTrash} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;