babash# 🚀 Start MongoDB on Windows - Simple Guide

## Your MongoDB Location
```
C:\Program Files\MongoDB\Server\8.0\bin
```

---

## ✅ Quick Start Options

### Option 1: Start as Administrator (Recommended)

1. **Open Command Prompt as Administrator**
   - Press Windows Key
   - Type "cmd"
   - Right-click "Command Prompt"
   - Select "Run as administrator"

2. **Start MongoDB Service**
   ```bash
   net start MongoDB
   ```

3. **Verify it's running**
   ```bash
   sc query MongoDB
   ```

---

### Option 2: Start MongoDB Manually

1. **Open PowerShell as Administrator**

2. **Create data directory (if not exists)**
   ```bash
   mkdir C:\data\db
   ```

3. **Start MongoDB**
   ```bash
   cd "C:\Program Files\MongoDB\Server\8.0\bin"
   .\mongod --dbpath "C:\data\db"
   ```

4. **Keep this window open** - MongoDB will run in this window

---

### Option 3: Check if Already Running

1. **Open Task Manager** (Ctrl + Shift + Esc)
2. **Go to Services tab**
3. **Look for "MongoDB"**
4. **If Status = "Running"** → You're good to go!

---

## ✅ After MongoDB is Running

### Test Connection

Open a new terminal:
```bash
cd "C:\Program Files\MongoDB\Server\8.0\bin"
.\mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
Using MongoDB: 8.0.10
```

Type `exit` to close.

---

### Start Backend

```bash
cd C:\Users\kalpi\Desktop\AksharJobs\backend
python app.py
```

You should see:
```
✅ MongoDB connected successfully
✅ AI Features routes registered
 * Running on http://localhost:3002
```

---

### Setup Test Accounts

In a **NEW terminal**:
```bash
cd C:\Users\kalpi\Desktop\AksharJobs\backend
python setup_ai_test_accounts.py
```

---

### Run AI Tests

```bash
cd C:\Users\kalpi\Desktop\AksharJobs\backend
python test_ai_features_complete.py
```

---

### Start Frontend

In a **NEW terminal**:
```bash
cd C:\Users\kalpi\Desktop\AksharJobs\frontend
npm start
```

---

## 🎯 All Ready to Test!

Once everything is running, visit:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3002

**Test Accounts:**
- Job Seeker: `jobseeker@test.com` / `Test123!@#`
- Intern: `intern@test.com` / `Test123!@#`
- Recruiter: `recruiter@test.com` / `Test123!@#`

---

## 🤖 What to Test

### 1. Job Seeker - AI Career Path
- Login → Dashboard → AI Career Path Advisor → Generate

### 2. Intern - AI Projects & Learning
- Login → Dashboard → AI Project Recommender → Generate
- Same page → AI Learning Path Generator → Generate

### 3. Recruiter - AI Tools
- Login → Dashboard → AI Job Description Generator
- Or go to Post Job → Step 2 → AI Generator
- View Applications → AI Quick Review
- Select Candidate → Predict Offer Acceptance

---

## 🎉 You're All Set!

**Next command to run:**
Open PowerShell **as Administrator** and run:
```
net start MongoDB
```

Then the AI features will work perfectly! 🚀

