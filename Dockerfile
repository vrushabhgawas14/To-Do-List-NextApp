# Multi-stage production Dockerfile for Next.js app

# Base image with Node 20
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Disable Next.js telemetry in containers
ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies
RUN apk add --no-cache libc6-compat

# --- Dependencies stage ---
FROM base AS deps

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install all dependencies (including dev) for building
RUN npm ci

# --- Builder stage ---
FROM base AS builder

ENV NODE_ENV=production

# Reuse node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy the full project source
COPY . .

# Build the Next.js app
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install only production dependencies for a smaller runtime image
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the built Next.js app and required assets from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy Next.js config (used by the runtime for certain features)
# COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the Next.js port
EXPOSE 3000

# Use npm start to run the production server
CMD ["npm", "start"]
