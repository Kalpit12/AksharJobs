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
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as fabLinkedin, faGithub as fabGithub, faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya',
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
    jobTitle: 'Senior Software Engineer',
    experience: '8 years',
    industry: 'Technology',
    availability: 'Available Immediately',
    profilePhoto: null
  });

  // Sample data - matching HTML exactly
  const [jobs, setJobs] = useState([
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
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'Digital Solutions',
      logo: 'DS',
      location: 'Mombasa, Kenya',
      type: 'Contract',
      experience: 'Mid Level',
      salary: '$40,000 - $60,000',
      posted: '3 days ago',
      skills: ['React', 'Vue.js', 'TypeScript'],
      featured: true,
      matchScore: 92
    }
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      matchScore: 95
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      appliedDate: '2024-01-12',
      status: 'Interview Scheduled',
      matchScore: 87
    }
  ]);

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      date: '2024-01-20',
      time: '2:00 PM',
      type: 'Video Call',
      status: 'Upcoming'
    }
  ]);

  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      logo: 'CT',
      location: 'Remote',
      salary: '$70,000 - $90,000',
      savedDate: '2024-01-18'
    }
  ]);

  const [recommendedJobs, setRecommendedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'StartupXYZ',
      logo: 'SX',
      location: 'Nairobi, Kenya',
      salary: '$55,000 - $75,000',
      matchScore: 98,
      reason: 'Perfect match for your React skills'
    }
  ]);

  // Navigation function
  const showSection = (sectionId) => {
    setActiveSection(sectionId);
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
  const applyToJob = (jobId) => {
    console.log('Applying to job:', jobId);
    // Here you would typically handle job application
  };

  // Job saving function
  const saveJob = (jobId) => {
    console.log('Saving job:', jobId);
    // Here you would typically handle job saving
  };

  return (
    <div className="jobseeker-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> CareerHub</h2>
          <p>John Smith</p>
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
              <div className="dashboard-header">
                <h1>Welcome back, John! 👋</h1>
                <p>Here's what's happening with your job search today</p>
              </div>

              {/* Profile Completion Card */}
              <div className="profile-completion-card">
                <div className="completion-header">
                  <h3>Complete Your Profile</h3>
                  <span className="completion-percentage">75%</span>
                </div>
                <div className="completion-bar">
                  <div className="completion-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="completion-text">Almost there! Complete your profile to get better job matches</p>
                <div className="completion-actions">
                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} />
                    ADD SKILLS
                  </button>
                  <button className="btn btn-secondary">
                    <FontAwesomeIcon icon={faUpload} />
                    UPLOAD RESUME
                  </button>
                  <button className="btn btn-secondary">
                    <FontAwesomeIcon icon={faStar} />
                    ADD CERTIFICATIONS
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <FontAwesomeIcon icon={faUserClock} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">3</div>
                    <div className="stat-label">Applications Sent</div>
                    <div className="stat-subtitle">this week</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <FontAwesomeIcon icon={faCalendar} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">2</div>
                    <div className="stat-label">Interviews Scheduled</div>
                    <div className="stat-subtitle">Next: Tomorrow at 2:00 PM</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon purple">
                    <FontAwesomeIcon icon={faEye} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">18</div>
                    <div className="stat-label">Profile Views</div>
                    <div className="stat-subtitle">+18% from last week</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">5</div>
                    <div className="stat-label">Saved Jobs</div>
                    <div className="stat-subtitle">2 new matches today</div>
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
                {!isEditingProfile ? (
                  <button className="btn btn-primary" onClick={handleProfileEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn btn-success" onClick={handleProfileSave}>
                      <FontAwesomeIcon icon={faSave} />
                      Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={handleProfileCancel}>
                      <FontAwesomeIcon icon={faTimes} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-photo">
                    <div className="photo-placeholder">JS</div>
                  </div>
                  <div className="profile-info">
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="profile-input"
                      />
                    ) : (
                      <h2>{profileData.fullName}</h2>
                    )}
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        value={profileData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="profile-input"
                      />
                    ) : (
                      <p className="job-title">{profileData.jobTitle}</p>
                    )}
                    <div className="profile-meta">
                      <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData.location}</span>
                      <span><FontAwesomeIcon icon={faMail} /> {profileData.email}</span>
                      <span><FontAwesomeIcon icon={faPhone} /> {profileData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Professional Summary</h3>
                  {isEditingProfile ? (
                    <textarea 
                      value={profileData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      className="profile-textarea"
                      rows="4"
                    />
                  ) : (
                    <p>{profileData.summary}</p>
                  )}
                </div>

                <div className="profile-section">
                  <h3>Experience & Skills</h3>
                  <div className="skills-grid">
                    <div className="skill-item">
                      <span className="skill-label">Experience</span>
                      <span className="skill-value">{profileData.experience}</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-label">Industry</span>
                      <span className="skill-value">{profileData.industry}</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-label">Availability</span>
                      <span className="skill-value">{profileData.availability}</span>
                    </div>
                  </div>
                </div>
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
                      <button className="btn btn-danger btn-sm">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button className="btn btn-primary btn-sm">
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
