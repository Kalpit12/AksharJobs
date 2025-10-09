# MongoDB Data Storage Guide - EXPO_REGISTRATION

## 🗄️ Database Structure

Your expo data is stored in the **`EXPO_REGISTRATION`** database with 3 main collections:

---

## 📊 Collections Overview

### 1. **registrations** - User Registrations
**Path:** `EXPO_REGISTRATION > registrations`

**What's stored:**
- User registration data from the expo landing page
- All role-specific fields (job seekers, recruiters, mentors, etc.)
- Timestamps and notification status

**Fields:**
```javascript
{
  _id: ObjectId("..."),                    // Unique registration ID
  timestamp: ISODate("2025-09-30..."),    // When registered
  fullName: "John Doe",                    // User's full name
  email: "john@example.com",               // Email (unique index)
  phone: "1234567890",                     // Phone number
  role: "job_seeker",                      // User role
  
  // Role-specific fields (based on selection)
  // Job Seeker fields:
  experience: "3 years",
  skills: "Python, JavaScript, MongoDB",
  location: "Nairobi, Kenya",
  jobType: "Full-time",
  industry: "Technology",
  
  // Recruiter fields:
  company: "",
  position: "",
  companySize: "",
  hiringVolume: "",
  
  // And more fields for other roles...
  
  notificationStatus: "Pending Notification",
  registrationType: "registration"
}
```

**How to view in MongoDB Compass:**
1. Click on `EXPO_REGISTRATION` database
2. Click on `registrations` collection
3. View documents in the Documents tab

**MongoDB Shell Queries:**
```javascript
// View all registrations
db.registrations.find().pretty()

// Count total registrations
db.registrations.countDocuments()

// Find by email
db.registrations.findOne({email: "john@example.com"})

// Find by role
db.registrations.find({role: "job_seeker"})

// Get registrations from today
db.registrations.find({
  timestamp: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
})

// Count by role
db.registrations.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

### 2. **referral_tracking** - Referral Data & Coins
**Path:** `EXPO_REGISTRATION > referral_tracking`

**What's stored:**
- User referral statistics
- Akshar coins balance
- Referral counts
- Platform sharing activity

**Fields:**
```javascript
{
  _id: ObjectId("..."),                    // Unique tracking ID
  referrerName: "Jane Smith",              // Referrer's name
  referrerEmail: "jane@example.com",       // Referrer's email (indexed)
  referrerPhone: "9876543210",             // Phone number
  referrerRole: "recruiter",               // User role
  referralCount: 5,                        // Total successful referrals
  totalCoins: 18,                          // Total Akshar coins earned
  timestamp: ISODate("2025-09-30..."),    // First referral date
  lastActivity: ISODate("2025-09-30..."), // Last activity
  referralCode: "AKSHAR2025",             // Referral code used
  platform: "whatsapp"                     // Last sharing platform
}
```

**How to view in MongoDB Compass:**
1. Click on `EXPO_REGISTRATION` database
2. Click on `referral_tracking` collection
3. Sort by `totalCoins` descending to see top referrers

**MongoDB Shell Queries:**
```javascript
// View all referral data
db.referral_tracking.find().pretty()

// Get top 10 referrers by coins
db.referral_tracking.find()
  .sort({totalCoins: -1})
  .limit(10)

// Find specific user's referral data
db.referral_tracking.findOne({referrerEmail: "jane@example.com"})

// Get users with most referrals
db.referral_tracking.find()
  .sort({referralCount: -1})
  .limit(10)

// Total coins awarded
db.referral_tracking.aggregate([
  { $group: { _id: null, totalCoins: { $sum: "$totalCoins" } } }
])

// Active referrers today
db.referral_tracking.find({
  lastActivity: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
})
```

---

### 3. **referral_clicks** - Referral Click Tracking
**Path:** `EXPO_REGISTRATION > referral_clicks`

**What's stored:**
- Individual referral click events
- Prevents duplicate coin awards
- Links referrer to referred user

**Fields:**
```javascript
{
  _id: ObjectId("..."),                    // Unique click ID
  referrerEmail: "jane@example.com",       // Who shared the link
  referredEmail: "newuser@example.com",    // Who registered via link
  timestamp: ISODate("2025-09-30..."),    // When clicked/registered
  coinsAwarded: 1                          // Bonus coins given
}
```

**Purpose:**
- Tracks each unique referral registration
- Ensures each referrer-referee pair only gets coins once
- Provides audit trail of referral activities

**MongoDB Shell Queries:**
```javascript
// View all clicks
db.referral_clicks.find().pretty()

// Find who referred a specific user
db.referral_clicks.findOne({referredEmail: "newuser@example.com"})

// Count total referral registrations
db.referral_clicks.countDocuments()

// Get all people referred by someone
db.referral_clicks.find({referrerEmail: "jane@example.com"})

// Total bonus coins awarded
db.referral_clicks.aggregate([
  { $group: { _id: null, total: { $sum: "$coinsAwarded" } } }
])
```

---

## 🔍 Using MongoDB Compass (GUI)

### Viewing Data:
1. **Connect** to `mongodb://localhost:27017`
2. **Select** `EXPO_REGISTRATION` database (left sidebar)
3. **Click** on any collection name
4. **View** documents in the Documents tab

### Filtering Data:
In the Filter field at top:
```javascript
// Find by email
{email: "john@example.com"}

// Find job seekers
{role: "job_seeker"}

// Find users with skills containing Python
{skills: {$regex: "Python", $options: "i"}}

// Find users registered today
{timestamp: {$gte: new Date("2025-09-30")}}
```

### Sorting Data:
Click on column headers or use Sort field:
```javascript
// Sort by newest first
{timestamp: -1}

// Sort by coins (highest first)
{totalCoins: -1}

// Sort by name
{fullName: 1}
```

---

## 📈 Useful Aggregations

### Get Registration Stats:
```javascript
db.registrations.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 },
      users: { $push: "$fullName" }
    }
  },
  { $sort: { count: -1 } }
])
```

### Get Referral Leaderboard:
```javascript
db.referral_tracking.aggregate([
  {
    $project: {
      referrerName: 1,
      referrerEmail: 1,
      totalCoins: 1,
      referralCount: 1,
      rank: 1
    }
  },
  { $sort: { totalCoins: -1 } },
  { $limit: 10 }
])
```

### Get Daily Registration Count:
```javascript
db.registrations.aggregate([
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
])
```

---

## 🔐 Indexes Created

For better performance, these indexes are automatically created:

### registrations collection:
- `email` (unique) - Fast email lookups, prevents duplicates
- `role` - Fast filtering by role
- `timestamp` (descending) - Fast date-based queries

### referral_tracking collection:
- `referrerEmail` - Fast referrer lookups
- `timestamp` (descending) - Fast date queries

### referral_clicks collection:
- `referrerEmail + referredEmail` (compound) - Prevent duplicate referrals

---

## 📊 Sample Queries for Reports

### Total Users by Role:
```javascript
db.registrations.aggregate([
  { $group: { _id: "$role", total: { $sum: 1 } } }
])
```

### Top 10 Cities by Registrations:
```javascript
db.registrations.aggregate([
  { $group: { _id: "$location", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Most Popular Skills:
```javascript
db.registrations.aggregate([
  { $match: { skills: { $exists: true, $ne: "" } } },
  { $group: { _id: "$skills", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### Referral Conversion Rate:
```javascript
// Total registrations
var totalRegs = db.registrations.countDocuments()

// Referral registrations
var refRegs = db.referral_clicks.countDocuments()

// Calculate rate
print("Conversion Rate: " + (refRegs/totalRegs*100).toFixed(2) + "%")
```

---

## 🗺️ Complete Database Path

```
MongoDB Server (localhost:27017)
  └── TalentMatchDB (main application database)
  └── EXPO_REGISTRATION (expo database) ← YOUR DATA IS HERE
      ├── registrations (user registrations)
      │   ├── Document 1: {_id, fullName, email, role, ...}
      │   ├── Document 2: {_id, fullName, email, role, ...}
      │   └── ...
      │
      ├── referral_tracking (coins & referrals)
      │   ├── Document 1: {_id, referrerEmail, totalCoins, ...}
      │   ├── Document 2: {_id, referrerEmail, totalCoins, ...}
      │   └── ...
      │
      └── referral_clicks (referral events)
          ├── Document 1: {_id, referrerEmail, referredEmail, ...}
          ├── Document 2: {_id, referrerEmail, referredEmail, ...}
          └── ...
```

---

## 🚀 Quick Access Commands

### MongoDB Shell:
```bash
# Open MongoDB shell
mongo

# Switch to expo database
use EXPO_REGISTRATION

# View all collections
show collections

# Count documents
db.registrations.countDocuments()
db.referral_tracking.countDocuments()
db.referral_clicks.countDocuments()

# View latest registration
db.registrations.findOne({}, {}, {sort: {timestamp: -1}})

# Export data to JSON
mongoexport --db=EXPO_REGISTRATION --collection=registrations --out=registrations.json

# Backup database
mongodump --db=EXPO_REGISTRATION --out=./backup
```

---

## 📝 Notes

- **Unique Constraint:** Email addresses in `registrations` are unique
- **Automatic Timestamps:** MongoDB adds timestamps automatically
- **Indexing:** Collections are indexed for fast queries
- **Data Persistence:** Data survives server restarts
- **Backup:** Use `mongodump` for regular backups

---

**Your MongoDB data is safe and queryable!** 🎉

