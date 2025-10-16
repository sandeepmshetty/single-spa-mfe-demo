# 🎯 Quick Command Reference

## Step-by-Step Commands

### **1. Install Packages**
```powershell
# Install premium tier dependencies
npm install

# Verify installation
npm run setup:verify
```

### **2. Read Next Steps**
```powershell
# View detailed guide
npm run setup:help

# Or open the file
code YOUR_NEXT_STEPS.md
```

### **3. Create Environment File**
```powershell
# Create .env.local from template
Copy-Item .env.example .env.local

# Edit with your credentials
notepad .env.local
```

### **4. Verify Setup**
```powershell
# Check if everything is configured
npm run setup:verify
```

### **5. Start Development**
```powershell
# Build shared library first
cd packages/shared-library
npm run build
cd ..\..

# Start all MFEs
npm run dev
```

### **6. Open Your App**
```powershell
# Shell App will be at:
start http://localhost:9000
```

---

## Service Dashboard Links

Quick access to all your monitoring dashboards:

```powershell
# Open Sentry (errors)
npm run monitor:errors

# Open PostHog (analytics)
npm run monitor:analytics

# Open Grafana (metrics)
npm run monitor:metrics
```

Or manually:
- 🐛 **Sentry**: https://sentry.io/organizations/YOUR_ORG/issues/
- 📊 **PostHog**: https://app.posthog.com/dashboard
- 📈 **Grafana**: https://YOUR_NAME.grafana.net
- 🗄️ **Supabase**: https://supabase.com/dashboard/project/YOUR_PROJECT
- 🚀 **Vercel**: https://vercel.com/dashboard

---

## Common Commands

```powershell
# Development
npm run dev                    # Start all MFEs
npm run dev:shell              # Start shell only
npm run dev:react              # Start React MFE
npm run dev:vue                # Start Vue MFE
npm run dev:angular            # Start Angular MFE

# Building
npm run build                  # Build all
npm run build:shared           # Build shared library

# Testing
npm test                       # Run all tests
npm run lint                   # Lint code

# Deployment (after Vercel setup)
vercel                         # Deploy preview
vercel --prod                  # Deploy production

# Verification
npm run setup:verify           # Check setup
```

---

## Troubleshooting Commands

```powershell
# If packages not installing:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# If build fails:
cd packages/shared-library
Remove-Item -Recurse -Force dist
npm run build

# Check for errors:
npm run lint
npm run setup:verify

# View environment:
Get-Content .env.local
```

---

## What to Do Now?

**Right now, run this command:**

```powershell
npm install
```

**Then run:**

```powershell
npm run setup:verify
```

**This will tell you exactly what's missing and what to do next!**

---

## Need Help?

1. **Read**: `YOUR_NEXT_STEPS.md` for detailed guide
2. **Run**: `npm run setup:verify` to check status
3. **Ask**: Tell me what error you're getting
4. **Check**: Browser console at http://localhost:9000

---

**Start here: `npm install` then `npm run setup:verify`** 🚀
