# 🚀 How to Start the Backend Server

## The Issue
The frontend (port 3003) is running, but it cannot connect to the backend API (port 3002) because the backend server is not running.

**Error Message:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED at http://localhost:3002/api/auth/login
```

## Solution: Start the Backend Server

### Option 1: Start Backend in New Terminal

1. **Open a NEW terminal/command prompt**
2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   OR
   ```bash
   node server.js
   ```

5. **Verify it's running:**
   - You should see a message like: `Server running on port 3002`
   - Or: `MongoDB connected successfully`

### Option 2: Check if Backend is Already Running

1. **Check running processes:**
   ```bash
   netstat -ano | findstr :3002
   ```

2. **If nothing shows, the backend is NOT running**

### Option 3: Start with npm scripts

If there's a root-level package.json with scripts:

```bash
npm run server
```
OR
```bash
npm run dev
```

## After Starting Backend

Once the backend is running on port 3002, you can:

1. ✅ **Login** with Dhruv Patel's credentials:
   - Email: `dhruvpatel771@gmail.com`
   - Password: `Dhruv@123`

2. ✅ **Fill the registration form** - All fields will save to the database

3. ✅ **Submit the form** - Data will persist in MongoDB

4. ✅ **View in Dashboard** - My Profile page will display all data

5. ✅ **Test complete flow** - From login → form → dashboard

## Expected Backend Endpoints

The frontend is trying to connect to:
- `http://localhost:3002/api/auth/login` - User login
- `http://localhost:3002/api/jobseeker/profile` - Get/Update profile
- `http://localhost:3002/api/notifications/` - Notifications
- `http://localhost:3002/api/messages/` - Messages

## Database Requirements

The backend likely needs:
- **MongoDB** running (local or cloud connection)
- **Environment variables** configured (`.env` file)
- **Database connection string** set up

## Troubleshooting

### If backend won't start:

1. **Check for missing dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Check for .env file:**
   ```bash
   # backend/.env should contain:
   PORT=3002
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Check if MongoDB is running:**
   - If using local MongoDB: Start MongoDB service
   - If using MongoDB Atlas: Check connection string

4. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v14 or higher

5. **Look for error messages** when starting the backend

## Once Backend is Running

### Test the Complete Flow:

1. **Login Page** (`http://localhost:3003/login`)
   - Email: `dhruvpatel771@gmail.com`
   - Password: `Dhruv@123`

2. **Registration Form** (`http://localhost:3003/jobseeker-registration`)
   - Fill all 31 fields
   - Auto-save will store to localStorage
   - Submit will send to backend

3. **Dashboard** (`http://localhost:3003/jobseeker-dashboard`)
   - Click "My Profile"
   - Verify all data is displayed
   - Test edit functionality

### Verify Data Flow:

```javascript
// Check localStorage
localStorage.getItem('jobseeker_registration_temp')

// Check if backend is saving
// After form submission, check MongoDB or use backend API to verify
```

## Current Status

- ✅ **Frontend**: Running on port 3003
- ❌ **Backend**: NOT running on port 3002 (NEEDS TO BE STARTED)
- ✅ **Form**: All fields present and working
- ✅ **Dashboard**: All fields added to My Profile
- ✅ **Auto-save**: Working with localStorage
- ❌ **API Integration**: Blocked until backend starts

## Next Steps

**START THE BACKEND SERVER** then test the complete flow with Dhruv Patel's credentials.

