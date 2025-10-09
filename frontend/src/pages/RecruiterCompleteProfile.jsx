import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faVenusMars, 
  faSave,
  faSpinner,
  faCheck,
  faArrowLeft,
  faBuilding,
  faUsers,
  faGlobe,
  faIndustry,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/CompleteProfile.css';

const RecruiterCompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    linkedinProfile: '',
    // Company-specific fields
    companyName: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    companyDescription: ''
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
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phone || '',
          location: typeof data.location === 'string' ? data.location : (data.location?.city || ''),
          linkedinProfile: data.linkedinProfile || '',
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          industry: data.industry || '',
          companySize: data.companySize || '',
          foundedYear: data.foundedYear || '',
          companyDescription: data.companyDescription || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        location: formData.location,
        linkedinProfile: formData.linkedinProfile,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        industry: formData.industry,
        companySize: formData.companySize,
        foundedYear: formData.foundedYear,
        companyDescription: formData.companyDescription
      };

      console.log('📤 RecruiterCompleteProfile: Sending update data:', updateData);

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile'),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );

      console.log('📥 RecruiterCompleteProfile: Response status:', response?.status);

      if (response && response.ok) {
        const result = await response.json();
        console.log('✅ RecruiterCompleteProfile: Profile updated successfully:', result);
        setMessage('Profile updated successfully!');
        
        // Trigger a profile refresh event for the tracker
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updateData }));
        
        setTimeout(() => navigate('/recruiter-dashboard'), 1500);
      } else {
        const errorData = await response.json();
        console.error('❌ RecruiterCompleteProfile: Update failed:', errorData);
        setMessage(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ RecruiterCompleteProfile: Error updating profile:', error);
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
          <button className="back-btn" onClick={() => navigate('/recruiter-dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
          <h1>Complete Your Recruiter Profile</h1>
          <p>Fill in your details and company information to attract top talent</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <h3><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
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
                <label htmlFor="lastName">Last Name *</label>
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
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  placeholder="Email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="City, State, Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedinProfile">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="form-section">
            <h3><FontAwesomeIcon icon={faBuilding} /> Company Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyWebsite">Company Website</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  placeholder="https://company.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry *</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="companySize">Company Size *</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5001+">5001+ employees</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="foundedYear">Founded Year</label>
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  placeholder="YYYY"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="companyDescription">Company Description *</label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Tell us about your company, culture, and what makes it a great place to work..."
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              <FontAwesomeIcon icon={message.includes('success') ? faCheck : faInfoCircle} />
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={saving}>
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

export default RecruiterCompleteProfile;

