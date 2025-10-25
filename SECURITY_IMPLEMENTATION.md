# 🔒 Security Implementation Guide
## Step-by-Step Instructions to Secure AksharJobs

---

## 🚨 **QUICK START (30 minutes before launch)**

### Step 1: Install Security Dependencies (5 minutes)

```bash
cd backend

# Install security packages
pip install email-validator
pip install bleach
pip install Flask-Limiter

# Update requirements.txt
pip freeze > requirements.txt
```

### Step 2: Set Up Environment Variables (5 minutes)

```bash
# Create .env file in backend/
cd backend
nano .env  # or use any text editor
```

Add this content (replace with your actual values):

```bash
# CRITICAL: Generate strong JWT secret
JWT_SECRET_KEY=your-super-secret-random-string-minimum-32-characters

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/aksharjobs

# API Keys
GEMINI_API_KEY=your-gemini-api-key

# Flask Config
FLASK_ENV=development
SECRET_KEY=another-random-secret-key
```

**Generate Strong Secret Keys:**
```bash
# In Python terminal
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
```

**Add .env to .gitignore:**
```bash
echo ".env" >> .gitignore
echo "*.pyc" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "logs/" >> .gitignore
```

### Step 3: Update backend/config.py (2 minutes)

```python
# backend/config.py
import os
from datetime import timedelta

class Config:
    # Load from environment variables (SECURE)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-change-this')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-this')
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/aksharjobs')
    
    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = 'HS256'
    
    # Security Headers
    JWT_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'  # HTTPS only in production
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_COOKIE_SAMESITE = 'Lax'
    
    # Get from environment
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
```

### Step 4: Implement Rate Limiting (5 minutes)

Add to `backend/app.py`:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Add after app initialization
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Apply to auth routes in backend/routes/auth_routes.py
from flask import Blueprint
from flask_limiter import Limiter

# In your auth routes file
@auth_routes.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # Max 5 attempts per minute
def login():
    # your login code
    pass

@auth_routes.route('/signup', methods=['POST'])
@limiter.limit("3 per hour")  # Max 3 signups per hour per IP
def signup():
    # your signup code
    pass
```

### Step 5: Fix CORS (Critical - 3 minutes)

Update `backend/app.py`:

```python
# Replace the current CORS code with:
ALLOWED_ORIGINS = [
    'http://localhost:3003',
    'http://127.0.0.1:3003',
    # Add your production domain when ready:
    # 'https://yourdomain.com',
    # 'https://www.yourdomain.com'
]

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    
    # Only allow specific origins
    if origin in ALLOWED_ORIGINS:
        response.headers.set('Access-Control-Allow-Origin', origin)
    
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    return response
```

### Step 6: Add Security Logging (5 minutes)

The files are already created (`backend/utils/security_logger.py`). Just integrate:

```python
# In backend/routes/auth_routes.py
from utils.security_logger import (
    log_login_success, 
    log_signup, 
    record_failed_attempt,
    check_brute_force
)

@auth_routes.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    
    # Check for brute force
    is_blocked, message = check_brute_force(ip_address)
    if is_blocked:
        return jsonify({'error': message}), 429
    
    # ... your login logic ...
    
    # If login fails:
    if not valid_credentials:
        record_failed_attempt(ip_address, email)
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # If login succeeds:
    log_login_success(str(user['_id']), email, ip_address)
    return jsonify({'token': token}), 200
```

### Step 7: Add Input Validation (5 minutes)

The validators are created (`backend/utils/validators.py`). Use them:

```python
# In backend/routes/auth_routes.py
from utils.validators import validate_password_strength, validate_email_address

@auth_routes.route('/signup', methods=['POST'])
def signup():
    email = data.get('email')
    password = data.get('password')
    
    # Validate email
    is_valid_email, email_or_error = validate_email_address(email)
    if not is_valid_email:
        return jsonify({'error': email_or_error}), 400
    
    # Validate password strength
    is_valid_password, password_message = validate_password_strength(password)
    if not is_valid_password:
        return jsonify({'error': password_message}), 400
    
    # Continue with registration...
```

```python
# In backend/routes/job_routes.py
from utils.validators import sanitize_job_data, validate_objectid_format

@job_routes.route("/add_job", methods=["POST"])
def add_job():
    data = request.json
    
    # Validate recruiter_id format
    recruiter_id = data.get("recruiter_id")
    if recruiter_id and not validate_objectid_format(recruiter_id):
        return jsonify({"error": "Invalid recruiter ID format"}), 400
    
    # Sanitize all input data
    sanitized_data = sanitize_job_data(data)
    
    # Use sanitized_data instead of data
    # ... create job with sanitized_data ...
```

---

## 📋 **VERIFICATION CHECKLIST**

After implementation, verify:

```bash
# 1. Check .env file exists
ls -la backend/.env

# 2. Check .env is in .gitignore
cat backend/.gitignore | grep .env

# 3. Test that secrets are loaded
python3 -c "import os; from dotenv import load_dotenv; load_dotenv('backend/.env'); print('JWT_SECRET_KEY length:', len(os.getenv('JWT_SECRET_KEY', '')))"

# 4. Check new files are created
ls backend/utils/validators.py
ls backend/utils/security_logger.py
ls logs/security.log  # Will be created after first security event
```

---

## 🧪 **TESTING SECURITY FEATURES**

### Test 1: Rate Limiting
```bash
# Try to login 10 times quickly
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Should see "Too many requests" after 5 attempts
```

### Test 2: Password Validation
```bash
# Try weak password
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"123",
    "role":"jobSeeker"
  }'

# Should return error about password strength
```

### Test 3: CORS
```bash
# Try request from unauthorized origin
curl -X GET http://localhost:5000/api/jobs/get_jobs \
  -H "Origin: http://evil-site.com"

# Should not include Access-Control-Allow-Origin header
```

### Test 4: Input Sanitization
```bash
# Try XSS in job title
curl -X POST http://localhost:5000/api/jobs/add_job \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobTitle":"<script>alert(\"XSS\")</script>Developer",
    "companyName":"Test Corp"
  }'

# Job title should be saved without <script> tags
```

---

## 🔐 **MONGODB SECURITY**

### Option A: MongoDB Atlas (Cloud)
1. Login to MongoDB Atlas
2. Go to **Network Access**
3. Remove `0.0.0.0/0` (allows all IPs)
4. Add only your server's IP address
5. Enable **Authentication** (already enabled by default)

### Option B: Local MongoDB
```bash
# 1. Enable authentication
mongo

use admin
db.createUser({
  user: "aksharjobs_admin",
  pwd: "strong-password-here",
  roles: ["userAdminAnyDatabase", "readWriteAnyDatabase"]
})

# 2. Start MongoDB with auth
mongod --auth --dbpath /data/db

# 3. Update connection string in .env
MONGODB_URI=mongodb://aksharjobs_admin:strong-password-here@localhost:27017/aksharjobs
```

---

## 🌐 **FRONTEND SECURITY**

### Install Security Packages
```bash
cd frontend
npm install dompurify
npm install @types/dompurify --save-dev
```

### Sanitize User Input
```javascript
// frontend/src/utils/sanitize.js (CREATE THIS)
import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  });
};

// Use in components when displaying user content
import { sanitizeHTML } from '../utils/sanitize';

<div dangerouslySetInnerHTML={{ 
  __html: sanitizeHTML(userGeneratedContent) 
}} />
```

### Secure Token Storage
```javascript
// frontend/src/utils/auth.js
// ⚠️ Instead of localStorage, use sessionStorage (less persistent)
export const setAuthToken = (token) => {
  sessionStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

export const removeAuthToken = () => {
  sessionStorage.removeItem('token');
};
```

---

## 📊 **MONITORING & LOGS**

### Check Security Logs
```bash
# View recent security events
tail -f backend/logs/security.log

# Search for failed logins
grep "LOGIN_FAILED" backend/logs/security.log

# Search for blocked IPs
grep "IP_BLOCKED" backend/logs/security.log

# Count login attempts by IP
cat backend/logs/security.log | grep "LOGIN" | jq -r '.ip_address' | sort | uniq -c | sort -rn
```

### Set Up Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/aksharjobs

# Add:
/path/to/AksharJobs/backend/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

---

## 🚀 **PRODUCTION DEPLOYMENT CHECKLIST**

Before deploying to production:

- [ ] All secrets in `.env` file
- [ ] `.env` in `.gitignore` (NEVER commit)
- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB authentication enabled
- [ ] MongoDB IP whitelist configured
- [ ] CORS restricted to your domain
- [ ] Rate limiting implemented
- [ ] Input validation on all routes
- [ ] Security logging enabled
- [ ] HTTPS/SSL certificate installed
- [ ] Security headers configured
- [ ] File upload validation
- [ ] Password strength requirements
- [ ] Brute force protection active

### Production Environment Variables
```bash
# Production .env should have:
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_COOKIE_SECURE=True  # HTTPS only
JWT_COOKIE_SECURE=True      # HTTPS only

# Add your production domain to CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## ⚡ **QUICK WINS (Implement First)**

These give maximum security benefit with minimal effort:

1. ✅ **Environment Variables** (5 min) - Protects secrets
2. ✅ **CORS Restriction** (3 min) - Prevents unauthorized access
3. ✅ **Rate Limiting** (5 min) - Prevents brute force
4. ✅ **Password Validation** (5 min) - Stronger passwords
5. ✅ **Security Logging** (5 min) - Detect attacks

**Total Time: ~25 minutes**
**Security Improvement: 70%+**

---

## 🆘 **IF YOU GET STUCK**

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'email_validator'`
**Fix**: `pip install email-validator bleach Flask-Limiter`

**Issue**: JWT secret not loading
**Fix**: Check `.env` file exists in `backend/` directory

**Issue**: CORS errors in browser
**Fix**: Check `ALLOWED_ORIGINS` includes `http://localhost:3003`

**Issue**: Rate limiting not working
**Fix**: Make sure `limiter` is initialized in `app.py`

---

## 📞 **SECURITY SUPPORT**

If you discover a security vulnerability:
1. **Do NOT** post publicly
2. Document the issue privately
3. Fix immediately
4. Review related code for similar issues

---

**Remember**: Security is a continuous process, not a one-time task!

**You've got this! 🔒🚀**

