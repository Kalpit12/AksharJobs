import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/InternDashboard.css';

const InternDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        applicationsSent: 0,
        interviewsScheduled: 0,
        profileViews: 89,
        savedOpportunities: 6
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

            // Fetch internships (using jobs endpoint filtered for internships)
            const jobsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'}/api/jobs/get_jobs`, { headers });
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                // Filter for internships
                const internshipsList = jobsData.jobs?.filter(job => 
                    job.jobType?.toLowerCase().includes('intern') || job.title?.toLowerCase().includes('intern')
                ) || [];
                setInternships(internshipsList);
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

    const toggleMobileMenu = () => {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('mobileBackdrop');
        sidebar?.classList.toggle('mobile-open');
        backdrop?.classList.toggle('show');
    };

    const createInternshipCard = (internship) => {
        return `
            <div class="internship-card">
                <div class="internship-header">
                    <div style="display: flex; flex: 1;">
                        <div class="company-logo">${internship.companyName?.substring(0, 2).toUpperCase() || 'IN'}</div>
                        <div class="internship-info">
                            <h3>${internship.title || 'Internship Title'}</h3>
                            <div class="internship-company">${internship.companyName || 'Company'}</div>
                            <div class="internship-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${internship.location || 'Location'}</span>
                                <span><i class="fas fa-clock"></i> ${internship.duration || '3 months'}</span>
                                <span><i class="fas fa-dollar-sign"></i> ${internship.salary || 'Stipend'}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary btn-sm"><i class="far fa-bookmark"></i></button>
                    </div>
                </div>
                <div class="internship-tags">
                    ${internship.skills?.map(skill => `<span class="tag">${skill}</span>`).join('') || ''}
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary btn-sm" onclick="window.location.href='/job/${internship._id}'">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.location.href='/job/${internship._id}'">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    };

    useEffect(() => {
        // Populate internships when data is loaded
        if (internships.length > 0) {
            const recommendedContainer = document.getElementById('recommendedInternships');
            const allInternshipsContainer = document.getElementById('internshipsList');
            const savedContainer = document.getElementById('savedInternshipsList');
            const matchedContainer = document.getElementById('matchedInternshipsList');

            if (recommendedContainer) {
                recommendedContainer.innerHTML = internships.slice(0, 3).map(int => createInternshipCard(int)).join('');
            }
            if (allInternshipsContainer) {
                allInternshipsContainer.innerHTML = internships.map(int => createInternshipCard(int)).join('');
            }
            if (savedContainer) {
                savedContainer.innerHTML = internships.slice(0, 4).map(int => createInternshipCard(int)).join('');
            }
            if (matchedContainer) {
                matchedContainer.innerHTML = internships.map(int => createInternshipCard(int)).join('');
            }
        }

        // Populate applications
        if (applications.length > 0) {
            const recentAppsContainer = document.getElementById('recentApplications');
            const allAppsContainer = document.getElementById('allApplications');

            const createAppRow = (app) => `
                <tr>
                    <td><strong>${app.jobTitle || 'Internship Title'}</strong></td>
                    <td>${app.companyName || 'Company'}</td>
                    <td>${app.location || 'Location'}</td>
                    <td>${app.duration || '3 months'}</td>
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
    }, [internships, applications]);

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div style={{textAlign: 'center'}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize: '48px', color: '#4facfe'}}></i>
                    <p style={{marginTop: '20px', color: '#666'}}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {/* Mobile Menu Backdrop */}
            <div className="mobile-backdrop" id="mobileBackdrop" onClick={toggleMobileMenu}></div>

            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-user-graduate"></i> InternHub</h2>
                    <p>Launch Your Career</p>
                </div>
                <div className="nav-menu">
                    <div className="nav-item active" onClick={() => showSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('internships')}>
                        <i className="fas fa-search"></i>
                        <span>Browse Internships</span>
                        <span className="badge success">NEW</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('applications')}>
                        <i className="fas fa-file-alt"></i>
                        <span>My Applications</span>
                        <span className="badge">{applications.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('saved')}>
                        <i className="fas fa-bookmark"></i>
                        <span>Saved Internships</span>
                        <span className="badge">{stats.savedOpportunities}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('interviews')}>
                        <i className="fas fa-calendar-check"></i>
                        <span>Interviews</span>
                        <span className="badge">{stats.interviewsScheduled}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('matches')}>
                        <i className="fas fa-star"></i>
                        <span>Recommended</span>
                        <span className="badge">{internships.length}</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge warning">3</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/profile')}>
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('academic')}>
                        <i className="fas fa-graduation-cap"></i>
                        <span>Academic Info</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('portfolio')}>
                        <i className="fas fa-briefcase"></i>
                        <span>Portfolio</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('learning')}>
                        <i className="fas fa-book"></i>
                        <span>Learning Resources</span>
                    </div>
                    <div className="nav-item" onClick={() => showSection('settings')}>
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                    </div>
                </div>
                <div className="sidebar-footer">
                    <div style={{padding: '15px 0'}}>
                        <div style={{fontSize: '12px', opacity: 0.7, textAlign: 'center', cursor: 'pointer'}}>
                            <i className="fas fa-question-circle"></i> Need Help?
                        </div>
                        <div style={{fontSize: '11px', opacity: 0.6, textAlign: 'center', marginTop: '10px'}}>
                            Version 1.0 • © 2024 InternHub
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search internships, companies, or skills..." />
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
                                    {userProfile?.education?.[0]?.fieldOfStudy || 'Student'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className="page-section active" id="dashboard">
                        <h1 style={{marginBottom: '25px'}}>Welcome back, {userProfile?.firstName}! 🎓</h1>

                        {/* Profile Completion */}
                        <div className="profile-completion">
                            <div className="completion-header">
                                <div>
                                    <h3 style={{marginBottom: '5px'}}>Complete Your Profile</h3>
                                    <p style={{opacity: 0.9, fontSize: '14px'}}>65% Complete - Stand out to recruiters!</p>
                                </div>
                                <div style={{fontSize: '32px', fontWeight: 700}}>65%</div>
                            </div>
                            <div className="completion-bar">
                                <div className="completion-fill"></div>
                            </div>
                            <div className="completion-actions">
                                <button className="btn" onClick={() => navigate('/complete-profile')}>
                                    <i className="fas fa-user-edit"></i> Complete Profile
                                </button>
                                <button className="btn" onClick={() => navigate('/resume-upload')}>
                                    <i className="fas fa-upload"></i> Upload Resume
                                </button>
                                <button className="btn" onClick={() => showSection('academic')}>
                                    <i className="fas fa-award"></i> Add Coursework
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
                                    <i className="fas fa-arrow-up"></i> 2 this week
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
                                    Next: Tomorrow at 10:00 AM
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
                                    <i className="fas fa-arrow-up"></i> +25% this month
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">{stats.savedOpportunities}</div>
                                        <div className="stat-label">Saved Opportunities</div>
                                    </div>
                                    <div className="stat-icon orange">
                                        <i className="fas fa-bookmark"></i>
                                    </div>
                                </div>
                                <div className="stat-change">
                                    3 new matches today
                                </div>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="alert success">
                            <i className="fas fa-check-circle" style={{fontSize: '24px'}}></i>
                            <div>
                                <strong>Congratulations!</strong> You've been shortlisted for the Software Development Internship at TechStart Inc.
                            </div>
                        </div>

                        <div className="alert warning">
                            <i className="fas fa-exclamation-triangle" style={{fontSize: '24px'}}></i>
                            <div>
                                <strong>Application Deadline:</strong> Marketing Internship at Brand Agency closes in 2 days!
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px'}}>
                            {/* Recommended Internships */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recommended for You</h3>
                                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('matches')}>View All</button>
                                </div>
                                <div id="recommendedInternships">
                                    {/* Internships will be populated here */}
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
                                            <span className="progress-value">{userProfile?.education?.[0]?.currentYear || '3rd Year'}</span>
                                        </div>
                                        <div className="progress-item">
                                            <span className="progress-label">GPA</span>
                                            <span className="progress-value">{userProfile?.education?.[0]?.gpa || '3.8/4.0'}</span>
                                        </div>
                                        <div className="progress-item">
                                            <span className="progress-label">Expected Graduation</span>
                                            <span className="progress-value">{userProfile?.education?.[0]?.graduationDate || 'May 2025'}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" style={{width: '100%', marginTop: '10px'}} onClick={() => showSection('academic')}>
                                        Update Info
                                    </button>
                                </div>

                                {/* Quick Actions */}
                                <div className="card" style={{marginTop: '20px'}}>
                                    <div className="card-header">
                                        <h3 className="card-title">Quick Actions</h3>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                        <button className="btn btn-primary" onClick={() => showSection('internships')}>
                                            <i className="fas fa-search"></i> Find Internships
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
                            <div style={{overflowX: 'auto'}}>
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
                                    <tbody id="recentApplications">
                                        {/* Applications will be populated here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Browse Internships Section */}
                    <div className="page-section" id="internships">
                        <h1 style={{marginBottom: '25px'}}>Browse Internships</h1>

                        <div className="filters">
                            <select className="filter-select">
                                <option>All Durations</option>
                                <option>1-2 months</option>
                                <option>3 months</option>
                                <option>6 months</option>
                                <option>12 months</option>
                            </select>
                            <select className="filter-select">
                                <option>All Locations</option>
                                <option>On-site</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                            </select>
                            <select className="filter-select">
                                <option>All Fields</option>
                                <option>Technology</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                                <option>Design</option>
                            </select>
                            <select className="filter-select">
                                <option>All Types</option>
                                <option>Paid</option>
                                <option>Unpaid</option>
                                <option>Academic Credit</option>
                            </select>
                            <select className="filter-select">
                                <option>Sort By: Most Recent</option>
                                <option>Relevance</option>
                                <option>Stipend: High to Low</option>
                                <option>Company Name</option>
                            </select>
                        </div>

                        <div className="card">
                            <div id="internshipsList">
                                {/* Internships will be populated here */}
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
                                <option>Accepted</option>
                                <option>Rejected</option>
                            </select>
                            <select className="filter-select">
                                <option>Sort By: Most Recent</option>
                                <option>Company Name</option>
                                <option>Application Date</option>
                            </select>
                        </div>

                        <div className="card">
                            <div style={{overflowX: 'auto'}}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Internship Title</th>
                                            <th>Company</th>
                                            <th>Location</th>
                                            <th>Duration</th>
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

                    {/* Saved Internships Section */}
                    <div className="page-section" id="saved">
                        <h1 style={{marginBottom: '25px'}}>Saved Internships</h1>
                        <div className="alert info">
                            <i className="fas fa-bookmark" style={{fontSize: '24px'}}></i>
                            <div>
                                You have <strong>{stats.savedOpportunities} saved internships</strong>. Don't forget to apply before deadlines!
                            </div>
                        </div>
                        <div className="card">
                            <div id="savedInternshipsList">
                                {/* Saved internships will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Interviews Section */}
                    <div className="page-section" id="interviews">
                        <h1 style={{marginBottom: '25px'}}>Interview Schedule</h1>
                        
                        <div className="alert info">
                            <i className="fas fa-info-circle" style={{fontSize: '24px'}}></i>
                            <div>
                                <strong>Preparation Tip:</strong> Research the company, review the internship requirements, and prepare questions to ask the interviewer.
                            </div>
                        </div>

                        <div className="card">
                            <div className="empty-state">
                                <i className="fas fa-calendar-alt"></i>
                                <h3>No Upcoming Interviews</h3>
                                <p>Keep applying! Your next opportunity is just around the corner.</p>
                                <button className="btn btn-primary" onClick={() => showSection('internships')}>
                                    Browse Internships
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Section */}
                    <div className="page-section" id="matches">
                        <h1 style={{marginBottom: '25px'}}>Recommended Internships</h1>
                        <div className="alert success">
                            <i className="fas fa-star" style={{fontSize: '24px'}}></i>
                            <div>
                                Based on your profile and academic background, we found <strong>{internships.length} internships</strong> that match your skills!
                            </div>
                        </div>
                        <div className="card">
                            <div id="matchedInternshipsList">
                                {/* Matched internships will be populated here */}
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
                                <p>Communicate with recruiters and hiring managers about internship opportunities</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info Section */}
                    <div className="page-section" id="academic">
                        <h1 style={{marginBottom: '25px'}}>Academic Information</h1>
                        
                        <div className="card">
                            <div className="card-header">
                                <h3 style={{marginBottom: 0}}>Education Details</h3>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate('/complete-profile')}>
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                            </div>
                            <div className="academic-progress" style={{marginBottom: '20px'}}>
                                <div className="progress-item">
                                    <span className="progress-label">Institution</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.institution || 'University'}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">Degree Program</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.degreeType || 'Bachelor of Science'}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">Major</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.fieldOfStudy || 'Computer Science'}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">Current Year</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.currentYear || '3rd Year'}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">GPA</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.gpa || '3.8/4.0'}</span>
                                </div>
                                <div className="progress-item">
                                    <span className="progress-label">Expected Graduation</span>
                                    <span className="progress-value">{userProfile?.education?.[0]?.graduationDate || 'May 2025'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{marginTop: '20px'}}>
                            <div className="card-header">
                                <h3 style={{marginBottom: 0}}>Relevant Coursework</h3>
                                <button className="btn btn-secondary btn-sm">
                                    <i className="fas fa-plus"></i> Add Course
                                </button>
                            </div>
                            <div className="internship-tags">
                                {userProfile?.skills?.slice(0, 6).map((skill, idx) => (
                                    <span key={idx} className="tag">{skill}</span>
                                )) || (
                                    <>
                                        <span className="tag">Data Structures & Algorithms</span>
                                        <span className="tag">Database Management</span>
                                        <span className="tag">Web Development</span>
                                        <span className="tag">Software Engineering</span>
                                        <span className="tag">Machine Learning</span>
                                        <span className="tag">Operating Systems</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Section */}
                    <div className="page-section" id="portfolio">
                        <h1 style={{marginBottom: '25px'}}>My Portfolio</h1>
                        
                        <div className="card">
                            <div className="card-header">
                                <h3 style={{marginBottom: 0}}>Academic Projects</h3>
                                <button className="btn btn-primary btn-sm">
                                    <i className="fas fa-plus"></i> Add Project
                                </button>
                            </div>
                            <div className="resource-card">
                                <h3><i className="fas fa-project-diagram"></i> E-Commerce Website</h3>
                                <p style={{color: '#666', marginBottom: '10px'}}>Full-stack e-commerce platform built with React, Node.js, and MongoDB</p>
                                <div className="internship-tags">
                                    <span className="tag">React</span>
                                    <span className="tag">Node.js</span>
                                    <span className="tag">MongoDB</span>
                                </div>
                                <button className="btn btn-secondary btn-sm" style={{marginTop: '10px'}}>
                                    <i className="fas fa-external-link-alt"></i> View Project
                                </button>
                            </div>
                        </div>

                        <div className="card" style={{marginTop: '20px'}}>
                            <div className="card-header">
                                <h3 style={{marginBottom: 0}}>Skills & Certifications</h3>
                                <button className="btn btn-secondary btn-sm">
                                    <i className="fas fa-plus"></i> Add Skills
                                </button>
                            </div>
                            <div style={{marginBottom: '20px'}}>
                                <h4 style={{marginBottom: '10px', fontSize: '16px'}}>Technical Skills</h4>
                                <div className="internship-tags">
                                    {userProfile?.skills?.map((skill, idx) => (
                                        <span key={idx} className="tag">{skill}</span>
                                    )) || (
                                        <>
                                            <span className="tag">Python</span>
                                            <span className="tag">JavaScript</span>
                                            <span className="tag">React</span>
                                            <span className="tag">Java</span>
                                            <span className="tag">SQL</span>
                                            <span className="tag">Git</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Learning Resources Section */}
                    <div className="page-section" id="learning">
                        <h1 style={{marginBottom: '25px'}}>Learning Resources</h1>
                        
                        <div className="stats-grid">
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-lightbulb"></i> Interview Prep</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Master internship interviews with tips and practice questions</p>
                                <button className="btn btn-secondary btn-sm">Learn More</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-file-alt"></i> Resume Guide</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Create a standout resume for internship applications</p>
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/resume-builder')}>Start Building</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-graduation-cap"></i> Skill Development</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Access free courses to enhance your qualifications</p>
                                <button className="btn btn-secondary btn-sm">Browse Courses</button>
                            </div>
                            <div className="card">
                                <h3 style={{marginBottom: '15px'}}><i className="fas fa-users"></i> Networking Tips</h3>
                                <p style={{color: '#666', marginBottom: '15px'}}>Learn how to build professional connections</p>
                                <button className="btn btn-secondary btn-sm">Get Started</button>
                            </div>
                        </div>

                        <div className="card" style={{marginTop: '20px'}}>
                            <div className="card-header">
                                <h3 style={{marginBottom: 0}}>Recommended Articles</h3>
                            </div>
                            <div className="resource-card">
                                <h3>📝 How to Make the Most of Your Internship Experience</h3>
                                <p style={{color: '#666'}}>Learn strategies to maximize learning and networking during your internship.</p>
                            </div>
                            <div className="resource-card">
                                <h3>🎯 Top Skills Employers Look for in Interns</h3>
                                <p style={{color: '#666'}}>Discover the key competencies that make you an attractive candidate.</p>
                            </div>
                            <div className="resource-card">
                                <h3>💼 Converting Your Internship into a Full-Time Job</h3>
                                <p style={{color: '#666'}}>Strategies to turn your internship into a permanent career opportunity.</p>
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
                                <p>Manage your preferences, notifications, and privacy settings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternDashboard;

