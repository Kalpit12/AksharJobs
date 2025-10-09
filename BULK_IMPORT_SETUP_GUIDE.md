# 📊 Bulk Import System - Setup & Usage Guide

## ✅ Installation Complete!

The bulk import system has been successfully installed and is ready to use.

---

## 🎯 What's Been Installed

### Backend Components
- ✅ **API Routes** (`backend/routes/bulk_import_routes.py`)
  - Upload endpoint
  - Validation endpoint
  - Processing endpoint
  - History endpoint
  - Report download endpoint
  - Template download endpoint

- ✅ **Service Layer** (`backend/services/bulk_import_service.py`)
  - CSV/Excel file parsing
  - Data validation
  - Duplicate detection
  - User account creation
  - Report generation

- ✅ **Required Directories**
  - `backend/uploads/bulk_imports/` - Stores uploaded files
  - `backend/templates/bulk_import/` - Template storage
  - `backend/reports/` - Generated reports

- ✅ **Dependencies**
  - pandas - Data processing
  - openpyxl - Excel file support
  - numpy - Numerical operations

### Frontend Components
- ✅ **Bulk Import Page** (`frontend/src/components/BulkImport.jsx`)
  - File upload with drag & drop
  - Data validation display
  - Import processing
  - History tracking

- ✅ **Styling** (`frontend/src/styles/BulkImport.css`)
  - Professional modern design
  - Responsive layout
  - Status indicators

- ✅ **Admin Navigation**
  - Added "Bulk Import" to admin sidebar
  - Icon and description

- ✅ **Dependencies**
  - react-dropzone - File upload interface

---

## 🚀 How to Use

### Step 1: Access the Bulk Import Page

1. Navigate to `http://localhost:3003/admin`
2. Login with admin credentials:
   - Email: `admin@rocketmatch.com`
   - Password: `Admin@123`
3. Click on **"Bulk Import"** in the sidebar

### Step 2: Download Template

1. Click on one of the template buttons:
   - **Job Seeker Template** - For importing job seekers
   - **Recruiter Template** - For importing recruiters
   - **Mixed Users Template** - For importing both types

2. Open the downloaded CSV file in Excel or Google Sheets

### Step 3: Prepare Your Data

Fill in the template with your user data:

#### Required Fields (All User Types):
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - Valid email address (unique)
- `phone` - Phone number (+254... or 07... format)

#### Optional Fields:
- `userType` - "jobSeeker" or "recruiter" (default: jobSeeker)
- `location` - City, Country
- `skills` - Comma-separated (e.g., "Python, Java, SQL")
- `education` - Education level/degree
- `experienceYears` - Number of years
- `companyName` - For recruiters
- `companyWebsite` - For recruiters
- `jobTitle` - For recruiters

#### Example Data:

```csv
firstName,lastName,email,phone,userType,location,skills,education
John,Doe,john.doe@example.com,+254712345678,jobSeeker,"Nairobi, Kenya","Python, Java, SQL",Bachelor Computer Science
Jane,Smith,jane.smith@example.com,0798765432,jobSeeker,"Mombasa, Kenya","Marketing, SEO",MBA Marketing
Alice,Johnson,alice@techcorp.com,+254723456789,recruiter,"Nairobi, Kenya",,
```

### Step 4: Configure Import Options

1. **Source Organization** (Required)
   - Enter the organization name (e.g., "UAN", "Hindu Council", "BIDCO")

2. **Import Options**:
   - ☑ **Skip Duplicate Entries** - Skip users with existing email/phone
   - ☐ **Send Verification Emails** - Send email verification links
   - ☑ **Auto-Verify (Trusted Source)** - Auto-verify trusted imports
   - ☐ **Send Welcome Emails with Passwords** - Email login credentials

### Step 5: Upload File

1. **Drag & drop** your CSV/Excel file into the upload area, OR
2. **Click** the upload area to select a file

Supported formats: `.csv`, `.xls`, `.xlsx`

### Step 6: Review Validation Results

The system will automatically validate your data and show:

- ✅ **Total Records** - Number of rows in file
- ✅ **Valid Records** - Records that passed validation
- ❌ **Invalid Records** - Records with errors
- ⚠️ **Duplicates** - Duplicate or existing entries

#### Validation Checks:
- Email format validation
- Phone format validation
- Required fields check
- Duplicate detection (within file and database)
- User type validation

### Step 7: Fix Errors (if any)

If there are errors:

1. Review the **Errors Table** showing:
   - Row number
   - Field with error
   - Error description
   - Invalid value

2. Edit your CSV file to fix errors
3. Re-upload the corrected file

### Step 8: Process Import

1. Review the validation summary
2. Click **"Process Import (X users)"** button
3. Wait for processing to complete
4. Check **Import History** table for results

### Step 9: Download Report

1. Go to **Import History** section
2. Find your completed import
3. Click the **download** button to get detailed report

The report includes:
- All successful imports with generated passwords
- Failed imports with error details
- Skipped entries with reasons

---

## 📋 Import History

The history table shows:

- **Batch ID** - Unique import identifier
- **Source** - Organization name
- **Total/Successful/Failed** - Import statistics
- **Status** - uploaded, validated, processing, completed, failed
- **Date** - Import date
- **Actions** - Download report

---

## 🔒 Security Features

- ✅ Admin-only access
- ✅ Secure password generation (12 characters, mixed case, numbers, symbols)
- ✅ Passwords are bcrypt hashed before storage
- ✅ Email/phone uniqueness enforcement
- ✅ File validation before processing
- ✅ Audit logging (batch tracking)

---

## 📊 Database Schema

### New Collection: `bulk_imports`

Stores all import batch information:
```javascript
{
  batch_id: "BULK_20251006_abc123",
  source: "UAN",
  uploaded_by: ObjectId("..."),
  file_name: "users.csv",
  file_type: "csv",
  total_records: 150,
  successful_imports: 145,
  failed_imports: 3,
  skipped_imports: 2,
  status: "completed",
  created_at: ISODate("..."),
  // ... more fields
}
```

### Updated `users` Collection

New fields added:
```javascript
{
  // ... existing fields
  bulk_imported: true,
  bulk_import_batch_id: "BULK_20251006_abc123",
  bulk_import_source: "UAN",
  temp_password: "RandomPass123!" // for welcome email
}
```

---

## 🐛 Troubleshooting

### Issue: File upload fails
**Solution:** 
- Check file format (must be .csv, .xls, or .xlsx)
- Ensure file size is reasonable (< 10MB)
- Enter source organization name before uploading

### Issue: Validation errors
**Solution:**
- Check email format (must be valid email)
- Check phone format (use +254... or 07... format)
- Ensure all required fields are filled
- Check for duplicate emails/phones in your file

### Issue: "Admin access required" error
**Solution:**
- Make sure you're logged in as admin
- Check that role is set to 'admin' in database
- Clear browser cache and re-login

### Issue: Processing takes too long
**Solution:**
- Processing happens in background
- Large files (1000+ records) may take 1-2 minutes
- Refresh the history table to see progress
- Check browser console for errors

### Issue: Import shows as "failed"
**Solution:**
- Download the report to see specific errors
- Check backend logs for detailed error messages
- Verify database connection
- Ensure all required services are running

---

## 📝 Best Practices

1. **Start Small**
   - Test with 5-10 records first
   - Verify successful import before bulk upload

2. **Data Quality**
   - Clean data before import (remove duplicates)
   - Validate emails and phones externally
   - Use consistent formatting

3. **Backup**
   - Keep original CSV files
   - Download import reports for records

4. **Communication**
   - Inform users before bulk import
   - Send welcome emails with instructions
   - Provide support contact info

5. **Monitoring**
   - Check import reports regularly
   - Monitor failed imports
   - Follow up on skipped entries

---

## 🎯 Use Cases

### 1. Community Organization Import
```
Scenario: Hindu Council importing 500 members
Steps:
1. Download Job Seeker template
2. Fill in member information
3. Set source: "Hindu Council"
4. Enable auto-verify (trusted source)
5. Upload and process
6. Download report with passwords
7. Send welcome emails to members
```

### 2. Corporate Partner Import
```
Scenario: BIDCO importing 200 employees
Steps:
1. Download Recruiter template
2. Fill in employee data
3. Set source: "BIDCO"
4. Enable auto-verify
5. Upload and process
6. Provide login credentials to HR
7. HR distributes to employees
```

### 3. University Graduate Import
```
Scenario: University importing 1000 graduates
Steps:
1. Download Job Seeker template
2. Export student data from system
3. Map fields to template
4. Set source: "University of Nairobi"
5. Upload in batches of 500
6. Download reports
7. Email students their credentials
```

---

## 🔄 API Endpoints

For programmatic access:

```
POST /api/bulk-import/upload
POST /api/bulk-import/validate/:batch_id
POST /api/bulk-import/process/:batch_id
GET  /api/bulk-import/status/:batch_id
GET  /api/bulk-import/history
GET  /api/bulk-import/report/:batch_id
GET  /api/bulk-import/template/:user_type
POST /api/bulk-import/resend-verification/:batch_id
```

All endpoints require Bearer token authentication.

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review import reports for details
3. Check backend logs: `backend/logs/`
4. Contact system administrator

---

## ✨ Features Summary

✅ **Easy to Use** - Drag & drop interface
✅ **Flexible** - Support for CSV and Excel
✅ **Validated** - Comprehensive data validation
✅ **Secure** - Password generation and encryption
✅ **Tracked** - Complete audit trail
✅ **Reportable** - Detailed import reports
✅ **Scalable** - Handle thousands of users
✅ **Professional** - Modern, responsive design

---

## 🎉 You're Ready!

The bulk import system is fully functional and ready to use. Start by:

1. Accessing http://localhost:3003/admin
2. Clicking "Bulk Import" in the sidebar
3. Downloading a template
4. Uploading your first test import

**Happy Importing! 🚀**

