# 🚀 Quick Dashboard Deployment Instructions

Your new JobSeeker Dashboard is built and ready! Here's how to deploy it:

## 📁 Files Ready for Upload
- **Source**: `C:\Users\kalpi\Desktop\AksharJobs\frontend\build\`
- **Destination**: `/var/www/AksharJobs/frontend/build/` on your server

## 🔧 Method 1: Using WinSCP (Recommended)

### Step 1: Download WinSCP
- Download from: https://winscp.net/eng/download.php
- Install and run WinSCP

### Step 2: Connect to Server
1. **Host name**: `13.61.35.12`
2. **User name**: `ubuntu`
3. **Private key file**: `C:\Users\kalpi\Desktop\AksharJobs\aksharjobs-key.pem`
4. Click **Login**

### Step 3: Upload Files
1. Navigate to `/var/www/AksharJobs/frontend/build/` on the server
2. Select ALL files from `C:\Users\kalpi\Desktop\AksharJobs\frontend\build\`
3. Drag and drop them to the server folder
4. Confirm overwrite when prompted

### Step 4: Set Permissions
1. Right-click in the server folder
2. Select **Properties** → **Permissions**
3. Set **Owner**: `www-data`
4. Set **Group**: `www-data`
5. Set **Permissions**: `755`

### Step 5: Reload Nginx
1. Open terminal in WinSCP
2. Run: `sudo systemctl reload nginx`

## 🔧 Method 2: Using FileZilla

### Step 1: Download FileZilla
- Download from: https://filezilla-project.org/download.php
- Install and run FileZilla

### Step 2: Connect to Server
1. **Host**: `sftp://13.61.35.12`
2. **Username**: `ubuntu`
3. **Port**: `22`
4. **Key file**: Browse to `aksharjobs-key.pem`
5. Click **Quickconnect**

### Step 3: Upload Files
1. Navigate to `/var/www/AksharJobs/frontend/build/` on server
2. Upload all files from `C:\Users\kalpi\Desktop\AksharJobs\frontend\build\`

## 🎯 After Deployment

1. **Clear browser cache**: `Ctrl + Shift + Delete`
2. **Visit**: `http://13.61.35.12`
3. **Login** as a job seeker
4. **Click** "Go to Dashboard" button
5. **Enjoy** your new dashboard!

## ✨ What You'll See

Your new JobSeeker Dashboard includes:
- ✅ Purple gradient sidebar (exact match to your HTML)
- ✅ Modern card-based layout
- ✅ Interactive navigation
- ✅ Profile completion progress
- ✅ Statistics cards
- ✅ Job listings with save functionality
- ✅ Application tracking
- ✅ Interview scheduling
- ✅ Responsive design

## 🆘 Need Help?

If you encounter any issues:
1. Make sure you're using the correct SSH key
2. Ensure the server path `/var/www/AksharJobs/frontend/build/` exists
3. Check that Nginx is running: `sudo systemctl status nginx`
4. Clear your browser cache completely

---

**Your dashboard is ready to go live! 🎉**