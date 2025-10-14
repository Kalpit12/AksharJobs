import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState({
    applicationsSent: 0,
    interviewsScheduled: 0,
    profileViews: 0,
    savedJobs: 0
  });
  const [userApplications, setUserApplications] = useState([]);
  const [userInterviews, setUserInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch real user data - FORCE REAL DATA
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.log('No user found, using default data');
        return;
      }
      
      console.log('Fetching data for user:', user);
      
      try {
        setLoading(true);
        
        // FORCE REAL USER DATA - Don't use static data
        setUserStats({
          applicationsSent: user.applicationsSent || 0,
          interviewsScheduled: user.interviewsScheduled || 0,
          profileViews: user.profileViews || 0,
          savedJobs: user.savedJobs || 0
        });
        
        // Try to fetch from API, but use user data as fallback
        try {
          const statsResponse = await fetch(`/api/jobseeker/stats/${user.id}`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setUserStats(stats);
          }
        } catch (apiError) {
          console.log('API not available, using user data:', user);
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        // FORCE REAL DATA - Use actual user data
        setUserStats({
          applicationsSent: 0,
          interviewsScheduled: 0,
          profileViews: 0,
          savedJobs: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Sample jobs data (can be replaced with API call later)
  const jobs = [
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
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      logo: 'AP',
      location: 'New York, USA',
      type: 'Full-time',
      experience: 'Senior Level',
      salary: '$90,000 - $120,000',
      posted: '5 days ago',
      skills: ['Python', 'Machine Learning', 'SQL'],
      featured: false
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'Growth Ventures',
      logo: 'GV',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      experience: 'Mid Level',
      salary: '$45,000 - $60,000',
      posted: '1 day ago',
      skills: ['Digital Marketing', 'SEO', 'Analytics'],
      featured: false
    }
  ];

  const applications = [
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
    },
    {
      id: 4,
      jobTitle: 'Backend Developer',
      company: 'CodeBase Solutions',
      location: 'Kampala, Uganda',
      appliedDate: '2024-01-08',
      appliedDaysAgo: '12 days ago',
      status: 'rejected'
    },
    {
      id: 5,
      jobTitle: 'Marketing Manager',
      company: 'Growth Ventures',
      location: 'Nairobi, Kenya',
      appliedDate: '2024-01-05',
      appliedDaysAgo: '15 days ago',
      status: 'interview'
    },
    {
      id: 6,
      jobTitle: 'Data Analyst',
      company: 'Analytics Pro',
      location: 'Remote',
      appliedDate: '2023-12-20',
      appliedDaysAgo: '1 month ago',
      status: 'offered'
    }
  ];

  const interviews = [
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
    },
    {
      id: 3,
      jobTitle: 'Senior Developer',
      company: 'TechCorp Inc.',
      date: '2024-01-25',
      time: '3:30 PM',
      type: 'Phone Interview',
      interviewer: 'David Wilson',
      day: '25',
      month: 'JAN'
    }
  ];

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleApplyJob = (job) => {
    // Navigate to job details or application page
    console.log('Applying to job:', job.title);
    navigate(`/job-details/${job.id}`);
  };

  const handleViewJobDetails = (job) => {
    // Navigate to job details page
    console.log('Viewing job details:', job.title);
    navigate(`/job-details/${job.id}`);
  };

  const handleViewApplication = (app) => {
    // Navigate to application details
    navigate(`/application/${app.id}`);
  };

  const handleJoinInterview = (interview) => {
    // Open interview link in new window
    window.open(`/interview/${interview.id}`, '_blank');
  };

  const handleUpdateProfile = () => {
    console.log('Navigating to profile page');
    navigate('/profile');
  };

  const handleUpdateResume = () => {
    console.log('Navigating to resume builder');
    navigate('/resume-builder');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createJobCard = (job, showUnsaveBtn = false) => {
    const isSaved = savedJobs.includes(job.id);
    
    return (
      <div key={job.id} className="job-card">
        <div className="job-header">
          <div style={{ display: 'flex', flex: 1 }}>
            <div className="company-logo">{job.logo}</div>
            <div className="job-info">
              <h3>{job.title}</h3>
              <div className="job-company">{job.company}</div>
              <div className="job-meta">
                <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                <span><i className="fas fa-briefcase"></i> {job.type}</span>
                <span><i className="fas fa-layer-group"></i> {job.experience}</span>
                <span><i className="fas fa-dollar-sign"></i> {job.salary}</span>
              </div>
            </div>
          </div>
          <div className="job-actions">
            <button 
              className={`btn ${isSaved ? 'btn-danger' : 'btn-secondary'} btn-sm`}
              onClick={() => handleSaveJob(job.id)}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              <i className={isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
            </button>
          </div>
        </div>
        <div className="job-tags">
          {job.featured && (
            <span className="tag featured">
              <i className="fas fa-star"></i> Featured
            </span>
          )}
          {job.skills.map((skill, index) => (
            <span key={index} className="tag">{skill}</span>
          ))}
          <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
            <i className="fas fa-clock"></i> {job.posted}
          </span>
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleApplyJob(job)}
          >
            <i className="fas fa-paper-plane"></i> Apply Now
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleViewJobDetails(job)}
          >
            <i className="fas fa-eye"></i> View Details
          </button>
        </div>
      </div>
    );
  };

  const createApplicationRow = (app) => (
    <tr key={app.id}>
      <td><strong>{app.jobTitle}</strong></td>
      <td>{app.company}</td>
      <td>{app.location}</td>
      <td>{app.appliedDaysAgo}</td>
      <td>
        <span className={`status-badge status-${app.status}`}>
          {app.status}
        </span>
      </td>
      <td>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleViewApplication(app)}
        >
          View
        </button>
      </td>
    </tr>
  );

  const createInterviewCard = (interview) => (
    <div key={interview.id} className="interview-card">
      <div className="interview-header">
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
            {interview.company}
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '10px', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            <div><i className="fas fa-calendar"></i> {interview.date}</div>
            <div><i className="fas fa-clock"></i> {interview.time}</div>
            <div><i className="fas fa-video"></i> {interview.type}</div>
            <div><i className="fas fa-user"></i> {interview.interviewer}</div>
          </div>
        </div>
        <div className="interview-date">
          <div className="day">{interview.day}</div>
          <div className="month">{interview.month}</div>
        </div>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => handleJoinInterview(interview)}
        >
          <i className="fas fa-video"></i> Join Interview
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => alert('Reschedule functionality coming soon!')}
        >
          <i className="fas fa-calendar"></i> Reschedule
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => alert(`Interview Details:\n${interview.jobTitle}\n${interview.company}\n${interview.date} at ${interview.time}`)}
        >
          <i className="fas fa-info-circle"></i> Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-briefcase"></i> JobPortal</h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => showSection('dashboard')}
          >
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`}
            onClick={() => showSection('jobs')}
          >
            <i className="fas fa-search"></i>
            <span>Browse Jobs</span>
            <span className="badge success">NEW</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => showSection('applications')}
          >
            <i className="fas fa-file-alt"></i>
            <span>My Applications</span>
            <span className="badge">12</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`}
            onClick={() => showSection('saved')}
          >
            <i className="fas fa-bookmark"></i>
            <span>Saved Jobs</span>
            <span className="badge">8</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`}
            onClick={() => showSection('interviews')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Interviews</span>
            <span className="badge">3</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`}
            onClick={() => showSection('matches')}
          >
            <i className="fas fa-star"></i>
            <span>Recommended</span>
            <span className="badge">15</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => showSection('messages')}
          >
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
            <span className="badge">5</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => showSection('profile')}
          >
            <i className="fas fa-user"></i>
            <span>My Profile</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`}
            onClick={() => showSection('resume')}
          >
            <i className="fas fa-file-pdf"></i>
            <span>Resume/CV</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={() => showSection('resources')}
          >
            <i className="fas fa-book"></i>
            <span>Career Resources</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => showSection('settings')}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search jobs, companies, or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  showSection('jobs');
                }
              }}
            />
          </div>
          <div className="top-bar-actions">
            <button 
              className="icon-btn"
              onClick={() => showSection('messages')}
              title="Notifications"
            >
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <button 
              className="icon-btn"
              onClick={() => window.open('/help', '_blank')}
              title="Help Center"
            >
              <i className="fas fa-question-circle"></i>
            </button>
            <div 
              className="user-profile"
              onClick={() => showSection('profile')}
              style={{ cursor: 'pointer' }}
              title="View Profile"
            >
                <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user?.title || user?.jobTitle || 'Job Seeker'}
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
              <h1 style={{ marginBottom: '25px' }}>Welcome back, {user?.name || user?.firstName || 'User'}! 👋</h1>

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
                  <button 
                    className="btn"
                    onClick={() => showSection('profile')}
                  >
                    <i className="fas fa-plus"></i> Add Skills
                  </button>
                  <button 
                    className="btn"
                    onClick={handleUpdateResume}
                  >
                    <i className="fas fa-upload"></i> Upload Resume
                  </button>
                  <button 
                    className="btn"
                    onClick={() => showSection('profile')}
                  >
                    <i className="fas fa-certificate"></i> Add Certifications
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{userStats.applicationsSent || 0}</div>
                      <div className="stat-label">Applications Sent</div>
                    </div>
                    <div className="stat-icon blue">
                      <i className="fas fa-paper-plane"></i>
                    </div>
                  </div>
                  <div className="stat-change positive">
                    <i className="fas fa-arrow-up"></i> 3 this week
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{userStats.interviewsScheduled || 0}</div>
                      <div className="stat-label">Interviews Scheduled</div>
                    </div>
                    <div className="stat-icon green">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                  <div className="stat-change">
                    Next: Tomorrow at 2:00 PM
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{userStats.profileViews || 0}</div>
                      <div className="stat-label">Profile Views</div>
                    </div>
                    <div className="stat-icon purple">
                      <i className="fas fa-eye"></i>
                    </div>
                  </div>
                  <div className="stat-change positive">
                    <i className="fas fa-arrow-up"></i> +18% from last week
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{userStats.savedJobs || 0}</div>
                      <div className="stat-label">Saved Jobs</div>
                    </div>
                    <div className="stat-icon orange">
                      <i className="fas fa-bookmark"></i>
                    </div>
                  </div>
                  <div className="stat-change">
                    2 new matches today
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="alert success">
                <i className="fas fa-check-circle" style={{ fontSize: '24px' }}></i>
                <div>
                  <strong>Great news!</strong> Your application for Senior Developer at TechCorp was viewed by the recruiter.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
                {/* Recommended Jobs */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recommended for You</h3>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => showSection('matches')}
                    >
                      View All
                    </button>
                  </div>
                  <div>
                    {jobs.slice(0, 3).map(job => createJobCard(job))}
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
                        interviews.slice(0, 2).map(interview => (
                          <div key={interview.id} className="interview-card">
                            <div className="interview-header">
                              <div style={{ flex: 1 }}>
                                <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
                                <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
                                  {interview.company}
                                </p>
                                <div style={{ fontSize: '13px', color: '#666' }}>
                                  <div><i className="fas fa-clock"></i> {interview.time}</div>
                                  <div style={{ marginTop: '5px' }}>
                                    <i className="fas fa-video"></i> {interview.type}
                                  </div>
                                </div>
                              </div>
                              <div className="interview-date">
                                <div className="day">{interview.day}</div>
                                <div className="month">{interview.month}</div>
                              </div>
                            </div>
                            <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }}>
                              <i className="fas fa-calendar"></i> View Details
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-header">
                      <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => showSection('jobs')}
                      >
                        <i className="fas fa-search"></i> Browse Jobs
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleUpdateResume}
                      >
                        <i className="fas fa-upload"></i> Update Resume
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleUpdateProfile}
                      >
                        <i className="fas fa-user-edit"></i> Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                  <h3 className="card-title">Recent Applications</h3>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => showSection('applications')}
                  >
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
                      {applications.slice(0, 5).map(createApplicationRow)}
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
                  {jobs.map(job => createJobCard(job))}
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
                      {applications.map(createApplicationRow)}
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
                  {jobs.slice(0, 4).map(job => createJobCard(job, true))}
                </div>
              </div>
            </div>
          )}

          {/* Interviews Section */}
          {activeSection === 'interviews' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
              
              <div className="alert info">
                <i className="fas fa-info-circle" style={{ fontSize: '24px' }}></i>
                <div>
                  <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
                </div>
              </div>

              <div>
                {interviews.length === 0 ? (
                  <div className="card">
                    <div className="empty-state">
                      <i className="fas fa-calendar"></i>
                      <h3>No Interviews Scheduled</h3>
                      <p>Your upcoming interviews will appear here</p>
                    </div>
                  </div>
                ) : (
                  interviews.map(createInterviewCard)
                )}
              </div>
            </div>
          )}

          {/* Recommended Jobs Section */}
          {activeSection === 'matches' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
              <div className="alert success">
                <i className="fas fa-star" style={{ fontSize: '24px' }}></i>
                <div>
                  Based on your profile and preferences, we found <strong>15 jobs</strong> that match your skills!
                </div>
              </div>
              <div className="card">
                <div>
                  {jobs.map(job => createJobCard(job))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Messages</h1>
              <div className="card">
                <div className="empty-state">
                  <i className="fas fa-envelope"></i>
                  <h3>Message Center</h3>
                  <p>Communicate with recruiters and hiring managers</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>My Profile</h1>
              <div className="card">
                <div className="empty-state">
                  <i className="fas fa-user"></i>
                  <h3>Profile Management</h3>
                  <p>Update your professional information, skills, and experience</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleUpdateProfile}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resume Section */}
          {activeSection === 'resume' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Resume/CV</h1>
              <div className="card">
                <div className="empty-state">
                  <i className="fas fa-file-pdf"></i>
                  <h3>Resume Management</h3>
                  <p>Upload and manage your resumes for different job applications</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleUpdateResume}
                  >
                    <i className="fas fa-upload"></i> Upload Resume
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Career Resources Section */}
          {activeSection === 'resources' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Career Resources</h1>
              <div className="stats-grid">
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}>
                    <i className="fas fa-book"></i> Interview Tips
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    Master your interview skills with expert advice
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/career-advice')}
                  >
                    Learn More
                  </button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}>
                    <i className="fas fa-file-alt"></i> Resume Builder
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    Create a professional resume in minutes
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleUpdateResume}
                  >
                    Start Building
                  </button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}>
                    <i className="fas fa-graduation-cap"></i> Courses
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    Upskill with online courses and certifications
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.open('/resources', '_blank')}
                  >
                    Browse Courses
                  </button>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: '15px' }}>
                    <i className="fas fa-users"></i> Career Advice
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    Get guidance from career experts
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/career-advice')}
                  >
                    Get Advice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Settings</h1>
              <div className="card">
                <div className="empty-state">
                  <i className="fas fa-cog"></i>
                  <h3>Account Settings</h3>
                  <p>Manage your preferences, notifications, and privacy settings</p>
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/jobseeker-settings')}
                    >
                      <i className="fas fa-cog"></i> Manage Settings
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
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