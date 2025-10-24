# Docker Configuration Overview

This project includes 4 Docker Compose files for different deployment scenarios:

## 📋 Configuration Files

### 1. **docker-compose.yml** (Production)
- **Purpose**: Production deployment of the complete application
- **Services**: 
  - Main MFE app (port 8080)
  - Individual MFE development containers
  - Nginx reverse proxy
- **Usage**: `npm run docker:prod`
- **When to use**: Production builds and deployment testing

### 2. **docker-compose.dev.yml** (Development)
- **Purpose**: Local development with hot reload
- **Services**:
  - Shell app (port 9000)
  - React MFE (port 8081)
  - Vue MFE (port 8082)
  - Angular MFE (port 8083)
  - Shared library (port 8084)
- **Features**: Volume mounting, hot reload, development mode
- **Usage**: `npm run docker:dev`
- **When to use**: Docker-based local development

### 3. **docker-compose.free-stack.yml** (Open Source Infrastructure)
- **Purpose**: Complete open-source infrastructure stack
- **Services**:
  - PostgreSQL (database)
  - Keycloak (authentication)
  - GlitchTip (error tracking)
  - Grafana + Loki + Prometheus (monitoring)
  - MinIO (object storage)
  - Redis (caching)
  - Mailhog (email testing)
- **Usage**: `npm run free-stack:start`
- **When to use**: Self-hosted alternative to premium services

### 4. **docker-compose.sonar.yml** (Code Quality)
- **Purpose**: SonarQube for code quality analysis
- **Services**:
  - SonarQube server
  - PostgreSQL for SonarQube
- **Usage**: `npm run sonar:start`
- **When to use**: Code quality checks and security scanning

## 🎯 Common Commands

```powershell
# Production
npm run docker:prod        # Start production stack
npm run docker:down        # Stop containers

# Development
npm run docker:dev         # Start dev stack with hot reload
npm run docker:dev:down    # Stop dev stack

# Free Stack (Open Source Infrastructure)
npm run free-stack:start   # Start all open-source services
npm run free-stack:stop    # Stop free stack
npm run free-stack:logs    # View logs

# SonarQube
npm run sonar:start        # Start SonarQube
npm run sonar:stop         # Stop SonarQube
npm run sonar:analyze      # Run code analysis

# Cleanup
npm run docker:clean       # Remove all containers and volumes
```

## 🔧 Network Configuration

All configurations use the `mfe-network` bridge network for inter-service communication.

## 📦 Volume Management

- Production: Named volumes for persistence
- Development: Bind mounts for hot reload
- Free Stack: Named volumes for all services
- SonarQube: Dedicated volumes for data/extensions/logs

## 🚀 Recommended Workflow

1. **Local Development**: Use `start-all.ps1` (no Docker needed)
2. **Docker Development**: Use `docker-compose.dev.yml`
3. **Infrastructure Testing**: Use `docker-compose.free-stack.yml`
4. **Production Build**: Use `docker-compose.yml`
5. **Code Quality**: Use `docker-compose.sonar.yml`

## 📖 See Also

- [Docker Setup Guide](../docs/05-deployment/docker-setup.md)
- [Open Source Stack](../docs/05-deployment/open-source-stack.md)
- [Infrastructure Setup](../docs/05-deployment/infrastructure-setup.md)
