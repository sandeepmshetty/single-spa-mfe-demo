# Single-SPA Micro-Frontend Demo

A comprehensive Single-SPA implementation showcasing micro-frontend architecture with React, Vue, and Angular applications. **Production-ready with best-in-class free tools - $0/month.**

## 🚀 Best Free Developer Tools Stack!

This project uses **premium free tier tools** - the same stack used by YC startups:

### **🏆 Premium Free Tier (Recommended)**
- ✅ **Vercel** (Hosting) - 100GB/month, serverless functions
- ✅ **Supabase** (Database + Auth) - 500MB DB, 50K MAU, real-time
- ✅ **Sentry** (Error Tracking) - 5K errors/month, releases, source maps
- ✅ **PostHog** (Analytics + Flags) - 1M events/month, session replay
- ✅ **Grafana Cloud** (Monitoring) - 10K metrics, 50GB logs
- ✅ **Cloudflare** (CDN + DDoS) - Unlimited bandwidth
- ✅ **GitHub Actions** (CI/CD) - 2000 minutes/month

**👉 [Premium Setup Guide](./PREMIUM_SETUP_GUIDE.md)** ⭐ **RECOMMENDED**

### **🔧 Alternative: Open Source Stack**
- ✅ **Keycloak** (Auth), **GlitchTip** (Errors), **PostgreSQL** (DB)
- ✅ **Grafana + Prometheus** (Monitoring), **Unleash** (Flags)
- ✅ Self-hosted on Oracle Cloud Free Tier or similar

**👉 [Open Source Guide](./FREE_STACK_QUICKSTART.md)**

**Both options cost $0/month!** Choose based on your needs.

---

## Architecture Overview

This project demonstrates a micro-frontend architecture using Single-SPA where:
- **Shell App**: Orchestrates all micro-frontends and handles routing (Port: 9000)
- **React MFE**: User management and authentication features (Port: 3001)
- **Vue MFE**: Product catalog and shopping functionality (Port: 3002)
- **Angular MFE**: Analytics dashboard and reporting (Port: 3003)
- **Shared Library**: Common utilities, components, and communication layer (Port: 3004)

## Repository
- **GitHub**: https://github.com/sandeepmshetty/single-spa-mfe-demo
- **Infrastructure**: 100% Open Source (Keycloak, GlitchTip, Grafana, PostgreSQL)
- **Hosting**: Cloudflare Pages (Free Tier)

## Project Structure

```
single-spa-mfe-demo/
├── packages/
│   ├── shell-app/           # Single-SPA root configuration
│   ├── react-mfe/           # React micro-frontend
│   ├── vue-mfe/             # Vue micro-frontend  
│   ├── angular-mfe/         # Angular micro-frontend
│   └── shared-library/      # Shared utilities and components
├── docs/
├── .github/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9.0.0+
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandeepmshetty/single-spa-mfe-demo.git
   cd single-spa-mfe-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run install:all
   ```

3. **Start all applications concurrently:**
   ```bash
   npm run dev
   ```
   This starts all 5 micro-frontends simultaneously.

4. **Access the applications:**
   - **Shell App**: http://localhost:9000 (main entry point)
   - React MFE: http://localhost:3001  
   - Vue MFE: http://localhost:3002
   - Angular MFE: http://localhost:3003
   - Shared Library: http://localhost:3004

### Individual Development

Run individual micro-frontends:
```bash
npm run dev:shell      # Shell app only
npm run dev:react      # React MFE only
npm run dev:vue        # Vue MFE only
npm run dev:angular    # Angular MFE only
npm run dev:shared     # Shared library only
```

## Deployment on Vercel

Each micro-frontend is deployed independently:
- **Shell App**: https://mfe-shell-app.vercel.app
- **React MFE**: https://react-mfe-tau.vercel.app
- **Vue MFE**: https://vue-mfe.vercel.app
- **Angular MFE**: https://angular-mfe-indol.vercel.app
- **Shared Library**: https://shared-library.vercel.app

### Live Demo
Access the application at: **https://mfe-shell-app.vercel.app**

### Deployment Process

**Deploy all MFEs:**
```bash
npm run deploy:all
```

**Deploy individual MFE:**
```bash
cd packages/shell-app
npm run build
vercel --prod
```

**Important:** After deploying MFEs, update production URLs in:
- `packages/shell-app/src/config.ts`
- `packages/shell-app/src/index.html`

Then redeploy the shell-app.

## Features

### Core Architecture
- ✅ **Framework Agnostic**: React, Vue, and Angular working together
- ✅ **Independent Deployment**: Each MFE deployed separately on Vercel
- ✅ **Shared Services**: Common utilities via shared-library
- ✅ **Event-Driven Communication**: Cross-MFE messaging with event bus
- ✅ **TypeScript**: Full type safety across all packages
- ✅ **Monorepo**: npm workspaces for efficient development
- ✅ **Hot Reload**: Fast development with webpack dev servers

### Phase 1: Standard MFE Architecture (47% Complete)
- ✅ **Error Boundaries**: Centralized error handling with fallback UIs
- ✅ **Authentication**: JWT token management with RBAC
- ✅ **Performance Monitoring**: Core Web Vitals tracking
- ⏳ **Module Federation**: Planned migration from SystemJS

📚 **[View Phase 1 Documentation](./docs/README.md)**

## Technology Stack

- **Orchestration**: Single-SPA 6.x
- **Module Loading**: SystemJS 6.x
- **React**: 18.x with TypeScript
- **Vue**: 3.x with Composition API
- **Angular**: 17.x with RxJS
- **Build**: Webpack 5.x, Angular CLI
- **Deployment**: Vercel
- **Package Manager**: npm workspaces

## Available Scripts

```bash
# ═══════════════════════════════════════════════════════════
# 🆓 Free Infrastructure
# ═══════════════════════════════════════════════════════════
npm run free-stack:start       # Start all free services (Docker)
npm run free-stack:stop        # Stop all services
npm run free-stack:logs        # View logs
npm run free-stack:clean       # Clean up (remove volumes)

# ═══════════════════════════════════════════════════════════
# 🚀 Development
# ═══════════════════════════════════════════════════════════
npm run dev                    # Start all MFEs
npm run dev:shell              # Start shell only
npm run dev:react              # Start React MFE only
npm run dev:vue                # Start Vue MFE only
npm run dev:angular            # Start Angular MFE only

# ═══════════════════════════════════════════════════════════
# 🔨 Building
# ═══════════════════════════════════════════════════════════
npm run build                  # Build all packages
npm run build:shell            # Build shell only
npm run build:react            # Build React MFE only
npm run build:vue              # Build Vue MFE only
npm run build:angular          # Build Angular MFE only

# ═══════════════════════════════════════════════════════════
# 🧪 Testing
# ═══════════════════════════════════════════════════════════
npm test                       # Run all tests
npm run test:integration       # Integration tests
npm run test:coverage          # Test coverage

# ═══════════════════════════════════════════════════════════
# ☁️  Deployment (Cloudflare Pages)
# ═══════════════════════════════════════════════════════════
npm run cloudflare:deploy      # Deploy all to production
npm run cloudflare:preview     # Deploy preview version

# ═══════════════════════════════════════════════════════════
# 📊 Code Quality
# ═══════════════════════════════════════════════════════════
npm run sonar:start            # Start SonarQube
npm run sonar:scan             # Run code analysis
npm run lint                   # Lint all packages
```

## 💰 Cost Breakdown

### **Premium Free Tier Stack (Recommended)**

| Service | Traditional Paid | Cost | Premium Free Tier | Value |
|---------|-----------------|------|-------------------|-------|
| Hosting | Vercel Pro | $20/mo | Vercel (Hobby) | $0 |
| Database + Auth | Supabase Pro | $25/mo | Supabase (Free) | $0 |
| Error Tracking | Sentry Team | $26/mo | Sentry (Developer) | $0 |
| Analytics + Flags | PostHog + LaunchDarkly | $60/mo | PostHog (Free) | $0 |
| Monitoring | DataDog | $15/mo | Grafana Cloud (Free) | $0 |
| CDN + Security | Cloudflare Pro | $20/mo | Cloudflare (Free) | $0 |
| CI/CD | CircleCI | $15/mo | GitHub Actions | $0 |
| Email | SendGrid | $10/mo | Resend (Free) | $0 |
| Secrets | 1Password Teams | $8/mo | Doppler (Free) | $0 |
| **TOTAL** | | **$199/mo** | **Premium Free Tier** | **$0/mo** |

**Annual Value: $2,388** 🎉  
**Setup Time: ~1 hour** ⚡

**You get BETTER tools than most paid stacks, completely FREE!**

# Utilities
npm run clean                  # Clean build artifacts
npm run lint                   # Lint all packages
```

## Documentation

- **[Phase 1 Implementation](./docs/README.md)** - Standard MFE architecture components
- **[Quick Start Guide](./docs/PHASE1_QUICK_START.md)** - Integration instructions
- **[Development Guidelines](./.amazonq/rules/memory-bank/guidelines.md)** - Coding standards
- **[Tech Stack](./.amazonq/rules/memory-bank/tech.md)** - Technology details

## License

MIT