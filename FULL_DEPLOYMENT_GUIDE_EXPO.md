# Complete Expo Deployment Guide - Frontend + Backend

## 🎯 Your Setup for Real Expo Event

You need **TWO** deployments:
1. **Frontend** (Vercel) - Expo landing page
2. **Backend** (Render/Railway) - MongoDB API for data storage

---

## 🚀 RECOMMENDED: Two-Part Deployment

### Part 1: Deploy Backend First (MongoDB API)
### Part 2: Deploy Frontend (Vercel) pointing to backend

---

## 📊 Part 1: Deploy Backend API

### Option A: Render.com (FREE & EASY) ⭐ RECOMMENDED

**Why Render:**
- ✅ Free tier available
- ✅ Easy MongoDB connection
- ✅ Auto-deploys from GitHub
- ✅ Built-in SSL certificate
- ✅ No credit card required for free tier

#### Step-by-Step Backend Deployment on Render:

**1. Prepare Backend Files:**

Create `requirements.txt` in `backend` folder if not exists:

```txt
Flask==3.0.0
flask-cors==4.0.0
flask-jwt-extended==4.5.3
pymongo==4.6.0
python-dotenv==1.0.0
gunicorn==21.2.0
```

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: aksharjobs-backend
    env: python
    region: oregon
    plan: free
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "cd backend && gunicorn app:app"
    envVars:
      - key: MONGO_URI
        value: mongodb+srv://YOUR_MONGO_ATLAS_URI
      - key: DB_NAME
        value: TalentMatchDB
      - key: PORT
        value: 3002
```

**2. Setup MongoDB Atlas (Free Cloud MongoDB):**

Since Render needs cloud MongoDB, not localhost:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`

**3. Deploy to Render:**

```bash
# 1. Push your code to GitHub
cd C:\Users\kalpi\Desktop\AksharJobs
git init
git add backend/
git commit -m "Backend for expo"
git push origin main

# 2. Go to render.com
# 3. Sign up/Login
# 4. Click "New +"
# 5. Select "Web Service"
# 6. Connect your GitHub repo
# 7. Configure:
   - Name: aksharjobs-expo-api
   - Environment: Python 3
   - Build Command: pip install -r backend/requirements.txt
   - Start Command: cd backend && gunicorn app:app
   - Add environment variables:
     * MONGO_URI = your_atlas_connection_string
     * DB_NAME = TalentMatchDB

# 8. Click "Create Web Service"
# 9. Wait 5-10 minutes for deployment
```

**Your backend will be at:** `https://aksharjobs-expo-api.onrender.com`

---

### Option B: Railway.app (EASY, FREE TIER)

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Deploy:**
```bash
cd C:\Users\kalpi\Desktop\AksharJobs\backend

# Login to Railway
railway login

# Initialize project
railway init

# Add MongoDB plugin
railway add mongodb

# Deploy
railway up

# Get URL
railway domain
```

**Your backend will be at:** `https://aksharjobs-expo-api.railway.app`

---

### Option C: Fly.io (FREE TIER)

```bash
# Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Navigate to backend
cd C:\Users\kalpi\Desktop\AksharJobs\backend

# Login
fly auth login

# Launch app
fly launch --name aksharjobs-expo-api

# Set secrets
fly secrets set MONGO_URI="your_atlas_uri"
fly secrets set DB_NAME="TalentMatchDB"

# Deploy
fly deploy
```

---

## 📦 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL

**Edit `AKSHAREXPO/expo_api_config.js`:**

```javascript
// MongoDB Backend API Configuration
// IMPORTANT: Update this with your deployed backend URL
const MONGO_API_BASE_URL = 'https://aksharjobs-expo-api.onrender.com/api/expo';

// Keep MongoDB API enabled for expo event
const USE_MONGODB_API = true;
```

### Step 2: Deploy to Vercel

```bash
# Method 1: Via Dashboard (Easiest)
1. Go to vercel.com
2. Sign in
3. Click "Add New Project"
4. Upload AKSHAREXPO folder
5. Deploy

# Method 2: Via CLI
cd AKSHAREXPO
npx vercel --prod
```

**Your frontend will be at:** `https://aksharjobs-expo.vercel.app`

---

## ✅ COMPLETE SETUP CHECKLIST

### Backend Deployment:
- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Backend deployed to Render/Railway/Fly
- [ ] Environment variables set (MONGO_URI, DB_NAME)
- [ ] Backend URL tested: `https://YOUR-BACKEND/api/expo/health`

### Frontend Deployment:
- [ ] `expo_api_config.js` updated with backend URL
- [ ] `USE_MONGODB_API` set to `true`
- [ ] vercel.json exists
- [ ] Frontend deployed to Vercel
- [ ] Test registration works end-to-end

---

## 🧪 Testing Deployed System

### 1. Test Backend API:
```bash
# Health check
curl https://aksharjobs-expo-api.onrender.com/api/expo/health

# Expected: {"success": true, "message": "..."}
```

### 2. Test Frontend:
1. Open your Vercel URL
2. Open browser console (F12)
3. Click "Register Now"
4. Fill form and submit
5. Check console for:
   ```
   ✅ MongoDB API Client loaded
   🚀 Attempting MongoDB API registration...
   ✅ MongoDB registration successful
   ```

### 3. Verify Data in MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Find `EXPO_REGISTRATION` database
4. Check `registrations` collection
5. See your test registration!

---

## 🔧 Backend Files Needed for Deployment

Make sure these exist in `backend` folder:

### Required Files:
```
backend/
├── app.py                    ✅ Main Flask app
├── requirements.txt          ✅ Python dependencies
├── models/
│   └── expo_model.py        ✅ MongoDB models
├── routes/
│   └── expo_routes.py       ✅ API routes
└── utils/
    └── db.py                ✅ Database connection
```

### Create `requirements.txt`:

```txt
Flask==3.0.0
flask-cors==4.0.0
flask-jwt-extended==4.5.3
pymongo==4.6.0
python-dotenv==1.0.0
gunicorn==21.2.0
requests==2.31.0
```

### Update `app.py` for production:

At the end of `app.py`, change:

```python
if __name__ == '__main__':
    # Get port from environment variable (for deployment)
    import os
    port = int(os.getenv('PORT', 3002))
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False  # False for production
    )
```

---

## 🌍 Environment Variables

### Backend Environment Variables (Set in Render/Railway):

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=TalentMatchDB
PORT=3002
FLASK_ENV=production
```

### Frontend Environment Variables (Optional in Vercel):

```
VITE_API_BASE_URL=https://aksharjobs-expo-api.onrender.com/api/expo
```

---

## 🎯 Quick Start: Fastest Deployment Path

### For Your Expo Event (Recommended Order):

**Day 1: Deploy Backend**
1. Sign up for MongoDB Atlas (5 min)
2. Create cluster and get connection string (10 min)
3. Deploy backend to Render.com (15 min)
4. Test backend API (5 min)

**Day 2: Deploy Frontend**
1. Update `expo_api_config.js` with backend URL (2 min)
2. Deploy AKSHAREXPO to Vercel (5 min)
3. Test end-to-end (10 min)
4. Share URL with expo attendees! 🎉

**Total time: ~50 minutes**

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│         EXPO ATTENDEES                  │
│     (Mobile/Desktop Browsers)           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        VERCEL (Frontend)                │
│   https://aksharjobs-expo.vercel.app    │
│                                         │
│  - expo_landing.html                   │
│  - expo_landing.js                     │
│  - expo_api_config.js                  │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  │
                  ▼
┌─────────────────────────────────────────┐
│     RENDER (Backend API)                │
│  https://aksharjobs-api.onrender.com    │
│                                         │
│  - Flask App (app.py)                  │
│  - API Routes (expo_routes.py)         │
│  - MongoDB Models (expo_model.py)      │
└─────────────────┬───────────────────────┘
                  │
                  │ Database Queries
                  │
                  ▼
┌─────────────────────────────────────────┐
│      MONGODB ATLAS (Database)           │
│  mongodb+srv://cluster.mongodb.net      │
│                                         │
│  Database: EXPO_REGISTRATION           │
│  - registrations (users)               │
│  - referral_tracking (coins)           │
│  - referral_clicks (events)            │
└─────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

### FREE TIER (For small expo):
- ✅ Vercel: FREE (100GB bandwidth)
- ✅ Render: FREE (512MB RAM, sleeps after 15 min inactivity)
- ✅ MongoDB Atlas: FREE (512MB storage)
- **Total: $0/month**

### PAID TIER (For large expo, no sleep):
- Vercel: FREE or $20/month (Pro)
- Render: $7/month (always on, better performance)
- MongoDB Atlas: FREE or $9/month (more storage)
- **Total: $7-$36/month**

---

## 🚨 Important Notes for Expo Event

### Before the Expo:
1. ✅ Deploy and test everything 2-3 days before
2. ✅ Create backup QR codes for registration
3. ✅ Test on mobile devices (Android & iOS)
4. ✅ Ensure backend won't sleep (upgrade Render if needed)
5. ✅ Print backup registration forms (just in case)

### During the Expo:
- Backend on free tier sleeps after 15 minutes
- First request takes 30-60 seconds to wake up
- Consider upgrading to $7/month paid tier for instant response
- Or keep Google Sheets as backup (already configured!)

### Backup Plan:
If MongoDB backend has issues:
1. Set `USE_MONGODB_API = false`
2. Redeploy frontend
3. Falls back to Google Sheets
4. No data lost (localStorage backup too)

---

## 📞 Support During Expo

**If backend is slow/sleeping:**
```javascript
// Quick fix: Disable MongoDB temporarily
const USE_MONGODB_API = false;
// Redeploy to Vercel (2 minutes)
```

**If you need 24/7 uptime:**
- Upgrade Render to paid: $7/month
- Or use Railway: FREE tier doesn't sleep
- Or use Fly.io: FREE tier with 3 instances

---

## ✅ Final Pre-Expo Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Backend deployed and tested
- [ ] Frontend deployed with correct API URL
- [ ] End-to-end registration test successful
- [ ] Referral system tested
- [ ] Mobile responsive verified
- [ ] QR codes generated for easy access
- [ ] Backup plan ready (Google Sheets fallback)

---

**Ready for your expo! 🎉**

Your attendees can register and refer friends, and all data will be stored safely in MongoDB Atlas!

