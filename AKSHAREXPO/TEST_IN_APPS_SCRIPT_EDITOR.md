# 🧪 TEST DIRECTLY IN GOOGLE APPS SCRIPT EDITOR

## 🎯 The Problem:

Your deployments keep returning "API is running" which means the code in the editor is **NOT the updated version**.

---

## ✅ VERIFY CODE IN EDITOR:

### **Test Function - Add this to your Google Apps Script:**

```javascript
// Add this function at the VERY END of your code
function testDoGetWithParameters() {
  // Simulate a GET request with referral share parameters
  const testEvent = {
    parameter: {},
    parameters: {
      type: ['share'],
      action: ['referral_share'],
      referrerEmail: ['test@example.com'],
      referrerName: ['Test User'],
      referrerPhone: ['1234567890'],
      referrerRole: ['job_seeker'],
      platform: ['whatsapp'],
      coinsEarned: ['3'],
      totalCoins: ['3'],
      totalShares: ['1'],
      referralCount: ['0'],
      shareId: ['test123']
    }
  };
  
  Logger.log('Testing doGet with parameters...');
  const result = doGet(testEvent);
  const content = result.getContent();
  Logger.log('Result: ' + content);
  
  const parsed = JSON.parse(content);
  
  if (parsed.success) {
    Logger.log('✅ SUCCESS! Script is processing referral data correctly!');
    Logger.log('Action Type: ' + parsed.actionType);
    Logger.log('Coins Earned: ' + parsed.coinsEarned);
    Logger.log('Total Coins: ' + parsed.totalCoins);
    return 'SUCCESS';
  } else if (parsed.message && parsed.message.includes('API is running')) {
    Logger.log('❌ FAIL! Script returned default message.');
    Logger.log('This means the code does NOT have the updated condition check!');
    return 'FAIL - Code not updated';
  } else {
    Logger.log('⚠️ Unexpected response: ' + content);
    return 'UNKNOWN';
  }
}
```

---

## 📋 HOW TO USE:

### **Step 1: Add Test Function**
```
1. Go to: https://script.google.com
2. Open your project
3. Scroll to the VERY BOTTOM of the code
4. Paste the testDoGetWithParameters function above
5. Save (Ctrl+S)
```

### **Step 2: Run the Test**
```
1. At the top, find the function dropdown (shows "doGet" or function name)
2. Click the dropdown
3. Select "testDoGetWithParameters" from the list
4. Click the "Run" button (▶️ play icon)
5. You may need to authorize - click "Review permissions" and authorize
6. Wait for execution to complete
7. Click "Execution log" at the bottom
8. Read the logs
```

---

## 📊 EXPECTED RESULTS:

### ✅ **GOOD (Code is Updated):**
```
Logs show:
✅ SUCCESS! Script is processing referral data correctly!
Action Type: share
Coins Earned: 3
Total Coins: 3
```

**Action:**
- Code is correct!
- Just deploy it with "New deployment"
- Should work

---

### ❌ **BAD (Code is OLD):**
```
Logs show:
❌ FAIL! Script returned default message.
This means the code does NOT have the updated condition check!
```

**Action:**
- Code in editor is OLD
- Paste the updated code from: google_sheets_integration.gs
- Save and run test again

---

## 🔧 If Code is OLD - Paste This:

### **Copy Fresh Code:**
```
1. On your computer, open:
   C:\Users\kalpi\Desktop\AksharJobs\AKSHAREXPO\google_sheets_integration.gs

2. Make SURE this file has the updated code:
   - Search for: requestType === 'share'
   - Should find it
   - Search for: setTimeout
   - Should NOT find it

3. Select ALL (Ctrl+A)
4. Copy (Ctrl+C)
5. Go to Google Apps Script
6. Select ALL in editor (Ctrl+A)
7. Paste (Ctrl+V)
8. Save (Ctrl+S)
9. Run testDoGetWithParameters again
10. Should now show SUCCESS
```

---

## 🎯 CRITICAL INSIGHT:

The issue is likely that the `google_sheets_integration.gs` file on your computer has updates, but you **haven't pasted them** into the Google Apps Script web editor!

**Solution:**
1. Copy code from LOCAL file
2. Paste into Google Apps Script web editor
3. Save
4. Run test function
5. If SUCCESS → Create new deployment
6. Done!

---

**Add that test function and run it - it will tell you if the code is updated or not! 🔍**

