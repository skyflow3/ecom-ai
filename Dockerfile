# WHY: Standalone Alpine build for Hetzner/Coolify — target < 200MB
# Multi-stage: deps → build → production
# standalone output from Next.js means we only copy the server bundle.

# ── Stage 1: Install ALL dependencies (including dev for build) ──
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci && \
    npm cache clean --force

# ── Stage 2: Build Next.js ──
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# WHY: Ensure public/ exists — Next.js may not create it if empty
RUN mkdir -p /app/public

# WHY: Next.js needs these at build time for client-side code
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN npm run build

# ── Stage 3: Production runner ──
FROM node:22-alpine AS runner
WORKDIR /app

# WHY: Node 22 prefers IPv6 — force IPv4 first so healthcheck (wget/curl on 127.0.0.1) works
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# WHY: curl for Coolify healthcheck, net-tools for debugging
RUN apk add --no-cache curl ca-certificates

# WHY: Non-root user for security (Coolify requirement)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone Next.js server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# WHY: Include migration SQL for /api/admin/setup endpoint
COPY --from=builder /app/drizzle ./drizzle

USER nextjs
EXPOSE 3000

# WHY: Docker overrides ENV HOSTNAME with container ID at runtime,
#      so we force HOSTNAME=0.0.0.0 in CMD to make Next.js bind to all interfaces.
#      NODE_OPTIONS forces IPv4 to match Coolify's wget/curl healthcheck.
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
