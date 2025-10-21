import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faUser,
  faBriefcase,
  faCode,
  faBuilding,
  faGraduationCap,
  faCertificate,
  faLanguage,
  faLink,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    yearsOfExperience: '',
    expectedSalary: '',
    jobTypePreference: '',
    availability: '',
    industry: '',
    skills: '',
    tools: ''
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [professionalLinks, setProfessionalLinks] = useState([]);
  const [references, setReferences] = useState([]);

  const authHeaders = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(buildApiUrl('/api/profile/profile'), { headers: authHeaders() });
        const p = res?.data || {};
        setProfileForm(prev => ({
          ...prev,
          firstName: user?.firstName || p.firstName || '',
          lastName: user?.lastName || p.lastName || '',
          email: user?.email || p.email || localStorage.getItem('userEmail') || '',
          phoneNumber: p.phoneNumber || p.phone || '',
          location: typeof p.location === 'string' ? p.location : [p.location?.city, p.location?.state, p.location?.country].filter(Boolean).join(', '),
          professionalTitle: p.professionalTitle || '',
          professionalSummary: p.professionalSummary || p.summary || '',
          yearsOfExperience: p.yearsOfExperience || '',
          expectedSalary: p.expectedSalary || '',
          jobTypePreference: p.jobTypePreference || p.job_type || '',
          availability: typeof p.availability === 'string' ? p.availability : (Array.isArray(p.availability) ? p.availability.join(', ') : ''),
          industry: p.industry || '',
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
          tools: Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || '')
        }));
        setEducation(Array.isArray(p.education) ? p.education : []);
        setExperience(Array.isArray(p.experience) ? p.experience : (Array.isArray(p.workExperience) ? p.workExperience : []));
        setLanguages(Array.isArray(p.languages) ? p.languages.map(l => (typeof l === 'string' ? { language: l, proficiency: '' } : l)) : []);
        setCertifications(Array.isArray(p.certifications) ? p.certifications : []);
        setProfessionalLinks(Array.isArray(p.professionalLinks) ? p.professionalLinks : []);
        setReferences(Array.isArray(p.referenceEntries) ? p.referenceEntries : (Array.isArray(p.references) ? p.references : []));

        // Optional extended fields from registration form
        setProfileForm(prev => ({
          ...prev,
          middleName: p.middleName || '',
          altPhone: p.altPhone || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          bloodGroup: p.bloodGroup || '',
          community: p.community || '',
          nationality: p.nationality || '',
          residentCountry: p.residentCountry || p.location?.country || '',
          currentCity: p.currentCity || p.location?.city || '',
          postalCode: p.postalCode || '',
          address: p.address || '',
          latitude: p.latitude || p.location?.coordinates?.[1] || '',
          longitude: p.longitude || p.location?.coordinates?.[0] || '',
          workPermit: p.workPermit || '',
          preferredLocation1: p.preferredLocation1 || '',
          preferredLocation2: p.preferredLocation2 || '',
          preferredLocation3: p.preferredLocation3 || '',
          willingToRelocate: p.willingToRelocate || '',
          workLocation: p.workLocation || '',
          yearsOfExperience: p.yearsOfExperience || p.yearsExperience || prev.yearsOfExperience,
          careerLevel: p.careerLevel || '',
          jobType: p.jobType || '',
          noticePeriod: p.noticePeriod || '',
          currentSalary: p.currentSalary || '',
          currencyPreference: p.currencyPreference || p.currency || '',
          travelAvailability: p.travelAvailability || '',
          membershipOrg: p.membershipOrg || '',
          membershipType: p.membershipType || '',
          membershipDate: p.membershipDate || '',
          askCommunity: p.askCommunity || '',
          hobbies: p.hobbies || '',
          additionalComments: p.additionalComments || ''
        }));
      } catch {}
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        ...profileForm,
        skills: profileForm.skills ? profileForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: profileForm.tools ? profileForm.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        education, experience, languages, certifications, professionalLinks, profileCompleted: true
      };
      await axios.put(buildApiUrl('/api/profile/profile'), payload, { headers: { ...authHeaders(), 'Content-Type': 'application/json' } });
      setEditMode(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  // Precise styling to match reference
  const containerStyle = { padding: '30px', maxWidth: '100%', width: '100%', margin: '0' };
  const elevatedCardStyle = { border: '1px solid #edf2f7', borderRadius: '16px', boxShadow: '0 10px 30px rgba(17, 24, 39, 0.06)', background: '#fff', marginBottom: '20px' };
  const profileHeaderStyle = { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '40px', borderRadius: '16px', marginBottom: '20px', minHeight: '220px', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.25)' };
  const profileAvatarStyle = { width: '120px', height: '120px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 700, color: '#667eea', marginBottom: '20px', border: '5px solid rgba(255,255,255,0.3)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' };
  const formInputBase = { width: '100%', padding: '10px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s' };
  const viewModeField = editMode ? {} : { background: '#f7f9fc', borderColor: '#e6eaf1', color: '#333' };
  const pillTagStyle = { display: 'inline-block', background: '#eaf3ff', color: '#1d4ed8', padding: '8px 14px', borderRadius: '999px', margin: '5px', fontSize: '14px', border: '1px solid #cfe2ff' };

  return (
    <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
      <div style={containerStyle}>
        <div style={profileHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={profileAvatarStyle}>{(profileForm.firstName?.[0] || 'U')}{(profileForm.lastName?.[0] || '')}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>{profileForm.firstName} {profileForm.lastName}</h2>
              <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.9 }}>{profileForm.professionalTitle || '—'}</p>
              <p style={{ opacity: 0.8 }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {profileForm.location || '—'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editMode && (
                <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </button>
              )}
              {editMode && (
                <>
                  <button className="btn btn-success btn-sm" onClick={saveProfile} disabled={saving}>
                    <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </>
              )}
              <button className="btn btn-complete btn-sm" onClick={saveProfile} disabled={saving}>
                <FontAwesomeIcon icon={faCheckCircle} /> {saving ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
          </div>
          <div style={gridStyle}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={`${profileForm.firstName || ''} ${profileForm.lastName || ''}`.trim()} disabled={!editMode} onChange={(e) => {
                const [f, ...r] = e.target.value.split(' ');
                setProfileForm(p => ({ ...p, firstName: f || '', lastName: r.join(' ') || '' }));
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.middleName || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, middleName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.email || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.phoneNumber || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, phoneNumber: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Alternative Phone</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.altPhone || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, altPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input style={{ ...formInputBase, ...viewModeField }} value={profileForm.location || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea style={{ ...formInputBase, minHeight: '100px', resize: 'vertical', ...viewModeField }} value={profileForm.professionalSummary || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, professionalSummary: e.target.value }))} />
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBriefcase} /> Professional Details</h3>
          </div>
          <div style={gridStyle}>
            {[
              ['Current Job Title', 'professionalTitle'],
              ['Years of Experience', 'yearsOfExperience'],
              ['Industry', 'industry'],
              ['Expected Salary (USD)', 'expectedSalary'],
              ['Job Type Preference', 'jobTypePreference'],
              ['Availability', 'availability'],
              ['Career Level', 'careerLevel'],
              ['Notice Period', 'noticePeriod'],
              ['Currency Preference', 'currencyPreference'],
              ['Current Salary', 'currentSalary'],
              ['Work Location', 'workLocation']
            ].map(([label, key]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input style={{ ...formInputBase, ...viewModeField }} value={profileForm[key] || ''} disabled={!editMode} onChange={(e) => setProfileForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCode} /> Skills & Expertise</h3>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px', color: '#666' }}>Technical Skills</h4>
            <div>
              {(profileForm.skills || '').split(',').filter(Boolean).map((s, i) => (
                <span key={i} style={pillTagStyle}>{s.trim()}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '25px' }}>
            <h4 style={{ marginBottom: '15px', color: '#666' }}>Tools</h4>
            <div>
              {(profileForm.tools || '').split(',').filter(Boolean).map((s, i) => (
                <span key={i} style={pillTagStyle}>{s.trim()}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faUser} /> References</h3>
          </div>
          {(references || []).map((rf, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                <div><strong>{rf.name || rf.referenceName || 'Name'}</strong></div>
                <div>{rf.relation || rf.referenceRelationship || ''}</div>
                <div>{rf.contact || rf.referenceEmail || ''}</div>
                <div>{rf.referencePhone || ''}</div>
              </div>
            </div>
          ))}
          {(references || []).length === 0 && <div style={{ color: '#999' }}>No references added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faBuilding} /> Work Experience</h3>
          </div>
          {(experience || []).map((ex, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #667eea' }}>
              <h4>{ex.title || ex.role || 'Role'}</h4>
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: '5px' }}>{ex.company || 'Company'}</div>
              <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ex.startDate || '') + (ex.endDate ? ` - ${ex.endDate}` : '')}</div>
              <p style={{ color: '#666', marginTop: '10px' }}>{ex.description || ''}</p>
            </div>
          ))}
          {(experience || []).length === 0 && <div style={{ color: '#999' }}>No experience added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
          </div>
          {(education || []).map((ed, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #667eea' }}>
              <h4>{ed.degree || 'Degree'}{ed.field ? ` in ${ed.field}` : ''}</h4>
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: '5px' }}>{ed.school || 'Institution'}</div>
              <div style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>{(ed.startDate || '') + (ed.endDate ? ` - ${ed.endDate}` : '')}</div>
            </div>
          ))}
          {(education || []).length === 0 && <div style={{ color: '#999' }}>No education added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faCertificate} /> Certifications & Awards</h3>
          </div>
          {(certifications || []).map((ct, idx) => (
            <div key={idx} style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{ct.name || 'Certification'}</h4>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{(ct.issuer || '') + (ct.date ? ` - ${ct.date}` : '')}</p>
                </div>
                <span className="status-badge status-offered">Verified</span>
              </div>
            </div>
          ))}
          {(certifications || []).length === 0 && <div style={{ color: '#999' }}>No certifications added</div>}
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLanguage} /> Languages</h3>
          </div>
          <div style={gridStyle}>
            {(languages || []).map((lg, idx) => (
              <div key={idx}>
                <h4 style={{ marginBottom: '10px' }}>{lg.language || ''}</h4>
                <p style={{ color: '#666' }}>{lg.proficiency || ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ ...elevatedCardStyle, padding: '25px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0' }}>
            <h3 className="card-title"><FontAwesomeIcon icon={faLink} /> Social Links</h3>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {(professionalLinks || []).map((ln, idx) => (
              <a href={ln.url || '#'} key={idx} className="social-link" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#f5f7fa', borderRadius: '8px', color: '#667eea', textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faLink} /> <span>{ln.label || ln.url}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;


