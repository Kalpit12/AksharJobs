@echo off
REM Simple batch script to fix 502 errors
REM This uses SSH to restart the backend on AWS

echo ========================================
echo  Fix 502 Backend Errors
echo ========================================
echo.

set SERVER_IP=13.61.35.12
set SERVER_USER=ubuntu
set KEY_FILE=aksharjobs-key.ppk

echo Checking PuTTY installation...
if not exist "C:\Program Files\PuTTY\plink.exe" (
    echo ERROR: PuTTY not found!
    echo Please install PuTTY from: https://www.putty.org/
    pause
    exit /b 1
)

echo Checking key file...
if not exist "%KEY_FILE%" (
    echo ERROR: Key file not found: %KEY_FILE%
    echo Please ensure the key file is in the current directory
    pause
    exit /b 1
)

echo.
echo Step 1: Checking backend status...
"C:\Program Files\PuTTY\plink.exe" -i %KEY_FILE% -batch %SERVER_USER%@%SERVER_IP% "pm2 status"

echo.
echo Step 2: Restarting backend...
"C:\Program Files\PuTTY\plink.exe" -i %KEY_FILE% -batch %SERVER_USER%@%SERVER_IP% "cd /var/www/AksharJobs && pm2 restart akshar-backend || pm2 start ecosystem.config.js && pm2 save && pm2 status"

echo.
echo Step 3: Testing health endpoint...
timeout /t 3 /nobreak >nul
"C:\Program Files\PuTTY\plink.exe" -i %KEY_FILE% -batch %SERVER_USER%@%SERVER_IP% "curl -s http://localhost:3002/api/health"

echo.
echo ========================================
echo  Fix Complete!
echo ========================================
echo.
echo Please refresh your browser to test
echo.
pause

