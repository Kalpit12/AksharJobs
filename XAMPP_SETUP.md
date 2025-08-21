# Running Website with XAMPP

## Prerequisites
1. **XAMPP installed** - Download from [apachefriends.org](https://www.apachefriends.org/download.html)
2. **Python backend dependencies** - Run `pip install -r requirements.txt` in backend folder
3. **Node.js frontend dependencies** - Run `npm install` in frontend folder

## Setup Steps

### 1. Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Ensure both services are running (green status)

### 2. Start Backend
```bash
cd backend
python app.py
```
Backend runs on: http://localhost:5000

### 3. Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3001

## Accessing Your Website

### Local Access:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3001

### Database Access:
- **phpMyAdmin**: http://localhost/phpmyadmin
- **MySQL**: localhost:3306

## Configuration

### Backend Database:
- Update `backend/config.py` with your MySQL credentials
- Default: localhost:3306

### Frontend:
- All API calls use `http://localhost:5000`
- No configuration changes needed

## Troubleshooting

### Port Conflicts:
- Ensure ports 5000 and 3001 are free
- Kill existing processes if needed

### Database Issues:
- Check MySQL service is running in XAMPP
- Verify database credentials in config.py

### CORS Issues:
- Backend allows localhost:3000 and localhost:3001
- No external domain access needed
