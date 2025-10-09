import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faAward, faDollarSign, faTrophy, faArrowLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProgramPages.css';

const Scholarships = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    scholarshipId: '',
    statement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    const loadScholarships = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await makeAuthenticatedRequest(
          buildApiUrl('/api/scholarships'),
          { method: 'GET' }
        );
        if (res && res.ok) {
          const data = await res.json();
          setScholarships(Array.isArray(data) ? data : (data?.items || []));
        } else {
          setError('Failed to load scholarships.');
        }
      } catch (e) {
        setError('Network error while loading scholarships.');
      } finally {
        setLoading(false);
      }
    };
    loadScholarships();
  }, []);

  const selectedScholarship = useMemo(() => scholarships.find(s => String(s.id) === String(applyForm.scholarshipId)), [scholarships, applyForm.scholarshipId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplyForm(prev => ({ ...prev, [name]: value }));
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitMsg('');
    setSubmitting(true);
    try {
      const res = await makeAuthenticatedRequest(
        buildApiUrl('/api/scholarships/applications'),
        {
          method: 'POST',
          body: JSON.stringify(applyForm)
        }
      );
      if (res && res.ok) {
        setSubmitMsg('Application submitted successfully. We will contact you via email.');
        setApplyForm({ fullName: '', email: '', scholarshipId: '', statement: '' });
      } else {
        setSubmitMsg('Unable to submit right now. Please try again later.');
      }
    } catch (err) {
      setSubmitMsg('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
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
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <h1 className="hero-title">Scholarships</h1>
          <p className="hero-description">
            Discover amazing scholarship opportunities to support your educational journey and career development. 
            Apply for financial assistance to pursue your academic and professional goals.
          </p>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faAward} className="feature-icon" />
              <h3 className="feature-title">Merit-Based Awards</h3>
              <p className="feature-description">Recognition for academic excellence and outstanding achievements.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faDollarSign} className="feature-icon" />
              <h3 className="feature-title">Financial Support</h3>
              <p className="feature-description">Reduce the financial burden of education and focus on learning.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faTrophy} className="feature-icon" />
              <h3 className="feature-title">Prestigious Programs</h3>
              <p className="feature-description">Access to top-tier educational opportunities and institutions.</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="forms-section" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-card">
            <h2 className="form-title">
              <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '0.5rem' }} />
              Apply for a Scholarship
            </h2>
            <form onSubmit={submitApplication}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={applyForm.fullName} 
                  onChange={handleChange} 
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
                  value={applyForm.email} 
                  onChange={handleChange} 
                  className="form-input"
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select a Scholarship</label>
                <select 
                  name="scholarshipId" 
                  value={applyForm.scholarshipId} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  <option value="">Choose a scholarship program</option>
                  {scholarships.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title || s.name || `Scholarship ${s.id}`}
                    </option>
                  ))}
                </select>
                {loading && <p className="loading-text">Loading scholarships...</p>}
                {error && <p className="form-message error">{error}</p>}
                {selectedScholarship && (
                  <p className="form-message info">
                    Selected: {selectedScholarship.title || selectedScholarship.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Personal Statement</label>
                <textarea 
                  name="statement" 
                  value={applyForm.statement} 
                  onChange={handleChange} 
                  className="form-textarea"
                  placeholder="Tell us why you're a good fit for this scholarship. Include your academic achievements, career goals, and how this scholarship will help you." 
                  rows={6} 
                />
              </div>
              <button className="form-button" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              {submitMsg && (
                <div className={`form-message ${submitMsg.includes('successfully') ? 'success' : 'error'}`}>
                  {submitMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
