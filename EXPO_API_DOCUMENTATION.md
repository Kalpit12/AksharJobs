# AksharJobs Expo Registration & Referral API

## 🎯 Overview

The Expo API uses **MongoDB** (EXPO_REGISTRATION database) to manage:
- Expo registrations with role-based organization
- Referral tracking with coin rewards system
- Leaderboards and user statistics

All data is stored securely in your local MongoDB instance, replacing the Google Sheets integration.

## 📚 Base URL

```
http://localhost:5000/api/expo
```

---

## 🔐 Authentication

Currently, the API is open (no authentication required). For production, consider adding JWT authentication.

---

## 📋 Registration Endpoints

### 1. Register for Expo

**POST** `/api/expo/register`

Register a new participant for the expo.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "role": "job_seeker",
  
  // Role-specific fields (optional)
  "experience": "3 years",
  "skills": "React, Node.js, Python",
  "location": "Mumbai",
  "jobType": "Full-time",
  "industry": "Technology"
}
```

**Supported Roles:**
- `job_seeker` - Job Seekers
- `recruiter` - Recruiters
- `mentor` - Mentors
- `trainer` - Trainers
- `consultant` - Consultants
- `volunteer` - Volunteers
- `intern` - Interns
- `community` - Community Members
- `university` - Universities
- `evangelist` - Evangelists

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration saved successfully",
  "timestamp": "2025-09-30T17:42:32.208Z",
  "registrationId": "66f9a8b8c..."
}
```

**Response (Duplicate Email):**
```json
{
  "success": false,
  "error": "Email already registered",
  "message": "This email address is already registered...",
  "duplicate": true,
  "existingEmail": "john@example.com",
  "existingName": "John Doe",
  "registeredAt": "2025-09-30T06:32:26.141Z"
}
```

---

### 2. Get All Registrations

**GET** `/api/expo/registrations?role=job_seeker&limit=100`

Retrieve registrations, optionally filtered by role.

**Query Parameters:**
- `role` (optional) - Filter by role (e.g., `job_seeker`, `recruiter`)
- `limit` (optional, default: 100) - Maximum number of results

**Response:**
```json
{
  "success": true,
  "count": 25,
  "registrations": [
    {
      "_id": "66f9a8b8c...",
      "timestamp": "2025-09-30T17:42:32.208Z",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "job_seeker",
      "experience": "3 years",
      "skills": "React, Node.js, Python",
      // ... other fields
    }
  ]
}
```

---

### 3. Get Registration by Email

**GET** `/api/expo/registration/<email>`

Get a specific registration by email address.

**Example:** `/api/expo/registration/john@example.com`

**Response:**
```json
{
  "success": true,
  "registration": {
    "_id": "66f9a8b8c...",
    "fullName": "John Doe",
    "email": "john@example.com",
    // ... all registration fields
  }
}
```

---

### 4. Get Registration Statistics

**GET** `/api/expo/registrations/stats`

Get overall registration statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "byRole": [
      { "_id": "job_seeker", "count": 65 },
      { "_id": "recruiter", "count": 40 },
      { "_id": "mentor", "count": 25 },
      // ... other roles
    ]
  }
}
```

---

## 🎁 Referral Tracking Endpoints

### 5. Track Referral

**POST** `/api/expo/referral/track`

Track a referral share or successful registration.

**Request Body (Sharing):**
```json
{
  "type": "referral",
  "referrerName": "Jane Smith",
  "referrerEmail": "jane@example.com",
  "referrerPhone": "1234567890",
  "referrerRole": "job_seeker",
  "platform": "whatsapp",
  "referralCode": "AKSHAR2025"
}
```

**Request Body (Registration via Referral):**
```json
{
  "type": "referral_registration",
  "referrerName": "Jane Smith",
  "referrerEmail": "jane@example.com",
  "referrerPhone": "1234567890",
  "referrerRole": "job_seeker",
  "referredEmail": "newuser@example.com",
  "platform": "email",
  "referralCode": "AKSHAR2025"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Referral shared via whatsapp! You earned 3 coins for sharing.",
  "actionType": "share",
  "timestamp": "2025-09-30T17:44:11.910Z",
  "coinsEarned": 3,
  "totalCoins": 15,
  "referralCount": 2
}
```

**Coin Rewards:**
- 🪙 **3 coins** - For sharing referral link
- 🪙 **1 coin** - Bonus when someone registers via your link

---

### 6. Get Referral Data

**GET** `/api/expo/referral/data?email=jane@example.com`

Get referral data for a specific user or all users.

**Query Parameters:**
- `email` (optional) - Filter by user email

**Response:**
```json
{
  "success": true,
  "message": "Found 1 referral record(s)",
  "records": [
    {
      "_id": "66f9a8b8c...",
      "referrerName": "Jane Smith",
      "referrerEmail": "jane@example.com",
      "referrerPhone": "1234567890",
      "referrerRole": "job_seeker",
      "referralCount": 5,
      "totalCoins": 18,
      "timestamp": "2025-09-25T10:00:00.000Z",
      "lastActivity": "2025-09-30T17:44:11.910Z",
      "referralCode": "AKSHAR2025",
      "platform": "whatsapp"
    }
  ]
}
```

---

### 7. Get Leaderboard

**GET** `/api/expo/referral/leaderboard?limit=50`

Get the referral leaderboard sorted by coins.

**Query Parameters:**
- `limit` (optional, default: 50) - Number of top users to return

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "name": "Top Referrer",
      "email": "top@example.com",
      "totalCoins": 150,
      "referralCount": 25,
      "role": "job_seeker"
    },
    {
      "rank": 2,
      "name": "Second Place",
      "email": "second@example.com",
      "totalCoins": 120,
      "referralCount": 20,
      "role": "recruiter"
    }
    // ... more users
  ]
}
```

---

### 8. Get User Statistics

**GET** `/api/expo/referral/stats/<email>`

Get detailed statistics for a specific user.

**Example:** `/api/expo/referral/stats/jane@example.com`

**Response:**
```json
{
  "success": true,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "totalCoins": 18,
  "referralCount": 5,
  "successfulRegistrations": 5,
  "referralCode": "AKSHAR2025",
  "memberSince": "2025-09-25T10:00:00.000Z",
  "lastActivity": "2025-09-30T17:44:11.910Z"
}
```

---

## 🔄 Legacy Compatibility Endpoint

### 9. Check Registration (Legacy)

**GET** `/api/expo/check_registration?email=john@example.com`

Check if a user is registered (maintains compatibility with existing frontend).

**Response:**
```json
{
  "registered": true,
  "message": "User is registered",
  "userData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "job_seeker",
    "timestamp": "2025-09-30T17:42:32.208Z"
  }
}
```

---

## 🏥 Health Check

### 10. Health Check

**GET** `/api/expo/health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "AksharJobs Expo API is running",
  "timestamp": "2025-09-30T17:42:32.208Z"
}
```

---

## 💾 Database Structure

### Collections in EXPO_REGISTRATION Database:

1. **registrations** - All expo registrations
   - Indexed on: email (unique), role, timestamp
   
2. **referral_tracking** - User referral data and coin balances
   - Indexed on: referrerEmail, timestamp
   
3. **referral_clicks** - Individual referral click tracking (prevents duplicates)
   - Indexed on: referrerEmail + referredEmail

---

## 🚀 Getting Started

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
# Default: mongodb://localhost:27017/
```

### 2. Start Backend Server
```bash
cd backend
python app.py
# Server runs on http://localhost:5000
```

### 3. Test the API
```bash
# Test health check
curl http://localhost:5000/api/expo/health

# Test registration
curl -X POST http://localhost:5000/api/expo/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "job_seeker"
  }'
```

---

## 📊 Advantages Over Google Sheets

✅ **Performance**: 10-100x faster queries  
✅ **Scalability**: Handle millions of records  
✅ **Security**: No public API URLs  
✅ **No Rate Limits**: Unlimited requests  
✅ **Real-time**: Instant coin updates  
✅ **Reliability**: No external API dependencies  
✅ **Powerful Queries**: MongoDB aggregation pipeline  
✅ **Better Data Integrity**: Unique indexes, validations  

---

## 🔧 Configuration

The API connects to MongoDB using settings from `backend/utils/db.py`:

```python
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "TalentMatchDB"  # Main app database
EXPO_DB = "EXPO_REGISTRATION"  # Expo database
```

---

## 📝 Notes

- All timestamps are in UTC (ISO 8601 format)
- Duplicate emails are automatically prevented with unique index
- Referral clicks are tracked to prevent duplicate coin awards
- Role-based organization happens automatically in MongoDB
- Frontend needs to be updated to call these endpoints instead of Google Sheets

---

## 🎯 Next Steps

1. ✅ MongoDB models created
2. ✅ API endpoints implemented
3. ✅ Routes registered in Flask app
4. ⏳ Update frontend to use new API endpoints
5. ⏳ Test complete registration flow
6. ⏳ Test referral tracking and coins
7. ⏳ Deploy to production

---

For questions or issues, check the backend logs or MongoDB collections directly.

