# Quick Start: Custom SonarQube Rules Setup

## 🚀 Getting Started in 5 Minutes

### Step 1: Review Current Rules
View all available quality profiles and their active rules:

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" -Action list
```

### Step 2: Explore Available Rules

**For TypeScript:**
```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" -Action list-rules -Language ts
```

**For JavaScript:**
```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" -Action list-rules -Language js
```

**For HTML:**
```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" -Action list-rules -Language web
```

**For CSS:**
```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" -Action list-rules -Language css
```

### Step 3: Create Custom Quality Profile

```powershell
# TypeScript custom profile
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
  -Action create-profile `
  -Language ts `
  -ProfileName "MicroFrontend-TypeScript-Strict"

# JavaScript custom profile
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
  -Action create-profile `
  -Language js `
  -ProfileName "MicroFrontend-JavaScript-Strict"

# HTML custom profile
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
  -Action create-profile `
  -Language web `
  -ProfileName "MicroFrontend-HTML-Accessibility"

# CSS custom profile
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
  -Action create-profile `
  -Language css `
  -ProfileName "MicroFrontend-CSS-Best-Practices"
```

### Step 4: Activate/Modify Rules via Web UI

1. Open: http://localhost:9001/profiles
2. Find your custom profile
3. Click "Activate More"
4. Search and activate desired rules
5. Save changes

**Popular Rules to Activate:**

#### TypeScript Security Rules
- `typescript:S3776` - Cognitive Complexity of functions should not be too high
- `typescript:S1541` - Functions and methods should not be too complex
- `typescript:S1264` - Appropriate loop types should be used
- `typescript:S1479` - "switch" statements should not have too many "case" clauses
- `typescript:S1134` - Track FIXME tags (set to CRITICAL)

#### HTML Accessibility Rules
- `Web:S5254` - Object tags should provide an alternative content
- `Web:PageWithoutTitleCheck` - Title should be present
- `Web:ImgWithoutAltCheck` - Images should have alt attributes
- `Web:LinkToImageCheck` - Links to images should contain alt text

#### CSS Best Practices
- `css:S4658` - Avoid using !important
- `css:S4670` - Vendor prefixes should be consistent
- `css:S4654` - Shorthand properties should be used when possible

### Step 5: Set Profile as Default

```powershell
# Via script (after getting profile key from step 3)
powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
  -Action set-default `
  -ProfileName "YOUR_PROFILE_KEY_HERE" `
  -Language ts
```

**Or via Web UI:**
1. Go to http://localhost:9001/profiles
2. Find your custom profile
3. Click Actions → Set as Default
4. Or assign to specific project

### Step 6: Apply Custom Rules Configuration

Add custom rule configurations to your sonar-project.properties:

```powershell
# Review the custom rules template
cat .\sonar-custom-rules.properties

# Copy relevant sections to sonar-project.properties
# Or create environment-specific configs
```

### Step 7: Run Analysis with New Rules

```powershell
.\scripts\sonar-analyze.ps1
```

## 📊 Common Scenarios

### Scenario 1: Strict Mode (Maximum Quality)

```powershell
# Create strict profiles for all languages
$languages = @("ts", "js", "web", "css")
foreach ($lang in $languages) {
    powershell -ExecutionPolicy Bypass -File ".\scripts\sonar-manage-rules.ps1" `
      -Action create-profile `
      -Language $lang `
      -ProfileName "Strict-$lang"
}
```

Then via Web UI:
1. Activate all CRITICAL and MAJOR rules
2. Set minimum complexity thresholds
3. Enable all security rules
4. Require 85%+ code coverage

### Scenario 2: Development Mode (Relaxed)

Add to sonar-project.properties:
```properties
# Allow console.log
sonar.issue.ignore.multicriteria=e1
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S2228
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.ts

# Allow TODO comments
sonar.issue.ignore.multicriteria=e2
sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1135
sonar.issue.ignore.multicriteria.e2.resourceKey=**/*.ts
```

### Scenario 3: CI/CD Pipeline (Fail on New Issues)

```properties
# Fail build on quality gate
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300

# Focus on new code
sonar.analysis.mode=publish
```

Update sonar-quality-gate.json:
```json
{
  "name": "CI-CD-Gate",
  "conditions": [
    {
      "metric": "new_bugs",
      "op": "GT",
      "error": "0"
    },
    {
      "metric": "new_vulnerabilities",
      "op": "GT",
      "error": "0"
    },
    {
      "metric": "new_code_smells",
      "op": "GT",
      "error": "5"
    }
  ]
}
```

## 🔧 Advanced Configuration

### ESLint Integration

1. **Install ESLint dependencies:**
```powershell
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

2. **Generate ESLint report:**
```powershell
# Add to package.json
"lint:sonar": "eslint . --ext .ts,.tsx,.js,.jsx --format json --output-file eslint-report.json"

# Run it
npm run lint:sonar
```

3. **Configure SonarQube to import:**
```properties
# In sonar-project.properties
sonar.eslint.reportPaths=eslint-report.json
```

### Custom Rule Parameters

```properties
# Set complexity thresholds
sonar.javascript.maxComplexity=10
sonar.typescript.maxComplexity=15

# Configure duplication detection
sonar.cpd.minTokens=50

# File size limits
sonar.javascript.file.suffixes=.js,.jsx
sonar.typescript.file.suffixes=.ts,.tsx
```

## 📈 Monitoring & Reporting

### View Rules in Dashboard

1. **Project Overview**: http://localhost:9001/dashboard?id=micro-frontend-single-spa
2. **Issues by Rule**: http://localhost:9001/project/issues?id=micro-frontend-single-spa
3. **Quality Profile Details**: http://localhost:9001/profiles
4. **Coding Rules Browser**: http://localhost:9001/coding_rules

### Generate Reports

```powershell
# Get project metrics
$Token = Get-Content ".sonar-token-v10.6" -Raw
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Token}:"))
$headers = @{Authorization = "Basic $base64Auth"}

$metrics = Invoke-RestMethod -Uri "http://localhost:9001/api/measures/component?component=micro-frontend-single-spa&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density" -Headers $headers

$metrics.component.measures | Format-Table
```

## 🎯 Recommended Starting Configuration

### For TypeScript/JavaScript Projects:

1. **Create custom profile** inheriting from "Sonar way"
2. **Activate these additional rules:**
   - Cognitive complexity limits (S3776)
   - Function complexity limits (S1541)
   - TODO/FIXME tracking (S1134, S1135) - increase severity
   - Unused code detection (S1068, S1172)
   - String literal duplication (S1192)

3. **Configure parameters:**
   ```properties
   sonar.javascript.maxComplexity=15
   sonar.typescript.maxComplexity=15
   ```

4. **Set exclusions:**
   ```properties
   sonar.exclusions=**/*.spec.ts,**/*.test.ts,**/node_modules/**
   ```

### For HTML Projects:

1. **Activate accessibility rules**
2. **Enable security checks** (XSS prevention)
3. **Enforce semantic HTML**

### For CSS Projects:

1. **Avoid !important** rule
2. **Vendor prefix consistency**
3. **Shorthand property usage**

## 🚨 Troubleshooting

**Issue**: Script execution error
```powershell
# Solution: Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Issue**: Authentication failed
```powershell
# Solution: Regenerate token
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:SandeepShetty@123"))
$headers = @{Authorization = "Basic $base64Auth"}
$response = Invoke-RestMethod -Uri "http://localhost:9001/api/user_tokens/generate?name=rules-management" -Method POST -Headers $headers
$response.token | Out-File ".sonar-token-v10.6" -NoNewline
```

**Issue**: Rules not applying
```powershell
# Solution: Ensure profile is set as default for project
# Check via: http://localhost:9001/project/quality_profiles?id=micro-frontend-single-spa
```

## 📚 Resources

- **Full Documentation**: See `docs/CUSTOM_RULES_GUIDE.md`
- **Web UI**: http://localhost:9001
- **Quality Profiles**: http://localhost:9001/profiles
- **Coding Rules**: http://localhost:9001/coding_rules
- **Project Dashboard**: http://localhost:9001/dashboard?id=micro-frontend-single-spa

## ✅ Next Steps

1. ✅ List current profiles: `.\scripts\sonar-manage-rules.ps1 -Action list`
2. ✅ Create custom profiles for each language
3. ✅ Customize rules via Web UI
4. ✅ Test with: `.\scripts\sonar-analyze.ps1`
5. ✅ Review results in dashboard
6. ✅ Iterate based on team feedback

---

**Last Updated**: October 11, 2025  
**SonarQube Version**: 10.6.0.92116  
**Authentication**: Token-based (see `.sonar-token-v10.6`)
