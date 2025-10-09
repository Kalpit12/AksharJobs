# 🧪 Test Your Script URL

## Test with this URL (paste in browser):

```
https://script.google.com/macros/s/AKfycbzIWDUnsWhdqj7324Ue-mGhlgqTgf8BwTyhChGW0OyqRLqnYw52lsdadoCmhQiSMUjh/exec?type=share&action=referral_share&referrerEmail=neel66569@gmail.com&referrerName=Neel&platform=whatsapp&coinsEarned=3&totalCoins=3&totalShares=1&referralCount=0&shareCoins=3&referralBonusCoins=0&platformShareCount=1&referralCode=AKSHAR2025&referrerPhone=1234567890&referrerRole=job_seeker&source=referral_page&timestamp=2025-10-03T08:50:00.000Z
```

## Expected Response:

### ✅ GOOD (Script processing data):
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins...",
  "actionType": "share",
  "totalCoins": 3,
  "referralCount": 0,
  "platformsShared": ["whatsapp"],
  "platformShareCounts": {"whatsapp": 1}
}
```

### ❌ BAD (Script NOT processing):
```json
{
  "message": "AksharJobs Expo Registration & Referral API is running",
  "timestamp": "2025-10-03T08:57:02.349Z",
  "received_parameters": {}
}
```

If you see the BAD response, it means the script's condition check is not matching the incoming data.

