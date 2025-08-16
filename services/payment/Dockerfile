# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci --ignore-scripts && npm run -w @novax/payment build
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/services/payment/dist ./dist
COPY --from=build /app/services/payment/package.json ./package.json
CMD ["node", "dist/main.js"]