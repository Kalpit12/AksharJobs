# Start Frontend for Network Access
# This script properly starts the React frontend accessible from other devices

Write-Host "`n🚀 Starting Frontend for Network Access" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path ".\package.json")) {
    Write-Host "`n❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the frontend directory." -ForegroundColor Yellow
    exit 1
}

# Set environment variables for network access
$env:HOST = "0.0.0.0"
$env:PORT = "3003"
$env:BROWSER = "none"

Write-Host "`n✅ Configuration:" -ForegroundColor Green
Write-Host "   Host: $env:HOST (accessible from network)" -ForegroundColor White
Write-Host "   Port: $env:PORT" -ForegroundColor White
Write-Host ""

# Get local IP for display
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    ($_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*")
} | Select-Object -First 1).IPAddress

if ($localIP) {
    Write-Host "📱 Access from other devices at:" -ForegroundColor Cyan
    Write-Host "   http://$localIP`:3003" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🔄 Starting React development server..." -ForegroundColor Yellow
Write-Host "⏹️  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
npm start

