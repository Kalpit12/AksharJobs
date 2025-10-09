import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faMapMarkerAlt, 
  faIndustry, 
  faGlobe, 
  faPhone, 
  faUsers, 
  faCalendarAlt, 
  faFileAlt,
  faSave,
  faRocket,
  faArrowLeft,
  faUser,
  faEnvelope,
  faBriefcase,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faLaptopHouse,
  faHandshake,
  faGraduationCap,
  faLanguage,
  faTags,
  faAward,
  faDollarSign,
  faClipboardCheck,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { buildApiUrl } from '../config/api';
import '../styles/RecruiterRegistrationForm.css';

// Comprehensive data lists
const INDUSTRIES = [
  'Agriculture', 'Automotive', 'Banking & Finance', 'Biotechnology', 'Chemicals', 
  'Construction', 'Consulting', 'Cybersecurity', 'Data & AI', 'Design', 
  'Education', 'E-commerce', 'Energy', 'Engineering', 'Entertainment', 
  'Environmental Services', 'Fashion', 'FinTech', 'Food & Beverage', 'Government', 
  'Healthcare', 'Hospitality', 'Human Resources', 'Information Technology', 'Insurance', 
  'Legal', 'Logistics', 'Manufacturing', 'Marketing', 'Media & Communication', 
  'Mining', 'NGO / Nonprofit', 'Oil & Gas', 'Pharmaceuticals', 'Real Estate', 
  'Retail', 'Robotics', 'SaaS', 'Sports', 'Telecom', 'Tourism', 
  'Transportation', 'Utilities', 'Others'
];

const COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '501–1000 employees',
  '1001–5000 employees',
  '5001+ employees'
];

const DESIGNATIONS = [
  'HR Manager', 'Talent Acquisition Specialist', 'Recruiter', 'Hiring Manager', 
  'Founder', 'Director', 'Team Lead', 'Other'
];

const POSITION_TYPES = [
  'Internship', 'Full-Time', 'Part-Time', 'Contract', 'Freelance'
];

const WORK_TYPES = ['On-site', 'Remote', 'Hybrid'];

const HIRING_DEPARTMENTS = [
  'Software Development', 'Web Development', 'Data Science', 'AI/ML', 
  'Cloud Computing', 'Cybersecurity', 'Marketing', 'Sales', 'HR', 
  'Graphic Design', 'UI/UX Design', 'Content Writing', 'Business Development', 
  'Customer Support', 'Operations', 'Finance', 'Legal', 'Research', 
  'Product Management', 'Engineering', 'Architecture', 'Supply Chain', 'Other'
];

const DURATIONS = [
  '1 Month', '2 Months', '3 Months', '6 Months', '12 Months'
];

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'KES', 'CAD', 'AUD', 'AED', 'JPY', 'CNY', 'ZAR',
  'BRL', 'MXN', 'CHF', 'SEK', 'NOK', 'DKK', 'SGD', 'HKD', 'NZD', 'KRW'
];

const EDUCATION_LEVELS = [
  'High School', 'Diploma', "Bachelor's", "Master's", 'Doctorate'
];

const FIELDS_OF_STUDY = [
  // Technology & Computing
  'Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 
  'Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Computer Engineering',
  'Information Systems', 'Web Development', 'Mobile Development', 'Game Development',
  'Cloud Computing', 'DevOps', 'Blockchain', 'Quantum Computing',
  
  // Business & Management
  'Business Administration', 'Business Management', 'International Business', 'Marketing',
  'Digital Marketing', 'Finance', 'Accounting', 'Economics', 'Entrepreneurship',
  'Supply Chain Management', 'Operations Management', 'Human Resources',
  'Project Management', 'Strategic Management', 'E-commerce', 'Retail Management',
  
  // Engineering & Technical
  'Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Aerospace Engineering', 'Biomedical Engineering',
  'Environmental Engineering', 'Industrial Engineering', 'Materials Science',
  'Architecture', 'Urban Planning', 'Construction Management',
  
  // Healthcare & Life Sciences
  'Medicine', 'Nursing', 'Pharmacy', 'Dentistry', 'Veterinary Science',
  'Public Health', 'Biomedical Sciences', 'Biology', 'Biochemistry',
  'Biotechnology', 'Genetics', 'Neuroscience', 'Psychology', 'Social Work',
  
  // Arts & Design
  'Arts', 'Fine Arts', 'Graphic Design', 'Interior Design', 'Fashion Design',
  'Industrial Design', 'Digital Arts', 'Animation', 'Film Studies',
  'Music', 'Theater', 'Dance', 'Photography', 'Creative Writing',
  
  // Social Sciences & Humanities
  'Law', 'Political Science', 'International Relations', 'Sociology',
  'Anthropology', 'History', 'Philosophy', 'Literature', 'Linguistics',
  'Geography', 'Criminology', 'Journalism', 'Communication Studies',
  
  // Education & Training
  'Education', 'Early Childhood Education', 'Special Education',
  'Educational Technology', 'Curriculum Development', 'Teaching',
  
  // Agriculture & Environment
  'Agriculture', 'Environmental Science', 'Forestry', 'Marine Biology',
  'Sustainability', 'Renewable Energy', 'Climate Science',
  
  // Hospitality & Tourism
  'Hospitality Management', 'Tourism', 'Culinary Arts', 'Event Management',
  'Hotel Management', 'Travel & Tourism',
  
  // Other Specialized Fields
  'Mathematics', 'Statistics', 'Physics', 'Chemistry', 'Geology',
  'Astronomy', 'Meteorology', 'Library Science', 'Sports Science',
  'Nutrition', 'Food Science', 'Textile Engineering', 'Mining Engineering',
  'Petroleum Engineering', 'Nuclear Engineering', 'Other'
];

const SOFT_SKILLS = [
  'Communication', 'Leadership', 'Problem Solving', 'Creativity', 
  'Time Management', 'Teamwork', 'Adaptability', 'Critical Thinking',
  'Emotional Intelligence', 'Negotiation', 'Presentation Skills',
  'Project Management', 'Customer Service', 'Mentoring', 'Public Speaking',
  'Conflict Resolution', 'Decision Making', 'Strategic Thinking',
  'Cross-cultural Communication', 'Networking', 'Self-motivation',
  'Attention to Detail', 'Multitasking', 'Stress Management'
];

// Comprehensive keyword database organized by sectors
const KEYWORD_DATABASE = {
  // Technology & Programming
  programming: {
    name: 'Programming Languages',
    keywords: [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'Swift', 'Kotlin', 'TypeScript', 'R', 'MATLAB', 'Scala', 'Perl', 'Haskell',
      'Dart', 'Lua', 'Julia', 'Clojure', 'Elixir', 'F#', 'OCaml', 'Erlang'
    ]
  },
  
  // Web Development
  webDev: {
    name: 'Web Development',
    keywords: [
      'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask',
      'Laravel', 'Spring Boot', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS',
      'SASS', 'LESS', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js', 'Gatsby',
      'Svelte', 'Ember.js', 'Backbone.js', 'Meteor', 'Socket.io', 'HTML', 'CSS'
    ]
  },
  
  // Mobile Development
  mobileDev: {
    name: 'Mobile Development',
    keywords: [
      'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova', 'Android Studio',
      'Xcode', 'iOS Development', 'Android Development', 'Kotlin', 'Swift',
      'Objective-C', 'Java', 'Dart', 'C#', 'Unity', 'Unreal Engine'
    ]
  },
  
  // Database & Backend
  database: {
    name: 'Database & Backend',
    keywords: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
      'Firebase', 'Supabase', 'Prisma', 'Sequelize', 'Mongoose', 'Cassandra',
      'Elasticsearch', 'Neo4j', 'CouchDB', 'DynamoDB', 'MariaDB', 'InfluxDB'
    ]
  },
  
  // Cloud & DevOps
  cloudDevOps: {
    name: 'Cloud & DevOps',
    keywords: [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
      'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS',
      'Nginx', 'Apache', 'Vagrant', 'Puppet', 'Chef', 'Prometheus', 'Grafana',
      'Git', 'GitHub', 'GitLab', 'CI/CD'
    ]
  },
  
  // Data Science & AI
  dataScience: {
    name: 'Data Science & AI',
    keywords: [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'Pandas', 'NumPy', 'Jupyter', 'Tableau', 'Power BI', 'Data Analysis',
      'Statistics', 'SQL', 'Excel', 'R Studio', 'Apache Spark', 'Hadoop',
      'Keras', 'OpenCV', 'NLTK', 'spaCy', 'Apache Kafka', 'Apache Airflow'
    ]
  },
  
  // Design & UI/UX
  design: {
    name: 'Design & UI/UX',
    keywords: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
      'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Research',
      'Adobe After Effects', 'Premiere Pro', 'Framer', 'Principle', 'InVision',
      'Zeplin', 'Abstract', 'Canva', 'Adobe Creative Suite'
    ]
  },
  
  // Marketing & Digital
  marketing: {
    name: 'Marketing & Digital',
    keywords: [
      'SEO', 'SEM', 'Google Analytics', 'Facebook Ads', 'Instagram Marketing',
      'Content Writing', 'Copywriting', 'Social Media Management', 'Email Marketing',
      'Google Ads', 'LinkedIn Marketing', 'YouTube Marketing', 'TikTok Marketing',
      'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer', 'Sprout Social', 'SEMrush',
      'Ahrefs', 'Moz', 'Google Tag Manager', 'Facebook Pixel', 'Conversion Tracking'
    ]
  },
  
  // Business & Management
  business: {
    name: 'Business & Management',
    keywords: [
      'Project Management', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Asana',
      'Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Microsoft Teams',
      'Confluence', 'Notion', 'Monday.com', 'Basecamp', 'Wrike', 'Smartsheet',
      'Process Improvement', 'Lean Six Sigma', 'Change Management', 'Risk Management'
    ]
  },
  
  // Sales & Customer Service
  sales: {
    name: 'Sales & Customer Service',
    keywords: [
      'Sales', 'Customer Service', 'CRM', 'Salesforce', 'HubSpot', 'Zendesk',
      'Lead Generation', 'Cold Calling', 'Email Outreach', 'Negotiation',
      'Pipedrive', 'Freshworks', 'Intercom', 'LiveChat', 'Drift', 'Calendly',
      'Sales Funnel', 'Lead Qualification', 'Account Management', 'Customer Success'
    ]
  },
  
  // Finance & Accounting
  finance: {
    name: 'Finance & Accounting',
    keywords: [
      'QuickBooks', 'Excel', 'Financial Analysis', 'Bookkeeping', 'Tax Preparation',
      'Investment Analysis', 'Budgeting', 'Forecasting', 'SAP', 'Oracle Financials',
      'Xero', 'FreshBooks', 'Wave', 'Sage', 'Intuit', 'Financial Modeling',
      'Variance Analysis', 'Cost Accounting', 'Auditing', 'Compliance'
    ]
  },
  
  // Healthcare & Life Sciences
  healthcare: {
    name: 'Healthcare & Life Sciences',
    keywords: [
      'Medical Research', 'Clinical Trials', 'Healthcare IT', 'Electronic Health Records',
      'HIPAA Compliance', 'Medical Coding', 'Pharmaceuticals', 'Biotechnology',
      'Healthcare Analytics', 'Telemedicine', 'Health Informatics', 'Medical Devices',
      'Regulatory Affairs', 'Quality Assurance', 'Good Manufacturing Practices'
    ]
  },
  
  // Education & Training
  education: {
    name: 'Education & Training',
    keywords: [
      'Curriculum Development', 'Educational Technology', 'E-learning', 'LMS',
      'Instructional Design', 'Training Delivery', 'Assessment Design', 'Moodle',
      'Canvas', 'Blackboard', 'Google Classroom', 'Zoom Education', 'Coursera',
      'Udemy', 'Khan Academy', 'Student Management', 'Academic Research'
    ]
  },
  
  // Legal & Compliance
  legal: {
    name: 'Legal & Compliance',
    keywords: [
      'Legal Research', 'Contract Review', 'Compliance Management', 'Risk Assessment',
      'Regulatory Compliance', 'Intellectual Property', 'Data Privacy', 'GDPR',
      'Legal Writing', 'Case Management', 'Document Review', 'Litigation Support',
      'Corporate Law', 'Employment Law', 'Real Estate Law', 'Immigration Law'
    ]
  },
  
  // Cybersecurity
  cybersecurity: {
    name: 'Cybersecurity',
    keywords: [
      'Cybersecurity', 'Information Security', 'Penetration Testing', 'Vulnerability Assessment',
      'Security Auditing', 'Incident Response', 'Threat Analysis', 'Risk Management',
      'Network Security', 'Application Security', 'Cloud Security', 'Identity Management',
      'SIEM', 'SOC', 'Firewall', 'VPN', 'Encryption', 'Malware Analysis'
    ]
  },
  
  // Emerging Technologies
  emerging: {
    name: 'Emerging Technologies',
    keywords: [
      'Blockchain', 'Cryptocurrency', 'NFT', 'Web3', 'DeFi', 'Smart Contracts',
      'IoT', 'Internet of Things', 'AR/VR', 'Augmented Reality', 'Virtual Reality',
      'Robotics', 'Automation', 'RPA', 'Quantum Computing', 'Edge Computing',
      '5G', '6G', 'Autonomous Vehicles', 'Drones', '3D Printing', 'Nanotechnology'
    ]
  },
  
  // Soft Skills
  softSkills: {
    name: 'Soft Skills',
    keywords: [
      'Communication', 'Leadership', 'Problem Solving', 'Creativity', 'Time Management',
      'Teamwork', 'Adaptability', 'Critical Thinking', 'Emotional Intelligence',
      'Negotiation', 'Presentation Skills', 'Project Management', 'Customer Service',
      'Mentoring', 'Public Speaking', 'Conflict Resolution', 'Decision Making',
      'Strategic Thinking', 'Cross-cultural Communication', 'Networking', 'Self-motivation',
      'Attention to Detail', 'Multitasking', 'Stress Management', 'Active Listening'
    ]
  }
};

// Flatten all keywords for search
const ALL_KEYWORDS = Object.values(KEYWORD_DATABASE).flatMap(category => category.keywords);

// Comprehensive skills database for multi-select dropdowns
const SKILLS_DATABASE = {
  // Technical Skills
  programming: {
    name: 'Programming Languages',
    skills: [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'Swift', 'Kotlin', 'TypeScript', 'R', 'MATLAB', 'Scala', 'Perl', 'Haskell',
      'Dart', 'Lua', 'Julia', 'Clojure', 'Elixir', 'F#', 'OCaml', 'Erlang',
      'Assembly', 'COBOL', 'Fortran', 'Pascal', 'Ada', 'Lisp', 'Prolog'
    ]
  },
  
  webDevelopment: {
    name: 'Web Development',
    skills: [
      'HTML', 'CSS', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
      'Django', 'Flask', 'Laravel', 'Spring Boot', 'ASP.NET', 'jQuery',
      'Bootstrap', 'Tailwind CSS', 'SASS', 'LESS', 'Webpack', 'Vite',
      'Next.js', 'Nuxt.js', 'Gatsby', 'Svelte', 'Ember.js', 'Backbone.js',
      'Meteor', 'Socket.io', 'REST API', 'GraphQL', 'WebSocket'
    ]
  },
  
  mobileDevelopment: {
    name: 'Mobile Development',
    skills: [
      'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova', 'Android Studio',
      'Xcode', 'iOS Development', 'Android Development', 'Kotlin', 'Swift',
      'Objective-C', 'Java', 'Dart', 'C#', 'Unity', 'Unreal Engine',
      'PhoneGap', 'Appcelerator', 'Sencha Touch', 'Kivy', 'Xamarin.Forms'
    ]
  },
  
  database: {
    name: 'Database & Backend',
    skills: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
      'Firebase', 'Supabase', 'Prisma', 'Sequelize', 'Mongoose', 'Cassandra',
      'Elasticsearch', 'Neo4j', 'CouchDB', 'DynamoDB', 'MariaDB', 'InfluxDB',
      'Couchbase', 'RethinkDB', 'ArangoDB', 'OrientDB', 'HBase', 'CouchDB'
    ]
  },
  
  cloudDevOps: {
    name: 'Cloud & DevOps',
    skills: [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
      'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Ubuntu',
      'CentOS', 'Nginx', 'Apache', 'Vagrant', 'Puppet', 'Chef', 'Prometheus',
      'Grafana', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'Microservices',
      'Serverless', 'Lambda', 'CloudFormation', 'Helm', 'Istio'
    ]
  },
  
  dataScience: {
    name: 'Data Science & AI',
    skills: [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'Pandas', 'NumPy', 'Jupyter', 'Tableau', 'Power BI', 'Data Analysis',
      'Statistics', 'SQL', 'Excel', 'R Studio', 'Apache Spark', 'Hadoop',
      'Keras', 'OpenCV', 'NLTK', 'spaCy', 'Apache Kafka', 'Apache Airflow',
      'Data Visualization', 'Business Intelligence', 'Predictive Analytics',
      'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning'
    ]
  },
  
  design: {
    name: 'Design & UI/UX',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
      'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Research',
      'Adobe After Effects', 'Premiere Pro', 'Framer', 'Principle', 'InVision',
      'Zeplin', 'Abstract', 'Canva', 'Adobe Creative Suite', 'Blender',
      'Cinema 4D', 'Maya', '3D Modeling', 'Motion Graphics', 'Video Editing'
    ]
  },
  
  marketing: {
    name: 'Marketing & Digital',
    skills: [
      'SEO', 'SEM', 'Google Analytics', 'Facebook Ads', 'Instagram Marketing',
      'Content Writing', 'Copywriting', 'Social Media Management', 'Email Marketing',
      'Google Ads', 'LinkedIn Marketing', 'YouTube Marketing', 'TikTok Marketing',
      'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer', 'Sprout Social', 'SEMrush',
      'Ahrefs', 'Moz', 'Google Tag Manager', 'Facebook Pixel', 'Conversion Tracking',
      'Influencer Marketing', 'Affiliate Marketing', 'Content Strategy', 'Brand Management'
    ]
  },
  
  business: {
    name: 'Business & Management',
    skills: [
      'Project Management', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Asana',
      'Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Microsoft Teams',
      'Confluence', 'Notion', 'Monday.com', 'Basecamp', 'Wrike', 'Smartsheet',
      'Process Improvement', 'Lean Six Sigma', 'Change Management', 'Risk Management',
      'Strategic Planning', 'Business Analysis', 'Operations Management', 'Supply Chain'
    ]
  },
  
  sales: {
    name: 'Sales & Customer Service',
    skills: [
      'Sales', 'Customer Service', 'CRM', 'Salesforce', 'HubSpot', 'Zendesk',
      'Lead Generation', 'Cold Calling', 'Email Outreach', 'Negotiation',
      'Pipedrive', 'Freshworks', 'Intercom', 'LiveChat', 'Drift', 'Calendly',
      'Sales Funnel', 'Lead Qualification', 'Account Management', 'Customer Success',
      'B2B Sales', 'B2C Sales', 'Inside Sales', 'Field Sales', 'Channel Sales'
    ]
  },
  
  finance: {
    name: 'Finance & Accounting',
    skills: [
      'QuickBooks', 'Excel', 'Financial Analysis', 'Bookkeeping', 'Tax Preparation',
      'Investment Analysis', 'Budgeting', 'Forecasting', 'SAP', 'Oracle Financials',
      'Xero', 'FreshBooks', 'Wave', 'Sage', 'Intuit', 'Financial Modeling',
      'Variance Analysis', 'Cost Accounting', 'Auditing', 'Compliance',
      'Corporate Finance', 'Investment Banking', 'Private Equity', 'Venture Capital'
    ]
  },
  
  healthcare: {
    name: 'Healthcare & Life Sciences',
    skills: [
      'Medical Research', 'Clinical Trials', 'Healthcare IT', 'Electronic Health Records',
      'HIPAA Compliance', 'Medical Coding', 'Pharmaceuticals', 'Biotechnology',
      'Healthcare Analytics', 'Telemedicine', 'Health Informatics', 'Medical Devices',
      'Regulatory Affairs', 'Quality Assurance', 'Good Manufacturing Practices',
      'Drug Development', 'Medical Writing', 'Clinical Data Management', 'Biostatistics'
    ]
  },
  
  education: {
    name: 'Education & Training',
    skills: [
      'Curriculum Development', 'Educational Technology', 'E-learning', 'LMS',
      'Instructional Design', 'Training Delivery', 'Assessment Design', 'Moodle',
      'Canvas', 'Blackboard', 'Google Classroom', 'Zoom Education', 'Coursera',
      'Udemy', 'Khan Academy', 'Student Management', 'Academic Research',
      'Online Learning', 'Blended Learning', 'Learning Analytics', 'Gamification'
    ]
  },
  
  legal: {
    name: 'Legal & Compliance',
    skills: [
      'Legal Research', 'Contract Review', 'Compliance Management', 'Risk Assessment',
      'Regulatory Compliance', 'Intellectual Property', 'Data Privacy', 'GDPR',
      'Legal Writing', 'Case Management', 'Document Review', 'Litigation Support',
      'Corporate Law', 'Employment Law', 'Real Estate Law', 'Immigration Law',
      'Patent Law', 'Trademark Law', 'Securities Law', 'Environmental Law'
    ]
  },
  
  cybersecurity: {
    name: 'Cybersecurity',
    skills: [
      'Cybersecurity', 'Information Security', 'Penetration Testing', 'Vulnerability Assessment',
      'Security Auditing', 'Incident Response', 'Threat Analysis', 'Risk Management',
      'Network Security', 'Application Security', 'Cloud Security', 'Identity Management',
      'SIEM', 'SOC', 'Firewall', 'VPN', 'Encryption', 'Malware Analysis',
      'Ethical Hacking', 'Digital Forensics', 'Security Architecture', 'Compliance'
    ]
  },
  
  emerging: {
    name: 'Emerging Technologies',
    skills: [
      'Blockchain', 'Cryptocurrency', 'NFT', 'Web3', 'DeFi', 'Smart Contracts',
      'IoT', 'Internet of Things', 'AR/VR', 'Augmented Reality', 'Virtual Reality',
      'Robotics', 'Automation', 'RPA', 'Quantum Computing', 'Edge Computing',
      '5G', '6G', 'Autonomous Vehicles', 'Drones', '3D Printing', 'Nanotechnology',
      'Metaverse', 'Digital Twins', 'Extended Reality', 'Mixed Reality'
    ]
  },
  
  softSkills: {
    name: 'Soft Skills',
    skills: [
      'Communication', 'Leadership', 'Problem Solving', 'Creativity', 'Time Management',
      'Teamwork', 'Adaptability', 'Critical Thinking', 'Emotional Intelligence',
      'Negotiation', 'Presentation Skills', 'Project Management', 'Customer Service',
      'Mentoring', 'Public Speaking', 'Conflict Resolution', 'Decision Making',
      'Strategic Thinking', 'Cross-cultural Communication', 'Networking', 'Self-motivation',
      'Attention to Detail', 'Multitasking', 'Stress Management', 'Active Listening',
      'Empathy', 'Patience', 'Flexibility', 'Innovation', 'Collaboration'
    ]
  },
  
  languages: {
    name: 'Languages',
    skills: [
      'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
      'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Hindi', 'Swahili',
      'Bengali', 'Turkish', 'Vietnamese', 'Polish', 'Thai', 'Greek', 'Hebrew',
      'Mandarin', 'Cantonese', 'Tagalog', 'Urdu', 'Persian', 'Malay', 'Indonesian'
    ]
  },
  
  industries: {
    name: 'Industry Knowledge',
    skills: [
      'Banking & Finance', 'Healthcare', 'Technology', 'Manufacturing', 'Retail',
      'Education', 'Government', 'Non-profit', 'Real Estate', 'Insurance',
      'Transportation', 'Energy', 'Telecommunications', 'Media & Entertainment',
      'Food & Beverage', 'Automotive', 'Aerospace', 'Pharmaceuticals', 'Consulting',
      'Legal Services', 'Construction', 'Agriculture', 'Tourism', 'Sports',
      'Fashion', 'Beauty', 'Gaming', 'E-commerce', 'SaaS', 'FinTech'
    ]
  }
};

// Flatten all skills for search
const ALL_SKILLS = Object.values(SKILLS_DATABASE).flatMap(category => category.skills);

const EXPERIENCE_LEVELS = [
  'Fresher', '0–6 months', '1 year', '2+ years'
];

const WORK_CULTURES = [
  'Collaborative', 'Fast-paced', 'Learning-focused', 'Innovative', 'Flexible', 'Formal'
];

const PERKS = [
  'Mentorship', 'Flexible Hours', 'Remote Work', 'Learning Resources', 
  'Certificate', 'PPO', 'Bonus', 'Meals', 'Team Events', 'Health Insurance', 'Other'
];

const HIRING_STAGES = [
  'Resume Screening', 'Technical Test', 'Interview', 'HR Round', 
  'Assignment', 'Group Discussion', 'Final Offer'
];

const PROCESS_DURATIONS = [
  '1–3 Days', '4–7 Days', '1–2 Weeks', '3–4 Weeks'
];

const INTERVIEW_PLATFORMS = [
  'Zoom', 'Google Meet', 'MS Teams', 'Skype', 'In-person', 'Other'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
  'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Hindi', 'Swahili', 
  'Bengali', 'Turkish', 'Vietnamese', 'Polish', 'Thai', 'Greek', 'Other'
];

// Comprehensive worldwide countries list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
];

// Major cities by country (sample of major cities for key countries)
const CITIES_BY_COUNTRY = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs', 'Raleigh', 'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Leicester', 'Coventry', 'Cardiff', 'Belfast', 'Nottingham', 'Hull', 'Newcastle', 'Stoke-on-Trent', 'Southampton', 'Derby', 'Portsmouth', 'Brighton', 'Plymouth', 'Northampton', 'Reading', 'Luton', 'Wolverhampton', 'Bolton', 'Bournemouth', 'Norwich', 'Swindon', 'Swansea', 'Southend-on-Sea', 'Middlesbrough', 'Peterborough', 'Huddersfield', 'York', 'Blackpool', 'Milton Keynes', 'Ipswich', 'West Bromwich', 'Watford', 'Slough', 'Oxford', 'Cambridge', 'Exeter', 'Gloucester', 'Preston', 'Blackburn', 'Oldham', 'Walsall'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'Sherbrooke', 'Kelowna', 'Barrie', 'Abbotsford', 'Sudbury', 'Kingston', 'Saguenay', 'Trois-Rivieres', 'Guelph', 'Cambridge', 'Whitehorse', 'Saint John', 'Thunder Bay', 'Chilliwack', 'Nanaimo', 'Kamloops', 'Red Deer', 'Lethbridge', 'Sarnia', 'Brantford', 'Saint-Jean-sur-Richelieu', 'Moncton', 'Fredericton', 'Chilliwack', 'Prince George', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Cochrane', 'St. Albert', 'Fort McMurray'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Hobart', 'Geelong', 'Townsville', 'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Albury', 'Launceston', 'Mackay', 'Rockhampton', 'Bundaberg', 'Coffs Harbour', 'Wagga Wagga', 'Hervey Bay', 'Mildura', 'Shepparton', 'Port Macquarie', 'Gladstone', 'Tamworth', 'Traralgon', 'Orange', 'Dubbo', 'Geraldton', 'Nowra', 'Warrnambool', 'Kalgoorlie', 'Bunbury', 'Bathurst', 'Warrnambool', 'Albany', 'Devonport', 'Burnie', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Broken Hill', 'Griffith', 'Goulburn'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Chemnitz', 'Kiel', 'Aachen', 'Halle', 'Magdeburg', 'Freiburg', 'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel', 'Hagen', 'Hamm', 'Saarbrücken', 'Mülheim', 'Potsdam', 'Ludwigshafen', 'Oldenburg', 'Leverkusen', 'Osnabrück', 'Solingen'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Saint-Denis', 'Le Mans', 'Aix-en-Provence', 'Clermont-Ferrand', 'Brest', 'Tours', 'Limoges', 'Amiens', 'Annecy', 'Perpignan', 'Boulogne-Billancourt', 'Orléans', 'Metz', 'Besançon', 'Saint-Denis', 'Rouen', 'Mulhouse', 'Caen', 'Nancy', 'Saint-Paul', 'Montreuil', 'Argenteuil', 'Roubaix', 'Dunkirk', 'Nanterre', 'Avignon', 'Créteil', 'Poitiers', 'Fort-de-France', 'Courbevoie'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Vijayawada', 'Kolhapur', 'Amritsar', 'Nashik', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Raipur', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Guwahati', 'Chandigarh'],
  'China': ['Shanghai', 'Beijing', 'Chongqing', 'Tianjin', 'Guangzhou', 'Shenzhen', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing', 'Xi\'an', 'Hangzhou', 'Foshan', 'Shenyang', 'Harbin', 'Qingdao', 'Dalian', 'Jinan', 'Zhengzhou', 'Changsha', 'Kunming', 'Changchun', 'Shijiazhuang', 'Nanchang', 'Fuzhou', 'Hefei', 'Ningbo', 'Shantou', 'Nanning', 'Xiamen', 'Taiyuan', 'Urumqi', 'Wuxi', 'Suzhou', 'Shantou', 'Zibo', 'Lanzhou', 'Yinchuan', 'Guiyang', 'Hohhot', 'Baotou', 'Anshan', 'Fushun', 'Benxi', 'Panjin', 'Tieling', 'Chaoyang', 'Jinzhou', 'Yingkou', 'Fuxin'],
  'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata', 'Hamamatsu', 'Kumamoto', 'Sagamihara', 'Okayama', 'Shizuoka', 'Hachioji', 'Honcho', 'Kagoshima', 'Niigata', 'Kanazawa', 'Nishinomiya', 'Toyonaka', 'Wakayama', 'Gifu', 'Toyota', 'Fukuyama', 'Asahikawa', 'Machida', 'Nara', 'Takatsuki', 'Iwaki', 'Nagano', 'Tottori', 'Mito', 'Fukushima', 'Utsunomiya', 'Matsuyama', 'Matsumoto', 'Kurashiki', 'Fuji', 'Soka', 'Kusatsu', 'Ichinomiya', 'Fujisawa'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém', 'Porto Alegre', 'Guarulhos', 'Campinas', 'São Luís', 'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina', 'Campo Grande', 'Nova Iguaçu', 'São Bernardo do Campo', 'João Pessoa', 'Santo André', 'Osasco', 'Jaboatão dos Guararapes', 'São José dos Campos', 'Jaboatão', 'Ribeirão Preto', 'Uberlândia', 'Sorocaba', 'Contagem', 'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Aparecida de Goiânia', 'Londrina', 'Ananindeua', 'Serra', 'Niterói', 'Caxias do Sul', 'Campos dos Goytacazes', 'Vila Velha', 'Florianópolis', 'Macapá', 'Diadema', 'São João de Meriti', 'Mauá'],
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Kilifi', 'Kericho', 'Bungoma', 'Kisii', 'Embu', 'Narok', 'Kitui', 'Machakos', 'Homa Bay', 'Wajir', 'Busia', 'Isiolo', 'Lamu', 'Mandera', 'Marsabit', 'Tana River', 'Taita-Taveta', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu', 'Turkana', 'West Pokot', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg', 'Nelspruit', 'Kimberley', 'Polokwane', 'Rustenburg', 'Welkom', 'Klerksdorp', 'Potchefstroom', 'Vereeniging', 'Soweto', 'Tembisa', 'Umlazi', 'Soshanguve', 'Diepsloot', 'Khayelitsha', 'Mitchells Plain', 'Gugulethu', 'Nyanga', 'Langa', 'Athlone', 'Bellville', 'Parow', 'Goodwood', 'Claremont', 'Observatory', 'Rondebosch', 'Newlands', 'Constantia', 'Hout Bay', 'Simon\'s Town', 'Fish Hoek', 'Kalk Bay', 'Muizenberg', 'Strand', 'Somerset West', 'Paarl', 'Stellenbosch', 'Franschhoek', 'Worcester', 'Robertson', 'Montagu', 'Barrydale', 'Ladismith'],
  'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Benin City', 'Port Harcourt', 'Jos', 'Ilorin', 'Abuja', 'Kaduna', 'Maiduguri', 'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Abeokuta', 'Sokoto', 'Onitsha', 'Warri', 'Calabar', 'Uyo', 'Akure', 'Bauchi', 'Katsina', 'Ado-Ekiti', 'Makurdi', 'Minna', 'Lokoja', 'Awka', 'Gombe', 'Yola', 'Jalingo', 'Keffi', 'Nnewi', 'Umuahia', 'Ikot Ekpene', 'Owo', 'Ikare', 'Saki', 'Iseyin', 'Ogbomoso', 'Ilesa', 'Ondo', 'Ado', 'Ikere', 'Ila', 'Ede', 'Iwo', 'Ejigbo', 'Ikirun'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El Mahalla El Kubra', 'Tanta', 'Asyut', 'Ismailia', 'Faiyum', 'Zagazig', 'Aswan', 'Damietta', 'Minya', 'Damanhur', 'Beni Suef', 'Hurghada', 'Qena', 'Sohag', '6th of October City', 'Shibin El Kom', 'Banha', 'Kafr el-Sheikh', 'Arish', 'Mallawi', '10th of Ramadan City', 'Bilbeis', 'Marsa Matruh', 'Kafr el-Dawwar', 'Qalyub', 'Desouk', 'Abu Kabir', 'Girga', 'Akhmim', 'Matareya', 'Qus', 'Tala', 'Samalut', 'Manfalut', 'Abnub', 'Abu Tig', 'El Fashn', 'El Qoseir', 'Ras Gharib', 'Safaga', 'El Tor', 'Sharm El Sheikh'],
  'Morocco': ['Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'Khouribga', 'Beni Mellal', 'El Jadida', 'Taza', 'Nador', 'Settat', 'Larache', 'Ksar El Kebir', 'Sale', 'Guelmim', 'Berrechid', 'Fquih Ben Salah', 'Taourirt', 'Berkane', 'Sidi Slimane', 'Errachidia', 'Sidi Kacem', 'Tiflet', 'Taroudant', 'Sefrou', 'Essaouira', 'Ouarzazate', 'Larache', 'Ksar El Kebir', 'Sale', 'Guelmim', 'Berrechid', 'Fquih Ben Salah', 'Taourirt', 'Berkane', 'Sidi Slimane', 'Errachidia', 'Sidi Kacem', 'Tiflet', 'Taroudant', 'Sefrou', 'Essaouira', 'Ouarzazate']
};

const RecruiterRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [availableCities, setAvailableCities] = useState([]);
  
  // Multi-select dropdown states
  const [dropdownStates, setDropdownStates] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Company Information
    companyName: userData.companyName || '',
    websiteURL: '',
    companyLinkedIn: '',
    industries: [],
    companySize: '',
    headquartersCountry: '',
    headquartersCity: '',
    operatingRegions: [],
    companyDescription: '',
    companyLogo: null,
    
    // Section 2: Recruiter/HR Details
    fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
    designation: '',
    officialEmail: userData.email || '',
    contactNumber: '',
    recruiterLinkedIn: '',
    preferredCommunication: '',
    
    // Section 3: Internship/Job Preferences
    positionTypes: [],
    workType: '',
    hiringDepartments: [],
    numberOfPositions: '',
    expectedStartDate: '',
    duration: '',
    compensationAmount: '',
    compensationCurrency: 'USD',
    applicationDeadline: '',
    workHours: '',
    
    // Section 4: Candidate Requirements
    preferredEducation: '',
    preferredFields: [],
    preferredSkills: [],
    preferredSoftSkills: [],
    internSearchKeywords: [], // New field for finding interns
    languageRequirements: [],
    minimumExperience: '',
    minimumAcademic: '',
    
    // Section 5: Company Policy & Benefits
    provideCertificate: '',
    offerStipend: '',
    stipendRange: '',
    provideLOR: '',
    offerPPO: '',
    workCulture: '',
    perks: [],
    
    // Section 6: Hiring Process
    hiringStages: [],
    processDuration: '',
    interviewMode: '',
    interviewPlatforms: []
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(1);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      navigate('/signup');
      return;
    }
  }, [navigate]);

  // Countdown for success redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/recruiter-dashboard');
    }
  }, [success, countdown, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [name]: newValues };
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountryChange = (country) => {
    setFormData(prev => ({
      ...prev,
      headquartersCountry: country,
      headquartersCity: '' // Reset city when country changes
    }));

    // Update available cities based on selected country
    const cities = CITIES_BY_COUNTRY[country] || [];
    // Remove duplicates and sort cities
    const uniqueCities = [...new Set(cities)].sort();
    setAvailableCities(uniqueCities);
  };

  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      headquartersCity: city
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, companyLogo: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Section 1 validations
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (formData.websiteURL && !/^https?:\/\/.+/.test(formData.websiteURL)) {
      newErrors.websiteURL = 'Please enter a valid URL';
    }
    if (formData.industries.length === 0) {
      newErrors.industries = 'Please select at least one industry';
    }
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    if (!formData.headquartersCountry.trim()) {
      newErrors.headquartersCountry = 'Headquarters country is required';
    }

    // Section 2 validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.officialEmail || !/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      newErrors.officialEmail = 'Valid email is required';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    // Section 3 validations
    if (formData.positionTypes.length === 0) {
      newErrors.positionTypes = 'Please select at least one position type';
    }
    if (!formData.workType) {
      newErrors.workType = 'Work type is required';
    }
    if (formData.hiringDepartments.length === 0) {
      newErrors.hiringDepartments = 'Please select at least one hiring department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare form data for submission
      const submissionData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          submissionData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== '') {
          submissionData.append(key, formData[key]);
        }
      });

      const response = await fetch(buildApiUrl('/api/recruiters/complete-profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submissionData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to save recruiter profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving recruiter profile:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/recruiter-dashboard');
  };

  const renderMultiSelect = (name, options, label, icon) => (
    <div className="form-group">
      <label className="form-label">
        <FontAwesomeIcon icon={icon} />
        {label} {errors[name] && <span className="required-star">*</span>}
      </label>
      <div className="multi-select-container">
        {options.map(option => (
          <label key={option} className="checkbox-label">
            <input
              type="checkbox"
              checked={formData[name]?.includes(option)}
              onChange={() => handleMultiSelectChange(name, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  const renderMultiSelectDropdown = (name, label, icon, placeholder, helpText, database = SKILLS_DATABASE, allItems = ALL_SKILLS) => {
    const dropdownKey = `${name}_dropdown`;
    const isOpen = dropdownStates[`${dropdownKey}_isOpen`] || false;
    const searchTerm = dropdownStates[`${dropdownKey}_searchTerm`] || '';
    const selectedCategory = dropdownStates[`${dropdownKey}_selectedCategory`] || 'all';

    // Filter items based on search term and category
    const getFilteredItems = () => {
      let items = allItems;
      
      if (selectedCategory !== 'all') {
        items = database[selectedCategory]?.skills || database[selectedCategory]?.keywords || [];
      }
      
      if (searchTerm) {
        items = items.filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return items.slice(0, 50); // Limit to 50 suggestions
    };

    const toggleItem = (item) => {
      const currentItems = formData[name] || [];
      const newItems = currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : [...currentItems, item];
      
      setFormData(prev => ({ ...prev, [name]: newItems }));
    };

    const removeItem = (item) => {
      setFormData(prev => ({
        ...prev,
        [name]: (prev[name] || []).filter(i => i !== item)
      }));
    };

    const setIsOpen = (value) => {
      setDropdownStates(prev => ({ ...prev, [`${dropdownKey}_isOpen`]: value }));
    };

    const setSearchTerm = (value) => {
      setDropdownStates(prev => ({ ...prev, [`${dropdownKey}_searchTerm`]: value }));
    };

    const setSelectedCategory = (value) => {
      setDropdownStates(prev => ({ ...prev, [`${dropdownKey}_selectedCategory`]: value }));
    };

    return (
      <div className="form-group">
        <label className="form-label">
          <FontAwesomeIcon icon={icon} />
          {label} {errors[name] && <span className="required-star">*</span>}
        </label>
        <div className="multi-select-container">
          <div className="multi-select-wrapper">
            <div 
              className="multi-select-trigger"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="multi-select-placeholder">
                {formData[name]?.length > 0 
                  ? `${formData[name].length} selected` 
                  : placeholder
                }
              </span>
              <FontAwesomeIcon 
                icon={isOpen ? faTimesCircle : faCheckCircle} 
                className="multi-select-arrow"
              />
            </div>

            {isOpen && (
              <div className="multi-select-dropdown">
                {/* Search and Category Filter */}
                <div className="multi-select-header">
                  <input
                    type="text"
                    className="multi-select-search"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="multi-select-category"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(database).map(([key, category]) => (
                      <option key={key} value={key}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Items List */}
                <div className="multi-select-items">
                  {getFilteredItems().map(item => (
                    <div
                      key={item}
                      className={`multi-select-item ${formData[name]?.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleItem(item)}
                    >
                      <input
                        type="checkbox"
                        checked={formData[name]?.includes(item) || false}
                        onChange={() => {}}
                        className="multi-select-checkbox"
                      />
                      <span className="multi-select-item-text">{item}</span>
                    </div>
                  ))}
                  {getFilteredItems().length === 0 && (
                    <div className="multi-select-no-results">
                      No skills found. Try a different search term or category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selected Items Tags */}
          {formData[name]?.length > 0 && (
            <div className="multi-select-tags">
              {formData[name].map((item, index) => (
                <span key={index} className="multi-select-tag">
                  {item}
                  <button
                    type="button"
                    className="multi-select-remove"
                    onClick={() => removeItem(item)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {helpText && <small className="help-text">{helpText}</small>}
        </div>
        {errors[name] && <span className="error-text">{errors[name]}</span>}
      </div>
    );
  };

  const renderCountryCityDropdowns = () => (
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          Headquarters Country <span className="required-star">*</span>
        </label>
        <select
          className="form-select"
          value={formData.headquartersCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="">Select Country</option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.headquartersCountry && <span className="error-text">{errors.headquartersCountry}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          Headquarters City
        </label>
             <select
               className="form-select"
               value={formData.headquartersCity}
               onChange={(e) => handleCityChange(e.target.value)}
               disabled={!formData.headquartersCountry}
             >
               <option value="">Select City</option>
               {availableCities.map((city, index) => (
                 <option key={`${city}-${index}`} value={city}>{city}</option>
               ))}
             </select>
        {!formData.headquartersCountry && (
          <small className="help-text">Please select a country first</small>
        )}
        {errors.headquartersCity && <span className="error-text">{errors.headquartersCity}</span>}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="recruiter-reg-wrapper">
        <div className="success-container">
          <div className="success-icon-wrapper">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          </div>
          <h2>Profile Completed Successfully!</h2>
          <p>Your comprehensive recruiter profile has been saved.</p>
          <p>Redirecting to dashboard in {countdown} seconds...</p>
          <div className="success-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((3 - countdown) / 3) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-reg-wrapper">
      <header className="recruiter-reg-header">
        <div className="header-container">
          <div className="logo-section">
            <FontAwesomeIcon icon={faRocket} className="logo-icon" />
            <div className="logo-text">
              <div className="logo-title">AksharJobs</div>
              <div className="logo-subtitle">Comprehensive Recruiter Registration</div>
            </div>
          </div>
          <button onClick={() => navigate('/signup')} className="btn-back">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
        </div>
      </header>

      <main className="recruiter-reg-main">
        <div className="recruiter-reg-container">
          {/* Section Navigation */}
          <div className="section-nav">
            {[
              { id: 1, title: 'Company Info', icon: faBuilding },
              { id: 2, title: 'Your Details', icon: faUser },
              { id: 3, title: 'Job Preferences', icon: faBriefcase },
              { id: 4, title: 'Requirements', icon: faGraduationCap },
              { id: 5, title: 'Benefits', icon: faAward },
              { id: 6, title: 'Hiring Process', icon: faClipboardCheck }
            ].map(section => (
              <button
                key={section.id}
                className={`section-nav-btn ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <FontAwesomeIcon icon={section.icon} />
                <span>{section.title}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="error-banner">
              <FontAwesomeIcon icon={faTimesCircle} />
              {error}
            </div>
          )}

          <form className="recruiter-reg-form" onSubmit={handleSubmit}>
            {/* SECTION 1: COMPANY INFORMATION */}
            {activeSection === 1 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faBuilding} />
                  <h2>Company Information</h2>
                  <p>Tell us about your company</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBuilding} />
                    Company Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    className={`form-input ${errors.companyName ? 'error' : ''}`}
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                  {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faGlobe} />
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="websiteURL"
                      className={`form-input ${errors.websiteURL ? 'error' : ''}`}
                      placeholder="https://www.yourcompany.com"
                      value={formData.websiteURL}
                      onChange={handleInputChange}
                    />
                    {errors.websiteURL && <span className="error-text">{errors.websiteURL}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faLinkedin} />
                      Company LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="companyLinkedIn"
                      className="form-input"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.companyLinkedIn}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {renderMultiSelect('industries', INDUSTRIES, 'Industry / Sector', faIndustry)}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faUsers} />
                      Company Size <span className="required-star">*</span>
                    </label>
                    <select
                      name="companySize"
                      className={`form-input ${errors.companySize ? 'error' : ''}`}
                      value={formData.companySize}
                      onChange={handleInputChange}
                    >
                      <option value="">Select company size</option>
                      {COMPANY_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    {errors.companySize && <span className="error-text">{errors.companySize}</span>}
                  </div>

                  {renderCountryCityDropdowns()}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faFileAlt} />
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    className="form-input"
                    rows="4"
                    maxLength="500"
                    placeholder="Tell us about your company, mission, and culture... (max 500 characters)"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                  />
                  <small className="char-count">{formData.companyDescription.length}/500</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBuilding} />
                    Upload Company Logo (PNG/JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="form-input-file"
                  />
                </div>

                <div className="section-footer">
                  <button type="button" className="btn-next" onClick={() => setActiveSection(2)}>
                    Next: Your Details
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: RECRUITER/HR DETAILS */}
            {activeSection === 2 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faUser} />
                  <h2>Recruiter / HR Details</h2>
                  <p>Your professional information</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} />
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBriefcase} />
                    Designation / Role <span className="required-star">*</span>
                  </label>
                  <select
                    name="designation"
                    className={`form-input ${errors.designation ? 'error' : ''}`}
                    value={formData.designation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your designation</option>
                    {DESIGNATIONS.map(des => (
                      <option key={des} value={des}>{des}</option>
                    ))}
                  </select>
                  {errors.designation && <span className="error-text">{errors.designation}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faEnvelope} />
                      Official Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      name="officialEmail"
                      className={`form-input ${errors.officialEmail ? 'error' : ''}`}
                      placeholder="your.email@company.com"
                      value={formData.officialEmail}
                      onChange={handleInputChange}
                    />
                    {errors.officialEmail && <span className="error-text">{errors.officialEmail}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faPhone} />
                      Contact Number <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      className={`form-input ${errors.contactNumber ? 'error' : ''}`}
                      placeholder="+254 XXX XXX XXX"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                    {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faLinkedin} />
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="recruiterLinkedIn"
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.recruiterLinkedIn}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Preferred Communication Mode
                  </label>
                  <select
                    name="preferredCommunication"
                    className="form-input"
                    value={formData.preferredCommunication}
                    onChange={handleInputChange}
                  >
                    <option value="">Select preferred mode</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="section-footer">
                  <button type="button" className="btn-prev" onClick={() => setActiveSection(1)}>
                    Previous
                  </button>
                  <button type="button" className="btn-next" onClick={() => setActiveSection(3)}>
                    Next: Job Preferences
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: INTERNSHIP/JOB PREFERENCES */}
            {activeSection === 3 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <h2>Internship / Job Preferences</h2>
                  <p>Define the positions you're hiring for</p>
                </div>

                {renderMultiSelect('positionTypes', POSITION_TYPES, 'Position Type', faBriefcase)}

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faLaptopHouse} />
                    Work Type <span className="required-star">*</span>
                  </label>
                  <select
                    name="workType"
                    className={`form-input ${errors.workType ? 'error' : ''}`}
                    value={formData.workType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select work type</option>
                    {WORK_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.workType && <span className="error-text">{errors.workType}</span>}
                </div>

                {renderMultiSelect('hiringDepartments', HIRING_DEPARTMENTS, 'Hiring Departments / Roles', faBriefcase)}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faUsers} />
                      Number of Positions Available
                    </label>
                    <input
                      type="number"
                      name="numberOfPositions"
                      className="form-input"
                      placeholder="e.g., 5"
                      min="1"
                      value={formData.numberOfPositions}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      Expected Start Date
                    </label>
                    <input
                      type="date"
                      name="expectedStartDate"
                      className="form-input"
                      value={formData.expectedStartDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faClock} />
                      Duration (for Internships)
                    </label>
                    <select
                      name="duration"
                      className="form-input"
                      value={formData.duration}
                      onChange={handleInputChange}
                    >
                      <option value="">Select duration</option>
                      {DURATIONS.map(dur => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      className="form-input"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faDollarSign} />
                      Compensation / Salary Offered
                    </label>
                    <input
                      type="number"
                      name="compensationAmount"
                      className="form-input"
                      placeholder="Enter amount"
                      min="0"
                      value={formData.compensationAmount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faDollarSign} />
                      Currency
                    </label>
                    <select
                      name="compensationCurrency"
                      className="form-input"
                      value={formData.compensationCurrency}
                      onChange={handleInputChange}
                    >
                      {CURRENCIES.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faClock} />
                    Work Hours
                  </label>
                  <select
                    name="workHours"
                    className="form-input"
                    value={formData.workHours}
                    onChange={handleInputChange}
                  >
                    <option value="">Select work hours</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div className="section-footer">
                  <button type="button" className="btn-prev" onClick={() => setActiveSection(2)}>
                    Previous
                  </button>
                  <button type="button" className="btn-next" onClick={() => setActiveSection(4)}>
                    Next: Requirements
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 4: CANDIDATE REQUIREMENTS */}
            {activeSection === 4 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <h2>Candidate Requirements</h2>
                  <p>Define your ideal candidate profile</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    Preferred Education Level
                  </label>
                  <select
                    name="preferredEducation"
                    className="form-input"
                    value={formData.preferredEducation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select education level</option>
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {renderMultiSelect('preferredFields', FIELDS_OF_STUDY, 'Preferred Fields of Study', faGraduationCap)}

                {renderMultiSelectDropdown('preferredSkills', 'Preferred Skills', faTags, 'Select preferred skills...', 'Choose the skills you prefer in candidates', SKILLS_DATABASE, ALL_SKILLS)}
                
                {renderMultiSelectDropdown('internSearchKeywords', 'Keywords to Find Interns', faSearch, 'Select keywords to find interns...', 'Use these keywords to find the best interns for your opportunities', KEYWORD_DATABASE, ALL_KEYWORDS)}

                {renderMultiSelect('preferredSoftSkills', SOFT_SKILLS, 'Preferred Soft Skills', faHandshake)}

                {renderMultiSelect('languageRequirements', LANGUAGES, 'Language Requirements', faLanguage)}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBriefcase} />
                      Minimum Experience
                    </label>
                    <select
                      name="minimumExperience"
                      className="form-input"
                      value={formData.minimumExperience}
                      onChange={handleInputChange}
                    >
                      <option value="">Select experience level</option>
                      {EXPERIENCE_LEVELS.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faAward} />
                      Minimum Academic Performance
                    </label>
                    <input
                      type="text"
                      name="minimumAcademic"
                      className="form-input"
                      placeholder="e.g., CGPA 7.0+, 70%+"
                      value={formData.minimumAcademic}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="section-footer">
                  <button type="button" className="btn-prev" onClick={() => setActiveSection(3)}>
                    Previous
                  </button>
                  <button type="button" className="btn-next" onClick={() => setActiveSection(5)}>
                    Next: Benefits
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 5: COMPANY POLICY & BENEFITS */}
            {activeSection === 5 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faAward} />
                  <h2>Company Policy & Benefits</h2>
                  <p>What you offer to candidates</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Provide Internship Certificates?
                    </label>
                    <select
                      name="provideCertificate"
                      className="form-input"
                      value={formData.provideCertificate}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faDollarSign} />
                      Offer Stipends or Salaries?
                    </label>
                    <select
                      name="offerStipend"
                      className="form-input"
                      value={formData.offerStipend}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {formData.offerStipend === 'Yes' && (
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faDollarSign} />
                      Average Stipend/Salary Range
                    </label>
                    <input
                      type="text"
                      name="stipendRange"
                      className="form-input"
                      placeholder="e.g., $500-$1000, KES 20,000-50,000"
                      value={formData.stipendRange}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faFileAlt} />
                      Provide Letters of Recommendation (LOR)?
                    </label>
                    <select
                      name="provideLOR"
                      className="form-input"
                      value={formData.provideLOR}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faHandshake} />
                      Offer Pre-Placement Offers (PPO)?
                    </label>
                    <select
                      name="offerPPO"
                      className="form-input"
                      value={formData.offerPPO}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBuilding} />
                    Work Culture
                  </label>
                  <select
                    name="workCulture"
                    className="form-input"
                    value={formData.workCulture}
                    onChange={handleInputChange}
                  >
                    <option value="">Select work culture</option>
                    {WORK_CULTURES.map(culture => (
                      <option key={culture} value={culture}>{culture}</option>
                    ))}
                  </select>
                </div>

                {renderMultiSelect('perks', PERKS, 'Perks / Benefits', faAward)}

                <div className="section-footer">
                  <button type="button" className="btn-prev" onClick={() => setActiveSection(4)}>
                    Previous
                  </button>
                  <button type="button" className="btn-next" onClick={() => setActiveSection(6)}>
                    Next: Hiring Process
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: HIRING PROCESS */}
            {activeSection === 6 && (
              <div className="form-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faClipboardCheck} />
                  <h2>Hiring Process</h2>
                  <p>How you evaluate candidates</p>
                </div>

                {renderMultiSelect('hiringStages', HIRING_STAGES, 'Stages in Hiring Process', faClipboardCheck)}

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faClock} />
                    Average Duration of Process
                  </label>
                  <select
                    name="processDuration"
                    className="form-input"
                    value={formData.processDuration}
                    onChange={handleInputChange}
                  >
                    <option value="">Select duration</option>
                    {PROCESS_DURATIONS.map(dur => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faLaptopHouse} />
                    Mode of Interview
                  </label>
                  <select
                    name="interviewMode"
                    className="form-input"
                    value={formData.interviewMode}
                    onChange={handleInputChange}
                  >
                    <option value="">Select interview mode</option>
                    <option value="Online">Online</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {renderMultiSelect('interviewPlatforms', INTERVIEW_PLATFORMS, 'Preferred Interview Platforms', faLaptopHouse)}

                <div className="section-footer final-section">
                  <button type="button" className="btn-prev" onClick={() => setActiveSection(5)}>
                    Previous
                  </button>
                  <button type="button" className="btn-skip" onClick={handleSkip}>
                    Skip for Now
                  </button>
                  <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner-small"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} />
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default RecruiterRegistrationForm;

