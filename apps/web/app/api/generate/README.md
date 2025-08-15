API: POST /api/generate
Body:
- mode: one of product_description|social_instagram|social_tiktok|social_twitter|ad_facebook|ad_google|email_template
- keywords/product: string
- targetAudience: optional
- useTrends: boolean
- category: optional string (general|fashion|tech)

Streams plain text response tokens.