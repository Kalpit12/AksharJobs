import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faBell, faUser, faBriefcase, faCalendar, faUsers,
  faStream, faEnvelope, faCog, faThLarge, faUserGraduate, faChartBar,
  faPlus, faEye, faEdit, faTrash, faPaperPlane, faArrowUp,
  faHandshake, faUserClock, faTimes, faStar, faPhone, faMapMarkerAlt,
  faCalendarAlt, faVideo, faInfoCircle, faClock, faCheckCircle,
  faDownload, faSave
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import '../styles/RecruiterDashboard.css';

const RecruiterDashboardComplete = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
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
      const [jobsRes, applicationsRes] = await Promise.all([
        axios.get(buildApiUrl('/api/jobs/recruiter'), { headers }).catch(() => null),
        axios.get(buildApiUrl('/api/application-tracker/recruiter'), { headers }).catch(() => null)
      ]);

      setDashboardData({
        stats: {
          activePostings: jobsRes?.data?.jobs?.length || 8,
          totalApplications: applicationsRes?.data?.applications?.length || 142,
          interviewStage: 38,
          offersExtended: 12
        },
        jobs: jobsRes?.data?.jobs || [],
        internships: [],
        candidates: [],
        applications: applicationsRes?.data?.applications || [],
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

  const viewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faBriefcase} spin size="3x" />
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Loading dashboard...</p>
        </div>
      </div>
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
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSection('jobs')}>
            <FontAwesomeIcon icon={faBriefcase} />
            <span>Job Postings</span>
            <span className="badge">{dashboardData.stats.activePostings}</span>
          </div>
          <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => setActiveSection('internships')}>
            <FontAwesomeIcon icon={faUserGraduate} />
            <span>Internships</span>
            <span className="badge">3</span>
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
            <span className="badge">12</span>
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
          {activeSection === 'dashboard' && <DashboardSection dashboardData={dashboardData} setActiveSection={setActiveSection} setShowJobModal={setShowJobModal} setShowInternshipModal={setShowInternshipModal} />}
          {activeSection === 'jobs' && <JobsSection jobs={dashboardData.jobs} setShowJobModal={setShowJobModal} navigate={navigate} />}
          {activeSection === 'internships' && <InternshipsSection internships={dashboardData.internships} setShowInternshipModal={setShowInternshipModal} />}
          {activeSection === 'candidates' && <CandidatesSection candidates={dashboardData.candidates} viewCandidate={viewCandidate} />}
          {activeSection === 'pipeline' && <PipelineSection pipeline={dashboardData.pipeline} viewCandidate={viewCandidate} />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'calendar' && <CalendarSection />}
          {activeSection === 'analytics' && <AnalyticsSection stats={dashboardData.stats} />}
          {activeSection === 'settings' && <SettingsSection logout={logout} navigate={navigate} />}
        </div>
      </div>

      {/* Modals */}
      {showJobModal && <JobPostingModal onClose={() => setShowJobModal(false)} />}
      {showInternshipModal && <InternshipPostingModal onClose={() => setShowInternshipModal(false)} />}
      {showCandidateModal && selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setShowCandidateModal(false)} />}
    </>
  );
};

// Dashboard Section
const DashboardSection = ({ dashboardData, setActiveSection, setShowJobModal, setShowInternshipModal }) => (
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
          <button className="btn btn-primary" onClick={() => setShowJobModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Post New Job
          </button>
          <button className="btn btn-primary" onClick={() => setShowInternshipModal(true)}>
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
const JobsSection = ({ jobs, setShowJobModal, navigate }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Job Postings</h1>
      <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
        <FontAwesomeIcon icon={faPlus} /> Post New Job
      </button>
    </div>

    <div className="tabs">
      <div className="tab active">All Jobs ({jobs.length})</div>
      <div className="tab">Active</div>
      <div className="tab">Drafts</div>
      <div className="tab">Closed</div>
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
            {jobs.length > 0 ? jobs.map((job, index) => (
              <tr key={index}>
                <td><strong>{job.jobTitle}</strong></td>
                <td>{job.location}</td>
                <td>{job.jobType}</td>
                <td><strong>45</strong></td>
                <td>2 weeks ago</td>
                <td><span className="status-badge status-active">active</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm">View</button>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: '5px' }}>Edit</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No jobs posted yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Internships Section
const InternshipsSection = ({ internships, setShowInternshipModal }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Internship Postings</h1>
      <button className="btn btn-primary" onClick={() => setShowInternshipModal(true)}>
        <FontAwesomeIcon icon={faPlus} /> Post New Internship
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
            {internships.length > 0 ? internships.map((internship, index) => (
              <tr key={index}>
                <td><strong>{internship.title}</strong></td>
                <td>{internship.department}</td>
                <td>{internship.duration}</td>
                <td><strong>52</strong></td>
                <td>1 week ago</td>
                <td><span className="status-badge status-active">active</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm">View</button>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: '5px' }}>Edit</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No internships posted yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Candidates Section
const CandidatesSection = ({ candidates, viewCandidate }) => {
  const sampleCandidates = [
    { initials: 'SA', name: 'Sarah Anderson', title: 'Full Stack Developer', position: 'Senior Developer', location: 'Nairobi, Kenya', experience: '5 years', status: 'new', skills: ['Python', 'React', 'Node.js', 'AWS'] },
    { initials: 'MK', name: 'Michael Kim', title: 'Marketing Manager', position: 'Marketing Lead', location: 'Remote', experience: '7 years', status: 'screening', skills: ['Digital Marketing', 'SEO', 'Content Strategy'] },
    { initials: 'EP', name: 'Emma Peters', title: 'UX Designer', position: 'Product Designer', location: 'Nairobi, Kenya', experience: '4 years', status: 'interview', skills: ['Figma', 'UI Design', 'User Research'] }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '25px' }}>All Candidates</h1>

      <div className="filters">
        <select className="filter-select">
          <option>All Positions</option>
          <option>Developer</option>
          <option>Designer</option>
          <option>Marketing</option>
        </select>
        <select className="filter-select">
          <option>All Statuses</option>
          <option>New</option>
          <option>Screening</option>
          <option>Interview</option>
          <option>Offer</option>
        </select>
        <select className="filter-select">
          <option>Sort By: Most Recent</option>
          <option>Highest Rating</option>
          <option>Name A-Z</option>
        </select>
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
const PipelineSection = ({ pipeline, viewCandidate }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <h1>Recruitment Pipeline</h1>
      <select className="filter-select" style={{ width: '250px' }}>
        <option>All Positions</option>
        <option>Senior Developer</option>
        <option>Marketing Lead</option>
        <option>Product Designer</option>
      </select>
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
const MessagesSection = () => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Messages</h1>
    <div className="card">
      <div className="empty-state">
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '64px', color: '#ccc' }} />
        <h3>Message Center</h3>
        <p>Communicate with candidates directly through the platform</p>
        <button className="btn btn-primary">Compose Message</button>
      </div>
    </div>
  </div>
);

// Calendar Section
const CalendarSection = () => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Interview Calendar</h1>
    <div className="card">
      <div className="empty-state">
        <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '64px', color: '#ccc' }} />
        <h3>Interview Schedule</h3>
        <p>Manage and schedule interviews with candidates</p>
        <button className="btn btn-primary">Schedule Interview</button>
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
const SettingsSection = ({ logout, navigate }) => (
  <div>
    <h1 style={{ marginBottom: '25px' }}>Settings</h1>

    <div className="card">
      <div className="card-header">
        <h3 className="card-title"><FontAwesomeIcon icon={faCog} /> Account Settings</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="btn btn-secondary">Change Password</button>
        <button className="btn btn-secondary">Notification Preferences</button>
        <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  </div>
);

// Modal Components
const JobPostingModal = ({ onClose }) => (
  <div className="modal show" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Post New Job</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); alert('Job posted!'); onClose(); }}>
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

const InternshipPostingModal = ({ onClose }) => (
  <div className="modal show" onClick={(e) => e.target.className.includes('modal') && onClose()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Post New Internship</h2>
        <button className="close-modal" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); alert('Internship posted!'); onClose(); }}>
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

const CandidateModal = ({ candidate, onClose }) => (
  <div className="modal show" onClick={(e) => e.target.className.includes('modal') && onClose()}>
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
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faEnvelope} /> Send Message
          </button>
          <button className="btn btn-secondary">
            <FontAwesomeIcon icon={faCalendar} /> Schedule Interview
          </button>
          <button className="btn btn-secondary">
            <FontAwesomeIcon icon={faDownload} /> Download Resume
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RecruiterDashboardComplete;

