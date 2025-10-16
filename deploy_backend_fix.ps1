Write-Host "========================================" -ForegroundColor Green
Write-Host "Deploying Backend Fix to Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Uploading backend files to server..." -ForegroundColor Yellow
Write-Host ""

# Upload the fixed backend files
Write-Host "Uploading db.py..." -ForegroundColor Cyan
scp -i aksharjobs-key.pem backend/utils/db.py ubuntu@13.61.35.12:/var/www/AksharJobs/backend/utils/

Write-Host "Uploading config.py..." -ForegroundColor Cyan
scp -i aksharjobs-key.pem backend/config.py ubuntu@13.61.35.12:/var/www/AksharJobs/backend/

Write-Host "Uploading .env.production..." -ForegroundColor Cyan
scp -i aksharjobs-key.pem backend/.env.production ubuntu@13.61.35.12:/var/www/AksharJobs/backend/

Write-Host ""
Write-Host "Step 2: Restarting backend service..." -ForegroundColor Yellow
Write-Host ""

# Restart the backend service
Write-Host "Restarting PM2 backend service..." -ForegroundColor Cyan
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "cd /var/www/AksharJobs && pm2 restart aksharjobs-backend"

Write-Host ""
Write-Host "Step 3: Checking backend status..." -ForegroundColor Yellow
Write-Host ""

# Check if backend is running
Write-Host "Checking PM2 status..." -ForegroundColor Cyan
ssh -i aksharjobs-key.pem ubuntu@13.61.35.12 "pm2 status"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Backend Fix Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "The following files were updated:" -ForegroundColor White
Write-Host "- backend/utils/db.py (Fixed environment loading)" -ForegroundColor Gray
Write-Host "- backend/config.py (Fixed environment loading)" -ForegroundColor Gray
Write-Host "- backend/.env.production (Created production environment)" -ForegroundColor Gray
Write-Host ""
Write-Host "Backend service has been restarted." -ForegroundColor White
Write-Host "Please test your application now." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
