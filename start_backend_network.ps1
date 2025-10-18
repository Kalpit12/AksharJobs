# Start Backend for Network Access
# This script starts the Flask backend accessible from other devices

Write-Host "`n🚀 Starting Backend for Network Access" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path ".\app.py")) {
    Write-Host "`n❌ Error: app.py not found!" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory." -ForegroundColor Yellow
    exit 1
}

# Get local IP for display
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    ($_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*")
} | Select-Object -First 1).IPAddress

Write-Host "`n✅ Configuration:" -ForegroundColor Green
Write-Host "   Host: 0.0.0.0 (accessible from network)" -ForegroundColor White
Write-Host "   Port: 3002" -ForegroundColor White
Write-Host ""

if ($localIP) {
    Write-Host "📱 Backend accessible at:" -ForegroundColor Cyan
    Write-Host "   Local:   http://localhost:3002" -ForegroundColor White
    Write-Host "   Network: http://$localIP`:3002" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🔄 Starting Flask backend server..." -ForegroundColor Yellow
Write-Host "⏹️  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
python start_backend.py

