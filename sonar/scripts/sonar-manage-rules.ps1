# SonarQube Rules Management Script
# This script helps you manage custom quality profiles and rules via SonarQube API

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "list",  # Options: list, create-profile, activate-rule, deactivate-rule, set-default
    [string]$Language = "",     # js, ts, web (HTML), css
    [string]$ProfileName = "",
    [string]$RuleKey = "",
    [string]$Severity = ""      # BLOCKER, CRITICAL, MAJOR, MINOR, INFO
)

$SonarUrl = "http://localhost:9001"

# Try to find the latest token file
$tokenFile = if (Test-Path ".sonar-token-v25.10") {
    ".sonar-token-v25.10"
} elseif (Test-Path ".sonar-token-v10.6") {
    ".sonar-token-v10.6"
} else {
    ".sonar-token"
}

$Token = Get-Content $tokenFile -Raw -ErrorAction SilentlyContinue
if (-not $Token) {
    Write-Host "Error: No token file found. Please generate a token first." -ForegroundColor Red
    exit 1
}
$Token = $Token.Trim()
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Token}:"))
$headers = @{
    Authorization = "Basic $base64Auth"
}

function Show-Menu {
    Write-Host "`n=== SonarQube Rules Management ===" -ForegroundColor Cyan
    Write-Host "1. List all Quality Profiles"
    Write-Host "2. List available rules for a language"
    Write-Host "3. Create custom Quality Profile"
    Write-Host "4. Activate rules in a profile"
    Write-Host "5. Deactivate rules in a profile"
    Write-Host "6. Set profile as default for project"
    Write-Host "7. Export profile configuration"
    Write-Host "8. Import profile configuration"
    Write-Host "0. Exit"
    Write-Host "=================================" -ForegroundColor Cyan
}

function Get-QualityProfiles {
    Write-Host "`nFetching Quality Profiles..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$SonarUrl/api/qualityprofiles/search" -Headers $headers -Method GET
        
        Write-Host "`nAvailable Quality Profiles:" -ForegroundColor Green
        Write-Host "=============================" -ForegroundColor Green
        foreach ($profile in $response.profiles) {
            $isDefault = if ($profile.isDefault) { " [DEFAULT]" } else { "" }
            $isBuiltIn = if ($profile.isBuiltIn) { " [BUILT-IN]" } else { " [CUSTOM]" }
            Write-Host "Language: $($profile.language)" -ForegroundColor Cyan
            Write-Host "  Name: $($profile.name)$isDefault$isBuiltIn" -ForegroundColor White
            Write-Host "  Key: $($profile.key)" -ForegroundColor Gray
            Write-Host "  Active Rules: $($profile.activeRuleCount)" -ForegroundColor Yellow
            Write-Host ""
        }
    }
    catch {
        Write-Host "Error fetching profiles: $_" -ForegroundColor Red
    }
}

function Get-AvailableRules {
    param([string]$Lang)
    
    if ([string]::IsNullOrEmpty($Lang)) {
        $Lang = Read-Host "Enter language (js, ts, web, css)"
    }
    
    Write-Host "`nFetching rules for language: $Lang..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$SonarUrl/api/rules/search?languages=$Lang&ps=500" -Headers $headers -Method GET
        
        Write-Host "`nAvailable Rules for $Lang (Showing first 20):" -ForegroundColor Green
        Write-Host "=============================================" -ForegroundColor Green
        
        $count = 0
        foreach ($rule in $response.rules) {
            if ($count -ge 20) { break }
            Write-Host "`nRule Key: $($rule.key)" -ForegroundColor Cyan
            Write-Host "  Name: $($rule.name)" -ForegroundColor White
            Write-Host "  Severity: $($rule.severity)" -ForegroundColor Yellow
            Write-Host "  Type: $($rule.type)" -ForegroundColor Gray
            $count++
        }
        
        Write-Host "`nTotal rules available: $($response.total)" -ForegroundColor Green
        Write-Host "Use the Web UI at $SonarUrl/coding_rules to browse all rules" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Error fetching rules: $_" -ForegroundColor Red
    }
}

function New-CustomProfile {
    param([string]$Lang, [string]$Name)
    
    if ([string]::IsNullOrEmpty($Lang)) {
        $Lang = Read-Host "Enter language (js, ts, web, css)"
    }
    if ([string]::IsNullOrEmpty($Name)) {
        $Name = Read-Host "Enter profile name"
    }
    
    Write-Host "`nCreating custom profile: $Name for $Lang..." -ForegroundColor Yellow
    try {
        $body = @{
            language = $Lang
            name = $Name
        }
        
        $response = Invoke-RestMethod -Uri "$SonarUrl/api/qualityprofiles/create" -Headers $headers -Method POST -Body $body
        
        Write-Host "`nProfile created successfully!" -ForegroundColor Green
        Write-Host "Profile Key: $($response.profile.key)" -ForegroundColor Cyan
        Write-Host "Profile Name: $($response.profile.name)" -ForegroundColor Cyan
        
        return $response.profile.key
    }
    catch {
        Write-Host "Error creating profile: $_" -ForegroundColor Red
    }
}

function Set-RuleActivation {
    param(
        [string]$ProfileKey,
        [string]$Rule,
        [string]$Action,
        [string]$SeverityLevel
    )
    
    if ([string]::IsNullOrEmpty($ProfileKey)) {
        $ProfileKey = Read-Host "Enter profile key"
    }
    if ([string]::IsNullOrEmpty($Rule)) {
        $Rule = Read-Host "Enter rule key (e.g., typescript:S1234)"
    }
    
    $endpoint = if ($Action -eq "activate") { "activate" } else { "deactivate" }
    
    Write-Host "`n$Action rule $Rule in profile..." -ForegroundColor Yellow
    try {
        $body = @{
            key = $ProfileKey
            rule = $Rule
        }
        
        if ($Action -eq "activate" -and -not [string]::IsNullOrEmpty($SeverityLevel)) {
            $body.severity = $SeverityLevel
        }
        
        Invoke-RestMethod -Uri "$SonarUrl/api/qualityprofiles/$endpoint" -Headers $headers -Method POST -Body $body
        
        Write-Host "$Action completed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

function Set-DefaultProfile {
    param([string]$ProfileKey, [string]$Lang)
    
    if ([string]::IsNullOrEmpty($ProfileKey)) {
        $ProfileKey = Read-Host "Enter profile key"
    }
    if ([string]::IsNullOrEmpty($Lang)) {
        $Lang = Read-Host "Enter language (js, ts, web, css)"
    }
    
    Write-Host "`nSetting profile as default for project..." -ForegroundColor Yellow
    try {
        $body = @{
            key = $ProfileKey
            language = $Lang
            qualityProfile = $ProfileKey
            project = "micro-frontend-single-spa"
        }
        
        Invoke-RestMethod -Uri "$SonarUrl/api/qualityprofiles/add_project" -Headers $headers -Method POST -Body $body
        
        Write-Host "Profile set as default successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Main execution
if ($Action -eq "list") {
    Get-QualityProfiles
}
elseif ($Action -eq "list-rules") {
    Get-AvailableRules -Lang $Language
}
elseif ($Action -eq "create-profile") {
    New-CustomProfile -Lang $Language -Name $ProfileName
}
elseif ($Action -eq "activate-rule") {
    Set-RuleActivation -ProfileKey $ProfileName -Rule $RuleKey -Action "activate" -SeverityLevel $Severity
}
elseif ($Action -eq "deactivate-rule") {
    Set-RuleActivation -ProfileKey $ProfileName -Rule $RuleKey -Action "deactivate"
}
elseif ($Action -eq "set-default") {
    Set-DefaultProfile -ProfileKey $ProfileName -Lang $Language
}
else {
    Show-Menu
    $choice = Read-Host "`nEnter your choice"
    
    switch ($choice) {
        "1" { Get-QualityProfiles }
        "2" { Get-AvailableRules }
        "3" { New-CustomProfile }
        "4" { 
            $pk = Read-Host "Enter profile key"
            $rk = Read-Host "Enter rule key"
            $sv = Read-Host "Enter severity (BLOCKER, CRITICAL, MAJOR, MINOR, INFO)"
            Set-RuleActivation -ProfileKey $pk -Rule $rk -Action "activate" -SeverityLevel $sv
        }
        "5" {
            $pk = Read-Host "Enter profile key"
            $rk = Read-Host "Enter rule key"
            Set-RuleActivation -ProfileKey $pk -Rule $rk -Action "deactivate"
        }
        "6" {
            $pk = Read-Host "Enter profile key"
            $lg = Read-Host "Enter language"
            Set-DefaultProfile -ProfileKey $pk -Lang $lg
        }
        "0" { Write-Host "Exiting..." -ForegroundColor Yellow }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
}
