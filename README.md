# Single-SPA Micro-Frontend Demo

A comprehensive Single-SPA implementation showcasing micro-frontend architecture with React, Vue, and Angular applications. **Production-ready with enterprise-grade services - $0/month cost.**

## � Priority: Reducing MFE Coupling (NEW!)

**Current Coupling Score:** 73/100 (Loosely Coupled) | **Target:** 90/100 (Production-Ready)

**Quick Start:**
- 📊 [Full Coupling Analysis](./docs/03-implementation/DECOUPLING_SUMMARY.md) - Understand the current state
- 📋 [Priority Work Plan](./docs/03-implementation/DECOUPLING_PRIORITY.md) - Detailed implementation guide
- ✅ [Task Checklist](./docs/03-implementation/DECOUPLING_CHECKLIST.md) - Track your progress

**This Week (7-9 hours):**
1. ✅ Add shared library versioning (2-3h)
2. ✅ Add per-MFE error boundaries (3-4h)  
3. ✅ Add API contract validation (2-3h)

---

## �🚀 Premium Services Integration ✅

**Status**: 3/6 services fully integrated and tested (October 2025)

### **✅ Active Services** (Working Now)
| Service | Status | Purpose | Free Tier |
|---------|--------|---------|-----------|
| **Supabase** | ✅ Working | Database + Auth + Real-time | 500MB DB, 50K MAU |
| **Sentry** | ✅ Working | Error Tracking + Performance | 5K errors/month |
| **PostHog** | ✅ Working | Analytics + Feature Flags | 1M events/month |
| **Grafana Cloud** | 🔧 Ready | Metrics + Observability | 10K metrics, 50GB logs |
| **Resend** | 🔧 Ready | Transactional Emails | 100 emails/day |
| **Cloudflare** | 🔧 Ready | CDN + Security | Unlimited bandwidth |

### **📚 Documentation**
- 🎯 **[Premium Services Integration](./docs/04-features/premium-services-integration.md)** - Complete setup guide
- � **[Current Status](./docs/03-implementation/current-status.md)** - Project progress and achievements
- 🚀 **[Next Steps](./docs/03-implementation/next-steps.md)** - Actionable tasks with code examples
- 📖 **[Full Documentation Index](./docs/INDEX.md)** - Browse all guides

### **🎓 What You Get**
- ✅ **Authentication**: Email/password + OAuth (Google, GitHub) via Supabase
- ✅ **Error Tracking**: Automatic error capture + performance monitoring via Sentry
- ✅ **Analytics**: Event tracking + user identification + feature flags via PostHog
- ✅ **Zero Cost**: All services on generous free tiers
- ✅ **Production Ready**: 2.2MB bundle with all dependencies included

### **🎓 Try It Now**

#### Windows PowerShell (Recommended)
```powershell
# One command to start everything
.\start-all.ps1

# Or manually start each service (see docs/01-getting-started/start-all-services.md)
```

#### macOS/Linux or Manual Start
```bash
# 1. Build shared library (first time only)
cd packages/shared-library && npm run build && cd ../..

# 2. Start services in separate terminals
cd packages/shared-library && npx serve dist -p 9000 --cors  # Terminal 1
cd packages/shell-app && npm start                            # Terminal 2
cd packages/react-mfe && npm start                            # Terminal 3
cd packages/vue-mfe && npm start                              # Terminal 4
cd packages/angular-mfe && npm start                          # Terminal 5

# Open http://localhost:9999 in browser
```

#### Test Premium Services
```javascript
// Open browser console at http://localhost:9999
window.sharedServices.getCurrentUser()        // Check Supabase auth
window.sharedServices.captureError(new Error('test'))  // Send to Sentry
window.sharedServices.trackEvent('test')      // Track in PostHog
```

**📖 Detailed Instructions**: See [Start All Services Guide](./docs/01-getting-started/start-all-services.md)  
**❌ Stop All Services**: Run `.\stop-all.ps1` (Windows)

**Next**: Build login UI → See [Next Steps Guide](./docs/03-implementation/next-steps.md)

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

📚 **[View Phase 1 Documentation](./docs/INDEX.md)**

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

## 📚 Documentation

### Quick Links
- 📊 **[Current Status](./STATUS.md)** - Project progress and next steps
- 🚀 **[Start Services](./START_ALL_SERVICES.md)** - How to run all MFEs
- 🎯 **[Next Steps](./NEXT_STEPS.md)** - What to build next (Phase 2)
- 🗺️ **[Implementation Roadmap](./docs/03-implementation/roadmap.md)** - Complete 6-phase plan
- 📋 **[Implementation Checklist](./docs/03-implementation/checklist.md)** - Track progress

### Documentation Structure

#### 🏗️ Architecture
- **[Architecture Overview](./docs/02-architecture/architecture-diagram.md)** - System design
- **[Navigation Guide](./docs/02-architecture/navigation.md)** - Routing strategies
- **[Communication](./docs/02-architecture/communication.md)** - Inter-MFE messaging

#### 📝 Implementation Phases
- **[Phase 1: Foundation](./docs/03-implementation/phase1/)** - Error handling, auth, performance (47% complete)
  - [Authentication](./docs/03-implementation/phase1/PHASE1_AUTHENTICATION.md)
  - [Error Boundaries](./docs/03-implementation/phase1/PHASE1_ERROR_BOUNDARIES.md)
  - [Performance Monitoring](./docs/03-implementation/phase1/PHASE1_PERFORMANCE_MONITORING.md)
  - [Summary](./docs/03-implementation/phase1/PHASE1_SUMMARY.md)
- **[Phase 2: Security](./docs/03-implementation/phase2/)** - OAuth, security hardening (Ready to start)

#### 🎯 Features & Setup
- **[Premium Services](./PREMIUM_SERVICES_INTEGRATION.md)** - Supabase, Sentry, PostHog setup
- **[Credentials Guide](./CREDENTIAL_COLLECTION_GUIDE.md)** - Environment variables
- **[Docker Setup](./DOCKER_SETUP.md)** - Container configuration
- **[Vercel Deployment](./VERCEL_DEPLOYMENT.md)** - Production deployment
- **[SonarQube Setup](./SONARQUBE_SETUP.md)** - Code quality

#### 📖 Reference
- **[Development Guidelines](./.amazonq/rules/memory-bank/guidelines.md)** - Coding standards
- **[Tech Stack](./.amazonq/rules/memory-bank/tech.md)** - Technology details

### 📦 Historical Documentation
Archived session logs and fix documentation: **[archive/](./archive/)** (17 files)

---

## 🤝 Contributing

We welcome contributions! Please see our documentation structure in `docs/` for guidelines.

## 📄 License

MIT