import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faBuilding, 
  faPlus, 
  faTrash, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner,
  faArrowLeft,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/ReferenceVerification.css';

const ReferenceVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addedReferenceId, setAddedReferenceId] = useState(null);

  // New reference form data
  const [newReference, setNewReference] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    relationship: '',
    yearsKnown: '',
    additionalInfo: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/references/my-references'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReferences(data.references || []);
      } else {
        setError('Failed to fetch references');
      }
    } catch (err) {
      console.error('Error fetching references:', err);
      setError('Failed to fetch references');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newReference.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!newReference.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newReference.email)) {
      errors.email = 'Email is invalid';
    }

    if (!newReference.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!newReference.company.trim()) {
      errors.company = 'Company is required';
    }

    if (!newReference.position.trim()) {
      errors.position = 'Position is required';
    }

    if (!newReference.relationship.trim()) {
      errors.relationship = 'Relationship is required';
    }

    if (!newReference.yearsKnown.trim()) {
      errors.yearsKnown = 'Years known is required';
    } else if (isNaN(newReference.yearsKnown) || parseInt(newReference.yearsKnown) < 1) {
      errors.yearsKnown = 'Please enter a valid number of years';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReference(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/references/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReference)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Reference added successfully! Verification email has been sent.');
        setAddedReferenceId(data.reference_id);
        setNewReference({
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          relationship: '',
          yearsKnown: '',
          additionalInfo: ''
        });
        setShowAddForm(false);
        fetchReferences(); // Refresh the list
        
        // Redirect to verification status page after a short delay
        setTimeout(() => {
          navigate(`/reference-verification-status/${data.reference_id}`);
        }, 2000);
      } else {
        setError(data.message || 'Failed to add reference');
      }
    } catch (err) {
      console.error('Error adding reference:', err);
      setError('Failed to add reference. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReference = async (referenceId) => {
    if (!window.confirm('Are you sure you want to delete this reference?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/references/delete/${referenceId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Reference deleted successfully');
        fetchReferences(); // Refresh the list
      } else {
        setError('Failed to delete reference');
      }
    } catch (err) {
      console.error('Error deleting reference:', err);
      setError('Failed to delete reference');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon verified" />;
      case 'pending':
        return <FontAwesomeIcon icon={faSpinner} className="status-icon pending" />;
      case 'rejected':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon rejected" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon unknown" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="reference-verification-page">
        <div className="reference-container">
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} className="loading-spinner" />
            <p>Loading references...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reference-verification-page">
      <div className="reference-container">
        <div className="reference-header">
          <div className="header-content">
            <h1>Reference Verification</h1>
            <p>Add professional references to enhance your profile credibility</p>
          </div>
          <button 
            className="add-reference-btn"
            onClick={() => setShowAddForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Reference
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FontAwesomeIcon icon={faCheckCircle} />
            {success}
          </div>
        )}

        {/* Add Reference Form */}
        {showAddForm && (
          <div className="add-reference-form">
            <div className="form-header">
              <h2>Add New Reference</h2>
              <button 
                className="close-form-btn"
                onClick={() => setShowAddForm(false)}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newReference.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? 'error' : ''}
                    placeholder="Enter reference's full name"
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newReference.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Enter reference's email"
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newReference.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? 'error' : ''}
                    placeholder="Enter reference's phone number"
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newReference.company}
                    onChange={handleInputChange}
                    className={formErrors.company ? 'error' : ''}
                    placeholder="Enter company name"
                  />
                  {formErrors.company && <span className="error-text">{formErrors.company}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="position">Position/Title *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={newReference.position}
                    onChange={handleInputChange}
                    className={formErrors.position ? 'error' : ''}
                    placeholder="Enter reference's position"
                  />
                  {formErrors.position && <span className="error-text">{formErrors.position}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="relationship">Relationship *</label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={newReference.relationship}
                    onChange={handleInputChange}
                    className={formErrors.relationship ? 'error' : ''}
                  >
                    <option value="">Select relationship</option>
                    <option value="former_manager">Former Manager</option>
                    <option value="current_manager">Current Manager</option>
                    <option value="colleague">Colleague</option>
                    <option value="client">Client</option>
                    <option value="mentor">Mentor</option>
                    <option value="professor">Professor</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.relationship && <span className="error-text">{formErrors.relationship}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="yearsKnown">Years Known *</label>
                  <input
                    type="number"
                    id="yearsKnown"
                    name="yearsKnown"
                    value={newReference.yearsKnown}
                    onChange={handleInputChange}
                    className={formErrors.yearsKnown ? 'error' : ''}
                    placeholder="How many years have you known them?"
                    min="1"
                    max="50"
                  />
                  {formErrors.yearsKnown && <span className="error-text">{formErrors.yearsKnown}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={newReference.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any additional information about this reference (optional)"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      Adding Reference...
                    </>
                  ) : (
                    'Add Reference'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* References List */}
        <div className="references-section">
          <h2>Your References ({references.length})</h2>
          
          {references.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faUser} className="empty-icon" />
              <h3>No References Added</h3>
              <p>Add professional references to enhance your profile credibility</p>
              <button 
                className="add-first-reference-btn"
                onClick={() => setShowAddForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Your First Reference
              </button>
            </div>
          ) : (
            <div className="references-grid">
              {references.map((reference) => (
                <div key={reference._id} className="reference-card">
                  <div className="reference-header">
                    <div className="reference-info">
                      <h3>{reference.name}</h3>
                      <p className="reference-position">{reference.position} at {reference.company}</p>
                    </div>
                    <div className="reference-status">
                      {getStatusIcon(reference.status)}
                      <span className={`status-text ${reference.status}`}>
                        {getStatusText(reference.status)}
                      </span>
                    </div>
                  </div>

                  <div className="reference-details">
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>{reference.email}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>{reference.phone}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faUser} />
                      <span>{reference.relationship.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faBuilding} />
                      <span>Known for {reference.yearsKnown} years</span>
                    </div>
                  </div>

                  {reference.additionalInfo && (
                    <div className="reference-notes">
                      <p><strong>Notes:</strong> {reference.additionalInfo}</p>
                    </div>
                  )}

                  {reference.status === 'verified' && reference.verifiedAt && (
                    <div className="verification-info">
                      <p><strong>Verified on:</strong> {new Date(reference.verifiedAt).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="reference-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteReference(reference._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="info-panel">
          <div className="info-header">
            <FontAwesomeIcon icon={faInfoCircle} />
            <h3>How Reference Verification Works</h3>
          </div>
          <div className="info-content">
            <ol>
              <li>Add your professional references with their contact information</li>
              <li>We'll send a verification email to each reference</li>
              <li>References can verify your professional relationship through our secure portal</li>
              <li>Once verified, the reference will appear on your profile with a verified badge</li>
              <li>Verified references enhance your credibility with potential employers</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceVerification;
