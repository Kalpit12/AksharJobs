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
  faLanguage, faProjectDiagram, faTrophy, faChartLine, faInfoCircle,
  faPassport, faBullseye, faLightbulb, faSlidersH, faSave, faTimes,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';
import '../styles/dashboard-unified.css';
// import '../styles/InternDashboard.css'; // Replaced by unified CSS

const InternDashboardComplete = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeSection, setActiveSection] = useState(() => {
    // Check URL hash first, then localStorage, then default to dashboard
    const hash = window.location.hash.replace('#', '');
    const savedSection = localStorage.getItem('internDashboardActiveSection');
    return hash || savedSection || 'dashboard';
  });
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

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('internDashboardActiveSection', section);
    // Update URL hash without causing a page reload
    window.history.replaceState(null, null, `#${section}`);
  };

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
        axios.get(buildApiUrl('/api/application-tracker/tracker/job-seeker/applications'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/jobs/get_jobs')).catch(() => null)
      ]);

      // Transform jobs data from snake_case to camelCase for frontend compatibility
      const transformedJobs = (jobsRes?.data || []).map(job => ({
        ...job,
        jobTitle: job.job_title || job.jobTitle,
        companyName: job.company_name || job.companyName,
        salary: job.salary_range || job.salary,
        remoteOption: job.remote_option || job.remoteOption,
        jobType: job.job_type || job.jobType,
        experienceRequired: job.experience_required || job.experienceRequired,
        requiredSkills: job.required_skills || job.requiredSkills,
        educationRequired: job.education_required || job.educationRequired,
        applicationDeadline: job.application_deadline || job.applicationDeadline,
        companyWebsite: job.company_website || job.companyWebsite
      }));

      // Filter for internship-type jobs and other relevant works for interns
      const internshipJobs = transformedJobs.filter(job => {
        const jobType = job.jobType || job.job_type || '';
        const title = job.jobTitle || job.job_title || job.title || '';
        
        // Include internships, entry-level jobs, and jobs with "intern" in title
        return jobType.toLowerCase().includes('internship') ||
               jobType.toLowerCase().includes('intern') ||
               title.toLowerCase().includes('internship') ||
               title.toLowerCase().includes('intern') ||
               jobType.toLowerCase().includes('entry') ||
               jobType.toLowerCase().includes('junior') ||
               jobType.toLowerCase().includes('graduate') ||
               jobType.toLowerCase().includes('trainee');
      });

      console.log('Fetched internships:', internshipJobs.length, 'internship-type jobs out of', transformedJobs.length, 'total jobs');
      if (internshipJobs.length > 0) {
        console.log('Sample internship data:', internshipJobs[0]);
      }

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
        internships: internshipJobs,
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
      <ThemedLoadingSpinner 
        theme="intern"
        size="large"
        text="Loading your dashboard..."
        subText="Preparing your internship experience"
        showIcon={true}
        fullScreen={true}
      />
    );
  }

  return (
    <div className="dashboard-container intern-dashboard">
      {/* Sidebar */}
      <div className="sidebar" id="sidebar" style={{
        background: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
        backgroundColor: '#ff6b35',
        backgroundImage: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
        color: '#ffffff',
        position: 'fixed',
        left: '0',
        top: '0',
        width: '320px',
        height: '100vh',
        zIndex: 1000
      }}>
        <div className="sidebar-header">
          <h2>
            <FontAwesomeIcon icon={faUserGraduate} /> JOBSEEKER HUB
          </h2>
          <p>Launch Your Career</p>
        </div>
        <div className="nav-menu">
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSectionChange('dashboard')}
          >
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`}
            onClick={() => handleSectionChange('internships')}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Browse Internships</span>
            <span className="badge success">NEW</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => handleSectionChange('applications')}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            <span>My Applications</span>
            <span className="badge">{dashboardData.stats.applications}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`}
            onClick={() => handleSectionChange('saved')}
          >
            <FontAwesomeIcon icon={faBookmark} />
            <span>Saved Internships</span>
            <span className="badge">{dashboardData.stats.savedInternships}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`}
            onClick={() => handleSectionChange('interviews')}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Interviews</span>
            <span className="badge">{dashboardData.stats.interviews}</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`}
            onClick={() => handleSectionChange('matches')}
          >
            <FontAwesomeIcon icon={faStar} />
            <span>Recommended</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => handleSectionChange('messages')}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Messages</span>
            <span className="badge warning">3</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleSectionChange('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>My Profile</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'academic' ? 'active' : ''}`}
            onClick={() => handleSectionChange('academic')}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Academic Info</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => handleSectionChange('portfolio')}
          >
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Portfolio</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'learning' ? 'active' : ''}`}
            onClick={() => handleSectionChange('learning')}
          >
            <FontAwesomeIcon icon={faBook} />
            <span>Learning Resources</span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => handleSectionChange('settings')}
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
            <div className="user-profile" onClick={() => handleSectionChange('profile')}>
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
          {activeSection === 'dashboard' && <DashboardSection dashboardData={dashboardData} user={user} handleSectionChange={handleSectionChange} navigate={navigate} />}
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
    </div>
  );
};

// Dashboard Section
const DashboardSection = ({ dashboardData, user, handleSectionChange, navigate }) => (
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
        <button className="btn" onClick={() => navigate('/intern-registration')}>
          <FontAwesomeIcon icon={faUserEdit} /> Complete Profile
        </button>
        <button className="btn" onClick={() => handleSectionChange('portfolio')}>
          <FontAwesomeIcon icon={faUpload} /> Add Projects
        </button>
        <button className="btn" onClick={() => handleSectionChange('academic')}>
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
          <button className="btn btn-secondary btn-sm" onClick={() => handleSectionChange('matches')}>
            View All
          </button>
        </div>
        <div>
          {dashboardData.internships && dashboardData.internships.length > 0 ? (
            dashboardData.internships.slice(0, 3).map((internship, index) => (
              <InternshipCard key={internship._id || index} internship={internship} />
            ))
          ) : (
            <div className="empty-state">
              <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }} />
              <p>No internships available at the moment</p>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>New opportunities will appear here</p>
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
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => handleSectionChange('academic')}>
            Update Info
          </button>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => handleSectionChange('internships')}>
              <FontAwesomeIcon icon={faSearch} /> Find Internships
            </button>
            <button className="btn btn-secondary" onClick={() => handleSectionChange('portfolio')}>
              <FontAwesomeIcon icon={faUpload} /> Update Portfolio
            </button>
            <button className="btn btn-secondary" onClick={() => handleSectionChange('profile')}>
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
      {internships && internships.length > 0 ? (
        internships.map((internship, index) => (
          <InternshipCard key={internship._id || index} internship={internship} showApplyButton />
        ))
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
          <h3>No Internships Available</h3>
          <p style={{ marginBottom: '10px' }}>There are currently no internship listings available.</p>
          <p style={{ color: '#999', fontSize: '14px' }}>Check back later for new opportunities!</p>
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
    {internships && internships.length > 0 && (
      <div className="alert success">
        <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
        <div>
          Based on your profile, we found <strong>{internships.length} internships</strong> matching your skills!
        </div>
      </div>
    )}
    <div className="card">
      {internships && internships.length > 0 ? (
        internships.map((internship, index) => (
          <InternshipCard key={internship._id || index} internship={internship} showApplyButton />
        ))
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faStar} style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
          <h3>No Recommendations Yet</h3>
          <p style={{ marginBottom: '10px' }}>We're working on finding the perfect internships for you!</p>
          <p style={{ color: '#999', fontSize: '14px' }}>Complete your profile to get better matches</p>
        </div>
      )}
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
const ProfileSection = ({ profile }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    dob: '',
    gender: '',
    nationality: '',
    residentCountry: '',
    city: '',
    address: '',
    workAuth: '',
    prefLoc1: '',
    prefLoc2: '',
    prefLoc3: '',
    relocate: '',
    mode: '',
    academicLevel: '',
    objective: '',
    industry: '',
    role: '',
    duration: '',
    availability: '',
    timing: '',
    stipend: '',
    unpaid: '',
    credit: '',
    hobbies: '',
    whyInternship: ''
  });

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const saveProfile = () => {
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
    setIsEditMode(false);
    alert('Profile updated successfully!');
  };

  const cancelEdit = () => {
    setIsEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <h1 style={{ marginBottom: '25px' }}>My Profile</h1>
      
      {/* Profile Header */}
      <div className="profile-header">
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>{profileData.fullName}</h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>Computer Science Student • University of Nairobi</p>
        <div style={{ marginTop: '15px' }}>
          <button className="btn" style={{ background: 'white', color: '#22c55e' }} onClick={toggleEditMode}>
            <FontAwesomeIcon icon={faEdit} /> <span id="editBtnText">{isEditMode ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className={`profile-content ${isEditMode ? 'edit-mode' : ''}`}>

        {/* Personal Information */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faUser} />
            Personal Information
          </h3>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Full Name</div>
              <div className="profile-field-value" id="fullName">{profileData.fullName}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="fullNameInput" 
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Date of Birth</div>
              <div className="profile-field-value" id="dob">{new Date(profileData.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <input 
                type="date" 
                className="profile-field-input" 
                id="dobInput" 
                value={profileData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Gender</div>
              <div className="profile-field-value" id="gender">{profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)}</div>
              <select 
                className="profile-field-input" 
                id="genderInput"
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Email Address</div>
              <div className="profile-field-value" id="email">{profileData.email}</div>
              <input 
                type="email" 
                className="profile-field-input" 
                id="emailInput" 
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Primary Phone</div>
              <div className="profile-field-value" id="phone">{profileData.phone || 'Not provided'}</div>
              <input 
                type="tel" 
                className="profile-field-input" 
                id="phoneInput" 
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Alternative Phone</div>
              <div className="profile-field-value" id="altPhone">+254 722 987 654</div>
              <input 
                type="tel" 
                className="profile-field-input" 
                id="altPhoneInput" 
                value="+254 722 987 654"
                onChange={(e) => handleInputChange('altPhone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Nationality & Residency */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faPassport} />
            Nationality & Residency
          </h3>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Nationality</div>
              <div className="profile-field-value" id="nationality">{profileData.nationality}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="nationalityInput" 
                value={profileData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Resident Country</div>
              <div className="profile-field-value" id="residentCountry">{profileData.residentCountry}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="residentCountryInput" 
                value={profileData.residentCountry}
                onChange={(e) => handleInputChange('residentCountry', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Current City</div>
              <div className="profile-field-value" id="city">{profileData.city}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="cityInput" 
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Work Authorization</div>
              <div className="profile-field-value" id="workAuth">
                {profileData.workAuth === 'citizen' ? 'Citizen - No work permit required' : 
                 profileData.workAuth === 'yes' ? 'Yes - Valid work documents' : 
                 'No - Will need sponsorship'}
              </div>
              <select 
                className="profile-field-input" 
                id="workAuthInput"
                value={profileData.workAuth}
                onChange={(e) => handleInputChange('workAuth', e.target.value)}
              >
                <option value="citizen">Citizen - No work permit required</option>
                <option value="yes">Yes - Valid work documents</option>
                <option value="no">No - Will need sponsorship</option>
              </select>
            </div>
          </div>
          <div className="profile-grid single-column">
            <div className="profile-field">
              <div className="profile-field-label">Full Address</div>
              <div className="profile-field-value" id="address">{profileData.address}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="addressInput" 
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferred Locations */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Preferred Internship Locations
          </h3>
          <div className="profile-grid">
            <div className="profile-field">
              <div className="profile-field-label">Preferred Location 1</div>
              <div className="profile-field-value" id="prefLoc1">{profileData.prefLoc1}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="prefLoc1Input" 
                value={profileData.prefLoc1}
                onChange={(e) => handleInputChange('prefLoc1', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Preferred Location 2</div>
              <div className="profile-field-value" id="prefLoc2">{profileData.prefLoc2}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="prefLoc2Input" 
                value={profileData.prefLoc2}
                onChange={(e) => handleInputChange('prefLoc2', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Preferred Location 3</div>
              <div className="profile-field-value" id="prefLoc3">{profileData.prefLoc3}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="prefLoc3Input" 
                value={profileData.prefLoc3}
                onChange={(e) => handleInputChange('prefLoc3', e.target.value)}
              />
            </div>
          </div>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Willing to Relocate</div>
              <div className="profile-field-value" id="relocate">
                {profileData.relocate === 'yes' ? 'Yes, anywhere' : 
                 profileData.relocate === 'within-country' ? 'Within my country only' : 
                 'No, local only'}
              </div>
              <select 
                className="profile-field-input" 
                id="relocateInput"
                value={profileData.relocate}
                onChange={(e) => handleInputChange('relocate', e.target.value)}
              >
                <option value="yes">Yes, anywhere</option>
                <option value="within-country">Within my country only</option>
                <option value="no">No, local only</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Internship Mode Preference</div>
              <div className="profile-field-value" id="mode">
                {profileData.mode === 'onsite' ? 'On-site' : 
                 profileData.mode === 'remote' ? 'Remote' : 
                 profileData.mode === 'hybrid' ? 'Hybrid' : 
                 'Flexible - Open to all'}
              </div>
              <select 
                className="profile-field-input" 
                id="modeInput"
                value={profileData.mode}
                onChange={(e) => handleInputChange('mode', e.target.value)}
              >
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="flexible">Flexible - Open to all</option>
              </select>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faGraduationCap} />
            Education
          </h3>
          
          <div className="profile-grid single-column">
            <div className="profile-field">
              <div className="profile-field-label">Current Academic Level</div>
              <div className="profile-field-value" id="academicLevel">
                {profileData.academicLevel === 'high-school' ? 'High School Student' :
                 profileData.academicLevel === 'undergraduate' ? 'Undergraduate/Bachelor\'s Student' :
                 profileData.academicLevel === 'graduate' ? 'Graduate/Master\'s Student' :
                 profileData.academicLevel === 'phd' ? 'PhD Student' :
                 'Recent Graduate'}
              </div>
              <select 
                className="profile-field-input" 
                id="academicLevelInput"
                value={profileData.academicLevel}
                onChange={(e) => handleInputChange('academicLevel', e.target.value)}
              >
                <option value="high-school">High School Student</option>
                <option value="undergraduate">Undergraduate/Bachelor's Student</option>
                <option value="graduate">Graduate/Master's Student</option>
                <option value="phd">PhD Student</option>
                <option value="recent-graduate">Recent Graduate</option>
              </select>
            </div>
            
            <div className="education-item">
              <div className="item-title">University of Nairobi</div>
              <div className="item-subtitle">Bachelor of Science in Computer Science • 2021 - 2025</div>
              <div className="profile-grid two-column" style={{ marginTop: '15px' }}>
                <div className="profile-field">
                  <div className="profile-field-label">Current Year</div>
                  <div className="profile-field-value">3rd Year (Junior)</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">GPA</div>
                  <div className="profile-field-value">3.8/4.0</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Location</div>
                  <div className="profile-field-value">Nairobi, Kenya</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Expected Graduation</div>
                  <div className="profile-field-value">May 2025</div>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <div className="profile-field-label">Relevant Coursework</div>
                <div style={{ marginTop: '8px' }}>
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No coursework added yet</p>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <div className="profile-field-label">Academic Achievements</div>
                <div className="item-description" style={{ marginTop: '8px' }}>
                  • Dean's List - Fall 2023, Spring 2024<br/>
                  • Academic Excellence Scholarship Recipient<br/>
                  • Best Final Year Project - Computer Science Department<br/>
                  • President of Computer Science Student Association
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faBullseye} />
            Career Objective & Goals
          </h3>
          <div className="profile-grid single-column">
            <div className="profile-field">
              <div className="profile-field-label">Professional Objective</div>
              <div className="profile-field-value" id="objective">{profileData.objective}</div>
              <textarea 
                className="profile-field-input" 
                id="objectiveInput" 
                rows="4"
                value={profileData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
              />
            </div>
          </div>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Industry of Interest</div>
              <div className="profile-field-value" id="industry">
                {profileData.industry === 'technology' ? 'Technology & IT' :
                 profileData.industry === 'finance' ? 'Finance & Banking' :
                 profileData.industry === 'healthcare' ? 'Healthcare & Medical' :
                 profileData.industry === 'marketing' ? 'Marketing & Advertising' :
                 'Consulting'}
              </div>
              <select 
                className="profile-field-input" 
                id="industryInput"
                value={profileData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              >
                <option value="technology">Technology & IT</option>
                <option value="finance">Finance & Banking</option>
                <option value="healthcare">Healthcare & Medical</option>
                <option value="marketing">Marketing & Advertising</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Preferred Role</div>
              <div className="profile-field-value" id="role">{profileData.role}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="roleInput" 
                value={profileData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              />
            </div>
          </div>
          <div className="profile-grid single-column">
            <div className="profile-field">
              <div className="profile-field-label">Career Interests</div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No career interests added yet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faLightbulb} />
            Skills & Competencies
          </h3>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Programming Languages</div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No programming languages added yet</p>
              </div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Web Technologies</div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No web technologies added yet</p>
              </div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Tools & Technologies</div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No tools & technologies added yet</p>
              </div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Soft Skills</div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No soft skills added yet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Internship Preferences */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faSlidersH} />
            Internship Preferences & Availability
          </h3>
          <div className="profile-grid two-column">
            <div className="profile-field">
              <div className="profile-field-label">Duration Preference</div>
              <div className="profile-field-value" id="duration">
                {profileData.duration === '1-2-months' ? '1-2 months' :
                 profileData.duration === '3-months' ? '3 months' :
                 profileData.duration === '4-6-months' ? '4-6 months' :
                 profileData.duration === '6-12-months' ? '6-12 months' :
                 'Flexible'}
              </div>
              <select 
                className="profile-field-input" 
                id="durationInput"
                value={profileData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              >
                <option value="1-2-months">1-2 months</option>
                <option value="3-months">3 months</option>
                <option value="4-6-months">4-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Availability to Start</div>
              <div className="profile-field-value" id="availability">
                {profileData.availability === 'immediate' ? 'Immediately Available' :
                 profileData.availability === '1-week' ? 'Within 1 week' :
                 profileData.availability === '2-weeks' ? 'Within 2 weeks' :
                 profileData.availability === '1-month' ? 'Within 1 month' :
                 profileData.availability === 'summer' ? 'Summer Break' :
                 'Next Semester'}
              </div>
              <select 
                className="profile-field-input" 
                id="availabilityInput"
                value={profileData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
              >
                <option value="immediate">Immediately Available</option>
                <option value="1-week">Within 1 week</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="summer">Summer Break</option>
                <option value="semester">Next Semester</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Timing Preference</div>
              <div className="profile-field-value" id="timing">
                {profileData.timing === 'full-time' ? 'Full-time (during break)' :
                 profileData.timing === 'part-time' ? 'Part-time (during semester)' :
                 'Flexible'}
              </div>
              <select 
                className="profile-field-input" 
                id="timingInput"
                value={profileData.timing}
                onChange={(e) => handleInputChange('timing', e.target.value)}
              >
                <option value="full-time">Full-time (during break)</option>
                <option value="part-time">Part-time (during semester)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Expected Stipend (Monthly)</div>
              <div className="profile-field-value" id="stipend">{profileData.stipend}</div>
              <input 
                type="text" 
                className="profile-field-input" 
                id="stipendInput" 
                value={profileData.stipend}
                onChange={(e) => handleInputChange('stipend', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Willing to Accept Unpaid</div>
              <div className="profile-field-value" id="unpaid">
                {profileData.unpaid === 'yes' ? 'Yes' :
                 profileData.unpaid === 'prefer-paid' ? 'Prefer paid but open' :
                 'No, paid only'}
              </div>
              <select 
                className="profile-field-input" 
                id="unpaidInput"
                value={profileData.unpaid}
                onChange={(e) => handleInputChange('unpaid', e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="prefer-paid">Prefer paid but open</option>
                <option value="no">No, paid only</option>
              </select>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Academic Credit Required</div>
              <div className="profile-field-value" id="credit">
                {profileData.credit === 'yes' ? 'Yes, required' :
                 profileData.credit === 'preferred' ? 'Preferred but not required' :
                 'No'}
              </div>
              <select 
                className="profile-field-input" 
                id="creditInput"
                value={profileData.credit}
                onChange={(e) => handleInputChange('credit', e.target.value)}
              >
                <option value="yes">Yes, required</option>
                <option value="preferred">Preferred but not required</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certifications & Training */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faTrophy} />
            Certifications & Training
          </h3>
          
          <div className="profile-grid single-column">
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: '0' }}>No certifications added yet</p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add your certifications and training to showcase your professional development</p>
            </div>
          </div>
        </div>

        {/* Extracurricular Activities & Leadership */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faUser} />
            Extracurricular Activities & Leadership
          </h3>
          
          <div className="profile-grid single-column">
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: '0' }}>No activities added yet</p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add your extracurricular activities and leadership roles to showcase your involvement</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faInfoCircle} />
            Additional Information
          </h3>
          <div className="profile-grid single-column">
            <div className="profile-field">
              <div className="profile-field-label">Hobbies & Interests</div>
              <div className="profile-field-value" id="hobbies">{profileData.hobbies}</div>
              <textarea 
                className="profile-field-input" 
                id="hobbiesInput" 
                rows="3"
                value={profileData.hobbies}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
              />
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Why Seeking an Internship</div>
              <div className="profile-field-value" id="whyInternship">{profileData.whyInternship}</div>
              <textarea 
                className="profile-field-input" 
                id="whyInternshipInput" 
                rows="4"
                value={profileData.whyInternship}
                onChange={(e) => handleInputChange('whyInternship', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditMode && (
          <div className="edit-actions">
            <button className="btn" onClick={saveProfile} style={{ background: '#22c55e', color: 'white' }}>
              <FontAwesomeIcon icon={faSave} /> Save Changes
            </button>
            <button className="btn" onClick={cancelEdit} style={{ background: '#6b7280', color: 'white' }}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </div>
        )}

        {/* Work Experience & Internships */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faBriefcase} />
            Work Experience & Internships
          </h3>
          
          <div className="profile-grid single-column">
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: '0' }}>No work experience added yet</p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add your internships and work experience to showcase your professional background</p>
            </div>
          </div>
        </div>

        {/* Projects & Portfolio */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faCode} />
            Academic Projects & Portfolio
          </h3>
          
          <div className="profile-grid single-column">
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <FontAwesomeIcon icon={faCode} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: '0' }}>No projects added yet</p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add your academic projects and portfolio to showcase your technical skills</p>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faLanguage} />
            Languages
          </h3>
          <div className="profile-grid two-column">
            <div style={{ textAlign: 'center', padding: '20px', color: '#666', gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '14px', margin: '0', fontStyle: 'italic' }}>No languages added yet</p>
            </div>
          </div>
        </div>

        {/* Academic Projects & Portfolio */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faProjectDiagram} />
            Academic Projects & Portfolio
          </h3>
          
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <FontAwesomeIcon icon={faProjectDiagram} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', margin: '0' }}>No projects added yet</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add your academic projects and portfolio to showcase your technical skills</p>
          </div>
        </div>

        {/* Extracurricular Activities & Leadership */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faUser} />
            Extracurricular Activities & Leadership
          </h3>
          
          <div className="info-box" style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>President - Computer Science Student Society</div>
            <div style={{ color: '#666', marginBottom: '8px' }}>2023 - Present</div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              Lead a team of 15 students in organizing tech workshops, hackathons, and networking events. Increased membership by 40% and secured sponsorship for 3 major events.
            </div>
          </div>

          <div className="info-box">
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Volunteer Tutor - Code for All Initiative</div>
            <div style={{ color: '#666', marginBottom: '8px' }}>2022 - Present</div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              Teach basic programming to underprivileged high school students on weekends. Helped over 50 students learn fundamentals of Python and web development.
            </div>
          </div>
        </div>

        {/* Certifications & Training */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faTrophy} />
            Certifications & Training
          </h3>
          <div className="info-box" style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>Google Data Analytics Professional Certificate</div>
                <div style={{ color: '#666' }}>Google • Issued March 2024</div>
              </div>
              <a href="#" style={{ color: '#22c55e', whiteSpace: 'nowrap', marginLeft: '15px' }}><FontAwesomeIcon icon={faEye} /> View</a>
            </div>
          </div>
          <div className="info-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>AWS Cloud Practitioner</div>
                <div style={{ color: '#666' }}>Amazon Web Services • Issued January 2024</div>
              </div>
              <a href="#" style={{ color: '#22c55e', whiteSpace: 'nowrap', marginLeft: '15px' }}><FontAwesomeIcon icon={faEye} /> View</a>
            </div>
          </div>
        </div>

        {/* Online Presence & Portfolio */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <FontAwesomeIcon icon={faCode} />
            Online Presence & Portfolio
          </h3>
          <div className="profile-grid">
            <div className="info-box">
              <div style={{ fontWeight: '600', marginBottom: '5px' }}><FontAwesomeIcon icon={faCode} /> LinkedIn</div>
              <a href="https://linkedin.com/in/emilystudent" target="_blank" style={{ color: '#22c55e', wordBreak: 'break-all' }}>linkedin.com/in/emilystudent</a>
            </div>
            <div className="info-box">
              <div style={{ fontWeight: '600', marginBottom: '5px' }}><FontAwesomeIcon icon={faCode} /> GitHub</div>
              <a href="https://github.com/emilystudent" target="_blank" style={{ color: '#22c55e', wordBreak: 'break-all' }}>github.com/emilystudent</a>
            </div>
            <div className="info-box">
              <div style={{ fontWeight: '600', marginBottom: '5px' }}><FontAwesomeIcon icon={faCode} /> Personal Portfolio</div>
              <a href="https://emilystudent.com" target="_blank" style={{ color: '#22c55e', wordBreak: 'break-all' }}>emilystudent.com</a>
            </div>
          </div>
        </div>

        {/* Edit Actions (Hidden by default) */}
        <div className="edit-actions" style={{ display: isEditMode ? 'flex' : 'none' }}>
          <button className="btn btn-primary" onClick={saveProfile}>
            <FontAwesomeIcon icon={faSave} /> Save Changes
          </button>
          <button className="btn btn-secondary" onClick={cancelEdit}>
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <button className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faPlus} /> Add Course
        </button>
      </div>
      <div>
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>No coursework added yet</p>
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
        <button className="btn btn-primary btn-sm">Explore Courses</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faCode} /> Coding Challenges</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Practice coding and problem-solving</p>
        <button className="btn btn-primary btn-sm">Start Practicing</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faChartLine} /> Career Tips</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Get advice on internships and career growth</p>
        <button className="btn btn-primary btn-sm">Read Articles</button>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faTrophy} /> Certifications</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Earn certificates to boost your resume</p>
        <button className="btn btn-primary btn-sm">View Certifications</button>
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
        <button className="btn btn-danger">Change Password</button>
        <button className="btn btn-danger" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
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

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (typeof salary === 'string') return salary;
    if (salary.min && salary.max) return `$${salary.min} - $${salary.max}`;
    return 'Negotiable';
  };

  // Get job type display
  const getJobType = () => {
    const jobType = internship.jobType || internship.job_type;
    const remoteOption = internship.remoteOption || internship.remote_option;
    
    if (remoteOption === 'Remote') return 'Remote';
    if (remoteOption === 'Hybrid') return 'Hybrid';
    return jobType || 'Full-time';
  };

  return (
    <div className="internship-card">
      <div className="internship-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="company-logo">
            {getCompanyInitials(internship.companyName || internship.company_name || internship.company)}
          </div>
          <div className="internship-info">
            <h3>{internship.jobTitle || internship.job_title || internship.title || 'Internship Position'}</h3>
            <div className="internship-company">
              {internship.companyName || internship.company_name || internship.company || 'Company'}
            </div>
            <div className="internship-meta">
              <span>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {internship.location || 'Not specified'}
              </span>
              <span>
                <FontAwesomeIcon icon={faClock} /> {getJobType()}
              </span>
              <span>
                <FontAwesomeIcon icon={faDollarSign} /> {formatSalary(internship.salary || internship.salary_range)}
              </span>
            </div>
            {/* Show tags for job attributes */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(internship.remoteOption === 'Remote' || internship.remote_option === 'Remote') && (
                <span className="tag remote">Remote</span>
              )}
              {(internship.remoteOption === 'Hybrid' || internship.remote_option === 'Hybrid') && (
                <span className="tag remote">Hybrid</span>
              )}
              {internship.salary_range && (
                <span className="tag paid">Paid</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm">
            <FontAwesomeIcon icon={faBookmark} />
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

