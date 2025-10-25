// Comprehensive form options for job and internship posting

export const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" }
];

export const industries = [
  "Accounting", "Advertising", "Aerospace & Defense", "Agriculture", "Airlines/Aviation", "Alternative Dispute Resolution",
  "Alternative Medicine", "Animation", "Apparel & Fashion", "Architecture & Planning", "Arts & Crafts", "Automotive",
  "Aviation & Aerospace", "Banking", "Biotechnology", "Broadcast Media", "Building Materials", "Business Supplies & Equipment",
  "Capital Markets", "Chemicals", "Civic & Social Organization", "Civil Engineering", "Commercial Real Estate", "Computer & Network Security",
  "Computer Games", "Computer Hardware", "Computer Networking", "Computer Software", "Construction", "Consumer Electronics",
  "Consumer Goods", "Consumer Services", "Cosmetics", "Dairy", "Defense & Space", "Design", "E-Learning",
  "Education Management", "Electrical/Electronic Manufacturing", "Entertainment", "Environmental Services", "Events Services",
  "Executive Office", "Facilities Services", "Farming", "Financial Services", "Fine Art", "Fishery", "Food & Beverages",
  "Food Production", "Fundraising", "Furniture", "Gambling & Casinos", "Glass, Ceramics & Concrete", "Government Administration",
  "Government Relations", "Graphic Design", "Health, Wellness & Fitness", "Higher Education", "Hospital & Health Care",
  "Hospitality", "Human Resources", "Import & Export", "Individual & Family Services", "Industrial Automation", "Information Services",
  "Information Technology & Services", "Insurance", "International Affairs", "International Trade & Development", "Internet",
  "Investment Banking", "Investment Management", "Judiciary", "Law Enforcement", "Law Practice", "Legal Services",
  "Legislative Office", "Leisure, Travel & Tourism", "Libraries", "Logistics & Supply Chain", "Luxury Goods & Jewelry",
  "Machinery", "Management Consulting", "Maritime", "Market Research", "Marketing & Advertising", "Mechanical or Industrial Engineering",
  "Media Production", "Medical Devices", "Medical Practice", "Mental Health Care", "Military", "Mining & Metals",
  "Motion Pictures & Film", "Museums & Institutions", "Music", "Nanotechnology", "Newspapers", "Non-Profit Organization Management",
  "Oil & Energy", "Online Media", "Outsourcing/Offshoring", "Package/Freight Delivery", "Packaging & Containers", "Paper & Forest Products",
  "Performing Arts", "Pharmaceuticals", "Philanthropy", "Photography", "Plastics", "Political Organization", "Primary/Secondary Education",
  "Printing", "Professional Training & Coaching", "Program Development", "Public Policy", "Public Relations & Communications",
  "Public Safety", "Publishing", "Railroad Manufacture", "Ranching", "Real Estate", "Recreational Facilities & Services",
  "Religious Institutions", "Renewables & Environment", "Research", "Restaurants", "Retail", "Security & Investigations",
  "Semiconductors", "Shipbuilding", "Sporting Goods", "Sports", "Staffing & Recruiting", "Supermarkets", "Telecommunications",
  "Textiles", "Think Tanks", "Tobacco", "Translation & Localization", "Transportation/Trucking/Railroad", "Utilities",
  "Venture Capital & Private Equity", "Veterinary", "Warehousing", "Wholesale", "Wine & Spirits", "Wireless", "Writing & Editing"
];

export const departments = [
  "Accounting & Finance", "Administrative", "Analytics", "Art/Creative", "Business Development", "Community & Social Services",
  "Consulting", "Customer Service", "Design", "Distribution & Logistics", "Education", "Engineering",
  "Entrepreneurship", "Finance", "Healthcare Services", "Human Resources", "Information Technology", "Legal",
  "Management", "Manufacturing", "Marketing", "Media & Communication", "Military & Protective Services", "Operations",
  "Product Management", "Program & Project Management", "Purchasing", "Quality Assurance", "Real Estate", "Research",
  "Sales", "Science", "Strategy/Planning", "Supply Chain", "Support"
];

// Comprehensive Global Skills List
export const allSkills = [
  "3D Modeling", "A/B Testing", "Accounting Principles", "Accounting Software", "Acoustics", "Active Listening", 
  "Adaptability", "Adobe Creative Suite", "Adult Learning Theory", "Agile/Scrum", "Agricultural Practices", 
  "Aircraft Operation", "Algorithms", "Analysis", "Anatomy Knowledge", "Animal Medicine", "API Development", 
  "Architectural Design", "Artificial Intelligence", "Assessment", "Assessment Design", "ATS Software", 
  "Attention to Detail", "Audio Editing", "Audio Equipment", "Audio Mixing", "Auditing", "AutoCAD", 
  "Aviation Regulations", "AWS/Azure/GCP", "Backup/Recovery", "Banking Regulations", "Benefits Administration", 
  "Big Data", "Bioinformatics", "Biotechnology", "Blockchain", "Blueprint Reading", "Bookkeeping", 
  "Brand Guidelines", "Brand Management", "Brand Strategy", "Brand Voice", "Budget Management", "Budgeting", 
  "Building Codes", "Building Systems", "CAD Software", "Call Center Metrics", "Campaign Management", 
  "Campaign Planning", "Candidate Assessment", "Capital Markets", "Care Planning", "Career Counseling", 
  "Case Analysis", "Case Management", "Cash Handling", "Change Management", "Chemical Analysis", 
  "Circuit Analysis", "Circuit Design", "Classroom Management", "Client Counseling", "Client Communication", 
  "Client Relations", "Clinical Knowledge", "Closing", "Cloud Computing", "CMS Platforms", "Color Correction", 
  "Color Theory", "Communication", "Communication Strategy", "Community Engagement", "Community Management", 
  "Community Relations", "Compassion", "Compensation Analysis", "Compliance", "Computer Skills", "Confidentiality", 
  "Conflict Resolution", "Construction Knowledge", "Construction Materials", "Construction Methods", 
  "Content Creation", "Content Marketing", "Content Strategy", "Continuous Learning", "Contract Knowledge", 
  "Contract Management", "Contract Negotiation", "Cooking Techniques", "Copywriting", "Cost Analysis", 
  "Cost Control", "Cost Estimation", "Cost Management", "Counseling", "Creativity", "Credit Analysis", 
  "Crisis Intervention", "Crisis Management", "Critical Thinking", "CRM Software", "Crop Management", 
  "Crop Science", "Cryptography", "Cultural Competence", "Cultural Sensitivity", "Curriculum Design", 
  "Curriculum Development", "Customer Service", "Cybersecurity Awareness", "Data Analysis", "Data Collection", 
  "Data Interpretation", "Data Science", "Data Security", "Data Structures", "Data Visualization", 
  "Database Design", "Database Management", "Deadline Management", "Deadlines", "Debugging", "Decision Making", 
  "Design Systems", "Design Thinking", "Diagnosis", "Digital Literacy", "Digital Marketing", "Digital Media", 
  "Display Design", "Docker", "Documentation", "Document Preparation", "DOT Regulations", "Donor Relations", 
  "E-learning", "E-learning Development", "Economics", "Editing", "Education Law", "Efficiency Standards", 
  "Electrical Codes", "Electrical Installation", "Electrical Systems", "Email Marketing", "Emergency Procedures", 
  "Emergency Response", "Emotional Intelligence", "Empathy", "Employee Relations", "Energy Analysis", 
  "Engineering Design", "Environmental Assessment", "Equipment Design", "Equipment Operation", "Equipment Repair", 
  "ERP Systems", "Ethics", "Ethical Hacking", "Evaluation", "Event Coordination", "Event Planning", "Excel", 
  "Experimentation", "Facilitation", "Fact Checking", "FEA", "Field Testing", "Field Work", "Figma/Sketch", 
  "File Management", "Filing", "Financial Analysis", "Financial Modeling", "Financial Reporting", 
  "Financial Statement Analysis", "First Aid", "Food Safety", "Forecasting", "Fundraising Strategy", 
  "GAAP/IFRS", "GIS", "Git", "Google Analytics", "Government Processes", "GPS Navigation", "Grammar", 
  "Grant Writing", "Graphic Design", "Hand/Power Tools", "Healthcare Management", "Healthcare Regulations", 
  "HRIS", "HTML/CSS", "Incident Response", "Industry Research", "Infrastructure as Code", "Innovation", 
  "Inspection", "Instrumentation", "Internet of Things (IoT)", "Interpersonal Skills", "Interviewing", 
  "Inventory Management", "Inventory Optimization", "Investigation", "Investment Analysis", "Irrigation Systems", 
  "ISO Standards", "Java", "Kitchen Management", "Kubernetes", "Lab Equipment Operation", "Labor Law", 
  "Laboratory Testing", "Laboratory Techniques", "Language Skills", "Layout Design", "Leadership", 
  "Lean Manufacturing", "Learning Management Systems", "Lease Management", "Leasing", "Legal Knowledge", 
  "Legal Research", "Legal Software", "Legal Terminology", "Legal Writing", "Lesson Planning", "Linux", 
  "Listening", "Literature Review", "Litigation", "Livestock Management", "Local Knowledge", "Lodash", 
  "Logistics", "M&A Analysis", "Machine Learning", "Maintenance", "Manual Dexterity", "Manual Therapy", 
  "Manufacturing Processes", "Market Analysis", "Market Knowledge", "Market Research", "Marketing", 
  "Marketing Automation", "Marketing Strategy", "Materials Science", "Mathematics", "Mechanical Design", 
  "Mechanical Systems", "Media Relations", "Medical Diagnosis", "Medical Equipment", "Medical Ethics", 
  "Medication Administration", "Menu Planning", "Merchandise Display", "Microscopy", "Molecular Biology", 
  "Monitoring", "Motion Graphics", "Multitasking", "Music Theory", "MySQL/PostgreSQL/MongoDB", "Navigation", 
  "Needs Analysis", "Negotiation", "Network Security", "Networking", "News Judgment", "Office Software", 
  "Operations Management", "Operations Research", "Organization", "Pain Management", "Papaparse", 
  "Patient Assessment", "Patient Care", "Patient Evaluation", "Patience", "Penetration Testing", 
  "Performance Management", "Performance Tuning", "Pest Management", "Phone Etiquette", "Photography", 
  "Physical Stamina", "Planning", "Policy Development", "Policy Research", "POS Systems", "Power Systems", 
  "PowerPoint", "Presentation", "Preventive Maintenance", "Print Production", "Problem Solving", 
  "Process Improvement", "Process Optimization", "Product Knowledge", "Production Planning", "Program Knowledge", 
  "Program Management", "Programming (Python, Java, C++)", "Project Management", "Project Planning", 
  "Property Maintenance", "Property Valuation", "Prospecting", "Prototyping", "Public Speaking", "Python", 
  "Quality Assurance", "Quality Control", "Quality Standards", "Quantum Computing", "R", "Record Keeping", 
  "Recruitment", "Regulations", "Regulatory Compliance", "Regulatory Knowledge", "Rehabilitation", 
  "Relationship Building", "Remote Collaboration", "Remote Support Tools", "Renewable Energy", "Replication", 
  "Report Writing", "Reporting", "Research", "Research Methodology", "Reservation Systems", "Resource Coordination", 
  "Retail Operations", "Retail Trends", "Revenue Management", "Risk Assessment", "Risk Management", 
  "Risk Modeling", "Root Cause Analysis", "Route Planning", "Safe Driving", "Safety Awareness", 
  "Safety Management", "Safety Procedures", "Safety Protocols", "Safety Regulations", "Safety Standards", 
  "Sales", "Scheduling", "Scheduling Tools", "Scientific Writing", "Scripting", "Security", "Security Frameworks", 
  "SEM", "SEO", "SheetJS", "SIEM Tools", "Simulation", "Site Analysis", "Site Supervision", "Six Sigma", 
  "Social Media", "Social Media Marketing", "Social Media Strategy", "Software Design", "Software Systems", 
  "Soil Analysis", "Soil Science", "Sound Recording", "Sourcing", "Space Planning", "Specimen Collection", 
  "SQL", "Staff Management", "Staff Supervision", "Stakeholder Engagement", "Stakeholder Management", 
  "Stakeholder Relations", "Statistical Analysis", "Statistical Process Control", "Statistics", "Storytelling", 
  "Strategic Planning", "Stress Management", "Structural Design", "Student Advising", "Student Engagement", 
  "Subject Expertise", "Supply Chain", "Supply Chain Management", "Supply Chain Strategy", "Surgery", 
  "Sustainability", "Sustainability Practices", "Tax Preparation", "Teamwork", "Technical Documentation", 
  "Technical Drawing", "Technical Knowledge", "Technical Support", "Technical Troubleshooting", "Technical Writing", 
  "Technology Integration", "Tenant Relations", "TensorFlow/PyTorch", "Testing", "Testing Methods", 
  "Thermodynamics", "Threat Analysis", "Time Management", "Training", "Training Design", "Transcription", 
  "Transportation Planning", "Treatment Planning", "Trend Awareness", "Trend Forecasting", "Troubleshooting", 
  "Typography", "Urban Design", "User Research", "User Testing", "Valuation", "Vehicle Maintenance", 
  "Vendor Management", "Vendor Relations", "Video Editing Software", "Visual Design", "Visual Merchandising", 
  "Vital Signs Monitoring", "Volunteer Management", "Warehouse Operations", "Weather Analysis", 
  "Weather Monitoring", "Web Design", "Wireframing", "Wiring", "WMS Software", "Work Ethic", "Writing", "Zoning"
];

export const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Temporary", "Internship"];

export const workModes = ["On-site", "Hybrid", "Remote"];

export const experienceLevels = [
  "Entry Level (0-1 years)",
  "Mid Level (2-5 years)",
  "Senior Level (5-10 years)",
  "Lead/Manager (8+ years)",
  "Director (10+ years)",
  "Executive/C-Level (15+ years)"
];

export const educationLevels = [
  "Any",
  "High School Diploma",
  "Diploma/Certificate",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD/Doctorate",
  "Professional Certification"
];

export const benefits = [
  "Health Insurance", "Dental Insurance", "Vision Insurance", "Life Insurance",
  "Disability Insurance", "Retirement Plan (401k)", "Pension Plan",
  "Performance Bonus", "Annual Bonus", "Stock Options", "Profit Sharing",
  "Paid Time Off (PTO)", "Vacation Days", "Sick Leave", "Parental Leave",
  "Maternity Leave", "Paternity Leave", "Sabbatical", "Mental Health Days",
  "Flexible Work Hours", "Remote Work Options", "Work From Home",
  "Relocation Assistance", "Housing Allowance", "Transportation Allowance",
  "Gym Membership", "Wellness Programs", "Employee Assistance Program (EAP)",
  "Professional Development", "Training Budget", "Conference Attendance",
  "Tuition Reimbursement", "Certification Programs", "Mentorship Programs",
  "Free Meals", "Snacks & Beverages", "Team Lunches", "Company Events",
  "Childcare Assistance", "Elder Care Assistance", "Pet Insurance",
  "Employee Discounts", "Company Car", "Laptop/Equipment", "Phone Allowance",
  "Internet Reimbursement", "Coworking Space Access"
];

export const internshipDurations = [
  "1 Month",
  "2 Months",
  "3 Months",
  "4 Months",
  "5 Months",
  "6 Months",
  "6+ Months",
  "Flexible"
];

export const stipendTypes = ["Paid", "Unpaid", "Performance-based", "Commission-based"];

export const workingDaysPerWeek = ["3 days", "4 days", "5 days", "6 days", "Flexible"];

export const salaryTypes = ["Fixed", "Negotiable", "Commission-based", "Hourly", "Performance-based"];

export const applyMethods = [
  "Apply through platform",
  "Send email",
  "External website/link",
  "In-person application"
];

export const visibilityOptions = [
  { value: "public", label: "Public - Visible to all job seekers" },
  { value: "private", label: "Private - Only visible to invited candidates" }
];

