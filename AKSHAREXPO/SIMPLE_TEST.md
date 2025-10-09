# ⚡ SIMPLE TEST - Check if Script is Processing Data

## 🧪 Copy and paste this URL in your browser:

```
https://script.google.com/macros/s/AKfycbzIWDUnsWhdqj7324Ue-mGhlgqTgf8BwTyhChGW0OyqRLqnYw52lsdadoCmhQiSMUjh/exec?type=share&action=referral_share&referrerEmail=neel66569@gmail.com&referrerName=Neel&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0
```

---

## Expected Results:

### ✅ **GOOD - Script is processing:**
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins...",
  "actionType": "share",
  "coinsEarned": 3,
  "totalCoins": 3,
  "referralCount": 0
}
```

**What this means:**
- ✅ Script recognized the request as a referral share
- ✅ Processed the data
- ✅ Saved to Google Sheets
- ✅ Returned success message

---

### ❌ **BAD - Script NOT processing:**
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "2025-10-03T08:57:02.349Z",
  "received_parameters": {}
}
```

**What this means:**
- ❌ Script did NOT recognize this as a referral share request
- ❌ Fell through to default response
- ❌ Did NOT save to Google Sheets
- ❌ Script logic needs fixing

---

## 🔧 If You Get the BAD Response:

The script's condition check is not matching. You need to redeploy with the UPDATED code.

### **Make sure you deployed the UPDATED google_sheets_integration.gs:**

The updated code (line 830) should have:
```javascript
if (e.parameters && e.parameters.referrerEmail && (requestType === 'share' || requestType === 'referral' || requestType === 'referral_share' || requestAction === 'referral_share'))
```

NOT the old code:
```javascript
if (e.parameters && (requestType === 'referral' || requestType === 'referral_share'))
```

---

## 📋 Deployment Checklist:

1. [ ] Saved the UPDATED google_sheets_integration.gs code
2. [ ] Clicked "Deploy" → "Manage deployments"
3. [ ] Clicked ✏️ Edit
4. [ ] Clicked "New version" (creates new version with updated code)
5. [ ] Clicked "Deploy"
6. [ ] Waited 30 seconds for deployment to complete

---

## 🎯 Test Again:

After redeploying with "New version":
1. Wait 30 seconds
2. Test the URL above in browser
3. Should now see SUCCESS response
4. Then test from referral page
5. Data should save to Google Sheets

---

**Key: Make sure you deployed with "New version" so the updated code is active! 🚀**

