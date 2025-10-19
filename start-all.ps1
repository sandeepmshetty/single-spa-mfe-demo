# Start All Micro-Frontend Services
# This script starts all required services in separate PowerShell windows

Write-Host "🚀 Starting Micro-Frontend Services..." -ForegroundColor Cyan

# Check if shared library is built
if (!(Test-Path "packages\shared-library\dist\shared-library.js")) {
    Write-Host "📦 Building shared library..." -ForegroundColor Yellow
    cd packages\shared-library
    npm run build
    cd ..\..
    Write-Host "✅ Shared library built" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting services in separate windows..." -ForegroundColor Cyan
Write-Host "Close this window when you're done to keep services running" -ForegroundColor Yellow
Write-Host ""

# Start Shared Library Server
Write-Host "[1/5] Starting Shared Library Server (port 9000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '🔗 Shared Library Server' -ForegroundColor Cyan; " + `
    "Write-Host 'Port: 9000' -ForegroundColor Yellow; " + `
    "Write-Host ''; " + `
    "cd packages\shared-library; " + `
    "npx serve dist -p 9000 --cors"
Start-Sleep -Seconds 3

# Start Shell App
Write-Host "[2/5] Starting Shell App (port 9999)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '🏠 Shell App' -ForegroundColor Cyan; " + `
    "Write-Host 'Port: 9999' -ForegroundColor Yellow; " + `
    "Write-Host 'URL: http://localhost:9999' -ForegroundColor Blue; " + `
    "Write-Host ''; " + `
    "cd packages\shell-app; " + `
    "npm start"
Start-Sleep -Seconds 3

# Start React MFE
Write-Host "[3/5] Starting React MFE (port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '⚛️  React MFE - User Management' -ForegroundColor Cyan; " + `
    "Write-Host 'Port: 3001' -ForegroundColor Yellow; " + `
    "Write-Host ''; " + `
    "cd packages\react-mfe; " + `
    "npm start"
Start-Sleep -Seconds 3

# Start Vue MFE
Write-Host "[4/5] Starting Vue MFE (port 3002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '💚 Vue MFE - Products' -ForegroundColor Cyan; " + `
    "Write-Host 'Port: 3002' -ForegroundColor Yellow; " + `
    "Write-Host ''; " + `
    "cd packages\vue-mfe; " + `
    "npm start"
Start-Sleep -Seconds 3

# Start Angular MFE
Write-Host "[5/5] Starting Angular MFE (port 3003)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '🅰️  Angular MFE - Dashboard' -ForegroundColor Cyan; " + `
    "Write-Host 'Port: 3003' -ForegroundColor Yellow; " + `
    "Write-Host 'Status: ✅ FIXED!' -ForegroundColor Green; " + `
    "Write-Host ''; " + `
    "cd packages\angular-mfe; " + `
    "npm start"

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Cyan
Write-Host "   Shell App:       http://localhost:9999" -ForegroundColor Blue
Write-Host "   Shared Library:  http://localhost:9000" -ForegroundColor Blue
Write-Host "   React MFE:       http://localhost:3001" -ForegroundColor Blue
Write-Host "   Vue MFE:         http://localhost:3002" -ForegroundColor Blue
Write-Host "   Angular MFE:     http://localhost:3003" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Open your browser to: http://localhost:9999" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop all services:" -ForegroundColor Red
Write-Host "   Close each PowerShell window individually" -ForegroundColor Red
Write-Host "   Or run: Get-Process node | Stop-Process -Force" -ForegroundColor Red
Write-Host ""
Write-Host "Press any key to open the application in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:9999"
