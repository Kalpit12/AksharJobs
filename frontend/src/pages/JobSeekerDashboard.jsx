import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState({
        applicationsSent: 0,
        interviewsScheduled: 0,
        profileViews: 142,
        savedJobs: 8
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

            // Fetch jobs
            const jobsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/jobs/get_jobs`, { headers });
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobs(jobsData.jobs || []);
            }

            // Fetch applications
            const appsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/applications/my-applications`, { headers });
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData.applications || []);
                
                // Calculate stats from applications
                const interviewCount = appsData.applications?.filter(app => 
                    app.status === 'interview' || app.status === 'interview_scheduled'
                ).length || 0;
                
                setStats(prev => ({
                    ...prev,
                    applicationsSent: appsData.applications?.length || 0,
                    interviewsScheduled: interviewCount
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

    const createJobCard = (job) => {
        return `
            <div class="job-card">
                <div class="job-header">
                    <div style="display: flex; flex: 1;">
                        <div class="company-logo">${job.companyName?.substring(0, 2).toUpperCase() || 'JB'}</div>
                        <div class="job-info">
                            <h3>${job.title || 'Job Title'}</h3>
                            <div class="job-company">${job.companyName || 'Company'}</div>
                            <div class="job-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${job.location || 'Location'}</span>
                                <span><i class="fas fa-briefcase"></i> ${job.jobType || 'Full-time'}</span>
                                <span><i class="fas fa-layer-group"></i> ${job.experienceLevel || 'Mid Level'}</span>
                                <span><i class="fas fa-dollar-sign"></i> ${job.salary || 'Competitive'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-secondary btn-sm"><i class="far fa-bookmark"></i></button>
                    </div>
                </div>
                <div class="job-tags">
                    ${job.skills?.map(skill => `<span class="tag">${skill}</span>`).join('') || ''}
                    <span class="tag" style="margin-left: auto; color: #999;"><i class="fas fa-clock"></i> ${job.postedDate || 'Recently'}</span>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary btn-sm" onclick="window.location.href='/job/${job._id}'">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.location.href='/job/${job._id}'">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    };

    useEffect(() => {
        // Populate jobs when data is loaded
        if (jobs.length > 0) {
            const recommendedContainer = document.getElementById('recommendedJobs');
            const allJobsContainer = document.getElementById('jobsList');
            const savedJobsContainer = document.getElementById('savedJobsList');
            const matchedJobsContainer = document.getElementById('matchedJobsList');

            if (recommendedContainer) {
                recommendedContainer.innerHTML = jobs.slice(0, 3).map(job => createJobCard(job)).join('');
            }
            if (allJobsContainer) {
                allJobsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
            }
            if (savedJobsContainer) {
                savedJobsContainer.innerHTML = jobs.slice(0, 4).map(job => createJobCard(job)).join('');
            }
            if (matchedJobsContainer) {
                matchedJobsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
            }
        }

        // Populate applications
        if (applications.length > 0) {
            const recentAppsContainer = document.getElementById('recentApplications');
            const allAppsContainer = document.getElementById('allApplications');

            const createAppRow = (app) => `
                <tr>
                    <td><strong>${app.jobTitle || 'Job Title'}</strong></td>
                    <td>${app.companyName || 'Company'}</td>
                    <td>${app.location || 'Location'}</td>
                    <td>${new Date(app.appliedDate).toLocaleDateString() || 'Recently'}</td>
                    <td><span class="status-badge status-${app.status}">${app.status || 'applied'}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm">View</button>
                    </td>
                </tr>
            `;

            if (recentAppsContainer) {
                recentAppsContainer.innerHTML = applications.slice(0, 5).map(app => createAppRow(app)).join('');
            }
            if (allAppsContainer) {
                allAppsContainer.innerHTML = applications.map(app => createAppRow(app)).join('');
            }
        }

        // Populate interviews
        const interviewsList = document.getElementById('interviewsList');
        const upcomingInterviews = document.getElementById('upcomingInterviews');
        
        const interviewApps = applications.filter(app => app.status === 'interview' || app.status === 'interview_scheduled');
        
        if (interviewApps.length > 0) {
            const createInterviewCard = (app, isCompact = false) => {
                const date = new Date(app.interviewDate || Date.now());
                return `
                    <div class="interview-card">
                        <div class="interview-header">
                            <div style="flex: 1;">
                                <h${isCompact ? '4' : '3'} style="margin-bottom: 5px;">${app.jobTitle || 'Interview'}</h${isCompact ? '4' : '3'}>
                                <p style="color: #666; font-size: ${isCompact ? '13px' : '14px'}; margin-bottom: ${isCompact ? '8px' : '12px'};">${app.companyName || 'Company'}</p>
                                ${!isCompact ? `
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 14px; color: #666;">
                                    <div><i class="fas fa-calendar"></i> ${date.toLocaleDateString()}</div>
                                    <div><i class="fas fa-clock"></i> ${app.interviewTime || 'TBD'}</div>
                                    <div><i class="fas fa-video"></i> ${app.interviewMode || 'Video Interview'}</div>
                                </div>
                                ` : `
                                <div style="font-size: 13px; color: #666;">
                                    <div><i class="fas fa-clock"></i> ${app.interviewTime || 'TBD'}</div>
                                    <div style="margin-top: 5px;"><i class="fas fa-video"></i> ${app.interviewMode || 'Video'}</div>
                                </div>
                                `}
                            </div>
                            <div class="interview-date">
                                <div class="day">${date.getDate()}</div>
                                <div class="month">${date.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                            </div>
                        </div>
                        ${!isCompact ? `
                        <div style="margin-top: 15px; display: flex; gap: 10px;">
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-video"></i> Join Interview
                            </button>
                            <button class="btn btn-secondary btn-sm">
                                <i class="fas fa-calendar"></i> Reschedule
                            </button>
                            <button class="btn btn-secondary btn-sm">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                        </div>
                        ` : `
                        <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 10px;">
                            <i class="fas fa-calendar"></i> View Details
                        </button>
                        `}
                    </div>
                `;
            };

            if (interviewsList) {
                interviewsList.innerHTML = interviewApps.map(app => createInterviewCard(app, false)).join('');
            }
            if (upcomingInterviews) {
                upcomingInterviews.innerHTML = interviewApps.slice(0, 2).map(app => createInterviewCard(app, true)).join('');
            }
        } else {
            if (interviewsList) {
                interviewsList.innerHTML = '<div class="card"><div class="empty-state"><i class="fas fa-calendar"></i><h3>No Interviews Scheduled</h3><p>Your upcoming interviews will appear here</p></div></div>';
            }
            if (upcomingInterviews) {
                upcomingInterviews.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No upcoming interviews</p>';
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
                    <h2><i className="fas fa-briefcase"></i> JobPortal</h2>
                    <p>Your Career Journey</p>
                </div>
                <div className="nav-menu">
                    <div className="nav-item active" onClick={() => showSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('jobs')}>
                        <i className="fas fa-search"></i>
                        <span>Browse Jobs</span>
                        <span className="badge success">NEW</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('applications')}>
                        <i className="fas fa-file-alt"></i>
                        <span>My Applications</span>
                        <span className="badge">{applications.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('saved')}>
                        <i className="fas fa-bookmark"></i>
                        <span>Saved Jobs</span>
                        <span className="badge">{stats.savedJobs}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('interviews')}>
                        <i className="fas fa-calendar-check"></i>
                        <span>Interviews</span>
                        <span className="badge">{stats.interviewsScheduled}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('matches')}>
                        <i className="fas fa-star"></i>
                        <span>Recommended</span>
                        <span className="badge">{jobs.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">5</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/profile')}>
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/resume-upload')}>
                        <i className="fas fa-file-pdf"></i>
                        <span>Resume/CV</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('resources')}>
                        <i className="fas fa-book"></i>
                        <span>Career Resources</span>
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
                        <input type="text" placeholder="Search jobs, companies, or skills..." />
                    </div>
                    <div className="top-bar-actions">
                        <button className="icon-btn">
                            <i className="fas fa-bell"></i>
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-btn">
                            <i className="fas fa-question-circle"></i>
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
                                    {userProfile?.professionalTitle || 'Job Seeker'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className="page-section active" id="dashboard">
                        <h1 style={{marginBottom: '25px'}}>Welcome back, {userProfile?.firstName}! 👋</h1>

                        {/* Profile Completion */}
                        <div className="profile-completion">
                            <div className="completion-header">
                                <div>
                                    <h3 style={{marginBottom: '5px'}}>Complete Your Profile</h3>
                                    <p style={{opacity: 0.9, fontSize: '14px'}}>75% Complete - Almost there!</p>
                                </div>
                                <div style={{fontSize: '32px', fontWeight: 700}}>75%</div>
                            </div>
                            <div className="completion-bar">
                                <div className="completion-fill"></div>
                            </div>
                            <div className="completion-actions">
                                <button className="btn" onClick={() => navigate('/complete-profile')}>
                                    <i className="fas fa-plus"></i> Add Skills
                                </button>
                                <button className="btn" onClick={() => navigate('/resume-upload')}>
                                    <i className="fas fa-upload"></i> Upload Resume
                                </button>
                                <button className="btn" onClick={() => navigate('/complete-profile')}>
                                    <i className="fas fa-certificate"></i> Add Certifications
                                </button>
                            </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.applicationsSent}</div>
                                        <div className="stat-label">Applications Sent</div>
                                    </div>
                                    <div className="stat-icon blue">
                                        <i className="fas fa-paper-plane"></i>
                                    </div>
                                </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> 3 this week
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.interviewsScheduled}</div>
                                        <div className="stat-label">Interviews Scheduled</div>
                                    </div>
                                    <div className="stat-icon green">
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                </div>
                                <div className="stat-change">
                                    Next: Tomorrow at 2:00 PM
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.profileViews}</div>
                                        <div className="stat-label">Profile Views</div>
                                    </div>
                                    <div className="stat-icon purple">
                                        <i className="fas fa-eye"></i>
                                    </div>
                                </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> +18% from last week
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.savedJobs}</div>
                                        <div className="stat-label">Saved Jobs</div>
                                    </div>
                                    <div className="stat-icon orange">
                                        <i className="fas fa-bookmark"></i>
                                    </div>
                                </div>
                                <div className="stat-change">
                                    2 new matches today
                                </div>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="alert success">
                            <i className="fas fa-check-circle" style={{fontSize: '24px'}}></i>
                            <div>
                                <strong>Great news!</strong> Your application for Senior Developer at TechCorp was viewed by the recruiter.
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px'}}>
                            {/* Recommended Jobs */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recommended for You</h3>
                                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('matches')}>View All</button>
                                </div>
                                <div id="recommendedJobs">
                                    {/* Jobs will be populated here */}
                                </div>
                            </div>

                            {/* Upcoming Interviews */}
                            <div>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Upcoming Interviews</h3>
                                    </div>
                                    <div id="upcomingInterviews">
                                        {/* Interviews will be populated here */}
                                    </div>
                                </div>

                                <div className="card" style={{marginTop: '20px'}}>
                                    <div className="card-header">
                                        <h3 className="card-title">Quick Actions</h3>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                        <button className="btn btn-primary" onClick={() => showSection('jobs')}>
                                            <i className="fas fa-search"></i> Browse Jobs
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => navigate('/resume-upload')}>
                                            <i className="fas fa-upload"></i> Update Resume
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => navigate('/complete-profile')}>
                                            <i className="fas fa-user-edit"></i> Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div className="card" style={{marginTop: '20px'}}>
                            <div className="card-header">
                                <h3 className="card-title">Recent Applications</h3>
                                <button className="btn btn-secondary btn-sm" onClick={() => showSection('applications')}>View All</button>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Location</th>
                                            <th>Applied</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recentApplications">
                                        {/* Applications will be populated here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Browse Jobs Section */}
                    <div className="page-section" id="jobs">
                        <h1 style={{marginBottom: '25px'}}>Browse Jobs</h1>

                        <div className="filters">
                            <select className="filter-select">
                                <option>All Job Types</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Remote</option>
                            </select>
                            <select className="filter-select">
                                <option>All Locations</option>
                                <option>Nairobi, Kenya</option>
                                <option>Remote</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                            </select>
                            <select className="filter-select">
                                <option>All Experience Levels</option>
                                <option>Entry Level</option>
                                <option>Mid Level</option>
                                <option>Senior Level</option>
                                <option>Executive</option>
                            </select>
                            <select className="filter-select">
                                <option>Sort By: Most Recent</option>
                                <option>Relevance</option>
                                <option>Salary: High to Low</option>
                                <option>Company Name</option>
                            </select>
                        </div>

                        <div className="card">
                            <div id="jobsList">
                                {/* Jobs will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* My Applications Section */}
                    <div className="page-section" id="applications">
                        <h1 style={{marginBottom: '25px'}}>My Applications</h1>

                        <div className="filters">
                            <select className="filter-select">
                                <option>All Applications ({applications.length})</option>
                                <option>Under Review</option>
                                <option>Interview</option>
                                <option>Offered</option>
                                <option>Rejected</option>
                            </select>
                            <select className="filter-select">
                                <option>Sort By: Most Recent</option>
                                <option>Company Name</option>
                                <option>Application Date</option>
                            </select>
                        </div>

                        <div className="card">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Location</th>
                                            <th>Applied</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="allApplications">
                                        {/* All applications will be populated here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Saved Jobs Section */}
                    <div className="page-section" id="saved">
                        <h1 style={{marginBottom: '25px'}}>Saved Jobs</h1>
                        <div className="card">
                            <div id="savedJobsList">
                                {/* Saved jobs will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Interviews Section */}
                    <div className="page-section" id="interviews">
                        <h1 style={{marginBottom: '25px'}}>Interview Schedule</h1>
                        
                        <div className="alert info">
                            <i className="fas fa-info-circle" style={{fontSize: '24px'}}></i>
                            <div>
                                <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
                            </div>
                        </div>

                        <div id="interviewsList">
                            {/* Interviews will be populated here */}
                        </div>
                    </div>

                    {/* Recommended Jobs Section */}
                    <div className="page-section" id="matches">
                        <h1 style={{marginBottom: '25px'}}>Recommended Jobs</h1>
                        <div className="alert success">
                            <i className="fas fa-star" style={{fontSize: '24px'}}></i>
                            <div>
                                Based on your profile and preferences, we found <strong>{jobs.length} jobs</strong> that match your skills!
                            </div>
                        </div>
                        <div className="card">
                            <div id="matchedJobsList">
                                {/* Matched jobs will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className="page-section" id="messages">
                        <h1 style={{marginBottom: '25px'}}>Messages</h1>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Inbox</h3>
                                <button className="btn btn-primary btn-sm">
                                    <i className="fas fa-plus"></i> New Message
                                </button>
                            </div>
                            <div className="message-list">
                                <div className="message-item unread">
                                    <div className="message-avatar">TC</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">TechCorp Inc.</span>
                                            <span className="message-time">2 hours ago</span>
                                        </div>
                                        <div className="message-preview">Your application for Senior Full Stack Developer has been reviewed. We'd like to schedule an interview...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Career Resources Section */}
                    <div className="page-section" id="resources">
                        <h1 style={{marginBottom: '25px'}}>Career Resources</h1>
                        <div className="stats-grid">
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-book"></i> Interview Tips</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Master your interview skills with expert advice and common questions.</p>
                                <button className="btn btn-secondary btn-sm">Learn More</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-file-alt"></i> Resume Builder</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Create a professional resume in minutes with our templates.</p>
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/resume-builder')}>Start Building</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-graduation-cap"></i> Online Courses</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Upskill with courses and certifications from top providers.</p>
                                <button className="btn btn-secondary btn-sm">Browse Courses</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-users"></i> Career Advice</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Get personalized guidance from career experts and mentors.</p>
                                <button className="btn btn-secondary btn-sm">Get Advice</button>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="page-section" id="settings">
                        <h1 style={{marginBottom: '25px'}}>Settings</h1>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-bell"></i> Notification Preferences</h3>
                            </div>
                            <div className="settings-section">
                                <div className="settings-item">
                                    <div>
                                        <h4>Email Notifications</h4>
                                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Receive job alerts and updates via email</p>
                                    </div>
                                    <div className="toggle-switch active"></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Application Updates</h4>
                                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Get notified about application status changes</p>
                                    </div>
                                    <div className="toggle-switch active"></div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-lock"></i> Privacy Settings</h3>
                            </div>
                            <div className="settings-section">
                                <div className="settings-item">
                                    <div>
                                        <h4>Profile Visibility</h4>
                                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Make your profile visible to employers</p>
                                    </div>
                                    <div className="toggle-switch active"></div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-user-shield"></i> Account Security</h3>
                            </div>
                            <div style={{display: 'grid', gap: '15px'}}>
                                <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <h4>Change Password</h4>
                                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Last changed 3 months ago</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Change</button>
                                </div>
                                <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Add an extra layer of security</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Enable</button>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                            </div>
                            <div style={{padding: '20px', background: '#fff5f5', border: '2px solid #fee', borderRadius: '8px'}}>
                                <h4 style={{color: '#d32f2f', marginBottom: '10px'}}>Delete Account</h4>
                                <p style={{color: '#666', marginBottom: '15px'}}>Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="btn btn-danger">
                                    <i className="fas fa-trash"></i> Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;

