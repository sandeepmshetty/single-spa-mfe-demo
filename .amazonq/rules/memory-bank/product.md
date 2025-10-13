# Product Overview

## Project Purpose
Single-SPA Micro-Frontend Demo is a comprehensive implementation showcasing micro-frontend architecture using Single-SPA framework. It demonstrates how to build, orchestrate, and deploy independent frontend applications (React, Vue, Angular) that work together as a unified system while maintaining independent development, testing, and deployment lifecycles.

## Value Proposition
- **Independent Deployment**: Each micro-frontend can be deployed separately to Vercel without affecting others
- **Framework Agnostic**: Demonstrates integration of React, Vue, and Angular in a single application
- **Scalable Architecture**: Teams can work independently on different micro-frontends
- **Production Ready**: Includes SonarQube integration, testing infrastructure, and CI/CD workflows
- **Shared Resources**: Common utilities and communication layer through shared-library package

## Key Features

### Architecture Components
- **Shell App (Port 9000)**: Single-SPA root configuration that orchestrates all micro-frontends and handles routing
- **React MFE (Port 3001)**: User management and authentication features
- **Vue MFE (Port 3002)**: Product catalog and shopping functionality
- **Angular MFE (Port 3003)**: Analytics dashboard and reporting
- **Shared Library (Port 3004)**: Common utilities, components, and cross-MFE communication layer

### Development Capabilities
- Monorepo workspace structure with npm workspaces
- Concurrent development mode for all micro-frontends
- Integration testing with Jest for cross-MFE communication
- Contract testing to ensure MFE compatibility
- SonarQube integration for code quality analysis
- Docker-based SonarQube setup for local quality gates

### Deployment Features
- Independent Vercel deployment for each micro-frontend
- Environment-based configuration (development/production)
- PowerShell automation scripts for deployment workflows
- Preview deployments for testing before production
- GitHub Actions workflow for CI/CD

## Target Users

### Development Teams
- Frontend teams building large-scale applications requiring independent deployment
- Organizations transitioning from monolithic to micro-frontend architecture
- Teams working with multiple frontend frameworks

### Use Cases
- **Enterprise Applications**: Large applications with multiple teams working on different features
- **Gradual Migration**: Migrating legacy applications by replacing parts incrementally
- **Multi-Framework Projects**: Projects requiring different frameworks for different features
- **Independent Scaling**: Applications where different features need independent scaling and deployment
