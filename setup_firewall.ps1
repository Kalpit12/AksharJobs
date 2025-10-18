# Setup Windows Firewall for Local Network Testing
# Run this script as Administrator

Write-Host "`n🔥 Setting up Windows Firewall for Local Network Access" -ForegroundColor Cyan
Write-Host "=" -Repeat 60 -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "`n❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "   1. Right-click PowerShell" -ForegroundColor White
    Write-Host "   2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "   3. Run this script again: .\setup_firewall.ps1" -ForegroundColor White
    Write-Host ""
    
    # Offer to restart as admin
    $response = Read-Host "Would you like to restart as Administrator? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process powershell -Verb RunAs -ArgumentList "-NoExit", "-File", $PSCommandPath
    }
    
    exit
}

Write-Host "`n✅ Running with Administrator privileges" -ForegroundColor Green

# Function to check if a firewall rule exists
function Test-FirewallRule {
    param (
        [string]$DisplayName
    )
    $rule = Get-NetFirewallRule -DisplayName $DisplayName -ErrorAction SilentlyContinue
    return $null -ne $rule
}

# Function to create or update firewall rule
function Set-AppFirewallRule {
    param (
        [string]$DisplayName,
        [int]$Port,
        [string]$Description
    )
    
    Write-Host "`n📌 Configuring: $DisplayName (Port $Port)" -ForegroundColor Yellow
    
    if (Test-FirewallRule -DisplayName $DisplayName) {
        Write-Host "   ℹ️  Rule already exists, removing old rule..." -ForegroundColor Gray
        Remove-NetFirewallRule -DisplayName $DisplayName -ErrorAction SilentlyContinue
    }
    
    try {
        New-NetFirewallRule `
            -DisplayName $DisplayName `
            -Description $Description `
            -Direction Inbound `
            -LocalPort $Port `
            -Protocol TCP `
            -Action Allow `
            -Profile Domain,Private `
            -Enabled True `
            -ErrorAction Stop | Out-Null
        
        Write-Host "   ✅ Successfully configured!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "   ❌ Failed to create rule: $_" -ForegroundColor Red
        return $false
    }
}

# Create firewall rules
Write-Host "`n🔧 Creating firewall rules..." -ForegroundColor Cyan

$rules = @(
    @{
        Name = "AksharJobs Backend (Port 3002)"
        Port = 3002
        Description = "Allow local network access to AksharJobs backend server"
    },
    @{
        Name = "AksharJobs Frontend (Port 3003)"
        Port = 3003
        Description = "Allow local network access to AksharJobs frontend server"
    }
)

$successCount = 0
foreach ($rule in $rules) {
    if (Set-AppFirewallRule -DisplayName $rule.Name -Port $rule.Port -Description $rule.Description) {
        $successCount++
    }
}

# Summary
Write-Host "`n" + ("=" -Repeat 60) -ForegroundColor Cyan
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   Rules configured: $successCount / $($rules.Count)" -ForegroundColor White

if ($successCount -eq $rules.Count) {
    Write-Host "`n✅ Firewall configuration complete!" -ForegroundColor Green
    Write-Host "`nYou can now access the website from other devices on your network." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some rules failed to configure" -ForegroundColor Yellow
    Write-Host "   Please check the errors above and try again." -ForegroundColor Yellow
}

# Test the rules
Write-Host "`n🔍 Verifying firewall rules..." -ForegroundColor Cyan
foreach ($rule in $rules) {
    if (Test-FirewallRule -DisplayName $rule.Name) {
        Write-Host "   ✅ $($rule.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($rule.Name)" -ForegroundColor Red
    }
}

# Display next steps
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Get your IP: .\get_local_ip.ps1" -ForegroundColor White
Write-Host "   2. Start servers (see LOCAL_NETWORK_TESTING_GUIDE.md)" -ForegroundColor White
Write-Host "   3. Access from other device: http://YOUR_IP:3003" -ForegroundColor White

Write-Host "`n💡 Tip: You can view all firewall rules in:" -ForegroundColor Yellow
Write-Host "   Control Panel → Windows Defender Firewall → Advanced Settings → Inbound Rules" -ForegroundColor White

Write-Host ""

