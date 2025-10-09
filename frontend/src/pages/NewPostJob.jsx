import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, 
  faBuilding, 
  faMapMarkerAlt, 
  faDollarSign, 
  faCalendar,
  faCheckCircle,
  faSpinner,
  faSave,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
import '../styles/NewPostJob.css';

const NewPostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    workMode: 'On-site',
    experienceLevel: 'Mid-Level',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    benefits: '',
    applicationDeadline: '',
    industry: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );

      if (response && response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          companyName: data.companyName || '',
          industry: data.industry || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.jobTitle || !formData.location || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setSaving(false);
      return;
    }

    try {
      const jobData = {
        title: formData.jobTitle,
        company: formData.companyName,
        location: formData.location,
        job_type: formData.jobType,
        work_mode: formData.workMode,
        experience_level: formData.experienceLevel,
        salary_min: formData.salaryMin,
        salary_max: formData.salaryMax,
        salary_currency: formData.salaryCurrency,
        salary_period: formData.salaryPeriod,
        salary_range: `${formData.salaryMin && formData.salaryMax ? `${formData.salaryCurrency} ${formData.salaryMin} - ${formData.salaryMax} ${formData.salaryPeriod}` : ''}`,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        required_skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        benefits: formData.benefits,
        application_deadline: formData.applicationDeadline,
        industry: formData.industry
      };

      console.log('📤 Posting job:', jobData);

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/jobs/add_job'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData)
        }
      );

      if (response && response.ok) {
        setMessage({ type: 'success', text: 'Job posted successfully!' });
        setTimeout(() => navigate('/recruiter-dashboard'), 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to post job' });
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setMessage({ type: 'error', text: 'Failed to post job. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ModernLoadingSpinner text="Loading form..." />;
  }

  return (
    <div className="new-post-job">
      <div className="post-job-container">
        <button 
          className="back-to-dashboard"
          onClick={() => navigate('/recruiter-dashboard')}
          type="button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Dashboard</span>
        </button>

        <div className="post-job-header">
          <h1><FontAwesomeIcon icon={faBriefcase} /> Post a New Job</h1>
          <p>Fill in the details to attract top talent</p>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faSpinner} />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-job-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faBriefcase} /> Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange}>
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Media">Media & Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Job Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  required
                />
              </div>

              <div className="form-group">
                <label>Work Mode</label>
                <select name="workMode" value={formData.workMode} onChange={handleChange}>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                  <option value="Entry-Level">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior-Level">Senior Level</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faDollarSign} /> Salary Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Currency</label>
                <select name="salaryCurrency" value={formData.salaryCurrency} onChange={handleChange}>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="CAD">CAD - Canadian Dollar (C$)</option>
                  <option value="AUD">AUD - Australian Dollar (A$)</option>
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="KES">KES - Kenyan Shilling (KSh)</option>
                  <option value="NGN">NGN - Nigerian Naira (₦)</option>
                  <option value="ZAR">ZAR - South African Rand (R)</option>
                  <option value="AED">AED - UAE Dirham (د.إ)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="CNY">CNY - Chinese Yuan (¥)</option>
                  <option value="SGD">SGD - Singapore Dollar (S$)</option>
                  <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
                  <option value="THB">THB - Thai Baht (฿)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Salary Period</label>
                <select name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}>
                  <option value="yearly">Per Year</option>
                  <option value="monthly">Per Month</option>
                  <option value="weekly">Per Week</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>

              <div className="form-group">
                <label>Minimum Salary</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="50000"
                />
              </div>

              <div className="form-group">
                <label>Maximum Salary</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faBriefcase} /> Job Description</h2>
            
            <div className="form-group full-width">
              <label>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe the role, what the candidate will do, and why they should join your company..."
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Key Responsibilities</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="5"
                placeholder="• Lead software development projects&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
              />
            </div>

            <div className="form-group full-width">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="5"
                placeholder="• Bachelor's degree in Computer Science&#10;• 5+ years of experience&#10;• Strong communication skills"
              />
            </div>

            <div className="form-group full-width">
              <label>Required Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, React, Node.js, AWS, Docker"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faBuilding} /> Additional Information</h2>
            
            <div className="form-group full-width">
              <label>Benefits & Perks</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="4"
                placeholder="• Health insurance&#10;• Flexible working hours&#10;• Professional development budget&#10;• Remote work options"
              />
            </div>

            <div className="form-group">
              <label><FontAwesomeIcon icon={faCalendar} /> Application Deadline *</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/recruiter-dashboard')}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Posting Job...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostJob;

