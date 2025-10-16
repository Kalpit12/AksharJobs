@echo off
echo ========================================
echo Deploying Backend Fix to Server
echo ========================================
echo.

echo Step 1: Uploading backend files to server...
echo.

REM Upload the fixed backend files
scp -i aksharjobs-key.pem backend/utils/db.py ubuntu@13.61.35.12:/var/www/AksharJobs/backend/utils/
scp -i aksharjobs-key.pem backend/config.py ubuntu@13.61.35.12:/var/www/AksharJobs/backend/
scp -i aksharjobs-key.pem backend/.env.production ubuntu@13.61.35.12:/var/www/AksharJobs/backend/

echo.
echo Step 2: Restarting backend service...
echo.

REM Restart the backend service
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "cd /var/www/AksharJobs && pm2 restart aksharjobs-backend"

echo.
echo Step 3: Checking backend status...
echo.

REM Check if backend is running
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 status"

echo.
echo ========================================
echo Backend Fix Deployment Complete!
echo ========================================
echo.
echo The following files were updated:
echo - backend/utils/db.py (Fixed environment loading)
echo - backend/config.py (Fixed environment loading)
echo - backend/.env.production (Created production environment)
echo.
echo Backend service has been restarted.
echo Please test your application now.
echo.
pause
