# 📊 Google Sheets Column Structure

## Required Sheets

Your Google Spreadsheet should have these sheets (tabs):

---

## 1. 📋 Referral Tracking Sheet

This sheet will be **AUTO-CREATED** by the Google Apps Script when first share is tracked.

### Columns (15 total):

| Column | Name | Type | Description | Example |
|--------|------|------|-------------|---------|
| **A** | Timestamp | DateTime | When the action occurred | 10/3/2025 10:30:00 |
| **B** | Type | Text | Type of action | share, registration |
| **C** | Referrer Name | Text | User's full name | Manan Patel |
| **D** | Referrer Email | Text | User's email (key field) | Mananpatelj12@gmail.com |
| **E** | Referrer Phone | Text | User's phone | 0734852877 |
| **F** | Referrer Role | Text | User's role | job_seeker, recruiter |
| **G** | Platform | Text | Share platform | whatsapp, linkedin, email |
| **H** | Coins Earned | Number | Coins for this action | 3 |
| **I** | Share Coins | Number | Total coins from shares | 9 |
| **J** | Referral Bonus Coins | Number | Bonus coins from referrals | 2 |
| **K** | **Total Coins** | Number | **User's total coins** | **11** |
| **L** | **Total Shares** | Number | **User's total shares** | **3** |
| **M** | **Platform Share Count** | Number | **Shares on this platform** | **2** |
| **N** | Referral Code | Text | Referral code used | AKSHAR2025 |
| **O** | Source | Text | Where tracked from | referral_page |

### Header Row Formatting:
- Background: Blue (#4285f4)
- Text: White (#ffffff)
- Font: Bold

---

## 2. 📋 Referral Clicks Sheet (Optional)

This sheet tracks when someone registers via a referral link.

### Columns (5 total):

| Column | Name | Type | Description | Example |
|--------|------|------|-------------|---------|
| **A** | Timestamp | DateTime | When registered | 10/3/2025 11:00:00 |
| **B** | Referrer Email | Text | Who referred them | john@example.com |
| **C** | Referred Email | Text | Who registered | jane@example.com |
| **D** | Referred Name | Text | New user's name | Jane Smith |
| **E** | Coins Awarded | Number | Bonus coins given | 1 |

---

## 3. 📋 Registrations Sheet (Existing)

Your existing registration sheet (keep as is).

---

## 📈 Example Data After 3 Shares

### Referral Tracking Sheet:

| Timestamp | Type | Referrer Email | Platform | Coins Earned | Total Coins | Total Shares | Platform Share Count |
|-----------|------|----------------|----------|--------------|-------------|--------------|---------------------|
| 10/3/25 10:00 | share | Mananpatelj12@gmail.com | whatsapp | 3 | 3 | 1 | 1 |
| 10/3/25 10:05 | share | Mananpatelj12@gmail.com | whatsapp | 3 | 6 | 2 | 2 |
| 10/3/25 10:10 | share | Mananpatelj12@gmail.com | linkedin | 3 | 9 | 3 | 1 |

**Analysis:**
- User shared 3 times total (2x WhatsApp, 1x LinkedIn)
- Earned 9 total coins (3 per share)
- WhatsApp platform count: 2
- LinkedIn platform count: 1

---

## 📊 How to Read the Data

### To Find a User's Total Coins:
```
1. Filter by "Referrer Email"
2. Look at the LAST ROW for that user
3. Check "Total Coins" column
```

### To Count User's Total Shares:
```
1. Filter by "Referrer Email"
2. Count the NUMBER OF ROWS
   OR
3. Look at "Total Shares" in the last row
```

### To See Shares Per Platform:
```
1. Filter by "Referrer Email"
2. Filter by "Platform"
3. Count rows OR check "Platform Share Count"
```

---

## 🔧 Google Apps Script Will:

1. ✅ **Auto-create** "Referral Tracking" sheet if it doesn't exist
2. ✅ **Add headers** with proper formatting
3. ✅ **Append new row** for each share
4. ✅ **Fill all columns** with correct data
5. ✅ **Update cumulative counts** (Total Coins, Total Shares)

---

## ✅ What You Should See After Deployment

### After 1st Share:
```
Row 2 (after header):
- Referrer Email: Mananpatelj12@gmail.com
- Platform: whatsapp
- Coins Earned: 3
- Total Coins: 3
- Total Shares: 1
- Platform Share Count: 1
```

### After 2nd Share (same platform):
```
Row 3:
- Referrer Email: Mananpatelj12@gmail.com
- Platform: whatsapp
- Coins Earned: 3
- Total Coins: 6  ⬅️ Increased!
- Total Shares: 2  ⬅️ Increased!
- Platform Share Count: 2  ⬅️ Increased!
```

### After 3rd Share (different platform):
```
Row 4:
- Referrer Email: Mananpatelj12@gmail.com
- Platform: linkedin
- Coins Earned: 3
- Total Coins: 9  ⬅️ Increased!
- Total Shares: 3  ⬅️ Increased!
- Platform Share Count: 1  ⬅️ First LinkedIn share
```

---

## 🎯 Key Points

1. **Each share = New Row** (not updating existing rows)
2. **Total Coins = Cumulative** (increases with each share)
3. **Total Shares = Count** (total number of shares)
4. **Platform Share Count = Per Platform** (resets for each platform)

---

## 📞 Verification Checklist

After deploying the script and testing:

- [ ] "Referral Tracking" sheet exists
- [ ] Headers are formatted (blue background, white text)
- [ ] Each share creates a new row
- [ ] "Total Coins" column is filled
- [ ] "Total Shares" column is filled
- [ ] "Platform Share Count" column is filled
- [ ] Coins increase by 3 per share
- [ ] Total shares count increases correctly

---

**This structure will be AUTO-CREATED by the Google Apps Script!**
**You don't need to manually create it - just deploy the script!**

