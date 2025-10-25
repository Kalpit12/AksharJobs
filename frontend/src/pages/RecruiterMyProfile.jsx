import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faUser,
  faBriefcase,
  faBuilding,
  faLink,
  faCheckCircle,
  faArrowLeft,
  faEnvelope,
  faPhone,
  faGlobe,
  faUsers,
  faUserTie,
  faGlobeAmericas,
  faHandshake,
  faShareAlt,
  faPlus,
  faInfoCircle,
  faImage,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faFacebook,
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

const RecruiterMyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSections, setEditingSections] = useState({});
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const [logoPreview, setLogoPreview] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useMapAddress, setUseMapAddress] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  const [profileForm, setProfileForm] = useState({
    // Company Information
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    companySize: '',
    yearFounded: '',
    industry: '',
    companyDescription: '',
    companyLogo: '',
    
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
    
    // Recruitment Specialization
    industries: [],
    functions: [],
    careerLevels: [],
    hiringVolume: '',
    timeToHire: '',
    
    // Geographic Coverage
    recruitCountries: [],
    offersRemote: '',
    
    // Services & Offerings
    employmentTypes: [],
    additionalServices: [],
    
    // Social Media
    linkedinCompany: '',
    facebook: '',
    twitter: '',
    instagram: '',
    additionalLinks: [],
    
    // Additional
    taxId: '',
    referralSource: '',
    additionalComments: ''
  });

  // Input states for arrays
  const [industryInput, setIndustryInput] = useState('');
  const [functionInput, setFunctionInput] = useState('');
  const [recruitCountryInput, setRecruitCountryInput] = useState('');
  const [linkTypeInput, setLinkTypeInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  // Map initialization
  const setMarker = useCallback((lat, lng) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    
    const marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    setProfileForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      setProfileForm(prev => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng
      }));
    });
  }, []);

  useEffect(() => {
    if (editingSections.location) {
      const initMap = () => {
        if (mapRef.current && !mapInstanceRef.current) {
          const lat = parseFloat(profileForm.latitude) || -1.286389;
          const lng = parseFloat(profileForm.longitude) || 36.817223;
          const map = L.map(mapRef.current).setView([lat, lng], 12);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          mapInstanceRef.current = map;

          map.on('click', function(e) {
            setMarker(e.latlng.lat, e.latlng.lng);
          });

          if (profileForm.latitude && profileForm.longitude) {
            setMarker(lat, lng);
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
    }
  }, [editingSections.location, setMarker]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await axios.get(
        buildApiUrl('/api/auth/get_user'),
        {
          params: { userId },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        const userData = response.data;
        
        // Ensure arrays are always arrays, even if stored as strings or undefined
        const ensureArray = (value) => {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return value.split(',').map(item => item.trim()).filter(Boolean);
            }
          }
          return [];
        };
        
        setProfileForm({
          // Company Information
          companyName: userData.companyName || '',
          companyEmail: userData.companyEmail || userData.email || '',
          companyPhone: userData.companyPhone || userData.phoneNumber || '',
          companyWebsite: userData.companyWebsite || '',
          companySize: userData.companySize || '',
          yearFounded: userData.yearFounded || '',
          industry: userData.industry || '',
          companyDescription: userData.companyDescription || '',
          companyLogo: userData.companyLogo || '',
          
          // Company Location
          country: userData.country || '',
          state: userData.state || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          address: userData.address || userData.officeAddress || '',
          latitude: userData.latitude || '',
          longitude: userData.longitude || '',
          
          // Recruiter Personal Details
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          jobTitle: userData.jobTitle || '',
          recruiterPhone: userData.recruiterPhone || userData.phoneNumber || '',
          recruiterEmail: userData.recruiterEmail || userData.email || '',
          linkedinProfile: userData.linkedinProfile || '',
          
          // Recruitment Specialization - Ensure arrays
          industries: ensureArray(userData.industries),
          functions: ensureArray(userData.functions),
          careerLevels: ensureArray(userData.careerLevels),
          hiringVolume: userData.hiringVolume || '',
          timeToHire: userData.timeToHire || '',
          
          // Geographic Coverage
          recruitCountries: ensureArray(userData.recruitCountries),
          offersRemote: userData.offersRemote || '',
          
          // Services & Offerings - Ensure arrays
          employmentTypes: ensureArray(userData.employmentTypes),
          additionalServices: ensureArray(userData.additionalServices),
          
          // Social Media
          linkedinCompany: userData.linkedinCompany || '',
          facebook: userData.facebook || '',
          twitter: userData.twitter || '',
          instagram: userData.instagram || '',
          additionalLinks: ensureArray(userData.additionalLinks),
          
          // Additional
          taxId: userData.taxId || '',
          referralSource: userData.referralSource || '',
          additionalComments: userData.additionalComments || ''
        });
        
        if (userData.companyLogo) {
          setLogoPreview(userData.companyLogo);
        }
        
        calculateProfileCompletion(userData);
        
        console.log('✅ Profile loaded:', {
          companyName: userData.companyName,
          industries: ensureArray(userData.industries),
          functions: ensureArray(userData.functions),
          recruitCountries: ensureArray(userData.recruitCountries),
          employmentTypes: ensureArray(userData.employmentTypes)
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (data) => {
    const requiredFields = [
      data.companyName, data.companyEmail, data.companyPhone,
      data.companySize, data.yearFounded, data.industry,
      data.companyDescription, data.country, data.state,
      data.city, data.address, data.firstName, data.lastName,
      data.jobTitle, data.recruiterPhone, data.recruiterEmail,
      data.offersRemote
    ];
    
    const filledFields = requiredFields.filter(field => field && field.toString().trim()).length;
    let bonus = 0;
    if (data.industries && data.industries.length > 0) bonus += 2;
    if (data.functions && data.functions.length > 0) bonus += 2;
    if (data.recruitCountries && data.recruitCountries.length > 0) bonus += 2;
    
    const percentage = Math.min(Math.round(((filledFields + bonus) / requiredFields.length) * 100), 100);
    setProfileCompletionPercentage(percentage);
  };

  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveSection = async (section) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Log what we're sending
      console.log('💾 Saving profile data:', {
        section,
        data: profileForm
      });
      
      const response = await axios.put(
        buildApiUrl('/api/recruiters/profile'),
        profileForm,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      if (response.status === 200) {
        console.log('✅ Profile saved successfully:', response.data);
        alert('✅ Profile updated successfully!');
        toggleSectionEdit(section);
        
        // Update state with server response if available
        if (response.data.user) {
          const updatedData = response.data.user;
          
          // Ensure arrays are preserved
          const ensureArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return value.split(',').map(item => item.trim()).filter(Boolean);
              }
            }
            return [];
          };
          
          setProfileForm(prev => ({
            ...prev,
            // Preserve arrays
            industries: ensureArray(updatedData.industries || prev.industries),
            functions: ensureArray(updatedData.functions || prev.functions),
            careerLevels: ensureArray(updatedData.careerLevels || prev.careerLevels),
            recruitCountries: ensureArray(updatedData.recruitCountries || prev.recruitCountries),
            employmentTypes: ensureArray(updatedData.employmentTypes || prev.employmentTypes),
            additionalServices: ensureArray(updatedData.additionalServices || prev.additionalServices),
            additionalLinks: ensureArray(updatedData.additionalLinks || prev.additionalLinks),
            // Update other fields
            ...updatedData
          }));
          
          calculateProfileCompletion(updatedData);
          
          // Update localStorage with merged data
          const userDataString = localStorage.getItem('user');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            localStorage.setItem('user', JSON.stringify({ 
              ...userData, 
              ...updatedData,
              // Ensure arrays are preserved in localStorage
              industries: ensureArray(updatedData.industries),
              functions: ensureArray(updatedData.functions),
              careerLevels: ensureArray(updatedData.careerLevels),
              recruitCountries: ensureArray(updatedData.recruitCountries),
              employmentTypes: ensureArray(updatedData.employmentTypes),
              additionalServices: ensureArray(updatedData.additionalServices),
              additionalLinks: ensureArray(updatedData.additionalLinks)
            }));
          }
        } else {
          calculateProfileCompletion(profileForm);
        }
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      console.error('Error details:', error.response?.data);
      alert(`❌ Failed to save profile: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setProfileForm(p => ({ ...p, companyLogo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Array management functions
  const addIndustry = () => {
    if (industryInput && !profileForm.industries.includes(industryInput)) {
      setProfileForm(p => ({ ...p, industries: [...p.industries, industryInput] }));
      setIndustryInput('');
    }
  };

  const removeIndustry = (index) => {
    setProfileForm(p => ({ ...p, industries: p.industries.filter((_, i) => i !== index) }));
  };

  const addFunction = () => {
    if (functionInput && !profileForm.functions.includes(functionInput)) {
      setProfileForm(p => ({ ...p, functions: [...p.functions, functionInput] }));
      setFunctionInput('');
    }
  };

  const removeFunction = (index) => {
    setProfileForm(p => ({ ...p, functions: p.functions.filter((_, i) => i !== index) }));
  };

  const addRecruitCountry = () => {
    if (recruitCountryInput && !profileForm.recruitCountries.includes(recruitCountryInput)) {
      setProfileForm(p => ({ ...p, recruitCountries: [...p.recruitCountries, recruitCountryInput] }));
      setRecruitCountryInput('');
    }
  };

  const removeRecruitCountry = (index) => {
    setProfileForm(p => ({ ...p, recruitCountries: p.recruitCountries.filter((_, i) => i !== index) }));
  };

  const addLink = () => {
    if (!linkTypeInput.trim() || !linkUrlInput.trim()) {
      alert('Please enter both link type and URL');
      return;
    }
    
    try {
      new URL(linkUrlInput);
    } catch (e) {
      alert('Please enter a valid URL (including https://)');
      return;
    }

    setProfileForm(p => ({
      ...p,
      additionalLinks: [...p.additionalLinks, { type: linkTypeInput, url: linkUrlInput }]
    }));
    setLinkTypeInput('');
    setLinkUrlInput('');
  };

  const removeLink = (index) => {
    setProfileForm(p => ({
      ...p,
      additionalLinks: p.additionalLinks.filter((_, i) => i !== index)
    }));
  };

  const toggleEmploymentType = (type) => {
    setProfileForm(p => ({
      ...p,
      employmentTypes: p.employmentTypes.includes(type)
        ? p.employmentTypes.filter(t => t !== type)
        : [...p.employmentTypes, type]
    }));
  };

  const toggleAdditionalService = (service) => {
    setProfileForm(p => ({
      ...p,
      additionalServices: p.additionalServices.includes(service)
        ? p.additionalServices.filter(s => s !== service)
        : [...p.additionalServices, service]
    }));
  };

  const toggleCareerLevel = (level) => {
    setProfileForm(p => ({
      ...p,
      careerLevels: p.careerLevels.includes(level)
        ? p.careerLevels.filter(l => l !== level)
        : [...p.careerLevels, level]
    }));
  };

  // Styles
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '20px' };
  const elevatedCardStyle = {
    border: '1px solid #edf2f7',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.06)',
    marginBottom: '20px',
    background: 'white'
  };
  const profileHeaderStyle = {
    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)',
    padding: '30px',
    borderRadius: '16px',
    minHeight: '220px',
    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.25)',
    marginBottom: '25px',
    position: 'relative',
    overflow: 'hidden'
  };
  const headerPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l10.9-10.9h-3.83zM27.03 0L15.272 11.757 16.686 13.172 32.03 0h-5.zm5.657 0L19.515 13.172l1.414 1.414L38.03 0h-5.344zm5.657 0L23.172 15.172l1.414 1.414L43.688 0h-5.344zm5.657 0L26.828 17.172l1.414 1.414L49.345 0h-5.344zM60 0v60H0V0h60zM0 0v60h60V0H0z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    pointerEvents: 'none'
  };
  const profileAvatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    border: '5px solid rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: '800',
    color: '#ffffff',
    textShadow: '0 4px 8px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)'
  };
  const gridStyle = { display: 'grid', gap: '15px' };
  const formInputBase = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    outline: 'none'
  };
  
  const getViewModeStyle = (section) => {
    return !editingSections[section]
      ? { ...formInputBase, background: '#f7f9fc', borderColor: '#e6eaf1', color: '#333', cursor: 'not-allowed' }
      : formInputBase;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const EditButton = ({ section }) => (
    !editingSections[section] ? (
      <button 
        onClick={() => toggleSectionEdit(section)}
        style={{ 
          background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
          color: 'white', 
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <FontAwesomeIcon icon={faEdit} /> Edit
      </button>
    ) : (
      <>
        <button 
          onClick={() => saveSection(section)} 
          disabled={saving}
          style={{ 
            background: '#10b981', 
            color: 'white', 
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
        </button>
        <button 
          onClick={() => toggleSectionEdit(section)}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </button>
      </>
    )
  );

  return (
    <>
      <style>{`
        .recruiter-my-profile-page .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        
        .recruiter-my-profile-page .form-group {
          margin-bottom: 0;
        }
        
        .recruiter-my-profile-page input:focus,
        .recruiter-my-profile-page textarea:focus,
        .recruiter-my-profile-page select:focus {
          border-color: #f97316 !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
        }
        
        .recruiter-my-profile-page .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f97316 0%, #0d9488 100%);
          color: white;
          padding: 8px 14px;
          borderRadius: 20px;
          margin: 5px;
          fontSize: 14px;
          fontWeight: 500;
        }
        
        .recruiter-my-profile-page .tag .remove {
          cursor: pointer;
          font-weight: 700;
          transition: transform 0.2s ease;
        }
        
        .recruiter-my-profile-page .tag .remove:hover {
          transform: scale(1.2);
        }
        
        .recruiter-my-profile-page .required {
          color: #dc2626;
          margin-left: 4px;
        }
        
        .recruiter-my-profile-page .checkbox-group {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .recruiter-my-profile-page .checkbox-group input[type="checkbox"] {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .recruiter-my-profile-page .checkbox-group label {
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }
        
        .recruiter-my-profile-page .info-badge {
          background: #eff6ff;
          color: #1e40af;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 10px;
          border: 1px solid #bfdbfe;
        }
        
        .recruiter-my-profile-page .add-btn {
          background: linear-gradient(135deg, #f97316 0%, #0d9488 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .recruiter-my-profile-page .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        .recruiter-my-profile-page .link-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid #e2e8f0;
        }
        
        .recruiter-my-profile-page .link-item-content {
          flex: 1;
        }
        
        .recruiter-my-profile-page .link-item-type {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .recruiter-my-profile-page .link-item-url a {
          color: #3b82f6;
          text-decoration: none;
          font-size: 13px;
        }
        
        .recruiter-my-profile-page .remove-item-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .recruiter-my-profile-page .remove-item-btn:hover {
          background: #dc2626;
        }
        
        .recruiter-my-profile-page .file-upload-label {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .recruiter-my-profile-page .file-upload-label:hover {
          border-color: #f97316;
          background: #fff5f0;
        }
        
        .recruiter-my-profile-page .file-upload-label input[type="file"] {
          display: none;
        }
        
        .recruiter-my-profile-page .logo-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 12px;
          margin-bottom: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .recruiter-my-profile-page .map-container {
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          position: relative;
        }
        
        .recruiter-my-profile-page .coordinates-display {
          margin-top: 10px;
          padding: 10px;
          background: #f0f9ff;
          border-radius: 6px;
          font-size: 13px;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
      `}</style>
      <div className="recruiter-my-profile-page" style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#f8fafc'
      }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, #f97316 0%, #0d9488 100%)',
        padding: '2rem 1.5rem',
        boxShadow: '4px 0 20px rgba(249, 115, 22, 0.15)',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        color: '#ffffff'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#ffffff', 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            marginBottom: '0.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.5px'
          }}>
            My Profile
          </h2>
          <p style={{ 
            color: '#ffffff', 
            fontSize: '0.9rem',
            margin: 0,
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}>
            Manage your recruiter information
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            Quick Navigation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => document.querySelector('[data-section="company"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faBuilding} /> Company Info
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="location"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Location
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="personal"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faUserTie} /> Personal Details
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="specialization"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faBriefcase} /> Specialization
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="geographic"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faGlobeAmericas} /> Geographic Coverage
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="services"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faHandshake} /> Services
            </button>
            <button 
              onClick={() => document.querySelector('[data-section="social"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faShareAlt} /> Social Media
            </button>
          </div>
        </div>
        
        {/* Profile Completion */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <h4 style={{ 
            color: '#ffffff', 
            fontSize: '1rem', 
            fontWeight: '700',
            marginBottom: '12px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            Profile Completion
          </h4>
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            height: '10px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #10b981 0%, #14b8a6 100%)',
              height: '100%',
              width: `${profileCompletionPercentage}%`,
              transition: 'width 0.5s ease',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)'
            }}></div>
          </div>
          <p style={{ 
            color: '#ffffff', 
            fontSize: '14px', 
            margin: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            fontWeight: '600'
          }}>
            {profileCompletionPercentage}% Complete
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '40px',
        width: 'calc(100% - 280px)',
        overflowX: 'hidden',
        overflowY: 'auto', 
        minHeight: '100vh', 
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc'
      }}>
      <div style={containerStyle}>
        {/* Profile Header */}
        <div style={profileHeaderStyle}>
          <div style={headerPatternStyle}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 2 }}>
            <div style={profileAvatarStyle}>
              {(profileForm.firstName?.[0] || 'R')}{(profileForm.lastName?.[0] || '')}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                marginBottom: '10px', 
                fontSize: '32px', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                color: '#ffffff'
              }}>{profileForm.firstName} {profileForm.lastName}</h2>
              <p style={{ 
                fontSize: '20px', 
                marginBottom: '10px', 
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#ffffff'
              }}>{profileForm.jobTitle || 'Recruiter'} {profileForm.companyName && `at ${profileForm.companyName}`}</p>
              <p style={{ 
                fontSize: '16px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#ffffff'
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {profileForm.city ? `${profileForm.city}, ${profileForm.country}` : '—'}
              </p>
            </div>
            <div>
              <button 
                onClick={() => navigate('/recruiter-dashboard')}
                style={{
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="company">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faBuilding} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Company Information
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="company" />
            </div>
          </div>

          {/* Company Logo */}
          {logoPreview && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img src={logoPreview} alt="Company Logo" className="logo-preview" />
            </div>
          )}

          {editingSections.company && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="file-upload-label">
                <FontAwesomeIcon icon={faImage} style={{ fontSize: '24px', color: '#f97316' }} />
                <div>
                  <strong>Upload Company Logo</strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Click to browse or drag and drop (PNG, JPG, max 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoChange} />
              </label>
            </div>
          )}

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Company Name <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('company')}
                value={profileForm.companyName || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companyName: e.target.value }))} 
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Company Email <span className="required">*</span></label>
              <input 
                type="email"
                style={getViewModeStyle('company')}
                value={profileForm.companyEmail || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companyEmail: e.target.value }))} 
                placeholder="contact@company.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Phone <span className="required">*</span></label>
              <input 
                type="tel"
                style={getViewModeStyle('company')}
                value={profileForm.companyPhone || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companyPhone: e.target.value }))} 
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input 
                type="url"
                style={getViewModeStyle('company')}
                value={profileForm.companyWebsite || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companyWebsite: e.target.value }))} 
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Company Size <span className="required">*</span></label>
              <select 
                style={getViewModeStyle('company')}
                value={profileForm.companySize || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companySize: e.target.value }))}
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
            <div className="form-group">
              <label className="form-label">Year Founded <span className="required">*</span></label>
              <input 
                type="number"
                style={getViewModeStyle('company')}
                value={profileForm.yearFounded || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, yearFounded: e.target.value }))} 
                placeholder="2015"
                min="1800"
                max="2025"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Industry/Sector <span className="required">*</span></label>
              <select 
                style={getViewModeStyle('company')}
                value={profileForm.industry || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, industry: e.target.value }))}
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
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label className="form-label">Company Description <span className="required">*</span></label>
              <textarea 
                style={{ ...getViewModeStyle('company'), minHeight: '120px', resize: 'vertical' }} 
                value={profileForm.companyDescription || ''} 
                disabled={!editingSections.company} 
                onChange={(e) => setProfileForm(p => ({ ...p, companyDescription: e.target.value }))} 
                placeholder="Describe your company, its mission, vision, and what makes it a great place to work..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Company Location Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="location">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Company Location
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="location" />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Country <span className="required">*</span></label>
              <select 
                style={getViewModeStyle('location')}
                value={profileForm.country || ''} 
                disabled={!editingSections.location} 
                onChange={(e) => setProfileForm(p => ({ ...p, country: e.target.value }))}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">State/Province <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('location')}
                value={profileForm.state || ''} 
                disabled={!editingSections.location} 
                onChange={(e) => setProfileForm(p => ({ ...p, state: e.target.value }))} 
                placeholder="e.g., California"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">City <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('location')}
                value={profileForm.city || ''} 
                disabled={!editingSections.location} 
                onChange={(e) => setProfileForm(p => ({ ...p, city: e.target.value }))} 
                placeholder="e.g., San Francisco"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal/ZIP Code</label>
              <input 
                type="text"
                style={getViewModeStyle('location')}
                value={profileForm.postalCode || ''} 
                disabled={!editingSections.location} 
                onChange={(e) => setProfileForm(p => ({ ...p, postalCode: e.target.value }))} 
                placeholder="94102"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Full Address <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('location')}
                value={profileForm.address || ''} 
                disabled={!editingSections.location} 
                onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))} 
                placeholder="Street address, building name, suite number"
              />
            </div>
          </div>

          {/* Map Section */}
          {editingSections.location && (
            <div className="form-group">
              <label className="form-label">Pin Your Office Location on Map (Optional)</label>
              <div className="info-badge">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Click on the map to mark your office location
              </div>
              
              <div ref={mapRef} className="map-container" style={{ height: '300px', width: '100%', marginTop: '10px' }}>
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
                  {profileForm.latitude && profileForm.longitude 
                    ? ` Lat: ${parseFloat(profileForm.latitude).toFixed(6)}, Lng: ${parseFloat(profileForm.longitude).toFixed(6)}`
                    : ' Click on the map to select'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recruiter Personal Details Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="personal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faUserTie} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Recruiter Personal Details
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="personal" />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">First Name <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('personal')}
                value={profileForm.firstName || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))} 
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('personal')}
                value={profileForm.lastName || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))} 
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Job Title <span className="required">*</span></label>
              <input 
                type="text"
                style={getViewModeStyle('personal')}
                value={profileForm.jobTitle || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, jobTitle: e.target.value }))} 
                placeholder="e.g., HR Manager, Talent Acquisition Lead"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Direct Phone Number <span className="required">*</span></label>
              <input 
                type="tel"
                style={getViewModeStyle('personal')}
                value={profileForm.recruiterPhone || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, recruiterPhone: e.target.value }))} 
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">Professional Email <span className="required">*</span></label>
              <input 
                type="email"
                style={getViewModeStyle('personal')}
                value={profileForm.recruiterEmail || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, recruiterEmail: e.target.value }))} 
                placeholder="your.name@company.com"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile</label>
              <input 
                type="url"
                style={getViewModeStyle('personal')}
                value={profileForm.linkedinProfile || ''} 
                disabled={!editingSections.personal} 
                onChange={(e) => setProfileForm(p => ({ ...p, linkedinProfile: e.target.value }))} 
                placeholder="https://www.linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </div>

        {/* Recruitment Specialization Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="specialization">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faBriefcase} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Recruitment Specialization
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="specialization" />
            </div>
          </div>

          {/* Industries You Recruit For */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Industries You Recruit For <span className="required">*</span></label>
            {editingSections.specialization && (
              <>
                <div className="info-badge">
                  <FontAwesomeIcon icon={faInfoCircle} /> Add all industries you actively recruit for
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select 
                    style={{ ...formInputBase, flex: 1 }}
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
              </>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {profileForm.industries && profileForm.industries.map((industry, index) => (
                <div key={index} className="tag">
                  {industry}
                  {editingSections.specialization && (
                    <span className="remove" onClick={() => removeIndustry(index)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Job Functions */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Job Functions You Recruit For <span className="required">*</span></label>
            {editingSections.specialization && (
              <>
                <div className="info-badge">
                  <FontAwesomeIcon icon={faInfoCircle} /> Add specific job functions (e.g., Software Development, Sales, Marketing)
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text"
                    style={{ ...formInputBase, flex: 1 }}
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    placeholder="Enter job function (e.g., Software Development)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFunction())}
                  />
                  <button type="button" className="add-btn" onClick={addFunction}>
                    <FontAwesomeIcon icon={faPlus} /> Add
                  </button>
                </div>
              </>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {profileForm.functions && profileForm.functions.map((func, index) => (
                <div key={index} className="tag">
                  {func}
                  {editingSections.specialization && (
                    <span className="remove" onClick={() => removeFunction(index)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Career Levels & Hiring Info */}
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="form-group">
              <label className="form-label">Career Levels You Recruit <span className="required">*</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {[
                  { value: 'entry', label: 'Entry Level' },
                  { value: 'mid', label: 'Mid-Level' },
                  { value: 'senior', label: 'Senior Level' },
                  { value: 'lead', label: 'Lead/Principal' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'director', label: 'Director' },
                  { value: 'executive', label: 'Executive/C-Level' }
                ].map((level) => (
                  <div key={level.value} className="checkbox-group">
                    <input 
                      type="checkbox"
                      checked={profileForm.careerLevels && profileForm.careerLevels.includes(level.value)}
                      onChange={() => toggleCareerLevel(level.value)}
                      disabled={!editingSections.specialization}
                    />
                    <label>{level.label}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Average Hiring Volume (Monthly)</label>
              <select 
                style={getViewModeStyle('specialization')}
                value={profileForm.hiringVolume || ''} 
                disabled={!editingSections.specialization} 
                onChange={(e) => setProfileForm(p => ({ ...p, hiringVolume: e.target.value }))}
              >
                <option value="">Select hiring volume</option>
                <option value="1-5">1-5 positions</option>
                <option value="6-10">6-10 positions</option>
                <option value="11-20">11-20 positions</option>
                <option value="21-50">21-50 positions</option>
                <option value="51+">51+ positions</option>
              </select>
              
              <label className="form-label" style={{ marginTop: '15px' }}>Average Time to Hire</label>
              <select 
                style={getViewModeStyle('specialization')}
                value={profileForm.timeToHire || ''} 
                disabled={!editingSections.specialization} 
                onChange={(e) => setProfileForm(p => ({ ...p, timeToHire: e.target.value }))}
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
        </div>

        {/* Geographic Coverage Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="geographic">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faGlobeAmericas} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Geographic Coverage
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="geographic" />
            </div>
          </div>

          {/* Countries You Recruit For */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Countries You Recruit For <span className="required">*</span></label>
            {editingSections.geographic && (
              <>
                <div className="info-badge">
                  <FontAwesomeIcon icon={faInfoCircle} /> Add all countries where you actively recruit candidates
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select 
                    style={{ ...formInputBase, flex: 1 }}
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
              </>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {profileForm.recruitCountries && profileForm.recruitCountries.map((country, index) => (
                <div key={index} className="tag">
                  {country}
                  {editingSections.geographic && (
                    <span className="remove" onClick={() => removeRecruitCountry(index)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remote Positions */}
          <div className="form-group">
            <label className="form-label">Do you offer international/remote positions? <span className="required">*</span></label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}>
                <input 
                  type="radio"
                  name="offersRemote"
                  value="yes"
                  checked={profileForm.offersRemote === 'yes'}
                  onChange={(e) => setProfileForm(p => ({ ...p, offersRemote: e.target.value }))}
                  disabled={!editingSections.geographic}
                  style={{ marginRight: '8px', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}
                />
                Yes, regularly
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}>
                <input 
                  type="radio"
                  name="offersRemote"
                  value="sometimes"
                  checked={profileForm.offersRemote === 'sometimes'}
                  onChange={(e) => setProfileForm(p => ({ ...p, offersRemote: e.target.value }))}
                  disabled={!editingSections.geographic}
                  style={{ marginRight: '8px', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}
                />
                Sometimes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}>
                <input 
                  type="radio"
                  name="offersRemote"
                  value="no"
                  checked={profileForm.offersRemote === 'no'}
                  onChange={(e) => setProfileForm(p => ({ ...p, offersRemote: e.target.value }))}
                  disabled={!editingSections.geographic}
                  style={{ marginRight: '8px', cursor: editingSections.geographic ? 'pointer' : 'not-allowed' }}
                />
                No, only on-site
              </label>
            </div>
          </div>
        </div>

        {/* Services & Offerings Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="services">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faHandshake} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Services & Offerings
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="services" />
            </div>
          </div>

          {/* Employment Types */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Types of Employment You Offer <span className="required">*</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {[
                { value: 'full-time', label: 'Full-time Positions' },
                { value: 'part-time', label: 'Part-time Positions' },
                { value: 'contract', label: 'Contract/Temporary' },
                { value: 'freelance', label: 'Freelance/Project-based' },
                { value: 'internship', label: 'Internships' }
              ].map((type) => (
                <div key={type.value} className="checkbox-group">
                  <input 
                    type="checkbox"
                    checked={profileForm.employmentTypes && profileForm.employmentTypes.includes(type.value)}
                    onChange={() => toggleEmploymentType(type.value)}
                    disabled={!editingSections.services}
                  />
                  <label>{type.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Services */}
          <div className="form-group">
            <label className="form-label">Additional Services Offered</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {[
                { value: 'visa', label: 'Visa Sponsorship Support' },
                { value: 'relocation', label: 'Relocation Assistance' },
                { value: 'training', label: 'Training & Development Programs' },
                { value: 'benefits', label: 'Comprehensive Benefits Package' }
              ].map((service) => (
                <div key={service.value} className="checkbox-group">
                  <input 
                    type="checkbox"
                    checked={profileForm.additionalServices && profileForm.additionalServices.includes(service.value)}
                    onChange={() => toggleAdditionalService(service.value)}
                    disabled={!editingSections.services}
                  />
                  <label>{service.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div style={{ ...elevatedCardStyle, padding: '25px' }} data-section="social">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              <FontAwesomeIcon icon={faShareAlt} style={{ color: '#f97316', marginRight: '10px' }} /> 
              Social Media & Online Presence
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <EditButton section="social" />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5', marginRight: '8px' }} />
                Company LinkedIn Page
              </label>
              <input 
                type="url"
                style={getViewModeStyle('social')}
                value={profileForm.linkedinCompany || ''} 
                disabled={!editingSections.social} 
                onChange={(e) => setProfileForm(p => ({ ...p, linkedinCompany: e.target.value }))} 
                placeholder="https://www.linkedin.com/company/yourcompany"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faFacebook} style={{ color: '#1877f2', marginRight: '8px' }} />
                Facebook Page
              </label>
              <input 
                type="url"
                style={getViewModeStyle('social')}
                value={profileForm.facebook || ''} 
                disabled={!editingSections.social} 
                onChange={(e) => setProfileForm(p => ({ ...p, facebook: e.target.value }))} 
                placeholder="https://www.facebook.com/yourcompany"
              />
            </div>
          </div>

          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '15px' }}>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faTwitter} style={{ color: '#1da1f2', marginRight: '8px' }} />
                Twitter/X Handle
              </label>
              <input 
                type="url"
                style={getViewModeStyle('social')}
                value={profileForm.twitter || ''} 
                disabled={!editingSections.social} 
                onChange={(e) => setProfileForm(p => ({ ...p, twitter: e.target.value }))} 
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faInstagram} style={{ color: '#e4405f', marginRight: '8px' }} />
                Instagram
              </label>
              <input 
                type="url"
                style={getViewModeStyle('social')}
                value={profileForm.instagram || ''} 
                disabled={!editingSections.social} 
                onChange={(e) => setProfileForm(p => ({ ...p, instagram: e.target.value }))} 
                placeholder="https://www.instagram.com/yourcompany"
              />
            </div>
          </div>

          {/* Additional Professional Links */}
          <div className="form-group">
            <label className="form-label">Additional Professional Links</label>
            {editingSections.social && (
              <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text"
                    style={{ ...formInputBase, flex: 1 }}
                    value={linkTypeInput}
                    onChange={(e) => setLinkTypeInput(e.target.value)}
                    placeholder="Link type (e.g., Glassdoor, Indeed)"
                  />
                  <input 
                    type="url"
                    style={{ ...formInputBase, flex: 1 }}
                    value={linkUrlInput}
                    onChange={(e) => setLinkUrlInput(e.target.value)}
                    placeholder="https://example.com"
                  />
                  <button type="button" className="add-btn" onClick={addLink}>
                    <FontAwesomeIcon icon={faPlus} /> Add Link
                  </button>
                </div>
              </div>
            )}
            <div>
              {profileForm.additionalLinks && profileForm.additionalLinks.map((link, index) => (
                <div key={index} className="link-item">
                  <div className="link-item-content">
                    <div className="link-item-type">
                      <FontAwesomeIcon icon={faLink} /> {link.type}
                    </div>
                    <div className="link-item-url">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                  </div>
                  {editingSections.social && (
                    <button type="button" className="remove-item-btn" onClick={() => removeLink(index)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      </div>
      </div>
    </>
  );
};

export default RecruiterMyProfile;
