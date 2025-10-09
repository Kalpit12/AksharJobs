# 🏗️ Visual System Architecture
## AksharJobs Platform - Complete Technical Architecture

---

## 📋 Table of Contents
1. [High-Level System Overview](#high-level-system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [AI & ML Pipeline](#ai--ml-pipeline)
6. [Authentication Flow](#authentication-flow)
7. [API Architecture](#api-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## 🎯 High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AKSHARJOBS PLATFORM                          │
│                   AI-Based Resume & Job Matcher                      │
└─────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   USERS      │
                              │              │
                              │ 👤 Job Seekers│
                              │ 🏢 Recruiters │
                              │ 👑 Admins    │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
            │   Web Browser │ │  Mobile   │ │    Tablet     │
            │    (React)    │ │  Browser  │ │   Browser     │
            └───────┬───────┘ └─────┬─────┘ └───────┬───────┘
                    │                │                │
                    └────────────────┼────────────────┘
                                     │
                              ┌──────▼───────┐
                              │   FRONTEND   │
                              │  React.js    │
                              │  Port: 3001  │
                              └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │   API Layer  │
                              │    Axios     │
                              └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │   BACKEND    │
                              │  Flask API   │
                              │  Port: 5000  │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
            │   MongoDB     │ │  AI Models│ │  External APIs│
            │   Database    │ │  (SBERT)  │ │  (Gemini,SMS) │
            └───────────────┘ └───────────┘ └───────────────┘
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                            App.js (Root)                             │
│                     Routes + Auth Provider                           │
└─────────────────────────────────────────────────────────────────────┘
           │
           ├── AuthProvider (Context)
           │   └── User State Management
           │
           ├── Header Component
           │   ├── Logo
           │   ├── Navigation Links (Role-based)
           │   └── Profile Dropdown
           │
           ├── Protected Routes
           │   ├── Role-based Access Control
           │   └── JWT Verification
           │
           ├── Pages (Route Components)
           │   │
           │   ├── 👤 Job Seeker Pages
           │   │   ├── JobSeekerDashboard.jsx
           │   │   ├── UploadResume.jsx
           │   │   ├── Profile.jsx
           │   │   ├── CompleteProfile.jsx
           │   │   ├── JobListing.jsx
           │   │   ├── AllJobs.jsx
           │   │   ├── AppliedJobs.jsx
           │   │   ├── ApplicationTracker.jsx
           │   │   └── ContactMe.jsx
           │   │
           │   ├── 🏢 Recruiter Pages
           │   │   ├── RecruiterDashboard.jsx
           │   │   ├── RecruiterCompleteProfile.jsx
           │   │   ├── CVBrowser.jsx
           │   │   ├── RecruiterTracker.jsx
           │   │   ├── ViewTopCandidates.jsx
           │   │   ├── ViewAllCandidates.jsx
           │   │   ├── AnalyticsDashboard.jsx
           │   │   └── ContactMe.jsx
           │   │
           │   └── 🌐 Common Pages
           │       ├── Home.jsx
           │       ├── LoginPage.jsx
           │       ├── SignupPage.jsx
           │       ├── PromoCodePage.jsx
           │       ├── Settings.jsx
           │       └── AboutUs.jsx
           │
           ├── Components (Reusable)
           │   │
           │   ├── 🔐 Authentication
           │   │   ├── PhoneVerification.jsx
           │   │   └── EmailVerification.jsx
           │   │
           │   ├── 📊 Profile Components
           │   │   ├── ProfileTracker.jsx
           │   │   ├── RecruiterProfileTracker.jsx
           │   │   └── ProfileAvatar.jsx
           │   │
           │   ├── 💰 Akshar Coins
           │   │   ├── AksharCoinBalance.jsx
           │   │   ├── HowToEarnCoins.jsx
           │   │   └── HowToUseCoins.jsx
           │   │
           │   ├── 💼 Job Components
           │   │   ├── JobDisplay.jsx
           │   │   ├── JobCreationForm.jsx
           │   │   └── PostJobModal.jsx
           │   │
           │   ├── 🎯 Matching Components
           │   │   ├── MatchScore.jsx
           │   │   ├── CulturalFitScore.jsx
           │   │   └── SkillsComparison.jsx
           │   │
           │   ├── 🌐 Community Components
           │   │   └── CommunitySelector.jsx
           │   │
           │   ├── 🎨 UI Components
           │   │   ├── Header.jsx
           │   │   ├── Footer.jsx
           │   │   ├── Sidebar.jsx
           │   │   ├── Button.jsx
           │   │   ├── InputField.jsx
           │   │   ├── ModernLoadingSpinner.jsx
           │   │   └── SkeletonLoader.jsx
           │   │
           │   └── 🔔 Modals
           │       ├── ProfileEditModal.jsx
           │       ├── PasswordChangeModal.jsx
           │       ├── TwoFactorModal.jsx
           │       └── Various Settings Modals
           │
           ├── API Services (Axios)
           │   ├── authApi.js
           │   ├── jobApi.js
           │   ├── resumeApi.js
           │   ├── applicationApi.js
           │   ├── analyticsApi.js
           │   ├── coinApi.js
           │   ├── communityApi.js
           │   └── profileApi.js
           │
           ├── Styles (CSS)
           │   ├── Global.css
           │   ├── Component-specific CSS files
           │   └── Theme variables
           │
           └── Footer Component
               ├── Links
               ├── Social Media
               └── Copyright
```

---

## ⚙️ Backend Architecture

### Flask Application Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          app.py (Main Entry)                         │
│                    Flask App Initialization                          │
└─────────────────────────────────────────────────────────────────────┘
           │
           ├── Configuration
           │   ├── config.py
           │   ├── Environment Variables
           │   └── CORS Settings
           │
           ├── Database Connection
           │   ├── MongoDB Atlas Connection
           │   ├── PyMongo Client
           │   └── GridFS Setup
           │
           ├── Middleware
           │   ├── CORS Middleware
           │   ├── JWT Authentication
           │   ├── Request Logging
           │   └── Error Handling
           │
           ├── Routes (Blueprints)
           │   │
           │   ├── 🔐 Authentication Routes (auth_routes.py)
           │   │   ├── POST /api/register
           │   │   ├── POST /api/login
           │   │   ├── POST /api/logout
           │   │   ├── POST /api/refresh-token
           │   │   └── POST /api/reset-password
           │   │
           │   ├── 📧 Verification Routes
           │   │   ├── phone_verification_routes.py
           │   │   │   ├── POST /api/send-verification-code
           │   │   │   ├── POST /api/verify-code
           │   │   │   └── POST /api/resend-code
           │   │   │
           │   │   └── email_verification_routes.py
           │   │       ├── POST /api/send-email-verification
           │   │       ├── POST /api/verify-email
           │   │       └── POST /api/resend-email-code
           │   │
           │   ├── 👤 User Profile Routes (user_profile_routes.py)
           │   │   ├── GET /api/profile/profile
           │   │   ├── PUT /api/profile/profile
           │   │   ├── POST /api/profile/upload-photo
           │   │   └── DELETE /api/profile/profile
           │   │
           │   ├── 📄 Resume Routes (resume_routes.py)
           │   │   ├── POST /api/upload-resume
           │   │   ├── GET /api/resumes/:id
           │   │   ├── GET /api/download-resume/:id
           │   │   ├── PUT /api/update-resume/:id
           │   │   └── DELETE /api/delete-resume/:id
           │   │
           │   ├── 💼 Job Routes (job_routes.py)
           │   │   ├── POST /api/jobs/post
           │   │   ├── GET /api/jobs
           │   │   ├── GET /api/jobs/:id
           │   │   ├── PUT /api/jobs/:id
           │   │   ├── DELETE /api/jobs/:id
           │   │   ├── GET /api/jobs/search
           │   │   └── GET /api/jobs/recommended
           │   │
           │   ├── 📝 Application Routes (application_routes.py)
           │   │   ├── POST /api/applications/apply
           │   │   ├── GET /api/applications/user
           │   │   ├── GET /api/applications/job/:jobId
           │   │   ├── PUT /api/applications/:id/status
           │   │   └── DELETE /api/applications/:id
           │   │
           │   ├── 📊 Application Tracker Routes (application_tracker_routes.py)
           │   │   ├── GET /api/tracker/job-seeker/applications
           │   │   ├── GET /api/tracker/recruiter/candidates
           │   │   ├── GET /api/tracker/statistics
           │   │   ├── POST /api/tracker/update-status
           │   │   └── POST /api/tracker/bulk-update
           │   │
           │   ├── 📈 Analytics Routes (analytics_routes.py)
           │   │   ├── GET /api/analytics/dashboard
           │   │   ├── GET /api/analytics/match-thresholds
           │   │   ├── POST /api/analytics/match-thresholds
           │   │   ├── GET /api/analytics/skills-gap-analysis
           │   │   ├── GET /api/analytics/matching-history
           │   │   └── GET /api/analytics/competitor-analysis
           │   │
           │   ├── 💰 Coin Routes (coin_routes.py)
           │   │   ├── GET /api/coins/balance
           │   │   ├── GET /api/coins/transactions
           │   │   ├── GET /api/coins/info
           │   │   ├── POST /api/coins/earn
           │   │   ├── POST /api/coins/redeem
           │   │   └── POST /api/coins/spend
           │   │
           │   ├── 🎟️ Promo Code Routes (promo_code_routes.py)
           │   │   ├── GET /api/promo/code
           │   │   ├── POST /api/promo/apply
           │   │   ├── GET /api/promo/referrals
           │   │   └── GET /api/promo/statistics
           │   │
           │   ├── 🌐 Community Routes (community_routes.py)
           │   │   ├── GET /api/communities
           │   │   ├── GET /api/communities/:id
           │   │   ├── POST /api/communities
           │   │   ├── GET /api/communities/:id/members
           │   │   └── GET /api/communities/:id/jobs
           │   │
           │   └── 💳 Subscription Routes (subscription_routes.py)
           │       ├── GET /api/subscriptions/plans
           │       ├── POST /api/subscriptions/subscribe
           │       ├── GET /api/subscriptions/current
           │       └── POST /api/subscriptions/cancel
           │
           ├── Services (Business Logic)
           │   │
           │   ├── Authentication Service
           │   │   ├── Password hashing (bcrypt)
           │   │   ├── JWT token generation
           │   │   ├── Token verification
           │   │   └── Session management
           │   │
           │   ├── Resume Service
           │   │   ├── File upload handling
           │   │   ├── Text extraction (pdfplumber, python-docx)
           │   │   ├── Gemini AI integration
           │   │   └── Data parsing & structuring
           │   │
           │   ├── Matching Service
           │   │   ├── SBERT model loading
           │   │   ├── Semantic similarity calculation
           │   │   ├── Skills matching algorithm
           │   │   ├── Education & experience scoring
           │   │   └── Final match score calculation
           │   │
           │   ├── Coin Service (coin_service.py)
           │   │   ├── Earn coins logic
           │   │   ├── Spend coins logic
           │   │   ├── Transaction tracking
           │   │   └── Balance management
           │   │
           │   ├── Email Notification Service (email_notification_service.py)
           │   │   ├── SMTP configuration
           │   │   ├── HTML email templates
           │   │   ├── Send status update emails
           │   │   └── Send verification emails
           │   │
           │   ├── SMS Service (mock_sms_service.py)
           │   │   ├── Celcom Africa API integration
           │   │   ├── Mock SMS for development
           │   │   ├── Verification code sending
           │   │   └── SMS history tracking
           │   │
           │   ├── Analytics Service (analytics_service.py)
           │   │   ├── Calculate statistics
           │   │   ├── Generate reports
           │   │   ├── Skills gap analysis
           │   │   └── Performance metrics
           │   │
           │   └── Application Tracking Service (application_tracking_service.py)
           │       ├── Status update logic
           │       ├── Email trigger
           │       ├── History tracking
           │       └── Bulk operations
           │
           ├── Models (Data Structures)
           │   ├── user_model.py
           │   ├── job_model.py
           │   ├── resume_model.py
           │   ├── application_model.py
           │   ├── community_model.py
           │   └── transaction_model.py
           │
           └── Error Handling
               ├── Custom Exception Classes
               ├── Error Response Formatter
               └── Logging System
```

---

## 🗄️ Database Architecture

### MongoDB Collections Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Database                            │
│                    Database Name: aksharjobs                         │
└─────────────────────────────────────────────────────────────────────┘

├── 👤 users (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     email: String (unique, indexed),
│   │     password: String (hashed),
│   │     userType: String ["jobSeeker", "recruiter", "admin"],
│   │     
│   │     // Personal Information
│   │     firstName: String,
│   │     lastName: String,
│   │     phone: String,
│   │     location: String,
│   │     linkedinProfile: String,
│   │     profilePicture: String (URL),
│   │     bio: String,
│   │     
│   │     // Company Information (Recruiters only)
│   │     companyName: String,
│   │     companyWebsite: String,
│   │     industry: String,
│   │     companySize: String,
│   │     foundedYear: String,
│   │     companyDescription: String,
│   │     companyLogo: String,
│   │     
│   │     // Profile Completion
│   │     profileCompletion: Number (0-100),
│   │     
│   │     // Verification Status
│   │     phoneVerified: Boolean,
│   │     emailVerified: Boolean,
│   │     twoFactorEnabled: Boolean,
│   │     
│   │     // Communities
│   │     communities: [ObjectId] (refs: communities),
│   │     primaryCommunity: ObjectId (ref: communities),
│   │     
│   │     // Akshar Coins
│   │     akshar_coins: Number (default: 10),
│   │     coin_transactions: [
│   │       {
│   │         type: String ["earn", "spend", "redeem"],
│   │         amount: Number,
│   │         description: String,
│   │         timestamp: Date,
│   │         balance_after: Number
│   │       }
│   │     ],
│   │     
│   │     // Promo Code
│   │     promoCode: String (unique),
│   │     referredBy: ObjectId (ref: users),
│   │     referrals: [ObjectId] (refs: users),
│   │     
│   │     // Metadata
│   │     createdAt: Date,
│   │     updatedAt: Date,
│   │     lastLogin: Date,
│   │     isActive: Boolean,
│   │     subscriptionPlan: String
│   │   }
│   │
│   └── Indexes:
│       ├── email (unique)
│       ├── userType
│       ├── promoCode (unique, sparse)
│       └── communities (multi-key)
│
├── 💼 jobs (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     recruiterId: ObjectId (ref: users, indexed),
│   │     
│   │     // Basic Information
│   │     job_title: String (indexed),
│   │     company_name: String (indexed),
│   │     location: String,
│   │     job_type: String ["Full-time", "Part-time", "Contract", "Internship"],
│   │     salary_range: String,
│   │     experience_level: String ["Entry", "Mid", "Senior"],
│   │     remote_type: String ["Remote", "On-site", "Hybrid"],
│   │     
│   │     // Detailed Sections
│   │     required_skills: [String] (10-12 skills),
│   │     responsibilities: [String] (8 items),
│   │     ai_improvement_suggestions: [String] (5 AI-generated),
│   │     additional_requirements: [String] (5 items),
│   │     benefits: [String] (7 items),
│   │     company_culture: String,
│   │     application_process: [String] (5 steps),
│   │     
│   │     // Community Targeting
│   │     target_communities: [ObjectId] (refs: communities),
│   │     all_communities: Boolean,
│   │     
│   │     // Match Thresholds
│   │     match_threshold: Number (default: 60),
│   │     auto_reject_threshold: Number (default: 40),
│   │     
│   │     // Statistics
│   │     views: Number,
│   │     applications_count: Number,
│   │     average_match_score: Number,
│   │     
│   │     // Status
│   │     status: String ["active", "closed", "draft"],
│   │     expirationDate: Date,
│   │     
│   │     // Metadata
│   │     createdAt: Date (indexed),
│   │     updatedAt: Date,
│   │     postedAt: Date
│   │   }
│   │
│   └── Indexes:
│       ├── recruiterId
│       ├── job_title (text)
│       ├── company_name (text)
│       ├── target_communities (multi-key)
│       ├── createdAt (descending)
│       └── status
│
├── 📄 resumes (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     userId: ObjectId (ref: users, unique, indexed),
│   │     
│   │     // File Information
│   │     fileName: String,
│   │     fileType: String ["pdf", "docx"],
│   │     fileSize: Number,
│   │     gridfs_id: ObjectId (ref: GridFS),
│   │     
│   │     // Extracted Text
│   │     rawText: String (indexed for full-text search),
│   │     
│   │     // Parsed Data (from Gemini AI)
│   │     personal_info: {
│   │       name: String,
│   │       email: String,
│   │       phone: String,
│   │       location: String,
│   │       linkedin: String,
│   │       github: String,
│   │       portfolio: String
│   │     },
│   │     
│   │     professional_summary: String,
│   │     
│   │     skills: [
│   │       {
│   │         name: String,
│   │         category: String ["technical", "soft", "language"],
│   │         proficiency: String ["Beginner", "Intermediate", "Advanced", "Expert"]
│   │       }
│   │     ],
│   │     
│   │     education: [
│   │       {
│   │         degree: String,
│   │         institution: String,
│   │         field: String,
│   │         graduation_year: String,
│   │         gpa: String,
│   │         achievements: [String]
│   │       }
│   │     ],
│   │     
│   │     experience: [
│   │       {
│   │         job_title: String,
│   │         company: String,
│   │         location: String,
│   │         start_date: String,
│   │         end_date: String,
│   │         is_current: Boolean,
│   │         responsibilities: [String],
│   │         achievements: [String],
│   │         technologies: [String]
│   │       }
│   │     ],
│   │     
│   │     projects: [
│   │       {
│   │         name: String,
│   │         description: String,
│   │         technologies: [String],
│   │         duration: String,
│   │         url: String,
│   │         role: String
│   │       }
│   │     ],
│   │     
│   │     certifications: [
│   │       {
│   │         name: String,
│   │         issuer: String,
│   │         issue_date: String,
│   │         expiry_date: String,
│   │         credential_id: String
│   │       }
│   │     ],
│   │     
│   │     achievements: [String],
│   │     languages: [String],
│   │     
│   │     // Processing Status
│   │     processingStatus: String ["pending", "processing", "completed", "failed"],
│   │     
│   │     // Metadata
│   │     uploadedAt: Date,
│   │     updatedAt: Date,
│   │     lastParsedAt: Date
│   │   }
│   │
│   └── Indexes:
│       ├── userId (unique)
│       ├── rawText (text index for search)
│       └── uploadedAt
│
├── 📝 applications (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     jobId: ObjectId (ref: jobs, indexed),
│   │     jobSeekerId: ObjectId (ref: users, indexed),
│   │     recruiterId: ObjectId (ref: users, indexed),
│   │     
│   │     // Application Details
│   │     coverLetter: String,
│   │     resumeSnapshot: Object, // Copy of resume at time of application
│   │     
│   │     // Match Score
│   │     match_score: Number (0-100, indexed),
│   │     match_breakdown: {
│   │       skills_score: Number,
│   │       education_score: Number,
│   │       experience_score: Number,
│   │       semantic_score: Number
│   │     },
│   │     
│   │     // Status Tracking
│   │     status: String ["pending", "ai_screening", "reviewing", "shortlisted", 
│   │                     "interview", "hired", "rejected"],
│   │     status_history: [
│   │       {
│   │         status: String,
│   │         updated_at: Date,
│   │         updated_by: ObjectId (ref: users),
│   │         notes: String
│   │       }
│   │     ],
│   │     
│   │     // Recruiter Notes
│   │     recruiterNotes: [
│   │       {
│   │         note: String,
│   │         addedBy: ObjectId (ref: users),
│   │         addedAt: Date
│   │       }
│   │     ],
│   │     
│   │     // Interview Details
│   │     interview_scheduled: Boolean,
│   │     interview_date: Date,
│   │     interview_type: String ["phone", "video", "in-person"],
│   │     
│   │     // Email Notifications
│   │     emailsSent: [
│   │       {
│   │         type: String,
│   │         sentAt: Date,
│   │         status: String ["sent", "failed"]
│   │       }
│   │     ],
│   │     
│   │     // Metadata
│   │     appliedAt: Date (indexed),
│   │     updatedAt: Date,
│   │     viewedByRecruiter: Boolean,
│   │     viewedAt: Date
│   │   }
│   │
│   └── Indexes:
│       ├── jobId
│       ├── jobSeekerId
│       ├── recruiterId
│       ├── status
│       ├── match_score (descending)
│       ├── appliedAt (descending)
│       └── Compound: (jobId, jobSeekerId) - unique
│
├── 🌐 communities (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     name: String (indexed),
│   │     icon: String (emoji),
│   │     category: String,
│   │     description: String,
│   │     
│   │     // Statistics
│   │     member_count: Number,
│   │     active_jobs_count: Number,
│   │     total_jobs_posted: Number,
│   │     
│   │     // Settings
│   │     isActive: Boolean,
│   │     isPublic: Boolean,
│   │     
│   │     // Metadata
│   │     createdAt: Date,
│   │     updatedAt: Date
│   │   }
│   │
│   └── Indexes:
│       ├── name (unique)
│       └── isActive
│
├── 🔔 notifications (Collection)
│   ├── Document Structure:
│   │   {
│   │     _id: ObjectId,
│   │     userId: ObjectId (ref: users, indexed),
│   │     
│   │     // Notification Details
│   │     type: String ["application", "status_update", "job_match", "message", "system"],
│   │     title: String,
│   │     message: String,
│   │     
│   │     // Related Entities
│   │     relatedJobId: ObjectId (ref: jobs),
│   │     relatedApplicationId: ObjectId (ref: applications),
│   │     relatedUserId: ObjectId (ref: users),
│   │     
│   │     // Status
│   │     isRead: Boolean (default: false, indexed),
│   │     readAt: Date,
│   │     
│   │     // Metadata
│   │     createdAt: Date (indexed),
│   │     expiresAt: Date
│   │   }
│   │
│   └── Indexes:
│       ├── userId
│       ├── isRead
│       ├── createdAt (descending)
│       └── Compound: (userId, isRead)
│
└── 📁 GridFS (File Storage)
    ├── fs.files (Collection - File Metadata)
    │   └── Stores: Resume PDFs/DOCX, Profile Pictures, Company Logos
    │
    └── fs.chunks (Collection - File Chunks)
        └── Stores: Binary file data in 255KB chunks
```

---

## 🤖 AI & ML Pipeline

### Resume Parsing & Matching Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AI & ML PROCESSING PIPELINE                      │
└─────────────────────────────────────────────────────────────────────┘

1. RESUME UPLOAD & PARSING
   ┌───────────────────┐
   │  User Uploads     │
   │  Resume File      │
   │  (PDF/DOCX)       │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  File Validation  │
   │  - Size check     │
   │  - Format check   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Store Original   │
   │  in GridFS        │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Text Extraction  │
   │  - pdfplumber     │
   │  - python-docx    │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Google Gemini    │
   │  API Call         │
   │  - Send raw text  │
   │  - Request parse  │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  AI Parsing       │
   │  Extract:         │
   │  • Personal Info  │
   │  • Skills         │
   │  • Education      │
   │  • Experience     │
   │  • Projects       │
   │  • Certifications │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Data Validation  │
   │  & Cleaning       │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Store Structured │
   │  Data in MongoDB  │
   └───────────────────┘

2. JOB MATCHING ENGINE
   ┌───────────────────┐
   │  Job Application  │
   │  Submitted        │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Retrieve Resume  │
   │  & Job Data       │
   └─────────┬─────────┘
             │
             ├─────────────────────┬──────────────────────┬──────────────────┐
             │                     │                      │                  │
             ▼                     ▼                      ▼                  ▼
   ┌─────────────────┐   ┌─────────────────┐  ┌──────────────────┐ ┌────────────────┐
   │ Skills Matching │   │ Education Match │  │ Experience Match │ │ Semantic Match │
   │                 │   │                 │  │                  │ │                │
   │ Compare:        │   │ Compare:        │  │ Compare:         │ │ SBERT Model:   │
   │ • Required vs   │   │ • Degree level  │  │ • Years of exp   │ │ • Resume text  │
   │   Candidate     │   │ • Field of      │  │ • Industry match │ │ • Job desc     │
   │   skills        │   │   study         │  │ • Role similarity│ │   text         │
   │ • Exact matches │   │ • Institution   │  │ • Company size   │ │ • Embedding    │
   │ • Similar       │   │ • Certifications│  │ • Leadership     │ │   similarity   │
   │   skills        │   │                 │  │                  │ │                │
   │                 │   │                 │  │                  │ │ Fine-tuned     │
   │ Weight: 40%     │   │ Weight: 20%     │  │ Weight: 20%      │ │ SBERT Model    │
   │                 │   │                 │  │                  │ │ R² = 0.753     │
   │                 │   │                 │  │                  │ │                │
   │                 │   │                 │  │                  │ │ Weight: 20%    │
   └────────┬────────┘   └────────┬────────┘  └─────────┬────────┘ └────────┬───────┘
            │                     │                      │                   │
            └─────────────────────┴──────────────────────┴───────────────────┘
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │ Weighted Average  │
                                  │ Final Score:      │
                                  │ 0-100%            │
                                  └─────────┬─────────┘
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │ Score Categories: │
                                  │ 90-100: Excellent │
                                  │ 80-89: Very Good  │
                                  │ 70-79: Good       │
                                  │ 60-69: Moderate   │
                                  │ 50-59: Fair       │
                                  │ 40-49: Low        │
                                  │ 0-39: Poor        │
                                  └─────────┬─────────┘
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │ Store Match Score │
                                  │ in Application    │
                                  └───────────────────┘

3. AI-POWERED JOB ENHANCEMENTS
   ┌───────────────────┐
   │  Job Posted       │
   │  by Recruiter     │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Send Job Details │
   │  to Gemini API    │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  AI Generates:    │
   │  5 Improvement    │
   │  Suggestions      │
   │  for Candidates   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Store Suggestions│
   │  with Job         │
   └───────────────────┘

4. MATCH SCORE OPTIMIZATION
   ┌───────────────────┐
   │  Continuous       │
   │  Learning         │
   │  (Future)         │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Track Successful │
   │  Hires            │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Fine-tune        │
   │  SBERT Model      │
   │  Weights          │
   └───────────────────┘
```

### SBERT Model Details

```
Model: Fine-tuned SBERT (Sentence-BERT)
Base Model: sentence-transformers/all-mpnet-base-v2

Performance Metrics:
├── R² Score: 0.753 ✅ (Best)
├── MSE: 0.0068
├── Training Dataset: Custom job-resume pairs
└── Use Case: Semantic similarity between resumes and job descriptions

Comparison with Other Models:
├── DistilBERT: R² = 0.659
├── RoBERTa: R² = 0.630
├── Random Forest: R² = 0.621
└── TF-IDF: R² = -13.891 (worst)

Model Location: /fine_tuned_sbert/
Model Files:
├── config.json
├── pytorch_model.bin
├── tokenizer_config.json
├── vocab.txt
└── special_tokens_map.json
```

---

## 🔐 Authentication Flow

### JWT Authentication Process

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ┌───────────────────┐
   │  User Signs Up    │
   │  with Email &     │
   │  Password         │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Phone            │
   │  Verification     │
   │  (6-digit code)   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Email            │
   │  Verification     │
   │  (6-digit code)   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Hash Password    │
   │  (bcrypt, 10      │
   │   salt rounds)    │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Create User      │
   │  in MongoDB       │
   │  - ₳10 starting   │
   │    coins          │
   │  - Unique promo   │
   │    code           │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Generate JWT     │
   │  Token            │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Return Token +   │
   │  User Data        │
   └───────────────────┘

2. USER LOGIN
   ┌───────────────────┐
   │  User Enters      │
   │  Email & Password │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Find User by     │
   │  Email in DB      │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Verify Password  │
   │  (bcrypt.compare) │
   └─────────┬─────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   Invalid      Valid
   Password     Password
      │             │
      ▼             ▼
   Return      ┌───────────────────┐
   401 Error   │  Generate JWT     │
               │  Token            │
               │  Payload:         │
               │  {                │
               │    userId,        │
               │    email,         │
               │    userType,      │
               │    exp: 24h       │
               │  }                │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │  Update lastLogin │
               │  in Database      │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │  Return:          │
               │  {                │
               │    token,         │
               │    user: {        │
               │      id,          │
               │      email,       │
               │      userType,    │
               │      ...          │
               │    }              │
               │  }                │
               └───────────────────┘

3. API REQUEST WITH JWT
   ┌───────────────────┐
   │  Frontend Makes   │
   │  API Request      │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Add JWT Token    │
   │  to Headers:      │
   │  Authorization:   │
   │  Bearer <token>   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Backend Receives │
   │  Request          │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Auth Middleware  │
   │  Extracts Token   │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Verify Token     │
   │  (jwt.verify)     │
   │  - Secret key     │
   │  - Expiration     │
   └─────────┬─────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   Invalid       Valid
   Token         Token
      │             │
      ▼             ▼
   Return      ┌───────────────────┐
   401         │  Extract User ID  │
   Error       │  from Token       │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │  Fetch User from  │
               │  Database         │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │  Attach User to   │
               │  Request Object   │
               └─────────┬─────────┘
                         │
                         ▼
               ┌───────────────────┐
               │  Check Role-Based │
               │  Permissions      │
               └─────────┬─────────┘
                         │
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
            Unauthorized    Authorized
                  │             │
                  ▼             ▼
              Return        Process
              403 Error     Request

4. TOKEN REFRESH (Optional Future Feature)
   ┌───────────────────┐
   │  Token Near       │
   │  Expiration       │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Request Token    │
   │  Refresh          │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Verify Refresh   │
   │  Token            │
   └─────────┬─────────┘
             │
             ▼
   ┌───────────────────┐
   │  Issue New JWT    │
   │  Token            │
   └───────────────────┘
```

---

## 🌐 API Architecture

### RESTful API Endpoints Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINT MAP                             │
│                      Base URL: http://localhost:5000                 │
└─────────────────────────────────────────────────────────────────────┘

/api
│
├── /auth (Authentication)
│   ├── POST   /register               → Register new user
│   ├── POST   /login                  → User login
│   ├── POST   /logout                 → User logout
│   ├── POST   /refresh-token          → Refresh JWT token
│   ├── POST   /reset-password         → Password reset
│   └── GET    /verify-token           → Verify JWT token
│
├── /verification (Phone & Email)
│   ├── POST   /send-verification-code → Send SMS code
│   ├── POST   /verify-code            → Verify SMS code
│   ├── POST   /resend-code            → Resend SMS code
│   ├── POST   /send-email-verification→ Send email code
│   ├── POST   /verify-email           → Verify email code
│   └── POST   /resend-email-code      → Resend email code
│
├── /profile (User Profile)
│   ├── GET    /profile                → Get user profile
│   ├── PUT    /profile                → Update profile
│   ├── POST   /upload-photo           → Upload profile photo
│   ├── DELETE /profile                → Delete account
│   └── GET    /profile/:userId        → Get public profile
│
├── /resumes (Resume Management)
│   ├── POST   /upload-resume          → Upload resume
│   ├── GET    /resumes/:id            → Get resume data
│   ├── GET    /download-resume/:id    → Download resume file
│   ├── PUT    /update-resume/:id      → Update resume
│   ├── DELETE /delete-resume/:id      → Delete resume
│   └── GET    /resumes/user/:userId   → Get user's resumes
│
├── /jobs (Job Management)
│   ├── POST   /post                   → Create job posting
│   ├── GET    /                       → Get all jobs (paginated)
│   ├── GET    /:id                    → Get job details
│   ├── PUT    /:id                    → Update job
│   ├── DELETE /:id                    → Delete job
│   ├── GET    /search                 → Search jobs
│   ├── GET    /recommended            → Get recommended jobs
│   ├── GET    /recruiter/:recruiterId → Get recruiter's jobs
│   └── GET    /community/:communityId → Get community jobs
│
├── /applications (Job Applications)
│   ├── POST   /apply                  → Submit application
│   ├── GET    /user                   → Get user's applications
│   ├── GET    /job/:jobId             → Get job's applications
│   ├── GET    /:id                    → Get application details
│   ├── PUT    /:id/status             → Update application status
│   └── DELETE /:id                    → Withdraw application
│
├── /tracker (Application Tracking)
│   ├── GET    /job-seeker/applications→ Get JS applications
│   ├── GET    /recruiter/candidates   → Get recruiter candidates
│   ├── GET    /statistics             → Get application stats
│   ├── GET    /history/:userId/:jobId → Get tracking history
│   ├── POST   /update-status          → Update candidate status
│   ├── POST   /bulk-update            → Bulk status update
│   └── GET    /status-options         → Get available statuses
│
├── /analytics (Analytics & Reports)
│   ├── GET    /dashboard              → Get dashboard stats
│   ├── GET    /match-thresholds       → Get thresholds
│   ├── POST   /match-thresholds       → Set thresholds
│   ├── GET    /skills-gap-analysis    → Skills gap analysis
│   ├── GET    /matching-history       → Matching history
│   ├── GET    /competitor-analysis    → Competitor insights
│   └── GET    /performance-metrics    → Performance metrics
│
├── /coins (Akshar Coins)
│   ├── GET    /balance                → Get coin balance
│   ├── GET    /transactions           → Get transaction history
│   ├── GET    /info                   → Get earning/redemption info
│   ├── POST   /earn                   → Earn coins
│   ├── POST   /redeem                 → Redeem coins
│   └── POST   /spend                  → Spend coins
│
├── /promo (Promo Codes & Referrals)
│   ├── GET    /code                   → Get user's promo code
│   ├── POST   /apply                  → Apply promo code
│   ├── GET    /referrals              → Get referral list
│   └── GET    /statistics             → Get referral stats
│
├── /communities (Community System)
│   ├── GET    /                       → Get all communities
│   ├── GET    /:id                    → Get community details
│   ├── POST   /                       → Create community (Admin)
│   ├── PUT    /:id                    → Update community (Admin)
│   ├── DELETE /:id                    → Delete community (Admin)
│   ├── GET    /:id/members            → Get community members
│   ├── GET    /:id/jobs               → Get community jobs
│   └── GET    /stats                  → Get community stats
│
├── /subscriptions (Premium Plans)
│   ├── GET    /plans                  → Get all plans
│   ├── POST   /subscribe              → Subscribe to plan
│   ├── GET    /current                → Get current subscription
│   ├── POST   /cancel                 → Cancel subscription
│   └── POST   /upgrade                → Upgrade plan
│
└── /notifications (Notifications)
    ├── GET    /                       → Get all notifications
    ├── GET    /unread                 → Get unread notifications
    ├── PUT    /:id/read               → Mark as read
    ├── PUT    /mark-all-read          → Mark all as read
    └── DELETE /:id                    → Delete notification
```

### API Response Format

```json
Success Response:
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}

Error Response:
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message"
  }
}

Paginated Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🚀 Deployment Architecture

### Production Deployment Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEPLOYMENT                            │
└─────────────────────────────────────────────────────────────────────┘

FRONTEND (React)
┌───────────────────────────────────────┐
│  React Application                    │
│  - Build: npm run build               │
│  - Output: /build folder              │
│  - Static files: HTML, CSS, JS        │
└─────────────────┬─────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────┐
│  Hosting Options:                     │
│  ├── Netlify ✅                       │
│  ├── Vercel ✅                        │
│  ├── AWS S3 + CloudFront              │
│  ├── Firebase Hosting                 │
│  └── Custom Server (Nginx)            │
└───────────────────────────────────────┘

BACKEND (Flask)
┌───────────────────────────────────────┐
│  Flask API Application                │
│  - WSGI Server: Gunicorn              │
│  - Workers: 4                         │
│  - Port: 5000                         │
└─────────────────┬─────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────┐
│  Hosting Options:                     │
│  ├── Heroku ✅                        │
│  ├── AWS EC2 / Elastic Beanstalk     │
│  ├── Google Cloud Platform            │
│  ├── DigitalOcean Droplet            │
│  ├── Azure App Service                │
│  └── Railway                          │
└───────────────────────────────────────┘

DATABASE
┌───────────────────────────────────────┐
│  MongoDB Atlas ✅                     │
│  - Cloud-hosted                       │
│  - Automatic backups                  │
│  - Scaling support                    │
│  - Connection string in .env          │
└───────────────────────────────────────┘

EXTERNAL SERVICES
┌───────────────────────────────────────┐
│  Google Gemini API                    │
│  - Resume parsing                     │
│  - AI suggestions                     │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│  Celcom Africa SMS API                │
│  - Phone verification                 │
│  - SMS notifications                  │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│  SMTP Service (Gmail)                 │
│  - Email verification                 │
│  - Email notifications                │
└───────────────────────────────────────┘
```

### Environment Variables

```bash
# Frontend (.env)
REACT_APP_API_URL=https://api.aksharjobs.com
REACT_APP_ENV=production

# Backend (.env)
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aksharjobs
DB_NAME=aksharjobs

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_EXPIRATION=24h

# Email
EMAIL_USERNAME=noreply@aksharjobs.com
EMAIL_PASSWORD=your-app-password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# SMS
CELCOM_API_KEY=e6bf441d8fd044399d1d6cdfdde154ea
CELCOM_PARTNER_ID=245
CELCOM_SHORTCODE=Shajanand

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Other
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-flask-secret-key
```

---

## 📈 Performance Optimizations

### Frontend Optimizations

```
1. Code Splitting
   ├── React.lazy() for route components
   ├── Dynamic imports for heavy components
   └── Separate vendor bundles

2. Caching Strategies
   ├── Service Worker for offline support
   ├── localStorage for user preferences
   ├── sessionStorage for temporary data
   └── HTTP caching headers

3. Asset Optimization
   ├── Image compression
   ├── Lazy loading images
   ├── WebP format support
   ├── CSS/JS minification
   └── Gzip compression

4. Rendering Optimization
   ├── React.memo for expensive components
   ├── useMemo for computed values
   ├── useCallback for functions
   ├── Virtual scrolling for long lists
   └── Debounce search inputs
```

### Backend Optimizations

```
1. Database Optimization
   ├── Proper indexing on frequently queried fields
   ├── Compound indexes for complex queries
   ├── Connection pooling
   ├── Query result caching
   └── Aggregation pipelines for reports

2. API Performance
   ├── Response compression (gzip)
   ├── Pagination for large datasets
   ├── Rate limiting
   ├── API response caching
   └── Async operations where possible

3. File Handling
   ├── GridFS for large files
   ├── Streaming for file downloads
   ├── Background processing for uploads
   └── CDN for static assets

4. Scalability
   ├── Horizontal scaling (multiple workers)
   ├── Load balancing
   ├── Redis for session management
   └── Message queue for background jobs
```

---

## 🎉 Summary

This visual system architecture document provides:

✅ **Complete System Overview** - High-level architecture
✅ **Detailed Component Breakdown** - Frontend & Backend
✅ **Database Schema** - All collections with fields
✅ **AI/ML Pipeline** - Resume parsing & matching process
✅ **Authentication Flow** - JWT-based security
✅ **API Architecture** - RESTful endpoint structure
✅ **Deployment Guide** - Production setup
✅ **Performance Tips** - Optimization strategies

---

**Document Version:** 1.0
**Last Updated:** October 5, 2025
**Platform:** AksharJobs
**Purpose:** Technical Architecture Reference

**Related Documents:**
- COMPLETE_ROLE_FLOW_DIAGRAMS.md (User flows)
- ROLE_FLOW_QUICK_REFERENCE.md (Quick reference)
- Website_Architecture_Map.md (Architecture overview)
- README.md (Project overview)


