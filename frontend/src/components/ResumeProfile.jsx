import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faEnvelope, faPhone, faMapMarkerAlt,
    faBriefcase, faGraduationCap, faProjectDiagram, faCertificate,
    faStar, faTrophy, faEdit, faDownload, faEye, faCalendarAlt,
    faBuilding, faGlobe, faCode, faLightbulb, faAward, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import '../styles/ResumeProfile.css';

const ResumeProfile = ({ resumeData, onEdit, token }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const hasFetchedRecommendations = useRef(false);

    // Debug: Log the incoming resumeData
    // console.log('🔍 ResumeProfile - Incoming resumeData:', resumeData);
    // console.log('🔍 ResumeProfile - Type of resumeData:', typeof resumeData);
    // console.log('🔍 ResumeProfile - Has resumeData:', !!resumeData);

    // Comprehensive data sanitization
    const sanitizeData = (data) => {
        // console.log('🔍 SanitizeData called with:', data);
        
        if (!data || typeof data !== 'object') {
            // console.log('❌ Data is null, undefined, or not an object');
            return null;
        }
        
        const sanitized = {};
        
        // Sanitize personal_info
        if (data.personal_info) {
            sanitized.personal_info = {
                name: typeof data.personal_info.name === 'string' ? data.personal_info.name : '',
                email: typeof data.personal_info.email === 'string' ? data.personal_info.email : '',
                phone: typeof data.personal_info.phone === 'string' ? data.personal_info.phone : '',
                location: typeof data.personal_info.location === 'string' ? data.personal_info.location : '',
                linkedin: typeof data.personal_info.linkedin === 'string' ? data.personal_info.linkedin : '',
                github: typeof data.personal_info.github === 'string' ? data.personal_info.github : ''
            };
        }
        
        // Sanitize summary
        sanitized.summary = typeof data.summary === 'string' ? data.summary : '';
        
        // Sanitize skills - CRITICAL SECTION
        // console.log('🔍 Raw skills data:', data.skills);
        // console.log('🔍 Skills data type:', typeof data.skills);
        // console.log('🔍 Is skills an array?', Array.isArray(data.skills));
        
        if (data.skills) {
            // console.log('🔍 Skills object keys:', Object.keys(data.skills));
            // console.log('🔍 Skills object values:', data.skills);
            // console.log('🔍 Skills.technical_skills:', data.skills.technical_skills);
            // console.log('🔍 Skills.soft_skills:', data.skills.soft_skills);
            // console.log('🔍 Skills.languages:', data.skills.languages);
            
            if (typeof data.skills === 'object' && !Array.isArray(data.skills)) {
                // Skills is an object with technical_skills, soft_skills, languages
                sanitized.skills = {
                    technical_skills: Array.isArray(data.skills.technical_skills) 
                        ? data.skills.technical_skills.filter(skill => typeof skill === 'string')
                        : [],
                    soft_skills: Array.isArray(data.skills.soft_skills) 
                        ? data.skills.soft_skills.filter(skill => typeof skill === 'string')
                        : [],
                    languages: Array.isArray(data.skills.languages) 
                        ? data.skills.languages.filter(lang => typeof lang === 'string')
                        : []
                };
            } else if (Array.isArray(data.skills)) {
                // Skills is a simple array - convert to structured format
                // console.log('🔍 Converting array skills to structured format');
                sanitized.skills = {
                    technical_skills: data.skills.filter(skill => typeof skill === 'string'),
                    soft_skills: [],
                    languages: []
                };
            } else {
                // Fallback
                sanitized.skills = {
                    technical_skills: [],
                    soft_skills: [],
                    languages: []
                };
            }
        } else {
            sanitized.skills = {
                technical_skills: [],
                soft_skills: [],
                languages: []
            };
        }
        
        // console.log('🔍 Sanitized skills:', sanitized.skills);
        
        // Sanitize other sections...
        sanitized.experience = Array.isArray(data.experience) 
            ? data.experience.map(exp => ({
                title: typeof exp.title === 'string' ? exp.title : '',
                company: typeof exp.company === 'string' ? exp.company : '',
                duration: typeof exp.duration === 'string' ? exp.duration : '',
                description: typeof exp.description === 'string' ? exp.description : ''
            }))
            : [];
        
        sanitized.education = Array.isArray(data.education) 
            ? data.education.map(edu => ({
                degree: typeof edu.degree === 'string' ? edu.degree : '',
                institution: typeof edu.institution === 'string' ? edu.institution : '',
                graduation_year: typeof edu.graduation_year === 'string' ? edu.graduation_year : '',
                gpa: typeof edu.gpa === 'string' || typeof edu.gpa === 'number' ? String(edu.gpa) : ''
            }))
            : [];
        
        sanitized.projects = Array.isArray(data.projects) 
            ? data.projects.map(project => ({
                name: typeof project.name === 'string' ? project.name : '',
                description: typeof project.description === 'string' ? project.description : '',
                url: typeof project.url === 'string' ? project.url : '',
                technologies: Array.isArray(project.technologies) 
                    ? project.technologies.filter(tech => typeof tech === 'string')
                    : []
            }))
            : [];
        
        sanitized.certifications = Array.isArray(data.certifications) 
            ? data.certifications.map(cert => ({
                name: typeof cert.name === 'string' ? cert.name : '',
                issuer: typeof cert.issuer === 'string' ? cert.issuer : '',
                date: typeof cert.date === 'string' ? cert.date : '',
                expiry: typeof cert.expiry === 'string' ? cert.expiry : ''
            }))
            : [];
        
        sanitized.achievements = Array.isArray(data.achievements) 
            ? data.achievements.filter(achievement => typeof achievement === 'string')
            : [];
        
        // console.log('🔍 Final sanitized data:', sanitized);
        return sanitized;
    };

    // Sanitize the resume data
    const safeResumeData = sanitizeData(resumeData);

    // Comprehensive safety function to prevent object rendering
    const safeRender = (value, fallback = '') => {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        if (typeof value === 'boolean') return String(value);
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : fallback;
            }
            return fallback; // Don't render objects directly
        }
        return String(value);
    };

    // Safe array render function
    const safeArrayRender = (array, renderItem, fallback = null) => {
        if (!array || !Array.isArray(array) || array.length === 0) return fallback;
        return array.map(renderItem);
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!token || !safeResumeData || hasFetchedRecommendations.current) return;
            
            hasFetchedRecommendations.current = true;
            setIsLoading(true);
            try {
                const response = await fetch(buildApiUrl('/api/resumes/recommendations'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRecommendations(data);
                    // console.log('AI recommendations loaded:', data);
                } else {
                    // console.error('Failed to fetch recommendations');
                    hasFetchedRecommendations.current = false; // Reset flag on error
                }
            } catch (error) {
                // console.error('Error fetching recommendations:', error);
                hasFetchedRecommendations.current = false; // Reset flag on error
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRecommendations();
    }, [token, safeResumeData]);

    if (!safeResumeData) {
        return (
            <div className="resume_profile_empty">
                <div className="empty_state">
                    <FontAwesomeIcon icon={faUser} className="empty_icon" />
                    <h3>No Resume Data</h3>
                    <p>Upload your resume to see your profile information and AI recommendations.</p>
                    <div className="empty_state_actions">
                        <button className="btn btn_primary" onClick={onEdit}>
                            <FontAwesomeIcon icon={faEdit} />
                            Upload Resume
                        </button>
                        <button className="btn btn_secondary" onClick={() => navigate('/jobs')}>
                            <FontAwesomeIcon icon={faSearch} />
                            Browse Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { personal_info, summary, skills, experience, education, projects, certifications, achievements } = safeResumeData;

    // Helper function to check if a section has data
    const hasData = (data) => {
        if (Array.isArray(data)) return data.length > 0;
        if (typeof data === 'object') return data && Object.keys(data).length > 0;
        return !!data;
    };

    // Helper function to render skills
    const renderSkills = () => {
        // console.log('🔍 renderSkills called');
        // console.log('🔍 Skills data received:', skills);
        // console.log('🔍 Has data check:', hasData(skills));
        // console.log('🔍 Skills type:', typeof skills);
        
        if (!skills) {
            // console.log('❌ Skills is null/undefined');
            return (
                <section className="profile_section skills_section">
                    <div className="section_header">
                        <h3>Skills</h3>
                    </div>
                    <div className="skills_content">
                        <p className="no_data_message">No skills information available</p>
                    </div>
                </section>
            );
        }

        // Extract skills from the object structure
        const technicalSkills = skills.technical_skills || [];
        const softSkills = skills.soft_skills || [];
        const languages = skills.languages || [];

        // Remove excessive debug logging
        // console.log('🔍 Processed skills - Technical:', technicalSkills);
        // console.log('🔍 Processed skills - Soft:', softSkills);
        // console.log('🔍 Processed skills - Languages:', languages);

        // Show the section even if no skills, but provide helpful message
        if (technicalSkills.length === 0 && softSkills.length === 0 && languages.length === 0) {
            return (
                <section className="profile_section skills_section">
                    <div className="section_header">
                        <FontAwesomeIcon icon={faCode} className="section_icon" />
                        <h2>Skills & Expertise</h2>
                    </div>
                    <div className="skills_container">
                        <p className="no_data_message">Skills will be extracted from your resume. Try uploading it again if no skills appear.</p>
                    </div>
                </section>
            );
        }

        return (
            <section className="profile_section skills_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faCode} className="section_icon" />
                    <h2>Skills & Expertise</h2>
                </div>
                <div className="skills_container">
                    {technicalSkills.length > 0 && (
                        <div className="skills_group">
                            <h3><FontAwesomeIcon icon={faCode} /> Technical Skills</h3>
                            <div className="skills_list">
                                {technicalSkills.map((skill, index) => (
                                    <span key={index} className="skill_tag technical">
                                        {safeRender(skill)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {softSkills.length > 0 && (
                        <div className="skills_group">
                            <h3><FontAwesomeIcon icon={faLightbulb} /> Soft Skills</h3>
                            <div className="skills_list">
                                {softSkills.map((skill, index) => (
                                    <span key={index} className="skill_tag soft">
                                        {safeRender(skill)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {languages.length > 0 && (
                        <div className="skills_group">
                            <h3><FontAwesomeIcon icon={faGlobe} /> Languages</h3>
                            <div className="skills_list">
                                {languages.map((language, index) => (
                                    <span key={index} className="skill_tag language">
                                        {safeRender(language)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    // Helper function to render experience
    const renderExperience = () => {
        if (!hasData(experience)) return null;

        return (
            <section className="profile_section experience_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faBriefcase} className="section_icon" />
                    <h2>Professional Experience</h2>
                </div>
                <div className="experience_list">
                    {Array.isArray(experience) && experience.map((exp, index) => (
                        <div key={index} className="experience_item">
                            <div className="experience_header">
                                <div className="experience_title">
                                    <h3>{safeRender(exp.title)}</h3>
                                    <span className="company_name">
                                        <FontAwesomeIcon icon={faBuilding} />
                                        {safeRender(exp.company)}
                                    </span>
                                </div>
                                <div className="experience_meta">
                                    <span className="duration">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        {safeRender(exp.duration)}
                                    </span>
                                </div>
                            </div>
                            <p className="experience_description">{safeRender(exp.description)}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Helper function to render education
    const renderEducation = () => {
        if (!hasData(education)) return null;

        return (
            <section className="profile_section education_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faGraduationCap} className="section_icon" />
                    <h2>Education</h2>
                </div>
                <div className="education_list">
                    {Array.isArray(education) && education.map((edu, index) => (
                        <div key={index} className="education_item">
                            <div className="education_header">
                                <h3>{edu.degree}</h3>
                                <span className="institution">
                                    <FontAwesomeIcon icon={faBuilding} />
                                    {edu.institution}
                                </span>
                                <span className="graduation_year">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    {edu.graduation_year}
                                </span>
                            </div>
                            {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Helper function to render projects
    const renderProjects = () => {
        if (!hasData(projects)) return null;

        return (
            <section className="profile_section projects_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faProjectDiagram} className="section_icon" />
                    <h2>Projects</h2>
                </div>
                <div className="projects_list">
                    {Array.isArray(projects) && projects.map((project, index) => (
                        <div key={index} className="project_item">
                            <div className="project_header">
                                <h3>{safeRender(project.name)}</h3>
                                {project.url && (
                                    <a href={safeRender(project.url)} target="_blank" rel="noopener noreferrer" className="project_link">
                                        <FontAwesomeIcon icon={faEye} />
                                        View Project
                                    </a>
                                )}
                            </div>
                            <p className="project_description">{safeRender(project.description)}</p>
                            {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                <div className="project_technologies">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span key={techIndex} className="tech_tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Helper function to render certifications
    const renderCertifications = () => {
        if (!hasData(certifications)) return null;

        return (
            <section className="profile_section certifications_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faCertificate} className="section_icon" />
                    <h2>Certifications</h2>
                </div>
                <div className="certifications_list">
                    {Array.isArray(certifications) && certifications.map((cert, index) => (
                        <div key={index} className="certification_item">
                            <h3>{cert.name}</h3>
                            <p className="issuer">Issued by: {cert.issuer}</p>
                            <p className="date">Date: {cert.date}</p>
                            {cert.expiry && <p className="expiry">Expires: {cert.expiry}</p>}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Helper function to render achievements
    const renderAchievements = () => {
        if (!hasData(achievements)) return null;

        return (
            <section className="profile_section achievements_section">
                <div className="section_header">
                    <FontAwesomeIcon icon={faTrophy} className="section_icon" />
                    <h2>Achievements</h2>
                </div>
                <div className="achievements_list">
                    {Array.isArray(achievements) && achievements.map((achievement, index) => (
                        <div key={index} className="achievement_item">
                            <FontAwesomeIcon icon={faStar} className="achievement_icon" />
                            <span>{achievement}</span>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="resume_profile">
            {/* Header Section */}
            <div className="profile_header">
                <div className="profile_avatar">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="profile_info">
                    <h1>{personal_info?.name || 'Your Name'}</h1>
                    {resumeData?.job_title && (
                        <div className="profile_job_title">
                            <FontAwesomeIcon icon={faBriefcase} className="job_title_icon" />
                            <span>{resumeData.job_title}</span>
                        </div>
                    )}
                    {summary && <p className="profile_summary">{summary}</p>}
                    <div className="profile_contact">
                        {personal_info?.email && (
                            <div className="contact_item">
                                <FontAwesomeIcon icon={faEnvelope} />
                                <span>{personal_info.email}</span>
                            </div>
                        )}
                        {personal_info?.phone && (
                            <div className="contact_item">
                                <FontAwesomeIcon icon={faPhone} />
                                <span>{personal_info.phone}</span>
                            </div>
                        )}
                        {personal_info?.location && (
                            <div className="contact_item">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                <span>{personal_info.location}</span>
                            </div>
                        )}
                        {personal_info?.linkedin && (
                            <div className="contact_item">
                                <FontAwesomeIcon icon={faLinkedin} />
                                <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer">
                                    LinkedIn Profile
                                </a>
                            </div>
                        )}
                        {personal_info?.github && (
                            <div className="contact_item">
                                <FontAwesomeIcon icon={faGithub} />
                                <a href={personal_info.github} target="_blank" rel="noopener noreferrer">
                                    GitHub Profile
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile_actions">
                    <button className="btn btn_primary" onClick={onEdit}>
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="profile_content">
                <div className="profile_main">
                    {/* Skills Section */}
                    {renderSkills()}

                    {/* Experience Section */}
                    {renderExperience()}

                    {/* Education Section */}
                    {renderEducation()}

                    {/* Projects Section */}
                    {renderProjects()}

                    {/* Certifications Section */}
                    {renderCertifications()}

                    {/* Achievements Section */}
                    {renderAchievements()}
                </div>

                {/* Sidebar with Recommendations */}
                <div className="profile_sidebar">
                    <div className="sidebar_section">
                        <h3><FontAwesomeIcon icon={faLightbulb} /> AI Recommendations</h3>
                        {isLoading ? (
                            <div className="loading_recommendations">
                                <FontAwesomeIcon icon={faStar} className="spinner" />
                                <span>Generating recommendations...</span>
                            </div>
                        ) : recommendations && typeof recommendations === 'object' ? (
                            <div className="recommendations_content">
                                {recommendations.career_path && (
                                    <div className="recommendation_group">
                                        <h4><FontAwesomeIcon icon={faBriefcase} /> Career Path</h4>
                                        <ul>
                                            {recommendations.career_path.suggested_roles && Array.isArray(recommendations.career_path.suggested_roles) && recommendations.career_path.suggested_roles.map((role, index) => (
                                                <li key={index}>{role}</li>
                                            ))}
                                        </ul>
                                        {recommendations.career_path.next_steps && Array.isArray(recommendations.career_path.next_steps) && (
                                            <div className="next_steps">
                                                <h5>Next Steps:</h5>
                                                <ul>
                                                    {recommendations.career_path.next_steps.map((step, index) => (
                                                        <li key={index}>{step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {recommendations.skill_development && (
                                    <div className="recommendation_group">
                                        <h4><FontAwesomeIcon icon={faCode} /> Skill Development</h4>
                                        <ul>
                                            {recommendations.skill_development.recommended_skills && Array.isArray(recommendations.skill_development.recommended_skills) && recommendations.skill_development.recommended_skills.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                        {recommendations.skill_development.learning_resources && Array.isArray(recommendations.skill_development.learning_resources) && (
                                            <div className="learning_resources">
                                                <h5>Learning Resources:</h5>
                                                <ul>
                                                    {recommendations.skill_development.learning_resources.map((resource, index) => (
                                                        <li key={index}>{resource}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {recommendations.job_search && (
                                    <div className="recommendation_group">
                                        <h4><FontAwesomeIcon icon={faSearch} /> Job Search</h4>
                                        {recommendations.job_search.industry_focus && Array.isArray(recommendations.job_search.industry_focus) && (
                                            <p><strong>Target Industries:</strong> {recommendations.job_search.industry_focus.join(', ')}</p>
                                        )}
                                        {recommendations.job_search.salary_range && typeof recommendations.job_search.salary_range === 'string' && (
                                            <p><strong>Salary Range:</strong> {recommendations.job_search.salary_range}</p>
                                        )}
                                        {recommendations.job_search.target_companies && Array.isArray(recommendations.job_search.target_companies) && (
                                            <div className="target_companies">
                                                <h5>Target Companies:</h5>
                                                <ul>
                                                    {recommendations.job_search.target_companies.map((company, index) => (
                                                        <li key={index}>{company}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {recommendations.networking && (
                                    <div className="recommendation_group">
                                        <h4><FontAwesomeIcon icon={faGlobe} /> Networking</h4>
                                        {recommendations.networking.professional_groups && Array.isArray(recommendations.networking.professional_groups) && (
                                            <div className="professional_groups">
                                                <h5>Professional Groups:</h5>
                                                <ul>
                                                    {recommendations.networking.professional_groups.map((group, index) => (
                                                        <li key={index}>{group}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no_recommendations">
                                <FontAwesomeIcon icon={faLightbulb} className="no_rec_icon" />
                                <p>Upload your resume to get AI-powered recommendations.</p>
                                <button className="btn btn_secondary" onClick={() => navigate('/jobs')}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    Browse Available Jobs
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeProfile;
