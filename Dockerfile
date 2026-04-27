# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# 1. Install Linux build tools (Crucial for packages that need to compile)
RUN apt-get update && apt-get install -y python3 make g++

# 2. Install the absolute latest pnpm
RUN npm install -g pnpm@latest

# 3. Copy ONLY package files first
COPY package.json pnpm-lock.yaml* ./

# 4. Install all dependencies (bypassing strict lockfile errors)
RUN pnpm install --no-frozen-lockfile

# 5. Copy the rest of your code
COPY . .

# 6. Build the application
RUN pnpm build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install pnpm again for production
RUN npm install -g pnpm@latest

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install ONLY production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# If you have a server folder that gets built, uncomment the line below:
# COPY --from=builder /app/server ./server

# Expose the port dynamically for Google Cloud Run
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]