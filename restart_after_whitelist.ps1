# Run this AFTER you whitelist the IP in MongoDB Atlas

Write-Host "`nRestarting backend after MongoDB Atlas whitelist..." -ForegroundColor Cyan
Write-Host ""

# Restart backend
ssh -i aksharjobs-key.pem -o "StrictHostKeyChecking=no" ubuntu@13.61.35.12 "pm2 restart akshar-backend"

Write-Host ""
Write-Host "Waiting 10 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
Write-Host ""
Write-Host "Checking backend status..." -ForegroundColor Cyan
ssh -i aksharjobs-key.pem -o "StrictHostKeyChecking=no" ubuntu@13.61.35.12 "pm2 status akshar-backend"

# Check logs
Write-Host ""
Write-Host "Recent logs:" -ForegroundColor Cyan
ssh -i aksharjobs-key.pem -o "StrictHostKeyChecking=no" ubuntu@13.61.35.12 "pm2 logs akshar-backend --lines 10 --nostream"

# Test health endpoint
Write-Host ""
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host ""
    Write-Host "SUCCESS! Backend is working!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your dashboard should now work! Refresh your browser." -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Wait another minute for MongoDB whitelist to propagate, then run this script again." -ForegroundColor Yellow
}

Write-Host ""

