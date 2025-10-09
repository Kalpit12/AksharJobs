# 📊 Bulk Import - Quick Reference Card

## 🚀 Quick Start (5 Steps)

1. **Login** → http://localhost:3003/admin
2. **Navigate** → Click "Bulk Import" in sidebar
3. **Download** → Get template (Job Seeker/Recruiter/Mixed)
4. **Fill** → Add your data to CSV template
5. **Upload** → Drag & drop file, then click "Process Import"

---

## 📋 Required Fields

| Field | Format | Example |
|-------|--------|---------|
| firstName | Text | John |
| lastName | Text | Doe |
| email | Valid email (unique) | john@example.com |
| phone | +254... or 07... | +254712345678 |

---

## 🎯 Optional Fields

| Field | Job Seeker | Recruiter | Example |
|-------|------------|-----------|---------|
| userType | ✅ | ✅ | jobSeeker / recruiter |
| location | ✅ | ✅ | Nairobi, Kenya |
| skills | ✅ | ❌ | Python, Java, SQL |
| education | ✅ | ❌ | Bachelor CS |
| experienceYears | ✅ | ❌ | 3 |
| companyName | ❌ | ✅ | TechCorp |
| companyWebsite | ❌ | ✅ | https://tech.com |
| jobTitle | ❌ | ✅ | HR Manager |

---

## ⚙️ Import Options

| Option | Recommended | Purpose |
|--------|-------------|---------|
| Skip Duplicates | ✅ Yes | Avoid duplicate accounts |
| Send Verification | ❌ No | For untrusted sources |
| Auto-Verify | ✅ Yes | For trusted sources |
| Send Welcome Email | 📧 Optional | Send passwords via email |

---

## 🔍 Validation Rules

✅ **Email** - Must be valid format & unique
✅ **Phone** - +254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
✅ **Required** - All 4 required fields must have values
✅ **User Type** - Must be "jobSeeker" or "recruiter"
✅ **Duplicates** - Checked within file & database

---

## 📊 Status Indicators

| Status | Meaning |
|--------|---------|
| 🔵 uploaded | File received, not yet validated |
| 🟣 validated | Data checked, ready to process |
| 🟡 processing | Creating user accounts now |
| 🟢 completed | Import successful |
| 🔴 failed | Import encountered errors |

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Invalid email format | Use proper email: user@domain.com |
| Invalid phone format | Use: +254712345678 or 0712345678 |
| Email already exists | Remove duplicate or enable "Skip Duplicates" |
| Missing required field | Fill in firstName, lastName, email, phone |

---

## 📞 Quick Commands

### Admin Login
```
URL: http://localhost:3003/admin
Email: admin@rocketmatch.com
Password: Admin@123
```

### Download Templates
```
Job Seeker: Click "Job Seeker Template" button
Recruiter: Click "Recruiter Template" button
Mixed: Click "Mixed Users Template" button
```

### Check Status
```
Scroll to "Import History" section
Click refresh button to update
```

### Download Report
```
Find completed import in history
Click download icon in Actions column
```

---

## 📝 CSV Template Example

```csv
firstName,lastName,email,phone,userType,location,skills
John,Doe,john@email.com,+254712345678,jobSeeker,"Nairobi, Kenya","Python, Java"
Jane,Smith,jane@email.com,0798765432,jobSeeker,"Mombasa, Kenya","Marketing, SEO"
```

---

## 💡 Pro Tips

1. **Test First** - Import 5-10 records before bulk upload
2. **Check Duplicates** - Clean your data before import
3. **Save Reports** - Download reports for records
4. **Batch Large Imports** - Split 1000+ records into 500 each
5. **Monitor History** - Refresh to see processing status

---

## 🎯 Recommended Workflow

```
1. Download template
2. Fill with data
3. Enter source name (e.g., "UAN")
4. Enable "Skip Duplicates" ✅
5. Enable "Auto-Verify" ✅
6. Upload file
7. Review validation results
8. Fix any errors
9. Click "Process Import"
10. Download report when complete
```

---

## 📊 Import Limits

| Metric | Limit |
|--------|-------|
| File Size | 10 MB recommended |
| Records per import | 5,000 recommended |
| Concurrent imports | 1 at a time |
| File formats | CSV, XLS, XLSX |

---

## 🔒 Security Notes

- ✅ Admin access only
- ✅ Passwords auto-generated (12 chars)
- ✅ All passwords hashed with bcrypt
- ✅ Audit trail maintained
- ✅ Email/phone uniqueness enforced

---

## 📁 File Locations

| What | Where |
|------|-------|
| Uploaded files | backend/uploads/bulk_imports/ |
| Templates | backend/templates/bulk_import/ |
| Reports | backend/reports/ |

---

## 🆘 Need Help?

1. Check validation errors table
2. Download and review import report
3. Check browser console (F12)
4. Review backend logs
5. Contact system administrator

---

**Remember:** Always test with small batch first! 🚀

