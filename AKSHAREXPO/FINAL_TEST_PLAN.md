# ✅ FINAL TEST PLAN - Complete System Verification

## 🎯 Your Setup Status:

### ✅ Google Apps Script:
**URL:** https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec

**Status:** ✅ DEPLOYED AND RUNNING
**Verified:** Yes (returns API running message)

### ✅ Files Updated:
- ✅ `google_sheets_integration.gs` - Allows unlimited shares
- ✅ `referral.html` - Tracks unlimited shares locally
- ✅ Webhook URL configured correctly

---

## 🧪 COMPLETE TEST (10 minutes):

### **Step 1: Clear Everything** (Start Fresh)
```
1. Open referral.html in browser
2. Press F12 (open console)
3. Copy-paste this:
   localStorage.clear(); 
   console.log('✅ Cleared all data'); 
   location.reload();
4. Press Enter
```

### **Step 2: Login**
```
1. Enter your details:
   - Name: Manan Patel
   - Email: Mananpatelj12@gmail.com
   - Phone: 0734852877
   - Role: Job Seeker
2. Click "Get Started"
3. ✅ Should see: "Welcome back, Manan Patel!"
4. ✅ Should show: 0 AksharCoins, 0 Total Shares
```

### **Step 3: First Share (WhatsApp)**
```
1. Click "Share on WhatsApp" button
2. WhatsApp opens (or prompt appears)
3. Click "Yes, I Shared" in the modal
4. ✅ Should see: "+3 AksharCoins earned!"
5. ✅ Display updates to: 3 coins, 1 total share

Console should show:
✅ Tracked share on whatsapp. Total whatsapp shares: 1
📊 Accurate Coin Calculation: { totalCoins: 3, totalShares: 1 }
📤 Sending referral data to Google Sheets
```

### **Step 4: Second Share (WhatsApp Again)**
```
1. Click "Share on WhatsApp" button AGAIN
2. WhatsApp opens
3. Click "Yes, I Shared"
4. ✅ Should see: "+3 AksharCoins earned!"
5. ✅ Display updates to: 6 coins, 2 total shares, 2 on whatsapp

Console should show:
✅ Tracked share on whatsapp. Total whatsapp shares: 2
📊 Accurate Coin Calculation: { totalCoins: 6, totalShares: 2 }
```

### **Step 5: Third Share (LinkedIn)**
```
1. Click "Share on LinkedIn" button
2. LinkedIn opens
3. Click "Yes, I Shared"
4. ✅ Should see: "+3 AksharCoins earned!"
5. ✅ Display updates to: 9 coins, 3 total shares

Console should show:
✅ Tracked share on linkedin. Total linkedin shares: 1
📊 Accurate Coin Calculation: { totalCoins: 9, totalShares: 3, platformCounts: {whatsapp: 2, linkedin: 1} }
```

### **Step 6: Verify Google Sheets**
```
1. Open your Google Sheet: 
   https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk

2. Go to "Referral_Tracking" tab

3. Find row with: Mananpatelj12@gmail.com

4. ✅ Should show:
   - Referrer Name: Manan Patel
   - Referrer Email: Mananpatelj12@gmail.com
   - Referrer Count: 0
   - Akshar coins: 9
   - Platforms Shared: whatsapp, linkedin
   - Share Count Per Platform: {"whatsapp":2,"linkedin":1}
```

---

## 📊 Expected Results Summary:

### **After 3 Shares (2 WhatsApp + 1 LinkedIn):**

**Frontend Display:**
```
🪙 9 AksharCoins
👥 0 Registered Via Link
📊 3 Total Shares
```

**Google Sheets (Referral_Tracking tab):**
```
| Akshar coins | Referrer Count | Platforms Shared | Share Count Per Platform |
|--------------|----------------|------------------|--------------------------|
| 9            | 0              | whatsapp, linkedin | {"whatsapp":2,"linkedin":1} |
```

**Platform Breakdown (on page):**
```
📱 WhatsApp: 2 shares
💼 LinkedIn: 1 share
📧 Email: 0 shares
```

---

## 🔍 What to Check:

### ✅ Frontend Checklist:
- [ ] Shows 3 coins after 1st share
- [ ] Shows 6 coins after 2nd share
- [ ] Shows 9 coins after 3rd share
- [ ] Total shares increments correctly (1, 2, 3)
- [ ] Platform counts shown correctly
- [ ] No errors in console

### ✅ Google Sheets Checklist:
- [ ] Referral_Tracking sheet exists
- [ ] One row for Mananpatelj12@gmail.com
- [ ] Akshar coins column shows 9
- [ ] Referrer Count shows 0
- [ ] Platforms Shared shows "whatsapp, linkedin"
- [ ] Share Count shows {"whatsapp":2,"linkedin":1}

---

## 🚨 IF MISMATCH OCCURS:

### **Frontend shows 9 coins, Sheets shows 3 coins:**

**Cause:** Old local data interfering

**Fix:**
```javascript
// In browser console (F12):
localStorage.clear();
console.log('✅ Cleared!');
location.reload();
```

Then share 3 times again and both will match!

---

## 📞 Console Logs to Verify:

### **Good Logs (Success):**
```javascript
✅ Tracked share on whatsapp. Total whatsapp shares: 1
📤 Sending referral data to Google Sheets: {
  referrerEmail: "Mananpatelj12@gmail.com",
  platform: "whatsapp",
  totalCoins: 3,
  totalShares: 1
}
✅ Fetch sent to Google Sheets (no-cors)
✅ Image pixel loaded successfully
✅ Iframe loaded successfully
```

### **Bad Logs (Problems):**
```javascript
❌ Error sending to Google Sheets
⚠️ Fetch error
⚠️ Image pixel failed
⚠️ Iframe failed
```

---

## 🎯 Success Criteria:

**Test passes if:**
1. ✅ Frontend calculates coins correctly (share count × 3)
2. ✅ Google Sheets receives all shares
3. ✅ Both frontend and Google Sheets show same coin total
4. ✅ Platform counts match
5. ✅ Referrer count stored correctly (0 if no registrations)
6. ✅ Can share unlimited times on same platform

---

## 🚀 Ready to Test!

Your Google Apps Script is **deployed and confirmed working** at:
https://script.google.com/macros/s/AKfycbwhWHbU8pXOUqbW8vOSuHPcKzQw1u5olqNk6Ou_mCB5VfZaCTco7d5m3Q9MwXGIab9szw/exec

**Next Steps:**
1. Clear localStorage (in browser console)
2. Share 3 times
3. Verify both frontend and Google Sheets show 9 coins

**This will confirm everything is working perfectly! 🎉**
