# Fix MongoDB Connection - DNS Timeout Issue

## Problem
Your backend is experiencing DNS timeout errors when trying to connect to MongoDB Atlas:
```
pymongo.errors.ConfigurationError: The resolution lifetime expired after 60.015 seconds
```

This prevents the Candidate Tracker and other features from loading data.

## Solution 1: Use Local MongoDB (Recommended)

You already have local MongoDB running. Let's use it instead of Atlas.

### Step 1: Create/Update `.env` file

Create a file named `.env` in the `backend` folder with:

```env
# MongoDB Configuration - Use Local MongoDB
MONGO_URI=mongodb://localhost:27017/
DB_NAME=TalentMatchDB

# JWT Secret
SECRET_KEY=your-secret-key-here-change-in-production

# Gemini API (if you have it)
GEMINI_API_KEY=your-gemini-key-here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Step 2: Restart Your Backend

```bash
cd backend
python start_backend.py
```

## Solution 2: Fix MongoDB Atlas Connection (If You Need Cloud)

If you need to use MongoDB Atlas, try these steps:

### Option A: Use Standard Connection String Instead of SRV

Change your `MONGO_URI` from:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

To:
```
mongodb://username:password@host1:27017,host2:27017/dbname?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin
```

You can get this from MongoDB Atlas → Connect → Drivers → "Connection String Only"

### Option B: Fix DNS Issues

1. **Change DNS Servers** (Windows):
   - Open Settings → Network & Internet → Change adapter options
   - Right-click your network → Properties
   - Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
   - Use these DNS servers:
     - Preferred: `8.8.8.8` (Google)
     - Alternate: `1.1.1.1` (Cloudflare)
   - Click OK and restart your network

2. **Flush DNS Cache**:
   ```powershell
   ipconfig /flushdns
   ```

3. **Test Connection**:
   ```bash
   ping google.com
   nslookup cluster0.xxxxx.mongodb.net
   ```

## Solution 3: Quick Environment Variable Override

You can also temporarily override the connection in `backend/utils/db.py`:

Find this line:
```python
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
```

Change it to:
```python
MONGO_URI = "mongodb://localhost:27017/"  # Force local MongoDB
```

## Verify It's Working

After applying the fix:

1. Restart backend: `python start_backend.py`
2. Check terminal output - should see:
   ```
   [OK] MongoDB connected successfully!
   [DEBUG] Database name: TalentMatchDB
   ```
3. Open http://localhost:3003
4. Log in as recruiter
5. Go to Candidate Tracker
6. You should see your 15 applications!

## Current Database Status

Your local MongoDB has:
- **Database:** TalentMatchDB
- **Jobs:** 5
- **Applications:** 15
- **Users:** Multiple

All data is ready to be displayed once the connection works!

## Need Help?

If issues persist:
1. Make sure MongoDB service is running: `net start MongoDB`
2. Test connection: `cd backend && python test_db_connection.py`
3. Check which port MongoDB is running on: `netstat -an | findstr :27017`

---

**Recommended:** Use local MongoDB for development. It's faster and doesn't require internet!

