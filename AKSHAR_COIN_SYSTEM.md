# 🪙 Akshar Coin System - Complete Implementation Guide

## Overview

The Akshar Coin system is a comprehensive rewards and redemption platform integrated into AksharJobs. Users can earn coins through various activities and redeem them for premium features and services.

---

## ✨ Key Features

### 🎯 For Job Seekers
- **Earn Coins:**
  - ₳50 when someone uses your promo code
  - ₳100 for successful referrals
  - ₳200 for completing your profile
  - ₳25 for first job application
  - ₳10 daily login bonus
  
- **Redeem Coins:**
  - ₳20 per job application
  - ₳500 for 1-month premium
  - ₳1,200 for 3-month premium (20% savings)
  - ₳2,000 for 6-month premium (33% savings)

### 💼 For Recruiters
- **Earn Coins:**
  - ₳50 when someone uses your promo code
  - ₳100 for successful referrals
  - ₳200 for completing your profile
  - ₳25 for first job post
  - ₳10 daily login bonus
  
- **Redeem Coins:**
  - ₳50 per job posting
  - ₳10 for 5 resume views
  - ₳800 for 1-month premium
  - ₳2,000 for 3-month premium (17% savings)
  - ₳3,500 for 6-month premium (27% savings)

---

## 🏗️ Architecture

### Backend Components

#### 1. **User Model** (`backend/models/user_model.py`)
- Added `akshar_coins` field (default: 100 coins)
- Added `coin_transactions` array for transaction history

#### 2. **Coin Service** (`backend/services/coin_service.py`)
- `get_user_balance()` - Get current balance and stats
- `earn_coins()` - Add coins to user account
- `spend_coins()` - Deduct coins from user account
- `redeem_coins()` - Redeem coins for specific benefits
- `get_transaction_history()` - Get coin transaction history
- `get_coin_info()` - Get rewards and costs information

#### 3. **Coin Routes** (`backend/routes/coin_routes.py`)
- `GET /api/coins/balance` - Get user's coin balance
- `POST /api/coins/earn` - Earn coins (manual/admin)
- `POST /api/coins/redeem` - Redeem coins for benefits
- `GET /api/coins/transactions` - Get transaction history
- `GET /api/coins/info` - Get coin rewards/costs info
- `POST /api/coins/spend` - Spend coins (custom actions)

#### 4. **Integration with Promo Code System**
- Updated `promo_code_service.py` to award ₳50 coins to promo code owner when someone uses their code

### Frontend Components

#### 1. **Coin API Service** (`frontend/src/api/coinApi.js`)
- Complete API integration for all coin operations
- Error handling and authentication

#### 2. **AksharCoinBalance Component** (`frontend/src/components/AksharCoinBalance.jsx`)
- Display current coin balance
- Show total earned and spent
- View recent transactions
- Refresh functionality
- Beautiful gradient design with animations

#### 3. **HowToEarnCoins Component** (`frontend/src/components/HowToEarnCoins.jsx`)
- Display all earning methods
- Show reward amounts for each method
- Pro tips for maximizing earnings
- Benefits explanation

#### 4. **HowToUseCoins Component** (`frontend/src/components/HowToUseCoins.jsx`)
- Display all redemption options
- Show current balance
- One-click redemption
- Real-time balance updates
- Insufficient balance warnings
- Success/error messages

#### 5. **Updated PromoCodePage** (`frontend/src/pages/PromoCodePage.jsx`)
- Added new "Akshar Coins" tab
- Integrated all coin components
- Seamless navigation between sections

---

## 🎨 User Interface

### Design Principles
- **Modern & Clean:** Gradient backgrounds, rounded corners, smooth animations
- **Intuitive:** Clear visual hierarchy and easy navigation
- **Responsive:** Works perfectly on all devices
- **Engaging:** Interactive elements and real-time feedback

### Color Scheme
- Primary Purple: `#667eea` to `#764ba2`
- Success Green: `#10b981`
- Warning Orange: `#f59e0b`
- Error Red: `#ef4444`
- Info Blue: `#3b82f6`

---

## 💾 Database Schema

### User Collection Updates
```javascript
{
  // ... existing fields
  "akshar_coins": 100, // Initial balance
  "coin_transactions": [
    {
      "type": "earn" | "spend",
      "amount": Number,
      "reason": String,
      "reference_id": String (optional),
      "timestamp": DateTime,
      "balance_after": Number
    }
  ]
}
```

---

## 🔄 Transaction Flow

### Earning Coins
1. User performs an action (e.g., someone uses their promo code)
2. Backend validates the action
3. `CoinService.earn_coins()` is called
4. Coins are added to user's balance
5. Transaction is recorded in `coin_transactions`
6. User is notified of the reward

### Redeeming Coins
1. User selects redemption option
2. Frontend sends redemption request
3. Backend validates sufficient balance
4. `CoinService.redeem_coins()` is called
5. Coins are deducted
6. Benefits are applied (e.g., free_applications++)
7. Transaction is recorded
8. User receives confirmation

---

## 📊 API Endpoints

### Get Balance
```
GET /api/coins/balance
Authorization: Bearer <token>

Response:
{
  "success": true,
  "balance": 150,
  "total_earned": 250,
  "total_spent": 100,
  "recent_transactions": [...]
}
```

### Redeem Coins
```
POST /api/coins/redeem
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "userType": "jobSeeker" | "recruiter",
  "redemptionType": "job_application" | "job_post" | "resume_view" | "premium_*"
}

Response:
{
  "success": true,
  "message": "Successfully redeemed 20 coins!",
  "new_balance": 130,
  "benefit": "Added 1 free_applications"
}
```

### Get Coin Info
```
GET /api/coins/info

Response:
{
  "success": true,
  "rewards": {
    "promo_code_used": 50,
    "referral_signup": 100,
    ...
  },
  "costs": {
    "job_seeker": {...},
    "recruiter": {...}
  }
}
```

---

## 🎮 How to Use (User Guide)

### Accessing the Coin System

1. **Navigate to Dashboard**
   - Job Seeker or Recruiter Dashboard

2. **Click on Promo Code / Referrals**
   - Usually in the sidebar or top menu

3. **Select "Akshar Coins" Tab**
   - You'll see three main sections:
     - Your coin balance (top)
     - How to earn coins (left)
     - How to use coins (right)

### Earning Your First Coins

**Method 1: Share Your Promo Code**
1. Go to "My Promo Code" tab
2. Copy your unique promo code
3. Share it with friends, family, or on social media
4. Earn ₳50 every time someone uses it!

**Method 2: Complete Your Profile**
1. Go to your profile settings
2. Fill out all required fields
3. Get a one-time bonus of ₳200 coins

**Method 3: Daily Login**
1. Simply log in to AksharJobs every day
2. Automatically earn ₳10 coins

### Redeeming Coins

**Job Seekers:**
1. Click on "Akshar Coins" tab
2. Scroll to "How to Use Coins" section
3. Choose your desired benefit:
   - Quick apply: ₳20 for 1 application
   - Premium: ₳500+ for premium features
4. Click "Redeem Now"
5. Benefit is applied instantly!

**Recruiters:**
1. Click on "Akshar Coins" tab
2. Scroll to "How to Use Coins" section
3. Choose your desired benefit:
   - Job posting: ₳50
   - Resume views: ₳10 for 5 views
   - Premium: ₳800+ for premium features
4. Click "Redeem Now"
5. Benefit is applied instantly!

---

## 🚀 Future Enhancements

### Planned Features
1. **Coin Gifting** - Send coins to other users
2. **Leaderboards** - Top earners monthly/weekly
3. **Special Events** - Double coin weekends
4. **Achievements** - Earn coins for milestones
5. **Coin Marketplace** - Trade coins for exclusive items
6. **Referral Tiers** - Bonus coins for multiple referrals
7. **Seasonal Rewards** - Holiday bonuses

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Balance not updating**
- Solution: Click the refresh button on the balance card
- If persists, log out and log back in

**Issue: Can't redeem coins**
- Check if you have sufficient balance
- Ensure you're logged in
- Try refreshing the page

**Issue: Coins not awarded after promo code use**
- Coins are awarded to the promo code owner, not the user
- Check transaction history for confirmation
- May take a few seconds to reflect

---

## 🔐 Security Considerations

1. **JWT Authentication:** All coin operations require valid authentication
2. **Server-side Validation:** All coin transactions validated on backend
3. **Transaction Logging:** Every coin transaction is logged for audit
4. **Balance Checks:** Insufficient balance prevents redemption
5. **Rate Limiting:** (Future) Prevent abuse through rate limiting

---

## 📈 Analytics & Monitoring

### Key Metrics to Track
- Total coins in circulation
- Average coins per user
- Most popular redemption options
- Coin earning patterns
- Redemption rates
- User engagement (before/after coin system)

---

## 👨‍💻 Developer Notes

### Adding New Earning Methods

1. Update `COIN_REWARDS` in `backend/services/coin_service.py`
2. Add earning logic in relevant service
3. Call `CoinService.earn_coins(user_id, amount, reason)`
4. Update frontend components to display new method

### Adding New Redemption Options

1. Update `COIN_COSTS` in `backend/services/coin_service.py`
2. Add redemption logic in `CoinService.redeem_coins()`
3. Update `HowToUseCoins.jsx` to display new option
4. Update CSS if needed

### Testing

```bash
# Test coin balance
curl -X GET http://localhost:5000/api/coins/balance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test redemption
curl -X POST http://localhost:5000/api/coins/redeem \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userType":"jobSeeker","redemptionType":"job_application"}'
```

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Complete coin earning system
- ✅ Complete coin redemption system
- ✅ Transaction history tracking
- ✅ Beautiful UI components
- ✅ Integration with promo code system
- ✅ Responsive design
- ✅ Real-time balance updates

---

## 🎉 Conclusion

The Akshar Coin system is now fully integrated into AksharJobs! Users can start earning coins immediately through various activities and redeem them for valuable features and services. The system is designed to increase user engagement, encourage sharing, and provide an alternative to monetary payments.

**Key Benefits:**
- 🎁 Rewards active users
- 🔄 Increases user engagement
- 📈 Encourages referrals
- 💰 Alternative to paid features
- 🌟 Gamifies the experience

---

## 📞 Support

For any issues or questions regarding the Akshar Coin system:
- Check transaction history for details
- Contact support through the platform
- Refer to this documentation

---

**Built with ❤️ for AksharJobs users**

