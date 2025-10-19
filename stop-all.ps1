# Stop All Micro-Frontend Services
# This script stops all Node.js processes (use with caution!)

Write-Host "🛑 Stopping all Micro-Frontend services..." -ForegroundColor Red
Write-Host ""

# Get all Node.js processes
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Yellow
    Write-Host ""
    
    # List processes with their ports
    foreach ($proc in $nodeProcesses) {
        $connections = Get-NetTCPConnection -OwningProcess $proc.Id -ErrorAction SilentlyContinue
        if ($connections) {
            $ports = ($connections | Select-Object -ExpandProperty LocalPort -Unique) -join ", "
            Write-Host "  PID $($proc.Id): Listening on port(s) $ports" -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
    Write-Host "⚠️  WARNING: This will stop ALL Node.js processes!" -ForegroundColor Yellow
    Write-Host "This includes any other Node.js applications you may be running." -ForegroundColor Yellow
    Write-Host ""
    
    $confirmation = Read-Host "Are you sure you want to stop all Node.js processes? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host ""
        Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Cancelled - no processes were stopped" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To stop processes manually, close each PowerShell window," -ForegroundColor Cyan
        Write-Host "or use Task Manager to end specific Node.js processes." -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ No Node.js processes found running" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
