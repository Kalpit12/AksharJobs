# 🚀 Login System - Quick Start Guide

## For Users

### How to Login

1. **Go to the landing page** (expo_landing.html or index.html)

2. **Click the "Login" button** in the header (top right)

3. **Enter your registered email** in the popup

4. **Click "Login"** button

5. **Done!** You're now logged in and can access your dashboard

### What You Can Do After Login

✅ **View Your Dashboard**
- Click your name/avatar in the header
- See your AksharCoins balance
- Check your referral statistics

✅ **Share Referrals**
- Click "Share Your Referral Link" in dashboard
- Choose any platform (WhatsApp, Email, SMS, etc.)
- Earn 3 coins for each platform you share on

✅ **Stay Logged In**
- Your session persists across page visits
- No need to login again unless you logout

✅ **Logout Anytime**
- Click "Logout" button in your dashboard
- Your data is saved and you can login again later

---

## For Developers

### Files Changed

1. **expo_landing.html** - Login button, modal, CSS
2. **index.html** - Same as expo_landing.html  
3. **expo_landing.js** - All login functions

### Key Functions

```javascript
// Open login modal
openLoginModal()

// Handle login form submission
handleLogin(event)

// Open user dashboard
openUserDashboard()

// Logout user
handleLogout()

// Check if user is logged in on page load
checkLoginStatus()
```

### Testing

Open any landing page and:
1. Click "Login" button
2. Enter a registered email
3. Verify login works
4. Check dashboard opens
5. Test logout

---

## Common Issues

### ❌ "Email not found"
**Solution**: User needs to register first using the registration form

### ❌ Login button doesn't work
**Solution**: Clear browser cache and refresh page

### ❌ Can't see dashboard
**Solution**: Make sure you're logged in (check for profile button in header)

---

## Quick Reference

| Action | Location | Result |
|--------|----------|--------|
| Login | Header "Login" button | Opens login modal |
| Dashboard | Header profile button | Opens dashboard |
| Share | Dashboard "Share" button | Opens referral modal |
| Logout | Dashboard "Logout" button | Logs out user |

---

**Status**: ✅ Ready to Use  
**Date**: October 8, 2025

