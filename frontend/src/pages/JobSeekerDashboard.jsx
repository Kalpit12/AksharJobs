import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBriefcase, 
  faChartLine, 
  faRocket, 
  faMapMarkerAlt,
  faMoneyBillWave,
  faHome,
  faTimes,
  faPlus,
  faSearch,
  faBell,
  faCog,
  faSignOutAlt,
  faUserTie,
  faBolt,
  faUpload,
  faBuilding,
  faEye,
  faHeart,
  faFilter,
  faSort,
  faUserGraduate,
  faGraduationCap,
  faLaptopCode,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/AuthContext";
import { useProfilePhoto } from "../context/ProfilePhotoContext";

import ErrorBoundary from '../components/ErrorBoundary.jsx';
import Header from '../components/Header.jsx';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner.jsx';
import JobApplicationModal from '../components/JobApplicationModal.jsx';
import GeminiChatbot from '../components/GeminiChatbot.jsx';
import JobMagicBento from '../components/JobMagicBento.jsx';
import ResumePublishStatus from '../components/ResumePublishStatus.jsx';
import ProfileTracker from '../components/ProfileTracker.jsx';
import ProfileViews from '../components/ProfileViews.jsx';
import NetworkActivity from '../components/NetworkActivity.jsx';
import RecommendationRequests from '../components/RecommendationRequests.jsx';
import PortfolioShowcase from '../components/PortfolioShowcase.jsx';
import AICareerPathAdvisor from '../components/AICareerPathAdvisor.jsx';
import { buildApiUrl } from '../config/api';
import "../styles/JobSeekerDashboard.css";

const JobSeekerDashboard = () => {
    const { user, logout } = useAuth();
    const { profilePhoto, getUserInitials } = useProfilePhoto();
    const navigate = useNavigate();
    
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [resumeData, setResumeData] = useState(null);


    // Job application modal state
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const defaultAvatar = "https://www.w3schools.com/w3images/avatar2.png";




    useEffect(() => {
        // Load existing resume data
        const fetchResumeData = async () => {
            if (!user?.token) return;

            try {
                const response = await fetch(buildApiUrl('/api/modern-resumes/profile'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setResumeData(data.resume_data);
                    
                    // Update dashboard with real user data if available
                    // Only use resume data name if it's not the problematic "DATA ANALYST" text
                    if (data.resume_data && data.resume_data.personal_info) {
                        const personalInfo = data.resume_data.personal_info;
                        if (personalInfo.name && 
                            personalInfo.name !== 'Welcome to AksharJobs!' &&
                            !personalInfo.name.includes('DATA ANALYST') &&
                            !personalInfo.name.includes('D A TA A NA LYST')) {
                            setUserName(personalInfo.name);
                        }
                    }
                    
                } else if (response.status !== 404) {
                    console.error('Failed to fetch resume data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching resume data:', error);
            }
        };

        // Set initial user name from available sources
        const setInitialUserName = () => {
            const userEmail = localStorage.getItem('userEmail');
            const userFirstName = localStorage.getItem('userFirstName');
            const userLastName = localStorage.getItem('userLastName');
            
            
            // Priority 1: From localStorage
            if (userFirstName && userLastName && userFirstName !== 'undefined' && userLastName !== 'undefined') {
                const fullName = `${userFirstName} ${userLastName}`;
                setUserName(fullName);
                return;
            } 
            // Priority 2: From user context
            if (user?.firstName && user?.lastName && user.firstName !== 'undefined' && user.lastName !== 'undefined') {
                const fullName = `${user.firstName} ${user.lastName}`;
                setUserName(fullName);
                return;
            }
            // Priority 3: From email (extract name from email)
            if (userEmail && userEmail !== 'undefined') {
                const emailName = userEmail.split('@')[0].replace(/[._]/g, ' ');
                setUserName(emailName);
                return;
            }
            // Fallback
            setUserName("User");
        };
        
        setInitialUserName();
        
        setUserImage(defaultAvatar);
        
        // Fetch real data from backend
        fetchResumeData();
        setIsLoadingProfile(false);
    }, [user?.token]);

    // Update userName when user context changes
    useEffect(() => {
        if (user?.firstName && user?.lastName && user.firstName !== 'undefined' && user.lastName !== 'undefined') {
            const fullName = `${user.firstName} ${user.lastName}`;
            setUserName(fullName);
        }
    }, [user?.firstName, user?.lastName]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Handle job application
    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationModal(true);
    };

    // Handle application modal close
    const handleCloseApplicationModal = () => {
        setShowApplicationModal(false);
        setSelectedJob(null);
    };

    // Handle successful application submission
    const handleApplicationSubmitted = () => {
        // Close modal
        setShowApplicationModal(false);
        setSelectedJob(null);
    };

    const handleResumeUploaded = (resumeData, aiRecommendations = null) => {
        // Remove excessive debug logging
        // console.log('🔍 handleResumeUploaded called with:');
        // console.log('  - resumeData:', resumeData);
        // console.log('  - aiRecommendations:', aiRecommendations);
        // console.log('  - resumeData.skills:', resumeData?.skills);
        // console.log('  - resumeData.skills type:', typeof resumeData?.skills);
        
        setResumeData(resumeData);

        
        // Store AI recommendations if available
        if (aiRecommendations) {
            localStorage.setItem('ai_recommendations', JSON.stringify(aiRecommendations));
        }
    };

    const handleEditProfile = () => {
        // Navigate to the profile editing page
        navigate('/profile');
    };


    if (isLoadingProfile) {
        return (
            <>
                <Header />
                <div className="dashboard_wrapper">
                    <ModernLoadingSpinner 
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
                {/* Dashboard Layout with Sidebar */}
                <div className="dashboard_layout">
                    {/* Sidebar */}
                    <aside className="dashboard_sidebar">
                        <ProfileTracker 
                            isSidebar={true}
                            onCompletionChange={(percentage) => {
                                console.log('Profile completion changed:', percentage);
                            }}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard_content">
                    {/* Welcome Section */}
                    <section className="welcome_card">
                        <div className="welcome_content">
                            <div className="welcome_text">
                                <h2>Welcome back, {userName || "User"}!</h2>
                                <p>Ready to find your next opportunity?</p>
                            </div>
                            <div className="welcome_actions">
                                <button className="btn btn_primary" onClick={() => navigate('/jobs')}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    Browse Jobs
                                </button>
                                <button className="btn btn_upload_resume" onClick={() => navigate('/modern-upload')}>
                                    <FontAwesomeIcon icon={faUpload} />
                                    Upload Resume
                                    <span className="upload_badge">AI-Powered</span>
                                </button>
                            </div>
                        </div>
                    </section>


                    {/* Resume Publish Status */}
                    <section className="resume-publish-section">
                        <h2 className="section-title">Resume Status</h2>
                        <ResumePublishStatus 
                            onStatusChange={(published) => {
                                console.log('Resume publish status changed:', published);
                            }}
                        />
                    </section>

                    {/* Profile & Networking Section */}
                    <section className="profile-networking-section">
                        <h2 className="section-title">Profile & Networking</h2>
                        <div className="networking-grid">
                            <div className="networking-item">
                                <ProfileViews />
                            </div>
                            <div className="networking-item">
                                <NetworkActivity />
                            </div>
                            <div className="networking-item">
                                <RecommendationRequests />
                            </div>
                            <div className="networking-item">
                                <PortfolioShowcase />
                            </div>
                        </div>
                    </section>

                    {/* AI Career Path Advisor */}
                    <section className="ai-features-section">
                        <AICareerPathAdvisor />
                    </section>

                    {/* MagicBento Feature Showcase */}
                    <section className="magic-bento-section">
                        <h2 className="section-title">Job Search Features</h2>
                        <JobMagicBento 
                            textAutoHide={true}
                            enableStars={true}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableTilt={true}
                            enableMagnetism={true}
                            clickEffect={true}
                            spotlightRadius={300}
                            particleCount={12}
                            glowColor="59, 130, 246"
                        />
                    </section>

                    {/* Coming Soon Programs Section */}
                    <section className="programs_section">
                        <div className="programs_header">
                            <h2 className="programs_title">Coming Soon: Exciting New Programs</h2>
                            <p className="programs_subtitle">
                                We're working on amazing new features to enhance your career journey
                            </p>
                        </div>
                        
                        <div className="programs_grid">
                            <div className="program_card mentorship">
                                <div className="program_icon">
                                    <FontAwesomeIcon icon={faUserGraduate} />
                                </div>
                                <h3 className="program_title">Mentorship Programs</h3>
                                <p className="program_description">
                                    Connect with industry experts and accelerate your career growth through personalized mentorship.
                                </p>
                                <div className="program_features">
                                    <span className="feature_tag">Expert Guidance</span>
                                    <span className="feature_tag">Career Acceleration</span>
                                    <span className="feature_tag">Network Building</span>
                                </div>
                                <button 
                                    className="program_button"
                                    onClick={() => navigate('/mentorship-programs')}
                                >
                                    Learn More
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>

                            <div className="program_card scholarships">
                                <div className="program_icon">
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                </div>
                                <h3 className="program_title">Scholarships</h3>
                                <p className="program_description">
                                    Discover amazing scholarship opportunities to support your educational journey and career development.
                                </p>
                                <div className="program_features">
                                    <span className="feature_tag">Merit-Based Awards</span>
                                    <span className="feature_tag">Financial Support</span>
                                    <span className="feature_tag">Prestigious Programs</span>
                                </div>
                                <button 
                                    className="program_button"
                                    onClick={() => navigate('/scholarships')}
                                >
                                    Learn More
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>

                            <div className="program_card training">
                                <div className="program_icon">
                                    <FontAwesomeIcon icon={faLaptopCode} />
                                </div>
                                <h3 className="program_title">Training Programs</h3>
                                <p className="program_description">
                                    Enhance your skills with comprehensive training programs designed by industry experts.
                                </p>
                                <div className="program_features">
                                    <span className="feature_tag">Technical Skills</span>
                                    <span className="feature_tag">Career Growth</span>
                                    <span className="feature_tag">Certifications</span>
                                </div>
                                <button 
                                    className="program_button"
                                    onClick={() => navigate('/training-programs')}
                                >
                                    Learn More
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </section>

                    </main>
                </div>

                {/* Job Application Modal */}
            {showApplicationModal && selectedJob && (
                <JobApplicationModal
                    job={selectedJob}
                    onClose={handleCloseApplicationModal}
                    onApplicationSubmitted={handleApplicationSubmitted}
                />
            )}
            
            {/* AI Chatbot */}
            <GeminiChatbot userType="jobSeeker" />
            </div>
        </>
    );
};

export default JobSeekerDashboard;