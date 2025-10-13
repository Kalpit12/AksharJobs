import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faVenusMars, 
  faSave,
  faSpinner,
  faCheck,
  faArrowLeft,
  faBuilding,
  faUsers,
  faGlobe,
  faIndustry,
  faInfoCircle,
  faEnvelope,
  faBriefcase,
  faArrowRight,
  faRocket,
  faShieldAlt,
  faCheckCircle,
  faExclamationTriangle,
  faFileAlt,
  faTimes,
  faPlus,
  faTrash,
  faGraduationCap,
  faBullseye,
  faDollarSign,
  faClock,
  faLanguage,
  faChartLine,
  faHandshake,
  faComments,
  faCalendar,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/RecruiterRegistrationForm.css';

const RecruiterCompleteProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Smart navigation function to go to appropriate dashboard
  const navigateToDashboard = () => {
    const role = localStorage.getItem('role');
    const normalizedRole = role?.toLowerCase().replace(/[_-]/g, '');
    
    if (normalizedRole?.includes('recruiter')) {
      navigate('/recruiter-dashboard');
    } else if (normalizedRole?.includes('intern')) {
      navigate('/intern-dashboard');
    } else if (normalizedRole?.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/jobseeker-dashboard');
    }
  };

  const [formData, setFormData] = useState({
    // Account Information
    fullName: '',
    email: '',
    phoneNumber: '',
    linkedinProfile: '',
    website: '',
    
    // Company Details
    companyName: '',
    companySize: '',
    industry: '',
    companyWebsite: '',
    foundedYear: '',
    companyDescription: '',
    companyLocation: '',
    
    // Recruiting Needs
    primaryRole: '',
    recruitingExperience: '',
    teamSize: '',
    hiringFrequency: '',
    averageSalaryRange: '',
    
    // Job Locations & Candidate Preferences
    primaryWorkLocation: '',
    remoteWorkPolicy: '',
    candidateExperienceLevel: '',
    preferredSkills: '',
    languagesRequired: '',
    
    // Communication & Recruiting Goals
    preferredCommunicationMethod: '',
    recruitingGoals: '',
    timelineToHire: '',
    budgetForHiring: '',
    successMetrics: '',
    
    // Additional Information
    additionalNotes: '',
    howDidYouHear: '',
    agreeToTerms: false
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (!isInitialized) {
        await fetchUserData();
        setIsInitialized(true);
      }
    };
    initializeForm();
  }, [isInitialized]);

  const fetchUserData = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile')
      );

      if (response && response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || '',
          phoneNumber: data.phone || '',
          linkedinProfile: data.linkedinProfile || '',
          website: data.website || '',
          companyName: data.companyName || '',
          companySize: data.companySize || '',
          industry: data.industry || '',
          companyWebsite: data.companyWebsite || '',
          foundedYear: data.foundedYear || '',
          companyDescription: data.companyDescription || '',
          companyLocation: typeof data.location === 'string' ? data.location : (data.location?.city || '')
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateSection = (sectionNumber) => {
    switch (sectionNumber) {
      case 1: // Account Information
        return formData.fullName && formData.email && formData.phoneNumber;
      case 2: // Company Details
        return formData.companyName && formData.industry && formData.companySize;
      case 3: // Recruiting Needs
        return formData.primaryRole && formData.recruitingExperience && formData.hiringFrequency;
      case 4: // Job Locations & Candidate Preferences
        return formData.primaryWorkLocation && formData.candidateExperienceLevel;
      case 5: // Communication & Recruiting Goals
        return formData.preferredCommunicationMethod && formData.recruitingGoals && formData.timelineToHire;
      case 6: // Additional Information
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        linkedinProfile: formData.linkedinProfile,
        website: formData.website,
        companyName: formData.companyName,
        companySize: formData.companySize,
        industry: formData.industry,
        companyWebsite: formData.companyWebsite,
        foundedYear: formData.foundedYear,
        companyDescription: formData.companyDescription,
        companyLocation: formData.companyLocation,
        primaryRole: formData.primaryRole,
        recruitingExperience: formData.recruitingExperience,
        teamSize: formData.teamSize,
        hiringFrequency: formData.hiringFrequency,
        averageSalaryRange: formData.averageSalaryRange,
        primaryWorkLocation: formData.primaryWorkLocation,
        remoteWorkPolicy: formData.remoteWorkPolicy,
        candidateExperienceLevel: formData.candidateExperienceLevel,
        preferredSkills: formData.preferredSkills,
        languagesRequired: formData.languagesRequired,
        preferredCommunicationMethod: formData.preferredCommunicationMethod,
        recruitingGoals: formData.recruitingGoals,
        timelineToHire: formData.timelineToHire,
        budgetForHiring: formData.budgetForHiring,
        successMetrics: formData.successMetrics,
        additionalNotes: formData.additionalNotes,
        howDidYouHear: formData.howDidYouHear
      };

      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/profile'),
        'PUT',
        updateData
      );

      if (response && response.ok) {
        navigate('/recruiter-dashboard', { 
          state: { 
            message: 'Profile completed successfully! Welcome to AksharJobs!' 
          } 
        });
      } else {
        setSubmitError('Failed to complete profile. Please try again.');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      setSubmitError('An error occurred while completing your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="progress-section">
        <div className="progress-bar">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`progress-step ${currentSection >= step ? 'active' : ''} ${
                validateSection(step) ? 'completed' : ''
              }`}
            >
              <div className="step-number">
                {validateSection(step) ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  step
                )}
              </div>
              <div className="step-label">
                {step === 1 && 'Account'}
                {step === 2 && 'Company'}
                {step === 3 && 'Recruiting'}
                {step === 4 && 'Locations'}
                {step === 5 && 'Communication'}
                {step === 6 && 'Additional'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSection1 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faUser} />
          Account Information
        </h2>
        <p>Tell us about yourself and how we can reach you</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faUser} />
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faEnvelope} />
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@company.com"
            required
            disabled
          />
          <div className="input-hint">
            This email is associated with your account and cannot be changed
          </div>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faPhone} />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faLinkedin} />
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faGlobe} />
            Personal Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faBuilding} />
          Company Details
        </h2>
        <p>Share information about your company to attract the best talent</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faBuilding} />
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Your Company Name"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faIndustry} />
            Industry *
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Consulting">Consulting</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUsers} />
            Company Size *
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faGlobe} />
            Company Website
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleInputChange}
            placeholder="https://company.com"
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faCalendar} />
            Founded Year
          </label>
          <input
            type="number"
            name="foundedYear"
            value={formData.foundedYear}
            onChange={handleInputChange}
            placeholder="2020"
            min="1900"
            max="2024"
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Company Location
          </label>
          <input
            type="text"
            name="companyLocation"
            value={formData.companyLocation}
            onChange={handleInputChange}
            placeholder="City, State, Country"
          />
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faInfoCircle} />
            Company Description
          </label>
          <textarea
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleInputChange}
            placeholder="Briefly describe your company, its mission, and what makes it unique..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faBriefcase} />
          Recruiting Needs
        </h2>
        <p>Help us understand your recruiting requirements and experience</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUser} />
            Your Primary Role *
          </label>
          <select
            name="primaryRole"
            value={formData.primaryRole}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Talent Acquisition">Talent Acquisition</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="CEO/Founder">CEO/Founder</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faChartLine} />
            Recruiting Experience *
          </label>
          <select
            name="recruitingExperience"
            value={formData.recruitingExperience}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Experience</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUsers} />
            Team Size You Manage
          </label>
          <select
            name="teamSize"
            value={formData.teamSize}
            onChange={handleInputChange}
          >
            <option value="">Select Team Size</option>
            <option value="Just me">Just me</option>
            <option value="2-5 people">2-5 people</option>
            <option value="6-15 people">6-15 people</option>
            <option value="16-50 people">16-50 people</option>
            <option value="50+ people">50+ people</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faCalendar} />
            Hiring Frequency *
          </label>
          <select
            name="hiringFrequency"
            value={formData.hiringFrequency}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Frequency</option>
            <option value="Constantly (monthly)">Constantly (monthly)</option>
            <option value="Frequently (quarterly)">Frequently (quarterly)</option>
            <option value="Regularly (bi-annually)">Regularly (bi-annually)</option>
            <option value="Occasionally (annually)">Occasionally (annually)</option>
            <option value="Rarely (as needed)">Rarely (as needed)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faDollarSign} />
            Average Salary Range
          </label>
          <select
            name="averageSalaryRange"
            value={formData.averageSalaryRange}
            onChange={handleInputChange}
          >
            <option value="">Select Range</option>
            <option value="Under $50k">Under $50k</option>
            <option value="$50k - $75k">$50k - $75k</option>
            <option value="$75k - $100k">$75k - $100k</option>
            <option value="$100k - $150k">$100k - $150k</option>
            <option value="$150k - $200k">$150k - $200k</option>
            <option value="Over $200k">Over $200k</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          Job Locations & Candidate Preferences
        </h2>
        <p>Define where you hire and what you're looking for in candidates</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Primary Work Location *
          </label>
          <input
            type="text"
            name="primaryWorkLocation"
            value={formData.primaryWorkLocation}
            onChange={handleInputChange}
            placeholder="City, State, Country"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faGlobe} />
            Remote Work Policy
          </label>
          <select
            name="remoteWorkPolicy"
            value={formData.remoteWorkPolicy}
            onChange={handleInputChange}
          >
            <option value="">Select Policy</option>
            <option value="Fully Remote">Fully Remote</option>
            <option value="Hybrid (2-3 days remote)">Hybrid (2-3 days remote)</option>
            <option value="Hybrid (1-2 days remote)">Hybrid (1-2 days remote)</option>
            <option value="On-site Only">On-site Only</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faGraduationCap} />
            Preferred Experience Level *
          </label>
          <select
            name="candidateExperienceLevel"
            value={formData.candidateExperienceLevel}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Level</option>
            <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
            <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
            <option value="Senior Level (6-10 years)">Senior Level (6-10 years)</option>
            <option value="Lead/Principal (10+ years)">Lead/Principal (10+ years)</option>
            <option value="Executive Level">Executive Level</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faBullseye} />
            Preferred Skills/Technologies
          </label>
          <textarea
            name="preferredSkills"
            value={formData.preferredSkills}
            onChange={handleInputChange}
            placeholder="List key skills, technologies, or certifications you look for..."
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faLanguage} />
            Languages Required
          </label>
          <input
            type="text"
            name="languagesRequired"
            value={formData.languagesRequired}
            onChange={handleInputChange}
            placeholder="English, Spanish, French, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faComments} />
          Communication & Recruiting Goals
        </h2>
        <p>How you prefer to communicate and what success looks like for you</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faComments} />
            Preferred Communication *
          </label>
          <select
            name="preferredCommunicationMethod"
            value={formData.preferredCommunicationMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Method</option>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Video Call">Video Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="LinkedIn Message">LinkedIn Message</option>
            <option value="SMS">SMS</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faBullseye} />
            Timeline to Hire *
          </label>
          <select
            name="timelineToHire"
            value={formData.timelineToHire}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Timeline</option>
            <option value="Immediately">Immediately</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6+ months">6+ months</option>
            <option value="Just exploring">Just exploring</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faDollarSign} />
            Budget for Hiring
          </label>
          <select
            name="budgetForHiring"
            value={formData.budgetForHiring}
            onChange={handleInputChange}
          >
            <option value="">Select Budget</option>
            <option value="Under $5k">Under $5k</option>
            <option value="$5k - $10k">$5k - $10k</option>
            <option value="$10k - $25k">$10k - $25k</option>
            <option value="$25k - $50k">$25k - $50k</option>
            <option value="$50k+">$50k+</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faRocket} />
            Recruiting Goals *
          </label>
          <textarea
            name="recruitingGoals"
            value={formData.recruitingGoals}
            onChange={handleInputChange}
            placeholder="What are your main recruiting goals? What would make this partnership successful?"
            rows={3}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faChartLine} />
            Success Metrics
          </label>
          <textarea
            name="successMetrics"
            value={formData.successMetrics}
            onChange={handleInputChange}
            placeholder="How do you measure recruiting success? (e.g., time to hire, quality of candidates, retention rate)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>
          <FontAwesomeIcon icon={faInfoCircle} />
          Additional Information
        </h2>
        <p>Any additional details and confirm your agreement to our terms</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faHandshake} />
            How did you hear about us?
          </label>
          <select
            name="howDidYouHear"
            value={formData.howDidYouHear}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="Google Search">Google Search</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Industry Event">Industry Event</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>
            <FontAwesomeIcon icon={faFileAlt} />
            Additional Notes
          </label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any additional information you'd like to share with our team..."
            rows={4}
          />
        </div>

        <div className="form-group full-width">
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="agreeToTerms">
              <FontAwesomeIcon icon={faShieldAlt} />
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a> *
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
      case 5:
        return renderSection5();
      case 6:
        return renderSection6();
      default:
        return renderSection1();
    }
  };

  if (!isInitialized) {
    return (
      <div className="recruiter-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-wrapper">
      {/* Header */}
      <div className="recruiter-header">
        <div className="header-container">
          <div className="logo-section" onClick={navigateToDashboard} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="logo-text">
              <h3 className="logo-title">AksharJobs</h3>
              <p className="logo-subtitle">Complete Your Recruiter Profile</p>
            </div>
          </div>
          
          <button 
            onClick={navigateToDashboard} 
            className="back-to-dashboard-btn"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            BACK TO DASHBOARD
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="recruiter-main">
        <div className="recruiter-container">
          <div className="recruiter-form-card">
            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Complete Your Recruiter Profile</h1>
              <p className="form-subtitle">Help us understand your recruiting needs and preferences</p>
              
              {/* Progress Bar */}
              {renderProgressBar()}
            </div>

            {/* Form Content */}
            <div className="form-content">
              <form onSubmit={handleSubmit} className="recruiter-form">
                {renderCurrentSection()}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentSection > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn btn-secondary"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Previous
                  </button>
                )}

                {currentSection < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    disabled={!validateSection(currentSection)}
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !validateSection(6)}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Completing Profile...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                        Complete Profile
                      </>
                    )}
                  </button>
                )}
              </div>

                {/* Error Message */}
                {submitError && (
                  <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCompleteProfile;