Write-Host "🚀 Starting AksharJobs Unified Server..." -ForegroundColor Green
Write-Host ""
Write-Host "📁 Backend Directory: $PWD" -ForegroundColor Cyan
Write-Host "🌐 Server will run on: http://192.168.1.145:3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    python app.py
} catch {
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
