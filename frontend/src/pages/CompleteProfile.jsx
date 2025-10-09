import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faTint, 
  faCalendarAlt, 
  faVenusMars, 
  faSave,
  faSpinner,
  faCheck,
  faArrowLeft,
  faCogs,
  faBriefcase,
  faLaptopCode,
  faChartLine,
  faBuilding,
  faUsers,
  faDollarSign,
  faGlobe,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    location: '',
    currentAddress: '',
    currentAddressPin: '',
    homeAddress: '',
    homeAddressPin: '',
    commuteOptions: [],
    skills: [],
    jobPreferences: {
      jobType: '',
      workMode: '',
      experienceLevel: '',
      industry: '',
      companySize: ''
    },
    salaryExpectations: {
      minSalary: '',
      maxSalary: '',
      currency: 'USD',
      period: 'yearly'
    },
    availability: {
      immediate: false,
      noticePeriod: '',
      startDate: ''
    },
    languages: [],
    linkedinProfile: '',
    portfolio: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(buildApiUrl('/api/profile/profile'));
      
      if (response && response.ok) {
        const userData = await response.json();
        setFormData({
          firstName: userData.fullName ? userData.fullName.split(' ')[0] : '',
          lastName: userData.fullName ? userData.fullName.split(' ').slice(1).join(' ') : '',
          email: userData.email || '',
          phoneNumber: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          bloodGroup: userData.bloodGroup || '',
          location: userData.location || '',
          currentAddress: userData.currentAddress || '',
          currentAddressPin: userData.currentAddressPin || '',
          homeAddress: userData.homeAddress || '',
          homeAddressPin: userData.homeAddressPin || '',
          commuteOptions: userData.commuteOptions || [],
          skills: userData.skills || [],
          jobPreferences: userData.jobPreferences || {
            jobType: '',
            workMode: '',
            experienceLevel: '',
            industry: '',
            companySize: ''
          },
          salaryExpectations: userData.salaryExpectations || {
            minSalary: '',
            maxSalary: '',
            currency: 'USD',
            period: 'yearly'
          },
          availability: userData.availability || {
            immediate: false,
            noticePeriod: '',
            startDate: ''
          },
          languages: userData.languages || [],
          linkedinProfile: userData.linkedinProfile || '',
          portfolio: userData.portfolio || '',
          bio: userData.bio || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Transform form data to match backend expectations
      const updateData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        currentAddress: formData.currentAddress,
        currentAddressPin: formData.currentAddressPin,
        homeAddress: formData.homeAddress,
        homeAddressPin: formData.homeAddressPin,
        commuteOptions: formData.commuteOptions,
        skills: formData.skills,
        jobPreferences: formData.jobPreferences,
        salaryExpectations: formData.salaryExpectations,
        availability: formData.availability,
        languages: formData.languages,
        linkedinProfile: formData.linkedinProfile,
        portfolio: formData.portfolio,
        bio: formData.bio
      };

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile'),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );

      if (response && response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => navigate('/jobseeker-dashboard'), 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="complete-profile loading">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complete-profile">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/jobseeker-dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
          <h1>Complete Your Profile</h1>
          <p>Fill in your details to get better job matches</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">
                  <FontAwesomeIcon icon={faUser} />
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  <FontAwesomeIcon icon={faUser} />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faUser} />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">
                  <FontAwesomeIcon icon={faPhone} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">
                  <FontAwesomeIcon icon={faVenusMars} />
                  Gender
                </label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">
                  <FontAwesomeIcon icon={faTint} />
                  Blood Group
                </label>
                <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your city, state, country"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="currentAddress">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Currently Address: 📍
                </label>
                <input
                  type="text"
                  id="currentAddress"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your current address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentAddressPin">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Current Address Pin
                </label>
                <input
                  type="text"
                  id="currentAddressPin"
                  name="currentAddressPin"
                  value={formData.currentAddressPin}
                  onChange={handleInputChange}
                  placeholder="Enter PIN code"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="homeAddress">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Home: 📍
                </label>
                <input
                  type="text"
                  id="homeAddress"
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your home address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="homeAddressPin">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Home Address Pin
                </label>
                <input
                  type="text"
                  id="homeAddressPin"
                  name="homeAddressPin"
                  value={formData.homeAddressPin}
                  onChange={handleInputChange}
                  placeholder="Enter PIN code"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="commuteOptions">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Commute Options to Work Place
                </label>
                <div className="commute-container">
                  <div className="commute-input-container">
                    <select
                      id="commuteSelect"
                      onChange={(e) => {
                        const option = e.target.value;
                        if (option && option !== '' && !formData.commuteOptions.includes(option)) {
                          setFormData(prev => ({
                            ...prev,
                            commuteOptions: [...prev.commuteOptions, option]
                          }));
                          e.target.value = ''; // Reset dropdown
                        }
                      }}
                      defaultValue=""
                      className="commute-dropdown"
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
                    {formData.commuteOptions.map((option, index) => (
                      <span key={index} className="commute-tag">
                        {option}
                        <button
                          type="button"
                          className="commute-remove"
                          onClick={() => {
                            setFormData(prev => ({
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
                      id="commuteCustomInput"
                      placeholder="Or add custom option and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const option = e.target.value.trim();
                          if (option && !formData.commuteOptions.includes(option)) {
                            setFormData(prev => ({
                              ...prev,
                              commuteOptions: [...prev.commuteOptions, option]
                            }));
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="skills">
                  <FontAwesomeIcon icon={faCogs} />
                  Skills
                </label>
                <div className="skills-container">
                  <div className="skills-input-container">
                    <select
                      id="skillSelect"
                      onChange={(e) => {
                        const skill = e.target.value;
                        if (skill && skill !== '' && !formData.skills.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                          e.target.value = ''; // Reset dropdown
                        }
                      }}
                      defaultValue=""
                      className="skills-dropdown"
                    >
                      <option value="">Select a skill</option>
                      <option value="JavaScript">💻 JavaScript</option>
                      <option value="Python">🐍 Python</option>
                      <option value="Java">☕ Java</option>
                      <option value="React">⚛️ React</option>
                      <option value="Node.js">🟢 Node.js</option>
                      <option value="HTML/CSS">🎨 HTML/CSS</option>
                      <option value="SQL">🗄️ SQL</option>
                      <option value="Git">📦 Git</option>
                      <option value="Docker">🐳 Docker</option>
                      <option value="AWS">☁️ AWS</option>
                      <option value="Machine Learning">🤖 Machine Learning</option>
                      <option value="Data Analysis">📊 Data Analysis</option>
                      <option value="Project Management">📋 Project Management</option>
                      <option value="Communication">💬 Communication</option>
                      <option value="Leadership">👥 Leadership</option>
                      <option value="Problem Solving">🧩 Problem Solving</option>
                      <option value="Teamwork">🤝 Teamwork</option>
                      <option value="Time Management">⏰ Time Management</option>
                      <option value="Critical Thinking">🧠 Critical Thinking</option>
                      <option value="Creativity">🎨 Creativity</option>
                      <option value="Adaptability">🔄 Adaptability</option>
                      <option value="Microsoft Office">📄 Microsoft Office</option>
                      <option value="Excel">📈 Excel</option>
                      <option value="PowerPoint">📊 PowerPoint</option>
                      <option value="Photoshop">🎨 Photoshop</option>
                      <option value="Illustrator">🖼️ Illustrator</option>
                      <option value="Figma">🎨 Figma</option>
                      <option value="Salesforce">⚡ Salesforce</option>
                      <option value="WordPress">🌐 WordPress</option>
                      <option value="SEO">🔍 SEO</option>
                      <option value="Digital Marketing">📱 Digital Marketing</option>
                      <option value="Content Writing">✍️ Content Writing</option>
                      <option value="Translation">🌍 Translation</option>
                    </select>
                  </div>
                  <div className="skills-list">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="skill-remove"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="skills-custom-input">
                    <input
                      type="text"
                      id="skillCustomInput"
                      placeholder="Or add custom skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const skill = e.target.value.trim();
                          if (skill && !formData.skills.includes(skill)) {
                            setFormData(prev => ({
                              ...prev,
                              skills: [...prev.skills, skill]
                            }));
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Preferences Section */}
          <div className="form-section">
            <h3>Job Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="jobPreferences.jobType">
                  <FontAwesomeIcon icon={faBriefcase} />
                  Job Type
                </label>
                <select id="jobPreferences.jobType" name="jobPreferences.jobType" value={formData.jobPreferences.jobType} onChange={handleInputChange}>
                  <option value="">Select job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="jobPreferences.workMode">
                  <FontAwesomeIcon icon={faLaptopCode} />
                  Work Mode
                </label>
                <select id="jobPreferences.workMode" name="jobPreferences.workMode" value={formData.jobPreferences.workMode} onChange={handleInputChange}>
                  <option value="">Select work mode</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="jobPreferences.experienceLevel">
                  <FontAwesomeIcon icon={faChartLine} />
                  Experience Level
                </label>
                <select id="jobPreferences.experienceLevel" name="jobPreferences.experienceLevel" value={formData.jobPreferences.experienceLevel} onChange={handleInputChange}>
                  <option value="">Select experience level</option>
                  <option value="Entry-level">Entry-level (0-2 years)</option>
                  <option value="Mid-level">Mid-level (3-5 years)</option>
                  <option value="Senior-level">Senior-level (6-10 years)</option>
                  <option value="Executive">Executive (10+ years)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="jobPreferences.industry">
                  <FontAwesomeIcon icon={faBuilding} />
                  Industry
                </label>
                <select id="jobPreferences.industry" name="jobPreferences.industry" value={formData.jobPreferences.industry} onChange={handleInputChange}>
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="jobPreferences.companySize">
                  <FontAwesomeIcon icon={faUsers} />
                  Company Size
                </label>
                <select id="jobPreferences.companySize" name="jobPreferences.companySize" value={formData.jobPreferences.companySize} onChange={handleInputChange}>
                  <option value="">Select company size</option>
                  <option value="Startup">Startup (1-50 employees)</option>
                  <option value="Small">Small (51-200 employees)</option>
                  <option value="Medium">Medium (201-1000 employees)</option>
                  <option value="Large">Large (1000+ employees)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Expectations Section */}
          <div className="form-section">
            <h3>Salary Expectations</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="salaryExpectations.minSalary">
                  <FontAwesomeIcon icon={faDollarSign} />
                  Minimum Salary
                </label>
                <input
                  type="number"
                  id="salaryExpectations.minSalary"
                  name="salaryExpectations.minSalary"
                  value={formData.salaryExpectations.minSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryExpectations.maxSalary">
                  <FontAwesomeIcon icon={faDollarSign} />
                  Maximum Salary
                </label>
                <input
                  type="number"
                  id="salaryExpectations.maxSalary"
                  name="salaryExpectations.maxSalary"
                  value={formData.salaryExpectations.maxSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., 80000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryExpectations.currency">
                  <FontAwesomeIcon icon={faGlobe} />
                  Currency
                </label>
                <select id="salaryExpectations.currency" name="salaryExpectations.currency" value={formData.salaryExpectations.currency} onChange={handleInputChange}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salaryExpectations.period">
                  <FontAwesomeIcon icon={faClock} />
                  Period
                </label>
                <select id="salaryExpectations.period" name="salaryExpectations.period" value={formData.salaryExpectations.period} onChange={handleInputChange}>
                  <option value="yearly">Per Year</option>
                  <option value="monthly">Per Month</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="linkedinProfile">
                  <FontAwesomeIcon icon={faLinkedin} />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="portfolio">
                  <FontAwesomeIcon icon={faGlobe} />
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">
                  <FontAwesomeIcon icon={faUser} />
                  Bio/Summary
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself, your experience, and what you're looking for..."
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              <FontAwesomeIcon icon={message.includes('successfully') ? faCheck : faSpinner} />
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/jobseeker-dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
