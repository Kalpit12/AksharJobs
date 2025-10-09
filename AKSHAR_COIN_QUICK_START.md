# 🪙 Akshar Coin System - Quick Start Guide

## What Was Implemented

### ✅ Backend (Python/Flask)
1. **User Model Update** - Added coin balance and transaction tracking
2. **Coin Service** - Complete coin management (earn, spend, redeem, history)
3. **Coin Routes** - 6 API endpoints for all coin operations
4. **Promo Code Integration** - Award ₳50 coins when promo codes are used
5. **Registered Routes** - Added coin routes to main app.py

### ✅ Frontend (React)
1. **Coin API Service** - Complete API integration
2. **AksharCoinBalance Component** - Display balance with transaction history
3. **HowToEarnCoins Component** - Show all earning methods
4. **HowToUseCoins Component** - Redemption interface with live balance
5. **PromoCodePage Update** - New "Akshar Coins" tab
6. **CSS Styling** - Beautiful, modern, responsive design

---

## 🚀 How to Test

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Start Frontend
```bash
cd frontend
npm start
```
(Runs on port 3003 per your settings)

### 3. Test the Coin System

**Step 1: Login to your account**
- Navigate to http://localhost:3003
- Login as a job seeker or recruiter

**Step 2: Go to Promo Code Page**
- Dashboard → Promo Code / Referrals

**Step 3: View Akshar Coins Tab**
- Click "Akshar Coins" tab
- You should see:
  - Your coin balance (₳100 starting balance)
  - Total earned and spent
  - How to earn coins
  - How to use coins with redemption options

**Step 4: Test Earning Coins**
- Go to "My Promo Code" tab
- Copy your promo code
- Login with a different account
- Use that promo code
- Go back to first account → Check coin balance (should have +₳50)

**Step 5: Test Redeeming Coins**
- Go to "Akshar Coins" tab
- Scroll to "How to Use Coins"
- Click "Redeem Now" on any option you can afford
- Balance updates automatically

---

## 📍 File Locations

### Backend Files
```
backend/
├── models/user_model.py                    # Updated with coin fields
├── services/coin_service.py                # NEW - Coin management
├── services/promo_code_service.py          # Updated to award coins
├── routes/coin_routes.py                   # NEW - Coin API routes
└── app.py                                  # Updated to register coin routes
```

### Frontend Files
```
frontend/src/
├── api/coinApi.js                          # NEW - Coin API service
├── components/
│   ├── AksharCoinBalance.jsx              # NEW - Balance display
│   ├── HowToEarnCoins.jsx                 # NEW - Earning methods
│   └── HowToUseCoins.jsx                  # NEW - Redemption interface
├── pages/PromoCodePage.jsx                 # Updated with coin tab
└── styles/
    ├── AksharCoinBalance.css              # NEW - Balance styling
    ├── HowToEarnCoins.css                 # NEW - Earning styling
    ├── HowToUseCoins.css                  # NEW - Redemption styling
    └── PromoCodePage.css                   # Updated with coin section
```

---

## 🎯 Key Features

### Earning Methods
- ₳50 - Someone uses your promo code
- ₳100 - Referral signs up
- ₳200 - Complete profile (one-time)
- ₳25 - First application/job post
- ₳10 - Daily login

### Redemption Options

**Job Seekers:**
- ₳20 - 1 Job Application
- ₳500 - 1 Month Premium
- ₳1,200 - 3 Months Premium (20% off)
- ₳2,000 - 6 Months Premium (33% off)

**Recruiters:**
- ₳50 - 1 Job Post
- ₳10 - 5 Resume Views
- ₳800 - 1 Month Premium
- ₳2,000 - 3 Months Premium (17% off)
- ₳3,500 - 6 Months Premium (27% off)

---

## 🔗 API Endpoints

All endpoints require authentication (except `/info`)

```
GET    /api/coins/balance          # Get user's balance
GET    /api/coins/transactions     # Get transaction history
GET    /api/coins/info             # Get rewards/costs info (public)
POST   /api/coins/earn             # Earn coins (manual/admin)
POST   /api/coins/spend            # Spend coins (custom)
POST   /api/coins/redeem           # Redeem for benefits
```

---

## 🎨 UI Features

- **Gradient Backgrounds** - Purple gradient for balance card
- **Real-time Updates** - Balance updates instantly after redemption
- **Transaction History** - View recent coin transactions
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Hover effects and transitions
- **Clear Visual Feedback** - Success/error messages
- **Coin Symbol** - Custom ₳ symbol for Akshar Coins

---

## 🔍 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can view coin balance
- [ ] Can see transaction history
- [ ] Earning methods display correctly
- [ ] Redemption options display correctly
- [ ] Can redeem coins (with sufficient balance)
- [ ] Balance updates after redemption
- [ ] Insufficient balance shows error
- [ ] Coins awarded when promo code is used
- [ ] Responsive on mobile devices
- [ ] All tabs work in promo code page

---

## 🐛 Known Issues / Future Improvements

### To Implement Later
1. Daily login bonus (requires login tracking)
2. Profile completion bonus (requires profile completion check)
3. First application/job post bonus (requires integration)
4. Referral system integration
5. Coin gifting feature
6. Leaderboards
7. Special events/promotions

### Current Limitations
- All new users start with ₳100 coins (hardcoded)
- Existing users need manual coin initialization
- No coin expiration (coins never expire)
- No maximum coin limit
- No fraud prevention yet

---

## 🔧 Configuration

### Changing Coin Rewards
Edit `backend/services/coin_service.py`:
```python
COIN_REWARDS = {
    "promo_code_used": 50,     # Change these values
    "referral_signup": 100,
    # ...
}
```

### Changing Redemption Costs
Edit `backend/services/coin_service.py`:
```python
COIN_COSTS = {
    "job_seeker": {
        "job_application": 20,  # Change these values
        # ...
    }
}
```

---

## 📞 Need Help?

1. Check `AKSHAR_COIN_SYSTEM.md` for detailed documentation
2. Review backend console for error messages
3. Check browser console for frontend errors
4. Verify JWT token is valid
5. Ensure MongoDB is running

---

## 🎉 Success!

The Akshar Coin system is now fully integrated! Users can:
- ✅ Earn coins through various activities
- ✅ View their balance and transaction history
- ✅ Redeem coins for premium features
- ✅ Track their earnings and spending
- ✅ Get rewarded for sharing promo codes

**Start earning and redeeming coins today!** 🚀

