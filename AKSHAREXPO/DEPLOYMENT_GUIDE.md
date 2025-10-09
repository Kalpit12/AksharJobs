# 🚀 Deployment Guide for Referral Page Fixes

## ✅ What Was Fixed

1. **Emoji Display Issues** - All corrupted symbols (ðŸŽ‰, ðŸª™, etc.) are now proper emojis (🎉, 🪙, 👥, 📊)
2. **Coin Sync from Google Sheets** - Now correctly displays the 21 coins from Google Sheets for hemant.patel
3. **UTF-8 Encoding** - File saved with proper UTF-8 encoding (no BOM)

## 📋 Current Status

- ✅ Local file `AKSHAREXPO/referral.html` is fixed and ready
- ⏳ Needs deployment to:
  - **akjobs.vercel.app** (Vercel deployment)
  - **www.aksharjobs.com** (Custom domain/hosting)

---

## 🌐 Deploy to Vercel (akjobs.vercel.app)

### Option 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and log in
2. Find your **AKSHAREXPO** project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** button
   - OR -
5. Upload the `AKSHAREXPO` folder as a new deployment

### Option 2: Vercel CLI

```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Navigate to AKSHAREXPO folder
cd AKSHAREXPO

# Deploy
vercel --prod

# Follow the prompts
```

### Option 3: Git Integration (Recommended for future)

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Fix emoji encoding and Google Sheets coin sync"

# Connect to GitHub/GitLab
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then connect Vercel to your Git repository
# Vercel will auto-deploy on every push
```

---

## 🌐 Deploy to www.aksharjobs.com

You'll need to upload the fixed file to your hosting server. Common methods:

### Method 1: FTP/SFTP Upload

1. Open your FTP client (FileZilla, WinSCP, etc.)
2. Connect to your hosting server
3. Navigate to the public_html or www directory
4. Upload `AKSHAREXPO/referral.html` to replace the old file

### Method 2: cPanel File Manager

1. Log into your hosting cPanel
2. Open **File Manager**
3. Navigate to `public_html` or your website root
4. Upload the new `referral.html` file
5. Replace the existing one

### Method 3: SSH/Terminal Access

```bash
# Connect to your server
ssh your_username@aksharjobs.com

# Upload file using SCP from your local machine
scp AKSHAREXPO/referral.html your_username@aksharjobs.com:/var/www/html/

# Or use rsync
rsync -avz AKSHAREXPO/referral.html your_username@aksharjobs.com:/var/www/html/
```

---

## 🧪 Verify Deployment

After deploying, check both sites:

### Test akjobs.vercel.app

1. Open: https://akjobs.vercel.app/referral
2. Log in with: `hemant.patel@maxproinfotech.com`
3. ✅ Should see **21 AksharCoins**
4. ✅ Emojis should display correctly: 🎉 🪙 👥 📊 💡 💰

### Test www.aksharjobs.com

1. Open: https://www.aksharjobs.com/referral
2. Log in with: `hemant.patel@maxproinfotech.com`
3. ✅ Should see **21 AksharCoins**
4. ✅ Emojis should display correctly: 🎉 🪙 👥 📊 💡 💰

### Clear Browser Cache

If you still see old data:
```
Chrome/Edge: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows) or Cmd + Shift + R (Mac)
Safari: Cmd + Option + R
```

---

## 🔧 Technical Details of Fixes

### 1. Emoji Encoding Fix
```html
<!-- Before (corrupted) -->
Welcome back! ðŸŽ‰
🪙 ðŸª™

<!-- After (fixed) -->
Welcome back! 🎉
🪙 🪙
```

### 2. Google Sheets Sync Fix
```javascript
// Before: Recalculated locally (ignored Google Sheets)
loadUserData();  // This was overwriting synced values
updateStats();   // This recalculated from local history

// After: Uses Google Sheets data directly
document.getElementById('coinBalance').textContent = userRecord.totalCoins || 0;
document.getElementById('referralCount').textContent = userRecord.referralCount || 0;

// Also fixed calculateAccurateCoins() to prioritize synced data
const totalAccurateCoins = referralData.totalCoinsEarned || shareCoins;
```

---

## 📞 Support

If you encounter issues during deployment:

1. **Check console logs** - Open browser DevTools (F12) → Console tab
2. **Verify Google Sheets API** - Ensure the webhook URL is correct
3. **Check file encoding** - File should be UTF-8 without BOM

---

## 📝 Quick Deploy Commands

```bash
# For Vercel deployment
cd AKSHAREXPO
vercel --prod

# For custom server (replace with your details)
scp referral.html user@aksharjobs.com:/var/www/html/
```

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Files Modified:** `AKSHAREXPO/referral.html`

