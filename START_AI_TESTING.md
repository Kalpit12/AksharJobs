# 🚀 Start AI Features Testing - Quick Guide

## Issue
MongoDB is not running, which is required for the backend and AI features.

## Solution - Step by Step

### Step 1: Start MongoDB

**Option A - If you have MongoDB installed:**
```bash
# Start MongoDB service
net start MongoDB
```

**Option B - If MongoDB is not a service:**
```bash
# Navigate to MongoDB bin folder (usually):
cd "C:\Program Files\MongoDB\Server\[version]\bin"
mongod --dbpath "C:\data\db"
```

**Option C - Using Docker (recommended):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Verify MongoDB is Running

```bash
# Check if MongoDB is accessible
mongo --eval "db.version()"
# OR
mongosh --eval "db.version()"
```

### Step 3: Start Backend Server

```bash
cd backend
python app.py
```

You should see:
```
 * Running on http://localhost:3002
 * Connected to MongoDB successfully
```

### Step 4: Setup Test Accounts

```bash
# In a new terminal
cd backend
python setup_ai_test_accounts.py
```

### Step 5: Run AI Features Tests

```bash
cd backend
python test_ai_features_complete.py
```

### Step 6: Start Frontend (if needed)

```bash
# In another terminal
cd frontend
npm start
```

---

## Quick Test Without Backend

If you want to test the frontend UI without backend, the AI components will show errors but you can see the design:

1. Start frontend only: `cd frontend && npm start`
2. Login with any account
3. Navigate to dashboards to see AI component layouts
4. Click AI buttons (they will show errors but UI is visible)

---

## All Test Accounts

After running `setup_ai_test_accounts.py`:

**Job Seeker:**
- Email: jobseeker@test.com
- Password: Test123!@#

**Intern:**
- Email: intern@test.com  
- Password: Test123!@#

**Recruiter:**
- Email: recruiter@test.com
- Password: Test123!@#

---

## What to Test

### Job Seeker Dashboard
✅ AI Career Path Advisor
- Click "Generate My Career Path"
- See 4-stage roadmap (Current → 1-2Y → 3-4Y → 5Y+)
- View salary projections
- Check recommendations

### Intern Dashboard
✅ AI Project Recommender
- Click "Get Project Recommendations"
- See 4 recommended projects
- Check difficulty levels and resume value

✅ AI Learning Path Generator
- Click "Generate Learning Path"
- View 4 learning phases
- Check weekly schedule

### Recruiter Dashboard
✅ AI Job Description Generator
- Enter job title and details
- Click "Generate Job Description"
- See full JD with metrics

✅ AI Application Review (if applications exist)
- Open any application
- Click "AI Quick Review"
- See score and analysis

✅ AI Offer Predictor (if candidates exist)
- Select candidate
- Click "Predict Offer Acceptance"
- Enter offer details
- See acceptance probability

---

## Troubleshooting

### "MongoDB connection refused"
**Fix:** Start MongoDB first (see Step 1 above)

### "Module not found" errors
**Fix:** 
```bash
cd backend
pip install -r requirements.txt
```

### "Port already in use"
**Fix:** Kill the process on port 3002 or change port in config

### "No applications/candidates found"
**Fix:** Create test data by:
1. Login as job seeker
2. Apply to a job
3. Then test application review

---

## ✅ Success Indicators

When everything works, you'll see:

**Backend Console:**
```
✓ MongoDB connected
✓ AI Features routes registered
✓ Server running on port 3002
```

**Test Script Output:**
```
✅ PASS - Career Path Advisor
✅ PASS - Project Recommender
✅ PASS - Learning Path Generator
✅ PASS - Job Description Generator
✅ PASS - Application Review
✅ PASS - Offer Predictor

🎉 ALL TESTS PASSED!
```

**Frontend:**
- All AI buttons work
- No error messages
- Data loads and displays
- Animations smooth

---

## 🎯 Quick Manual Test (No MongoDB)

Want to see the AI features UI without setting up MongoDB?

The components are already integrated! Just:

1. Check the component files in `frontend/src/components/AI*.jsx`
2. Review the beautiful UI designs
3. See the integration in dashboards
4. All styling is complete

The backend logic is ready - just needs MongoDB running to store data!

