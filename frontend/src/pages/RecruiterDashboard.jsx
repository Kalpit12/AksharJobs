import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchInternships();
        fetchCandidates();
        fetchApplications();
    }, []);

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
        // Fetch internships
    };

    const fetchCandidates = async () => {
        // Fetch candidates
    };

    const fetchApplications = async () => {
        // Fetch applications
    };

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
                        <span className="badge">5</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => setActiveSection('internships')}>
                        <i className="fas fa-user-graduate"></i>
                        <span>Internships</span>
                        <span className="badge">3</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'candidates' ? 'active' : ''}`} onClick={() => setActiveSection('candidates')}>
                        <i className="fas fa-users"></i>
                        <span>All Candidates</span>
                        <span className="badge">142</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveSection('pipeline')}>
                        <i className="fas fa-stream"></i>
                        <span>Recruitment Pipeline</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">12</span>
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
                        <input type="text" placeholder="Search candidates, jobs, or internships..." />
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
                            <div className="user-avatar">JD</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>John Doe</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>HR Manager</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`} id="dashboard">
                        <h1 style={{ marginBottom: '25px' }}>Dashboard Overview</h1>
                        
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">8</div>
                                        <div className="stat-label">Active Postings</div>
                                    </div>
                                    <div className="stat-icon blue">
                                        <i className="fas fa-briefcase"></i>
                                    </div>
                                </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> 2 new this week
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">142</div>
                                        <div className="stat-label">Total Applications</div>
                                    </div>
                                    <div className="stat-icon green">
                                        <i className="fas fa-users"></i>
                                    </div>
                                </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> +23% from last month
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">38</div>
                                        <div className="stat-label">In Interview Stage</div>
                                    </div>
                                    <div className="stat-icon purple">
                                        <i className="fas fa-user-clock"></i>
                                    </div>
                                </div>
                                <div className="stat-change">
                                    15 scheduled this week
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">12</div>
                                        <div className="stat-label">Offers Extended</div>
                                    </div>
                                    <div className="stat-icon orange">
                                        <i className="fas fa-handshake"></i>
                                    </div>
                                </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> 8 accepted
                                </div>
                            </div>
                        </div>

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
                                            <tr>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>SA</div>
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
                                        <i className="fas fa-plus"></i> Post New Job
                      </button>
                                    <button className="btn btn-primary">
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
                            <div className="tab active">All Jobs (5)</div>
                            <div className="tab">Active (3)</div>
                            <div className="tab">Drafts (1)</div>
                            <div className="tab">Closed (1)</div>
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
                                            <tr>
                                                <td><strong>Senior Software Engineer</strong></td>
                                                <td>Nairobi, Kenya</td>
                                                <td>Full-time</td>
                                                <td><strong>45</strong></td>
                                                <td>2 weeks ago</td>
                                                <td><span className="status-badge status-active">active</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                    <button className="btn btn-secondary btn-sm">Edit</button>
                                                </td>
                                            </tr>
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
