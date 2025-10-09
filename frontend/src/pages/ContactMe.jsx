import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faLinkedin,
  faGithub,
  faGlobe,
  faArrowLeft,
  faPaperPlane,
  faUser,
  faMessage,
  faTag,
  faCheckCircle,
  faExclamationCircle,
  faEdit,
  faDownload,
  faCamera,
  faUpload,
  faTimes,
  faBuilding,
  faIndustry,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin as faLinkedinBrand, faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import { FadeInUp, SlideIn, ScaleIn, StaggerChildren } from '../components/animations';
import { motion } from 'framer-motion';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import { useProfilePhoto } from '../context/ProfilePhotoContext';
import ProfileAvatar from '../components/ProfileAvatar';
import '../styles/ContactMe.css';

const ContactMe = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = userId === currentUserId;
  const { profilePhoto, updateProfilePhoto, removeProfilePhoto, getUserInitials } = useProfilePhoto();
  
  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [internDetails, setInternDetails] = useState(null);
  const [jobSeekerProfile, setJobSeekerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadStatus, setPhotoUploadStatus] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const targetUserId = userId || currentUserId;
      
      // Get userType from localStorage first (most reliable)
      const storedUserType = localStorage.getItem('role') || localStorage.getItem('userRole');
      console.log('📋 Stored userType/role from localStorage:', storedUserType);
      
      // Fetch user profile (JWT-authenticated current user)
      const userResponse = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );

      if (userResponse && userResponse.ok) {
        const raw = await userResponse.json();
        console.log('📋 Raw profile data from API:', raw);
        
        // Determine userType priority: localStorage > API > default
        const determinedUserType = storedUserType || raw.userType || 'jobSeeker';
        console.log('📋 Determined userType:', determinedUserType);
        
        // Map to frontend structure expected by this page
        const mapped = {
          firstName: raw.fullName ? raw.fullName.split(' ')[0] : (raw.firstName || ''),
          lastName: raw.fullName ? raw.fullName.split(' ').slice(1).join(' ') : (raw.lastName || ''),
          email: raw.email,
          phone: raw.phone,
          location: typeof raw.location === 'string' ? raw.location : (raw.location?.city || ''),
          currentAddress: raw.currentAddress || '',
          currentAddressPin: raw.currentAddressPin || '',
          homeAddress: raw.homeAddress || '',
          homeAddressPin: raw.homeAddressPin || '',
          commuteOptions: Array.isArray(raw.commuteOptions) ? raw.commuteOptions : [],
          dateOfBirth: raw.dateOfBirth,
          gender: raw.gender,
          bloodGroup: raw.bloodGroup,
          skills: Array.isArray(raw.skills) ? raw.skills : [],
          jobPreferences: raw.jobPreferences || {},
          salaryExpectations: raw.salaryExpectations || {},
          availability: raw.availability || {},
          languages: Array.isArray(raw.languages) ? raw.languages : [],
          linkedinProfile: raw.linkedinProfile || '',
          portfolio: raw.portfolio || '',
          bio: raw.bio || '',
          userType: determinedUserType,
          // Recruiter-specific fields
          companyName: raw.companyName || '',
          companyWebsite: raw.companyWebsite || '',
          industry: raw.industry || '',
          companySize: raw.companySize || '',
          foundedYear: raw.foundedYear || '',
          companyDescription: raw.companyDescription || '',
          companyLogo: raw.companyLogo || ''
        };
        
        console.log('📋 Mapped userData:', mapped);
        console.log('📋 UserType in mapped:', mapped.userType);
        setUserData(mapped);

        // Fetch resume data ONLY for job seekers
        const isJobSeeker = determinedUserType === 'jobSeeker' || determinedUserType === 'job_seeker';
        const isIntern = determinedUserType === 'intern' || storedUserType === 'intern';
        console.log('📋 Is job seeker?', isJobSeeker);
        console.log('📋 Is intern?', isIntern);
        console.log('📋 determinedUserType:', determinedUserType);
        
        if (isJobSeeker) {
          console.log('Fetching resume data for job seeker...');
          const resumeResponse = await makeAuthenticatedRequest(
            buildApiUrl('/api/modern-resumes/profile')
          );

          console.log('Resume response status:', resumeResponse?.status);
          if (resumeResponse && resumeResponse.ok) {
            const responseData = await resumeResponse.json();
            console.log('Resume data received:', responseData);
            const resumeData = responseData.resume_data || responseData;
            setResumeData(resumeData);
            checkProfileCompleteness(mapped, resumeData);
          } else {
            console.log('No resume data found or error:', resumeResponse?.status);
          }

          // Fetch comprehensive job seeker profile
          console.log('Fetching comprehensive job seeker profile...');
          const jobSeekerProfileResponse = await makeAuthenticatedRequest(
            buildApiUrl('/api/jobseeker/profile')
          );

          console.log('Job seeker profile response status:', jobSeekerProfileResponse?.status);
          if (jobSeekerProfileResponse && jobSeekerProfileResponse.ok) {
            const profileData = await jobSeekerProfileResponse.json();
            console.log('✅ Comprehensive job seeker profile received:', profileData);
            setJobSeekerProfile(profileData);
          } else {
            console.log('❌ No comprehensive job seeker profile found or error:', jobSeekerProfileResponse?.status);
          }
        } else if (isIntern) {
          console.log('Fetching intern details...');
          const internResponse = await makeAuthenticatedRequest(
            buildApiUrl('/api/interns/profile')
          );

          console.log('Intern response status:', internResponse?.status);
          if (internResponse && internResponse.ok) {
            const internData = await internResponse.json();
            console.log('✅ Intern details received:', internData);
            console.log('   - Has resumePath?', !!internData.resumePath);
            console.log('   - ResumePath value:', internData.resumePath);
            console.log('   - Technical skills:', internData.technicalSkills?.length || 0);
            console.log('   - Soft skills:', internData.softSkills?.length || 0);
            setInternDetails(internData);
            
            // Update userData with intern-specific fields
            setUserData(prev => ({
              ...prev,
              phone: internData.mobile || prev.phone,
              location: internData.currentLocation || prev.location,
              dateOfBirth: internData.dateOfBirth || prev.dateOfBirth,
              gender: internData.gender || prev.gender,
              linkedinProfile: internData.linkedInProfile || prev.linkedinProfile,
              portfolio: internData.portfolioWebsite || prev.portfolio,
              githubProfile: internData.githubProfile || ''
            }));
          } else {
            console.log('❌ No intern details found or error:', internResponse?.status);
            const errorText = await internResponse?.text();
            console.log('Error response:', errorText);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompleteness = (user, resume) => {
    const hasBasicInfo = user?.firstName && user?.lastName && user?.email;
    const hasResumeInfo = resume?.personal_info?.name && resume?.personal_info?.phone;
    const hasExperience = resume?.experience && resume?.experience.length > 0;
    
    // Check for skills in both user profile and resume data
    const hasResumeSkills = resume?.skills && (
      (resume.skills.technical_skills && resume.skills.technical_skills.length > 0) ||
      (resume.skills.soft_skills && resume.skills.soft_skills.length > 0) ||
      (resume.skills.languages && resume.skills.languages.length > 0)
    );
    
    const hasUserSkills = user?.skills && user.skills.length > 0;
    
    const hasSkills = hasResumeSkills || hasUserSkills;

    console.log('🔍 Profile completeness check:', {
      hasBasicInfo,
      hasResumeInfo,
      hasExperience,
      hasResumeSkills,
      hasUserSkills,
      hasSkills,
      userSkills: user?.skills,
      resumeSkills: resume?.skills
    });

    setIsProfileComplete(hasBasicInfo && hasResumeInfo && hasExperience && hasSkills);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call for contact form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeDownload = async () => {
    if (!resumeData) {
      console.error("No resume data found");
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/modern-resumes/download'),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response && response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `resume_${userData?.firstName || 'user'}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download resume:", response?.status);
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoUploadStatus('error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadStatus('error');
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoUploadStatus(null);

    // Prepare a data URL for immediate preview and local fallback
    const toDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      const formData = new FormData();
      formData.append('profile_photo', file);

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/upload-photo'),
        {
          method: 'POST',
          body: formData
        }
      );

      if (response && response.ok) {
        const result = await response.json();
        updateProfilePhoto(result.photo_url);
        setPhotoUploadStatus('success');
        
        // Update userData with new photo
        setUserData(prev => ({
          ...prev,
          profilePhoto: result.photo_url
        }));
      } else {
        // Backend failed — use local preview fallback
        const dataUrl = await toDataUrl(file);
        updateProfilePhoto(dataUrl);
        setPhotoUploadStatus('local');
        setUserData(prev => ({
          ...prev,
          profilePhoto: dataUrl
        }));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Network/500 — use local preview fallback
      try {
        const dataUrl = await toDataUrl(file);
        updateProfilePhoto(dataUrl);
        setPhotoUploadStatus('local');
        setUserData(prev => ({
          ...prev,
          profilePhoto: dataUrl
        }));
      } catch (_) {
        setPhotoUploadStatus('error');
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/remove-photo'),
        {
          method: 'DELETE'
        }
      );

      if (response && response.ok) {
        removeProfilePhoto();
        setPhotoUploadStatus('success');
        
        // Update userData to remove photo
        setUserData(prev => ({
          ...prev,
          profilePhoto: null
        }));
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      // Still clear locally if backend not available
      removeProfilePhoto();
      setUserData(prev => ({
        ...prev,
        profilePhoto: null
      }));
    }
  };

  if (loading) {
    return (
      <div className="contact-me-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="contact-me-error">
        <FadeInUp>
          <div className="error-content">
            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            <h2>Profile Not Found</h2>
            <p>The requested profile could not be found.</p>
            <button onClick={() => navigate(-1)} className="back-btn">
              <FontAwesomeIcon icon={faArrowLeft} />
              Go Back
            </button>
          </div>
        </FadeInUp>
      </div>
    );
  }

  const getContactInfo = () => {
    const info = [];
    
    if (userData?.email || resumeData?.personal_info?.email) {
      info.push({
        icon: faEnvelope,
        label: 'Email',
        value: userData?.email || resumeData?.personal_info?.email,
        link: `mailto:${userData?.email || resumeData?.personal_info?.email}`
      });
    }

    if (userData?.phone || resumeData?.personal_info?.phone) {
      info.push({
        icon: faPhone,
        label: 'Phone',
        value: userData?.phone || resumeData?.personal_info?.phone,
        link: `tel:${userData?.phone || resumeData?.personal_info?.phone}`
      });
    }

    if (userData?.location || resumeData?.personal_info?.location) {
      info.push({
        icon: faMapMarkerAlt,
        label: 'Location',
        value: userData?.location || resumeData?.personal_info?.location
      });
    }

    // Check for current address in userData or resumeData
    const currentAddress = userData?.currentAddress || resumeData?.personal_info?.currentAddress || '';
    const currentAddressPin = userData?.currentAddressPin || resumeData?.personal_info?.currentAddressPin || '';
    
    if (currentAddress) {
      info.push({
        icon: faMapMarkerAlt,
        label: 'Current Address 📍',
        value: `${currentAddress}${currentAddressPin ? ` - ${currentAddressPin}` : ''}`
      });
    }

    // Check for home address in userData or resumeData
    const homeAddress = userData?.homeAddress || resumeData?.personal_info?.homeAddress || '';
    const homeAddressPin = userData?.homeAddressPin || resumeData?.personal_info?.homeAddressPin || '';
    
    if (homeAddress) {
      info.push({
        icon: faMapMarkerAlt,
        label: 'Home Address 📍',
        value: `${homeAddress}${homeAddressPin ? ` - ${homeAddressPin}` : ''}`
      });
    }

    if (userData?.linkedinProfile || resumeData?.personal_info?.linkedin) {
      info.push({
        icon: faLinkedinBrand,
        label: 'LinkedIn',
        value: 'LinkedIn Profile',
        link: userData?.linkedinProfile || resumeData?.personal_info?.linkedin
      });
    }

    if (resumeData?.personal_info?.github) {
      info.push({
        icon: faGithubBrand,
        label: 'GitHub',
        value: 'GitHub Profile',
        link: resumeData.personal_info.github
      });
    }

    if (userData?.portfolio) {
      info.push({
        icon: faGlobe,
        label: 'Portfolio',
        value: 'Portfolio Website',
        link: userData.portfolio
      });
    }

    // Recruiter-specific information
    if (userData?.userType === 'recruiter') {
      if (userData?.companyWebsite) {
        info.push({
          icon: faGlobe,
          label: 'Company Website',
          value: 'Visit Website',
          link: userData.companyWebsite
        });
      }

      if (userData?.industry) {
        info.push({
          icon: faIndustry,
          label: 'Industry',
          value: userData.industry
        });
      }

      if (userData?.companySize) {
        info.push({
          icon: faUsers,
          label: 'Company Size',
          value: userData.companySize
        });
      }

      if (userData?.foundedYear) {
        info.push({
          icon: faBuilding,
          label: 'Founded Year',
          value: userData.foundedYear
        });
      }
    }

    return info;
  };

  const contactInfo = getContactInfo();
  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 
                   resumeData?.personal_info?.name || 'User';

  // Debug logging
  console.log('ContactMe Debug:', {
    userId,
    currentUserId,
    isOwnProfile,
    userData: !!userData,
    resumeData: !!resumeData,
    internDetails: !!internDetails,
    userType: userData?.userType,
    role: localStorage.getItem('role')
  });
  
  console.log('📋 Intern Details State:', internDetails);
  console.log('📋 userData?.userType:', userData?.userType);
  console.log('📋 Is equal to intern?', userData?.userType === 'intern');
  console.log('📋 Has internDetails?', !!internDetails);
  console.log('📋 Will show intern sections?', userData?.userType === 'intern' && !!internDetails);

  return (
    <div className="contact-me-wrapper">
      {/* Header */}
      <SlideIn direction="down">
        <div className="contact-me-header">
          <h1>Contact {isOwnProfile ? 'Me' : fullName}</h1>
        </div>
      </SlideIn>

      <div className="contact-me-container">
        {/* Profile Card */}
        <SlideIn direction="left" delay={0.2}>
          <div className="contact-profile-card">
            <div className="profile-avatar-section">
              <ProfileAvatar 
                src={profilePhoto}
                firstName={userData?.firstName}
                lastName={userData?.lastName}
                size={120}
                showOnlineIndicator={true}
              />
            </div>
            
            <div className="profile-info">
              <div className="profile-name-section">
                <h2>{fullName}</h2>
                {/* Profile Photo Upload Button - Next to Name */}
                <div className="profile-photo-controls">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="photo-upload-btn-inline">
                    <FontAwesomeIcon icon={faCamera} />
                    {profilePhoto ? 'Change Photo' : 'Add Photo'}
                  </label>
                  
                  {profilePhoto && (
                    <button 
                      onClick={handlePhotoRemove}
                      className="photo-remove-btn-inline"
                      title="Remove Photo"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              </div>
              <p className="profile-title">
                {userData?.userType === 'recruiter' ? (
                  <span className="recruiter-badge">
                    <FontAwesomeIcon icon={faBuilding} /> Recruiter
                  </span>
                ) : (
                  resumeData?.personal_info?.job_title || 
                  resumeData?.experience?.[0]?.title || 
                  'Job Seeker'
                )}
              </p>
              {userData?.userType === 'recruiter' && userData?.companyName && (
                <p className="company-name-display">
                  <FontAwesomeIcon icon={faBuilding} /> {userData.companyName}
                </p>
              )}
              <div className="profile-status">
                <span className="status-dot"></span>
                Online
              </div>
              
              {/* Upload Status Messages */}
              {photoUploadStatus === 'success' && (
                <div className="upload-status success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Photo updated successfully!
                </div>
              )}
              
              {photoUploadStatus === 'error' && (
                <div className="upload-status error">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  Failed to upload photo. Please try again.
                </div>
              )}
              
              {photoUploadStatus === 'local' && (
                <div className="upload-status local">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Photo saved locally! It will appear across the app.
                </div>
              )}
              
              {isUploadingPhoto && (
                <div className="upload-status uploading">
                  <div className="spinner small"></div>
                  Uploading...
                </div>
              )}
            </div>

            {/* Complete Profile Button */}
            {isOwnProfile && !isProfileComplete && userData?.userType === 'jobSeeker' && (
              <FadeInUp delay={0.4}>
                <motion.button
                  className="complete-profile-btn"
                  onClick={() => navigate('/complete-profile')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Complete Your Profile
                </motion.button>
              </FadeInUp>
            )}

            {/* Complete Profile Button for Interns */}
            {isOwnProfile && userData?.userType === 'intern' && !internDetails && (
              <FadeInUp delay={0.4}>
                <motion.button
                  className="complete-profile-btn intern"
                  onClick={() => navigate('/intern-details', {
                    state: {
                      userData: {
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userId: currentUserId
                      }
                    }
                  })}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Complete Your Intern Profile
                </motion.button>
              </FadeInUp>
            )}

            {/* Edit Profile Button for Interns */}
            {isOwnProfile && userData?.userType === 'intern' && internDetails && (
              <FadeInUp delay={0.4}>
                <motion.button
                  className="edit-profile-btn"
                  onClick={() => navigate('/intern-details', {
                    state: {
                      userData: {
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userId: currentUserId
                      },
                      existingData: internDetails
                    }
                  })}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit Intern Profile
                </motion.button>
              </FadeInUp>
            )}

            {/* Download Resume Button - ONLY for Job Seekers */}
            {isOwnProfile && resumeData && userData?.userType !== 'recruiter' && (
              <FadeInUp delay={0.5}>
                <motion.button
                  className="download-resume-btn"
                  onClick={handleResumeDownload}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Download Resume
                </motion.button>
              </FadeInUp>
            )}

            {/* Contact Information */}
            {contactInfo.length > 0 && (
              <div className="contact-info-section">
                <h3>Contact Information</h3>
                <StaggerChildren staggerDelay={0.1}>
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-info-item">
                      <div className="contact-icon">
                        <FontAwesomeIcon icon={info.icon} />
                      </div>
                      <div className="contact-details">
                        <span className="contact-label">{info.label}</span>
                        {info.link ? (
                          <a href={info.link} className="contact-value" target="_blank" rel="noopener noreferrer">
                            {info.value}
                          </a>
                        ) : (
                          <span className="contact-value">{info.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </StaggerChildren>
              </div>
            )}

            {/* Personal Details */}
            {(userData?.dateOfBirth || userData?.gender || userData?.bloodGroup) && (
              <FadeInUp delay={0.3}>
                <div className="personal-details-section">
                  <h3>Personal Details</h3>
                  <div className="details-grid">
                    {userData?.dateOfBirth && (
                      <div className="detail-item">
                        <span className="detail-label">Date of Birth</span>
                        <span className="detail-value">{new Date(userData.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                    {userData?.gender && (
                      <div className="detail-item">
                        <span className="detail-label">Gender</span>
                        <span className="detail-value">{userData.gender}</span>
                      </div>
                    )}
                    {userData?.bloodGroup && (
                      <div className="detail-item">
                        <span className="detail-label">Blood Group</span>
                        <span className="detail-value">{userData.bloodGroup}</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Job Preferences */}
            {userData?.jobPreferences && Object.keys(userData.jobPreferences).some(key => userData.jobPreferences[key]) && (
              <FadeInUp delay={0.4}>
                <div className="job-preferences-section">
                  <h3>Job Preferences</h3>
                  <div className="preferences-grid">
                    {userData.jobPreferences.jobType && (
                      <div className="preference-item">
                        <span className="preference-label">Job Type</span>
                        <span className="preference-value">{userData.jobPreferences.jobType}</span>
                      </div>
                    )}
                    {userData.jobPreferences.workMode && (
                      <div className="preference-item">
                        <span className="preference-label">Work Mode</span>
                        <span className="preference-value">{userData.jobPreferences.workMode}</span>
                      </div>
                    )}
                    {userData.jobPreferences.experienceLevel && (
                      <div className="preference-item">
                        <span className="preference-label">Experience Level</span>
                        <span className="preference-value">{userData.jobPreferences.experienceLevel}</span>
                      </div>
                    )}
                    {userData.jobPreferences.industry && (
                      <div className="preference-item">
                        <span className="preference-label">Industry</span>
                        <span className="preference-value">{userData.jobPreferences.industry}</span>
                      </div>
                    )}
                    {userData.jobPreferences.companySize && (
                      <div className="preference-item">
                        <span className="preference-label">Company Size</span>
                        <span className="preference-value">{userData.jobPreferences.companySize}</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Salary Expectations */}
            {userData?.salaryExpectations && (userData.salaryExpectations.minSalary || userData.salaryExpectations.maxSalary) && (
              <FadeInUp delay={0.5}>
                <div className="salary-section">
                  <h3>Salary Expectations</h3>
                  <div className="salary-info">
                    {userData.salaryExpectations.minSalary && userData.salaryExpectations.maxSalary ? (
                      <span className="salary-range">
                        {userData.salaryExpectations.minSalary} - {userData.salaryExpectations.maxSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}
                      </span>
                    ) : userData.salaryExpectations.minSalary ? (
                      <span className="salary-range">
                        Min: {userData.salaryExpectations.minSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}
                      </span>
                    ) : (
                      <span className="salary-range">
                        Max: {userData.salaryExpectations.maxSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}
                      </span>
                    )}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Company Description for Recruiters */}
            {userData?.userType === 'recruiter' && userData?.companyDescription && (
              <FadeInUp delay={0.6}>
                <div className="bio-section company-description-section">
                  <h3>About {userData?.companyName || 'Our Company'}</h3>
                  <p className="bio-text">{userData.companyDescription}</p>
                </div>
              </FadeInUp>
            )}

            {/* Bio for Job Seekers */}
            {/* About - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && userData?.bio && (
              <FadeInUp delay={0.6}>
                <div className="bio-section">
                  <h3>About</h3>
                  <p className="bio-text">{userData.bio}</p>
                </div>
              </FadeInUp>
            )}

            {/* Commute Options - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && userData?.commuteOptions && userData.commuteOptions.length > 0 && (
              <FadeInUp delay={0.65}>
                <div className="commute-section">
                  <h3>Commute Options to Work Place</h3>
                  <div className="commute-options-list">
                    {userData.commuteOptions.map((option, index) => (
                      <span key={index} className="commute-option-tag">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}


            {/* Resume Data - Professional Summary - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.summary && (
              <FadeInUp delay={0.6}>
                <div className="resume-summary-section">
                  <h3>Professional Summary</h3>
                  <p className="resume-summary-text">{resumeData.summary}</p>
                </div>
              </FadeInUp>
            )}

            {/* Fallback: Show if no resume data - ONLY for Job Seekers (NOT interns or recruiters) */}
            {userData?.userType === 'jobSeeker' && !resumeData && (
              <FadeInUp delay={0.6}>
                <div className="resume-summary-section">
                  <h3>Resume Information</h3>
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <p className="resume-summary-text" style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
                      No resume data available. Upload your resume to showcase your professional experience here.
                    </p>
                    <button 
                      onClick={() => navigate('/modern-upload')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      Upload Resume
                    </button>
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Resume Data - Skills - ONLY for Job Seekers (NOT interns or recruiters) */}
            {userData?.userType === 'jobSeeker' && (resumeData?.skills || userData?.skills?.length > 0) && (
              <FadeInUp delay={0.7}>
                <div className="resume-skills-section">
                  <h3>Skills</h3>
                  
                  {/* Technical Skills */}
                  {resumeData?.skills?.technical_skills && resumeData.skills.technical_skills.length > 0 && (
                    <div className="skills-category">
                      <h4>Technical Skills</h4>
                      <div className="skills-tags">
                        {resumeData.skills.technical_skills.map((skill, index) => (
                          <span key={index} className="skill-tag technical">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Soft Skills */}
                  {resumeData?.skills?.soft_skills && resumeData.skills.soft_skills.length > 0 && (
                    <div className="skills-category">
                      <h4>Soft Skills</h4>
                      <div className="skills-tags">
                        {resumeData.skills.soft_skills.map((skill, index) => (
                          <span key={index} className="skill-tag soft">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Languages */}
                  {resumeData?.skills?.languages && resumeData.skills.languages.length > 0 && (
                    <div className="skills-category">
                      <h4>Languages</h4>
                      <div className="skills-tags">
                        {resumeData.skills.languages.map((lang, index) => (
                          <span key={index} className="skill-tag language">{lang}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Profile Skills (from Complete Profile form) */}
                  {userData?.skills?.length > 0 && (
                    <div className="skills-category">
                      <h4>Profile Skills</h4>
                      <div className="skills-tags">
                        {userData.skills.map((skill, index) => (
                          <span key={index} className="skill-tag technical">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeInUp>
            )}

            {/* Resume Data - Education - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.education && resumeData.education.length > 0 && (
              <FadeInUp delay={0.8}>
                <div className="resume-education-section">
                  <h3>Education</h3>
                  <div className="education-list">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        <div className="education-degree">{edu.degree}</div>
                        <div className="education-university">{edu.university}</div>
                        {edu.year && <div className="education-year">{edu.year}</div>}
                        {edu.grade && <div className="education-grade">Grade: {edu.grade}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Resume Data - Experience - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.experience && resumeData.experience.length > 0 && (
              <FadeInUp delay={0.9}>
                <div className="resume-experience-section">
                  <h3>Work Experience</h3>
                  <div className="experience-list">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="experience-title">{exp.title}</div>
                        <div className="experience-company">{exp.company}</div>
                        {exp.duration && <div className="experience-duration">{exp.duration}</div>}
                        {exp.description && <div className="experience-description">{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Resume Data - Projects - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.projects && resumeData.projects.length > 0 && (
              <FadeInUp delay={1.0}>
                <div className="resume-projects-section">
                  <h3>Projects</h3>
                  <div className="projects-list">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="project-item">
                        <div className="project-name">{project.name}</div>
                        {project.description && <div className="project-description">{project.description}</div>}
                        {project.technologies && (
                          <div className="project-technologies">
                            <strong>Technologies:</strong> {project.technologies.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Resume Data - Certifications - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.certifications && resumeData.certifications.length > 0 && (
              <FadeInUp delay={1.1}>
                <div className="resume-certifications-section">
                  <h3>Certifications</h3>
                  <div className="certifications-list">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="certification-item">
                        <div className="certification-name">{cert.name}</div>
                        {cert.issuer && <div className="certification-issuer">{cert.issuer}</div>}
                        {cert.date && <div className="certification-date">{cert.date}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* COMPREHENSIVE JOB SEEKER PROFILE SECTIONS */}
            {userData?.userType === 'jobSeeker' && jobSeekerProfile && (
              <>
                <div className="jobseeker-section-divider">
                  <h2>👨‍💼 Complete Job Seeker Profile</h2>
                  <p>Comprehensive information from job seeker registration</p>
                </div>

                {/* Personal Information */}
                {jobSeekerProfile.personalInfo && (
                  <FadeInUp delay={0.6}>
                    <div className="jobseeker-personal-section">
                      <h3>👤 Personal Information</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.personalInfo.fullName && (
                          <div className="intern-info-card">
                            <div className="info-label">Full Name</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.fullName}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.email && (
                          <div className="intern-info-card">
                            <div className="info-label">Email</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.email}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.mobileNumber && (
                          <div className="intern-info-card">
                            <div className="info-label">Mobile Number</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.countryCode} {jobSeekerProfile.personalInfo.mobileNumber}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.dateOfBirth && (
                          <div className="intern-info-card">
                            <div className="info-label">Date of Birth</div>
                            <div className="info-value">{new Date(jobSeekerProfile.personalInfo.dateOfBirth).toLocaleDateString()}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.gender && (
                          <div className="intern-info-card">
                            <div className="info-label">Gender</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.gender}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.nationality && (
                          <div className="intern-info-card">
                            <div className="info-label">Nationality</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.nationality}</div>
                          </div>
                        )}
                        {(jobSeekerProfile.personalInfo.currentLocationCountry || jobSeekerProfile.personalInfo.currentLocationCity) && (
                          <div className="intern-info-card">
                            <div className="info-label">Current Location</div>
                            <div className="info-value">
                              {jobSeekerProfile.personalInfo.currentLocationCity && `${jobSeekerProfile.personalInfo.currentLocationCity}, `}
                              {jobSeekerProfile.personalInfo.currentLocationCountry}
                            </div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.willingToRelocate && (
                          <div className="intern-info-card">
                            <div className="info-label">Willing to Relocate</div>
                            <div className="info-value">{jobSeekerProfile.personalInfo.willingToRelocate}</div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.linkedinProfile && (
                          <div className="intern-info-card">
                            <div className="info-label">LinkedIn Profile</div>
                            <div className="info-value">
                              <a href={jobSeekerProfile.personalInfo.linkedinProfile} target="_blank" rel="noopener noreferrer">
                                View Profile
                              </a>
                            </div>
                          </div>
                        )}
                        {jobSeekerProfile.personalInfo.portfolioWebsite && (
                          <div className="intern-info-card">
                            <div className="info-label">Portfolio/Website</div>
                            <div className="info-value">
                              <a href={jobSeekerProfile.personalInfo.portfolioWebsite} target="_blank" rel="noopener noreferrer">
                                View Portfolio
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Education Details */}
                {jobSeekerProfile.educationInfo && (
                  <FadeInUp delay={0.7}>
                    <div className="jobseeker-education-section">
                      <h3>🎓 Education Details</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.educationInfo.highestEducationLevel && (
                          <div className="intern-info-card">
                            <div className="info-label">Highest Education Level</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.highestEducationLevel}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.fieldOfStudy && (
                          <div className="intern-info-card">
                            <div className="info-label">Field of Study</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.fieldOfStudy}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.institutionName && (
                          <div className="intern-info-card">
                            <div className="info-label">Institution</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.institutionName}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.countryOfInstitution && (
                          <div className="intern-info-card">
                            <div className="info-label">Country of Institution</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.countryOfInstitution}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.graduationYear && (
                          <div className="intern-info-card">
                            <div className="info-label">Graduation Year</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.graduationYear}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.academicPerformance && (
                          <div className="intern-info-card">
                            <div className="info-label">Academic Performance</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.academicPerformance}</div>
                          </div>
                        )}
                        {jobSeekerProfile.educationInfo.relevantCoursework && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Relevant Coursework</div>
                            <div className="info-value">{jobSeekerProfile.educationInfo.relevantCoursework}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Employment Information */}
                {jobSeekerProfile.employmentInfo && (
                  <FadeInUp delay={0.8}>
                    <div className="jobseeker-employment-section">
                      <h3>💼 Employment Information</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.employmentInfo.currentEmploymentStatus && (
                          <div className="intern-info-card">
                            <div className="info-label">Current Employment Status</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.currentEmploymentStatus}</div>
                          </div>
                        )}
                        {jobSeekerProfile.employmentInfo.yearsOfExperience && (
                          <div className="intern-info-card">
                            <div className="info-label">Years of Experience</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.yearsOfExperience}</div>
                          </div>
                        )}
                        {jobSeekerProfile.employmentInfo.mostRecentJobTitle && (
                          <div className="intern-info-card">
                            <div className="info-label">Most Recent Job Title</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.mostRecentJobTitle}</div>
                          </div>
                        )}
                        {jobSeekerProfile.employmentInfo.mostRecentCompany && (
                          <div className="intern-info-card">
                            <div className="info-label">Most Recent Company</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.mostRecentCompany}</div>
                          </div>
                        )}
                        {jobSeekerProfile.employmentInfo.employmentType && (
                          <div className="intern-info-card">
                            <div className="info-label">Employment Type</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.employmentType}</div>
                          </div>
                        )}
                        {jobSeekerProfile.employmentInfo.workExperienceSummary && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Work Experience Summary</div>
                            <div className="info-value">{jobSeekerProfile.employmentInfo.workExperienceSummary}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Skills & Expertise */}
                {jobSeekerProfile.skillsInfo && (
                  <FadeInUp delay={0.9}>
                    <div className="jobseeker-skills-section">
                      <h3>🧠 Skills & Expertise</h3>
                      {jobSeekerProfile.skillsInfo.technicalSkills && jobSeekerProfile.skillsInfo.technicalSkills.length > 0 && (
                        <div className="skills-subsection">
                          <h4>Technical Skills</h4>
                          <div className="skills-tags">
                            {jobSeekerProfile.skillsInfo.technicalSkills.map((skill, index) => (
                              <span key={index} className="skill-tag technical">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {jobSeekerProfile.skillsInfo.softSkills && jobSeekerProfile.skillsInfo.softSkills.length > 0 && (
                        <div className="skills-subsection">
                          <h4>Soft Skills</h4>
                          <div className="skills-tags">
                            {jobSeekerProfile.skillsInfo.softSkills.map((skill, index) => (
                              <span key={index} className="skill-tag soft">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {jobSeekerProfile.skillsInfo.languagesKnown && jobSeekerProfile.skillsInfo.languagesKnown.length > 0 && (
                        <div className="skills-subsection">
                          <h4>Languages Known</h4>
                          <div className="skills-tags">
                            {jobSeekerProfile.skillsInfo.languagesKnown.map((lang, index) => (
                              <span key={index} className="skill-tag language">{lang}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {jobSeekerProfile.skillsInfo.certifications && (
                        <div className="skills-subsection">
                          <h4>Certifications / Licenses</h4>
                          <div className="info-value">{jobSeekerProfile.skillsInfo.certifications}</div>
                        </div>
                      )}
                    </div>
                  </FadeInUp>
                )}

                {/* Job Preferences */}
                {jobSeekerProfile.jobPreferences && (
                  <FadeInUp delay={1.0}>
                    <div className="jobseeker-preferences-section">
                      <h3>🎯 Job Preferences</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.jobPreferences.jobTypes && jobSeekerProfile.jobPreferences.jobTypes.length > 0 && (
                          <div className="intern-info-card">
                            <div className="info-label">Job Types</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.jobTypes.join(', ')}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.preferredWorkMode && (
                          <div className="intern-info-card">
                            <div className="info-label">Preferred Work Mode</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.preferredWorkMode}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.preferredIndustries && jobSeekerProfile.jobPreferences.preferredIndustries.length > 0 && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Preferred Industries</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.preferredIndustries.join(', ')}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.preferredJobRoles && (
                          <div className="intern-info-card">
                            <div className="info-label">Preferred Job Roles</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.preferredJobRoles}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.preferredCountryOfWork && (
                          <div className="intern-info-card">
                            <div className="info-label">Preferred Country of Work</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.preferredCountryOfWork}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.expectedSalaryAmount && (
                          <div className="intern-info-card">
                            <div className="info-label">Expected Salary</div>
                            <div className="info-value">
                              {jobSeekerProfile.jobPreferences.expectedSalaryCurrency} {jobSeekerProfile.jobPreferences.expectedSalaryAmount}
                            </div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.availabilityToJoin && (
                          <div className="intern-info-card">
                            <div className="info-label">Availability to Join</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.availabilityToJoin}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.desiredWorkHours && (
                          <div className="intern-info-card">
                            <div className="info-label">Desired Work Hours</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.desiredWorkHours}</div>
                          </div>
                        )}
                        {jobSeekerProfile.jobPreferences.jobKeywords && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Job Keywords</div>
                            <div className="info-value">{jobSeekerProfile.jobPreferences.jobKeywords}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Career Goals */}
                {jobSeekerProfile.careerGoals && (
                  <FadeInUp delay={1.1}>
                    <div className="jobseeker-career-section">
                      <h3>🚀 Career Goals</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.careerGoals.shortTermGoal && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Short-Term Career Goal (1-2 years)</div>
                            <div className="info-value">{jobSeekerProfile.careerGoals.shortTermGoal}</div>
                          </div>
                        )}
                        {jobSeekerProfile.careerGoals.longTermGoal && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Long-Term Career Goal (3-5 years)</div>
                            <div className="info-value">{jobSeekerProfile.careerGoals.longTermGoal}</div>
                          </div>
                        )}
                        {jobSeekerProfile.careerGoals.preferredCompanyType && (
                          <div className="intern-info-card">
                            <div className="info-label">Preferred Company Type</div>
                            <div className="info-value">{jobSeekerProfile.careerGoals.preferredCompanyType}</div>
                          </div>
                        )}
                        {jobSeekerProfile.careerGoals.motivationForJobChange && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Motivation for Job Change</div>
                            <div className="info-value">{jobSeekerProfile.careerGoals.motivationForJobChange}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Additional Information */}
                {jobSeekerProfile.additionalInfo && (
                  <FadeInUp delay={1.2}>
                    <div className="jobseeker-additional-section">
                      <h3>📊 Additional Information</h3>
                      <div className="intern-info-grid">
                        {jobSeekerProfile.additionalInfo.validWorkPermit && (
                          <div className="intern-info-card">
                            <div className="info-label">Valid Work Permit</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.validWorkPermit}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.requireVisaSponsorship && (
                          <div className="intern-info-card">
                            <div className="info-label">Require Visa Sponsorship</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.requireVisaSponsorship}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.openToRelocation && (
                          <div className="intern-info-card">
                            <div className="info-label">Open to Relocation</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.openToRelocation}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.willingToTravel && (
                          <div className="intern-info-card">
                            <div className="info-label">Willing to Travel</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.willingToTravel}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.ownLaptopAndInternet && (
                          <div className="intern-info-card">
                            <div className="info-label">Own Laptop & Internet</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.ownLaptopAndInternet}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.howDidYouHear && (
                          <div className="intern-info-card">
                            <div className="info-label">How Did You Hear About Us</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.howDidYouHear}</div>
                          </div>
                        )}
                        {jobSeekerProfile.additionalInfo.physicalLimitations && (
                          <div className="intern-info-card full-width">
                            <div className="info-label">Physical Limitations</div>
                            <div className="info-value">{jobSeekerProfile.additionalInfo.physicalLimitations}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                )}
              </>
            )}

            {/* INTERN-SPECIFIC SECTIONS */}
            {(userData?.userType === 'intern' || localStorage.getItem('role') === 'intern') && internDetails && (
              <>
                {console.log('🎨 RENDERING INTERN SECTIONS NOW!')}
                {/* Section Separator */}
                <div className="intern-section-divider">
                  <h2>🎓 Intern Profile Details</h2>
                  <p>Complete information from the intern registration form</p>
                </div>

                {/* Personal Information from Form */}
                <FadeInUp delay={0.6}>
                  <div className="intern-personal-section">
                    <h3>👤 Personal Information</h3>
                    <div className="intern-info-grid">
                      {internDetails.fullName && (
                        <div className="intern-info-card">
                          <div className="info-label">Full Name</div>
                          <div className="info-value">{internDetails.fullName}</div>
                        </div>
                      )}
                      {internDetails.mobile && (
                        <div className="intern-info-card">
                          <div className="info-label">Mobile Number</div>
                          <div className="info-value">{internDetails.mobile}</div>
                        </div>
                      )}
                      {internDetails.dateOfBirth && (
                        <div className="intern-info-card">
                          <div className="info-label">Date of Birth</div>
                          <div className="info-value">{new Date(internDetails.dateOfBirth).toLocaleDateString()}</div>
                        </div>
                      )}
                      {internDetails.gender && (
                        <div className="intern-info-card">
                          <div className="info-label">Gender</div>
                          <div className="info-value">{internDetails.gender}</div>
                        </div>
                      )}
                      {internDetails.linkedInProfile && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">LinkedIn Profile</div>
                          <div className="info-value">
                            <a href={internDetails.linkedInProfile} target="_blank" rel="noopener noreferrer" className="profile-link">
                              {internDetails.linkedInProfile}
                            </a>
                          </div>
                        </div>
                      )}
                      {internDetails.githubProfile && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">GitHub Profile</div>
                          <div className="info-value">
                            <a href={internDetails.githubProfile} target="_blank" rel="noopener noreferrer" className="profile-link">
                              {internDetails.githubProfile}
                            </a>
                          </div>
                        </div>
                      )}
                      {internDetails.portfolioWebsite && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">Portfolio Website</div>
                          <div className="info-value">
                            <a href={internDetails.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="profile-link">
                              {internDetails.portfolioWebsite}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeInUp>

                {/* Location & Address */}
                <FadeInUp delay={0.65}>
                  <div className="intern-location-section">
                    <h3>📍 Location & Address</h3>
                    <div className="intern-info-grid">
                      {internDetails.currentLocation && (
                        <div className="intern-info-card">
                          <div className="info-label">Current Location</div>
                          <div className="info-value">{internDetails.currentLocation}</div>
                        </div>
                      )}
                      {internDetails.currentAddress && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">Full Address</div>
                          <div className="info-value">{internDetails.currentAddress}</div>
                        </div>
                      )}
                      {internDetails.addressPinCode && (
                        <div className="intern-info-card">
                          <div className="info-label">PIN/Postal Code</div>
                          <div className="info-value">{internDetails.addressPinCode}</div>
                        </div>
                      )}
                      {internDetails.willingToRelocate && (
                        <div className="intern-info-card">
                          <div className="info-label">Willing to Relocate?</div>
                          <div className="info-value">
                            <span className={`relocate-badge ${internDetails.willingToRelocate === 'Yes' ? 'yes' : 'no'}`}>
                              {internDetails.willingToRelocate === 'Yes' ? '✅ Yes' : '❌ No'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeInUp>

                {/* Educational Background */}
                <FadeInUp delay={0.7}>
                  <div className="intern-education-section">
                    <h3>🎓 Educational Background</h3>
                    <div className="intern-info-grid">
                      {internDetails.collegeName && (
                        <div className="intern-info-card">
                          <div className="info-label">College/University</div>
                          <div className="info-value">{internDetails.collegeName}</div>
                        </div>
                      )}
                      {internDetails.degree && (
                        <div className="intern-info-card">
                          <div className="info-label">Degree/Program</div>
                          <div className="info-value">{internDetails.degree}</div>
                        </div>
                      )}
                      {internDetails.currentYear && (
                        <div className="intern-info-card">
                          <div className="info-label">Current Year</div>
                          <div className="info-value">{internDetails.currentYear}</div>
                        </div>
                      )}
                      {internDetails.graduationYear && (
                        <div className="intern-info-card">
                          <div className="info-label">Graduation Year</div>
                          <div className="info-value">{internDetails.graduationYear}</div>
                        </div>
                      )}
                      {internDetails.cgpa && (
                        <div className="intern-info-card">
                          <div className="info-label">CGPA/Percentage</div>
                          <div className="info-value">{internDetails.cgpa}</div>
                        </div>
                      )}
                      {internDetails.majorSubjects && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">Major Subjects</div>
                          <div className="info-value">{internDetails.majorSubjects}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeInUp>

                {/* AI Matching Keywords */}
                {internDetails.keywords && internDetails.keywords.length > 0 && (
                  <FadeInUp delay={0.75}>
                    <div className="intern-keywords-section">
                      <h3>🔍 AI Matching Keywords</h3>
                      <p className="section-description">
                        These keywords help our AI find the most relevant internship opportunities
                      </p>
                      <div className="skills-tags">
                        {internDetails.keywords.map((keyword, index) => (
                          <span key={index} className="skill-tag keyword">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Internship Preferences */}
                <FadeInUp delay={0.8}>
                  <div className="intern-preferences-section">
                    <h3>💼 Internship Preferences</h3>
                    <div className="intern-info-grid">
                      {internDetails.internshipType && internDetails.internshipType.length > 0 && (
                        <div className="intern-info-card">
                          <div className="info-label">Preferred Type</div>
                          <div className="info-value">
                            {internDetails.internshipType.join(', ')}
                          </div>
                        </div>
                      )}
                      {internDetails.desiredRole && (
                        <div className="intern-info-card">
                          <div className="info-label">Desired Role</div>
                          <div className="info-value">{internDetails.desiredRole}</div>
                        </div>
                      )}
                      {internDetails.duration && (
                        <div className="intern-info-card">
                          <div className="info-label">Duration</div>
                          <div className="info-value">{internDetails.duration}</div>
                        </div>
                      )}
                      {internDetails.weeklyAvailability && (
                        <div className="intern-info-card">
                          <div className="info-label">Availability</div>
                          <div className="info-value">{internDetails.weeklyAvailability}</div>
                        </div>
                      )}
                      {internDetails.availabilityStartDate && (
                        <div className="intern-info-card">
                          <div className="info-label">Start Date</div>
                          <div className="info-value">{new Date(internDetails.availabilityStartDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      {(internDetails.stipendAmount || internDetails.stipendExpectation) && (
                        <div className="intern-info-card">
                          <div className="info-label">Stipend Expectation</div>
                          <div className="info-value">
                            {internDetails.stipendAmount ? 
                              `${internDetails.stipendAmount} ${internDetails.stipendCurrency || 'USD'}/month` : 
                              internDetails.stipendExpectation
                            }
                          </div>
                        </div>
                      )}
                      {internDetails.currentAddress && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">Full Address</div>
                          <div className="info-value">{internDetails.currentAddress}</div>
                        </div>
                      )}
                      {internDetails.addressPinCode && (
                        <div className="intern-info-card">
                          <div className="info-label">PIN/Postal Code</div>
                          <div className="info-value">{internDetails.addressPinCode}</div>
                        </div>
                      )}
                      {internDetails.workDomains && internDetails.workDomains.length > 0 && (
                        <div className="intern-info-card full-width">
                          <div className="info-label">Work Domains</div>
                          <div className="skills-tags">
                            {internDetails.workDomains.map((domain, index) => (
                              <span key={index} className="skill-tag domain">{domain}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeInUp>

                {/* Technical Skills */}
                {internDetails.technicalSkills && internDetails.technicalSkills.length > 0 && (
                  <FadeInUp delay={0.9}>
                    <div className="intern-skills-section">
                      <h3>🛠️ Technical Skills</h3>
                      <div className="skills-tags">
                        {internDetails.technicalSkills.map((skill, index) => (
                          <span key={index} className="skill-tag technical">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Soft Skills */}
                {internDetails.softSkills && internDetails.softSkills.length > 0 && (
                  <FadeInUp delay={1.0}>
                    <div className="intern-skills-section">
                      <h3>💡 Soft Skills</h3>
                      <div className="skills-tags">
                        {internDetails.softSkills.map((skill, index) => (
                          <span key={index} className="skill-tag soft">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Prior Experience */}
                {internDetails.priorExperience && (
                  <FadeInUp delay={1.1}>
                    <div className="intern-experience-section">
                      <h3>📝 Prior Internship & Project Experience</h3>
                      <p className="experience-description">{internDetails.priorExperience}</p>
                    </div>
                  </FadeInUp>
                )}

                {/* Career Goals */}
                <FadeInUp delay={1.2}>
                  <div className="intern-goals-section">
                    <h3>🚀 Career Goals & Aspirations</h3>
                    {internDetails.postGradRoles && (
                      <div className="goal-card">
                        <div className="goal-title">Post-Graduation Career Interests</div>
                        <p className="goal-text">{internDetails.postGradRoles}</p>
                      </div>
                    )}
                    {internDetails.learningGoals && (
                      <div className="goal-card">
                        <div className="goal-title">Top 3 Learning Goals</div>
                        <p className="goal-text">{internDetails.learningGoals}</p>
                      </div>
                    )}
                    {internDetails.careerVision && (
                      <div className="goal-card">
                        <div className="goal-title">Professional Vision (2-3 Years)</div>
                        <p className="goal-text">{internDetails.careerVision}</p>
                      </div>
                    )}
                  </div>
                </FadeInUp>

                {/* Resume Section - Always show for interns */}
                <FadeInUp delay={1.3}>
                  <div className="intern-resume-section">
                    <h3>📄 Resume</h3>
                    {internDetails.resumePath ? (
                      <div className="resume-container">
                        <div className="resume-info">
                          <div className="resume-icon">📑</div>
                          <div className="resume-details">
                            <p className="resume-filename">
                              {internDetails.resumePath.split(/[/\\]/).pop()}
                            </p>
                            <p className="resume-status">✅ Resume uploaded and verified</p>
                          </div>
                        </div>
                        <div className="resume-actions">
                          <a 
                            href={buildApiUrl(`/${internDetails.resumePath.replace(/\\/g, '/')}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-download-button"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                            Download Resume
                          </a>
                          <a 
                            href={buildApiUrl(`/${internDetails.resumePath.replace(/\\/g, '/')}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-view-button"
                          >
                            👁️ View Resume
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="no-resume-message">
                        <p>No resume uploaded yet</p>
                      </div>
                    )}
                  </div>
                </FadeInUp>
              </>
            )}

            {/* Resume Data - Achievements - ONLY for Job Seekers */}
            {userData?.userType === 'jobSeeker' && resumeData?.achievements && resumeData.achievements.length > 0 && (
              <FadeInUp delay={1.2}>
                <div className="resume-achievements-section">
                  <h3>Achievements</h3>
                  <div className="achievements-list">
                    {resumeData.achievements.map((achievement, index) => (
                      <div key={index} className="achievement-item">{achievement}</div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Resume Download - ONLY for Job Seekers */}
            {userData?.userType !== 'recruiter' && resumeData && (
              <FadeInUp delay={1.3}>
                <div className="resume-download-section">
                  <button 
                    onClick={handleResumeDownload} 
                    className="resume-download-btn"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    Download Resume
                  </button>
                </div>
              </FadeInUp>
            )}
          </div>
        </SlideIn>

        {/* Contact Form */}
        {!isOwnProfile && (
          <SlideIn direction="right" delay={0.4}>
            <div className="contact-form-card">
              <div className="form-header">
                <h2>Send a Message</h2>
                <p>Get in touch with {fullName} directly</p>
              </div>

              {submitStatus === 'success' && (
                <FadeInUp>
                  <div className="success-message">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <p>Message sent successfully! You'll hear back soon.</p>
                  </div>
                </FadeInUp>
              )}

              {submitStatus === 'error' && (
                <FadeInUp>
                  <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <p>Failed to send message. Please try again.</p>
                  </div>
                </FadeInUp>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <StaggerChildren staggerDelay={0.1}>
                  <div className="form-group">
                    <label htmlFor="name">
                      <FontAwesomeIcon icon={faUser} />
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FontAwesomeIcon icon={faEnvelope} />
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      <FontAwesomeIcon icon={faTag} />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <FontAwesomeIcon icon={faMessage} />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner small"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </StaggerChildren>
              </form>
            </div>
          </SlideIn>
        )}

        {/* Own Profile Message */}
        {isOwnProfile && (
          <SlideIn direction="right" delay={0.4}>
            <div className="own-profile-card">
              <FadeInUp>
                <div className="own-profile-content">
                  <div className="profile-preview-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <h2>This is your contact page</h2>
                  <p>This is how other users will see your contact information and be able to reach out to you.</p>
                  
                  {!isProfileComplete && (
                    <div className="profile-incomplete-notice">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      <p>Complete your profile to make a better impression on potential employers and collaborators.</p>
                    </div>
                  )}

                  <div className="action-buttons">
                    <motion.button
                      onClick={() => navigate(userData?.userType === 'recruiter' ? '/recruiter-complete-profile' : '/complete-profile')}
                      className="edit-profile-btn"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Profile
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate(userData?.userType === 'recruiter' ? '/recruiter-dashboard' : '/jobseeker-dashboard')}
                      className="dashboard-btn"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Go to Dashboard
                    </motion.button>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </SlideIn>
        )}
      </div>
    </div>
  );
};

export default ContactMe;
