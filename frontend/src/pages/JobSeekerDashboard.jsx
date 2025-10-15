import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [profileData, setProfileData] = useState({
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+254 700 123 456',
        dob: '1990-05-15',
        location: 'Nairobi, Kenya',
        nationality: 'Kenyan',
        summary: 'Experienced software engineer with 8+ years of expertise in full-stack development.',
        jobTitle: 'Senior Software Engineer',
        experience: '8',
        industry: 'Technology',
        salary: '$80,000 - $100,000',
        jobType: 'Full-time',
        availability: 'Immediately'
    });

    // Sample data - matching HTML exactly
    const sampleJobs = [
        {
            id: 1,
            title: 'Senior Full Stack Developer',
            company: 'TechCorp Inc.',
            logo: 'TC',
            location: 'Nairobi, Kenya',
            type: 'Full-time',
            experience: 'Senior Level',
            salary: '$60,000 - $80,000',
            posted: '2 days ago',
            skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
            featured: true
        },
        {
            id: 2,
            title: 'Product Manager',
            company: 'Innovation Labs',
            logo: 'IL',
            location: 'Remote',
            type: 'Full-time',
            experience: 'Mid Level',
            salary: '$70,000 - $90,000',
            posted: '1 week ago',
            skills: ['Product Strategy', 'Agile', 'Leadership'],
            featured: false
        },
        {
            id: 3,
            title: 'UX/UI Designer',
            company: 'Design Studio',
            logo: 'DS',
            location: 'London, UK',
            type: 'Contract',
            experience: 'Mid Level',
            salary: '$50,000 - $65,000',
            posted: '3 days ago',
            skills: ['Figma', 'User Research', 'Prototyping'],
            featured: true
        }
    ];

    const sampleApplications = [
        {
            id: 1,
            jobTitle: 'Senior Full Stack Developer',
            company: 'TechCorp Inc.',
            location: 'Nairobi, Kenya',
            appliedDaysAgo: '5 days ago',
            status: 'reviewing'
        },
        {
            id: 2,
            jobTitle: 'Product Manager',
            company: 'Innovation Labs',
            location: 'Remote',
            appliedDaysAgo: '10 days ago',
            status: 'interview'
        },
        {
            id: 3,
            jobTitle: 'UX/UI Designer',
            company: 'Design Studio',
            location: 'London, UK',
            appliedDaysAgo: '2 days ago',
            status: 'applied'
        }
    ];

    const sampleInterviews = [
        {
            id: 1,
            jobTitle: 'Product Manager',
            company: 'Innovation Labs',
            time: '2:00 PM',
            type: 'Video Interview',
            day: '21',
            month: 'JAN'
        },
        {
            id: 2,
            jobTitle: 'Marketing Manager',
            company: 'Growth Ventures',
            time: '10:00 AM',
            type: 'In-person',
            day: '23',
            month: 'JAN'
        }
    ];

    useEffect(() => {
        setJobs(sampleJobs);
        setApplications(sampleApplications);
        setInterviews(sampleInterviews);
    }, []);

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        // Add active class to clicked nav item
        const clickedItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
        if (clickedItem) {
            clickedItem.classList.add('active');
        }
    };

    const toggleProfileEdit = () => {
        setIsEditingProfile(true);
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.classList.remove('profile-view-mode');
            const inputs = profileForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.disabled = false;
            });
        }
    };

    const saveProfile = () => {
        alert('Profile saved successfully!');
        cancelProfileEdit();
    };

    const cancelProfileEdit = () => {
        setIsEditingProfile(false);
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.classList.add('profile-view-mode');
            const inputs = profileForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.disabled = true;
            });
        }
    };

    const toggleSwitch = (e) => {
        e.currentTarget.classList.toggle('active');
    };

    const createJobCard = (job, showUnsaveBtn = false) => (
        <div key={job.id} className="job-card">
            <div className="job-header">
                <div style={{ display: 'flex', flex: 1 }}>
                    <div className="company-logo">{job.logo}</div>
                    <div className="job-info">
                        <h3>{job.title}</h3>
                        <div className="job-company">{job.company}</div>
                        <div className="job-meta">
                            <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                            <span><i className="fas fa-briefcase"></i> {job.type}</span>
                            <span><i className="fas fa-layer-group"></i> {job.experience}</span>
                            <span><i className="fas fa-dollar-sign"></i> {job.salary}</span>
                        </div>
                    </div>
                </div>
                <div className="job-actions">
                    {showUnsaveBtn ? (
                        <button className="btn btn-danger btn-sm"><i className="fas fa-bookmark"></i></button>
                    ) : (
                        <button className="btn btn-secondary btn-sm"><i className="far fa-bookmark"></i></button>
                    )}
                </div>
            </div>
            <div className="job-tags">
                {job.featured && <span className="tag featured"><i className="fas fa-star"></i> Featured</span>}
                {job.skills.map((skill, index) => (
                    <span key={index} className="tag">{skill}</span>
                ))}
                <span className="tag" style={{ marginLeft: 'auto', color: '#999' }}>
                    <i className="fas fa-clock"></i> {job.posted}
                </span>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary btn-sm">
                    <i className="fas fa-paper-plane"></i> Apply Now
                </button>
                <button className="btn btn-secondary btn-sm">
                    <i className="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-briefcase"></i> JobPortal</h2>
                    <p>Your Career Journey</p>
                </div>
                <div className="nav-menu">
                    <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => showSection('jobs')}>
                        <i className="fas fa-search"></i>
                        <span>Browse Jobs</span>
                        <span className="badge success">NEW</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => showSection('applications')}>
                        <i className="fas fa-file-alt"></i>
                        <span>My Applications</span>
                        <span className="badge">12</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => showSection('saved')}>
                        <i className="fas fa-bookmark"></i>
                        <span>Saved Jobs</span>
                        <span className="badge">8</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => showSection('interviews')}>
                        <i className="fas fa-calendar-check"></i>
                        <span>Interviews</span>
                        <span className="badge">3</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`} onClick={() => showSection('matches')}>
                        <i className="fas fa-star"></i>
                        <span>Recommended</span>
                        <span className="badge">15</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">5</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => showSection('profile')}>
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'resume' ? 'active' : ''}`} onClick={() => showSection('resume')}>
                        <i className="fas fa-file-pdf"></i>
                        <span>Resume/CV</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => showSection('resources')}>
                        <i className="fas fa-book"></i>
                        <span>Career Resources</span>
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
                        <div className="user-profile" onClick={() => showSection('profile')}>
                            <div className="user-avatar">JS</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>John Smith</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Software Engineer</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`} id="dashboard">
                        <h1 style={{ marginBottom: '25px' }}>Welcome back, John! 👋</h1>

                        {/* Profile Completion */}
                        <div className="profile-completion">
                            <div className="completion-header">
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>Complete Your Profile</h3>
                                    <p style={{ opacity: 0.9, fontSize: '14px' }}>75% Complete - Almost there!</p>
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 700 }}>75%</div>
                            </div>
                            <div className="completion-bar">
                                <div className="completion-fill"></div>
                            </div>
                            <div className="completion-actions">
                                <button className="btn" onClick={() => showSection('profile')}>
                                    <i className="fas fa-plus"></i> Add Skills
                                </button>
                                <button className="btn" onClick={() => showSection('resume')}>
                                    <i className="fas fa-upload"></i> Upload Resume
                                </button>
                                <button className="btn" onClick={() => showSection('profile')}>
                                    <i className="fas fa-certificate"></i> Add Certifications
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">12</div>
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
                                        <div className="stat-number">3</div>
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
                                        <div className="stat-number">142</div>
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
                                        <div className="stat-number">8</div>
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
                            <i className="fas fa-check-circle" style={{ fontSize: '24px' }}></i>
                            <div>
                                <strong>Great news!</strong> Your application for Senior Developer at TechCorp was viewed by the recruiter.
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
                            {/* Recommended Jobs */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recommended for You</h3>
                                    <button className="btn btn-secondary btn-sm" onClick={() => showSection('matches')}>View All</button>
                                </div>
                                <div id="recommendedJobs">
                                    {jobs.slice(0, 3).map(job => createJobCard(job))}
                                </div>
                            </div>

                            {/* Upcoming Interviews */}
                            <div>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Upcoming Interviews</h3>
                                    </div>
                                    <div id="upcomingInterviews">
                                        {interviews.slice(0, 2).map(interview => (
                                            <div key={interview.id} className="interview-card">
                                                <div className="interview-header">
                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h4>
                                                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{interview.company}</p>
                                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                                            <div><i className="fas fa-clock"></i> {interview.time}</div>
                                                            <div style={{ marginTop: '5px' }}><i className="fas fa-video"></i> {interview.type}</div>
                                                        </div>
                                                    </div>
                                                    <div className="interview-date">
                                                        <div className="day">{interview.day}</div>
                                                        <div className="month">{interview.month}</div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }}>
                                                    <i className="fas fa-calendar"></i> View Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card" style={{ marginTop: '20px' }}>
                                    <div className="card-header">
                                        <h3 className="card-title">Quick Actions</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button className="btn btn-primary" onClick={() => showSection('jobs')}>
                                            <i className="fas fa-search"></i> Browse Jobs
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => showSection('resume')}>
                                            <i className="fas fa-upload"></i> Update Resume
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => showSection('profile')}>
                                            <i className="fas fa-user-edit"></i> Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div className="card" style={{ marginTop: '20px' }}>
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
                                            <th>Applied</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recentApplications">
                                        {applications.slice(0, 5).map(app => (
                                            <tr key={app.id}>
                                                <td><strong>{app.jobTitle}</strong></td>
                                                <td>{app.company}</td>
                                                <td>{app.appliedDaysAgo}</td>
                                                <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Browse Jobs Section */}
                    <div className={`page-section ${activeSection === 'jobs' ? 'active' : ''}`} id="jobs">
                        <h1 style={{ marginBottom: '25px' }}>Browse Jobs</h1>

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
                                {jobs.map(job => createJobCard(job))}
                            </div>
                        </div>
                    </div>

                    {/* My Applications Section */}
                    <div className={`page-section ${activeSection === 'applications' ? 'active' : ''}`} id="applications">
                        <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

                        <div className="filters">
                            <select className="filter-select">
                                <option>All Applications (12)</option>
                                <option>Under Review (5)</option>
                                <option>Interview (3)</option>
                                <option>Offered (1)</option>
                                <option>Rejected (3)</option>
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
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td><strong>{app.jobTitle}</strong></td>
                                                <td>{app.company}</td>
                                                <td>{app.location}</td>
                                                <td>{app.appliedDaysAgo}</td>
                                                <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Saved Jobs Section */}
                    <div className={`page-section ${activeSection === 'saved' ? 'active' : ''}`} id="saved">
                        <h1 style={{ marginBottom: '25px' }}>Saved Jobs</h1>
                        <div className="card">
                            <div id="savedJobsList">
                                {jobs.slice(0, 4).map(job => createJobCard(job, true))}
                            </div>
                        </div>
                    </div>

                    {/* Interviews Section */}
                    <div className={`page-section ${activeSection === 'interviews' ? 'active' : ''}`} id="interviews">
                        <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
                        
                        <div className="alert info">
                            <i className="fas fa-info-circle" style={{ fontSize: '24px' }}></i>
                            <div>
                                <strong>Tip:</strong> Prepare for your interviews by researching the company and practicing common interview questions.
                            </div>
                        </div>

                        <div id="interviewsList">
                            {interviews.map(interview => (
                                <div key={interview.id} className="interview-card">
                                    <div className="interview-header">
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ marginBottom: '5px' }}>{interview.jobTitle}</h3>
                                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>{interview.company}</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                                                <div><i className="fas fa-clock"></i> {interview.time}</div>
                                                <div><i className="fas fa-video"></i> {interview.type}</div>
                                            </div>
                                        </div>
                                        <div className="interview-date">
                                            <div className="day">{interview.day}</div>
                                            <div className="month">{interview.month}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-primary btn-sm">
                                            <i className="fas fa-video"></i> Join Interview
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-calendar"></i> Reschedule
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-info-circle"></i> Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Jobs Section */}
                    <div className={`page-section ${activeSection === 'matches' ? 'active' : ''}`} id="matches">
                        <h1 style={{ marginBottom: '25px' }}>Recommended Jobs</h1>
                        <div className="alert success">
                            <i className="fas fa-star" style={{ fontSize: '24px' }}></i>
                            <div>
                                Based on your profile and preferences, we found <strong>15 jobs</strong> that match your skills!
                            </div>
                        </div>
                        <div className="card">
                            <div id="matchedJobsList">
                                {jobs.map(job => createJobCard(job))}
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className={`page-section ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
                        <h1 style={{ marginBottom: '25px' }}>Messages</h1>
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
                                <div className="message-item unread">
                                    <div className="message-avatar">IL</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">Innovation Labs</span>
                                            <span className="message-time">1 day ago</span>
                                        </div>
                                        <div className="message-preview">Thank you for your interest in the Product Manager position. We have a few questions...</div>
                                    </div>
                                </div>
                                <div className="message-item">
                                    <div className="message-avatar">DS</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">Design Studio</span>
                                            <span className="message-time">3 days ago</span>
                                        </div>
                                        <div className="message-preview">We received your application for UX/UI Designer. Our team is currently reviewing...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className={`page-section ${activeSection === 'profile' ? 'active' : ''}`} id="profile">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>My Profile</h1>
                            <div>
                                <button className="btn btn-primary" id="editProfileBtn" onClick={toggleProfileEdit}>
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                                <button className="btn btn-success" id="saveProfileBtn" onClick={saveProfile} style={{ display: isEditingProfile ? 'inline-flex' : 'none' }}>
                                    <i className="fas fa-save"></i> Save Changes
                                </button>
                                <button className="btn btn-secondary" id="cancelProfileBtn" onClick={cancelProfileEdit} style={{ display: isEditingProfile ? 'inline-flex' : 'none', marginLeft: '10px' }}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </div>

                        {/* Profile Header */}
                        <div className="profile-header-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                <div className="profile-avatar-large">JS</div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>John Smith</h2>
                                    <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>Senior Software Engineer</p>
                                    <p style={{ opacity: 0.8 }}><i className="fas fa-map-marker-alt"></i> Nairobi, Kenya</p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className={`card profile-view-mode ${isEditingProfile ? '' : 'profile-view-mode'}`} id="profileForm">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-user"></i> Personal Information</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-input" id="fullName" value={profileData.fullName} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" id="email" value={profileData.email} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-input" id="phone" value={profileData.phone} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" className="form-input" id="dob" value={profileData.dob} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input type="text" className="form-input" id="location" value={profileData.location} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nationality</label>
                                    <input type="text" className="form-input" id="nationality" value={profileData.nationality} disabled={!isEditingProfile} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Professional Summary</label>
                                <textarea className="form-textarea" id="summary" disabled={!isEditingProfile}>{profileData.summary}</textarea>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-briefcase"></i> Professional Details</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div className="form-group">
                                    <label className="form-label">Current Job Title</label>
                                    <input type="text" className="form-input" id="jobTitle" value={profileData.jobTitle} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Years of Experience</label>
                                    <input type="number" className="form-input" id="experience" value={profileData.experience} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Industry</label>
                                    <select className="form-select" id="industry" disabled={!isEditingProfile}>
                                        <option value="Technology" selected={profileData.industry === 'Technology'}>Technology</option>
                                        <option value="Finance" selected={profileData.industry === 'Finance'}>Finance</option>
                                        <option value="Healthcare" selected={profileData.industry === 'Healthcare'}>Healthcare</option>
                                        <option value="Education" selected={profileData.industry === 'Education'}>Education</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expected Salary (USD)</label>
                                    <input type="text" className="form-input" id="salary" value={profileData.salary} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Type Preference</label>
                                    <select className="form-select" id="jobType" disabled={!isEditingProfile}>
                                        <option value="Full-time" selected={profileData.jobType === 'Full-time'}>Full-time</option>
                                        <option value="Part-time" selected={profileData.jobType === 'Part-time'}>Part-time</option>
                                        <option value="Contract" selected={profileData.jobType === 'Contract'}>Contract</option>
                                        <option value="Remote" selected={profileData.jobType === 'Remote'}>Remote</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Availability</label>
                                    <select className="form-select" id="availability" disabled={!isEditingProfile}>
                                        <option value="Immediately" selected={profileData.availability === 'Immediately'}>Immediately</option>
                                        <option value="2 Weeks" selected={profileData.availability === '2 Weeks'}>2 Weeks</option>
                                        <option value="1 Month" selected={profileData.availability === '1 Month'}>1 Month</option>
                                        <option value="3 Months" selected={profileData.availability === '3 Months'}>3 Months</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-code"></i> Skills & Expertise</h3>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '15px', color: '#666' }}>Technical Skills</h4>
                                <div>
                                    <span className="skill-tag">JavaScript</span>
                                    <span className="skill-tag">React</span>
                                    <span className="skill-tag">Node.js</span>
                                    <span className="skill-tag">Python</span>
                                    <span className="skill-tag">MongoDB</span>
                                    <span className="skill-tag">PostgreSQL</span>
                                    <span className="skill-tag">AWS</span>
                                    <span className="skill-tag">Docker</span>
                                    <span className="skill-tag">Git</span>
                                    <span className="skill-tag">REST APIs</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '25px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#666' }}>Soft Skills</h4>
                                <div>
                                    <span className="skill-tag">Leadership</span>
                                    <span className="skill-tag">Team Collaboration</span>
                                    <span className="skill-tag">Problem Solving</span>
                                    <span className="skill-tag">Communication</span>
                                    <span className="skill-tag">Project Management</span>
                                    <span className="skill-tag">Agile Methodologies</span>
                                </div>
                            </div>
                        </div>

                        {/* Work Experience */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-building"></i> Work Experience</h3>
                            </div>
                            <div className="experience-item">
                                <h4>Senior Software Engineer</h4>
                                <div className="company">TechCorp Inc.</div>
                                <div className="duration">January 2020 - Present (4 years)</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Leading a team of 5 developers in building scalable web applications. Implemented microservices architecture reducing system downtime by 40%. Mentored junior developers and conducted code reviews.</p>
                            </div>
                            <div className="experience-item">
                                <h4>Full Stack Developer</h4>
                                <div className="company">Innovation Labs</div>
                                <div className="duration">March 2018 - December 2019 (2 years)</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Developed and maintained multiple web applications using React and Node.js. Collaborated with UX designers to improve user experience. Implemented automated testing reducing bugs by 30%.</p>
                            </div>
                            <div className="experience-item">
                                <h4>Junior Developer</h4>
                                <div className="company">StartUp Solutions</div>
                                <div className="duration">June 2016 - February 2018 (2 years)</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Contributed to front-end development using JavaScript and React. Worked on bug fixes and feature enhancements. Participated in agile sprints and daily stand-ups.</p>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-graduation-cap"></i> Education</h3>
                            </div>
                            <div className="education-item">
                                <h4>Bachelor of Science in Computer Science</h4>
                                <div className="institution">University of Nairobi</div>
                                <div className="duration">2012 - 2016</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Graduated with First Class Honors. Specialized in Software Engineering and Database Systems. President of the Computer Science Society.</p>
                            </div>
                            <div className="education-item">
                                <h4>AWS Certified Solutions Architect</h4>
                                <div className="institution">Amazon Web Services</div>
                                <div className="duration">2021</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Professional certification demonstrating expertise in designing distributed systems on AWS.</p>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-certificate"></i> Certifications & Awards</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>AWS Certified Solutions Architect</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Amazon Web Services - 2021</p>
                                        </div>
                                        <span className="status-badge status-offered">Verified</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Certified Scrum Master (CSM)</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Scrum Alliance - 2020</p>
                                        </div>
                                        <span className="status-badge status-offered">Verified</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Employee of the Year 2022</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>TechCorp Inc.</p>
                                        </div>
                                        <span className="status-badge status-offered">Award</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-language"></i> Languages</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>English</h4>
                                    <p style={{ color: '#666' }}>Native/Fluent</p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>Swahili</h4>
                                    <p style={{ color: '#666' }}>Native/Fluent</p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>French</h4>
                                    <p style={{ color: '#666' }}>Intermediate</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-link"></i> Social Links</h3>
                            </div>
                            <div className="social-links">
                                <a href="#" className="social-link">
                                    <i className="fab fa-linkedin"></i>
                                    <span>linkedin.com/in/johnsmith</span>
                                </a>
                                <a href="#" className="social-link">
                                    <i className="fab fa-github"></i>
                                    <span>github.com/johnsmith</span>
                                </a>
                                <a href="#" className="social-link">
                                    <i className="fas fa-globe"></i>
                                    <span>johnsmith.dev</span>
                                </a>
                                <a href="#" className="social-link">
                                    <i className="fab fa-twitter"></i>
                                    <span>@johnsmith_dev</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section */}
                    <div className={`page-section ${activeSection === 'resume' ? 'active' : ''}`} id="resume">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>Resume/CV Management</h1>
                            <button className="btn btn-primary">
                                <i className="fas fa-upload"></i> Upload New Resume
                            </button>
                        </div>

                        <div className="card">
                            <div className="resume-list">
                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>John_Smith_Resume_2024.pdf</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Uploaded: Jan 10, 2024</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-file"></i> 256 KB</span>
                                            <span style={{ marginLeft: '15px' }} className="status-badge status-offered">Primary</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-download"></i> Download
                                        </button>
                                        <button className="btn btn-danger btn-sm">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-file-word"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>John_Smith_CV_Technical.docx</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Uploaded: Dec 15, 2023</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-file"></i> 184 KB</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-download"></i> Download
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-star"></i> Set as Primary
                                        </button>
                                        <button className="btn btn-danger btn-sm">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>Portfolio_Projects.pdf</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Uploaded: Nov 20, 2023</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-file"></i> 1.2 MB</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-download"></i> Download
                                        </button>
                                        <button className="btn btn-danger btn-sm">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '20px' }}>
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-magic"></i> Resume Builder</h3>
                            </div>
                            <p style={{ marginBottom: '20px', color: '#666' }}>Create a professional resume using our easy-to-use template builder.</p>
                            <button className="btn btn-primary">
                                <i className="fas fa-plus"></i> Create New Resume
                            </button>
                        </div>
                    </div>

                    {/* Career Resources Section */}
                    <div className={`page-section ${activeSection === 'resources' ? 'active' : ''}`} id="resources">
                        <h1 style={{ marginBottom: '25px' }}>Career Resources</h1>
                        <div className="stats-grid">
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-book"></i> Interview Tips</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Master your interview skills with expert advice and common questions.</p>
                                <button className="btn btn-secondary btn-sm">Learn More</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-file-alt"></i> Resume Builder</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Create a professional resume in minutes with our templates.</p>
                                <button className="btn btn-secondary btn-sm" onClick={() => showSection('resume')}>Start Building</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-graduation-cap"></i> Online Courses</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Upskill with courses and certifications from top providers.</p>
                                <button className="btn btn-secondary btn-sm">Browse Courses</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-users"></i> Career Advice</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Get personalized guidance from career experts and mentors.</p>
                                <button className="btn btn-secondary btn-sm">Get Advice</button>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '20px' }}>
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-newspaper"></i> Career Blog & Articles</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>10 Tips for Negotiating Your Salary</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Learn how to effectively negotiate your salary and benefits package with confidence.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 5 min read</span>
                                </div>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>How to Build a Strong LinkedIn Profile</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Optimize your LinkedIn presence to attract recruiters and job opportunities.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 7 min read</span>
                                </div>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Remote Work: Best Practices for Success</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Discover strategies for staying productive and connected while working remotely.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 6 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className={`page-section ${activeSection === 'settings' ? 'active' : ''}`} id="settings">
                        <h1 style={{ marginBottom: '25px' }}>Settings</h1>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-bell"></i> Notification Preferences</h3>
                            </div>
                            <div className="settings-section">
                                <div className="settings-item">
                                    <div>
                                        <h4>Email Notifications</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive job alerts and updates via email</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Application Updates</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get notified about application status changes</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Interview Reminders</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive reminders for scheduled interviews</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Job Recommendations</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get personalized job recommendations</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Weekly Digest</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive weekly summary of activities</p>
                                    </div>
                                    <div className="toggle-switch" onClick={toggleSwitch}></div>
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
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Make your profile visible to employers</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Show Online Status</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Display when you're active on the platform</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Allow Contact from Recruiters</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Let recruiters send you messages</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-user-shield"></i> Account Security</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>Change Password</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Last changed 3 months ago</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Change</button>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Add an extra layer of security</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Enable</button>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>Connected Devices</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Manage devices with access to your account</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Manage</button>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                            </div>
                            <div style={{ padding: '20px', background: '#fff5f5', border: '2px solid #fee', borderRadius: '8px' }}>
                                <h4 style={{ color: '#d32f2f', marginBottom: '10px' }}>Delete Account</h4>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Once you delete your account, there is no going back. Please be certain.</p>
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

