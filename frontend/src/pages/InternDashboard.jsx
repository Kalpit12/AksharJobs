import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faUserGraduate, faCalendar, faBookmark,
  faStar, faEnvelope, faCog, faThLarge, faFileAlt, faBriefcase, faBook,
  faPaperPlane, faEye, faMapMarkerAlt, faDollarSign, faClock,
  faPlus, faUpload, faAward, faArrowUp, faCheckCircle,
  faQuestionCircle, faCalendarCheck, faTrash, faEdit, faGraduationCap,
  faBars, faExclamationTriangle, faUserEdit
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/InternDashboard.css';

const InternDashboard = () => {
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
      savedInternships: 0
    },
    profileCompletion: 65,
    applications: [],
    interviews: [],
    internships: [],
    savedInternships: [],
    academicInfo: {
      currentYear: '3rd Year',
      gpa: '3.8/4.0',
      graduation: 'May 2025'
    }
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

      // Fetch data
      const [applicationsRes, jobsRes] = await Promise.all([
        axios.get(buildApiUrl('/api/application-tracker/jobseeker'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/jobs/fetch_all_jobs')).catch(() => null)
      ]);

      setDashboardData({
        stats: {
          applications: applicationsRes?.data?.applications?.length || 0,
          interviews: 0,
          profileViews: 0,
          savedInternships: 0
        },
        profileCompletion: 65,
        applications: applicationsRes?.data?.applications || [],
        interviews: [],
        internships: jobsRes?.data?.jobs || [],
        savedInternships: [],
        academicInfo: {
          currentYear: user?.currentYear || '3rd Year',
          gpa: user?.gpa || '3.8/4.0',
          graduation: user?.expectedGraduation || 'May 2025'
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'IS';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'IS';
  };

  const getUserName = () => {
    if (!user) return 'Intern';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Intern';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faUserGraduate} spin size="3x" />
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
            <FontAwesomeIcon icon={faUserGraduate} /> InternHub
          </h2>
          <p>Launch Your Career</p>
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
            className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`}
            onClick={() => setActiveSection('internships')}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Browse Internships</span>
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
            <span>Saved Internships</span>
            <span className="badge">{dashboardData.stats.savedInternships}</span>
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
            <span className="badge warning">3</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>My Profile</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveSection('academic')}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Academic Info</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveSection('portfolio')}
          >
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Portfolio</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveSection('learning')}
          >
            <FontAwesomeIcon icon={faBook} />
            <span>Learning Resources</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <div style={{ padding: '15px 0' }}>
            <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faQuestionCircle} /> Need Help?
            </div>
            <div style={{ fontSize: '11px', opacity: 0.6, textAlign: 'center', marginTop: '10px' }}>
              Version 1.0 • © 2024 InternHub
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <button className="mobile-menu-btn">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search internships, companies, or skills..." />
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
                <div style={{ fontSize: '12px', color: '#666' }}>Computer Science</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`}>
            <h1 style={{ marginBottom: '25px' }}>Welcome back, {user?.firstName || 'there'}! 🎓</h1>

            {/* Profile Completion */}
            <div className="profile-completion">
              <div className="completion-header">
                <div>
                  <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                  <p style={{ opacity: 0.9, fontSize: '14px' }}>
                    {dashboardData.profileCompletion}% Complete - Stand out to recruiters!
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
                  <FontAwesomeIcon icon={faUserEdit} /> Complete Profile
                </button>
                <button className="btn">
                  <FontAwesomeIcon icon={faUpload} /> Upload Resume
                </button>
                <button className="btn">
                  <FontAwesomeIcon icon={faAward} /> Add Coursework
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
                  <FontAwesomeIcon icon={faArrowUp} /> 2 this week
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
                  Next: Tomorrow at 10:00 AM
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
                  <FontAwesomeIcon icon={faArrowUp} /> +25% this month
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-number">{dashboardData.stats.savedInternships}</div>
                    <div className="stat-label">Saved Opportunities</div>
                  </div>
                  <div className="stat-icon orange">
                    <FontAwesomeIcon icon={faBookmark} />
                  </div>
                </div>
                <div className="stat-change">
                  3 new matches today
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="alert success">
              <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px' }} />
              <div>
                <strong>Congratulations!</strong> You've been shortlisted for the Software Development Internship at TechStart Inc.
              </div>
            </div>

            <div className="alert warning">
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '24px' }} />
              <div>
                <strong>Application Deadline:</strong> Marketing Internship at Brand Agency closes in 2 days!
              </div>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* Recommended Internships */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recommended for You</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('matches')}>
                    View All
                  </button>
                </div>
                <div>
                  {dashboardData.internships.slice(0, 3).map((internship, index) => (
                    <InternshipCard key={index} internship={internship} />
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div>
                {/* Academic Progress */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Academic Progress</h3>
                  </div>
                  <div className="academic-progress">
                    <div className="progress-item">
                      <span className="progress-label">Current Year</span>
                      <span className="progress-value">{dashboardData.academicInfo.currentYear}</span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">GPA</span>
                      <span className="progress-value">{dashboardData.academicInfo.gpa}</span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">Expected Graduation</span>
                      <span className="progress-value">{dashboardData.academicInfo.graduation}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => setActiveSection('academic')}>
                    Update Info
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="card" style={{ marginTop: '20px' }}>
                  <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setActiveSection('internships')}>
                      <FontAwesomeIcon icon={faSearch} /> Find Internships
                    </button>
                    <button className="btn btn-secondary">
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
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('applications')}>
                  View All
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Internship Title</th>
                      <th>Company</th>
                      <th>Duration</th>
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

          {/* Other Sections */}
          {['internships', 'applications', 'saved', 'interviews', 'matches', 'messages', 'profile', 'academic', 'portfolio', 'learning', 'settings'].map(section => (
            <div key={section} className={`page-section ${activeSection === section ? 'active' : ''}`}>
              <h1 style={{ marginBottom: '25px', textTransform: 'capitalize' }}>{section}</h1>
              <div className="card">
                <div className="empty-state">
                  <FontAwesomeIcon icon={section === 'internships' ? faSearch : section === 'academic' ? faGraduationCap : faBook} style={{ fontSize: '64px', color: '#ccc' }} />
                  <h3>{section.charAt(0).toUpperCase() + section.slice(1)} Section</h3>
                  <p>This section is coming soon...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Internship Card Component
const InternshipCard = ({ internship }) => {
  const getCompanyInitials = (company) => {
    if (!company) return 'CO';
    return company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="internship-card">
      <div className="internship-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">
            {getCompanyInitials(internship.companyName || internship.company)}
          </div>
          <div className="internship-info">
            <h3>{internship.jobTitle || internship.title}</h3>
            <div className="internship-company">{internship.companyName || internship.company}</div>
            <div className="internship-meta">
              <span>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {internship.location || 'Not specified'}
              </span>
              <span>
                <FontAwesomeIcon icon={faClock} /> 3-6 months
              </span>
              <span>
                <FontAwesomeIcon icon={faDollarSign} /> {internship.salary || 'Negotiable'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
      </div>
      <div className="internship-tags">
        <span className="tag featured"><FontAwesomeIcon icon={faStar} /> Featured</span>
        <span className="tag remote"><FontAwesomeIcon icon={faMapMarkerAlt} /> Remote</span>
        <span className="tag paid"><FontAwesomeIcon icon={faDollarSign} /> Paid</span>
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
};

// Application Row Component
const ApplicationRow = ({ application }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'applied': 'status-applied',
      'reviewing': 'status-reviewing',
      'interview': 'status-interview',
      'accepted': 'status-accepted',
      'rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-applied';
  };

  return (
    <tr>
      <td><strong>{application.jobTitle || application.job?.jobTitle || 'Internship Position'}</strong></td>
      <td>{application.company || application.job?.companyName || 'Company'}</td>
      <td>3 months</td>
      <td>{application.appliedDate || 'Recently'}</td>
      <td>
        <span className={`status-badge ${getStatusClass(application.status || 'applied')}`}>
          {application.status || 'applied'}
        </span>
      </td>
      <td>
        <button className="btn btn-secondary btn-sm">View</button>
      </td>
    </tr>
  );
};

export default InternDashboard;
