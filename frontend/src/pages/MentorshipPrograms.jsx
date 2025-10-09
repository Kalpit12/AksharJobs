import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faLightbulb, faRocket, faUsers, faArrowLeft, faUserTie, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProgramPages.css';

const MentorshipPrograms = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [mentorsError, setMentorsError] = useState('');

  const [mentorForm, setMentorForm] = useState({
    fullName: '',
    email: '',
    expertiseAreas: '',
    yearsExperience: '',
    bio: '',
    availability: '',
    linkedin: ''
  });
  const [mentorSubmitting, setMentorSubmitting] = useState(false);
  const [mentorSubmitMsg, setMentorSubmitMsg] = useState('');

  const [menteeForm, setMenteeForm] = useState({
    fullName: '',
    email: '',
    goals: '',
    domain: '',
    availability: '',
    mentorId: ''
  });
  const [menteeSubmitting, setMenteeSubmitting] = useState(false);
  const [menteeSubmitMsg, setMenteeSubmitMsg] = useState('');

  useEffect(() => {
    const loadMentors = async () => {
      setMentorsLoading(true);
      setMentorsError('');
      try {
        const res = await makeAuthenticatedRequest(
          buildApiUrl('/api/mentorship/mentors'),
          { method: 'GET' }
        );
        if (res && res.ok) {
          const data = await res.json();
          setMentors(Array.isArray(data) ? data : (data?.items || []));
        } else {
          setMentorsError('Failed to load mentors.');
        }
      } catch (e) {
        setMentorsError('Network error while loading mentors.');
      } finally {
        setMentorsLoading(false);
      }
    };
    loadMentors();
  }, []);

  const selectedMentor = useMemo(() => mentors.find(m => String(m.id) === String(menteeForm.mentorId)), [mentors, menteeForm.mentorId]);

  const handleMentorChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMenteeChange = (e) => {
    const { name, value } = e.target;
    setMenteeForm(prev => ({ ...prev, [name]: value }));
  };

  const submitMentor = async (e) => {
    e.preventDefault();
    setMentorSubmitMsg('');
    setMentorSubmitting(true);
    try {
      const res = await makeAuthenticatedRequest(
        buildApiUrl('/api/mentorship/mentors'),
        {
          method: 'POST',
          body: JSON.stringify(mentorForm)
        }
      );
      if (res && res.ok) {
        setMentorSubmitMsg('Thanks! Your mentor registration has been received.');
        setMentorForm({ fullName: '', email: '', expertiseAreas: '', yearsExperience: '', bio: '', availability: '', linkedin: '' });
      } else {
        setMentorSubmitMsg('Unable to submit right now. Please try again later.');
      }
    } catch (err) {
      setMentorSubmitMsg('Network error. Please check your connection and try again.');
    } finally {
      setMentorSubmitting(false);
    }
  };

  const submitMentee = async (e) => {
    e.preventDefault();
    setMenteeSubmitMsg('');
    setMenteeSubmitting(true);
    try {
      const res = await makeAuthenticatedRequest(
        buildApiUrl('/api/mentorship/mentees'),
        {
          method: 'POST',
          body: JSON.stringify(menteeForm)
        }
      );
      if (res && res.ok) {
        setMenteeSubmitMsg('Registered successfully. Your mentor will reach out soon.');
        setMenteeForm({ fullName: '', email: '', goals: '', domain: '', availability: '', mentorId: '' });
      } else {
        setMenteeSubmitMsg('Unable to submit right now. Please try again later.');
      }
    } catch (err) {
      setMenteeSubmitMsg('Network error. Please check your connection and try again.');
    } finally {
      setMenteeSubmitting(false);
    }
  };

  return (
    <div className="program-page">
      <div className="program-container">
        {/* Header */}
        <div className="program-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">
            <FontAwesomeIcon icon={faUserGraduate} />
          </div>
          <h1 className="hero-title">Mentorship Programs</h1>
          <p className="hero-description">
            Connect with industry experts and accelerate your career growth through structured 1:1 mentorship. 
            Whether you're looking to mentor others or find guidance, we've got you covered.
          </p>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faLightbulb} className="feature-icon" />
              <h3 className="feature-title">Expert Guidance</h3>
              <p className="feature-description">Learn from seasoned professionals who have walked the path you're on.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faRocket} className="feature-icon" />
              <h3 className="feature-title">Career Acceleration</h3>
              <p className="feature-description">Fast-track your professional development with personalized guidance.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faUsers} className="feature-icon" />
              <h3 className="feature-title">Network Building</h3>
              <p className="feature-description">Build valuable connections and expand your professional network.</p>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="forms-section">
          {/* Become a Mentor */}
          <div className="form-card">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '0.5rem' }} />
              Become a Mentor
            </h2>
            <form onSubmit={submitMentor}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={mentorForm.fullName} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={mentorForm.email} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expertise Areas</label>
                <input 
                  type="text" 
                  name="expertiseAreas" 
                  value={mentorForm.expertiseAreas} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="e.g., React, Python, Product Management" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input 
                  type="text" 
                  name="yearsExperience" 
                  value={mentorForm.yearsExperience} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="e.g., 5+ years" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <input 
                  type="text" 
                  name="availability" 
                  value={mentorForm.availability} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="e.g., 2 hours/week, evenings" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile (Optional)</label>
                <input 
                  type="url" 
                  name="linkedin" 
                  value={mentorForm.linkedin} 
                  onChange={handleMentorChange} 
                  className="form-input"
                  placeholder="https://linkedin.com/in/yourprofile" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea 
                  name="bio" 
                  value={mentorForm.bio} 
                  onChange={handleMentorChange} 
                  className="form-textarea"
                  placeholder="Tell us about yourself and your mentoring experience" 
                  rows={4} 
                />
              </div>
              <button className="form-button" disabled={mentorSubmitting}>
                {mentorSubmitting ? 'Submitting...' : 'Register as Mentor'}
              </button>
              {mentorSubmitMsg && (
                <div className={`form-message ${mentorSubmitMsg.includes('Thanks') ? 'success' : 'error'}`}>
                  {mentorSubmitMsg}
                </div>
              )}
            </form>
          </div>

          {/* Find a Mentor */}
          <div className="form-card">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: '0.5rem' }} />
              Find a Mentor
            </h2>
            <form onSubmit={submitMentee}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={menteeForm.fullName} 
                  onChange={handleMenteeChange} 
                  className="form-input"
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={menteeForm.email} 
                  onChange={handleMenteeChange} 
                  className="form-input"
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Domain/Field</label>
                <input 
                  type="text" 
                  name="domain" 
                  value={menteeForm.domain} 
                  onChange={handleMenteeChange} 
                  className="form-input"
                  placeholder="e.g., Frontend Development, Data Science" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <input 
                  type="text" 
                  name="availability" 
                  value={menteeForm.availability} 
                  onChange={handleMenteeChange} 
                  className="form-input"
                  placeholder="e.g., weekends, mornings" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select a Mentor</label>
                <select 
                  name="mentorId" 
                  value={menteeForm.mentorId} 
                  onChange={handleMenteeChange} 
                  className="form-select"
                  required
                >
                  <option value="">Choose a mentor from the list</option>
                  {mentors.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName || m.name || `Mentor ${m.id}`}
                    </option>
                  ))}
                </select>
                {mentorsLoading && <p className="loading-text">Loading mentors...</p>}
                {mentorsError && <p className="form-message error">{mentorsError}</p>}
                {selectedMentor && (
                  <p className="form-message info">
                    Selected: {selectedMentor.fullName || selectedMentor.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Goals & Expectations</label>
                <textarea 
                  name="goals" 
                  value={menteeForm.goals} 
                  onChange={handleMenteeChange} 
                  className="form-textarea"
                  placeholder="What do you want to achieve through mentorship?" 
                  rows={4} 
                />
              </div>
              <button className="form-button" disabled={menteeSubmitting}>
                {menteeSubmitting ? 'Submitting...' : 'Register with Mentor'}
              </button>
              {menteeSubmitMsg && (
                <div className={`form-message ${menteeSubmitMsg.includes('successfully') ? 'success' : 'error'}`}>
                  {menteeSubmitMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPrograms;
