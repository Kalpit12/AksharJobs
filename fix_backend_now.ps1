# Simple Backend Fix Script
$SERVER = "ubuntu@13.61.35.12"
$KEY = "aksharjobs-key.pem"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  AksharJobs Backend Fix" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if key exists
if (-not (Test-Path $KEY)) {
    Write-Host "ERROR: Key file not found: $KEY" -ForegroundColor Red
    exit 1
}

Write-Host "Connecting to server..." -ForegroundColor Yellow
Write-Host ""

# Fix key permissions
icacls $KEY /inheritance:r 2>$null | Out-Null
icacls $KEY /grant:r "$($env:USERNAME):(R)" 2>$null | Out-Null

Write-Host "Step 1: Checking PM2 status..." -ForegroundColor Cyan
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "pm2 status"

Write-Host ""
Write-Host "Step 2: Restarting backend..." -ForegroundColor Cyan
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "cd /var/www/AksharJobs && pm2 restart akshar-backend || pm2 start ecosystem.config.js"

Write-Host ""
Write-Host "Step 3: Saving PM2 configuration..." -ForegroundColor Cyan
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "pm2 save"

Write-Host ""
Write-Host "Step 4: Waiting for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Step 5: Checking status..." -ForegroundColor Cyan
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "pm2 status akshar-backend"

Write-Host ""
Write-Host "Step 6: Testing health endpoint on server..." -ForegroundColor Cyan
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "curl -s http://localhost:3002/api/health"

Write-Host ""
Write-Host ""
Write-Host "Step 7: Testing public endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "SUCCESS! Backend is responding!" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor Green
} catch {
    Write-Host "WARNING: Public endpoint test failed" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Refresh your browser and check if 502 errors are gone" -ForegroundColor Yellow
Write-Host "Test URL: http://13.61.35.12/api/health" -ForegroundColor White
Write-Host ""

