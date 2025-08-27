# MongoDB Local Setup Guide for RocketJobs

## Prerequisites
- Python 3.8+ installed
- MongoDB Community Edition installed locally
- pip (Python package manager)

## 1. Install MongoDB Locally

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service and start automatically

### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 2. Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongo --version
# or
mongosh --version

# Connect to MongoDB shell
mongosh
# or
mongo
```

## 3. Create Database and User

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create a new database for RocketJobs
use rocketjobs

# Create a user (optional but recommended)
db.createUser({
  user: "rocketjobs_user",
  pwd: "your_secure_password",
  roles: ["readWrite"]
})

# Exit MongoDB shell
exit
```

## 4. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 5. Environment Configuration

Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
DB_NAME=rocketjobs

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Optional: Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

## 6. Start the Backend Server

```bash
# Make sure you're in the backend directory and virtual environment is activated
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Start Flask server
python app.py
```

The server should start on `http://localhost:5000`

## 7. Test the Connection

### Test MongoDB Connection:
```bash
# In a new terminal, connect to MongoDB
mongosh
use rocketjobs
show collections
```

### Test API Endpoints:
```bash
# Test if the server is running
curl http://localhost:5000/

# Test CORS
curl http://localhost:5000/test-cors
```

## 8. Frontend Connection

The frontend is now configured to connect to:
- Backend URL: `http://localhost:5000`
- Authentication endpoints: `/api/auth/login`, `/api/auth/signup`

## Troubleshooting

### MongoDB Connection Issues:
1. Check if MongoDB service is running
2. Verify MongoDB is listening on port 27017
3. Check firewall settings

### Port Already in Use:
If port 5000 is already in use, change it in `app.py`:
```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)  # Change port to 5001
```

### CORS Issues:
The backend is configured to allow all origins for development. In production, restrict this to your frontend domain.

## Security Notes

1. **Never commit your `.env` file** - it contains sensitive information
2. **Change the SECRET_KEY** in production
3. **Restrict MongoDB access** in production environments
4. **Use HTTPS** in production
5. **Implement rate limiting** for authentication endpoints

## Next Steps

1. Test user registration and login
2. Implement email verification (optional)
3. Add password reset functionality
4. Set up user roles and permissions
5. Implement JWT token refresh
