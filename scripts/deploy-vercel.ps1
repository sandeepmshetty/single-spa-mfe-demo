# Automated Vercel Deployment Script
# Deploys all MFEs independently to Vercel

param(
    [switch]$Production,
    [switch]$Preview
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting MFE Deployment to Vercel..." -ForegroundColor Cyan

$deployFlag = if ($Production) { "--prod" } else { "" }

# Function to deploy a package
function Deploy-Package {
    param(
        [string]$PackageName,
        [string]$PackagePath
    )
    
    Write-Host "`n📦 Deploying $PackageName..." -ForegroundColor Yellow
    
    Push-Location $PackagePath
    
    try {
        # Build
        Write-Host "  Building..." -ForegroundColor Gray
        npm run build
        
        # Deploy
        Write-Host "  Deploying to Vercel..." -ForegroundColor Gray
        $output = vercel $deployFlag --yes 2>&1
        
        # Extract URL
        $url = $output | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -First 1
        
        if ($url) {
            Write-Host "  ✅ Deployed: $url" -ForegroundColor Green
            return $url.ToString()
        } else {
            Write-Host "  ❌ Failed to get deployment URL" -ForegroundColor Red
            return $null
        }
    }
    catch {
        Write-Host "  ❌ Deployment failed: $_" -ForegroundColor Red
        return $null
    }
    finally {
        Pop-Location
    }
}

# Deploy in order
$urls = @{}

# 1. Shared Library
$urls['shared'] = Deploy-Package "Shared Library" "packages/shared-library"

# 2. React MFE
$urls['react'] = Deploy-Package "React MFE" "packages/react-mfe"

# 3. Vue MFE
$urls['vue'] = Deploy-Package "Vue MFE" "packages/vue-mfe"

# 4. Angular MFE
$urls['angular'] = Deploy-Package "Angular MFE" "packages/angular-mfe"

# 5. Shell App (last, so it can reference others)
$urls['shell'] = Deploy-Package "Shell App" "packages/shell-app"

# Summary
Write-Host "`n📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

foreach ($key in $urls.Keys) {
    $url = $urls[$key]
    if ($url) {
        Write-Host "  ✅ $key : $url" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $key : Failed" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Cyan
Write-Host "Access your app at: $($urls['shell'])" -ForegroundColor Yellow

# Save URLs to file
$urlsJson = $urls | ConvertTo-Json
$urlsJson | Out-File -FilePath ".vercel-urls.json" -Encoding UTF8

Write-Host "`n💾 URLs saved to .vercel-urls.json" -ForegroundColor Gray
