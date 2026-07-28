# In frontend project
# Dockerfile

# Simple base image for Next.js app
FROM node:20-alpine

# App directory inside container
WORKDIR /app

# Accept API URL at build time so Next.js can reach the API during static generation.
# Pass with: docker build --build-arg NEXT_PUBLIC_API_BASE_URL=http://api:3001
ARG NEXT_PUBLIC_API_BASE_URL=http://api:3001
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Install dependencies first (better Docker layer cache)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js for production
RUN npm run build

# Run app in production mode
ENV NODE_ENV=production
ENV PORT=3000

# Next.js app port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "run", "start"]

