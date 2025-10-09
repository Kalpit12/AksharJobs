import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faIndustry, 
  faGlobe, 
  faPhone, 
  faUsers, 
  faCalendarAlt,
  faEdit,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Company.css';

const Company = () => {
  const { user, isRecruiter } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isRecruiter()) {
      setError('Access denied. This page is only available for recruiters.');
      setLoading(false);
      return;
    }

    fetchCompanyData();
  }, [isRecruiter]);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view company information.');
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl('/api/auth/get_user'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCompanyData(userData);
      } else {
        setError('Failed to fetch company information.');
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('An error occurred while fetching company information.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="company-page">
        <Header />
        <div className="company-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading company information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-page">
        <Header />
        <div className="company-container">
          <div className="error-state">
            <FontAwesomeIcon icon={faBuilding} className="error-icon" />
            <h2>Access Denied</h2>
            <p>{error}</p>
            <button 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="company-page">
      <Header />
      <div className="company-container">
        <div className="company-header">
          <div className="company-title">
            <FontAwesomeIcon icon={faBuilding} className="title-icon" />
            <h1>Company Profile</h1>
          </div>
          <button 
            className="edit-button"
            onClick={() => window.location.href = '/recruiter-registration'}
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit Company Details
          </button>
        </div>

        <div className="company-content">
          <div className="company-info-card">
            <div className="company-logo-section">
              <div className="company-logo">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className="company-basic-info">
                <h2>{companyData?.companyName || 'Company Name Not Set'}</h2>
                <p className="company-role">Recruiter Account</p>
              </div>
            </div>

            <div className="company-details-grid">
              <div className="detail-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                <div className="detail-content">
                  <h4>Location</h4>
                  <p>{companyData?.location || 'Not specified'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faIndustry} className="detail-icon" />
                <div className="detail-content">
                  <h4>Industry</h4>
                  <p>{companyData?.industry || 'Not specified'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faGlobe} className="detail-icon" />
                <div className="detail-content">
                  <h4>Website</h4>
                  <p>
                    {companyData?.website ? (
                      <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                        {companyData.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faPhone} className="detail-icon" />
                <div className="detail-content">
                  <h4>Phone</h4>
                  <p>{companyData?.phone || 'Not specified'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faUsers} className="detail-icon" />
                <div className="detail-content">
                  <h4>Company Size</h4>
                  <p>{companyData?.companySize || 'Not specified'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                <div className="detail-content">
                  <h4>Founded</h4>
                  <p>{companyData?.foundedYear || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {companyData?.description && (
              <div className="company-description">
                <h4>About the Company</h4>
                <p>{companyData.description}</p>
              </div>
            )}

            <div className="company-actions">
              <button 
                className="primary-button"
                onClick={() => window.location.href = '/recruiter-registration'}
              >
                <FontAwesomeIcon icon={faEdit} />
                Update Company Details
              </button>
              <button 
                className="secondary-button"
                onClick={() => window.location.href = '/recruiter-dashboard'}
              >
                <FontAwesomeIcon icon={faBuilding} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Company;
