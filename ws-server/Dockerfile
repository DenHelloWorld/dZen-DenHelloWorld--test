### dev — hot-reloading via tsx watch, source mounted as a volume by docker-compose
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 4001
CMD ["npm", "run", "dev"]

### builder — compile TypeScript to dist/
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

### runner — minimal prod image, only the compiled output + prod deps
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 wsuser
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=wsuser:nodejs /app/dist ./dist
USER wsuser
EXPOSE 4001
CMD ["node", "dist/index.js"]
