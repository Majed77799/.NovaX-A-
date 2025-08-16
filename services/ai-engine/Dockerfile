# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY services/ai-engine/package.json services/ai-engine/
COPY libs/common/package.json libs/common/
RUN npm ci --ignore-scripts

FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci --ignore-scripts && npm run -w @novax/common build && npm run -w @novax/ai-engine build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/ai-engine/dist ./dist
COPY --from=build /app/services/ai-engine/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete devDependencies || true
CMD ["node", "dist/main.js"]