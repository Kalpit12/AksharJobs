import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCogs, faChartLine, faCertificate, faArrowLeft, faChalkboardTeacher, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProgramPages.css';

const TrainingPrograms = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [programsError, setProgramsError] = useState('');

  const [trainerForm, setTrainerForm] = useState({
    fullName: '',
    email: '',
    expertiseAreas: '',
    yearsExperience: '',
    bio: '',
    linkedin: ''
  });
  const [trainerSubmitting, setTrainerSubmitting] = useState(false);
  const [trainerSubmitMsg, setTrainerSubmitMsg] = useState('');

  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    programId: '',
    goals: ''
  });
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollSubmitMsg, setEnrollSubmitMsg] = useState('');

  useEffect(() => {
    const loadPrograms = async () => {
      setProgramsLoading(true);
      setProgramsError('');
      try {
        const res = await makeAuthenticatedRequest(
          buildApiUrl('/api/training/programs'),
          { method: 'GET' }
        );
        if (res && res.ok) {
          const data = await res.json();
          setPrograms(Array.isArray(data) ? data : (data?.items || []));
        } else {
          setProgramsError('Failed to load training programs.');
        }
      } catch (e) {
        setProgramsError('Network error while loading programs.');
      } finally {
        setProgramsLoading(false);
      }
    };
    loadPrograms();
  }, []);

  const selectedProgram = useMemo(() => programs.find(p => String(p.id) === String(enrollForm.programId)), [programs, enrollForm.programId]);

  const handleTrainerChange = (e) => {
    const { name, value } = e.target;
    setTrainerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrollChange = (e) => {
    const { name, value } = e.target;
    setEnrollForm(prev => ({ ...prev, [name]: value }));
  };

  const submitTrainer = async (e) => {
    e.preventDefault();
    setTrainerSubmitMsg('');
    setTrainerSubmitting(true);
    try {
      const res = await makeAuthenticatedRequest(
        buildApiUrl('/api/training/trainers'),
        {
          method: 'POST',
          body: JSON.stringify(trainerForm)
        }
      );
      if (res && res.ok) {
        setTrainerSubmitMsg('Thanks! Your trainer registration has been received.');
        setTrainerForm({ fullName: '', email: '', expertiseAreas: '', yearsExperience: '', bio: '', linkedin: '' });
      } else {
        setTrainerSubmitMsg('Unable to submit right now. Please try again later.');
      }
    } catch (err) {
      setTrainerSubmitMsg('Network error. Please check your connection and try again.');
    } finally {
      setTrainerSubmitting(false);
    }
  };

  const submitEnroll = async (e) => {
    e.preventDefault();
    setEnrollSubmitMsg('');
    setEnrollSubmitting(true);
    try {
      const res = await makeAuthenticatedRequest(
        buildApiUrl('/api/training/enrollments'),
        {
          method: 'POST',
          body: JSON.stringify(enrollForm)
        }
      );
      if (res && res.ok) {
        setEnrollSubmitMsg('Enrollment successful. We have shared the next steps via email.');
        setEnrollForm({ fullName: '', email: '', programId: '', goals: '' });
      } else {
        setEnrollSubmitMsg('Unable to submit right now. Please try again later.');
      }
    } catch (err) {
      setEnrollSubmitMsg('Network error. Please check your connection and try again.');
    } finally {
      setEnrollSubmitting(false);
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
            <FontAwesomeIcon icon={faLaptopCode} />
          </div>
          <h1 className="hero-title">Training Programs</h1>
          <p className="hero-description">
            Enhance your skills through curated, hands-on training programs led by industry experts. 
            Whether you want to teach or learn, we provide the platform for professional growth.
          </p>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faCogs} className="feature-icon" />
              <h3 className="feature-title">Technical Skills</h3>
              <p className="feature-description">Master the latest technologies and tools used in modern workplaces.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
              <h3 className="feature-title">Career Growth</h3>
              <p className="feature-description">Advance your career with in-demand skills and practical experience.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faCertificate} className="feature-icon" />
              <h3 className="feature-title">Certifications</h3>
              <p className="feature-description">Earn industry-recognized certifications to validate your expertise.</p>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="forms-section">
          {/* Register as Trainer */}
          <div className="form-card">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: '0.5rem' }} />
              Register as a Trainer
            </h2>
            <form onSubmit={submitTrainer}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={trainerForm.fullName} 
                  onChange={handleTrainerChange} 
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
                  value={trainerForm.email} 
                  onChange={handleTrainerChange} 
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
                  value={trainerForm.expertiseAreas} 
                  onChange={handleTrainerChange} 
                  className="form-input"
                  placeholder="e.g., React, Python, Data Science, UX Design" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input 
                  type="text" 
                  name="yearsExperience" 
                  value={trainerForm.yearsExperience} 
                  onChange={handleTrainerChange} 
                  className="form-input"
                  placeholder="e.g., 3+ years" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile (Optional)</label>
                <input 
                  type="url" 
                  name="linkedin" 
                  value={trainerForm.linkedin} 
                  onChange={handleTrainerChange} 
                  className="form-input"
                  placeholder="https://linkedin.com/in/yourprofile" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio & Teaching Experience</label>
                <textarea 
                  name="bio" 
                  value={trainerForm.bio} 
                  onChange={handleTrainerChange} 
                  className="form-textarea"
                  placeholder="Tell us about yourself and your teaching experience" 
                  rows={4} 
                />
              </div>
              <button className="form-button" disabled={trainerSubmitting}>
                {trainerSubmitting ? 'Submitting...' : 'Register as Trainer'}
              </button>
              {trainerSubmitMsg && (
                <div className={`form-message ${trainerSubmitMsg.includes('Thanks') ? 'success' : 'error'}`}>
                  {trainerSubmitMsg}
                </div>
              )}
            </form>
          </div>

          {/* Enroll in a Program */}
          <div className="form-card">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: '0.5rem' }} />
              Enroll in a Program
            </h2>
            <form onSubmit={submitEnroll}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={enrollForm.fullName} 
                  onChange={handleEnrollChange} 
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
                  value={enrollForm.email} 
                  onChange={handleEnrollChange} 
                  className="form-input"
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select a Program</label>
                <select 
                  name="programId" 
                  value={enrollForm.programId} 
                  onChange={handleEnrollChange} 
                  className="form-select"
                  required
                >
                  <option value="">Choose a training program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title || p.name || `Program ${p.id}`}
                    </option>
                  ))}
                </select>
                {programsLoading && <p className="loading-text">Loading programs...</p>}
                {programsError && <p className="form-message error">{programsError}</p>}
                {selectedProgram && (
                  <p className="form-message info">
                    Selected: {selectedProgram.title || selectedProgram.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Learning Goals</label>
                <textarea 
                  name="goals" 
                  value={enrollForm.goals} 
                  onChange={handleEnrollChange} 
                  className="form-textarea"
                  placeholder="What do you want to achieve through this training?" 
                  rows={4} 
                />
              </div>
              <button className="form-button" disabled={enrollSubmitting}>
                {enrollSubmitting ? 'Submitting...' : 'Enroll Now'}
              </button>
              {enrollSubmitMsg && (
                <div className={`form-message ${enrollSubmitMsg.includes('successful') ? 'success' : 'error'}`}>
                  {enrollSubmitMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
