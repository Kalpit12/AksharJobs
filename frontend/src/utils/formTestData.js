// Test data for Recruiter Registration Form
export const testRecruiterData = {
  // Company Information
  companyName: "Tech Solutions Inc",
  companyEmail: "hr@techsolutions.com",
  companyPhone: "+254 700 123 456",
  companySize: "50-100",
  yearFounded: "2015",
  industry: "Technology",
  companyDescription: "Leading technology solutions provider specializing in software development and digital transformation.",
  
  // Location
  country: "Kenya",
  state: "Nairobi",
  city: "Nairobi",
  address: "Westlands, Nairobi",
  latitude: -1.2921,
  longitude: 36.8219,
  
  // Recruiter Personal Details
  firstName: "John",
  lastName: "Doe",
  jobTitle: "Senior HR Manager",
  recruiterPhone: "+254 700 987 654",
  recruiterEmail: "john.doe@techsolutions.com",
  
  // Recruitment Specialization
  industries: ["Technology", "Software Development", "IT Services"],
  functions: ["Software Engineering", "Product Management", "Data Science"],
  recruitCountries: ["Kenya", "Uganda", "Tanzania"],
  
  // Services & Offerings
  employmentTypes: ["full-time", "contract"],
  additionalServices: ["background-checks", "skill-assessment"],
  
  // Social Media
  linkedinUrl: "https://linkedin.com/company/techsolutions",
  facebookUrl: "https://facebook.com/techsolutions",
  twitterUrl: "https://twitter.com/techsolutions",
  
  // Additional Links
  additionalLinks: [
    { type: "Website", url: "https://techsolutions.com" },
    { type: "Portfolio", url: "https://portfolio.techsolutions.com" }
  ],
  
  // Terms & Agreements
  offersRemote: true,
  agreeTerms: true,
  agreeDataProcessing: true,
  verifyInfo: true
};

// Function to validate form data structure
export const validateFormData = (formData) => {
  const requiredFields = [
    'companyName', 'companyEmail', 'companyPhone', 'companySize',
    'yearFounded', 'industry', 'companyDescription', 'country',
    'state', 'city', 'address', 'firstName', 'lastName',
    'jobTitle', 'recruiterPhone', 'recruiterEmail'
  ];
  
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    totalFields: requiredFields.length,
    filledFields: requiredFields.length - missingFields.length
  };
};

// Function to generate test form data
export const generateTestData = () => {
  return {
    ...testRecruiterData,
    // Add some randomization for testing
    companyName: `Test Company ${Math.floor(Math.random() * 1000)}`,
    companyEmail: `test${Math.floor(Math.random() * 1000)}@example.com`,
    recruiterEmail: `recruiter${Math.floor(Math.random() * 1000)}@example.com`
  };
};
