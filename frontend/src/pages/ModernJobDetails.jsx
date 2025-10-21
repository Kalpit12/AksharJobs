import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faBriefcase, faBuilding, faMapMarkerAlt, 
    faClock, faHome, faGraduationCap, faUserTie, faDollarSign,
    faCalendarAlt, faCheckCircle, faExclamationTriangle, faLightbulb,
    faChartLine, faStar, faRocket, faBookOpen, faUsers, faHandshake,
    faHeart, faShare, faEye, faUser, faGlobe, faCode, faCogs
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import axios from 'axios';
import '../styles/ModernJobDetails.css';

const ModernJobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
            checkApplicationStatus();
        }
    }, [jobId, user]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(buildApiUrl(`/api/jobs/get_job/${jobId}`));
            if (response.data) {
                // Transform job data from snake_case to camelCase for frontend compatibility
                const transformedJob = {
                    ...response.data,
                    job_title: response.data.job_title || response.data.jobTitle,
                    company_name: response.data.company_name || response.data.companyName,
                    salary_range: response.data.salary_range || response.data.salary || response.data.salaryRange,
                    remote_option: response.data.remote_option || response.data.remoteOption,
                    job_type: response.data.job_type || response.data.jobType,
                    experience_required: response.data.experience_required || response.data.experienceRequired,
                    required_skills: response.data.required_skills || response.data.requiredSkills,
                    education_required: response.data.education_required || response.data.educationRequired,
                    application_deadline: response.data.application_deadline || response.data.applicationDeadline,
                    company_website: response.data.company_website || response.data.companyWebsite
                };
                setJob(transformedJob);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = async () => {
        if (!user?.userId) return;
        
        try {
            const response = await axios.get(buildApiUrl('/api/applications/my-applications'), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                const userApplication = response.data.find(app => 
                    (app.job_id === jobId || app.jobId === jobId || app.job === jobId)
                );
                if (userApplication) {
                    setApplied(true);
                }
            }
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    const handleApply = async () => {
        if (!user?.userId) {
            navigate('/login');
            return;
        }

        setApplying(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(buildApiUrl('/api/applications/apply'), {
                job_id: jobId,
                cover_letter: `I am very interested in the ${job?.job_title} position at ${job?.company_name}. I believe my skills and experience make me a strong candidate for this role.`
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setApplied(true);
                // Show success message
                alert('Application submitted successfully!');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            setError(error.response?.data?.error || 'Failed to apply for job. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Implement favorite functionality
    };

    const shareJob = () => {
        if (navigator.share) {
            navigator.share({
                title: job?.job_title,
                text: `Check out this job opportunity: ${job?.job_title} at ${job?.company_name}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Job link copied to clipboard!');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatSkills = (skills) => {
        if (!skills) return [];
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'string') {
            return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        }
        return [];
    };

    const formatResponsibilities = (responsibilities) => {
        if (!responsibilities) return [];
        if (Array.isArray(responsibilities)) return responsibilities;
        if (typeof responsibilities === 'string') {
            return responsibilities.split(',').map(resp => resp.trim()).filter(resp => resp);
        }
        return [];
    };

    if (loading) {
        return (
            <div className="modern-job-details-loading">
                <div className="loading-spinner"></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="modern-job-details-error">
                <div className="error-content">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                    <h2>Job Not Found</h2>
                    <p>{error || "The job you're looking for doesn't exist or has been removed."}</p>
                    <button onClick={() => navigate('/jobseeker-dashboard', { state: { section: 'jobs' } })} className="back-button">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const sanitizeJobTitle = (title) => {
        if (!title) return title;
        return String(title).replace(/^Updated\s*[-:]?\s*/i, "");
    };

    const skills = formatSkills(job.required_skills || job.skills);
    const responsibilities = formatResponsibilities(job.responsibilities);

    return (
        <div className="modern-job-details">
            {/* Header */}
            <div className="job-header">
                <div className="header-content">
                    <button onClick={() => navigate('/jobs')} className="back-button">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
                    </button>
                    
                    <div className="job-title-section">
                        <h1>{sanitizeJobTitle(job.job_title || job.jobTitle)}</h1>
                        <div className="company-info">
                            <FontAwesomeIcon icon={faBuilding} />
                            <span className="company-name">{job.company_name || job.companyName}</span>
                            {job.company_website && (
                                <a 
                                    href={job.company_website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="company-website"
                                >
                                    <FontAwesomeIcon icon={faGlobe} />
                                    Visit Website
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="job-actions">
                        <button 
                            onClick={toggleFavorite} 
                            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <button 
                            onClick={shareJob} 
                            className="share-button"
                            title="Share job"
                        >
                            <FontAwesomeIcon icon={faShare} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="job-content">
                {/* Main Job Information */}
                <div className="job-main-content">
                    {/* Job Meta Information */}
                    <div className="job-meta-grid">
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <div className="meta-content">
                                <span className="meta-label">Location</span>
                                <span className="meta-value">{job.location}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faClock} />
                            <div className="meta-content">
                                <span className="meta-label">Job Type</span>
                                <span className="meta-value">{job.job_type || job.jobType}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faHome} />
                            <div className="meta-content">
                                <span className="meta-label">Remote Option</span>
                                <span className="meta-value">{job.remote_option || job.remoteOption}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faDollarSign} />
                            <div className="meta-content">
                                <span className="meta-label">Salary</span>
                                <span className="meta-value">{job.salary_range || job.salaryRange}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faUserTie} />
                            <div className="meta-content">
                                <span className="meta-label">Experience</span>
                                <span className="meta-value">{job.experience_required || job.experienceRequired}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faGraduationCap} />
                            <div className="meta-content">
                                <span className="meta-label">Education</span>
                                <span className="meta-value">{job.education_required}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <div className="meta-content">
                                <span className="meta-label">Application Deadline</span>
                                <span className="meta-value">{formatDate(job.application_deadline)}</span>
                            </div>
                        </div>
                        
                        <div className="meta-item">
                            <FontAwesomeIcon icon={faEye} />
                            <div className="meta-content">
                                <span className="meta-label">Views</span>
                                <span className="meta-value">{job.views || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="job-section">
                        <h3>
                            <FontAwesomeIcon icon={faBriefcase} />
                            Job Description
                        </h3>
                        <div className="section-content">
                            <p>{job.description}</p>
                        </div>
                    </div>

                    {/* Key Responsibilities */}
                    {responsibilities.length > 0 && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faCogs} />
                                Key Responsibilities
                            </h3>
                            <div className="section-content">
                                <ul className="responsibilities-list">
                                    {responsibilities.map((responsibility, index) => (
                                        <li key={index}>{responsibility}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Required Skills */}
                    {skills.length > 0 && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faCode} />
                                Required Skills
                            </h3>
                            <div className="section-content">
                                <div className="skills-grid">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faStar} />
                                Benefits & Perks
                            </h3>
                            <div className="section-content">
                                <p>{job.benefits}</p>
                            </div>
                        </div>
                    )}

                    {/* Company Culture */}
                    {job.company_culture && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faUsers} />
                                Company Culture
                            </h3>
                            <div className="section-content">
                                <p>{job.company_culture}</p>
                            </div>
                        </div>
                    )}

                    {/* Application Process */}
                    {job.application_process && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faHandshake} />
                                Application Process
                            </h3>
                            <div className="section-content">
                                <p>{job.application_process}</p>
                            </div>
                        </div>
                    )}

                    {/* Additional Requirements */}
                    {job.additional_requirements && (
                        <div className="job-section">
                            <h3>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                Additional Requirements
                            </h3>
                            <div className="section-content">
                                <p>{job.additional_requirements}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="job-sidebar">
                    {/* Application Section */}
                    <div className="application-card">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {applied ? (
                            <div className="applied-status">
                                <FontAwesomeIcon icon={faCheckCircle} className="applied-icon" />
                                <h4>Application Submitted</h4>
                                <p>You have successfully applied for this position.</p>
                                <button 
                                    onClick={() => navigate('/application-tracker')}
                                    className="view-applications-button"
                                >
                                    View My Applications
                                </button>
                            </div>
                        ) : (
                            <div className="apply-section">
                                <h4>Ready to Apply?</h4>
                                <p>Join {job.company_name || job.companyName} and make an impact in your career.</p>
                                <button 
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="apply-button"
                                >
                                    {applying ? (
                                        <>
                                            <div className="button-spinner"></div>
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faRocket} />
                                            Apply Now
                                        </>
                                    )}
                                </button>
                                <p className="application-note">
                                    Your application will be reviewed by the hiring team.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Job Stats */}
                    <div className="job-stats-card">
                        <h4>Job Statistics</h4>
                        <div className="job-stats-grid">
                            <div className="job-stat-item">
                                <FontAwesomeIcon icon={faEye} />
                                <span className="stat-value">{job.views || 0}</span>
                                <span className="stat-label">Views</span>
                            </div>
                            <div className="job-stat-item">
                                <FontAwesomeIcon icon={faUser} />
                                <span className="stat-value">{job.applicants?.length || 0}</span>
                                <span className="stat-label">Applicants</span>
                            </div>
                            <div className="job-stat-item">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="stat-label">Posted</span>
                                <span className="stat-value">{formatDate(job.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-card">
                        <h4>Quick Actions</h4>
                        <div className="job-actions-list">
                            <button 
                                onClick={toggleFavorite}
                                className={`job-action-button ${isFavorite ? 'favorited' : ''}`}
                            >
                                <FontAwesomeIcon icon={faHeart} />
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                            <button onClick={shareJob} className="job-action-button">
                                <FontAwesomeIcon icon={faShare} />
                                Share Job
                            </button>
                            <button 
                                onClick={() => navigate('/jobs')}
                                className="job-action-button"
                            >
                                <FontAwesomeIcon icon={faBriefcase} />
                                Browse More Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernJobDetails;
