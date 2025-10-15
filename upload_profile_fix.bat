@echo off
REM Upload updated profile routes to fix comprehensive form fields
REM Usage: upload_profile_fix.bat

set SERVER=ubuntu@13.61.35.12
set SSH_KEY=aksharjobs-key.pem
set REMOTE_PATH=/var/www/AksharJobs

echo 📤 Uploading updated profile routes to fix comprehensive form fields
echo 🔑 Using SSH key: %SSH_KEY%
echo ==============================================
echo.

REM Upload the updated profile routes file
echo Uploading backend/routes/user_profile_routes.py...
scp -i "%SSH_KEY%" backend\routes\user_profile_routes.py %SERVER%:%REMOTE_PATH%/backend/routes/

echo.
echo 🔧 Restarting backend service on server...
ssh -i "%SSH_KEY%" %SERVER% "cd /var/www/AksharJobs && pm2 restart akshar-backend"

echo.
echo ⏱️ Waiting for backend to restart...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Testing if the fix worked...
python test_backend_fields.py

echo.
echo ✅ Upload and restart complete!
echo.

pause
