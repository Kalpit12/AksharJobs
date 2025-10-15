import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RecruiterDashboard.css';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({
        activePostings: 0,
        totalApplications: 0,
        inInterviewStage: 0,
        offersExtended: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch user profile
            const profileRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/profile/profile`, { headers });
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setUserProfile(profileData);
            }

            // Fetch recruiter's jobs
            const jobsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/jobs/get_jobs`, { headers });
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobs(jobsData.jobs || []);
                setStats(prev => ({
                    ...prev,
                    activePostings: jobsData.jobs?.length || 0
                }));
            }

            // Fetch applications for recruiter's jobs
            const appsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/applications/recruiter/all`, { headers });
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData.applications || []);
                
                // Calculate stats
                const interviewCount = appsData.applications?.filter(app => 
                    app.status === 'interview' || app.status === 'interview_scheduled'
                ).length || 0;
                
                const offersCount = appsData.applications?.filter(app => 
                    app.status === 'offered' || app.status === 'accepted'
                ).length || 0;
                
                setStats(prev => ({
                    ...prev,
                    totalApplications: appsData.applications?.length || 0,
                    inInterviewStage: interviewCount,
                    offersExtended: offersCount
                }));
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const showSection = (sectionId) => {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    };

    useEffect(() => {
        // Populate jobs table
        if (jobs.length > 0) {
            const jobsTableBody = document.getElementById('jobsTableBody');
            if (jobsTableBody) {
                jobsTableBody.innerHTML = jobs.map(job => `
                    <tr>
                        <td><strong>${job.title || 'Job Title'}</strong></td>
                        <td>${job.location || 'Location'}</td>
                        <td>${job.jobType || 'Full-time'}</td>
                        <td><strong>${job.applicationsCount || 0}</strong></td>
                        <td>${new Date(job.postedDate).toLocaleDateString() || 'Recently'}</td>
                        <td><span class="status-badge status-active">active</span></td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="window.location.href='/job/${job._id}'">View</button>
                            <button class="btn btn-secondary btn-sm">Edit</button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        // Populate internships table
        const internships = jobs.filter(job => job.jobType?.toLowerCase().includes('intern'));
        if (internships.length > 0) {
            const internshipsTableBody = document.getElementById('internshipsTableBody');
            if (internshipsTableBody) {
                internshipsTableBody.innerHTML = internships.map(internship => `
                    <tr>
                        <td><strong>${internship.title || 'Internship Title'}</strong></td>
                        <td>${internship.department || 'Department'}</td>
                        <td>${internship.duration || '3 months'}</td>
                        <td><strong>${internship.applicationsCount || 0}</strong></td>
                        <td>${new Date(internship.postedDate).toLocaleDateString() || 'Recently'}</td>
                        <td><span class="status-badge status-active">active</span></td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="window.location.href='/job/${internship._id}'">View</button>
                            <button class="btn btn-secondary btn-sm">Edit</button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        // Populate candidates list
        if (applications.length > 0) {
            const candidatesList = document.getElementById('candidatesList');
            if (candidatesList) {
                candidatesList.innerHTML = applications.map(app => `
                    <div class="candidate-card">
                        <div class="candidate-header">
                            <div class="candidate-info">
                                <div class="candidate-avatar">${app.applicantName?.substring(0, 2).toUpperCase() || 'CA'}</div>
                                <div class="candidate-details">
                                    <h3>${app.applicantName || 'Candidate'}</h3>
                                    <p style="color: #666;">${app.applicantTitle || 'Job Seeker'}</p>
                                    <div class="candidate-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> ${app.applicantLocation || 'Location'}</span>
                                        <span><i class="fas fa-briefcase"></i> ${app.applicantExperience || 'Experience'}</span>
                                        <span><i class="fas fa-clock"></i> ${new Date(app.appliedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="candidate-actions">
                                <span class="status-badge status-${app.status}">${app.status}</span>
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <strong>Applied for:</strong> ${app.jobTitle}
                        </div>
                        <div class="candidate-skills">
                            ${app.applicantSkills?.map(skill => `<span class="skill-tag">${skill}</span>`).join('') || ''}
                        </div>
                    </div>
                `).join('');
            }
        }
    }, [jobs, applications]);

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div style={{textAlign: 'center'}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize: '48px', color: '#667eea'}}></i>
                    <p style={{marginTop: '20px', color: '#666'}}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-briefcase"></i> RecruiterHub</h2>
                    <p>{userProfile?.companyName || 'Acme Corporation'}</p>
                </div>
                <div className="nav-menu">
                    <div className="nav-item active" onClick={() => showSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('jobs')}>
                        <i className="fas fa-briefcase"></i>
                        <span>Job Postings</span>
                        <span className="badge">{jobs.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('internships')}>
                        <i className="fas fa-user-graduate"></i>
                        <span>Internships</span>
                        <span className="badge">{jobs.filter(j => j.jobType?.toLowerCase().includes('intern')).length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('candidates')}>
                        <i className="fas fa-users"></i>
                        <span>All Candidates</span>
                        <span className="badge">{applications.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('pipeline')}>
                        <i className="fas fa-stream"></i>
                        <span>Recruitment Pipeline</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">12</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('calendar')}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>Interview Calendar</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('analytics')}>
                        <i className="fas fa-chart-bar"></i>
                        <span>Analytics</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('settings')}>
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
                        <button className="icon-btn" onClick={() => navigate('/create-job')}>
                            <i className="fas fa-plus"></i>
                        </button>
                        <div className="user-profile" onClick={() => navigate('/profile')}>
                            <div className="user-avatar">
                                {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
                            </div>
                            <div>
                                <div style={{fontWeight: 600, fontSize: '14px'}}>
                                    {userProfile?.firstName} {userProfile?.lastName}
                                </div>
                                <div style={{fontSize: '12px', color: '#666'}}>
                                    {userProfile?.professionalTitle || 'HR Manager'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className="page-section active" id="dashboard">
                        <h1 style={{marginBottom: '25px'}}>Dashboard Overview</h1>
                        
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.activePostings}</div>
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
                                        <div className="stat-number">{stats.totalApplications}</div>
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
                                        <div className="stat-number">{stats.inInterviewStage}</div>
                                        <div className="stat-label">In Interview Stage</div>
                                    </div>
                                    <div className="stat-icon purple">
                                        <i className="fas fa-user-clock"></i>
                                    </div>
                                </div>
                                <div className="stat-change">
                                    {stats.inInterviewStage} scheduled this week
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
                                    <i className="fas fa-arrow-up"></i> {Math.floor(stats.offersExtended * 0.67)} accepted
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px'}}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recent Applications</h3>
                                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('candidates')}>View All</button>
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
                                            {applications.slice(0, 3).map((app, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                            <div style={{width: '35px', height: '35px', borderRadius: '50%', background: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600}}>
                                                                {app.applicantName?.substring(0, 2).toUpperCase() || 'CA'}
                                                            </div>
                                                            <div>
                                                                <div style={{fontWeight: 500}}>{app.applicantName || 'Candidate'}</div>
                                                                <div style={{fontSize: '12px', color: '#666'}}>{app.applicantTitle || 'Job Seeker'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{app.jobTitle || 'Position'}</td>
                                                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                                                    <td><span className={`status-badge status-${app.status}`}>{app.status || 'pending'}</span></td>
                                                    <td>
                                                        <button className="btn btn-secondary btn-sm">View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Quick Actions</h3>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <button className="btn btn-primary" onClick={() => navigate('/create-job')}>
                                        <i className="fas fa-plus"></i> Post New Job
                                    </button>
                                    <button className="btn btn-primary" onClick={() => navigate('/create-job')}>
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
                    <div className="page-section" id="jobs">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
                            <h1>Job Postings</h1>
                            <button className="btn btn-primary" onClick={() => navigate('/create-job')}>
                                <i className="fas fa-plus"></i> Post New Job
                            </button>
                        </div>

                        <div className="tabs">
                            <div className="tab active">All Jobs ({jobs.length})</div>
                            <div className="tab">Active ({jobs.filter(j => j.status === 'active').length})</div>
                            <div className="tab">Drafts (0)</div>
                            <div className="tab">Closed (0)</div>
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
                                        <tbody id="jobsTableBody">
                                            {/* Jobs will be populated here */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Internships Section */}
                    <div className="page-section" id="internships">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
                            <h1>Internship Postings</h1>
                            <button className="btn btn-primary" onClick={() => navigate('/create-job')}>
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
                                    <tbody id="internshipsTableBody">
                                        {/* Internships will be populated here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Candidates Section */}
                    <div className="page-section" id="candidates">
                        <h1 style={{marginBottom: '25px'}}>All Candidates</h1>

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
                            <div id="candidatesList">
                                {/* Candidates will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Recruitment Pipeline Section */}
                    <div className="page-section" id="pipeline">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
                            <h1>Recruitment Pipeline</h1>
                            <select className="filter-select" style={{width: '250px'}}>
                                <option>All Positions</option>
                                {jobs.slice(0, 5).map((job, idx) => (
                                    <option key={idx}>{job.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pipeline-container" id="pipelineContainer">
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Applied</div>
                                    <div className="stage-count">{applications.filter(a => a.status === 'pending' || a.status === 'applied').length}</div>
                                </div>
                                <div className="stage-candidates">
                                    {/* Candidates will be populated here */}
                                </div>
                            </div>
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Screening</div>
                                    <div className="stage-count">{applications.filter(a => a.status === 'reviewing').length}</div>
                                </div>
                                <div className="stage-candidates">
                                    {/* Candidates will be populated here */}
                                </div>
                            </div>
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Interview</div>
                                    <div className="stage-count">{applications.filter(a => a.status === 'interview' || a.status === 'interview_scheduled').length}</div>
                                </div>
                                <div className="stage-candidates">
                                    {/* Candidates will be populated here */}
                                </div>
                            </div>
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Offer</div>
                                    <div className="stage-count">{applications.filter(a => a.status === 'offered').length}</div>
                                </div>
                                <div className="stage-candidates">
                                    {/* Candidates will be populated here */}
                                </div>
                            </div>
                            <div className="pipeline-stage">
                                <div className="stage-header">
                                    <div className="stage-title">Hired</div>
                                    <div className="stage-count">{applications.filter(a => a.status === 'accepted').length}</div>
                                </div>
                                <div className="stage-candidates">
                                    {/* Candidates will be populated here */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className="page-section" id="messages">
                        <h1 style={{marginBottom: '25px'}}>Messages</h1>
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
                    <div className="page-section" id="calendar">
                        <h1 style={{marginBottom: '25px'}}>Interview Calendar</h1>
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
                    <div className="page-section" id="analytics">
                        <h1 style={{marginBottom: '25px'}}>Recruitment Analytics</h1>
                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-chart-bar"></i>
                                <h3>Analytics Dashboard</h3>
                                <p>View detailed analytics and insights about your recruitment process</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="page-section" id="settings">
                        <h1 style={{marginBottom: '25px'}}>Settings</h1>
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
        </div>
    );
};

export default RecruiterDashboard;

