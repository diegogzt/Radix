# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1.2 AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build-time Supabase env vars (baked into client-side bundles)
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY

RUN bun run build

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

# Copy built output from the standalone adapter
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
