import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faUserGraduate, faCalendar, faBookmark,
  faStar, faEnvelope, faCog, faThLarge, faFileAlt, faBriefcase, faBook,
  faPaperPlane, faEye, faMapMarkerAlt, faDollarSign, faClock,
  faPlus, faUpload, faAward, faArrowUp, faCheckCircle,
  faQuestionCircle, faCalendarCheck, faTrash, faEdit, faGraduationCap,
  faBars, faExclamationTriangle, faUserEdit, faCode, faBuilding,
  faLanguage, faProjectDiagram, faTrophy, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/InternDashboard.css';

const InternDashboardComplete = () => {
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
      graduation: 'May 2025',
      university: 'University of Nairobi',
      major: 'Computer Science'
    },
    portfolio: [],
    projects: []
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
          graduation: user?.expectedGraduation || 'May 2025',
          university: user?.university || 'University of Nairobi',
          major: user?.major || 'Computer Science'
        },
        portfolio: [],
        projects: []
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
          <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faQuestionCircle} /> Need Help?
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
                <div style={{ fontSize: '12px', color: '#666' }}>{dashboardData.academicInfo.major}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeSection === 'dashboard' && <DashboardSection dashboardData={dashboardData} user={user} setActiveSection={setActiveSection} />}
          {activeSection === 'internships' && <InternshipsSection internships={dashboardData.internships} />}
          {activeSection === 'applications' && <ApplicationsSection applications={dashboardData.applications} />}
          {activeSection === 'saved' && <SavedInternshipsSection savedInternships={dashboardData.savedInternships} />}
          {activeSection === 'interviews' && <InterviewsSection interviews={dashboardData.interviews} />}
          {activeSection === 'matches' && <RecommendedSection internships={dashboardData.internships} />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'profile' && <ProfileSection profile={user} />}
          {activeSection === 'academic' && <AcademicSection academicInfo={dashboardData.academicInfo} />}
          {activeSection === 'portfolio' && <PortfolioSection portfolio={dashboardData.portfolio} projects={dashboardData.projects} />}
          {activeSection === 'learning' && <LearningResourcesSection />}
          {activeSection === 'settings' && <SettingsSection logout={logout} navigate={navigate} />}
        </div>
      </div>
    </>
  );
};

// Dashboard Section
const DashboardSection = ({ dashboardData, user, setActiveSection }) => (
  <div>
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
        <button className="btn" onClick={() => setActiveSection('portfolio')}>
          <FontAwesomeIcon icon={faUpload} /> Add Projects
        </button>
        <button className="btn" onClick={() => setActiveSection('academic')}>
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
          {dashboardData.internships.length === 0 && (
            <div className="empty-state">
              <p>No internships available at the moment</p>
            </div>
          )}
        </div>
      </div>

      <div>
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

        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setActiveSection('internships')}>
              <FontAwesomeIcon icon={faSearch} /> Find Internships
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveSection('portfolio')}>
              <FontAwesomeIcon icon={faUpload} /> Update Portfolio
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveSection('profile')}>
              <FontAwesomeIcon icon={faUserEdit} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Internships Section
const InternshipsSection = ({ internships }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Browse Internships</h1>

    <div className="filters">
      <select className="filter-select">
        <option>All Types</option>
        <option>Software Engineering</option>
        <option>Marketing</option>
        <option>Design</option>
        <option>Data Science</option>
      </select>
      <select className="filter-select">
        <option>All Locations</option>
        <option>Nairobi, Kenya</option>
        <option>Remote</option>
        <option>United States</option>
      </select>
      <select className="filter-select">
        <option>All Durations</option>
        <option>1-3 months</option>
        <option>3-6 months</option>
        <option>6-12 months</option>
      </select>
      <select className="filter-select">
        <option>Sort By: Most Recent</option>
        <option>Relevance</option>
        <option>Stipend: High to Low</option>
      </select>
    </div>

    <div className="card">
      {internships.map((internship, index) => (
        <InternshipCard key={index} internship={internship} showApplyButton />
      ))}
      {internships.length === 0 && (
        <div className="empty-state">
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Internships Found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  </div>
);

// Applications Section
const ApplicationsSection = ({ applications }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>My Applications</h1>
    <div className="card">
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
            {applications.map((app, index) => (
              <ApplicationRow key={index} application={app} />
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No applications yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Saved Internships Section
const SavedInternshipsSection = ({ savedInternships }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Saved Internships</h1>
    <div className="card">
      {savedInternships.length > 0 ? (
        savedInternships.map((internship, index) => (
          <InternshipCard key={index} internship={internship} showUnsaveBtn />
        ))
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Saved Internships</h3>
          <p>Bookmark internships you're interested in to view them later</p>
        </div>
      )}
    </div>
  </div>
);

// Interviews Section
const InterviewsSection = ({ interviews }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
    
    <div className="alert info">
      <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '24px' }} />
      <div>
        <strong>Tip:</strong> Research the company and prepare examples of your projects before the interview.
      </div>
    </div>

    {interviews.length > 0 ? (
      interviews.map((interview, index) => (
        <div key={index} className="interview-card">Interview details here</div>
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

// Recommended Section
const RecommendedSection = ({ internships }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Recommended Internships</h1>
    <div className="alert success">
      <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
      <div>
        Based on your profile, we found <strong>{internships.length} internships</strong> matching your skills!
      </div>
    </div>
    <div className="card">
      {internships.map((internship, index) => (
        <InternshipCard key={index} internship={internship} showApplyButton />
      ))}
    </div>
  </div>
);

// Messages Section
const MessagesSection = () => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Messages</h1>
    <div className="card">
      <div className="empty-state">
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '64px', color: '#ccc' }} />
        <h3>No Messages</h3>
        <p>Your messages from companies will appear here</p>
      </div>
    </div>
  </div>
);

// Profile Section
const ProfileSection = ({ profile }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>My Profile</h1>
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Personal Information</h3>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
      </div>
      <div className="profile-info-grid">
        <div>
          <label>Full Name</label>
          <p>{profile?.firstName} {profile?.lastName}</p>
        </div>
        <div>
          <label>Email</label>
          <p>{profile?.email}</p>
        </div>
        <div>
          <label>Phone</label>
          <p>{profile?.phone || 'Not provided'}</p>
        </div>
        <div>
          <label>Location</label>
          <p>{profile?.location || 'Not provided'}</p>
        </div>
      </div>
    </div>
  </div>
);

// Academic Section
const AcademicSection = ({ academicInfo }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Academic Information</h1>
    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education Details</h3>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
      </div>
      <div className="profile-info-grid">
        <div>
          <label>University</label>
          <p>{academicInfo.university}</p>
        </div>
        <div>
          <label>Major</label>
          <p>{academicInfo.major}</p>
        </div>
        <div>
          <label>Current Year</label>
          <p>{academicInfo.currentYear}</p>
        </div>
        <div>
          <label>GPA</label>
          <p>{academicInfo.gpa}</p>
        </div>
        <div>
          <label>Expected Graduation</label>
          <p>{academicInfo.graduation}</p>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faBook} /> Relevant Coursework</h3>
        <button className="btn btn-secondary btn-sm">
          <FontAwesomeIcon icon={faPlus} /> Add Course
        </button>
      </div>
      <div>
        {['Data Structures', 'Algorithms', 'Web Development', 'Database Systems', 'Software Engineering'].map(course => (
          <span key={course} className="skill-tag" style={{ margin: '5px' }}>{course}</span>
        ))}
      </div>
    </div>
  </div>
);

// Portfolio Section
const PortfolioSection = ({ portfolio, projects }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Portfolio</h1>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faProjectDiagram} /> Projects</h3>
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faPlus} /> Add Project
        </button>
      </div>
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <div key={index} className="project-card">
            {project.title}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faProjectDiagram} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No Projects Yet</h3>
          <p>Showcase your work by adding projects to your portfolio</p>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Add Your First Project
          </button>
        </div>
      )}
    </div>
  </div>
);

// Learning Resources Section
const LearningResourcesSection = () => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Learning Resources</h1>
    <div className="stats-grid">
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faBook} /> Online Courses</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Enhance your skills with free and paid courses</p>
        <button className="btn btn-secondary btn-sm">Explore Courses</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faCode} /> Coding Challenges</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Practice coding and problem-solving</p>
        <button className="btn btn-secondary btn-sm">Start Practicing</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faChartLine} /> Career Tips</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Get advice on internships and career growth</p>
        <button className="btn btn-secondary btn-sm">Read Articles</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faTrophy} /> Certifications</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Earn certificates to boost your resume</p>
        <button className="btn btn-secondary btn-sm">View Certifications</button>
      </div>
    </div>
  </div>
);

// Settings Section
const SettingsSection = ({ logout, navigate }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Settings</h1>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faBell} /> Notification Preferences</h3>
      </div>
      <div className="settings-section">
        <SettingItem title="Email Notifications" description="Receive internship alerts via email" />
        <SettingItem title="Application Updates" description="Get notified about application status" />
        <SettingItem title="Interview Reminders" description="Receive reminders for scheduled interviews" />
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faCog} /> Account Actions</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="btn btn-secondary">Change Password</button>
        <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  </div>
);

// Helper Components
const InternshipCard = ({ internship, showApplyButton = false, showUnsaveBtn = false }) => {
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
            <FontAwesomeIcon icon={showUnsaveBtn ? faBookmark : faBookmark} />
          </button>
        </div>
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

const SettingItem = ({ title, description }) => (
  <div className="settings-item">
    <div>
      <h4>{title}</h4>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{description}</p>
    </div>
    <div className="toggle-switch active"></div>
  </div>
);

export default InternDashboardComplete;

