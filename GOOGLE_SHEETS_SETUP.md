# Google Sheets Integration Setup for AksharJobs Expo

## Quick Setup (5 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "AksharJobs Expo Registrations"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit`
   - Sheet ID: `1ABC123...XYZ`

### Step 2: Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code and paste the contents of `google_sheets_integration.gs`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Save the project (Ctrl+S) and name it "AksharJobs Registration Handler"

### Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as type
3. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 4: Update Your Landing Page
1. Open `expo_landing.js`
2. Find this line:
   ```javascript
   const REGISTRATION_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual Web App URL

### Step 5: Test the Integration
1. Open your expo landing page
2. Fill out the registration form
3. Submit it
4. Check your Google Sheet - you should see the data appear!

## What You'll Get

Your Google Sheet will have these columns:
- **Timestamp**: When they registered
- **Name**: Full name
- **Email**: Email address
- **Phone**: Phone number
- **Role**: Job Seeker or Recruiter
- **Status**: New (for tracking follow-up)

## Troubleshooting

### If registrations aren't appearing:
1. Check the browser console for errors
2. Verify the Web App URL is correct
3. Make sure the Google Sheet ID is correct
4. Ensure the Web App is deployed with "Anyone" access

### If you get permission errors:
1. Go to your Google Apps Script project
2. Click "Deploy" → "Manage deployments"
3. Click the pencil icon to edit
4. Change "Who has access" to "Anyone"
5. Click "Deploy"

## Benefits

✅ **Real-time data**: Registrations appear instantly in your sheet
✅ **Backup system**: Local storage backup if Google Sheets fails
✅ **Email notifications**: You also get emails for each registration
✅ **Easy to manage**: Sort, filter, and export your leads
✅ **No coding required**: Just copy-paste and deploy

## For Your Expo

- **Live tracking**: Watch registrations come in real-time
- **Lead management**: Easy to follow up with prospects
- **Data export**: Download as Excel/CSV for your CRM
- **Analytics**: Track which roles are more popular

Your registration form is now fully functional and will store all data in Google Sheets!
