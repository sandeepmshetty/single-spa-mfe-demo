# Single-SPA Micro-Frontend Demo

A comprehensive Single-SPA implementation showcasing micro-frontend architecture with React, Vue, and Angular applications deployed separately on Vercel.

## Architecture Overview

This project demonstrates a micro-frontend architecture using Single-SPA where:
- **Shell App**: Orchestrates all micro-frontends and handles routing (Port: 9000)
- **React MFE**: User management and authentication features (Port: 3001)
- **Vue MFE**: Product catalog and shopping functionality (Port: 3002)
- **Angular MFE**: Analytics dashboard and reporting (Port: 3003)
- **Shared Library**: Common utilities, components, and communication layer (Port: 3004)

## Current Directory
```
C:\Users\sande\Repo\Micro-Frontend\Micro-Frontend-Single-SPA\
```

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
- npm or yarn
- Git

### Development Setup

1. **Install dependencies:**
   ```powershell
   npm install
   npm run install:all
   ```

2. **Start all applications:**
   ```powershell
   npm run dev
   ```

3. **Access the applications:**
   - Shell App: http://localhost:9000
   - React MFE: http://localhost:3001  
   - Vue MFE: http://localhost:3002
   - Angular MFE: http://localhost:3003
   - Shared Library: http://localhost:3004

## Deployment on Vercel

Each micro-frontend will be deployed independently:
- **Shell**: `shell.your-domain.com`
- **React MFE**: `react-mfe.your-domain.com`
- **Vue MFE**: `vue-mfe.your-domain.com`  
- **Angular MFE**: `angular-mfe.your-domain.com`
- **Shared Library**: `shared.your-domain.com`