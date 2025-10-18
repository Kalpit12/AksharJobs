# Simple Backend Health Test
Write-Host "`n🧪 Testing Backend Health..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$SERVER_IP = "13.61.35.12"
$healthUrl = "http://${SERVER_IP}/api/health"

Write-Host "`nTesting: $healthUrl" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    
    Write-Host "`n✅ SUCCESS! Backend is responding!" -ForegroundColor Green
    Write-Host "`nResponse Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Content:" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor White
    Write-Host "`n🎉 Your backend is WORKING! No fix needed." -ForegroundColor Green
    Write-Host "You can refresh your dashboard now." -ForegroundColor Green
    
} catch {
    $statusCode = $null
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
    }
    
    Write-Host "`n❌ FAILED! Backend is not responding" -ForegroundColor Red
    
    if ($statusCode -eq 502) {
        Write-Host "`nError: 502 Bad Gateway" -ForegroundColor Red
        Write-Host "This means Nginx is working but the backend process (port 3002) is not running." -ForegroundColor Yellow
        Write-Host "`n🔧 SOLUTION: Run the fix script to restart the backend" -ForegroundColor Cyan
        Write-Host "   Command: .\fix_502_errors.ps1" -ForegroundColor White
    } elseif ($statusCode -eq 404) {
        Write-Host "`nError: 404 Not Found" -ForegroundColor Red
        Write-Host "The health endpoint does not exist." -ForegroundColor Yellow
    } elseif ($statusCode -eq 500) {
        Write-Host "`nError: 500 Internal Server Error" -ForegroundColor Red
        Write-Host "Backend is running but has an error. Check logs." -ForegroundColor Yellow
    } else {
        Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "`nPossible causes:" -ForegroundColor Yellow
        Write-Host "  - Backend server is down" -ForegroundColor White
        Write-Host "  - Network connectivity issue" -ForegroundColor White
        Write-Host "  - Firewall blocking connection" -ForegroundColor White
        Write-Host "`n🔧 Try running: .\fix_502_errors.ps1" -ForegroundColor Cyan
    }
}

Write-Host "`n" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
