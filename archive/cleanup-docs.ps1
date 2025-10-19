# Documentation Cleanup Script
Write-Host "Documentation Cleanup Script" -ForegroundColor Cyan
Write-Host ""

$rootPath = Get-Location
Write-Host "Working directory: $rootPath" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Do you want to proceed? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    exit
}

Write-Host "Starting cleanup..." -ForegroundColor Green

# Phase 1: Create folders
Write-Host "[Phase 1/6] Creating folders..." -ForegroundColor Cyan
$folders = @("docs\01-getting-started","docs\02-architecture","docs\03-implementation","docs\03-implementation\phase1","docs\03-implementation\phase2","docs\04-features","docs\05-deployment","docs\06-troubleshooting","docs\07-reference","archive")
foreach ($f in $folders) {
    if (-not (Test-Path $f)) { New-Item -ItemType Directory -Path $f -Force | Out-Null; Write-Host "  Created: $f" -ForegroundColor Green }
}

# Phase 2: Move phase docs
Write-Host "[Phase 2/6] Moving phase docs..." -ForegroundColor Cyan
$phase1 = @("PHASE1_AUTHENTICATION.md","PHASE1_ERROR_BOUNDARIES.md","PHASE1_PERFORMANCE_MONITORING.md","PHASE1_CHECKLIST.md","PHASE1_SUMMARY.md","PHASE1_VISUAL_SUMMARY.md","PHASE1_MODULE_FEDERATION_GUIDE.md")
foreach ($f in $phase1) {
    if (Test-Path "docs\$f") { Move-Item "docs\$f" "docs\03-implementation\phase1\$f" -Force; Write-Host "  Moved: $f" -ForegroundColor Green }
}
if (Test-Path "docs\PHASE2_INFRASTRUCTURE.md") { Move-Item "docs\PHASE2_INFRASTRUCTURE.md" "docs\03-implementation\phase2\" -Force; Write-Host "  Moved: PHASE2" -ForegroundColor Green }

# Phase 3: Move architecture
Write-Host "[Phase 3/6] Moving architecture..." -ForegroundColor Cyan
if (Test-Path "NAVIGATION_GUIDE.md") { Move-Item "NAVIGATION_GUIDE.md" "docs\02-architecture\navigation.md" -Force; Write-Host "  Moved: NAV" -ForegroundColor Green }
if (Test-Path "docs\architecture-diagram.md") { Move-Item "docs\architecture-diagram.md" "docs\02-architecture\" -Force; Write-Host "  Moved: ARCH" -ForegroundColor Green }
if (Test-Path "docs\cross-mfe-communication-demo.md") { Move-Item "docs\cross-mfe-communication-demo.md" "docs\02-architecture\communication.md" -Force; Write-Host "  Moved: COMM" -ForegroundColor Green }

# Phase 4: Move implementation
Write-Host "[Phase 4/6] Moving implementation..." -ForegroundColor Cyan
if (Test-Path "MFE_IMPLEMENTATION_ROADMAP.md") { Move-Item "MFE_IMPLEMENTATION_ROADMAP.md" "docs\03-implementation\roadmap.md" -Force; Write-Host "  Moved: ROADMAP" -ForegroundColor Green }
if (Test-Path "IMPLEMENTATION_CHECKLIST.md") { Move-Item "IMPLEMENTATION_CHECKLIST.md" "docs\03-implementation\checklist.md" -Force; Write-Host "  Moved: CHECKLIST" -ForegroundColor Green }

# Phase 5: Archive
Write-Host "[Phase 5/6] Archiving..." -ForegroundColor Cyan
$archive = @("SESSION_COMPLETE.md","SESSION_SUMMARY.md","SETUP_COMPLETE.md","ALL_FIXED_FINAL.md","INTEGRATION_COMPLETE.md","UPGRADE_COMPLETE_V25.md","ANGULAR_FIX_TODO.md","ANGULAR_MFE_FIXED.md","VUE_HMR_FIX.md","VUE_MFE_ERROR_RESOLUTION.md","PROGRESS_LOG.md","docs\BUILD_FIX.md","docs\COUNTER_FIX.md","docs\FINAL_RECOMMENDATION.md","docs\IMPLEMENTATION_COMPLETE.md","docs\IMPLEMENTATION_SUMMARY.md","docs\HIGH_PRIORITY_FIXES.md")
foreach ($f in $archive) {
    if (Test-Path $f) { $n = Split-Path $f -Leaf; Move-Item $f "archive\$n" -Force; Write-Host "  Archived: $n" -ForegroundColor Green }
}

# Phase 6: Delete
Write-Host "[Phase 6/6] Deleting duplicates..." -ForegroundColor Cyan
$delete = @("QUICK_ACCESS.md","QUICK_COMMANDS.md","QUICK_DEPLOY.md","QUICK_REFERENCE.md","FREE_STACK_QUICKSTART.md","RULES_QUICKSTART.md","ROADMAP.md","ANGULAR_MFE_ISSUES.md","SUCCESS_STATUS.md","docs\QUICK_START_INFRASTRUCTURE.md","docs\project-status.md","docs\deployment-strategy.md","docs\vercel-deployment-guide.md")
foreach ($f in $delete) {
    if (Test-Path $f) { Remove-Item $f -Force; Write-Host "  Deleted: $f" -ForegroundColor Yellow }
}

# Rename
if (Test-Path "CURRENT_STATUS_OCT_19_2025.md") { Move-Item "CURRENT_STATUS_OCT_19_2025.md" "STATUS.md" -Force; Write-Host "Renamed STATUS" -ForegroundColor Green }

Write-Host ""
Write-Host "Cleanup Complete!" -ForegroundColor Green
