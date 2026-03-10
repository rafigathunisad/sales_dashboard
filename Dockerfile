# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ---- Stage 2: Build the application ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 3: Production runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy package.json so npx resolves local prisma 6.x instead of downloading 7.x
COPY --from=builder /app/package.json ./package.json

# Copy Prisma schema + migration files (needed for prisma migrate at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy full node_modules (prisma CLI has many transitive deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy the standalone build output (after node_modules so standalone's server.js lands correctly)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma db seed && npx prisma migrate deploy && node server.js"]
