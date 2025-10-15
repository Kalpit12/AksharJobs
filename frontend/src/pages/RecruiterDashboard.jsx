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
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/internships/recruiter', {
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
            const response = await fetch('/api/candidates', {
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
            const response = await fetch('/api/applications/recruiter', {
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

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    const openModal = (modalId) => {
        document.getElementById(modalId).classList.add('show');
    };

    const closeModal = (modalId) => {
        document.getElementById(modalId).classList.remove('show');
    };

    const submitJob = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(event.target);
            const jobData = Object.fromEntries(formData);
            
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });
            
            if (response.ok) {
                alert('Job posted successfully! Candidates will be notified.');
                closeModal('jobModal');
                fetchJobs();
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Error posting job. Please try again.');
        }
    };

    const submitInternship = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(event.target);
            const internshipData = Object.fromEntries(formData);
            
            const response = await fetch('/api/internships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(internshipData)
            });
            
            if (response.ok) {
                alert('Internship posted successfully! Students will be notified.');
                closeModal('internshipModal');
                fetchInternships();
            }
        } catch (error) {
            console.error('Error posting internship:', error);
            alert('Error posting internship. Please try again.');
        }
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-briefcase"></i> RecruiterHub</h2>
                    <p>Acme Corporation</p>
          </div>
                <div className="nav-menu">
                    <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
        </div>
                    <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => showSection('jobs')}>
                        <i className="fas fa-briefcase"></i>
                        <span>Job Postings</span>
                        <span className="badge">5</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => showSection('internships')}>
                        <i className="fas fa-user-graduate"></i>
                        <span>Internships</span>
                        <span className="badge">3</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'candidates' ? 'active' : ''}`} onClick={() => showSection('candidates')}>
                        <i className="fas fa-users"></i>
                        <span>All Candidates</span>
                        <span className="badge">142</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'pipeline' ? 'active' : ''}`} onClick={() => showSection('pipeline')}>
                        <i className="fas fa-stream"></i>
                        <span>Recruitment Pipeline</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">12</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`} onClick={() => showSection('calendar')}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>Interview Calendar</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => showSection('analytics')}>
                        <i className="fas fa-chart-bar"></i>
                        <span>Analytics</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => showSection('settings')}>
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
                        <button className="icon-btn" onClick={() => alert('Notifications panel would open here')}>
                            <i className="fas fa-bell"></i>
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-btn">
                            <i className="fas fa-plus"></i>
                        </button>
                        <div className="user-profile">
                            <div className="user-avatar">JD</div>
                            <div className="user-info">
                                <div className="user-name">John Doe</div>
                                <div className="user-role">HR Manager</div>
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
                                            <tr>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#764ba2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>MK</div>
                                                        <div>
                                                            <div style={{ fontWeight: '500' }}>Michael Kim</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>Marketing Manager</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>Marketing Lead</td>
                                                <td>5 hours ago</td>
                                                <td><span className="status-badge status-screening">Screening</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#f093fb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>EP</div>
                                                        <div>
                                                            <div style={{ fontWeight: '500' }}>Emma Peters</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>UX Designer</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>Product Designer</td>
                                                <td>1 day ago</td>
                                                <td><span className="status-badge status-interview">Interview</span></td>
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
                                    <button className="btn btn-primary" onClick={() => openModal('jobModal')}>
                                        <i className="fas fa-plus"></i> Post New Job
                      </button>
                                    <button className="btn btn-primary" onClick={() => openModal('internshipModal')}>
                                        <i className="fas fa-plus"></i> Post Internship
                      </button>
                                    <button className="btn btn-secondary" onClick={() => showSection('candidates')}>
                                        <i className="fas fa-search"></i> Search Candidates
              </button>
                                    <button className="btn btn-secondary" onClick={() => showSection('calendar')}>
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
                            <button className="btn btn-primary" onClick={() => openModal('jobModal')}>
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
                                            <tr>
                                                <td><strong>Marketing Manager</strong></td>
                                                <td>Remote</td>
                                                <td>Full-time</td>
                                                <td><strong>32</strong></td>
                                                <td>1 week ago</td>
                                                <td><span className="status-badge status-active">active</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                    <button className="btn btn-secondary btn-sm">Edit</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Product Designer</strong></td>
                                                <td>Nairobi, Kenya</td>
                                                <td>Contract</td>
                                                <td><strong>28</strong></td>
                                                <td>3 days ago</td>
                                                <td><span className="status-badge status-active">active</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                    <button className="btn btn-secondary btn-sm">Edit</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Data Analyst</strong></td>
                                                <td>Hybrid</td>
                                                <td>Full-time</td>
                                                <td><strong>18</strong></td>
                                                <td>5 days ago</td>
                                                <td><span className="status-badge status-pending">draft</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                    <button className="btn btn-secondary btn-sm">Edit</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Sales Executive</strong></td>
                                                <td>Nairobi, Kenya</td>
                                                <td>Full-time</td>
                                                <td><strong>67</strong></td>
                                                <td>1 month ago</td>
                                                <td><span className="status-badge status-closed">closed</span></td>
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

                    {/* Internships Section */}
                    <div className={`page-section ${activeSection === 'internships' ? 'active' : ''}`} id="internships">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>Internship Postings</h1>
                            <button className="btn btn-primary" onClick={() => openModal('internshipModal')}>
                                <i className="fas fa-plus"></i> Post New Internship
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
                                        <tr>
                                            <td><strong>Software Development Intern</strong></td>
                                            <td>Engineering</td>
                                            <td>3 months</td>
                                            <td><strong>52</strong></td>
                                            <td>1 week ago</td>
                                            <td><span className="status-badge status-active">active</span></td>
                                            <td>
                                                <button className="btn btn-secondary btn-sm">View</button>
                                                <button className="btn btn-secondary btn-sm">Edit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Marketing Intern</strong></td>
                                            <td>Marketing</td>
                                            <td>6 months</td>
                                            <td><strong>38</strong></td>
                                            <td>4 days ago</td>
                                            <td><span className="status-badge status-active">active</span></td>
                                            <td>
                                                <button className="btn btn-secondary btn-sm">View</button>
                                                <button className="btn btn-secondary btn-sm">Edit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>UI/UX Design Intern</strong></td>
                                            <td>Design</td>
                                            <td>3 months</td>
                                            <td><strong>29</strong></td>
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

                    {/* Candidates Section */}
                    <div className={`page-section ${activeSection === 'candidates' ? 'active' : ''}`} id="candidates">
                        <h1 style={{ marginBottom: '25px' }}>All Candidates</h1>

                        <div className="filters">
                            <select className="filter-select">
                                <option value="">All Positions</option>
                                <option value="developer">Developer</option>
                                <option value="designer">Designer</option>
                                <option value="marketing">Marketing</option>
                            </select>
                            <select className="filter-select">
                                <option value="">All Statuses</option>
                                <option value="new">New</option>
                                <option value="screening">Screening</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                            </select>
                            <select className="filter-select">
                                <option value="">Sort By</option>
                                <option value="recent">Most Recent</option>
                                <option value="rating">Highest Rating</option>
                                <option value="name">Name A-Z</option>
                            </select>
              </div>

                        <div className="card">
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div className="candidate-card">
                                    <div className="candidate-header">
                                        <div className="candidate-info">
                                            <div className="candidate-avatar">SA</div>
                                            <div className="candidate-details">
                                                <h3>Sarah Anderson</h3>
                                                <p style={{ color: '#666' }}>Full Stack Developer</p>
                                                <div className="candidate-meta">
                                                    <span><i className="fas fa-map-marker-alt"></i> Nairobi, Kenya</span>
                                                    <span><i className="fas fa-briefcase"></i> 5 years</span>
                                                    <span><i className="fas fa-clock"></i> 2 hours ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="candidate-actions">
                                            <span className="status-badge status-pending">new</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <strong>Applied for:</strong> Senior Developer
                                    </div>
                                    <div className="candidate-skills">
                                        <span className="skill-tag">Python</span>
                                        <span className="skill-tag">React</span>
                                        <span className="skill-tag">Node.js</span>
                                        <span className="skill-tag">PostgreSQL</span>
                                        <span className="skill-tag">AWS</span>
                                    </div>
                                </div>

                                <div className="candidate-card">
                                    <div className="candidate-header">
                                        <div className="candidate-info">
                                            <div className="candidate-avatar">MK</div>
                                            <div className="candidate-details">
                                                <h3>Michael Kim</h3>
                                                <p style={{ color: '#666' }}>Marketing Manager</p>
                                                <div className="candidate-meta">
                                                    <span><i className="fas fa-map-marker-alt"></i> Remote</span>
                                                    <span><i className="fas fa-briefcase"></i> 7 years</span>
                                                    <span><i className="fas fa-clock"></i> 5 hours ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="candidate-actions">
                                            <span className="status-badge status-screening">screening</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <strong>Applied for:</strong> Marketing Lead
                                    </div>
                                    <div className="candidate-skills">
                                        <span className="skill-tag">Digital Marketing</span>
                                        <span className="skill-tag">SEO</span>
                                        <span className="skill-tag">Content Strategy</span>
                                        <span className="skill-tag">Analytics</span>
                                    </div>
                  </div>
                  
                                <div className="candidate-card">
                                    <div className="candidate-header">
                                        <div className="candidate-info">
                                            <div className="candidate-avatar">EP</div>
                                            <div className="candidate-details">
                                                <h3>Emma Peters</h3>
                                                <p style={{ color: '#666' }}>UX Designer</p>
                                                <div className="candidate-meta">
                                                    <span><i className="fas fa-map-marker-alt"></i> Nairobi, Kenya</span>
                                                    <span><i className="fas fa-briefcase"></i> 4 years</span>
                                                    <span><i className="fas fa-clock"></i> 1 day ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="candidate-actions">
                                            <span className="status-badge status-interview">interview</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <strong>Applied for:</strong> Product Designer
                                    </div>
                                    <div className="candidate-skills">
                                        <span className="skill-tag">Figma</span>
                                        <span className="skill-tag">UI Design</span>
                                        <span className="skill-tag">User Research</span>
                                        <span className="skill-tag">Prototyping</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

                    {/* Recruitment Pipeline Section */}
                    <div className={`page-section ${activeSection === 'pipeline' ? 'active' : ''}`} id="pipeline">
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
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Applied</div>
                                    <div className="stage-count">2</div>
                                </div>
                                <div className="stage-candidates">
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>SA</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Sarah Anderson</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Senior Developer</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.5
                                        </div>
                                    </div>
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>MK</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Michael Kim</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Marketing Lead</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.8
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Screening</div>
                                    <div className="stage-count">1</div>
                                </div>
                                <div className="stage-candidates">
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2196f3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>MK</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Michael Kim</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Marketing Lead</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.8
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Interview</div>
                                    <div className="stage-count">1</div>
                                </div>
                                <div className="stage-candidates">
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#9c27b0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>EP</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Emma Peters</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Product Designer</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.6
                                        </div>
                    </div>
                  </div>
                </div>

                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Assessment</div>
                                    <div className="stage-count">1</div>
                    </div>
                                <div className="stage-candidates">
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff9800', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>JT</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>James Taylor</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Senior Developer</div>
                  </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.9
                                        </div>
                                    </div>
              </div>
              </div>

                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Offer</div>
                                    <div className="stage-count">1</div>
                  </div>
                                <div className="stage-candidates">
                                    <div className="stage-candidate">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4caf50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>LC</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Lisa Chen</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>Product Manager</div>
              </div>
                </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107' }}></i> 5.0
          </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Hired</div>
                                    <div className="stage-count">0</div>
                </div>
                                <div className="stage-candidates">
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                        No candidates hired yet
              </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className={`page-section ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
                        <h1 style={{ marginBottom: '25px' }}>Messages</h1>
                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-envelope"></i>
                                <h3>Message Center</h3>
                                <p>Communicate with candidates directly through the platform</p>
                                <button className="btn btn-primary">Compose Message</button>
                    </div>
                    </div>
                    </div>

                    {/* Calendar Section */}
                    <div className={`page-section ${activeSection === 'calendar' ? 'active' : ''}`} id="calendar">
                        <h1 style={{ marginBottom: '25px' }}>Interview Calendar</h1>
                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-calendar-alt"></i>
                                <h3>Interview Schedule</h3>
                                <p>Manage and schedule interviews with candidates</p>
                                <button className="btn btn-primary">Schedule Interview</button>
                    </div>
                </div>
              </div>

                    {/* Analytics Section */}
                    <div className={`page-section ${activeSection === 'analytics' ? 'active' : ''}`} id="analytics">
                        <h1 style={{ marginBottom: '25px' }}>Recruitment Analytics</h1>
                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-chart-bar"></i>
                                <h3>Analytics Dashboard</h3>
                                <p>View detailed analytics and insights about your recruitment process</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className={`page-section ${activeSection === 'settings' ? 'active' : ''}`} id="settings">
                        <h1 style={{ marginBottom: '25px' }}>Settings</h1>
                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-cog"></i>
                                <h3>Account Settings</h3>
                                <p>Manage your account preferences and company information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Posting Modal */}
            <div className="modal" id="jobModal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Post New Job</h2>
                        <button className="close-modal" onClick={() => closeModal('jobModal')}>×</button>
                    </div>
                    <div className="modal-body">
                        <form id="jobForm" onSubmit={submitJob}>
                            <div className="form-group">
                                <label>Job Title *</label>
                                <input type="text" name="title" required placeholder="e.g., Senior Software Engineer" />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Department *</label>
                                    <select name="department" required>
                                        <option value="">Select Department</option>
                                        <option>Engineering</option>
                                        <option>Marketing</option>
                                        <option>Sales</option>
                                        <option>Design</option>
                                        <option>Operations</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Employment Type *</label>
                                    <select name="type" required>
                                        <option value="">Select Type</option>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input type="text" name="location" required placeholder="e.g., Nairobi, Kenya" />
                                </div>
                                <div className="form-group">
                                    <label>Work Mode *</label>
                                    <select name="workMode" required>
                                        <option value="">Select Mode</option>
                                        <option>On-site</option>
                                        <option>Remote</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Experience Level *</label>
                                    <select name="experience" required>
                                        <option value="">Select Level</option>
                                        <option>Entry Level (0-2 years)</option>
                                        <option>Mid Level (3-5 years)</option>
                                        <option>Senior (5-10 years)</option>
                                        <option>Lead/Principal (10+ years)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Salary Range</label>
                                    <input type="text" name="salary" placeholder="e.g., $60,000 - $80,000" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Job Description *</label>
                                <textarea name="description" required placeholder="Describe the role, responsibilities, and requirements..."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Required Skills (comma separated)</label>
                                <input type="text" name="skills" placeholder="e.g., Python, Django, React, PostgreSQL" />
                            </div>

                            <div className="form-group">
                                <label>Application Deadline</label>
                                <input type="date" name="deadline" />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => closeModal('jobModal')}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Post Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Internship Posting Modal */}
            <div className="modal" id="internshipModal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Post New Internship</h2>
                        <button className="close-modal" onClick={() => closeModal('internshipModal')}>×</button>
      </div>
                    <div className="modal-body">
                        <form id="internshipForm" onSubmit={submitInternship}>
                            <div className="form-group">
                                <label>Internship Title *</label>
                                <input type="text" name="title" required placeholder="e.g., Software Development Intern" />
    </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Department *</label>
                                    <select name="department" required>
                                        <option value="">Select Department</option>
                                        <option>Engineering</option>
                                        <option>Marketing</option>
                                        <option>Sales</option>
                                        <option>Design</option>
                                        <option>Operations</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration *</label>
                                    <select name="duration" required>
                                        <option value="">Select Duration</option>
                                        <option>1-2 months</option>
                                        <option>3 months</option>
                                        <option>6 months</option>
                                        <option>12 months</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input type="text" name="location" required placeholder="e.g., Nairobi, Kenya" />
                                </div>
                                <div className="form-group">
                                    <label>Work Mode *</label>
                                    <select name="workMode" required>
                                        <option value="">Select Mode</option>
                                        <option>On-site</option>
                                        <option>Remote</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Academic Level</label>
                                    <select name="academicLevel">
                                        <option value="">Any Level</option>
                                        <option>Undergraduate</option>
                                        <option>Graduate</option>
                                        <option>Recent Graduate</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Stipend (Monthly)</label>
                                    <input type="text" name="stipend" placeholder="e.g., $500 or Unpaid" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Internship Description *</label>
                                <textarea name="description" required placeholder="Describe the internship, learning objectives, and requirements..."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Preferred Skills</label>
                                <input type="text" name="skills" placeholder="e.g., Python basics, Communication skills" />
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" name="startDate" />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => closeModal('internshipModal')}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Post Internship</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default RecruiterDashboard;
