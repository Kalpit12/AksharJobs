# MongoDB Integration Testing Guide

## 🎯 Step-by-Step Testing Instructions

### ✅ Prerequisites

1. **MongoDB Running**: Make sure MongoDB is installed and running
   ```bash
   # Check if MongoDB is running
   mongo --eval "db.runCommand({ ping: 1 })"
   ```

2. **Python Virtual Environment**: Activate your venv
   ```bash
   # Windows
   cd C:\Users\kalpi\Desktop\AksharJobs
   .\venv\Scripts\activate
   ```

3. **Backend Dependencies**: Make sure all packages are installed
   ```bash
   cd backend
   pip install flask flask-cors flask-jwt-extended pymongo python-dotenv
   ```

---

## 🚀 Method 1: Start Backend Manually

### Step 1: Start Backend Server

Open a **NEW terminal/command prompt** and run:

```bash
cd C:\Users\kalpi\Desktop\AksharJobs
.\venv\Scripts\activate
cd backend
python app.py
```

You should see:
```
[OK] MongoDB connected successfully!
[OK] EXPO_REGISTRATION database connected successfully!
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

**Keep this terminal open!**

### Step 2: Run Tests

Open a **SECOND terminal** and run:

```bash
cd C:\Users\kalpi\Desktop\AksharJobs
python test_expo_mongodb.py
```

You should see successful test results!

---

## 🌐 Method 2: Test via Frontend (Easier!)

### Step 1: Start Backend (if not already running)

```bash
cd C:\Users\kalpi\Desktop\AksharJobs\backend
python app.py
```

### Step 2: Open Frontend

1. Open `AKSHAREXPO/expo_landing.html` in your browser
2. Open **Developer Console** (F12)
3. Click "Register Now"
4. Fill in the registration form
5. Submit

### Step 3: Check Console Logs

You should see in the browser console:
```
✅ Expo MongoDB API Client loaded
🔧 MongoDB API ENABLED
📍 API Base URL: http://localhost:5000/api/expo
🚀 Attempting MongoDB API registration...
📡 MongoDB API Request: POST http://localhost:5000/api/expo/register
✅ MongoDB API Response: {...}
✅ MongoDB registration successful
```

---

## 🔍 Method 3: Manual API Testing with curl/Postman

### Test 1: Health Check

```bash
curl http://localhost:5000/api/expo/health
```

Expected response:
```json
{
  "success": true,
  "message": "AksharJobs Expo API is running",
  "timestamp": "2025-09-30T..."
}
```

### Test 2: Register User

```bash
curl -X POST http://localhost:5000/api/expo/register ^
  -H "Content-Type: application/json" ^
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"1234567890\",\"role\":\"job_seeker\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "Registration saved successfully",
  "timestamp": "...",
  "registrationId": "..."
}
```

### Test 3: Track Referral

```bash
curl -X POST http://localhost:5000/api/expo/referral/track ^
  -H "Content-Type: application/json" ^
  -d "{\"referrerName\":\"John Doe\",\"referrerEmail\":\"john@example.com\",\"platform\":\"whatsapp\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins for sharing.",
  "coinsEarned": 3,
  "totalCoins": 3
}
```

---

## 💾 Method 4: Verify Data in MongoDB

After running tests, check MongoDB directly:

```bash
# Open MongoDB shell
mongo

# Switch to EXPO_REGISTRATION database
use EXPO_REGISTRATION

# Check registrations
db.registrations.find().pretty()

# Count registrations
db.registrations.countDocuments()

# Check by role
db.registrations.find({role: "job_seeker"}).pretty()

# Check referral tracking
db.referral_tracking.find().pretty()

# Check referral clicks
db.referral_clicks.find().pretty()

# Get registration stats
db.registrations.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

---

## 🐛 Troubleshooting

### Problem: Backend won't start

**Error: "Cannot connect to MongoDB"**

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Or manually start
   "C:\Program Files\MongoDB\Server\X.X\bin\mongod.exe"
   ```

2. Check MongoDB connection string in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/
   ```

---

### Problem: "Module not found" errors

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

If no requirements.txt:
```bash
pip install flask flask-cors flask-jwt-extended pymongo python-dotenv requests
```

---

### Problem: Port 5000 already in use

**Solution:**

Option 1: Kill the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Option 2: Change port in `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # Changed to 5001
```

Then update `AKSHAREXPO/expo_api_config.js`:
```javascript
const MONGO_API_BASE_URL = 'http://localhost:5001/api/expo';
```

---

### Problem: CORS errors in browser

**Solution:**
The backend already has CORS configured. Make sure:
1. Backend is running
2. You're accessing via `http://` not `file://`
3. Clear browser cache

---

## ✅ Success Indicators

### Backend Running Successfully:
```
[OK] MongoDB connected successfully!
[OK] EXPO_REGISTRATION database connected successfully!
 * Running on http://127.0.0.1:5000
```

### Frontend Console (Registration):
```
🚀 Attempting MongoDB API registration...
✅ MongoDB registration successful
```

### MongoDB Data Verification:
```javascript
// Should return your registration
db.registrations.find({email: "your@email.com"})
```

---

## 📊 Expected Test Results

When you run `python test_expo_mongodb.py`, you should see:

```
============================================================
  EXPO MONGODB INTEGRATION TEST
============================================================

============================================================
  1. Testing API Health Check
============================================================
Status Code: 200
[SUCCESS] API is running successfully!

============================================================
  2. Testing Registration
============================================================
Registering user: Test User MongoDB
Status Code: 201
[SUCCESS] Registration successful!

============================================================
  3. Testing Registration Check
============================================================
Status Code: 200
[SUCCESS] Registration found in database!

============================================================
  4. Testing Referral Tracking
============================================================
Status Code: 200
[SUCCESS] Referral tracking successful!
   Coins Earned: 3
   Total Coins: 3

============================================================
  5. Testing Get Referral Data
============================================================
Status Code: 200
[SUCCESS] Referral data retrieved!

============================================================
  6. Testing Registration Statistics
============================================================
Status Code: 200
[SUCCESS] Statistics retrieved!
   Total Registrations: 1

============================================================
  7. Testing Referral Leaderboard
============================================================
[SUCCESS] Leaderboard retrieved!

============================================================
  TEST SUMMARY
============================================================
[COMPLETED] All tests finished!
```

---

## 🎯 Quick Start (Recommended)

**Easiest way to test everything:**

1. **Terminal 1** - Start Backend:
   ```bash
   cd C:\Users\kalpi\Desktop\AksharJobs\backend
   python app.py
   ```

2. **Terminal 2** - Run Tests:
   ```bash
   cd C:\Users\kalpi\Desktop\AksharJobs
   python test_expo_mongodb.py
   ```

3. **Browser** - Test UI:
   - Open `AKSHAREXPO/expo_landing.html`
   - Open Console (F12)
   - Register as a user
   - Watch the MongoDB API logs

4. **MongoDB Shell** - Verify Data:
   ```bash
   mongo
   use EXPO_REGISTRATION
   db.registrations.find().pretty()
   ```

---

## 📞 Need Help?

If you're still having issues:

1. Check MongoDB is running: `mongo --eval "db.version()"`
2. Check Python version: `python --version` (should be 3.8+)
3. Check if port 5000 is free: `netstat -ano | findstr :5000`
4. Check backend logs for errors
5. Check browser console for frontend errors

---

**Good luck testing! 🚀**

