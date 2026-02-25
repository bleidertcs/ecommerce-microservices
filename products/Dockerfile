# Multi-stage build for optimal image size
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
ENV CI=true

# Build the source code
FROM base AS builder
RUN apk add --no-cache wget openssl
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies (no frozen lockfile to allow platform adjustments)
RUN pnpm install --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma client and build application
RUN pnpm prisma:generate
RUN pnpm proto:generate
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache wget openssl
WORKDIR /app

ENV NODE_ENV=production
ENV APP_NAME=products-service

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application and dependencies from builder
COPY --from=builder /app ./

# Prune development dependencies (Skipped for debugging)
# RUN pnpm config set confirm-reinstall false
# RUN pnpm prune --prod --ignore-scripts

# Set correct permissions
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose ports for HTTP and gRPC
EXPOSE 9002 50052

CMD ["node", "dist/main.js"]
