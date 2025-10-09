import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faMapMarkerAlt,
  faBriefcase, faGraduationCap, faProjectDiagram, faCertificate,
  faStar, faTrophy, faEdit, faDownload, faEye, faCalendarAlt,
  faBuilding, faGlobe, faCode, faLightbulb, faAward, faSearch,
  faPlus, faTrash, faSave, faMagic, faRobot, faCheckCircle,
  faArrowLeft, faFileAlt, faUpload, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState({
    personal_info: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(buildApiUrl('/api/modern-resumes/profile'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.resume_data) {
            setResumeData(data.resume_data);
          }
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [user?.token]);

  // AI-powered resume optimization
  const generateAIOptimization = async () => {
    if (!user?.token) return;
    
    try {
      setIsGenerating(true);
      const response = await fetch(buildApiUrl('/api/ai/resume-optimization'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resume_data: resumeData })
      });

      if (response.ok) {
        const suggestions = await response.json();
        setAiSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating AI optimization:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save resume data
  const saveResume = async () => {
    if (!user?.token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(buildApiUrl('/api/modern-resumes/save'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resume_data: resumeData })
      });

      if (response.ok) {
        alert('Resume saved successfully!');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new item to array
  const addItem = (section) => {
    const newItem = getDefaultItem(section);
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  // Remove item from array
  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Update item in array
  const updateItem = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Get default item structure
  const getDefaultItem = (section) => {
    const defaults = {
      experience: {
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: ''
      },
      education: {
        degree: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
        gpa: '',
        description: ''
      },
      skills: {
        name: '',
        level: 'Intermediate'
      },
      projects: {
        name: '',
        description: '',
        technologies: '',
        url: '',
        start_date: '',
        end_date: ''
      },
      certifications: {
        name: '',
        issuer: '',
        date: '',
        url: ''
      }
    };
    return defaults[section] || {};
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: faUser },
    { id: 'summary', label: 'Summary', icon: faFileAlt },
    { id: 'experience', label: 'Experience', icon: faBriefcase },
    { id: 'education', label: 'Education', icon: faGraduationCap },
    { id: 'skills', label: 'Skills', icon: faCode },
    { id: 'projects', label: 'Projects', icon: faProjectDiagram },
    { id: 'certifications', label: 'Certifications', icon: faCertificate }
  ];

  if (isLoading) {
    return (
      <div className="resume_builder_loading">
        <FontAwesomeIcon icon={faSpinner} className="spinner" />
        <p>Loading resume builder...</p>
      </div>
    );
  }

  return (
    <div className="resume_builder">
      {/* Header */}
      <div className="resume_builder_header">
        <button className="back_btn" onClick={() => navigate('/jobseeker-dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Dashboard
        </button>
        <h1>AI-Powered Resume Builder</h1>
        <div className="header_actions">
          <button 
            className="ai_optimize_btn" 
            onClick={generateAIOptimization}
            disabled={isGenerating}
          >
            <FontAwesomeIcon icon={isGenerating ? faSpinner : faMagic} className={isGenerating ? 'spinning' : ''} />
            {isGenerating ? 'Optimizing...' : 'AI Optimize'}
          </button>
          <button className="save_btn" onClick={saveResume}>
            <FontAwesomeIcon icon={faSave} />
            Save Resume
          </button>
        </div>
      </div>

      <div className="resume_builder_content">
        {/* Sidebar */}
        <div className="resume_builder_sidebar">
          <nav className="section_nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav_item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <FontAwesomeIcon icon={section.icon} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="resume_builder_main">
          {/* AI Suggestions Panel */}
          {aiSuggestions && (
            <div className="ai_suggestions_panel">
              <div className="panel_header">
                <FontAwesomeIcon icon={faRobot} />
                <h3>AI Suggestions</h3>
                <button onClick={() => setAiSuggestions(null)}>×</button>
              </div>
              <div className="suggestions_content">
                {aiSuggestions.summary_suggestions && (
                  <div className="suggestion_section">
                    <h4>Summary Improvements</h4>
                    <p>{aiSuggestions.summary_suggestions}</p>
                  </div>
                )}
                {aiSuggestions.skill_suggestions && (
                  <div className="suggestion_section">
                    <h4>Skill Recommendations</h4>
                    <ul>
                      {aiSuggestions.skill_suggestions.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiSuggestions.keywords && (
                  <div className="suggestion_section">
                    <h4>Keywords to Include</h4>
                    <div className="keyword_tags">
                      {aiSuggestions.keywords.map((keyword, index) => (
                        <span key={index} className="keyword_tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="form_content">
            {activeSection === 'personal' && (
              <PersonalInfoSection 
                data={resumeData.personal_info}
                onChange={(field, value) => setResumeData(prev => ({
                  ...prev,
                  personal_info: { ...prev.personal_info, [field]: value }
                }))}
              />
            )}

            {activeSection === 'summary' && (
              <SummarySection 
                data={resumeData.summary}
                onChange={(value) => setResumeData(prev => ({ ...prev, summary: value }))}
              />
            )}

            {activeSection === 'experience' && (
              <ExperienceSection 
                data={resumeData.experience}
                onAdd={() => addItem('experience')}
                onRemove={(index) => removeItem('experience', index)}
                onUpdate={(index, field, value) => updateItem('experience', index, field, value)}
              />
            )}

            {activeSection === 'education' && (
              <EducationSection 
                data={resumeData.education}
                onAdd={() => addItem('education')}
                onRemove={(index) => removeItem('education', index)}
                onUpdate={(index, field, value) => updateItem('education', index, field, value)}
              />
            )}

            {activeSection === 'skills' && (
              <SkillsSection 
                data={resumeData.skills}
                onAdd={() => addItem('skills')}
                onRemove={(index) => removeItem('skills', index)}
                onUpdate={(index, field, value) => updateItem('skills', index, field, value)}
              />
            )}

            {activeSection === 'projects' && (
              <ProjectsSection 
                data={resumeData.projects}
                onAdd={() => addItem('projects')}
                onRemove={(index) => removeItem('projects', index)}
                onUpdate={(index, field, value) => updateItem('projects', index, field, value)}
              />
            )}

            {activeSection === 'certifications' && (
              <CertificationsSection 
                data={resumeData.certifications}
                onAdd={() => addItem('certifications')}
                onRemove={(index) => removeItem('certifications', index)}
                onUpdate={(index, field, value) => updateItem('certifications', index, field, value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for Personal Information Section
const PersonalInfoSection = ({ data, onChange }) => (
  <div className="form_section">
    <h2>Personal Information</h2>
    <div className="form_grid">
      <div className="form_group">
        <label>Full Name *</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div className="form_group">
        <label>Email *</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className="form_group">
        <label>Phone</label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="form_group">
        <label>Location</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="City, State"
        />
      </div>
      <div className="form_group">
        <label>LinkedIn</label>
        <input
          type="url"
          value={data.linkedin || ''}
          onChange={(e) => onChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
      <div className="form_group">
        <label>GitHub</label>
        <input
          type="url"
          value={data.github || ''}
          onChange={(e) => onChange('github', e.target.value)}
          placeholder="https://github.com/yourusername"
        />
      </div>
    </div>
  </div>
);

// Component for Summary Section
const SummarySection = ({ data, onChange }) => (
  <div className="form_section">
    <h2>Professional Summary</h2>
    <div className="form_group">
      <label>Summary *</label>
      <textarea
        value={data || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a compelling summary of your professional background, key skills, and career objectives..."
        rows={6}
      />
      <small>Tip: Keep it concise (2-3 sentences) and highlight your most relevant experience.</small>
    </div>
  </div>
);

// Component for Experience Section
const ExperienceSection = ({ data, onAdd, onRemove, onUpdate }) => (
  <div className="form_section">
    <div className="section_header">
      <h2>Work Experience</h2>
      <button className="add_btn" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
        Add Experience
      </button>
    </div>
    {data.map((exp, index) => (
      <div key={index} className="experience_item">
        <div className="item_header">
          <h3>Experience #{index + 1}</h3>
          <button className="remove_btn" onClick={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div className="form_grid">
          <div className="form_group">
            <label>Job Title *</label>
            <input
              type="text"
              value={exp.title || ''}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="form_group">
            <label>Company *</label>
            <input
              type="text"
              value={exp.company || ''}
              onChange={(e) => onUpdate(index, 'company', e.target.value)}
              placeholder="e.g., Google"
            />
          </div>
          <div className="form_group">
            <label>Location</label>
            <input
              type="text"
              value={exp.location || ''}
              onChange={(e) => onUpdate(index, 'location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div className="form_group">
            <label>Start Date</label>
            <input
              type="month"
              value={exp.start_date || ''}
              onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>End Date</label>
            <input
              type="month"
              value={exp.end_date || ''}
              onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
              disabled={exp.current}
            />
          </div>
          <div className="form_group checkbox_group">
            <label>
              <input
                type="checkbox"
                checked={exp.current || false}
                onChange={(e) => onUpdate(index, 'current', e.target.checked)}
              />
              Currently working here
            </label>
          </div>
        </div>
        <div className="form_group">
          <label>Description</label>
          <textarea
            value={exp.description || ''}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="Describe your key responsibilities and achievements..."
            rows={4}
          />
        </div>
      </div>
    ))}
  </div>
);

// Component for Education Section
const EducationSection = ({ data, onAdd, onRemove, onUpdate }) => (
  <div className="form_section">
    <div className="section_header">
      <h2>Education</h2>
      <button className="add_btn" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
        Add Education
      </button>
    </div>
    {data.map((edu, index) => (
      <div key={index} className="education_item">
        <div className="item_header">
          <h3>Education #{index + 1}</h3>
          <button className="remove_btn" onClick={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div className="form_grid">
          <div className="form_group">
            <label>Degree *</label>
            <input
              type="text"
              value={edu.degree || ''}
              onChange={(e) => onUpdate(index, 'degree', e.target.value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>
          <div className="form_group">
            <label>Institution *</label>
            <input
              type="text"
              value={edu.institution || ''}
              onChange={(e) => onUpdate(index, 'institution', e.target.value)}
              placeholder="e.g., Stanford University"
            />
          </div>
          <div className="form_group">
            <label>Location</label>
            <input
              type="text"
              value={edu.location || ''}
              onChange={(e) => onUpdate(index, 'location', e.target.value)}
              placeholder="e.g., Stanford, CA"
            />
          </div>
          <div className="form_group">
            <label>Start Date</label>
            <input
              type="month"
              value={edu.start_date || ''}
              onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>End Date</label>
            <input
              type="month"
              value={edu.end_date || ''}
              onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>GPA</label>
            <input
              type="text"
              value={edu.gpa || ''}
              onChange={(e) => onUpdate(index, 'gpa', e.target.value)}
              placeholder="e.g., 3.8/4.0"
            />
          </div>
        </div>
        <div className="form_group">
          <label>Description</label>
          <textarea
            value={edu.description || ''}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="Relevant coursework, honors, or achievements..."
            rows={3}
          />
        </div>
      </div>
    ))}
  </div>
);

// Component for Skills Section
const SkillsSection = ({ data, onAdd, onRemove, onUpdate }) => (
  <div className="form_section">
    <div className="section_header">
      <h2>Skills</h2>
      <button className="add_btn" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
        Add Skill
      </button>
    </div>
    {data.map((skill, index) => (
      <div key={index} className="skill_item">
        <div className="form_grid">
          <div className="form_group">
            <label>Skill Name *</label>
            <input
              type="text"
              value={skill.name || ''}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="e.g., JavaScript, Python, React"
            />
          </div>
          <div className="form_group">
            <label>Proficiency Level</label>
            <select
              value={skill.level || 'Intermediate'}
              onChange={(e) => onUpdate(index, 'level', e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="form_group">
            <button className="remove_btn" onClick={() => onRemove(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Component for Projects Section
const ProjectsSection = ({ data, onAdd, onRemove, onUpdate }) => (
  <div className="form_section">
    <div className="section_header">
      <h2>Projects</h2>
      <button className="add_btn" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
        Add Project
      </button>
    </div>
    {data.map((project, index) => (
      <div key={index} className="project_item">
        <div className="item_header">
          <h3>Project #{index + 1}</h3>
          <button className="remove_btn" onClick={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div className="form_grid">
          <div className="form_group">
            <label>Project Name *</label>
            <input
              type="text"
              value={project.name || ''}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="e.g., E-commerce Website"
            />
          </div>
          <div className="form_group">
            <label>Technologies Used</label>
            <input
              type="text"
              value={project.technologies || ''}
              onChange={(e) => onUpdate(index, 'technologies', e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>
          <div className="form_group">
            <label>Project URL</label>
            <input
              type="url"
              value={project.url || ''}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              placeholder="https://yourproject.com"
            />
          </div>
          <div className="form_group">
            <label>Start Date</label>
            <input
              type="month"
              value={project.start_date || ''}
              onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>End Date</label>
            <input
              type="month"
              value={project.end_date || ''}
              onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
            />
          </div>
        </div>
        <div className="form_group">
          <label>Description</label>
          <textarea
            value={project.description || ''}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="Describe the project, your role, and key achievements..."
            rows={4}
          />
        </div>
      </div>
    ))}
  </div>
);

// Component for Certifications Section
const CertificationsSection = ({ data, onAdd, onRemove, onUpdate }) => (
  <div className="form_section">
    <div className="section_header">
      <h2>Certifications</h2>
      <button className="add_btn" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
        Add Certification
      </button>
    </div>
    {data.map((cert, index) => (
      <div key={index} className="certification_item">
        <div className="form_grid">
          <div className="form_group">
            <label>Certification Name *</label>
            <input
              type="text"
              value={cert.name || ''}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>
          <div className="form_group">
            <label>Issuing Organization</label>
            <input
              type="text"
              value={cert.issuer || ''}
              onChange={(e) => onUpdate(index, 'issuer', e.target.value)}
              placeholder="e.g., Amazon Web Services"
            />
          </div>
          <div className="form_group">
            <label>Date Obtained</label>
            <input
              type="month"
              value={cert.date || ''}
              onChange={(e) => onUpdate(index, 'date', e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>Credential URL</label>
            <input
              type="url"
              value={cert.url || ''}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              placeholder="https://credential.url"
            />
          </div>
          <div className="form_group">
            <button className="remove_btn" onClick={() => onRemove(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ResumeBuilder;
