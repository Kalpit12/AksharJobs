# 🔍 DEBUG: Why Neel's Shares Aren't in Google Sheets

## 🔴 Observation from Google Sheets:

Looking at the "Referral Tracking" sheet:
- ✅ Row 4-7: Manan Patel (Mananpatelj12@gmail.com) - WORKING
- ✅ Row 9-11: Hemant Patel (hemant.patel@maxproinfotech.cor) - WORKING  
- ❌ **No rows for: neel66569@gmail.com - NOT WORKING**

## 🎯 Possible Causes:

### **Cause 1: Script Mismatch**
You have **TWO different scripts**:
1. `google_sheets_integration.gs` - Updates ONE row per user
2. `google_sheets_referral_script.gs` - Creates MULTIPLE rows (one per share)

**Which one is deployed?**
Looking at your sheets, I see **multiple rows per user** (Manan has 4 rows), so you're using `google_sheets_referral_script.gs`.

### **Cause 2: Data Not Being Sent**
Neel's share might not be reaching Google Sheets because:
- User email is missing or incorrect
- Data format is wrong
- Request is failing silently

---

## ✅ SOLUTION:

### **Step 1: Check Console When Neel Shares**

When neel66569@gmail.com shares, check browser console for:

**✅ Good logs:**
```javascript
📤 Sending referral data to Google Sheets: {
  referrerEmail: "neel66569@gmail.com",  ← Should be this email
  referrerName: "Neel",
  platform: "whatsapp",
  ...
}
```

**❌ Bad logs:**
```javascript
referrerEmail: "unknown@example.com"  ← PROBLEM!
referrerName: "Unknown"               ← PROBLEM!
```

### **Step 2: Make Sure Neel is Logged In**

The issue might be that neel66569@gmail.com isn't properly logged in:

```javascript
// Check in browser console:
localStorage.getItem('currentUserEmail')
// Should return: "neel66569@gmail.com"

// If it returns null or "anonymous@example.com", that's the problem!
```

### **Step 3: Properly Login as Neel**

```
1. Clear localStorage: localStorage.clear()
2. Refresh page
3. Enter details:
   - Name: Neel
   - Email: neel66569@gmail.com
   - Phone: [phone number]
   - Role: Job Seeker
4. Click "Get Started"
5. Verify in console:
   localStorage.getItem('currentUserEmail')
   → Should show: "neel66569@gmail.com"
```

### **Step 4: Share and Verify**

```
1. Click "Share on WhatsApp"
2. Confirm share
3. Check console shows:
   ✅ referrerEmail: "neel66569@gmail.com" (NOT "unknown@example.com")
4. Wait 5 seconds
5. Check Google Sheets
6. ✅ Should see new row for neel66569@gmail.com
```

---

## 🔧 Debug Commands:

### **Check Current User:**
```javascript
// In browser console (F12):
console.log('Current User Email:', localStorage.getItem('currentUserEmail'));
console.log('User Data:', JSON.parse(localStorage.getItem('aksharUserData_' + localStorage.getItem('currentUserEmail'))));
```

### **Expected Output:**
```javascript
Current User Email: neel66569@gmail.com
User Data: {
  fullName: "Neel",
  email: "neel66569@gmail.com",
  phone: "...",
  role: "job_seeker",
  aksharCoins: 3
}
```

### **If You See:**
```javascript
Current User Email: null
// OR
Current User Email: anonymous@example.com
```
**→ This is the problem! User not logged in properly.**

---

## 📊 Expected Google Sheets After Neel Shares:

After neel shares 3 times on WhatsApp:

| Timestamp | Type | Referrer Name | Referrer Email | Platform | Coins | Total Coins | Total Shares |
|-----------|------|---------------|----------------|----------|-------|-------------|--------------|
| ... | share | **Neel** | **neel66569@gmail.com** | whatsapp | 3 | 3 | 1 |
| ... | share | **Neel** | **neel66569@gmail.com** | whatsapp | 3 | 6 | 2 |
| ... | share | **Neel** | **neel66569@gmail.com** | whatsapp | 3 | 9 | 3 |

---

## 🎯 Most Likely Cause:

Based on seeing "unknown@example.com" in rows 2, 3, and 8, I suspect:
- Neel's email is being sent as "unknown@example.com"
- This happens when user data is not properly set
- Need to ensure proper login before sharing

---

## ✅ QUICK FIX:

```javascript
// In browser console (F12), run this:
localStorage.clear();
console.log('✅ Cleared all data');

// Then manually set user data:
const neelData = {
  fullName: 'Neel',
  email: 'neel66569@gmail.com',
  phone: '1234567890',
  role: 'job_seeker',
  aksharCoins: 0
};

localStorage.setItem('currentUserEmail', 'neel66569@gmail.com');
localStorage.setItem('aksharUserData_neel66569@gmail.com', JSON.stringify(neelData));
localStorage.setItem('aksharReferralData_neel66569@gmail.com', JSON.stringify({
  totalShares: 0,
  totalCoinsEarned: 0,
  totalReferrals: 0
}));

console.log('✅ Set up Neel user data');
location.reload();
```

Then try sharing again and it should work!

---

**The 403 error is fixed! Now we just need to ensure neel is properly logged in before sharing! 🎉**
