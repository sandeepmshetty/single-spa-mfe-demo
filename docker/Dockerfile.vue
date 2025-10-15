FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY packages/vue-mfe/package*.json ./
RUN npm install

# Copy source code
COPY packages/vue-mfe .

EXPOSE 8082

CMD ["npm", "start"]