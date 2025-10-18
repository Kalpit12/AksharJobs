import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        inInterview: 0,
        offersExtended: 0,
        newJobsThisWeek: 0,
        applicationsIncrease: 0,
        interviewsThisWeek: 0,
        offersAccepted: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchJobs(),
                fetchInternships(),
                fetchCandidates(),
                fetchApplications(),
                fetchStats()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/jobs/recruiter', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/recruiters/internships', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setInternships(data);
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/recruiters/candidates', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/recruiters/applications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/recruiters/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (loading) {
        return (
            <ThemedLoadingSpinner 
                theme="recruiter"
                size="large"
                text="Loading your dashboard..."
                subText="Preparing your recruitment tools"
                showIcon={true}
                fullScreen={true}
            />
        );
    }

    return (
        <div>
            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-briefcase"></i> RecruiterHub</h2>
                    <p>{user?.companyName || 'Acme Corporation'}</p>
          </div>
                <div className="nav-menu">
                    <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
        </div>
                    <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSection('jobs')}>
                        <i className="fas fa-briefcase"></i>
                        <span>Job Postings</span>
                        {jobs.length > 0 && <span className="badge">{jobs.length}</span>}
                    </div>
                    <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => setActiveSection('internships')}>
                        <i className="fas fa-user-graduate"></i>
                        <span>Internships</span>
                        {internships.length > 0 && <span className="badge">{internships.length}</span>}
                    </div>
                    <div className={`nav-item ${activeSection === 'candidates' ? 'active' : ''}`} onClick={() => setActiveSection('candidates')}>
                        <i className="fas fa-users"></i>
                        <span>All Candidates</span>
                        {candidates.length > 0 && <span className="badge">{candidates.length}</span>}
                    </div>
                    <div className={`nav-item ${activeSection === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveSection('pipeline')}>
                        <i className="fas fa-stream"></i>
                        <span>Recruitment Pipeline</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        {applications.filter(app => app.status === 'pending').length > 0 && 
                            <span className="badge">{applications.filter(app => app.status === 'pending').length}</span>}
                    </div>
                    <div className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`} onClick={() => setActiveSection('calendar')}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>Interview Calendar</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSection('analytics')}>
                        <i className="fas fa-chart-bar"></i>
                        <span>Analytics</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
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
                            placeholder="Search candidates, jobs, or internships..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="top-bar-actions">
                        <button className="icon-btn">
                            <i className="fas fa-bell"></i>
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-btn">
                            <i className="fas fa-plus"></i>
                        </button>
                        <div className="user-profile">
                            <div className="user-avatar">
                                {user?.firstName ? user.firstName.charAt(0) : 'U'}
                                {user?.lastName ? user.lastName.charAt(0) : ''}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {user?.role || 'Recruiter'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`} id="dashboard">
                        <h1 style={{ marginBottom: '25px' }}>Dashboard Overview</h1>
                        
                        {loading ? (
                            <div className="stats-grid">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="stat-card">
                                        <div className="stat-header">
                                            <div>
                                                <div className="stat-number" style={{ background: '#f0f0f0', height: '32px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                <div className="stat-label" style={{ background: '#f0f0f0', height: '16px', borderRadius: '4px', marginTop: '8px', animation: 'pulse 1.5s infinite' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div>
                                            <div className="stat-number">{stats.activeJobs}</div>
                                            <div className="stat-label">Active Postings</div>
                                        </div>
                                        <div className="stat-icon blue">
                                            <i className="fas fa-briefcase"></i>
                                        </div>
                                    </div>
                                    <div className="stat-change positive">
                                        <i className="fas fa-arrow-up"></i> {stats.newJobsThisWeek} new this week
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div>
                                            <div className="stat-number">{stats.totalApplications}</div>
                                            <div className="stat-label">Total Applications</div>
                                        </div>
                                        <div className="stat-icon green">
                                            <i className="fas fa-users"></i>
                                        </div>
                                    </div>
                                    <div className="stat-change positive">
                                        <i className="fas fa-arrow-up"></i> +{stats.applicationsIncrease}% from last month
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div>
                                            <div className="stat-number">{stats.inInterview}</div>
                                            <div className="stat-label">In Interview Stage</div>
                                        </div>
                                        <div className="stat-icon purple">
                                            <i className="fas fa-user-clock"></i>
                                        </div>
                                    </div>
                                    <div className="stat-change">
                                        {stats.interviewsThisWeek} scheduled this week
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div>
                                            <div className="stat-number">{stats.offersExtended}</div>
                                            <div className="stat-label">Offers Extended</div>
                                        </div>
                                        <div className="stat-icon orange">
                                            <i className="fas fa-handshake"></i>
                                        </div>
                                    </div>
                                    <div className="stat-change positive">
                                        <i className="fas fa-arrow-up"></i> {stats.offersAccepted} accepted
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recent Applications</h3>
                                    <button className="btn btn-secondary btn-sm">View All</button>
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
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                        <div style={{ display: 'inline-block', background: '#f0f0f0', height: '20px', width: '100%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    </td>
                                                </tr>
                                            ) : applications.length > 0 ? (
                                                applications.slice(0, 5).map((application, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={{ 
                                                                    width: '35px', 
                                                                    height: '35px', 
                                                                    borderRadius: '50%', 
                                                                    background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)', 
                                                                    color: 'white', 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'center', 
                                                                    fontSize: '14px', 
                                                                    fontWeight: '600' 
                                                                }}>
                                                                    {application.candidateName ? application.candidateName.charAt(0) : 'C'}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: '500' }}>
                                                                        {application.candidateName || 'Unknown Candidate'}
                                                                    </div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                                        {application.position || 'Position not specified'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{application.jobTitle || 'N/A'}</td>
                                                        <td>{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A'}</td>
                                                        <td>
                                                            <span className={`status-badge status-${application.status || 'pending'}`}>
                                                                {application.status || 'New'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-secondary btn-sm">View</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                        No applications yet
                                                    </td>
                                                </tr>
                                            )}
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
                                        <i className="fas fa-plus"></i> Post New Job
                      </button>
                                    <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
                                        <i className="fas fa-plus"></i> Post Internship
                      </button>
                                    <button className="btn btn-secondary" onClick={() => setActiveSection('candidates')}>
                                        <i className="fas fa-search"></i> Search Candidates
              </button>
                                    <button className="btn btn-secondary" onClick={() => setActiveSection('calendar')}>
                                        <i className="fas fa-calendar"></i> Schedule Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Postings Section */}
                    <div className={`page-section ${activeSection === 'jobs' ? 'active' : ''}`} id="jobs">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>Job Postings</h1>
                            <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                                <i className="fas fa-plus"></i> Post New Job
                      </button>
                        </div>

                        <div className="tabs">
                            <div className="tab active">All Jobs ({jobs.length})</div>
                            <div className="tab">Active ({jobs.filter(job => job.status === 'active').length})</div>
                            <div className="tab">Drafts ({jobs.filter(job => job.status === 'draft').length})</div>
                            <div className="tab">Closed ({jobs.filter(job => job.status === 'closed').length})</div>
                        </div>

                        <div className="tab-content active">
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
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                                        <div style={{ display: 'inline-block', background: '#f0f0f0', height: '20px', width: '100%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    </td>
                                                </tr>
                                            ) : jobs.length > 0 ? (
                                                jobs.map((job, index) => (
                                                    <tr key={index}>
                                                        <td><strong>{job.title || 'Untitled Job'}</strong></td>
                                                        <td>{job.location || 'Location not specified'}</td>
                                                        <td>{job.type || 'Full-time'}</td>
                                                        <td><strong>{job.applicationCount || 0}</strong></td>
                                                        <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                        <td>
                                                            <span className={`status-badge status-${job.status || 'active'}`}>
                                                                {job.status || 'active'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-secondary btn-sm">View</button>
                                                            <button className="btn btn-secondary btn-sm">Edit</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                        No jobs posted yet
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other sections */}
                    {['internships', 'candidates', 'pipeline', 'messages', 'calendar', 'analytics', 'settings'].map(section => (
                        <div key={section} className={`page-section ${activeSection === section ? 'active' : ''}`}>
                            <h1 style={{ marginBottom: '25px', textTransform: 'capitalize' }}>{section}</h1>
                        <div className="card">
                                <div className="empty-state">
                                    <i className={`fas fa-${section === 'candidates' ? 'users' : section === 'pipeline' ? 'stream' : section === 'messages' ? 'envelope' : section === 'calendar' ? 'calendar-alt' : section === 'analytics' ? 'chart-bar' : 'cog'}`}></i>
                                    <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                                    <p>This section is coming soon...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
  );
};

export default RecruiterDashboard;
