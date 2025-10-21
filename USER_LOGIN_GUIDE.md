# 🔐 User Login Guide - AksharJobs

This guide contains login credentials for testing different user roles in the application.

## 📊 Database Overview

- **Total Users**: 50
- **Admin Users**: 2
- **Recruiters**: 6
- **Job Seekers**: 39 (job_seeker + jobSeeker)
- **Interns**: 3

## 🔑 Test Login Credentials

### 👔 ADMIN ACCOUNTS

| Name | Email | Password | Notes |
|------|-------|----------|-------|
| Admin User | `admin@example.com` | `admin123` | ✅ Verified Working |
| Admin User | `admin@rocketmatch.com` | Contact team | Original password |

**Redirect After Login**: `/admin`

---

### 💼 RECRUITER ACCOUNTS

| Name | Email | Password | Notes |
|------|-------|----------|-------|
| John Smith | `john.smith@testcompany.com` | `test123` | ✅ Verified Working |
| Sarah Johnson | `sarah.johnson@techcorp.com` | Contact team | Original password |
| Manish Patel | `Manishpatel131@gmail.com` | Contact team | Original password |
| Hetul Patel | `Hetulpatel265@gmail.com` | Contact team | Original password |

**Redirect After Login**: `/recruiter-dashboard`

---

### 👨‍💼 JOB SEEKER ACCOUNTS

| Name | Email | Password | Notes |
|------|-------|----------|-------|
| Test User | `test@example.com` | `password123` | ✅ Verified Working |
| John Doe | `john.doe@example.com` | `password123` | ✅ Verified Working |
| Kalpit Patel | `kalpit.patel@example.com` | `password123` | ✅ Verified Working |
| Kalpit patel | `kalpitpatel751@gmail.com` | `Test@123` | ✅ Verified Working |
| Kalpit Patel | `testuser123@gmail.com` | `Test@123` | ✅ Verified Working |
| Hemant Patel | `Hemant.patel@maxproinfotech.com` | Contact team | Original password |
| Manan Patel | `Mananpatelj12@gmail.com` | Contact team | Original password |

**Redirect After Login**: `/jobseeker-dashboard`

---

### 🎓 INTERN ACCOUNTS

| Name | Email | Password | Notes |
|------|-------|----------|-------|
| Hemant Patel | `hemant.patel@maxproinfotech.com` | Contact team | Original password |
| Aashni Patel | `aashniptl2000@gmail.com` | Contact team | Original password |
| Sarah Intern | `intern@test.com` | Contact team | Original password |

**Redirect After Login**: `/intern-dashboard`

---

## 🎯 Role-Based Routing

The application automatically redirects users after login based on their role:

```
User Type          → Redirect Path
─────────────────────────────────────────
job_seeker        → /jobseeker-dashboard
jobSeeker         → /jobseeker-dashboard
recruiter         → /recruiter-dashboard
intern            → /intern-dashboard
admin             → /admin
```

## 🔒 Authentication Flow

1. **Login Request**
   - POST `/api/auth/login`
   - Body: `{ "email": "...", "password": "..." }`

2. **Response**
   - JWT token stored in localStorage
   - User role stored for routing
   - Automatic redirect based on role

3. **Protected Routes**
   - All dashboard routes require authentication
   - Role-based access control enforced
   - Unauthorized users redirected to appropriate dashboard

## 📝 Testing Login

### Method 1: Using the Frontend

1. Start the frontend: `npm start` (should run on port 3003)
2. Navigate to `/login`
3. Enter email and password from the tables above
4. You'll be automatically redirected to the appropriate dashboard

### Method 2: Using API (cURL)

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Method 3: Using API (Python)

```python
import requests

response = requests.post('http://localhost:3002/api/auth/login', json={
    'email': 'test@example.com',
    'password': 'password123'
})

print(response.json())
```

## 🔐 Common Test Passwords

If you created test accounts, these passwords might work:
- `Test@123` - Default for newly fixed accounts
- `password123` - Common test password
- `admin123` - Admin test password
- `test123` - Simple test password

## ⚙️ Server Configuration

**Backend**: 
- Port: 3002
- URL: `http://localhost:3002`

**Frontend**: 
- Port: 3003
- URL: `http://localhost:3003`

## 🚀 Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test Login**:
   - Go to http://localhost:3003/login
   - Use any credentials from the tables above
   - Verify you're redirected to the correct dashboard

## 🐛 Troubleshooting

### Login Not Working?

1. **Check Backend is Running**:
   ```bash
   curl http://localhost:3002/api/health
   ```

2. **Check User Exists**:
   ```bash
   python show_all_users.py
   ```

3. **Fix Passwords**:
   ```bash
   python fix_user_passwords.py
   ```

4. **Check Console**:
   - Backend logs: Check terminal running `app.py`
   - Frontend logs: Check browser console (F12)

### Wrong Dashboard After Login?

- Check `userType` field in database
- Verify role mapping in `auth_service.py`
- Check `AuthContext.jsx` for role normalization

## 📚 Related Files

- `show_all_users.py` - View all users in database
- `fix_user_passwords.py` - Reset passwords for test users
- `test_user_logins.py` - Test login functionality
- `user_login_credentials.json` - JSON export of credentials

## ✅ Verification Checklist

- [ ] Backend running on port 3002
- [ ] Frontend running on port 3003
- [ ] MongoDB connected
- [ ] Can login as Admin
- [ ] Can login as Recruiter
- [ ] Can login as Job Seeker
- [ ] Can login as Intern
- [ ] Correct dashboard redirect for each role
- [ ] JWT token stored in localStorage
- [ ] Protected routes working

---

**Last Updated**: October 20, 2025
**Database**: TalentMatchDB (50 users)

