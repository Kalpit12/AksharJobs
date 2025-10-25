import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faUsers, 
  faGlobe, 
  faSearch,
  faFilter,
  faBriefcase,
  faArrowLeft,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, selectedIndustry, selectedSize, companies]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl('/api/companies/list'));
      
      if (response.data && response.data.companies) {
        setCompanies(response.data.companies);
        setFilteredCompanies(response.data.companies);
      } else {
        console.warn('⚠️ No companies data in response');
        setCompanies([]);
        setFilteredCompanies([]);
      }
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Request error: No response received');
      } else {
        console.error('Error message:', error.message);
      }
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => 
        company.industry === selectedIndustry
      );
    }

    // Company size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter(company => 
        company.companySize === selectedSize
      );
    }

    setFilteredCompanies(filtered);
  };

  const getUniqueIndustries = () => {
    const industries = companies.map(c => c.industry).filter(Boolean);
    return [...new Set(industries)].sort();
  };

  const getUniqueSizes = () => {
    const sizes = companies.map(c => c.companySize).filter(Boolean);
    return [...new Set(sizes)].sort();
  };

  const handleCompanyClick = (company) => {
    // Navigate to company detail page or jobs page filtered by company
    navigate(`/jobs?company=${encodeURIComponent(company.companyName)}`);
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'C';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="companies-page">
      {/* Back to Homepage Button */}
      <button 
        className="back-to-home-btn" 
        onClick={() => navigate('/')}
        aria-label="Back to Homepage"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        <span>Back to Home</span>
      </button>

      {/* Hero Section */}
      <div className="companies-hero">
        <div className="companies-hero-overlay"></div>
        <div className="companies-hero-content">
          <div className="hero-badge">
            <FontAwesomeIcon icon={faBuilding} className="badge-icon" />
            <span>TRUSTED PARTNERS</span>
          </div>
          <h1 className="companies-hero-title">
            Explore Top Companies <br />
            <span className="gradient-text">Hiring Talent Like You</span>
          </h1>
          <p className="companies-hero-subtitle">
            Connect with industry-leading organizations actively seeking exceptional professionals
          </p>
          <div className="companies-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{companies.length}+</div>
                <div className="stat-label">Partner Companies</div>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{getUniqueIndustries().length}+</div>
                <div className="stat-label">Industries</div>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-content">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Open Positions</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="companies-filters-container">
        <div className="companies-filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Industries</option>
              {getUniqueIndustries().map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sizes</option>
              {getUniqueSizes().map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-count">
          Showing <strong>{filteredCompanies.length}</strong> {filteredCompanies.length === 1 ? 'company' : 'companies'}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="companies-container">
        {loading ? (
          <div className="companies-loading">
            <div className="loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="no-companies">
            <FontAwesomeIcon icon={faBuilding} className="no-companies-icon" />
            <h3>No Companies Found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="companies-grid">
            {filteredCompanies.map((company, index) => (
              <div
                key={company._id || index}
                className="company-card"
                onClick={() => handleCompanyClick(company)}
              >
                <div className="company-card-header">
                  <div className="card-header-bg"></div>
                  <div className="company-logo-wrapper">
                    {company.companyLogo ? (
                      <img
                        src={company.companyLogo}
                        alt={company.companyName}
                        className="company-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="company-logo-placeholder"
                      style={{ display: company.companyLogo ? 'none' : 'flex' }}
                    >
                      <span className="initials-text">{getCompanyInitials(company.companyName)}</span>
                    </div>
                  </div>
                  <div className="verified-badge">
                    <FontAwesomeIcon icon={faBriefcase} />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="company-card-body">
                  <h3 className="company-name">{company.companyName || 'Company Name'}</h3>
                  
                  {company.industry && (
                    <div className="company-detail">
                      <FontAwesomeIcon icon={faBriefcase} />
                      <span>{company.industry}</span>
                    </div>
                  )}

                  {(company.city || company.country) && (
                    <div className="company-detail">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>
                        {[company.city, company.state, company.country]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  )}

                  {company.companySize && (
                    <div className="company-detail">
                      <FontAwesomeIcon icon={faUsers} />
                      <span>{company.companySize}</span>
                    </div>
                  )}

                  {company.companyWebsite && (
                    <div className="company-detail">
                      <FontAwesomeIcon icon={faGlobe} />
                      <a
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="company-website"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {company.companyDescription && (
                    <p className="company-description">
                      {company.companyDescription.length > 120
                        ? `${company.companyDescription.substring(0, 120)}...`
                        : company.companyDescription}
                    </p>
                  )}
                </div>

                <div className="company-card-footer">
                  <button className="view-jobs-btn">
                    View Open Positions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;

