# 💾 Bulk Data Upload System
## AksharJobs Platform - Community & Corporate Data Import

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Use Cases](#use-cases)
3. [Implementation Approach](#implementation-approach)
4. [Data Sources & Formats](#data-sources--formats)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Data Validation & Processing](#data-validation--processing)
8. [Security & Privacy](#security--privacy)
9. [Testing & Deployment](#testing--deployment)

---

## 🎯 Overview

### Purpose
Enable bulk import of user data from:
- **Community Organizations**: UAN, Hindu Council, etc.
- **Corporate Partners**: BIDCO, partner companies
- **Educational Institutions**: Universities, training centers
- **Government Programs**: Employment schemes

### Key Requirements
- Support multiple data formats (CSV, Excel, JSON)
- Validate data before import
- Handle duplicate entries
- Send verification emails/SMS
- Track import history
- Support partial imports (skip errors, continue)
- Generate detailed import reports

---

## 🎯 Use Cases

### Use Case 1: Community Organization Bulk Import
```
Scenario: Hindu Council wants to register 500 members
Data Includes:
├── Full Name
├── Email Address
├── Phone Number
├── Location
├── Skills/Profession
├── Education Level
└── Community Affiliation

Process:
1. Hindu Council admin uploads CSV file
2. System validates data (check duplicates, format)
3. System creates pending accounts
4. Sends verification emails/SMS to all members
5. Members verify and complete profiles
6. Hindu Council gets import report
```

### Use Case 2: Corporate Partner Import
```
Scenario: BIDCO wants to register 200 employees for recruitment
Data Includes:
├── Employee Name
├── Corporate Email
├── Phone Number
├── Department
├── Job Title
├── Years of Experience
└── Skills

Process:
1. BIDCO HR uploads Excel file
2. System maps columns to user fields
3. System creates accounts with "Corporate" tag
4. Sends welcome emails with login credentials
5. Employees complete profiles
6. BIDCO gets access to track their employees
```

### Use Case 3: University Graduate Import
```
Scenario: University registering fresh graduates
Data Includes:
├── Student Name
├── University Email
├── Phone Number
├── Degree & Field
├── Graduation Year
├── Skills Learned
└── Projects

Process:
1. University admin uploads data
2. System creates accounts with "Fresh Graduate" status
3. Pre-fills education section
4. Sends registration completion emails
5. Students complete remaining profile
6. University can track graduate placements
```

---

## 🏗️ Implementation Approach

### Option 1: CSV/Excel File Upload (Recommended)
**Best for:** Community organizations, HR departments

```
Pros:
✅ Easy for non-technical users
✅ Familiar format (Excel/Google Sheets)
✅ Can handle large datasets (10,000+ rows)
✅ Offline preparation possible
✅ Easy to review before upload

Cons:
❌ Manual file preparation needed
❌ Potential formatting issues
❌ One-time upload (not real-time)
```

### Option 2: API Integration
**Best for:** Large corporations with existing systems

```
Pros:
✅ Real-time data sync
✅ Automated process
✅ Can integrate with HRIS/ERP systems
✅ No manual file preparation

Cons:
❌ Requires technical setup
❌ Need API documentation
❌ More complex implementation
```

### Option 3: Google Sheets Integration
**Best for:** Organizations already using Google Workspace

```
Pros:
✅ Collaborative data entry
✅ Real-time validation
✅ Auto-sync capability
✅ Easy to update

Cons:
❌ Requires Google account
❌ Permission management needed
❌ Rate limits on API
```

### Option 4: Email Data Extraction
**Best for:** Small batches from email lists

```
Pros:
✅ Quick for small datasets
✅ No file preparation
✅ Can paste directly from email

Cons:
❌ Limited to simple data
❌ Manual formatting needed
❌ Error-prone
```

---

## 📊 Data Sources & Formats

### 1. CSV File Format (Recommended)

**Template Structure:**
```csv
First Name,Last Name,Email,Phone,Community,User Type,Company Name,Job Title,Skills,Education
John,Doe,john.doe@email.com,+254712345678,Software Developers,jobSeeker,,,"Python,Java,SQL",Bachelor Computer Science
Jane,Smith,jane.smith@bidco.com,+254798765432,Marketing Professionals,jobSeeker,BIDCO,Marketing Manager,"SEO,Content Marketing",MBA Marketing
```

**Download Templates:**
- `job_seeker_bulk_import_template.csv`
- `recruiter_bulk_import_template.csv`
- `mixed_users_bulk_import_template.csv`

### 2. Excel File Format

**Sheet Structure:**
```
Sheet 1: User Data
├── Column A: First Name (Required)
├── Column B: Last Name (Required)
├── Column C: Email (Required, Unique)
├── Column D: Phone (Required, Unique)
├── Column E: User Type (jobSeeker/recruiter)
├── Column F: Community (from dropdown)
├── Column G: Company Name (for recruiters)
├── Column H: Skills (comma-separated)
├── Column I: Education Level
├── Column J: Years of Experience
└── Column K: Location

Sheet 2: Instructions & Validation Rules
Sheet 3: Import Summary (auto-generated)
```

### 3. JSON Format (API Integration)

**Request Body:**
```json
{
  "source": "UAN",
  "import_batch_id": "UAN_2025_001",
  "users": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phone": "+254712345678",
      "userType": "jobSeeker",
      "communities": ["Software Developers", "Engineering"],
      "metadata": {
        "source": "UAN",
        "batch_id": "UAN_2025_001",
        "imported_by": "admin@uan.org"
      },
      "profile": {
        "skills": ["Python", "Java", "SQL"],
        "education": "Bachelor Computer Science",
        "experience_years": 3,
        "location": "Nairobi, Kenya"
      }
    }
  ]
}
```

---

## ⚙️ Backend Implementation

### 1. Database Schema Updates

**New Collection: `bulk_imports`**
```javascript
{
  _id: ObjectId,
  batch_id: String (unique),
  source: String ("UAN", "Hindu Council", "BIDCO", etc.),
  uploaded_by: ObjectId (ref: users),
  
  // File Information
  file_name: String,
  file_type: String ("csv", "excel", "json"),
  file_size: Number,
  file_url: String (GridFS or S3),
  
  // Import Statistics
  total_records: Number,
  successful_imports: Number,
  failed_imports: Number,
  duplicate_entries: Number,
  
  // Status
  status: String ["pending", "processing", "completed", "failed"],
  processing_started_at: Date,
  processing_completed_at: Date,
  
  // Results
  imported_user_ids: [ObjectId],
  failed_records: [
    {
      row_number: Number,
      data: Object,
      error: String,
      error_type: String
    }
  ],
  
  // Report
  report_url: String,
  
  // Metadata
  created_at: Date,
  updated_at: Date
}
```

**Update `users` Collection:**
```javascript
{
  // Add new fields
  bulk_import_batch_id: String,
  bulk_import_source: String,
  bulk_imported: Boolean,
  bulk_imported_at: Date,
  
  // Verification tracking
  account_verified: Boolean,
  verification_sent_at: Date,
  verification_completed_at: Date
}
```

### 2. API Endpoints

**File Upload & Processing:**
```python
# backend/routes/bulk_import_routes.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import csv

bulk_import_bp = Blueprint('bulk_import', __name__)

# 1. Upload bulk data file
@bulk_import_bp.route('/api/bulk-import/upload', methods=['POST'])
@admin_required
def upload_bulk_file():
    """
    Upload CSV/Excel file for bulk user import
    Requires: Admin authentication
    
    Request:
        - file: CSV/Excel file
        - source: String (organization name)
        - send_verification: Boolean
        
    Response:
        {
          "success": true,
          "batch_id": "BULK_2025_001",
          "message": "File uploaded successfully",
          "preview": [...first 5 records],
          "total_records": 150
        }
    """
    pass

# 2. Validate uploaded data
@bulk_import_bp.route('/api/bulk-import/validate/<batch_id>', methods=['POST'])
@admin_required
def validate_bulk_data(batch_id):
    """
    Validate uploaded data before importing
    Checks for:
        - Required fields
        - Email/phone format
        - Duplicate entries
        - Invalid community names
        
    Response:
        {
          "valid": true/false,
          "total_records": 150,
          "valid_records": 145,
          "invalid_records": 5,
          "errors": [
            {
              "row": 12,
              "field": "email",
              "error": "Invalid email format",
              "value": "invalid-email"
            }
          ],
          "duplicates": [...]
        }
    """
    pass

# 3. Process and import validated data
@bulk_import_bp.route('/api/bulk-import/process/<batch_id>', methods=['POST'])
@admin_required
def process_bulk_import(batch_id):
    """
    Process validated data and create user accounts
    
    Options:
        - skip_duplicates: Boolean
        - send_verification: Boolean
        - auto_verify: Boolean (for trusted sources)
        - send_welcome_email: Boolean
        
    Response:
        {
          "success": true,
          "batch_id": "BULK_2025_001",
          "status": "processing",
          "message": "Import started. You'll receive email when complete."
        }
    """
    pass

# 4. Get import status
@bulk_import_bp.route('/api/bulk-import/status/<batch_id>', methods=['GET'])
@admin_required
def get_import_status(batch_id):
    """
    Get current status of bulk import
    
    Response:
        {
          "batch_id": "BULK_2025_001",
          "status": "processing",
          "progress": 75,
          "total_records": 150,
          "processed": 112,
          "successful": 108,
          "failed": 4,
          "estimated_time_remaining": "2 minutes"
        }
    """
    pass

# 5. Get import history
@bulk_import_bp.route('/api/bulk-import/history', methods=['GET'])
@admin_required
def get_import_history():
    """
    Get list of all bulk imports
    
    Query params:
        - page: Number
        - limit: Number
        - source: String (filter by source)
        - status: String (filter by status)
        
    Response:
        {
          "imports": [
            {
              "batch_id": "BULK_2025_001",
              "source": "UAN",
              "uploaded_by": "admin@aksharjobs.com",
              "total_records": 150,
              "successful": 145,
              "status": "completed",
              "created_at": "2025-10-05T10:30:00Z"
            }
          ],
          "pagination": {...}
        }
    """
    pass

# 6. Download import report
@bulk_import_bp.route('/api/bulk-import/report/<batch_id>', methods=['GET'])
@admin_required
def download_import_report(batch_id):
    """
    Download detailed import report (CSV/PDF)
    
    Response: File download
    """
    pass

# 7. Get sample template
@bulk_import_bp.route('/api/bulk-import/template/<user_type>', methods=['GET'])
def download_template(user_type):
    """
    Download CSV template for bulk import
    
    Params:
        - user_type: "jobSeeker" or "recruiter"
        
    Response: CSV file download
    """
    pass

# 8. Resend verification emails
@bulk_import_bp.route('/api/bulk-import/resend-verification/<batch_id>', methods=['POST'])
@admin_required
def resend_verification_emails(batch_id):
    """
    Resend verification emails to unverified users from a batch
    
    Response:
        {
          "success": true,
          "emails_sent": 15,
          "message": "Verification emails sent to pending users"
        }
    """
    pass
```

### 3. Processing Service

**File:** `backend/services/bulk_import_service.py`

```python
import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
import re
from datetime import datetime

class BulkImportService:
    
    def __init__(self):
        self.required_fields = ['email', 'phone', 'firstName', 'lastName']
        self.valid_communities = self.get_communities_list()
        
    def parse_file(self, file_path: str, file_type: str) -> pd.DataFrame:
        """
        Parse uploaded CSV/Excel file
        """
        if file_type == 'csv':
            df = pd.read_csv(file_path)
        elif file_type in ['xls', 'xlsx']:
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
            
        return df
    
    def validate_data(self, df: pd.DataFrame) -> Dict:
        """
        Validate all records in dataframe
        Returns: {
            "valid": bool,
            "errors": List[Dict],
            "duplicates": List[Dict],
            "statistics": Dict
        }
        """
        errors = []
        duplicates = []
        
        # Check required fields
        missing_fields = [f for f in self.required_fields if f not in df.columns]
        if missing_fields:
            return {
                "valid": False,
                "errors": [{"error": f"Missing required columns: {missing_fields}"}]
            }
        
        # Validate each row
        for idx, row in df.iterrows():
            row_errors = self.validate_row(idx + 2, row)  # +2 for Excel row number
            if row_errors:
                errors.extend(row_errors)
        
        # Check for duplicates in file
        file_duplicates = self.check_file_duplicates(df)
        duplicates.extend(file_duplicates)
        
        # Check for existing users in database
        db_duplicates = self.check_database_duplicates(df)
        duplicates.extend(db_duplicates)
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "duplicates": duplicates,
            "statistics": {
                "total_records": len(df),
                "valid_records": len(df) - len(errors),
                "invalid_records": len(errors),
                "duplicate_count": len(duplicates)
            }
        }
    
    def validate_row(self, row_num: int, row: pd.Series) -> List[Dict]:
        """
        Validate a single row
        """
        errors = []
        
        # Validate email
        if not self.is_valid_email(row.get('email')):
            errors.append({
                "row": row_num,
                "field": "email",
                "error": "Invalid email format",
                "value": row.get('email')
            })
        
        # Validate phone
        if not self.is_valid_phone(row.get('phone')):
            errors.append({
                "row": row_num,
                "field": "phone",
                "error": "Invalid phone format",
                "value": row.get('phone')
            })
        
        # Validate community
        if 'community' in row and row['community']:
            if row['community'] not in self.valid_communities:
                errors.append({
                    "row": row_num,
                    "field": "community",
                    "error": f"Invalid community. Must be one of: {self.valid_communities}",
                    "value": row['community']
                })
        
        # Validate user type
        if 'userType' in row:
            if row['userType'] not in ['jobSeeker', 'recruiter']:
                errors.append({
                    "row": row_num,
                    "field": "userType",
                    "error": "User type must be 'jobSeeker' or 'recruiter'",
                    "value": row['userType']
                })
        
        return errors
    
    def is_valid_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, str(email)))
    
    def is_valid_phone(self, phone: str) -> bool:
        """Validate phone format"""
        # Support multiple formats: +254712345678, 0712345678, 712345678
        phone = str(phone).strip()
        pattern = r'^(\+254|0)?[17]\d{8}$'
        return bool(re.match(pattern, phone))
    
    def check_file_duplicates(self, df: pd.DataFrame) -> List[Dict]:
        """Check for duplicates within the file"""
        duplicates = []
        
        # Check email duplicates
        email_dups = df[df.duplicated(subset=['email'], keep=False)]
        for idx, row in email_dups.iterrows():
            duplicates.append({
                "row": idx + 2,
                "type": "file_duplicate",
                "field": "email",
                "value": row['email']
            })
        
        # Check phone duplicates
        phone_dups = df[df.duplicated(subset=['phone'], keep=False)]
        for idx, row in phone_dups.iterrows():
            duplicates.append({
                "row": idx + 2,
                "type": "file_duplicate",
                "field": "phone",
                "value": row['phone']
            })
        
        return duplicates
    
    def check_database_duplicates(self, df: pd.DataFrame) -> List[Dict]:
        """Check if users already exist in database"""
        from backend.models.user_model import User
        
        duplicates = []
        
        for idx, row in df.iterrows():
            # Check email
            existing_user = User.find_by_email(row['email'])
            if existing_user:
                duplicates.append({
                    "row": idx + 2,
                    "type": "database_duplicate",
                    "field": "email",
                    "value": row['email'],
                    "existing_user_id": str(existing_user['_id'])
                })
            
            # Check phone
            existing_user = User.find_by_phone(row['phone'])
            if existing_user:
                duplicates.append({
                    "row": idx + 2,
                    "type": "database_duplicate",
                    "field": "phone",
                    "value": row['phone'],
                    "existing_user_id": str(existing_user['_id'])
                })
        
        return duplicates
    
    def process_import(self, df: pd.DataFrame, batch_id: str, options: Dict) -> Dict:
        """
        Process validated data and create user accounts
        
        Options:
            - skip_duplicates: bool
            - send_verification: bool
            - auto_verify: bool
            - send_welcome_email: bool
        """
        from backend.models.user_model import User
        from backend.services.email_notification_service import EmailService
        
        results = {
            "successful": [],
            "failed": [],
            "skipped": []
        }
        
        for idx, row in df.iterrows():
            try:
                # Check for duplicates
                if options.get('skip_duplicates'):
                    if User.exists(row['email']) or User.exists_phone(row['phone']):
                        results['skipped'].append({
                            "row": idx + 2,
                            "reason": "Duplicate entry"
                        })
                        continue
                
                # Generate random password
                temp_password = self.generate_password()
                
                # Create user account
                user_data = {
                    "email": row['email'],
                    "phone": self.normalize_phone(row['phone']),
                    "password": temp_password,
                    "firstName": row.get('firstName', ''),
                    "lastName": row.get('lastName', ''),
                    "userType": row.get('userType', 'jobSeeker'),
                    "bulk_imported": True,
                    "bulk_import_batch_id": batch_id,
                    "bulk_import_source": row.get('source', ''),
                    "emailVerified": options.get('auto_verify', False),
                    "phoneVerified": options.get('auto_verify', False)
                }
                
                # Add optional fields
                if 'location' in row:
                    user_data['location'] = row['location']
                if 'companyName' in row:
                    user_data['companyName'] = row['companyName']
                if 'skills' in row:
                    user_data['skills'] = row['skills'].split(',') if isinstance(row['skills'], str) else []
                
                # Create user
                user_id = User.create(user_data)
                
                # Send verification or welcome email
                if options.get('send_verification') and not options.get('auto_verify'):
                    EmailService.send_verification_email(row['email'])
                elif options.get('send_welcome_email'):
                    EmailService.send_welcome_email(row['email'], temp_password)
                
                results['successful'].append({
                    "row": idx + 2,
                    "user_id": str(user_id),
                    "email": row['email']
                })
                
            except Exception as e:
                results['failed'].append({
                    "row": idx + 2,
                    "error": str(e),
                    "data": row.to_dict()
                })
        
        return results
    
    def generate_password(self, length: int = 12) -> str:
        """Generate secure random password"""
        import secrets
        import string
        alphabet = string.ascii_letters + string.digits + "!@#$%"
        return ''.join(secrets.choice(alphabet) for i in range(length))
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number to +254 format"""
        phone = str(phone).strip().replace(' ', '').replace('-', '')
        if phone.startswith('0'):
            phone = '+254' + phone[1:]
        elif phone.startswith('7') or phone.startswith('1'):
            phone = '+254' + phone
        return phone
    
    def generate_import_report(self, batch_id: str, results: Dict) -> str:
        """
        Generate detailed import report (CSV format)
        """
        report_data = []
        
        # Add successful imports
        for item in results['successful']:
            report_data.append({
                "Row": item['row'],
                "Status": "Success",
                "Email": item['email'],
                "User ID": item['user_id'],
                "Error": ""
            })
        
        # Add failed imports
        for item in results['failed']:
            report_data.append({
                "Row": item['row'],
                "Status": "Failed",
                "Email": item.get('data', {}).get('email', ''),
                "User ID": "",
                "Error": item['error']
            })
        
        # Add skipped entries
        for item in results['skipped']:
            report_data.append({
                "Row": item['row'],
                "Status": "Skipped",
                "Email": "",
                "User ID": "",
                "Error": item['reason']
            })
        
        # Create DataFrame and save
        report_df = pd.DataFrame(report_data)
        report_path = f"reports/bulk_import_{batch_id}.csv"
        report_df.to_csv(report_path, index=False)
        
        return report_path
```

---

## 🎨 Frontend Implementation

### 1. Admin Dashboard - Bulk Import Page

**File:** `frontend/src/pages/BulkImportPage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './BulkImportPage.css';

const BulkImportPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  
  // Import options
  const [options, setOptions] = useState({
    source: '',
    skipDuplicates: true,
    sendVerification: true,
    autoVerify: false,
    sendWelcomeEmail: false
  });

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: handleFileDrop
  });

  function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', options.source);

    try {
      const response = await axios.post('/api/bulk-import/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadedFile(response.data);
      // Auto-validate after upload
      validateData(response.data.batch_id);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  }

  async function validateData(batchId) {
    setIsValidating(true);
    try {
      const response = await axios.post(`/api/bulk-import/validate/${batchId}`);
      setValidationResults(response.data);
    } catch (error) {
      alert('Validation failed: ' + error.message);
    } finally {
      setIsValidating(false);
    }
  }

  async function processImport() {
    if (!uploadedFile || !validationResults?.valid) {
      alert('Please upload and validate a file first');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `/api/bulk-import/process/${uploadedFile.batch_id}`,
        options
      );
      
      alert('Import started! You will receive an email when complete.');
      // Refresh history
      fetchImportHistory();
      // Reset form
      setUploadedFile(null);
      setValidationResults(null);
    } catch (error) {
      alert('Import failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function fetchImportHistory() {
    try {
      const response = await axios.get('/api/bulk-import/history');
      setImportHistory(response.data.imports);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }

  async function downloadTemplate(userType) {
    window.open(`/api/bulk-import/template/${userType}`, '_blank');
  }

  useEffect(() => {
    fetchImportHistory();
  }, []);

  return (
    <div className="bulk-import-page">
      <div className="page-header">
        <h1>📊 Bulk User Import</h1>
        <p>Import users from community organizations and corporate partners</p>
      </div>

      {/* Templates Section */}
      <div className="templates-section card">
        <h2>📥 Download Templates</h2>
        <div className="template-buttons">
          <button onClick={() => downloadTemplate('jobSeeker')} className="btn-template">
            <i className="fa fa-download"></i> Job Seeker Template
          </button>
          <button onClick={() => downloadTemplate('recruiter')} className="btn-template">
            <i className="fa fa-download"></i> Recruiter Template
          </button>
          <button onClick={() => downloadTemplate('mixed')} className="btn-template">
            <i className="fa fa-download"></i> Mixed Users Template
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section card">
        <h2>📤 Upload Data File</h2>
        
        <div className="import-options">
          <div className="form-group">
            <label>Source Organization *</label>
            <input
              type="text"
              placeholder="e.g., UAN, Hindu Council, BIDCO"
              value={options.source}
              onChange={(e) => setOptions({...options, source: e.target.value})}
              required
            />
          </div>
          
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={options.skipDuplicates}
                onChange={(e) => setOptions({...options, skipDuplicates: e.target.checked})}
              />
              Skip Duplicate Entries
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={options.sendVerification}
                onChange={(e) => setOptions({...options, sendVerification: e.target.checked})}
              />
              Send Verification Emails
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={options.autoVerify}
                onChange={(e) => setOptions({...options, autoVerify: e.target.checked})}
              />
              Auto-Verify (Trusted Source)
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={options.sendWelcomeEmail}
                onChange={(e) => setOptions({...options, sendWelcomeEmail: e.target.checked})}
              />
              Send Welcome Emails with Passwords
            </label>
          </div>
        </div>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <i className="fa fa-cloud-upload fa-3x"></i>
          {isDragActive ? (
            <p>Drop file here...</p>
          ) : (
            <>
              <p>Drag & drop CSV/Excel file here, or click to select</p>
              <p className="file-types">Supported: .csv, .xls, .xlsx</p>
            </>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <div className="validation-results card">
          <h2>✓ Validation Results</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{validationResults.statistics.total_records}</div>
              <div className="stat-label">Total Records</div>
            </div>
            <div className="stat-card success">
              <div className="stat-value">{validationResults.statistics.valid_records}</div>
              <div className="stat-label">Valid Records</div>
            </div>
            <div className="stat-card error">
              <div className="stat-value">{validationResults.statistics.invalid_records}</div>
              <div className="stat-label">Invalid Records</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-value">{validationResults.statistics.duplicate_count}</div>
              <div className="stat-label">Duplicates</div>
            </div>
          </div>

          {/* Errors Table */}
          {validationResults.errors.length > 0 && (
            <div className="errors-section">
              <h3>❌ Errors Found</h3>
              <table className="errors-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Field</th>
                    <th>Error</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.errors.map((error, idx) => (
                    <tr key={idx}>
                      <td>{error.row}</td>
                      <td>{error.field}</td>
                      <td>{error.error}</td>
                      <td>{error.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Duplicates Table */}
          {validationResults.duplicates.length > 0 && (
            <div className="duplicates-section">
              <h3>⚠️ Duplicate Entries</h3>
              <table className="duplicates-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Type</th>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.duplicates.map((dup, idx) => (
                    <tr key={idx}>
                      <td>{dup.row}</td>
                      <td>{dup.type}</td>
                      <td>{dup.field}</td>
                      <td>{dup.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Process Button */}
          {validationResults.valid && (
            <div className="process-section">
              <button 
                onClick={processImport} 
                disabled={isProcessing}
                className="btn-process"
              >
                {isProcessing ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fa fa-check"></i> Process Import ({validationResults.statistics.valid_records} users)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Import History */}
      <div className="history-section card">
        <h2>📜 Import History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Source</th>
              <th>Total</th>
              <th>Successful</th>
              <th>Failed</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {importHistory.map((item) => (
              <tr key={item.batch_id}>
                <td>{item.batch_id}</td>
                <td>{item.source}</td>
                <td>{item.total_records}</td>
                <td className="success-count">{item.successful}</td>
                <td className="error-count">{item.failed}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => window.open(`/api/bulk-import/report/${item.batch_id}`, '_blank')}
                    className="btn-icon"
                    title="Download Report"
                  >
                    <i className="fa fa-download"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkImportPage;
```

---

## 🔒 Security & Privacy

### 1. Access Control
```python
# Only admins and authorized users can bulk import
@admin_required
def upload_bulk_file():
    # Check admin permissions
    # OR check if user is authorized for specific organization
    pass
```

### 2. Data Encryption
```python
# Encrypt sensitive data in uploaded files
from cryptography.fernet import Fernet

def encrypt_uploaded_file(file_path):
    """Encrypt file before storing"""
    pass
```

### 3. GDPR Compliance
```python
# Add consent tracking
user_data = {
    "data_consent": True,
    "consent_date": datetime.now(),
    "data_source": "UAN",
    "can_contact": True
}
```

### 4. Audit Logging
```python
# Log all bulk import activities
audit_log = {
    "action": "bulk_import",
    "performed_by": admin_user_id,
    "batch_id": batch_id,
    "source": "UAN",
    "records_count": 150,
    "timestamp": datetime.now(),
    "ip_address": request.remote_addr
}
```

---

## 📧 Email Notifications

### 1. Welcome Email Template

```html
Subject: Welcome to AksharJobs - Your Account Has Been Created

Dear {{firstName}},

Great news! An account has been created for you on AksharJobs through {{source}}.

Your Login Details:
Email: {{email}}
Temporary Password: {{password}}

Next Steps:
1. Visit https://aksharjobs.com/login
2. Log in with the credentials above
3. Change your password
4. Complete your profile to get better job matches

AksharJobs is an AI-powered job matching platform that helps you:
✓ Find jobs that match your skills
✓ Track your applications
✓ Get AI-powered career recommendations
✓ Earn and redeem Akshar Coins

Questions? Reply to this email or contact our support team.

Best regards,
The AksharJobs Team
```

### 2. Verification Email (If Not Auto-Verified)

```html
Subject: Verify Your AksharJobs Account

Dear {{firstName}},

An account has been created for you on AksharJobs through {{source}}.

Please verify your email address to activate your account:

[Verify Email Button]

Or use this code: {{verification_code}}

This verification link will expire in 24 hours.

Best regards,
The AksharJobs Team
```

---

## 📊 Testing & Deployment

### Test Plan

**1. Unit Tests:**
```python
# test_bulk_import_service.py

def test_email_validation():
    assert BulkImportService().is_valid_email("test@example.com") == True
    assert BulkImportService().is_valid_email("invalid-email") == False

def test_phone_validation():
    assert BulkImportService().is_valid_phone("+254712345678") == True
    assert BulkImportService().is_valid_phone("0712345678") == True
    assert BulkImportService().is_valid_phone("invalid") == False

def test_file_duplicate_detection():
    # Test CSV with duplicate emails
    pass

def test_database_duplicate_detection():
    # Test against existing users
    pass
```

**2. Integration Tests:**
```python
# test_bulk_import_api.py

def test_file_upload():
    # Test CSV upload
    pass

def test_file_validation():
    # Test validation endpoint
    pass

def test_import_processing():
    # Test full import process
    pass
```

**3. Load Testing:**
- Test with 100 records
- Test with 1,000 records
- Test with 10,000 records
- Measure processing time and memory usage

---

## 🚀 Deployment Checklist

```
□ Create bulk_imports collection in MongoDB
□ Add indexes for batch_id and source fields
□ Deploy bulk import API endpoints
□ Create admin UI for bulk imports
□ Set up file storage (GridFS or S3)
□ Configure email templates
□ Set up audit logging
□ Test with sample data
□ Create user documentation
□ Train admins on bulk import process
□ Set up monitoring and alerts
□ Deploy to production
```

---

## 📈 Success Metrics

Track these metrics to measure bulk import success:

```
✓ Import Success Rate (target: >95%)
✓ Average Processing Time per 100 records
✓ Validation Error Rate
✓ Duplicate Detection Accuracy
✓ User Activation Rate (how many complete profiles)
✓ Email Delivery Rate
✓ User Satisfaction (survey imported users)
```

---

## 🎉 Conclusion

This bulk data upload system enables you to:

✅ Import hundreds/thousands of users from CSV/Excel files
✅ Validate data before importing
✅ Handle duplicates intelligently
✅ Send verification and welcome emails automatically
✅ Track all imports with detailed reports
✅ Support multiple data sources (UAN, Hindu Council, BIDCO, etc.)
✅ Maintain security and GDPR compliance
✅ Scale to handle large datasets

**Start by creating the templates, then implement the API endpoints, and finally build the admin UI.**

---

**Document Version:** 1.0
**Created:** October 5, 2025
**Platform:** AksharJobs
**Purpose:** Bulk data import implementation guide


