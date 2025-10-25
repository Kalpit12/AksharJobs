import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faEdit, faSave, faTimes, faUser, faBriefcase,
  faCode, faBuilding, faGraduationCap, faCertificate, faLanguage,
  faLink, faCheckCircle, faPassport, faMapMarked, faBullseye,
  faLightbulb, faSlidersH, faProjectDiagram, faUsers, faInfoCircle,
  faUserCheck, faGlobe, faPlus, faTrash, faAward, faRocket
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import ThemedLoadingSpinner from '../components/ThemedLoadingSpinner';

const InternMyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State for all form fields
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    altPhone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    residentCountry: '',
    currentCity: '',
    postalCode: '',
    address: '',
    latitude: '',
    longitude: '',
    validDocs: '',
    preferredLocation1: '',
    preferredLocation2: '',
    preferredLocation3: '',
    willingToRelocate: '',
    internshipMode: '',
    academicLevel: '',
    objective: '',
    industryInterest: '',
    preferredRole: '',
    internshipDuration: '',
    availability: '',
    internshipStartMonthYear: '',
    expectedStipend: '',
    currencyPreference: 'USD',
    unpaidWilling: '',
    academicCredit: '',
    hobbies: '',
    whyInternship: '',
    additionalComments: '',
    location: ''
  });
  
  const [educationEntries, setEducationEntries] = useState([]);
  const [experienceEntries, setExperienceEntries] = useState([]);
  const [projectEntries, setProjectEntries] = useState([]);
  const [activityEntries, setActivityEntries] = useState([]);
  const [certificationEntries, setCertificationEntries] = useState([]);
  const [referenceEntries, setReferenceEntries] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [careerInterests, setCareerInterests] = useState([]);
  const [professionalLinks, setProfessionalLinks] = useState([]);

  // Style objects matching job seeker profile
  const containerStyle = { 
    padding: '30px 30px 60px 30px', 
    maxWidth: '100%', 
    width: '100%', 
    margin: '0',
    minHeight: '100vh',
    boxSizing: 'border-box'
  };
  
  const elevatedCardStyle = { 
    border: '1px solid #edf2f7', 
    borderRadius: '16px', 
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.06)', 
    background: '#fff', 
    marginBottom: '20px',
    overflow: 'hidden'
  };
  
  const profileHeaderStyle = { 
    background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
    color: '#fff', 
    padding: '40px', 
    borderRadius: '16px', 
    marginBottom: '20px', 
    position: 'relative',
    overflow: 'hidden',
    minHeight: '220px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.25)'
  };

  const headerPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: 1
  };
  
  const profileAvatarStyle = { 
    width: '120px', 
    height: '120px', 
    borderRadius: '50%', 
    background: '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '48px', 
    fontWeight: 'bold', 
    color: '#0d9488',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    zIndex: 2
  };
  
  const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '20px', 
    marginBottom: '20px',
    width: '100%'
  };
  
  const formInputBase = { 
    width: '100%', 
    padding: '10px 15px', 
    border: '2px solid #e0e0e0', 
    borderRadius: '8px', 
    fontSize: '14px', 
    transition: 'border 0.3s, box-shadow 0.3s'
  };

  const viewModeField = !editMode ? { background: '#f7f9fc', borderColor: '#e6eaf1', color: '#333' } : {};

  // Headers for API calls
  const authHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  // Load profile data
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl('/api/intern/profile'), {
        headers: authHeaders()
      });
      
      const p = response.data || {};
      
      setProfileForm({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        middleName: p.middleName || '',
        email: p.email || '',
        phone: p.phone || '',
        altPhone: p.altPhone || '',
        dateOfBirth: p.dateOfBirth || '',
        gender: p.gender || '',
        nationality: p.nationality || '',
        residentCountry: p.residentCountry || '',
        currentCity: p.currentCity || '',
        postalCode: p.postalCode || '',
        address: p.address || '',
        latitude: p.latitude || '',
        longitude: p.longitude || '',
        validDocs: p.validDocs || '',
        preferredLocation1: p.preferredLocation1 || '',
        preferredLocation2: p.preferredLocation2 || '',
        preferredLocation3: p.preferredLocation3 || '',
        willingToRelocate: p.willingToRelocate || '',
        internshipMode: p.internshipMode || '',
        academicLevel: p.academicLevel || '',
        objective: p.objective || '',
        industryInterest: p.industryInterest || '',
        preferredRole: p.preferredRole || '',
        internshipDuration: p.internshipDuration || '',
        availability: p.availability || '',
        internshipStartMonthYear: p.internshipStartMonthYear || p.internshipTiming || '',
        expectedStipend: p.expectedStipend || '',
        currencyPreference: p.currencyPreference || 'USD',
        unpaidWilling: p.unpaidWilling || '',
        academicCredit: p.academicCredit || '',
        hobbies: p.hobbies || '',
        whyInternship: p.whyInternship || '',
        additionalComments: p.additionalComments || '',
        location: `${p.currentCity || ''}, ${p.residentCountry || ''}`.replace(', ,', '').trim()
      });

      setEducationEntries(Array.isArray(p.educationEntries) ? p.educationEntries : []);
      setExperienceEntries(Array.isArray(p.experienceEntries) ? p.experienceEntries : []);
      setProjectEntries(Array.isArray(p.projectEntries) ? p.projectEntries : []);
      setActivityEntries(Array.isArray(p.activityEntries) ? p.activityEntries : []);
      setCertificationEntries(Array.isArray(p.certificationEntries) ? p.certificationEntries : []);
      setReferenceEntries(Array.isArray(p.referenceEntries) ? p.referenceEntries : []);
      setTechnicalSkills(Array.isArray(p.technicalSkills) ? p.technicalSkills : []);
      setSoftSkills(Array.isArray(p.softSkills) ? p.softSkills : []);
      setLanguages(Array.isArray(p.languages) ? p.languages : []);
      setCareerInterests(Array.isArray(p.careerInterests) ? p.careerInterests : []);
      setProfessionalLinks(Array.isArray(p.professionalLinks) ? p.professionalLinks : []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const saveSection = async (section) => {
    try {
      setSaving(true);
      setMessage('');

      const payload = {
        ...profileForm,
        educationEntries,
        experienceEntries,
        projectEntries,
        activityEntries,
        certificationEntries,
        referenceEntries,
        technicalSkills,
        softSkills,
        languages,
        careerInterests,
        professionalLinks,
        // Mark as completed (not draft)
        profileCompleted: 'true',
        isDraft: 'false'
      };

      console.log('Saving intern profile section:', section);
      console.log('Payload:', payload);

      const response = await axios.post(buildApiUrl('/api/intern/profile'), payload, {
        headers: authHeaders()
      });

      if (response.status === 200) {
        setMessage('✓ Profile updated successfully!');
        setEditingSections(prev => ({ ...prev, [section]: false }));
        
        // Reload data from backend to ensure consistency
        await loadProfileData();
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving section:', error);
      console.error('Error details:', error.response?.data);
      setMessage('❌ Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    await saveSection('all');
  };

  if (loading) {
    return (
      <ThemedLoadingSpinner 
        theme="intern"
        text="Loading your intern profile..."
        subText="Please wait while we fetch your data"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="my-profile-page" style={{ 
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
      }} className="sidebar-container">
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
            Manage your internship profile
          </p>
        </div>
        
        {/* Quick Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Personal Info', icon: '👤', dataSection: 'personal' },
              { name: 'Nationality', icon: '🌍', dataSection: 'nationality' },
              { name: 'Locations', icon: '📍', dataSection: 'locations' },
              { name: 'Education', icon: '🎓', dataSection: 'education' },
              { name: 'Objective', icon: '🎯', dataSection: 'objective' },
              { name: 'Experience', icon: '💼', dataSection: 'experience' },
              { name: 'Skills', icon: '⚡', dataSection: 'skills' },
              { name: 'Languages', icon: '🗣️', dataSection: 'languages' },
              { name: 'Projects', icon: '🚀', dataSection: 'projects' },
              { name: 'Activities', icon: '🏆', dataSection: 'activities' },
              { name: 'Certifications', icon: '📜', dataSection: 'certifications' },
              { name: 'References', icon: '👥', dataSection: 'references' },
              { name: 'Online Links', icon: '🔗', dataSection: 'links' },
              { name: 'Preferences', icon: '⚙️', dataSection: 'preferences' },
              { name: 'Additional', icon: '📝', dataSection: 'additional' }
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  const element = document.querySelector(`[data-section="${item.dataSection}"]`);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.5)';
                  e.target.style.transform = 'translateX(4px)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.3)';
                  e.target.style.transform = 'translateX(0)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/intern-dashboard')}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.5)',
            color: '#ffffff',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Profile Completion */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)'
          }}>
            Profile Completion
          </h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              <span>85%</span>
              <span>Complete</span>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              height: '8px', 
              borderRadius: '4px', 
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#ffffff',
                height: '100%',
                width: '85%',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}></div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px'
          }}>
            Tips
          </h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
          }}>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.85rem', 
              margin: 0,
              lineHeight: '1.4',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.7)'
            }}>
              💡 Keep your profile updated to get better internship matches
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ 
        marginLeft: '280px', 
        width: 'calc(100% - 280px)', 
        maxWidth: 'calc(100% - 280px)', 
        overflowX: 'hidden',
        overflowY: 'auto', 
        minHeight: '100vh', 
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc'
      }}>
        <div style={containerStyle}>
          {/* Profile Header */}
          <div style={profileHeaderStyle} className="profile-header">
            <div style={headerPatternStyle}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 2 }}>
              <div style={profileAvatarStyle}>{(profileForm.firstName?.[0] || 'I')}{(profileForm.lastName?.[0] || 'S')}</div>
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
                }}>{profileForm.preferredRole || 'Internship Seeker'}</p>
                <p style={{ 
                  fontSize: '16px',
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  color: '#ffffff'
                }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileForm.location || '—'}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      color: '#0d9488',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit Profile
                  </button>
                )}
                {editMode && (
                  <>
                    <button 
                      onClick={saveProfile} 
                      disabled={saving}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: '#10b981',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={() => setEditMode(false)}
                      style={{
                        background: 'rgba(220, 38, 38, 0.9)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
                <button 
                  onClick={saveProfile} 
                  disabled={saving}
                  style={{
                    background: 'rgba(16, 185, 129, 0.9)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> {saving ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div style={{
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '12px',
              background: message.includes('✓') ? '#d4edda' : '#f8d7da',
              color: message.includes('✓') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('✓') ? '#c3e6cb' : '#f5c6cb'}`,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {message}
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="personal">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.personal ? (
                  <button 
                    onClick={() => toggleSectionEdit('personal')}
                    style={{ 
                      background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => saveSection('personal')} 
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
                      onClick={() => toggleSectionEdit('personal')}
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
                )}
              </div>
            </div>

            {/* Personal Info Fields */}
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
              <div className="form-group">
                <label className="form-label">First Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.firstName || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))} 
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Middle Name</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.middleName || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, middleName: e.target.value }))} 
                  placeholder="Enter your middle name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.lastName || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))} 
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="date"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.dateOfBirth || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender <span style={{ color: '#dc2626' }}>*</span></label>
                <select 
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.gender || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '15px' }}>
              <div className="form-group">
                <label className="form-label">Email <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="email"
                  style={{ ...formInputBase, background: '#f7f9fc', borderColor: '#e6eaf1' }} 
                  value={profileForm.email || ''} 
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="tel"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.phone || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alternative Phone</label>
                <input 
                  type="tel"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.altPhone || ''} 
                  disabled={!editingSections.personal} 
                  onChange={(e) => setProfileForm(p => ({ ...p, altPhone: e.target.value }))}
                  placeholder="Parent/Guardian number"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Nationality & Residency */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="nationality">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faPassport} /> Nationality & Residency</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.nationality ? (
                  <button 
                    onClick={() => toggleSectionEdit('nationality')}
                    style={{ 
                      background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => saveSection('nationality')} 
                      disabled={saving}
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => toggleSectionEdit('nationality')}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.nationality || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, nationality: e.target.value }))}
                  placeholder="e.g., Kenyan"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Resident Country</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.residentCountry || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, residentCountry: e.target.value }))}
                  placeholder="Country of residence"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current City</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.currentCity || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, currentCity: e.target.value }))}
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.postalCode || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, postalCode: e.target.value }))}
                  placeholder="Postal code"
                />
              </div>
            </div>
            
            <div style={{ ...gridStyle, gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.address || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="Street address"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Valid Work Documents</label>
                <input 
                  type="text"
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.validDocs || ''} 
                  disabled={!editingSections.nationality} 
                  onChange={(e) => setProfileForm(p => ({ ...p, validDocs: e.target.value }))}
                  placeholder="e.g., Passport, Driver's License, Work Permit"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Preferred Locations */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="locations">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faMapMarked} /> Preferred Internship Locations</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.locations ? (
                  <button onClick={() => toggleSectionEdit('locations')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('locations')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('locations')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Preferred Location 1</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.preferredLocation1 || ''} disabled={!editingSections.locations} onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation1: e.target.value }))} placeholder="Country" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Location 2</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.preferredLocation2 || ''} disabled={!editingSections.locations} onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation2: e.target.value }))} placeholder="Country" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Location 3</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.preferredLocation3 || ''} disabled={!editingSections.locations} onChange={(e) => setProfileForm(p => ({ ...p, preferredLocation3: e.target.value }))} placeholder="Country" />
              </div>
            </div>
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Willing to Relocate for Internship?</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.willingToRelocate || ''} disabled={!editingSections.locations} onChange={(e) => setProfileForm(p => ({ ...p, willingToRelocate: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="yes">Yes, anywhere</option>
                  <option value="within-country">Within my country only</option>
                  <option value="no">No, local only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Internship Mode Preference</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.internshipMode || ''} disabled={!editingSections.locations} onChange={(e) => setProfileForm(p => ({ ...p, internshipMode: e.target.value }))}>
                  <option value="">Select preference</option>
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Education */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="education">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.education ? (
                  <button onClick={() => toggleSectionEdit('education')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('education')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('education')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Academic Level</label>
              <select style={{ ...formInputBase, ...viewModeField, maxWidth: '400px' }} value={profileForm.academicLevel || ''} disabled={!editingSections.education} onChange={(e) => setProfileForm(p => ({ ...p, academicLevel: e.target.value }))}>
                <option value="">Select...</option>
                <option value="High School Student">High School Student</option>
                <option value="Undergraduate - Freshman">Undergraduate - Freshman</option>
                <option value="Undergraduate - Sophomore">Undergraduate - Sophomore</option>
                <option value="Undergraduate - Junior">Undergraduate - Junior</option>
                <option value="Undergraduate - Senior">Undergraduate - Senior</option>
                <option value="Graduate/Master's">Graduate/Master's</option>
                <option value="PhD Student">PhD Student</option>
                <option value="Recent Graduate">Recent Graduate</option>
                <option value="Diploma Student">Diploma Student</option>
                <option value="Certificate Student">Certificate Student</option>
              </select>
            </div>
            {educationEntries.map((edu, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.education && educationEntries.length > 1 && (
                  <button onClick={() => setEducationEntries(educationEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={edu.institution || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], institution: e.target.value}; setEducationEntries(newEdu); }} placeholder="University name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree/Program</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={edu.degree || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], degree: e.target.value}; setEducationEntries(newEdu); }} placeholder="e.g., Bachelor of Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Field of Study</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={edu.fieldOfStudy || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], fieldOfStudy: e.target.value}; setEducationEntries(newEdu); }} placeholder="e.g., Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={edu.startDate || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], startDate: e.target.value}; setEducationEntries(newEdu); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={edu.endDate || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], endDate: e.target.value}; setEducationEntries(newEdu); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GPA/Grade</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={edu.gpa || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], gpa: e.target.value}; setEducationEntries(newEdu); }} placeholder="e.g., 3.8/4.0" />
                  </div>
                </div>
                <div style={{ ...gridStyle, gridTemplateColumns: '1fr', marginTop: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Relevant Coursework</label>
                    <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '60px' }} value={edu.relevantCoursework || ''} disabled={!editingSections.education} onChange={(e) => { const newEdu = [...educationEntries]; newEdu[idx] = {...newEdu[idx], relevantCoursework: e.target.value}; setEducationEntries(newEdu); }} placeholder="List relevant courses" />
                  </div>
                </div>
              </div>
            ))}
            {educationEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No education entries added</div>}
            {editingSections.education && (
              <button onClick={() => setEducationEntries([...educationEntries, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', currentlyStudying: '', relevantCoursework: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Education
              </button>
            )}
          </div>

          {/* Section 5: Objective */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="objective">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faBullseye} /> Internship Objective & Career Goals</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.objective ? (
                  <button onClick={() => toggleSectionEdit('objective')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('objective')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('objective')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Professional Objective</label>
              <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '120px', width: '100%', fontFamily: 'inherit' }} value={profileForm.objective || ''} disabled={!editingSections.objective} onChange={(e) => setProfileForm(p => ({ ...p, objective: e.target.value }))} placeholder="Describe your career goals and what you hope to achieve through an internship" />
            </div>
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Industry of Interest</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.industryInterest || ''} disabled={!editingSections.objective} onChange={(e) => setProfileForm(p => ({ ...p, industryInterest: e.target.value }))} placeholder="e.g., Technology, Finance" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Role</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.preferredRole || ''} disabled={!editingSections.objective} onChange={(e) => setProfileForm(p => ({ ...p, preferredRole: e.target.value }))} placeholder="e.g., Software Developer Intern" />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label className="form-label">Career Interests</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {careerInterests.map((interest, idx) => (
                  <div key={idx} style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #bbf7d0' }}>
                    {interest}
                    {editingSections.objective && (
                      <button onClick={() => setCareerInterests(careerInterests.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0, fontSize: '16px' }}>×</button>
                    )}
                  </div>
                ))}
                {careerInterests.length === 0 && <span style={{ color: '#999' }}>No interests added</span>}
              </div>
            </div>
          </div>

          {/* Section 6: Experience */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="experience">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Previous Internships & Work Experience</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.experience ? (
                  <button onClick={() => toggleSectionEdit('experience')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('experience')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('experience')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {experienceEntries.map((exp, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.experience && (
                  <button onClick={() => setExperienceEntries(experienceEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Position Title</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={exp.title || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], title: e.target.value}; setExperienceEntries(newExp); }} placeholder="e.g., Marketing Intern" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={exp.company || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], company: e.target.value}; setExperienceEntries(newExp); }} placeholder="Company name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={exp.location || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], location: e.target.value}; setExperienceEntries(newExp); }} placeholder="City, Country" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select style={{ ...formInputBase, ...viewModeField }} value={exp.internshipType || 'Internship'} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], internshipType: e.target.value}; setExperienceEntries(newExp); }}>
                      <option value="Summer Internship">Summer Internship</option>
                      <option value="Part-time Work">Part-time Work</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Full-time Internship">Full-time Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={exp.startDate || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], startDate: e.target.value}; setExperienceEntries(newExp); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={exp.endDate || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], endDate: e.target.value}; setExperienceEntries(newExp); }} />
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label className="form-label">Description & Responsibilities</label>
                  <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '80px', width: '100%', fontFamily: 'inherit' }} value={exp.description || ''} disabled={!editingSections.experience} onChange={(e) => { const newExp = [...experienceEntries]; newExp[idx] = {...newExp[idx], description: e.target.value}; setExperienceEntries(newExp); }} placeholder="Describe your responsibilities" />
                </div>
              </div>
            ))}
            {experienceEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No experience entries added</div>}
            {editingSections.experience && (
              <button onClick={() => setExperienceEntries([...experienceEntries, { title: '', company: '', location: '', internshipType: 'Summer Internship', startDate: '', endDate: '', currentlyWorking: 'No', description: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Experience
              </button>
            )}
          </div>

          {/* Section 7: Skills */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="skills">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faLightbulb} /> Skills & Competencies</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.skills ? (
                  <button onClick={() => toggleSectionEdit('skills')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('skills')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('skills')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label className="form-label">Technical Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {technicalSkills.map((skill, idx) => (
                  <div key={idx} style={{ background: '#fef3c7', color: '#d97706', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fde68a' }}>
                    {skill}
                    {editingSections.skills && (
                      <button onClick={() => setTechnicalSkills(technicalSkills.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0, fontSize: '16px' }}>×</button>
                    )}
                  </div>
                ))}
                {technicalSkills.length === 0 && <span style={{ color: '#999' }}>No technical skills added</span>}
              </div>
            </div>
            <div>
              <label className="form-label">Soft Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {softSkills.map((skill, idx) => (
                  <div key={idx} style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #bfdbfe' }}>
                    {skill}
                    {editingSections.skills && (
                      <button onClick={() => setSoftSkills(softSkills.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0, fontSize: '16px' }}>×</button>
                    )}
                  </div>
                ))}
                {softSkills.length === 0 && <span style={{ color: '#999' }}>No soft skills added</span>}
              </div>
            </div>
          </div>

          {/* Section 8: Languages */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="languages">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.languages ? (
                  <button onClick={() => toggleSectionEdit('languages')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('languages')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('languages')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
                {editingSections.languages && (
                  <button onClick={() => setLanguages(languages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                {editingSections.languages ? (
                  <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr', paddingRight: '40px' }}>
                    <div>
                      <label className="form-label">Language</label>
                      <input type="text" style={{ ...formInputBase, width: '100%' }} value={lang.language || ''} onChange={(e) => { const newLangs = [...languages]; newLangs[idx] = {...newLangs[idx], language: e.target.value}; setLanguages(newLangs); }} placeholder="e.g., English" />
                    </div>
                    <div>
                      <label className="form-label">Proficiency</label>
                      <select style={{ ...formInputBase, width: '100%' }} value={lang.proficiency || ''} onChange={(e) => { const newLangs = [...languages]; newLangs[idx] = {...newLangs[idx], proficiency: e.target.value}; setLanguages(newLangs); }}>
                        <option value="">Select Level</option>
                        <option value="native">Native</option>
                        <option value="fluent">Fluent</option>
                        <option value="advanced">Advanced</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="basic">Basic</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 style={{ marginBottom: '5px', fontSize: '16px', fontWeight: '600' }}>{lang.language || ''}</h4>
                    <p style={{ color: '#666', margin: 0 }}>{lang.proficiency || ''}</p>
                  </>
                )}
              </div>
            ))}
            {languages.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No languages added</div>}
            {editingSections.languages && (
              <button onClick={() => setLanguages([...languages, { language: '', proficiency: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Language
              </button>
            )}
          </div>

          {/* Section 9: Projects */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="projects">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faProjectDiagram} /> Academic Projects & Portfolio</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.projects ? (
                  <button onClick={() => toggleSectionEdit('projects')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('projects')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('projects')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {projectEntries.map((proj, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.projects && (
                  <button onClick={() => setProjectEntries(projectEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={proj.title || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], title: e.target.value}; setProjectEntries(newProj); }} placeholder="Project name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Category</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={proj.category || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], category: e.target.value}; setProjectEntries(newProj); }} placeholder="e.g., Web Development" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Role</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={proj.role || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], role: e.target.value}; setProjectEntries(newProj); }} placeholder="e.g., Full-Stack Developer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technologies</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={proj.technologies || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], technologies: e.target.value}; setProjectEntries(newProj); }} placeholder="e.g., React, Node.js" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project URL</label>
                    <input type="url" style={{ ...formInputBase, ...viewModeField }} value={proj.url || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], url: e.target.value}; setProjectEntries(newProj); }} placeholder="https://github.com/project" />
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label className="form-label">Description</label>
                  <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '80px', width: '100%', fontFamily: 'inherit' }} value={proj.description || ''} disabled={!editingSections.projects} onChange={(e) => { const newProj = [...projectEntries]; newProj[idx] = {...newProj[idx], description: e.target.value}; setProjectEntries(newProj); }} placeholder="Describe the project" />
                </div>
              </div>
            ))}
            {projectEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No projects added</div>}
            {editingSections.projects && (
              <button onClick={() => setProjectEntries([...projectEntries, { title: '', description: '', technologies: '', role: '', startDate: '', endDate: '', url: '', category: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Project
              </button>
            )}
          </div>

          {/* Section 10: Activities */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="activities">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faUsers} /> Extracurricular Activities & Leadership</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.activities ? (
                  <button onClick={() => toggleSectionEdit('activities')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('activities')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('activities')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {activityEntries.map((act, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.activities && (
                  <button onClick={() => setActivityEntries(activityEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Activity Name</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={act.name || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], name: e.target.value}; setActivityEntries(newAct); }} placeholder="e.g., Student Council" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role/Position</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={act.role || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], role: e.target.value}; setActivityEntries(newAct); }} placeholder="e.g., President" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={act.organization || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], organization: e.target.value}; setActivityEntries(newAct); }} placeholder="e.g., Stanford University" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={act.startDate || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], startDate: e.target.value}; setActivityEntries(newAct); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={act.endDate || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], endDate: e.target.value}; setActivityEntries(newAct); }} />
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label className="form-label">Description</label>
                  <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '80px', width: '100%', fontFamily: 'inherit' }} value={act.description || ''} disabled={!editingSections.activities} onChange={(e) => { const newAct = [...activityEntries]; newAct[idx] = {...newAct[idx], description: e.target.value}; setActivityEntries(newAct); }} placeholder="Describe your involvement" />
                </div>
              </div>
            ))}
            {activityEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No activities added</div>}
            {editingSections.activities && (
              <button onClick={() => setActivityEntries([...activityEntries, { name: '', role: '', organization: '', startDate: '', endDate: '', currentlyActive: 'No', description: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Activity
              </button>
            )}
          </div>

          {/* Section 11: Certifications */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="certifications">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Training</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.certifications ? (
                  <button onClick={() => toggleSectionEdit('certifications')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('certifications')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('certifications')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {certificationEntries.map((cert, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.certifications && (
                  <button onClick={() => setCertificationEntries(certificationEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Certification Name</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={cert.name || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], name: e.target.value}; setCertificationEntries(newCert); }} placeholder="e.g., Google Analytics" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuing Organization</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={cert.issuer || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], issuer: e.target.value}; setCertificationEntries(newCert); }} placeholder="e.g., Google" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Date</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={cert.issueDate || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], issueDate: e.target.value}; setCertificationEntries(newCert); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credential ID</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={cert.credentialId || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], credentialId: e.target.value}; setCertificationEntries(newCert); }} placeholder="Certificate number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date (if applicable)</label>
                    <input type="month" style={{ ...formInputBase, ...viewModeField }} value={cert.expiryDate || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], expiryDate: e.target.value}; setCertificationEntries(newCert); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certification URL</label>
                    <input type="url" style={{ ...formInputBase, ...viewModeField }} value={cert.url || ''} disabled={!editingSections.certifications} onChange={(e) => { const newCert = [...certificationEntries]; newCert[idx] = {...newCert[idx], url: e.target.value}; setCertificationEntries(newCert); }} placeholder="Certificate verification link" />
                  </div>
                </div>
              </div>
            ))}
            {certificationEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No certifications added</div>}
            {editingSections.certifications && (
              <button onClick={() => setCertificationEntries([...certificationEntries, { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Certification
              </button>
            )}
          </div>

          {/* Section 12: References */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="references">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faUserCheck} /> References</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.references ? (
                  <button onClick={() => toggleSectionEdit('references')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('references')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('references')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {referenceEntries.map((ref, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
                {editingSections.references && (
                  <button onClick={() => setReferenceEntries(referenceEntries.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: '#dc2626', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: 'white', cursor: 'pointer' }}>×</button>
                )}
                <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={ref.name || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], name: e.target.value}; setReferenceEntries(newRef); }} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={ref.relationship || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], relationship: e.target.value}; setReferenceEntries(newRef); }} placeholder="e.g., Professor & Academic Advisor" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={ref.organization || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], organization: e.target.value}; setReferenceEntries(newRef); }} placeholder="University/Company" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Known Since</label>
                    <input type="text" style={{ ...formInputBase, ...viewModeField }} value={ref.knownSince || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], knownSince: e.target.value}; setReferenceEntries(newRef); }} placeholder="e.g., 2020" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" style={{ ...formInputBase, ...viewModeField }} value={ref.email || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], email: e.target.value}; setReferenceEntries(newRef); }} placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" style={{ ...formInputBase, ...viewModeField }} value={ref.phone || ''} disabled={!editingSections.references} onChange={(e) => { const newRef = [...referenceEntries]; newRef[idx] = {...newRef[idx], phone: e.target.value}; setReferenceEntries(newRef); }} placeholder="+1 234 567 8900" />
                  </div>
                </div>
              </div>
            ))}
            {referenceEntries.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No references added</div>}
            {editingSections.references && (
              <button onClick={() => setReferenceEntries([...referenceEntries, { name: '', relationship: '', organization: '', email: '', phone: '', knownSince: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Reference
              </button>
            )}
          </div>

          {/* Section 13: Online Links */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="links">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Online Presence & Portfolio</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.links ? (
                  <button onClick={() => toggleSectionEdit('links')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('links')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('links')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            {professionalLinks.map((link, idx) => (
              <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#0d9488', marginBottom: '4px', fontSize: '14px' }}>{link.type}</div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#666', fontSize: '13px', wordBreak: 'break-all', textDecoration: 'none' }}>{link.url}</a>
                </div>
                {editingSections.links && (
                  <button onClick={() => setProfessionalLinks(professionalLinks.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '20px', marginLeft: '10px' }}>×</button>
                )}
              </div>
            ))}
            {professionalLinks.length === 0 && <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No links added</div>}
            {editingSections.links && (
              <button onClick={() => setProfessionalLinks([...professionalLinks, { type: 'LinkedIn', url: '' }])} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '10px' }}>
                + Add Link
              </button>
            )}
          </div>

          {/* Section 14: Internship Preferences */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="preferences">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faSlidersH} /> Internship Preferences & Availability</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.preferences ? (
                  <button onClick={() => toggleSectionEdit('preferences')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('preferences')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('preferences')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Internship Duration Preference</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.internshipDuration || ''} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, internshipDuration: e.target.value }))}>
                  <option value="">Select preferred duration</option>
                  <option value="1-2-months">1-2 months</option>
                  <option value="3-months">3 months</option>
                  <option value="4-6-months">4-6 months</option>
                  <option value="6-12-months">6-12 months</option>
                  <option value="12-months-plus">12+ months</option>
                  <option value="flexible">Flexible</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Availability to Start</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.availability || ''} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, availability: e.target.value }))}>
                  <option value="">Select availability</option>
                  <option value="immediate">Immediately Available</option>
                  <option value="1-week">Within 1 week</option>
                  <option value="2-weeks">Within 2 weeks</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="2-months">Within 2 months</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="summer">Summer Break</option>
                  <option value="semester">Next Semester</option>
                  <option value="specific-date">Specific Date (add in comments)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start From: Month Year</label>
                <input 
                  type="text" 
                  style={{ ...formInputBase, ...viewModeField }} 
                  value={profileForm.internshipStartMonthYear || ''} 
                  disabled={!editingSections.preferences} 
                  onChange={(e) => setProfileForm(p => ({ ...p, internshipStartMonthYear: e.target.value }))} 
                  placeholder="e.g., January 2025" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Stipend</label>
                <input type="text" style={{ ...formInputBase, ...viewModeField }} value={profileForm.expectedStipend || ''} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, expectedStipend: e.target.value }))} placeholder="e.g., USD 500/month" />
              </div>
              <div className="form-group">
                <label className="form-label">Currency Preference</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.currencyPreference || 'USD'} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, currencyPreference: e.target.value }))}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="GHS">GHS - Ghanaian Cedi</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Willing to Accept Unpaid Internship?</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.unpaidWilling || ''} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, unpaidWilling: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="prefer-paid">Prefer paid but open</option>
                  <option value="no">No, paid only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Academic Credit Required?</label>
                <select style={{ ...formInputBase, ...viewModeField }} value={profileForm.academicCredit || ''} disabled={!editingSections.preferences} onChange={(e) => setProfileForm(p => ({ ...p, academicCredit: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="yes">Yes, required</option>
                  <option value="preferred">Preferred but not required</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 15: Additional Information */}
          <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }} data-section="additional">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
              <h3 className="card-title"><FontAwesomeIcon icon={faInfoCircle} /> Additional Information</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!editingSections.additional ? (
                  <button onClick={() => toggleSectionEdit('additional')} style={{ background: 'linear-gradient(135deg, #f97316 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={() => saveSection('additional')} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => toggleSectionEdit('additional')} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Hobbies & Interests</label>
              <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '100px', width: '100%', fontFamily: 'inherit' }} value={profileForm.hobbies || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, hobbies: e.target.value }))} placeholder="Share your interests outside academics" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Why Internship?</label>
              <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '100px', width: '100%', fontFamily: 'inherit' }} value={profileForm.whyInternship || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, whyInternship: e.target.value }))} placeholder="Share your motivation" />
            </div>
            <div>
              <label className="form-label">Additional Comments</label>
              <textarea style={{ ...formInputBase, ...viewModeField, minHeight: '100px', width: '100%', fontFamily: 'inherit' }} value={profileForm.additionalComments || ''} disabled={!editingSections.additional} onChange={(e) => setProfileForm(p => ({ ...p, additionalComments: e.target.value }))} placeholder="Any other information" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InternMyProfile;
