@echo off
echo ========================================
echo   Starting MongoDB and Testing AI Features
echo ========================================
echo.

echo Attempting to start MongoDB service...
net start MongoDB 2>nul

if %errorlevel% equ 0 (
    echo ✅ MongoDB service started successfully!
    goto :backend
)

echo.
echo ⚠️ MongoDB service not found or already running
echo.
echo Checking if MongoDB is accessible...
mongosh --eval "db.version()" 2>nul

if %errorlevel% equ 0 (
    echo ✅ MongoDB is already running!
    goto :backend
)

echo.
echo ❌ MongoDB is not running!
echo.
echo Please start MongoDB using one of these methods:
echo.
echo 1. Windows Service:
echo    net start MongoDB
echo.
echo 2. Manual Start:
echo    cd "C:\Program Files\MongoDB\Server\7.0\bin"
echo    mongod --dbpath "C:\data\db"
echo.
echo 3. Docker (Easiest):
echo    docker run -d -p 27017:27017 --name mongodb mongo:latest
echo.
echo After MongoDB is running, run this script again.
echo.
pause
exit /b 1

:backend
echo.
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.

cd backend
start "AksharJobs Backend" cmd /k python app.py

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   Setting Up Test Accounts
echo ========================================
echo.

python setup_ai_test_accounts.py

echo.
echo ========================================
echo   Running AI Features Tests
echo ========================================
echo.
echo Press any key to run automated tests...
pause >nul

python test_ai_features_complete.py

echo.
echo ========================================
echo   Test Complete!
echo ========================================
echo.
echo To test in browser:
echo   1. Start frontend: cd ..\frontend ^&^& npm start
echo   2. Visit: http://localhost:3000
echo   3. Login with test accounts (shown above)
echo.
echo Backend is running at: http://localhost:3002
echo.
pause

