# services/api

Env vars:
- PORT=4000
- DATABASE_URL=./data/app.db
- STRIPE_SECRET=
- STRIPE_WEBHOOK_SECRET=
- PUBLIC_BASE_URL=http://localhost:4000
- ADMIN_JWT_SECRET=change_me
- GUMROAD_PRODUCT_MAP={"tpl_1":"https://gum.co/your-product"}
- REMOTE_TEMPLATES_URL=https://example.com/templates.json

Endpoints:
- POST /api/billing/checkout { templateId, email }
- POST /api/billing/webhook (Stripe)
- GET /api/templates/list
- POST /api/templates/purchase
- GET /api/templates/download?templateId=&email=
- GET /api/templates/mine?email=
- POST /api/admin/templates/upsert (Authorization: Bearer <admin-jwt>)
- POST /api/admin/templates/remove (Authorization: Bearer <admin-jwt>)

Run:

