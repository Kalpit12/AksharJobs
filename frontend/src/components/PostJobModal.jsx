import React, { useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import CommunitySelector from "./CommunitySelector";
import "../styles/PostJobModal.css";

const PostJobModal = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    recruiter_id: localStorage.getItem("userId"),
    jobTitle: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    location: "",
    remoteOption: "On-site",
    jobType: "Full-time",
    salaryRange: "",
    experience: "",
    skills: "",
    responsibilities: "",
    education: "",
    deadline: "",
    description: "",
    target_communities: [],
    all_communities: false,
    community_requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Real Estate',
    'Media & Entertainment',
    'Non-profit',
    'Government',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCommunityChange = (selectedCommunities) => {
    setFormData(prev => ({
      ...prev,
      target_communities: selectedCommunities,
      all_communities: selectedCommunities.length === 0 || selectedCommunities.some(id => {
        // Check if "All Communities" is selected (assuming it has a specific ID or name)
        return id === 'all_communities';
      })
    }));
  };

  const handleAllCommunitiesToggle = (e) => {
    setFormData(prev => ({
      ...prev,
      all_communities: e.target.checked,
      target_communities: e.target.checked ? [] : prev.target_communities
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(buildApiUrl("/api/jobs/add_job"), formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setMessage("Job posted successfully!");
        setFormData({
          recruiter_id: localStorage.getItem("userId"),
          jobTitle: "",
          companyName: "",
          companyWebsite: "",
          industry: "",
          location: "",
          remoteOption: "On-site",
          jobType: "Full-time",
          salaryRange: "",
          experience: "",
          skills: "",
          responsibilities: "",
          education: "",
          deadline: "",
          description: "",
        });
        
        if (onJobPosted) {
          onJobPosted();
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage("Failed to post job.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage("Error: Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3 className="step-title">Basic Information</h3>
      
      <div className="form-group">
        <label htmlFor="jobTitle">Job Title *</label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyName">Company Name *</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Your company name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyWebsite">Company Website</label>
        <input
          type="url"
          id="companyWebsite"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          placeholder="https://yourcompany.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="industry">Industry *</label>
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          required
        >
          <option value="">Select Industry</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Community Targeting */}
      <div className="form-group">
        <label>Target Communities *</label>
        <div className="community-targeting-section">
          <div className="all-communities-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.all_communities}
                onChange={handleAllCommunitiesToggle}
              />
              <span className="checkbox-text">Post to all communities</span>
            </label>
            <p className="toggle-description">
              Check this to make your job visible to all community members
            </p>
          </div>
          
          {!formData.all_communities && (
            <div className="community-selection">
                        <CommunitySelector
                            selectedCommunities={formData.target_communities}
                            onSelectionChange={handleCommunityChange}
                            multiple={true}
                            showDescription={false}
                            placeholder="Select specific communities..."
                            className="compact"
                        />
              <div className="community-help">
                <span className="help-icon">💡</span>
                <span>Choose specific religious/ethnic communities to target your ideal candidates</span>
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="community_requirements">Community Requirements</label>
            <textarea
              id="community_requirements"
              name="community_requirements"
              value={formData.community_requirements}
              onChange={handleChange}
                        placeholder="Any specific religious/ethnic community requirements or preferences..."
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Nairobi, Kenya"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3 className="step-title">Job Details</h3>
      
      <div className="form-group">
        <label htmlFor="jobType">Job Type *</label>
        <select
          id="jobType"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          required
        >
          <option value="Full-time">Full Time</option>
          <option value="Part-time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="remoteOption">Work Arrangement</label>
        <select
          id="remoteOption"
          name="remoteOption"
          value={formData.remoteOption}
          onChange={handleChange}
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="experience">Experience Level</label>
        <select
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option value="">Select Experience</option>
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-5 years)</option>
          <option value="senior">Senior Level (6-10 years)</option>
          <option value="lead">Lead Level (10+ years)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="salaryRange">Salary Range</label>
        <input
          type="text"
          id="salaryRange"
          name="salaryRange"
          value={formData.salaryRange}
          onChange={handleChange}
          placeholder="e.g., $50,000 - $70,000 or Competitive"
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Application Deadline *</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3 className="step-title">Job Description</h3>
      
      <div className="form-group">
        <label htmlFor="description">Job Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="responsibilities">Key Responsibilities</label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          rows="4"
          placeholder="List the main responsibilities and duties for this position..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="skills">Required Skills</label>
        <textarea
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          rows="3"
          placeholder="List the key skills, technologies, and qualifications needed..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="education">Education Requirements</label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="e.g., Bachelor's degree in Computer Science or equivalent experience"
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="post-job-modal">
        <div className="modal-header">
          <h2>Post a New Job</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">Step {currentStep} of {totalSteps}</span>
        </div>

        <div className="modal-content">
          {message && (
            <div className={`message-banner ${message.includes('successfully') ? 'success' : 'error'}`}>
              <span className="message-icon">
                {message.includes('successfully') ? '✅' : '❌'}
              </span>
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="job-form">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" className="prev-btn" onClick={handlePrevious}>
                  Previous
                </button>
              )}
              
              <div className="action-group">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                
                {currentStep < totalSteps ? (
                  <button type="button" className="next-btn" onClick={handleNext}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Posting..." : "Post Job"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobModal;