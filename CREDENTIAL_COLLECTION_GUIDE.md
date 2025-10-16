# 🔑 Credential Collection Guide

**Time Required**: ~20 minutes  
**Difficulty**: Easy - Just copy-paste from dashboards

---

## Quick Start

1. Open each service dashboard (links below)
2. Find the credentials section
3. Copy values to `.env.local`
4. Run `npm run setup:verify` to check

---

## 1. 🗄️ Supabase (3 values)

**Dashboard**: https://supabase.com/dashboard

### Steps:
1. Click your project
2. Go to **Settings** → **API**
3. Find three values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
# Copy from: "Project URL" section
# Example: https://abcdefghijk.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Copy from: "Project API keys" → "anon public"
# Long JWT token starting with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY=
# Copy from: "Project API keys" → "service_role"
# ⚠️ Keep this secret! Don't commit to git
```

---

## 2. 🐛 Sentry (4 values)

**Dashboard**: https://sentry.io

### Steps:
1. Go to **Settings** → **Projects** → Click your project
2. Click **Client Keys (DSN)**
3. Copy DSN value

```bash
NEXT_PUBLIC_SENTRY_DSN=
# Copy from: DSN section
# Format: https://abc123@o123456.ingest.sentry.io/123456
```

4. Go to **Settings** → **Developer Settings** → **Auth Tokens**
5. Click "Create New Token"
6. Name: "MFE Deploy", Select scope: `project:read`, `project:releases`
7. Copy the token

```bash
SENTRY_AUTH_TOKEN=
# The token you just created

SENTRY_ORG=
# Your organization slug (in URL: sentry.io/organizations/YOUR-ORG-SLUG/)

SENTRY_PROJECT=mfe-shell
# Your project name (create if not exists)
```

---

## 3. 📊 PostHog (2 values)

**Dashboard**: https://app.posthog.com

### Steps:
1. Click **Project Settings** (gear icon)
2. Scroll to "Project Variables"

```bash
NEXT_PUBLIC_POSTHOG_KEY=
# Copy from: "Project API Key"
# Starts with: phc_

NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
# Use this default value (already set)
```

---

## 4. 📈 Grafana Cloud (2 values)

**Dashboard**: https://grafana.com/auth/sign-in

### Steps:
1. Go to **Security** → **API Keys** (or Stack → API Keys)
2. Click "Add API key"
   - Name: "MFE Monitoring"
   - Role: "Editor"
   - Time to live: "1 year"
3. Click "Add" and copy the key

```bash
GRAFANA_CLOUD_API_KEY=
# The API key you just created

GRAFANA_CLOUD_URL=
# Copy from stack URL
# Format: https://YOUR-STACK-NAME.grafana.net
```

---

## 5. ✉️ Resend (1 value)

**Dashboard**: https://resend.com/api-keys

### Steps:
1. Click "Create API Key"
2. Name: "MFE Production"
3. Domain: "All domains" (or specific domain)
4. Copy the key

```bash
RESEND_API_KEY=
# Starts with: re_
```

---

## 6. ☁️ Cloudflare (2 values)

**Dashboard**: https://dash.cloudflare.com

### Steps:
1. Click your profile icon → **My Profile**
2. Go to **API Tokens**
3. Click "Create Token"
4. Use template: "Edit Cloudflare Workers"
5. Copy the token

```bash
CLOUDFLARE_API_TOKEN=
# The token you just created

CLOUDFLARE_ACCOUNT_ID=
# Found in: Right sidebar under "Account ID"
```

---

## Verification Checklist

After collecting all credentials:

```bash
# 1. Create .env.local file
cp .env.local.template .env.local

# 2. Paste all your credentials into .env.local

# 3. Verify setup
npm run setup:verify
```

### Expected Output:
```
✅ .env.local exists
✅ All required variables are set
✅ All npm packages installed
✅ Node modules are present
⚠️  Integration files not found (we'll create these next)

Next steps:
- Integration files will be created automatically
```

---

## Quick Copy Template

Create `.env.local` with this structure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=mfe-shell

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Grafana Cloud
GRAFANA_CLOUD_API_KEY=
GRAFANA_CLOUD_URL=

# Resend
RESEND_API_KEY=

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

---

## Security Reminders

⚠️ **NEVER commit `.env.local` to git**
- Already in `.gitignore`
- Contains sensitive keys

✅ **For team members**:
- Share credentials via secure password manager (1Password, Bitwarden)
- Or use Doppler Secrets (free tier)

✅ **For CI/CD**:
- Add secrets to GitHub Secrets
- Use Vercel Environment Variables

---

## Troubleshooting

### "Can't find API key section"
- Most services: Settings → API or Developer Settings
- Look for: API Keys, Tokens, Credentials

### "Token/Key doesn't work"
- Check if it's correctly copied (no extra spaces)
- Verify the token has correct permissions
- Regenerate if needed

### "Which project to use?"
- Create new projects named: `mfe-shell`, `mfe-react`, etc.
- Or use default project for now

---

## Next Steps

Once credentials are collected:

1. ✅ Install packages: `npm install`
2. ✅ Collect credentials (you're here!)
3. ➡️ **Next**: Create integration code files
4. Test connections
5. Deploy to Vercel

Run this to see what's next:
```bash
npm run setup:help
```
