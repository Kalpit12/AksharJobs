# 🚀 RocketJobs Quick Start Guide

## What We've Built

✅ **Modern Frontend**: Beautiful Login and Signup pages matching your website's UI  
✅ **MongoDB Backend**: Complete authentication system with JWT tokens  
✅ **API Integration**: Frontend now connects to your local MongoDB backend  
✅ **User Management**: Support for Job Seekers and Recruiters  

## 🚀 Quick Start (5 minutes)

### 1. Start MongoDB
```bash
# Windows: MongoDB should be running as a service
# Check Services app -> MongoDB

# macOS:
brew services start mongodb/brew/mongodb-community

# Linux:
sudo systemctl start mongod
```

### 2. Start Backend
```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start server
python start_backend.py
```

### 3. Start Frontend
```bash
# In a new terminal
cd frontend
npm start
```

## 🔐 Test Authentication

### Option 1: Use the Test Script
```bash
cd backend
python test_auth.py
```

### Option 2: Test Manually
1. Go to `http://localhost:3002/signup`
2. Create a new account
3. Go to `http://localhost:3002/login`
4. Login with your credentials

## 📱 Available Endpoints

- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/login` - User authentication
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/get_user` - Get user details (protected)

## 🎯 User Types

- **Job Seeker**: Can apply for jobs, upload resumes
- **Recruiter**: Can post jobs, view applications

## 🔧 Configuration

### Backend (.env file)
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=rocketjobs
SECRET_KEY=your-super-secret-jwt-key
```

### Frontend
- Backend URL: `http://localhost:5000`
- Automatically configured in `src/config/api.js`

## 🚨 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh
# or
mongo
```

### Port Already in Use
```bash
# Change port in backend/app.py
app.run(host="0.0.0.0", port=5001, debug=True)
```

### Frontend Can't Connect
- Check if backend is running on port 5000
- Verify CORS is enabled (already configured)
- Check browser console for errors

## 🎉 What's Working Now

1. **User Registration**: Complete signup form with validation
2. **User Login**: Secure authentication with JWT tokens
3. **Role-Based Access**: Different dashboards for different user types
4. **MongoDB Storage**: All user data stored locally
5. **Modern UI**: Beautiful, responsive design matching your website
6. **Form Validation**: Client-side and server-side validation
7. **Error Handling**: Proper error messages and user feedback

## 🔮 Next Steps

1. **Email Verification**: Add email confirmation for new accounts
2. **Password Reset**: Implement forgot password functionality
3. **Profile Management**: Allow users to edit their profiles
4. **Job Posting**: Enable recruiters to create job listings
5. **Application System**: Build job application workflow

## 📞 Need Help?

- Check the `README_MONGODB_SETUP.md` for detailed MongoDB setup
- Run `python test_auth.py` to verify everything is working
- Check browser console and backend terminal for error messages

---

**🎯 Goal**: You now have a complete, working authentication system that connects your beautiful frontend to a MongoDB backend!
