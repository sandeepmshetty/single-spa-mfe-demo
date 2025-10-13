# SonarQube Analysis Script
param(
    [string]$Token = $env:SONAR_TOKEN
)

Write-Host "`n" -NoNewline
Write-Host "SonarQube Analysis Runner" -ForegroundColor Cyan

# Load token from file if not provided
if ([string]::IsNullOrEmpty($Token)) {
    $tokenFile = if (Test-Path ".sonar-token-v25.10") {
        ".sonar-token-v25.10"
    } elseif (Test-Path ".sonar-token-v10.6") {
        ".sonar-token-v10.6"
    } elseif (Test-Path ".sonar-token") {
        ".sonar-token"
    } else {
        $null
    }

    if (-not $tokenFile) {
        Write-Host "Error: No SonarQube token found!" -ForegroundColor Red
        Write-Host "Please generate a token first" -ForegroundColor Yellow
        exit 1
    }

    $Token = Get-Content $tokenFile -Raw -ErrorAction SilentlyContinue
    if (-not $Token) {
        Write-Host "Error: Token file is empty!" -ForegroundColor Red
        exit 1
    }
    $Token = $Token.Trim()
    Write-Host "Using token from: $tokenFile" -ForegroundColor Yellow
}

# Check if SonarQube is running
Write-Host "Checking SonarQube status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9001/api/system/status" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $statusObj = $response.Content | ConvertFrom-Json
    Write-Host "SonarQube is UP (Version: $($statusObj.version))" -ForegroundColor Green
} catch {
    Write-Host "SonarQube is not responding!" -ForegroundColor Red
    Write-Host "Please start SonarQube first: npm run sonar:start" -ForegroundColor Yellow
    exit 1
}

# Run the scanner
Write-Host "Starting analysis..." -ForegroundColor Cyan

$dockerArgs = @(
    "run"
    "--rm"
    "--network"
    "micro-frontend-single-spa_sonarnet"
    "-v"
    "${PWD}:/usr/src"
    "-w"
    "/usr/src"
    "-e"
    "SONAR_HOST_URL=http://sonarqube:9000"
    "sonarsource/sonar-scanner-cli"
    "sonar-scanner"
    "-Dsonar.token=$Token"
    "-Dsonar.scm.disabled=true"
    "-Dsonar.javascript.exclusions=**/*"
    "-Dsonar.typescript.exclusions=**/*"
)

& docker @dockerArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nAnalysis completed successfully!" -ForegroundColor Green
    Write-Host "Dashboard: http://localhost:9001/dashboard?id=micro-frontend-single-spa" -ForegroundColor Cyan
} else {
    Write-Host "`nAnalysis failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Check SonarQube logs: npm run sonar:logs" -ForegroundColor Yellow
    exit $LASTEXITCODE
}
