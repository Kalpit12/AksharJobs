import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBriefcase, 
  faChartLine, 
  faRocket, 
  faEye, 
  faHeart,
  faMapMarkerAlt,
  faMoneyBillWave,
  faClock,
  faHome,
  faCheck,
  faTimes,
  faPlus,
  faSearch,
  faBell,
  faCog,
  faSignOutAlt,
  faFileAlt,
  faUserTie,
  faClipboardList,
  faBolt,
  faStar,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/AuthContext";
import ResumeUpload from '../components/ResumeUpload.jsx';
import ResumeProfile from '../components/ResumeProfile.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import Header from '../components/Header.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { buildApiUrl } from '../config/api';
import "../styles/JobSeekerDashboard.css";

const JobSeekerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [stats, setStats] = useState({
        totalApplications: 0,
        shortlisted: 0,
        interviews: 0,
        offers: 0
    });
    const [resumeData, setResumeData] = useState(null);
    const [showResumeUpload, setShowResumeUpload] = useState(false);

    const defaultAvatar = "https://www.w3schools.com/w3images/avatar2.png";

    // Mock data for demonstration - replace with real API calls
    const mockRecommendedJobs = [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp Solutions",
            location: "Nairobi, Kenya",
            salary: "KSh 150,000 - 250,000",
            type: "Full-time",
            remote: "Hybrid",
            skills: ["React", "TypeScript", "Node.js"],
            matchScore: 95,
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "Data Scientist",
            company: "Innovate Kenya",
            location: "Mombasa, Kenya",
            salary: "KSh 200,000 - 350,000",
            type: "Full-time",
            remote: "Remote",
            skills: ["Python", "Machine Learning", "SQL"],
            matchScore: 88,
            posted: "1 week ago"
        },
        {
            id: 3,
            title: "Product Manager",
            company: "Startup Kenya",
            location: "Nairobi, Kenya",
            salary: "KSh 180,000 - 300,000",
            type: "Full-time",
            remote: "On-site",
            skills: ["Product Strategy", "Agile", "User Research"],
            matchScore: 82,
            posted: "3 days ago"
        }
    ];

    const mockRecentApplications = [
        {
            id: 1,
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Solutions",
            status: "Shortlisted",
            date: "2024-01-15",
            matchScore: 95
        },
        {
            id: 2,
            jobTitle: "Data Scientist",
            company: "Innovate Kenya",
            status: "Applied",
            date: "2024-01-12",
            matchScore: 88
        },
        {
            id: 3,
            jobTitle: "Product Manager",
            company: "Startup Kenya",
            status: "Interview",
            date: "2024-01-10",
            matchScore: 82
        }
    ];

    useEffect(() => {
        // Load existing resume data
        const fetchResumeData = async () => {
            if (!user?.token) return;

            try {
                const response = await fetch(buildApiUrl('/api/resumes/profile'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setResumeData(data.resume_data);
                    console.log('Loaded existing resume data:', data.resume_data);
                    
                    // Update dashboard with real user data if available
                    if (data.resume_data && data.resume_data.personal_info) {
                        const personalInfo = data.resume_data.personal_info;
                        if (personalInfo.name && personalInfo.name !== 'Welcome to AksharJobs!') {
                            setUserName(personalInfo.name);
                        }
                        
                        // Update stats based on real data if available
                        if (data.resume_data.skills && data.resume_data.skills.length > 0) {
                            setStats(prev => ({
                                ...prev,
                                skillsCount: data.resume_data.skills.length
                            }));
                        }
                    }
                } else if (response.status !== 404) {
                    console.error('Failed to fetch resume data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching resume data:', error);
            }
        };

        // Load user data from localStorage or context
        const userEmail = localStorage.getItem('userEmail');
        const userFirstName = localStorage.getItem('userFirstName');
        const userLastName = localStorage.getItem('userLastName');
        
        if (userEmail && userFirstName && userLastName) {
            const fullName = `${userFirstName} ${userLastName}`;
            setUserName(fullName);
        } else if (user?.firstName && user?.lastName) {
            const fullName = `${user.firstName} ${user.lastName}`;
            setUserName(fullName);
        } else {
            setUserName("User");
        }
        
        setUserImage(defaultAvatar);
        setRecentApplications(mockRecentApplications);
        setStats({
            totalApplications: 15,
            shortlisted: 8,
            interviews: 5,
            offers: 2
        });
        
        // Load data using the new functions
        loadUserProfile();
        loadRecommendedJobs();
        setIsLoadingProfile(false);
        
        // Fetch existing resume data
        fetchResumeData();
    }, [user?.token]);

    // Load user profile data
    const loadUserProfile = async () => {
        if (!user?.token) return;

        try {
            const response = await fetch(buildApiUrl('/api/resumes/profile'), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setResumeData(data.resume_data);
                console.log('Loaded user profile:', data.resume_data);
                
                // Update dashboard with real user data if available
                if (data.resume_data && data.resume_data.personal_info) {
                    const personalInfo = data.resume_data.personal_info;
                    if (personalInfo.name && personalInfo.name !== 'Welcome to AksharJobs!') {
                        setUserName(personalInfo.name);
                    }
                }
            } else if (response.status !== 404) {
                console.error('Failed to fetch user profile:', response.status);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    // Load recommended jobs
    const loadRecommendedJobs = async () => {
        if (!user?.token) return;

        try {
            // Get user ID from JWT token (decode it to get the user_id)
            let userId;
            try {
                const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
                userId = tokenPayload.user_id;
            } catch (decodeError) {
                console.warn('Failed to decode JWT token, trying alternative method');
                // Fallback: try to get userId from user object directly
                userId = user.id || user.userId || user._id;
            }

            if (userId) {
                const jobsResponse = await fetch(buildApiUrl(`/api/jobs/recommended/${userId}`), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    if (jobsData.recommendations && jobsData.recommendations.length > 0) {
                        // Transform the backend job data to match frontend format
                        const transformedJobs = jobsData.recommendations.map(job => {
                            // Ensure skills is always an array
                            let skills = [];
                            if (job.required_skills && Array.isArray(job.required_skills)) {
                                skills = job.required_skills;
                            } else if (job.skills && Array.isArray(job.skills)) {
                                skills = job.skills;
                            } else if (job.required_skills || job.skills) {
                                // Convert non-array skills to array
                                const skillsData = job.required_skills || job.skills;
                                if (typeof skillsData === 'string') {
                                    skills = skillsData.split(',').map(s => s.trim());
                                } else if (skillsData) {
                                    skills = [String(skillsData)];
                                }
                            }
                            
                            return {
                                id: job._id || job.id,
                                title: job.title || job.job_title || 'Unknown Position',
                                company: job.company || job.employer || 'Unknown Company',
                                location: job.location || job.job_location || 'Location not specified',
                                salary: job.salary || job.salary_range || 'Salary not specified',
                                type: job.job_type || job.type || 'Full-time',
                                remote: job.work_mode || job.remote || 'On-site',
                                skills: skills,
                                matchScore: job.match_score || 0,
                                posted: job.posted_date || 'Recently posted'
                            };
                        });
                        setRecommendedJobs(transformedJobs);
                    } else {
                        setRecommendedJobs(mockRecommendedJobs);
                    }
                } else {
                    console.error('Failed to fetch recommended jobs:', jobsResponse.status);
                    setRecommendedJobs(mockRecommendedJobs);
                }
            } else {
                console.warn('Could not get user ID for job recommendations - using mock data');
                setRecommendedJobs(mockRecommendedJobs);
            }
        } catch (error) {
            console.error('Error loading recommended jobs:', error);
            setRecommendedJobs(mockRecommendedJobs);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleResumeUploaded = (resumeData, aiRecommendations = null) => {
        // Remove excessive debug logging
        // console.log('🔍 handleResumeUploaded called with:');
        // console.log('  - resumeData:', resumeData);
        // console.log('  - aiRecommendations:', aiRecommendations);
        // console.log('  - resumeData.skills:', resumeData?.skills);
        // console.log('  - resumeData.skills type:', typeof resumeData?.skills);
        
        setResumeData(resumeData);
        setShowResumeUpload(false);
        
        // Store AI recommendations if available
        if (aiRecommendations) {
            localStorage.setItem('ai_recommendations', JSON.stringify(aiRecommendations));
        }
        
        // Refresh the page data
        loadUserProfile();
        loadRecommendedJobs();
    };

    const handleEditProfile = () => {
        setShowResumeUpload(true);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'shortlisted': return '#10b981';
            case 'interview': return '#f59e0b';
            case 'applied': return '#3b82f6';
            case 'offered': return '#059669';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'shortlisted': return faCheck;
            case 'interview': return faEye;
            case 'applied': return faBriefcase;
            case 'offered': return faHeart;
            default: return faBriefcase;
        }
    };

    if (isLoadingProfile) {
        return (
            <>
                <Header />
                <div className="dashboard_wrapper">
                    <LoadingSpinner 
                        type="rocket" 
                        size="large" 
                        text="Loading your dashboard..." 
                        showText={true}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="dashboard_wrapper">
                {/* Main Content */}
            <main className="dashboard_main">
                <div className="dashboard_container">
                    {/* Welcome Section */}
                    <section className="welcome_section">
                        <div className="welcome_background">
                            <div className="welcome_dots"></div>
                            <div className="welcome_gradient"></div>
                        </div>
                        <div className="welcome_content">
                            <div className="welcome_header">
                                <div className="welcome_icon_wrapper">
                                    <div className="welcome_icon">
                                        <FontAwesomeIcon icon={faRocket} />
                                        <div className="icon_glow"></div>
                                    </div>
                                </div>
                                <div className="welcome_text">
                                    <h1>Welcome Back <span className="highlight_name">{userName || "Kalpit Patel"}</span> 👋</h1>
                                    {resumeData?.job_title ? (
                                        <p className="job_title_display">
                                            <FontAwesomeIcon icon={faBriefcase} className="job_title_icon" />
                                            {resumeData.job_title}
                                        </p>
                                    ) : (
                                        <p className="default_welcome">
                                            Welcome to AksharJobs! Complete your profile to get started with AI-powered job matching.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="welcome_actions">
                                <button className="btn btn_primary welcome_btn" onClick={() => navigate('/jobs')}>
                                    <FontAwesomeIcon icon={faSearch} className="btn_icon" />
                                    <span>Browse Jobs</span>
                                    <div className="btn_glow"></div>
                                </button>
                                <button className="btn btn_secondary welcome_btn" onClick={() => setShowResumeUpload(true)}>
                                    <FontAwesomeIcon icon={faPlus} className="btn_icon" />
                                    <span>Upload Resume</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Resume Profile Section */}
                    <ErrorBoundary>
                        <ResumeProfile 
                            resumeData={resumeData} 
                            onEdit={handleEditProfile}
                            token={user?.token}
                        />
                    </ErrorBoundary>

                    {/* Progress Cards - Modern Design */}
                    <section className="progress_section">
                        <div className="section_header enhanced">
                            <div className="header_icon_wrapper">
                                <div className="header_icon progress_icon">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                            </div>
                            <div className="header_text_content">
                                <h2>Your Progress</h2>
                                <p>Track your job search journey and achievements</p>
                            </div>
                        </div>
                        
                        <div className="progress_cards_container">
                            {/* Main Progress Overview Card */}
                            <div className="progress_overview_card">
                                <div className="overview_header">
                                    <div className="overview_icon">
                                        <FontAwesomeIcon icon={faRocket} />
                                    </div>
                                    <div className="overview_text">
                                        <h3>Progress Overview</h3>
                                        <p>Your job search performance</p>
                                    </div>
                                </div>
                                <div className="overview_stats">
                                    <div className="overview_stat">
                                        <span className="stat_value">{stats.totalApplications + stats.shortlisted + stats.interviews + stats.offers}</span>
                                        <span className="stat_label">Total Activities</span>
                                    </div>
                                    <div className="overview_stat">
                                        <span className="stat_value">{Math.round((stats.offers / Math.max(stats.totalApplications, 1)) * 100)}%</span>
                                        <span className="stat_label">Success Rate</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Individual Progress Cards */}
                            <div className="progress_cards_grid">
                                <div className="progress_card applications">
                                    <div className="card_icon">
                                        <FontAwesomeIcon icon={faFileAlt} />
                                    </div>
                                    <div className="card_content">
                                        <h4>{stats.totalApplications}</h4>
                                        <p>Applications</p>
                                    </div>
                                </div>
                                
                                <div className="progress_card shortlisted">
                                    <div className="card_icon">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </div>
                                    <div className="card_content">
                                        <h4>{stats.shortlisted}</h4>
                                        <p>Shortlisted</p>
                                    </div>
                                </div>
                                
                                <div className="progress_card interviews">
                                    <div className="card_icon">
                                        <FontAwesomeIcon icon={faEye} />
                                    </div>
                                    <div className="card_content">
                                        <h4>{stats.interviews}</h4>
                                        <p>Interviews</p>
                                    </div>
                                </div>
                                
                                <div className="progress_card offers">
                                    <div className="card_icon">
                                        <FontAwesomeIcon icon={faHeart} />
                                    </div>
                                    <div className="card_content">
                                        <h4>{stats.offers}</h4>
                                        <p>Job Offers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recommended Jobs */}
                    <section className="jobs_section">
                        <div className="section_header enhanced">
                            <div className="header_icon_wrapper">
                                <div className="header_icon star_icon">
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                            </div>
                            <div className="header_text_content">
                                <h2>Recommended for You</h2>
                                <p>Jobs that match your skills and experience</p>
                            </div>
                        </div>
                        
                        <div className="jobs_grid">
                            <ErrorBoundary>
                                {recommendedJobs.map((job) => (
                                    <div key={job.id} className="job_card">
                                        <div className="job_card_header">
                                            <div className="job_title_wrapper">
                                                <h3 className="job_title">{job.title}</h3>
                                                <div className="match_score">
                                                    <span className="score_number">{job.matchScore}%</span>
                                                    <span className="score_label">Match</span>
                                                </div>
                                            </div>
                                            <p className="job_company">{job.company}</p>
                                        </div>
                                        
                                        <div className="job_details">
                                            <div className="job_detail">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="job_detail">
                                                <FontAwesomeIcon icon={faMoneyBillWave} />
                                                <span>{job.salary}</span>
                                            </div>
                                            <div className="job_detail">
                                                <FontAwesomeIcon icon={faClock} />
                                                <span>{job.type}</span>
                                            </div>
                                            <div className="job_detail">
                                                <FontAwesomeIcon icon={faHome} />
                                                <span>{job.remote}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="job_skills">
                                            {Array.isArray(job.skills) && job.skills.length > 0 ? (
                                                job.skills.map((skill, index) => (
                                                    <span key={index} className="skill_tag">{skill}</span>
                                                ))
                                            ) : (
                                                <span className="no_skills">No skills listed</span>
                                            )}
                                        </div>
                                        
                                        <div className="job_footer">
                                            <span className="posted_date">{job.posted}</span>
                                            <div className="job_actions">
                                                <button className="btn btn_outline">View Details</button>
                                                <button className="btn btn_primary">Apply Now</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ErrorBoundary>
                        </div>
                    </section>

                    {/* Recent Applications */}
                    <section className="applications_section">
                        <div className="section_header enhanced">
                            <div className="header_icon_wrapper">
                                <div className="header_icon clipboard_icon">
                                    <FontAwesomeIcon icon={faClipboardList} />
                                </div>
                            </div>
                            <div className="header_text_content">
                                <h2>Recent Applications</h2>
                                <p>Track your application progress</p>
                            </div>
                        </div>
                        
                        <div className="applications_list">
                            {recentApplications.map((application) => (
                                <div key={application.id} className="application_item">
                                    <div className="application_info">
                                        <h4 className="application_job_title">{application.jobTitle}</h4>
                                        <p className="application_company">{application.company}</p>
                                        <span className="application_date">{application.date}</span>
                                    </div>
                                    
                                    <div className="application_status">
                                        <div 
                                            className="status_badge"
                                            style={{ backgroundColor: getStatusColor(application.status) }}
                                        >
                                            <FontAwesomeIcon icon={getStatusIcon(application.status)} />
                                            <span>{application.status}</span>
                                        </div>
                                        <div className="match_score_badge">
                                            {application.matchScore}% Match
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="quick_actions_section">
                        <div className="section_header enhanced">
                            <div className="header_icon_wrapper">
                                <div className="header_icon bolt_icon">
                                    <FontAwesomeIcon icon={faBolt} />
                                </div>
                            </div>
                            <div className="header_text_content">
                                <h2>Quick Actions</h2>
                                <p>Get things done faster</p>
                            </div>
                        </div>
                        
                        <div className="actions_grid">
                            <button className="action_card">
                                <div className="action_icon">
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <h3>Search Jobs</h3>
                                <p>Find opportunities that match your skills</p>
                            </button>
                            
                            <button className="action_card">
                                <div className="action_icon">
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <h3>Upload Resume</h3>
                                <p>Keep your profile updated</p>
                            </button>
                            
                            <button className="action_card">
                                <div className="action_icon">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                <h3>View Analytics</h3>
                                <p>Track your application performance</p>
                            </button>
                            
                            <button className="action_card">
                                <div className="action_icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <h3>Edit Profile</h3>
                                <p>Update your personal information</p>
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Resume Upload Modal */}
            {showResumeUpload && (
                <ResumeUpload
                    onResumeUploaded={handleResumeUploaded}
                    onClose={() => setShowResumeUpload(false)}
                />
            )}
        </div>
        </>
    );
};

export default JobSeekerDashboard;