FROM node:18-alpine

# Copy scripts to parent directory (won't be overridden by volume mount)
COPY scripts /scripts

WORKDIR /app

# Install dependencies
COPY packages/vue-mfe/package*.json ./
RUN npm install

# Copy source code
COPY packages/vue-mfe .

EXPOSE 8082

CMD ["npm", "start"]