# 🚀 Quick Deployment Instructions

## ✅ Files Ready to Deploy

- `AKSHAREXPO/referral.html` - Fixed emojis & Google Sheets sync
- All emojis properly encoded: 🎉 🪙 👥 📊 💡 💰
- Coin sync fixed: Will show 21 coins from Google Sheets

---

## 🌐 **METHOD 1: Vercel Dashboard (Easiest - 2 minutes)**

### For akjobs.vercel.app:

1. **Go to**: https://vercel.com/dashboard
2. **Find** your AKSHAREXPO project
3. **Click** the project name
4. **Click** "Settings" tab
5. **Scroll down** to "Build & Development Settings"
6. **Click** "Deployments" tab (top)
7. **Click** three dots (...) on latest deployment
8. **Select** "Redeploy"
9. **Click** "Redeploy" again to confirm

**OR** simply drag & drop the AKSHAREXPO folder to Vercel:
1. Go to https://vercel.com/new
2. Drag the `C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO` folder
3. Click "Deploy"

⏱️ Deployment takes ~1 minute

---

## 🌐 **METHOD 2: Install Vercel CLI & Deploy**

```bash
# Step 1: Install Vercel CLI (one-time)
npm install -g vercel

# Step 2: Navigate to AKSHAREXPO folder (you're already here!)
cd C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO

# Step 3: Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? [Y]
# - Which scope? [Select your account]
# - Link to existing project? [Y if exists, N for new]
# - Project name: aksharexpo (or your project name)
```

⏱️ First time: ~3 minutes | Subsequent deploys: ~1 minute

---

## 🌐 **For www.aksharjobs.com** (Custom Domain)

### You need to upload the file to your hosting server:

#### A. **Using cPanel File Manager:**
1. Log in to your hosting cPanel
2. Open "File Manager"
3. Navigate to `public_html` or website root
4. Find `referral.html`
5. Click "Upload" → Select `AKSHAREXPO/referral.html`
6. Replace existing file

#### B. **Using FTP (FileZilla, WinSCP):**
1. Connect to your server
   - Host: ftp.aksharjobs.com (or your FTP host)
   - Username: your_ftp_username
   - Password: your_ftp_password
2. Navigate to website root (usually `public_html` or `www`)
3. Drag & drop `referral.html` from local folder
4. Confirm replacement

#### C. **Using SSH/SCP:**
```bash
# Replace with your actual server details
scp referral.html username@aksharjobs.com:/var/www/html/
```

---

## 🧪 **Testing After Deployment**

### Test 1: Check akjobs.vercel.app
```
1. Open: https://akjobs.vercel.app/referral
2. Press Ctrl+Shift+R (hard refresh to clear cache)
3. Log in with: hemant.patel@maxproinfotech.com
4. ✅ Should see: 21 AksharCoins
5. ✅ Emojis should be clear: 🎉 🪙 👥 📊 💡 💰
```

### Test 2: Check www.aksharjobs.com
```
1. Open: https://www.aksharjobs.com/referral
2. Press Ctrl+Shift+R (hard refresh)
3. Log in with: hemant.patel@maxproinfotech.com
4. ✅ Should see: 21 AksharCoins
5. ✅ Emojis should be clear: 🎉 🪙 👥 📊 💡 💰
```

### If still showing 0 coins:
```javascript
// Open browser console (F12) and check for:
console.log('Google Sheets response:', data);
// Should show: {success: true, records: [{totalCoins: 21, ...}]}

// If showing 0, check:
1. Google Sheets has data for hemant.patel@maxproinfotech.com
2. REFERRAL_WEBHOOK_URL is correct (line 1334)
3. CORS is properly configured in Google Apps Script
```

---

## 🎯 **Fastest Deploy Path**

**For immediate testing:**

1. **Vercel Dashboard Method** (no CLI needed):
   - Open https://vercel.com/new
   - Drag `AKSHAREXPO` folder
   - Click Deploy
   - Wait 1 minute
   - Test at your Vercel URL

2. **For www.aksharjobs.com**:
   - Use cPanel File Manager
   - Upload `referral.html`
   - Done!

---

## 📞 **Need Help?**

If deployment fails:
1. Check console for errors (F12 → Console)
2. Verify Google Sheets API is accessible
3. Check if REFERRAL_WEBHOOK_URL is correct
4. Ensure file uploaded with UTF-8 encoding

---

**Status:** ✅ Local file ready | ⏳ Awaiting deployment
**Created:** $(Get-Date)

