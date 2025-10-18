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

export const skills = {
  technical: [
    "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "ASP.NET", ".NET Core",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Firebase", "DynamoDB",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "CI/CD",
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "Material UI",
    "REST API", "GraphQL", "Microservices", "WebSockets", "gRPC",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision",
    "Data Analysis", "Data Visualization", "Tableau", "Power BI", "Excel", "Pandas", "NumPy",
    "Blockchain", "Smart Contracts", "Ethereum", "Web3", "Solidity",
    "Mobile Development", "React Native", "Flutter", "iOS", "Android",
    "DevOps", "Linux", "Bash", "PowerShell", "Terraform", "Ansible",
    "Cybersecurity", "Penetration Testing", "Network Security", "SIEM",
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
    "Testing", "Selenium", "Jest", "Pytest", "JUnit", "Cypress"
  ],
  soft: [
    "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
    "Time Management", "Adaptability", "Work Ethic", "Attention to Detail", "Creativity",
    "Interpersonal Skills", "Conflict Resolution", "Decision Making", "Emotional Intelligence",
    "Negotiation", "Public Speaking", "Presentation Skills", "Active Listening",
    "Customer Service", "Collaboration", "Project Management", "Analytical Thinking",
    "Organizational Skills", "Multitasking", "Strategic Planning", "Mentoring",
    "Flexibility", "Initiative", "Stress Management", "Research Skills"
  ],
  business: [
    "Project Management", "Agile", "Scrum", "Kanban", "Business Analysis",
    "Market Research", "Strategic Planning", "Financial Analysis", "Budgeting",
    "Sales", "Marketing", "Digital Marketing", "SEO", "SEM", "Social Media Marketing",
    "Content Marketing", "Email Marketing", "Brand Management", "Product Management",
    "Customer Relationship Management (CRM)", "Salesforce", "HubSpot",
    "Supply Chain Management", "Inventory Management", "Procurement",
    "Risk Management", "Compliance", "Contract Management", "Vendor Management",
    "Business Intelligence", "Reporting", "KPI Tracking", "Process Improvement"
  ]
};

export const allSkills = [...skills.technical, ...skills.soft, ...skills.business].sort();

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
  { value: "private", label: "Private - Only visible to invited candidates" },
  { value: "unlisted", label: "Unlisted - Accessible via direct link only" }
];

