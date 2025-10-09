import React, { useState } from 'react';
import { buildApiUrl } from '../config/api';
import './JobCreationForm.css';

const JobCreationForm = ({ onJobCreated, onClose }) => {
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_website: '',
    industry: '',
    location: '',
    remote_option: '',
    job_type: 'Full-time',
    salary_range: '',
    experience_required: '',
    education_required: '',
    application_deadline: '',
    description: '',
    required_skills: [''],
    responsibilities: [''],
    ai_improvement_suggestions: [''],
    additional_requirements: [''],
    benefits: [''],
    company_culture: '',
    application_process: ['']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        required_skills: formData.required_skills.filter(skill => skill.trim()),
        responsibilities: formData.responsibilities.filter(resp => resp.trim()),
        ai_improvement_suggestions: formData.ai_improvement_suggestions.filter(suggestion => suggestion.trim()),
        additional_requirements: formData.additional_requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim()),
        application_process: formData.application_process.filter(step => step.trim())
      };

      const response = await fetch(buildApiUrl('/api/jobs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cleanedData)
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const newJob = await response.json();
      onJobCreated(newJob);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderArrayInputs = (field, label, placeholder, icon) => (
    <div className="form-section">
      <label className="section-label">
        <span className="section-icon">{icon}</span>
        {label}
      </label>
      {formData[field].map((item, index) => (
        <div key={index} className="array-input-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayInputChange(index, field, e.target.value)}
            placeholder={placeholder}
            className="array-input"
          />
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="remove-btn"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="add-btn"
      >
        + Add {label}
      </button>
    </div>
  );

  return (
    <div className="job-creation-overlay" onClick={onClose}>
      <div className="job-creation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚀 Create Amazing Job Opportunity</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="job-creation-form">
          <div className="form-content">
            {/* Basic Job Information */}
            <div className="form-section-group">
              <h3 className="group-title">📋 Basic Job Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="e.g., TechCorp Solutions"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company Website</label>
                  <input
                    type="url"
                    name="company_website"
                    value={formData.company_website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology & Software"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Remote Option</label>
                  <select
                    name="remote_option"
                    value={formData.remote_option}
                    onChange={handleInputChange}
                  >
                    <option value="">Select remote option</option>
                    <option value="On-site only">On-site only</option>
                    <option value="Hybrid (flexible)">Hybrid (flexible)</option>
                    <option value="Hybrid (3 days office, 2 days remote)">Hybrid (3 days office, 2 days remote)</option>
                    <option value="Remote-first with optional office visits">Remote-first with optional office visits</option>
                    <option value="Fully remote">Fully remote</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary Range *</label>
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleInputChange}
                    placeholder="e.g., $80,000 - $120,000 per year"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Experience Required *</label>
                  <input
                    type="text"
                    name="experience_required"
                    value={formData.experience_required}
                    onChange={handleInputChange}
                    placeholder="e.g., 3-5 years"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Education Required *</label>
                  <input
                    type="text"
                    name="education_required"
                    value={formData.education_required}
                    onChange={handleInputChange}
                    placeholder="e.g., Bachelor's in Computer Science"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Application Deadline *</label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a compelling description of the role, company culture, and what makes this opportunity special..."
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Required Skills */}
            {renderArrayInputs(
              'required_skills',
              'Required Skills',
              'e.g., React.js, TypeScript, CSS3',
              '🛠️'
            )}

            {/* Key Responsibilities */}
            {renderArrayInputs(
              'responsibilities',
              'Key Responsibilities',
              'e.g., Develop and maintain responsive web applications',
              '📋'
            )}

            {/* AI-Powered Improvement Suggestions */}
            {renderArrayInputs(
              'ai_improvement_suggestions',
              'AI-Powered Improvement Suggestions',
              'e.g., Build a portfolio showcasing modern web applications',
              '💡'
            )}

            {/* Additional Requirements */}
            {renderArrayInputs(
              'additional_requirements',
              'Additional Requirements',
              'e.g., Strong communication skills',
              '📚'
            )}

            {/* Benefits & Perks */}
            {renderArrayInputs(
              'benefits',
              'Benefits & Perks',
              'e.g., Competitive salary with equity',
              '🎁'
            )}

            {/* Company Culture */}
            <div className="form-section">
              <label className="section-label">
                <span className="section-icon">🏢</span>
                Company Culture
              </label>
              <textarea
                name="company_culture"
                value={formData.company_culture}
                onChange={handleInputChange}
                placeholder="Describe your company culture, values, and what makes it a great place to work..."
                rows="3"
              />
            </div>

            {/* Application Process */}
            {renderArrayInputs(
              'application_process',
              'Application Process',
              'e.g., Submit resume and cover letter',
              '📝'
            )}
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Amazing Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreationForm;
