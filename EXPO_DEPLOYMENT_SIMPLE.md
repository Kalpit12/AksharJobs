# 🎯 Simple Expo Deployment Guide

## For Your Real Expo Event - Store All Data in MongoDB

---

## 📋 What You Need

1. ✅ MongoDB Atlas account (free) - Cloud MongoDB
2. ✅ Render.com account (free) - Backend hosting
3. ✅ Vercel account (free) - Frontend hosting

**Total setup time: 30-40 minutes**

---

## 🚀 Step 1: Setup MongoDB Atlas (10 minutes)

### Create Free Cloud MongoDB:

1. **Go to:** [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Sign up** (free - no credit card needed)

3. **Create Cluster:**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region closest to you (e.g., AWS / N. Virginia)
   - Click "Create"

4. **Create Database User:**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `expo_admin`
   - Password: Generate strong password (SAVE THIS!)
   - Database User Privileges: "Atlas Admin"
   - Click "Add User"

5. **Allow Network Access:**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String:**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy connection string (looks like):
   ```
   mongodb+srv://expo_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **IMPORTANT:** Replace `<password>` with your actual password
   - **SAVE THIS STRING!** You'll need it next.

---

## 🔧 Step 2: Deploy Backend to Render (15 minutes)

### Upload Backend to Cloud:

1. **Go to:** [render.com](https://render.com)

2. **Sign up** (free - can use GitHub login)

3. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Choose "Public Git repository" or "Upload code"

4. **If Uploading Code:**
   - First, create GitHub repo or upload directly
   - Or use Render's direct upload

5. **Configure Service:**
   ```
   Name: aksharjobs-expo-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

6. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these 3 variables:
   ```
   Key: MONGO_URI
   Value: [Paste your MongoDB connection string from Step 1]
   
   Key: DB_NAME
   Value: TalentMatchDB
   
   Key: FLASK_ENV
   Value: production
   ```

7. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://aksharjobs-expo-api.onrender.com`
   - **SAVE THIS URL!**

8. **Test Backend:**
   Open in browser:
   ```
   https://aksharjobs-expo-api.onrender.com/api/expo/health
   ```
   
   Should see:
   ```json
   {
     "success": true,
     "message": "AksharJobs Expo API is running"
   }
   ```

---

## 🌐 Step 3: Deploy Frontend to Vercel (10 minutes)

### Upload Expo Landing Page:

1. **Update API URL:**
   
   Open `AKSHAREXPO/expo_api_config.js`
   
   Change line 9:
   ```javascript
   const MONGO_API_BASE_URL = 'https://aksharjobs-expo-api.onrender.com/api/expo';
   ```
   (Use YOUR Render URL from Step 2)
   
   Make sure line 12 is:
   ```javascript
   const USE_MONGODB_API = true;
   ```

2. **Go to:** [vercel.com](https://vercel.com)

3. **Sign up** (free - can use GitHub login)

4. **Deploy:**
   - Click "Add New..."
   - Click "Project"
   - Click "Upload" (or connect GitHub)
   - Select entire `AKSHAREXPO` folder
   - Click "Deploy"
   - Wait 2-3 minutes

5. **Get URL:**
   - Vercel gives you URL like: `https://aksharjobs-expo.vercel.app`
   - **This is your expo landing page!**

6. **Test Frontend:**
   - Open the Vercel URL in browser
   - Open Developer Console (F12)
   - Click "Register Now"
   - Fill form and submit
   - Check console for success messages

---

## ✅ Step 4: Verify Everything Works

### Test Complete Flow:

1. **Open your Vercel URL** (expo landing page)

2. **Register a test user:**
   - Fill name, email, phone, role
   - Click Submit
   - Should see success message

3. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"
   - Find `EXPO_REGISTRATION` database
   - Click `registrations` collection
   - See your test registration! ✅

4. **Test Referral System:**
   - Click "Start Referring"
   - Share via WhatsApp/Email
   - Check console for coin tracking

5. **Verify in Database:**
   - Check `referral_tracking` collection
   - See coins and referral data! ✅

---

## 📱 Step 5: Share with Expo Attendees

### Your Expo is Ready!

**Share this URL with attendees:**
```
https://aksharjobs-expo.vercel.app
```

**Create QR Code:**
1. Go to [qr-code-generator.com](https://www.qr-code-generator.com/)
2. Paste your Vercel URL
3. Download QR code
4. Print and display at expo

**All registrations go to MongoDB Atlas automatically!** ✅

---

## 🎯 URLs Summary

Save these URLs:

```
Frontend (Expo Landing Page):
https://aksharjobs-expo.vercel.app

Backend API:
https://aksharjobs-expo-api.onrender.com

MongoDB Atlas Dashboard:
https://cloud.mongodb.com

To view registrations:
MongoDB Atlas → Browse Collections → EXPO_REGISTRATION → registrations
```

---

## ⚠️ Important Notes

### Free Tier Limitations:

**Render Free Tier:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Perfect for small/medium expos
- Upgrade to $7/month for always-on

**MongoDB Atlas Free:**
- 512MB storage (good for ~10,000 registrations)
- No sleeping issues
- More than enough for most expos

**Vercel Free:**
- 100GB bandwidth
- No sleeping
- Perfect for expo landing pages

### During Expo:

- Test everything 1-2 days before expo
- Backend may be slow on first use (waking up)
- Keep your laptop open with MongoDB Atlas to monitor registrations
- Print backup registration forms just in case

---

## 🆘 Quick Troubleshooting

### Backend is slow/not responding:
```
Solution: Wait 60 seconds (waking up from sleep)
Or upgrade Render to $7/month for instant response
```

### Registration not showing in MongoDB:
```
Solution: Check Render logs
Settings → Logs → Recent logs
```

### Frontend can't reach backend:
```
Solution: Check expo_api_config.js has correct URL
Verify backend is running (visit /api/expo/health)
```

### Need immediate fix:
```
Switch to Google Sheets backup:
1. Set USE_MONGODB_API = false in expo_api_config.js
2. Redeploy to Vercel
3. Registrations go to Google Sheets instead
```

---

## 📞 Contact Info for Support

During expo, if you need to check data:
1. Open MongoDB Atlas on laptop
2. Browse Collections → EXPO_REGISTRATION
3. See real-time registrations coming in!

**Backend logs:** Render.com → Your service → Logs
**Frontend logs:** Browser Console (F12)

---

## ✅ Pre-Expo Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel  
- [ ] Backend URL updated in frontend
- [ ] Test registration works end-to-end
- [ ] Verified data in MongoDB Atlas
- [ ] QR code generated and printed
- [ ] Backup plan ready (Google Sheets)
- [ ] Tested on mobile devices
- [ ] Shared URL with team

---

**You're ready for your expo! 🎉**

All attendee data will be stored safely in MongoDB Atlas and accessible anytime!

---

## 🎓 After the Expo

**Export your data:**
```bash
# From MongoDB Atlas
1. Go to Collections
2. Click "Export Collection"
3. Download as JSON or CSV
```

**View statistics:**
```
MongoDB Atlas → Charts
Create visualizations of your expo data
```

**Backup:**
```
MongoDB Atlas → Backup
Set up automatic backups
```

---

**Need help? Check FULL_DEPLOYMENT_GUIDE_EXPO.md for detailed instructions!**

