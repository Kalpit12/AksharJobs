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
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [editedSkills, setEditedSkills] = useState({
        technical_skills: [],
        soft_skills: [],
        languages: []
    });
    
    // Edit states for all sections
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [isEditingProjects, setIsEditingProjects] = useState(false);
    
    // Edited data states
    const [editedPersonal, setEditedPersonal] = useState({});
    const [editedExperience, setEditedExperience] = useState([]);
    const [editedEducation, setEditedEducation] = useState([]);
    const [editedProjects, setEditedProjects] = useState([]);
    const navigate = useNavigate();
    const hasFetchedRecommendations = useRef(false);

    // Initialize edited data when resumeData changes
    useEffect(() => {
        if (resumeData) {
            // Initialize skills
            if (resumeData.skills) {
                setEditedSkills({
                    technical_skills: resumeData.skills.technical_skills || [],
                    soft_skills: resumeData.skills.soft_skills || [],
                    languages: resumeData.skills.languages || []
                });
            }
            
            // Initialize personal info
            if (resumeData.personal_info) {
                setEditedPersonal({
                    name: resumeData.personal_info.name || '',
                    email: resumeData.personal_info.email || '',
                    phone: resumeData.personal_info.phone || '',
                    location: resumeData.personal_info.location || '',
                    currentAddress: resumeData.personal_info.currentAddress || '',
                    currentAddressPin: resumeData.personal_info.currentAddressPin || '',
                    homeAddress: resumeData.personal_info.homeAddress || '',
                    homeAddressPin: resumeData.personal_info.homeAddressPin || '',
                    commuteOptions: resumeData.personal_info.commuteOptions || [],
                    linkedin: resumeData.personal_info.linkedin || '',
                    github: resumeData.personal_info.github || ''
                });
            }
            
            // Initialize experience
            if (resumeData.experience) {
                setEditedExperience([...resumeData.experience]);
            }
            
            // Initialize education
            if (resumeData.education) {
                setEditedEducation([...resumeData.education]);
            }
            
            // Initialize projects
            if (resumeData.projects) {
                setEditedProjects([...resumeData.projects]);
            }
        }
    }, [resumeData]);

    // Handle skills editing functions
    const handleSaveSkills = async () => {
        try {
            setIsLoading(true);
            
            // Validate that we have at least some skills
            const hasSkills = editedSkills.technical_skills.length > 0 || 
                             editedSkills.soft_skills.length > 0 || 
                             editedSkills.languages.length > 0;
            
            if (!hasSkills) {
                alert('Please add at least one skill before saving.');
                setIsLoading(false);
                return;
            }
            
            const response = await fetch(buildApiUrl('/api/modern-resumes/update-skills'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ skills: editedSkills })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Skills updated successfully:', result);
                
                // Update the local resume data with new skills
                if (resumeData) {
                    resumeData.skills = editedSkills;
                }
                
                setIsEditingSkills(false);
                
                // Show success message
                alert('Skills updated successfully!');
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to update skills:', errorData);
                alert(`Failed to update skills: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('❌ Error updating skills:', error);
            
            // Check if it's a network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                alert('Network error: Please check if the backend server is running.');
            } else {
                alert('An error occurred while updating skills. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset to original skills
        if (resumeData?.skills) {
            setEditedSkills({
                technical_skills: resumeData.skills.technical_skills || [],
                soft_skills: resumeData.skills.soft_skills || [],
                languages: resumeData.skills.languages || []
            });
        }
        setIsEditingSkills(false);
    };

    const handleAddSkill = (category, skill) => {
        if (skill.trim()) {
            setEditedSkills(prev => ({
                ...prev,
                [category]: [...prev[category], skill.trim()]
            }));
        }
    };

    const handleRemoveSkill = (category, index) => {
        setEditedSkills(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    // Personal Info Edit Functions
    const handleSavePersonal = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(buildApiUrl('/api/modern-resumes/update-personal'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personal_info: editedPersonal })
            });

            if (response.ok) {
                if (resumeData) {
                    resumeData.personal_info = editedPersonal;
                }
                setIsEditingPersonal(false);
                alert('Personal information updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to update personal info: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating personal info:', error);
            alert('Network error: Please check if the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    // Experience Edit Functions
    const handleSaveExperience = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(buildApiUrl('/api/modern-resumes/update-experience'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ experience: editedExperience })
            });

            if (response.ok) {
                if (resumeData) {
                    resumeData.experience = editedExperience;
                }
                setIsEditingExperience(false);
                alert('Experience updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to update experience: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating experience:', error);
            alert('Network error: Please check if the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExperience = () => {
        setEditedExperience(prev => [...prev, {
            title: '',
            company: '',
            duration: '',
            description: ''
        }]);
    };

    const handleRemoveExperience = (index) => {
        setEditedExperience(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateExperience = (index, field, value) => {
        setEditedExperience(prev => prev.map((exp, i) => 
            i === index ? { ...exp, [field]: value } : exp
        ));
    };

    // Education Edit Functions
    const handleSaveEducation = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(buildApiUrl('/api/modern-resumes/update-education'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ education: editedEducation })
            });

            if (response.ok) {
                if (resumeData) {
                    resumeData.education = editedEducation;
                }
                setIsEditingEducation(false);
                alert('Education updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to update education: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating education:', error);
            alert('Network error: Please check if the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEducation = () => {
        setEditedEducation(prev => [...prev, {
            degree: '',
            institution: '',
            graduation_year: '',
            gpa: ''
        }]);
    };

    const handleRemoveEducation = (index) => {
        setEditedEducation(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateEducation = (index, field, value) => {
        setEditedEducation(prev => prev.map((edu, i) => 
            i === index ? { ...edu, [field]: value } : edu
        ));
    };

    // Projects Edit Functions
    const handleSaveProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(buildApiUrl('/api/modern-resumes/update-projects'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projects: editedProjects })
            });

            if (response.ok) {
                if (resumeData) {
                    resumeData.projects = editedProjects;
                }
                setIsEditingProjects(false);
                alert('Projects updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to update projects: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating projects:', error);
            alert('Network error: Please check if the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = () => {
        setEditedProjects(prev => [...prev, {
            name: '',
            description: '',
            url: '',
            technologies: []
        }]);
    };

    const handleRemoveProject = (index) => {
        setEditedProjects(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateProject = (index, field, value) => {
        setEditedProjects(prev => prev.map((project, i) => 
            i === index ? { ...project, [field]: value } : project
        ));
    };

    // Cancel functions for all sections
    const handleCancelPersonal = () => {
        if (resumeData?.personal_info) {
            setEditedPersonal({
                name: resumeData.personal_info.name || '',
                email: resumeData.personal_info.email || '',
                phone: resumeData.personal_info.phone || '',
                location: resumeData.personal_info.location || '',
                currentAddress: resumeData.personal_info.currentAddress || '',
                currentAddressPin: resumeData.personal_info.currentAddressPin || '',
                homeAddress: resumeData.personal_info.homeAddress || '',
                homeAddressPin: resumeData.personal_info.homeAddressPin || '',
                commuteOptions: resumeData.personal_info.commuteOptions || [],
                linkedin: resumeData.personal_info.linkedin || '',
                github: resumeData.personal_info.github || ''
            });
        }
        setIsEditingPersonal(false);
    };

    const handleCancelExperience = () => {
        if (resumeData?.experience) {
            setEditedExperience([...resumeData.experience]);
        }
        setIsEditingExperience(false);
    };

    const handleCancelEducation = () => {
        if (resumeData?.education) {
            setEditedEducation([...resumeData.education]);
        }
        setIsEditingEducation(false);
    };

    const handleCancelProjects = () => {
        if (resumeData?.projects) {
            setEditedProjects([...resumeData.projects]);
        }
        setIsEditingProjects(false);
    };

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
                currentAddress: typeof data.personal_info.currentAddress === 'string' ? data.personal_info.currentAddress : '',
                currentAddressPin: typeof data.personal_info.currentAddressPin === 'string' ? data.personal_info.currentAddressPin : '',
                homeAddress: typeof data.personal_info.homeAddress === 'string' ? data.personal_info.homeAddress : '',
                homeAddressPin: typeof data.personal_info.homeAddressPin === 'string' ? data.personal_info.homeAddressPin : '',
                commuteOptions: Array.isArray(data.personal_info.commuteOptions) ? data.personal_info.commuteOptions : [],
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
                const response = await fetch(buildApiUrl('/api/modern-resumes/recommendations'), {
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
                    <div className="section_title_group">
                        <FontAwesomeIcon icon={faCode} className="section_icon" />
                        <h2>Skills & Expertise</h2>
                    </div>
                    <button 
                        className="edit_skills_btn"
                        onClick={() => setIsEditingSkills(true)}
                        title="Edit Skills"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Skills
                    </button>
                </div>
                <div className="skills_container">
                    {isEditingSkills ? (
                        // Edit Mode
                        <div className="skills_edit_form">
                            {/* Technical Skills Edit */}
                            <div className="skills_edit_group">
                                <h3><FontAwesomeIcon icon={faCode} /> Technical Skills</h3>
                                <div className="skills_edit_list">
                                    {editedSkills.technical_skills.map((skill, index) => (
                                        <div key={index} className="skill_edit_item">
                                            <span className="skill_tag technical">{skill}</span>
                                            <button 
                                                className="remove_skill_btn"
                                                onClick={() => handleRemoveSkill('technical_skills', index)}
                                                title="Remove skill"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <SkillInput 
                                        category="technical_skills"
                                        onAdd={handleAddSkill}
                                        placeholder="Add technical skill..."
                                    />
                                </div>
                            </div>

                            {/* Soft Skills Edit */}
                            <div className="skills_edit_group">
                                <h3><FontAwesomeIcon icon={faLightbulb} /> Soft Skills</h3>
                                <div className="skills_edit_list">
                                    {editedSkills.soft_skills.map((skill, index) => (
                                        <div key={index} className="skill_edit_item">
                                            <span className="skill_tag soft">{skill}</span>
                                            <button 
                                                className="remove_skill_btn"
                                                onClick={() => handleRemoveSkill('soft_skills', index)}
                                                title="Remove skill"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <SkillInput 
                                        category="soft_skills"
                                        onAdd={handleAddSkill}
                                        placeholder="Add soft skill..."
                                    />
                                </div>
                            </div>

                            {/* Languages Edit */}
                            <div className="skills_edit_group">
                                <h3><FontAwesomeIcon icon={faGlobe} /> Languages</h3>
                                <div className="skills_edit_list">
                                    {editedSkills.languages.map((language, index) => (
                                        <div key={index} className="skill_edit_item">
                                            <span className="skill_tag language">{language}</span>
                                            <button 
                                                className="remove_skill_btn"
                                                onClick={() => handleRemoveSkill('languages', index)}
                                                title="Remove language"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <SkillInput 
                                        category="languages"
                                        onAdd={handleAddSkill}
                                        placeholder="Add language..."
                                    />
                                </div>
                            </div>

                            {/* Edit Actions */}
                            <div className="skills_edit_actions">
                                <button 
                                    className="btn btn_secondary"
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn_primary"
                                    onClick={handleSaveSkills}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <>
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
                        </>
                    )}
                </div>
            </section>
        );
    };

    // Helper function to render experience
    const renderExperience = () => {
        if (!hasData(experience) && !isEditingExperience) return null;

        return (
            <section className="profile_section experience_section">
                <div className="section_header">
                    <div className="section_title_group">
                        <FontAwesomeIcon icon={faBriefcase} className="section_icon" />
                        <h2>Professional Experience</h2>
                    </div>
                    <button 
                        className="edit_skills_btn"
                        onClick={() => setIsEditingExperience(true)}
                        title="Edit Experience"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Experience
                    </button>
                </div>
                
                {isEditingExperience ? (
                    // Experience Edit Mode
                    <div className="experience_edit_form">
                        {editedExperience.map((exp, index) => (
                            <div key={index} className="experience_edit_item">
                                <div className="edit_item_header">
                                    <h4>Experience {index + 1}</h4>
                                    <button 
                                        className="remove_item_btn"
                                        onClick={() => handleRemoveExperience(index)}
                                        title="Remove experience"
                                    >
                                        <FontAwesomeIcon icon={faUser} />
                                    </button>
                                </div>
                                <div className="edit_fields_grid">
                                    <div className="edit_field">
                                        <label>Job Title</label>
                                        <input
                                            type="text"
                                            value={exp.title || ''}
                                            onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                                            className="edit_input"
                                            placeholder="Enter job title"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company || ''}
                                            onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                                            className="edit_input"
                                            placeholder="Enter company name"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            value={exp.duration || ''}
                                            onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)}
                                            className="edit_input"
                                            placeholder="e.g., Jan 2020 - Present"
                                        />
                                    </div>
                                    <div className="edit_field full_width">
                                        <label>Description</label>
                                        <textarea
                                            value={exp.description || ''}
                                            onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                                            className="edit_textarea"
                                            placeholder="Describe your responsibilities and achievements"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button className="add_item_btn" onClick={handleAddExperience}>
                            <FontAwesomeIcon icon={faUser} />
                            Add Experience
                        </button>
                        
                        <div className="edit_actions">
                            <button className="btn btn_secondary" onClick={handleCancelExperience} disabled={isLoading}>
                                Cancel
                            </button>
                            <button className="btn btn_primary" onClick={handleSaveExperience} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Experience View Mode
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
                )}
            </section>
        );
    };

    // Helper function to render education
    const renderEducation = () => {
        if (!hasData(education) && !isEditingEducation) return null;

        return (
            <section className="profile_section education_section">
                <div className="section_header">
                    <div className="section_title_group">
                        <FontAwesomeIcon icon={faGraduationCap} className="section_icon" />
                        <h2>Education</h2>
                    </div>
                    <button 
                        className="edit_skills_btn"
                        onClick={() => setIsEditingEducation(true)}
                        title="Edit Education"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Education
                    </button>
                </div>
                
                {isEditingEducation ? (
                    // Education Edit Mode
                    <div className="education_edit_form">
                        {editedEducation.map((edu, index) => (
                            <div key={index} className="education_edit_item">
                                <div className="edit_item_header">
                                    <h4>Education {index + 1}</h4>
                                    <button 
                                        className="remove_item_btn"
                                        onClick={() => handleRemoveEducation(index)}
                                        title="Remove education"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="edit_fields_grid">
                                    <div className="edit_field">
                                        <label>Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree || ''}
                                            onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                                            className="edit_input"
                                            placeholder="e.g., Bachelor of Science in Computer Science"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>Institution</label>
                                        <input
                                            type="text"
                                            value={edu.institution || ''}
                                            onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                                            className="edit_input"
                                            placeholder="Enter institution name"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>Graduation Year</label>
                                        <input
                                            type="text"
                                            value={edu.graduation_year || ''}
                                            onChange={(e) => handleUpdateEducation(index, 'graduation_year', e.target.value)}
                                            className="edit_input"
                                            placeholder="e.g., 2020"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>GPA (Optional)</label>
                                        <input
                                            type="text"
                                            value={edu.gpa || ''}
                                            onChange={(e) => handleUpdateEducation(index, 'gpa', e.target.value)}
                                            className="edit_input"
                                            placeholder="e.g., 3.8/4.0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button className="add_item_btn" onClick={handleAddEducation}>
                            <FontAwesomeIcon icon={faGraduationCap} />
                            Add Education
                        </button>
                        
                        <div className="edit_actions">
                            <button className="btn btn_secondary" onClick={handleCancelEducation} disabled={isLoading}>
                                Cancel
                            </button>
                            <button className="btn btn_primary" onClick={handleSaveEducation} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Education View Mode
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
                )}
            </section>
        );
    };

    // Helper function to render projects
    const renderProjects = () => {
        if (!hasData(projects) && !isEditingProjects) return null;

        return (
            <section className="profile_section projects_section">
                <div className="section_header">
                    <div className="section_title_group">
                        <FontAwesomeIcon icon={faProjectDiagram} className="section_icon" />
                        <h2>Projects</h2>
                    </div>
                    <button 
                        className="edit_skills_btn"
                        onClick={() => setIsEditingProjects(true)}
                        title="Edit Projects"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Projects
                    </button>
                </div>
                
                {isEditingProjects ? (
                    // Projects Edit Mode
                    <div className="projects_edit_form">
                        {editedProjects.map((project, index) => (
                            <div key={index} className="project_edit_item">
                                <div className="edit_item_header">
                                    <h4>Project {index + 1}</h4>
                                    <button 
                                        className="remove_item_btn"
                                        onClick={() => handleRemoveProject(index)}
                                        title="Remove project"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="edit_fields_grid">
                                    <div className="edit_field">
                                        <label>Project Name</label>
                                        <input
                                            type="text"
                                            value={project.name || ''}
                                            onChange={(e) => handleUpdateProject(index, 'name', e.target.value)}
                                            className="edit_input"
                                            placeholder="Enter project name"
                                        />
                                    </div>
                                    <div className="edit_field">
                                        <label>Project URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={project.url || ''}
                                            onChange={(e) => handleUpdateProject(index, 'url', e.target.value)}
                                            className="edit_input"
                                            placeholder="Enter project URL"
                                        />
                                    </div>
                                    <div className="edit_field full_width">
                                        <label>Description</label>
                                        <textarea
                                            value={project.description || ''}
                                            onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                                            className="edit_textarea"
                                            placeholder="Describe the project and your role"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="edit_field full_width">
                                        <label>Technologies Used</label>
                                        <input
                                            type="text"
                                            value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                                            onChange={(e) => handleUpdateProject(index, 'technologies', e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech))}
                                            className="edit_input"
                                            placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button className="add_item_btn" onClick={handleAddProject}>
                            <FontAwesomeIcon icon={faProjectDiagram} />
                            Add Project
                        </button>
                        
                        <div className="edit_actions">
                            <button className="btn btn_secondary" onClick={handleCancelProjects} disabled={isLoading}>
                                Cancel
                            </button>
                            <button className="btn btn_primary" onClick={handleSaveProjects} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Projects View Mode
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
                )}
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
                    {isEditingPersonal ? (
                        // Personal Info Edit Mode
                        <div className="personal_edit_form">
                            <div className="edit_field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={editedPersonal.name || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, name: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editedPersonal.email || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, email: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={editedPersonal.phone || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, phone: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={editedPersonal.location || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, location: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your location"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Currently Address: 📍</label>
                                <input
                                    type="text"
                                    value={editedPersonal.currentAddress || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, currentAddress: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your current address"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Current Address Pin</label>
                                <input
                                    type="text"
                                    value={editedPersonal.currentAddressPin || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, currentAddressPin: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter PIN code"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Home: 📍</label>
                                <input
                                    type="text"
                                    value={editedPersonal.homeAddress || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, homeAddress: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your home address"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Home Address Pin</label>
                                <input
                                    type="text"
                                    value={editedPersonal.homeAddressPin || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, homeAddressPin: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter PIN code"
                                />
                            </div>
                            <div className="edit_field">
                                <label>Commute Options to Work Place</label>
                                <div className="commute-container">
                                    <div className="commute-input-container">
                                        <select
                                            onChange={(e) => {
                                                const option = e.target.value;
                                                if (option && option !== '' && !editedPersonal.commuteOptions.includes(option)) {
                                                    setEditedPersonal(prev => ({
                                                        ...prev,
                                                        commuteOptions: [...prev.commuteOptions, option]
                                                    }));
                                                    e.target.value = ''; // Reset dropdown
                                                }
                                            }}
                                            defaultValue=""
                                            className="commute-dropdown edit_input"
                                        >
                                            <option value="">Select a commute option</option>
                                            <option value="Walking">🚶 Walking</option>
                                            <option value="Cycling">🚴 Cycling</option>
                                            <option value="Public Transport">🚌 Public Transport</option>
                                            <option value="Bus">🚌 Bus</option>
                                            <option value="Metro/Subway">🚇 Metro/Subway</option>
                                            <option value="Train">🚆 Train</option>
                                            <option value="Motorcycle/Scooter">🏍️ Motorcycle/Scooter</option>
                                            <option value="Car (Own)">🚗 Car (Own)</option>
                                            <option value="Car (Shared)">🚗 Car (Shared)</option>
                                            <option value="Taxi/Uber/Ola">🚕 Taxi/Uber/Ola</option>
                                            <option value="Auto Rickshaw">🛺 Auto Rickshaw</option>
                                            <option value="Company Transport">🚐 Company Transport</option>
                                            <option value="Work from Home">🏠 Work from Home</option>
                                            <option value="Hybrid (Office + WFH)">🏢 Hybrid (Office + WFH)</option>
                                        </select>
                                    </div>
                                    <div className="commute-list">
                                        {editedPersonal.commuteOptions.map((option, index) => (
                                            <span key={index} className="commute-tag">
                                                {option}
                                                <button
                                                    type="button"
                                                    className="commute-remove"
                                                    onClick={() => {
                                                        setEditedPersonal(prev => ({
                                                            ...prev,
                                                            commuteOptions: prev.commuteOptions.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="commute-custom-input">
                                        <input
                                            type="text"
                                            placeholder="Or add custom option and press Enter"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const option = e.target.value.trim();
                                                    if (option && !editedPersonal.commuteOptions.includes(option)) {
                                                        setEditedPersonal(prev => ({
                                                            ...prev,
                                                            commuteOptions: [...prev.commuteOptions, option]
                                                        }));
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                            className="edit_input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="edit_field">
                                <label>LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={editedPersonal.linkedin || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, linkedin: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your LinkedIn URL"
                                />
                            </div>
                            <div className="edit_field">
                                <label>GitHub URL</label>
                                <input
                                    type="url"
                                    value={editedPersonal.github || ''}
                                    onChange={(e) => setEditedPersonal(prev => ({...prev, github: e.target.value}))}
                                    className="edit_input"
                                    placeholder="Enter your GitHub URL"
                                />
                            </div>
                            <div className="edit_actions">
                                <button className="btn btn_secondary" onClick={handleCancelPersonal} disabled={isLoading}>
                                    Cancel
                                </button>
                                <button className="btn btn_primary" onClick={handleSavePersonal} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Personal Info View Mode
                        <>
                            <h1>{personal_info?.name || 'Your Name'}</h1>
                            {(() => {
                                // Extract job title from resume data with multiple fallbacks
                                const jobTitle = resumeData?.personal_info?.job_title || 
                                               resumeData?.job_title || 
                                               resumeData?.experience?.[0]?.title ||
                                               resumeData?.personal_info?.title;
                                
                                if (jobTitle) {
                                    return (
                                        <div className="profile_job_title">
                                            <FontAwesomeIcon icon={faBriefcase} className="job_title_icon" />
                                            <span>{jobTitle}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
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
                                {personal_info?.currentAddress && (
                                    <div className="contact_item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>Current Address 📍: {personal_info.currentAddress}{personal_info.currentAddressPin ? ` - ${personal_info.currentAddressPin}` : ''}</span>
                                    </div>
                                )}
                                {personal_info?.homeAddress && (
                                    <div className="contact_item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>Home 📍: {personal_info.homeAddress}{personal_info.homeAddressPin ? ` - ${personal_info.homeAddressPin}` : ''}</span>
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
                                {personal_info?.commuteOptions && personal_info.commuteOptions.length > 0 && (
                                    <div className="contact_item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <div>
                                            <span>Commute Options: </span>
                                            <div className="commute-options-display">
                                                {personal_info.commuteOptions.map((option, index) => (
                                                    <span key={index} className="commute-option-display">
                                                        {option}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="profile_actions">
                    <button 
                        className="btn btn_primary" 
                        onClick={() => setIsEditingPersonal(true)}
                        disabled={isEditingPersonal}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Personal Info
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

// SkillInput Component for adding new skills
const SkillInput = ({ category, onAdd, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(category, inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleDropdownChange = (e) => {
        const skill = e.target.value;
        if (skill && skill !== '') {
            onAdd(category, skill);
            e.target.value = ''; // Reset dropdown
        }
    };

    // Define skill options based on category
    const getSkillOptions = () => {
        switch (category) {
            case 'technical_skills':
                return [
                    { value: 'JavaScript', label: '💻 JavaScript' },
                    { value: 'Python', label: '🐍 Python' },
                    { value: 'Java', label: '☕ Java' },
                    { value: 'React', label: '⚛️ React' },
                    { value: 'Node.js', label: '🟢 Node.js' },
                    { value: 'HTML/CSS', label: '🎨 HTML/CSS' },
                    { value: 'SQL', label: '🗄️ SQL' },
                    { value: 'Git', label: '📦 Git' },
                    { value: 'Docker', label: '🐳 Docker' },
                    { value: 'AWS', label: '☁️ AWS' },
                    { value: 'Machine Learning', label: '🤖 Machine Learning' },
                    { value: 'Data Analysis', label: '📊 Data Analysis' },
                    { value: 'C++', label: '⚡ C++' },
                    { value: 'C#', label: '🔷 C#' },
                    { value: 'PHP', label: '🐘 PHP' },
                    { value: 'Ruby', label: '💎 Ruby' },
                    { value: 'Go', label: '🐹 Go' },
                    { value: 'Rust', label: '🦀 Rust' },
                    { value: 'Swift', label: '🍎 Swift' },
                    { value: 'Kotlin', label: '🟣 Kotlin' }
                ];
            case 'soft_skills':
                return [
                    { value: 'Communication', label: '💬 Communication' },
                    { value: 'Leadership', label: '👥 Leadership' },
                    { value: 'Problem Solving', label: '🧩 Problem Solving' },
                    { value: 'Teamwork', label: '🤝 Teamwork' },
                    { value: 'Time Management', label: '⏰ Time Management' },
                    { value: 'Critical Thinking', label: '🧠 Critical Thinking' },
                    { value: 'Creativity', label: '🎨 Creativity' },
                    { value: 'Adaptability', label: '🔄 Adaptability' },
                    { value: 'Project Management', label: '📋 Project Management' },
                    { value: 'Negotiation', label: '🤝 Negotiation' },
                    { value: 'Public Speaking', label: '🎤 Public Speaking' },
                    { value: 'Analytical Thinking', label: '🔍 Analytical Thinking' },
                    { value: 'Emotional Intelligence', label: '❤️ Emotional Intelligence' },
                    { value: 'Conflict Resolution', label: '⚖️ Conflict Resolution' },
                    { value: 'Decision Making', label: '🎯 Decision Making' }
                ];
            case 'languages':
                return [
                    { value: 'English', label: '🇺🇸 English' },
                    { value: 'Spanish', label: '🇪🇸 Spanish' },
                    { value: 'French', label: '🇫🇷 French' },
                    { value: 'German', label: '🇩🇪 German' },
                    { value: 'Italian', label: '🇮🇹 Italian' },
                    { value: 'Portuguese', label: '🇵🇹 Portuguese' },
                    { value: 'Russian', label: '🇷🇺 Russian' },
                    { value: 'Chinese (Mandarin)', label: '🇨🇳 Chinese (Mandarin)' },
                    { value: 'Japanese', label: '🇯🇵 Japanese' },
                    { value: 'Korean', label: '🇰🇷 Korean' },
                    { value: 'Arabic', label: '🇸🇦 Arabic' },
                    { value: 'Hindi', label: '🇮🇳 Hindi' },
                    { value: 'Bengali', label: '🇧🇩 Bengali' },
                    { value: 'Urdu', label: '🇵🇰 Urdu' },
                    { value: 'Turkish', label: '🇹🇷 Turkish' }
                ];
            default:
                return [];
        }
    };

    return (
        <div className="skill_input_container">
            <select
                onChange={handleDropdownChange}
                defaultValue=""
                className="skill_dropdown"
            >
                <option value="">Select from common options</option>
                {getSkillOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="skill_input"
            />
            <button 
                type="button"
                onClick={handleSubmit}
                className="add_skill_btn"
                disabled={!inputValue.trim()}
            >
                +
            </button>
        </div>
    );
};

export default ResumeProfile;
