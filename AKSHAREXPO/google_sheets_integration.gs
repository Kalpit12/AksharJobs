  /**
  * Google Apps Script for AksharJobs Expo Registration
  * 
  * SETUP INSTRUCTIONS:
  * 1. Go to https://script.google.com
  * 2. Create a new project
  * 3. Replace the default code with this script
  * 4. Create a new Google Sheet and note the Sheet ID
  * 5. Update the SHEET_ID variable below with your Sheet ID
  * 6. Deploy as Web App with "Anyone" access
  * 7. Copy the Web App URL and update REGISTRATION_WEBHOOK_URL in expo_landing.js
  */

  // Replace with your Google Sheet ID (found in the URL)
  const SHEET_ID = '14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk';

  // Helper function to create CORS-enabled response
  function createCORSResponse(data) {
    const response = ContentService.createTextOutput(JSON.stringify(data));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }

  // Handle CORS preflight requests
  function doOptions(e) {
    return ContentService
      .createTextOutput('')
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Enhanced CORS handling for all responses
  function createCORSResponse(data) {
    const response = ContentService.createTextOutput(JSON.stringify(data));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }

  // Sheet names where data will be stored
  const REGISTRATION_SHEET_NAME = 'AksharJobs Expo Registration Data';
  const REFERRAL_SHEET_NAME = 'Referral_Tracking';
  const REFERRAL_CLICKS_SHEET_NAME = 'Referral_Clicks';
  const LIVE_VISITOR_SHEET_NAME = 'Live_Visitor_Tracking';

  // Role-specific sheet names
  const ROLE_SHEETS = {
    'job_seeker': 'Job_Seekers',
    'recruiter': 'Recruiters', 
    'mentor': 'Mentors',
    'trainer': 'Trainers',
    'consultant': 'Consultants',
    'volunteer': 'Volunteers',
    'intern': 'Interns',
    'community': 'Community',
    'university': 'Universities',
    'evangelist': 'Evangelists'
  };

  function doPost(e) {
    try {
      console.log('doPost called with:', e);
      console.log('doPost event type:', typeof e);
      console.log('doPost has postData:', !!e.postData);
      console.log('doPost has parameters:', !!e.parameters);
      
      // Handle case where e is undefined or null
      if (!e) {
        console.log('No event object received, treating as test call');
        return createCORSResponse({
          message: 'doPost function called without event object',
          timestamp: new Date().toISOString()
        });
      }
      
      // Parse the incoming data (handle both JSON and form data)
      let data = {};
      try {
        console.log('Event object structure:', {
          hasPostData: !!e.postData,
          postDataType: e.postData ? e.postData.type : 'none',
          hasParameters: !!e.parameters,
          parametersKeys: e.parameters ? Object.keys(e.parameters) : 'none'
        });
        
        if (e.postData && e.postData.type === 'application/json') {
          console.log('Parsing JSON data:', e.postData.contents);
          data = JSON.parse(e.postData.contents);
        } else if (e.postData && e.postData.contents) {
          console.log('Parsing postData contents as form data');
          // Try to parse as form data
          const formData = e.postData.contents;
          const pairs = formData.split('&');
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              data[decodeURIComponent(key)] = decodeURIComponent(value);
            }
          });
        } else if (e.parameters) {
          console.log('Using parameters directly');
          data = e.parameters;
          // Convert arrays to single values (form data comes as arrays)
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && data[key].length === 1) {
              data[key] = data[key][0];
            }
          });
        } else {
          console.log('No data found in request');
          data = {};
        }
        
        console.log('Parsed data:', data);
        console.log('Data type:', typeof data);
        console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
        
      } catch (parseError) {
        console.error('Error parsing data:', parseError);
        return createCORSResponse({
          error: 'Failed to parse request data',
          details: parseError.toString(),
          received: e
        });
      }
      
      // Validate that we have data before processing
      if (!data || Object.keys(data).length === 0) {
        console.error('No data received for processing');
        return createCORSResponse({
          error: 'No data received',
          received: e
        });
      }
      
      // Check if this is a centralized count request
      if (data.type === 'get_centralized_counts' || data.action === 'get_centralized_counts') {
        return getLiveVisitorCount();
      }
      // Check if this is a referral tracking request
      else if (data.type === 'referral' || data.type === 'referral_share') {
        return processReferralTracking(data);
      } else if (data.type === 'referral_registration') {
        return processReferralRegistration(data);
      } else if (data.type === 'referrer_coins') {
        return processReferrerCoins(data);
      } else if (data.type === 'visitor_tracking') {
        return processVisitorTracking(data);
      } else {
        // Process the registration
        return processRegistration(data);
      }
        
    } catch (error) {
      console.error('Error in doPost:', error);
      
      return createCORSResponse({
        error: 'Failed to process registration',
        details: error.toString(),
        eventObject: e ? 'present' : 'missing',
        postData: e && e.postData ? e.postData.contents : 'none',
        parameters: e && e.parameters ? e.parameters : 'none'
      });
    }
  }

  // ========================================
  // MAIN GET HANDLER
  // ========================================
  // Note: The doGet function is defined later in this file (around line 937)
  // to include all functionality in one consolidated function

  // Common function to process registration data
  function processRegistration(data) {
    console.log('=== processRegistration function entry ===');
    console.log('Arguments received:', arguments);
    console.log('Arguments length:', arguments.length);
    console.log('First argument:', arguments[0]);
    console.log('Data parameter:', data);
    console.log('Data type:', typeof data);
    console.log('Data is null:', data === null);
    console.log('Data is undefined:', data === undefined);
    
    try {
      console.log('processRegistration called with data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
      console.log('Stack trace:', new Error().stack);
      
      // Check if data is valid
      if (!data || typeof data !== 'object') {
        console.error('Invalid data object:', data);
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Invalid data object',
            received: data
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Validate required fields (check both name and fullName, accept both role and roles)
      if ((!data.name && !data.fullName) || !data.email || !data.phone || (!data.role && !data.roles)) {
        console.error('Missing required fields:', {
          name: data.name,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          role: data.role,
          roles: data.roles
        });
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Missing required fields',
            received: {
              name: data.name,
              fullName: data.fullName,
              email: data.email,
              phone: data.phone,
              role: data.role,
              roles: data.roles
            }
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Open the Google Sheet
      let spreadsheet, sheet;
      try {
        spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        sheet = spreadsheet.getSheetByName(REGISTRATION_SHEET_NAME);
        
        // Create sheet if it doesn't exist
        if (!sheet) {
          sheet = spreadsheet.insertSheet(REGISTRATION_SHEET_NAME);
          console.log('Created new sheet:', REGISTRATION_SHEET_NAME);
        }
      } catch (error) {
        console.error('Error accessing Google Sheet:', error);
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Failed to access Google Sheet',
            details: error.toString()
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Create comprehensive headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        const headers = [
          'Timestamp', 'Full Name', 'Email', 'Phone', 'Roles', 'Role Count',
          // Job Seeker fields
          'Experience', 'Skills', 'Location', 'Job Type', 'Industry',
          // Recruiter fields
          'Company', 'Position', 'Industry', 'Company Size', 'Hiring Volume',
          // Mentor fields
          'Expertise', 'Mentorship Type', 'Bio',
          // Trainer fields
          'Specialization', 'Training Format', 'Certifications',
          // Consultant fields
          'Consultant Specialization', 'Consultant Experience', 'Consultant Type', 'Industry Focus',
          // Volunteer fields
          'Volunteer Interests', 'Volunteer Availability', 'Volunteer Motivation',
          // Intern fields
          'University', 'Field', 'Internship Type', 'Graduation Year',
          // Community fields
          'Community Organization', 'Community Interests', 'Community Role', 'Community Experience', 'Community Description',
          // University fields
          'University Name', 'Department', 'University Type', 'Student Count',
          // Common additional fields
          'Notification Status', 'Registration Type'
        ];
        
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        console.log('Added comprehensive headers to sheet');
      }
      
      // Check for duplicate email registration
      const emailToCheck = data.email.toLowerCase().trim();
      console.log('Checking for duplicate email:', emailToCheck);
      
      if (sheet.getLastRow() > 0) {
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        
        // Check all rows (skip header row at index 0)
        for (let i = 1; i < values.length; i++) {
          const existingEmail = values[i][2]; // Email is in column C (index 2)
          
          if (existingEmail && existingEmail.toString().toLowerCase().trim() === emailToCheck) {
            console.log('Duplicate registration detected for email:', emailToCheck);
            console.log('Existing record at row:', i + 1);
            
            return ContentService
              .createTextOutput(JSON.stringify({
                error: 'Email already registered',
                message: 'This email address is already registered. Please use a different email or contact support if you need help.',
                duplicate: true,
                existingEmail: emailToCheck,
                existingName: values[i][1], // Full Name from column B
                registeredAt: values[i][0]  // Timestamp from column A
              }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      
      console.log('No duplicate found, proceeding with registration');
      
      // Prepare comprehensive registration data
      const timestamp = new Date();
      const roleLabels = {
        'job_seeker': 'Job Seeker',
        'recruiter': 'Recruiter', 
        'mentor': 'Mentor',
        'trainer': 'Trainer',
        'consultant': 'Consultant',
        'volunteer': 'Volunteer',
        'intern': 'Intern',
        'community': 'Community',
        'university': 'University',
        'evangelist': 'Evangelist'
      };
      
      // Create a comprehensive row with all possible fields
      const newRow = [
        timestamp,
        data.fullName || data.name || '',
        data.email || '',
        data.phone || '',
        data.roles || data.role || '', // Support both multiple roles and single role
        data.roleCount || (data.roles ? data.roles.split(',').length : 1) || '', // Count of roles
        // Job Seeker fields
        data.experience || '',
        data.skills || '',
        data.location || '',
        data.jobType || '',
        data.industry || '',
        // Recruiter fields
        data.company || '',
        data.position || '',
        data.industry || '',
        data.companySize || '',
        data.hiringVolume || '',
        // Mentor fields
        data.expertise || '',
        data.mentorshipType || '',
        data.bio || '',
        // Trainer fields
        data.specialization || '',
        data.trainingFormat || '',
        data.certifications || '',
        // Consultant fields
        data.consultantSpecialization || '',
        data.consultantExperience || '',
        data.consultantType || '',
        data.industryFocus || '',
        // Volunteer fields
        data.volunteerInterests || '',
        data.volunteerAvailability || '',
        data.volunteerMotivation || '',
        // Intern fields
        data.university || '',
        data.field || '',
        data.internshipType || '',
        data.graduationYear || '',
        // Community fields
        data.communityOrganization || '',
        data.communityInterests || '',
        data.communityRole || '',
        data.communityExperience || '',
        data.communityDescription || '',
        // University fields
        data.universityName || '',
        data.department || '',
        data.universityType || '',
        data.studentCount || '',
        // Common additional fields
        'Pending Notification',
        data.type || 'registration'
      ];
      
      sheet.appendRow(newRow);
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, newRow.length);
      
      // Save to role-specific sheets (supports multiple roles)
      try {
        // Handle both single role (old format) and multiple roles (new format)
        let rolesToProcess = [];
        
        if (data.roles) {
          // New format: comma-separated roles
          rolesToProcess = data.roles.split(',').map(r => r.trim());
          console.log('Multiple roles detected:', rolesToProcess);
        } else if (data.role) {
          // Old format: single role
          rolesToProcess = [data.role];
          console.log('Single role detected:', data.role);
        }
        
        // Save to each role-specific sheet
        rolesToProcess.forEach(roleValue => {
          const roleSheetName = ROLE_SHEETS[roleValue];
          if (roleSheetName) {
            let roleSheet = spreadsheet.getSheetByName(roleSheetName);
            
            // Create role-specific sheet if it doesn't exist
            if (!roleSheet) {
              roleSheet = spreadsheet.insertSheet(roleSheetName);
              console.log('Created new role-specific sheet:', roleSheetName);
            }
            
            // Add headers if sheet is empty
            if (roleSheet.getLastRow() === 0) {
              const headers = [
                'Timestamp', 'Full Name', 'Email', 'Phone', 'Roles',
                // Job Seeker fields
                'Experience', 'Skills', 'Location', 'Job Type', 'Industry',
                // Recruiter fields
                'Company', 'Position', 'Industry', 'Company Size', 'Hiring Volume',
                // Mentor fields
                'Expertise', 'Mentorship Type', 'Bio',
                // Trainer fields
                'Specialization', 'Training Format', 'Certifications',
                // Consultant fields
                'Consultant Specialization', 'Consultant Experience', 'Consultant Type', 'Industry Focus',
                // Volunteer fields
                'Volunteer Interests', 'Volunteer Availability', 'Volunteer Motivation',
                // Intern fields
                'University', 'Field', 'Internship Type', 'Graduation Year',
                // Community fields
                'Community Organization', 'Community Interests', 'Community Role', 'Community Experience', 'Community Description',
                // University fields
                'University Name', 'Department', 'University Type', 'Student Count',
                // Common additional fields
                'Notification Status', 'Registration Type', 'Role Count'
              ];
              
              roleSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
              roleSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
              console.log('Added headers to role-specific sheet:', roleSheetName);
            }
            
            // Append the same data to role-specific sheet
            roleSheet.appendRow(newRow);
            roleSheet.autoResizeColumns(1, newRow.length);
            console.log('Saved registration to role-specific sheet:', roleSheetName);
          } else {
            console.log('No role-specific sheet defined for role:', roleValue);
          }
        });
        
        if (rolesToProcess.length > 0) {
          console.log(`Successfully saved to ${rolesToProcess.length} role-specific sheets`);
        }
      } catch (roleSheetError) {
        console.error('Error saving to role-specific sheet:', roleSheetError);
        // Don't fail the entire registration if role-specific sheet fails
      }
      
      // Return success response
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Registration saved successfully',
          timestamp: timestamp.toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error processing registration:', error);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to save registration',
          details: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Function to get coins earned for sharing on different platforms
  function getCoinsForSharing(platform) {
    const shareRewards = {
      'whatsapp': 3,      // 3 coins for sharing
      'email': 3,         // 3 coins for sharing
      'sms': 3,           // 3 coins for sharing
      'linkedin': 3,      // 3 coins for sharing
      'twitter': 3,       // 3 coins for sharing
      'facebook': 3,      // 3 coins for sharing
      'telegram': 3,      // 3 coins for sharing
      'native': 3,        // 3 coins for sharing
      'copy': 3           // 3 coins for sharing
    };
    
    return shareRewards[platform] || 3; // Default 3 coins for sharing
  }

  // Function to get coins earned when someone registers via referral
  function getCoinsForRegistration() {
    return 1; // 1 coin bonus when someone registers via referral link
  }

  // Function to check if user is registered
  function checkUserRegistration(email) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATION_SHEET_NAME);
      
      if (!sheet) {
        console.log('Registration sheet not found');
        return { registered: false, message: 'Registration sheet not found' };
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Check if email exists in registration sheet
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email) { // Email is in column 3 (index 2)
          return {
            registered: true,
            message: 'User is registered',
            userData: {
              name: data[i][1],
              email: data[i][2],
              phone: data[i][3],
              role: data[i][4],
              timestamp: data[i][0]
            }
          };
        }
      }
      
      return { registered: false, message: 'User not found in registration sheet' };
      
    } catch (error) {
      console.error('Error checking user registration:', error);
      return { registered: false, message: 'Error checking registration: ' + error.toString() };
    }
  }

  // Function to update user login timestamp
  function updateUserLoginTimestamp(email, timestamp) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATION_SHEET_NAME);
      
      if (!sheet) {
        console.log('Registration sheet not found');
        return { success: false, message: 'Registration sheet not found' };
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Find the user by email and update last login timestamp
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email) { // Email is in column 3 (index 2)
          // Update the last login timestamp (assuming it's in column 6, index 5)
          // If the column doesn't exist, we'll add it
          const lastLoginColumn = 6; // Column F
          
          // Ensure we have enough columns
          if (data[i].length < lastLoginColumn) {
            // Extend the row to include the last login column
            const newRow = new Array(lastLoginColumn).fill('');
            for (let j = 0; j < data[i].length; j++) {
              newRow[j] = data[i][j];
            }
            data[i] = newRow;
          }
          
          // Update the last login timestamp
          sheet.getRange(i + 1, lastLoginColumn).setValue(timestamp);
          
          console.log('Updated login timestamp for:', email, 'at', timestamp);
          return { 
            success: true, 
            message: 'Login timestamp updated successfully',
            lastLogin: timestamp
          };
        }
      }
      
      return { success: false, message: 'User not found in registration sheet' };
      
    } catch (error) {
      console.error('Error updating login timestamp:', error);
      return { success: false, message: 'Error updating login timestamp: ' + error.toString() };
    }
  }

  // Function to track referral shares
  function trackReferralShare(referrerEmail, referrerName, platform, coinsEarned, totalShares, shareCount, timestamp) {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let sharesSheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      
      // Create sheet if it doesn't exist
      if (!sharesSheet) {
        sharesSheet = spreadsheet.insertSheet(REFERRAL_SHEET_NAME);
        sharesSheet.getRange(1, 1, 1, 8).setValues([
          ['Referrer Email', 'Referrer Name', 'Platform', 'Coins Earned', 'Total Shares', 'Share Count', 'Timestamp', 'Date']
        ]);
        sharesSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
        console.log('Created new referral shares tracking sheet');
      }
      
      // Add the referral share data
      const newRow = [
        referrerEmail,
        referrerName,
        platform,
        parseInt(coinsEarned) || 0,
        parseInt(totalShares) || 0,
        parseInt(shareCount) || 0,
        timestamp,
        new Date().toLocaleDateString()
      ];
      
      sharesSheet.appendRow(newRow);
      
      console.log('Referral share tracked:', { referrerEmail, platform, coinsEarned });
      return { 
        success: true, 
        message: 'Referral share tracked successfully',
        data: newRow
      };
      
    } catch (error) {
      console.error('Error tracking referral share:', error);
      return { success: false, message: 'Error tracking referral share: ' + error.toString() };
    }
  }

  // Function to check if this specific referral click has already been processed
  function hasReferralBeenProcessed(referrerEmail, referredEmail) {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let clicksSheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
      
      // Create sheet if it doesn't exist
      if (!clicksSheet) {
        clicksSheet = spreadsheet.insertSheet(REFERRAL_CLICKS_SHEET_NAME);
        clicksSheet.getRange(1, 1, 1, 4).setValues([
          ['Referrer Email', 'Referred Email', 'Timestamp', 'Coins Awarded']
        ]);
        clicksSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
        console.log('Created new referral clicks tracking sheet');
        return false;
      }
      
      const data = clicksSheet.getDataRange().getValues();
      
      // Check if this referrer-referred pair already exists
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === referrerEmail && data[i][1] === referredEmail) {
          console.log('Referral already processed:', { referrerEmail, referredEmail });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking referral status:', error);
      return false; // If error, allow the referral to proceed
    }
  }

  // Function to record a processed referral click
  function recordReferralClick(referrerEmail, referredEmail, coinsAwarded) {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let clicksSheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
      
      if (!clicksSheet) {
        clicksSheet = spreadsheet.insertSheet(REFERRAL_CLICKS_SHEET_NAME);
        clicksSheet.getRange(1, 1, 1, 4).setValues([
          ['Referrer Email', 'Referred Email', 'Timestamp', 'Coins Awarded']
        ]);
        clicksSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      }
      
      const timestamp = new Date();
      clicksSheet.appendRow([referrerEmail, referredEmail, timestamp, coinsAwarded]);
      console.log('Recorded referral click:', { referrerEmail, referredEmail, coinsAwarded });
    } catch (error) {
      console.error('Error recording referral click:', error);
    }
  }

  // Function to process referral tracking data
  function processReferralTracking(data) {
    try {
      Logger.log('processReferralTracking called');
      Logger.log('Data parameter: ' + JSON.stringify(data));
      Logger.log('Data type: ' + typeof data);
      
      // ✅ FIX: Validate data exists first
      if (!data || typeof data !== 'object') {
        Logger.log('ERROR: Data is null, undefined, or not an object');
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Invalid or missing data parameter',
            received: data
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      Logger.log('Data keys: ' + Object.keys(data).join(', '));
      
      // Validate required fields for referral tracking
      if (!data.referrerName || !data.referrerEmail || !data.platform) {
        Logger.log('ERROR: Missing required fields');
        Logger.log('referrerName: ' + data.referrerName);
        Logger.log('referrerEmail: ' + data.referrerEmail);
        Logger.log('platform: ' + data.platform);
        
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Missing required fields for referral tracking',
            received: {
              referrerName: data.referrerName || 'missing',
              referrerEmail: data.referrerEmail || 'missing',
              platform: data.platform || 'missing'
            }
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // If this is a referral click (someone visiting via referral link), check if already processed
      if (data.referredEmail && data.referredEmail !== '' && data.referredEmail !== 'unknown') {
        console.log('Checking if referral already processed for:', {
          referrer: data.referrerEmail,
          referred: data.referredEmail
        });
        
        if (hasReferralBeenProcessed(data.referrerEmail, data.referredEmail)) {
          console.log('Referral already processed, skipping coin award');
          return ContentService
            .createTextOutput(JSON.stringify({
              success: true,
              message: 'Referral already processed',
              alreadyProcessed: true,
              timestamp: new Date().toISOString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      // Open the Google Sheet
      let spreadsheet, sheet;
      try {
        spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
        
        // Create sheet if it doesn't exist
        if (!sheet) {
          sheet = spreadsheet.insertSheet(REFERRAL_SHEET_NAME);
          console.log('Created new referral tracking sheet:', REFERRAL_SHEET_NAME);
        }
      } catch (error) {
        console.error('Error accessing Google Sheet for referral tracking:', error);
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'Failed to access Google Sheet',
            details: error.toString()
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Create headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, 10).setValues([
          ['Referrer Name', 'Referrer Email', 'Referrer Phone', 'Referrer Role', 'Share Count', 'Akshar coins', 'Time stamp', 'Referral Code', 'Platforms Shared', 'Registered Count']
        ]);
        sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
        sheet.getRange(1, 1, 1, 10).setBackground('#4285f4');
        sheet.getRange(1, 1, 1, 10).setFontColor('#ffffff');
        console.log('Added headers to referral tracking sheet');
      }
      
      console.log('Referral tracking sheet has', sheet.getLastRow(), 'rows');
      
      // Get existing data
      const existingRows = sheet.getDataRange().getValues();
      let userRowIndex = -1;
      let currentReferralCount = 0;
      let currentTotalCoins = 0;
      let platformsShared = []; // Array to track all platforms shared
      let platformShareCounts = {}; // Object to track share count per platform
      
      // Find existing user record (case-insensitive, trimmed)
      const searchEmail = (data.referrerEmail || '').toString().toLowerCase().trim();
      console.log('Looking for existing user with email:', searchEmail);
      
      for (let i = 1; i < existingRows.length; i++) {
        const rowEmail = (existingRows[i][1] || '').toString().toLowerCase().trim();
        console.log('Checking row', i, 'email:', rowEmail);
        
        if (rowEmail === searchEmail) { // Email is in column 2 (index 1)
          userRowIndex = i + 1; // +1 because sheet rows are 1-indexed
          
          // Column 4 (index 4) is now "Share Count" (total shares)
          const currentShareCount = parseInt(existingRows[i][4]) || 0;
          currentTotalCoins = parseInt(existingRows[i][5]) || 0; // Akshar coins column (index 5)
          
          // Parse existing platforms shared (column 9, index 8)
          const existingPlatforms = (existingRows[i][8] || '').toString().trim();
          if (existingPlatforms) {
            platformsShared = existingPlatforms.split(',').map(p => p.trim());
          }
          
          // Column 10 (index 9) is now "Registered Count" (how many registered via link)
          currentReferralCount = parseInt(existingRows[i][9]) || 0;
          
          console.log('Found existing user at row', userRowIndex, 'with', currentShareCount, 'total shares,', currentTotalCoins, 'coins, and platforms:', platformsShared);
          break;
        }
      }
      
      if (userRowIndex === -1) {
        console.log('No existing user found, will create new record');
      }
      
      // Calculate coins based on action type
      let coinsToAward = 0;
      let shouldIncrementReferralCount = false;
      let actionType = '';
      let isNewPlatform = false;
      
      // Scenario 1: User is sharing the referral link (no referredEmail)
      // ✅ AWARD 3 COINS FOR EVERY SHARE (UNLIMITED!)
      if (!data.referredEmail || data.referredEmail === '' || data.referredEmail === 'unknown') {
        const currentPlatform = data.platform || 'unknown';
        
        // ✅ DUPLICATE PREVENTION: Check if this exact share was just processed (within 10 seconds)
        const now = new Date().getTime();
        const shareTimestamp = data.timestamp ? new Date(data.timestamp).getTime() : now;
        const shareId = data.shareId || '';
        
        // Store last processed share in script properties (temporary cache)
        const scriptProperties = PropertiesService.getScriptProperties();
        const lastShareKey = 'lastShare_' + data.referrerEmail + '_' + currentPlatform;
        const lastShareData = scriptProperties.getProperty(lastShareKey);
        
        if (lastShareData) {
          const lastShare = JSON.parse(lastShareData);
          const timeDiff = now - lastShare.timestamp;
          
          // If same user, same platform, within 10 seconds → DUPLICATE!
          if (timeDiff < 10000 && lastShare.shareId === shareId) {
            Logger.log('⚠️ DUPLICATE detected - Same share processed within 10 seconds');
            return ContentService
              .createTextOutput(JSON.stringify({
                success: true,
                message: 'Duplicate share prevented',
                duplicate: true,
                timestamp: new Date().toISOString()
              }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        // Store this share as the last processed
        scriptProperties.setProperty(lastShareKey, JSON.stringify({
          timestamp: now,
          shareId: shareId
        }));
        // Note: Script properties will auto-expire via timestamp check above (10 seconds)
        
        // ✅ AWARD COINS (No restrictions!)
        coinsToAward = getCoinsForSharing(currentPlatform);
        shouldIncrementReferralCount = false;
        actionType = 'share';
        
        // Update platform list if new
        if (!platformsShared.includes(currentPlatform)) {
          platformsShared.push(currentPlatform);
          platformShareCounts[currentPlatform] = 0;
        }
        
        // ✅ INCREMENT share count for this platform (unlimited!)
        platformShareCounts[currentPlatform] = (platformShareCounts[currentPlatform] || 0) + 1;
        
        Logger.log('✅ Share on ' + currentPlatform + ' - Awarding ' + coinsToAward + ' coins (Total on this platform: ' + platformShareCounts[currentPlatform] + ')');
      }
      // Scenario 2: Someone registered via their referral link (has referredEmail)
      // Award 1 additional coin and increment referral count
      else {
        coinsToAward = getCoinsForRegistration();
        shouldIncrementReferralCount = true;
        actionType = 'registration';
        
        // Record this referral click to prevent duplicates
        recordReferralClick(data.referrerEmail, data.referredEmail, coinsToAward);
        console.log('Awarding coins for REGISTRATION:', coinsToAward);
      }
      
      // ✅ Calculate total share count from platformShareCounts
      let totalShareCount = 0;
      for (let platform in platformShareCounts) {
        totalShareCount += platformShareCounts[platform] || 0;
      }
      
      const newReferralCount = shouldIncrementReferralCount ? currentReferralCount + 1 : currentReferralCount;
      const newTotalCoins = currentTotalCoins + coinsToAward;
      const timestamp = new Date();
      
      console.log('Coins calculation:', {
        actionType: actionType,
        platform: data.platform,
        coinsToAward: coinsToAward,
        totalShareCount: totalShareCount,
        shouldIncrementCount: shouldIncrementReferralCount,
        referredEmail: data.referredEmail || 'none',
        currentReferralCount: currentReferralCount,
        newReferralCount: newReferralCount,
        currentTotalCoins: currentTotalCoins,
        newTotalCoins: newTotalCoins,
        platformShareCounts: platformShareCounts
      });
      
      // Prepare platforms data for storage
      const platformsString = platformsShared.join(', ');
      
      if (userRowIndex > 0) {
        // ✅ UPDATE existing user record (overwrite the same row)
        const updateData = [
          data.referrerName,
          data.referrerEmail,
          data.referrerPhone || '',
          data.referrerRole || 'unknown',
          totalShareCount,  // Column E: Total Share Count (1, 2, 3...)
          newTotalCoins,    // Column F: Akshar coins
          timestamp,        // Column G: Last activity timestamp
          data.referralCode || 'AKSHAR2025',  // Column H: Referral Code
          platformsString,  // Column I: All platforms shared (comma-separated)
          newReferralCount  // Column J: Registered Count (how many registered via link)
        ];
        console.log('✅ UPDATING existing user record with data:', updateData);
        sheet.getRange(userRowIndex, 1, 1, 10).setValues([updateData]);
        console.log(`✅ Updated row ${userRowIndex} for ${data.referrerEmail}`);
      } else {
        // ✅ CREATE new user record
        const newData = [
          data.referrerName,
          data.referrerEmail,
          data.referrerPhone || '',
          data.referrerRole || 'unknown',
          totalShareCount,  // Column E: Total Share Count (starts at 1)
          newTotalCoins,    // Column F: Akshar coins
          timestamp,        // Column G: Timestamp
          data.referralCode || 'AKSHAR2025',  // Column H: Referral Code
          platformsString,  // Column I: All platforms shared (comma-separated)
          newReferralCount  // Column J: Registered Count (starts at 0)
        ];
        console.log('✅ CREATING new user record with data:', newData);
        sheet.appendRow(newData);
        console.log(`✅ Created new row for ${data.referrerEmail}`);
      }
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, 10);
      
      // Return success response
      let message = '';
      if (actionType === 'share') {
        message = `Referral shared via ${data.platform}! You earned ${coinsToAward} coins. Share unlimited times to earn more!`;
      } else if (actionType === 'registration') {
        message = `Someone registered via your referral! You earned ${coinsToAward} bonus coin.`;
      } else {
        message = 'Referral tracking updated successfully';
      }
      
      const response = {
        success: true,
        message: message,
        actionType: actionType,
        timestamp: timestamp.toISOString(),
        coinsEarned: coinsToAward,
        totalCoins: newTotalCoins,
        referralCount: newReferralCount,
        platformsShared: platformsShared,
        platformShareCounts: platformShareCounts,
        sheetName: REFERRAL_SHEET_NAME
      };
      
      console.log('Referral tracking result:', response);
      
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error processing referral tracking:', error);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to save referral tracking',
          details: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  function doGet(e) {
    try {
      Logger.log('doGet called with: ' + JSON.stringify(e));
      Logger.log('doGet has parameters: ' + (e && e.parameters ? 'yes' : 'no'));
      
      // Handle case where e is undefined
      if (!e || !e.parameters) {
        return createCORSResponse({
          message: 'AksharJobs Expo Registration & Referral API is running',
          timestamp: new Date().toISOString(),
          received_parameters: {}
        });
      }
      
      Logger.log('Parameters: ' + JSON.stringify(e.parameters));
      
      // Helper function to get parameter value (handles both string and array)
      function getParam(key) {
        if (!e.parameters || !e.parameters[key]) return null;
        return Array.isArray(e.parameters[key]) ? e.parameters[key][0] : e.parameters[key];
      }
      
      // Check if this is a referral tracking request
      const requestType = getParam('type');
      const requestAction = getParam('action');
      const referrerEmail = getParam('referrerEmail');
      
      Logger.log('Request type: ' + requestType);
      Logger.log('Request action: ' + requestAction);
      Logger.log('Referrer email: ' + referrerEmail);
      Logger.log('All parameters: ' + JSON.stringify(e.parameters));
      
      // ✅ FIXED: Check for type='share' OR action='referral_share' OR has referrerEmail
      if (referrerEmail && (requestType === 'share' || requestType === 'referral' || requestType === 'referral_share' || requestAction === 'referral_share')) {
        // This is a referral tracking request via GET
        // ✅ FIX: Properly extract all parameters
        const data = {};
        Object.keys(e.parameters).forEach(key => {
          data[key] = getParam(key);  // Use getParam to handle arrays
        });
        
        Logger.log('✅ Parsed referral tracking data: ' + JSON.stringify(data));
        
        // ✅ Validate data before processing
        if (!data || typeof data !== 'object') {
          Logger.log('ERROR: Invalid data object');
          return ContentService
            .createTextOutput(JSON.stringify({
              error: 'Invalid data object',
              received: e.parameters
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
        // Process the referral tracking
        return processReferralTracking(data);
      } else if (e.parameters && getParam('action') === 'get_referrals') {
        // This is a request to get referral data
        const email = getParam('email');
        console.log('Getting referral data for email:', email);
        
        const result = getReferralData(email);
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (e.parameters && getParam('action') === 'get_referral_clicks') {
        // This is a request to get referral clicks (who registered via user's link)
        const referrerEmail = getParam('referrer');
        console.log('Getting referral clicks for referrer:', referrerEmail);
        
        const result = getReferralClicks(referrerEmail);
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (e.parameters && getParam('action') === 'get_live_count') {
        // This is a request to get live visitor count
        console.log('Getting live visitor count');
        Logger.log('✅ Live count request detected');
        
        const result = getLiveVisitorCount();
        Logger.log('Live count result: ' + JSON.stringify(result));
        
        return ContentService
          .createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (e.parameters && getParam('type') === 'check_registration' && e.parameters.email) {
        // This is a registration check request via GET
        const email = getParam('email');
        console.log('Checking registration for email:', email);
        
        const result = checkUserRegistration(email);
        return createCORSResponse(result);
      } else if (e.parameters && getParam('type') === 'update_login' && e.parameters.email) {
        // This is a login update request via GET
        const email = getParam('email');
        const timestamp = getParam('timestamp');
        console.log('Updating login timestamp for email:', email);
        
        const result = updateUserLoginTimestamp(email, timestamp);
        return createCORSResponse(result);
      } else if (e.parameters && (getParam('type') === 'referral_share' || getParam('type') === 'share') && e.parameters.referrerEmail) {
        // This is a referral share tracking request via GET
        const referrerEmail = getParam('referrerEmail');
        const referrerName = getParam('referrerName');
        const platform = getParam('platform');
        const coinsEarned = getParam('coinsEarned');
        const totalShares = getParam('totalShares');
        const shareCount = getParam('shareCount') || getParam('platformShareCount');
        const timestamp = getParam('timestamp');
        console.log('Tracking referral share:', { referrerEmail, platform, coinsEarned, type: getParam('type') });
        
        const result = trackReferralShare(referrerEmail, referrerName, platform, coinsEarned, totalShares, shareCount, timestamp);
        return createCORSResponse(result);
      } else if (e.parameters && (getParam('name') || getParam('fullName')) && e.parameters.email && e.parameters.phone && (e.parameters.role || e.parameters.roles)) {
        // This is a registration request via GET (supports both 'role' and 'roles')
        const data = {};
        Object.keys(e.parameters).forEach(key => {
          if (Array.isArray(e.parameters[key]) && e.parameters[key].length === 1) {
            data[key] = e.parameters[key][0];
          } else {
            data[key] = e.parameters[key];
          }
        });
        
        console.log('Received registration data via GET:', data);
        console.log('Data type:', typeof data);
        console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
        console.log('Roles field:', data.roles || data.role);
        
        // Validate data before processing
        if (!data || Object.keys(data).length === 0) {
          console.error('No data received for processing via GET');
          return ContentService
            .createTextOutput(JSON.stringify({
              error: 'No data received via GET',
              received: e.parameters
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
        // Process the registration
        return processRegistration(data);
      } else {
        // This is just a test request
        return ContentService
          .createTextOutput(JSON.stringify({
            message: 'AksharJobs Expo Registration & Referral API is running',
            timestamp: new Date().toISOString(),
            received_parameters: e.parameters || 'none'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      console.error('Error in doGet:', error);
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to process request',
          details: error.toString(),
          parameters_received: e.parameters || 'none'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Test function to verify setup
  function testSetup() {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      console.log('✅ Google Sheet access successful');
      console.log('Sheet URL:', `https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
      
      // Check if the registration sheet exists, create if not
      let regSheet = spreadsheet.getSheetByName(REGISTRATION_SHEET_NAME);
      if (!regSheet) {
        regSheet = spreadsheet.insertSheet(REGISTRATION_SHEET_NAME);
        console.log('✅ Created new registration sheet:', REGISTRATION_SHEET_NAME);
      } else {
        console.log('✅ Registration sheet exists:', REGISTRATION_SHEET_NAME);
      }
      
      // Check if the referral tracking sheet exists, create if not
      let refSheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      if (!refSheet) {
        refSheet = spreadsheet.insertSheet(REFERRAL_SHEET_NAME);
        console.log('✅ Created new referral tracking sheet:', REFERRAL_SHEET_NAME);
      } else {
        console.log('✅ Referral tracking sheet exists:', REFERRAL_SHEET_NAME);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Google Sheet setup error:', error);
      return false;
    }
  }

  // Test function to simulate a registration
  function testRegistration() {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      role: 'job_seeker'
    };
    
    console.log('Testing registration with data:', testData);
    const result = processRegistration(testData);
    console.log('Registration result:', result.getContent());
    return result;
  }

  // Test function to simulate referral tracking
  function testReferralTracking() {
    const testData = {
      type: 'referral',
      referrerName: 'Test Referrer',
      referrerEmail: 'referrer@example.com',
      referrerPhone: '1234567890',
      referrerRole: 'job_seeker',
      platform: 'whatsapp',
      referralCode: 'AKSHAR2025'
    };
    
    console.log('Testing referral tracking with data:', testData);
    console.log('Coins that would be earned for sharing:', getCoinsForSharing(testData.platform));
    const result = processReferralTracking(testData);
    console.log('Referral tracking result:', result.getContent());
    return result;
  }

  // Test function to simulate referral tracking from website
  function testReferralTrackingFromWebsite() {
    const testData = {
      type: 'referral',
      referrerName: 'Test User',
      referrerEmail: 'testv2@example.com',
      referrerPhone: '9876543210',
      referrerRole: 'job_seeker',
      platform: 'whatsapp',
      coinsEarned: 5,
      totalCoins: 5,
      referralCode: 'AKSHAR2025',
      shareCount: 1,
      source: 'test'
    };
    
    console.log('Testing referral tracking from website with data:', testData);
    const result = processReferralTracking(testData);
    console.log('Referral tracking result:', result.getContent());
    return result;
  }

  // Test function to debug registration processing
  function testRegistrationProcessing() {
    console.log('testRegistrationProcessing function called');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      role: 'job_seeker'
    };
    
    console.log('Testing registration processing with data:', testData);
    console.log('Test data type:', typeof testData);
    console.log('Test data keys:', Object.keys(testData));
    
    try {
      const result = processRegistration(testData);
      console.log('Registration result:', result.getContent());
      return result;
    } catch (error) {
      console.error('Error in testRegistrationProcessing:', error);
      return null;
    }
  }

  // Simple test function to debug processRegistration directly
  function testProcessRegistrationDirect() {
    console.log('testProcessRegistrationDirect function called');
    
    // Create test data directly
    const testData = {
      name: 'Direct Test User',
      email: 'direct@example.com',
      phone: '9876543210',
      role: 'recruiter'
    };
    
    console.log('About to call processRegistration with:', testData);
    console.log('Data is valid:', testData && typeof testData === 'object');
    console.log('Data has required fields:', testData.name && testData.email && testData.phone && testData.role);
    
    // Call processRegistration directly
    return processRegistration(testData);
  }

  // Function to clean up and convert existing referral tracking data
  function cleanupReferralTrackingSheet() {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      
      if (!sheet) {
        console.log('Referral tracking sheet not found');
        return;
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        console.log('No data to clean up');
        return;
      }
      
      // Create a new sheet for cleaned data
      const newSheetName = REFERRAL_SHEET_NAME + '_Cleaned';
      let newSheet = spreadsheet.getSheetByName(newSheetName);
      if (newSheet) {
        spreadsheet.deleteSheet(newSheet);
      }
      newSheet = spreadsheet.insertSheet(newSheetName);
      
      // Set headers
      newSheet.getRange(1, 1, 1, 9).setValues([
        ['Referrer Name', 'Referrer Email', 'Referrer Phone', 'Referrer Role', 'Referrer Count', 'Akshar coins', 'Time stamp', 'Referral Code', 'Platform']
      ]);
      newSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      
      // Process existing data and consolidate by user
      const userMap = new Map();
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const email = row[2]; // Email column
        
        if (!email) continue;
        
        if (userMap.has(email)) {
          // Update existing user
          const user = userMap.get(email);
          user.totalReferrals++;
          if (row[8]) { // Coins Earned column
            user.totalCoins += parseInt(row[8]) || 0;
          }
          if (row[0] > user.lastUpdated) { // Timestamp column
            user.lastUpdated = row[0];
          }
        } else {
          // Create new user entry
          userMap.set(email, {
            name: row[1],
            email: row[2],
            phone: row[3],
            role: row[4],
            totalReferrals: 1,
            totalCoins: parseInt(row[8]) || 0,
            lastUpdated: row[0],
            referralCode: row[7] || 'AKSHAR2025',
            platform: row[5] || ''
          });
        }
      }
      
      // Write consolidated data to new sheet
      const consolidatedData = Array.from(userMap.values()).map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.totalReferrals,
        user.totalCoins,
        user.lastUpdated,
        user.referralCode,
        user.platform
      ]);
      
      if (consolidatedData.length > 0) {
        newSheet.getRange(2, 1, consolidatedData.length, 9).setValues(consolidatedData);
      }
      
      newSheet.autoResizeColumns(1, 9);
      
      console.log(`Cleaned up referral data: ${data.length - 1} rows consolidated into ${consolidatedData.length} unique users`);
      console.log(`New sheet created: ${newSheetName}`);
      
      return {
        success: true,
        originalRows: data.length - 1,
        consolidatedUsers: consolidatedData.length,
        newSheetName: newSheetName
      };
      
    } catch (error) {
      console.error('Error cleaning up referral tracking sheet:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  // Test function to simulate a POST request
  function testPostRequest() {
    // Simulate different types of POST requests
    const testCases = [
      {
        name: 'JSON POST request',
        event: {
          postData: {
            type: 'application/json',
            contents: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              phone: '1234567890',
              role: 'job_seeker'
            })
          }
        }
      },
      {
        name: 'Form data POST request',
        event: {
          postData: {
            type: 'application/x-www-form-urlencoded',
            contents: 'name=Test%20User&email=test%40example.com&phone=1234567890&role=job_seeker'
          }
        }
      },
      {
        name: 'Parameters only request',
        event: {
          parameters: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            role: 'job_seeker'
          }
        }
      }
    ];
    
    testCases.forEach(testCase => {
      console.log(`\n=== Testing ${testCase.name} ===`);
      try {
        const result = doPost(testCase.event);
        console.log('Result:', result.getContent());
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  // Process referral registration (when someone registers via referral link)
  function processReferralRegistration(data) {
    try {
      console.log('processReferralRegistration called with data:', data);
      
      const timestamp = new Date();
      
      // Get the referral tracking sheet
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
      if (!sheet) {
        throw new Error(`Sheet ${REFERRAL_SHEET_NAME} not found`);
      }
      
      // Add referral registration record
      const newRow = [
        data.referrerEmail || '',
        data.receiverName || '',
        data.receiverEmail || '',
        data.receiverPhone || '',
        data.receiverRole || '',
        'referral_registration',
        data.referrerCoinsEarned || 3,
        data.receiverCoinsEarned || 3,
        timestamp,
        data.referralCode || 'AKSHAR2025',
        data.source || 'registration'
      ];
      
      sheet.appendRow(newRow);
      
      // Update referrer's coins
      updateReferrerCoins(data.referrerEmail, data.referrerCoinsEarned || 3);
      
      // Update receiver's coins (if they have a record)
      updateReceiverCoins(data.receiverEmail, data.receiverCoinsEarned || 3);
      
      const response = {
        success: true,
        message: 'Referral registration processed successfully',
        timestamp: timestamp.toISOString(),
        referrerCoinsEarned: data.referrerCoinsEarned || 3,
        receiverCoinsEarned: data.receiverCoinsEarned || 3
      };
      
      console.log('Referral registration result:', response);
      
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error in processReferralRegistration:', error);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: error.toString(),
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Process referrer coins update
  function processReferrerCoins(data) {
    try {
      console.log('processReferrerCoins called with data:', data);
      
      // Update referrer's coins
      updateReferrerCoins(data.referrerEmail, data.coinsEarned || 3);
      
      const response = {
        success: true,
        message: 'Referrer coins updated successfully',
        timestamp: new Date().toISOString(),
        coinsEarned: data.coinsEarned || 3
      };
      
      console.log('Referrer coins result:', response);
      
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error in processReferrerCoins:', error);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: error.toString(),
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Update referrer's coins in the referral tracking sheet
  function updateReferrerCoins(referrerEmail, coinsToAdd) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
      if (!sheet) {
        console.error('Referral tracking sheet not found');
        return;
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Find the referrer's record
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[1] === referrerEmail) { // Email is in column B
          const currentCoins = row[5] || 0; // Total coins in column F
          const newTotalCoins = currentCoins + coinsToAdd;
          
          // Update the total coins
          sheet.getRange(i + 1, 6).setValue(newTotalCoins);
          
          console.log(`Updated referrer ${referrerEmail} coins: ${currentCoins} + ${coinsToAdd} = ${newTotalCoins}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error updating referrer coins:', error);
    }
  }

  // Update receiver's coins in the referral tracking sheet
  function updateReceiverCoins(receiverEmail, coinsToAdd) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
      if (!sheet) {
        console.error('Referral tracking sheet not found');
        return;
      }
      
      // Add a new record for the receiver
      const timestamp = new Date();
      const newRow = [
        receiverEmail, // Referrer email (same as receiver for self-referral)
        '', // Referrer name
        receiverEmail, // Receiver email
        '', // Receiver phone
        '', // Receiver role
        'receiver_coins',
        coinsToAdd, // Coins earned
        coinsToAdd, // Total coins
        timestamp,
        'AKSHAR2025',
        'referral_registration'
      ];
      
      sheet.appendRow(newRow);
      
      console.log(`Added ${coinsToAdd} coins for receiver ${receiverEmail}`);
    } catch (error) {
      console.error('Error updating receiver coins:', error);
    }
  }

  // Get referral data from the referral tracking sheet
  function getReferralData(email) {
    try {
      console.log('getReferralData called for email:', email);
      
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      
      if (!sheet) {
        console.log('Referral tracking sheet not found');
        return {
          success: false,
          error: 'Referral tracking sheet not found'
        };
      }
      
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        console.log('No referral data found');
        return {
          success: true,
          message: 'No referral data found',
          records: []
        };
      }
      
      // Get headers
      const headers = data[0];
      console.log('Headers:', headers);
      
      // Filter records by email if provided, otherwise return all
      const records = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // If email is provided, filter by email
        if (email && email !== 'anonymous@example.com') {
          // Check if email matches in any of the email columns (index 1 is Referrer Email)
          if (row[1] && row[1].toString().toLowerCase() === email.toLowerCase()) {
            // Parse platform share counts if available
            let platformCounts = {};
            try {
              if (row[9]) {
                platformCounts = JSON.parse(row[9]);
              }
            } catch (e) {
              console.log('Could not parse platform counts for record');
            }
            
            records.push({
              name: row[0] || '',
              email: row[1] || '',
              phone: row[2] || '',
              role: row[3] || '',
              referralCount: row[4] || 0,
              totalCoins: row[5] || 0,
              timestamp: row[6] || '',
              referralCode: row[7] || '',
              platformsShared: row[8] || '',  // Comma-separated list of platforms
              platformShareCounts: platformCounts  // Object with counts per platform
            });
          }
        } else {
          // Return all records (limited to last 50 for performance)
          if (records.length < 50) {
            // Parse platform share counts if available
            let platformCounts = {};
            try {
              if (row[9]) {
                platformCounts = JSON.parse(row[9]);
              }
            } catch (e) {
              console.log('Could not parse platform counts for record');
            }
            
            records.push({
              name: row[0] || '',
              email: row[1] || '',
              phone: row[2] || '',
              role: row[3] || '',
              referralCount: row[4] || 0,
              totalCoins: row[5] || 0,
              timestamp: row[6] || '',
              referralCode: row[7] || '',
              platformsShared: row[8] || '',  // Comma-separated list of platforms
              platformShareCounts: platformCounts  // Object with counts per platform
            });
          }
        }
      }
      
      console.log(`Found ${records.length} referral records`);
      
      return {
        success: true,
        message: `Found ${records.length} referral record(s)`,
        records: records,
        totalRecords: data.length - 1,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}`
      };
      
    } catch (error) {
      console.error('Error getting referral data:', error);
      return {
        success: false,
        error: error.toString(),
        details: 'Failed to retrieve referral data from Google Sheets'
      };
    }
  }

  // Test function to get referral data
  function testGetReferralData() {
    const result = getReferralData(null);
    console.log('Test result:', JSON.stringify(result, null, 2));
    return result;
  }

  // Get referral clicks from the Referral_Clicks sheet
  function getReferralClicks(referrerEmail) {
    try {
      console.log('getReferralClicks called for referrer:', referrerEmail);
      
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
      
      if (!sheet) {
        console.log('Referral clicks sheet not found');
        return {
          success: true,
          message: 'No referral clicks sheet found',
          clicks: []
        };
      }
      
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        console.log('No referral clicks found');
        return {
          success: true,
          message: 'No referral clicks yet',
          clicks: []
        };
      }
      
      // Filter clicks for this referrer
      const clicks = [];
      const searchEmail = (referrerEmail || '').toString().toLowerCase().trim();
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowReferrerEmail = (row[0] || '').toString().toLowerCase().trim();
        
        // Check if this click belongs to the referrer
        if (rowReferrerEmail === searchEmail) {
          clicks.push({
            referrerEmail: row[0] || '',
            referredEmail: row[1] || '',
            referredName: row[1] ? row[1].split('@')[0] : 'User', // Use email prefix as name
            timestamp: row[2] || '',
            coinsAwarded: row[3] || 1
          });
        }
      }
      
      console.log(`Found ${clicks.length} referral clicks for ${referrerEmail}`);
      
      return {
        success: true,
        message: `Found ${clicks.length} referral click(s)`,
        clicks: clicks,
        totalClicks: clicks.length
      };
      
    } catch (error) {
      console.error('Error getting referral clicks:', error);
      return {
        success: false,
        error: error.toString(),
        clicks: []
      };
    }
  }

  // Function to clean up duplicate user rows and merge them
  function cleanupDuplicateUsers() {
    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      
      if (!sheet) {
        console.log('Referral tracking sheet not found');
        return { success: false, message: 'Sheet not found' };
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        console.log('No data to clean up');
        return { success: true, message: 'No duplicates found' };
      }
      
      // Create a map to merge duplicate users
      const userMap = new Map();
      
      // Process all rows (skip header at index 0)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const email = (row[1] || '').toString().toLowerCase().trim(); // Column B (index 1)
        
        if (!email) continue;
        
        if (userMap.has(email)) {
          // Merge with existing entry
          const user = userMap.get(email);
          user.totalCoins += parseInt(row[5]) || 0; // Add coins from this row
          user.referralCount = Math.max(user.referralCount, parseInt(row[4]) || 0); // Use highest count
          if (row[6] > user.lastUpdated) { // Check timestamp (Column G, index 6)
            user.lastUpdated = row[6];
          }
        } else {
          // Create new entry
          userMap.set(email, {
            name: row[0] || '',
            email: email,
            phone: row[2] || '',
            role: row[3] || '',
            referralCount: parseInt(row[4]) || 0,
            totalCoins: parseInt(row[5]) || 0,
            lastUpdated: row[6] || new Date(),
            referralCode: row[7] || 'AKSHAR2025',
            platform: row[8] || ''
          });
        }
      }
      
      // Clear all data except headers
      if (data.length > 1) {
        sheet.deleteRows(2, data.length - 1);
      }
      
      // Write merged data back
      const mergedData = Array.from(userMap.values()).map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.referralCount,
        user.totalCoins,
        user.lastUpdated,
        user.referralCode,
        user.platform
      ]);
      
      if (mergedData.length > 0) {
        sheet.getRange(2, 1, mergedData.length, 9).setValues(mergedData);
      }
      
      console.log(`Cleaned up: ${data.length - 1} rows merged into ${mergedData.length} unique users`);
      
      return {
        success: true,
        message: `Merged ${data.length - 1} rows into ${mergedData.length} unique users`,
        originalRows: data.length - 1,
        mergedUsers: mergedData.length
      };
      
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  // ========================================
  // LIVE VISITOR TRACKING FUNCTIONS
  // ========================================

  // Process visitor tracking data
  function processVisitorTracking(data) {
    try {
      console.log('processVisitorTracking called with data:', data);
      
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      let sheet = spreadsheet.getSheetByName(LIVE_VISITOR_SHEET_NAME);
      
      // Create sheet if it doesn't exist
      if (!sheet) {
        sheet = spreadsheet.insertSheet(LIVE_VISITOR_SHEET_NAME);
        console.log('Created new live visitor tracking sheet:', LIVE_VISITOR_SHEET_NAME);
      }
      
      // Create headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, 15).setValues([
          ['Timestamp', 'Visitor ID', 'Session ID', 'Action', 'Is New Visitor', 'User Agent', 'Language', 'Screen Resolution', 'Timezone', 'Referrer', 'URL', 'Page Title', 'Additional Data', 'Load Time', 'Connection Type']
        ]);
        sheet.getRange(1, 1, 1, 15).setFontWeight('bold');
        sheet.getRange(1, 1, 1, 15).setBackground('#4285f4');
        sheet.getRange(1, 1, 1, 15).setFontColor('#ffffff');
        console.log('Added headers to live visitor tracking sheet');
      }
      
      // Prepare additional data based on action type
      let additionalData = {};
      
      switch(data.action) {
        case 'link_click':
          additionalData = {
            linkUrl: data.linkUrl,
            linkText: data.linkText,
            linkTarget: data.linkTarget,
            isExternal: data.isExternal
          };
          break;
        case 'form_submission':
          additionalData = {
            formAction: data.formAction,
            formMethod: data.formMethod,
            formId: data.formId,
            formClass: data.formClass
          };
          break;
        case 'scroll_depth':
          additionalData = {
            scrollPercent: data.scrollPercent
          };
          break;
        case 'time_on_page':
        case 'page_exit':
          additionalData = {
            timeSpent: data.timeSpent
          };
          break;
        case 'navigation_event':
          additionalData = {
            eventType: data.eventType
          };
          break;
        case 'page_focus':
        case 'page_blur':
          additionalData = {
            hasFocus: data.hasFocus
          };
          break;
        case 'page_load':
          additionalData = {
            loadTime: data.loadTime,
            connectionType: data.connectionType
          };
          break;
      }
      
      // Prepare row data
      const timestamp = new Date();
      const newRow = [
        timestamp,
        data.visitorId || '',
        data.sessionId || '',
        data.action || 'track_visit',
        data.isNewVisitor || false,
        data.userAgent || '',
        data.language || '',
        data.screenResolution || '',
        data.timezone || '',
        data.referrer || '',
        data.url || '',
        data.pageTitle || '',
        JSON.stringify(additionalData),
        data.loadTime || '',
        data.connectionType || ''
      ];
      
      // Add additional columns for specific actions
      if (data.action === 'update_session') {
        // Extend row for session updates
        newRow.push(data.duration || 0);
        if (sheet.getLastRow() === 0) {
          // Add header for duration column
          sheet.getRange(1, 13, 1, 1).setValues([['Duration (seconds)']]);
          sheet.getRange(1, 13, 1, 1).setFontWeight('bold');
        }
      } else if (data.action === 'track_interaction') {
        // Extend row for interactions
        newRow.push(data.interactionType || '');
        newRow.push(data.interactionCount || 0);
        if (sheet.getLastRow() === 0) {
          // Add headers for interaction columns
          sheet.getRange(1, 13, 1, 2).setValues([['Interaction Type', 'Interaction Count']]);
          sheet.getRange(1, 13, 1, 2).setFontWeight('bold');
        }
      }
      
      sheet.appendRow(newRow);
      sheet.autoResizeColumns(1, newRow.length);
      
      console.log('✅ Live visitor tracking data saved successfully');
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Visitor tracking data saved successfully',
          timestamp: timestamp.toISOString(),
          action: data.action,
          visitorId: data.visitorId,
          sessionId: data.sessionId
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error processing visitor tracking:', error);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Failed to save visitor tracking data',
          details: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Get live visitor count
  function getLiveVisitorCount() {
    try {
      console.log('getLiveVisitorCount called');
      
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet = spreadsheet.getSheetByName(LIVE_VISITOR_SHEET_NAME);
      
      if (!sheet || sheet.getLastRow() === 0) {
        console.log('No visitor tracking data found');
        return {
          success: true,
          message: 'No visitor data yet',
          liveCount: 0,
          totalVisitors: 0,
          newVisitorsToday: 0
        };
      }
      
      const data = sheet.getDataRange().getValues();
      
      // Calculate live count (visitors active in last 2 minutes for accuracy)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      let liveCount = 0;
      let totalVisitors = 0;
      let newVisitorsToday = 0;
      
      const activeSessions = new Set();
      const allVisitors = new Set();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Process all rows (skip header at index 0)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const timestamp = row[0]; // Timestamp column
        const visitorId = row[1]; // Visitor ID column
        const sessionId = row[2]; // Session ID column
        const action = row[3]; // Action column
        const isNewVisitor = row[4]; // Is New Visitor column
        
        if (!timestamp || !visitorId) continue;
        
        // Add to total visitors set
        allVisitors.add(visitorId);
        
        // Check if visitor is new today
        if (isNewVisitor && new Date(timestamp) >= today) {
          newVisitorsToday++;
        }
        
        // Check if session is active (last activity within 2 minutes)
        if (new Date(timestamp) >= twoMinutesAgo) {
          activeSessions.add(sessionId);
        }
      }
      
      liveCount = activeSessions.size;
      totalVisitors = allVisitors.size;
      
      // Ensure minimum counts for display
      liveCount = Math.max(liveCount, 1); // At least 1 (current user)
      totalVisitors = Math.max(totalVisitors, 1);
      newVisitorsToday = Math.max(newVisitorsToday, 1);
      
      console.log(`✅ Centralized live visitor count: ${liveCount}, Total visitors: ${totalVisitors}, New today: ${newVisitorsToday}`);
      
      return {
        success: true,
        message: `Found ${liveCount} live visitors (centralized count)`,
        liveCount: liveCount,
        totalVisitors: totalVisitors,
        newVisitorsToday: newVisitorsToday,
        timestamp: new Date().toISOString(),
        isCentralized: true
      };
      
    } catch (error) {
      console.error('Error getting live visitor count:', error);
      return {
        success: false,
        error: error.toString(),
        liveCount: 0,
        totalVisitors: 0,
        newVisitorsToday: 0
      };
    }
  }

  // ========================================
  // TEST FUNCTIONS - Run these to verify everything works!
  // ========================================

  // Test live visitor tracking
  function testLiveVisitorTracking() {
    console.log('=== TESTING LIVE VISITOR TRACKING ===');
    
    const testData = {
      type: 'visitor_tracking',
      action: 'track_visit',
      visitorId: 'test_visitor_123',
      sessionId: 'test_session_456',
      isNewVisitor: true,
      timestamp: new Date().toISOString(),
      userAgent: 'Test Browser',
      language: 'en-US',
      screenResolution: '1920x1080',
      timezone: 'America/New_York',
      referrer: 'https://example.com',
      url: 'https://aksharjobs.com/expo',
      pageTitle: 'AksharJobs Expo 2025'
    };
    
    console.log('Testing visitor tracking with data:', testData);
    const result = processVisitorTracking(testData);
    console.log('Visitor tracking result:', result.getContent());
    
    // Test getting live count
    console.log('\n=== TESTING LIVE COUNT ===');
    const liveCountResult = getLiveVisitorCount();
    console.log('Live count result:', JSON.stringify(liveCountResult, null, 2));
    
    return 'Live visitor tracking test completed';
  }

  // Test the doGet function with live count request
  function testDoGetLiveCount() {
    console.log('=== TESTING DOGET LIVE COUNT ===');
    
    // Simulate a GET request for live count
    const testEvent = {
      parameters: {
        action: ['get_live_count']
      }
    };
    
    console.log('Testing doGet with live count request:', testEvent);
    const result = doGet(testEvent);
    console.log('doGet result:', result.getContent());
    
    return 'doGet live count test completed';
  }

  // Test referral clicks functionality
  function testReferralClicks() {
    console.log('=== TESTING REFERRAL CLICKS ===');
    
    // Test with a specific referrer email
    const testReferrerEmail = 'test@example.com';
    console.log('Testing referral clicks for referrer:', testReferrerEmail);
    
    const result = getReferralClicks(testReferrerEmail);
    console.log('Referral clicks result:', JSON.stringify(result, null, 2));
    
    // Test with undefined referrer (the original issue)
    console.log('\n=== TESTING WITH UNDEFINED REFERRER ===');
    const undefinedResult = getReferralClicks(undefined);
    console.log('Undefined referrer result:', JSON.stringify(undefinedResult, null, 2));
    
    return 'Referral clicks test completed';
  }

  function testReferralShareProcessing() {
    Logger.log('=== TESTING REFERRAL SHARE PROCESSING ===');
    
    // Simulate a GET request with all the parameters
    const testEvent = {
      parameter: {},
      parameters: {
        type: ['share'],
        action: ['referral_share'],
        referrerEmail: ['testdirect@example.com'],
        referrerName: ['Test Direct'],
        referrerPhone: ['1234567890'],
        referrerRole: ['job_seeker'],
        platform: ['whatsapp'],
        coinsEarned: ['3'],
        shareCoins: ['3'],
        referralBonusCoins: ['0'],
        totalCoins: ['3'],
        totalShares: ['1'],
        platformShareCount: ['1'],
        referralCount: ['0'],
        totalReferrals: ['0'],
        timestamp: ['2025-10-03T11:00:00.000Z'],
        referralCode: ['AKSHAR2025'],
        source: ['test'],
        shareId: ['testdirect123']
      }
    };
    
    Logger.log('Calling doGet with test parameters...');
    const result = doGet(testEvent);
    const content = result.getContent();
    Logger.log('Raw result: ' + content);
    
    try {
      const parsed = JSON.parse(content);
      Logger.log('Parsed result: ' + JSON.stringify(parsed, null, 2));
      
      if (parsed.success && parsed.actionType === 'share') {
        Logger.log('');
        Logger.log('✅✅✅ SUCCESS! Script is processing referral shares correctly! ✅✅✅');
        Logger.log('Coins Earned: ' + parsed.coinsEarned);
        Logger.log('Total Coins: ' + parsed.totalCoins);
        Logger.log('Platforms: ' + JSON.stringify(parsed.platformsShared));
        Logger.log('');
        Logger.log('🎉 THE SCRIPT IS WORKING!');
        Logger.log('Now deploy it and test from the website!');
        Logger.log('');
        return 'SUCCESS - Script works!';
      } else if (parsed.message && parsed.message.includes('API is running')) {
        Logger.log('');
        Logger.log('❌❌❌ FAIL! Script returned default message ❌❌❌');
        Logger.log('This means doGet is NOT recognizing the referral share request!');
        Logger.log('Check line 897 - the condition is not matching!');
        Logger.log('');
        return 'FAIL - Script NOT processing shares';
      } else if (parsed.error) {
        Logger.log('');
        Logger.log('⚠️⚠️⚠️ ERROR! Script returned error: ⚠️⚠️⚠️');
        Logger.log('Error: ' + parsed.error);
        Logger.log('Details: ' + (parsed.details || 'none'));
        Logger.log('');
        return 'ERROR - ' + parsed.error;
      } else {
        Logger.log('⚠️ Unexpected response');
        return 'UNKNOWN';
      }
    } catch (error) {
      Logger.log('❌ Error parsing response: ' + error.toString());
      return 'ERROR parsing response';
    }
  }