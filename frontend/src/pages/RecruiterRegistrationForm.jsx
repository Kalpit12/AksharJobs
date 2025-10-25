import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faMapMarkerAlt, faUserTie, faBriefcase, 
  faGlobeAmericas, faHandshake, faFileAlt, faShareAlt, 
  faCrown, faClipboardCheck, faUpload, faImage, faPhone,
  faEnvelope, faLink, faPlus, faTimes, faCheckCircle, 
  faInfoCircle, faCheck, faShieldAlt, faFileUpload
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/RecruiterRegistrationForm.css';
import 'leaflet/dist/leaflet.css';

// Import Leaflet directly (same as job seeker form)
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Countries list - moved outside component for better performance
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
  "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

const RecruiterRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);


  // Form state
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    companySize: '',
    yearFounded: '',
    industry: '',
    companyDescription: '',
    
    // Company Location
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    latitude: '',
    longitude: '',
    
    // Recruiter Personal Details
    firstName: '',
    lastName: '',
    jobTitle: '',
    recruiterPhone: '',
    recruiterEmail: '',
    linkedinProfile: '',
    
    // Geographic Coverage
    offersRemote: '',
    
    // Terms
    agreeTerms: false,
    agreeDataProcessing: false,
    agreeMarketing: false,
    verifyInfo: false,
    
    // Other
    referralSource: '',
    additionalComments: '',
    careerLevels: [],
    hiringVolume: '',
    timeToHire: '',
    taxId: '',
    linkedinCompany: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });

  const [industries, setIndustries] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [recruitCountries, setRecruitCountries] = useState([]);
  const [additionalLinks, setAdditionalLinks] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);

  const [industryInput, setIndustryInput] = useState('');
  const [functionInput, setFunctionInput] = useState('');
  const [recruitCountryInput, setRecruitCountryInput] = useState('');
  const [linkTypeInput, setLinkTypeInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [useMapAddress, setUseMapAddress] = useState(false);

  // Define setMarker function before useEffect that uses it
  const setMarker = useCallback((lat, lng, forceUpdateAddress = false) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    
    const marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      setFormData(prev => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng
      }));
      
      // Only reverse geocode if user wants to use map address
      if (useMapAddress) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
          .then(response => response.json())
          .then(data => {
            if (data.display_name) {
              setFormData(prev => ({
                ...prev,
                address: data.display_name
              }));
            }
          })
          .catch(error => {
            console.log('Reverse geocoding failed:', error);
          });
      }
    });

    // Only reverse geocode if user wants to use map address or it's forced (initial load)
    if (useMapAddress || forceUpdateAddress) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name
            }));
          }
        })
        .catch(error => {
          console.log('Reverse geocoding failed:', error);
        });
    }
  }, [useMapAddress]);

  // Initialize map (same simple approach as job seeker form)
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Default center (Nairobi, Kenya)
        const map = L.map(mapRef.current).setView([-1.286389, 36.817223], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add click event to map
        map.on('click', function(e) {
          setMarker(e.latlng.lat, e.latlng.lng, false);
        });

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            // Don't force update address on initial geolocation
            setMarker(lat, lng, false);
          });
        }

        setMapLoaded(true);
      }
    };

    const timer = setTimeout(initMap, 100);
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [setMarker]);

  const updateProgress = useCallback(() => {
    const requiredFields = [
      formData.companyName, formData.companyEmail, formData.companyPhone,
      formData.companySize, formData.yearFounded, formData.industry,
      formData.companyDescription, formData.country, formData.state,
      formData.city, formData.address, formData.firstName, formData.lastName,
      formData.jobTitle, formData.recruiterPhone, formData.recruiterEmail,
      formData.offersRemote,
      formData.agreeTerms, formData.agreeDataProcessing, formData.verifyInfo
    ];

    const filledFields = requiredFields.filter(field => {
      if (typeof field === 'boolean') return field === true;
      return field && field.toString().trim() !== '';
    }).length;

    let bonus = 0;
    if (industries.length > 0) bonus += 2;
    if (functions.length > 0) bonus += 2;
    if (recruitCountries.length > 0) bonus += 2;

    const progressPercent = Math.min(((filledFields + bonus) / requiredFields.length) * 100, 100);
    setProgress(progressPercent);
  }, [formData, industries, functions, recruitCountries]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'employmentTypes[]') {
        const updatedTypes = checked 
          ? [...employmentTypes, value]
          : employmentTypes.filter(t => t !== value);
        setEmploymentTypes(updatedTypes);
      } else if (name === 'additionalServices[]') {
        const updatedServices = checked
          ? [...additionalServices, value]
          : additionalServices.filter(s => s !== value);
        setAdditionalServices(updatedServices);
      } else if (name === 'useMapAddress') {
        setUseMapAddress(checked);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name === 'careerLevels') {
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: options
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    updateProgress();
  }, [employmentTypes, additionalServices, updateProgress]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIndustry = () => {
    if (industryInput && !industries.includes(industryInput)) {
      setIndustries([...industries, industryInput]);
      setIndustryInput('');
      updateProgress();
    }
  };

  const removeIndustry = (index) => {
    setIndustries(industries.filter((_, i) => i !== index));
    updateProgress();
  };

  const addFunction = () => {
    if (functionInput && !functions.includes(functionInput)) {
      setFunctions([...functions, functionInput]);
      setFunctionInput('');
      updateProgress();
    }
  };

  const removeFunction = (index) => {
    setFunctions(functions.filter((_, i) => i !== index));
    updateProgress();
  };

  const addRecruitCountry = () => {
    if (recruitCountryInput && !recruitCountries.includes(recruitCountryInput)) {
      setRecruitCountries([...recruitCountries, recruitCountryInput]);
      setRecruitCountryInput('');
      updateProgress();
    }
  };

  const removeRecruitCountry = (index) => {
    setRecruitCountries(recruitCountries.filter((_, i) => i !== index));
    updateProgress();
  };

  const addLink = () => {
    if (!linkTypeInput.trim()) {
      alert('Please enter a link type');
      return;
    }
    
    if (!linkUrlInput.trim()) {
      alert('Please enter a URL');
      return;
    }

    try {
      new URL(linkUrlInput);
    } catch (e) {
      alert('Please enter a valid URL (including https://)');
      return;
    }

    setAdditionalLinks([...additionalLinks, { type: linkTypeInput, url: linkUrlInput }]);
    setLinkTypeInput('');
    setLinkUrlInput('');
  };

  const removeLink = (index) => {
    setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (industries.length === 0) {
      alert('Please add at least one industry you recruit for');
      return;
    }

    if (functions.length === 0) {
      alert('Please add at least one job function');
      return;
    }

    if (recruitCountries.length === 0) {
      alert('Please add at least one country you recruit for');
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const submitData = {
        ...formData,
        industries,
        functions,
        recruitCountries,
        additionalLinks,
        employmentTypes,
        additionalServices
      };

      // Debug: Log the data being submitted
      console.log('Submitting recruiter data:', submitData);

      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/recruiters/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      alert('Registration submitted successfully! Your account will be reviewed within 24-48 hours.');
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recruiter-details-comprehensive">
      
      {/* Header */}
      <header className="recruiter-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-section" onClick={() => navigate('/recruiter-dashboard')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon">
                <img src="/AK_logo.png" alt="AksharJobs Logo" />
              </div>
              <div className="logo-text">
                <h3 className="logo-title">AksharJobs</h3>
                <p className="logo-subtitle">Recruiter Registration</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-controls">
              <span className="auto-save-status">
                <FontAwesomeIcon icon={faCheck} />
                <span>Auto-saving every 2 minutes</span>
              </span>
              <button
                className="clear-form-btn"
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
                    window.location.reload();
                  }
                }}
              >
                Clear Form Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="recruiter-main">
        <div className="recruiter-container">
          <div className="recruiter-form-card">
            {/* Main Form */}
            <div className="recruiter-form-container">
              <form id="recruiterForm" onSubmit={handleSubmit}>
                {/* Compact Progress Section */}
                <div className="progress-section-comprehensive">
                  <div className="progress-header-comprehensive">
                    <h2>Registration Progress</h2>
                    <span className="progress-percentage-comprehensive">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar-comprehensive">
                    <div className="progress-fill-comprehensive" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faBuilding} />
                    Company Information
                  </h2>

                  {logoPreview && (
                    <div className="profile-photo-preview-comprehensive">
                      <img src={logoPreview} alt="Company Logo" />
                    </div>
                  )}

                  <div className="form-group-comprehensive">
                    <label className="file-upload-comprehensive">
                      <FontAwesomeIcon icon={faImage} />
                      <div className="file-upload-text-comprehensive">
                        <strong>Upload Company Logo</strong>
                        <p>Click to browse or drag and drop (PNG, JPG, max 5MB)</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoChange} />
                    </label>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Company Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="companyName" 
                      required 
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Company Email <span className="required">*</span></label>
                      <input 
                        type="email" 
                        name="companyEmail" 
                        required 
                        placeholder="contact@company.com"
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Company Phone <span className="required">*</span></label>
                      <input 
                        type="tel" 
                        name="companyPhone" 
                        required 
                        placeholder="+254 700 000 000"
                        value={formData.companyPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Company Website</label>
                    <input 
                      type="url" 
                      name="companyWebsite" 
                      placeholder="https://www.yourcompany.com"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Company Size <span className="required">*</span></label>
                      <select 
                        name="companySize" 
                        required
                        value={formData.companySize}
                        onChange={handleInputChange}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001-5000">1001-5000 employees</option>
                        <option value="5001+">5001+ employees</option>
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Year Founded <span className="required">*</span></label>
                      <input 
                        type="number" 
                        name="yearFounded" 
                        required 
                        min="1800" 
                        max="2025" 
                        placeholder="2015"
                        value={formData.yearFounded}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Industry/Sector <span className="required">*</span></label>
                    <select 
                      name="industry" 
                      required
                      value={formData.industry}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your primary industry</option>
                      <option value="technology">Technology & IT</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="healthcare">Healthcare & Medical</option>
                      <option value="education">Education & Training</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="hospitality">Hospitality & Tourism</option>
                      <option value="construction">Construction & Real Estate</option>
                      <option value="agriculture">Agriculture & Agribusiness</option>
                      <option value="energy">Energy & Utilities</option>
                      <option value="telecommunications">Telecommunications</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="consulting">Consulting & Professional Services</option>
                      <option value="government">Government & Public Sector</option>
                      <option value="ngo">NGO & Non-Profit</option>
                      <option value="legal">Legal Services</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="logistics">Logistics & Transportation</option>
                      <option value="recruitment">Recruitment & Staffing Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Company Description <span className="required">*</span></label>
                    <textarea 
                      name="companyDescription" 
                      required 
                      placeholder="Describe your company, its mission, vision, and what makes it a great place to work. (Minimum 150 characters)"
                      value={formData.companyDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Company Location Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Company Location
                  </h2>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Country <span className="required">*</span></label>
                      <select 
                        name="country" 
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
                      </select>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>State/Province <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="state" 
                        required 
                        placeholder="e.g., Nairobi"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>City <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="city" 
                        required 
                        placeholder="e.g., Nairobi"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Postal/ZIP Code</label>
                      <input 
                        type="text" 
                        name="postalCode" 
                        placeholder="Enter postal code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Full Address <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="address" 
                      required 
                      placeholder="Street address, building name, suite number"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Pin Your Office Location on Map (Optional)</label>
                    <div className="info-badge">
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> Click on the map to mark your office location
                    </div>
                    
                    <div style={{ margin: '10px 0', padding: '8px', backgroundColor: '#f0f8ff', borderRadius: '6px', border: '1px solid #b3d9ff' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                        <input 
                          type="checkbox" 
                          name="useMapAddress"
                          checked={useMapAddress}
                          onChange={handleInputChange}
                          style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: '500' }}>
                          📍 Automatically update address field when clicking on map
                        </span>
                      </label>
                      <p style={{ margin: '5px 0 0 28px', fontSize: '12px', color: '#666' }}>
                        {useMapAddress 
                          ? '✓ Address will be updated based on map location' 
                          : '✗ Your manual address will be preserved'}
                      </p>
                    </div>

                    <div ref={mapRef} className="map-container" style={{ height: '300px', width: '100%' }}>
                      {!mapLoaded && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)', 
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          Loading map...
                        </div>
                      )}
                    </div>
                    {mapLoaded && (
                      <div className="coordinates-display">
                        <strong>Selected Coordinates:</strong> 
                        {formData.latitude && formData.longitude 
                          ? `Lat: ${parseFloat(formData.latitude).toFixed(6)}, Lng: ${parseFloat(formData.longitude).toFixed(6)}`
                          : ' Click on the map to select'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recruiter Personal Details Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faUserTie} />
                    Recruiter Personal Details
                  </h2>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>First Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="firstName" 
                        required 
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Last Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="lastName" 
                        required 
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Job Title <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="jobTitle" 
                        required 
                        placeholder="e.g., HR Manager, Talent Acquisition Lead"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Direct Phone Number <span className="required">*</span></label>
                      <input 
                        type="tel" 
                        name="recruiterPhone" 
                        required 
                        placeholder="+254 700 000 000"
                        value={formData.recruiterPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Professional Email <span className="required">*</span></label>
                    <input 
                      type="email" 
                      name="recruiterEmail" 
                      required 
                      placeholder="your.name@company.com"
                      value={formData.recruiterEmail}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-comprehensive">
                    <label>LinkedIn Profile</label>
                    <input 
                      type="url" 
                      name="linkedinProfile" 
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Recruitment Specialization Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faBriefcase} />
                    Recruitment Specialization
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>Industries You Recruit For <span className="required">*</span></label>
                    <div className="info-badge">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add all industries you actively recruit for
                    </div>
                    <div className="skills-input-container">
                      <select 
                        value={industryInput}
                        onChange={(e) => setIndustryInput(e.target.value)}
                      >
                        <option value="">Select an industry</option>
                        <option value="Technology & IT">Technology & IT</option>
                        <option value="Finance & Banking">Finance & Banking</option>
                        <option value="Healthcare & Medical">Healthcare & Medical</option>
                        <option value="Education & Training">Education & Training</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail & E-commerce">Retail & E-commerce</option>
                        <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                        <option value="Construction & Real Estate">Construction & Real Estate</option>
                        <option value="Agriculture">Agriculture & Agribusiness</option>
                        <option value="Energy & Utilities">Energy & Utilities</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Media & Entertainment">Media & Entertainment</option>
                        <option value="Consulting">Consulting & Professional Services</option>
                        <option value="Government">Government & Public Sector</option>
                        <option value="NGO & Non-Profit">NGO & Non-Profit</option>
                        <option value="Legal Services">Legal Services</option>
                        <option value="Marketing & Advertising">Marketing & Advertising</option>
                        <option value="Logistics & Transportation">Logistics & Transportation</option>
                      </select>
                      <button type="button" className="add-btn" onClick={addIndustry}>
                        <FontAwesomeIcon icon={faPlus} /> Add
                      </button>
                    </div>
                    <div className="tags-container">
                      {industries.map((industry, index) => (
                        <div key={index} className="tag">
                          {industry}
                          <span className="remove" onClick={() => removeIndustry(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Job Functions You Recruit For <span className="required">*</span></label>
                    <div className="info-badge">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add specific job functions (e.g., Software Development, Sales, Marketing)
                    </div>
                    <div className="skills-input-container">
                      <input 
                        type="text" 
                        placeholder="Enter job function (e.g., Software Development)"
                        value={functionInput}
                        onChange={(e) => setFunctionInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFunction())}
                      />
                      <button type="button" className="add-btn" onClick={addFunction}>
                        <FontAwesomeIcon icon={faPlus} /> Add
                      </button>
                    </div>
                    <div className="tags-container">
                      {functions.map((func, index) => (
                        <div key={index} className="tag">
                          {func}
                          <span className="remove" onClick={() => removeFunction(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Career Levels You Recruit <span className="required">*</span></label>
                      <select 
                        name="careerLevels" 
                        multiple 
                        size="5"
                        value={formData.careerLevels}
                        onChange={handleInputChange}
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="lead">Lead/Principal</option>
                        <option value="manager">Manager</option>
                        <option value="director">Director</option>
                        <option value="executive">Executive/C-Level</option>
                      </select>
                      <small style={{ color: '#666', fontSize: '11px' }}>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Average Hiring Volume (Monthly)</label>
                      <select 
                        name="hiringVolume"
                        value={formData.hiringVolume}
                        onChange={handleInputChange}
                      >
                        <option value="">Select hiring volume</option>
                        <option value="1-5">1-5 positions</option>
                        <option value="6-10">6-10 positions</option>
                        <option value="11-20">11-20 positions</option>
                        <option value="21-50">21-50 positions</option>
                        <option value="51+">51+ positions</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Geographic Coverage Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faGlobeAmericas} />
                    Geographic Coverage
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>Countries You Recruit For <span className="required">*</span></label>
                    <div className="info-badge">
                      <FontAwesomeIcon icon={faInfoCircle} /> Add all countries where you actively recruit candidates
                    </div>
                    <div className="skills-input-container">
                      <select 
                        value={recruitCountryInput}
                        onChange={(e) => setRecruitCountryInput(e.target.value)}
                      >
                        <option value="">Select a country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
                      </select>
                      <button type="button" className="add-btn" onClick={addRecruitCountry}>
                        <FontAwesomeIcon icon={faPlus} /> Add
                      </button>
                    </div>
                    <div className="tags-container">
                      {recruitCountries.map((country, index) => (
                        <div key={index} className="tag">
                          {country}
                          <span className="remove" onClick={() => removeRecruitCountry(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Do you offer international/remote positions? <span className="required">*</span></label>
                    <div className="radio-group">
                      <div className="radio-option">
                        <input 
                          type="radio" 
                          id="remoteYes" 
                          name="offersRemote" 
                          value="yes" 
                          required
                          checked={formData.offersRemote === 'yes'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="remoteYes">Yes, regularly</label>
                      </div>
                      <div className="radio-option">
                        <input 
                          type="radio" 
                          id="remoteSometimes" 
                          name="offersRemote" 
                          value="sometimes" 
                          required
                          checked={formData.offersRemote === 'sometimes'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="remoteSometimes">Sometimes</label>
                      </div>
                      <div className="radio-option">
                        <input 
                          type="radio" 
                          id="remoteNo" 
                          name="offersRemote" 
                          value="no" 
                          required
                          checked={formData.offersRemote === 'no'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="remoteNo">No, only on-site</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services & Offerings Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faHandshake} />
                    Services & Offerings
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>Types of Employment You Offer <span className="required">*</span></label>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="fullTime" 
                        name="employmentTypes[]" 
                        value="full-time"
                        checked={employmentTypes.includes('full-time')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="fullTime">Full-time Positions</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="partTime" 
                        name="employmentTypes[]" 
                        value="part-time"
                        checked={employmentTypes.includes('part-time')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="partTime">Part-time Positions</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="contract" 
                        name="employmentTypes[]" 
                        value="contract"
                        checked={employmentTypes.includes('contract')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="contract">Contract/Temporary</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="freelance" 
                        name="employmentTypes[]" 
                        value="freelance"
                        checked={employmentTypes.includes('freelance')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="freelance">Freelance/Project-based</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="internship" 
                        name="employmentTypes[]" 
                        value="internship"
                        checked={employmentTypes.includes('internship')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="internship">Internships</label>
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Additional Services Offered</label>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="visa" 
                        name="additionalServices[]" 
                        value="visa"
                        checked={additionalServices.includes('visa')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="visa">Visa Sponsorship Support</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="relocation" 
                        name="additionalServices[]" 
                        value="relocation"
                        checked={additionalServices.includes('relocation')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="relocation">Relocation Assistance</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="training" 
                        name="additionalServices[]" 
                        value="training"
                        checked={additionalServices.includes('training')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="training">Training & Development Programs</label>
                    </div>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="benefits" 
                        name="additionalServices[]" 
                        value="benefits"
                        checked={additionalServices.includes('benefits')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="benefits">Comprehensive Benefits Package</label>
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Average Time to Hire</label>
                    <select 
                      name="timeToHire"
                      value={formData.timeToHire}
                      onChange={handleInputChange}
                    >
                      <option value="">Select average time</option>
                      <option value="1-2weeks">1-2 weeks</option>
                      <option value="3-4weeks">3-4 weeks</option>
                      <option value="1-2months">1-2 months</option>
                      <option value="2-3months">2-3 months</option>
                      <option value="3+months">3+ months</option>
                    </select>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faShareAlt} />
                    Social Media & Online Presence
                  </h2>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Company LinkedIn Page</label>
                      <input 
                        type="url" 
                        name="linkedinCompany" 
                        placeholder="https://www.linkedin.com/company/yourcompany"
                        value={formData.linkedinCompany}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Facebook Page</label>
                      <input 
                        type="url" 
                        name="facebook" 
                        placeholder="https://www.facebook.com/yourcompany"
                        value={formData.facebook}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-comprehensive">
                    <div className="form-group-comprehensive">
                      <label>Twitter/X Handle</label>
                      <input 
                        type="url" 
                        name="twitter" 
                        placeholder="https://twitter.com/yourcompany"
                        value={formData.twitter}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group-comprehensive">
                      <label>Instagram</label>
                      <input 
                        type="url" 
                        name="instagram" 
                        placeholder="https://www.instagram.com/yourcompany"
                        value={formData.instagram}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Additional Professional Links</label>
                    <div style={{ marginTop: '8px' }}>
                      <div className="form-row-comprehensive">
                        <div className="form-group-comprehensive">
                          <input 
                            type="text" 
                            placeholder="Link type (e.g., Glassdoor, Indeed)"
                            value={linkTypeInput}
                            onChange={(e) => setLinkTypeInput(e.target.value)}
                          />
                        </div>
                        <div className="form-group-comprehensive">
                          <input 
                            type="url" 
                            placeholder="https://example.com"
                            value={linkUrlInput}
                            onChange={(e) => setLinkUrlInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <button type="button" className="add-btn" onClick={addLink}>
                        <FontAwesomeIcon icon={faPlus} /> Add Link
                      </button>
                    </div>
                    
                    <div className="links-container">
                      {additionalLinks.map((link, index) => (
                        <div key={index} className="link-item">
                          <div className="link-item-content">
                            <div className="link-item-type">
                              <FontAwesomeIcon icon={faLink} /> {link.type}
                            </div>
                            <div className="link-item-url">
                              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                            </div>
                          </div>
                          <button type="button" className="remove-item-btn" onClick={() => removeLink(index)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Terms Section */}
                <div className="section-comprehensive">
                  <h2 className="section-title-comprehensive">
                    <FontAwesomeIcon icon={faClipboardCheck} />
                    Terms & Additional Information
                  </h2>

                  <div className="form-group-comprehensive">
                    <label>How did you hear about us?</label>
                    <select 
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleInputChange}
                    >
                      <option value="">Select source</option>
                      <option value="search">Search Engine (Google, Bing, etc.)</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Referral from colleague</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="event">Industry Event/Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group-comprehensive">
                    <label>Additional Comments or Questions</label>
                    <textarea 
                      name="additionalComments" 
                      placeholder="Share any additional information, special requirements, or questions you have about our platform"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="agreeTerms" 
                      name="agreeTerms" 
                      required
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeTerms">I agree to the Terms of Service and Privacy Policy <span className="required">*</span></label>
                  </div>

                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="agreeDataProcessing" 
                      name="agreeDataProcessing" 
                      required
                      checked={formData.agreeDataProcessing}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeDataProcessing">I consent to the processing of company data for recruitment purposes <span className="required">*</span></label>
                  </div>

                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="agreeMarketing" 
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeMarketing">I agree to receive marketing communications and platform updates</label>
                  </div>

                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="verifyInfo" 
                      name="verifyInfo" 
                      required
                      checked={formData.verifyInfo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="verifyInfo">I verify that all information provided is accurate and truthful <span className="required">*</span></label>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="submit-section">
                  {submitError && (
                    <div className="error-message" style={{ marginBottom: '12px', color: '#e74c3c', textAlign: 'center' }}>
                      {submitError}
                    </div>
                  )}
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    <FontAwesomeIcon icon={faCheckCircle} /> 
                    {isLoading ? 'Submitting...' : 'Complete Registration'}
                  </button>
                  <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                    Your account will be reviewed and activated within 24-48 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterRegistrationForm;

