# In backend project
# Dockerfile

# Simple base image for Node.js apps
FROM node:20-alpine

# App directory inside container
WORKDIR /app

# Install dependencies first (better Docker cache)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Production mode
ENV NODE_ENV=production

# App port (matches backend/src/configs/constant.ts default)
ENV PORT=3001

# App port
EXPOSE 3001

# Start Express app (compiled JavaScript)
CMD ["node", "dist/utils/app.js"]

