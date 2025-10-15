import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/InternDashboard.css';

const InternDashboard = () => {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [profileData, setProfileData] = useState({
        fullName: 'Emily Sarah Student',
        email: 'emily.student@example.com',
        phone: '+254 700 123 456',
        dob: '2002-03-15',
        location: 'Nairobi, Kenya',
        nationality: 'Kenyan',
        gender: 'Female',
        alternativePhone: '+254 722 987 654',
        summary: 'Passionate Computer Science student with strong foundation in programming and software development. Eager to gain practical experience in real-world projects and contribute to innovative solutions.',
        currentTitle: 'Computer Science Student',
        university: 'University of Nairobi',
        yearOfStudy: 'Third Year',
        gpa: '3.8',
        expectedGraduation: '2025',
        availability: 'Summer 2024',
        preferredDuration: '3 months'
    });

  useEffect(() => {
        // Fetch user data from backend
        fetchUserData();
        fetchInternships();
        fetchApplications();
        fetchInterviews();
  }, []);

    const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
                setProfileData(data);
      }
    } catch (error) {
            console.error('Error fetching user data:', error);
    }
  };

    const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
            const response = await fetch('/api/internships', {
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

    const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
            const response = await fetch('/api/my-applications', {
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

    const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
            const response = await fetch('/api/interviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
                const data = await response.json();
                setInterviews(data);
      }
    } catch (error) {
            console.error('Error fetching interviews:', error);
        }
    };

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    const toggleProfileEdit = () => {
        setIsEditingProfile(!isEditingProfile);
    };

    const saveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            if (response.ok) {
                setIsEditingProfile(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    const cancelProfileEdit = () => {
        setIsEditingProfile(false);
        fetchUserData(); // Reset to original data
    };

    const toggleSwitch = (element) => {
        element.classList.toggle('active');
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-graduation-cap"></i> InternHub</h2>
                    <p>Launch Your Career</p>
                </div>
                <div className="nav-menu">
                    <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => showSection('dashboard')}>
                        <i className="fas fa-home"></i>
                        <span>Dashboard</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'browse' ? 'active' : ''}`} onClick={() => showSection('browse')}>
                        <i className="fas fa-search"></i>
                        <span>Browse Internships</span>
                        <span className="new-tag">NEW</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`} onClick={() => showSection('applications')}>
                        <i className="fas fa-file-alt"></i>
                        <span>My Applications</span>
                        <span className="badge">8</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'saved' ? 'active' : ''}`} onClick={() => showSection('saved')}>
                        <i className="fas fa-bookmark"></i>
                        <span>Saved Internships</span>
                        <span className="badge">6</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'interviews' ? 'active' : ''}`} onClick={() => showSection('interviews')}>
                        <i className="fas fa-calendar-check"></i>
                        <span>Interviews</span>
                        <span className="badge">2</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'recommended' ? 'active' : ''}`} onClick={() => showSection('recommended')}>
                        <i className="fas fa-star"></i>
                        <span>Recommended</span>
                        <span className="badge">12</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => showSection('messages')}>
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                        <span className="badge">3</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => showSection('profile')}>
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'academic' ? 'active' : ''}`} onClick={() => showSection('academic')}>
                        <i className="fas fa-graduation-cap"></i>
                        <span>Academic Info</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'portfolio' ? 'active' : ''}`} onClick={() => showSection('portfolio')}>
                        <i className="fas fa-briefcase"></i>
                        <span>Portfolio</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'learning' ? 'active' : ''}`} onClick={() => showSection('learning')}>
                        <i className="fas fa-book-open"></i>
                        <span>Learning Resources</span>
                    </div>
                    <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => showSection('settings')}>
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
              </div>
          </div>
                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>
                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Need Help?</p>
                    <p style={{ fontSize: '10px' }}>Version 1.0 • © 2024 InternHub</p>
        </div>
          </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
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
                        <div className="user-profile">
                            <div className="user-avatar">ES</div>
                            <div className="user-info">
                                <div className="user-name">Emily Student</div>
                                <div className="user-role">Computer Science</div>
            </div>
            </div>
          </div>
        </div>

                {/* Content Area */}
                <div className="content-area">
                    {/* Dashboard Section */}
                    <div className={`page-section ${activeSection === 'dashboard' ? 'active' : ''}`} id="dashboard">
                        <h1 style={{ marginBottom: '25px', fontSize: '28px' }}>Welcome back, Emily! <span style={{ fontSize: '24px' }}>🎓</span></h1>
                        
                        {/* Profile Completion Card */}
                        <div className="profile-completion-card">
                            <div className="profile-completion-title">Complete Your Profile</div>
                            <div className="profile-completion-subtitle">65% Complete - Stand out to recruiters!</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '65%' }} data-percentage="65%"></div>
                            </div>
                            <div className="profile-actions">
                                <button className="btn btn-secondary">
                                    <i className="fas fa-user"></i> Complete Profile
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fas fa-upload"></i> Upload Resume
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fas fa-graduation-cap"></i> Add Coursework
          </button>
        </div>
              </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">8</div>
                                        <div className="stat-label">Applications Sent</div>
                                    </div>
                                    <div className="stat-icon blue">
                                        <i className="fas fa-paper-plane"></i>
                                    </div>
                  </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> ↑ 2 this week
                  </div>
                </div>

                <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">2</div>
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
                                        <div className="stat-number">89</div>
                                        <div className="stat-label">Profile Views</div>
                                    </div>
                                    <div className="stat-icon purple">
                                        <i className="fas fa-eye"></i>
                                    </div>
                  </div>
                                <div className="stat-change positive">
                                    <i className="fas fa-arrow-up"></i> ↑ +25% this month
                  </div>
                </div>

                <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-number">6</div>
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

                        {/* Notification Banners */}
                        <div className="notification-banner success">
                            <div className="notification-icon success">
                                <i className="fas fa-check"></i>
                            </div>
                            <div>
                                <strong>Congratulations!</strong> You've been shortlisted for the Software Development Internship at TechStart Inc.
            </div>
          </div>

                        <div className="notification-banner warning">
                            <div className="notification-icon warning">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                  <div>
                                <strong>Application Deadline:</strong> Marketing Internship at Brand Agency closes in 2 days!
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '30px' }}>
                            {/* Recommended Internships */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recommended for You</h3>
                                    <button className="btn btn-secondary btn-sm">View All</button>
                                </div>
                                <div id="recommendedInternships">
                                    {/* Internships will be populated here */}
                  </div>
                </div>

                            {/* Upcoming Interviews */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Upcoming Interviews</h3>
                  </div>
                                <div id="upcomingInterviews">
                                    {/* Interviews will be populated here */}
                  </div>
                  </div>
                </div>
              </div>

                    {/* Browse Internships Section */}
                    <div className={`page-section ${activeSection === 'browse' ? 'active' : ''}`} id="browse">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>Browse Internships</h1>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select className="form-select" style={{ width: '150px' }}>
                                    <option>All Fields</option>
                                    <option>Technology</option>
                                    <option>Marketing</option>
                                    <option>Finance</option>
                                    <option>Design</option>
                                </select>
                                <select className="form-select" style={{ width: '120px' }}>
                                    <option>All Types</option>
                                    <option>Remote</option>
                                    <option>On-site</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
          </div>

                        <div className="card">
                            <div id="internshipsList">
                                {/* Internships will be populated here */}
                            </div>
                        </div>
          </div>

                    {/* My Applications Section */}
                    <div className={`page-section ${activeSection === 'applications' ? 'active' : ''}`} id="applications">
                        <h1 style={{ marginBottom: '25px' }}>My Applications</h1>

              <div className="tabs">
                            <div className="tab active">All Applications (8)</div>
                            <div className="tab">Pending (4)</div>
                            <div className="tab">Shortlisted (2)</div>
                            <div className="tab">Interview (1)</div>
                            <div className="tab">Rejected (1)</div>
                        </div>

                        <div className="card">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Internship</th>
                                            <th>Company</th>
                                            <th>Applied Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="allApplications">
                                        {/* Applications will be populated here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Saved Internships Section */}
                    <div className={`page-section ${activeSection === 'saved' ? 'active' : ''}`} id="saved">
                        <h1 style={{ marginBottom: '25px' }}>Saved Internships</h1>
                        
                        <div className="card">
                            <div id="savedInternshipsList">
                                {/* Saved internships will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Interviews Section */}
                    <div className={`page-section ${activeSection === 'interviews' ? 'active' : ''}`} id="interviews">
                        <h1 style={{ marginBottom: '25px' }}>Interview Schedule</h1>
                        
                        <div className="card">
                            <div id="interviewsList">
                                {/* Interviews will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Recommended Section */}
                    <div className={`page-section ${activeSection === 'recommended' ? 'active' : ''}`} id="recommended">
                        <h1 style={{ marginBottom: '25px' }}>Recommended Internships</h1>
                        
                        <div className="card">
                            <div id="matchedInternshipsList">
                                {/* Matched internships will be populated here */}
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className={`page-section ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
                        <h1 style={{ marginBottom: '25px' }}>Messages</h1>
                        
                        <div className="messages-container">
                            <div className="message-list">
                                <div className="message-list-header">
                                    <h3>Conversations</h3>
                                    <button className="btn btn-primary btn-sm">
                                        <i className="fas fa-plus"></i> New Message
                                    </button>
                                </div>
                                <div className="message-item unread">
                                    <div className="message-avatar">TS</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">TechStart Inc.</span>
                                            <span className="message-time">2 hours ago</span>
                                        </div>
                                        <div className="message-preview">Great news! You've been shortlisted for our Software Development Internship. We'd like to schedule an interview...</div>
                                    </div>
                                </div>
                                <div className="message-item">
                                    <div className="message-avatar">BA</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">Brand Agency</span>
                                            <span className="message-time">1 day ago</span>
                                        </div>
                                        <div className="message-preview">Thank you for your interest in our Marketing Internship. We're reviewing applications and will get back to you soon...</div>
                                    </div>
                                </div>
                                <div className="message-item">
                                    <div className="message-avatar">DS</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">Design Studio</span>
                                            <span className="message-time">3 days ago</span>
                                        </div>
                                        <div className="message-preview">We received your application for UI/UX Design Intern. Our team is currently reviewing applications...</div>
                                    </div>
                                </div>
                            </div>
                            <div className="message-detail">
                                <i className="fas fa-envelope"></i>
                                <h3>Select a conversation</h3>
                                <p>Choose a conversation from the list to view messages</p>
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
                                <div className="profile-avatar-large">ES</div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>Emily Student</h2>
                                    <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>Computer Science Student • University of Nairobi</p>
                                    <button className="btn btn-secondary" style={{ marginTop: '10px' }}>
                                        <i className="fas fa-edit"></i> Edit Profile
                </button>
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
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" className="form-input" id="dob" value={profileData.dob} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-input" id="phone" value={profileData.phone} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <input type="text" className="form-input" id="gender" value={profileData.gender} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Alternative Phone</label>
                                    <input type="tel" className="form-input" id="alternativePhone" value={profileData.alternativePhone} disabled={!isEditingProfile} />
                                </div>
                            </div>
                        </div>

                        {/* Nationality & Residency */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-globe"></i> Nationality & Residency</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div className="form-group">
                                    <label className="form-label">Nationality</label>
                                    <input type="text" className="form-input" value={profileData.nationality} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Resident Country</label>
                                    <input type="text" className="form-input" value="Kenya" disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Current City</label>
                                    <input type="text" className="form-input" value={profileData.location} disabled={!isEditingProfile} />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-graduation-cap"></i> Academic Information</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div className="form-group">
                                    <label className="form-label">Current Title</label>
                                    <input type="text" className="form-input" value={profileData.currentTitle} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">University</label>
                                    <input type="text" className="form-input" value={profileData.university} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year of Study</label>
                                    <input type="text" className="form-input" value={profileData.yearOfStudy} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GPA</label>
                                    <input type="text" className="form-input" value={profileData.gpa} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expected Graduation</label>
                                    <input type="text" className="form-input" value={profileData.expectedGraduation} disabled={!isEditingProfile} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Availability</label>
                                    <input type="text" className="form-input" value={profileData.availability} disabled={!isEditingProfile} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Academic Summary</label>
                                <textarea className="form-textarea" disabled={!isEditingProfile}>{profileData.summary}</textarea>
                            </div>
                        </div>

                        {/* Skills & Interests */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-code"></i> Skills & Interests</h3>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '15px', color: '#666' }}>Technical Skills</h4>
                                <div>
                                    <span className="skill-tag">Python</span>
                                    <span className="skill-tag">Java</span>
                                    <span className="skill-tag">JavaScript</span>
                                    <span className="skill-tag">React</span>
                                    <span className="skill-tag">HTML/CSS</span>
                                    <span className="skill-tag">SQL</span>
                                    <span className="skill-tag">Git</span>
                                    <span className="skill-tag">Data Structures</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '25px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#666' }}>Areas of Interest</h4>
                                <div>
                                    <span className="skill-tag">Software Development</span>
                                    <span className="skill-tag">Web Development</span>
                                    <span className="skill-tag">Mobile Apps</span>
                                    <span className="skill-tag">Data Science</span>
                                    <span className="skill-tag">Machine Learning</span>
                                    <span className="skill-tag">UI/UX Design</span>
                                </div>
                            </div>
                        </div>

                        {/* Projects */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-project-diagram"></i> Academic Projects</h3>
                            </div>
                            <div className="experience-item">
                                <h4>E-Learning Platform</h4>
                                <div className="company">University Project</div>
                                <div className="duration">Fall 2023</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Developed a full-stack web application using React and Node.js for online course management. Features include user authentication, course enrollment, and progress tracking.</p>
                            </div>
                            <div className="experience-item">
                                <h4>Mobile Task Manager</h4>
                                <div className="company">Personal Project</div>
                                <div className="duration">Summer 2023</div>
                                <p style={{ color: '#666', marginTop: '10px' }}>Created a cross-platform mobile app using React Native with local data storage and intuitive user interface for task management.</p>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-certificate"></i> Certifications & Courses</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Python for Data Science</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Coursera - 2023</p>
                                        </div>
                                        <span className="status-badge status-offered">Completed</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Web Development Bootcamp</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Udemy - 2023</p>
                                        </div>
                                        <span className="status-badge status-offered">Completed</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Machine Learning Fundamentals</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Stanford Online - In Progress</p>
                                        </div>
                                        <span className="status-badge status-reviewing">In Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info Section */}
                    <div className={`page-section ${activeSection === 'academic' ? 'active' : ''}`} id="academic">
                        <h1 style={{ marginBottom: '25px' }}>Academic Information</h1>
                        
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-graduation-cap"></i> Current Studies</h3>
                            </div>
                            <div className="profile-info-grid">
                                <div className="form-group">
                                    <label className="form-label">Degree Program</label>
                                    <input type="text" className="form-input" value="Bachelor of Science in Computer Science" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">University</label>
                                    <input type="text" className="form-input" value="University of Nairobi" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year of Study</label>
                                    <input type="text" className="form-input" value="Third Year" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Current GPA</label>
                                    <input type="text" className="form-input" value="3.8/4.0" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expected Graduation</label>
                                    <input type="text" className="form-input" value="May 2025" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Major Focus</label>
                                    <input type="text" className="form-input" value="Software Engineering" disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-book"></i> Current Coursework</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Advanced Data Structures</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>CS 301 - Spring 2024</p>
                                        </div>
                                        <span className="status-badge status-reviewing">In Progress</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Software Engineering</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>CS 302 - Spring 2024</p>
                                        </div>
                                        <span className="status-badge status-reviewing">In Progress</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>Database Systems</h4>
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>CS 303 - Spring 2024</p>
                                        </div>
                                        <span className="status-badge status-reviewing">In Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Section */}
                    <div className={`page-section ${activeSection === 'portfolio' ? 'active' : ''}`} id="portfolio">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h1>Portfolio</h1>
                            <button className="btn btn-primary">
                                <i className="fas fa-plus"></i> Add Project
                </button>
              </div>

                        <div className="card">
                            <div className="resume-list">
                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-code"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>E-Learning Platform</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Completed: Dec 2023</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-code"></i> React, Node.js</span>
                                            <span style={{ marginLeft: '15px' }} className="status-badge status-offered">Live Demo</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-external-link-alt"></i> Demo
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fab fa-github"></i> Code
                                        </button>
                                    </div>
                                </div>

                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>Task Manager Mobile App</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Completed: Aug 2023</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-code"></i> React Native</span>
                                            <span style={{ marginLeft: '15px' }} className="status-badge status-offered">Published</span>
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
                                            <i className="fab fa-github"></i> Code
                </button>
              </div>
            </div>

                                <div className="resume-item">
                                    <div className="resume-icon">
                                        <i className="fas fa-chart-bar"></i>
                                    </div>
                                    <div className="resume-info">
                                        <h4>Data Visualization Dashboard</h4>
                                        <div className="resume-meta">
                                            <span><i className="fas fa-calendar"></i> Completed: Nov 2023</span>
                                            <span style={{ marginLeft: '15px' }}><i className="fas fa-code"></i> Python, D3.js</span>
                                            <span style={{ marginLeft: '15px' }} className="status-badge status-reviewing">In Progress</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-eye"></i> View
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fas fa-external-link-alt"></i> Demo
                                        </button>
                                        <button className="btn btn-secondary btn-sm">
                                            <i className="fab fa-github"></i> Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Learning Resources Section */}
                    <div className={`page-section ${activeSection === 'learning' ? 'active' : ''}`} id="learning">
                        <h1 style={{ marginBottom: '25px' }}>Learning Resources</h1>
                        <div className="stats-grid">
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-book"></i> Online Courses</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Access curated courses to enhance your skills and knowledge.</p>
                                <button className="btn btn-secondary btn-sm">Browse Courses</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-video"></i> Video Tutorials</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Step-by-step video guides for various programming languages and tools.</p>
                                <button className="btn btn-secondary btn-sm">Watch Tutorials</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-file-alt"></i> Documentation</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Comprehensive guides and documentation for popular technologies.</p>
                                <button className="btn btn-secondary btn-sm">Read Docs</button>
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '15px' }}><i className="fas fa-users"></i> Study Groups</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>Join study groups and collaborate with other students.</p>
                                <button className="btn btn-secondary btn-sm">Join Groups</button>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '20px' }}>
                            <div className="card-header">
                                <h3 className="card-title"><i className="fas fa-newspaper"></i> Learning Blog & Articles</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Getting Started with React: A Beginner's Guide</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Learn the fundamentals of React development with practical examples and exercises.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 8 min read</span>
                                </div>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Python for Data Science: Essential Libraries</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Explore NumPy, Pandas, and Matplotlib for effective data analysis and visualization.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 12 min read</span>
                                </div>
                                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Building Your First Mobile App with React Native</h4>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Step-by-step tutorial for creating cross-platform mobile applications.</p>
                                    <span style={{ color: '#667eea', fontSize: '13px' }}><i className="fas fa-clock"></i> 15 min read</span>
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
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive internship alerts and updates via email</p>
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
                                        <h4>Learning Recommendations</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Get personalized course and resource recommendations</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Weekly Digest</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Receive weekly summary of activities and opportunities</p>
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
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Make your profile visible to recruiters and employers</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Show Academic Status</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Display your current academic information</p>
                                    </div>
                                    <div className="toggle-switch active" onClick={toggleSwitch}></div>
                                </div>
                                <div className="settings-item">
                                    <div>
                                        <h4>Allow Contact from Recruiters</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Let recruiters send you messages and opportunities</p>
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
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Last changed 2 months ago</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Change</button>
                                </div>
                                <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Add an extra layer of security to your account</p>
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

export default InternDashboard;
