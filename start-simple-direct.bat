@echo off
echo Starting AksharJobs in Simple Direct Mode...
echo.

echo Starting Backend on 0.0.0.0:5000...
echo Backend will start in a new window...
start "Backend" /d "%~dp0backend" cmd /k "python app.py"

echo.
echo Starting Frontend on 0.0.0.0:3002...
echo Frontend will start in a new window...
start "Frontend" /d "%~dp0frontend" cmd /k "set PORT=3002 && npm start -- --host 0.0.0.0"

echo.
echo ========================================
echo    🎉 Services Started!
echo ========================================
echo.
echo 📱 LOCAL ACCESS:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3002
echo.
echo 🌐 NETWORK ACCESS (for other PCs):
echo    Backend: http://%COMPUTERNAME%:5000
echo    Frontend: http://%COMPUTERNAME%:3002
echo.
echo 🔍 Your IP Addresses:
ipconfig | findstr "IPv4"
echo.
echo 💡 Other PCs can access: http://YOUR_IP_ADDRESS:3002
echo.
echo ⚠️  Check both new command windows to ensure services are running
echo.
pause
