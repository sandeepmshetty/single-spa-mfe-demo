# Docker Setup for Single-SPA Micro-Frontend Demo

This document explains how to use Docker to run the Single-SPA micro-frontend application.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v3.8 or higher

## Docker Configuration Files

### Production Setup
- `Dockerfile` - Multi-stage build for production deployment
- `docker-compose.yml` - Production configuration with nginx reverse proxy
- `docker/nginx.conf` - Nginx configuration for serving micro-frontends

### Development Setup
- `docker-compose.dev.yml` - Development configuration with hot-reload
- `docker/Dockerfile.*` - Individual Dockerfiles for each micro-frontend

## Available Docker Commands

### Production Build and Run
```bash
# Build and start all services in production mode
npm run docker:prod

# Build services only
npm run docker:build

# Start services (after build)
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs
```

### Development Mode
```bash
# Start all micro-frontends in development mode with hot-reload
npm run docker:dev

# Stop development services
npm run docker:dev:down
```

### Maintenance
```bash
# Clean up containers, volumes, and unused images
npm run docker:clean
```

## Service URLs (Development Mode)

When running in development mode, each micro-frontend runs on its own port:

- **Shell App**: http://localhost:9000
- **React MFE**: http://localhost:8081
- **Vue MFE**: http://localhost:8082
- **Angular MFE**: http://localhost:8083
- **Shared Library**: http://localhost:8084

## Service URLs (Production Mode)

In production mode, all services are served through nginx on port 8080:

- **Main Application**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## Docker Architecture

### Production Architecture
```
nginx (port 8080)
├── / → Shell App
├── /react → React MFE
├── /vue → Vue MFE
├── /angular → Angular MFE
└── /shared → Shared Library
```

### Development Architecture
```
Individual containers with hot-reload:
├── Shell App (port 9000)
├── React MFE (port 8081)
├── Vue MFE (port 8082)
├── Angular MFE (port 8083)
└── Shared Library (port 8084)
```

## Volume Mounts (Development)

In development mode, source code is mounted as volumes for hot-reload:
- `./packages/shell-app:/app`
- `./packages/react-mfe:/app`
- `./packages/vue-mfe:/app`
- `./packages/angular-mfe:/app`
- `./packages/shared-library:/app`

## Networking

All services communicate through a custom Docker network called `mfe-network`, enabling:
- Service discovery between micro-frontends
- Isolated network communication
- CORS handling through nginx configuration

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080-8084 and 9000 are available
2. **Docker not running**: Start Docker Desktop before running commands
3. **Build failures**: Run `npm run docker:clean` to clear cached builds
4. **Permission issues**: Ensure Docker has access to the project directory

### Debugging

```bash
# Check container status
docker ps

# View specific service logs
docker-compose logs [service-name]

# Access container shell
docker exec -it [container-name] /bin/sh

# Rebuild specific service
docker-compose build [service-name]
```

## Health Checks

- Production nginx includes a `/health` endpoint
- All services include health check configurations
- Use `docker ps` to check health status

## Security Considerations

- CORS is enabled for cross-origin requests between micro-frontends
- Security headers are configured in nginx
- Node modules are not included in volume mounts for security
- Multi-stage builds minimize production image size

## Performance Optimizations

- Gzip compression enabled in nginx
- Static asset caching configured
- Multi-stage builds for smaller production images
- Shared base images for faster builds