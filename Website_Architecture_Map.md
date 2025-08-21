# AI-Based Resume & Job Description Matcher - Website Architecture

## 🎯 Central System
**AI-Based Resume & Job Description Matcher**

---

## 🖥️ Frontend (React.js)

### 📄 Pages
#### Authentication
- LoginPage.jsx
- SignupPage.jsx  
- SignupPageWithVerification.jsx

#### Dashboards
- JobSeekerDashboard.jsx
- RecruiterDashboard.jsx
- AnalyticsDashboard.jsx

#### Job Management
- JobListing.jsx
- JobDescription.jsx
- AllJobs.jsx
- AppliedJobs.jsx

#### Resume Management
- UploadResume.jsx
- ResumeProfile.jsx
- Profile.jsx

#### Candidate Management
- ViewAllCandidates.jsx
- ViewTopCandidates.jsx
- RecruiterApplicants.jsx

#### Matching & Analytics
- MatchScore.jsx
- Candidates.jsx

#### Business Features
- PricingPlans.jsx
- Payment.jsx
- PaymentSuccess.jsx
- Settings.jsx

    #### Information Pages
- Home.jsx
- AboutUs.jsx
- termsofservice.jsx
- PrivacyPolicy.jsx

### 🧩 Components
#### Layout
- Header.jsx
- Sidebar.jsx
- Footer.jsx

#### Authentication
- EmailVerification.jsx
- PhoneVerification.jsx

#### Modals
- BillingModal.jsx
- SubscriptionModal.jsx
- ProfileEditModal.jsx
- PasswordChangeModal.jsx
- TwoFactorModal.jsx
- AccountDeletionModal.jsx
- AccountDeactivationModal.jsx
- AccountTypeModal.jsx
- GeneralPreferencesModal.jsx
- DisplaySettingsModal.jsx
- DataPrivacyModal.jsx
- VisibilitySettingsModal.jsx
- ActiveSessionsModal.jsx
- LoginHistoryModal.jsx

#### AI & Analytics
- CulturalFitScore.jsx
- CompanyCultureAssessment.jsx
- CulturalProfileBuilder.jsx
- DiversityAnalytics.jsx
- TeamCollaboration.jsx
- InterviewScorecard.jsx
- OfferLetterGenerator.jsx
- JobSeekerCulturalFit.jsx
- PremiumPrompt.jsx

#### UI Elements
- InputField.jsx
- Button.jsx
- resumeUpload.js

### 🛠️ Frontend Technology
- React.js 18.2.0
- React Router DOM 6.8.0
- Axios 0.26.1
- Chart.js 4.4.8
- React-ChartJS-2 5.3.0
- FontAwesome Icons
- CORS 2.8.5

---

## ⚙️ Backend (Python Flask)

### 🚀 Main Application
- app.py
- config.py
- requirements.txt

### 🛣️ API Routes
- auth_routes.py
- email_verification_routes.py
- phone_verification_routes.py
- application_routes.py
- subscription_routes.py
- analytics_routes.py
- resume_routes.py
- job_routes.py

### 🔧 Services
- mock_email_service.py
- mock_sms_service.py

### 🛠️ Backend Technology
- Python
- Flask
- MongoDB Atlas
- GridFS
- PyMongo
- JWT Authentication
- Bcrypt

---

## 🤖 AI Models & ML

### 🎯 Fine-Tuned SBERT
- **Performance**: R² Score: 0.753, MSE: 0.0068
- **Location**: fine_tuned_sbert/

### 🔍 Google Gemini API
- **Purpose**: Resume Text Extraction & Parsing
- **Setup**: GEMINI_FREE_SETUP.md

### 📊 Other Models (Benchmark)
- DistilBERT (R²: 0.659)
- RoBERTa (R²: 0.630)
- Random Forest (R²: 0.621)
- TF-IDF (R²: -13.891)

---

## 🗄️ Database & Storage

### 📊 MongoDB Atlas
- GridFS for File Storage
- User, Job, Resume Collections

### 📁 File Storage
- uploads/ Directory
- Cloudinary CDN

---

## ⭐ Core Features

### 📄 Resume Management
- PDF/DOCX Upload
- AI Text Extraction
- Skills, Education, Experience Parsing

### 💼 Job Management
- Job Description Posting
- Advanced Filtering
- Application Tracking

### 🧠 AI Matching Engine
- Semantic Similarity (SBERT)
- Rule-based Scoring
- Skills + Education + Experience Algorithm

### 📈 Analytics & Insights
- Match Score Distribution
- Application Status Tracking
- Candidate Comparisons
- Diversity Analytics

### 📞 Communication & Scheduling
- Interview Scheduling
- Email Verification
- Phone Verification
- Offer Letter Generation

### 💳 Subscription & Billing
- Multiple Pricing Plans
- Payment Processing
- Subscription Management

---

## 👥 User Roles & Access

### 🔍 Job Seekers
- Resume Upload & Management
- Job Search & Applications
- Application Status Tracking
- Cultural Fit Assessment

### 🏢 Recruiters
- Job Posting & Management
- Candidate Search & Filtering
- AI Match Score Analysis
- Interview Scheduling
- Recruitment Analytics

---

## 🔒 Security & Authentication

- JWT Token Authentication
- Bcrypt Password Hashing
- Role-based Route Access
- Two-Factor Authentication
- Active Session Management
- Data Privacy Controls

---

## 🚀 Deployment & Configuration

- Frontend Port: 3001
- React Build Process
- Virtual Environment (.venv)
- Git Version Control

---

## 📊 System Architecture Summary

```
Frontend (React) ←→ Backend (Flask) ←→ Database (MongoDB)
       ↓                    ↓              ↓
   User Interface    AI Models (SBERT)   Data Storage
       ↓                    ↓              ↓
   Components        Gemini API         GridFS Files
       ↓                    ↓              ↓
   Pages            JWT Auth           Collections
```

## 🔄 Data Flow

1. **Resume Upload** → Text Extraction (Gemini) → Structured Data → MongoDB
2. **Job Posting** → Recruiter Input → Job Collection → MongoDB
3. **Matching** → SBERT Model → Match Scores → Analytics Dashboard
4. **User Actions** → JWT Auth → Role-based Access → Protected Routes

---

*This architecture supports a comprehensive AI-powered recruitment platform with dual user roles, advanced matching algorithms, and robust security features.*
