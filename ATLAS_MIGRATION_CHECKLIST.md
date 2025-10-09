# ✅ MongoDB Atlas Migration Checklist

**Print this page and check off items as you complete them!**

---

## 📋 Pre-Migration Preparation

Date Started: ____________  Time: ____________

### Environment Check
- [ ] Local MongoDB is running
- [ ] Can connect to local MongoDB
- [ ] MongoDB Database Tools installed (mongodump, mongorestore)
- [ ] Python environment active
- [ ] Internet connection stable
- [ ] Have admin access to edit `.edn.local`
- [ ] `.edn.local` is backed up

**Command to verify tools:**
```powershell
mongodump --version
mongorestore --version
```

### Document Current Setup
- Current MONGO_URI: _________________________________
- Current DB_NAME: _________________________________
- Number of collections: _________
- Estimated database size: _________ MB

**Command to check:**
```powershell
mongosh
> use TalentMatchDB
> db.stats()
```

---

## 📤 Step 1: Export Local Database

Date: ____________  Time: ____________

### Export Process
- [ ] Opened PowerShell in project directory
- [ ] Ran `.\export_local_mongodb.bat`
- [ ] Export completed successfully
- [ ] Backup folder created with timestamp
- [ ] Verified backup contains all collections

**Backup Details:**
- Backup folder name: _________________________________
- Backup location: _________________________________
- Backup size: _________ MB
- Number of collections: _________

### Verification
- [ ] Opened backup folder
- [ ] Confirmed `TalentMatchDB` folder exists
- [ ] See `.bson` files for each collection
- [ ] See `.metadata.json` files

**Collections backed up:**
- [ ] users
- [ ] jobs
- [ ] applications
- [ ] companies
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________

---

## ☁️ Step 2: Create MongoDB Atlas Account

Date: ____________  Time: ____________

### Account Setup
- [ ] Went to https://www.mongodb.com/cloud/atlas/register
- [ ] Signed up with email/Google
- [ ] Verified email (if required)
- [ ] Logged into Atlas dashboard
- [ ] Completed welcome survey (optional)

**Account Details:**
- Email used: _________________________________
- Organization name: _________________________________

---

## 🗄️ Step 3: Create Cluster

Date: ____________  Time: ____________

### Cluster Configuration
- [ ] Clicked "Build a Database"
- [ ] Selected "Shared" (Free tier M0)
- [ ] Chose cloud provider: ________________
- [ ] Chose region: ________________
- [ ] Named cluster: _________________________________
- [ ] Clicked "Create Cluster"
- [ ] Waited for cluster to deploy (3-5 minutes)
- [ ] Cluster status shows "Active"

**Cluster Details:**
- Cluster name: _________________________________
- Cloud provider: ________________ (AWS/GCP/Azure)
- Region: _________________________________
- Tier: M0 (Free)

---

## 🔐 Step 4: Configure Security

Date: ____________  Time: ____________

### Database Access (Create User)
- [ ] Went to "Database Access" in sidebar
- [ ] Clicked "Add New Database User"
- [ ] Chose "Password" authentication
- [ ] Entered username: _________________________________
- [ ] Generated/created strong password
- [ ] **SAVED password securely:** _________________________________
- [ ] Selected role: "Read and write to any database"
- [ ] Clicked "Add User"
- [ ] User appears in list

### Network Access (Whitelist IP)
- [ ] Went to "Network Access" in sidebar
- [ ] Clicked "Add IP Address"
- [ ] For development: Selected "Allow Access from Anywhere"
  - OR specific IP: _________________________________
- [ ] Clicked "Confirm"
- [ ] IP appears in list with "Active" status
- [ ] Waited 2-3 minutes for changes to propagate

**Security Details:**
- Username: _________________________________
- Password stored in: _________________________________
- IP whitelist: _________________ (0.0.0.0/0 or specific)

---

## 🔗 Step 5: Get Connection String

Date: ____________  Time: ____________

### Connection String
- [ ] Went to "Database" in sidebar
- [ ] Clicked "Connect" button on cluster
- [ ] Selected "Connect your application"
- [ ] Chose Driver: Python, Version: 3.12+
- [ ] Copied connection string
- [ ] Replaced `<password>` with actual password
- [ ] Saved connection string securely

**Connection String (write carefully):**
```
_____________________________________________________________

_____________________________________________________________
```

### Password Encoding (if needed)
- [ ] Password contains special characters (@, :, /, etc.)
- [ ] Ran: `python url_encode_password.py`
- [ ] Entered password
- [ ] Got encoded password
- [ ] Updated connection string with encoded password

**Special characters found:**
- Original password: _________________________________
- Encoded password: _________________________________

---

## 📥 Step 6: Import Data to Atlas

Date: ____________  Time: ____________

### Import Process
- [ ] Ran `.\import_to_atlas.bat`
- [ ] Pasted Atlas connection string when prompted
- [ ] Import started
- [ ] Waited for import to complete
- [ ] Import completed successfully
- [ ] Verified success message

**Import Details:**
- Time taken: _________ minutes
- Data uploaded: _________ MB
- Collections imported: _________

### Verify in Atlas Dashboard
- [ ] Went to "Database" → "Browse Collections"
- [ ] Selected database: TalentMatchDB
- [ ] Confirmed all collections present
- [ ] Spot-checked document counts

**Collections in Atlas:**
- [ ] users: _________ documents
- [ ] jobs: _________ documents
- [ ] applications: _________ documents
- [ ] companies: _________ documents
- [ ] _________________________________
- [ ] _________________________________

---

## ⚙️ Step 7: Update Application Configuration

Date: ____________  Time: ____________

### Update .edn.local
- [ ] Opened `backend/.edn.local` in editor
- [ ] Located `MONGO_URI=` line
- [ ] Commented out old value (added # before it)
- [ ] Added new line with Atlas connection string
- [ ] Verified `DB_NAME=TalentMatchDB` (no change needed)
- [ ] Saved file
- [ ] Verified file saved correctly

**Configuration:**

Before:
```
MONGO_URI=mongodb://localhost:27017/
```

After:
```
# Old local: MONGO_URI=mongodb://localhost:27017/
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/...
```

---

## 🧪 Step 8: Test Connection

Date: ____________  Time: ____________

### Connection Test
- [ ] Opened PowerShell in project directory
- [ ] Activated virtual environment
- [ ] Ran: `python test_atlas_connection.py`
- [ ] Saw "Successfully connected to MongoDB Atlas!"
- [ ] Saw list of collections with document counts
- [ ] Write test passed (optional)
- [ ] Saw "ATLAS CONNECTION TEST PASSED!"

**Test Results:**
- Connection: ✅ Success / ❌ Failed
- Collections found: _________
- Total documents: _________
- Write test: ✅ Success / ❌ Failed / ⊘ Skipped

### Issues Encountered (if any):
_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

**Solution Applied:**
_____________________________________________________________

_____________________________________________________________

---

## 🚀 Step 9: Start Backend

Date: ____________  Time: ____________

### Backend Startup
- [ ] Ran: `.\start_backend.bat`
- [ ] Backend started successfully
- [ ] Saw: "[OK] MongoDB connected successfully!"
- [ ] No connection errors in console
- [ ] Server running on http://localhost:3002

**Backend Status:**
- Started: ✅ Yes / ❌ No
- MongoDB connected: ✅ Yes / ❌ No
- Errors: ____________________________________________

---

## 🌐 Step 10: Test API Endpoints

Date: ____________  Time: ____________

### API Testing
- [ ] Opened new PowerShell window
- [ ] Tested health endpoint: `curl http://localhost:3002/api/health`
- [ ] Tested jobs endpoint: `curl http://localhost:3002/api/jobs`
- [ ] Tested user authentication endpoint
- [ ] All endpoints responding correctly

**Endpoint Results:**
- `/api/health`: ✅ Success / ❌ Failed
- `/api/jobs`: ✅ Success / ❌ Failed
- `/api/auth/login`: ✅ Success / ❌ Failed

---

## 🖥️ Step 11: Test Frontend

Date: ____________  Time: ____________

### Frontend Testing
- [ ] Started frontend (if not already running)
- [ ] Opened http://localhost:3003
- [ ] Frontend loaded successfully
- [ ] Tested login functionality
- [ ] Tested viewing jobs
- [ ] Tested creating/editing data
- [ ] All features working correctly

**Frontend Tests:**
- Login: ✅ Success / ❌ Failed
- View Jobs: ✅ Success / ❌ Failed
- Job Search: ✅ Success / ❌ Failed
- User Profile: ✅ Success / ❌ Failed
- Create Application: ✅ Success / ❌ Failed

---

## 📊 Step 12: Verify Data Integrity

Date: ____________  Time: ____________

### Data Verification
- [ ] Logged into Atlas dashboard
- [ ] Went to "Database" → "Browse Collections"
- [ ] Checked each collection
- [ ] Document counts match local backup
- [ ] Spot-checked sample documents
- [ ] Data structure looks correct
- [ ] No corruption or missing fields

**Data Integrity Check:**

| Collection | Local Count | Atlas Count | Match? |
|------------|-------------|-------------|--------|
| users      | _______     | _______     | ☐      |
| jobs       | _______     | _______     | ☐      |
| applications | _______   | _______     | ☐      |
| companies  | _______     | _______     | ☐      |
| __________ | _______     | _______     | ☐      |

---

## 🔧 Step 13: Post-Migration Setup

Date: ____________  Time: ____________

### Optimization
- [ ] Reviewed existing indexes
- [ ] Created necessary indexes in Atlas
- [ ] Set up monitoring alerts
- [ ] Configured backup schedule
- [ ] Documented connection details securely

**Indexes Created:**
- [ ] users: email (unique)
- [ ] jobs: created_at
- [ ] jobs: company_name
- [ ] applications: user_id, job_id
- [ ] _________________________________
- [ ] _________________________________

### Monitoring Setup
- [ ] Enabled Atlas monitoring
- [ ] Set up alerts for:
  - [ ] Storage > 400 MB (80%)
  - [ ] Connection count > 80
  - [ ] High CPU usage
  - [ ] Slow queries

---

## 🧹 Step 14: Cleanup (Optional)

Date: ____________  Time: ____________

### Local Cleanup
- [ ] Verified Atlas is working for 24+ hours
- [ ] Decided whether to keep local MongoDB running
- [ ] Archived backup files
- [ ] Documented migration date and details
- [ ] Updated team documentation

**Backup Archive:**
- Location: _________________________________
- Archive name: _________________________________
- Date archived: _________________________________

---

## 📝 Step 15: Documentation

Date: ____________  Time: ____________

### Record Keeping
- [ ] Documented new connection details
- [ ] Updated team wiki/docs
- [ ] Shared access with team members
- [ ] Created Atlas dashboard bookmarks
- [ ] Saved this completed checklist

**Documentation Location:**
_____________________________________________________________

---

## 🎉 Migration Complete!

Date Completed: ____________  Total Time: ____________

### Final Verification
- [ ] Database accessible from Atlas
- [ ] Application working normally
- [ ] All features tested
- [ ] Team informed
- [ ] Monitoring active
- [ ] Backups configured

**Sign-off:**
- Migrated by: _________________________________
- Date: _________________________________
- Signature: _________________________________

---

## 📞 Support Contacts

**If you need help:**

| Issue Type | Resource |
|------------|----------|
| Migration guide | `MONGODB_ATLAS_MIGRATION_GUIDE.md` |
| Quick reference | `MONGODB_ATLAS_QUICK_START.md` |
| Visual guide | `ATLAS_MIGRATION_VISUAL_GUIDE.md` |
| Atlas docs | https://docs.atlas.mongodb.com/ |
| Community | https://www.mongodb.com/community/forums/ |

---

## 📌 Important Information

**Save these details:**

**Atlas Login:**
- URL: https://cloud.mongodb.com
- Email: _________________________________
- 2FA enabled: ☐ Yes ☐ No

**Cluster Details:**
- Cluster name: _________________________________
- Connection string: (stored in .edn.local)
- Database name: TalentMatchDB
- Database user: _________________________________
- Password: (stored securely)

**Migration Stats:**
- Data migrated: _________ MB
- Collections: _________
- Total documents: _________
- Migration time: _________ minutes
- Downtime: _________ minutes (if any)

---

## 🔄 Rollback Plan (If Needed)

If you need to revert to local MongoDB:

1. [ ] Stop backend
2. [ ] Edit `.edn.local`:
   ```
   MONGO_URI=mongodb://localhost:27017/
   ```
3. [ ] Ensure local MongoDB is running
4. [ ] Restart backend
5. [ ] Test functionality

**Rollback Date (if needed):** _________________________________

**Rollback Reason:** _________________________________

---

**End of Checklist**

**Status:** 
- ☐ In Progress
- ☐ ✅ Completed Successfully
- ☐ ❌ Failed (see notes)
- ☐ 🔄 Rolled Back

**Notes:**
_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

---

**Keep this checklist for your records!**

