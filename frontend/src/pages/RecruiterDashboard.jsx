import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';
import { buildApiUrl } from '../config/api';
import '../styles/dashboard-unified.css';
// import '../styles/RecruiterDashboard.css'; // Replaced by unified CSS
import '@fortawesome/fontawesome-free/css/all.css';
import QuickActions from '../components/QuickActions';
import CandidatePage from '../components/CandidatePage';
import '../styles/CandidatePage.css';

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

    useEffect(() => {
        console.log('🎯 Component mounted, calling fetchAllData...');
        fetchAllData();
        
        // Set up real-time updates every 30 seconds
        const interval = setInterval(() => {
            console.log('🔄 Real-time update: fetching applications...');
            fetchApplications();
        }, 30000); // 30 seconds
        
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
        // Update the application status in the applications list
        setApplications(prevApplications => 
            prevApplications.map(app => 
                app.userId === candidateId || app.applicant_id === candidateId
                    ? { ...app, status: newStatus }
                    : app
            )
        );
        
        // Refresh applications to get updated data
        fetchApplications();
    };

    // Recalculate stats when jobs, applications, or internships data changes (with debouncing)
    useEffect(() => {
        if (jobs.length > 0 || applications.length > 0 || internships.length > 0) {
            const timeoutId = setTimeout(() => {
                fetchStats();
            }, 500); // Debounce to prevent excessive calls
            
            return () => clearTimeout(timeoutId);
        }
    }, [jobs, applications, internships]);

    // Debug useEffect to monitor internships state
    useEffect(() => {
        console.log('🔍 Internships state changed:', internships.length, 'items');
        if (internships.length > 0) {
            console.log('📋 First internship:', internships[0].title);
        }
    }, [internships]);

    const fetchAllData = async () => {
        setLoading(true);
        console.log('🚀 Starting fetchAllData...');
        try {
            console.log('📞 Calling all fetch functions...');
            const results = await Promise.all([
                fetchJobs(),
                fetchInternships(),
                fetchCandidates(),
                fetchApplications()
            ]);
            console.log('✅ All fetch functions completed:', results);
            // Calculate stats after data is fetched
            fetchStats();
        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setLoading(false);
            console.log('🏁 fetchAllData completed, loading set to false');
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(buildApiUrl('/api/jobs/get_jobs_for_user'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                    console.log('Fetched jobs:', data); // Debug log
                    
                    // Transform jobs data from snake_case to camelCase for frontend compatibility
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
                } else {
                    console.error('Error fetching jobs: Response is not JSON');
                    const text = await response.text();
                    console.error('Response text:', text.substring(0, 200));
                }
            } else {
                console.error('Failed to fetch jobs:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText.substring(0, 200));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchInternships = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Fetching internships with token:', token ? 'Present' : 'Missing');
            const apiUrl = buildApiUrl('/api/recruiters/internships');
            console.log('🌐 API URL:', apiUrl);
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('🔍 Internships response status:', response.status);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                    console.log('✅ Fetched internships:', data.length, 'items');
                    console.log('📋 First internship:', data[0] ? data[0].title : 'None');
                    
                    // Transform internships data from snake_case to camelCase for frontend compatibility
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
                    console.log('✅ Internships state updated with:', transformedInternships.length, 'items');
                } else {
                    console.error('Error fetching internships: Response is not JSON');
                    const text = await response.text();
                    console.error('Response text:', text.substring(0, 200));
                }
            } else {
                console.error('Failed to fetch internships:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText.substring(0, 200));
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(buildApiUrl('/api/recruiters/candidates'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setCandidates(data);
                    console.log('Fetched candidates:', data);
                } else {
                    console.error('Error fetching candidates: Response is not JSON');
                    const text = await response.text();
                    console.error('Response text:', text.substring(0, 200));
                }
            } else {
                console.error('Failed to fetch candidates:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText.substring(0, 200));
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(buildApiUrl('/api/recruiters/applications'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setApplications(data);
                    console.log('Fetched applications:', data);
                } else {
                    console.error('Error fetching applications: Response is not JSON');
                    const text = await response.text();
                    console.error('Response text:', text.substring(0, 200));
                }
            } else {
                console.error('Failed to fetch applications:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText.substring(0, 200));
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchStats = async () => {
        try {
            // Calculate stats locally from fetched data - using correct database field names
            const activeJobs = jobs.length; // All jobs in database are active
            const totalApplications = applications.length;
            const inInterview = applications.filter(app => app.status === 'interview').length;
            const offersExtended = applications.filter(app => app.status === 'offered').length;
            
            console.log('📊 Stats calculation - Jobs:', jobs.length, 'Internships:', internships.length, 'Applications:', applications.length);
            
            // Calculate new jobs this week using correct field names
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newJobsThisWeek = jobs.filter(job => {
                const jobDate = new Date(job.created_at || job.createdAt || job.postedDate);
                return jobDate >= oneWeekAgo;
            }).length;
            
            // Calculate total applications from job applicants
            const totalJobApplications = jobs.reduce((total, job) => {
                return total + (job.applicants ? job.applicants.length : 0);
            }, 0);
            
            const calculatedStats = {
                activeJobs: activeJobs,
                totalApplications: Math.max(totalApplications, totalJobApplications),
                inInterview: inInterview,
                offersExtended: offersExtended,
                newJobsThisWeek: newJobsThisWeek,
                applicationsIncrease: 0, // Can be calculated if needed
                interviewsThisWeek: 0, // Can be calculated if needed
                offersAccepted: 0 // Can be calculated if needed
            };
            
            console.log('Calculated stats:', calculatedStats); // Debug log
            setStats(calculatedStats);
        } catch (error) {
            console.error('Error calculating stats:', error);
        }
    };

    // Job view/edit functions
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
                // Refresh jobs data
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

    // Internship view/edit functions
    const handleViewInternship = (internship) => {
        setSelectedJob(internship); // Reuse the same modal state
        setIsEditing(false);
        setShowJobModal(true);
    };

    const handleEditInternship = (internship) => {
        setSelectedJob(internship); // Reuse the same modal state
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

    // Show candidate page if selected
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
                        <i className="fas fa-briefcase"></i> JOBSEEKER HUB
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
                            <div className="user-avatar" style={{
                                background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                                backgroundColor: '#FF8A65',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600'
                            }}>
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

                        {/* Quick Actions */}
                        <QuickActions
                            theme="recruiter"
                            onBrowseJobs={() => setActiveSection('jobs')}
                            onUpdateResume={() => setActiveSection('candidates')}
                            onEditProfile={() => setActiveSection('profile')}
                            customActions={[
                                {
                                    id: 'post-job',
                                    text: 'POST JOB',
                                    icon: 'faPlus',
                                    emoji: '➕',
                                    onClick: () => setActiveSection('jobs'),
                                    description: 'Create a new job posting'
                                }
                            ]}
                        />

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
                                                            <button 
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => handleViewCandidate(
                                                                    application.userId || application.applicant_id, 
                                                                    application.job_id || application.jobId
                                                                )}
                                                            >
                                                                View Candidate
                                                            </button>
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
                            <div className="tab">Active ({jobs.length})</div>
                            <div className="tab">Drafts ({jobs.filter(job => job.status === 'draft').length})</div>
                            <div className="tab">Closed ({jobs.filter(job => job.status === 'closed').length})</div>
                        </div>

                        <div className="tab-content active">
                            {/* Table View Only */}
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
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                                        <div style={{ display: 'inline-block', background: '#f0f0f0', height: '20px', width: '100%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                    </td>
                                                </tr>
                                            ) : jobs.length > 0 ? (
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
                                                                {job.required_skills && (
                                                                    <div style={{ fontSize: '11px', color: '#FF8A65', marginTop: '4px', fontStyle: 'italic' }}>
                                                                        Skills: {job.required_skills}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: '500' }}>
                                                                {job.company_name || job.company || job.companyName || 'Company Name'}
                                                            </div>
                                                            {job.industry && (
                                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                                    {job.industry}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <i className="fas fa-map-marker-alt" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                                                <div>
                                                                    <div>{job.location || 'Location not specified'}</div>
                                                                    {job.remote_option && (
                                                                        <div style={{ fontSize: '11px', color: '#666' }}>
                                                                            {job.remote_option}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
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
                                                            {job.experience_required && (
                                                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                    {job.experience_required}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <i className="fas fa-users" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                                                <div>
                                                                    <strong>{job.applicants ? job.applicants.length : job.applicationCount || job.applications || 0}</strong>
                                                                    <div style={{ fontSize: '11px', color: '#666' }}>applications</div>
                                                                </div>
                                                            </div>
                                                            {job.views && (
                                                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                    {job.views} views
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 
                                                             job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 
                                                             job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
                                                            {job.application_deadline && (
                                                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                                                                </div>
                                                            )}
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

                    {/* Other sections */}
                    {/* Internships Section */}
                    <div className={`page-section ${activeSection === 'internships' ? 'active' : ''}`}>
                        <div className="section-header">
                            <h1>Internships</h1>
                            <button className="btn btn-primary" onClick={() => navigate('/post-internship')}>
                                <i className="fas fa-plus"></i> Post New Internship
                            </button>
                        </div>

                        <div className="stats-grid" style={{ marginBottom: '30px' }}>
                            <div className="stat-card">
                                <div className="stat-icon orange">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{internships.length}</h3>
                                    <p>Total Internships</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <i className="fas fa-eye"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{internships.reduce((total, internship) => total + (internship.views || 0), 0)}</h3>
                                    <p>Total Views</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{internships.reduce((total, internship) => total + (internship.applicants ? internship.applicants.length : 0), 0)}</h3>
                                    <p>Total Applications</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon purple">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{internships.filter(internship => {
                                        if (!internship.applicationDeadline) return false;
                                        const deadline = new Date(internship.applicationDeadline);
                                        const now = new Date();
                                        return deadline > now;
                                    }).length}</h3>
                                    <p>Active Deadlines</p>
                                </div>
                            </div>
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
                                        {console.log('🔍 Rendering internships table - loading:', loading, 'internships.length:', internships.length)}
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                                    <div style={{ display: 'inline-block', background: '#f0f0f0', height: '20px', width: '100%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                                                </td>
                                            </tr>
                                        ) : internships.length > 0 ? (
                                            internships.map((internship, index) => {
                                                console.log('🎯 Rendering internships:', internships.length, 'items');
                                                return (
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
                                                            {(internship.requiredSkills || internship.required_skills) && (
                                                                <div style={{ fontSize: '11px', color: '#FF8A65', marginTop: '4px', fontStyle: 'italic' }}>
                                                                    Skills: {Array.isArray(internship.requiredSkills || internship.required_skills) ? (internship.requiredSkills || internship.required_skills).join(', ') : (internship.requiredSkills || internship.required_skills)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: '500' }}>
                                                            {internship.companyName || internship.company_name || internship.company || 'Company Name'}
                                                        </div>
                                                        {(internship.industry || internship.domain) && (
                                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                                {internship.industry || internship.domain}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <i className="fas fa-map-marker-alt" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                                            <div>
                                                                <div>{internship.location || 'Location not specified'}</div>
                                                                {(internship.remoteOption || internship.remote_option || internship.type) && (
                                                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                                                        {internship.remoteOption || internship.remote_option || internship.type}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
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
                                                        </div>
                                                        {(internship.salary || internship.salaryRange || internship.salary_range || internship.stipend) && (
                                                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                {internship.salary || internship.salaryRange || internship.salary_range || internship.stipend}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <i className="fas fa-users" style={{ color: '#FF8A65', fontSize: '12px' }}></i>
                                                            <div>
                                                                <strong>{internship.applicants ? internship.applicants.length : 0}</strong>
                                                                <div style={{ fontSize: '11px', color: '#666' }}>applications</div>
                                                            </div>
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
                                                );
                                            })
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

                    {/* Other sections */}
                    {['candidates', 'pipeline', 'messages', 'calendar', 'analytics', 'settings'].map(section => (
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
                            // Edit Form
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
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Location</label>
                                        <input
                                            type="text"
                                            value={editJobData.location || ''}
                                            onChange={(e) => setEditJobData({...editJobData, location: e.target.value})}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Type</label>
                                        <select
                                            value={editJobData.job_type || ''}
                                            onChange={(e) => setEditJobData({...editJobData, job_type: e.target.value})}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Experience Required</label>
                                        <input
                                            type="text"
                                            value={editJobData.experience_required || ''}
                                            onChange={(e) => setEditJobData({...editJobData, experience_required: e.target.value})}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Industry</label>
                                        <input
                                            type="text"
                                            value={editJobData.industry || ''}
                                            onChange={(e) => setEditJobData({...editJobData, industry: e.target.value})}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                                    <textarea
                                        value={editJobData.description || ''}
                                        onChange={(e) => setEditJobData({...editJobData, description: e.target.value})}
                                        rows="4"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Required Skills</label>
                                    <input
                                        type="text"
                                        value={editJobData.required_skills || ''}
                                        onChange={(e) => setEditJobData({...editJobData, required_skills: e.target.value})}
                                        placeholder="e.g., Python, React, Node.js"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
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
                            // View Mode
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Job Information</h3>
                                        <p><strong>Title:</strong> {selectedJob.job_title || selectedJob.title || 'N/A'}</p>
                                        <p><strong>Company:</strong> {selectedJob.company_name || selectedJob.company || 'N/A'}</p>
                                        <p><strong>Location:</strong> {selectedJob.location || 'N/A'}</p>
                                        <p><strong>Type:</strong> {selectedJob.job_type || selectedJob.type || 'N/A'}</p>
                                        <p><strong>Experience:</strong> {selectedJob.experience_required || 'N/A'}</p>
                                        <p><strong>Industry:</strong> {selectedJob.industry || 'N/A'}</p>
                                        <p><strong>Remote Option:</strong> {selectedJob.remote_option || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Job Stats</h3>
                                        <p><strong>Applications:</strong> {selectedJob.applicants ? selectedJob.applicants.length : 0}</p>
                                        <p><strong>Views:</strong> {selectedJob.views || 0}</p>
                                        <p><strong>Created:</strong> {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : 'N/A'}</p>
                                        <p><strong>Deadline:</strong> {selectedJob.application_deadline ? new Date(selectedJob.application_deadline).toLocaleDateString() : 'N/A'}</p>
                                        <p><strong>Salary:</strong> {selectedJob.salary_range || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Description</h3>
                                    <p style={{ lineHeight: '1.6' }}>{selectedJob.description || 'No description available'}</p>
                                </div>
                                
                                {selectedJob.responsibilities && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Responsibilities</h3>
                                        <p style={{ lineHeight: '1.6' }}>{selectedJob.responsibilities}</p>
                                    </div>
                                )}
                                
                                {selectedJob.required_skills && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ color: '#FF8A65', marginBottom: '10px' }}>Required Skills</h3>
                                        <p style={{ lineHeight: '1.6' }}>{selectedJob.required_skills}</p>
                                    </div>
                                )}
                                
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
