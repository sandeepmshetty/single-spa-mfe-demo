# Single-SPA Micro-Frontend Demo

A comprehensive Single-SPA implementation showcasing micro-frontend architecture with React, Vue, and Angular applications deployed separately on Vercel.

## Architecture Overview

This project demonstrates a micro-frontend architecture using Single-SPA where:
- **Shell App**: Orchestrates all micro-frontends and handles routing (Port: 9000)
- **React MFE**: User management and authentication features (Port: 3001)
- **Vue MFE**: Product catalog and shopping functionality (Port: 3002)
- **Angular MFE**: Analytics dashboard and reporting (Port: 3003)
- **Shared Library**: Common utilities, components, and communication layer (Port: 3004)

## Repository
- **GitHub**: https://github.com/sandeepmshetty/single-spa-mfe-demo
- **Vercel**: https://vercel.com/sandeep-shettys-projects

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
# Development
npm run dev                    # Start all MFEs
npm run dev:shell              # Start shell only

# Building
npm run build                  # Build all packages
npm run build:shell            # Build shell only

# Testing
npm test                       # Run all tests
npm run test:integration       # Integration tests

# Deployment
npm run deploy:all             # Deploy all to production
npm run deploy:preview         # Deploy to preview

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