# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
COPY .npmrc* ./

# Install deps
RUN npm ci --only=production=false --no-audit --no-fund

# Copy source
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files
COPY package.json package-lock.json* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

# Install production dependencies
RUN npm ci --only=production --no-audit --no-fund

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]
