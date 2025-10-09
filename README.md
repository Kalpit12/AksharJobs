# 🚀 AksharJobs - AI-Powered Job Matching Platform

**Where Talent Meets Opportunity**

A full-stack job matching platform with AI-powered resume analysis, smart job recommendations, and comprehensive recruitment tools.

[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-Python-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

### For Job Seekers
- 🤖 **AI Resume Analysis** - Powered by Gemini AI
- 📊 **Smart Match Scoring** - Find your perfect job
- 📝 **Resume Builder** - Professional templates
- 📈 **Application Tracker** - Track your progress
- 🎯 **Job Recommendations** - Personalized suggestions
- 💬 **AI Career Coach** - Get career guidance

### For Recruiters
- 🔍 **Smart Candidate Search** - AI-powered matching
- 📊 **Analytics Dashboard** - Insights and metrics
- 💼 **Bulk Job Posting** - Upload multiple jobs
- ⭐ **Application Review AI** - Automated screening
- 🎁 **Promo Code System** - Referral rewards
- 💰 **Akshar Coins** - Gamification system

### Platform Features
- 🌐 **Community System** - Industry-specific groups
- 📧 **Email Verification** - Secure authentication
- 🔐 **OAuth Integration** - Google login
- ☁️ **Cloud Storage** - Cloudinary integration
- 💾 **MongoDB Atlas** - Scalable database
- 🔒 **Secure** - JWT authentication

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2
- **Routing:** React Router v6
- **Styling:** CSS3, Tailwind CSS
- **Animations:** Framer Motion, GSAP, AOS
- **Charts:** Chart.js
- **Icons:** FontAwesome
- **HTTP Client:** Axios

### Backend
- **Framework:** Flask (Python)
- **Database:** MongoDB Atlas
- **Authentication:** JWT, OAuth2
- **AI Integration:** Google Gemini AI
- **File Storage:** Cloudinary
- **Email:** Gmail SMTP
- **Process Manager:** PM2 (production)

### Infrastructure
- **Database:** MongoDB Atlas (Cloud)
- **Hosting:** AWS EC2 (recommended)
- **Web Server:** Nginx
- **SSL:** Let's Encrypt

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for SMTP)

### 1. Clone Repository

```bash
git clone https://github.com/Kalpit12/AksharJobs.git
cd AksharJobs
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy ..\env.example .edn.local
# Edit .edn.local with your credentials
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo REACT_APP_API_URL=http://localhost:3002/api > .env
```

### 4. Configure MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGO_URI` in `backend/.edn.local`

See: [MongoDB Atlas Migration Guide](MONGODB_ATLAS_MIGRATION_GUIDE.md)

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
# Backend runs on http://localhost:3002
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3003
```

### 6. Access Application

Open browser: **http://localhost:3003**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](QUICK_START_GUIDE.md) | Detailed setup instructions |
| [Atlas Migration](MONGODB_ATLAS_MIGRATION_GUIDE.md) | MongoDB Atlas setup |
| [Atlas Quick Start](MONGODB_ATLAS_QUICK_START.md) | Quick Atlas migration |
| [AWS Deployment](AWS_DEPLOYMENT_GUIDE.md) | Deploy to AWS EC2 |
| [AWS Quick Start](AWS_QUICK_START.md) | Quick AWS deployment |
| [Deployment Options](AWS_DEPLOYMENT_OPTIONS.md) | Compare deployment methods |
| [API Documentation](EXPO_API_DOCUMENTATION.md) | API endpoints reference |

---

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.edn.local` in the root and `backend/.edn.local`:

**Required:**
- `MONGO_URI` - MongoDB Atlas connection string
- `DB_NAME` - Database name (TalentMatchDB)
- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT secret key

**Optional:**
- `GEMINI_API_KEY` - For AI features
- `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD` - For email
- `CLOUDINARY_*` - For file uploads
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - For OAuth

See `env.example` for full list.

---

## 🚀 Deployment

### Deploy to AWS

**Quick Deployment (30 minutes):**
```bash
# See AWS_QUICK_START.md for detailed steps
1. Launch EC2 instance (t2.micro - FREE)
2. SSH to instance
3. Run deployment script
4. Access via Elastic IP
```

**Detailed Guide:** [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)

### Other Options
- **Lightsail:** $5/month - Simplest option
- **Elastic Beanstalk:** ~$20/month - Managed service
- **Docker/ECS:** Container-based deployment

See: [AWS_DEPLOYMENT_OPTIONS.md](AWS_DEPLOYMENT_OPTIONS.md)

---

## 📊 Database

### MongoDB Atlas

This project uses **MongoDB Atlas** (cloud database):
- ✅ Free tier available (M0)
- ✅ 512 MB storage
- ✅ Automatic backups
- ✅ Built-in monitoring

**Collections:**
- `users` - User accounts
- `jobs` - Job postings
- `applications` - Job applications
- `resumes` - Resume data
- `communities` - Community groups
- `promo_codes` - Referral codes
- And more...

**Migration Script:** `test_atlas_connection.py`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_atlas_connection.py  # Test database
python test_backend.py            # Test API endpoints
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Project Structure

```
AksharJobs/
├── backend/              # Flask backend
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── utils/           # Utility functions
│   ├── app.py           # Main application
│   └── requirements.txt # Python dependencies
│
├── frontend/            # React frontend
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── api/        # API services
│   │   ├── styles/     # CSS files
│   │   └── App.js      # Main app component
│   └── package.json    # Node dependencies
│
├── docs/               # Documentation
├── uploads/            # Uploaded files (gitignored)
└── README.md          # This file
```

---

## 🔐 Security

- ✅ JWT authentication
- ✅ Password hashing
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Environment variables for secrets

**Important:** Never commit `.edn.local` or any file with sensitive data!

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Kalpit Patel** - [GitHub](https://github.com/Kalpit12)

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database
- Google Gemini AI for AI features
- Cloudinary for file storage
- All open-source contributors

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Kalpit12/AksharJobs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Kalpit12/AksharJobs/discussions)
- **Email:** kalpitpatel751@gmail.com

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

## 📈 Status

- ✅ MongoDB Atlas integrated
- ✅ Backend API functional
- ✅ Frontend responsive
- ✅ AI features implemented
- ✅ AWS deployment guides
- 🚀 Ready for production!

---

**Made with ❤️ by the AksharJobs Team**

[🌐 Visit Website](http://aksharjobs.com) | [📧 Contact Us](mailto:kalpitpatel751@gmail.com)
