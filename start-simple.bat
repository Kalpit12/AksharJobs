@echo off
echo Starting AksharJobs in Simple Mode (Network Accessible)...
echo.

echo Starting Backend on 0.0.0.0:5000 (accessible from other PCs)...
start "Backend" /d "%~dp0backend" cmd /k "python app.py"

echo.
echo Starting Frontend on 0.0.0.0:3002 (accessible from other PCs)...
start "Frontend" /d "%~dp0frontend" cmd /k "set PORT=3002 && npm start -- --host 0.0.0.0"

echo.
echo Website is starting up...
echo.
echo LOCAL ACCESS:
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3002
echo.
echo NETWORK ACCESS (for other PCs):
echo Backend API: http://%COMPUTERNAME%:5000
echo Frontend App: http://%COMPUTERNAME%:3002
echo.
echo Your computer's IP address: 
ipconfig | findstr "IPv4"
echo.
echo Other PCs can access your website using your IP address!
echo Example: http://YOUR_IP_ADDRESS:3002
echo.
echo NOTE: Make sure Windows Firewall allows connections on ports 5000 and 3002
echo.
pause
