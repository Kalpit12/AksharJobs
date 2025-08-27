# PowerShell script to create test recruiter user
Write-Host "🔧 Creating Test Recruiter User..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Change to backend directory
Set-Location -Path "backend"

Write-Host ""
Write-Host "🚀 Starting test recruiter creation..." -ForegroundColor Green
Write-Host ""

# Run the Python script
try {
    python create_test_recruiter.py
} catch {
    Write-Host "❌ Error running Python script: $_" -ForegroundColor Red
    Write-Host "💡 Make sure Python is installed and in your PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "✅ Script execution completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
