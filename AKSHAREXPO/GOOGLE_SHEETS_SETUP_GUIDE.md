# Google Sheets Integration Setup Guide

## 🚨 Current Issue
The Google Sheets webhook is returning a 404 error, which means the Google Apps Script is not properly deployed or accessible.

## 📋 Step-by-Step Setup Instructions

### Step 1: Create Google Apps Script
1. Go to [https://script.google.com](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the entire code from `google_sheets_integration.gs` file

### Step 2: Create Google Sheet
1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the Sheet ID from the URL (the long string after `/d/` and before `/edit`)
4. Example: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
5. Update the `SHEET_ID` variable in the Apps Script with your Sheet ID

### Step 3: Deploy as Web App
1. In Google Apps Script, click "Deploy" → "New Deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### Step 4: Update Registration Form
1. Open `registration.html`
2. Find this line:
   ```javascript
   const REGISTRATION_FORM_WEBHOOK_URL = 'https://script.google.com/macros/s/1a0WU4spcvo2658O7VMrax9t2xpqeyWU0J-yVU9SfB_c/exec';
   ```
3. Replace with your new Web App URL:
   ```javascript
   const REGISTRATION_FORM_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec';
   ```

### Step 5: Test the Integration
1. Open `test_webhook.html` in your browser
2. Click "Test Webhook Connection" to verify the webhook is working
3. Click "Test Registration Data" to send test data
4. Check your Google Sheet to see if data appears

## 🔧 Troubleshooting

### If you get 404 errors:
- Make sure the Web App is deployed with "Anyone" access
- Verify the Script ID in the URL is correct
- Try redeploying the Web App

### If data doesn't appear in Google Sheets:
- Check the Google Apps Script logs (View → Logs)
- Verify the Sheet ID is correct
- Make sure the sheet names match exactly:
  - "Expo Registrations" for registration data
  - "Referral Tracking" for referral data

### If form submission fails:
- Open browser console (F12) to see any JavaScript errors
- Check the Network tab to see if requests are being sent
- Verify all required fields are filled

## 📊 Expected Google Sheets Structure

### Expo Registrations Sheet
The sheet will automatically create these columns:
- Timestamp
- Full Name
- Email
- Phone
- Role
- Experience (Job Seeker)
- Skills (Job Seeker)
- Location (Job Seeker)
- Company (Recruiter)
- Position (Recruiter)
- Community Organization (Community)
- And many more role-specific fields...

### Referral Tracking Sheet
- Referrer Name
- Referrer Email
- Referrer Phone
- Referrer Role
- Referrer Count
- Akshar coins
- Time stamp
- Referral Code
- Platform

## 🧪 Testing Checklist

- [ ] Google Apps Script deployed successfully
- [ ] Web App URL accessible (no 404 errors)
- [ ] Google Sheet created with correct ID
- [ ] Registration form updated with new webhook URL
- [ ] Test webhook connection works
- [ ] Test registration data appears in Google Sheets
- [ ] All role-specific fields are captured correctly

## 📞 Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Verify the webhook URL is accessible
3. Test with the `test_webhook.html` file
4. Check Google Apps Script execution logs
5. Ensure all permissions are set correctly
