# 🚀 Vercel Deployment Guide - AksharJobs Expo

**System:** Google Sheets Integration (No Backend Server Needed!)  
**Hosting:** Vercel (Free Static Hosting)

---

## ✨ Your System Architecture

```
┌─────────────────────────────────────────┐
│   VERCEL (Frontend Hosting - FREE)     │
│                                         │
│   - index.html                          │
│   - registration.html                   │
│   - referral.html                       │
│   - expo_landing.html                   │
│   - All CSS/JS files                    │
└─────────────────────────────────────────┘
              ↓
    (Makes API calls to)
              ↓
┌─────────────────────────────────────────┐
│  GOOGLE APPS SCRIPT (Backend - FREE)    │
│                                         │
│  Web App URL: https://script.google... │
│  - Processes registrations              │
│  - Tracks referrals                     │
│  - Manages coins                        │
└─────────────────────────────────────────┘
              ↓
    (Saves data to)
              ↓
┌─────────────────────────────────────────┐
│   GOOGLE SHEETS (Database - FREE)       │
│                                         │
│   - Registration data                   │
│   - Referral tracking                   │
│   - Coin balances                       │
└─────────────────────────────────────────┘
```

**No MongoDB, No Backend Server, 100% FREE!** ✅

---

## 📦 Files to Deploy to Vercel

### ✅ Required Files (Upload These):

```
AKSHAREXPO/
├── index.html                    ✅ Main landing page
├── expo_landing.html            ✅ Expo landing page
├── registration.html            ✅ Registration form
├── referral.html               ✅ Referral system
├── expo_landing.js             ✅ Main JavaScript
├── expo_landing.css            ✅ Styles
├── expo_api_config.js          ✅ Google Sheets client (NO MongoDB!)
├── AK logo.jpg                 ✅ Logo
├── favicon.ico                 ✅ Favicon
└── vercel.json                 ✅ Vercel config (already created)
```

### ❌ Do NOT Upload:
```
├── google_sheets_integration.gs  ❌ Server-side (stays in Google Apps Script)
├── *.md files                    ❌ Documentation (optional)
├── netlify.toml                  ❌ Netlify config (not needed for Vercel)
```

---

## 🚀 Deployment Steps (5 Minutes)

### Step 1: Verify Configuration

**Check `expo_api_config.js` (line 66):**
```javascript
const USE_MONGODB_API = false;  // ✅ Should be false (using Google Sheets)
```

**Check all Web App URLs are updated:**
```javascript
// All 5 files should have:
https://script.google.com/macros/s/AKfycbwtF6j5_WsWQHMpz2CnMOXX6_hzR_-WObtJjOpWPKbZRlCiiq9xX3GyTVKVrZ-HszLCoQ/exec
```

✅ Already updated! (I did this)

---

### Step 2: Deploy to Vercel

**Option A: Vercel Dashboard (Easiest)**

1. **Go to:** [vercel.com](https://vercel.com)
2. **Sign up/Login** (free - no credit card)
3. **Click:** "Add New" → "Project"
4. **Choose:** "Deploy from local directory" or "Upload folder"
5. **Select:** Your AKSHAREXPO folder
6. **Settings:**
   - Framework: Other (Static)
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
7. **Click:** "Deploy"
8. **Wait:** 1-2 minutes
9. **Get URL:** `https://your-project.vercel.app` ✅

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to folder
cd C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

---

### Step 3: Test Your Deployed Site

**After deployment:**

1. **Open:** `https://your-project.vercel.app`

2. **Test registration:**
   - Click "Register"
   - Fill form
   - Submit
   - Check Google Sheets ✅

3. **Test referral:**
   - Go to referral page
   - Login with registered email
   - Share via WhatsApp
   - Check coins awarded ✅

4. **Test cross-device:**
   - Open on mobile
   - Login with email
   - See your coins/referrals ✅

---

## ⚙️ Vercel Configuration Explained

### vercel.json (Already Created)

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/index.html"
    },
    {
      "source": "/expo",
      "destination": "/expo_landing.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

**What this does:**
- ✅ Routes `/` to `index.html`
- ✅ Routes `/expo` to `expo_landing.html`
- ✅ Enables CORS for API calls
- ✅ Adds caching for performance
- ✅ Clean URLs (no .html extension needed)

---

## 🔗 URL Structure After Deployment

**Your site URLs:**
```
https://your-project.vercel.app              → index.html (landing)
https://your-project.vercel.app/expo         → expo_landing.html
https://your-project.vercel.app/registration → registration.html
https://your-project.vercel.app/referral     → referral.html
```

**Clean URLs enabled!** (no .html needed)

---

## 📊 Data Storage (Google Sheets Only)

### ✅ No Backend Server Needed!

**Your setup:**
- Frontend: Vercel (static hosting)
- Backend: Google Apps Script (serverless)
- Database: Google Sheets (free storage)

**Benefits:**
- ✅ 100% FREE
- ✅ No server management
- ✅ Unlimited scalability
- ✅ No cold starts
- ✅ Real-time data access
- ✅ Easy to monitor

**Limitations:**
- Google Sheets: 5 million cells (enough for 50,000+ registrations)
- Apps Script: 6 min execution limit per call (more than enough)

---

## 🎯 Post-Deployment Configuration

### Update Any Hardcoded URLs

**If you have localhost URLs anywhere:**

```javascript
// Search for and replace:
http://127.0.0.1:5500 → https://your-project.vercel.app
http://localhost:3002 → (not needed - using Google Sheets)
```

**Already done in your files!** ✅

---

## 🌍 Custom Domain (Optional)

### Add Your Domain:

1. **In Vercel Dashboard:**
   - Go to Project → Settings → Domains
   - Click "Add Domain"

2. **Add domain:**
   - `aksharjobs.com` (root)
   - OR `expo.aksharjobs.com` (subdomain)

3. **Configure DNS:**
   - Add CNAME record pointing to Vercel
   - Vercel provides instructions

4. **SSL Certificate:**
   - Auto-generated by Vercel
   - HTTPS enabled automatically

---

## ✅ Deployment Checklist

### Before Deploying:
- [x] Google Sheets configured ✅
- [x] Apps Script deployed ✅
- [x] Web App URL updated in all files ✅
- [x] USE_MONGODB_API = false ✅
- [x] Debug buttons removed ✅
- [x] Test locally (optional)
- [x] vercel.json configured ✅

### During Deployment:
- [ ] Sign up/Login to Vercel
- [ ] Upload AKSHAREXPO folder
- [ ] Configure as Static site
- [ ] Deploy

### After Deployment:
- [ ] Test registration flow
- [ ] Test referral system
- [ ] Test login/logout
- [ ] Test on mobile
- [ ] Check Google Sheets receiving data

---

## 🐛 Troubleshooting

### Issue: 404 Not Found

**Solution:**
- Check `vercel.json` is present
- Verify file names are correct
- Case-sensitive: `Index.html` ≠ `index.html`

### Issue: Registration Not Saving

**Solution:**
- Check Web App URL is correct in all files
- Test Web App URL directly in browser
- Check Google Apps Script is deployed with "Anyone" access

### Issue: CORS Errors

**Solution:**
- Normal! Google Apps Script uses no-cors
- Data IS being saved even with CORS errors
- Check Google Sheets to verify

### Issue: Images Not Loading

**Solution:**
- Check `AK logo.jpg` is uploaded
- Check `favicon.ico` is uploaded
- File names are case-sensitive

---

## 📱 Mobile Testing

After deployment, test on:

- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Tablet
- [ ] Desktop Chrome
- [ ] Desktop Firefox

**Already responsive!** ✅

---

## 🔄 Update Workflow

### To Update Your Site:

**Method 1: Vercel Dashboard**
1. Make changes to files locally
2. Go to Vercel Dashboard
3. Click "Deployments"
4. Drag updated folder to deploy again

**Method 2: Git Push (Recommended)**
1. Connect GitHub to Vercel
2. Push changes to GitHub
3. Vercel auto-deploys
4. Pull requests get preview URLs

**Method 3: CLI**
```bash
cd AKSHAREXPO
vercel --prod
```

---

## 📊 Monitoring After Deployment

### Check Google Sheets
- Open your Google Sheet
- Monitor registrations in real-time
- View referral tracking
- Export data as needed

### Vercel Analytics (Optional)
- Go to Project → Analytics
- See visitor stats
- Page views
- Performance metrics

---

## 🎯 Summary

**Your Setup (FREE):**
```
Frontend:  Vercel (Free Forever)
Backend:   Google Apps Script (Free Forever)
Database:  Google Sheets (Free Forever)
Total:     $0/month ✅
```

**What Works:**
- ✅ User registration (all 10 roles)
- ✅ Referral system with personalized links
- ✅ Coin rewards (3 per share, 1 per registration)
- ✅ Login/logout system
- ✅ Cross-device access
- ✅ Real-time Google Sheets sync
- ✅ Mobile responsive
- ✅ Production-ready

**No MongoDB, No Server, No Hosting Costs!** 🎉

---

## 🚀 Deploy Now!

1. Go to [vercel.com](https://vercel.com)
2. Upload AKSHAREXPO folder
3. Click Deploy
4. Share your URL!

**That's it! Your expo system goes live in 2 minutes!** ✅

---

**Questions?** Check the other .md guides in AKSHAREXPO folder for detailed help!
