import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';
import { buildApiUrl } from '../config/api';
import '@fortawesome/fontawesome-free/css/all.css';
import QuickActions from '../components/QuickActions';
import CandidatePage from '../components/CandidatePage';
import '../styles/CandidatePage.css';
import '../styles/RecruiterDashboard.css';
import RecruiterCandidateTracker from '../components/RecruiterCandidateTracker';
import InterviewCalendar from '../components/InterviewCalendar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import RecruiterSettings from '../components/RecruiterSettings';

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
  
  // Job view/edit modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editJobData, setEditJobData] = useState({});
  
  // Candidate page states
  const [showCandidatePage, setShowCandidatePage] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  // Settings update handler
  const handleUserUpdate = (updatedUser) => {
    // This would typically update the user context
    console.log('User updated:', updatedUser);
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => {
      fetchApplications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleViewCandidate = (candidateId, jobId) => {
    setSelectedCandidateId(candidateId);
    setSelectedJobId(jobId);
    setShowCandidatePage(true);
  };

  const handleCloseCandidatePage = () => {
    setShowCandidatePage(false);
    setSelectedCandidateId(null);
    setSelectedJobId(null);
  };

  const handleCandidateStatusChange = (candidateId, newStatus) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.userId === candidateId || app.applicant_id === candidateId
          ? { ...app, status: newStatus }
          : app
      )
    );
    fetchApplications();
  };

  useEffect(() => {
    if (jobs.length > 0 || applications.length > 0 || internships.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchStats();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [jobs, applications, internships]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchJobs(),
        fetchInternships(),
        fetchCandidates(),
        fetchApplications()
      ]);
      fetchStats();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/jobs/get_jobs_for_user'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const transformedJobs = (data || []).map(job => ({
          ...job,
          jobTitle: job.job_title || job.jobTitle,
          companyName: job.company_name || job.companyName,
          salary: job.salary_range || job.salary,
          salaryRange: job.salary_range || job.salaryRange,
          remoteOption: job.remote_option || job.remoteOption,
          jobType: job.job_type || job.jobType,
          experienceRequired: job.experience_required || job.experienceRequired,
          requiredSkills: job.required_skills || job.requiredSkills,
          educationRequired: job.education_required || job.educationRequired,
          applicationDeadline: job.application_deadline || job.applicationDeadline,
          companyWebsite: job.company_website || job.companyWebsite
        }));
        setJobs(transformedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/recruiters/internships'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const transformedInternships = (data || []).map(job => ({
          ...job,
          jobTitle: job.job_title || job.jobTitle,
          companyName: job.company_name || job.companyName,
          salary: job.salary_range || job.salary,
          salaryRange: job.salary_range || job.salaryRange,
          remoteOption: job.remote_option || job.remoteOption,
          jobType: job.job_type || job.jobType,
          experienceRequired: job.experience_required || job.experienceRequired,
          requiredSkills: job.required_skills || job.requiredSkills,
          educationRequired: job.education_required || job.educationRequired,
          applicationDeadline: job.application_deadline || job.applicationDeadline,
          companyWebsite: job.company_website || job.companyWebsite
        }));
        setInternships(transformedInternships);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/recruiters/candidates'), {
        headers: { 'Authorization': `Bearer ${token}` }
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
      const response = await fetch(buildApiUrl('/api/recruiters/applications'), {
        headers: { 'Authorization': `Bearer ${token}` }
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
      const activeJobs = jobs.length;
      const totalApplications = applications.length;
      const inInterview = applications.filter(app => app.status === 'interview').length;
      const offersExtended = applications.filter(app => app.status === 'offered').length;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newJobsThisWeek = jobs.filter(job => {
        const jobDate = new Date(job.created_at || job.createdAt || job.postedDate);
        return jobDate >= oneWeekAgo;
      }).length;
      
      const totalJobApplications = jobs.reduce((total, job) => {
        return total + (job.applicants ? job.applicants.length : 0);
      }, 0);
      
      const calculatedStats = {
        activeJobs: activeJobs,
        totalApplications: Math.max(totalApplications, totalJobApplications),
        inInterview: inInterview,
        offersExtended: offersExtended,
        newJobsThisWeek: newJobsThisWeek,
        applicationsIncrease: 0,
        interviewsThisWeek: 0,
        offersAccepted: 0
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsEditing(false);
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditJobData({
      job_title: job.job_title || job.title || '',
      company_name: job.company_name || job.company || '',
      location: job.location || '',
      job_type: job.job_type || job.type || '',
      experience_required: job.experience_required || '',
      required_skills: job.required_skills || '',
      industry: job.industry || '',
      remote_option: job.remote_option || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      salary_range: job.salary_range || '',
      application_deadline: job.application_deadline || '',
      education_required: job.education_required || ''
    });
    setIsEditing(true);
    setShowJobModal(true);
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/jobs/update_job/${selectedJob._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editJobData)
      });

      if (response.ok) {
        await fetchJobs();
        setShowJobModal(false);
        setSelectedJob(null);
        setEditJobData({});
        alert('Job updated successfully!');
      } else {
        alert('Failed to update job. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
    setIsEditing(false);
    setEditJobData({});
  };

  const handleViewInternship = (internship) => {
    setSelectedJob(internship);
    setIsEditing(false);
    setShowJobModal(true);
  };

  const handleEditInternship = (internship) => {
    setSelectedJob(internship);
    setEditJobData({
      title: internship.jobTitle || internship.job_title || internship.title || '',
      company: internship.companyName || internship.company_name || internship.company || '',
      location: internship.location || '',
      type: internship.remoteOption || internship.remote_option || internship.type || '',
      duration: internship.jobType || internship.job_type || internship.duration || '',
      stipend: internship.salary || internship.salaryRange || internship.salary_range || internship.stipend || '',
      domain: internship.industry || internship.domain || '',
      requiredSkills: Array.isArray(internship.requiredSkills || internship.required_skills) ? (internship.requiredSkills || internship.required_skills).join(', ') : (internship.requiredSkills || internship.required_skills || ''),
      description: internship.description || '',
      responsibilities: internship.responsibilities || '',
      requirements: internship.requirements || '',
      benefits: internship.benefits || '',
      applicationDeadline: internship.applicationDeadline || '',
      status: internship.status || 'active'
    });
    setIsEditing(true);
    setShowJobModal(true);
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

  if (showCandidatePage) {
    return (
      <CandidatePage
        jobId={selectedJobId}
        candidateId={selectedCandidateId}
        onClose={handleCloseCandidatePage}
        onStatusChange={handleCandidateStatusChange}
      />
    );
  }

  return (
    <div className="dashboard-container recruiter-dashboard">
      {/* Sidebar */}
      <div className="sidebar" id="sidebar" style={{
        background: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
        backgroundColor: '#ff6b35',
        backgroundImage: 'linear-gradient(180deg, #ff6b35 0%, #10b981 50%, #14b8a6 100%)',
        color: '#ffffff',
        position: 'fixed',
        left: '0',
        top: '0',
        width: '320px',
        height: '100vh',
        zIndex: 1000
      }}>
        <div className="sidebar-header">
          <h2>
            <i className="fas fa-briefcase"></i> RECRUITER HUB
          </h2>
          <p>
            {user?.companyName || 'Acme Corporation'}
          </p>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} 
               onClick={() => setActiveSection('dashboard')}>
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`} 
               onClick={() => setActiveSection('jobs')}>
            <i className="fas fa-briefcase"></i>
            <span>Job Postings</span>
            {jobs.length > 0 && <span className="badge">{jobs.length}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'internships' ? 'active' : ''}`} onClick={() => setActiveSection('internships')}>
            <i className="fas fa-user-graduate"></i>
            <span>Internships</span>
            {internships.length > 0 && <span className="badge">{internships.length}</span>}
          </div>
          <div className={`nav-item ${activeSection === 'candidate-tracker' ? 'active' : ''}`} onClick={() => setActiveSection('candidate-tracker')}>
            <i className="fas fa-chart-line"></i>
            <span>Candidate Tracker</span>
            {applications.length > 0 && <span className="badge">{applications.length}</span>}
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
        <div className="dashboard-header">
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
            <div className="user-info">
              <div className="user-avatar">
                {user?.firstName ? user.firstName.charAt(0) : 'U'}
                {user?.lastName ? user.lastName.charAt(0) : ''}
              </div>
              <div>
                <div className="user-name">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
                </div>
                <div className="user-role">
                  {user?.role || 'Recruiter'}
                </div>
              </div>
            </div>
            <button className="btn-logout" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="page-section active" id="dashboard">
              {/* Welcome Section */}
              <div className="welcome-section">
                <div className="welcome-content">
                  <h1>
                    Welcome back, {user?.firstName || 'Recruiter'}! 
                    <span className="waving-hand">👋</span>
                  </h1>
                  <p>Here's what's happening with your recruitment activities today.</p>
                </div>
                <div className="welcome-actions">
                  <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                    <i className="fas fa-plus"></i> Post New Job
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveSection('candidate-tracker')}>
                    <i className="fas fa-chart-line"></i> View Applications
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
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

              <div className="dashboard-content">
                <div className="main-content-section">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Recent Applications</h3>
                      <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection('candidate-tracker')}>View All</button>
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
                          {applications.length > 0 ? (
                            applications.slice(0, 5).map((application, index) => (
                              <tr key={application._id || index}>
                                <td>
                                  <div className="candidate-info">
                                    <div className="candidate-avatar">
                                      {(application.candidate_name || application.applicant_name) ? 
                                        (application.candidate_name || application.applicant_name).charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div className="candidate-details">
                                      <div className="candidate-name">
                                        {application.candidate_name || application.applicant_name || 'Unknown Candidate'}
                                      </div>
                                      <div className="candidate-position">
                                        {application.company_name || 'Company not specified'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="position-cell">{application.job_title || 'N/A'}</td>
                                <td className="date-cell">
                                  {application.applied_at ? 
                                    new Date(application.applied_at).toLocaleDateString() : 
                                    (application.created_at ? 
                                      new Date(application.created_at).toLocaleDateString() : 'N/A')}
                                </td>
                                <td>
                                  <span className={`status-badge status-${application.status || 'pending'}`}>
                                    {application.status_display || application.status || 'Pending'}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleViewCandidate(
                                      application.applicant_id || application.userId, 
                                      application.job_id
                                    )}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="empty-state">
                                <div className="empty-content">
                                  <i className="fas fa-users"></i>
                                  <p>No applications yet</p>
                                  <small>Applications will appear here when candidates apply to your jobs</small>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              
                <div className="sidebar-content-section">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="quick-actions">
                      <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                        <i className="fas fa-plus"></i> Post New Job
                      </button>
                      <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
                        <i className="fas fa-plus"></i> Post Internship
                      </button>
                      <button className="btn btn-secondary" onClick={() => setActiveSection('candidate-tracker')}>
                        <i className="fas fa-chart-line"></i> Candidate Tracker
                      </button>
                      <button className="btn btn-secondary" onClick={() => setActiveSection('calendar')}>
                        <i className="fas fa-calendar"></i> Schedule Interview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Postings Section */}
          {activeSection === 'jobs' && (
            <div className="page-section active" id="jobs">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1>Job Postings</h1>
                <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                  <i className="fas fa-plus"></i> Post New Job
                </button>
              </div>

              <div className="tabs">
                <div className="tab active">All Jobs ({jobs.length})</div>
                <div className="tab">Active ({jobs.length})</div>
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
                          <th>Company</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Applications</th>
                          <th>Posted</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.length > 0 ? (
                          jobs.map((job, index) => (
                            <tr key={index}>
                              <td>
                                <div>
                                  <strong style={{ color: '#FF8A65', fontSize: '16px' }}>
                                    {job.job_title || job.title || 'Untitled Job'}
                                  </strong>
                                  {job.description && (
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                      {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: '500' }}>
                                  {job.company_name || job.company || job.companyName || 'Company Name'}
                                </div>
                              </td>
                              <td>{job.location || 'Location not specified'}</td>
                              <td>
                                <span style={{ 
                                  background: '#fff3e0', 
                                  color: '#FF8A65', 
                                  padding: '4px 8px', 
                                  borderRadius: '4px', 
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  {job.job_type || job.jobType || job.type || 'Full-time'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <i className="fas fa-users" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                  <div>
                                    <strong>{job.applicants ? job.applicants.length : 0}</strong>
                                    <div style={{ fontSize: '11px', color: '#666' }}>applications</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                              </td>
                              <td>
                                <span className={`status-badge status-active`} style={{
                                  background: '#e8f5e8',
                                  color: '#2e7d32',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  Active
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="btn-primary" 
                                    onClick={() => handleViewJob(job)}
                                    style={{ 
                                      background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                                      border: 'none',
                                      color: 'white',
                                      padding: '6px 12px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <i className="fas fa-eye"></i> View
                                  </button>
                                  <button 
                                    className="btn-secondary" 
                                    onClick={() => handleEditJob(job)}
                                    style={{ 
                                      background: 'transparent',
                                      border: '2px solid #FF8A65',
                                      color: '#FF8A65',
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <i className="fas fa-edit"></i> Edit
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                              <i className="fas fa-briefcase" style={{ fontSize: '48px', color: '#FF8A65', marginBottom: '16px' }}></i>
                              <h3>No jobs posted yet</h3>
                              <p>Start by posting your first job to see it here!</p>
                              <button className="btn btn-primary" onClick={() => navigate('/post-job')} style={{ marginTop: '16px' }}>
                                <i className="fas fa-plus"></i> Post Your First Job
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Internships Section */}
          {activeSection === 'internships' && (
            <div className="page-section active">
              <div className="section-header">
                <h1>Internships</h1>
                <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
                  <i className="fas fa-plus"></i> Post New Internship
                </button>
              </div>

              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Internship Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>Applications</th>
                        <th>Views</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.length > 0 ? (
                        internships.map((internship, index) => (
                          <tr key={index}>
                            <td>
                              <div>
                                <strong style={{ color: '#FF8A65', fontSize: '16px' }}>
                                  {internship.jobTitle || internship.job_title || internship.title || 'Untitled Internship'}
                                </strong>
                                {internship.description && (
                                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                    {internship.description.length > 100 ? `${internship.description.substring(0, 100)}...` : internship.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: '500' }}>
                                {internship.companyName || internship.company_name || internship.company || 'Company Name'}
                              </div>
                            </td>
                            <td>{internship.location || 'Location not specified'}</td>
                            <td>
                              <span style={{ 
                                background: '#fff3e0', 
                                color: '#FF8A65', 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {internship.jobType || internship.job_type || internship.duration || '3-6 months'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fas fa-users" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                <strong>{internship.applicants ? internship.applicants.length : 0}</strong>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fas fa-eye" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                <strong>{internship.views || 0}</strong>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-active`} style={{
                                background: '#e8f5e8',
                                color: '#2e7d32',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {internship.status || 'Active'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  className="btn-primary" 
                                  onClick={() => handleViewInternship(internship)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <i className="fas fa-eye"></i> View
                                </button>
                                <button 
                                  className="btn-secondary" 
                                  onClick={() => handleEditInternship(internship)}
                                  style={{ 
                                    background: 'transparent',
                                    border: '2px solid #FF8A65',
                                    color: '#FF8A65',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <i className="fas fa-edit"></i> Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <i className="fas fa-graduation-cap" style={{ fontSize: '48px', color: '#FF8A65', marginBottom: '16px' }}></i>
                            <h3>No internships posted yet</h3>
                            <p>Start by posting your first internship to see it here!</p>
                            <button className="btn btn-primary" onClick={() => navigate('/post-internship')} style={{ marginTop: '16px' }}>
                              <i className="fas fa-plus"></i> Post Your First Internship
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Candidate Tracker Section */}
          {activeSection === 'candidate-tracker' && (
            <div className="page-section active" id="candidate-tracker">
              <RecruiterCandidateTracker onViewCandidate={handleViewCandidate} />
            </div>
          )}

          {/* Other sections */}
          {activeSection === 'messages' && (
            <div className="page-section active">
              <h1 style={{ marginBottom: '25px' }}>Messages</h1>
              <div className="card">
                <div className="empty-state">
                  <i className="fas fa-envelope"></i>
                  <h3>Messages</h3>
                  <p>This section is coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'calendar' && (
            <div className="page-section active">
              <InterviewCalendar />
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="page-section active">
              <AnalyticsDashboard />
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="page-section active">
              <RecruiterSettings user={user} onUpdateUser={handleUserUpdate} />
            </div>
          )}
        </div>
      </div>

      {/* Job View/Edit Modal */}
      {showJobModal && selectedJob && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#FF8A65', margin: 0 }}>
                {isEditing ? 'Edit Job' : 'Job Details'}
              </h2>
              <button 
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            {isEditing ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Title</label>
                    <input
                      type="text"
                      value={editJobData.job_title || ''}
                      onChange={(e) => setEditJobData({...editJobData, job_title: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Company</label>
                    <input
                      type="text"
                      value={editJobData.company_name || ''}
                      onChange={(e) => setEditJobData({...editJobData, company_name: e.target.value})}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid #ddd',
                      background: 'white',
                      color: '#666',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveJob}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Job Information</h3>
                    <p><strong>Title:</strong> {selectedJob.job_title || selectedJob.title || 'N/A'}</p>
                    <p><strong>Company:</strong> {selectedJob.company_name || selectedJob.company || 'N/A'}</p>
                    <p><strong>Location:</strong> {selectedJob.location || 'N/A'}</p>
                    <p><strong>Type:</strong> {selectedJob.job_type || selectedJob.type || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Job Stats</h3>
                    <p><strong>Applications:</strong> {selectedJob.applicants ? selectedJob.applicants.length : 0}</p>
                    <p><strong>Views:</strong> {selectedJob.views || 0}</p>
                    <p><strong>Created:</strong> {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid #ddd',
                      background: 'white',
                      color: '#666',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEditJob(selectedJob)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;