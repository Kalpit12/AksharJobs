import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faGraduationCap, 
  faCode, 
  faHeart, 
  faBullseye,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faComments
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/NewInternDetailsForm.css';

const NewInternDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Get user data from location state
  const userData = location.state?.userData || {};
  const existingData = location.state?.existingData;

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: userData.fullName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    linkedinProfile: '',
    githubProfile: '',
    portfolio: '',
    
    // Education
    currentEducation: '',
    university: '',
    course: '',
    graduationYear: '',
    cgpa: '',
    academicAchievements: '',
    
    // Skills & Interests
    technicalSkills: '',
    softSkills: '',
    programmingLanguages: '',
    frameworks: '',
    tools: '',
    interests: '',
    
    // Internship Preferences
    preferredLocation: '',
    workMode: '',
    internshipDuration: '',
    startDate: '',
    preferredIndustries: '',
    workDomains: '',
    desiredRole: '',
    
    // Goals & Aspirations
    careerGoals: '',
    learningObjectives: '',
    whyInternship: '',
    previousExperience: '',
    
    // Remarks (New Field)
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Personal', icon: faUser },
    { id: 2, title: 'Education', icon: faGraduationCap },
    { id: 3, title: 'Skills', icon: faCode },
    { id: 4, title: 'Preferences', icon: faHeart },
    { id: 5, title: 'Goals', icon: faBullseye }
  ];

  // Comprehensive worldwide options
  const countries = [
    'India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Singapore',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'New Zealand', 'South Korea',
    'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Venezuela', 'Ecuador', 'Bolivia',
    'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana', 'Tunisia', 'Algeria', 'Ethiopia', 'Uganda',
    'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Turkey', 'Russia', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria',
    'Italy', 'Spain', 'Portugal', 'Greece', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania',
    'Finland', 'Iceland', 'Malta', 'Cyprus', 'Luxembourg', 'Monaco', 'Liechtenstein', 'Andorra', 'San Marino', 'Vatican City'
  ];

  const workModes = [
    'Remote', 'On-site', 'Hybrid', 'Flexible', 'Part-time', 'Full-time', 'Contract', 'Freelance'
  ];

  const internshipDurations = [
    '1 month', '2 months', '3 months', '6 months', '1 year', 'Flexible', 'Project-based'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing', 'Consulting', 'Media & Entertainment',
    'Real Estate', 'Automotive', 'Aerospace', 'Energy', 'Telecommunications', 'Retail', 'Hospitality', 'Transportation',
    'Agriculture', 'Construction', 'Pharmaceuticals', 'Biotechnology', 'Food & Beverage', 'Fashion', 'Sports', 'Non-profit',
    'Government', 'Legal', 'Insurance', 'Banking', 'Investment', 'Venture Capital', 'Private Equity', 'Startups',
    'Gaming', 'Social Media', 'Digital Marketing', 'Advertising', 'Public Relations', 'Event Management', 'Tourism',
    'Logistics', 'Supply Chain', 'Research & Development', 'Environmental', 'Sustainability', 'Renewable Energy',
    'Cybersecurity', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'Fintech', 'Edtech',
    'Healthtech', 'Agritech', 'Cleantech', 'PropTech', 'LegalTech', 'HRTech', 'MarTech', 'AdTech'
  ];

  const workDomains = [
    'Software Development', 'Web Development', 'Mobile App Development', 'Data Science', 'Data Analysis', 'Machine Learning',
    'Artificial Intelligence', 'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'Content Writing', 'Social Media Management',
    'Business Development', 'Sales', 'Marketing', 'Human Resources', 'Finance & Accounting', 'Project Management',
    'Quality Assurance', 'DevOps', 'Cybersecurity', 'Cloud Computing', 'Database Administration', 'System Administration',
    'Network Engineering', 'Product Management', 'Operations', 'Supply Chain', 'Logistics', 'Customer Success',
    'Customer Support', 'Technical Writing', 'Research', 'Consulting', 'Strategy', 'Business Analysis',
    'Financial Analysis', 'Investment Banking', 'Trading', 'Risk Management', 'Compliance', 'Legal',
    'Public Relations', 'Event Management', 'Photography', 'Videography', 'Video Editing', 'Audio Production',
    'Game Development', 'AR/VR Development', 'IoT Development', 'Blockchain Development', 'Robotics', 'Automation',
    'Environmental Science', 'Sustainability', 'Renewable Energy', 'Biotechnology', 'Pharmaceuticals', 'Healthcare',
    'Education Technology', 'E-learning', 'Training & Development', 'Recruitment', 'Talent Acquisition', 'HR Analytics',
    'Market Research', 'User Research', 'Product Research', 'Competitive Analysis', 'Business Intelligence',
    'Data Engineering', 'Data Visualization', 'Statistics', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Psychology', 'Sociology', 'Economics', 'Political Science', 'International Relations', 'Languages',
    'Translation', 'Interpretation', 'Journalism', 'Broadcasting', 'Publishing', 'Editing', 'Proofreading',
    'Architecture', 'Interior Design', 'Urban Planning', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Chemical Engineering', 'Aerospace Engineering', 'Biomedical Engineering', 'Environmental Engineering', 'Industrial Engineering',
    'Materials Science', 'Geology', 'Geography', 'Meteorology', 'Oceanography', 'Astronomy', 'Astrophysics'
  ];

  const technicalSkills = [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'TypeScript',
    'HTML/CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel',
    'Ruby on Rails', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'SASS/SCSS', 'Webpack', 'Vite', 'Parcel',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase', 'Supabase',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform',
    'Linux', 'Windows Server', 'macOS', 'Ubuntu', 'CentOS', 'Red Hat', 'Debian', 'Arch Linux',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial', 'Perforce',
    'REST APIs', 'GraphQL', 'SOAP', 'Microservices', 'Serverless', 'API Gateway', 'Load Balancing',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib',
    'Data Science', 'Data Analysis', 'Statistics', 'R', 'SAS', 'SPSS', 'Tableau', 'Power BI', 'Looker',
    'Jupyter Notebook', 'Google Colab', 'Kaggle', 'Apache Spark', 'Hadoop', 'Apache Kafka', 'Elasticsearch',
    'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security', 'Application Security',
    'Cloud Security', 'Information Security', 'Risk Assessment', 'Compliance', 'GDPR', 'HIPAA', 'SOX',
    'Mobile Development', 'iOS Development', 'Android Development', 'React Native', 'Flutter', 'Xamarin',
    'Ionic', 'Cordova', 'PhoneGap', 'Unity', 'Unreal Engine', 'Game Development', 'AR/VR Development',
    'Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'DeFi', 'NFTs', 'Cryptocurrency', 'Bitcoin', 'Ethereum',
    'DevOps', 'CI/CD', 'Infrastructure as Code', 'Monitoring', 'Logging', 'APM', 'Prometheus', 'Grafana',
    'Testing', 'Unit Testing', 'Integration Testing', 'E2E Testing', 'Selenium', 'Cypress', 'Jest', 'Mocha',
    'Chai', 'Pytest', 'JUnit', 'TestNG', 'Cucumber', 'SpecFlow', 'Postman', 'Insomnia', 'SoapUI',
    'Agile', 'Scrum', 'Kanban', 'SAFe', 'Lean', 'Waterfall', 'DevOps', 'Site Reliability Engineering',
    'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Marvel', 'Principle', 'Framer', 'Adobe Creative Suite',
    'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve',
    'Excel', 'Google Sheets', 'Airtable', 'Notion', 'Confluence', 'Jira', 'Trello', 'Asana', 'Monday.com',
    'Slack', 'Microsoft Teams', 'Discord', 'Zoom', 'WebEx', 'Google Meet', 'Skype', 'Telegram'
  ];

  const softSkills = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Creativity', 'Adaptability',
    'Time Management', 'Organization', 'Attention to Detail', 'Work Ethic', 'Reliability', 'Punctuality',
    'Emotional Intelligence', 'Empathy', 'Active Listening', 'Public Speaking', 'Presentation Skills',
    'Negotiation', 'Conflict Resolution', 'Decision Making', 'Strategic Thinking', 'Analytical Thinking',
    'Innovation', 'Entrepreneurship', 'Risk Management', 'Project Management', 'Change Management',
    'Mentoring', 'Coaching', 'Training', 'Teaching', 'Knowledge Sharing', 'Cross-functional Collaboration',
    'Cultural Awareness', 'Diversity & Inclusion', 'Global Mindset', 'Multilingual', 'Language Skills',
    'Customer Service', 'Client Relations', 'Stakeholder Management', 'Vendor Management', 'Supplier Relations',
    'Sales Skills', 'Marketing Skills', 'Brand Management', 'Digital Marketing', 'Social Media Management',
    'Content Creation', 'Copywriting', 'Technical Writing', 'Documentation', 'Research Skills',
    'Data Interpretation', 'Report Writing', 'Business Writing', 'Email Communication', 'Professional Etiquette',
    'Networking', 'Relationship Building', 'Influence', 'Persuasion', 'Motivation', 'Inspiration',
    'Stress Management', 'Work-Life Balance', 'Self-Motivation', 'Self-Discipline', 'Self-Awareness',
    'Continuous Learning', 'Growth Mindset', 'Curiosity', 'Open-mindedness', 'Flexibility', 'Resilience',
    'Patience', 'Tolerance', 'Respect', 'Integrity', 'Honesty', 'Transparency', 'Accountability',
    'Responsibility', 'Ownership', 'Initiative', 'Proactivity', 'Resourcefulness', 'Efficiency',
    'Productivity', 'Quality Focus', 'Excellence', 'Professionalism', 'Confidence', 'Assertiveness'
  ];

  const desiredRoles = [
    'Software Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Mobile App Developer',
    'iOS Developer', 'Android Developer', 'Web Developer', 'UI/UX Designer', 'Graphic Designer', 'Product Designer',
    'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'AI Engineer', 'Data Engineer', 'Business Analyst',
    'Product Manager', 'Project Manager', 'Scrum Master', 'DevOps Engineer', 'Cloud Engineer', 'System Administrator',
    'Database Administrator', 'Network Engineer', 'Cybersecurity Analyst', 'Security Engineer', 'QA Engineer',
    'Test Engineer', 'Automation Engineer', 'Technical Writer', 'Content Writer', 'Digital Marketing Specialist',
    'Social Media Manager', 'SEO Specialist', 'PPC Specialist', 'Content Marketing Manager', 'Brand Manager',
    'Marketing Manager', 'Sales Representative', 'Business Development Manager', 'Account Manager', 'Customer Success Manager',
    'HR Specialist', 'Recruiter', 'Talent Acquisition Specialist', 'Training Specialist', 'Operations Manager',
    'Supply Chain Manager', 'Logistics Coordinator', 'Financial Analyst', 'Investment Analyst', 'Risk Analyst',
    'Compliance Officer', 'Legal Assistant', 'Paralegal', 'Research Assistant', 'Research Analyst',
    'Consultant', 'Strategy Consultant', 'Management Consultant', 'IT Consultant', 'Business Consultant',
    'Sales Consultant', 'Marketing Consultant', 'Financial Consultant', 'HR Consultant', 'Operations Consultant',
    'Research Scientist', 'Lab Technician', 'Clinical Research Associate', 'Medical Writer', 'Healthcare Administrator',
    'Nurse', 'Physician Assistant', 'Pharmacist', 'Veterinarian', 'Dentist', 'Physical Therapist', 'Occupational Therapist',
    'Psychologist', 'Social Worker', 'Counselor', 'Therapist', 'Teacher', 'Professor', 'Academic Researcher',
    'Librarian', 'Archivist', 'Museum Curator', 'Journalist', 'Reporter', 'Editor', 'Publisher', 'Broadcaster',
    'Photographer', 'Videographer', 'Video Editor', 'Audio Engineer', 'Sound Designer', 'Music Producer',
    'Game Designer', 'Game Developer', 'Game Artist', 'Animator', '3D Artist', 'Character Designer', 'Level Designer',
    'Architect', 'Interior Designer', 'Urban Planner', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer',
    'Chemical Engineer', 'Aerospace Engineer', 'Biomedical Engineer', 'Environmental Engineer', 'Industrial Engineer',
    'Materials Engineer', 'Nuclear Engineer', 'Petroleum Engineer', 'Mining Engineer', 'Marine Engineer',
    'Agricultural Engineer', 'Computer Engineer', 'Software Engineer', 'Hardware Engineer', 'Network Engineer',
    'Telecommunications Engineer', 'Robotics Engineer', 'Automation Engineer', 'Control Systems Engineer',
    'Quality Engineer', 'Manufacturing Engineer', 'Process Engineer', 'Production Engineer', 'Maintenance Engineer',
    'Safety Engineer', 'Fire Protection Engineer', 'Transportation Engineer', 'Traffic Engineer', 'Highway Engineer',
    'Structural Engineer', 'Geotechnical Engineer', 'Water Resources Engineer', 'Environmental Consultant',
    'Sustainability Consultant', 'Energy Consultant', 'Renewable Energy Specialist', 'Solar Engineer', 'Wind Engineer',
    'Hydropower Engineer', 'Nuclear Engineer', 'Oil & Gas Engineer', 'Mining Engineer', 'Geologist', 'Geophysicist',
    'Meteorologist', 'Climatologist', 'Oceanographer', 'Marine Biologist', 'Astronomer', 'Astrophysicist',
    'Physicist', 'Chemist', 'Biologist', 'Microbiologist', 'Biochemist', 'Molecular Biologist', 'Geneticist',
    'Pharmacist', 'Pharmaceutical Scientist', 'Toxicologist', 'Epidemiologist', 'Public Health Specialist',
    'Environmental Scientist', 'Conservation Scientist', 'Wildlife Biologist', 'Ecologist', 'Botanist',
    'Zoologist', 'Paleontologist', 'Anthropologist', 'Archaeologist', 'Historian', 'Political Scientist',
    'Economist', 'Sociologist', 'Psychologist', 'Social Worker', 'Counselor', 'Therapist', 'Psychiatrist',
    'Psychiatric Nurse', 'Mental Health Counselor', 'Substance Abuse Counselor', 'Family Therapist',
    'Marriage Counselor', 'Child Psychologist', 'Educational Psychologist', 'School Psychologist',
    'Clinical Psychologist', 'Counseling Psychologist', 'Industrial Psychologist', 'Forensic Psychologist',
    'Sports Psychologist', 'Health Psychologist', 'Community Psychologist', 'Environmental Psychologist'
  ];

  // Fetch existing data if editing
  useEffect(() => {
    const fetchExistingData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !existingData) return;

      try {
        const response = await fetch(buildApiUrl('/api/auth/get_user'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.internDetails) {
            setFormData(prev => ({
              ...prev,
              ...userData.internDetails
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchExistingData();
  }, [existingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
      case 2:
        if (!formData.currentEducation) newErrors.currentEducation = 'Current education is required';
        if (!formData.university.trim()) newErrors.university = 'University is required';
        if (!formData.course.trim()) newErrors.course = 'Course is required';
        break;
      case 3:
        if (!formData.technicalSkills) newErrors.technicalSkills = 'Technical skill is required';
        break;
      case 4:
        if (!formData.workMode) newErrors.workMode = 'Work mode is required';
        if (!formData.internshipDuration) newErrors.internshipDuration = 'Internship duration is required';
        break;
      case 5:
        if (!formData.careerGoals.trim()) newErrors.careerGoals = 'Career goals are required';
        if (!formData.remarks.trim()) newErrors.remarks = 'Personal remarks and requirements are required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/interns/details'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/job-seeker-dashboard', { 
          state: { 
            message: 'Intern profile updated successfully!',
            type: 'success'
          }
        });
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Failed to save intern details');
      }
    } catch (error) {
      console.error('Error saving intern details:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Personal Information</h2>
        <p>Tell us about yourself</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={errors.fullName ? 'error' : ''}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="your.email@example.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={errors.dateOfBirth ? 'error' : ''}
          />
          {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your complete address"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your city"
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Enter your state"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pincode">PIN Code</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="Enter PIN code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="linkedinProfile">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedinProfile"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="form-group">
          <label htmlFor="githubProfile">GitHub Profile</label>
          <input
            type="url"
            id="githubProfile"
            name="githubProfile"
            value={formData.githubProfile}
            onChange={handleInputChange}
            placeholder="https://github.com/yourusername"
          />
        </div>

        {/* Next Button for Step 1 */}
        <div className="step-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Education Details</h2>
        <p>Share your academic background</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="currentEducation">Current Education Level *</label>
          <select
            id="currentEducation"
            name="currentEducation"
            value={formData.currentEducation}
            onChange={handleInputChange}
            className={errors.currentEducation ? 'error' : ''}
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.currentEducation && <span className="error-text">{errors.currentEducation}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="university">University/Institution *</label>
          <input
            type="text"
            id="university"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
            className={errors.university ? 'error' : ''}
            placeholder="Enter your university name"
          />
          {errors.university && <span className="error-text">{errors.university}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course/Program *</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className={errors.course ? 'error' : ''}
            placeholder="e.g., Computer Science Engineering"
          />
          {errors.course && <span className="error-text">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="graduationYear">Expected Graduation Year</label>
          <input
            type="number"
            id="graduationYear"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
            placeholder="2024"
            min="2020"
            max="2030"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cgpa">CGPA/Percentage</label>
          <input
            type="text"
            id="cgpa"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleInputChange}
            placeholder="e.g., 8.5 or 85%"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="academicAchievements">Academic Achievements</label>
          <textarea
            id="academicAchievements"
            name="academicAchievements"
            value={formData.academicAchievements}
            onChange={handleInputChange}
            placeholder="List any academic achievements, awards, or recognitions"
            rows="3"
          />
        </div>

        {/* Next Button for Step 2 */}
        <div className="step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Skills & Expertise</h2>
        <p>What are you good at?</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="technicalSkills">Primary Technical Skill *</label>
          <select
            id="technicalSkills"
            name="technicalSkills"
            value={formData.technicalSkills}
            onChange={handleInputChange}
            className={errors.technicalSkills ? 'error' : ''}
          >
            <option value="">Select your primary technical skill</option>
            {technicalSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          {errors.technicalSkills && <span className="error-text">{errors.technicalSkills}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="programmingLanguages">Programming Language</label>
          <select
            id="programmingLanguages"
            name="programmingLanguages"
            value={formData.programmingLanguages}
            onChange={handleInputChange}
          >
            <option value="">Select programming language</option>
            {technicalSkills.filter(skill => 
              ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'TypeScript'].includes(skill)
            ).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="frameworks">Framework/Library</label>
          <select
            id="frameworks"
            name="frameworks"
            value={formData.frameworks}
            onChange={handleInputChange}
          >
            <option value="">Select framework or library</option>
            {technicalSkills.filter(skill => 
              ['React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET'].includes(skill)
            ).map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tools">Tools & Technologies</label>
          <select
            id="tools"
            name="tools"
            value={formData.tools}
            onChange={handleInputChange}
          >
            <option value="">Select tools & technologies</option>
            {technicalSkills.filter(skill => 
              ['Git', 'Docker', 'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Jenkins', 'Linux', 'MySQL', 'MongoDB', 'Redis'].includes(skill)
            ).map(tool => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="softSkills">Primary Soft Skill</label>
          <select
            id="softSkills"
            name="softSkills"
            value={formData.softSkills}
            onChange={handleInputChange}
          >
            <option value="">Select your primary soft skill</option>
            {softSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interests">Area of Interest</label>
          <select
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
          >
            <option value="">Select your area of interest</option>
            {workDomains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>

        {/* Next Button for Step 3 */}
        <div className="step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Internship Preferences</h2>
        <p>What kind of internship are you looking for?</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="workMode">Work Mode *</label>
          <select
            id="workMode"
            name="workMode"
            value={formData.workMode}
            onChange={handleInputChange}
            className={errors.workMode ? 'error' : ''}
          >
            <option value="">Select work mode</option>
            {workModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          {errors.workMode && <span className="error-text">{errors.workMode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="internshipDuration">Internship Duration *</label>
          <select
            id="internshipDuration"
            name="internshipDuration"
            value={formData.internshipDuration}
            onChange={handleInputChange}
            className={errors.internshipDuration ? 'error' : ''}
          >
            <option value="">Select duration</option>
            {internshipDurations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
          {errors.internshipDuration && <span className="error-text">{errors.internshipDuration}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Preferred Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>


        <div className="form-group">
          <label htmlFor="preferredIndustries">Preferred Industry</label>
          <select
            id="preferredIndustries"
            name="preferredIndustries"
            value={formData.preferredIndustries}
            onChange={handleInputChange}
          >
            <option value="">Select preferred industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workDomains">Work Domain</label>
          <select
            id="workDomains"
            name="workDomains"
            value={formData.workDomains}
            onChange={handleInputChange}
          >
            <option value="">Select work domain</option>
            {workDomains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="desiredRole">Desired Role</label>
          <select
            id="desiredRole"
            name="desiredRole"
            value={formData.desiredRole}
            onChange={handleInputChange}
          >
            <option value="">Select desired role</option>
            {desiredRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferredLocation">Preferred Location</label>
          <select
            id="preferredLocation"
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={handleInputChange}
          >
            <option value="">Select preferred location</option>
            <option value="Remote">Remote</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Gurgaon">Gurgaon</option>
            <option value="Noida">Noida</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Kochi">Kochi</option>
            <option value="Indore">Indore</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Visakhapatnam">Visakhapatnam</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Next Button for Step 4 */}
        <div className="step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Goals & Remarks</h2>
        <p>Share your aspirations and any additional information</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="careerGoals">Career Goals *</label>
          <textarea
            id="careerGoals"
            name="careerGoals"
            value={formData.careerGoals}
            onChange={handleInputChange}
            className={errors.careerGoals ? 'error' : ''}
            placeholder="Describe your career aspirations and where you see yourself in 5 years"
            rows="4"
          />
          {errors.careerGoals && <span className="error-text">{errors.careerGoals}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="learningObjectives">Learning Objectives</label>
          <textarea
            id="learningObjectives"
            name="learningObjectives"
            value={formData.learningObjectives}
            onChange={handleInputChange}
            placeholder="What specific skills or knowledge do you want to gain from this internship?"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="whyInternship">Why do you want this internship?</label>
          <textarea
            id="whyInternship"
            name="whyInternship"
            value={formData.whyInternship}
            onChange={handleInputChange}
            placeholder="Explain your motivation for seeking this internship opportunity"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="previousExperience">Previous Experience</label>
          <textarea
            id="previousExperience"
            name="previousExperience"
            value={formData.previousExperience}
            onChange={handleInputChange}
            placeholder="Describe any relevant work experience, projects, or internships"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="remarks">
            <FontAwesomeIcon icon={faComments} />
            Personal Remarks & Requirements *
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Please write about your specific needs, preferred timings, availability, any special requirements, expectations from the internship, learning goals, and anything else you'd like employers to know about you..."
            rows="6"
            className={errors.remarks ? 'error' : ''}
          />
          <small className="help-text">
            This is your opportunity to tell employers about your specific needs, preferred working hours, availability, learning goals, and any other important details. Be specific about what you're looking for!
          </small>
          {errors.remarks && <span className="error-text">{errors.remarks}</span>}
        </div>

        {/* Final Step Actions */}
        <div className="step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            <FontAwesomeIcon icon={faCheck} />
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep || stepId === 1) {
      setCurrentStep(stepId);
      setErrors({});
    }
  };

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="progress-steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''} ${step.id <= currentStep || step.id === 1 ? 'clickable' : ''}`}
            onClick={() => handleStepClick(step.id)}
            title={`Go to ${step.title}`}
          >
            <div className="step-circle">
              <FontAwesomeIcon icon={step.icon} />
            </div>
            <span className="step-label">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="new-intern-details-wrapper">
      {/* Header */}
      <header className="new-intern-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo192.png" alt="AksharJobs" />
            </div>
            <div className="logo-text">
              <div className="logo-title">AksharJobs</div>
              <div className="logo-subtitle">Intern Registration</div>
            </div>
          </div>
          
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="new-intern-main">
        <div className="new-intern-container">
          <div className="new-intern-form-card">
            <div className="form-header">
              <h1 className="form-title">
                {existingData ? '✏️ Edit Your Intern Profile' : 'Complete Your Intern Profile'}
              </h1>
              <p className="form-subtitle">
                {existingData
                  ? 'Update your information to get better AI-powered internship recommendations'
                  : 'Help us understand you better to match you with the perfect internship opportunities'
                }
              </p>
            </div>

            {renderProgressBar()}

            <div className="form-content">
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="error-message-box">
                    {submitError}
                  </div>
                )}

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </form>
            </div>

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner-small"></div>
                      {existingData ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      {existingData ? 'Update Profile' : 'Submit Application'}
                      <FontAwesomeIcon icon={faCheck} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Next Button for better visibility */}
        <div className="floating-next-button">
          {currentStep < 5 ? (
            <button
              type="button"
              className="btn btn-primary floating-btn"
              onClick={handleNext}
            >
              Next Step
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary floating-btn"
              onClick={handleSubmit}
            >
              Complete Profile
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewInternDetailsForm;
