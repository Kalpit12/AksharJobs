# 📋 COMPLETE DEPLOYMENT INSTRUCTIONS - Every Single Step

## 🎯 What You Need to Do:

Deploy the updated `google_sheets_integration.gs` to fix the setTimeout error and enable proper tracking.

---

## 📝 STEP-BY-STEP (Follow Exactly):

### **STEP 1: Open Google Apps Script**
```
1. Open your browser
2. Go to: https://script.google.com
3. You'll see a list of your projects
4. Click on the project you've been using
   (The one linked to your Google Sheet)
5. The code editor will open
```

---

### **STEP 2: Verify Code is Updated**
```
1. In the code editor, press Ctrl+F (Find)
2. Type: setTimeout
3. If you find "setTimeout is not defined" error in logs:
   - The code needs to be updated
4. Search for: requestType === 'share'
5. Should find it around line 849
6. If NOT found → Code is old, continue to Step 3
7. If found → Code is updated, skip to Step 4
```

---

### **STEP 3: Update the Code (If Needed)**
```
1. On your computer, open file:
   C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO\google_sheets_integration.gs

2. In the file, press Ctrl+A (select all)
3. Press Ctrl+C (copy)
4. Go back to Google Apps Script browser tab
5. In the code editor, press Ctrl+A (select all existing code)
6. Press Ctrl+V (paste new code)
7. Verify the code pasted correctly
8. Press Ctrl+S (save)
9. Wait for "Saving..." to complete
10. You'll see checkmark or "All changes saved in Drive"
```

---

### **STEP 4: Deploy with New Version**
```
1. Look at top-right corner of Google Apps Script page
2. Find the blue "Deploy" button
3. Click "Deploy"
4. A dropdown menu appears
5. Click "Manage deployments"

6. You'll see a table showing your deployments
7. Look for a row with "Web app" type
8. On that row, find the ✏️ (pencil) icon on the right
9. Click the ✏️ (pencil) icon

10. A dialog opens titled "Edit deployment"
11. Find the "Version" dropdown (shows current version like "@3" or "@4")
12. Click the dropdown
13. You'll see a list of versions
14. At the bottom, click "New version"
15. The version number increases (e.g., @3 becomes @4)

16. Click the blue "Deploy" button at bottom-right
17. Wait for processing
18. You'll see "Deployment updated successfully" message
19. Click "Done"
```

---

### **STEP 5: Verify Deployment**
```
1. Wait 30 seconds (important!)
2. Open a NEW incognito window (Ctrl+Shift+N)
3. Copy and paste this EXACT URL:

https://script.google.com/macros/s/AKfycbzEzInMtaTHux3dNtmcckpy2jfX-ywaDJflALkXtXgBRruelQOb5WbjonEPpgvFJ_bHyw/exec?type=share&action=referral_share&referrerEmail=test@example.com&referrerName=Test&referrerPhone=1234567890&referrerRole=job_seeker&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0&shareId=verify123

4. Press Enter
5. You'll see JSON response in browser
```

---

### **STEP 6: Check the Response**

**✅ GOOD Response (Script Working):**
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins. Share unlimited times to earn more!",
  "actionType": "share",
  "coinsEarned": 3,
  "totalCoins": 3,
  "referralCount": 0,
  "platformsShared": ["whatsapp"],
  "platformShareCounts": {"whatsapp": 1}
}
```

**✅ What this means:**
- Script is processing data correctly
- Updated code is deployed
- Ready to test from referral page

---

**❌ BAD Response (Script NOT Working):**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "...",
  "received_parameters": {}
}
```

**❌ What this means:**
- Updated code NOT deployed yet
- Still using old version
- Need to repeat Step 4 (Deploy with "New version")

---

**OR**

**❌ ERROR Response:**
```json
{
  "error": "ReferenceError: setTimeout is not defined"
}
```

**❌ What this means:**
- Old code with setTimeout still deployed
- Need to paste NEW code and redeploy

---

### **STEP 7: Test from Referral Page**
```
1. After getting GOOD response from Step 6
2. Open referral.html
3. Clear cache: Ctrl+Shift+R
4. Clear localStorage (F12): localStorage.clear(); location.reload();
5. Login as Neel
6. Share on WhatsApp → Confirm
7. Wait 10 seconds
8. Open Google Sheets → Refresh
9. Check row for neel66569@gmail.com:
   - Share Count: 1
   - Akshar coins: 3 (NOT 6!)
10. Share again:
   - Share Count: 2
   - Akshar coins: 6 (NOT 12!)
```

---

## 🎯 Critical Points:

1. **MUST click "New version"** - Not just "Deploy"
2. **MUST wait 30 seconds** - For deployment to activate
3. **MUST test with incognito** - To avoid cached responses
4. **Check Google Sheets** - To confirm data is correct

---

## 📞 What to Tell Me:

After following all steps, paste here:
1. The JSON response you got from Step 6
2. Whether Google Sheets shows correct coins (3, 6, 9... not double)

---

**This is the complete guide - follow every step in order! 🚀**

