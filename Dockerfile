# syntax=docker/dockerfile:1

# ---- deps: install node_modules + Playwright's Chromium browser ----
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: compile the Next.js app ----
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env vars (Stripe/Supabase publishable keys etc.) are safe to
# pass here; never bake secret keys into the image.
RUN npm run build

# ---- runtime: lean image, Chromium + standalone server only ----
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Next.js standalone output already includes a minimal node_modules subset
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
