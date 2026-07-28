### deps — install once, reused by dev and the prod builder
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

### dev — hot-reloading dev server, source mounted as a volume by docker-compose
FROM node:22-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prisma.config.ts requires DATABASE_URL to be set just to load, even though
# `prisma generate` itself never connects to the database.
ARG DATABASE_URL=mysql://user:pass@localhost:3306/db
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

### builder — production build (standalone output)
FROM node:22-alpine AS builder
WORKDIR /app
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so this
# needs to be a build arg, not just a runtime env var on the runner stage.
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
# prisma.config.ts requires DATABASE_URL to be set just to load, even though
# `prisma generate` itself never connects to the database.
ARG DATABASE_URL=mysql://user:pass@localhost:3306/db
ENV DATABASE_URL=$DATABASE_URL
# src/lib/prisma.ts builds a connection pool config at module load, and
# `next build` imports API routes to collect page data — so these need to be
# set too, even though no connection is actually made at build time.
ARG MYSQL_HOST=localhost
ARG MYSQL_PORT=3306
ARG MYSQL_USER=user
ARG MYSQL_PASSWORD=pass
ARG MYSQL_DATABASE=db
ENV MYSQL_HOST=$MYSQL_HOST
ENV MYSQL_PORT=$MYSQL_PORT
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_DATABASE=$MYSQL_DATABASE
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

### runner — minimal prod image, only the standalone server + static assets
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
