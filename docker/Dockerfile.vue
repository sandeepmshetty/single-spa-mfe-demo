# Stage 1: Build shared library
FROM node:18-alpine AS shared-builder

WORKDIR /shared

# Copy shared library package files
COPY packages/shared-library/package*.json ./
RUN npm install

# Copy shared library source
COPY packages/shared-library .

# Stage 2: Build Vue MFE
FROM node:18-alpine

# Copy scripts to parent directory (won't be overridden by volume mount)
COPY scripts /scripts

WORKDIR /app

# Copy built shared library from the builder stage
COPY --from=shared-builder /shared /shared-library

# Install dependencies
COPY packages/vue-mfe/package*.json ./
RUN npm install

# Copy source code
COPY packages/vue-mfe .

EXPOSE 8082

CMD ["npm", "start"]