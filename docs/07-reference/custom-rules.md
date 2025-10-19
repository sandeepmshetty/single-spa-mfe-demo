# SonarQube Custom Rules Configuration Guide

This guide explains how to customize SonarQube rules for your Micro-Frontend project.

## Table of Contents
1. [Web UI Configuration](#web-ui-configuration)
2. [File-Based Configuration](#file-based-configuration)
3. [API-Based Management](#api-based-management)
4. [ESLint Integration](#eslint-integration)
5. [Common Rule Customizations](#common-rule-customizations)

---

## Web UI Configuration

### Accessing Quality Profiles

1. Open SonarQube: http://localhost:9001
2. Navigate to **Quality Profiles** (top menu)
3. View profiles for each language:
   - **JavaScript**: Rules for .js, .jsx files
   - **TypeScript**: Rules for .ts, .tsx files  
   - **HTML**: Rules for .html, .vue files
   - **CSS**: Rules for .css, .scss files

### Creating Custom Quality Profile

```bash
# Step-by-step via Web UI:
1. Go to Quality Profiles
2. Select language (e.g., TypeScript)
3. Find "Sonar way" profile
4. Click Actions → Copy
5. Name: "Micro-Frontend TypeScript"
6. Click "Create"
```

### Activating/Deactivating Rules

```bash
1. Open your custom profile
2. Click "Activate More" button
3. Browse or search for rules
4. Filter by:
   - Type (Bug, Vulnerability, Code Smell, Security Hotspot)
   - Severity (Blocker, Critical, Major, Minor, Info)
   - Tags (convention, error-handling, etc.)
5. Click "Activate" on desired rules
6. Adjust severity if needed
7. Save changes
```

### Setting Profile as Default

```bash
1. In Quality Profiles list
2. Find your custom profile
3. Click Actions → Set as Default
4. Or associate with specific project:
   - Click profile name
   - Go to "Projects" tab
   - Click "Change" 
   - Select "micro-frontend-single-spa"
```

---

## File-Based Configuration

### Using sonar-custom-rules.properties

We've created `sonar-custom-rules.properties` with pre-configured rule customizations.

**To apply:**

```bash
# Add to your sonar-project.properties
sonar.projectKey=micro-frontend-single-spa
sonar.projectName=Micro Frontend Single SPA
sonar.sources=packages
sonar.sourceEncoding=UTF-8

# Import custom rules configuration
# (Copy relevant sections from sonar-custom-rules.properties)
```

### Common Rule Exclusions

```properties
# Ignore console.log in development environments
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S2228
sonar.issue.ignore.multicriteria.e1.resourceKey=**/environments/*.ts

# Ignore TODO comments in test files
sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1135
sonar.issue.ignore.multicriteria.e2.resourceKey=**/*.spec.ts

# Ignore magic numbers in tests
sonar.issue.ignore.multicriteria.e3.ruleKey=typescript:S109
sonar.issue.ignore.multicriteria.e3.resourceKey=**/*.test.ts
```

### Severity Overrides

```properties
# Increase severity of specific rules
sonar.issue.enforce.multicriteria=s1,s2

# Make TODO comments critical (instead of info)
sonar.issue.enforce.multicriteria.s1.ruleKey=typescript:S1134
sonar.issue.enforce.multicriteria.s1.severity=CRITICAL

# Make console.log blocking (instead of warning)
sonar.issue.enforce.multicriteria.s2.ruleKey=typescript:S2228
sonar.issue.enforce.multicriteria.s2.severity=BLOCKER
```

---

## API-Based Management

### Using the Management Script

We've created `scripts/sonar-manage-rules.ps1` for programmatic rule management.

#### List All Quality Profiles

```powershell
.\scripts\sonar-manage-rules.ps1 -Action list
```

#### List Available Rules for a Language

```powershell
# TypeScript rules
.\scripts\sonar-manage-rules.ps1 -Action list-rules -Language ts

# JavaScript rules
.\scripts\sonar-manage-rules.ps1 -Action list-rules -Language js

# HTML rules
.\scripts\sonar-manage-rules.ps1 -Action list-rules -Language web

# CSS rules
.\scripts\sonar-manage-rules.ps1 -Action list-rules -Language css
```

#### Create Custom Profile

```powershell
.\scripts\sonar-manage-rules.ps1 -Action create-profile -Language ts -ProfileName "Micro-Frontend-TypeScript"
```

#### Activate a Specific Rule

```powershell
.\scripts\sonar-manage-rules.ps1 `
  -Action activate-rule `
  -ProfileName "AXkFS-TKPHYsJnIc23pT" `
  -RuleKey "typescript:S1134" `
  -Severity "CRITICAL"
```

#### Deactivate a Rule

```powershell
.\scripts\sonar-manage-rules.ps1 `
  -Action deactivate-rule `
  -ProfileName "AXkFS-TKPHYsJnIc23pT" `
  -RuleKey "typescript:S2228"
```

### Interactive Mode

Run without parameters for interactive menu:

```powershell
.\scripts\sonar-manage-rules.ps1
```

---

## ESLint Integration

### Configuration File

We've created `.eslintrc.json` with recommended rules for your micro-frontend.

**Key Features:**
- TypeScript rules via `@typescript-eslint`
- React/JSX rules via `eslint-plugin-react`
- Vue support (via separate config in vue-mfe)
- Angular support (already configured in angular-mfe)

### Installing ESLint Dependencies

```powershell
# Root level
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react

# In each package
cd packages/react-mfe
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react

cd ../vue-mfe
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-vue

cd ../angular-mfe
npm install --save-dev eslint @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template
```

### SonarQube ESLint Report Import

To import ESLint results into SonarQube:

1. **Generate ESLint JSON report:**

```powershell
# Add to package.json scripts
"lint:report": "eslint . --ext .ts,.tsx,.js,.jsx --format json --output-file eslint-report.json"
```

2. **Configure SonarQube to read it:**

```properties
# In sonar-project.properties
sonar.eslint.reportPaths=eslint-report.json,packages/*/eslint-report.json
```

3. **Run before analysis:**

```powershell
npm run lint:report
.\scripts\sonar-analyze.ps1
```

---

## Common Rule Customizations

### TypeScript/JavaScript Rules

#### Recommended Rules to Activate

| Rule Key | Description | Severity |
|----------|-------------|----------|
| `typescript:S1134` | TODO comments should be removed | CRITICAL |
| `typescript:S125` | Commented-out code should be removed | MAJOR |
| `typescript:S1192` | String literals should not be duplicated | MINOR |
| `typescript:S3776` | Cognitive complexity limit | CRITICAL |
| `typescript:S1541` | Avoid deeply nested code | MAJOR |

#### Rules to Consider Disabling

| Rule Key | Description | Reason |
|----------|-------------|--------|
| `typescript:S2228` | Console logging | Useful in development |
| `typescript:S1135` | TODO in test files | Acceptable for test planning |
| `typescript:S109` | Magic numbers in tests | Test data often hardcoded |

### HTML Rules

#### Recommended Activations

| Rule Key | Description | Severity |
|----------|-------------|----------|
| `Web:S5254` | Links should not be opened in new tab without rel="noopener noreferrer" | CRITICAL |
| `Web:PageWithoutTitleCheck` | Title should be present | MAJOR |
| `Web:ImgWithoutAltCheck` | Images should have alt attribute | MAJOR |
| `Web:TableHeaderHasIdOrScopeCheck` | Table headers should have scope | MINOR |

### CSS Rules

#### Recommended Activations

| Rule Key | Description | Severity |
|----------|-------------|----------|
| `css:S4658` | Avoid !important | MAJOR |
| `css:S4670` | Vendor prefixes should be consistent | MINOR |
| `css:S4654` | Shorthand properties should be used | INFO |

---

## Quality Gate Customization

Edit `sonar-quality-gate.json` to define project-specific thresholds:

```json
{
  "name": "Strict Micro-Frontend Gate",
  "conditions": [
    {
      "metric": "new_coverage",
      "op": "LT",
      "error": "85"
    },
    {
      "metric": "new_duplicated_lines_density",
      "op": "GT",
      "error": "2"
    },
    {
      "metric": "new_code_smells",
      "op": "GT",
      "error": "5"
    },
    {
      "metric": "new_bugs",
      "op": "GT",
      "error": "0"
    },
    {
      "metric": "new_vulnerabilities",
      "op": "GT",
      "error": "0"
    }
  ]
}
```

---

## Best Practices

### 1. Start with Default, Customize Gradually
- Begin with "Sonar way" profiles
- Clone and customize based on team feedback
- Don't activate all rules at once

### 2. Team Agreement
- Discuss rule changes with team
- Document why rules are activated/deactivated
- Version control your configurations

### 3. CI/CD Integration
- Fail builds on Quality Gate failures
- Use rule profiles consistently across environments
- Keep local and CI configurations synchronized

### 4. Regular Reviews
- Review rule effectiveness quarterly
- Adjust severity based on actual issues found
- Remove rules that generate false positives

### 5. Language-Specific Best Practices

**TypeScript/JavaScript:**
- Focus on complexity and maintainability rules
- Enable strict null checking rules
- Enforce naming conventions

**HTML:**
- Prioritize accessibility rules
- Enforce semantic HTML
- Security-related rules (XSS prevention)

**CSS:**
- Avoid specificity issues
- Consistent naming conventions
- Performance-related rules

---

## Quick Start Examples

### Example 1: Strict Security Profile

```powershell
# Create profile
.\scripts\sonar-manage-rules.ps1 -Action create-profile -Language ts -ProfileName "Security-Strict"

# Activate all security rules
# (Use Web UI to bulk-activate rules tagged with "security")
```

### Example 2: Relaxed Development Profile

```properties
# sonar-dev-profile.properties
# Disable console warnings
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S2228
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.ts

# Allow TODOs
sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S1135
sonar.issue.ignore.multicriteria.e2.resourceKey=**/*.ts
```

### Example 3: CI/CD Profile (Strict)

```properties
# Fail on any new bugs
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300

# Strict thresholds
sonar.issue.enforce.multicriteria=s1,s2,s3
sonar.issue.enforce.multicriteria.s1.ruleKey=typescript:S1134
sonar.issue.enforce.multicriteria.s1.severity=BLOCKER
```

---

## Troubleshooting

### Issue: Rules not applying
**Solution:** Ensure you've set the custom profile as default for your project

### Issue: Too many false positives
**Solution:** Use file/directory exclusions in sonar-project.properties

### Issue: ESLint rules not showing in SonarQube
**Solution:** Generate ESLint JSON report and configure `sonar.eslint.reportPaths`

---

## Resources

- **SonarQube Documentation**: https://docs.sonarqube.org/latest/
- **JavaScript/TypeScript Rules**: http://localhost:9001/coding_rules?languages=js,ts
- **HTML Rules**: http://localhost:9001/coding_rules?languages=web
- **CSS Rules**: http://localhost:9001/coding_rules?languages=css
- **Quality Profiles**: http://localhost:9001/profiles
- **Your Project Dashboard**: http://localhost:9001/dashboard?id=micro-frontend-single-spa

---

## Next Steps

1. ✅ Review current quality profiles via Web UI
2. ✅ Run the management script to explore available rules
3. ✅ Create custom profiles for each language
4. ✅ Configure ESLint integration
5. ✅ Update Quality Gate thresholds
6. ✅ Document team decisions in version control
7. ✅ Integrate with CI/CD pipeline

---

**Last Updated**: October 11, 2025  
**SonarQube Version**: 10.6.0.92116
