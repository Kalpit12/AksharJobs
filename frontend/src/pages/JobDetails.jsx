import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faBriefcase, faBuilding, faMapMarkerAlt, 
    faClock, faHome, faGraduationCap, faUserTie, faDollarSign,
    faCalendarAlt, faCheckCircle, faExclamationTriangle, faLightbulb,
    faChartLine, faStar, faRocket, faBookOpen, faUsers, faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import '../styles/JobDetails.css';

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
            fetchJobAnalysis();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(buildApiUrl(`/api/jobs/get_job/${jobId}`));
            if (response.ok) {
                const jobData = await response.json();
                setJob(jobData);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchJobAnalysis = async () => {
        if (!user?.token) return;

        try {
            // First check if user has already applied
            const allAppsResponse = await fetch(buildApiUrl('/api/applications/all'));
            const allAppsData = await allAppsResponse.json();
            const userApplications = allAppsData.applications.filter(app => app.applicant_id === user.id && app.job_id === jobId);
            const applicationResponse = { ok: true, json: () => Promise.resolve({ applications: userApplications }) };

            if (applicationResponse.ok) {
                const applicationData = await applicationResponse.json();
                if (applicationData.applications && applicationData.applications.length > 0) {
                    const application = applicationData.applications[0];
                    setApplied(application.status === 'applied');
                    setAnalysis(application);
                }
            }

            // If no analysis exists, create one
            if (!analysis) {
                const analysisResponse = await fetch(buildApiUrl('/api/applications/apply'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        jobId: jobId,
                        status: 'analyzing'
                    })
                });

                if (analysisResponse.ok) {
                    const analysisData = await analysisResponse.json();
                    setAnalysis(analysisData);
                }
            }
        } catch (error) {
            console.error('Error fetching job analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user?.token) {
            navigate('/login');
            return;
        }

        setApplying(true);
        try {
            const response = await fetch(buildApiUrl('/api/applications/update_status'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    jobId: jobId,
                    status: 'applied'
                })
            });

            if (response.ok) {
                setApplied(true);
                // Also update the job's applicants list
                await fetch(buildApiUrl(`/api/jobs/apply/${jobId}`), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        applicant_id: user.id
                    })
                });
            }
        } catch (error) {
            console.error('Error applying for job:', error);
        } finally {
            setApplying(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Good Match';
        if (score >= 40) return 'Fair Match';
        return 'Poor Match';
    };

    if (loading) {
        return (
            <div className="job_details_loading">
                <div className="loading_spinner"></div>
                <p>Analyzing job compatibility...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job_details_error">
                <h2>Job Not Found</h2>
                <p>The job you're looking for doesn't exist or has been removed.</p>
                <button onClick={() => navigate('/jobs')} className="back_button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="job_details_wrapper">
            {/* Header */}
            <div className="job_details_header">
                <button onClick={() => navigate('/jobs')} className="back_button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
                </button>
                <h1>Job Details</h1>
            </div>

            <div className="job_details_container">
                {/* Job Information Section */}
                <div className="job_info_section">
                    <div className="job_header">
                        <div className="job_title_section">
                            <h2>{job.job_title}</h2>
                            <div className="company_info">
                                <FontAwesomeIcon icon={faBuilding} />
                                <span>{job.company_name}</span>
                                {job.company_website && (
                                    <a href={job.company_website} target="_blank" rel="noopener noreferrer">
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        {analysis && (
                            <div className="match_score_badge">
                                <div className="score_circle" style={{ borderColor: getScoreColor(analysis.final_score) }}>
                                    <span className="score_number">{Math.round(analysis.final_score)}%</span>
                                    <span className="score_label">{getScoreLabel(analysis.final_score)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="job_meta_grid">
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>{job.location}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faClock} />
                            <span>{job.job_type}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faHome} />
                            <span>{job.remote_option}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faDollarSign} />
                            <span>{job.salary_range}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faUserTie} />
                            <span>{job.experience_required}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faGraduationCap} />
                            <span>{job.education_required}</span>
                        </div>
                        <div className="meta_item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="job_description">
                        <h3>Job Description</h3>
                        <p>{job.description}</p>
                    </div>

                    <div className="job_responsibilities">
                        <h3>Key Responsibilities</h3>
                        <p>{job.responsibilities}</p>
                    </div>

                    <div className="job_skills">
                        <h3>Required Skills</h3>
                        <div className="skills_list">
                            {job.required_skills && job.required_skills.split(',').map((skill, index) => (
                                <span key={index} className="skill_tag">{skill.trim()}</span>
                            ))}
                        </div>
                    </div>

                    {!applied && (
                        <div className="apply_section">
                            <button 
                                onClick={handleApply} 
                                disabled={applying}
                                className="apply_button"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        </div>
                    )}

                    {applied && (
                        <div className="applied_section">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <span>You have applied for this position</span>
                        </div>
                    )}
                </div>

                {/* Analysis and Suggestions Section */}
                {analysis && (
                    <div className="analysis_section">
                        <h3><FontAwesomeIcon icon={faChartLine} /> Your Compatibility Analysis</h3>
                        
                        {/* Overall Score */}
                        <div className="overall_score_card">
                            <div className="score_header">
                                <h4>Overall Match Score</h4>
                                <span className="score_percentage">{Math.round(analysis.final_score)}%</span>
                            </div>
                            <div className="score_bar">
                                <div 
                                    className="score_fill" 
                                    style={{ 
                                        width: `${analysis.final_score}%`,
                                        backgroundColor: getScoreColor(analysis.final_score)
                                    }}
                                ></div>
                            </div>
                            <p className="score_description">
                                {analysis.final_score >= 80 
                                    ? "Excellent match! Your profile aligns very well with this position."
                                    : analysis.final_score >= 60
                                    ? "Good match! You have strong qualifications for this role."
                                    : analysis.final_score >= 40
                                    ? "Fair match. Consider improving specific areas to increase your chances."
                                    : "This role may require significant profile improvements to be competitive."
                                }
                            </p>
                        </div>

                        {/* Detailed Scores */}
                        <div className="detailed_scores">
                            <h4>Detailed Breakdown</h4>
                            <div className="score_grid">
                                <div className="score_item">
                                    <span className="score_label">Skills Match</span>
                                    <span className="score_value" style={{ color: getScoreColor(analysis.skills_match) }}>
                                        {Math.round(analysis.skills_match)}%
                                    </span>
                                </div>
                                <div className="score_item">
                                    <span className="score_label">Experience Match</span>
                                    <span className="score_value" style={{ color: getScoreColor(analysis.experience_match) }}>
                                        {Math.round(analysis.experience_match)}%
                                    </span>
                                </div>
                                <div className="score_item">
                                    <span className="score_label">Education Match</span>
                                    <span className="score_value" style={{ color: getScoreColor(analysis.education_match) }}>
                                        {Math.round(analysis.education_match)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights */}
                        {analysis.job_seeker_insights && (
                            <div className="insights_card">
                                <h4><FontAwesomeIcon icon={faLightbulb} /> AI Insights for You</h4>
                                <p>{analysis.job_seeker_insights}</p>
                            </div>
                        )}

                        {/* Missing Skills */}
                        {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                            <div className="missing_skills_card">
                                <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Skills to Develop</h4>
                                <div className="missing_skills_list">
                                    {analysis.missing_skills.map((skill, index) => (
                                        <span key={index} className="missing_skill_tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Improvement Suggestions */}
                        <div className="improvement_suggestions">
                            <h4><FontAwesomeIcon icon={faRocket} /> How to Improve Your Profile</h4>
                            
                            <div className="suggestion_group">
                                <h5><FontAwesomeIcon icon={faBookOpen} /> Learning Recommendations</h5>
                                <ul>
                                    <li>Focus on developing the missing skills identified above</li>
                                    <li>Take online courses or certifications in relevant technologies</li>
                                    <li>Practice with real-world projects to build experience</li>
                                </ul>
                            </div>

                            <div className="suggestion_group">
                                <h5><FontAwesomeIcon icon={faUsers} /> Networking Tips</h5>
                                <ul>
                                    <li>Connect with professionals in this industry on LinkedIn</li>
                                    <li>Join relevant professional groups and forums</li>
                                    <li>Attend industry events and webinars</li>
                                </ul>
                            </div>

                            <div className="suggestion_group">
                                <h5><FontAwesomeIcon icon={faHandshake} /> Application Strategy</h5>
                                <ul>
                                    <li>Tailor your resume to highlight relevant experience</li>
                                    <li>Write a compelling cover letter addressing the company's needs</li>
                                    <li>Follow up after applying to show continued interest</li>
                                </ul>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="next_steps_card">
                            <h4><FontAwesomeIcon icon={faStar} /> Recommended Next Steps</h4>
                            <div className="next_steps_list">
                                <div className="step_item">
                                    <span className="step_number">1</span>
                                    <span>Update your resume with the latest skills and experiences</span>
                                </div>
                                <div className="step_item">
                                    <span className="step_number">2</span>
                                    <span>Practice common interview questions for this role</span>
                                </div>
                                <div className="step_item">
                                    <span className="step_number">3</span>
                                    <span>Research the company culture and recent news</span>
                                </div>
                                <div className="step_item">
                                    <span className="step_number">4</span>
                                    <span>Prepare specific examples of your relevant achievements</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
