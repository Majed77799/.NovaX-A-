# NovaX Platform

A microservices platform for AI-driven product research, generation, marketplace commerce, payments, globalization, security, community, and analytics.

## Goals
- Microservices for flexibility and scale
- Clear separation of concerns
- Containerized with Docker, orchestrated by Kubernetes

## Services
- AI Engine: Product Researcher, Product Generator, Marketing Copilot (async jobs via Redis + BullMQ)
- Marketplace: Listings, purchases, freebies funnel, affiliates (REST + GraphQL)
- Payment: Stripe, PayPal, Wise, Crypto (extensible; optional Web3)
- Globalization: Localization AI (20+ languages), regional optimization
- Security: Auth (JWT/OAuth/Social), anti-piracy watermarking, threat monitoring
- Community: Gamification, social layer, referrals/affiliates
- Analytics: Sales, funnels, retention, AI-driven optimization

## Tech Stack
- Frontend: Next.js (web), React Native/Expo (mobile)
- Backend: Node.js (NestJS, TypeScript)
- Data: PostgreSQL, MongoDB, Redis (cache/queue)
- Infra: Docker, Kubernetes (AWS/GCP/Azure)
- Observability: Prometheus, Grafana, ELK

## Development
- Each service runs independently with its own API and Dockerfile
- Kubernetes manifests in `infra/k8s`
- Local dev via Docker Compose: `docker-compose.dev.yml`

## Quickstart
1. Install Node 20+
2. Install dependencies: `npm install`
3. Run all services in dev: `npm run dev`

## Deployment
- Build images per service; deploy with kustomize overlays under `infra/k8s/overlays/{dev,prod}`

## Security
- JWT-based auth, OAuth providers, rate limiting at gateway/ingress
- Secret management via K8s Secrets or external secret stores

## Observability
- Liveness/readiness probes
- Structured logs; metrics endpoints for Prometheus scraping