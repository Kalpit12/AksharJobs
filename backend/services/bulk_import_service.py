#!/usr/bin/env python3
"""
Bulk Import Service
Handles bulk user import processing, validation, and report generation
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
import re
from datetime import datetime
import bcrypt
import secrets
import string
import os

class BulkImportService:
    
    def __init__(self):
        self.required_fields = ['email', 'phone', 'firstName', 'lastName']
        
    def parse_file(self, file_path: str, file_type: str) -> pd.DataFrame:
        """Parse uploaded CSV/Excel file"""
        try:
            if file_type == 'csv':
                df = pd.read_csv(file_path)
            elif file_type in ['xls', 'xlsx']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
            
            # Clean column names (strip whitespace)
            df.columns = df.columns.str.strip()
            
            # Replace NaN with empty string
            df = df.fillna('')
            
            return df
        except Exception as e:
            raise Exception(f"Failed to parse file: {str(e)}")
    
    def validate_data(self, df: pd.DataFrame) -> Dict:
        """
        Validate all records in dataframe
        Returns validation results with errors and duplicates
        """
        errors = []
        duplicates = []
        
        # Check required fields
        missing_fields = [f for f in self.required_fields if f not in df.columns]
        if missing_fields:
            return {
                "valid": False,
                "errors": [{"error": f"Missing required columns: {', '.join(missing_fields)}"}],
                "duplicates": [],
                "statistics": {
                    "total_records": len(df),
                    "valid_records": 0,
                    "invalid_records": len(df),
                    "duplicate_count": 0
                }
            }
        
        # Validate each row
        for idx, row in df.iterrows():
            row_errors = self.validate_row(idx + 2, row)  # +2 for Excel row number (header + 0-index)
            if row_errors:
                errors.extend(row_errors)
        
        # Check for duplicates in file
        file_duplicates = self.check_file_duplicates(df)
        duplicates.extend(file_duplicates)
        
        # Check for existing users in database
        db_duplicates = self.check_database_duplicates(df)
        duplicates.extend(db_duplicates)
        
        # Calculate statistics
        error_rows = set([e['row'] for e in errors])
        valid_records = len(df) - len(error_rows)
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "duplicates": duplicates,
            "statistics": {
                "total_records": len(df),
                "valid_records": valid_records,
                "invalid_records": len(error_rows),
                "duplicate_count": len(duplicates)
            }
        }
    
    def validate_row(self, row_num: int, row: pd.Series) -> List[Dict]:
        """Validate a single row"""
        errors = []
        
        # Check required fields are not empty
        for field in self.required_fields:
            if not row.get(field) or str(row.get(field)).strip() == '':
                errors.append({
                    "row": row_num,
                    "field": field,
                    "error": f"{field} is required",
                    "value": row.get(field)
                })
        
        # Validate email
        if row.get('email') and not self.is_valid_email(row.get('email')):
            errors.append({
                "row": row_num,
                "field": "email",
                "error": "Invalid email format",
                "value": row.get('email')
            })
        
        # Validate phone
        if row.get('phone') and not self.is_valid_phone(row.get('phone')):
            errors.append({
                "row": row_num,
                "field": "phone",
                "error": "Invalid phone format (use +254... or 07... or 01...)",
                "value": row.get('phone')
            })
        
        # Validate user type
        if 'userType' in row and row['userType']:
            if row['userType'] not in ['jobSeeker', 'recruiter', 'intern', 'job_seeker']:
                errors.append({
                    "row": row_num,
                    "field": "userType",
                    "error": "User type must be 'jobSeeker', 'recruiter', or 'intern'",
                    "value": row['userType']
                })
        
        return errors
    
    def is_valid_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, str(email)))
    
    def is_valid_phone(self, phone: str) -> bool:
        """Validate phone format"""
        # Support multiple formats: +254712345678, 0712345678, 0112345678, 712345678
        phone = str(phone).strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        # More lenient validation - accept any reasonable phone number format
        # Kenyan phone patterns (more flexible)
        patterns = [
            r'^\+254\d{9,10}$',    # +254 followed by 9-10 digits
            r'^254\d{9,10}$',      # 254 followed by 9-10 digits
            r'^0\d{9,10}$',        # 0 followed by 9-10 digits
            r'^\d{9,10}$'          # Just 9-10 digits
        ]
        return any(re.match(pattern, phone) for pattern in patterns)
    
    def check_file_duplicates(self, df: pd.DataFrame) -> List[Dict]:
        """Check for duplicates within the file"""
        duplicates = []
        
        # Check email duplicates
        email_dups = df[df.duplicated(subset=['email'], keep=False)]
        for idx, row in email_dups.iterrows():
            if row['email']:  # Only report if email is not empty
                duplicates.append({
                    "row": idx + 2,
                    "type": "file_duplicate",
                    "field": "email",
                    "value": row['email'],
                    "message": "Email appears multiple times in file"
                })
        
        # Check phone duplicates
        phone_dups = df[df.duplicated(subset=['phone'], keep=False)]
        for idx, row in phone_dups.iterrows():
            if row['phone']:  # Only report if phone is not empty
                duplicates.append({
                    "row": idx + 2,
                    "type": "file_duplicate",
                    "field": "phone",
                    "value": row['phone'],
                    "message": "Phone appears multiple times in file"
                })
        
        return duplicates
    
    def check_database_duplicates(self, df: pd.DataFrame) -> List[Dict]:
        """Check if users already exist in database"""
        from utils.db import get_db
        
        duplicates = []
        db = get_db()
        users = db['users']
        
        for idx, row in df.iterrows():
            # Check email
            if row.get('email'):
                existing_user = users.find_one({'email': row['email']})
                if existing_user:
                    duplicates.append({
                        "row": idx + 2,
                        "type": "database_duplicate",
                        "field": "email",
                        "value": row['email'],
                        "message": "Email already exists in database",
                        "existing_user_id": str(existing_user['_id'])
                    })
            
            # Check phone
            if row.get('phone'):
                normalized_phone = self.normalize_phone(row['phone'])
                existing_user = users.find_one({'phoneNumber': normalized_phone})
                if existing_user:
                    duplicates.append({
                        "row": idx + 2,
                        "type": "database_duplicate",
                        "field": "phone",
                        "value": row['phone'],
                        "message": "Phone already exists in database",
                        "existing_user_id": str(existing_user['_id'])
                    })
        
        return duplicates
    
    def process_import(self, df: pd.DataFrame, batch_id: str, options: Dict) -> Dict:
        """
        Process validated data and create user accounts
        
        Options:
            - skipDuplicates: bool
            - sendVerification: bool
            - autoVerify: bool
            - sendWelcomeEmail: bool
            - source: str
        """
        from utils.db import get_db
        
        db = get_db()
        users = db['users']
        
        results = {
            "successful": [],
            "failed": [],
            "skipped": []
        }
        
        for idx, row in df.iterrows():
            try:
                # Check for duplicates
                if options.get('skipDuplicates', True):
                    existing_email = users.find_one({'email': row['email']})
                    if existing_email:
                        results['skipped'].append({
                            "row": idx + 2,
                            "reason": "Email already exists",
                            "email": row['email']
                        })
                        continue
                    
                    normalized_phone = self.normalize_phone(row['phone'])
                    existing_phone = users.find_one({'phoneNumber': normalized_phone})
                    if existing_phone:
                        results['skipped'].append({
                            "row": idx + 2,
                            "reason": "Phone already exists",
                            "phone": row['phone']
                        })
                        continue
                
                # Generate random password
                temp_password = self.generate_password()
                hashed_password = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt())
                
                # Determine user type
                user_type = row.get('userType', 'jobSeeker')
                if user_type == 'job_seeker':
                    user_type = 'jobSeeker'
                
                # If university name is provided, treat as intern
                if row.get('universityName') or row.get('studentId') or row.get('internshipPreference'):
                    user_type = 'intern'
                
                # Create user account
                user_data = {
                    "email": row['email'].strip(),
                    "phoneNumber": self.normalize_phone(row['phone']),
                    "password": hashed_password,
                    "firstName": row.get('firstName', '').strip(),
                    "lastName": row.get('lastName', '').strip(),
                    "userType": user_type,
                    "role": user_type,
                    "bulk_imported": True,
                    "bulk_import_batch_id": batch_id,
                    "bulk_import_source": options.get('source', ''),
                    "emailVerified": options.get('autoVerify', False),
                    "phoneVerified": options.get('autoVerify', False),
                    "profileCompleted": False,  # Bulk-imported users need to complete their profile
                    "is_active": True,
                    "created_at": datetime.now(),
                    "temp_password": temp_password  # Store for welcome email
                }
                
                # Add optional fields
                if row.get('location'):
                    user_data['location'] = row['location'].strip()
                
                if row.get('companyName'):
                    user_data['companyName'] = row['companyName'].strip()
                
                if row.get('companyWebsite'):
                    user_data['companyWebsite'] = row['companyWebsite'].strip()
                
                if row.get('jobTitle'):
                    user_data['jobTitle'] = row['jobTitle'].strip()
                
                if row.get('skills'):
                    # Split skills by comma
                    skills = [s.strip() for s in str(row['skills']).split(',') if s.strip()]
                    user_data['skills'] = skills
                
                if row.get('education'):
                    user_data['education'] = row['education'].strip()
                
                if row.get('experienceYears'):
                    try:
                        user_data['experienceYears'] = int(row['experienceYears'])
                    except:
                        pass
                
                # Intern-specific fields
                if row.get('universityName'):
                    user_data['universityName'] = row['universityName'].strip()
                
                if row.get('studentId'):
                    user_data['studentId'] = row['studentId'].strip()
                
                if row.get('internshipPreference'):
                    user_data['internshipPreference'] = row['internshipPreference'].strip()
                
                if row.get('availability'):
                    user_data['availability'] = row['availability'].strip()
                
                # Mark as intern if university name is provided
                if row.get('universityName'):
                    user_data['isIntern'] = True
                    user_data['internStatus'] = 'seeking'
                
                # Create user
                result = users.insert_one(user_data)
                user_id = str(result.inserted_id)
                
                # Send emails (we'll handle this later with email service)
                # For now, just record success
                
                results['successful'].append({
                    "row": idx + 2,
                    "user_id": user_id,
                    "email": row['email'],
                    "name": f"{user_data['firstName']} {user_data['lastName']}",
                    "temp_password": temp_password
                })
                
            except Exception as e:
                results['failed'].append({
                    "row": idx + 2,
                    "error": str(e),
                    "email": row.get('email', ''),
                    "name": f"{row.get('firstName', '')} {row.get('lastName', '')}"
                })
        
        return results
    
    def generate_password(self, length: int = 12) -> str:
        """Generate secure random password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%"
        return ''.join(secrets.choice(alphabet) for i in range(length))
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number to +254 format"""
        phone = str(phone).strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        if phone.startswith('+254'):
            return phone
        elif phone.startswith('254'):
            return '+' + phone
        elif phone.startswith('0'):
            return '+254' + phone[1:]
        elif phone.startswith('7') or phone.startswith('1'):
            return '+254' + phone
        else:
            return phone
    
    def generate_import_report(self, batch_id: str, results: Dict) -> str:
        """Generate detailed import report (CSV format)"""
        report_data = []
        
        # Add successful imports
        for item in results['successful']:
            report_data.append({
                "Row": item['row'],
                "Status": "Success",
                "Name": item['name'],
                "Email": item['email'],
                "User ID": item['user_id'],
                "Temp Password": item['temp_password'],
                "Error": ""
            })
        
        # Add failed imports
        for item in results['failed']:
            report_data.append({
                "Row": item['row'],
                "Status": "Failed",
                "Name": item.get('name', ''),
                "Email": item.get('email', ''),
                "User ID": "",
                "Temp Password": "",
                "Error": item['error']
            })
        
        # Add skipped entries
        for item in results['skipped']:
            report_data.append({
                "Row": item['row'],
                "Status": "Skipped",
                "Name": "",
                "Email": item.get('email', item.get('phone', '')),
                "User ID": "",
                "Temp Password": "",
                "Error": item['reason']
            })
        
        # Create DataFrame and save
        report_df = pd.DataFrame(report_data)
        
        # Create reports directory if it doesn't exist
        reports_dir = 'reports'
        os.makedirs(reports_dir, exist_ok=True)
        
        report_path = os.path.join(reports_dir, f'bulk_import_{batch_id}.csv')
        report_df.to_csv(report_path, index=False)
        
        return report_path

