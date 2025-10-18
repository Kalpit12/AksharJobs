# Recruiter Form Test Script

This Python script tests the recruiter registration form to ensure data is being saved correctly to MongoDB in the `recruiters` collection.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **MongoDB** running locally or accessible via network
3. **Backend API** running (usually on port 3003)
4. **Frontend** running (usually on port 3000)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

Before running the test, update the configuration in `test_recruiter_form.py`:

```python
# Configuration
API_BASE_URL = "http://localhost:3003"  # Your backend API URL
MONGODB_URI = "mongodb://localhost:27017"  # Your MongoDB connection string
DATABASE_NAME = "aksharjobs"  # Your database name
COLLECTION_NAME = "recruiters"  # Collection name for recruiters
```

## Usage

### Run the test script:
```bash
python test_recruiter_form.py
```

### What the script does:

1. **Generates realistic test data** for a recruiter registration
2. **Tests the API endpoint** (`/api/recruiter/register`)
3. **Verifies MongoDB connection** and checks the `recruiters` collection
4. **Confirms data was saved** by checking document count increase
5. **Searches for the specific recruiter** by email to verify data integrity

### Sample Output:

```
🚀 Starting Recruiter Form Test
==================================================
📝 Generating test data...
✅ Generated test data for: TechCorp Solutions
📧 Email: techcorpsolutions@gmail.com

🔍 Testing MongoDB connection...
✅ Connected to MongoDB: mongodb://localhost:27017
📊 Database: aksharjobs
📋 Collection: recruiters
📈 Total documents in 'recruiters' collection: 5

🧪 Testing API endpoint...
📡 API Response Status: 200
✅ API call successful!
📄 Response: {
  "message": "Recruiter registered successfully",
  "recruiterId": "64f8a1b2c3d4e5f6a7b8c9d0"
}

⏳ Waiting 2 seconds for data to be saved...
🔍 Testing MongoDB connection...
✅ Connected to MongoDB: mongodb://localhost:27017
📊 Database: aksharjobs
📋 Collection: recruiters
📈 Total documents in 'recruiters' collection: 6

✅ SUCCESS! Data was saved to MongoDB
📈 Document count increased from 5 to 6

🔍 Searching for recruiter with email: techcorpsolutions@gmail.com
✅ Recruiter found!
   Company: TechCorp Solutions
   Email: techcorpsolutions@gmail.com
   Phone: +254712345678
   Industry: Technology & IT
   Created: 2024-01-15T10:30:45.123Z

==================================================
🏁 Test completed!
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check the connection string in the script
   - Verify database and collection names

2. **API Connection Failed**
   - Ensure the backend API is running
   - Check the API_BASE_URL in the script
   - Verify the API endpoint exists

3. **Data Not Saved**
   - Check backend logs for errors
   - Verify the API endpoint is working
   - Check MongoDB permissions

### Debug Mode:

To see more detailed output, you can modify the script to include more logging or run it with verbose output.

## Test Data

The script generates realistic test data including:
- Company information (name, email, phone, website)
- Location data (country, state, city, coordinates)
- Recruiter personal details
- Industries and job functions
- Geographic coverage
- Social media links
- Terms and agreements

Each test run generates unique data to avoid conflicts.

## Notes

- The script waits 2 seconds after API call to allow data to be saved
- It checks both document count increase and specific data search
- All test data is generated randomly but follows realistic patterns
- The script is safe to run multiple times as it generates unique data each time
