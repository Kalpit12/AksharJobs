# Admin Quick Reference Card

## 🎨 Dashboard Template Editor

### Access
Admin Dashboard → Click **"🎨 Edit Dashboard Templates"**

### Quick Actions
| Action | How To |
|--------|--------|
| Switch Dashboard | Click Recruiter/Job Seeker/Intern button |
| Add Section | Click "+ Add Section" |
| Rename Section | Click name, type new name |
| Change Icon | Select from dropdown |
| Toggle Section | Click toggle switch |
| Delete Section | Click trash icon |
| Change Color | Click color picker, select color |
| Preview | Click "Preview" button |
| Save | Click "Save Changes" |
| Export | Click "Export" button |

---

## 📧 Messaging & Email Center

### Access
Admin Dashboard → Click **"📧 Send Messages & Emails"**

### Send Message Quick Steps
1. Select **Email** or **In-App Message**
2. Choose **Recipients** (All/Selected)
3. Select **User Type** (All/Recruiter/JobSeeker/Intern)
4. Write **Subject**
5. Write **Message** (use variables: `{{firstName}}`, `{{email}}`, etc.)
6. Click **"Send Now"**
7. Confirm in dialog

### Template Variables
```
{{firstName}}    - User's first name
{{lastName}}     - User's last name
{{email}}        - User's email address
{{role}}         - User's role
{{companyName}}  - Company name (recruiters only)
```

### Create Template Quick Steps
1. Go to **"Templates"** tab
2. Click **"+ Create Template"**
3. Fill in name, type, subject, body
4. Click **"Save Template"**

---

## 🔑 Admin Login

**URL**: `http://13.61.35.12/login`  
**Email**: `admin@rocketmatch.com`  
**Role**: Admin

---

## 📦 Dashboard Templates (Downloadable)

### Location
`Dashboard_Templates/` folder in project root

### Files
1. `Recruiter_Dashboard_Complete.html` - Orange theme
2. `JobSeeker_Dashboard_Complete.html` - Blue theme
3. `Intern_Dashboard_Complete.html` - Green theme
4. `README.md` - Usage guide

### How to Use
- Open in browser to view
- Copy/paste sections for new pages
- Customize content as needed

---

## 🚀 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Recruiter | sarah.johnson@techcorp.com | recruiter123 |
| Job Seeker | dhruv.patel@example.com | test123 |
| Intern | aashniptl2000@gmail.com | aashni123 |

---

## 📊 Key API Endpoints

### Template Management
- `GET /api/admin/dashboard-templates`
- `PUT /api/admin/dashboard-templates`

### Messaging
- `POST /api/admin/send-message`
- `GET /api/admin/sent-messages`
- `GET /api/admin/message-templates`
- `POST /api/admin/message-templates`

---

## ⚡ Quick Troubleshooting

### 422 Errors
**Solution**: Clear browser localStorage and login again
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Changes Not Saving
**Solution**: Check admin token is valid, refresh page

### Messages Not Sending
**Solution**: Verify recipients exist, check backend logs

---

## 📞 Server Commands

### Check Backend Status
```bash
ssh -i aksharjobs-key.pem.bak ubuntu@13.61.35.12 "pm2 status"
```

### View Logs
```bash
ssh -i aksharjobs-key.pem.bak ubuntu@13.61.35.12 "pm2 logs akshar-backend --lines 50"
```

### Restart Backend
```bash
ssh -i aksharjobs-key.pem.bak ubuntu@13.61.35.12 "pm2 restart akshar-backend"
```

---

## ✅ System Status

| Component | Status |
|-----------|--------|
| Website | ✅ Live at http://13.61.35.12 |
| Backend API | ✅ Running on PM2 |
| Database | ✅ Atlas connected (72 users) |
| Template Editor | ✅ Implemented |
| Messaging Center | ✅ Implemented |
| Dashboard Templates | ✅ Created (3 files) |

---

**Everything is working perfectly!** 🎉

Quick access to all features from the admin dashboard.

