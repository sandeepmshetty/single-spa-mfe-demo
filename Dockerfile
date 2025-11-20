# Multi-stage Dockerfile for Single-SPA Micro Frontend Demo

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Create workspace structure and copy all package.json files
COPY packages/shell-app/package*.json ./packages/shell-app/
COPY packages/react-mfe/package*.json ./packages/react-mfe/
COPY packages/vue-mfe/package*.json ./packages/vue-mfe/
COPY packages/angular-mfe/package*.json ./packages/angular-mfe/
COPY packages/shared-library/package*.json ./packages/shared-library/

# Copy scripts needed for postinstall
COPY scripts ./scripts

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build all packages
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/packages/shell-app/dist /usr/share/nginx/html/shell
COPY --from=build /app/packages/react-mfe/dist /usr/share/nginx/html/react
COPY --from=build /app/packages/vue-mfe/dist /usr/share/nginx/html/vue
COPY --from=build /app/packages/angular-mfe/dist /usr/share/nginx/html/angular
COPY --from=build /app/packages/shared-library/dist /usr/share/nginx/html/shared

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]