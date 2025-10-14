import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    applicationsSent: 12,
    interviewsScheduled: 3,
    profileViews: 142,
    savedJobs: 8
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch real user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          // Fallback to auth user
          setUser(authUser || {
            name: 'Hemant Patel',
            firstName: 'Hemant',
            lastName: 'Patel',
            email: 'hemant@example.com',
            title: 'Software Engineer'
          });
        }

        // Fetch user stats
        const statsResponse = await fetch('/api/jobseeker/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }

        // Fetch jobs
        const jobsResponse = await fetch('/api/jobs');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }

        // Fetch applications
        const applicationsResponse = await fetch('/api/jobseeker/applications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData);
        }

        // Fetch interviews
        const interviewsResponse = await fetch('/api/jobseeker/interviews', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (interviewsResponse.ok) {
          const interviewsData = await interviewsResponse.json();
          setInterviews(interviewsData);
        }

        // Fetch saved jobs
        const savedJobsResponse = await fetch('/api/jobseeker/saved-jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (savedJobsResponse.ok) {
          const savedJobsData = await savedJobsResponse.json();
          setSavedJobs(savedJobsData);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Use fallback data
        setUser({
          name: 'Hemant Patel',
          firstName: 'Hemant',
          lastName: 'Patel',
          email: 'hemant@example.com',
          title: 'Software Engineer'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleApplyJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        // Update stats
        setUserStats(prev => ({
          ...prev,
          applicationsSent: prev.applicationsSent + 1
        }));
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error submitting application');
    }
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleSaveJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Job saved successfully!');
        setUserStats(prev => ({
          ...prev,
          savedJobs: prev.savedJobs + 1
        }));
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  const handleUpdateResume = () => {
    navigate('/resume-builder');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createJobCard = (job, showUnsaveBtn = false) => (
    <div key={job.id} className="job-card">
      <div className="job-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">{job.company?.charAt(0) || 'C'}</div>
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
          {showUnsaveBtn ? (
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => handleSaveJob(job.id)}
            >
              <i className="fas fa-bookmark"></i>
            </button>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleSaveJob(job.id)}
            >
              <i className="far fa-bookmark"></i>
            </button>
          )}
        </div>
      </div>
      <div className="job-tags">
        {job.featured && <span className="tag featured"><i className="fas fa-star"></i> Featured</span>}
        {job.skills?.map((skill, index) => (
          <span key={index} className="tag">{skill}</span>
        ))}
        <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
          <i className="fas fa-clock"></i> {job.posted}
        </span>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => handleApplyJob(job.id)}
        >
          <i className="fas fa-paper-plane"></i> Apply Now
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleViewJobDetails(job.id)}
        >
          <i className="fas fa-eye"></i> View Details
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
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleViewJobDetails(app.jobId)}
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
          <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{interview.company}</p>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <div><i className="fas fa-clock"></i> {interview.time}</div>
            <div style={{ marginTop: '5px' }}><i className="fas fa-video"></i> {interview.type}</div>
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
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar - Exact HTML Copy */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-briefcase"></i> JobPortal</h2>
          <p>Your Career Journey</p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => showSection('jobs')}>
            <i className="fas fa-search"></i>
            <span>Browse Jobs</span>
            <span className="badge success">NEW</span>
          </div>
          <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => showSection('applications')}>
            <i className="fas fa-file-alt"></i>
            <span>My Applications</span>
            <span className="badge">{applications.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => showSection('saved')}>
            <i className="fas fa-bookmark"></i>
            <span>Saved Jobs</span>
            <span className="badge">{savedJobs.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => showSection('interviews')}>
            <i className="fas fa-calendar-check"></i>
            <span>Interviews</span>
            <span className="badge">{interviews.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`} onClick={() => showSection('matches')}>
            <i className="fas fa-star"></i>
            <span>Recommended</span>
            <span className="badge">15</span>
          </div>
          <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => showSection('messages')}>
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
            <span className="badge">5</span>
          </div>
          <div className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => showSection('profile')}>
            <i className="fas fa-user"></i>
            <span>My Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content - Exact HTML Copy */}
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
            />
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn">
              <i className="fas fa-question-circle"></i>
            </button>
            <div className="user-profile" onClick={handleLogout}>
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'H'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Hemant Patel'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user?.title || 'Software Engineer'}
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
                Welcome back, {user?.firstName || user?.name || 'Hemant'}! 👋
              </h1>

              {/* Profile Completion */}
              <div className="profile-completion">
                <div className="completion-header">
                  <div>
                    <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>75% Complete - Almost there!</p>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700' }}>75%</div>
                </div>
                <div className="completion-bar">
                  <div className="completion-fill"></div>
                </div>
                <div className="completion-actions">
                  <button className="btn" onClick={handleUpdateProfile}>
                    <i className="fas fa-plus"></i> Add Skills
                  </button>
                  <button className="btn" onClick={handleUpdateResume}>
                    <i className="fas fa-upload"></i> Upload Resume
                  </button>
                  <button className="btn">
                    <i className="fas fa-certificate"></i> Add Certifications
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-number">{userStats.applicationsSent}</div>
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
                      <div className="stat-number">{userStats.interviewsScheduled}</div>
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
                      <div className="stat-number">{userStats.profileViews}</div>
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
                      <div className="stat-number">{userStats.savedJobs}</div>
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

              {/* Alert */}
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
                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('matches')}>View All</button>
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
                      {interviews.length > 0 ? (
                        interviews.slice(0, 2).map(interview => createInterviewCard(interview))
                      ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No upcoming interviews</p>
                      )}
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-header">
                      <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button className="btn btn-primary" onClick={() => showSection('jobs')}>
                        <i className="fas fa-search"></i> Browse Jobs
                      </button>
                      <button className="btn btn-secondary" onClick={handleUpdateResume}>
                        <i className="fas fa-upload"></i> Update Resume
                      </button>
                      <button className="btn btn-secondary" onClick={handleUpdateProfile}>
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
                      {applications.slice(0, 5).map(app => createApplicationRow(app))}
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
                      {applications.map(app => createApplicationRow(app))}
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
                  {savedJobs.map(job => createJobCard(job, true))}
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
                {interviews.length > 0 ? (
                  interviews.map(interview => createInterviewCard(interview))
                ) : (
                  <div className="card">
                    <div className="empty-state">
                      <i className="fas fa-calendar"></i>
                      <h3>No Interviews Scheduled</h3>
                      <p>Your upcoming interviews will appear here</p>
                    </div>
                  </div>
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
                  <button className="btn btn-primary" onClick={handleUpdateProfile}>Edit Profile</button>
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
