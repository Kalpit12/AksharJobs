# Switch Backend to Use Local MongoDB on AWS Server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Switch to Local MongoDB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$SERVER = "ubuntu@13.61.35.12"
$KEY = "aksharjobs-key.pem"

Write-Host "Step 1: Upload setup script to server..." -ForegroundColor Yellow
scp -i $KEY -o "StrictHostKeyChecking=no" setup_local_mongodb.sh ${SERVER}:/tmp/

Write-Host ""
Write-Host "Step 2: Make script executable and run it..." -ForegroundColor Yellow
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "chmod +x /tmp/setup_local_mongodb.sh && sudo /tmp/setup_local_mongodb.sh"

Write-Host ""
Write-Host "Step 3: Updating .env file to use local MongoDB..." -ForegroundColor Yellow

$updateEnvCommand = @"
cd /var/www/AksharJobs/backend
# Backup current .env
cp .env .env.atlas.backup
# Update MONGO_URI to use local MongoDB
sed -i 's|MONGO_URI=mongodb+srv://.*|MONGO_URI=mongodb://localhost:27017/|g' .env
# Verify change
echo '--- Updated .env MONGO_URI ---'
grep MONGO_URI .env
"@

ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER $updateEnvCommand

Write-Host ""
Write-Host "Step 4: Restarting backend with local MongoDB..." -ForegroundColor Yellow
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "cd /var/www/AksharJobs && pm2 restart akshar-backend"

Write-Host ""
Write-Host "Step 5: Waiting 10 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Step 6: Checking backend status..." -ForegroundColor Yellow
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "pm2 status akshar-backend"

Write-Host ""
Write-Host "Step 7: Checking recent logs..." -ForegroundColor Yellow
ssh -i $KEY -o "StrictHostKeyChecking=no" $SERVER "pm2 logs akshar-backend --lines 15 --nostream"

Write-Host ""
Write-Host "Step 8: Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://13.61.35.12/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host ""
    Write-Host "SUCCESS! Backend is working with local MongoDB!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your dashboard should now work! Refresh your browser." -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Health check status: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check logs above for details. Backend may need more time to start." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "- Backend is now using LOCAL MongoDB (mongodb://localhost:27017/)" -ForegroundColor White
Write-Host "- Original Atlas config backed up to: .env.atlas.backup" -ForegroundColor White
Write-Host "- To switch back to Atlas, restore the backup" -ForegroundColor White
Write-Host ""

