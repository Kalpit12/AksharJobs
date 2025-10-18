import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faBriefcase, faCalendar, faUsers,
  faStream, faEnvelope, faCog, faThLarge, faUserGraduate, faChartBar,
  faPlus, faEye, faEdit, faTrash, faPaperPlane, faArrowUp,
  faHandshake, faUserClock, faTimes, faStar, faPhone, faMapMarkerAlt,
  faCalendarAlt, faVideo, faInfoCircle, faClock, faCheckCircle,
  faDownload, faSave, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/RecruiterDashboard.css';
import LoadingSpinner from '../components/LoadingSpinner';

const RecruiterDashboardComplete = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeSection, setActiveSection] = useState(() => {
    // Get the saved section from localStorage, default to 'dashboard'
    return localStorage.getItem('recruiterDashboardActiveSection') || 'dashboard';
  });
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [activeJobFilter, setActiveJobFilter] = useState(() => {
    return localStorage.getItem('recruiterActiveJobFilter') || 'all';
  });
  const [activeInternshipFilter, setActiveInternshipFilter] = useState(() => {
    return localStorage.getItem('recruiterActiveInternshipFilter') || 'all';
  });
  
  // Candidates filter states
  const [candidatesPositionFilter, setCandidatesPositionFilter] = useState(() => {
    return localStorage.getItem('recruiterCandidatesPositionFilter') || 'all';
  });
  const [candidatesStatusFilter, setCandidatesStatusFilter] = useState(() => {
    return localStorage.getItem('recruiterCandidatesStatusFilter') || 'all';
  });
  const [candidatesSortFilter, setCandidatesSortFilter] = useState(() => {
    return localStorage.getItem('recruiterCandidatesSortFilter') || 'recent';
  });

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recruiterDashboardActiveSection', activeSection);
  }, [activeSection]);

  // Save filter states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recruiterActiveJobFilter', activeJobFilter);
  }, [activeJobFilter]);

  useEffect(() => {
    localStorage.setItem('recruiterActiveInternshipFilter', activeInternshipFilter);
  }, [activeInternshipFilter]);

  // Save candidates filter states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recruiterCandidatesPositionFilter', candidatesPositionFilter);
  }, [candidatesPositionFilter]);

  useEffect(() => {
    localStorage.setItem('recruiterCandidatesStatusFilter', candidatesStatusFilter);
  }, [candidatesStatusFilter]);

  useEffect(() => {
    localStorage.setItem('recruiterCandidatesSortFilter', candidatesSortFilter);
  }, [candidatesSortFilter]);
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      activePostings: 0,
      totalApplications: 0,
      interviewStage: 0,
      offersExtended: 0
    },
    jobs: [],
    internships: [],
    candidates: [],
    applications: [],
    pipeline: {
      applied: [],
      screening: [],
      interview: [],
      assessment: [],
      offer: [],
      hired: []
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch recruiter data
      const [jobsRes, applicationsRes, internshipsRes] = await Promise.all([
        axios.get(buildApiUrl('/api/jobs/recruiter'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/recruiters/applications'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/recruiters/internships'), { headers }).catch(() => null)
      ]);

      setDashboardData({
        stats: {
          activePostings: jobsRes?.data?.length || 0,
          totalApplications: applicationsRes?.data?.length || 0,
          interviewStage: applicationsRes?.data?.filter(app => app.status === 'interview').length || 0,
          offersExtended: applicationsRes?.data?.filter(app => app.status === 'offer').length || 0
        },
        jobs: jobsRes?.data || [],
        internships: internshipsRes?.data || [],
        candidates: [],
        applications: applicationsRes?.data || [],
        pipeline: {
          applied: [],
          screening: [],
          interview: [],
          assessment: [],
          offer: [],
          hired: []
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'JD';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'JD';
  };

  // Handler functions for buttons
  const handleViewJob = (job) => {
    console.log('View Job button clicked!', job);
    setSelectedJob(job);
    // Navigate to job details or show modal
    alert(`Viewing job: ${job.jobTitle || job.title}`);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    // Navigate to edit job page
    navigate(`/edit-job/${job._id || job.id}`);
  };

  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    // Navigate to internship details or show modal
    alert(`Viewing internship: ${internship.title}`);
  };

  const handleEditInternship = (internship) => {
    setSelectedInternship(internship);
    // Navigate to edit internship page
    navigate(`/edit-internship/${internship._id || internship.id}`);
  };

  const handleComposeMessage = () => {
    console.log('Compose Message button clicked!');
    setShowMessageModal(true);
  };

  const handleScheduleInterview = () => {
    console.log('Schedule Interview button clicked!');
    setShowScheduleModal(true);
  };

  const handleSendMessage = (candidate) => {
    alert(`Sending message to ${candidate.name}`);
  };

  const handleScheduleCandidateInterview = (candidate) => {
    alert(`Scheduling interview with ${candidate.name}`);
  };

  const handleDownloadResume = (candidate) => {
    alert(`Downloading resume for ${candidate.name}`);
  };

  const handleChangePassword = () => {
    alert('Change password functionality - redirecting to password change page');
  };

  const handleNotificationPreferences = () => {
    alert('Notification preferences - opening settings');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion confirmed');
    }
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    alert('Job posting functionality - redirecting to full job posting form');
    setShowJobModal(false);
  };

  const handleInternshipSubmit = (e) => {
    e.preventDefault();
    alert('Internship posting functionality - redirecting to full internship posting form');
    setShowInternshipModal(false);
  };

  const handlePipelineFilter = (filterValue) => {
    alert(`Filtering pipeline by: ${filterValue}`);
  };

  const handleJobFilter = (filterType) => {
    setActiveJobFilter(filterType);
  };

  const handleInternshipFilter = (filterType) => {
    setActiveInternshipFilter(filterType);
  };

  // Calculate job counts for each filter
  const getJobCounts = () => {
    const jobs = dashboardData.jobs || [];
    return {
      all: jobs.length,
      active: jobs.filter(job => job.status === 'active' || !job.status).length,
      drafts: jobs.filter(job => job.status === 'draft').length,
      closed: jobs.filter(job => job.status === 'closed').length
    };
  };

  // Calculate internship counts for each filter
  const getInternshipCounts = () => {
    const internships = dashboardData.internships || [];
    return {
      all: internships.length,
      active: internships.filter(internship => internship.status === 'active' || !internship.status).length,
      drafts: internships.filter(internship => internship.status === 'draft').length,
      closed: internships.filter(internship => internship.status === 'closed').length
    };
  };

  const viewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading Dashboard"
        subMessage="Fetching your latest data..."
        size="large"
        showIcon={true}
      />
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><FontAwesomeIcon icon={faBriefcase} /> RecruiterHub</h2>
          <p>{user?.companyName || 'Acme Corporation'}</p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/recruiter-registration')} 
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 138, 101, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            style={{ 
              background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
              color: 'white',
              border: '2px solid #FF7043',
              margin: '10px 0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}>
            <FontAwesomeIcon icon={faUser} />
            <span>COMPLETE PROFILE</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSection('jobs')}>
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Job Postings</span>
            <span className="badge">{dashboardData.stats.activePostings}</span>
          </div>
          <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => setActiveSection('internships')}>
            <FontAwesomeIcon icon={faUserGraduate} />
            <span>Internships</span>
            {dashboardData.internships.length > 0 && (
              <span className="badge">{dashboardData.internships.length}</span>
            )}
          </div>
          <div className={`nav-item ${activeSection === 'candidates' ? 'active' : ''}`} onClick={() => setActiveSection('candidates')}>
            <FontAwesomeIcon icon={faUsers} />
            <span>All Candidates</span>
            <span className="badge">{dashboardData.stats.totalApplications}</span>
          </div>
          <div className={`nav-item ${activeSection === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveSection('pipeline')}>
            <FontAwesomeIcon icon={faStream} />
            <span>Recruitment Pipeline</span>
          </div>
          <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Messages</span>
            {/* Messages badge will be added when messaging system is implemented */}
          </div>
          <div className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`} onClick={() => setActiveSection('calendar')}>
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Interview Calendar</span>
          </div>
          <div className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSection('analytics')}>
            <FontAwesomeIcon icon={faChartBar} />
            <span>Analytics</span>
          </div>
          <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
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
            <input type="text" placeholder="Search candidates, jobs, or internships..." />
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn">
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn" onClick={() => setShowJobModal(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <div className="user-profile">
              <div className="user-avatar">{getUserInitials()}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.firstName || 'John'} {user?.lastName || 'Doe'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>HR Manager</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeSection === 'dashboard' && <DashboardSection dashboardData={dashboardData} setActiveSection={setActiveSection} setShowJobModal={setShowJobModal} setShowInternshipModal={setShowInternshipModal} navigate={navigate} />}
          {activeSection === 'jobs' && <JobsSection jobs={dashboardData.jobs} setShowJobModal={setShowJobModal} navigate={navigate} handleViewJob={handleViewJob} handleEditJob={handleEditJob} activeJobFilter={activeJobFilter} handleJobFilter={handleJobFilter} getJobCounts={getJobCounts} />}
          {activeSection === 'internships' && <InternshipsSection internships={dashboardData.internships} setShowInternshipModal={setShowInternshipModal} navigate={navigate} handleViewInternship={handleViewInternship} handleEditInternship={handleEditInternship} activeInternshipFilter={activeInternshipFilter} handleInternshipFilter={handleInternshipFilter} getInternshipCounts={getInternshipCounts} />}
          {activeSection === 'candidates' && <CandidatesSection candidates={dashboardData.candidates} viewCandidate={viewCandidate} candidatesPositionFilter={candidatesPositionFilter} setCandidatesPositionFilter={setCandidatesPositionFilter} candidatesStatusFilter={candidatesStatusFilter} setCandidatesStatusFilter={setCandidatesStatusFilter} candidatesSortFilter={candidatesSortFilter} setCandidatesSortFilter={setCandidatesSortFilter} />}
          {activeSection === 'pipeline' && <PipelineSection pipeline={dashboardData.pipeline} viewCandidate={viewCandidate} handlePipelineFilter={handlePipelineFilter} />}
          {activeSection === 'messages' && <MessagesSection handleComposeMessage={handleComposeMessage} />}
          {activeSection === 'calendar' && <CalendarSection handleScheduleInterview={handleScheduleInterview} />}
          {activeSection === 'analytics' && <AnalyticsSection stats={dashboardData.stats} />}
          {activeSection === 'settings' && <SettingsSection logout={logout} navigate={navigate} handleChangePassword={handleChangePassword} handleNotificationPreferences={handleNotificationPreferences} handleDeleteAccount={handleDeleteAccount} />}
        </div>
      </div>

      {/* Modals */}
      {showJobModal && <JobPostingModal onClose={() => setShowJobModal(false)} handleJobSubmit={handleJobSubmit} />}
      {showInternshipModal && <InternshipPostingModal onClose={() => setShowInternshipModal(false)} handleInternshipSubmit={handleInternshipSubmit} />}
      {showCandidateModal && selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setShowCandidateModal(false)} handleSendMessage={handleSendMessage} handleScheduleCandidateInterview={handleScheduleCandidateInterview} handleDownloadResume={handleDownloadResume} />}
      {showMessageModal && <MessageModal onClose={() => setShowMessageModal(false)} />}
      {showScheduleModal && <ScheduleModal onClose={() => setShowScheduleModal(false)} />}
    </>
  );
};

// Dashboard Section
const DashboardSection = ({ dashboardData, setActiveSection, setShowJobModal, setShowInternshipModal, navigate }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Dashboard Overview</h1>
    
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.activePostings}</div>
            <div className="stat-label">Active Postings</div>
          </div>
          <div className="stat-icon blue">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
        </div>
        <div className="stat-change positive">
          <FontAwesomeIcon icon={faArrowUp} /> 2 new this week
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-icon green">
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </div>
        <div className="stat-change positive">
          <FontAwesomeIcon icon={faArrowUp} /> +23% from last month
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.interviewStage}</div>
            <div className="stat-label">In Interview Stage</div>
          </div>
          <div className="stat-icon purple">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
        </div>
        <div className="stat-change">
          15 scheduled this week
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{dashboardData.stats.offersExtended}</div>
            <div className="stat-label">Offers Extended</div>
          </div>
          <div className="stat-icon orange">
            <FontAwesomeIcon icon={faHandshake} />
          </div>
        </div>
        <div className="stat-change positive">
          <FontAwesomeIcon icon={faArrowUp} /> 8 accepted
        </div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Applications</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('candidates')}>View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="candidate-avatar-small">SA</div>
                    <div>
                      <div style={{ fontWeight: '500' }}>Sarah Anderson</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Full Stack Developer</div>
                    </div>
                  </div>
                </td>
                <td>Senior Developer</td>
                <td>2 hours ago</td>
                <td><span className="status-badge status-pending">New</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
            <FontAwesomeIcon icon={faPlus} /> Post New Job
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
            <FontAwesomeIcon icon={faPlus} /> Post Internship
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveSection('candidates')}>
            <FontAwesomeIcon icon={faSearch} /> Search Candidates
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveSection('calendar')}>
            <FontAwesomeIcon icon={faCalendar} /> Schedule Interview
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Jobs Section
const JobsSection = ({ jobs, setShowJobModal, navigate, handleViewJob, handleEditJob, activeJobFilter, handleJobFilter, getJobCounts }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Job Postings</h1>
      <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
        <FontAwesomeIcon icon={faPlus} /> Post New Job
      </button>
    </div>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <button 
        onClick={() => handleJobFilter('all')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeJobFilter === 'all' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        All Jobs ({getJobCounts().all})
      </button>
      <button 
        onClick={() => handleJobFilter('active')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeJobFilter === 'active' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Active ({getJobCounts().active})
      </button>
      <button 
        onClick={() => handleJobFilter('drafts')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeJobFilter === 'drafts' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Drafts ({getJobCounts().drafts})
      </button>
      <button 
        onClick={() => handleJobFilter('closed')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeJobFilter === 'closed' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Closed ({getJobCounts().closed})
      </button>
    </div>

    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Applications</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filteredJobs = jobs.filter(job => {
                switch(activeJobFilter) {
                  case 'active': return job.status === 'active' || !job.status;
                  case 'drafts': return job.status === 'draft';
                  case 'closed': return job.status === 'closed';
                  default: return true; // 'all'
                }
              });
              return filteredJobs.length > 0 ? filteredJobs.map((job, index) => (
              <tr key={index}>
                <td><strong>{job.jobTitle}</strong></td>
                <td>{job.location}</td>
                <td>{job.jobType}</td>
                <td><strong>45</strong></td>
                <td>2 weeks ago</td>
                <td><span className="status-badge status-active">active</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleViewJob(job)}>View</button>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: '5px' }} onClick={() => handleEditJob(job)}>Edit</button>
                </td>
              </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {activeJobFilter === 'all' ? 'No jobs posted yet' : `No ${activeJobFilter} jobs found`}
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Internships Section
const InternshipsSection = ({ internships, setShowInternshipModal, navigate, handleViewInternship, handleEditInternship, activeInternshipFilter, handleInternshipFilter, getInternshipCounts }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Internship Postings</h1>
      <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
        <FontAwesomeIcon icon={faPlus} /> Post New Internship
      </button>
    </div>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <button 
        onClick={() => handleInternshipFilter('all')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeInternshipFilter === 'all' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        All Internships ({getInternshipCounts().all})
      </button>
      <button 
        onClick={() => handleInternshipFilter('active')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeInternshipFilter === 'active' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Active ({getInternshipCounts().active})
      </button>
      <button 
        onClick={() => handleInternshipFilter('drafts')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeInternshipFilter === 'drafts' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Drafts ({getInternshipCounts().drafts})
      </button>
      <button 
        onClick={() => handleInternshipFilter('closed')}
        style={{ 
          minWidth: '120px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid',
          fontWeight: '600',
          cursor: 'pointer',
          ...(activeInternshipFilter === 'closed' ? {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
            borderColor: '#FF7043',
            color: 'white'
          } : {
            background: 'white',
            borderColor: '#e0e0e0',
            color: '#333'
          })
        }}
      >
        Closed ({getInternshipCounts().closed})
      </button>
    </div>

    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Internship Title</th>
              <th>Department</th>
              <th>Duration</th>
              <th>Applications</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filteredInternships = internships.filter(internship => {
                switch(activeInternshipFilter) {
                  case 'active': return internship.status === 'active' || !internship.status;
                  case 'drafts': return internship.status === 'draft';
                  case 'closed': return internship.status === 'closed';
                  default: return true; // 'all'
                }
              });
              return filteredInternships.length > 0 ? filteredInternships.map((internship, index) => (
              <tr key={index}>
                <td><strong>{internship.title}</strong></td>
                <td>{internship.department}</td>
                <td>{internship.duration}</td>
                <td><strong>52</strong></td>
                <td>1 week ago</td>
                <td><span className="status-badge status-active">active</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleViewInternship(internship)}>View</button>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: '5px' }} onClick={() => handleEditInternship(internship)}>Edit</button>
                </td>
              </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {activeInternshipFilter === 'all' ? 'No internships posted yet' : `No ${activeInternshipFilter} internships found`}
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder, minWidth = '150px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => setIsOpen(!isOpen);
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder };
  
  return (
    <div style={{ position: 'relative', minWidth, zIndex: 1000 }}>
      <div
        onClick={handleToggle}
        style={{
          width: '100%',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid #FF8A65',
          background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 138, 101, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <span>{selectedOption.label}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }} 
        />
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '2px solid #FF8A65',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#333',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background-color 0.2s ease',
                backgroundColor: option.value === value ? '#fff5f2' : 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fff5f2';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = option.value === value ? '#fff5f2' : 'white';
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Candidates Section
const CandidatesSection = ({ candidates, viewCandidate, candidatesPositionFilter, setCandidatesPositionFilter, candidatesStatusFilter, setCandidatesStatusFilter, candidatesSortFilter, setCandidatesSortFilter }) => {
  const sampleCandidates = [
    { initials: 'SA', name: 'Sarah Anderson', title: 'Full Stack Developer', position: 'Senior Developer', location: 'Nairobi, Kenya', experience: '5 years', status: 'new', skills: ['Python', 'React', 'Node.js', 'AWS'] },
    { initials: 'MK', name: 'Michael Kim', title: 'Marketing Manager', position: 'Marketing Lead', location: 'Remote', experience: '7 years', status: 'screening', skills: ['Digital Marketing', 'SEO', 'Content Strategy'] },
    { initials: 'EP', name: 'Emma Peters', title: 'UX Designer', position: 'Product Designer', location: 'Nairobi, Kenya', experience: '4 years', status: 'interview', skills: ['Figma', 'UI Design', 'User Research'] }
  ];

  // Dropdown options
  const positionOptions = [
    { value: 'all', label: 'All Positions' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Sort By: Most Recent' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'name', label: 'Name A-Z' }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '25px' }}>All Candidates</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <CustomDropdown
          value={candidatesPositionFilter}
          onChange={setCandidatesPositionFilter}
          options={positionOptions}
          placeholder="All Positions"
          minWidth="150px"
        />
        
        <CustomDropdown
          value={candidatesStatusFilter}
          onChange={setCandidatesStatusFilter}
          options={statusOptions}
          placeholder="All Statuses"
          minWidth="150px"
        />
        
        <CustomDropdown
          value={candidatesSortFilter}
          onChange={setCandidatesSortFilter}
          options={sortOptions}
          placeholder="Sort By: Most Recent"
          minWidth="180px"
        />
      </div>

      <div className="card">
        {sampleCandidates.map((candidate, index) => (
          <div key={index} className="candidate-card" onClick={() => viewCandidate(candidate)}>
            <div className="candidate-header">
              <div className="candidate-info">
                <div className="candidate-avatar">{candidate.initials}</div>
                <div className="candidate-details">
                  <h3>{candidate.name}</h3>
                  <p style={{ color: '#666' }}>{candidate.title}</p>
                  <div className="candidate-meta">
                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {candidate.location}</span>
                    <span><FontAwesomeIcon icon={faBriefcase} /> {candidate.experience}</span>
                  </div>
                </div>
              </div>
              <div className="candidate-actions">
                <span className={`status-badge status-${candidate.status}`}>{candidate.status}</span>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <strong>Applied for:</strong> {candidate.position}
            </div>
            <div className="candidate-skills">
              {candidate.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pipeline Section
const PipelineSection = ({ pipeline, viewCandidate, handlePipelineFilter }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Recruitment Pipeline</h1>
      <div style={{ position: 'relative', minWidth: '250px' }}>
        <select style={{
          width: '100%',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid #FF8A65',
          background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'all 0.3s ease',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 8px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px',
          paddingRight: '40px'
        }} 
        onChange={(e) => handlePipelineFilter(e.target.value)}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 138, 101, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)';
          e.target.style.boxShadow = 'none';
        }}
        onFocus={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)';
          e.target.style.boxShadow = '0 0 0 3px rgba(255, 138, 101, 0.3)';
        }}
        onBlur={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)';
          e.target.style.boxShadow = 'none';
        }}>
          <option value="all" style={{ background: '#fff', color: '#333', padding: '8px' }}>All Positions</option>
          <option value="senior-developer" style={{ background: '#fff', color: '#333', padding: '8px' }}>Senior Developer</option>
          <option value="marketing-lead" style={{ background: '#fff', color: '#333', padding: '8px' }}>Marketing Lead</option>
          <option value="product-designer" style={{ background: '#fff', color: '#333', padding: '8px' }}>Product Designer</option>
        </select>
      </div>
    </div>

    <div className="pipeline-container">
      {['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired'].map(stage => (
        <div key={stage} className="pipeline-stage">
          <div className="stage-header">
            <div className="stage-title">{stage}</div>
            <div className="stage-count">0</div>
          </div>
          <div className="stage-candidates">
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No candidates in this stage
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Messages Section
const MessagesSection = ({ handleComposeMessage }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Messages</h1>
    <div className="card">
      <div className="empty-state">
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '64px', color: '#ccc' }} />
        <h3>Message Center</h3>
        <p>Communicate with candidates directly through the platform</p>
        <button className="btn btn-primary" onClick={handleComposeMessage}>Compose Message</button>
      </div>
    </div>
  </div>
);

// Calendar Section
const CalendarSection = ({ handleScheduleInterview }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Interview Calendar</h1>
    <div className="card">
      <div className="empty-state">
        <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '64px', color: '#ccc' }} />
        <h3>Interview Schedule</h3>
        <p>Manage and schedule interviews with candidates</p>
        <button className="btn btn-primary" onClick={handleScheduleInterview}>Schedule Interview</button>
      </div>
    </div>
  </div>
);

// Analytics Section
const AnalyticsSection = ({ stats }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Recruitment Analytics</h1>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{stats.activePostings}</div>
            <div className="stat-label">Active Postings</div>
          </div>
          <div className="stat-icon blue">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-icon green">
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{stats.interviewStage}</div>
            <div className="stat-label">Interviews</div>
          </div>
          <div className="stat-icon purple">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-number">{stats.offersExtended}</div>
            <div className="stat-label">Offers</div>
          </div>
          <div className="stat-icon orange">
            <FontAwesomeIcon icon={faHandshake} />
          </div>
        </div>
      </div>
    </div>

    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-header">
        <h3 className="card-title">Application Trends</h3>
      </div>
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <FontAwesomeIcon icon={faChartBar} style={{ fontSize: '48px', marginBottom: '15px', color: '#ccc' }} />
        <p>Chart visualization coming soon</p>
      </div>
    </div>
  </div>
);

// Settings Section
const SettingsSection = ({ logout, navigate, handleChangePassword, handleNotificationPreferences, handleDeleteAccount }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Settings</h1>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faCog} /> Account Settings</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="btn btn-secondary" onClick={handleChangePassword}>Change Password</button>
        <button className="btn btn-secondary" onClick={handleNotificationPreferences}>Notification Preferences</button>
        <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  </div>
);

// Modal Components
const JobPostingModal = ({ onClose, handleJobSubmit }) => (
  <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Post New Job</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleJobSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input type="text" required placeholder="e.g., Senior Software Engineer" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select required>
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Design</option>
              </select>
            </div>
            <div className="form-group">
              <label>Employment Type *</label>
              <select required>
                <option value="">Select Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" required placeholder="e.g., Nairobi, Kenya" />
            </div>
            <div className="form-group">
              <label>Work Mode *</label>
              <select required>
                <option value="">Select Mode</option>
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea required placeholder="Describe the role, responsibilities, and requirements..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Post Job</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const InternshipPostingModal = ({ onClose, handleInternshipSubmit }) => (
  <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Post New Internship</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleInternshipSubmit}>
          <div className="form-group">
            <label>Internship Title *</label>
            <input type="text" required placeholder="e.g., Software Development Intern" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select required>
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Design</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <select required>
                <option value="">Select Duration</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>12 months</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea required placeholder="Describe the internship..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Post Internship</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const CandidateModal = ({ candidate, onClose, handleSendMessage, handleScheduleCandidateInterview, handleDownloadResume }) => (
  <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Candidate Profile</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="candidate-avatar-large">{candidate.initials}</div>
          <h2 style={{ marginBottom: '5px', marginTop: '15px' }}>{candidate.name}</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>{candidate.title}</p>
          <div style={{ marginTop: '10px' }}>
            <span className={`status-badge status-${candidate.status}`}>{candidate.status}</span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '25px' }}>
          <div>
            <strong>Applied Position:</strong><br/>{candidate.position}
          </div>
          <div>
            <strong>Experience:</strong><br/>{candidate.experience}
          </div>
          <div>
            <strong>Location:</strong><br/>{candidate.location}
          </div>
          <div>
            <strong>Status:</strong><br/>{candidate.status}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Skills:</strong>
          <div className="candidate-skills">
            {candidate.skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '25px' }}>
          <button className="btn btn-primary" onClick={() => handleSendMessage(candidate)}>
            <FontAwesomeIcon icon={faEnvelope} /> Send Message
          </button>
          <button className="btn btn-secondary" onClick={() => handleScheduleCandidateInterview(candidate)}>
            <FontAwesomeIcon icon={faCalendar} /> Schedule Interview
          </button>
          <button className="btn btn-secondary" onClick={() => handleDownloadResume(candidate)}>
            <FontAwesomeIcon icon={faDownload} /> Download Resume
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Message Modal
const MessageModal = ({ onClose }) => (
  <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Compose Message</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); onClose(); }}>
          <div className="form-group">
            <label>To *</label>
            <select required>
              <option value="">Select Candidate</option>
              <option value="candidate1">Sarah Anderson</option>
              <option value="candidate2">Michael Kim</option>
              <option value="candidate3">Emma Peters</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Subject *</label>
            <input type="text" required placeholder="Message subject" />
          </div>
          
          <div className="form-group">
            <label>Message *</label>
            <textarea required rows="6" placeholder="Type your message here..."></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Schedule Modal
const ScheduleModal = ({ onClose }) => (
  <div className="modal active" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Schedule Interview</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); alert('Interview scheduled!'); onClose(); }}>
          <div className="form-group">
            <label>Candidate *</label>
            <select required>
              <option value="">Select Candidate</option>
              <option value="candidate1">Sarah Anderson</option>
              <option value="candidate2">Michael Kim</option>
              <option value="candidate3">Emma Peters</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Job Position *</label>
            <select required>
              <option value="">Select Position</option>
              <option value="job1">Senior Developer</option>
              <option value="job2">Marketing Lead</option>
              <option value="job3">Product Designer</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" required />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input type="time" required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Interview Type *</label>
            <select required>
              <option value="">Select Type</option>
              <option value="phone">Phone Interview</option>
              <option value="video">Video Interview</option>
              <option value="in-person">In-Person Interview</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea rows="3" placeholder="Additional notes for the interview..."></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Interview</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default RecruiterDashboardComplete;

