# ✅ Complete System Test Guide

**Date:** October 1, 2025  
**Status:** Ready for Testing

---

## 🎯 What To Test

### 1. ✅ User-Specific Data
- Each user has their own coins/shares
- New users start at 0
- No data collision

### 2. ✅ Personalized Referral Links
- Each user gets unique link with their email
- Link format: `registration.html?ref=user@email.com`

### 3. ✅ Coin System (3+1)
- Share link → +3 coins
- Someone registers → +1 bonus coin

### 4. ✅ Referral Count Tracking
- Counts users who registered via link
- Syncs with Google Sheets
- Displays accurately

### 5. ✅ Login System
- Login with email
- Switch users
- Logout
- Auto-login after registration

---

## 🧪 Complete Test Scenario

### PART 1: User A - Registration & Sharing (15 minutes)

**Step 1: Clear Browser**
```
1. Press Ctrl+Shift+Delete
2. Clear all data
3. Or use Incognito mode
```

**Step 2: Register User A**
```
1. Open: registration.html
2. Fill form:
   - Full Name: Samantha Johnson
   - Email: samantha@example.com
   - Phone: +254712345678
   - Role: Job Seeker
3. Submit
```

✅ **Expected Results:**
- Success message appears
- Redirects to referral.html after 2 seconds
- Header shows: samantha@example.com
- Stats show: 0 coins, 0 registered via link, 0 shares

**Step 3: Check Personalized Link**
```
Scroll to "Your Personalized Referral Link" section
```

✅ **Expected:**
```
https://yoursite.com/registration.html?ref=samantha%40example.com
```

❌ **NOT:**
```
https://yoursite.com/registration.html?ref=hemant%40example.com
```

**If wrong email appears:**
- Open browser console (F12)
- Run: `console.log('Current user:', getCurrentUserEmail())`
- Should show: `samantha@example.com`
- Run: `generatePersonalizedLink()`
- Check link updated

**Step 4: Share Via WhatsApp**
```
1. Click "Share via WhatsApp"
2. Check the message text
```

✅ **Expected Message:**
```
🚀 Join AksharJobs - the best platform for finding your dream job!

Use my referral code: AKSHAR2025

Register here: https://yoursite.com/registration.html?ref=samantha%40example.com

Discover amazing opportunities and grow your career! 💼

#AksharJobs #CareerGrowth #JobOpportunities
```

✅ **Expected Coins:**
- Notification: "🎉 +3 Coins! You'll get +1 more when someone registers via your link!"
- Display updates: **3 coins**, 0 registered, 1 share

**Step 5: Check Google Sheets**
```
1. Open: https://docs.google.com/spreadsheets/d/14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk/edit
2. Find tab: Referral_Tracking
```

✅ **Expected Row:**
| Referrer Name | Referrer Email | Referral Count | Akshar Coins | Platform |
|---------------|----------------|----------------|--------------|----------|
| Samantha Johnson | samantha@example.com | 0 | 3 | whatsapp |

**Step 6: Share Via LinkedIn**
```
1. Click "Share via LinkedIn"
2. Check coins
```

✅ **Expected:**
- Display updates: **6 coins**, 0 registered, 2 shares

---

### PART 2: User B - Click Link & Register (10 minutes)

**Step 7: Copy Samantha's Referral Link**
```
From Samantha's referral page, copy:
https://yoursite.com/registration.html?ref=samantha%40example.com
```

**Step 8: Open in New Incognito Window**
```
1. Open NEW incognito/private window
2. Paste the referral link
3. Press Enter
```

✅ **Expected:**
- Registration page opens
- URL bar shows: `?ref=samantha%40example.com` ✅

**Step 9: Register User B**
```
Fill form:
- Full Name: Robert Smith
- Email: robert@example.com
- Phone: +254787654321
- Role: Recruiter
Submit
```

✅ **Expected:**
- Success message appears
- Console shows: "Processing referral registration for referrer: samantha@example.com"
- Console shows: "Referral bonus sent: +1 coin for referrer"
- Redirects to referral.html
- Robert sees: **0 coins**, 0 registered, 0 shares (fresh start!)

**Step 10: Check Google Sheets (Critical!)**
```
Refresh Google Sheet
Check both tabs:
```

✅ **Referral_Tracking Sheet:**
| Referrer Name | Referrer Email | Referral Count | Akshar Coins | Platform |
|---------------|----------------|----------------|--------------|----------|
| Samantha Johnson | samantha@example.com | **1** | **7** | registration |

- Referral Count: 0 → **1** ✅
- Akshar Coins: 6 → **7** ✅ (6 from sharing + 1 bonus)

✅ **Referral_Clicks Sheet:**
| Referrer Email | Referred Email | Timestamp | Coins Awarded |
|----------------|----------------|-----------|---------------|
| samantha@example.com | robert@example.com | 2025-10-01... | 1 |

---

### PART 3: Samantha Checks Her Stats (5 minutes)

**Step 11: Go Back to Samantha's Window**
```
1. Switch to original window (where Samantha is logged in)
2. Refresh the page (F5)
```

✅ **Expected After Refresh:**
- System syncs with Google Sheets
- Display shows: **7 coins**, **1 registered via link**, 2 shares ✅
- Both stat sections match

**If stats don't update:**
```
1. Open console (F12)
2. Check for: "Syncing referral data from Google Sheets"
3. Check for: "✅ Synced with Google Sheets"
4. Manually run: syncReferralDataFromSheets()
```

---

### PART 4: Test Second Referral (5 minutes)

**Step 12: Samantha Shares Again**
```
On Samantha's page:
1. Click "Share via Email"
```

✅ **Expected:**
- Coins: 7 → **10** (7 + 3)
- Shares: 2 → **3**
- Registered: 1 (unchanged)

**Step 13: Another Person Registers**
```
1. Copy Samantha's link again
2. Open in NEW incognito
3. Register: jane@example.com
4. Submit
```

✅ **Expected:**
- Jane's registration saved ✅
- Console: "Referral bonus sent: +1 coin"

**Step 14: Samantha Refreshes**
```
Go to Samantha's page
Refresh (F5)
```

✅ **Expected:**
- Coins: 10 → **11** (10 + 1 bonus)
- Registered via Link: 1 → **2** ✅
- Shares: 3 (unchanged)

---

### PART 5: Test Duplicate Prevention (3 minutes)

**Step 15: Try Duplicate Registration**
```
1. Use Samantha's referral link
2. Try registering: robert@example.com (already registered)
```

✅ **Expected:**
- Error: "Email already registered"
- Samantha does NOT get another +1 coin ✅

**Step 16: Check Google Sheets**
```
Check Referral_Clicks sheet
```

✅ **Expected:**
- Only 2 rows (Robert and Jane)
- No duplicate entries
- Each referrer-referred pair appears once only

---

### PART 6: Test Login System (5 minutes)

**Step 17: Samantha Logs Out**
```
On Samantha's page:
1. Click "Logout" button
2. Confirm
```

✅ **Expected:**
- Notification: "Logged out successfully"
- Redirects to registration.html

**Step 18: Go Back to Referral Page**
```
Open: referral.html
```

✅ **Expected:**
- Login modal appears automatically
- No stats visible (not logged in)

**Step 19: Login as Samantha**
```
1. Enter: samantha@example.com
2. Click "Access My Referrals"
```

✅ **Expected:**
- Modal closes
- Loads Samantha's data
- Shows: 11 coins, 2 registered, 3 shares ✅
- Header shows: samantha@example.com
- Personalized link shows: samantha@example.com

**Step 20: Switch to Robert**
```
1. Click "Switch User"
2. Enter: robert@example.com  
3. Submit
```

✅ **Expected:**
- Switches to Robert's account
- Shows: 0 coins, 0 registered, 0 shares
- Header shows: robert@example.com
- Personalized link shows: robert@example.com

**Step 21: Switch Back to Samantha**
```
1. Click "Switch User"
2. Enter: samantha@example.com
3. Submit
```

✅ **Expected:**
- Switches back to Samantha
- Shows: 11 coins, 2 registered, 3 shares ✅
- All data preserved

---

## 📊 Final Verification Table

### After Complete Test:

| User | Coins | Registered Via Link | Shares | Notes |
|------|-------|---------------------|--------|-------|
| Samantha | 11 | 2 | 3 | Original sharer (6 share coins + 5 bonus) |
| Robert | 0 | 0 | 0 | Registered via Samantha's link |
| Jane | 0 | 0 | 0 | Registered via Samantha's link |

### Google Sheets Verification:

**Referral_Tracking:**
| Email | Referral Count | Akshar Coins |
|-------|----------------|--------------|
| samantha@example.com | 2 | 11 |

**Referral_Clicks:**
| Referrer Email | Referred Email |
|----------------|----------------|
| samantha@example.com | robert@example.com |
| samantha@example.com | jane@example.com |

---

## 🐛 Troubleshooting

### Issue: Wrong Email in Referral Link

**Problem:** Samantha sees Hemant's email in her link

**Diagnosis:**
```javascript
// Open console (F12) and run:
console.log('Current user:', getCurrentUserEmail());
console.log('User data:', getUserData());
```

**Fix:**
```javascript
// If shows wrong email, force reset:
localStorage.removeItem('currentUserEmail');
location.reload();
// Then login with correct email
```

**Permanent Fix:**
- Clear all browser data
- Register again fresh
- System will set correct email

---

### Issue: Referral Count Not Updating

**Problem:** Someone registered but count is still 0

**Diagnosis:**
```javascript
// Check if sync is working:
syncReferralDataFromSheets();

// Check Google Sheets manually:
// Open Referral_Tracking sheet
// Look for your email
// Check Referral Count column
```

**Fix:**
- Refresh the referral page (F5)
- System auto-syncs with Google Sheets
- Count should update

---

### Issue: Coins Not Matching

**Problem:** Frontend shows different coins than Google Sheets

**Solution:**
```javascript
// Force sync from Google Sheets:
syncReferralDataFromSheets();

// Or refresh page - auto-syncs on load
```

---

## ✅ Success Criteria

After completing all tests:

- ✅ Each user has correct personalized link with THEIR email
- ✅ Sharing earns 3 coins immediately
- ✅ Registration bonus earns 1 coin
- ✅ "Registered Via Link" count increments correctly
- ✅ Google Sheets data matches frontend display
- ✅ Login/logout works
- ✅ Switch user works
- ✅ No duplicate bonuses
- ✅ All data preserved per user

---

## 📞 Debug Commands

If issues occur, use these in browser console (F12):

```javascript
// Check current user
console.log('Current user:', getCurrentUserEmail());

// Check user's data
console.log('User data:', getUserData());
console.log('Referral data:', getReferralData());

// Force refresh link
generatePersonalizedLink();

// Force sync with Google Sheets
syncReferralDataFromSheets();

// View all localStorage
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, ':', localStorage.getItem(key));
}

// Reset current user (if wrong)
localStorage.removeItem('currentUserEmail');
location.reload();
```

---

**Test now and verify everything works correctly!** 🚀

The key fixes:
1. ✅ generatePersonalizedLink() now uses getCurrentUserEmail() directly
2. ✅ Referral count syncs from Google Sheets
3. ✅ Each user isolated
4. ✅ Clear labels: "Users Registered Via Link"

