import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGraduationCap, 
  faBriefcase, 
  faFileUpload,
  faSave,
  faRocket,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import '../styles/UserProfileSetup.css';

const UserProfileSetup = () => {
  const navigate = useNavigate();

  // Initialize form data with proper defaults
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    phoneCountry: '+254',
    dateOfBirth: '',
    gender: '',
    location: {
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    education: [{
      degree: '',
      field: '',
      institution: '',
      graduationYear: '',
      gpa: '',
      achievements: ''
    }],
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    skills: [],
    skillInput: '',
    resumeFile: null,
    resumeFileName: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userFirstName = localStorage.getItem('userFirstName');
    const userLastName = localStorage.getItem('userLastName');

    if (userEmail || userFirstName || userLastName) {
      setFormData(prev => ({
        ...prev,
        email: userEmail || '',
        fullName: userFirstName && userLastName ? `${userFirstName} ${userLastName}` : ''
      }));
    }
  }, []);

  // Country codes array
  const countryCodes = [
    { code: '+254', country: 'Kenya' },
    { code: '+1', country: 'United States/Canada' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+7', country: 'Russia' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+45', country: 'Denmark' },
    { code: '+358', country: 'Finland' },
    { code: '+48', country: 'Poland' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+36', country: 'Hungary' },
    { code: '+40', country: 'Romania' },
    { code: '+421', country: 'Slovakia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+385', country: 'Croatia' },
    { code: '+387', country: 'Bosnia' },
    { code: '+382', country: 'Montenegro' },
    { code: '+389', country: 'Macedonia' },
    { code: '+381', country: 'Serbia' },
    { code: '+43', country: 'Austria' },
    { code: '+41', country: 'Switzerland' },
    { code: '+32', country: 'Belgium' },
    { code: '+351', country: 'Portugal' },
    { code: '+30', country: 'Greece' },
    { code: '+90', country: 'Turkey' },
    { code: '+380', country: 'Ukraine' },
    { code: '+375', country: 'Belarus' },
    { code: '+371', country: 'Latvia' },
    { code: '+372', country: 'Estonia' },
    { code: '+370', country: 'Lithuania' },
    { code: '+353', country: 'Ireland' },
    { code: '+354', country: 'Iceland' },
    { code: '+27', country: 'South Africa' },
    { code: '+234', country: 'Nigeria' },
    { code: '+256', country: 'Uganda' },
    { code: '+255', country: 'Tanzania' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+212', country: 'Morocco/Western Sahara' },
    { code: '+20', country: 'Egypt' },
    { code: '+213', country: 'Algeria' },
    { code: '+216', country: 'Tunisia' },
    { code: '+218', country: 'Libya' },
    { code: '+249', country: 'Sudan' },
    { code: '+211', country: 'South Sudan' },
    { code: '+235', country: 'Chad' },
    { code: '+227', country: 'Niger' },
    { code: '+223', country: 'Mali' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+221', country: 'Senegal' },
    { code: '+224', country: 'Guinea' },
    { code: '+232', country: 'Sierra Leone' },
    { code: '+231', country: 'Liberia' },
    { code: '+225', country: 'Ivory Coast' },
    { code: '+228', country: 'Togo' },
    { code: '+229', country: 'Benin' },
    { code: '+237', country: 'Cameroon' },
    { code: '+236', country: 'Central African Republic' },
    { code: '+243', country: 'Democratic Republic of Congo' },
    { code: '+242', country: 'Republic of Congo' },
    { code: '+241', country: 'Gabon' },
    { code: '+240', country: 'Equatorial Guinea' },
    { code: '+239', country: 'Sao Tome and Principe' },
    { code: '+244', country: 'Angola' },
    { code: '+260', country: 'Zambia' },
    { code: '+263', country: 'Zimbabwe' },
    { code: '+267', country: 'Botswana' },
    { code: '+264', country: 'Namibia' },
    { code: '+266', country: 'Lesotho' },
    { code: '+268', country: 'Eswatini' },
    { code: '+258', country: 'Mozambique' },
    { code: '+261', country: 'Madagascar' },
    { code: '+230', country: 'Mauritius' },
    { code: '+248', country: 'Seychelles' },
    { code: '+269', country: 'Comoros' },
    { code: '+262', country: 'Mayotte/Reunion' },
    { code: '+238', country: 'Cape Verde' },
    { code: '+245', country: 'Guinea-Bissau' },
    { code: '+220', country: 'The Gambia' },
    { code: '+222', country: 'Mauritania' },
    { code: '+253', country: 'Djibouti' },
    { code: '+291', country: 'Eritrea' },
    { code: '+252', country: 'Somalia' },
    { code: '+257', country: 'Burundi' },
    { code: '+250', country: 'Rwanda' },
    { code: '+265', country: 'Malawi' }
  ];

  const countries = [
    'Kenya', 'United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Germany',
    'France', 'Japan', 'China', 'Russia', 'Brazil', 'Mexico', 'Italy', 'Spain',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Slovakia', 'Slovenia', 'Croatia', 'Bosnia', 'Montenegro',
    'Macedonia', 'Serbia', 'Austria', 'Switzerland', 'Belgium', 'Portugal', 'Greece',
    'Turkey', 'Ukraine', 'Belarus', 'Latvia', 'Estonia', 'Lithuania', 'Ireland', 'Iceland',
    'South Africa', 'Nigeria', 'Uganda', 'Tanzania', 'Ethiopia', 'Morocco', 'Egypt',
    'Algeria', 'Tunisia', 'Libya', 'Sudan', 'South Sudan', 'Chad', 'Niger', 'Mali',
    'Burkina Faso', 'Senegal', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast',
    'Togo', 'Benin', 'Cameroon', 'Central African Republic', 'Democratic Republic of Congo',
    'Republic of Congo', 'Gabon', 'Equatorial Guinea', 'Sao Tome and Principe', 'Angola',
    'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Mozambique',
    'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Mayotte', 'Reunion',
    'Cape Verde', 'Guinea-Bissau', 'The Gambia', 'Mauritania', 'Western Sahara',
    'Djibouti', 'Eritrea', 'Somalia', 'Burundi', 'Rwanda', 'Malawi'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const degrees = [
    'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
    'Doctorate (PhD)', 'Professional Degree (MD, JD, etc.)', 'Certificate', 'Diploma',
    'Other'
  ];

  const fields = [
    'Computer Science', 'Engineering', 'Business Administration', 'Marketing', 'Finance',
    'Accounting', 'Economics', 'Psychology', 'Sociology', 'Biology', 'Chemistry', 'Physics',
    'Mathematics', 'Statistics', 'Data Science', 'Artificial Intelligence', 'Machine Learning',
    'Software Engineering', 'Information Technology', 'Cybersecurity', 'Digital Marketing',
    'Graphic Design', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Project Management',
    'Human Resources', 'Operations Management', 'Supply Chain Management', 'International Business',
    'Healthcare Administration', 'Nursing', 'Medicine', 'Law', 'Education', 'Communications',
    'Journalism', 'Media Studies', 'Film Studies', 'Art History', 'Music', 'Drama', 'Dance',
    'Architecture', 'Urban Planning', 'Environmental Science', 'Political Science', 'History',
    'Philosophy', 'Religious Studies', 'Anthropology', 'Geography', 'Geology', 'Astronomy',
    'Other'
  ];

  // Helper functions
  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        field: '',
        institution: '',
        graduationYear: '',
        gpa: '',
        achievements: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (formData.skillInput && formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: ''
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phoneCountry + formData.phone);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('education', JSON.stringify(formData.education));
      submitData.append('experience', JSON.stringify(formData.experience));
      submitData.append('skills', JSON.stringify(formData.skills));
      
      if (formData.resumeFile) {
        submitData.append('resume', formData.resumeFile);
      }

      const token = localStorage.getItem('token');
      
      console.log('Token being sent:', token);
      console.log('Form data being sent:', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneCountry + formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        location: formData.location,
        education: formData.education,
        experience: formData.experience,
        skills: formData.skills
      });
      
      const response = await fetch('http://localhost:3002/api/users/profile-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        console.log('Error response type:', typeof errorData);
        console.log('Error response keys:', Object.keys(errorData));
        throw new Error(errorData.error || 'Failed to save profile');
      } else {
        const successData = await response.json();
        console.log('Success response:', successData);
      }

      if (response.ok) {
        localStorage.setItem('profileCompleted', 'true');
        localStorage.setItem('userFullName', formData.fullName);
        localStorage.setItem('userPhone', formData.phoneCountry + formData.phone);

        const userRole = localStorage.getItem('role');
        if (userRole === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/jobseeker-dashboard');
        }
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user data exists
  if (!formData.email) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div className="user-profile-setup">
      <div className="setup-container">
        <div className="setup-header">
          <div className="logo">
            <FontAwesomeIcon icon={faRocket} />
            <span>AksharJobs</span>
          </div>
          <h1>Complete Your Profile</h1>
          <p>Let's get to know you better to provide personalized job recommendations</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faUser} /> Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="Enter your email"
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneCountry">Phone Country</label>
                <select
                  id="phoneCountry"
                  name="phoneCountry"
                  value={formData.phoneCountry}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneCountry: e.target.value }))}
                >
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  placeholder="Enter city"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <select
                  id="state"
                  name="state"
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value }
                  }))}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, country: e.target.value }
                  }))}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.location.zipCode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, zipCode: e.target.value }
                  }))}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`degree-${index}`}>Degree *</label>
                    <select
                      id={`degree-${index}`}
                      name={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      required
                    >
                      <option value="">Select Degree</option>
                      {degrees.map(degree => (
                        <option key={degree} value={degree}>{degree}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`field-${index}`}>Field of Study *</label>
                    <select
                      id={`field-${index}`}
                      name={`field-${index}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                      required
                    >
                      <option value="">Select Field</option>
                      {fields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`institution-${index}`}>Institution *</label>
                    <input
                      type="text"
                      id={`institution-${index}`}
                      name={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      required
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`graduationYear-${index}`}>Graduation Year *</label>
                    <input
                      type="text"
                      id={`graduationYear-${index}`}
                      name={`graduationYear-${index}`}
                      value={edu.graduationYear}
                      onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                      required
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`gpa-${index}`}>GPA (if applicable)</label>
                    <input
                      type="text"
                      id={`gpa-${index}`}
                      name={`gpa-${index}`}
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                      placeholder="e.g., 3.8"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`achievements-${index}`}>Achievements/Honors</label>
                    <textarea
                      id={`achievements-${index}`}
                      name={`achievements-${index}`}
                      value={edu.achievements}
                      onChange={(e) => handleEducationChange(index, 'achievements', e.target.value)}
                      placeholder="List any relevant achievements or honors"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => removeEducation(index)} className="remove-btn">
                    <FontAwesomeIcon icon={faTrash} /> Remove Education
                  </button>
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button type="button" onClick={addEducation} className="add-btn">
                <FontAwesomeIcon icon={faPlus} /> Add Another Education
              </button>
            </div>
          </div>

          {/* Experience */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faBriefcase} /> Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`title-${index}`}>Job Title *</label>
                    <input
                      type="text"
                      id={`title-${index}`}
                      name={`title-${index}`}
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      required
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`company-${index}`}>Company *</label>
                    <input
                      type="text"
                      id={`company-${index}`}
                      name={`company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      required
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`location-${index}`}>Location</label>
                    <input
                      type="text"
                      id={`location-${index}`}
                      name={`location-${index}`}
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`startDate-${index}`}>Start Date *</label>
                    <input
                      type="date"
                      id={`startDate-${index}`}
                      name={`startDate-${index}`}
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`endDate-${index}`}>End Date (if applicable)</label>
                    <input
                      type="date"
                      id={`endDate-${index}`}
                      name={`endDate-${index}`}
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`current-${index}`}>Currently working here</label>
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      name={`current-${index}`}
                      checked={exp.current}
                      onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor={`description-${index}`}>Job Description/Responsibilities</label>
                  <textarea
                    id={`description-${index}`}
                    name={`description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => removeExperience(index)} className="remove-btn">
                    <FontAwesomeIcon icon={faTrash} /> Remove Experience
                  </button>
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button type="button" onClick={addExperience} className="add-btn">
                <FontAwesomeIcon icon={faPlus} /> Add Another Experience
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faPlus} /> Skills</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="skillInput">Add New Skill</label>
                <input
                  type="text"
                  id="skillInput"
                  name="skillInput"
                  value={formData.skillInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                  placeholder="e.g., React, JavaScript, Python"
                />
              </div>
              <div className="form-group">
                <button type="button" onClick={addSkill} className="add-btn">
                  <FontAwesomeIcon icon={faPlus} /> Add Skill
                </button>
              </div>
            </div>
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="remove-skill-btn">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-section">
            <h2><FontAwesomeIcon icon={faFileUpload} /> Upload Resume</h2>
            <div className="form-group">
              <label htmlFor="resumeFile">Upload your resume (PDF only)</label>
              <input
                type="file"
                id="resumeFile"
                name="resumeFile"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {formData.resumeFileName && (
                <p>Selected file: {formData.resumeFileName}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              <FontAwesomeIcon icon={faSave} />
              {isLoading ? 'Saving...' : 'Complete Profile & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSetup;
